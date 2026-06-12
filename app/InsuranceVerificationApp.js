'use client';

import React, { useState } from 'react';
import VerificationResults from '../components/VerificationResults';

const fields = [
  { name: 'firstName', label: 'First name', placeholder: 'Jane', required: true },
  { name: 'lastName', label: 'Last name', placeholder: 'Doe', required: true },
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
  { name: 'insuranceProvider', label: 'Insurance provider', placeholder: 'Delta Dental', required: true },
  { name: 'memberId', label: 'Member ID', placeholder: 'ABC123456789', required: true },
  { name: 'groupNumber', label: 'Group number', placeholder: '12345-001', required: false },
];

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
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientInfo),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Verification failed. Please try again.');
      }

      setVerificationResult(data);
    } catch (err) {
      console.error('Verification failed:', err);
      setVerificationResult(null);
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 pt-6">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            Verify patient coverage
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the patient&apos;s details to retrieve eligibility and benefit information.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            {fields.map(({ name, label, placeholder, type, required }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">
                  {label}
                  {!required && <span className="text-slate-400 font-normal"> (optional)</span>}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type || 'text'}
                  value={patientInfo[name]}
                  onChange={handleInputChange}
                  required={required}
                  placeholder={placeholder}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isVerifying}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying && (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isVerifying ? 'Verifying…' : 'Verify insurance'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {verificationResult && (
        <div className="space-y-2">
          {verificationResult.meta?.source === 'mock' && (
            <p className="text-right text-xs text-slate-400">
              Demo data — set STEDI_API_KEY to run live eligibility checks
            </p>
          )}
          <VerificationResults verificationResult={verificationResult} />
        </div>
      )}
    </div>
  );
};

export default InsuranceVerificationApp;
