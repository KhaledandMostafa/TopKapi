"use client";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const CartContext = createContext<any | null>(undefined);
type userID = string | number;
export function CartContextProvider({ children }: any) {
  const [Cart, setCart] = useState<[]>([]);

  async function AddToCart(productID: any, count: any) {
    return await axios
      .post(`https://4ce3-41-36-81-23.ngrok-free.app/cart`, {
        user_id: localStorage.getItem(`UserID`),
        product_id: productID,
        quantity: count,
      })
      .then((x) => {
        setCart(x?.data.cart_items);
        console.log(x?.data);
        toast.success(x?.data.msg);
      })
      .catch((y) => console.log(y));
  }

  async function GetCart() {
    return await axios
      .get(
        `https://4ce3-41-36-81-23.ngrok-free.app/cart/${localStorage.getItem(
          `UserID`
        )}`
      )
      .then((x) => {
        setCart(x?.data.cart);
        console.log(x?.data);
      })
      .catch((y) => console.log(y));
  }

  async function UpdateItemToCart(productID: any, count: any) {
    return await axios
      .patch(`https://4ce3-41-36-81-23.ngrok-free.app/cart`, {
        userId: localStorage.getItem(`UserID`),
        productId: productID,
        quantity: count,
      })
      .then((x) => {
        setCart(x?.data.cart_items);
        console.log(x?.data);
        toast.success(x?.data.msg);
      })
      .catch((y) => console.log(y));
  }

  async function DeleteItemFromCart(productID: any, count: any) {
    return await axios
      .delete(`https://4ce3-41-36-81-23.ngrok-free.app/cart`, {
        data: {
          userId: localStorage.getItem("UserID"),
          productId: productID,
        },
      })
      .then((x) => {
        setCart(x?.data.cart_item);
        console.log(x?.data);
        toast.success(x?.data.msg);
      })
      .catch((y) => console.log(y));
  }
  return (
    <CartContext.Provider
      value={{
        Cart,
        setCart,
        AddToCart,
        GetCart,
        UpdateItemToCart,
        DeleteItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
