import './Settings.css';
import { useState, useRef } from "react";
import { User, Palette, Lock, Sun, Moon, Upload } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

const sections = [
  {
    key: "profile",
    label: "Profil",
    icon: User,
  },
  {
    key: "appearance",
    label: "Ko'rinish",
    icon: Palette,
  },
  {
    key: "security",
    label: "Xavfsizlik",
    icon: Lock,
  },
];

const InputRow = ({ label, value, type = "text", placeholder }) => (
  <div>
    <label
      className="block text-xs font-semibold mb-1.5"
      style={{
        color: "var(--text-secondary)",
      }}
    >
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      className="input-base"
    />
  </div>
);

const Toggle = ({ label, desc, defaultOn }) => {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div>
        <div
          className="text-sm font-medium"
          style={{
            color: "var(--text-primary)",
          }}
        >
          {label}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{
            color: "var(--text-muted)",
          }}
        >
          {desc}
        </div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className="relative transition-all"
        style={{
          width: 44,
          height: 24,
          borderRadius: 99,
          background: on ? "var(--brand)" : "var(--border)",
        }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
          style={{
            left: on ? "calc(100% - 22px)" : "2px",
          }}
        />
      </button>
    </div>
  );
};

function ProfileContent() {
  const { success, error } = useToast();
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        error("Rasm hajmi 2MB dan oshmasligi kerak!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        success("Rasm yuklandi");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        {/* Rasm tanlangan bo'lsa ko'rsatadi, aks holda AQ initsialini chiqaradi */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold overflow-hidden"
          style={{
            background: avatar
              ? "none"
              : "linear-gradient(135deg,var(--brand),var(--violet))",
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            "AQ"
          )}
        </div>

        <div>
          {/* Yashirin fayl tanlash inputi */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />
          <button
            className="btn-ghost text-sm flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload size={14} /> Rasmni o'zgartirish
          </button>
          <p
            className="text-xs mt-1"
            style={{
              color: "var(--text-faint)",
            }}
          >
            JPG, PNG. Maks 2MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputRow label="Ism" value="Alisher" />
        <InputRow label="Familiya" value="Qodirov" />
        <InputRow label="Telefon" value="+998 90 100 00 01" type="tel" />
        <InputRow label="Email" value="alisher@uymarket.uz" type="email" />
      </div>
      <InputRow label="Lavozim" value="Administrator" />

      <div className="flex justify-end">
        <button
          onClick={() => success("Profil saqlandi")}
          className="btn-primary"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}

function AppearanceContent() {
  const { dark, toggle } = useTheme();
  const { success } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-semibold mb-3"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Interfeys temasi
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              key: "light",
              label: "Yorug'",
              icon: Sun,
              bg: "#F7F8FC",
            },
            {
              key: "dark",
              label: "Qorong'u",
              icon: Moon,
              bg: "#0B1120",
            },
          ].map((t) => {
            const active =
              t.key === "system" ? false : (t.key === "dark") === dark;
            return (
              <button
                key={t.key}
                onClick={toggle}
                className="p-3 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                }}
              >
                <div
                  className="w-full h-12 rounded-xl mb-2 overflow-hidden"
                  style={{
                    background: t.bg,
                    border: "1px solid var(--border)",
                  }}
                />
                <div className="flex items-center gap-1.5">
                  {t.icon && (
                    <t.icon
                      size={13}
                      style={{
                        color: "var(--text-muted)",
                      }}
                    />
                  )}
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {t.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => success("Sozlamalar saqlandi")}
        className="btn-primary"
      >
        Saqlash
      </button>
    </div>
  );
}

function SecurityContent() {
  const { success } = useToast();

  return (
    <div className="space-y-5">
      <div
        className="p-4 rounded-2xl"
        style={{
          background: "var(--brand-light)",
          border: "1px solid var(--brand-border)",
        }}
      >
        <div
          className="text-sm font-semibold mb-0.5"
          style={{
            color: "var(--brand)",
          }}
        >
          Hisobingiz xavfsiz
        </div>
        <p
          className="text-xs"
          style={{
            color: "var(--brand)",
          }}
        >
          So'nggi kirish: 08 Sep 2026, 09:24 — Toshkent
        </p>
      </div>

      <div className="space-y-4">
        <InputRow label="Joriy parol" type="password" placeholder="••••••••" />
        <InputRow label="Yangi parol" type="password" placeholder="••••••••" />
        <InputRow
          label="Yangi parolni tasdiqlang"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <Toggle
        label="Ikki bosqichli tasdiqlash"
        desc="SMS yoki authenticator orqali"
        defaultOn
      />
      <Toggle
        label="Faoliyatni kuzatish"
        desc="Barcha kirish va amallarni saqlash"
        defaultOn
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={() => success("Parol yangilandi")}
          className="btn-primary"
        >
          Parolni yangilash
        </button>
      </div>
    </div>
  );
}

const contentMap = {
  profile: <ProfileContent />,
  appearance: <AppearanceContent />,
  security: <SecurityContent />,
};

export default function Settings() {
  const [active, setActive] = useState("profile");
  const section = sections.find((s) => s.key === active);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1
          className="font-display font-bold text-2xl"
          style={{
            fontFamily: "'Manrope',sans-serif",
            color: "var(--text-primary)",
          }}
        >
          Sozlamalar
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Tizim va profil sozlamalari
        </p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <div
          className="w-52 shrink-0 rounded-2xl p-2 self-start"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background:
                  active === s.key ? "var(--brand-light)" : "transparent",
                color:
                  active === s.key ? "var(--brand)" : "var(--text-secondary)",
                fontWeight: active === s.key ? 600 : 400,
              }}
            >
              <s.icon
                size={15}
                style={{
                  color:
                    active === s.key ? "var(--brand)" : "var(--text-faint)",
                }}
              />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          className="flex-1 rounded-2xl p-6"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2
            className="font-display font-semibold text-lg mb-5"
            style={{
              fontFamily: "'Manrope',sans-serif",
              color: "var(--text-primary)",
            }}
          >
            {section?.label}
          </h2>

          {contentMap[active] || (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                {section && (
                  <section.icon
                    size={20}
                    style={{
                      color: "var(--text-faint)",
                    }}
                  />
                )}
              </div>
              <p
                className="text-sm font-medium mb-1"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {section?.label}
              </p>
              <p
                className="text-xs"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Bu bo'lim tez orada qo'shiladi
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}