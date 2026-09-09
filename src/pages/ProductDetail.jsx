import './ProductDetail.css';
import { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  TrendingUp,
  Package,
  DollarSign,
  BarChart3,
  ShoppingCart,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  Copy,
  Tag,
  Building2,
  CheckCircle,
} from "lucide-react";
import { products, recentSales } from "../data/mockData";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useToast } from "../context/ToastContext";
const sparkData = [
  {
    d: "Mar",
    v: 28,
  },
  {
    d: "Apr",
    v: 42,
  },
  {
    d: "May",
    v: 35,
  },
  {
    d: "Jun",
    v: 58,
  },
  {
    d: "Jul",
    v: 48,
  },
  {
    d: "Aug",
    v: 72,
  },
  {
    d: "Sep",
    v: 61,
  },
];
export default function ProductDetail({ productId, onBack }) {
  const product = products.find((p) => p.id === productId) || products[0];
  const { success } = useToast();
  const [tab, setTab] = useState("overview");
  const statusMap = {
    active: {
      label: "Faol",
      bg: "var(--success-light)",
      color: "var(--success)",
    },
    low: {
      label: "Kam qolgan",
      bg: "var(--warning-light)",
      color: "var(--warning)",
    },
    out: {
      label: "Tugagan",
      bg: "var(--danger-light)",
      color: "var(--danger)",
    },
  };
  const st = statusMap[product.status];
  const margin = Math.round(
    ((product.price - product.cost) / product.price) * 100,
  );
  const tabs = [
    {
      key: "overview",
      label: "Umumiy",
    },
    {
      key: "pricing",
      label: "Narxlash",
    },
    {
      key: "inventory",
      label: "Inventar",
    },
    {
      key: "sales",
      label: "Sotuv statistikasi",
    },
    {
      key: "history",
      label: "Tarix",
    },
  ];
  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl hover:opacity-80 transition-opacity"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <ArrowLeft size={17} />
        </button>
        <div className="flex-1">
          <h1
            className="font-display font-bold text-2xl"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <code
              className="text-xs font-mono px-2 py-0.5 rounded-md"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              {product.sku}
            </code>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(product.sku);
                success("SKU nusxalandi");
              }}
              className="hover:opacity-70 transition-opacity"
            >
              <Copy
                size={12}
                style={{
                  color: "var(--text-faint)",
                }}
              />
            </button>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: st.bg,
                color: st.color,
              }}
            >
              {st.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm">
            <Edit2 size={14} /> Tahrirlash
          </button>
        </div>
      </div>

      {/* Top section */}
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: "1fr 2fr",
        }}
      >
        {/* Product card */}
        <div className="card p-6 flex flex-col items-center text-center">
          <div className="text-7xl mb-5">{product.image}</div>
          <div
            className="font-display font-bold text-lg mb-1"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {product.name}
          </div>
          <div
            className="text-sm mb-1"
            style={{
              color: "var(--text-muted)",
            }}
          >
            {product.brand} · {product.category}
          </div>

          <div className="w-full mt-5 space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "var(--brand-light)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: "var(--brand)",
                }}
              >
                Sotuv narxi
              </span>
              <span
                className="font-display font-bold text-base"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  color: "var(--brand)",
                }}
              >
                {product.price.toLocaleString()} so'm
              </span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "var(--surface-2)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Tan narxi
              </span>
              <span
                className="font-semibold text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {product.cost.toLocaleString()} so'm
              </span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "var(--success-light)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: "var(--success)",
                }}
              >
                Marja
              </span>
              <span
                className="font-bold text-sm"
                style={{
                  color: "var(--success)",
                }}
              >
                {margin}%
              </span>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 content-start">
          {[
            {
              icon: ShoppingCart,
              label: "Oy davomida sotilgan",
              value: "128 dona",
              color: "var(--brand)",
              bg: "var(--brand-light)",
            },
            {
              icon: DollarSign,
              label: "Oy davomida daromad",
              value: "5 760 000 so'm",
              color: "var(--success)",
              bg: "var(--success-light)",
            },
            {
              icon: Package,
              label: "Ombordagi qoldiq",
              value: `${product.stock} dona`,
              color: product.stock < 10 ? "var(--danger)" : "var(--violet)",
              bg:
                product.stock < 10
                  ? "var(--danger-light)"
                  : "var(--violet-light)",
            },
            {
              icon: TrendingUp,
              label: "O'rtacha narx",
              value: `${product.price.toLocaleString()} so'm`,
              color: "var(--warning)",
              bg: "var(--warning-light)",
            },
          ].map((k) => (
            <div key={k.label} className="card p-4">
              <div
                className="p-2.5 rounded-xl w-fit mb-3"
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
              <div
                className="text-xl font-display font-bold count-up mb-0.5"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {k.value}
              </div>
              <div
                className="text-xs"
                style={{
                  color: "var(--text-faint)",
                }}
              >
                {k.label}
              </div>
            </div>
          ))}

          {/* Mini sparkline */}
          <div className="col-span-2 card p-4">
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-sm font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Oylik sotuv dinamikasi
              </span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: "var(--success)",
                }}
              >
                +22.5%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart
                data={sparkData}
                margin={{
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                }}
              >
                <defs>
                  <linearGradient id="sparkg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--brand)"
                  fill="url(#sparkg)"
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis
                  dataKey="d"
                  tick={{
                    fontSize: 10,
                    fill: "var(--text-faint)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 11,
                    color: "var(--text-primary)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-flat rounded-2xl overflow-hidden">
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

        <div className="p-5 fade-in">
          {tab === "overview" && (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <h3
                  className="font-semibold text-sm"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Mahsulot ma'lumotlari
                </h3>
                {[
                  {
                    label: "Nomi",
                    value: product.name,
                  },
                  {
                    label: "SKU",
                    value: product.sku,
                  },
                  {
                    label: "Kategoriya",
                    value: product.category,
                  },
                  {
                    label: "Brend",
                    value: product.brand,
                  },
                  {
                    label: "Holat",
                    value: st.label,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between py-2"
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
                      {row.label}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3
                  className="font-semibold text-sm"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Narx ma'lumotlari
                </h3>
                {[
                  {
                    label: "Sotuv narxi",
                    value: `${product.price.toLocaleString()} so'm`,
                  },
                  {
                    label: "Tan narxi",
                    value: `${product.cost.toLocaleString()} so'm`,
                  },
                  {
                    label: "Foyda",
                    value: `${(product.price - product.cost).toLocaleString()} so'm`,
                  },
                  {
                    label: "Marja",
                    value: `${margin}%`,
                  },
                  {
                    label: "QQS",
                    value: "12%",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between py-2"
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
                      {row.label}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: "var(--text-primary)",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "inventory" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Joriy qoldiq",
                    value: product.stock,
                    icon: Package,
                    color: "var(--brand)",
                  },
                  {
                    label: "Min. qoldiq",
                    value: 20,
                    icon: ArrowDownCircle,
                    color: "var(--warning)",
                  },
                  {
                    label: "Bu oy kirim",
                    value: 150,
                    icon: ArrowUpCircle,
                    color: "var(--success)",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="p-4 rounded-2xl"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      className="text-2xl font-display font-bold mb-1"
                      style={{
                        fontFamily: "'Manrope',sans-serif",
                        color: s.color,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: "var(--text-muted)",
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="p-4 rounded-2xl"
                style={{
                  background: "var(--surface-2)",
                }}
              >
                <h4
                  className="text-sm font-semibold mb-3"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  So'nggi harakatlar
                </h4>
                {[
                  {
                    type: "in",
                    qty: 50,
                    date: "05 Sep",
                    reason: "Ta'minotchidan keldi",
                  },
                  {
                    type: "out",
                    qty: 12,
                    date: "04 Sep",
                    reason: "Sotuv",
                  },
                  {
                    type: "in",
                    qty: 100,
                    date: "01 Sep",
                    reason: "Ta'minotchidan keldi",
                  },
                ].map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                    style={{
                      borderBottom:
                        i < 2 ? "1px solid var(--border-subtle)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {m.type === "in" ? (
                        <ArrowUpCircle
                          size={14}
                          style={{
                            color: "var(--success)",
                          }}
                        />
                      ) : (
                        <ArrowDownCircle
                          size={14}
                          style={{
                            color: "var(--danger)",
                          }}
                        />
                      )}
                      <span
                        className="text-sm"
                        style={{
                          color: "var(--text-secondary)",
                        }}
                      >
                        {m.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs"
                        style={{
                          color: "var(--text-faint)",
                        }}
                      >
                        {m.date}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color:
                            m.type === "in"
                              ? "var(--success)"
                              : "var(--danger)",
                        }}
                      >
                        {m.type === "in" ? "+" : "-"}
                        {m.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === "sales" || tab === "pricing" || tab === "history") && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "var(--brand-light)",
                }}
              >
                <BarChart3
                  size={20}
                  style={{
                    color: "var(--brand)",
                  }}
                />
              </div>
              <p
                className="text-sm font-semibold mb-1"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {tab === "sales"
                  ? "Sotuv statistikasi"
                  : tab === "pricing"
                    ? "Narx tarixi"
                    : "To'liq tarix"}
              </p>
              <p
                className="text-xs"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Bu bo'lim tez orada to'ldiriladi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
