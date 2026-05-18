import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Zap, Shield, CloudLightning, GraduationCap,
  Phone, Mail, MapPin,
  ArrowRight, Menu, X,
  Star, Check, AlertCircle,
  Award, Users, Clock,
  ChevronRight, BadgeCheck, Building2,
} from 'lucide-react'

// ─── Motion helpers ───────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -60px 0px' },
  transition: { duration: 0.52, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

// ─── Static data ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Služby',    href: '#sluzby' },
  { label: 'Ceník',     href: '#cenik' },
  { label: 'Reference', href: '#reference' },
  { label: 'Kontakt',   href: '#kontakt' },
]

const SERVICES = [
  {
    id: 'spotrebice',
    icon: Zap,
    color: 'amber',
    badge: 'Povinné pro firmy',
    title: 'Revize elektrospotřebičů',
    norm: 'ČSN 33 1600 ed. 2',
    desc: 'Pravidelná kontrola elektrospotřebičů a nářadí. Chrání zaměstnance, majetek a pojistné nároky dle ČSN 33 1600 ed. 2.',
    bullets: [
      'Skupina A: před každým vydáním dalšímu uživateli',
      'Skupiny B–C: každé 3 až 24 měsíců (dle třídy)',
      'Skupiny D–E: každých 12 až 24 měsíců (dle třídy)',
      'Dle ČSN 33 1600 ed. 2',
    ],
  },
  {
    id: 'hromosvod',
    icon: CloudLightning,
    color: 'sky',
    badge: 'Pro všechny budovy',
    title: 'Revize hromosvodů a uzemnění',
    norm: 'ČSN EN 62305',
    desc: 'Komplexní revize systémů ochrany před bleskem a uzemnění objektů dle platných ČSN EN norem.',
    bullets: [
      'Hladina ochrany I–II: úplná revize 1× za 2 roky',
      'Hladina ochrany III–IV: úplná revize 1× za 4 roky',
      'Vizuální kontrola: každý rok (všechny hladiny)',
      'Kritické systémy: úplná revize každý rok',
    ],
  },
  {
    id: 'instalace',
    icon: Shield,
    color: 'emerald',
    badge: 'Nutné při prodeji',
    title: 'Revize elektroinstalací a rozvodů',
    norm: 'ČSN 33 1500',
    desc: 'Revize pevných elektroinstalací v bytech, domech i průmyslových objektech. Povinná při nájmu nebo prodeji.',
    bullets: [
      'Normální prostředí (byty, kanceláře): 5 let',
      'Školy, hotely a ubytování: 3 roky',
      'Prostory s rizikem požáru nebo výbuchu: 2 roky',
      'Mokré a extrémní prostory: 1 rok',
    ],
  },
  {
    id: 'skoleni',
    icon: GraduationCap,
    color: 'violet',
    badge: 'Vyhláška 50 / NV 194/2022',
    title: 'Školení a přezkoušení',
    norm: 'Vyhláška č. 50/78 Sb.',
    desc: 'Odborná způsobilost v elektrotechnice. Přezkoušení §3–§10 dle Vyhlášky č. 50/78 Sb. (dnes NV 194/2022 Sb.).',
    bullets: [
      '§3, §4 – Pracovníci seznámení a poučení',
      '§5, §6 – Pracovníci znalí a pro samostatnou činnost',
      '§7, §8 – Pracovníci pro řízení provozu a dodavatelů',
      'Třída A (bez výbuchu) a Třída B (s výbuchem)',
    ],
  },
]

const ICON_BG = {
  amber:   'bg-amber-50   text-amber-500',
  sky:     'bg-sky-50     text-sky-500',
  emerald: 'bg-emerald-50 text-emerald-500',
  violet:  'bg-violet-50  text-violet-500',
}

const BADGE_CLS = {
  amber:   'bg-amber-50   border-amber-200   text-amber-700',
  sky:     'bg-sky-50     border-sky-200     text-sky-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  violet:  'bg-violet-50  border-violet-200  text-violet-700',
}

