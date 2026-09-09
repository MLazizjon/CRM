import './CustomerDetail.css';
import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Crown,
  ShoppingBag,
  DollarSign,
  CreditCard,
  TrendingUp,
  Edit2,
  Plus,
  CheckCircle,
  Copy,
  Clock,
  Package,
  X,
} from "lucide-react";
import { customers, recentSales } from "../data/mockData";
import { useToast } from "../context/ToastContext";
const activityLog = [
  {
    type: "sale",
    text: "Yangi sotuv amalga oshirildi — 485 000 so'm",
    time: "08 Sep 2026, 14:22",
    icon: ShoppingBag,
    color: "var(--brand)",
  },
  {
    type: "payment",
    text: "To'lov qabul qilindi — 150 000 so'm",
    time: "06 Sep 2026, 10:15",
    icon: CheckCircle,
    color: "var(--success)",
  },
  {
    type: "debt",
    text: "Qarzdorlik yaratildi — 320 000 so'm",
    time: "03 Sep 2026, 16:40",
    icon: CreditCard,
    color: "var(--danger)",
  },
  {
    type: "sale",
    text: "Yangi sotuv — 890 000 so'm",
    time: "01 Sep 2026, 11:05",
    icon: ShoppingBag,
    color: "var(--brand)",
  },
  {
    type: "register",
    text: "Mijoz tizimga ro'yxatdan o'tdi",
    time: "15 Aug 2026, 09:00",
    icon: Plus,
    color: "var(--violet)",
  },
];
export default function CustomerDetail({ customerId, onBack }) {
  const customer = customers.find((c) => c.id === customerId) || customers[0];
  const { success } = useToast();
  const [tab, setTab] = useState("purchases");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const statusMap = {
    vip: {
      label: "VIP",
      bg: "var(--violet-light)",
      color: "var(--violet)",
    },
    debtor: {
      label: "Qarzdor",
      bg: "var(--danger-light)",
      color: "var(--danger)",
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
  const st = statusMap[customer.status];
  const handleCopy = (val, label) => {
    navigator.clipboard?.writeText(val);
    success(`${label} nusxalandi`);
  };
  const handlePayment = () => {
    success(
      "To'lov qabul qilindi",
      `${customer.name} — ${Number(payAmount).toLocaleString()} so'm`,
    );
    setShowPaymentModal(false);
    setPayAmount("");
  };
  const tabs = [
    {
      key: "purchases",
      label: "Xaridlar",
    },
    {
      key: "debt",
      label: "Qarzdorlik",
    },
    {
      key: "payments",
      label: "To'lovlar",
    },
    {
      key: "activity",
      label: "Faoliyat",
    },
  ];
  return (
    <div className="space-y-6 fade-in">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl transition-colors hover:opacity-80"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Mijoz profili
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Mijoz tarixi va batafsil ma'lumotlari
          </p>
        </div>
      </div>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "300px 1fr",
        }}
      >
        {/* Left panel — profile card */}
        <div className="space-y-4">
          <div className="card p-5 text-center">
            <div className="relative inline-block mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto"
                style={{
                  background:
                    customer.status === "vip"
                      ? "linear-gradient(135deg, var(--violet), var(--violet))"
                      : "linear-gradient(135deg, var(--brand), var(--brand-hover))",
                }}
              >
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              {customer.status === "vip" && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--warning)",
                  }}
                >
                  <Crown size={13} color="white" />
                </div>
              )}
            </div>

            <div
              className="font-display font-bold text-lg mb-1"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {customer.name}
            </div>
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: st.bg,
                color: st.color,
              }}
            >
              {customer.status === "vip" && <Crown size={10} />}
              {st.label}
            </span>

            <div className="mt-5 space-y-3 text-left">
              {[
                {
                  icon: Phone,
                  label: customer.phone,
                  action: () => handleCopy(customer.phone, "Telefon"),
                },
                {
                  icon: MapPin,
                  label: customer.region,
                  action: undefined,
                },
                {
                  icon: Calendar,
                  label: `Ro'yxatdan: ${customer.lastPurchase}`,
                  action: undefined,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "var(--surface-2)",
                    }}
                  >
                    <item.icon
                      size={14}
                      style={{
                        color: "var(--text-muted)",
                      }}
                    />
                  </div>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.action && (
                    <button
                      onClick={item.action}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <Copy
                        size={12}
                        style={{
                          color: "var(--text-faint)",
                        }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary flex-1 justify-center text-xs"
                style={{
                  background: "var(--success)",
                  boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
                }}
              >
                <CheckCircle size={13} /> To'lov
              </button>
              <button className="btn-ghost text-xs flex-1 justify-center">
                <Edit2 size={13} /> Tahrirlash
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-4 space-y-3">
            {[
              {
                icon: ShoppingBag,
                label: "Jami xaridlar",
                value: `${customer.purchases} ta`,
                color: "var(--brand)",
                bg: "var(--brand-light)",
              },
              {
                icon: DollarSign,
                label: "Jami xarajat",
                value: `${customer.spent.toLocaleString()} so'm`,
                color: "var(--success)",
                bg: "var(--success-light)",
              },
              {
                icon: CreditCard,
                label: "Joriy qarz",
                value:
                  customer.debt > 0
                    ? `${customer.debt.toLocaleString()} so'm`
                    : "—",
                color: customer.debt > 0 ? "var(--danger)" : "var(--success)",
                bg:
                  customer.debt > 0
                    ? "var(--danger-light)"
                    : "var(--success-light)",
              },
              {
                icon: TrendingUp,
                label: "O'rtacha xarid",
                value: `${Math.round(customer.spent / Math.max(customer.purchases, 1)).toLocaleString()} so'm`,
                color: "var(--violet)",
                bg: "var(--violet-light)",
              },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: s.bg,
                  }}
                >
                  <s.icon
                    size={14}
                    style={{
                      color: s.color,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — tabs */}
        <div className="card-flat rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div
            className="flex items-center gap-1 px-5 py-3"
            style={{
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background:
                    tab === t.key ? "var(--brand-light)" : "transparent",
                  color: tab === t.key ? "var(--brand)" : "var(--text-muted)",
                  fontWeight: tab === t.key ? 600 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="fade-in">
            {tab === "purchases" && (
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      background: "var(--table-stripe)",
                    }}
                  >
                    {[
                      "ID",
                      "Mahsulotlar",
                      "Summa",
                      "To'lov",
                      "Sana",
                      "Holat",
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
                  {recentSales.map((s) => {
                    const statusMap2 = {
                      paid: {
                        label: "To'landi",
                        bg: "var(--success-light)",
                        color: "var(--success)",
                      },
                      debt: {
                        label: "Qarz",
                        bg: "var(--danger-light)",
                        color: "var(--danger)",
                      },
                      partial: {
                        label: "Qisman",
                        bg: "var(--warning-light)",
                        color: "var(--warning)",
                      },
                      returned: {
                        label: "Qaytarilgan",
                        bg: "var(--surface-2)",
                        color: "var(--text-muted)",
                      },
                    };
                    const ss = statusMap2[s.status];
                    return (
                      <tr
                        key={s.id}
                        className="border-t table-row-hover row-anim"
                        style={{
                          borderColor: "var(--border-subtle)",
                        }}
                      >
                        <td
                          className="px-5 py-3.5 font-mono text-xs font-semibold"
                          style={{
                            color: "var(--text-muted)",
                          }}
                        >
                          {s.id}
                        </td>
                        <td
                          className="px-5 py-3.5 text-sm"
                          style={{
                            color: "var(--text-secondary)",
                          }}
                        >
                          {s.products} ta mahsulot
                        </td>
                        <td
                          className="px-5 py-3.5 text-sm font-semibold"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {s.amount.toLocaleString()} so'm
                        </td>
                        <td
                          className="px-5 py-3.5 text-sm"
                          style={{
                            color: "var(--text-secondary)",
                          }}
                        >
                          {s.payment}
                        </td>
                        <td
                          className="px-5 py-3.5 text-xs"
                          style={{
                            color: "var(--text-faint)",
                          }}
                        >
                          {s.date}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background: ss.bg,
                              color: ss.color,
                            }}
                          >
                            {ss.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tab === "debt" && (
              <div className="p-5">
                {customer.debt > 0 ? (
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-2xl"
                      style={{
                        background: "var(--danger-light)",
                        border: "1px solid var(--danger-border, var(--danger))",
                      }}
                    >
                      <div
                        className="text-sm font-semibold mb-1"
                        style={{
                          color: "var(--danger)",
                        }}
                      >
                        Joriy qarzdorlik
                      </div>
                      <div
                        className="text-2xl font-display font-bold"
                        style={{
                          fontFamily: "'Manrope',sans-serif",
                          color: "var(--danger)",
                        }}
                      >
                        {customer.debt.toLocaleString()} so'm
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Qarz yaratilgan sana",
                          value: "03 Sep 2026",
                        },
                        {
                          label: "To'lov muddati",
                          value: "20 Sep 2026",
                        },
                        {
                          label: "Kechikish",
                          value: "0 kun",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between py-2"
                          style={{
                            borderBottom: "1px solid var(--border-subtle)",
                          }}
                        >
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--text-muted)",
                            }}
                          >
                            {item.label}
                          </span>
                          <span
                            className="text-sm font-medium"
                            style={{
                              color: "var(--text-primary)",
                            }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="btn-primary w-full justify-center"
                      style={{
                        background: "var(--success)",
                      }}
                    >
                      <CheckCircle size={15} /> To'lov qabul qilish
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
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
                      Qarzdorlik yo'q
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      Bu mijozning hech qanday qarzdorligi mavjud emas
                    </p>
                  </div>
                )}
              </div>
            )}

            {tab === "payments" && (
              <div className="p-5">
                <div className="space-y-3">
                  {[
                    {
                      amount: 150000,
                      method: "Naqd",
                      date: "06 Sep 2026",
                      status: "success",
                    },
                    {
                      amount: 250000,
                      method: "Karta",
                      date: "25 Aug 2026",
                      status: "success",
                    },
                    {
                      amount: 500000,
                      method: "Click",
                      date: "10 Aug 2026",
                      status: "success",
                    },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl"
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            background: "var(--success-light)",
                          }}
                        >
                          <CheckCircle
                            size={16}
                            style={{
                              color: "var(--success)",
                            }}
                          />
                        </div>
                        <div>
                          <div
                            className="text-sm font-semibold"
                            style={{
                              color: "var(--text-primary)",
                            }}
                          >
                            {p.amount.toLocaleString()} so'm
                          </div>
                          <div
                            className="text-xs"
                            style={{
                              color: "var(--text-faint)",
                            }}
                          >
                            {p.method} · {p.date}
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: "var(--success-light)",
                          color: "var(--success)",
                        }}
                      >
                        Qabul qilindi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "activity" && (
              <div className="p-5">
                <div className="relative pl-6 space-y-0">
                  <div
                    className="absolute left-2.5 top-4 bottom-4 w-0.5"
                    style={{
                      background: "var(--border)",
                    }}
                  />
                  {activityLog.map((item, i) => (
                    <div key={i} className="relative pb-5">
                      <div
                        className="absolute left-[-22px] w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          background: item.color,
                          top: 2,
                        }}
                      >
                        <item.icon size={10} color="white" />
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.text}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock
                          size={11}
                          style={{
                            color: "var(--text-faint)",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--text-faint)",
                          }}
                        >
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment modal */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            className="rounded-3xl p-6 w-full max-w-sm slide-up"
            style={{
              background: "var(--surface)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                className="font-display font-bold text-lg"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                To'lov qabul qilish
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-xl hover:opacity-70"
                style={{
                  color: "var(--text-faint)",
                }}
              >
                <X size={16} />
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
                  Miqdor
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="input-base"
                  placeholder="0"
                />
              </div>
              <button
                onClick={handlePayment}
                disabled={!payAmount}
                className="btn-primary w-full justify-center"
                style={{
                  background: "var(--success)",
                  opacity: !payAmount ? 0.5 : 1,
                }}
              >
                <CheckCircle size={15} /> Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
