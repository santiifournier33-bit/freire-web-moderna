import { NextResponse } from "next/server";
import { getGoogleAdsClient } from "@/lib/google-ads";

export async function GET() {
  try {
    const customer = getGoogleAdsClient();

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY metrics.impressions DESC
      LIMIT 50
    `);

    const result = campaigns.map((row: any) => ({
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      type: row.campaign.advertising_channel_type,
      impressions: row.metrics.impressions,
      clicks: row.metrics.clicks,
      cost: (row.metrics.cost_micros / 1_000_000).toFixed(2),
      conversions: row.metrics.conversions,
    }));

    return NextResponse.json({ campaigns: result });
  } catch (error: any) {
    console.error("[GoogleAds] Campaigns fetch error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Error al obtener campañas de Google Ads" },
      { status: 500 }
    );
  }
}
