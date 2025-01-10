"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import useProductID from "../../_Hooks/useProductID";
import { CartContext } from "@/app/_Contexts/CartContext";
import { ProductTYPE } from "../../_InterFaces/ProductFace";

export default function ProductDetails() {
  let { Cart, setCart, AddToCart } = useContext(CartContext);
  let { data, isLoading, isError, error }: any = useProductID();
  const [ProudctByID, setProudctByID] = useState([]);

  useEffect(() => {
    console.log(data?.data);
    setProudctByID(data?.data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="">
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="Mssagee">
        <h1>{error?.message}</h1>
      </div>
    );
  }

  return (
    <>
      {ProudctByID?.map((item: ProductTYPE, index: number) => {
        return (
          <div key={index} className="item-container">
            <img
              src={item.image_cover}
              alt={item.title}
              className="item-image"
            />
            <div className="item-details">
              <h2 className="item-title">{item.title}</h2>
              <p className="item-description">{item.description}</p>
              <div className="item-price-rating">
                <span className="item-price">{item.price} EGP</span>
                <span className="item-rating">{item.rating_rate}</span>
              </div>
              <button
                onClick={() => AddToCart(item.id, 1)}
                className="add-to-cart-button"
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
