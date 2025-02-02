'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const InsuranceVerificationApp = () => {
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
      
      // Mock response
      const result = {
        status: 'ACTIVE',
        coverage: {
          type: 'PPO',
          effectiveDate: '2024-01-01',
          endDate: '2024-12-31',
          deductible: {
            individual: 50,
            remaining: 50
          },
          maximumBenefit: {
            annual: 1500,
            remaining: 1500
          },
          procedures: {
            'D3330': {
              name: 'Endodontic Therapy (Molar)',
              coverage: '80%',
              patientPortion: '20%'
            }
          }
        },
        lastVerified: new Date().toISOString()
      };
      
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({ error: 'Verification failed. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  name="firstName"
                  value={patientInfo.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  name="lastName"
                  value={patientInfo.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={patientInfo.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Insurance Provider</label>
                <Input
                  name="insuranceProvider"
                  value={patientInfo.insuranceProvider}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Member ID</label>
                <Input
                  name="memberId"
                  value={patientInfo.memberId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Group Number</label>
                <Input
                  name="groupNumber"
                  value={patientInfo.groupNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Insurance'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {verificationResult && !verificationResult.error && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Coverage Status</h3>
                <p className="text-green-600 font-semibold">{verificationResult.status}</p>
              </div>
              <div>
                <h3 className="font-medium">Plan Type</h3>
                <p>{verificationResult.coverage.type}</p>
              </div>
              <div>
                <h3 className="font-medium">Effective Date</h3>
                <p>{verificationResult.coverage.effectiveDate}</p>
              </div>
              <div>
                <h3 className="font-medium">End Date</h3>
                <p>{verificationResult.coverage.endDate}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Benefits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Individual Deductible</p>
                  <p className="font-semibold">${verificationResult.coverage.deductible.individual}</p>
                  <p className="text-sm text-gray-600">Remaining: ${verificationResult.coverage.deductible.remaining}</p>
                </div>
                <div>
                  <p className="text-sm">Annual Maximum</p>
                  <p className="font-semibold">${verificationResult.coverage.maximumBenefit.annual}</p>
                  <p className="text-sm text-gray-600">Remaining: ${verificationResult.coverage.maximumBenefit.remaining}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Procedure Coverage</h3>
              {Object.entries(verificationResult.coverage.procedures).map(([code, info]) => (
                <div key={code} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">{info.name} ({code})</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <p className="text-sm">Insurance Covers: {info.coverage}</p>
                    <p className="text-sm">Patient Portion: {info.patientPortion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              Last verified: {new Date(verificationResult.lastVerified).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {verificationResult?.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{verificationResult.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default InsuranceVerificationApp;
