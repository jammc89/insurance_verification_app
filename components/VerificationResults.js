'use client';

import React, { useState } from 'react';
import CostCalculator from './CostCalculator';

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const titleCase = (value) =>
    String(value || '')
        .toLowerCase()
        .replace(/(^|[\s-])\w/g, (c) => c.toUpperCase());

const Section = ({ title, subtitle, open, onToggle, children }) => (
    <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors"
        >
            <div>
                <h2 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h2>
                {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <svg
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {open && <div className="px-6 pb-6 pt-5 border-t border-slate-100">{children}</div>}
    </section>
);

const Field = ({ label, children }) => (
    <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm font-medium text-slate-900">{children}</dd>
    </div>
);

const Badge = ({ tone = 'slate', dot = false, children }) => {
    const tones = {
        green: 'bg-green-50 border-green-200 text-green-700',
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        slate: 'bg-slate-50 border-slate-200 text-slate-600',
    };
    const dots = { green: 'bg-green-500', blue: 'bg-blue-500', slate: 'bg-slate-400' };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
            {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />}
            {children}
        </span>
    );
};

const BenefitStat = ({ label, total, remaining }) => {
    const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
    return (
        <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-slate-900 tabular-nums">
                {formatCurrency(remaining)}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">remaining of {formatCurrency(total)}</p>
            <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const VerificationResults = ({ verificationResult }) => {
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

    const { benefits, endodonticCoverage, history, network, planDetails, warnings } = verificationResult;
    const basic = endodonticCoverage?.basic;

    return (
        <div className="space-y-4">
            {/* Warnings */}
            {warnings?.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <div className="flex gap-3">
                        <svg className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-semibold text-amber-900">Review before treatment</h3>
                            <ul className="mt-1.5 space-y-1 text-sm text-amber-800 list-disc list-inside">
                                {warnings.map((warning, index) => (
                                    <li key={index}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Plan Information */}
            <Section
                title="Plan information"
                subtitle={planDetails?.planName}
                open={sections.planInfo}
                onToggle={() => toggleSection('planInfo')}
            >
                <div className="flex flex-wrap items-center gap-2 mb-5">
                    <Badge tone="green" dot>{titleCase(verificationResult.status) || 'Unknown'}</Badge>
                    <Badge tone="blue">{titleCase(network?.status) || 'Unknown network status'}</Badge>
                    {network?.type && <Badge>{network.type}</Badge>}
                </div>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
                    <Field label="Group number">{planDetails?.group || '—'}</Field>
                    <Field label="Plan year">{planDetails?.planYear || '—'}</Field>
                    <Field label="Effective">{formatDate(verificationResult.effectiveDate)}</Field>
                    <Field label="Terminates">{formatDate(verificationResult.terminationDate)}</Field>
                </dl>
            </Section>

            {/* Benefits */}
            <Section
                title="Benefits & maximums"
                open={sections.benefits}
                onToggle={() => toggleSection('benefits')}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BenefitStat
                        label="Individual deductible"
                        total={benefits?.deductible?.individual ?? 0}
                        remaining={benefits?.deductible?.remaining ?? 0}
                    />
                    <BenefitStat
                        label="Annual maximum"
                        total={benefits?.maximums?.annual ?? 0}
                        remaining={benefits?.maximums?.remaining ?? 0}
                    />
                </div>
            </Section>

            {/* Endodontic Coverage */}
            {endodonticCoverage && (
                <Section
                    title="Endodontic coverage"
                    open={sections.endodontic}
                    onToggle={() => toggleSection('endodontic')}
                >
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 mb-6">
                        <Field label="Coverage">{basic?.coverage || '—'}</Field>
                        <Field label="Deductible applies">{basic?.deductible_applies ? 'Yes' : 'No'}</Field>
                        <Field label="Waiting period">{basic?.waiting_period || '—'}</Field>
                        <Field label="Frequency">{basic?.frequency || '—'}</Field>
                    </dl>

                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500">Code</th>
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500">Procedure</th>
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500 text-right">Coverage</th>
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500 text-right">Patient pays</th>
                                    <th className="py-2 text-xs font-medium uppercase tracking-wide text-slate-500">Limitations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(endodonticCoverage.procedures || {}).map(([code, info]) => (
                                    <tr key={code}>
                                        <td className="py-2.5 pr-4 font-mono text-xs text-slate-500">{code}</td>
                                        <td className="py-2.5 pr-4 font-medium text-slate-900">{info.name}</td>
                                        <td className="py-2.5 pr-4 text-right tabular-nums text-slate-700">{info.coverage}</td>
                                        <td className="py-2.5 pr-4 text-right tabular-nums text-slate-700">{info.patient_portion}</td>
                                        <td className="py-2.5 text-slate-500">
                                            {info.restrictions && info.restrictions !== 'None' ? (
                                                <span className="text-amber-700">{info.restrictions}</span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}

            {/* Treatment History */}
            {history?.tooth_history && (
                <Section
                    title="Treatment history"
                    open={sections.history}
                    onToggle={() => toggleSection('history')}
                >
                    <div className="overflow-x-auto -mx-6 px-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500">Tooth</th>
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500">Procedure</th>
                                    <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                                    <th className="py-2 text-xs font-medium uppercase tracking-wide text-slate-500">Provider</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(history.tooth_history).map(([tooth, info]) => (
                                    <tr key={tooth}>
                                        <td className="py-2.5 pr-4 font-medium text-slate-900">#{tooth}</td>
                                        <td className="py-2.5 pr-4 font-mono text-xs text-slate-500">{info.procedure}</td>
                                        <td className="py-2.5 pr-4 text-slate-700">{formatDate(info.date)}</td>
                                        <td className="py-2.5 text-slate-700">{info.provider}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}

            {/* Cost Calculator */}
            <Section
                title="Cost estimate"
                subtitle="Select planned procedures to estimate the patient's out-of-pocket cost"
                open={sections.calculator}
                onToggle={() => toggleSection('calculator')}
            >
                <CostCalculator insuranceData={verificationResult} />
            </Section>

            <p className="text-center text-xs text-slate-400">
                Last verified {history?.lastVerification ? new Date(history.lastVerification).toLocaleString() : '—'}
            </p>
        </div>
    );
};

export default VerificationResults;
