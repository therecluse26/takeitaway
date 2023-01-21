import { PaymentMethod } from "@stripe/stripe-js";
import { Stripe } from "stripe";
import axios from "axios";
import { errorMessages } from "../../data/messaging";
import { CartItem } from "./CheckoutService";
import { STRIPE_CONFIG } from "../../data/configuration";

const stripe = new Stripe(STRIPE_CONFIG.stripeApiKey, { apiVersion: "2022-11-15"});

export function redirectToCheckout(sessionMode: "setup"|"payment"|"subscription", successUrl: URL, cancelUrl: URL, lineItems: CartItem[]|[] = [])
{
  let updatedSuccessUrl = new URL(`${successUrl.toString()}?session_id={CHECKOUT_SESSION_ID}`);

  let data: Stripe.Checkout.SessionCreateParams = { 
    mode: sessionMode, 
    success_url: updatedSuccessUrl.toString(), 
    cancel_url: cancelUrl.toString(),
  };
  
  if(lineItems.length > 0){
    data.line_items = lineItems.map((item) => {
      return {
        quantity: item.quantity,
        price: item.service.priceId,
      } as Stripe.Checkout.SessionCreateParams.LineItem;
    });
  }

  axios.post('/api/stripe/get-checkout-session', data)
  .then((resp) => {
    if(resp.data.url){
      window.location.assign(resp.data.url)
    }
  })
  .catch((err) => {
    console.error(err);
    return null;
  });
}

export async function getPaymentMethodFromSession(sessionId: string): Promise<PaymentMethod>
{
  // Retrieve Stripe session
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if(!stripeSession){
      throw errorMessages.api.stripe.noSession.message;
  }

  const intentId = stripeSession.setup_intent?.toString() ?? "";

  // Retrieve Stripe setup intent
  const setupIntent = await stripe.setupIntents.retrieve(intentId)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if(!setupIntent){
      throw errorMessages.api.stripe.noSetupIntent.message;
  }

  const paymentMethodId = setupIntent.payment_method?.toString() ?? "";

  // Retrieve Stripe payment method
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    .then((paymentMethod) => {
      return JSON.parse(JSON.stringify(paymentMethod));
    })
    .catch((err: any) => {
      throw err.raw.message;
    });
  if(!paymentMethod){
      throw errorMessages.api.stripe.paymentMethod.message;
  }

  return paymentMethod;
}