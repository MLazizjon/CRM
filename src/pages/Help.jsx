import './Help.css';
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  BookOpen,
  Keyboard,
  ChevronDown,
  Users,
} from "lucide-react";

const faqs = [
  {
    q: "Qanday qilib yangi mahsulot qo'shaman?",
    a: "Sidebar orqali \"Mahsulotlar → Barcha mahsulotlar\" bo'limiga o'ting va \"Mahsulot qo'shish\" tugmasini bosing.",
  },
  {
    q: "Yangi sotuvni qanday qilaman?",
    a: "\"Sotuvlar → Yangi sotuv (POS)\" bo'limiga o'ting, mahsulotni tanlang, to'lov usulini belgilab tasdiqlang.",
  },
  {
    q: "Qarzdorlarga qanday qo'ng'iroq qilaman?",
    a: "\"Moliya → Qarzdorlik\" bo'limida qarzdor ismini bosing — profilda telefon raqamiga bosib to'g'ridan-to'g'ri qo'ng'iroq qilish mumkin.",
  },
  {
    q: "Hisobotni qanday yuklab olaman?",
    a: "\"Hisobotlar\" bo'limida \"PDF\", \"Excel\" yoki \"Chop etish\" tugmalarini bosib hisobotni saqlashingiz yoki chop etishingiz mumkin.",
  },
  {
    q: "Tungi rejimni qanday yoqaman?",
    a: "Yuqori o'ng burchakdagi quyosh/oy ikonkasiga bosib tungi va kunduzgi rejim o'rtasida almashingiz mumkin.",
  },
];

export default function Help() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ fontFamily: "'Manrope',sans-serif", color: "var(--text-primary)" }}>
          Yordam
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Tizimdan foydalanish bo'yicha qo'llanma va savol-javoblar
        </p>
      </div>

      {/* Quick help cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {[
          { icon: BookOpen, title: "Qo'llanma", desc: "Barcha bo'limlar bo'yicha bosqichma-bosqich ko'rsatmalar", color: "var(--brand)", bg: "var(--brand-light)" },
          { icon: Keyboard, title: "Tezkor amallar", desc: "Ilova ichida tez ishlash uchun maslahatlar", color: "var(--violet)", bg: "var(--violet-light)" },
          { icon: Users, title: "Aloqa", desc: "Savollaringiz bo'lsa biz bilan bog'laning", color: "var(--success)", bg: "var(--success-light)" },
        ].map((c) => (
          <div key={c.title} className="card p-5">
            <div className="p-3 rounded-xl w-fit mb-3" style={{ background: c.bg }}>
              <c.icon size={18} style={{ color: c.color }} />
            </div>
            <div className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>{c.title}</div>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ background: "var(--brand-light)" }}>
            <HelpCircle size={16} style={{ color: "var(--brand)" }} />
          </div>
          <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
            Ko'p so'raladigan savollar
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="rounded-xl" style={{ background: "var(--surface-2)" }}>
              <summary
                className="flex items-center justify-between cursor-pointer p-4 text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {f.q}
                <ChevronDown size={15} style={{ color: "var(--text-muted)" }} />
              </summary>
              <p className="px-4 pb-4 text-sm" style={{ color: "var(--text-muted)" }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ background: "var(--success-light)" }}>
            <MessageCircle size={16} style={{ color: "var(--success)" }} />
          </div>
          <h2 className="font-display font-bold text-lg" style={{ color: "var(--text-primary)" }}>
            Biz bilan bog'lanish
          </h2>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <a
            href="tel:+998901234567"
            className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:opacity-80"
            style={{ background: "var(--surface-2)" }}
          >
            <span className="p-2 rounded-lg" style={{ background: "var(--brand-light)" }}>
              <Phone size={14} style={{ color: "var(--brand)" }} />
            </span>
            <div>
              <div className="text-xs" style={{ color: "var(--text-faint)" }}>Telefon</div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>+998 90 123 45 67</div>
            </div>
          </a>
          <a
            href="mailto: support@uymarket.uz"
            className="flex items-center gap-3 p-4 rounded-xl transition-colors hover:opacity-80"
            style={{ background: "var(--surface-2)" }}
          >
            <span className="p-2 rounded-lg" style={{ background: "var(--violet-light)" }}>
              <Mail size={14} style={{ color: "var(--violet)" }} />
            </span>
            <div>
              <div className="text-xs" style={{ color: "var(--text-faint)" }}>Email</div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>support@uymarket.uz</div>
            </div>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "var(--surface-2)" }}>
            <span className="p-2 rounded-lg" style={{ background: "var(--success-light)" }}>
              <MessageCircle size={14} style={{ color: "var(--success)" }} />
            </span>
            <div>
              <div className="text-xs" style={{ color: "var(--text-faint)" }}>Ish vaqti</div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Dush–Shan, 9:00–18:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}