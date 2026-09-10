import './Login.css';
import { useState } from "react";
import { Eye, EyeOff, Store, ArrowRight, CheckCircle2 } from "lucide-react";
export default function Login({ onLogin }) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("admin@uymarket.uz");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1100);
  };
  const features = [
    "Sotuv va inventar boshqaruvi",
    "Mijozlar CRM va qarzdorlik",
    "Moliyaviy analitika va hisobotlar",
    "POS terminal va chek tizimi",
  ];
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "var(--bg)",
      }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,#1E3A8A 0%,var(--brand) 50%,var(--violet) 100%)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px,white 1px,transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle,var(--violet),transparent)",
            transform: "translate(-30%,30%)",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Store size={20} color="white" />
            </div>
            <div>
              <div
                className="text-white font-display font-extrabold text-lg"
                style={{
                  fontFamily: "'Manrope',sans-serif",
                }}
              >
                UyMarket CRM
              </div>
              <div className="text-white/60 text-xs">
                Business Management Platform
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <h1
            className="font-display font-bold text-4xl text-white leading-tight mb-4"
            style={{
              fontFamily: "'Manrope',sans-serif",
            }}
          >
            Biznesingizni
            <br />
            to'liq nazorat qiling
          </h1>
          <p className="text-white/70 text-base mb-8 leading-relaxed">
            Savdo, ombor, moliya va mijozlarni
            <br />
            bir joydan boshqarish imkoniyati.
          </p>
          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                  }}
                >
                  <CheckCircle2 size={12} color="white" />
                </div>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/35 text-xs">
          © 2026 UyMarket CRM. Barcha huquqlar himoyalangan.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md fade-in">
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,var(--brand),var(--violet))",
              }}
            >
              <Store size={18} color="white" />
            </div>
            <span
              className="font-display font-bold text-lg"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              UyMarket CRM
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="font-display font-bold text-2xl mb-2"
              style={{
                fontFamily: "'Manrope',sans-serif",
                color: "var(--text-primary)",
              }}
            >
              Xush kelibsiz! 
            </h2>
            <p
              className="text-sm"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Email yoki telefon
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-xs font-semibold"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Parol
                </label>
                <button
                  type="button"
                  className="text-xs font-medium hover:opacity-70 transition-opacity"
                  style={{
                    color: "var(--brand)",
                  }}
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{
                    color: "var(--text-faint)",
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setRemember(!remember)}
                className="flex items-center justify-center transition-all shrink-0"
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: remember ? "var(--brand)" : "var(--surface)",
                  border: `2px solid ${remember ? "var(--brand)" : "var(--border)"}`,
                }}
              >
                {remember && (
                  <span
                    className="text-white font-bold"
                    style={{
                      fontSize: 11,
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
              <span
                className="text-sm"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                Meni eslab qol
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-semibold text-white transition-all hover:opacity-90 active:scale-98 mt-2"
              style={{
                fontFamily: "'Manrope',sans-serif",
                background:
                  "linear-gradient(135deg,var(--brand) 0%,var(--brand-hover) 100%)",
                boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Yuklanmoqda...
                </>
              ) : (
                <>
                  Kirish <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6"
            style={{
              color: "var(--text-faint)",
            }}
          >
            Demo uchun istalgan parolni kiriting
          </p>
        </div>
      </div>
    </div>
  );
}
