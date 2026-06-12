// Normalizes a clearinghouse 270/271 eligibility response (Stedi JSON format)
// into the shape the verification UI renders.
//
// X12 271 reference used below:
//   EB01 benefit codes:  1 = Active Coverage, 6 = Inactive, A = Co-Insurance,
//                        B = Co-Payment, C = Deductible, F = Limitations,
//                        G = Out of Pocket
//   Time qualifiers:     22 = Service Year, 23 = Calendar Year, 25 = Contract,
//                        29 = Remaining
//   Coverage levels:     IND = Individual, FAM = Family
//   Dental service type codes: 35 Dental Care, 23 Diagnostic, 41 Preventive,
//                        25 Restorative, 26 Endodontics, 24 Periodontics,
//                        38 Orthodontics, 39 Prosthodontics, 40 Oral Surgery
//
// Payers vary widely in how much they return on a 271 (many omit remaining
// balances or procedure-level detail), so every extraction is best-effort and
// the UI must tolerate nulls. Per-payer mappings should be validated against
// real responses before production use.

const ENDODONTICS = '26';
const PREVENTIVE = '41';
const DENTAL_SERVICE_TYPES = ['35', '23', '24', '25', '26', '36', '38', '39', '40', '41'];

const TOTAL_TIME_QUALIFIERS = ['23', '22', '25'];
const REMAINING_TIME_QUALIFIER = '29';

const x12DateToIso = (value) => {
    if (typeof value !== 'string' || !/^\d{8}$/.test(value)) return null;
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
};

const toAmount = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const hasServiceType = (benefit, code) =>
    (benefit?.serviceTypeCodes || []).includes(code);

const isDental = (benefit) => {
    const codes = benefit?.serviceTypeCodes || [];
    // Records with no service type are usually plan-level (apply to everything)
    return codes.length === 0 || codes.some((c) => DENTAL_SERVICE_TYPES.includes(c));
};

const findAmount = (benefits, { code, coverageLevel, timeQualifiers }) => {
    for (const benefit of benefits) {
        if (benefit?.code !== code) continue;
        if (!isDental(benefit)) continue;
        if (coverageLevel && (benefit.coverageLevelCode || 'IND') !== coverageLevel) continue;
        if (timeQualifiers && !timeQualifiers.includes(benefit.timeQualifierCode)) continue;
        const amount = toAmount(benefit.benefitAmount);
        if (amount !== null) return amount;
    }
    return null;
};

// EB*A co-insurance percent is the PATIENT's share (e.g. 0.2 = patient pays 20%)
const findCoinsurance = (benefits, serviceType) => {
    for (const benefit of benefits) {
        if (benefit?.code !== 'A') continue;
        if (!hasServiceType(benefit, serviceType)) continue;
        const percent = Number(benefit.benefitPercent);
        if (Number.isFinite(percent) && percent >= 0 && percent <= 1) {
            return {
                coverage: `${Math.round((1 - percent) * 100)}%`,
                patientPortion: `${Math.round(percent * 100)}%`,
            };
        }
    }
    return null;
};

const deriveStatus = (response) => {
    const planStatus = response?.planStatus || [];
    if (planStatus.some((s) => s?.statusCode === '1')) return 'ACTIVE';
    if (planStatus.some((s) => s?.statusCode === '6')) return 'INACTIVE';
    const benefits = response?.benefitsInformation || [];
    if (benefits.some((b) => b?.code === '1')) return 'ACTIVE';
    if (benefits.some((b) => b?.code === '6')) return 'INACTIVE';
    return 'UNKNOWN';
};

const deriveNetworkStatus = (benefits) => {
    const flags = benefits
        .filter(isDental)
        .map((b) => b?.inPlanNetworkIndicatorCode)
        .filter(Boolean);
    if (flags.includes('Y')) return 'IN-NETWORK';
    if (flags.includes('N')) return 'OUT-OF-NETWORK';
    return 'UNKNOWN';
};

export const normalizeEligibility = (response) => {
    const benefits = response?.benefitsInformation || [];
    const planDates = response?.planDateInformation || {};
    const planInfo = response?.planInformation || {};
    const planStatus = response?.planStatus?.[0] || {};

    const deductibleTotal = findAmount(benefits, {
        code: 'C', coverageLevel: 'IND', timeQualifiers: TOTAL_TIME_QUALIFIERS,
    });
    const deductibleRemaining = findAmount(benefits, {
        code: 'C', coverageLevel: 'IND', timeQualifiers: [REMAINING_TIME_QUALIFIER],
    });
    const familyDeductible = findAmount(benefits, {
        code: 'C', coverageLevel: 'FAM', timeQualifiers: TOTAL_TIME_QUALIFIERS,
    });

    // Annual maximums most often arrive as F (Limitations) records with a
    // calendar/service-year amount; remaining balance uses time qualifier 29.
    const maximumTotal = findAmount(benefits, {
        code: 'F', timeQualifiers: TOTAL_TIME_QUALIFIERS,
    });
    const maximumRemaining = findAmount(benefits, {
        code: 'F', timeQualifiers: [REMAINING_TIME_QUALIFIER],
    });

    const endoCoinsurance = findCoinsurance(benefits, ENDODONTICS);
    const preventiveCoinsurance = findCoinsurance(benefits, PREVENTIVE);

    return {
        status: deriveStatus(response),
        effectiveDate: x12DateToIso(planDates.planBegin || planDates.eligibilityBegin),
        terminationDate: x12DateToIso(planDates.planEnd),
        network: {
            status: deriveNetworkStatus(benefits),
            type: planStatus.planDetails || null,
            networkName: response?.payer?.name || null,
        },
        planDetails: {
            planName: planInfo.groupDescription || planStatus.planDetails || null,
            group: planInfo.groupNumber || null,
            planYear: null,
            claimAddress: null,
        },
        benefits: {
            deductible: {
                individual: deductibleTotal,
                family: familyDeductible,
                remaining: deductibleRemaining ?? deductibleTotal,
                applies_to_treatment: null,
            },
            maximums: {
                annual: maximumTotal,
                remaining: maximumRemaining ?? maximumTotal,
                orthodontic_lifetime: null,
            },
            preventive: {
                coverage: preventiveCoinsurance?.coverage || null,
                deductible_applies: null,
                waiting_period: null,
            },
        },
        endodonticCoverage: {
            basic: {
                coverage: endoCoinsurance?.coverage || null,
                deductible_applies: null,
                waiting_period: null,
                frequency: null,
            },
            // Procedure-level (D-code) detail is rarely present on a 271;
            // populating this table requires payer portals or a benefits
            // enrichment layer (see ROADMAP.md, Phase 3).
            procedures: {},
        },
        history: {
            lastVerification: new Date().toISOString(),
            tooth_history: null,
        },
        warnings: [],
    };
};
