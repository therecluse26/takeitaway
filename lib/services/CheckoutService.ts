import { Service } from "@prisma/client";
import axios from "axios";
import { User } from "next-auth";

export type CartItem = {
    service: Service;
    quantity: number;
}

export function getCart(): CartItem[] {
    const cart = localStorage.getItem("cart");
    if (cart) {
        return JSON.parse(cart);
    }
    return [];
}

export function getCartItems() {
    const cart = localStorage.getItem("cart");
    if (cart) {
      return JSON.parse(cart);
    }
    return [];
  }
  
export function getItem(service: Service) {
    const cartItems = getCartItems();
    return cartItems.find((item: CartItem) => item.service.id === service.id);
  }
  
export function itemIsInCart(service: Service) {
    return getItem(service) !== undefined;
  }


export function saveCart(cart: CartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function saveServiceToCart(service: Service, quantity: number = 1): Promise<any> {
    try {
        const cart = getCart();
        const cartItem = cart.find(item => item.service.id === service.id);
        if (cartItem) {
            cartItem.quantity = quantity;
        } else {
            cart.push({ service, quantity });
        }
        saveCart(cart);

        window.dispatchEvent(new Event("cartUpdated"));        

    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }

    return Promise.resolve();
}

export function removeServiceFromCart(service: Service): Promise<any> {
    try {
        const cart = getCart();
        const cartItem = cart.find(item => item.service.id === service.id);
        if (cartItem) {
            cart.splice(cart.indexOf(cartItem), 1);
            saveCart(cart);
        }

        window.dispatchEvent(new Event("cartUpdated"));
    } catch(err) {
        console.error(err);
        return Promise.reject(err);
    }

    return Promise.resolve();
}


export async function saveSessionToUser(user: User, session_id: string){
    return await axios.post(`/api/users/${user.id}/subscriptions/save`, {session_id: session_id});
}