const PRICING = [
  {
    id: 'spotrebice',
    label: 'Revize elektrospotřebičů',
    rows: [
      { name: 'Skupina A – Spotřebiče poskytované formou pronájmu',           price: '50 Kč/ks',  note: '' },
      { name: 'Skupina B – Venkovní prostory (stavby, zemědělství)',          price: '50 Kč/ks',  note: '' },
      { name: 'Skupina C – Průmyslová a řemeslná činnost (vnitřní)',          price: '50 Kč/ks',  note: '' },
      { name: 'Skupina D – Veřejně přístupné prostory (školy, hotely)',       price: '50 Kč/ks',  note: '' },
      { name: 'Skupina E – Administrativní činnost',                          price: '50 Kč/ks',  note: '' },
      { name: 'Revize do 20 kusů',                                            price: '2 000 Kč',  note: 'paušálně' },
      { name: 'Kontrola svářečky',                                            price: '150 Kč/ks', note: '' },
    ],
    footnote: 'Cena se může lišit dle druhu a počtu spotřebičů. Dle ČSN 33 1600 ed. 2. Konečná cena po dohodě.',
  },
  {
    id: 'instalace',
    label: 'Elektroinstalace',
    rows: [
      { name: 'Revize bytu',                                               price: '1 500–2 000 Kč', note: 'dle rozsahu' },
      { name: 'Revize rodinného domu',                                     price: '2 000–3 500 Kč', note: 'dle rozsahu' },
      { name: 'Revize průmyslového nebo komerčního objektu',              price: '2 500–5 000 Kč', note: 'dle rozsahu' },
      { name: 'Revize zásuvkového vývodu',                                 price: '500 Kč',         note: '' },
      { name: 'Revize el. přípojky',                                       price: '1 000 Kč',       note: '' },
      { name: 'Revize strojního zařízení',                                 price: '600–4 000 Kč',   note: '' },
      { name: 'Kontroly strojních zařízení dle NV č. 378/2001 Sb.',       price: '800 Kč',         note: '' },
      { name: 'Revize hromosvodu a uzemnění',                              price: '1 000–2 000 Kč', note: 'dle rozsahu' },
      { name: 'Kusové ověření rozvaděče',                                  price: '1 000 Kč',       note: '' },
      { name: 'Protokol o určení vnějších vlivů',                          price: '4 000 Kč',       note: '' },
      { name: 'Elektro práce mimo rozsah revize',                          price: '400 Kč/hod.',    note: '' },
    ],
    footnote: 'Ceny jsou pouze informativní. Konečná cena se stanovuje vždy po dohodě odběratele s dodavatelem.',
  },
  {
    id: 'skoleni',
    label: 'Školení / Ostatní',
    rows: [
      { name: 'Vyhláška č. 50/78 §3 – Pracovníci seznámení',                               price: '500 Kč',   note: '' },
      { name: 'Vyhláška č. 50/78 §4 – Pracovníci poučení',                                 price: '800 Kč',   note: '' },
      { name: 'Třída A §5 – Pracovníci znalí',                                              price: '1 200 Kč', note: 'bez výbuchu' },
      { name: 'Třída A §6 / §6+§7 – Samostatná a řídící činnost',                          price: '1 500 Kč', note: 'bez výbuchu' },
      { name: 'Třída A §6+§7+§8 / §6+§10 / §6+§7+§10',                                     price: '1 800 Kč', note: 'bez výbuchu' },
      { name: 'Třída A §6+§7+§8+§10',                                                       price: '2 000 Kč', note: 'bez výbuchu' },
      { name: 'Třída B §6 / §6+§7 (s nebezpečím výbuchu)',                                price: '1 900 Kč', note: 's výbuchem' },
      { name: 'Třída B §6+§7+§8 / §6+§10 / §6+§7+§10',                                     price: '2 200 Kč', note: 's výbuchem' },
      { name: 'Třída B §6+§7+§8+§10',                                                       price: '2 400 Kč', note: 's výbuchem' },
    ],
    footnote: 'Ceny dle Vyhlášky č. 50/78 Sb. (nyní NV 194/2022 Sb.). Třída A = bez nebezpečí výbuchu. Třída B = s nebezpečím výbuchu.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Zuzana Bydžovská',
    rating: 5,
    type: 'Revize spotřebičů',
    text: 'Pán byl ochotný nás vyjímečně vzít na revizi elektrospotřebičů bez objednání, za což jsme velmi vděčné. Milé a profesionální chování. Moc děkujeme a můžeme jen doporučit 😄',
  },
  {
    name: 'Ranko Ferfecki',
    rating: 5,
    type: 'Revize elektroinstalace',
    text: 'Oceňuji hlavně lidský přístup a odstranění drobných vad, tak aby bylo vše v pořádku. Člověku jako já, který elektrice moc nehový, vše ochotně vysvětlil a uvedl do souladu s normami. Moc dík.',
  },
  {
    name: 'Markéta Reszczyńská',
    rating: 5,
    type: 'Revize elektrorozvodů',
    text: 'Ochotný profesionál, který mi pomohl, když jsem potřebovala zhodnotit stav elektrorozvodů. Doporučuji!',
  },
  {
    name: 'Adam Hamerník',
    rating: 5,
    type: 'Revize spotřebiče',
    text: 'Rychle provedená revize nabíječky. Skvělý přístup a ochota. Rozhodně doporučuji',
  },
  {
    name: 'Kozovid',
    rating: 5,
    type: 'Elektrorevize',
    text: 'Profesionál, slušný, dobrá domluva, mohu jen doporučit 😉',
  },
  {
    name: 'Petra Skrbková',
    rating: 4,
    type: 'Revize',
    text: '',
  },
]

