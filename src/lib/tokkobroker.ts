const TOKKO_API_KEY = process.env.TOKKOBROKER_API_KEY || "1dc0ef58a932195a5ae942f23063314ac8f34ffc";
const TOKKO_BASE_URL = "https://tokkobroker.com/api/v1";

/**
 * Fetches properties from Tokko Broker API with pagination.
 * @param limit Optional limit for total properties to fetch (default: sync all up to 2000)
 */
export async function getProperties(limit: number = 2000) {
  let allProperties: any[] = [];
  let offset = 0;
  const pageSize = 50;
  let hasMore = true;

  try {
    while (hasMore && allProperties.length < limit) {
      const currentLimit = Math.min(pageSize, limit - allProperties.length);
      const url = `${TOKKO_BASE_URL}/property/?key=${TOKKO_API_KEY}&limit=${currentLimit}&offset=${offset}&lang=es_ar`;
      
      console.log(`[Tokko] Fetching properties (offset: ${offset}, limit: ${currentLimit})...`);
      
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) throw new Error(`Tokko API error: ${res.status}`);
      
      const data = await res.json();
      const objects = data.objects || [];
      allProperties.push(...objects);
      
      const totalCount = data.meta?.total_count || 0;
      offset += objects.length;
      
      hasMore = objects.length > 0 && offset < totalCount;
      
      // Safety break to prevent infinite loop or exceeding memory
      if (offset >= 2000) {
        console.warn("[Tokko] Reached 2000 properties limit (safety).");
        break;
      }
    }
    
    console.log(`[Tokko] Total properties synchronized: ${allProperties.length}`);
    return allProperties;
  } catch (error) {
    console.error("Tokkobroker API Error (getProperties):", error);
    return allProperties; // Return what we have so far
  }
}

export async function getPropertyById(id: string) {
  try {
    // Tokko sometimes prefers no trailing slash or specific URL structure for single property
    const url = `${TOKKO_BASE_URL}/property/${id}/?key=${TOKKO_API_KEY}&lang=es_ar`;
    console.log(`[Tokko] Fetching detail for ID ${id}...`);
    
    const res = await fetch(url, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Tokko] Detail Error ${res.status} for ID ${id}: ${errorText}`);
      return null;
    }
    
    const data = await res.json();
    console.log(`[Tokko] Successfully fetched property: ${data.publication_title || id}`);
    return data;
  } catch (error: any) {
    console.error(`[Tokko] Exception in getPropertyById(${id}):`, error.message || error);
    return null;
  }
}

export async function createWebContact(payload: {
  name: string;
  email: string;
  phone: string;
  text: string;
  agentId?: number;
  tags?: string[];
  properties?: number[];
}) {
  try {
    const url = `${TOKKO_BASE_URL}/webcontact/?key=${TOKKO_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        text: payload.text,
        agent: payload.agentId,
        tags: payload.tags || [],
        properties: payload.properties || [],
      }),
    });
    
    if (!res.ok) throw new Error("Error creating webcontact on Tokko");
    return true;
  } catch (error) {
    console.error("Tokkobroker API Error (createWebContact):", error);
    return false;
  }
}
