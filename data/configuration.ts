export const USEQUERY_STALETIME = process.env.BROWSER_STALE_TIME ? parseInt(process.env.BROWSER_STALE_TIME) : 300000;


export const MAPBOX_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
}

export const GEOCODER_CONFIG = {
    provider: 'mapbox',
    apiKey: MAPBOX_CONFIG.apiKey, // for Mapquest, OpenCage, Google Premier
    // Optional depending on the providers
    formatter: null // 'gpx', 'string', ...
};    

// Stripe config
export const PAYMENT_CURRENCY = 'usd'
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const PAYMENT_MIN_AMOUNT = 5.0
export const PAYMENT_MAX_AMOUNT = 10000.0
export const PAYMENT_AMOUNT_STEP = 1.0


export const STRIPE_CONFIG = {
    apiVersion: '2022-11-15',
    stripeAccount: process.env.STRIPE_ACCOUNT_ID ?? "",
    stripeApiKey: process.env.STRIPE_SECRET_KEY ?? "",
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY ?? "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    stripeWebhookUrl: process.env.STRIPE_WEBHOOK_URL ?? "",
    stripeWebhookSigningSecret: process.env.STRIPE_WEBHOOK_SIGNING_SECRET ?? "",
}