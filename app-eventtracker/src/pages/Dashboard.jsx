import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productsData from "../data/products";
import { trackEvent } from "../services/analytics";
import tracker from "../tracker/trackerInstance";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasTrackedPage = useRef(false);
    const hasTrackedImpression = useRef(false);
    const [products, setProducts] = useState(productsData);
    const [filter, setFilter] = useState("all");

    const categories = ["all", ...new Set(productsData.map(p => p.category))];
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];;
    const [cartCount, setCartCount] = useState(cartItems.length);


    useEffect(() => {
        tracker.startPage("Home");
        return () => tracker.endPage();
    }, [location.pathname]);



    useEffect(() => {
        if (!hasTrackedPage.current) {
            trackEvent("page_view", { page: "dashboard" });
            hasTrackedPage.current = true;
        }
    }, []);

    useEffect(() => {
        if (!hasTrackedImpression.current) {
            products.forEach((p) => {
                trackEvent("product_impression", {
                    productId: p.id,
                    category: p.category
                });
            });
            hasTrackedImpression.current = true;
        }
    }, []);

    const handleFilter = (type) => {
        setFilter(type);
        trackEvent("filter_applied", { category: type });

        if (type === "all") {
            setProducts(productsData);
        } else {
            setProducts(productsData.filter((p) => p.category === type));
        }
    };

    const addToCart = (product) => {
        const existing = JSON.parse(localStorage.getItem("cart")) || [];

        const index = existing.findIndex((item) => item.id === product.id);

        if (index > -1) {
            existing[index].qty = (existing[index].qty || 1) + 1;
        } else {
            existing.push({ ...product, qty: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(existing));
        setCartCount(existing.length);
        trackEvent("add_to_cart", {
            productId: product.id,
            name: product.name,
            category: product.category,
            price: product.price || 100
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        trackEvent("logout");
        navigate("/login");
    };



    const handleOrders = () => {
        trackEvent("view_orders");
        navigate("/orders");
    };

    return (
        <div style={{ padding: "20px" }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "60px", alignItems: 'center' }}>

                <h2 style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    background: "linear-gradient(90deg,#2563eb 0%, #06b6d4 50%, #0ea5a4 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent"
                }}>EventCart Dashboard</h2>

                <div style={{ marginTop: "30px" }}>
                    <button
                        onClick={() => {
                            trackEvent("navigate_cart");
                            navigate("/cart");
                        }}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Cart {cartCount > 0 && `(${cartCount})`}
                    </button>

                    <button
                        style={{
                            marginLeft: "10px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#0ea5a4",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            trackEvent("checkout_started");
                            navigate("/checkout");
                        }}
                    >
                        Checkout
                    </button>

                    <button
                        style={{
                            marginLeft: "10px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#f59e0b",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                        onClick={handleOrders}
                    >
                        My Orders
                    </button>

                    <button
                        style={{
                            marginLeft: "10px",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>


            <div style={{ marginBottom: "20px" }}>
                Filter &nbsp; {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleFilter(cat)}
                        data-track = {`Category:${cat}`}
                        style={{
                            marginRight: "10px",
                            marginBottom: "10px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            background: filter === cat ? "#ddd" : "#fff",
                            cursor: "pointer",
                            textTransform: "capitalize"
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "20px"
                }}
            >
                {products.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "10px",
                            textAlign: "center"
                        }}
                    >
                        {/* <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px"
              }}
            /> */}

                        <h4>{p.name}</h4>
                        <p style={{ fontSize: "12px", color: "#555" }}>
                            {p.description}
                        </p>

                        <button
                            onClick={() => {
                                trackEvent("view_product", {
                                    productId: p.id,
                                    name: p.name,
                                    category: p.category,
                                    price: p.price || 100
                                });
                                navigate(`/product/${p.id}`);
                            }}
                            style={{
                                marginTop: "5px", marginLeft: "10px",
                                padding: "8px 12px",
                                borderRadius: 8,
                                // background: "#71a9f1ff",
                                color: "black",
                                border: "1px solid blue",
                                cursor: "pointer"
                            }}
                        >
                            View
                        </button>

                        <button
                            onClick={() => addToCart(p)}
                            style={{
                                marginTop: "5px", marginLeft: "10px",
                                padding: "8px 12px",
                                borderRadius: 8,
                                // background: "#71a9f1ff",
                                color: "black",
                                border: "1px solid orange",
                                cursor: "pointer"
                            }}
                        >
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}