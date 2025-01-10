export interface CartTYPE {
  title: string;
  price: number;
  product_id: number;
  image_cover: string;
  quantity: number;
}

export interface CartContextType {
  Cart: CartTYPE;
  setCart: React.Dispatch<React.SetStateAction<CartTYPE>>;
}
