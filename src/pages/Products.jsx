import "./Products.css";
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Copy,
  X,
  PackagePlus,
  Save,
  AlertTriangle,
} from "lucide-react";
import { products as initialProducts } from "../data/mockData";
import { useToast } from "../context/ToastContext";

const statusMap = {
  active: {
    label: "Faol",
    bg: "var(--success-light)",
    color: "var(--success)",
  },
  low: {
    label: "Kam",
    bg: "var(--warning-light)",
    color: "var(--warning)",
  },
  out: {
    label: "Tugagan",
    bg: "var(--danger-light)",
    color: "var(--danger)",
  },
};

export default function Products({ onNavigate }) {
  const { success } = useToast();
  const [productList, setProductList] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  // Modal holatlari (Qo'shish/Tahrirlash)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // O'chirish modali uchun holat
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form holati
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "Elektronika",
    price: "",
    cost: "",
    stock: "",
    image: "📦",
  });

  const categories = [
    "all",
    ...Array.from(new Set(productList.map((p) => p.category))),
  ];

  const filtered = productList.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (catFilter === "all" || p.category === catFilter)
    );
  });

  // Sof JavaScript orqali Excel (CSV) tayyorlash va yuklab olish
  const handleExportExcel = () => {
    try {
      const headers = [
        "№,Mahsulot nomi,Brend,SKU kodi,Kategoriya,Sotuv narxi,Tan narxi,Qoldiq,Holati\n",
      ];

      const rows = filtered.map((p, index) =>
        [
          index + 1,
          `"${p.name || ""}"`,
          `"${p.brand || "-"}"`,
          `"${p.sku || ""}"`,
          `"${p.category || ""}"`,
          p.price || 0,
          p.cost || 0,
          p.stock || 0,
          `"${statusMap[p.status]?.label || "Faol"}"`,
        ].join(",")
      );

      const csvContent = "\uFEFF" + headers.concat(rows).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Mahsulotlar_Ro'yxati.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      success("Excel fayli muvaffaqiyatli yuklab olindi!");
    } catch (err) {
      console.error("Export xatoligi:", err);
    }
  };

  // Modalni ochish (Add / Edit)
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        brand: product.brand || "",
        sku: product.sku,
        category: product.category,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        image: product.image || "📦",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        sku: "SKU-" + Math.floor(1000 + Math.random() * 9000),
        category: "Elektronika",
        price: "",
        cost: "",
        stock: "",
        image: "📦",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Mahsulot Saqlash (Add / Edit)
  const handleSaveProduct = (e) => {
    e.preventDefault();

    const stockNum = Number(formData.stock);
    let status = "active";
    if (stockNum === 0) status = "out";
    else if (stockNum < 10) status = "low";

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                price: Number(formData.price),
                cost: Number(formData.cost),
                stock: stockNum,
                status,
              }
            : p
        )
      );
      success("Mahsulot muvaffaqiyatli tahrirlandi!");
    } else {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price: Number(formData.price),
        cost: Number(formData.cost),
        stock: stockNum,
        status,
      };
      setProductList((prev) => [newProduct, ...prev]);
      success("Yangi mahsulot qo'shildi!");
    }

    handleCloseModal();
  };

  // O'chirish modalini ochish
  const promptDelete = (product) => {
    setDeleteTarget(product);
  };

  // O'chirishni tasdiqlash (Ha bosilganda)
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setProductList((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    success(`"${deleteTarget.name}" mahsuloti muvaffaqiyatli o'chirildi!`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-primary-color">
            Mahsulotlar
          </h1>
          <p className="text-sm mt-0.5 text-muted-color">
            Barcha tovarlar va inventarizatsiya
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="btn-ghost text-sm">
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary text-sm"
          >
            <Plus size={15} /> Mahsulot qo'shish
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami mahsulotlar",
            value: productList.length,
            color: "var(--brand)",
          },
          {
            label: "Jami qiymat",
            value: "124.8 mln so'm",
            color: "var(--violet)",
          },
          {
            label: "Kam qolgan",
            value: productList.filter((p) => p.status === "low").length,
            color: "var(--warning)",
          },
          {
            label: "Tugagan",
            value: productList.filter((p) => p.status === "out").length,
            color: "var(--danger)",
          },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div
              className="text-2xl font-display font-bold mb-0.5"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-faint-color">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card-flat rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap px-5 py-4 border-b-subtle">
          <div className="search-box-wrapper flex items-center gap-2 rounded-xl px-3 py-2.5">
            <Search size={14} className="text-faint-color" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mahsulot yoki SKU qidirish..."
              className="bg-transparent outline-none text-sm flex-1 text-primary-color"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl p-1 flex-wrap filter-box-wrapper">
            {categories.slice(0, 5).map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    catFilter === c ? "var(--surface)" : "transparent",
                  color:
                    catFilter === c
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  boxShadow: catFilter === c ? "var(--shadow-xs)" : "none",
                }}
              >
                {c === "all" ? "Barchasi" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="table-header-row">
              {[
                "",
                "Mahsulot",
                "SKU",
                "Kategoriya",
                "Sotuv narxi",
                "Tan narxi",
                "Qoldiq",
                "Holat",
                "",
              ].map((h, idx) => (
                <th
                  key={idx}
                  className="text-left px-5 py-3 text-xs font-semibold text-faint-color"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = statusMap[p.status] || statusMap["active"];
              return (
                <tr key={p.id} className="border-t table-row-hover row-anim">
                  <td className="px-5 py-3.5 text-xl">{p.image}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onNavigate?.("product-" + p.id)}
                      className="text-sm font-semibold hover:underline text-left text-primary-color"
                    >
                      {p.name}
                    </button>
                    <div className="text-xs mt-0.5 text-faint-color">
                      {p.brand}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs font-mono px-2 py-0.5 rounded-md sku-badge">
                        {p.sku}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(p.sku);
                          success("SKU nusxalandi");
                        }}
                        className="hover:opacity-70 transition-opacity text-faint-color"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-color">
                    {p.category}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-primary-color">
                    {Number(p.price).toLocaleString()} so'm
                  </td>
                  <td className="px-5 py-3.5 text-sm text-secondary-color">
                    {Number(p.cost).toLocaleString()} so'm
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden stock-bar-bg">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((p.stock / 200) * 100, 100)}%`,
                            background:
                              p.stock === 0
                                ? "var(--danger)"
                                : p.stock < 10
                                ? "var(--warning)"
                                : "var(--success)",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary-color">
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onNavigate?.("product-" + p.id)}
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70 text-faint-color"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70 text-brand-color"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => promptDelete(p)}
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70 text-danger-color"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t-subtle">
          <span className="text-xs text-faint-color">
            Jami {filtered.length} ta mahsulot
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: p === 1 ? "var(--brand)" : "transparent",
                  color: p === 1 ? "white" : "var(--text-muted)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mahsulot Qo'shish va Tahrirlash Modali */}
      {isModalOpen &&
        createPortal(
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg text-primary-color">
                    {editingProduct
                      ? "Mahsulotni tahrirlash"
                      : "Yangi mahsulot qo'shish"}
                  </h2>
                  <p className="text-xs mt-0.5 text-muted-color">
                    {editingProduct
                      ? "Mahsulot ma'lumotlarini o'zgartiring"
                      : "Omborga yangi tovar kiriting"}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl hover:opacity-70 text-faint-color"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                    Mahsulot nomi
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masalan: iPhone 15 Pro"
                    className="input-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      Brend
                    </label>
                    <input
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Apple"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      SKU Kod
                    </label>
                    <input
                      required
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      placeholder="SKU-1001"
                      className="input-base font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      Kategoriya
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input-base"
                    >
                      <option value="Elektronika">Elektronika</option>
                      <option value="Maishiy texnika">Maishiy texnika</option>
                      <option value="Kiyim">Kiyim</option>
                      <option value="Oziq-ovqat">Oziq-ovqat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      Qoldiq (Soni)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="0"
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      Sotuv narxi (so'm)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      Tan narxi (so'm)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      placeholder="0"
                      className="input-base"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-ghost flex-1"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 justify-center"
                  >
                    {editingProduct ? (
                      <Save size={14} />
                    ) : (
                      <PackagePlus size={14} />
                    )}
                    {editingProduct ? "Saqlash" : "Qo'shish"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* O'chirishni Tasdiqlash Modali */}
      {deleteTarget &&
        createPortal(
          <div className="modal-backdrop">
            <div className="modal-card max-w-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-primary-color mb-1">
                Mahsulotni o'chirmoqchimisiz?
              </h3>
              <p className="text-xs text-muted-color mb-6">
                <strong>"{deleteTarget.name}"</strong> ro'yxatdan butunlay olib tashlanadi. Ushbu amalni ortga qaytarib bo'lmaydi.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="btn-ghost flex-1 justify-center"
                >
                  Yo'q, bekor qilish
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="btn-primary flex-1 justify-center bg-danger hover:bg-danger/90 text-white border-none"
                  style={{ background: "var(--danger)", color: "#fff" }}
                >
                  Ha, o'chirilsin
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}