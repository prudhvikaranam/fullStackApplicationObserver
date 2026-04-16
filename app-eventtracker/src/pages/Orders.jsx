import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trackEvent } from "../services/analytics";
import tracker from "../tracker/trackerInstance";
import { apiRequest } from "../api/apiClient";
export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();



    useEffect(() => {
        tracker.startPage("Orders");
        apiRequest({
            baseURL: "http://localhost:5000",
            url: "/orders"
        },
            { name: "ORDERS", type: "interactive" }).then(() => { });
        return () => tracker.endPage();
    }, []);


    useEffect(() => {
        const raw = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders(Array.isArray(raw) ? raw : []);
        trackEvent("view_orders");
    }, []);

    const clearOrders = () => {
        localStorage.removeItem("orders");
        setOrders([]);
        trackEvent("clear_orders");
    };

    if (!orders || orders.length === 0) {
        return (
            <div style={{ padding: 20 }}>
                <h2>My Orders</h2>
                <p>No orders found.</p>
                <div style={{ marginTop: 12 }}>
                    <button onClick={() => navigate("/dashboard")} style={{
                        marginRight: 8, marginTop: "5px", marginLeft: "10px",
                        padding: "8px 12px",
                        borderRadius: 8,
                        // background: "#71a9f1ff",
                        color: "black",
                        border: "1px solid blue",
                        cursor: "pointer"
                    }}>
                        Back to dashboard
                    </button>
                    <button onClick={clearOrders} disabled>
                        Clear orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>My Orders</h2>
                <div>
                    <button onClick={() => navigate("/dashboard")} style={{
                        marginRight: 8, marginTop: "5px", marginLeft: "10px",
                        padding: "8px 12px",
                        borderRadius: 8,
                        // background: "#71a9f1ff",
                        color: "black",
                        border: "1px solid blue",
                        cursor: "pointer"
                    }}>
                        Back to dashboard
                    </button>
                    <button onClick={clearOrders} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}>
                        Clear orders
                    </button>
                </div>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
                {orders.slice().reverse().map((order) => (
                    <div key={order.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fff", boxShadow: "0 6px 18px rgba(2,6,23,0.04)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <div>
                                <div style={{ fontWeight: 700 }}>{order.id}</div>
                                <div style={{ fontSize: 12, color: "#6b7280" }}>{new Date(order.date).toLocaleString()}</div>
                            </div>
                            <div style={{ fontWeight: 800, color: "#111827" }}>₹{order.amount}</div>
                        </div>

                        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                            <div style={{ minWidth: 220 }}>
                                <div style={{ fontWeight: 600 }}>{order.customer?.name}</div>
                                <div style={{ fontSize: 13, color: "#374151" }}>{order.customer?.email}</div>
                                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{order.customer?.address}</div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, marginBottom: 8, fontWeight: 600 }}>Items</div>
                                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                    {Array.isArray(order.items) && order.items.length > 0 ? (
                                        order.items.map((it) => (
                                            <div key={(it.id || it.name)} style={{ width: 160, border: "1px solid #f3f4f6", borderRadius: 8, padding: 8, background: "#f9fafb" }}>
                                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                    {/* <img src={it.image} alt={it.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} /> */}
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{it.name}</div>
                                                        <div style={{ fontSize: 12, color: "#6b7280" }}>{it.category}</div>
                                                        {it.qty ? <div style={{ fontSize: 12, color: "#6b7280" }}>Qty: {it.qty}</div> : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: "#6b7280" }}>No items</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}