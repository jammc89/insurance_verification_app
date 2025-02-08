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

const CostCalculator = ({ insuranceData = {} }) => {
  const [selectedProcedures, setSelectedProcedures] = useState({});
  const [totals, setTotals] = useState({
    totalFee: 0,
    insurancePays: 0,
    patientPays: 0
  });

  // Calculate insurance coverage and patient responsibility
  const calculateCosts = () => {
    let totalFee = 0;
    let insurancePays = 0;
    let patientPays = 0;
    let remainingDeductible = insuranceData?.benefits?.deductible?.remaining || 0;

    Object.entries(selectedProcedures).forEach(([code, isSelected]) => {
      if (isSelected) {
        const procedure = feeSchedule[code];
        totalFee += procedure.fee;

        // Apply deductible first if applicable
        if (remainingDeductible > 0) {
          const deductibleApplied = Math.min(remainingDeductible, procedure.fee);
          remainingDeductible -= deductibleApplied;
          patientPays += deductibleApplied;

          // Calculate coverage for remaining amount
          const amountAfterDeductible = procedure.fee - deductibleApplied;
          const coveragePercent = 0.8; // Default to 80% if no insurance data
          insurancePays += amountAfterDeductible * coveragePercent;
          patientPays += amountAfterDeductible * (1 - coveragePercent);
        } else {
          // No deductible to apply
          const coveragePercent = 0.8; // Default to 80% if no insurance data
          insurancePays += procedure.fee * coveragePercent;
          patientPays += procedure.fee * (1 - coveragePercent);
        }
      }
    });

    setTotals({
      totalFee: Math.round(totalFee),
      insurancePays: Math.round(insurancePays),
      patientPays: Math.round(patientPays)
    });
  };

  // Update calculations when procedures are selected/deselected
  useEffect(() => {
    calculateCosts();
  }, [selectedProcedures]);

  const handleProcedureToggle = (code) => {
    setSelectedProcedures(prev => ({
      ...prev,
      [code]: !prev[code]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Treatment Cost Calculator</h2>
      
      {/* Procedure Selection */}
      <div className="space-y-6 mb-6">
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
                      checked={selectedProcedures[code] || false}
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
                      checked={selectedProcedures[code] || false}
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
                      checked={selectedProcedures[code] || false}
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
                      checked={selectedProcedures[code] || false}
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
      </div>

      {/* Cost Summary */}
      <div className="border-t pt-4 mt-6">
        <h3 className="font-medium mb-3">Cost Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Fee:</span>
            <span className="font-medium">${totals.totalFee}</span>
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
