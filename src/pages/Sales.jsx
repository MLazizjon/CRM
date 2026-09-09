import './Sales.css';
import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Calendar,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { recentSales } from "../data/mockData";
const statusBadge = {
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
    bg: "var(--border-subtle)",
    color: "var(--text-muted)",
  },
};
const allSales = [
  ...recentSales,
  {
    id: "S-2841",
    customer: "Nodira Xasanova",
    products: 2,
    amount: 560000,
    payment: "Payme",
    date: "06 Sep 2026",
    status: "paid",
  },
  {
    id: "S-2840",
    customer: "Otabek Sobirov",
    products: 7,
    amount: 2340000,
    payment: "Karta",
    date: "06 Sep 2026",
    status: "paid",
  },
  {
    id: "S-2839",
    customer: "Parviz Umarov",
    products: 1,
    amount: 185000,
    payment: "Naqd",
    date: "05 Sep 2026",
    status: "partial",
  },
  {
    id: "S-2838",
    customer: "Rano Abdullayeva",
    products: 3,
    amount: 890000,
    payment: "Click",
    date: "05 Sep 2026",
    status: "paid",
  },
  {
    id: "S-2837",
    customer: "Sanjar Mirzayev",
    products: 4,
    amount: 1200000,
    payment: "Qarz",
    date: "04 Sep 2026",
    status: "debt",
  },
];
export default function Sales({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = allSales.filter((s) => {
    const matchSearch =
      s.customer.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const stats = [
    {
      label: "Jami sotuvlar",
      value: "124 800 000 so'm",
      change: "+12.4%",
      icon: DollarSign,
      color: "var(--brand)",
      bg: "var(--brand-light)",
    },
    {
      label: "Bugun",
      value: "12 480 000 so'm",
      change: "+8.1%",
      icon: TrendingUp,
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    {
      label: "Buyurtmalar",
      value: "1 284 ta",
      change: "+5.3%",
      icon: ShoppingCart,
      color: "var(--violet)",
      bg: "var(--violet-light)",
    },
    {
      label: "Qaytarilgan",
      value: "2 100 000 so'm",
      change: "-1.2%",
      icon: RefreshCw,
      color: "var(--warning)",
      bg: "var(--warning-light)",
    },
  ];
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
            Sotuvlar
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Barcha savdolar va tranzaksiyalar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => onNavigate("sales-new")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%)",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            + Yangi sotuv
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 transition-card"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: s.bg,
                }}
              >
                <s.icon
                  size={16}
                  style={{
                    color: s.color,
                  }}
                />
              </div>
              <span
                className="text-xs font-semibold"
                style={{
                  color: s.change.startsWith("+") ? "var(--success)" : "var(--danger)",
                }}
              >
                {s.change}
              </span>
            </div>
            <div
              className="text-lg font-display font-bold"
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
            className="flex items-center gap-2 flex-1 rounded-xl px-3 py-2 text-sm"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
              maxWidth: 300,
            }}
          >
            <Search
              size={15}
              style={{
                color: "var(--text-faint)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sotuv yoki mijoz qidirish..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {[
              {
                key: "all",
                label: "Barchasi",
              },
              {
                key: "paid",
                label: "To'landi",
              },
              {
                key: "debt",
                label: "Qarz",
              },
              {
                key: "partial",
                label: "Qisman",
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    statusFilter === f.key ? "var(--surface)" : "transparent",
                  color: statusFilter === f.key ? "var(--text-primary)" : "var(--text-muted)",
                  boxShadow:
                    statusFilter === f.key
                      ? "0 1px 3px rgba(15,23,42,0.08)"
                      : "none",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-colors hover:bg-gray-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <Calendar size={14} /> Sana
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "var(--table-stripe)",
              }}
            >
              {[
                "Sotuv ID",
                "Mijoz",
                "Mahsulotlar",
                "Summa",
                "To'lov",
                "Sana",
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
            {filtered.map((sale) => {
              const st = statusBadge[sale.status];
              return (
                <tr
                  key={sale.id}
                  className="border-t hover:bg-blue-50/30 transition-colors"
                  style={{
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <td
                    className="px-5 py-3.5 text-xs font-mono font-semibold"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {sale.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold text-white"
                        style={{
                          background: "var(--brand)",
                          fontSize: "10px",
                        }}
                      >
                        {sale.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {sale.customer}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {sale.products} ta
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {sale.amount.toLocaleString()} so'm
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {sale.payment}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    {sale.date}
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

        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span
            className="text-xs"
            style={{
              color: "var(--text-faint)",
            }}
          >
            Jami {filtered.length} ta sotuv
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 12].map((p, i) => (
              <button
                key={i}
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
    </div>
  );
}
