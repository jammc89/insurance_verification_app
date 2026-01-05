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
      {/* Initial Visit */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Initial Visit</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D0160', 'D0460', 'D0367'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-md transition-shadow duration-150">
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">{procedure.description}</span>
                </label>
                <span className="text-gray-700 font-bold ml-3">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Treatment */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Treatment</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D3310', 'D3320', 'D3330'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-md transition-shadow duration-150">
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">{procedure.description}</span>
                </label>
                <span className="text-gray-700 font-bold ml-3">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Retreatment */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Retreatment</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D3346', 'D3347', 'D3348'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-md transition-shadow duration-150">
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">{procedure.description}</span>
                </label>
                <span className="text-gray-700 font-bold ml-3">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Build-up */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Additional Procedures</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(feeSchedule)
            .filter(([code]) => ['D2950'].includes(code))
            .map(([code, procedure]) => (
              <div key={code} className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-md transition-shadow duration-150">
                <label className="flex items-center space-x-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProcedures.includes(code)}
                    onChange={() => handleProcedureToggle(code)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">{procedure.description}</span>
                </label>
                <span className="text-gray-700 font-bold ml-3">${procedure.fee}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 border-2 border-gray-300 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center space-x-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Cost Summary</span>
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
            <span className="text-gray-700 font-medium">Total Fees:</span>
            <span className="text-gray-900 font-bold text-lg">${totals.totalFees}</span>
          </div>
          <div className="flex justify-between items-center bg-amber-50 rounded-lg p-3 border border-amber-200">
            <span className="text-amber-700 font-medium">Deductible Applied:</span>
            <span className="text-amber-800 font-bold text-lg">${totals.deductibleApplied}</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 border border-blue-200">
            <span className="text-blue-700 font-medium">Insurance Pays:</span>
            <span className="text-blue-800 font-bold text-lg">${totals.insurancePays}</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 rounded-lg p-3 border-2 border-green-400">
            <span className="text-green-700 font-bold">Patient Responsibility:</span>
            <span className="text-green-800 font-bold text-xl">${totals.patientPays}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
