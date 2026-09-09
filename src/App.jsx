import './App.css';
import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import POS from "./pages/POS";
import Returns from "./pages/Returns";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Suppliers from "./pages/Suppliers";
import Employees from "./pages/Employees";
import Finance from "./pages/Finance";
import DebtManagement from "./pages/DebtManagement";
import SupplierDetail from "./pages/SupplierDetail";
import EmployeeDetail from "./pages/EmployeeDetail";
import DebtDetail from "./pages/DebtDetail";
import Help from "./pages/Help";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { notifications } from "./data/mockData";

// ── Placeholder ─────────────────────────────────────
const Placeholder = ({ title, sub }) => (
  <div className="flex flex-col items-center justify-center min-h-64 fade-in">
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl"
      style={{ background: "var(--brand-light)" }}
    >
      📄
    </div>
    <h2
      className="font-display font-bold text-xl mb-2"
      style={{
        fontFamily: "'Manrope',sans-serif",
        color: "var(--text-primary)",
      }}
    >
      {title}
    </h2>
    <p
      className="text-sm text-center max-w-xs"
      style={{ color: "var(--text-muted)" }}
    >
      {sub}
    </p>
  </div>
);

// ── Router ──────────────────────────────────────────
function renderPage(page, onNavigate) {
  if (page.startsWith("customer-")) {
    const id = parseInt(page.replace("customer-", ""), 10);
    return (
      <CustomerDetail
        customerId={id}
        onBack={() => onNavigate("customers-all")}
      />
    );
  }
  if (page.startsWith("product-")) {
    const id = parseInt(page.replace("product-", ""), 10);
    return (
      <ProductDetail productId={id} onBack={() => onNavigate("products-all")} />
    );
  }
  if (page.startsWith("supplier-")) {
    const id = parseInt(page.replace("supplier-", ""), 10);
    return (
      <SupplierDetail
        supplierId={id}
        onBack={() => onNavigate("suppliers")}
      />
    );
  }
  if (page.startsWith("employee-")) {
    const id = parseInt(page.replace("employee-", ""), 10);
    return (
      <EmployeeDetail
        employeeId={id}
        onBack={() => onNavigate("employees")}
      />
    );
  }
  if (page.startsWith("debt-")) {
    const id = parseInt(page.replace("debt-", ""), 10);
    return <DebtDetail debtorId={id} onBack={() => onNavigate("finance-debt")} />;
  }

  switch (page) {
    case "dashboard":
      return <Dashboard onNavigate={onNavigate} />;
    case "sales-all":
      return <Sales onNavigate={onNavigate} />;
    case "sales-new":
      return <POS />;
    case "sales-returns":
      return <Returns />;
    case "products-all":
      return <Products onNavigate={onNavigate} />;
    case "categories":
      return (
        <Placeholder
          title="Kategoriyalar"
          sub="Mahsulot kategoriyalarini boshqarish"
        />
      );
    case "brands":
      return (
        <Placeholder
          title="Brendlar"
          sub="Tovar brendlari va ishlab chiqaruvchilar"
        />
      );
    case "inventory":
      return <Inventory />;
    case "customers-all":
      return <Customers filter="all" onNavigate={onNavigate} />;
    case "customers-debt":
      return <Customers filter="debt" onNavigate={onNavigate} />;
    case "customers-vip":
      return <Customers filter="vip" onNavigate={onNavigate} />;
    case "suppliers":
      return <Suppliers onNavigate={onNavigate} />;
    case "employees":
      return <Employees onNavigate={onNavigate} />;
    case "finance-revenue":
    case "finance-expenses":
      return <Finance subpage={page} />;
    case "finance-debt":
      return <DebtManagement onNavigate={onNavigate} />;
    case "reports":
      return <Reports />;
    case "notifications":
      return <Notifications />;
    case "settings":
      return <Settings />;
    case "help":
      return <Help />;
    default:
      return <Dashboard onNavigate={onNavigate} />;
  }
}

// ── Shell ────────────────────────────────────────────
function Shell({ onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const navigate = (p) => {
    // Agar "login" so'rovi kelsa, profilni yopamiz va Log out qilamiz
    if (p === "login") {
      onLogout();
      return;
    }
    setPage(p);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="flex h-full"
      style={{ background: "var(--bg)" }}
    >
      <Sidebar
        active={page}
        onNavigate={navigate}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        notifCount={unread}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onNavigate={navigate} notifCount={unread} />
        <main className="flex-1 overflow-y-auto p-6">
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            {renderPage(page, navigate)}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── App root ────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        {loggedIn ? (
          <Shell onLogout={() => setLoggedIn(false)} />
        ) : (
          <Login onLogin={() => setLoggedIn(true)} />
        )}
      </ToastProvider>
    </ThemeProvider>
  );
}