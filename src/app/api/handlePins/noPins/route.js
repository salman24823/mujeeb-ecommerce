import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Make a request to the external API
    const response = await fetch('https://admin-panel-two-beige.vercel.app/api/handleNoPins');

    // If the external API request failed, return an error response
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    // Get the data from the external API
    const data = await response.json();

    // Return the data back to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
  }
}
