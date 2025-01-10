"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import { UserContext } from "./_Contexts/UserContext";
import useProducts from "./_Hooks/useProducts";
import { ProductTYPE } from "./_InterFaces/ProductFace";
import Link from "next/link";
import { CartContext } from "./_Contexts/CartContext";

export default function Home() {
  const { Cart, AddToCart, GetCart } = useContext(CartContext);
  let { data, isLoading, isError, error } = useProducts();
  const [Products, setProducts] = useState([]);
  const [isLoadingBtn, setisLoadingBtn] = useState(false);
  const [CurrBtnID, setCurrBtnID] = useState(null);

  useEffect(() => {
    console.log(data?.data);
    setProducts(data?.data);
    console.log(Products);
  }, [Products, data]);

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
      <div className="products-container">
        {Products?.map((Product: ProductTYPE, index) => {
          return (
            <div key={Product.id} className="product-card">
              <Link href={`/Productdetails/${Product.id}`}>
                <div className="product-info-container">
                  <h2>{Product.title.split(" ").slice(0, 2).join(" ")}</h2>
                  <img src={Product.image_cover} alt={Product.title} />
                  <div className="product-info">
                    <span className="product-price">{Product.price} EGP</span>
                    <span className="product-rating">
                      {Product.rating_rate}
                      <i className="fa-solid fa-star star"></i>
                    </span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => AddToCart(Product.id, 1)}
                className="view-details-btn"
              >
                {CurrBtnID === Product.id && isLoadingBtn ? (
                  <i className="fa-duotone fa-solid fa-spinner fa-spin"></i>
                ) : (
                  `Add to Cart`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
