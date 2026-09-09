import './DebtManagement.css';
import { useState } from "react";
import {
  Search,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  Users,
  X,
  ChevronDown,
  Phone,
  Copy,
} from "lucide-react";
import { customers } from "../data/mockData";
import { useToast } from "../context/ToastContext";
const debtors = customers
  .filter((c) => c.debt > 0)
  .map((c) => ({
    ...c,
    paid: Math.floor(c.spent * 0.08),
    dueDate: "20 Sep 2026",
    overdue: c.debt > 300000,
    daysPast: c.debt > 300000 ? Math.floor(Math.random() * 30 + 5) : 0,
  }));
const allDebts = [
  ...debtors,
  {
    id: 10,
    name: "Timur Sobirov",
    phone: "+998 90 111 22 33",
    purchases: 5,
    spent: 1200000,
    debt: 180000,
    paid: 60000,
    dueDate: "25 Sep 2026",
    overdue: false,
    daysPast: 0,
    lastPurchase: "02 Sep 2026",
    status: "debtor",
    region: "Toshkent",
  },
  {
    id: 11,
    name: "Umida Xoliqova",
    phone: "+998 91 222 33 44",
    purchases: 2,
    spent: 450000,
    debt: 90000,
    paid: 20000,
    dueDate: "15 Sep 2026",
    overdue: true,
    daysPast: 7,
    lastPurchase: "01 Sep 2026",
    status: "debtor",
    region: "Andijon",
  },
  {
    id: 12,
    name: "Vohid Tursunov",
    phone: "+998 93 333 44 55",
    purchases: 9,
    spent: 2800000,
    debt: 560000,
    paid: 200000,
    dueDate: "10 Sep 2026",
    overdue: true,
    daysPast: 22,
    lastPurchase: "28 Aug 2026",
    status: "debtor",
    region: "Toshkent",
  },
  {
    id: 13,
    name: "Xurshid Nishonov",
    phone: "+998 94 444 55 66",
    purchases: 3,
    spent: 620000,
    debt: 145000,
    paid: 50000,
    dueDate: "30 Sep 2026",
    overdue: false,
    daysPast: 0,
    lastPurchase: "05 Sep 2026",
    status: "debtor",
    region: "Samarqand",
  },
];
function PaymentModal({ debtor, onClose, onPay }) {
  const [amount, setAmount] = useState(debtor.debt.toString());
  const [method, setMethod] = useState("naqd");
  const [note, setNote] = useState("");
  const presets = [
    debtor.debt,
    Math.round(debtor.debt * 0.5),
    Math.round(debtor.debt * 0.25),
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        className="rounded-3xl p-6 w-full max-w-md slide-up"
        style={{
          background: "var(--surface)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2
              className="font-display font-bold text-lg"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              To'lov qabul qilish
            </h2>
            <p
              className="text-sm mt-0.5"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Qarzdorlik:{" "}
              <strong
                style={{
                  color: "var(--danger)",
                }}
              >
                {debtor.debt.toLocaleString()} so'm
              </strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:opacity-70 transition-opacity"
            style={{
              color: "var(--text-faint)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Debtor info */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{
              background: "var(--brand)",
            }}
          >
            {debtor.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <div
              className="font-semibold text-sm"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {debtor.name}
            </div>
            <div
              className="text-xs"
              style={{
                color: "var(--text-muted)",
              }}
            >
              {debtor.phone}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              To'lov miqdori
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-base pr-16"
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--brand)",
                }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                so'm
              </span>
            </div>
            {/* Preset amounts */}
            <div className="flex items-center gap-2 mt-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setAmount(p.toString())}
                  className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  style={{
                    background:
                      amount === p.toString()
                        ? "var(--brand-light)"
                        : "var(--surface-2)",
                    color:
                      amount === p.toString()
                        ? "var(--brand)"
                        : "var(--text-muted)",
                    border: `1px solid ${amount === p.toString() ? "var(--brand-border)" : "var(--border)"}`,
                  }}
                >
                  {i === 0 ? "To'liq" : i === 1 ? "50%" : "25%"}
                  <br />
                  <span className="font-normal">{p.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              To'lov usuli
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["naqd", "karta", "click", "payme"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className="py-2.5 rounded-xl text-xs font-semibold capitalize transition-all"
                  style={{
                    background:
                      method === m ? "var(--brand)" : "var(--surface-2)",
                    color: method === m ? "white" : "var(--text-muted)",
                    border: `1px solid ${method === m ? "var(--brand)" : "var(--border)"}`,
                  }}
                >
                  {m === "naqd"
                    ? "💵 Naqd"
                    : m === "karta"
                      ? "💳 Karta"
                      : m === "click"
                        ? "🔵 Click"
                        : "🟢 Payme"}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label
              className="block text-xs font-semibold mb-1.5"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Izoh (ixtiyoriy)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Qo'shimcha izoh..."
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">
            Bekor qilish
          </button>
          <button
            onClick={() => onPay(Number(amount), method)}
            className="btn-primary flex-1 justify-center"
            style={{
              background: "var(--success)",
              boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
            }}
          >
            <CheckCircle size={15} />
            To'lovni tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
}
export default function DebtManagement({ onNavigate }) {
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState({});
  const handlePay = (amount, method) => {
    if (!selected) return;
    setPaid((prev) => ({
      ...prev,
      [selected.id]: (prev[selected.id] || 0) + amount,
    }));
    setSelected(null);
    success(
      "To'lov qabul qilindi",
      `${selected.name} — ${amount.toLocaleString()} so'm (${method})`,
    );
  };
  const filtered = allDebts.filter((d) => {
    const remaining = d.debt - (paid[d.id] || 0);
    if (remaining <= 0) return false;
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search);
    const matchFilter =
      filter === "all" ? true : filter === "overdue" ? d.overdue : !d.overdue;
    return matchSearch && matchFilter;
  });
  const totalDebt = allDebts.reduce(
    (s, d) => s + d.debt - (paid[d.id] || 0),
    0,
  );
  const totalPaid = Object.values(paid).reduce((s, v) => s + v, 0);
  const overdueAmt = allDebts
    .filter((d) => d.overdue)
    .reduce((s, d) => s + d.debt - (paid[d.id] || 0), 0);
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Qarzdorlik boshqaruvi
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Mijozlar qarzdorligi va to'lovlar nazorati
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Jami qarzdorlik",
            value: totalDebt,
            icon: CreditCard,
            color: "var(--danger)",
            bg: "var(--danger-light)",
            fmt: true,
          },
          {
            label: "Bugun to'landi",
            value: totalPaid,
            icon: CheckCircle,
            color: "var(--success)",
            bg: "var(--success-light)",
            fmt: true,
          },
          {
            label: "Muddati o'tgan",
            value: overdueAmt,
            icon: AlertTriangle,
            color: "var(--warning)",
            bg: "var(--warning-light)",
            fmt: true,
          },
          {
            label: "Qarzdor mijozlar",
            value: filtered.length,
            icon: Users,
            color: "var(--brand)",
            bg: "var(--brand-light)",
            fmt: false,
          },
        ].map((k) => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: k.bg,
                }}
              >
                <k.icon
                  size={16}
                  style={{
                    color: k.color,
                  }}
                />
              </div>
            </div>
            <div
              className="text-xl font-display font-bold count-up"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {k.fmt ? (k.value / 1000000).toFixed(2) + " mln" : k.value}
            </div>
            <div
              className="text-xs mt-1"
              style={{
                color: "var(--text-faint)",
              }}
            >
              {k.label}
            </div>
          </div>
        ))}
      </div>

      {/* Overdue banner */}
      {allDebts.some((d) => d.overdue) && (
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{
            background: "var(--warning-light)",
            border: "1px solid var(--warning)",
            borderColor: "var(--warning-border, var(--warning))",
          }}
        >
          <AlertTriangle
            size={18}
            style={{
              color: "var(--warning)",
            }}
          />
          <div>
            <span
              className="text-sm font-semibold"
              style={{
                color: "var(--warning-strong, var(--warning))",
              }}
            >
              {
                allDebts.filter(
                  (d) => d.overdue && d.debt - (paid[d.id] || 0) > 0,
                ).length
              }{" "}
              ta mijozning to'lov muddati o'tgan.
            </span>
            <span
              className="text-sm ml-1"
              style={{
                color: "var(--warning-strong, var(--warning))",
              }}
            >
              Ular bilan bog'laning.
            </span>
          </div>
        </div>
      )}

      {/* Table card */}
      <div className="card-flat overflow-hidden rounded-2xl">
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-wrap"
          style={{
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1 min-w-48"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              maxWidth: 300,
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
              placeholder="Ism yoki telefon..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{
                color: "var(--text-primary)",
              }}
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
              {
                key: "all",
                label: "Barchasi",
              },
              {
                key: "overdue",
                label: "Muddati o'tgan",
              },
              {
                key: "upcoming",
                label: "Kelayotgan",
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    filter === f.key ? "var(--surface)" : "transparent",
                  color:
                    filter === f.key
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  boxShadow: filter === f.key ? "var(--shadow-xs)" : "none",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span
            className="text-xs ml-auto"
            style={{
              color: "var(--text-faint)",
            }}
          >
            {filtered.length} ta natija
          </span>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "var(--table-stripe)",
              }}
            >
              {[
                "Mijoz",
                "Telefon",
                "Jami qarz",
                "To'langan",
                "Qolgan",
                "Muddat",
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                      style={{
                        background: "var(--success-light)",
                      }}
                    >
                      <CheckCircle
                        size={24}
                        style={{
                          color: "var(--success)",
                        }}
                      />
                    </div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      Hamma to'lovlar qabul qilingan!
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      Hozircha faol qarzdorlik yo'q
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((d) => {
                const remaining = d.debt - (paid[d.id] || 0);
                const paidAmt = d.paid + (paid[d.id] || 0);
                const progress = Math.min(
                  (paidAmt / (d.debt + d.paid)) * 100,
                  100,
                );
                return (
                  <tr onClick={() => onNavigate && onNavigate("debt-" + d.id)}
                    key={d.id}
                    className="border-t table-row-hover row-anim"
                    style={{ cursor: "pointer", borderColor: "var(--border-subtle)",
                    }}
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{
                            background: d.overdue
                              ? "var(--danger)"
                              : "var(--brand)",
                          }}
                        >
                          {d.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div
                            className="text-sm font-semibold"
                            style={{
                              color: "var(--text-primary)",
                            }}
                          >
                            {d.name}
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{
                              color: "var(--text-faint)",
                            }}
                          >
                            {d.region}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-sm font-mono"
                          style={{
                            color: "var(--text-secondary)",
                          }}
                        >
                          {d.phone}
                        </span>
                        <a
                          href={"tel:" + d.phone.replace(/\s/g, "")}
                          className="hover:opacity-70 transition-opacity"
                          title="Qo'ng'iroq qilish"
                        >
                          <Phone size={12} style={{ color: "var(--brand)" }} />
                        </a>
                        <button className="hover:opacity-70 transition-opacity" onClick={() => navigator.clipboard && navigator.clipboard.writeText(d.phone)}>
                          <Copy
                            size={11}
                            style={{
                              color: "var(--text-faint)",
                            }}
                          />
                        </button>
                      </div>
                    </td>

                    {/* Total debt */}
                    <td
                      className="px-5 py-4 text-sm font-semibold"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {(d.debt + d.paid).toLocaleString()} so'm
                    </td>

                    {/* Paid */}
                    <td className="px-5 py-4">
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{
                            color: "var(--success)",
                          }}
                        >
                          {paidAmt.toLocaleString()} so'm
                        </div>
                        <div
                          className="w-20 h-1 rounded-full mt-1.5 overflow-hidden"
                          style={{
                            background: "var(--border)",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              background: "var(--success)",
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Remaining */}
                    <td
                      className="px-5 py-4 text-sm font-bold"
                      style={{
                        color: "var(--danger)",
                      }}
                    >
                      {remaining.toLocaleString()} so'm
                    </td>

                    {/* Due date */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={12}
                          style={{
                            color: d.overdue
                              ? "var(--danger)"
                              : "var(--text-faint)",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color: d.overdue
                              ? "var(--danger)"
                              : "var(--text-secondary)",
                          }}
                        >
                          {d.dueDate}
                          {d.overdue && (
                            <span className="ml-1 font-semibold">
                              ({d.daysPast}k kechikdi)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: d.overdue
                            ? "var(--danger-light)"
                            : "var(--warning-light)",
                          color: d.overdue ? "var(--danger)" : "var(--warning)",
                        }}
                      >
                        {d.overdue ? "Muddati o'tgan" : "Kutilmoqda"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(d)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                          style={{
                            background: "var(--success)",
                            boxShadow: "0 2px 6px rgba(16,185,129,0.25)",
                          }}
                        >
                          <CheckCircle size={12} /> To'lov
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-medium border hover:opacity-80 transition-opacity"
                          style={{
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <Phone size={12} /> Qo'ng'iroq
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <PaymentModal
          debtor={selected}
          onClose={() => setSelected(null)}
          onPay={handlePay}
        />
      )}
    </div>
  );
}
