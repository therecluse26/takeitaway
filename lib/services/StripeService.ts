import { PaymentMethod } from "@stripe/stripe-js";
import Stripe from "stripe";
import axios from "axios";
import { errorMessages } from "../../data/messaging";
import { CartItem } from "./CheckoutService";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

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