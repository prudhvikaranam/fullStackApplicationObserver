import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trackEvent } from "../services/analytics";
import tracker from "../tracker/trackerInstance";
import { apiRequest } from "../api/apiClient";
export default function Checkout() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        address: ""
    });
    const location = useLocation();

    const DEFAULT_ITEM_PRICE = 100;


    useEffect(() => {
        tracker.startPage("Checkout");
        apiRequest({
            baseURL: "http://localhost:5000",
            url: "/checkouts"
        },
            { name: "CHECKOUT", type: "interactive" }).then(() => { });
        return () => tracker.endPage();
    }, []);


    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);

        trackEvent("view_checkout", {
            items: data.reduce((s, i) => s + (i.qty || 1), 0)
        });
    }, []);

    const total = cart.reduce(
        (sum, it) =>
            sum + (Number(it.price) || DEFAULT_ITEM_PRICE) * (it.qty || 1),
        0
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((s) => ({ ...s, [name]: value }));
    };

    const validate = () => {
        if (!customer.name.trim() || !customer.email.trim() || !customer.address.trim()) {
            alert("Please fill name, email and address.");
            return false;
        }
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return false;
        }
        return true;
    };

    const generateOrderId = () => {
        // Preferred: UUID
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return `ORD-${crypto.randomUUID()}`;
        }

        // Fallback: secure random bytes
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
            const bytes = new Uint8Array(16); // ✅ FIXED
            crypto.getRandomValues(bytes);

            const hex = Array.from(bytes, (b) =>
                b.toString(16).padStart(2, "0")
            ).join("");

            return `ORD-${hex}`;
        }

        // Last fallback
        return `ORD-${Date.now().toString(36)}`;
    };

    const handlePurchase = async (e) => {
        e?.preventDefault();
        if (!validate()) return;

        setProcessing(true);

        trackEvent("purchase_started", {
            amount: total,
            items: cart.reduce((s, i) => s + (i.qty || 1), 0)
        });

        await new Promise((res) => setTimeout(res, 2000));

        const orderId = generateOrderId();

        const newOrder = {
            id: orderId,
            date: new Date().toISOString(),
            customer: {
                name: customer.name,
                email: customer.email,
                address: customer.address
            },
            items: cart,
            amount: total
        };

        const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

        localStorage.removeItem("cart");
        setCart([]);

        const purchasedItems = cart.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty || 1,
            price: Number(i.price) || DEFAULT_ITEM_PRICE,
            category: i.category || null
        }));

        trackEvent("purchase_completed", {
            amount: total,
            orderId,
            items: cart.reduce((s, i) => s + (i.qty || 1), 0),
            categories: [...new Set(cart.map((i) => i.category))],
            itemsDetail: purchasedItems
        });

        setOrder(newOrder);
        setOrderPlaced(true);
        setProcessing(false);
    };

    if (orderPlaced && order) {
        return (
            <div style={{ maxWidth: 720, margin: "40px auto", padding: 16, textAlign: "center" }}>
                <div style={{
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: "0 8px 30px rgba(2,6,23,0.08)",
                    border: "1px solid #e6eef5",
                    background: "#fff"
                }}>
                    <h2 style={{ marginTop: 0 }}>Order placed</h2>
                    <p>Thank you, {order.customer.name}!</p>
                    <div style={{ fontWeight: 700 }}>Order ID: {order.id}</div>

                    <div style={{ marginTop: 18 }}>
                        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                        <button onClick={() => navigate("/orders")} style={{ marginLeft: 10 }}>
                            Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 880, margin: "24px auto", padding: 12 }}>
            <h2>Checkout</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
                <form
                    onSubmit={handlePurchase}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        padding: 18,
                        borderRadius: 10,
                        border: "1px solid #e6edf3",
                        background: "#fff",
                        boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
                    }}
                >
                    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                        <input
                            name="name"
                            placeholder="Name"
                            value={customer.name}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            value={customer.email}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <textarea
                        name="address"
                        placeholder="Address"
                        value={customer.address}
                        onChange={handleChange}
                        style={{
                            ...inputStyle,
                            width: "100%",
                            minHeight: 90,
                            resize: "vertical"
                        }}
                    />

                    <button
                        disabled={processing || cart.length === 0}
                        style={{
                            marginTop: 8,
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "none",
                            cursor: processing || cart.length === 0 ? "not-allowed" : "pointer",
                            color: "#fff",
                            fontWeight: 600,
                            background:
                                processing || cart.length === 0
                                    ? "#9ca3af"
                                    : "linear-gradient(90deg,#0ea5a4,#06b6d4)",
                            boxShadow:
                                processing || cart.length === 0
                                    ? "none"
                                    : "0 8px 24px rgba(6,182,212,0.12)"
                        }}
                    >
                        {processing ? "Processing..." : `Pay ₹${total}`}
                    </button>
                </form>

                <aside
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        padding: 16,
                        background: "#fff",
                        boxShadow: "0 6px 18px rgba(2,6,23,0.04)"
                    }}
                >
                    <h3>Summary</h3>
                    {cart.map((it) => (
                        <div key={it.id}>
                            {it.name} × {it.qty} = ₹{(it.qty || 1) * (it.price || DEFAULT_ITEM_PRICE)}
                        </div>
                    ))}
                    <h4>Total: ₹{total}</h4>
                </aside>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "48%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "0.95rem",
    boxSizing: "border-box"
};