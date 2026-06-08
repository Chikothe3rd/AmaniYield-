import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers.get('authorization') || '';
    
    const response = await fetch(`${API_URL}/api/marketplace/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': headers,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch marketplace data' },
      { status: 500 }
    );
  }
}
