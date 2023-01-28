import { PaymentMethod } from "@stripe/stripe-js";
import { Stripe } from "stripe";
import axios from "axios";
import { errorMessages } from "../../data/messaging";
import { CartItem } from "./CheckoutService";
import { STRIPE_CONFIG } from "../../data/configuration";
import { getSessionUser } from "./UserService";
import { notifyError } from "../../helpers/notify";
import { UserWithRelations } from "./api/ApiUserService";
import { randomInt } from "crypto";

const stripe = new Stripe(STRIPE_CONFIG.stripeApiKey, { apiVersion: "2022-11-15" });

export async function redirectToCheckout(sessionMode: "setup" | "payment" | "subscription", successUrl: URL, cancelUrl: URL, lineItems: CartItem[] | [] = []) {

  try {

    const user = await getSessionUser(true) as UserWithRelations;

    if (!user) {
      window.location.assign("/api/auth/signin");
      return;
    }

    if (!user.billingAddressId) {
      window.location.assign("/checkout/account-details");
      return;
    }

    // let updatedSuccessUrl = new URL(`${successUrl.toString()}?session_id={CHECKOUT_SESSION_ID}`);

    let updatedSuccessUrl = new URL(successUrl.toString());
    let urlParams = new URLSearchParams(updatedSuccessUrl.search);
    urlParams.set('t', Date.now().toString());
    updatedSuccessUrl.search = urlParams.toString() + `&session_id={CHECKOUT_SESSION_ID}`;

    let data: Stripe.Checkout.SessionCreateParams = {
      mode: sessionMode,
      success_url: updatedSuccessUrl.toString(),
      cancel_url: cancelUrl.toString(),
    };

    if (sessionMode === 'subscription' && lineItems.length > 0) {

      if (user.paymentMethods.length === 0) {
        window.location.assign("/checkout/account-details");
        return;
      }

      // Automatic tax calculation for subscriptions
      data.automatic_tax = {
        enabled: true,

      };

      data.line_items = lineItems.map((item) => {
        return {
          quantity: item.quantity,
          price: item.service.priceId,
        } as Stripe.Checkout.SessionCreateParams.LineItem;
      });
    }

    axios.post('/api/stripe/get-checkout-session', data)
      .then((resp) => {
        if (resp.data.url) {
          window.location.assign(resp.data.url)
        }
      })
      .catch((err) => {
        console.error(err)
        notifyError(err.response.status, "api");
        return;
      });

  } catch (err: any) {
    console.error(err);
    notifyError(err.response.status ?? 500, "api");
    return;
  }
}

export async function getPaymentMethodFromSession(sessionId: string): Promise<PaymentMethod> {
  // Retrieve Stripe session
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if (!stripeSession) {
    throw errorMessages.stripe.noSession.message;
  }

  const intentId = stripeSession.setup_intent?.toString() ?? "";

  // Retrieve Stripe setup intent
  const setupIntent = await stripe.setupIntents.retrieve(intentId)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if (!setupIntent) {
    throw errorMessages.stripe.noSetupIntent.message;
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
  if (!paymentMethod) {
    throw errorMessages.stripe.paymentMethod.message;
  }

  return paymentMethod;
}


export async function getSubscriptionsFromSession(sessionId: string): Promise<Stripe.Subscription> {
  // Retrieve Stripe session
  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    .catch((err: any) => {
      throw err.raw.message;
    });
  if (!stripeSession) {
    throw errorMessages.stripe.noSession.message;
  }



  const subscriptionId = stripeSession.subscription?.toString() ?? "";

  // Retrieve Stripe setup intent
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price.product"] })
    .catch((err: any) => {
      throw err.raw.message;
    });
  if (!subscription) {
    throw errorMessages.stripe.noSubscription.message;
  }

  return subscription;
}