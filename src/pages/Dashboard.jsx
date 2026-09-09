import './Dashboard.css';
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Download,
  Boxes,
} from "lucide-react";
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  salesData,
  monthlyData,
  topProducts,
  lowStockItems,
  recentSales,
} from "../data/mockData";

const fmt = (n) => {
  if (n === null || n === undefined) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + " mln";
  if (n >= 1000) return (n / 1000).toFixed(0) + " ming";
  return n.toLocaleString();
};

const fmtFull = (n) => n.toLocaleString() + " so'm";

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

const stockStatus = {
  critical: {
    label: "Tugagan",
    bg: "var(--danger-light)",
    color: "var(--danger)",
  },
  low: {
    label: "Kam qolgan",
    bg: "var(--warning-light)",
    color: "var(--warning)",
  },
  ok: {
    label: "Yetarli",
    bg: "var(--success-light)",
    color: "var(--success)",
  },
};

const KpiCard = ({ icon: Icon, label, value, change, sub, color, bg }) => (
  <div
    className="rounded-2xl p-5 transition-card cursor-default"
    style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="p-2.5 rounded-xl"
        style={{
          background: bg,
        }}
      >
        <Icon
          size={18}
          style={{
            color,
          }}
        />
      </div>
      <span
        className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full`}
        style={{
          background: change >= 0 ? "var(--success-light)" : "var(--danger-light)",
          color: change >= 0 ? "var(--success)" : "var(--danger)",
        }}
      >
        {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {Math.abs(change)}%
      </span>
    </div>
    <div className="mb-1">
      <div
        className="text-2xl font-display font-bold leading-none count-up"
        style={{
          fontFamily: "'Manrope',sans-serif",
          color: "var(--text-primary)",
        }}
      >
        {value}
      </div>
    </div>
    <div
      className="text-sm font-medium mb-0.5"
      style={{
        color: "var(--text-secondary)",
      }}
    >
      {label}
    </div>
    <div
      className="text-xs"
      style={{
        color: "var(--text-faint)",
      }}
    >
      {sub}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 text-xs shadow-lg"
      style={{
        background: "var(--text-primary)",
        color: "var(--surface-2)",
        minWidth: 140,
      }}
    >
      <div
        className="font-semibold mb-2"
        style={{
          color: "var(--text-faint)",
        }}
      >
        {label}
      </div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4 mb-1">
          <span
            style={{
              color: entry.color,
            }}
          >
            {entry.name}
          </span>
          <span className="font-semibold">{fmt(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard({ onNavigate }) {
  const [range, setRange] = useState("7d");

  const data = range === "7d" || range === "30d" ? salesData : monthlyData;

  const ranges = [
    {
      key: "7d",
      label: "7 kun",
    },
    {
      key: "30d",
      label: "30 kun",
    },
    {
      key: "3m",
      label: "3 oy",
    },
    {
      key: "1y",
      label: "1 yil",
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Xush kelibsiz, Admin 👋
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Bugungi do'kon faoliyati haqida qisqacha ma'lumot.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          icon={ShoppingBag}
          label="Bugungi savdo"
          value="12 480 000 so'm"
          change={12.8}
          sub="Kechagiga nisbatan"
          color="var(--brand)"
          bg="var(--brand-light)"
        />
        <KpiCard
          icon={ArrowUpRight}
          label="Buyurtmalar"
          value="128 ta"
          change={8.4}
          sub="Bugun qabul qilingan"
          color="var(--violet)"
          bg="var(--violet-light)"
        />
        <KpiCard
          icon={TrendingUp}
          label="Sof foyda"
          value="4 250 000 so'm"
          change={15.2}
          sub="Bugun hisoblangan"
          color="var(--success)"
          bg="var(--success-light)"
        />
        <KpiCard
          icon={CreditCard}
          label="Qarzdorlik"
          value="8 720 000 so'm"
          change={-4.6}
          sub="Jami qarzdorlar: 14"
          color="var(--danger)"
          bg="var(--danger-light)"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Main chart */}
        <div
          className="col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="font-display font-semibold text-base"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                Sotuv ko'rsatkichlari
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{
                  color: "var(--text-faint)",
                }}
              >
                Daromad, foyda va xarajatlar
              </p>
            </div>
            <div
              className="flex items-center gap-1 rounded-xl p-1"
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--border)",
              }}
            >
              {ranges.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: range === r.key ? "var(--surface)" : "transparent",
                    color: range === r.key ? "var(--text-primary)" : "var(--text-muted)",
                    boxShadow:
                      range === r.key
                        ? "0 1px 4px rgba(15,23,42,0.08)"
                        : "none",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart
              data={data}
              margin={{
                top: 15,
                right: 10,
                bottom: 0,
                left: 10,
              }}
            >
              <defs>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "var(--text-faint)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{
                  fontSize: 11,
                  fill: "var(--text-faint)",
                }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Daromad"
                stroke="var(--brand)"
                fill="url(#revenue)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Foyda"
                stroke="var(--success)"
                fill="url(#profit)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Xarajatlar"
                stroke="var(--warning)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-3">
            {[
              {
                color: "var(--brand)",
                label: "Daromad",
              },
              {
                color: "var(--success)",
                label: "Foyda",
              },
              {
                color: "var(--warning)",
                label: "Xarajatlar",
                dashed: true,
              },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div
                  className="w-6 h-0.5 rounded"
                  style={{
                    background: l.color,
                    borderStyle: l.dashed ? "dashed" : "solid",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-display font-semibold text-base"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              Eng ko'p sotilgan
            </h2>
            <button
              onClick={() => onNavigate("products-all")}
              className="text-xs font-medium hover:underline"
              style={{
                color: "var(--brand)",
              }}
            >
              Barchasi
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold w-4 shrink-0"
                  style={{
                    color: "var(--text-faint)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-xl shrink-0">{p.image}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-semibold truncate"
                    style={{
                      color: "var(--text-primary)",
                    }}
                  >
                    {p.name}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className="text-xs"
                      style={{
                        color: "var(--text-faint)",
                      }}
                    >
                      {p.sold} dona
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: "var(--brand)",
                      }}
                    >
                      {fmt(p.revenue)}
                    </span>
                  </div>
                  <div
                    className="mt-1 h-1 rounded-full overflow-hidden"
                    style={{
                      background: "var(--border-subtle)",
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((p.revenue / 3000000) * 100, 100)}%`,
                        background: "var(--brand)",
                        opacity: 0.7 + i * 0.06,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent sales */}
        <div
          className="col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <h2
              className="font-display font-semibold text-base"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              So'nggi sotuvlar
            </h2>
            <button
              onClick={() => onNavigate("sales-all")}
              className="text-xs font-medium hover:underline"
              style={{
                color: "var(--brand)",
              }}
            >
              Barchasi
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: "var(--table-stripe)",
                }}
              >
                {["ID", "Mijoz", "Summa", "To'lov", "Sana", "Holat"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold"
                      style={{
                        color: "var(--text-faint)",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentSales.map((s) => {
                const st = statusBadge[s.status];
                return (
                  <tr
                    key={s.id}
                    className="border-t hover:bg-blue-50 transition-colors cursor-pointer"
                    style={{
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    <td
                      className="px-5 py-3 text-xs font-mono font-semibold"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      {s.id}
                    </td>
                    <td
                      className="px-5 py-3 text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {s.customer}
                    </td>
                    <td
                      className="px-5 py-3 text-sm font-semibold"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {s.amount.toLocaleString()} so'm
                    </td>
                    <td
                      className="px-5 py-3 text-xs"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      {s.payment}
                    </td>
                    <td
                      className="px-5 py-3 text-xs"
                      style={{
                        color: "var(--text-faint)",
                      }}
                    >
                      {s.date}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: st.bg,
                          color: st.color,
                        }}
                      >
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Low stock */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={15}
                  style={{
                    color: "var(--warning)",
                  }}
                />
                <h2
                  className="font-display font-semibold text-sm"
                  style={{
                    fontFamily: "'Manrope',sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  Ombor ogohlantirishlari
                </h2>
              </div>
              <button
                onClick={() => onNavigate("inventory")}
                className="text-xs font-medium hover:underline"
                style={{
                  color: "var(--brand)",
                }}
              >
                Ko'rish
              </button>
            </div>
            <div className="p-4 space-y-3">
              {lowStockItems.map((item) => {
                const st = stockStatus[item.status];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        background: st.bg,
                      }}
                    >
                      <Boxes
                        size={14}
                        style={{
                          color: st.color,
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-semibold truncate"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          color: "var(--text-faint)",
                        }}
                      >
                        {item.current} / {item.minimum} dona
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full"
                      style={{
                        background: st.bg,
                        color: st.color,
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <h2
              className="font-display font-semibold text-sm mb-3"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              Tezkor amallar
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Yangi sotuv",
                  icon: ShoppingBag,
                  page: "sales-new",
                  color: "var(--brand)",
                  bg: "var(--brand-light)",
                },
                {
                  label: "Mahsulot",
                  icon: Plus,
                  page: "products-all",
                  color: "var(--violet)",
                  bg: "var(--violet-light)",
                },
                {
                  label: "Mijoz",
                  icon: Plus,
                  page: "customers-all",
                  color: "var(--success)",
                  bg: "var(--success-light)",
                },
                {
                  label: "Hisobot",
                  icon: Download,
                  page: "reports",
                  color: "var(--warning)",
                  bg: "var(--warning-light)",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.page)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: action.bg,
                    color: action.color,
                  }}
                >
                  <action.icon size={14} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}