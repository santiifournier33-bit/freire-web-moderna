import { GoogleAdsApi } from "google-ads-api";

export function getGoogleAdsClient() {
  const {
    GOOGLE_ADS_CLIENT_ID,
    GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_DEVELOPER_TOKEN,
    GOOGLE_ADS_REFRESH_TOKEN,
    GOOGLE_ADS_CUSTOMER_ID,
  } = process.env;

  if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_CLIENT_SECRET || !GOOGLE_ADS_DEVELOPER_TOKEN) {
    throw new Error("[GoogleAds] Missing required env vars: GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN");
  }
  if (!GOOGLE_ADS_REFRESH_TOKEN || !GOOGLE_ADS_CUSTOMER_ID) {
    throw new Error("[GoogleAds] Missing GOOGLE_ADS_REFRESH_TOKEN or GOOGLE_ADS_CUSTOMER_ID");
  }

  const api = new GoogleAdsApi({
    client_id: GOOGLE_ADS_CLIENT_ID,
    client_secret: GOOGLE_ADS_CLIENT_SECRET,
    developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
  });

  return api.Customer({
    customer_id: GOOGLE_ADS_CUSTOMER_ID,
    refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
  });
}
