import { GoogleAdsApi } from "google-ads-api";

if (
  !process.env.GOOGLE_ADS_CLIENT_ID ||
  !process.env.GOOGLE_ADS_CLIENT_SECRET ||
  !process.env.GOOGLE_ADS_DEVELOPER_TOKEN
) {
  throw new Error("[GoogleAds] Missing required env vars: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN");
}

export const googleAdsApi = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

export function getGoogleAdsClient() {
  if (!process.env.GOOGLE_ADS_REFRESH_TOKEN || !process.env.GOOGLE_ADS_CUSTOMER_ID) {
    throw new Error("[GoogleAds] Missing GOOGLE_ADS_REFRESH_TOKEN or GOOGLE_ADS_CUSTOMER_ID");
  }
  return googleAdsApi.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });
}
