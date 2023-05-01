import { Address, PrismaClient, Service, User } from "@prisma/client";
import { Stripe } from "stripe";
import { STRIPE_CONFIG, SUBSCRIPTIONS } from "../../../data/configuration";
import { getStripeIntegerAsDecimal } from "../../utils/stripe-helpers";
import { countServiceLogsForPastNCycles } from "./ApiServiceService";

export const stripe = new Stripe(STRIPE_CONFIG.stripeApiKey ?? "", {
    apiVersion: "2022-11-15",
    typescript: true
});

const prisma = new PrismaClient();

type StripeWebhookResponse = {
    message: string,
    success: boolean,
    data?: object
}

export async function getUserStripeId(user: any): Promise<string | null> {
    if (!user.stripeId) {
        const stripeUser = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                stripeId: stripeUser.id.toString()
            }
        })
        return stripeUser.id.toString();
    }

    return user.stripeId;
}

// Creates/retrieves the stripe checkout session for a user, which handles subscriptions as well as paymentMethod addition
export async function getCheckoutSession(stripeUserId: string, checkoutData: Stripe.Checkout.SessionCreateParams) {

    return await stripe.checkout.sessions.create({
        ...checkoutData,
        payment_method_types: ['card'],
        customer: stripeUserId, customer_update: {
            address: 'auto',
        },
    });
}


function buildProductData(service: Service): Stripe.ProductCreateParams {

    let metadata: { serviceId: string, pickupsPerCycle?: number } = {
        serviceId: service.id,
    };

    if (service.perCycle && service.perCycle > 0) {
        metadata = {
            ...metadata,
            pickupsPerCycle: service.perCycle,
        }
    }

    return {
        name: service.name,
        active: true,
        description: service.description,
        metadata: metadata,
        tax_code: 'txcd_20030000', // General Services - https://stripe.com/docs/tax/tax-categories        
    }
}

export async function updateCustomerBillingAddress(user: User, address: Address) {

    if (!user.stripeId) {
        // Create Stripe Customer
        return getUserStripeId(user);
        // throw new Error("User does not have a Stripe ID, cannot update");
    }

    return await stripe.customers.update(
        user.stripeId,
        {
            address: {
                city: address.city,
                country: address.country,
                line1: address.street,
                line2: address.street2,
                postal_code: address.zip,
                state: address.state,
            } as Stripe.AddressParam,
        }
    );
}

export async function createStripeProduct(service: Service): Promise<Stripe.Product> {

    const product = await stripe.products.create(
        buildProductData(service)
    );

    await prisma.service.update({
        where: {
            id: service.id,
        },
        data: {
            stripeId: product.id,
        }
    })

    await createStripePrice(product.id, service);

    return product;
}

export async function updateStripeProduct(service: Service): Promise<Stripe.Product> {

    if (!service.stripeId) {
        throw new Error("Service does not have a Stripe ID, cannot update");
    }

    const product = await stripe.products.update(
        service.stripeId,
        buildProductData(service)
    );

    return product
}


export async function createStripePrice(productId: string, service: Service) {


    const price: Stripe.PriceCreateParams = {
        product: productId,
        lookup_key: service.id,
        active: true,
        billing_scheme: 'per_unit',
        currency: 'usd',
        unit_amount: parseInt((service.price * 100).toString()),
        nickname: service.name,
        tax_behavior: 'exclusive',

    };

    if (service.type === 'pickup_recurring') {
        price.recurring = {
            interval: 'month',
            interval_count: 1,
            usage_type: 'licensed',
        };
    }

    const stripePrice = await stripe.prices.create(price);

    await prisma.service.update({
        where: {
            id: service.id,
        },
        data: {
            priceId: stripePrice.id,
        }
    })

    return stripePrice;
}


export async function createOrUpdateStripeProducts(services: Service[]): Promise<void> {

    let failures = [];

    try {
        for (let service of services) {

            if (service.stripeId) {

                await updateStripeProduct(service);

            } else {

                await createStripeProduct(service);
            }

        }
    } catch (e) {
        failures.push(e);
    }

    return failures.length > 0 ? Promise.reject(failures) : Promise.resolve();

}

export async function handleWebhook(event: Stripe.Event): Promise<StripeWebhookResponse> {
    switch (event.type) {
        case 'invoice.created':
        case 'invoice.finalized':
        case 'invoice.finalization_failed':
        case 'invoice.paid':
        case 'invoice.payment_action_required':
        case 'invoice.payment_failed':
        case 'invoice.upcoming':
        case 'invoice.updated':
            return await handleInvoiceUpdate(event.data);
        default:
            return {
                message: "Unhandled event type",
                success: false,
            }
    }
}

async function handleInvoiceUpdate(data: any): Promise<StripeWebhookResponse> {

    let tries = 0;

    try {

        const user = await prisma.user.findFirstOrThrow({
            where: {
                stripeId: data.object.customer,
            },
            include: {
                subscription: true,
            }
        });

        let subscription = user.subscription;

        // If we don't have a subscription, try up to 5 times, waiting 1.5 seconds between each try
        // Necessary because of async nature of Stripe webhooks
        if (!subscription) {
            while (tries < 5) {
                tries++;
                await new Promise(resolve => setTimeout(resolve, 1500));

                subscription = await prisma.subscription.findFirst({
                    where: {
                        userId: user.id,
                    }
                });
                if (subscription) {
                    break;
                }
            }
        }

        if (!subscription) {
            throw Error("User does not have a subscription");
        }

        const currentBillingCycle = await prisma.billingCycle.findFirst({
            where: {
                subscriptionId: subscription.id,
                active: true,
            }
        });

        // const pickupsToAdd = currentBillingCycle ? currentBillingCycle.pickups : 0;

        if (currentBillingCycle) {
            await prisma.billingCycle.update({
                where: {
                    id: currentBillingCycle.id,
                },
                data: {
                    active: false,
                }
            });
        }

        const rolloverBillingCycles = SUBSCRIPTIONS.rolloverBillingCycles || 0;

        const serviceLogCounts = await countServiceLogsForPastNCycles(subscription.id, rolloverBillingCycles);

        const billingCycle = await prisma.billingCycle.upsert({
            where: {
                stripeInvoiceId: data.object.id
            },
            create: {
                userId: user.id,
                subscriptionId: subscription.id,
                stripeInvoiceId: data.object.id,
                stripeInvoiceStatus: data.object.status,
                startDate: new Date(data.object.period_start * 1000),
                endDate: new Date(data.object.period_end * 1000),
                amount: getStripeIntegerAsDecimal(data.object.amount_due),
                active: data.object.status === 'paid',
                pickups: subscription.pickupsPerCycle + serviceLogCounts.leftover,
            },
            update: {
                userId: user.id,
                subscriptionId: subscription.id,
                stripeInvoiceStatus: data.object.status,
                startDate: new Date(data.object.period_start * 1000),
                endDate: new Date(data.object.period_end * 1000),
                active: data.object.status === 'paid',
            }
        });

        if (!billingCycle) {
            await prisma.failedRequest.create({
                data: {
                    type: 'billingCycle',
                    data: JSON.stringify(data),
                }
            });

            throw Error("Error creating billing cycle")
        }

        return {
            message: "Invoice Updated",
            success: true,
            data: billingCycle
        }
    } catch (e) {

        return {
            message: e as string,
            success: false,
        }
    }

}
