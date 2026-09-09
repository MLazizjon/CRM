import React, { useState } from "react";
import "./Sidebar.css";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  UserCog,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  RotateCcw,
  Building2,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Store,
  Phone,
  MessageCircle,
  X,
  Clock,
  DollarSign,
  CreditCard
} from "lucide-react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Sotuvlar",
    icon: ShoppingCart,
    children: [
      {
        id: "sales-all",
        label: "Barcha sotuvlar",
        icon: ShoppingCart,
      },
      {
        id: "sales-new",
        label: "Yangi sotuv (POS)",
        icon: PlusCircle,
      },
      {
        id: "sales-returns",
        label: "Qaytarilgan",
        icon: RotateCcw,
      },
    ],
  },
  {
    label: "Mahsulotlar",
    icon: Package,
    children: [
      {
        id: "products-all",
        label: "Barcha mahsulotlar",
        icon: Package,
      },
      {
        id: "inventory",
        label: "Ombor",
        icon: Building2,
      },
    ],
  },
  {
    id: "customers-all",
    label: "Mijozlar",
    icon: Users,
  },
  {
    id: "suppliers",
    label: "Ta'minotchilar",
    icon: Truck,
  },
  {
    id: "employees",
    label: "Xodimlar",
    icon: UserCog,
  },
  {
    label: "Moliya",
    icon: Wallet,
    children: [
      {
        id: "finance-revenue",
        label: "Daromad",
        icon: DollarSign,
      },
      {
        id: "finance-debt",
        label: "Qarzdorlik",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "reports",
    label: "Hisobotlar",
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "Sozlamalar",
    icon: Settings,
  },
  {
    id: "help",
    label: "Yordam",
    icon: HelpCircle,
  },
];

export default function Sidebar({
  active = "dashboard",
  onNavigate = () => {},
  collapsed = false,
  onCollapse = () => {},
  notifCount = 0,
}) {
  const [openGroups, setOpenGroups] = useState([
    "Sotuvlar",
    "Mahsulotlar",
    "Moliya",
  ]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleGroup = (label) => {
    setOpenGroups((g) =>
      g.includes(label) ? g.filter((x) => x !== label) : [...g, label]
    );
  };

  const isChildActive = (children) => children.some((c) => c.id === active);

  return (
    <>
      <aside
        className="flex flex-col h-full transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? 64 : 248,
          background: "var(--sidebar-bg, #ffffff)",
          borderRight: "1px solid var(--border, #e5e7eb)",
          boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
          flexShrink: 0,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Logo va Collapse tugmasi */}
        <div
          className="flex items-center h-16 px-3.5"
          style={{
            borderBottom: "1px solid var(--border-subtle, #f3f4f6)",
            flexShrink: 0,
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 36,
                height: 36,
                background:
                  "linear-gradient(135deg, var(--brand, #6366f1) 0%, var(--violet, #8b5cf6) 100%)",
                flexShrink: 0,
              }}
            >
              <Store size={18} color="white" />
            </div>
            {!collapsed && (
              <div
                className="min-w-0 fade-in"
                style={{ overflow: "hidden" }}
              >
                <div
                  className="font-display font-extrabold text-sm leading-tight truncate"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "var(--text-primary, #111827)",
                    fontWeight: 800,
                  }}
                >
                  CRM System
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => onCollapse(!collapsed)}
            className="p-1.5 rounded-lg transition-colors shrink-0"
            style={{ color: "var(--text-faint, #9ca3af)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-2, #f3f4f6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigatsiya ro'yxati */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            if ("children" in item) {
              const isOpen = openGroups.includes(item.label);
              const hasActive = isChildActive(item.children);
              return (
                <div key={item.label}>
                  <button
                    onClick={() => !collapsed && toggleGroup(item.label)}
                    className="flex items-center w-full rounded-xl px-2.5 py-2 text-sm transition-all group"
                    style={{
                      color: hasActive
                        ? "var(--brand, #6366f1)"
                        : "var(--text-secondary, #4b5563)",
                      background:
                        hasActive && collapsed
                          ? "var(--brand-light, #eeef2)"
                          : "transparent",
                      fontWeight: 500,
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon
                      size={17}
                      style={{
                        color: hasActive
                          ? "var(--brand, #6366f1)"
                          : "var(--text-muted, #6b7280)",
                        flexShrink: 0,
                      }}
                    />
                    {!collapsed && (
                      <>
                        <span
                          className="ml-2.5 flex-1 text-left"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {item.label}
                        </span>
                        <span style={{ color: "var(--text-faint, #9ca3af)" }}>
                          {isOpen ? (
                            <ChevronDown size={13} />
                          ) : (
                            <ChevronRight size={13} />
                          )}
                        </span>
                      </>
                    )}
                  </button>

                  {!collapsed && isOpen && (
                    <div
                      className="ml-4 pl-3 mt-0.5 space-y-0.5 fade-in"
                      style={{
                        borderLeft: "2px solid var(--border, #e5e7eb)",
                      }}
                    >
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => onNavigate(child.id)}
                          className="flex items-center w-full rounded-lg px-2.5 py-1.5 text-sm transition-all"
                          style={{
                            color:
                              active === child.id
                                ? "var(--brand, #6366f1)"
                                : "var(--text-muted, #6b7280)",
                            background:
                              active === child.id
                                ? "var(--brand-light, #eeef2)"
                                : "transparent",
                            fontWeight: active === child.id ? 600 : 400,
                          }}
                        >
                          <child.icon size={13} className="shrink-0 mr-2" />
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {child.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const navItem = item;
            const isActive =
              active === navItem.id || active.startsWith(navItem.id + "-");
            const isBell = navItem.id === "notifications";

            return (
              <button
                key={navItem.id}
                onClick={() => {
                  if (navItem.id === "help") {
                    setIsHelpOpen(true);
                  } else {
                    onNavigate(navItem.id);
                  }
                }}
                className="flex items-center w-full rounded-xl px-2.5 py-2 text-sm transition-all relative"
                style={{
                  color: isActive
                    ? "var(--brand, #6366f1)"
                    : "var(--text-secondary, #4b5563)",
                  background: isActive
                    ? "var(--brand-light, #eeef2)"
                    : "transparent",
                  fontWeight: isActive ? 600 : 500,
                }}
                title={collapsed ? navItem.label : undefined}
              >
                <navItem.icon
                  size={17}
                  style={{
                    color: isActive
                      ? "var(--brand, #6366f1)"
                      : "var(--text-muted, #6b7280)",
                    flexShrink: 0,
                  }}
                />
                {!collapsed && (
                  <span className="ml-2.5 flex-1 text-left truncate">
                    {navItem.label}
                  </span>
                )}
                {isBell && notifCount > 0 && (
                  !collapsed ? (
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{
                        background: "var(--danger, #ef4444)",
                        fontSize: 10,
                      }}
                    >
                      {notifCount}
                    </span>
                  ) : (
                    <span
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{
                        background: "var(--danger, #ef4444)",
                      }}
                    />
                  )
                )}
              </button>
            );
          })}
        </nav>

        {/* Pastki qism */}
        <div
          className="px-2 pb-4 pt-3"
          style={{
            borderTop: "1px solid var(--border-subtle, #f3f4f6)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center w-full rounded-xl px-2.5 py-2 text-sm transition-all"
            style={{ color: "var(--text-muted, #6b7280)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-2, #f3f4f6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <HelpCircle
              size={17}
              style={{
                color: "var(--text-faint, #9ca3af)",
                flexShrink: 0,
              }}
            />
            {!collapsed && <span className="ml-2.5">Yordam</span>}
          </button>

          <button
            className="flex items-center w-full rounded-xl px-2.5 py-2 text-sm transition-all"
            style={{ color: "var(--text-muted, #6b7280)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface-2, #f3f4f6)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              className="pulse-dot w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: "var(--success, #10b981)",
                flexShrink: 0,
              }}
            />
            {!collapsed && <span className="ml-2.5">Tizim ishlayapti</span>}
          </button>

          {!collapsed && (
            <div
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all mt-1 fade-in"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--surface-2, #f3f4f6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--brand, #6366f1), var(--violet, #8b5cf6))",
                  fontSize: 11,
                }}
              >
                AD
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--text-primary, #111827)" }}
                >
                  Admin
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--text-faint, #9ca3af)" }}
                >
                  Administrator
                </div>
              </div>
              <button
                onClick={() => onNavigate("login")}
                className="p-1 rounded hover:opacity-75 transition-opacity"
                title="Chiqish"
              >
                <LogOut
                  size={15}
                  style={{ color: "var(--text-faint, #9ca3af)" }}
                />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Yordam Modali */}
      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title flex items-center gap-2">
                <HelpCircle size={20} className="modal-icon" />
                <span>Qo'llab-quvvatlash Xizmati</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsHelpOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Tizim bo'yicha savollaringiz yoki muammolaringiz bo'lsa, quyidagi aloqa tarmoqlari orqali texnik yordam bo'limiga murojaat qilishingiz mumkin.
              </p>

              <div className="help-card">
                <div className="help-card-icon blue">
                  <Phone size={20} />
                </div>
                <div className="help-card-info">
                  <div className="help-card-label">Ishonch telefoni</div>
                  <a href="tel:+998975783036" className="help-card-value">
                    +998 (97) 578-30-36
                  </a>
                  <a href="tel:+998979359707" className="help-card-subvalue">
                    +998 (97) 935-97-07
                  </a>
                </div>
              </div>

              <div className="help-card">
                <div className="help-card-icon green">
                  <MessageCircle size={20} />
                </div>
                <div className="help-card-info">
                  <div className="help-card-label">Telegram qo'llab-quvvatlash</div>
                  <a
                    href="https://t.me/azimjonovich_13"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="help-card-value"
                  >
                    azimjonovich_13
                  </a>
                </div>
              </div>

              <div className="help-card">
                <div className="help-card-icon orange">
                  <Clock size={20} />
                </div>
                <div className="help-card-info">
                  <div className="help-card-label">Ish vaqti</div>
                  <div className="help-card-text">24/7</div>
                  <div className="help-card-subtext">Yakshanba: Dam olish kuni</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn"
                onClick={() => setIsHelpOpen(false)}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}