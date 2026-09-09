import './Topbar.css';
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  Package,
  Users,
  ShoppingCart,
  Building2,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { products, customers } from "../data/mockData";
import { useTheme } from "../context/ThemeContext";

export default function Topbar({ onNavigate }) {
  const { dark, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const q = query.toLowerCase();
  const filteredProducts =
    q.length > 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.sku.toLowerCase().includes(q),
          )
          .slice(0, 3)
      : [];
  const filteredCustomers =
    q.length > 1
      ? customers
          .filter(
            (c) => c.name.toLowerCase().includes(q) || c.phone.includes(query),
          )
          .slice(0, 3)
      : [];
  const showEmpty =
    q.length > 1 && !filteredProducts.length && !filteredCustomers.length;
  const quickActions = [
    {
      icon: ShoppingCart,
      label: "Yangi sotuv",
      page: "sales-new",
    },
    {
      icon: Package,
      label: "Mahsulot qo'shish",
      page: "products-all",
    },
    {
      icon: Users,
      label: "Mijoz qo'shish",
      page: "customers-all",
    },
    {
      icon: Building2,
      label: "Omborga kirim",
      page: "inventory",
    },
    {
      icon: Zap,
      label: "Dashboard",
      page: "dashboard",
    },
  ];

  return (
    <>
      <header
        className="flex items-center h-16 px-6 gap-4 shrink-0"
        style={{
          background: "var(--topbar-bg)",
          borderBottom: "1px solid var(--border)",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Search pill */}
        <button
          onClick={() => {
            setSearchOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all hover:opacity-90"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-faint)",
            minWidth: 220,
          }}
        >
          <Search size={14} />
          <span className="flex-1 text-left text-sm">Qidirish...</span>
          <kbd
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "var(--border)",
              color: "var(--text-faint)",
              fontSize: 10,
            }}
          >
            ⌘K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2.5 rounded-xl transition-all hover:opacity-80"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
          title={dark ? "Yorug' rejim" : "Qorong'u rejim"}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Quick add */}
        <button
          onClick={() => onNavigate("sales-new")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg,var(--brand) 0%,var(--brand-hover) 100%)",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          <Plus size={15} />
          Yangi sotuv
        </button>

        {/* User (Bosinganda sozlamalar sahifasiga o'tadi) */}
        <div
          onClick={() => onNavigate("settings")}
          className="flex items-center gap-2.5 cursor-pointer group transition-all hover:opacity-80 active:scale-95"
          title="Sozlamalarga o'tish"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: "linear-gradient(135deg,var(--brand),var(--violet))",
            }}
          >
            AQ
          </div>
          <div className="hidden sm:block">
            <div
              className="text-sm font-semibold leading-tight"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Alisher Q.
            </div>
            <div
              className="text-xs"
              style={{
                color: "var(--text-faint)",
              }}
            >
              Admin
            </div>
          </div>
        </div>
      </header>

      {/* ── Command Palette ──────────────────────────────── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => {
            setSearchOpen(false);
            setQuery("");
          }}
        >
          <div
            className="w-full max-w-xl rounded-2xl overflow-hidden scale-in"
            style={{
              background: "var(--surface)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <Search
                size={18}
                style={{
                  color: "var(--text-faint)",
                }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mahsulot, mijoz yoki sotuv qidirish..."
                className="flex-1 text-base outline-none bg-transparent"
                style={{
                  color: "var(--text-primary)",
                }}
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X
                    size={15}
                    style={{
                      color: "var(--text-faint)",
                    }}
                  />
                </button>
              )}
              <kbd
                className="text-xs px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-faint)",
                  border: "1px solid var(--border)",
                }}
              >
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {/* Quick actions (empty query) */}
              {!query && (
                <div className="px-3 py-2">
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    TEZKOR AMALLAR
                  </p>
                  {quickActions.map((a) => (
                    <button
                      key={a.page}
                      onClick={() => {
                        onNavigate(a.page);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                      style={{
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--brand-light)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <a.icon
                        size={15}
                        style={{
                          color: "var(--text-muted)",
                        }}
                      />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Product results */}
              {filteredProducts.length > 0 && (
                <div className="px-3 py-2">
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    MAHSULOTLAR
                  </p>
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigate("product-" + p.id);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                      style={{
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--brand-light)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span className="text-xl">{p.image}</span>
                      <div className="flex-1">
                        <div
                          className="font-medium"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            color: "var(--text-faint)",
                          }}
                        >
                          {p.sku} · {p.category}
                        </div>
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--brand)",
                        }}
                      >
                        {p.price.toLocaleString()} so'm
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Customer results */}
              {filteredCustomers.length > 0 && (
                <div className="px-3 py-2">
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    MIJOZLAR
                  </p>
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigate("customer-" + c.id);
                        setSearchOpen(false);
                        setQuery("");
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                      style={{
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--brand-light)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          background: "var(--brand)",
                        }}
                      >
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div
                          className="font-medium"
                          style={{
                            color: "var(--text-primary)",
                          }}
                        >
                          {c.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            color: "var(--text-faint)",
                          }}
                        >
                          {c.phone}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showEmpty && (
                <div className="py-10 text-center">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-faint)",
                    }}
                  >
                    "{query}" uchun hech narsa topilmadi
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}