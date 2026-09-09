import './Finance.css';
import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  X,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { monthlyData, expenseCategories } from "../data/mockData";
const fmt = (n) => (n / 1000000).toFixed(1) + " mln";
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: "var(--text-primary)",
        color: "var(--surface-2)",
        minWidth: 130,
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
      {payload.map((e) => (
        <div key={e.name} className="flex justify-between gap-4">
          <span
            style={{
              color: e.color,
            }}
          >
            {e.name}
          </span>
          <span className="font-semibold">{fmt(e.value)}</span>
        </div>
      ))}
    </div>
  );
};
export default function Finance({ subpage }) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const kpis = [
    {
      label: "Oylik daromad",
      value: "124 800 000",
      change: "+12.4%",
      icon: TrendingUp,
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    {
      label: "Oylik xarajatlar",
      value: "34 950 000",
      change: "+5.1%",
      icon: TrendingDown,
      color: "var(--danger)",
      bg: "var(--danger-light)",
    },
    {
      label: "Sof foyda",
      value: "89 850 000",
      change: "+16.2%",
      icon: DollarSign,
      color: "var(--brand)",
      bg: "var(--brand-light)",
    },
    {
      label: "Jami qarzdorlik",
      value: "8 720 000",
      change: "-4.6%",
      icon: CreditCard,
      color: "var(--warning)",
      bg: "var(--warning-light)",
    },
  ];
  const recentExpenses = [
    {
      category: "Ijara",
      amount: 8500000,
      date: "01 Sep 2026",
      employee: "Admin",
      description: "Sentyabr oyi ijarasi",
    },
    {
      category: "Maosh",
      amount: 18200000,
      date: "05 Sep 2026",
      employee: "Admin",
      description: "Sentyabr oylik maoshlari",
    },
    {
      category: "Transport",
      amount: 1200000,
      date: "06 Sep 2026",
      employee: "Jasur N.",
      description: "Ta'minotchi yetkazib berish",
    },
    {
      category: "Reklama",
      amount: 800000,
      date: "07 Sep 2026",
      employee: "Alisher Q.",
      description: "Instagram reklama",
    },
    {
      category: "Kommunal",
      amount: 650000,
      date: "08 Sep 2026",
      employee: "Admin",
      description: "Elektr va gaz",
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
            Moliya
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Daromad, xarajatlar va moliyaviy ko'rsatkichlar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{
              background: "linear-gradient(135deg,var(--brand),var(--brand-hover))",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
            }}
          >
            <Plus size={15} /> Xarajat qo'shish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-4 transition-card"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
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
              <span
                className="text-xs font-semibold"
                style={{
                  color: k.change.startsWith("+") ? "var(--success)" : "var(--danger)",
                }}
              >
                {k.change}
              </span>
            </div>
            <div
              className="text-lg font-display font-bold leading-tight"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {k.value} so'm
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

      <div className="grid grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div
          className="col-span-2 rounded-2xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <h2
            className="font-display font-semibold text-base mb-4"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Oylik moliyaviy ko'rsatkichlar
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyData}
              margin={{
                top: 0,
                right: 8,
                bottom: 0,
                left: 0,
              }}
            >
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
                width={55}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey="revenue"
                name="Daromad"
                fill="var(--brand)"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
              <Bar
                dataKey="profit"
                name="Foyda"
                fill="var(--success)"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
              <Bar
                dataKey="expenses"
                name="Xarajatlar"
                fill="var(--warning)"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense breakdown */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
          }}
        >
          <h2
            className="font-display font-semibold text-base mb-4"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Xarajatlar tarkibi
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                paddingAngle={3}
              >
                {expenseCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: cat.color,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {fmt(cat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent expenses table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
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
            So'nggi xarajatlar
          </h2>
        </div>
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "var(--table-stripe)",
              }}
            >
              {["Kategoriya", "Summa", "Sana", "Xodim", "Tavsif"].map((h) => (
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
            {recentExpenses.map((exp, i) => {
              const cat = expenseCategories.find(
                (c) => c.name === exp.category,
              );
              return (
                <tr
                  key={i}
                  className="border-t hover:bg-blue-50/20 transition-colors"
                  style={{
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: cat?.color || "var(--text-faint)",
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: "var(--text-primary)",
                        }}
                      >
                        {exp.category}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{
                      color: "var(--danger)",
                    }}
                  >
                    -{exp.amount.toLocaleString()} so'm
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    {exp.date}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {exp.employee}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{
                      color: "var(--text-muted)",
                    }}
                  >
                    {exp.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(17,24,39,0.45)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="rounded-3xl p-6 w-full max-w-md slide-up"
            style={{
              background: "var(--surface)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
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
                Xarajat qo'shish
              </h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X
                  size={18}
                  style={{
                    color: "var(--text-faint)",
                  }}
                />
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Kategoriya",
                  type: "select",
                  opts: expenseCategories.map((c) => c.name),
                },
                {
                  label: "Summa",
                  type: "number",
                  placeholder: "Miqdorni kiriting",
                },
                {
                  label: "Sana",
                  type: "date",
                },
                {
                  label: "Xodim",
                  type: "select",
                  opts: ["Admin", "Barno T.", "Jasur N.", "Kamola Y."],
                },
                {
                  label: "Tavsif",
                  type: "textarea",
                  placeholder: "Qo'shimcha ma'lumot...",
                },
              ].map((field) => (
                <div key={field.label}>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {field.opts?.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      rows={2}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm border hover:bg-gray-50"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90"
                style={{
                  background: "var(--brand)",
                }}
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
