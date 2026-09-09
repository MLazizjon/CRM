import './Finance.css';
import { useState, useMemo } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  X,
  Download,
  Pencil,
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
} from "recharts";
import { monthlyData, expenseCategories as initialCategories } from "../data/mockData";

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
        style={{ color: "var(--text-faint)" }}
      >
        {label}
      </div>
      {payload.map((e) => (
        <div key={e.name} className="flex justify-between gap-4">
          <span style={{ color: e.color }}>{e.name}</span>
          <span className="font-semibold">{fmt(e.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Finance() {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);

  // Xarajatlar ro'yxati
  const [expenses, setExpenses] = useState([
    {
      category: "Inventar",
      amount: 4500000,
      date: "2026-09-09",
      employee: "Jasur N.",
      description: "Adidas kiyim va jihozlar xaridi",
    },
    {
      category: "Ijara",
      amount: 8500000,
      date: "2026-09-01",
      employee: "Admin",
      description: "Sentyabr oyi ijarasi",
    },
    {
      category: "Maosh",
      amount: 18200000,
      date: "2026-09-05",
      employee: "Admin",
      description: "Sentyabr oylik maoshlari",
    },
    {
      category: "Transport",
      amount: 1200000,
      date: "2026-09-06",
      employee: "Jasur N.",
      description: "Ta'minotchi yetkazib berish",
    },
    {
      category: "Reklama",
      amount: 800000,
      date: "2026-09-07",
      employee: "Alisher Q.",
      description: "Instagram reklama",
    },
    {
      category: "Kommunal",
      amount: 650000,
      date: "2026-09-08",
      employee: "Admin",
      description: "Elektr va gaz",
    },
  ]);

  // Modal ma'lumotlari
  const [formData, setFormData] = useState({
    category: initialCategories[0]?.name || "Ijara",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    employee: "Admin",
    description: "",
  });

  // Jami xarajat
  const totalExpenseValue = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [expenses]);

  // Kategoriyalar
  const currentExpenseCategories = useMemo(() => {
    return initialCategories.map((cat) => {
      const catTotal = expenses
        .filter((e) => e.category === cat.name)
        .reduce((acc, e) => acc + Number(e.amount), 0);
      return { ...cat, value: catTotal || cat.value };
    });
  }, [expenses]);

  // 140 mln so'm daromad
  const monthlyRevenue = 140000000;

  const kpis = [
    {
      label: "Oylik daromad",
      value: monthlyRevenue.toLocaleString("ru-RU"),
      change: "+12.4%",
      icon: TrendingUp,
      color: "var(--brand)",
      bg: "var(--brand-light)",
    },
    {
      label: "Oylik xarajatlar",
      value: totalExpenseValue.toLocaleString("ru-RU"),
      change: "+5.1%",
      icon: TrendingDown,
      color: "var(--danger)",
      bg: "var(--danger-light)",
    },
    {
      label: "Sof foyda",
      value: (monthlyRevenue - totalExpenseValue).toLocaleString("ru-RU"),
      change: "+16.2%",
      icon: DollarSign,
      color: "var(--success)",
      bg: "var(--success-light)",
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

  // CSV yuklash
  const handleExportCSV = () => {
    const headers = ["Kategoriya,Summa (so'm),Sana,Xodim,Tavsif"];
    const rows = expenses.map(
      (e) => `"${e.category}",${e.amount},"${e.date}","${e.employee}","${e.description}"`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `xarajatlar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddModal = () => {
    setEditingExpenseIndex(null);
    setFormData({
      category: initialCategories[0]?.name || "Ijara",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      employee: "Admin",
      description: "",
    });
    setShowExpenseModal(true);
  };

  const handleOpenEditModal = (index, expense) => {
    setEditingExpenseIndex(index);
    setFormData({
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      employee: expense.employee,
      description: expense.description,
    });
    setShowExpenseModal(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    const newExpenseData = {
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      employee: formData.employee,
      description: formData.description || "Izohsiz",
    };

    if (editingExpenseIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editingExpenseIndex] = newExpenseData;
      setExpenses(updatedExpenses);
    } else {
      setExpenses([newExpenseData, ...expenses]);
    }

    setShowExpenseModal(false);
  };

  return (
    <div className="space-y-6 fade-in pb-8">
      {/* Sarlavha va Tugmalar */}
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
            style={{ color: "var(--text-muted)" }}
          >
            Daromad, xarajatlar va moliyaviy ko'rsatkichlar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50 transition-colors"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{
              background: "linear-gradient(135deg,var(--brand),var(--brand-hover))",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              cursor: "pointer",
            }}
          >
            <Plus size={15} /> Xarajat qo'shish
          </button>
        </div>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl p-5 transition-card flex flex-col justify-between"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
              minHeight: "135px",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="p-2.5 rounded-xl"
                style={{ background: k.bg }}
              >
                <k.icon size={18} style={{ color: k.color }} />
              </div>
              <span
                className="text-xs font-semibold"
                style={{
                  color: k.change.startsWith("+")
                    ? "var(--success)"
                    : "var(--danger)",
                }}
              >
                {k.change}
              </span>
            </div>

            <div className="mt-auto pt-3">
              <div
                className="text-base sm:text-lg font-display font-bold leading-tight"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                  color: "var(--text-primary)",
                  wordBreak: "break-word",
                }}
              >
                {k.value} so'm
              </div>
              <div
                className="text-xs mt-1 font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                {k.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grafiklar bo'limi */}
      <div className="grid grid-cols-3 gap-4">
        {/* Daromad va xarajat bar chart */}
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
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={monthlyData}
              margin={{ top: 15, right: 10, bottom: 0, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--text-faint)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 160000000]}
                ticks={[0, 35000000, 70000000, 105000000, 140000000]}
                tickFormatter={(v) => fmt(v)}
                tick={{ fontSize: 11, fill: "var(--text-faint)" }}
                axisLine={false}
                tickLine={false}
                width={65}
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

        {/* Xarajatlar tarkibi */}
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
                data={currentExpenseCategories}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                paddingAngle={3}
              >
                {currentExpenseCategories.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(Number(v))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {currentExpenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {cat.name}
                  </span>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fmt(cat.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* So'nggi xarajatlar jadvali */}
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
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "var(--table-stripe)" }}>
              {["Kategoriya", "Summa", "Sana", "Xodim", "Tavsif", "Amallar"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-xs font-semibold"
                  style={{ color: "var(--text-faint)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => {
              const cat = initialCategories.find((c) => c.name === exp.category);
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
                          background: cat?.color || "var(--brand)",
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {exp.category}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: "var(--danger)" }}
                  >
                    -{Number(exp.amount).toLocaleString()} so'm
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {exp.date}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.employee}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {exp.description}
                  </td>
                  <td className="px-5 py-3.5 text-sm">
                    <button
                      onClick={() => handleOpenEditModal(i, exp)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs font-medium"
                      style={{
                        color: "var(--brand)",
                        border: "1px solid var(--border)",
                        cursor: "pointer",
                      }}
                      title="Tahrirlash"
                    >
                      <Pencil size={13} /> Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
                {editingExpenseIndex !== null ? "Xarajatni tahrirlash" : "Xarajat qo'shish"}
              </h2>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                style={{ cursor: "pointer" }}
              >
                <X size={18} style={{ color: "var(--text-faint)" }} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Kategoriya
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  {initialCategories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Inventar">Inventar</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Summa
                </label>
                <input
                  type="number"
                  required
                  placeholder="Miqdorni kiriting"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sana
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Xodim
                </label>
                <select
                  value={formData.employee}
                  onChange={(e) =>
                    setFormData({ ...formData, employee: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                  }}
                >
                  {["Admin", "Barno T.", "Jasur N.", "Kamola Y."].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  placeholder="Qo'shimcha ma'lumot..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm border hover:bg-gray-50 transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity"
                  style={{
                    background: "var(--brand)",
                    cursor: "pointer",
                  }}
                >
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