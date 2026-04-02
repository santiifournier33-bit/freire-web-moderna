import { NextResponse } from 'next/server';

// Revalidate every 60 seconds to ensure fresh locations from Tokko CRM
export const revalidate = 60;
export const dynamic = 'force-dynamic';

const TOKKO_API_KEY = process.env.TOKKOBROKER_API_KEY || "1dc0ef58a932195a5ae942f23063314ac8f34ffc";
const TOKKO_BASE_URL = "https://tokkobroker.com/api/v1";

export async function GET() {
  try {
    // Fetch up to 100 properties to ensure we get all active locations
    const url = `${TOKKO_BASE_URL}/property/?key=${TOKKO_API_KEY}&limit=100&lang=es_ar`;
    
    // We use next block revalidation
    const res = await fetch(url, { 
      next: { revalidate: 60 } 
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch from Tokko CRM");
    }
    
    const data = await res.json();
    const properties = data.objects || [];
    
    // Extract unique locations
    const locations = Array.from(
      new Set(
        properties
          .map((p: any) => p.location?.name)
          .filter((name: string) => name && name.trim() !== '')
      )
    );
    
    // Sort alphabetcially for better UX
    locations.sort((a: any, b: any) => a.localeCompare(b));
    
    return NextResponse.json({ locations });
  } catch (error) {
    console.error("Error fetching locations from Tokkobroker:", error);
    return NextResponse.json({ locations: [] }, { status: 500 });
  }
}
