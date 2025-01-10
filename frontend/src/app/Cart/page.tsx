"use client";
import { useContext, useEffect } from "react";
import { CartContext } from "../_Contexts/CartContext";
import { CartTYPE } from "../_InterFaces/CartFaces";

export default function Cart() {
  const {
    Cart,
    setCart,
    GetCart,
    AddToCart,
    UpdateItemToCart,
    DeleteItemFromCart,
  } = useContext(CartContext);

  useEffect(() => {
    GetCart();
    return () => {};
  }, []);

  useEffect(() => {
    console.log(Cart);
  }, [Cart]);

  return (
    <div>
      <span className="shop">Shooping Cart</span>
      <span className="total">Total price : testing...</span>
      {Cart?.length > 0 ? (
        <div className="cart-container">
          <div className="cart-header">
            <div className="cart-column"></div>
            <div className="cart-column">title</div>
            <div className="cart-column">price</div>
            <div className="cart-column">quantity</div>
            <div className="cart-column">actions</div>
          </div>

          <div className="cart-items">
            {Cart.map((item: CartTYPE, index: number) => (
              <div className="cart-item" key={item.product_id}>
                <div className="cart-column">
                  <img
                    className="cart-image"
                    src={item.image_cover}
                    alt={item.title}
                    width={50}
                  />
                </div>
                <div className="cart-column">
                  {item.title.split(" ").splice(0, 2).join(" ")}
                </div>
                <div className="cart-column">{item.price} EGP</div>
                <div className="cart-column">
                  <button
                    onClick={() =>
                      UpdateItemToCart(item.product_id, item.quantity - 1)
                    }
                    className="quantity-button"
                  >
                    -
                  </button>
                  <span className="cart-quantity">{item.quantity}</span>
                  <button
                    onClick={() =>
                      UpdateItemToCart(item.product_id, item.quantity + 1)
                    }
                    className="quantity-button"
                  >
                    +
                  </button>
                </div>
                <div className="cart-column">
                  <span
                    onClick={() => DeleteItemFromCart(item.product_id)}
                    className="remove-item"
                  >
                    Remove
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Cart is empty</p>
      )}
    </div>
  );
}
