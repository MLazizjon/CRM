import './EmployeeDetail.css';
import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Calendar,
  ShoppingCart,
  TrendingUp,
  Edit2,
  Trash2,
  X,
  Save,
  UserCog,
  CheckCircle,
  Clock,
} from "lucide-react";
import { employees } from "../data/mockData";
import { useToast } from "../context/ToastContext";

const salesLog = [
  { id: "S-2847", customer: "Aziza Karimova", amount: 485000, payment: "Naqd", date: "08 Sep 2026", status: "paid" },
  { id: "S-2841", customer: "Eldor Rahimov", amount: 890000, payment: "Karta", date: "07 Sep 2026", status: "paid" },
  { id: "S-2836", customer: "Feruza Nazarova", amount: 640000, payment: "Click", date: "06 Sep 2026", status: "partial" },
  { id: "S-2829", customer: "Bobur Toshmatov", amount: 1250000, payment: "Naqd", date: "05 Sep 2026", status: "paid" },
];

const roleColors = {
  Admin: { bg: "var(--brand-light)", color: "var(--brand)" },
  Manager: { bg: "var(--violet-light)", color: "var(--violet)" },
  Kassir: { bg: "var(--success-light)", color: "var(--success)" },
  Ombor: { bg: "var(--warning-light)", color: "var(--warning)" },
};
const payStatus = {
  paid: { label: "To'landi", bg: "var(--success-light)", color: "var(--success)" },
  partial: { label: "Qisman", bg: "var(--warning-light)", color: "var(--warning)" },
};

