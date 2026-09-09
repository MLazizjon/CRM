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
  Edit2,
  PackagePlus,
  X,
} from "lucide-react";
import { products as initialProducts } from "../data/mockData";

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
  const [productList, setProductList] = useState(initialProducts);
  const [cat, setCat] = useState("Barchasi");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [payMethod, setPayMethod] = useState("naqd");
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [customerNote, setCustomerNote] = useState("");

  // Modal holatlari
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Maishiy kimyo",
    price: "",
    stock: "",
    image: "📦",
  });

  const filtered = productList.filter((p) => {
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

  // Card'ni o'chirish
  const handleDeleteProduct = (e, id) => {
    e.stopPropagation();
    setProductList((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  // Tahrirlash modalini ochish
  const handleOpenEditModal = (e, p) => {
    e.stopPropagation();
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      image: p.image || "📦",
    });
    setIsModalOpen(true);
  };

  // Yangi mahsulot modalini ochish
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Maishiy kimyo",
      price: "",
      stock: "",
      image: "📦",
    });
    setIsModalOpen(true);
  };

  // Saqlash (Form submit)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: Number(formData.price),
                stock: Number(formData.stock),
                image: formData.image,
              }
            : p
        )
      );
    } else {
      const newProd = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        image: formData.image || "📦",
      };
      setProductList((prev) => [newProd, ...prev]);
    }

    setIsModalOpen(false);
  };

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
      {/* Chap tomondagi mahsulotlar ro'yxati */}
      <div className="pos-products-section">
        <div className="pos-header">
          <h1 className="pos-title">Yangi Sotuv</h1>
          <p className="pos-subtitle">Mahsulot tanlang va savatchaga qo'shing</p>
        </div>

        {/* Qidiruv paneli va 'Qo'shish' tugmasi */}
        <div className="pos-search-wrapper" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={18} className="search-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="pos-search-input"
              style={{ width: "100%" }}
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="pos-category-btn active"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              whiteSpace: "nowrap",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <PackagePlus size={16} /> Qo'shish
          </button>
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
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className={`product-card ${inCart ? "in-cart" : ""} ${
                  isOutOfStock ? "out-of-stock" : ""
                }`}
                style={{
                  position: "relative",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                }}
              >
                <div>
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
                </div>

                {/* Edit va Delete tugmalari card'ning eng pastki qismida joylashgan */}
                <div
                  style={{
                    display: "flex",
                    justify: "flex-end",
                    gap: "6px",
                    marginTop: "10px",
                    paddingTop: "6px",
                    borderTop: "1px dashed rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <button
                    onClick={(e) => handleOpenEditModal(e, p)}
                    style={{
                      border: "none",
                      background: "rgba(0, 0, 0, 0.04)",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#555",
                    }}
                  >
                    <Edit2 size={13} color="#555" /> Tahrirlash
                  </button>
                  <button
                    onClick={(e) => handleDeleteProduct(e, p.id)}
                    style={{
                      border: "none",
                      background: "rgba(255, 0, 0, 0.08)",
                      borderRadius: "6px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: "#d32f2f",
                    }}
                  >
                    <Trash2 size={13} color="#d32f2f" />
                  </button>
                </div>

                {inCart && <div className="cart-badge">{inCart.qty}</div>}
              </div>
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

      {/* Mahsulot qo'shish / tahrirlash modali */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: "400px", textAlign: "left" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#666" }}>Nomi</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="customer-input"
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#666" }}>Kategoriya</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="customer-input"
                  style={{ width: "100%", marginTop: "4px" }}
                >
                  {categories.filter((c) => c !== "Barchasi").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#666" }}>Narxi (so'm)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="customer-input"
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#666" }}>Soni (dona)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="customer-input"
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#666" }}>Belgi (Emoji)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="customer-input"
                  style={{ width: "100%", marginTop: "4px" }}
                />
              </div>

              <button type="submit" className="modal-btn primary" style={{ marginTop: "12px" }}>
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="modal-overlay" onClick={handleNewSale}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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