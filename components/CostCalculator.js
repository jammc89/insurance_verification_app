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

const defaultInsuranceData = {
  benefits: {
    deductible: { remaining: 50 },
    maximums: { remaining: 1500 }
  }
};

const CostCalculator = ({ insuranceData = defaultInsuranceData }) => {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [totals, setTotals] = useState({
    totalFees: 0,
    insurancePays: 0,
    patientPays: 0,
    deductibleApplied: 0
  });

  useEffect(() => {
    let totalFees = 0;
    let insurancePays = 0;
    let patientPays = 0;
    let deductibleApplied = 0;
    let deductibleRemaining = insuranceData?.benefits?.deductible?.remaining ?? 50;
    let maxBenefitRemaining = insuranceData?.benefits?.maximums?.remaining ?? 1500;

    selectedProcedures.forEach(code => {
      let fee = feeSchedule[code]?.fee ?? 0;
      totalFees += fee;

      if (deductibleRemaining > 0) {
        let deductibleForThis = Math.min(deductibleRemaining, fee);
        deductibleApplied += deductibleForThis;
        deductibleRemaining -= deductibleForThis;
        fee -= deductibleForThis;
      }

      let insuranceForThis = Math.min(fee * 0.8, maxBenefitRemaining);
      insurancePays += insuranceForThis;
      maxBenefitRemaining -= insuranceForThis;
      patientPays += (fee - insuranceForThis + deductibleForThis);
    });

    setTotals({
      totalFees,
      insurancePays,
      patientPays,
      deductibleApplied
    });
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
      {/* Initial Visit */}
      <div>
        <h3 className="font-medium mb-2">Initial Visit</h3>
        <div className="space-y-2">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D0160', 'D0460', 'D0367'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="rounded"
                  />
                  <span>{procedure.description}</span>
                </label>
                <span className="text-gray-600">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Treatment */}
      <div>
        <h3 className="font-medium mb-2">Treatment</h3>
        <div className="space-y-2">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D3310', 'D3320', 'D3330'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="rounded"
                  />
                  <span>{procedure.description}</span>
                </label>
                <span className="text-gray-600">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Retreatment */}
      <div>
        <h3 className="font-medium mb-2">Retreatment</h3>
        <div className="space-y-2">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D3346', 'D3347', 'D3348'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="rounded"
                  />
                  <span>{procedure.description}</span>
                </label>
                <span className="text-gray-600">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Build-up */}
      <div>
        <h3 className="font-medium mb-2">Additional Procedures</h3>
        <div className="space-y-2">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D2950'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="rounded"
                  />
                  <span>{procedure.description}</span>
                </label>
                <span className="text-gray-600">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Summary */}
      <div className="border-t pt-4 mt-6">
        <h3 className="font-medium mb-3">Cost Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Fees:</span>
            <span className="font-medium">${totals.totalFees}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Deductible Applied:</span>
            <span className="font-medium">${totals.deductibleApplied}</span>
          </div>
          <div className="flex justify-between text-blue-600">
            <span>Insurance Pays:</span>
            <span className="font-medium">${totals.insurancePays}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Patient Responsibility:</span>
            <span className="font-medium">${totals.patientPays}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
