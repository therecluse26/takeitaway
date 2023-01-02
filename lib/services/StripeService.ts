import { PaymentMethod } from "@stripe/stripe-js";
import axios from "axios";
import { errorMessages } from "../../data/messaging";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export function redirectToCheckout(sessionMode: string, successUrl: URL, cancelUrl: URL)
{
  let updatedSuccessUrl = new URL(`${successUrl.toString()}?session_id={CHECKOUT_SESSION_ID}`);

  axios.post('/api/stripe/get-checkout-session', {
    sessionMode: sessionMode,
    successUrl: updatedSuccessUrl.toString(),
    cancelUrl: cancelUrl.toString()
  })
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

  // Retrieve Stripe setup intent
  const setupIntent = await stripe.setupIntents.retrieve(stripeSession.setup_intent)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if(!setupIntent){
      throw errorMessages.api.stripe.noSetupIntent.message;
  }

  // Retrieve Stripe payment method
  const paymentMethod = await stripe.paymentMethods.retrieve(setupIntent.payment_method)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if(!paymentMethod){
      throw errorMessages.api.stripe.paymentMethod.message;
  }

  return paymentMethod;
}