import './Suppliers.css';
import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Truck,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { suppliers as suppliersSeed } from "../data/mockData";
import Modal, { Field } from "../components/Modal";
import PhoneInput from "../components/PhoneInput";
import { useToast } from "../context/ToastContext";
const statusMap = {
  active: {
    label: "Faol",
    bg: "var(--success-light)",
    color: "var(--success)",
  },
  inactive: {
    label: "Nofaol",
    bg: "var(--border-subtle)",
    color: "var(--text-muted)",
  },
};
export default function Suppliers({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState(suppliersSeed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", products: "", status: "active" });
  const [err, setErr] = useState("");
  const toast = useToast();

  const digits = form.phone.replace(/\D/g, "");
  const phoneValid = digits.length === 12;

  const submit = () => {
    if (!form.name.trim()) return setErr("Ta'minotchi nomini kiriting");
    if (!phoneValid) return setErr("Telefon raqamini to'liq kiriting");
    setErr("");
    setSuppliers((prev) => [
      {
        id: Math.max(0, ...prev.map((x) => Number(x.id) || 0)) + 1,
        name: form.name.trim(),
        phone: form.phone,
        products: Number(form.products) || 0,
        purchases: 0,
        debt: 0,
        lastOrder: "—",
        status: form.status,
      },
      ...prev,
    ]);
    setForm({ name: "", phone: "", products: "", status: "active" });
    setOpen(false);
    toast.success && toast.success("Ta'minotchi qo'shildi");
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
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
            Ta'minotchilar
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Yetkazib beruvchilar va shartnomalar
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, var(--brand), var(--brand-hover))",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          }}
        >
          <Plus size={15} /> Ta'minotchi qo'shish
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami ta'minotchilar",
            value: suppliers.length,
            icon: Truck,
            color: "var(--brand)",
            bg: "var(--brand-light)",
          },
          {
            label: "Jami mahsulotlar",
            value: suppliers.reduce((s, x) => s + x.products, 0),
            icon: Package,
            color: "var(--violet)",
            bg: "var(--violet-light)",
          },
          {
            label: "Jami xaridlar",
            value:
              (
                suppliers.reduce((s, x) => s + x.purchases, 0) / 1000000
              ).toFixed(0) + " mln",
            icon: DollarSign,
            color: "var(--success)",
            bg: "var(--success-light)",
          },
          {
            label: "Qarz",
            value:
              (
                suppliers
                  .filter((s) => s.debt > 0)
                  .reduce((s, x) => s + x.debt, 0) / 1000000
              ).toFixed(1) + " mln",
            icon: AlertCircle,
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
              minWidth: 260,
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
              placeholder="Ta'minotchi qidirish..."
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
                "Ta'minotchi",
                "Telefon",
                "Mahsulotlar",
                "Jami xaridlar",
                "Qarzdorlik",
                "So'nggi buyurtma",
                "Holat",
                "",
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
            {filtered.map((s) => {
              const st = statusMap[s.status];
              return (
                <tr onClick={() => onNavigate && onNavigate("supplier-" + s.id)}
                  key={s.id}
                  className="border-t table-row-hover transition-colors"
                  style={{ cursor: "pointer", borderColor: "var(--border-subtle)",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          background: "linear-gradient(135deg,var(--brand),var(--violet))",
                        }}
                      >
                        {s.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s.phone}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s.products} ta
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {(s.purchases / 1000000).toFixed(1)} mln so'm
                  </td>
                  <td className="px-5 py-3.5">
                    {s.debt > 0 ? (
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--danger)",
                        }}
                      >
                        {(s.debt / 1000000).toFixed(1)} mln
                      </span>
                    ) : (
                      <span
                        className="text-sm"
                        style={{
                          color: "var(--success)",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    {s.lastOrder}
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
                    <button
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{
                        color: "var(--text-faint)",
                      }}
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Yangi ta'minotchi qo'shish"
        subtitle="Yetkazib beruvchi ma'lumotlari"
        icon={Truck}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Field label="Ta'minotchi nomi">
            <input
              className="input-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Global Import MChJ"
            />
          </Field>

          <Field label="Telefon raqami" hint="Faqat raqam kiritiladi">
            <PhoneInput
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
          </Field>

          <Field label="Mahsulotlar soni">
            <input
              className="input-base"
              inputMode="numeric"
              value={form.products}
              onChange={(e) =>
                setForm({ ...form, products: e.target.value.replace(/\D/g, "") })
              }
              placeholder="0"
            />
          </Field>

          <Field label="Holat">
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { k: "active", l: "Faol" },
                { k: "inactive", l: "Nofaol" },
              ].map((st) => {
                const active = form.status === st.k;
                return (
                  <button
                    key={st.k}
                    onClick={() => setForm({ ...form, status: st.k })}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: active ? "var(--success-light)" : "var(--input-bg)",
                      color: active ? "var(--success)" : "var(--text-secondary)",
                      border: "1px solid " + (active ? "var(--success)" : "var(--border)"),
                    }}
                  >
                    {st.l}
                  </button>
                );
              })}
            </div>
          </Field>

          {err && (
            <div
              style={{
                fontSize: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--danger-light)",
                color: "var(--danger)",
                border: "1px solid var(--danger-border)",
              }}
            >
              {err}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button className="btn-ghost" onClick={() => setOpen(false)}>
              Bekor qilish
            </button>
            <button className="btn-primary" onClick={submit}>
              <Plus size={15} /> Qo'shish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
