import { PrismaClient, Service } from "@prisma/client";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: '2022-11-15',
    typescript: true,
})

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

export async function getCheckoutSession(stripeUser: string, checkoutData: Stripe.Checkout.SessionCreateParams) {
    
    return await stripe.checkout.sessions.create({
        ...checkoutData,
        payment_method_types: ['card'],
        customer: stripeUser,
    })
}

function buildProductData(service: Service): Stripe.ProductCreateParams {
    return {
        name: service.name,
        active: true,
        description: service.description,
    }
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

    if(service.type === 'recurring'){
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