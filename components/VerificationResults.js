'use client';

import React, { useState } from 'react';
import CostCalculator from './CostCalculator';

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

const VerificationResults = ({ verificationResult = mockVerificationData }) => {
    const [sections, setSections] = useState({
        planInfo: true,
        benefits: true,
        endodontic: true,
        history: true,
        calculator: true
    });

    const toggleSection = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (!verificationResult) return null;

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Plan Information</h2>
                    <button 
                        onClick={() => toggleSection('planInfo')}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                    >
                        {sections.planInfo ? '−' : '+'}
                    </button>
                </div>
                {sections.planInfo && (
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium">Status</h3>
                                <p className="text-green-600 font-semibold">
                                    {verificationResult?.status || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Network Status</h3>
                                <p className="text-blue-600">
                                    {verificationResult?.network?.status || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Plan Type</h3>
                                <p>{verificationResult?.network?.type || 'Unknown'}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Plan Year</h3>
                                <p>{verificationResult?.planDetails?.planYear || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Warnings */}
            {verificationResult?.warnings?.map((warning, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-800">Important</h3>
                    <p className="text-red-700">{warning}</p>
                </div>
            ))}
            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Benefits & Maximums</h2>
                    <button 
                        onClick={() => toggleSection('benefits')}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                    >
                        {sections.benefits ? '−' : '+'}
                    </button>
                </div>
                {sections.benefits && (
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium">Individual Deductible</h3>
                                    <p className="font-semibold">
                                        ${verificationResult?.benefits?.deductible?.individual || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Remaining: ${verificationResult?.benefits?.deductible?.remaining || 0}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium">Annual Maximum</h3>
                                    <p className="font-semibold">
                                        ${verificationResult?.benefits?.maximums?.annual || 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Remaining: ${verificationResult?.benefits?.maximums?.remaining || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Endodontic Coverage */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Endodontic Coverage</h2>
                    <button 
                        onClick={() => toggleSection('endodontic')}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                    >
                        {sections.endodontic ? '−' : '+'}
                    </button>
                </div>
                {sections.endodontic && verificationResult?.endodonticCoverage && (
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="font-medium mb-2">Basic Endodontic Coverage</h3>
                                <p>Coverage: {verificationResult?.endodonticCoverage?.basic?.coverage || 'Unknown'}</p>
                                <p>Deductible Applies: {
                                    verificationResult?.endodonticCoverage?.basic?.deductible_applies ? 'Yes' : 'No'
                                }</p>
                                <p>Waiting Period: {verificationResult?.endodonticCoverage?.basic?.waiting_period || 'Unknown'}</p>
                                <p>Frequency: {verificationResult?.endodonticCoverage?.basic?.frequency || 'Unknown'}</p>
                            </div>

                            <h3 className="font-medium mt-4 mb-2">Procedure Coverage</h3>
                            <div className="grid gap-4">
                                {Object.entries(verificationResult?.endodonticCoverage?.procedures || {}).map(([code, info]) => (
                                    <div key={code} className="bg-gray-50 p-4 rounded">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{info.name} ({code})</p>
                                                <p className="text-sm mt-1">Coverage: {info.coverage}</p>
                                                <p className="text-sm">Patient Portion: {info.patient_portion}</p>
                                            </div>
                                            {info.restrictions && info.restrictions !== 'None' && (
                                                <div className="text-sm text-amber-600">
                                                    Note: {info.restrictions}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Treatment History */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Treatment History</h2>
                    <button 
                        onClick={() => toggleSection('history')}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                    >
                        {sections.history ? '−' : '+'}
                    </button>
                </div>
                {sections.history && verificationResult?.history?.tooth_history && (
                    <div className="p-6">
                        <div className="space-y-4">
                            {Object.entries(verificationResult.history.tooth_history).map(([tooth, info]) => (
                                <div key={tooth} className="bg-gray-50 p-4 rounded">
                                    <p className="font-medium">Tooth {tooth}</p>
                                    <p className="text-sm">Procedure: {info.procedure}</p>
                                    <p className="text-sm">Date: {new Date(info.date).toLocaleDateString()}</p>
                                    <p className="text-sm">Provider: {info.provider}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Calculator */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Cost Calculator</h2>
                    <button 
                        onClick={() => toggleSection('calculator')}
                        className="text-gray-500 hover:bg-gray-100 rounded-full p-2 w-8 h-8 flex items-center justify-center"
                    >
                        {sections.calculator ? '−' : '+'}
                    </button>
                </div>
                {sections.calculator && (
                    <div className="p-6">
                        <CostCalculator insuranceData={verificationResult} />
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                Last verified: {
                    verificationResult?.history?.lastVerification ? 
                    new Date(verificationResult.history.lastVerification).toLocaleString() : 
                    'Unknown'
                }
            </div>
        </div>
    );
};

export default VerificationResults;
