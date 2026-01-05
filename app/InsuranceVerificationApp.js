'use client';

import React, { useState } from 'react';
import VerificationResults from '../components/VerificationResults';

// Mock data moved here so we can use it in form submission
const mockVerificationData = {
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
};

export const InsuranceVerificationApp = () => {
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    insuranceProvider: '',
    memberId: '',
    groupNumber: ''
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleInputChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationResult(mockVerificationData); // Use mock data
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ error: 'Verification failed. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 mt-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Patient Insurance Information</h2>
          </div>
          <p className="text-sm text-gray-600 ml-13">Enter patient details to verify insurance coverage</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                name="firstName"
                value={patientInfo.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 placeholder-gray-400 group-hover:border-gray-400"
                placeholder="John"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                name="lastName"
                value={patientInfo.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 placeholder-gray-400 group-hover:border-gray-400"
                placeholder="Doe"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={patientInfo.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 group-hover:border-gray-400"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Insurance Provider</label>
              <input
                name="insuranceProvider"
                value={patientInfo.insuranceProvider}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 placeholder-gray-400 group-hover:border-gray-400"
                placeholder="Blue Cross Blue Shield"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Member ID</label>
              <input
                name="memberId"
                value={patientInfo.memberId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 placeholder-gray-400 group-hover:border-gray-400"
                placeholder="ABC123456789"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Group Number <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                name="groupNumber"
                value={patientInfo.groupNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 placeholder-gray-400 group-hover:border-gray-400"
                placeholder="12345-001"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-150 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Insurance...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify Insurance</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {verificationResult && (
        <VerificationResults verificationResult={verificationResult} />
      )}
    </div>
  );
};

export default InsuranceVerificationApp;
