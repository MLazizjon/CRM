import "./POS.css";
import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  ShoppingCart,
  Tag,
  Printer,
  RotateCcw,
} from "lucide-react";
import { products } from "../data/mockData";

const categories = [
  "Barchasi",
  "Maishiy kimyo",
  "Oshxona buyumlari",
  "Elektr jihozlar",
  "Katta jihozlar",
  "Bolalar tovarlari",
  "Shaxsiy gigiyena",
  "Uy jihozlari",
];

const payMethods = [
  { key: "naqd", label: "💵 Naqd", color: "var(--success)" },
  { key: "karta", label: "💳 Karta", color: "var(--brand)" },
  { key: "click", label: "🔵 Click", color: "var(--info)" },
  { key: "payme", label: "🟢 Payme", color: "var(--success)" },
  { key: "aralash", label: "🔀 Aralash", color: "var(--violet)" },
  { key: "qarz", label: "📋 Qarz", color: "var(--danger)" },
];

export default function POS() {
  const [cat, setCat] = useState("Barchasi");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState("naqd");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [customerNote, setCustomerNote] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = cat === "Barchasi" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (p) => {
    if (p.stock === 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === p.id);
      if (existing) {
        return prev.map((c) =>
          c.id === p.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          id: p.id,
          name: p.name,
          price: p.price,
          qty: 1,
          image: p.image,
          discount: 0,
        },
      ];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const subtotal = cart.reduce(
    (sum, c) => sum + c.price * c.qty * (1 - c.discount / 100),
    0
  );
  const discountAmt = subtotal * (globalDiscount / 100);
  const total = subtotal - discountAmt;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setSuccess(true);
  };

  const handleNewSale = () => {
    setCart([]);
    setSuccess(false);
    setGlobalDiscount(0);
    setCustomerNote("");
  };

  return (
    <div className="pos-container fade-in">
      {/* Chap tomondagi mahsulotlar royxati */}
      <div className="pos-products-section">
        <div className="pos-header">
          <h1 className="pos-title">Yangi Sotuv</h1>
          <p className="pos-subtitle">Mahsulot tanlang va savatchaga qo'shing</p>
        </div>

        <div className="pos-search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="pos-search-input"
          />
        </div>

        <div className="pos-categories">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`pos-category-btn ${cat === c ? "active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="pos-products-grid">
          {filtered.map((p) => {
            const inCart = cart.find((c) => c.id === p.id);
            const isOutOfStock = p.stock === 0;

            return (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={isOutOfStock}
                className={`product-card ${inCart ? "in-cart" : ""} ${
                  isOutOfStock ? "out-of-stock" : ""
                }`}
              >
                <div className="product-image">{p.image}</div>
                <div className="product-name">{p.name}</div>
                <div className="product-category">{p.category}</div>

                <div className="product-footer">
                  <span className="product-price">
                    {p.price.toLocaleString()} so'm
                  </span>
                  <span
                    className={`product-stock ${
                      p.stock < 5 ? "low-stock" : ""
                    }`}
                  >
                    {p.stock} dona
                  </span>
                </div>

                {inCart && <div className="cart-badge">{inCart.qty}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* O'ng tomondagi Savatcha */}
      <div className="pos-cart-section">
        <div className="cart-header">
          <ShoppingCart size={20} className="cart-icon" />
          <h2>Savatcha</h2>
          {cart.length > 0 && (
            <span className="cart-count">
              {cart.reduce((s, c) => s + c.qty, 0)} ta
            </span>
          )}
        </div>

        <div className="customer-input-wrapper">
          <input
            placeholder="Mijoz ismi (ixtiyoriy)"
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            className="customer-input"
          />
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={40} className="empty-icon" />
              <p className="empty-title">Savatcha bo'sh</p>
              <p className="empty-subtitle">Mahsulot qo'shish uchun bosing</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="item-image">{item.image}</span>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">
                    {item.price.toLocaleString()} so'm
                  </div>

                  <div className="item-controls">
                    <div className="qty-controls">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="qty-btn"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="qty-btn primary"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="item-total">
                      {(item.price * item.qty).toLocaleString()} so'm
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-checkout-section">
          <div className="discount-wrapper">
            <Tag size={16} className="discount-icon" />
            <input
              type="number"
              min={0}
              max={100}
              value={globalDiscount || ""}
              onChange={(e) => setGlobalDiscount(Number(e.target.value))}
              placeholder="Chegirma"
              className="discount-input"
            />
            <span className="discount-unit">%</span>
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span>Jami</span>
              <span>{subtotal.toLocaleString()} so'm</span>
            </div>
            {globalDiscount > 0 && (
              <div className="summary-row discount">
                <span>Chegirma ({globalDiscount}%)</span>
                <span>-{discountAmt.toLocaleString()} so'm</span>
              </div>
            )}
            <div className="summary-row total">
              <span>To'lov</span>
              <span className="total-price">{total.toLocaleString()} so'm</span>
            </div>
          </div>

          <div className="pay-methods-grid">
            {payMethods.map((pm) => (
              <button
                key={pm.key}
                onClick={() => setPayMethod(pm.key)}
                className={`pay-method-btn ${
                  payMethod === pm.key ? "selected" : ""
                }`}
              >
                {pm.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="checkout-btn"
          >
            Sotuvni yakunlash
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="success-icon-wrapper">
              <CheckCircle size={36} />
            </div>

            <h2 className="modal-title">Sotuv yakunlandi!</h2>
            <p className="modal-subtitle">To'lov muvaffaqiyatli qabul qilindi</p>

            <div className="modal-total-amount">
              {total.toLocaleString()} so'm
            </div>

            <div className="modal-info-box">
              <div>
                To'lov usuli:{" "}
                <strong>
                  {payMethods.find((p) => p.key === payMethod)?.label}
                </strong>
              </div>
              {customerNote && (
                <div className="modal-customer-note">
                  Mijoz: <strong>{customerNote}</strong>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={handleNewSale} className="modal-btn primary">
                <RotateCcw size={16} /> Yangi sotuv
              </button>
              <button onClick={handleNewSale} className="modal-btn secondary">
                <Printer size={16} /> Chek chiqarish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}