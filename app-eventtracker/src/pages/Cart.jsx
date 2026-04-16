import { useEffect, useState } from "react";
import { trackEvent } from "../services/analytics";
import { useLocation, useNavigate } from "react-router-dom";
import tracker from "../tracker/trackerInstance";
import { apiRequest } from "../api/apiClient";
export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);

        trackEvent("view_cart", {
            items: data.reduce((s, i) => s + (i.qty || 1), 0)
        });
    }, []);
    const location = useLocation();



    useEffect(() => {
        tracker.startPage("Cart");
        apiRequest({
            baseURL: "http://localhost:5000",
            url: "/cart"
        },
            { name: "CART", type: "interactive" }).then(() => { });
        return () => tracker.endPage();
    }, []);

    const persist = (nextCart) => {
        setCart(nextCart);
        localStorage.setItem("cart", JSON.stringify(nextCart));
    };

    const removeOne = (id) => {
        const next = cart
            .map((it) =>
                it.id === id
                    ? { ...it, qty: Math.max(0, (it.qty || 1) - 1) }
                    : it
            )
            .filter((it) => it.qty > 0);

        persist(next);

        trackEvent("decrement_cart_item", { productId: id });
    };

    const addOne = (id) => {
        const next = cart.map((it) =>
            it.id === id ? { ...it, qty: (it.qty || 1) + 1 } : it
        );

        persist(next);

        trackEvent("increment_cart_item", { productId: id });
    };

    const removeItem = (id) => {
        const next = cart.filter((item) => item.id !== id);
        persist(next);

        trackEvent("remove_from_cart", { productId: id });
    };

    const clearCart = () => {
        persist([]);
        trackEvent("clear_cart");
    };

    return (
        <div>
            <h2>
                Cart ({cart.reduce((s, i) => s + (i.qty || 1), 0)} items)
            </h2>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div style={{ marginBottom: 12, display: "flex", gap: 8, justifyContent: "center" }}>

                        <button
                            onClick={() => {
                                trackEvent("navigate_checkout");
                                navigate("/checkout");
                            }}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: "#2b46c0ff",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Check out
                        </button>


                        <button
                            onClick={clearCart}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                background: "#c0392b",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            Clear cart
                        </button>
                    </div>

                    <ul
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "20px",
                            listStyle: "none",
                            justifyContent: "center",
                            margin: 0
                        }}
                    >
                        {cart.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                    alignItems: "center"
                                }}
                            >
                                <h4 style={{ margin: 0 }}>{item.name}</h4>
                                <p style={{ margin: 0 }}>{item.description}</p>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginTop: 8
                                    }}
                                >
                                    <button
                                        onClick={() => addOne(item.id)}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: 8,
                                            background: "#10b981",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        +
                                    </button>

                                    <div style={{ minWidth: 28, textAlign: "center" }}>
                                        {item.qty || 1}
                                    </div>

                                    <button
                                        onClick={() => removeOne(item.id)}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: 8,
                                            background: "#f59e0b",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer"
                                        }}
                                    >
                                        −
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={{
                                            padding: "8px 10px",
                                            borderRadius: 8,
                                            background: "#e74c3c",
                                            color: "#fff",
                                            border: "none",
                                            cursor: "pointer",
                                            marginLeft: 8
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}