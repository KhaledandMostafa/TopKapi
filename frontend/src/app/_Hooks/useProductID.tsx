import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ProductID() {
  const { id } = useParams();

  function GetProductID() {
    return axios.get(`https://4ce3-41-36-81-23.ngrok-free.app/products/${id}`);
  }

  let ResponObj = useQuery({
    queryKey: ["productByID"],
    queryFn: GetProductID,
  });
  return ResponObj;
}
