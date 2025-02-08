'use client';

import React, { useState } from 'react';
import VerificationResults from '../components/VerificationResults';

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
      setVerificationResult({}); // This will trigger the VerificationResults component to show
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

      {verificationResult && !verificationResult.error && (
        <VerificationResults verificationResult={verificationResult} />
      )}

      {verificationResult?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800">Error</h3>
          <p className="text-red-700">{verificationResult.error}</p>
        </div>
      )}
    </div>
  );
};

export default InsuranceVerificationApp;
