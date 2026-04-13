import { useParams } from "react-router-dom";
import products from "../data/products";

export default function ProductDetail() {
    const { id } = useParams();
    const product = products.find((p) => p.id === id);


    return (
        <div>
            {
                product ? (
                    <>
                        <h2>Product Details</h2>
                        <h4>{product.name}</h4>
                        <h5>{product.description}</h5>
                    </>
                ) : (
                    <h2>Product not found</h2>
                )
            }
        </div>
    );
}