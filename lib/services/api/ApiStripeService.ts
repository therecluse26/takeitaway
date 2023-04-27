import { Address, PrismaClient, Service, User } from "@prisma/client";
import { Stripe } from "stripe";
import { STRIPE_CONFIG } from "../../../data/configuration";

export const stripe = new Stripe(STRIPE_CONFIG.stripeApiKey, {
    apiVersion: "2022-11-15",
    typescript: true
});


const prisma = new PrismaClient();


export async function getUserStripeId(user: any): Promise<string | null> {
    if (!user.stripeId) {
        const stripeUser = await stripe.customers.create({
            email: user.email,
            name: user.name
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
        customer: stripeUserId,
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

export async function handleWebhook(event: Stripe.Event) {
    switch (event.type) {
        case 'invoice.paid':
            return handleInvoicePaid(event.data);
        default:
            console.log(`Unhandled event type ${event.type}`);

    }
}

async function handleInvoicePaid(data: any) 
{
    console.log(data);
}