export const USEQUERY_STALETIME = process.env.BROWSER_STALE_TIME ? parseInt(process.env.BROWSER_STALE_TIME) : 300000;

export const GEOCODER_CONFIG = {
    provider: 'mapbox',
    // Optional depending on the providers
    apiKey: process.env.MAPBOX_TOKEN, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

// Stripe config
export const PAYMENT_CURRENCY = 'usd'
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const PAYMENT_MIN_AMOUNT = 5.0
export const PAYMENT_MAX_AMOUNT = 10000.0
export const PAYMENT_AMOUNT_STEP = 1.0
export const STRIPE_API_VERSION = '2022-11-15';