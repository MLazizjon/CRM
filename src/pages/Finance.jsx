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
  Trash2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
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
  const [activeTab, setActiveTab] = useState("all"); // "all" | "income" | "expense"
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("expense"); // "income" yoki "expense"
  const [editingIndex, setEditingIndex] = useState(null);

  // O'chirish modalining holati
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, type: null });

  // Kirimlar ro'yxati
  const [incomes, setIncomes] = useState([
    {
      category: "Savdo",
      amount: 45000000,
      date: "2026-09-09",
      employee: "Admin",
      description: "Do'kon asosiy savdosi",
    },
    {
      category: "Buyurtmalar",
      amount: 25000000,
      date: "2026-09-05",
      employee: "Jasur N.",
      description: "Onlayn buyurtmalar tushumi",
    },
  ]);

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
    category: "Savdo",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    employee: "Admin",
    description: "",
  });

  // Jami kirim va xarajatlar
  const totalIncomeValue = useMemo(() => {
    return incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [incomes]);

  const totalExpenseValue = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [expenses]);

  // Kategoriyalar (Xarajat uchun)
  const currentExpenseCategories = useMemo(() => {
    return initialCategories.map((cat) => {
      const catTotal = expenses
        .filter((e) => e.category === cat.name)
        .reduce((acc, e) => acc + Number(e.amount), 0);
      return { ...cat, value: catTotal || cat.value };
    });
  }, [expenses]);

  const kpis = [
    {
      label: "Jami kirim (Daromad)",
      value: totalIncomeValue.toLocaleString("ru-RU"),
      change: "+12.4%",
      icon: TrendingUp,
      color: "var(--brand)",
      bg: "var(--brand-light)",
    },
    {
      label: "Jami chiqim (Xarajat)",
      value: totalExpenseValue.toLocaleString("ru-RU"),
      change: "+5.1%",
      icon: TrendingDown,
      color: "var(--danger)",
      bg: "var(--danger-light)",
    },
    {
      label: "Sof foyda",
      value: (totalIncomeValue - totalExpenseValue).toLocaleString("ru-RU"),
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
    const headers = ["Turi,Kategoriya,Summa (so'm),Sana,Xodim,Tavsif"];
    const incomeRows = incomes.map(
      (e) => `"Kirim","${e.category}",${e.amount},"${e.date}","${e.employee}","${e.description}"`
    );
    const expenseRows = expenses.map(
      (e) => `"Chiqim","${e.category}",${e.amount},"${e.date}","${e.employee}","${e.description}"`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...incomeRows, ...expenseRows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `moliya_hisobot_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setEditingIndex(null);
    setFormData({
      category: type === "income" ? "Savdo" : (initialCategories[0]?.name || "Ijara"),
      amount: "",
      date: new Date().toISOString().split("T")[0],
      employee: "Admin",
      description: "",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (type, index, item) => {
    setModalType(type);
    setEditingIndex(index);
    setFormData({
      category: item.category,
      amount: item.amount,
      date: item.date,
      employee: item.employee,
      description: item.description,
    });
    setShowModal(true);
  };

  const handleOpenDeleteModal = (type, index) => {
    setDeleteModal({ isOpen: true, index, type });
  };

  const confirmDelete = () => {
    if (deleteModal.index !== null) {
      if (deleteModal.type === "income") {
        setIncomes(incomes.filter((_, i) => i !== deleteModal.index));
      } else {
        setExpenses(expenses.filter((_, i) => i !== deleteModal.index));
      }
    }
    setDeleteModal({ isOpen: false, index: null, type: null });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) return;

    const newItemData = {
      category: formData.category,
      amount: Number(formData.amount),
      date: formData.date,
      employee: formData.employee,
      description: formData.description || "Izohsiz",
    };

    if (modalType === "income") {
      if (editingIndex !== null) {
        const updated = [...incomes];
        updated[editingIndex] = newItemData;
        setIncomes(updated);
      } else {
        setIncomes([newItemData, ...incomes]);
      }
    } else {
      if (editingIndex !== null) {
        const updated = [...expenses];
        updated[editingIndex] = newItemData;
        setExpenses(updated);
      } else {
        setExpenses([newItemData, ...expenses]);
      }
    }

    setShowModal(false);
  };

  // Jadval uchun ma'lumotlarni birlashtirish yoki saralash
  const filteredTableData = useMemo(() => {
    const incs = incomes.map((item) => ({ ...item, type: "income" }));
    const exps = expenses.map((item) => ({ ...item, type: "expense" }));
    
    let combined = [];
    if (activeTab === "all") combined = [...incs, ...exps];
    if (activeTab === "income") combined = incs;
    if (activeTab === "expense") combined = exps;

    return combined.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes, expenses, activeTab]);

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
            Kirim, chiqim va moliyaviy ko'rsatkichlar boshqaruvi
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
            onClick={() => handleOpenModal("income")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{
              background: "var(--success)",
              cursor: "pointer",
            }}
          >
            <ArrowUpRight size={15} /> Kirim qo'shish
          </button>
          <button
            onClick={() => handleOpenModal("expense")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{
              background: "var(--danger)",
              cursor: "pointer",
            }}
          >
            <ArrowDownRight size={15} /> Chiqim qo'shish
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

      {/* Operatsiyalar jadvali (Kirim va Chiqimlar) */}
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
            Kirim va Chiqim operatsiyalari
          </h2>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "all" ? "bg-white shadow-sm text-blue-600" : "text-gray-600"}`}
              style={{ cursor: "pointer" }}
            >
              Barchasi
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "income" ? "bg-white shadow-sm text-green-600" : "text-gray-600"}`}
              style={{ cursor: "pointer" }}
            >
              Kirimlar
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === "expense" ? "bg-white shadow-sm text-red-600" : "text-gray-600"}`}
              style={{ cursor: "pointer" }}
            >
              Chiqimlar
            </button>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "var(--table-stripe)" }}>
              {["Turi", "Kategoriya", "Summa", "Sana", "Xodim", "Tavsif", "Amallar"].map((h) => (
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
            {filteredTableData.map((item, i) => {
              const isIncome = item.type === "income";
              const cat = initialCategories.find((c) => c.name === item.category);
              return (
                <tr
                  key={i}
                  className="border-t hover:bg-blue-50/20 transition-colors"
                  style={{
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: isIncome ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: isIncome ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {isIncome ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {isIncome ? "Kirim" : "Chiqim"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: isIncome ? "var(--success)" : (cat?.color || "var(--brand)"),
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: isIncome ? "var(--success)" : "var(--danger)" }}
                  >
                    {isIncome ? "+" : "-"}{Number(item.amount).toLocaleString()} so'm
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {item.date}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.employee}
                  </td>
                  <td
                    className="px-5 py-3.5 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.description}
                  </td>
                  <td className="px-5 py-3.5 text-sm">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item.type, isIncome ? incomes.indexOf(item) : expenses.indexOf(item), item)}
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
                      <button
                        onClick={() => handleOpenDeleteModal(item.type, isIncome ? incomes.indexOf(item) : expenses.indexOf(item))}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 text-xs font-medium"
                        style={{
                          color: "var(--danger)",
                          border: "1px solid rgba(239, 68, 68, 0.2)",
                          cursor: "pointer",
                        }}
                        title="O'chirish"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Qo'shish / Tahrirlash modali */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(2px)",
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
                {editingIndex !== null
                  ? (modalType === "income" ? "Kirimni tahrirlash" : "Xarajatni tahrirlash")
                  : (modalType === "income" ? "Kirim (daromad) qo'shish" : "Xarajat qo'shish")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                style={{ cursor: "pointer" }}
              >
                <X size={18} style={{ color: "var(--text-faint)" }} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
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
                  {modalType === "income" ? (
                    <>
                      <option value="Savdo">Savdo</option>
                      <option value="Buyurtmalar">Buyurtmalar</option>
                      <option value="Xizmatlar">Xizmatlar</option>
                      <option value="Boshqa daromad">Boshqa daromad</option>
                    </>
                  ) : (
                    <>
                      {initialCategories.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      <option value="Inventar">Inventar</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Summa (so'm)
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
                  onClick={() => setShowModal(false)}
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
                    background: modalType === "income" ? "var(--success)" : "var(--danger)",
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

      {/* O'chirishni tasdiqlash modali */}
      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setDeleteModal({ isOpen: false, index: null, type: null })}
        >
          <div
            className="rounded-3xl p-6 w-full max-w-sm slide-up text-center"
            style={{
              background: "var(--surface)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                color: "var(--danger)",
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h2
              className="font-display font-bold text-lg mb-2"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              Operatsiyani o'chirish
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Haqiqatan ham ushbu yozuvni o'chirib tashlamoqchimisiz?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, index: null, type: null })}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm border transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  background: "var(--surface)",
                  cursor: "pointer",
                }}
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity"
                style={{
                  background: "var(--danger)",
                  cursor: "pointer",
                }}
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}