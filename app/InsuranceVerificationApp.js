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
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Insurance Verification</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                name="firstName"
                value={patientInfo.firstName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                name="lastName"
                value={patientInfo.lastName}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                value={patientInfo.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Insurance Provider</label>
              <input
                name="insuranceProvider"
                value={patientInfo.insuranceProvider}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Member ID</label>
              <input
                name="memberId"
                value={patientInfo.memberId}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Group Number</label>
              <input
                name="groupNumber"
                value={patientInfo.groupNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Insurance'}
          </button>
        </form>
      </div>

      {verificationResult && (
        <VerificationResults verificationResult={verificationResult} />
      )}
    </div>
  );
};

export default InsuranceVerificationApp;
