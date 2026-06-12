import { NextResponse } from 'next/server';
import { mockVerificationData } from '../../../lib/mockVerificationData';
import { normalizeEligibility } from '../../../lib/normalizeEligibility';

// Feature flag: live eligibility checks run only when STEDI_API_KEY is set.
// Without it, the route returns demo data so the app works out of the box.
//
// Endpoint/version are env-configurable — confirm the current values against
// https://www.stedi.com/docs/healthcare before going live.
const ELIGIBILITY_URL =
  process.env.STEDI_ELIGIBILITY_URL ||
  'https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3';

const REQUIRED_FIELDS = ['firstName', 'lastName', 'dateOfBirth', 'memberId'];

const isoDateToX12 = (value) => String(value || '').replaceAll('-', '');

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((field) => !String(body[field] || '').trim());
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(', ')}` },
      { status: 400 }
    );
  }

  const apiKey = process.env.STEDI_API_KEY;

  if (!apiKey) {
    // Demo mode — brief delay so the verifying state is visible
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({
      ...mockVerificationData(),
      meta: { source: 'mock' },
    });
  }

  // Payer routing: a production app resolves the payer ID from the patient's
  // insurance card / a payer directory. For sandbox use, set STEDI_PAYER_ID.
  const tradingPartnerServiceId = body.payerId || process.env.STEDI_PAYER_ID;
  if (!tradingPartnerServiceId) {
    return NextResponse.json(
      { error: 'Payer routing not configured. Set STEDI_PAYER_ID for sandbox checks.' },
      { status: 422 }
    );
  }

  const eligibilityRequest = {
    controlNumber: String(Math.floor(100000000 + Math.random() * 900000000)),
    tradingPartnerServiceId,
    provider: {
      organizationName: process.env.PROVIDER_ORGANIZATION_NAME || 'Demo Endodontics',
      npi: process.env.PROVIDER_NPI || '1999999984',
    },
    subscriber: {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      dateOfBirth: isoDateToX12(body.dateOfBirth),
      memberId: body.memberId.trim(),
    },
    encounter: {
      // 35 = Dental Care; payers return the dental benefit set for this code
      serviceTypeCodes: ['35'],
    },
  };

  try {
    const response = await fetch(ELIGIBILITY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify(eligibilityRequest),
      signal: AbortSignal.timeout(30_000),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Eligibility check failed:', response.status, payload);
      return NextResponse.json(
        { error: 'The payer could not process this eligibility check. Verify the member details and try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ...normalizeEligibility(payload),
      meta: { source: 'stedi', payer: payload?.payer?.name || null },
    });
  } catch (error) {
    console.error('Eligibility request error:', error);
    return NextResponse.json(
      { error: 'Could not reach the eligibility service. Please try again.' },
      { status: 502 }
    );
  }
}