const REVISION_TYPES = [
  'Revize elektrospotřebičů a nářadí',
  'Revize elektroinstalace (byt, dům, objekt)',
  'Revize hromosvodu a uzemnění',
  'Revize strojního zařízení',
  'Přezkoušení dle Vyhlášky č. 50/78 Sb. (§3–§10)',
  'Jiné / nevím',
]

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/70 shadow-sm shadow-slate-900/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm shadow-amber-300/60">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <span className="block font-bold text-slate-900 text-sm tracking-tight">Elektrorevize</span>
            <span className="block text-amber-600 text-[11px] font-semibold tracking-wider uppercase">Hrbek Petr</span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <motion.a
            href="tel:+420608899606"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Phone size={13} strokeWidth={2.5} />
            +420 608 899 606
          </motion.a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 -mr-1 text-slate-700 hover:text-slate-900 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-0.5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-slate-700 py-2.5 border-b border-slate-100 last:border-0"
                >
                  {label}
                </a>
              ))}
              <a
                href="tel:+420608899606"
                className="flex items-center justify-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-3 rounded-xl mt-3"
              >
                <Phone size={14} strokeWidth={2.5} />
                +420 608 899 606
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-b from-slate-50 via-white to-slate-50/70 overflow-hidden pt-16">

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute -top-16 right-0 w-[640px] h-[640px] bg-amber-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[480px] h-[480px] bg-sky-50/70 rounded-full blur-3xl" />
        {/* Subtle dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.045]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" className="text-slate-900" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
        <div className="max-w-3xl">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/90 text-amber-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 shadow-sm"
          >
            <BadgeCheck size={13} strokeWidth={2.5} />
            Certifikovaný revizní technik · Platné oprávnění
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold text-slate-900 leading-[1.07] tracking-tight mb-6"
          >
            Bezpečné elektroinstalace{' '}
            <span className="relative inline">
              <span className="relative z-10 text-amber-500">a certifikované&nbsp;revize</span>
              <span
                className="absolute left-0 -bottom-0.5 w-full h-[7px] bg-amber-200/55 rounded-full -z-0"
                aria-hidden="true"
              />
            </span>{' '}
            bez starostí
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl"
          >
            Revize elektroinstalací, spotřebičů a hromosvodů pro{' '}
            <strong className="font-semibold text-slate-800">firmy i domácnosti</strong>. Profesionální přístup,
            rychlé termíny a platné oprávnění dle{' '}
            <strong className="font-semibold text-slate-800">NV&nbsp;194/2022&nbsp;Sb.</strong>
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="flex flex-col sm:flex-row gap-3 mb-14"
          >
            <motion.a
              href="#kontakt"
              className="group inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-amber-300/50 hover:shadow-xl hover:shadow-amber-400/40 transition-all duration-200"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
            >
              Nezávazná poptávka
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-150" />
            </motion.a>
            <motion.a
              href="tel:+420608899606"
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-base px-7 py-3.5 rounded-xl shadow-sm transition-all duration-200"
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
            >
              <Phone size={15} className="text-amber-500" strokeWidth={2.5} />
              Zavolat přímo
            </motion.a>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
            className="flex flex-wrap gap-x-8 gap-y-5"
          >
            {[
              { value: '15+',     label: 'let v oboru',           icon: Clock  },
              { value: '500+',    label: 'spokojených klientů',    icon: Users  },
              { value: '5,0 ★',   label: 'hodnocení Google',       icon: Star   },
              { value: '48 h',    label: 'standardní termín',      icon: Award  },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon size={16} className="text-amber-500" />
                </div>
                <div className="leading-none">
                  <div className="text-[1.1rem] font-extrabold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="sluzby" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div {...fadeUp(0)} className="max-w-2xl mb-14">
          <div className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3">Naše služby</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Čtyři pilíře elektrické bezpečnosti
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Kompletní spektrum elektrotechnických revizí pro fyzické i právnické osoby. Každá revize je doložena zákonným revizním protokolem.
          </p>
        </motion.div>

        {/* 4-column card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              {...fadeUp(i * 0.07)}
              className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-amber-300 hover:shadow-xl hover:shadow-amber-50/80 transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${ICON_BG[s.color]}`}>
                <s.icon size={21} strokeWidth={1.8} />
              </div>

              {/* Badge */}
              <span className={`self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border mb-3 ${BADGE_CLS[s.color]}`}>
                {s.badge}
              </span>

              <h3 className="font-bold text-slate-900 text-[0.95rem] leading-snug mb-1">{s.title}</h3>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide mb-3 uppercase">{s.norm}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{s.desc}</p>

              {/* Interval bullets */}
              <ul className="space-y-2 border-t border-slate-100 pt-4 mt-auto">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                    <Check size={11} className="text-amber-500 flex-shrink-0 mt-0.5" strokeWidth={3} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Legislation callout */}
        <motion.div
          {...fadeUp(0.32)}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 rounded-2xl px-7 py-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle size={15} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-bold">Nová legislativa od 1. 7. 2022</span>
            </div>
            <p className="text-white font-bold text-lg">NV 194/2022 Sb. nahradilo Vyhlášku 50/1978 Sb.</p>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Nové nařízení vlády přineslo aktualizované požadavky na odbornou způsobilost v elektrotechnice.
              Potřebujete poradit, co to znamená pro vaši firmu?
            </p>
          </div>
          <a
            href="#kontakt"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors duration-200"
          >
            Chci se poradit <ChevronRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const [activeTab, setActiveTab] = useState('spotrebice')
  const tab = PRICING.find((t) => t.id === activeTab)

  return (
    <section id="cenik" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div {...fadeUp(0)} className="max-w-2xl mb-12">
          <div className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3">Ceník</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Transparentní orientační ceny
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Přesná cena závisí na rozsahu práce a lokalitě. Konzultace a nacenění jsou vždy zdarma.
          </p>
        </motion.div>

        {/* Tab bar */}
        <motion.div {...fadeUp(0.08)} className="flex flex-wrap gap-2 mb-7">
          {PRICING.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                activeTab === t.id
                  ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-300/40'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Animated table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Table head */}
            <div className="grid grid-cols-[1fr,auto,100px] gap-x-6 px-6 py-3 bg-slate-50 border-b border-slate-200">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Typ služby</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Cena</span>
              <span className="hidden sm:block text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Poznámka</span>
            </div>

            {/* Rows */}
            {tab.rows.map((row, i) => (
              <div
                key={row.name}
                className={`grid grid-cols-[1fr,auto] sm:grid-cols-[1fr,auto,100px] gap-x-6 items-center px-6 py-3.5 border-b border-slate-100 last:border-0 ${
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                }`}
              >
                <span className="text-sm text-slate-700 leading-snug">{row.name}</span>
                <span
                  className={`text-sm font-bold text-right whitespace-nowrap ${
                    row.price === 'dohodou' ? 'text-slate-400 italic font-normal' : 'text-slate-900'
                  }`}
                >
                  {row.price}
                </span>
                {row.note ? (
                  <span className="hidden sm:block text-xs text-slate-400 text-right">{row.note}</span>
                ) : (
                  <span className="hidden sm:block" />
                )}
              </div>
            ))}

            {/* Footnote */}
            <div className="px-6 py-4 bg-amber-50/60 border-t border-amber-100/80 flex items-start gap-2.5">
              <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800/80 leading-relaxed">{tab.footnote}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Free estimate strip */}
        <motion.div
          {...fadeUp(0.18)}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm"
        >
          <p className="text-sm text-slate-600 text-center sm:text-left">
            Potřebujete přesnou cenovou nabídku? Ozvěte se — konzultace je <strong className="font-semibold text-slate-900">zdarma</strong>.
          </p>
          <a
            href="#kontakt"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-sm"
          >
            Poptávka zdarma <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  )
}

