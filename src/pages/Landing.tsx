import { useState, useEffect, useRef, ReactNode, MouseEvent } from "react";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Employees", href: "/directory" },
  { label: "Attendance", href: "#attendance" },
  { label: "Leave", href: "#leave" },
  { label: "Reports", href: "/analytics" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Employee Directory",
    desc: "Access comprehensive employee profiles, contact information, and departmental details — all organized and searchable.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0" />
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
      </svg>
    ),
    title: "Attendance Tracking",
    desc: "Real-time clock in/out, attendance records, and automated daily reports to monitor workforce presence.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Leave Management",
    desc: "Submit leave requests, view approval status, and check your leave balance — all in one intuitive interface.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Payroll Summary",
    desc: "View salary details, deductions, and payment history with transparent breakdowns and year-to-date reports.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Performance Reviews",
    desc: "Track evaluations, feedback, and development goals to foster professional growth and career advancement.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Reports & Analytics",
    desc: "Generate custom reports on attendance, leaves, performance, and departmental trends for data-driven decisions.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Log In with Your CSU Credentials",
    desc: "Use your employee ID and password to access the secure Employee Management System portal.",
    link: "/dashboard",
    linkLabel: "Go to Dashboard →",
  },
  {
    num: "02",
    title: "View Your Profile & Update Info",
    desc: "Update your personal information, contact details, and emergency contacts in your employee profile.",
    link: "/directory",
    linkLabel: "Access Directory →",
  },
  {
    num: "03",
    title: "Submit Leave & Check Attendance",
    desc: "Request leave, view your attendance records, and track your balance — all in real time.",
    link: "#leave",
    linkLabel: "Manage Leave →",
  },
];

const STATS = [
  { value: "300+", label: "Employees" },
  { value: "95%", label: "Avg. Attendance" },
  { value: "5", label: "Departments" },
  { value: "24/7", label: "System Access" },
];

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

interface AnimSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

function AnimSection({ children, className = "", delay = 0 }: AnimSectionProps) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface EMSLandingProps {
  onNavigateDashboard: () => void;
  onNavigateDirectory: () => void;
  onNavigateAnalytics: () => void;
}

