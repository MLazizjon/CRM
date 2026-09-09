import './Reports.css';
import { useState, useMemo } from "react";
import {
  Download,
  FileText,
  BarChart3,
  Users,
  Package,
  CreditCard,
  TrendingDown,
  ShoppingCart,
  Printer,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { monthlyData } from "../data/mockData";

const fmt = (n) => (n / 1000000).toFixed(1) + " mln";

const reportTypes = [
  {
    icon: ShoppingCart,
    label: "Sotuv hisoboti",
    desc: "Barcha sotuvlar va tranzaksiyalar",
    color: "var(--brand)",
    bg: "var(--brand-light)",
    primaryKey: "revenue",
    secondaryKey: "profit",
    primaryName: "Sotuv daromadi",
    secondaryName: "Sof foyda",
  },
  {
    icon: TrendingDown,
    label: "Foyda hisoboti",
    desc: "Daromad va xarajatlar tahlili",
    color: "var(--success)",
    bg: "var(--success-light)",
    primaryKey: "profit",
    secondaryKey: "expenses",
    primaryName: "Foyda",
    secondaryName: "Xarajatlar",
  },
  {
    icon: Package,
    label: "Inventar hisoboti",
    desc: "Mahsulotlar va stok holati",
    color: "var(--violet)",
    bg: "var(--violet-light)",
    primaryKey: "revenue",
    secondaryKey: "expenses",
    primaryName: "Mahsulot oboroti",
    secondaryName: "Stok xarajatlari",
  },
  {
    icon: Users,
    label: "Mijozlar hisoboti",
    desc: "Mijozlar faoliyati va xaridlar",
    color: "var(--info)",
    bg: "var(--info-light)",
    primaryKey: "revenue",
    secondaryKey: "profit",
    primaryName: "Mijozlar xaridi",
    secondaryName: "Mijozdan tushgan foyda",
  },
  {
    icon: BarChart3,
    label: "Xodimlar hisoboti",
    desc: "Xodimlar samaradorligi",
    color: "var(--warning)",
    bg: "var(--warning-light)",
    primaryKey: "profit",
    secondaryKey: "expenses",
    primaryName: "Xodimlar ulushi",
    secondaryName: "Maosh xarajatlari",
  },
  {
    icon: CreditCard,
    label: "Qarzdorlik hisoboti",
    desc: "Mijozlar va ta'minotchilar qarzi",
    color: "var(--danger)",
    bg: "var(--danger-light)",
    primaryKey: "expenses",
    secondaryKey: "profit",
    primaryName: "Ta'minotchi qarzi",
    secondaryName: "Mijozlar qarzi",
  },
];

// Hafta, Oy, Chorak, Yil bo'yicha ma'lumotlarni filtrlash mantiqi
const filterDataByRange = (data, range) => {
  if (!data || !data.length) return [];
  if (range === "week") {
    return data.slice(-2).map((item) => ({
      ...item,
      revenue: item.revenue * 0.25,
      profit: item.profit * 0.25,
      expenses: item.expenses * 0.25,
    }));
  }
  if (range === "quarter") {
    return data.slice(-3);
  }
  if (range === "year") {
    return data;
  }
  // Default: month
  return data;
};

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("Sotuv hisoboti");
  const [dateRange, setDateRange] = useState("month");

  // Tanlangan hisobot obyektini topish
  const currentReportObj = useMemo(() => {
    return (
      reportTypes.find((r) => r.label === selectedReport) || reportTypes[0]
    );
  }, [selectedReport]);

  // Tanlangan davrga mos ma'lumotlarni hisoblash
  const chartData = useMemo(() => {
    return filterDataByRange(monthlyData, dateRange);
  }, [dateRange]);

  // Dinamik xulosa (Summary) kartochkalari ma'lumotlari
  const summaryCards = useMemo(() => {
    const totalRev = chartData.reduce(
      (acc, item) => acc + (item[currentReportObj.primaryKey] || 0),
      0
    );
    const avgRev = chartData.length ? Math.round(totalRev / chartData.length) : 0;

    return [
      {
        label: `Umumiy (${currentReportObj.primaryName})`,
        value: `${totalRev.toLocaleString("ru-RU")} so'm`,
        change: "+12.4%",
      },
      {
        label: `O'rtacha ko'rsatkich`,
        value: `${avgRev.toLocaleString("ru-RU")} so'm`,
        change: "+3.2%",
      },
      {
        label: "Eng yuqori ko'rsatkich",
        value: "Barno Tursunova",
        change: "128 sotuv",
      },
    ];
  }, [chartData, currentReportObj]);

  // Eksport funksiyalari
  const mKeys = chartData && chartData.length ? Object.keys(chartData[0]) : [];
  const fmtVal = (v) => (typeof v === "number" ? v.toLocaleString() : String(v));
  const periodLabel =
    dateRange === "week"
      ? "Hafta"
      : dateRange === "month"
      ? "Oy"
      : dateRange === "quarter"
      ? "Chorak"
      : "Yil";
  const fileBase = selectedReport.replace(/\s+/g, "-").toLowerCase();

  const handleExcel = () => {
    const rows = [mKeys.join(";")].concat(
      chartData.map((m) => mKeys.map((k) => m[k]).join(";"))
    );
    const csv = "\uFEFF" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const head = mKeys.map((k) => "<th>" + k + "</th>").join("");
    const body = chartData
      .map(
        (m) =>
          "<tr>" +
          mKeys.map((k) => "<td>" + fmtVal(m[k]) + "</td>").join("") +
          "</tr>"
      )
      .join("");
    const html =
      "<html><head><title>" +
      selectedReport +
      "</title><style>body{font-family:Arial;color:#111;padding:24px}h1{font-size:18px;margin:0 0 4px}p{color:#555;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border:1px solid #ccc;padding:8px;text-align:left;font-size:12px}th{background:#f3f4f6}</style></head><body><h1>UyMarket — " +
      selectedReport +
      "</h1><p>Davr: " +
      periodLabel +
      "</p><table><tr>" +
      head +
      "</tr>" +
      body +
      "</table></body></html>";
    const w = window.open("", "_blank", "width=800,height=600");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  const handlePdf = () => {
    const enc = (s) =>
      String(s)
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
    const clean = (s) =>
      String(s)
        .replace(/[\u02BB\u02BC]/g, "'")
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[\u201C\u201D]/g, '"');
    const lines = [
      { t: "UyMarket - " + selectedReport, s: 15, b: true },
      { t: "Davr: " + periodLabel, s: 10 },
      { t: " ", s: 8 },
    ].concat(
      chartData.map((m) => ({
        t: mKeys.map((k) => clean(String(m[k])).padEnd(14)).join(" "),
        s: 10,
      }))
    );
    const pageW = 595,
      pageH = 842,
      margin = 50,
      lh = 20;
    const pages = [];
    let cur = [];
    let y = pageH - margin;
    const flush = () => {
      if (cur.length) pages.push(cur);
      cur = [];
      y = pageH - margin;
    };
    for (const ln of lines) {
      if (y < margin + lh) flush();
      cur.push({ t: ln.t, s: ln.s, b: ln.b, y: y });
      y -= lh;
    }
    flush();
    const objs = [];
    objs.push("<< /Type /Catalog /Pages 2 0 R >>");
    objs.push(null);
    objs.push(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
    );
    const fontBold = objs.length + 1;
    objs.push(
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
    );
    const pageObjs = [];
    for (const pg of pages) {
      let cs = "BT\n";
      for (const ln of pg) {
        cs += "/" + (ln.b ? "HB" : "HF") + " " + ln.s + " Tf\n";
        cs += "1 0 0 1 " + margin + " " + ln.y + " Tm\n";
        cs += "(" + enc(ln.t) + ") Tj\n";
      }
      cs += "ET";
      objs.push("<< /Length " + cs.length + " >>\nstream\n" + cs + "\nendstream");
      const cIdx = objs.length;
      objs.push(
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " +
          pageW +
          " " +
          pageH +
          "] /Resources << /Font << /HF 3 0 R /HB " +
          fontBold +
          " 0 R >> >> /Contents " +
          cIdx +
          " 0 R >>"
      );
      pageObjs.push(objs.length);
    }
    objs[1] =
      "<< /Type /Pages /Kids [" +
      pageObjs.map((i) => i + " 0 R").join(" ") +
      "] /Count " +
      pageObjs.length +
      " >>";
    let out = "%PDF-1.4\n";
    const offsets = [];
    for (let i = 0; i < objs.length; i++) {
      offsets.push(out.length);
      out += i + 1 + " 0 obj\n" + objs[i] + "\nendobj\n";
    }
    const xs = out.length;
    out += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
    for (const o of offsets)
      out += String(o).padStart(10, "0") + " 00000 n \n";
    out +=
      "trailer\n<< /Size " +
      (objs.length + 1) +
      " /Root 1 0 R >>\nstartxref\n" +
      xs +
      "\n%%EOF";
    const blob = new Blob([out], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}-${dateRange}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 fade-in pb-8">
      {/* Sarlavha va Eksport tugmalari */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            Hisobotlar
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: "var(--text-muted)",
            }}
          >
            Analitika va biznes ko'rsatkichlari
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border hover:bg-gray-50 transition-colors"
            onClick={handlePrint}
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Printer size={14} /> Chop etish
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border hover:bg-gray-50 transition-colors"
            onClick={handlePdf}
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <FileText size={14} /> PDF
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            onClick={handleExcel}
            style={{
              background:
                "linear-gradient(135deg,var(--brand),var(--brand-hover))",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
              cursor: "pointer",
            }}
          >
            <Download size={15} /> Excel
          </button>
        </div>
      </div>

      {/* Hisobot turlari kartochkalari (Bosganda aktiv bo'ladi) */}
      <div className="grid grid-cols-3 gap-3">
        {reportTypes.map((r) => (
          <button
            key={r.label}
            onClick={() => setSelectedReport(r.label)}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
            style={{
              background:
                selectedReport === r.label ? r.bg : "var(--surface)",
              border: `1px solid ${
                selectedReport === r.label
                  ? "var(--brand-border)"
                  : "var(--border)"
              }`,
              boxShadow:
                selectedReport === r.label
                  ? `0 2px 12px rgba(37,99,235,0.12)`
                  : "0 2px 8px rgba(15,23,42,0.04)",
              cursor: "pointer",
            }}
          >
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{
                background: selectedReport === r.label ? r.color : r.bg,
              }}
            >
              <r.icon
                size={16}
                color={selectedReport === r.label ? "white" : r.color}
              />
            </div>
            <div>
              <div
                className="text-sm font-semibold"
                style={{
                  color:
                    selectedReport === r.label
                      ? r.color
                      : "var(--text-primary)",
                }}
              >
                {r.label}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{
                  color: "var(--text-faint)",
                }}
              >
                {r.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Davr tanlovi + Grafik bo'limi */}
      <div
        className="rounded-2xl p-5"
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
              {selectedReport}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "var(--text-faint)",
              }}
            >
              {periodLabel} ko'rsatkichlari
            </p>
          </div>

          {/* Hafta / Oy / Chorak / Yil tugmalari */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{
              background: "var(--input-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {[
              { key: "week", label: "Hafta" },
              { key: "month", label: "Oy" },
              { key: "quarter", label: "Chorak" },
              { key: "year", label: "Yil" },
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setDateRange(r.key)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background:
                    dateRange === r.key ? "var(--surface)" : "transparent",
                  color:
                    dateRange === r.key
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  boxShadow:
                    dateRange === r.key
                      ? "0 1px 3px rgba(15,23,42,0.08)"
                      : "none",
                  cursor: "pointer",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts AreaChart (140.0 mln yozuvi to'liq pastroqqa tushirilgan) */}
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={chartData}
            margin={{
              top: 25,
              right: 10,
              bottom: 0,
              left: 10,
            }}
          >
            <defs>
              <linearGradient id="primColor" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={currentReportObj.color}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={currentReportObj.color}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="secColor" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--success)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--success)"
                  stopOpacity={0}
                />
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
            {/* 140.0 mln qiymatining yarmi to'silib qolmasligi uchun domain 160.0 mln ga ko'tarilgan */}
            <YAxis
              domain={[0, 160000000]}
              ticks={[0, 35000000, 70000000, 105000000, 140000000]}
              tickFormatter={(v) => fmt(v)}
              tick={{
                fontSize: 11,
                fill: "var(--text-faint)",
              }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              formatter={(v) => fmt(Number(v))}
              contentStyle={{
                background: "var(--text-primary)",
                border: "none",
                borderRadius: 12,
                color: "var(--surface-2)",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey={currentReportObj.primaryKey}
              name={currentReportObj.primaryName}
              stroke={currentReportObj.color}
              fill="url(#primColor)"
              strokeWidth={2.5}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey={currentReportObj.secondaryKey}
              name={currentReportObj.secondaryName}
              stroke="var(--success)"
              fill="url(#secColor)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dinamik xulosa kartochkalari */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <div
              className="text-xs mb-1"
              style={{
                color: "var(--text-faint)",
              }}
            >
              {s.label}
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
              className="text-xs mt-1 font-semibold"
              style={{
                color: "var(--success)",
              }}
            >
              {s.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}