const GOOGLE_COLORS = [
  'text-blue-500', 'text-red-500', 'text-amber-500',
  'text-blue-500', 'text-green-500', 'text-red-500',
]

function Testimonials() {
  return (
    <section id="reference" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div {...fadeUp(0)} className="max-w-xl">
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3">Reference</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Co říkají naši klienti
            </h2>
          </motion.div>

          {/* Google badge */}
          <motion.div
            {...fadeUp(0.08)}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 self-start sm:self-auto"
          >
            <div className="flex items-baseline gap-0">
              {'Google'.split('').map((l, i) => (
                <span key={i} className={`text-[1.1rem] font-extrabold leading-none ${GOOGLE_COLORS[i]}`}>{l}</span>
              ))}
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <Stars rating={5} />
            <span className="text-sm font-extrabold text-slate-900">5,0</span>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp(i * 0.06)}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
            >
              {/* Author row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div className="leading-none">
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.type}</div>
                  </div>
                </div>
                <BadgeCheck size={16} className="text-blue-500 flex-shrink-0" title="Ověřená recenze Google" />
              </div>

              <Stars rating={t.rating} />

              {t.text && <p className="text-sm text-slate-600 leading-relaxed flex-1">"{t.text}"</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact form ─────────────────────────────────────────────────────────────

const INPUT = [
  'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900',
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
  'transition-all duration-200',
].join(' ')

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: wire to email service / Formspree / API
    setSent(true)
  }

  return (
    <section id="kontakt" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* Info panel */}
          <motion.div {...fadeUp(0)} className="lg:col-span-2">
            <div className="text-[11px] font-black uppercase tracking-widest text-amber-500 mb-3">Kontakt</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Poptejte nás zdarma
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8">
              Odpovíme do 24 hodin. Revizi zvládneme nejčastěji do&nbsp;48&nbsp;hodin od objednání.
            </p>

            <div className="space-y-5">
              {[
                { icon: Phone, label: 'Telefon',        href: 'tel:+420608899606',              value: '+420 608 899 606' },
                { icon: Mail,  label: 'E-mail',         href: 'mailto:petrhrbek@seznam.cz',    value: 'petrhrbek@seznam.cz' },
                { icon: MapPin,label: 'Oblast působení', href: null,                                   value: 'Praha a okolí' },
              ].map(({ icon: Icon, label, href, value }) => {
                const Inner = (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                      <Icon size={17} className="text-amber-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">{label}</div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{value}</div>
                    </div>
                  </div>
                )
                return href ? (
                  <a key={label} href={href} className="group block">{Inner}</a>
                ) : (
                  <div key={label} className="group">{Inner}</div>
                )
              })}

              {/* Billing */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={17} className="text-slate-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Fakturační údaje</div>
                  <div className="text-sm font-bold text-slate-900">Petr Hrbek</div>
                  <div className="text-xs text-slate-400 mt-0.5">IČO: XXXXXXXX · DIČ: CZXXXXXXXX</div>
                </div>
              </div>
            </div>

            {/* Hours card */}
            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-3">
                <Clock size={13} className="text-amber-500" />
                DOSTUPNOST
              </div>
              <dl className="space-y-2">
                {[
                  ['Po – Pá', '8:00 – 17:00'],
                  ['Sobota',  'dohodou'],
                  ['Neděle',  'urgentní případy'],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <dt className="text-slate-500">{day}</dt>
                    <dd className="font-semibold text-slate-900">{hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Form card */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="py-14 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-emerald-500" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">Poptávka odeslána!</h3>
                  <p className="text-sm text-slate-500">Ozveme se do 24 hodin na váš e-mail nebo telefon.</p>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Jméno a příjmení <span className="text-amber-500">*</span>
                      </label>
                      <input
                        name="name" required value={form.name} onChange={set}
                        placeholder="Jan Novák"
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Telefon <span className="text-amber-500">*</span>
                      </label>
                      <input
                        name="phone" required type="tel" value={form.phone} onChange={set}
                        placeholder="+420 XXX XXX XXX"
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      E-mail <span className="text-amber-500">*</span>
                    </label>
                    <input
                      name="email" required type="email" value={form.email} onChange={set}
                      placeholder="jan@firma.cz"
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Typ revize</label>
                    <div className="relative">
                      <select
                        name="type" value={form.type} onChange={set}
                        className={`${INPUT} appearance-none pr-9 cursor-pointer`}
                      >
                        <option value="">Vyberte typ revize…</option>
                        {REVISION_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronRight
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Popis / zpráva
                    </label>
                    <textarea
                      name="message" value={form.message} onChange={set} rows={4}
                      placeholder="Stručný popis — počet spotřebičů, typ objektu, lokalita, preferovaný termín…"
                      className={`${INPUT} resize-none`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-amber-300/50 transition-all duration-200"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    Odeslat poptávku
                    <ArrowRight size={16} />
                  </motion.button>

                  <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                    Odesláním souhlasíte se zpracováním osobních údajů za účelem vyřízení vaší poptávky.
                    Data nebudou sdílena třetím stranám.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-sm">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white">Elektrorevize</span>
            <span className="text-amber-500 font-semibold">Hrbek Petr</span>
          </div>

          {/* Billing */}
          <div className="text-center text-xs leading-relaxed">
            <span className="text-slate-300 font-semibold">Petr Hrbek</span>
            <span className="mx-2 text-slate-700">·</span>
            IČO: XXXXXXXX
            <span className="mx-2 text-slate-700">·</span>
            DIČ: CZXXXXXXXX
          </div>

          {/* Copyright */}
          <div className="text-xs text-center sm:text-right">
            <div className="text-slate-400">© 2026 Elektrorevize Hrbek Petr</div>
            <div className="text-slate-600 mt-0.5">Všechna práva vyhrazena</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
