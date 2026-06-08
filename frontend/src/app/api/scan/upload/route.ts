import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers.get('authorization') || '';
    
    const response = await fetch(`${API_URL}/api/scan/upload`, {
      method: 'POST',
      headers: {
        'Authorization': headers,
      },
      body: body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process scan' },
      { status: 500 }
    );
  }
}
