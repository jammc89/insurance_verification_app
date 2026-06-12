// Demo eligibility response, returned by /api/verify when no clearinghouse
// API key is configured. Server-side only — never shipped to the client bundle.

export const mockVerificationData = () => ({
    status: 'ACTIVE',
    effectiveDate: '2024-01-01',
    terminationDate: '2024-12-31',
    network: {
        status: 'IN-NETWORK',
        type: 'PPO',
        networkName: 'Premium Dental Network'
    },
    planDetails: {
        planName: 'Premium Dental PPO',
        group: '12345-001',
        planYear: 'Calendar Year',
        claimAddress: 'PO Box 12345, Some City, ST 12345'
    },
    benefits: {
        deductible: {
            individual: 50,
            family: 150,
            remaining: 50,
            applies_to_treatment: true
        },
        maximums: {
            annual: 1500,
            remaining: 1500,
            orthodontic_lifetime: 1000
        },
        preventive: {
            coverage: '100%',
            deductible_applies: false,
            waiting_period: 'None'
        }
    },
    endodonticCoverage: {
        basic: {
            coverage: '80%',
            deductible_applies: true,
            waiting_period: 'None',
            frequency: 'Once per tooth per lifetime'
        },
        procedures: {
            'D3310': {
                name: 'Anterior Root Canal',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: 'None'
            },
            'D3320': {
                name: 'Premolar Root Canal',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: 'None'
            },
            'D3330': {
                name: 'Molar Root Canal',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: 'None'
            },
            'D3346': {
                name: 'Retreatment - Anterior',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: '2 years after initial treatment'
            },
            'D3347': {
                name: 'Retreatment - Premolar',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: '2 years after initial treatment'
            },
            'D3348': {
                name: 'Retreatment - Molar',
                coverage: '80%',
                patient_portion: '20%',
                restrictions: '2 years after initial treatment'
            }
        }
    },
    history: {
        lastVerification: new Date().toISOString(),
        tooth_history: {
            '18': {
                date: '2023-06-15',
                procedure: 'D3330',
                provider: 'Dr. Smith'
            }
        }
    },
    warnings: [
        'Tooth 18 had previous root canal treatment in 2023',
        'Retreatment waiting period applies'
    ]
});
