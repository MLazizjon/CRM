import './Employees.css';
import { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ShoppingCart,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { employees as employeesSeed } from "../data/mockData";
import Modal, { Field } from "../components/Modal";
import PhoneInput from "../components/PhoneInput";
import { useToast } from "../context/ToastContext";

const ROLES = ["Admin", "Manager", "Kassir", "Ombor"];
const roleColors = {
  Admin: {
    bg: "var(--brand-light)",
    color: "var(--brand)",
  },
  Manager: {
    bg: "var(--violet-light)",
    color: "var(--violet)",
  },
  Kassir: {
    bg: "var(--success-light)",
    color: "var(--success)",
  },
  Ombor: {
    bg: "var(--warning-light)",
    color: "var(--warning)",
  },
};
export default function Employees({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState(employeesSeed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Kassir", phone: "", status: "active" });
  const [err, setErr] = useState("");
  const toast = useToast();

  const digits = form.phone.replace(/\D/g, "");
  const phoneValid = digits.length === 12;

  const submit = () => {
    if (!form.name.trim()) return setErr("Xodim ismini kiriting");
    if (!phoneValid) return setErr("Telefon raqamini to'liq kiriting");
    setErr("");
    const initials = form.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    setEmployees((prev) => [
      {
        id: Math.max(0, ...prev.map((e) => Number(e.id) || 0)) + 1,
        name: form.name.trim(),
        role: form.role,
        phone: form.phone,
        avatar: initials,
        sales: 0,
        revenue: 0,
        status: form.status,
        lastActive: "Hozir",
      },
      ...prev,
    ]);
    setForm({ name: "", role: "Kassir", phone: "", status: "active" });
    setOpen(false);
    toast.success && toast.success("Xodim qo'shildi");
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
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
            Xodimlar
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Hodimlar va ularning ko'rsatkichlari
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
          style={{
            background: "linear-gradient(135deg,var(--brand),var(--brand-hover))",
            boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          }}
        >
          <Plus size={15} /> Xodim qo'shish
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Jami xodimlar",
            value: employees.length,
            icon: UserCog,
            color: "var(--brand)",
            bg: "var(--brand-light)",
          },
          {
            label: "Faol",
            value: employees.filter((e) => e.status === "active").length,
            icon: UserCog,
            color: "var(--success)",
            bg: "var(--success-light)",
          },
          {
            label: "Jami sotuvlar",
            value: employees.reduce((s, e) => s + e.sales, 0),
            icon: ShoppingCart,
            color: "var(--violet)",
            bg: "var(--violet-light)",
          },
          {
            label: "Umumiy daromad",
            value:
              (employees.reduce((s, e) => s + e.revenue, 0) / 1000000).toFixed(
                0,
              ) + " mln",
            icon: TrendingUp,
            color: "var(--warning)",
            bg: "var(--warning-light)",
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
          className="px-5 py-4"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              maxWidth: 280,
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
              placeholder="Xodim qidirish..."
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
                "Xodim",
                "Lavozim",
                "Telefon",
                "Sotuvlar",
                "Daromad",
                "Holat",
                "Faollik",
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
            {filtered.map((e) => {
              const rc = roleColors[e.role] || {
                bg: "var(--border-subtle)",
                color: "var(--text-muted)",
              };
              return (
                <tr onClick={() => onNavigate && onNavigate("employee-" + e.id)}
                  key={e.id}
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
                        {e.avatar}
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {e.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: rc.bg,
                        color: rc.color,
                      }}
                    >
                      {e.role}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {e.phone}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-medium"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {e.sales > 0 ? e.sales + " ta" : "—"}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {e.revenue > 0
                      ? (e.revenue / 1000000).toFixed(1) + " mln so'm"
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background:
                          e.status === "active" ? "var(--success-light)" : "var(--border-subtle)",
                        color: e.status === "active" ? "var(--success)" : "var(--text-muted)",
                      }}
                    >
                      {e.status === "active" ? "Faol" : "Nofaol"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {e.lastActive === "Hozir" && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: "var(--success)",
                          }}
                        />
                      )}
                      <span
                        className="text-xs"
                        style={{
                          color: "var(--text-faint)",
                        }}
                      >
                        {e.lastActive}
                      </span>
                    </div>
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
        title="Yangi xodim qo'shish"
        subtitle="Xodim ma'lumotlarini kiriting"
        icon={UserCog}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Field label="To'liq ism">
            <input
              className="input-base"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Alisher Qodirov"
            />
          </Field>

          <Field label="Telefon raqami" hint="Faqat raqam kiritiladi">
            <PhoneInput
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
          </Field>

          <Field label="Lavozim">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {ROLES.map((r) => {
                const active = form.role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, role: r })}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: active ? "var(--brand)" : "var(--input-bg)",
                      color: active ? "#fff" : "var(--text-secondary)",
                      border: "1px solid " + (active ? "var(--brand)" : "var(--border)"),
                    }}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Holat">
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { k: "active", l: "Faol" },
                { k: "inactive", l: "Nofaol" },
              ].map((s) => {
                const active = form.status === s.k;
                return (
                  <button
                    key={s.k}
                    onClick={() => setForm({ ...form, status: s.k })}
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
                    {s.l}
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
