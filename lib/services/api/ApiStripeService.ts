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

export async function getCheckoutSession(stripeUser: string, sessionMode: string, successUrl: string, cancelUrl: string) {
    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: sessionMode as Stripe.Checkout.SessionCreateParams.Mode,
        customer: stripeUser,
        success_url: successUrl,
        cancel_url: cancelUrl,
    })
}

function buildProductData(service: Service): Stripe.ProductCreateParams {
    return {
        name: service.name,
        active: true,
        description: service.description,
    }
}

export async function createServiceProduct(service: Service): Promise<Stripe.Product> {

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

    await createServicePrice(product.id, service);

    return product;
}

export async function updateServiceProduct(service: Service): Promise<Stripe.Product> {

    if (!service.stripeId) {
        throw new Error("Service does not have a Stripe ID, cannot update");
    }

    const product = await stripe.products.update(
        service.stripeId,
        buildProductData(service)
    );

    return product
}


export async function createServicePrice(productId: string, service: Service) {

    
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

    return await stripe.prices.create(price);
}


export async function createOrUpdateServiceProducts(services: Service[]): Promise<void> {

    let failures = [];

    try {
        for (let service of services) {

            if (service.stripeId) {

                await updateServiceProduct(service);

            } else {

                await createServiceProduct(service);
            }

        }
    } catch (e) {
        failures.push(e);
    }

    return failures.length > 0 ? Promise.reject(failures) : Promise.resolve();

}