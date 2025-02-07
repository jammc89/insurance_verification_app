import React, { useState } from 'react';

const defaultFeeSchedule = {
  'D0160': { description: 'Consultation', fee: 160 },
  'D0460': { description: 'Pulp Vitality Testing', fee: 50 },
  'D0367': { description: 'CBCT', fee: 200 },
  'D3310': { description: 'Anterior Root Canal', fee: 1000 },
  'D3320': { description: 'Premolar Root Canal', fee: 1150 },
  'D3330': { description: 'Molar Root Canal', fee: 1300 },
  'D3346': { description: 'Retreatment - Anterior', fee: 1200 },
  'D3347': { description: 'Retreatment - Premolar', fee: 1350 },
  'D3348': { description: 'Retreatment - Molar', fee: 1500 },
  'D2950': { description: 'Core Build-up', fee: 250 }
};

const defaultInsuranceData = {
  deductible: { remaining: 0 },
  maximums: { remaining: 1000 },
  procedures: {}
};

const CostCalculator = ({ insuranceData = defaultInsuranceData, feeSchedule = defaultFeeSchedule }) => {
  const [selectedProcedures, setSelectedProcedures] = useState([]);

  const toggleProcedure = (procedureCode) => {
    if (selectedProcedures.includes(procedureCode)) {
      setSelectedProcedures(selectedProcedures.filter(code => code !== procedureCode));
    } else {
      setSelectedProcedures([...selectedProcedures, procedureCode]);
    }
  };

  const calculateCosts = () => {
    let totalFees = 0;
    let patientPortion = 0;
    let insurancePortion = 0;
    let deductibleApplied = 0;
    let deductibleRemaining = insuranceData.deductible.remaining || 0;
    let maximumRemaining = insuranceData.maximums.remaining || 0;

    selectedProcedures.forEach(procedureCode => {
      const procedureFee = feeSchedule[procedureCode]?.fee || 0;
      const procedureCoverage = insuranceData.procedures[procedureCode]?.coverage || 0;
      
      totalFees += procedureFee;

      if (deductibleRemaining > 0) {
        const deductibleToApply = Math.min(deductibleRemaining, procedureFee);
        deductibleApplied += deductibleToApply;
        deductibleRemaining -= deductibleToApply;
        procedureFee -= deductibleToApply;
      }

      const insuranceCoverage = procedureFee * procedureCoverage;
      const patientResponsibility = procedureFee - insuranceCoverage;

      if (maximumRemaining > 0) {
        const insurancePayment = Math.min(maximumRemaining, insuranceCoverage);
        insurancePortion += insurancePayment;
        maximumRemaining -= insurancePayment;
      } else {
        patientPortion += procedureFee;
      }
    });

    patientPortion += deductibleApplied;

    return {
      totalFees,
      patientPortion,
      insurancePortion,
      deductibleApplied,
      deductibleRemaining,
      maximumRemaining
    };
  };

  const costs = calculateCosts();

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Select Procedures</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(feeSchedule).map(([code, procedure]) => (
          <label key={code} className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-500"
              checked={selectedProcedures.includes(code)}
              onChange={() => toggleProcedure(code)}
            />
            <span className="ml-2 text-gray-700">{procedure.description}</span>
          </label>
        ))}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="text-gray-600">Total Fees:</div>
          <div className="font-medium">${costs.totalFees.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">Insurance Portion:</div>
          <div className="font-medium">${costs.insurancePortion.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">Patient Portion:</div>
          <div className="font-medium">${costs.patientPortion.toFixed(2)}</div>
        </div>
        {costs.deductibleApplied > 0 && (
          <div className="flex justify-between">
            <div className="text-gray-600">Deductible Applied:</div>
            <div className="font-medium">${costs.deductibleApplied.toFixed(2)}</div>
          </div>
        )}
        <div className="flex justify-between">
          <div className="text-gray-600">Deductible Remaining:</div>
          <div className="font-medium">${costs.deductibleRemaining.toFixed(2)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">Maximum Remaining:</div>
          <div className="font-medium">${costs.maximumRemaining.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
