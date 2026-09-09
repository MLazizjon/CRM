import React, { useState } from "react";
import "./Customers.css";
import {
  Search,
  Plus,
  Crown,
  UserX,
  Copy,
  MoreHorizontal,
  Users,
  CreditCard,
  X,
  UserPlus,
} from "lucide-react";
import { customers as initialCustomers } from "../data/mockData";
import { useToast } from "../context/ToastContext";

const statusMap = {
  vip: {
    label: "VIP",
    bg: "var(--violet-light)",
    color: "var(--violet)",
    icon: Crown,
  },
  debtor: {
    label: "Qarzdor",
    bg: "var(--danger-light)",
    color: "var(--danger)",
    icon: UserX,
  },
  active: {
    label: "Faol",
    bg: "var(--success-light)",
    color: "var(--success)",
  },
  regular: {
    label: "Oddiy",
    bg: "var(--surface-2)",
    color: "var(--text-muted)",
  },
};

export default function Customers({ filter, onNavigate }) {
  const { success } = useToast();
  const [customerList, setCustomerList] = useState(initialCustomers || []);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(
    filter === "vip" ? "vip" : filter === "debt" ? "debtor" : "all"
  );

  // Modal holati
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "Toshkent",
    status: "regular",
    debt: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      region: formData.region,
      status: formData.status,
      purchases: 0,
      spent: 0,
      debt: Number(formData.debt) || 0,
      lastPurchase: "Hali xarid qilmadi",
    };

    setCustomerList([newCustomer, ...customerList]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      phone: "",
      region: "Toshkent",
      status: "regular",
      debt: 0,
    });
    if (success) success("Yangi mijoz muvaffaqiyatli qo'shildi!");
  };

  const filtered = customerList.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) || c.phone.includes(search);
    const matchTab = tab === "all" || c.status === tab;
    return matchSearch && matchTab;
  });

  const totalDebt = customerList
    .filter((c) => c.debt > 0)
    .reduce((s, c) => s + c.debt, 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Sarlavha bo'limi */}
      <div className="flex items-center justify-between relative w-full">
        <div>
          <h1
            className="font-bold text-2xl"
            style={{
              fontFamily: "'Manrope', sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Mijozlar
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            CRM — mijozlar bazasi va tarixi
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-sm cursor-pointer shrink-0"
        >
          <Plus size={15} /> Mijoz qo'shish
        </button>
      </div>

      {/* Analitika kartalari */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami mijozlar",
            value: customerList.length,
            icon: Users,
            color: "var(--brand)",
            bg: "var(--brand-light)",
          },
          {
            label: "VIP mijozlar",
            value: customerList.filter((c) => c.status === "vip").length,
            icon: Crown,
            color: "var(--violet)",
            bg: "var(--violet-light)",
          },
          {
            label: "Qarzdor",
            value: customerList.filter((c) => c.debt > 0).length,
            icon: UserX,
            color: "var(--danger)",
            bg: "var(--danger-light)",
          },
          {
            label: "Jami qarzdorlik",
            value: (totalDebt / 1000000).toFixed(2) + " mln so'm",
            icon: CreditCard,
            color: "var(--warning)",
            bg: "var(--warning-light)",
          },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div
              className="p-2.5 rounded-xl w-fit mb-3"
              style={{ background: s.bg }}
            >
              <s.icon size={17} style={{ color: s.color }} />
            </div>
            <div
              className="text-xl font-bold"
              style={{
                fontFamily: "'Manrope', sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {s.value}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-faint)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Qidiruv va Filter jadvali */}
      <div className="card-flat rounded-2xl overflow-hidden">
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              minWidth: 260,
            }}
          >
            <Search size={14} style={{ color: "var(--text-faint)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki telefon..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            {[
              { key: "all", label: "Barchasi" },
              { key: "vip", label: "VIP" },
              { key: "debtor", label: "Qarzdorlar" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: tab === t.key ? "var(--surface)" : "transparent",
                  color:
                    tab === t.key
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  boxShadow: tab === t.key ? "var(--shadow-xs)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jadval */}
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--table-stripe)" }}>
              {[
                "Mijoz",
                "Telefon",
                "Xaridlar",
                "Jami xarajat",
                "Qarzdorlik",
                "So'nggi xarid",
                "Holat",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-3 text-xs font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const st = statusMap[c.status] || statusMap.regular;
              const StatusIcon = st.icon;
              return (
                <tr
                  key={c.id}
                  className="border-t table-row-hover row-anim"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{
                          background:
                            c.status === "vip"
                              ? "linear-gradient(135deg, var(--violet), var(--violet))"
                              : "var(--brand)",
                        }}
                      >
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <button
                          onClick={() => onNavigate?.("customer-" + c.id)}
                          className="text-sm font-semibold hover:underline cursor-pointer"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {c.name}
                          {c.status === "vip" && (
                            <Crown
                              size={11}
                              className="inline ml-1.5"
                              style={{ color: "var(--warning)" }}
                            />
                          )}
                        </button>
                        <div
                          className="text-xs"
                          style={{ color: "var(--text-faint)" }}
                        >
                          {c.region}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-sm font-mono"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {c.phone}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(c.phone);
                          if (success) success("Telefon nusxalandi");
                        }}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <Copy
                          size={11}
                          style={{ color: "var(--text-faint)" }}
                        />
                      </button>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {c.purchases} ta
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.spent.toLocaleString()} so'm
                  </td>
                  <td className="px-5 py-3.5">
                    {c.debt > 0 ? (
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--danger)" }}
                      >
                        {c.debt.toLocaleString()} so'm
                      </span>
                    ) : (
                      <span
                        className="text-sm"
                        style={{ color: "var(--success)" }}
                      >
                        —
                      </span>
                    )}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {c.lastPurchase}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                      style={{
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      {StatusIcon && <StatusIcon size={10} />}
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      className="p-1.5 rounded-lg hover:opacity-70 transition-opacity cursor-pointer"
                      style={{ color: "var(--text-faint)" }}
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
            Jami {filtered.length} ta mijoz
          </span>
        </div>
      </div>

      {/* Modal Oynasi */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-light">
                  <UserPlus size={18} style={{ color: "var(--brand)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Yangi mijoz qo'shish</h3>
                  <p className="text-xs text-muted">
                    Mijoz ma'lumotlarini kiriting
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="modal-body">
              <div className="form-group">
                <label>F.I.SH (Ismi va Familiyasi)</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Masalan: Ali Valiyev"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Telefon raqami</label>
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Viloyat / Hudud</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                  >
                    <option value="Toshkent">Toshkent</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Farg'ona">Farg'ona</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Namangan">Namangan</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Xorazm">Xorazm</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mijoz maqomi (Status)</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="regular">Oddiy</option>
                    <option value="active">Faol</option>
                    <option value="vip">VIP</option>
                    <option value="debtor">Qarzdor</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Boshlang'ich qarzdorlik (so'mda)</label>
                <input
                  type="number"
                  name="debt"
                  placeholder="0"
                  value={formData.debt}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Bekor qilish
                </button>
                <button type="submit" className="btn-primary">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}