export default function EmployeeDetail({ employeeId, onBack }) {
  const { success } = useToast();
  const initial = employees.find((e) => e.id === employeeId) || employees[0];
  const [data, setData] = useState(initial);
  const [tab, setTab] = useState("sales");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({ name: initial.name, role: initial.role, phone: initial.phone, status: initial.status });

  const rc = roleColors[data.role] || { bg: "var(--surface-2)", color: "var(--text-muted)" };

  const saveEdit = () => {
    setData((d) => ({ ...d, name: form.name, role: form.role, phone: form.phone, status: form.status }));
    setShowEdit(false);
    success("Xodim yangilandi", form.name);
  };
  const doDelete = () => {
    setShowDelete(false);
    success("Xodim o'chirildi", data.name);
    if (onBack) onBack();
  };

  const tabs = [
    { key: "sales", label: "Sotuvlar" },
    { key: "activity", label: "Faoliyat" },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl transition-colors hover:opacity-80"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ fontFamily: "'Manrope',sans-serif", color: "var(--text-primary)" }}>
            Xodim profili
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Xodim ma'lumotlari va ko'rsatkichlari
          </p>
        </div>
      </div>

      <div className="grid gap-5 detail-grid" style={{ gridTemplateColumns: "300px 1fr" }}>
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--brand), var(--violet))" }}
            >
              {data.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>{data.name}</div>
            <span className="inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: rc.bg, color: rc.color }}>
              {data.role}
            </span>

            <div className="space-y-3 mt-5 text-left">
              <a
                href={"tel:" + data.phone.replace(/\s/g, "")}
                className="flex items-center gap-3 text-sm transition-opacity hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                <span className="p-2 rounded-lg" style={{ background: "var(--brand-light)" }}>
                  <Phone size={13} style={{ color: "var(--brand)" }} />
                </span>
                {data.phone}
              </a>
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="p-2 rounded-lg" style={{ background: "var(--success-light)" }}>
                  <Clock size={13} style={{ color: "var(--success)" }} />
                </span>
                {data.lastActive}
              </div>
              <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="p-2 rounded-lg" style={{ background: "var(--surface-2)" }}>
                  <Calendar size={13} style={{ color: "var(--text-muted)" }} />
                </span>
                Ro'yxatdan: 01 Yan 2026
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button onClick={() => setShowEdit(true)} className="btn-ghost text-sm justify-center">
                <Edit2 size={14} /> Tahrirlash
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="btn-ghost text-sm justify-center"
                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
              >
                <Trash2 size={14} /> O'chirish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sotuvlar", value: data.sales > 0 ? data.sales + " ta" : "—", icon: ShoppingCart, color: "var(--violet)", bg: "var(--violet-light)" },
              { label: "Daromad", value: data.revenue > 0 ? (data.revenue / 1000000).toFixed(1) + " mln" : "—", icon: TrendingUp, color: "var(--success)", bg: "var(--success-light)" },
              { label: "Holat", value: data.status === "active" ? "Faol" : "Nofaol", icon: UserCog, color: data.status === "active" ? "var(--success)" : "var(--text-muted)", bg: data.status === "active" ? "var(--success-light)" : "var(--surface-2)" },
              { label: "Faollik", value: data.lastActive, icon: Clock, color: "var(--brand)", bg: "var(--brand-light)" },
            ].map((c) => (
              <div key={c.label} className="card p-4">
                <div className="p-2 rounded-xl w-fit mb-2" style={{ background: c.bg }}>
                  <c.icon size={15} style={{ color: c.color }} />
                </div>
                <div className="text-base font-display font-bold" style={{ color: "var(--text-primary)" }}>{c.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-1 px-5 pt-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-4 py-3 text-sm font-medium transition-all"
                style={{
                  color: tab === t.key ? "var(--brand)" : "var(--text-muted)",
                  borderBottom: tab === t.key ? "2px solid var(--brand)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "sales" && (
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--surface-2)" }}>
                  {["ID", "Mijoz", "Summa", "To'lov", "Sana", "Holat"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "var(--text-faint)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesLog.map((o) => {
                  const ps = payStatus[o.status] || payStatus.paid;
                  return (
                    <tr key={o.id} className="border-t table-row-hover" style={{ borderColor: "var(--border-subtle)" }}>
                      <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{o.id}</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{o.customer}</td>
                      <td className="px-5 py-3 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{o.amount.toLocaleString()} so'm</td>
                      <td className="px-5 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{o.payment}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: "var(--text-faint)" }}>{o.date}</td>
                      <td className="px-5 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: ps.bg, color: ps.color }}>{ps.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {tab === "activity" && (
            <div className="p-5 space-y-4">
              {[
                { t: "Yangi sotuv — 485 000 so'm", time: "08 Sep 2026, 14:22", icon: ShoppingCart, color: "var(--brand)" },
                { t: "Kassani yopdi — 5 230 000 so'm", time: "07 Sep 2026, 22:10", icon: CheckCircle, color: "var(--success)" },
                { t: "Tizimga kirdi", time: "07 Sep 2026, 08:55", icon: UserCog, color: "var(--violet)" },
                { t: "Profil yangilandi", time: "01 Sep 2026, 11:00", icon: Edit2, color: "var(--text-muted)" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-2 rounded-xl shrink-0" style={{ background: "var(--surface-2)" }}>
                    <a.icon size={14} style={{ color: a.color }} />
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: "var(--text-primary)" }}>{a.t}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>
          <div className="rounded-3xl p-6 w-full max-w-md slide-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>Xodimni tahrirlash</h2>
              <button onClick={() => setShowEdit(false)} className="p-2 rounded-xl hover:opacity-70" style={{ color: "var(--text-faint)" }}>
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Ism</label>
                <input className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Lavozim</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Admin", "Manager", "Kassir", "Ombor"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setForm({ ...form, role: r })}
                      className="py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: form.role === r ? "var(--brand)" : "var(--surface-2)",
                        color: form.role === r ? "white" : "var(--text-muted)",
                        border: "1px solid " + (form.role === r ? "var(--brand)" : "var(--border)"),
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Telefon</label>
                <input className="input-base" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Holat</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ k: "active", l: "Faol" }, { k: "inactive", l: "Nofaol" }].map((s) => (
                    <button
                      key={s.k}
                      onClick={() => setForm({ ...form, status: s.k })}
                      className="py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: form.status === s.k ? "var(--brand)" : "var(--surface-2)",
                        color: form.status === s.k ? "white" : "var(--text-muted)",
                        border: "1px solid " + (form.status === s.k ? "var(--brand)" : "var(--border)"),
                      }}
                    >
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="btn-ghost flex-1 justify-center">Bekor</button>
              <button onClick={saveEdit} className="btn-primary flex-1 justify-center">
                <Save size={15} /> Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}>
          <div className="rounded-3xl p-6 w-full max-w-sm slide-up" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--danger-light)" }}>
              <Trash2 size={22} style={{ color: "var(--danger)" }} />
            </div>
            <h2 className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>O'chirishni tasdiqlang</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{data.name} xodimini o'chirmoqchimisiz?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className="btn-ghost flex-1 justify-center">Bekor</button>
              <button onClick={doDelete} className="btn-primary flex-1 justify-center" style={{ background: "var(--danger)" }}>
                <Trash2 size={15} /> O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}