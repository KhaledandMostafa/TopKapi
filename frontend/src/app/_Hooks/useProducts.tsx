import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Products() {
  function GetProducts() {
    return axios.get(`https://4ce3-41-36-81-23.ngrok-free.app/products`);
  }

  let ResponeObj = useQuery({ queryKey: [`products`], queryFn: GetProducts });

  return ResponeObj;
}
