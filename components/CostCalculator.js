'use client';

import React, { useState, useEffect } from 'react';

const feeSchedule = {
  // Initial Visit
  'D0160': { description: 'Consultation', fee: 160 },
  'D0460': { description: 'Pulp Vitality Testing', fee: 50 },
  'D0367': { description: 'CBCT', fee: 200 },

  // Root Canals
  'D3310': { description: 'Anterior Root Canal', fee: 1000 },
  'D3320': { description: 'Premolar Root Canal', fee: 1150 },
  'D3330': { description: 'Molar Root Canal', fee: 1300 },

  // Retreatments
  'D3346': { description: 'Retreatment - Anterior', fee: 1200 },
  'D3347': { description: 'Retreatment - Premolar', fee: 1350 },
  'D3348': { description: 'Retreatment - Molar', fee: 1500 },

  // Build-up
  'D2950': { description: 'Core Build-up', fee: 250 }
};

const procedureGroups = [
  { title: 'Initial visit', codes: ['D0160', 'D0460', 'D0367'] },
  { title: 'Treatment', codes: ['D3310', 'D3320', 'D3330'] },
  { title: 'Retreatment', codes: ['D3346', 'D3347', 'D3348'] },
  { title: 'Additional procedures', codes: ['D2950'] },
];

const defaultInsuranceData = {
  benefits: {
    deductible: { remaining: 50 },
    maximums: { remaining: 1500 }
  }
};

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const CostCalculator = ({ insuranceData = defaultInsuranceData }) => {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [totals, setTotals] = useState({
    totalFees: 0,
    insurancePays: 0,
    patientPays: 0,
    deductibleApplied: 0
  });

 useEffect(() => {
    try {
      let totalFees = 0;
      let insurancePays = 0;
      let patientPays = 0;
      let deductibleApplied = 0;

      let deductibleRemaining = insuranceData?.benefits?.deductible?.remaining ?? 50;
      let maxBenefitRemaining = insuranceData?.benefits?.maximums?.remaining ?? 1500;

      selectedProcedures.forEach(code => {
        let fee = feeSchedule[code]?.fee ?? 0;
        totalFees += fee;
        let currentDeductible = 0;  // Initialize deductible for this procedure

        // Handle deductible
        if (deductibleRemaining > 0) {
          currentDeductible = Math.min(deductibleRemaining, fee);
          deductibleApplied += currentDeductible;
          deductibleRemaining -= currentDeductible;
          fee -= currentDeductible;
        }

        // Calculate insurance portion
        let insuranceForThis = Math.min(fee * 0.8, maxBenefitRemaining);
        insurancePays += insuranceForThis;
        maxBenefitRemaining -= insuranceForThis;

        // Calculate patient portion
        patientPays += (fee - insuranceForThis + currentDeductible);
      });

      setTotals({
        totalFees: Math.round(totalFees),
        insurancePays: Math.round(insurancePays),
        patientPays: Math.round(patientPays),
        deductibleApplied: Math.round(deductibleApplied)
      });
    } catch (error) {
      console.error('Error calculating costs:', error);
      setTotals({
        totalFees: 0,
        insurancePays: 0,
        patientPays: 0,
        deductibleApplied: 0
      });
    }
  }, [selectedProcedures, insuranceData]);

  const handleProcedureToggle = (code) => {
    setSelectedProcedures(prev => {
      if (prev.includes(code)) {
        return prev.filter(p => p !== code);
      }
      return [...prev, code];
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {procedureGroups.map(({ title, codes }) => (
          <div key={title}>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
            <div className="divide-y divide-slate-100">
              {codes.map((code) => {
                const procedure = feeSchedule[code];
                return (
                  <label
                    key={code}
                    className="flex items-center justify-between gap-3 py-2.5 cursor-pointer group"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedProcedures.includes(code)}
                        onChange={() => handleProcedureToggle(code)}
                        className="h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 truncate">
                        {procedure.description}
                      </span>
                    </span>
                    <span className="text-sm tabular-nums text-slate-500">
                      {formatCurrency(procedure.fee)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">Total fees</dt>
            <dd className="tabular-nums font-medium text-slate-900">{formatCurrency(totals.totalFees)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">Deductible applied</dt>
            <dd className="tabular-nums font-medium text-slate-900">{formatCurrency(totals.deductibleApplied)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-600">Insurance pays</dt>
            <dd className="tabular-nums font-medium text-slate-900">{formatCurrency(totals.insurancePays)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 mt-2.5">
            <dt className="text-sm font-semibold text-slate-900">Estimated patient total</dt>
            <dd className="text-base font-semibold tabular-nums text-blue-700">{formatCurrency(totals.patientPays)}</dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-slate-400">
        Estimate only. Actual benefits are determined by the payer at the time the claim is processed.
      </p>
    </div>
  );
};

export default CostCalculator;