export default function EMSLanding({
  onNavigateDashboard,
  onNavigateDirectory,
  onNavigateAnalytics,
}: EMSLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("/")) return;
    event.preventDefault();
    if (href === "/dashboard") {
      onNavigateDashboard();
      return;
    }
    if (href === "/directory") {
      onNavigateDirectory();
      return;
    }
    if (href === "/analytics") {
      onNavigateAnalytics();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700&display=swap');
        :root {
          --csu-green: #1a5c2e;
          --csu-green-dark: #0f3d1e;
          --csu-green-mid: #246b37;
          --csu-green-light: #e8f3ec;
          --csu-green-xlight: #f3f9f5;
          --csu-gold: #c8991a;
          --csu-gold-light: #fdf6e3;
          --csu-cream: #fafaf7;
          --font-display: 'Space Grotesk', sans-serif;
          --font-sans: 'Sora', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: var(--font-display); }
        .font-sans { font-family: var(--font-sans); }
        .btn-primary {
          background: var(--csu-green);
          color: white;
          padding: 14px 32px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none;
          border: none; cursor: pointer;
        }
        .btn-primary:hover { background: var(--csu-green-dark); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(26,92,46,0.25); }
        .btn-outline {
          background: transparent;
          color: white;
          padding: 13px 32px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 15px;
          border: 1.5px solid rgba(255,255,255,0.55);
          transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; cursor: pointer;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.12); border-color: white; }
        .hero-bg {
          background: linear-gradient(155deg, var(--csu-green-dark) 0%, var(--csu-green) 45%, #2d7a44 100%);
          position: relative; overflow: hidden;
        }
        .hero-pattern {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px, 45px 45px;
        }
        .hero-glow {
          position: absolute;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,153,26,0.12) 0%, transparent 70%);
          top: -200px; right: -200px;
        }
        .hero-glow-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          bottom: -100px; left: -100px;
        }
        .stat-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
        }
        .stat-card:hover { background: rgba(255,255,255,0.13); transform: translateY(-2px); }
        .feature-card {
          background: white;
          border: 1px solid #e8f0eb;
          border-radius: 20px;
          padding: 28px;
          transition: box-shadow 0.25s, transform 0.2s, border-color 0.2s;
        }
        .feature-card:hover {
          box-shadow: 0 12px 40px rgba(26,92,46,0.10);
          transform: translateY(-3px);
          border-color: #b8dbc4;
        }
        .step-number {
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 300;
          color: var(--csu-green-light);
          line-height: 1;
          letter-spacing: -2px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: color 0.15s;
          letter-spacing: 0.01em;
        }
        .nav-link:hover { color: white; }
        .scrolled-nav {
          background: rgba(10,40,20,0.95) !important;
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }
        .mobile-menu {
          background: var(--csu-green-dark);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .badge {
          background: var(--csu-gold-light);
          color: var(--csu-gold);
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          border-radius: 999px;
          display: inline-block;
          text-transform: uppercase;
        }
        .section-label {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--csu-green);
        }
        .divider-leaf {
          width: 48px; height: 3px;
          background: linear-gradient(90deg, var(--csu-green), var(--csu-gold));
          border-radius: 99px;
          display: inline-block;
        }
        .footer-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .footer-link:hover { color: rgba(255,255,255,0.9); }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .float-anim-2 { animation: float2 8s ease-in-out infinite; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? undefined : "transparent" }}
        data-scrolled={scrolled}
      >
        <div
          className={`transition-all duration-300 ${scrolled ? "scrolled-nav" : ""}`}
          style={{ background: scrolled ? "rgba(10,40,20,0.95)" : "transparent" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-display font-700 text-lg leading-none">CSU</span>
                <p className="text-xs leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500, letterSpacing: "0.04em" }}>Employee Management</p>
              </div>
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="nav-link" onClick={handleNavClick(l.href)}>
                  {l.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="/dashboard"
                className="btn-outline"
                style={{ padding: "10px 22px", fontSize: "14px" }}
                onClick={handleNavClick("/dashboard")}
              >
                Dashboard
              </a>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
            >
              {mobileMenuOpen
                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu lg:hidden px-4 sm:px-6 pb-5 sm:pb-6 pt-2 space-y-3 sm:space-y-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="block text-white font-500 py-2"
                  style={{ fontWeight: 500 }}
                  onClick={handleNavClick(l.href)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/dashboard"
                className="btn-primary block text-center mt-4"
                style={{ justifyContent: "center" }}
                onClick={handleNavClick("/dashboard")}
              >
                Dashboard
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-bg min-h-screen flex flex-col justify-center relative">
        <div className="hero-pattern" />
        <div className="hero-glow" />
        <div className="hero-glow-2" />

        {/* Decorative floating shapes */}
        <div className="float-anim absolute right-16 top-1/4 hidden xl:block" style={{ opacity: 0.12 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="88" stroke="white" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="90" cy="90" r="60" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <div className="float-anim-2 absolute left-12 bottom-1/4 hidden xl:block" style={{ opacity: 0.08 }}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <rect x="2" y="2" width="116" height="116" rx="20" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="mb-6">
                <span className="badge">👥 Official HR Platform of CSU</span>
              </div>

              <h1
                className="font-display text-white leading-tight mb-4 sm:mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize: "clamp(32px, 5.5vw, 68px)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                Manage Your
                <br />
                Workforce,{" "}
                <span style={{ color: "#f0c842", fontStyle: "italic" }}>Effortlessly</span>
                <br />
              </h1>

              <p className="mb-6 sm:mb-10 max-w-lg text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.72)", lineHeight: "1.7", fontWeight: 400 }}>
                The Employee Management System (EMS) of Caraga State University — streamline attendance tracking, manage leave requests, view performance reviews, and generate comprehensive reports in one secure platform.
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-14">
                <a href="/dashboard" className="btn-primary" onClick={handleNavClick("/dashboard")}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Access Dashboard
                </a>
                <a href="#getting-started" className="btn-outline">
                  Employee Guide
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STATS.map((s) => (
                  <div key={s.label} className="stat-card">
                    <p className="text-white font-display text-2xl font-500 mb-1" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{s.value}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.03em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side — Employee summary card mockup */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="float-anim relative" style={{ maxWidth: 420 }}>
                {/* Main card */}
                <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}>
                  {/* Card header */}
                  <div style={{ background: "var(--csu-green)", padding: "20px 24px" }} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z" /></svg>
                      </div>
                      <div>
                        <p className="text-white font-600 text-sm" style={{ fontWeight: 600 }}>My Dashboard</p>
                        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>Employee #2024-001</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden" style={{ background: "#b8dbc4" }}>
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="white" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                  </div>
                  {/* Card body */}
                  <div style={{ padding: "20px 24px" }}>
                    <p className="text-xs font-600 mb-3" style={{ color: "var(--csu-green)", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Today's Status</p>
                    
                    {/* Clock in/out widget */}
                    <div className="mb-4 p-4 rounded-2xl" style={{ background: "var(--csu-green-xlight)", border: "1px solid #e0ede5" }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-700" style={{ color: "var(--csu-green)", fontWeight: 700 }}>Clock In/Out</span>
                        <span className="text-sm font-600" style={{ color: "var(--csu-green)" }}>08:30 AM</span>
                      </div>
                      <p className="text-sm" style={{ color: "#5a7a65" }}>Status: <strong>Checked In</strong></p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-3 rounded-2xl" style={{ background: "var(--csu-green-light)", border: "1px solid #c4ddc9" }}>
                        <p className="text-xs" style={{ color: "var(--csu-green)", fontWeight: 700 }}>Attendance</p>
                        <p className="text-lg font-display mt-1" style={{ color: "var(--csu-green)", fontFamily: "var(--font-display)", fontWeight: 600 }}>95%</p>
                      </div>
                      <div className="p-3 rounded-2xl" style={{ background: "#fdf6e3", border: "1px solid #f5d99f" }}>
                        <p className="text-xs" style={{ color: "var(--csu-gold)", fontWeight: 700 }}>Leave Balance</p>
                        <p className="text-lg font-display mt-1" style={{ color: "var(--csu-gold)", fontFamily: "var(--font-display)", fontWeight: 600 }}>8/10</p>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Attendance", icon: "✓" },
                        { label: "Leave", icon: "📅" },
                        { label: "Reports", icon: "📊" },
                      ].map((a) => (
                        <div key={a.label} className="rounded-xl p-3 text-center" style={{ background: "var(--csu-green-light)", border: "1px solid #c4ddc9" }}>
                          <div style={{ fontSize: "18px", marginBottom: "4px" }}>{a.icon}</div>
                          <p style={{ fontSize: "11px", color: "var(--csu-green)", fontWeight: 600 }}>{a.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating notification badge */}
                <div
                  className="absolute -top-4 right-2 sm:-right-4 rounded-2xl shadow-xl px-4 py-3 float-anim-2"
                  style={{ background: "white", border: "1px solid #e8f0eb", minWidth: 160 }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f3ec" }}>
                      <svg className="w-4 h-4" style={{ color: "var(--csu-green)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", color: "#6b8f76", fontWeight: 500 }}>Leave approved</p>
                      <p style={{ fontSize: "13px", color: "#1a2e22", fontWeight: 700 }}>5 days granted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 72L60 60C120 48 240 24 360 18C480 12 600 24 720 30C840 36 960 36 1080 30C1200 24 1320 12 1380 6L1440 0V72H1380C1320 72 1200 72 1080 72C960 72 840 72 720 72C600 72 480 72 360 72C240 72 120 72 60 72H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <div id="attendance" />
      {/* ── FEATURES ── */}
      <section className="py-12 sm:py-16 lg:py-24" style={{ background: "var(--csu-cream)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimSection className="text-center mb-12 sm:mb-16">
            <span className="section-label text-xs sm:text-sm">System Capabilities</span>
            <div className="divider-leaf mx-auto my-3 sm:my-4" />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#0f2b18", letterSpacing: "-0.02em" }}>
              Everything you need to<br />
              <em style={{ fontStyle: "italic", color: "var(--csu-green)" }}>manage your team</em>
            </h2>
            <p className="mt-3 sm:mt-4 mx-auto max-w-xl text-sm sm:text-base" style={{ color: "#5a7a65", lineHeight: "1.65" }}>
              Comprehensive HR and workforce management tools designed for the university environment.
            </p>
          </AnimSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => (
              <AnimSection key={f.title} delay={i * 80}>
                <div className="feature-card h-full">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: "var(--csu-green-light)", color: "var(--csu-green)" }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-600 text-lg mb-3" style={{ color: "#0f2b18", fontWeight: 700 }}>{f.title}</h3>
                  <p style={{ color: "#5a7a65", fontSize: "15px", lineHeight: "1.65" }}>{f.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      <div id="leave" />
      {/* ── GETTING STARTED ── */}
      <section id="getting-started" className="py-12 sm:py-16 lg:py-24" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimSection className="text-center mb-10 sm:mb-16">
            <span className="section-label">Quick Start Guide</span>
            <div className="divider-leaf mx-auto my-4" />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: "#0f2b18", letterSpacing: "-0.02em" }}>
              Get started in<br />
              <em style={{ fontStyle: "italic", color: "var(--csu-green)" }}>three simple steps</em>
            </h2>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--csu-green-light), transparent)" }}
            />
            {STEPS.map((s, i) => (
              <AnimSection key={s.num} delay={i * 100} className="relative">
                <div className="p-5 sm:p-8 rounded-3xl h-full" style={{ background: "var(--csu-green-xlight)", border: "1px solid #d6eadc" }}>
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <span className="step-number text-4xl sm:text-5xl">{s.num}</span>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-700 text-white"
                      style={{ background: "var(--csu-green)", fontWeight: 700, flexShrink: 0 }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 sm:mb-3" style={{ color: "#0f2b18", fontWeight: 700, lineHeight: 1.3 }}>{s.title}</h3>
                  <p className="mb-4 sm:mb-5 text-sm sm:text-base" style={{ color: "#5a7a65", lineHeight: "1.65" }}>{s.desc}</p>
                  <a
                    href={s.link}
                    className="inline-flex items-center gap-1.5 font-600 text-sm"
                    style={{ color: "var(--csu-green)", fontWeight: 700, textDecoration: "none" }}
                    onClick={handleNavClick(s.link)}
                  >
                    {s.linkLabel}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </a>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* Mobile access callout */}
          <AnimSection className="mt-8 sm:mt-12">
            <div className="rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6" style={{ background: "var(--csu-green)", color: "white" }}>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
                </svg>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-10px sm:text-xs" style={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "4px" }}>Mobile Access</p>
                <h3 className="text-xl sm:text-2xl mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Manage anywhere, anytime</h3>
                <p className="text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.72)" }}>Access the Employee Management System on any device. Fully responsive design works on smartphones, tablets, and desktops for on-the-go workforce management.</p>
              </div>
              <a
                href="/dashboard"
                className="btn-outline flex-shrink-0"
                style={{ fontSize: "13px", padding: "10px 18px" }}
                onClick={handleNavClick("/dashboard")}
              >
                Launch EMS
              </a>
            </div>
          </AnimSection>
        </div>
      </section>

      <div id="reports" />
      {/* ── CTA BANNER ── */}
      <section className="py-12 sm:py-16 lg:py-24" style={{ background: "var(--csu-cream)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimSection>
            <div
              className="rounded-3xl px-5 sm:px-8 py-10 sm:py-14 lg:py-20 relative overflow-hidden"
              style={{ background: "var(--csu-green-dark)" }}
            >
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 70% 30%, rgba(200,153,26,0.1) 0%, transparent 60%)" }} />
              <div className="relative z-10">
                <span className="badge text-xs sm:text-sm" style={{ background: "rgba(200,153,26,0.2)", color: "#f0c842" }}>Ready to Begin?</span>
                <h2
                  className="mt-3 sm:mt-4 mb-4 sm:mb-5"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(28px, 4vw, 52px)", color: "white", lineHeight: 1.1, letterSpacing: "-0.02em" }}
                >
                  Streamline employee management<br />
                  <em style={{ fontStyle: "italic", color: "#f0c842" }}>at Caraga State University</em>
                </h2>
                <p className="text-sm sm:text-base mb-6 sm:mb-9 mx-auto" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.65" }}>
                  From attendance to reports — access all your HR tools in one secure system. Log in with your CSU credentials to get started.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                  <a
                    href="/dashboard"
                    className="btn-primary"
                    style={{ background: "white", color: "var(--csu-green-dark)" }}
                    onClick={handleNavClick("/dashboard")}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                    Go to Dashboard
                  </a>
                  <a href="#" className="btn-outline">
                    View Documentation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0a2410", color: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px" }}>CSU</span>
                  <span style={{ fontWeight: 600, fontSize: "14px", marginLeft: "4px" }}>EMS</span>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: "1.7", maxWidth: "320px" }}>
                The official Employee Management System of Caraga State University. Competence, Service, and Uprightness.
              </p>
              <p className="mt-4" style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                📧 <a href="mailto:ems@carsu.edu.ph" className="footer-link" style={{ color: "rgba(255,255,255,0.5)" }}>ems@carsu.edu.ph</a>
              </p>
            </div>

            <div>
              <p className="mb-4 text-sm font-700" style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>About CSU</p>
              <div className="space-y-3">
                {[
                  { label: "About CSU", href: "https://www.carsu.edu.ph/about-us/" },
                  { label: "Academic Programs", href: "https://myadmission.carsu.edu.ph/offered-programs/" },
                  { label: "Administration", href: "https://www.carsu.edu.ph/executive-committee/" },
                  { label: "Research & Development", href: "https://www.carsu.edu.ph/ovprdie/" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="block footer-link" onClick={handleNavClick(l.href)}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 text-sm font-700" style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Quick Links</p>
              <div className="space-y-3">
                {[
                  { label: "Employee Dashboard", href: "/dashboard" },
                  { label: "View Directory", href: "/directory" },
                  { label: "Check Attendance", href: "/analytics" },
                  { label: "Submit Leave Request", href: "#leave" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="block footer-link">{l.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
                © {new Date().getFullYear()} Caraga State University. All Rights Reserved.
              </p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
                Managed by CSU – Management Information Systems (MIS) Office
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
