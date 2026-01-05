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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Plan Information</h2>
                    </div>
                    <button
                        onClick={() => toggleSection('planInfo')}
                        className="text-gray-600 hover:bg-white/70 rounded-xl p-2 w-9 h-9 flex items-center justify-center transition-all duration-150 font-bold text-lg"
                    >
                        {sections.planInfo ? '−' : '+'}
                    </button>
                </div>
                {sections.planInfo && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                <h3 className="font-semibold text-gray-700 text-sm mb-2">Status</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-green-700 font-bold text-lg">
                                        {verificationResult?.status || 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                <h3 className="font-semibold text-gray-700 text-sm mb-2">Network Status</h3>
                                <p className="text-blue-700 font-bold text-lg">
                                    {verificationResult?.network?.status || 'Unknown'}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <h3 className="font-semibold text-gray-700 text-sm mb-2">Plan Type</h3>
                                <p className="text-gray-900 font-semibold text-lg">{verificationResult?.network?.type || 'Unknown'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <h3 className="font-semibold text-gray-700 text-sm mb-2">Plan Year</h3>
                                <p className="text-gray-900 font-semibold text-lg">{verificationResult?.planDetails?.planYear || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Warnings */}
            {verificationResult?.warnings?.map((warning, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-5 shadow-md">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900 mb-1">Important Notice</h3>
                            <p className="text-red-800">{warning}</p>
                        </div>
                    </div>
                </div>
            ))}
            {/* Benefits */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Benefits & Maximums</h2>
                    </div>
                    <button
                        onClick={() => toggleSection('benefits')}
                        className="text-gray-600 hover:bg-white/70 rounded-xl p-2 w-9 h-9 flex items-center justify-center transition-all duration-150 font-bold text-lg"
                    >
                        {sections.benefits ? '−' : '+'}
                    </button>
                </div>
                {sections.benefits && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Individual Deductible</span>
                                </h3>
                                <p className="text-3xl font-bold text-amber-700 mb-2">
                                    ${verificationResult?.benefits?.deductible?.individual || 0}
                                </p>
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-semibold text-amber-800">${verificationResult?.benefits?.deductible?.remaining || 0}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Annual Maximum</span>
                                </h3>
                                <p className="text-3xl font-bold text-emerald-700 mb-2">
                                    ${verificationResult?.benefits?.maximums?.annual || 0}
                                </p>
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-600">Remaining:</span>
                                    <span className="font-semibold text-emerald-800">${verificationResult?.benefits?.maximums?.remaining || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Endodontic Coverage */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Endodontic Coverage</h2>
                    </div>
                    <button
                        onClick={() => toggleSection('endodontic')}
                        className="text-gray-600 hover:bg-white/70 rounded-xl p-2 w-9 h-9 flex items-center justify-center transition-all duration-150 font-bold text-lg"
                    >
                        {sections.endodontic ? '−' : '+'}
                    </button>
                </div>
                {sections.endodontic && verificationResult?.endodonticCoverage && (
                    <div className="p-6">
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Basic Endodontic Coverage</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Coverage:</span>
                                        <span className="font-bold text-blue-700">{verificationResult?.endodonticCoverage?.basic?.coverage || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Deductible Applies:</span>
                                        <span className="font-semibold text-gray-900">{verificationResult?.endodonticCoverage?.basic?.deductible_applies ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Waiting Period:</span>
                                        <span className="font-semibold text-gray-900">{verificationResult?.endodonticCoverage?.basic?.waiting_period || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600">Frequency:</span>
                                        <span className="font-semibold text-gray-900">{verificationResult?.endodonticCoverage?.basic?.frequency || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">Procedure Coverage</h3>
                                <div className="grid gap-4">
                                    {Object.entries(verificationResult?.endodonticCoverage?.procedures || {}).map(([code, info]) => (
                                        <div key={code} className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-150">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-lg mb-2">{info.name}</p>
                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">{code}</span>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-gray-600">Coverage:</span>
                                                            <span className="font-bold text-green-600">{info.coverage}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-gray-600">Patient Portion:</span>
                                                            <span className="font-bold text-amber-600">{info.patient_portion}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {info.restrictions && info.restrictions !== 'None' && (
                                                    <div className="bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 text-sm">
                                                        <p className="font-semibold text-amber-800">Note:</p>
                                                        <p className="text-amber-700">{info.restrictions}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Treatment History */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Treatment History</h2>
                    </div>
                    <button
                        onClick={() => toggleSection('history')}
                        className="text-gray-600 hover:bg-white/70 rounded-xl p-2 w-9 h-9 flex items-center justify-center transition-all duration-150 font-bold text-lg"
                    >
                        {sections.history ? '−' : '+'}
                    </button>
                </div>
                {sections.history && verificationResult?.history?.tooth_history && (
                    <div className="p-6">
                        <div className="space-y-4">
                            {Object.entries(verificationResult.history.tooth_history).map(([tooth, info]) => (
                                <div key={tooth} className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-150">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold text-lg">{tooth}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-lg mb-2">Tooth {tooth}</p>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">Procedure:</span>
                                                    <span className="font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded">{info.procedure}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-semibold text-gray-900">{new Date(info.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">Provider:</span>
                                                    <span className="font-semibold text-gray-900">{info.provider}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Calculator */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Cost Calculator</h2>
                    </div>
                    <button
                        onClick={() => toggleSection('calculator')}
                        className="text-gray-600 hover:bg-white/70 rounded-xl p-2 w-9 h-9 flex items-center justify-center transition-all duration-150 font-bold text-lg"
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

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 rounded-xl py-3 px-4 border border-gray-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Last verified: {
                    verificationResult?.history?.lastVerification ?
                    new Date(verificationResult.history.lastVerification).toLocaleString() :
                    'Unknown'
                }</span>
            </div>
        </div>
    );
};

export default VerificationResults;
