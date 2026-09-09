import './Returns.css';
import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const returnsList = [
  {
    id: "R-0124",
    saleId: "S-2842",
    customer: "Gulsanam Holiqova",
    product: "Philips LED Chiroq",
    reason: "Nosoz chiqdi",
    amount: 2100000,
    date: "07 Sep 2026",
    status: "approved",
  },
  {
    id: "R-0123",
    saleId: "S-2831",
    customer: "Hamid Ergashev",
    product: "Tefal Tava 28cm",
    reason: "Hajm to'g'ri kelmadi",
    amount: 185000,
    date: "05 Sep 2026",
    status: "pending",
  },
  {
    id: "R-0122",
    saleId: "S-2820",
    customer: "Iroda Mirzayeva",
    product: "Ariel Kukun 3kg",
    reason: "Sifat muammosi",
    amount: 45000,
    date: "03 Sep 2026",
    status: "approved",
  },
  {
    id: "R-0121",
    saleId: "S-2810",
    customer: "Jasur Nazarov",
    product: "Domestos 1L",
    reason: "Noto'g'ri mahsulot",
    amount: 18000,
    date: "01 Sep 2026",
    status: "rejected",
  },
];

const reasonOptions = [
  "Nosoz / ishlamaydi",
  "Sifat muammosi",
  "Hajm/o'lcham to'g'ri kelmadi",
  "Noto'g'ri mahsulot yetkazildi",
  "Mijoz fikri o'zgardi",
  "Boshqa",
];

const statusMap = {
  approved: {
    label: "Qabul qilindi",
    bg: "var(--success-light)",
    color: "var(--success)",
    icon: CheckCircle,
  },
  pending: {
    label: "Kutilmoqda",
    bg: "var(--warning-light)",
    color: "var(--warning)",
    icon: AlertCircle,
  },
  rejected: {
    label: "Rad etildi",
    bg: "var(--danger-light)",
    color: "var(--danger)",
    icon: X,
  },
};

export default function Returns() {
  const { success, info } = useToast();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");

  const filtered = returnsList.filter(
    (r) =>
      r.customer.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalReturned = returnsList
    .filter((r) => r.status === "approved")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-primary-color">
            Qaytarilgan mahsulotlar
          </h1>
          <p className="text-sm mt-0.5 text-muted-color">
            Qaytarilgan tovarlar va refund so'rovlari
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Qaytarish qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami qaytarishlar",
            value: returnsList.length,
            color: "var(--brand)",
          },
          {
            label: "Qabul qilingan",
            value: returnsList.filter((r) => r.status === "approved").length,
            color: "var(--success)",
          },
          {
            label: "Kutilmoqda",
            value: returnsList.filter((r) => r.status === "pending").length,
            color: "var(--warning)",
          },
          {
            label: "Qaytarilgan summa",
            value: (totalReturned / 1000000).toFixed(2) + " mln so'm",
            color: "var(--danger)",
          },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div
              className="text-xl font-display font-bold mb-1"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-faint-color">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-flat rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b-subtle">
          <div className="search-box-wrapper flex items-center gap-2 rounded-xl px-3 py-2.5">
            <Search size={14} className="text-faint-color" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qaytarish qidirish..."
              className="bg-transparent outline-none text-sm flex-1 text-primary-color"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="table-header-row">
              {[
                "ID",
                "Sotuv",
                "Mijoz",
                "Mahsulot",
                "Sabab",
                "Summa",
                "Sana",
                "Holat",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-3 text-xs font-semibold text-faint-color"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const st = statusMap[r.status];
              const Icon = st.icon;
              return (
                <tr key={r.id} className="border-t table-row-hover">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-muted-color">
                    {r.id}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-faint-color">
                    {r.saleId}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-primary-color">
                    {r.customer}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-secondary-color">
                    {r.product}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-color">
                    {r.reason}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-danger-color">
                    -{r.amount.toLocaleString()} so'm
                  </td>
                  <td className="px-5 py-3.5 text-xs text-faint-color">
                    {r.date}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit"
                      style={{
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      <Icon size={10} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            success("Qaytarish qabul qilindi", r.id)
                          }
                          className="px-2 py-1 rounded-lg text-xs font-semibold action-btn-success"
                        >
                          Qabul
                        </button>
                        <button
                          onClick={() => info("Qaytarish rad etildi", r.id)}
                          className="px-2 py-1 rounded-lg text-xs font-semibold action-btn-danger"
                        >
                          Rad
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Portal orqali chiqariladigan modal */}
      {showModal &&
        createPortal(
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-lg text-primary-color">
                    Qaytarish qo'shish
                  </h2>
                  <p className="text-xs mt-0.5 text-muted-color">
                    Qaytarilgan mahsulot ma'lumotlari
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:opacity-70 text-faint-color"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Sotuv ID", placeholder: "S-XXXX" },
                  { label: "Mahsulot nomi", placeholder: "Mahsulot nomi" },
                  { label: "Mijoz", placeholder: "Mijoz ismi" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                      {f.label}
                    </label>
                    <input placeholder={f.placeholder} className="input-base" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                    Sabab
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="input-base"
                  >
                    <option value="">Sabab tanlang</option>
                    {reasonOptions.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-secondary-color">
                    Summa
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="input-base"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-ghost flex-1"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    success("Qaytarish qo'shildi");
                  }}
                  className="btn-primary flex-1 justify-center"
                >
                  <RotateCcw size={14} /> Saqlash
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}