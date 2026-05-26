import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('New enquiry received:', JSON.stringify(body, null, 2));
    // TODO: Add email sending via Resend in next phase
    return NextResponse.json({
      ok: true,
      message: 'Enquiry received. We will call you within 2 hours.',
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: 'Something went wrong. Please call us directly.' },
      { status: 500 }
    );
  }
}
