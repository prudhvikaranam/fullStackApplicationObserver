import { useLocation, useParams } from "react-router-dom";
import products from "../data/products";
import { useEffect } from "react";
import tracker from "../tracker/trackerInstance";
import { apiRequest } from "../api/apiClient";

export default function ProductDetail() {
    const { id } = useParams();
    const product = products.find((p) => p.id === id);

    const location = useLocation();


    useEffect(() => {
        tracker.startPage("ProductDetail");
        apiRequest({
            baseURL: "http://localhost:5000",
            url: "/viewproducts"
        },
            { name: "VIEW_PRODUCT", type: "interactive" }).then(() => { });
        return () => tracker.endPage();
    }, [location.pathname]);



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