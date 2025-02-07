import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

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

const VerificationResults = ({ verificationResult }) => {
    if (!verificationResult) return null;

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Plan Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-medium">Status</h3>
                            <p className="text-green-600 font-semibold">{mockVerificationData.status}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Network Status</h3>
                            <p className="text-blue-600">{mockVerificationData.network.status}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Plan Type</h3>
                            <p>{mockVerificationData.network.type}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Plan Year</h3>
                            <p>{mockVerificationData.planDetails.planYear}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Warnings */}
            {mockVerificationData.warnings.map((warning, index) => (
                <Alert key={index} variant="destructive">
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>{warning}</AlertDescription>
                </Alert>
            ))}

            {/* Benefits */}
            <Card>
                <CardHeader>
                    <CardTitle>Benefits & Maximums</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium">Individual Deductible</h3>
                                <p className="font-semibold">${mockVerificationData.benefits.deductible.individual}</p>
                                <p className="text-sm text-gray-600">
                                    Remaining: ${mockVerificationData.benefits.deductible.remaining}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Annual Maximum</h3>
                                <p className="font-semibold">${mockVerificationData.benefits.maximums.annual}</p>
                                <p className="text-sm text-gray-600">
                                    Remaining: ${mockVerificationData.benefits.maximums.remaining}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Endodontic Coverage */}
            <Card>
                <CardHeader>
                    <CardTitle>Endodontic Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded">
                            <h3 className="font-medium mb-2">Basic Endodontic Coverage</h3>
                            <p>Coverage: {mockVerificationData.endodonticCoverage.basic.coverage}</p>
                            <p>Deductible Applies: {mockVerificationData.endodonticCoverage.basic.deductible_applies ? 'Yes' : 'No'}</p>
                            <p>Waiting Period: {mockVerificationData.endodonticCoverage.basic.waiting_period}</p>
                            <p>Frequency: {mockVerificationData.endodonticCoverage.basic.frequency}</p>
                        </div>

                        <h3 className="font-medium mt-4 mb-2">Procedure Coverage</h3>
                        <div className="grid gap-4">
                            {Object.entries(mockVerificationData.endodonticCoverage.procedures).map(([code, info]) => (
                                <div key={code} className="bg-gray-50 p-4 rounded">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{info.name} ({code})</p>
                                            <p className="text-sm mt-1">Coverage: {info.coverage}</p>
                                            <p className="text-sm">Patient Portion: {info.patient_portion}</p>
                                        </div>
                                        {info.restrictions !== 'None' && (
                                            <div className="text-sm text-amber-600">
                                                Note: {info.restrictions}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Treatment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Treatment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(mockVerificationData.history.tooth_history).map(([tooth, info]) => (
                            <div key={tooth} className="bg-gray-50 p-4 rounded">
                                <p className="font-medium">Tooth {tooth}</p>
                                <p className="text-sm">Procedure: {info.procedure}</p>
                                <p className="text-sm">Date: {new Date(info.date).toLocaleDateString()}</p>
                                <p className="text-sm">Provider: {info.provider}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="text-sm text-gray-500">
                Last verified: {new Date(mockVerificationData.history.lastVerification).toLocaleString()}
            </div>
        </div>
    );
};

export default VerificationResults;
