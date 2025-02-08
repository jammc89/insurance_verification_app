import React, { useState } from 'react';
import CostCalculator from './CostCalculator';

const mockVerificationData = {
    // ... keep all your existing mockVerificationData the same ...
};

const VerificationResults = ({ verificationResult }) => {
    if (!verificationResult) return null;

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
                    </div>
                )}
            </div>

            {/* Warnings - Always Visible */}
            {mockVerificationData.warnings.map((warning, index) => (
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
                {sections.endodontic && (
                    <div className="p-6">
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
                {sections.history && (
                    <div className="p-6">
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
                        <CostCalculator insuranceData={mockVerificationData} />
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                Last verified: {new Date(mockVerificationData.history.lastVerification).toLocaleString()}
            </div>
        </div>
    );
};

export default VerificationResults;
