import "./Inventory.css";
import { useState } from "react";
import {
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  Package,
  DollarSign,
  X,
} from "lucide-react";
import { products, lowStockItems } from "../data/mockData";

export default function Inventory() {
  const [modal, setModal] = useState(null);
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const totalValue = products.reduce((s, p) => s + p.cost * p.stock, 0);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openModal = (type, product) => {
    setModal(type);
    setAdjustProduct(product || null);
    setSelectedProductId(product ? product.id : products[0]?.id || "");
    setQty("");
    setReason("");
    setNote("");
  };

  const closeModal = () => {
    setModal(null);
    setAdjustProduct(null);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Ombor boshqaruvi
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Inventarizatsiya va stok nazorati
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal("out")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors hover:bg-red-50 cursor-pointer"
            style={{
              border: "1px solid var(--danger-border, var(--danger))",
              color: "var(--danger)",
            }}
          >
            <ArrowDownCircle size={15} /> Chiqim
          </button>
          <button
            onClick={() => openModal("in")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, var(--success), #059669)",
              boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
            }}
          >
            <ArrowUpCircle size={15} /> Kirim
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami mahsulotlar",
            value: products.length + " ta",
            icon: Package,
            color: "var(--brand)",
            bg: "var(--brand-light)",
          },
          {
            label: "Ombor qiymati",
            value: (totalValue / 1000000).toFixed(1) + " mln so'm",
            icon: DollarSign,
            color: "var(--success)",
            bg: "var(--success-light)",
          },
          {
            label: "Kam qolgan",
            value:
              lowStockItems.filter((i) => i.status === "low").length + " ta",
            icon: AlertTriangle,
            color: "var(--warning)",
            bg: "var(--warning-light)",
          },
          {
            label: "Tugagan",
            value: products.filter((p) => p.status === "out").length + " ta",
            icon: AlertTriangle,
            color: "var(--danger)",
            bg: "var(--danger-light)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 transition-card"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <div
              className="p-2.5 rounded-xl w-fit mb-3"
              style={{
                background: s.bg,
              }}
            >
              <s.icon
                size={18}
                style={{
                  color: s.color,
                }}
              />
            </div>
            <div
              className="text-xl font-display font-bold"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {s.value}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{
                color: "var(--text-faint)",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {lowStockItems.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--warning-light)",
            border: "1px solid var(--warning-border, var(--warning))",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle
              size={16}
              style={{
                color: "var(--warning)",
              }}
            />
            <h3
              className="font-semibold text-sm"
              style={{
                color: "var(--warning-strong, var(--warning))",
              }}
            >
              Ombor ogohlantirishlari
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: "var(--warning)",
                color: "white",
              }}
            >
              {lowStockItems.length}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--warning-border, var(--warning))",
                }}
              >
                <div
                  className="text-xs font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {item.name}
                </div>
                <span
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background:
                      item.status === "critical"
                        ? "var(--danger-light)"
                        : "var(--warning-light)",
                    color:
                      item.status === "critical"
                        ? "var(--danger)"
                        : "var(--warning)",
                  }}
                >
                  {item.current} dona
                </span>
                <button
                  onClick={() => openModal("in", item)}
                  className="text-xs font-semibold hover:underline cursor-pointer"
                  style={{
                    color: "var(--brand)",
                  }}
                >
                  Buyurtma
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              minWidth: 280,
            }}
          >
            <Search
              size={14}
              style={{
                color: "var(--text-faint)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "var(--table-stripe)",
              }}
            >
              {[
                "Mahsulot",
                "SKU",
                "Kirim",
                "Chiqim",
                "Joriy qoldiq",
                "Min. qoldiq",
                "Holat",
                "Amallar",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-semibold"
                  style={{
                    color: "var(--text-faint)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const statusColor =
                p.stock === 0
                  ? "var(--danger)"
                  : p.stock < 10
                  ? "var(--warning)"
                  : "var(--success)";
              const statusBg =
                p.stock === 0
                  ? "var(--danger-light)"
                  : p.stock < 10
                  ? "var(--warning-light)"
                  : "var(--success-light)";
              const statusLabel =
                p.stock === 0
                  ? "Tugagan"
                  : p.stock < 10
                  ? "Kam qolgan"
                  : "Yetarli";
              return (
                <tr
                  key={p.id}
                  className="border-t hover:bg-blue-50/20 transition-colors"
                  style={{
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.image}</span>
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            color: "var(--text-faint)",
                          }}
                        >
                          {p.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <code
                      className="text-xs font-mono px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--border-subtle)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {p.sku}
                    </code>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--success)",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <ArrowUpCircle size={13} />
                      {Math.floor(Math.random() * 200 + 50)}
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--danger)",
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <ArrowDownCircle size={13} />
                      {Math.floor(Math.random() * 150 + 20)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-20 h-1.5 rounded-full"
                        style={{
                          background: "var(--border-subtle)",
                        }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((p.stock / 200) * 100, 100)}%`,
                            background: statusColor,
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {p.stock}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    20
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: statusBg,
                        color: statusColor,
                      }}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal("in", p)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors hover:opacity-90 cursor-pointer"
                        style={{
                          background: "var(--success-light)",
                          color: "var(--success)",
                        }}
                      >
                        +Kirim
                      </button>
                      <button
                        onClick={() => openModal("out", p)}
                        className="px-2 py-1 rounded-lg text-xs font-semibold transition-colors hover:opacity-90 cursor-pointer"
                        style={{
                          background: "var(--danger-light)",
                          color: "var(--danger)",
                        }}
                      >
                        -Chiqim
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjustment Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-container slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="font-display font-bold text-lg"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {modal === "in" ? "Omborga kirim" : "Ombordan chiqim"}
                </h2>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: "var(--text-faint)",
                  }}
                >
                  Stok o'zgartirish
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X
                  size={18}
                  style={{
                    color: "var(--text-faint)",
                  }}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Mahsulot
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Miqdor
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="Miqdorni kiriting"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Sabab
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">Sabab tanlang</option>
                  {modal === "in"
                    ? [
                        "Ta'minotchidan keldi",
                        "Qaytarilgan tovar",
                        "Inventarizatsiya tuzatish",
                      ].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))
                    : [
                        "Sotuv",
                        "Shikastlangan",
                        "Inventarizatsiya tuzatish",
                        "Boshqa",
                      ].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Izoh
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Qo'shimcha izoh..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm border transition-colors hover:bg-gray-50 cursor-pointer"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 cursor-pointer"
                style={{
                  background:
                    modal === "in" ? "var(--success)" : "var(--danger)",
                }}
              >
                {modal === "in" ? "Kirim qilish" : "Chiqim qilish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}