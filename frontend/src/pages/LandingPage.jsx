import { useState, useEffect, useRef } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

// ── Road bezier control points ──────────────────────────────────────
// Inner edge (glowing top-left side of road)
const IP0 = [-200, 800], IP1 = [120, 560], IP2 = [560, 250], IP3 = [1250, 90];
// Outer edge (box-light bottom-right side of road)
const OP0 = [380,  860], OP1 = [600, 640], OP2 = [870, 400], OP3 = [1250, 220];
// Center (for lane dashes)
const CP0 = [90,  830], CP1 = [360, 600], CP2 = [715, 325], CP3 = [1250, 155];

function bezPt(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [
    u**3*p0[0] + 3*u**2*t*p1[0] + 3*u*t**2*p2[0] + t**3*p3[0],
    u**3*p0[1] + 3*u**2*t*p1[1] + 3*u*t**2*p2[1] + t**3*p3[1],
  ];
}

function bezAngleDeg(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const dx = 3*(u**2*(p1[0]-p0[0]) + 2*u*t*(p2[0]-p1[0]) + t**2*(p3[0]-p2[0]));
  const dy = 3*(u**2*(p1[1]-p0[1]) + 2*u*t*(p2[1]-p1[1]) + t**2*(p3[1]-p2[1]));
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

const FOUR_STOPS = [
  {
    t: 0.18,
    color: 'white',
    icon: '📄',
    text: 'Resume Optimization',
    sub: 'ATS score & keyword analysis',
    badge: 'Optimize',
    glowColor: 'rgba(255, 255, 255, 0.12)',
    borderClr: 'rgba(255, 255, 255, 0.15)',
    textColor: '#a5b4fc',
    bgBadgeColor: 'rgba(99, 102, 241, 0.08)',
    borderBadgeColor: 'rgba(99, 102, 241, 0.2)',
    topColor: '#ffffff',
    leftColor: '#e2e8f0',
    rightColor: '#cbd5e1'
  },
  {
    t: 0.38,
    color: 'orange',
    icon: '🎯',
    text: 'Job Discovery',
    sub: 'Match with high-fit roles',
    badge: 'Discover',
    glowColor: 'rgba(251, 146, 60, 0.22)',
    borderClr: 'rgba(251, 146, 60, 0.22)',
    textColor: '#fdba74',
    bgBadgeColor: 'rgba(251, 146, 60, 0.08)',
    borderBadgeColor: 'rgba(251, 146, 60, 0.2)',
    topColor: '#ffedd5',
    leftColor: '#fb923c',
    rightColor: '#ea580c'
  },
  {
    t: 0.58,
    color: 'purple',
    icon: '📊',
    text: 'Application Tracker',
    sub: 'Track status & pipelines',
    badge: 'Track',
    glowColor: 'rgba(168, 85, 247, 0.22)',
    borderClr: 'rgba(168, 85, 247, 0.22)',
    textColor: '#d8b4fe',
    bgBadgeColor: 'rgba(168, 85, 247, 0.08)',
    borderBadgeColor: 'rgba(168, 85, 247, 0.2)',
    topColor: '#faf5ff',
    leftColor: '#c084fc',
    rightColor: '#9333ea'
  },
  {
    t: 0.78,
    color: 'cyan',
    icon: '🎙️',
    text: 'Interview Hub',
    sub: 'AI mock session & feedback',
    badge: 'Prep',
    glowColor: 'rgba(34, 211, 238, 0.22)',
    borderClr: 'rgba(34, 211, 238, 0.22)',
    textColor: '#67e8f9',
    bgBadgeColor: 'rgba(34, 211, 238, 0.08)',
    borderBadgeColor: 'rgba(34, 211, 238, 0.2)',
    topColor: '#ecfeff',
    leftColor: '#22d3ee',
    rightColor: '#0891b2'
  }
];



const STATS = [
  { value: '94%',  label: 'Interview Rate Boost' },
  { value: '12k+', label: 'Active Users'          },
  { value: '3×',   label: 'Faster Offers'         },
  { value: '98%',  label: 'ATS Pass Rate'         },
];

export default function LandingPage({ onLogin }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [roadHover,setRoadHover]= useState(false);
  const [mounted,  setMounted]  = useState(false);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setRoadHover(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setRoadHover(false);
    }, 100);
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const openModal  = (tab = 'login') => { setActiveTab(tab); setError(''); setModalOpen(true); };
  const closeModal = ()               => { setModalOpen(false); setError(''); };

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = activeTab === 'login'
        ? await api.auth.login(email, password)
        : await api.auth.register(name, email, password);
      if (onLogin) onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  // SVG path strings
  const innerPath = `M ${IP0} C ${IP1} ${IP2} ${IP3}`;
  const outerPath = `M ${OP0} C ${OP1} ${OP2} ${OP3}`;
  const centerPath= `M ${CP0} C ${CP1} ${CP2} ${CP3}`;
  const roadFill  = `M ${IP0} C ${IP1} ${IP2} ${IP3} L ${OP3} C ${OP2} ${OP1} ${OP0} Z`;

  const W = 1250, H = 760;

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-x-hidden select-none"
      style={{ fontFamily:"'Plus Jakarta Sans','Inter',sans-serif" }}>

      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideR  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes dashAnim{ to{stroke-dashoffset:-60} }
        @keyframes boxPulse{ 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes innerPulse{ 0%,100%{opacity:.6} 50%{opacity:1} }

        .a-fade-up { animation:fadeUp .75s ease both }
        .a-fade-in { animation:fadeIn .6s ease both }
        .a-slide-r { animation:slideR .55s ease both }
        .a-float   { animation:floatY 5s ease-in-out infinite }
        .a-dash    { animation:dashAnim 1.2s linear infinite }

        .gbtn { box-shadow:0 0 22px rgba(99,102,241,.18); transition:all .25s }
        .gbtn:hover { box-shadow:0 0 42px rgba(99,102,241,.42); transform:translateY(-1px) }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-5">
        <div className="flex items-center gap-2.5">
          <svg className="w-7 h-7 text-[#4c1dff] flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <defs>
              <mask id="logoMask">
                <rect x="0" y="0" width="24" height="24" fill="white" />
                <rect x="6" y="6" width="12" height="12" fill="black" />
                <line x1="0" y1="0" x2="8" y2="8" stroke="black" strokeWidth="2.5" strokeLinecap="square" />
                <line x1="16" y1="16" x2="24" y2="24" stroke="black" strokeWidth="2.5" strokeLinecap="square" />
              </mask>
            </defs>
            <rect x="0" y="0" width="24" height="24" fill="currentColor" mask="url(#logoMask)" />
          </svg>
          <span className="font-bold text-white text-[17px] tracking-tight"
            style={{ fontFamily: "'Comfortaa', 'Plus Jakarta Sans', sans-serif" }}>
            CareerPilot
          </span>
        </div>
        <div className="flex items-center">
          <button onClick={() => openModal('signup')}
            className="gbtn bg-white text-black font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-zinc-100 transition-colors">
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative w-full h-screen overflow-hidden">

        {/* Ambient top glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse 70% 40% at 30% 0%, rgba(99,102,241,.06) 0%, transparent 70%)' }}/>

        {/* ── LEFT CONTENT ── */}
        <div className={`absolute left-0 top-0 h-full flex flex-col justify-center px-8 md:px-16 z-10 w-full md:w-[50%] pointer-events-none ${mounted?'a-fade-up':''}`}>
          <div className="inline-flex items-center gap-2 border border-indigo-500/35 bg-indigo-500/10 px-3 py-1.5 rounded-full mb-8 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"/>
            <span className="text-[10px] font-extrabold text-indigo-300 tracking-widest uppercase">AI-Powered Career Platform</span>
          </div>

          <h1 className="text-[2.6rem] md:text-[3.2rem] lg:text-[3.8rem] font-black leading-[1.08] tracking-tight mb-6 text-white font-sans">
            The Fastest Path<br />To Your<br />
            Dream Job
          </h1>

          <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed mb-10 max-w-sm">
            Optimize your resume, discover matched roles, track applications, and ace every interview — one AI command center.
          </p>


        </div>



        {/* ── CURVED ROAD SVG ── */}
        <div className="absolute inset-0 z-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMax slice">
            <defs>
              {/* Road surface gradient */}
              <linearGradient id="roadGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%"   stopColor="#0c0c18"/>
                <stop offset="60%"  stopColor="#09091480"/>
                <stop offset="100%" stopColor="#05050700"/>
              </linearGradient>

              {/* Hover overlay radial */}
              <radialGradient id="hoverGrad" cx="35%" cy="80%" r="55%">
                <stop offset="0%"   stopColor={`rgba(99,102,241,${roadHover?.14:.04})`}/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>

              {/* Inner edge glow */}
              <filter id="innerGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation={roadHover ? 7 : 4} result="b1"/>
                <feGaussianBlur stdDeviation={roadHover ? 14 : 8} result="b2"/>
                <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              {/* Box light glow */}
              <filter id="boxGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation={roadHover ? 5 : 3} result="b1"/>
                <feGaussianBlur stdDeviation={roadHover ? 10 : 6} result="b2"/>
                <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>

              {/* Label glow */}
              <filter id="lblGlow" x="-30%" y="-80%" width="160%" height="260%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feComposite in="SourceGraphic" in2="b" operator="over"/>
              </filter>

              {/* White Glow */}
              <radialGradient id="glowGrad-white" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.65} />
                <stop offset="40%" stopColor="#818cf8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </radialGradient>

              {/* Orange Glow */}
              <radialGradient id="glowGrad-orange" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fb923c" stopOpacity={0.8} />
                <stop offset="45%" stopColor="#ea580c" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </radialGradient>

              {/* Cyan Glow */}
              <radialGradient id="glowGrad-cyan" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="45%" stopColor="#0891b2" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </radialGradient>

              {/* Purple Glow */}
              <radialGradient id="glowGrad-purple" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="45%" stopColor="#9333ea" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0} />
              </radialGradient>
            </defs>

            <g
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer' }}
            >
              {/* ── Road surface ── */}
              <path d={roadFill} fill="url(#roadGrad)"/>

              {/* ── Hover glow overlay ── */}
              <path d={roadFill} fill="url(#hoverGrad)" style={{ transition:'fill .4s' }}/>

            {/* ── Road surface subtle stripes (texture) ── */}
            {Array.from({ length: 6 }, (_, i) => {
              const t  = (i + 1) / 7;
              const [ix, iy] = bezPt(IP0, IP1, IP2, IP3, t);
              const [ox, oy] = bezPt(OP0, OP1, OP2, OP3, t);
              return (
                <line key={i} x1={ix} y1={iy} x2={ox} y2={oy}
                  stroke="rgba(255,255,255,1)" strokeWidth=".6"
                  opacity={0.012 + t * 0.025}/>
              );
            })}

            {/* ── Center lane dashes ── */}
            <path className="a-dash" d={centerPath} fill="none"
              stroke={`rgba(255,255,255,${roadHover?.3:.12})`}
              strokeWidth="2.5" strokeDasharray="18 38"
              style={{ transition:'stroke .3s' }}/>

            {/* ── Inner edge — glowing white line (Harness bright edge) ── */}
            {/* Shadow/halo layers */}
            <path d={innerPath} fill="none"
              stroke={`rgba(180,190,255,${roadHover?.18:.06})`}
              strokeWidth="24" filter="url(#innerGlow)"/>
            <path d={innerPath} fill="none"
              stroke={`rgba(200,210,255,${roadHover?.3:.12})`}
              strokeWidth="8" filter="url(#innerGlow)"/>
            {/* The bright line itself */}
            <path d={innerPath} fill="none"
              stroke={`rgba(255,255,255,${roadHover?.92:.6})`}
              strokeWidth={roadHover ? 2.5 : 1.5}
              style={{
                animation:'innerPulse 2.5s ease-in-out infinite',
                transition:'stroke-width .3s',
              }}/>

            {/* ── Outer edge subtle line ── */}
            <path d={outerPath} fill="none"
              stroke={`rgba(99,102,241,${roadHover?.25:.1})`}
              strokeWidth="1" style={{ transition:'stroke .3s' }}/>

            {/* ── Box / cube lights on outer edge ── */}
            {/* ── 3D Glowing Cube Stops (Harness Style) ── */}
            {FOUR_STOPS.map((stop, index) => {
              const [cx, cy] = bezPt(CP0, CP1, CP2, CP3, stop.t);
              const scale = Math.max(0.3, 1.25 - stop.t * 0.9);
              
              const w = scale * 13; // half-width
              const h = scale * 9;  // height of the block
              
              const pTop    = `${cx},${cy - w * 0.5}`;
              const pRight  = `${cx + w},${cy - w * 0.1}`;
              const pCenter = `${cx},${cy + w * 0.3}`;
              const pLeft   = `${cx - w},${cy - w * 0.1}`;
              
              const pCenterBottom = `${cx},${cy + w * 0.3 + h}`;
              const pLeftBottom   = `${cx - w},${cy - w * 0.1 + h}`;
              const pRightBottom  = `${cx + w},${cy - w * 0.1 + h}`;

              const glowR = w * 2.8;

              return (
                <g key={index} style={{ opacity: roadHover ? 1 : 0.85, transition: 'opacity 0.4s ease' }}>
                  {/* Underneath Glow Shadow */}
                  <circle
                    cx={cx}
                    cy={cy + h * 0.5}
                    r={glowR}
                    fill={`url(#glowGrad-${stop.color})`}
                    opacity={roadHover ? 0.95 : 0.55}
                    style={{ transition: 'opacity 0.4s ease' }}
                    pointerEvents="none"
                  />

                  {/* Left Face */}
                  <polygon
                    points={`${pLeft} ${pCenter} ${pCenterBottom} ${pLeftBottom}`}
                    fill={stop.leftColor}
                  />
                  {/* Right Face */}
                  <polygon
                    points={`${pRight} ${pCenter} ${pCenterBottom} ${pRightBottom}`}
                    fill={stop.rightColor}
                  />
                  {/* Top Face */}
                  <polygon
                    points={`${pTop} ${pRight} ${pCenter} ${pLeft}`}
                    fill={stop.topColor}
                    stroke="white"
                    strokeWidth={0.5 * scale}
                  />
                  
                  {/* Emission Glow Spot */}
                  <ellipse
                    cx={cx}
                    cy={cy - w * 0.1}
                    rx={w * 0.35}
                    ry={w * 0.15}
                    fill="white"
                    filter="url(#boxGlow)"
                    opacity={0.9}
                  />
                </g>
              );
            })}

            {/* ── Glassmorphic Floating Cards (Harness Style) ── */}
            {FOUR_STOPS.map((stop, index) => {
              const [cx, cy] = bezPt(CP0, CP1, CP2, CP3, stop.t);
              const scale = Math.max(0.75, 1.15 - stop.t * 0.45);
              const cardW = 260;
              const cardH = 54;
              
              // We position the card to float 95px above the cube center
              const cardX = cx - (cardW / 2) * scale;
              const cardY = cy - 90 * scale;

              return (
                <foreignObject
                  key={`card-${index}`}
                  x={cardX}
                  y={cardY}
                  width={cardW * scale}
                  height={cardH * scale}
                  className="overflow-visible"
                >
                  <div
                    className="backdrop-blur-xl border rounded-xl flex items-center gap-2.5 shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: `${8 * scale}px ${12 * scale}px`,
                      background: 'rgba(10, 10, 16, 0.88)',
                      borderColor: stop.borderClr,
                      boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 20px -8px ${stop.glowColor}`,
                      opacity: roadHover ? 1.0 : 0.85,
                      transition: 'opacity 0.4s ease, transform 0.5s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                    }}
                  >
                    <span className="flex-shrink-0" style={{ fontSize: `${14 * scale}px` }}>{stop.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white leading-tight truncate" style={{ fontSize: `${10.5 * scale}px` }}>
                        {stop.text}
                      </p>
                      <p className="text-zinc-300 mt-0.5 leading-none truncate" style={{ fontSize: `${8.5 * scale}px` }}>
                        {stop.sub}
                      </p>
                    </div>
                    <span
                      className="font-bold rounded font-mono whitespace-nowrap ml-1 uppercase border flex items-center justify-center"
                      style={{
                        fontSize: `${7.5 * scale}px`,
                        padding: `${2 * scale}px ${4 * scale}px`,
                        color: stop.textColor,
                        backgroundColor: stop.bgBadgeColor,
                        borderColor: stop.borderBadgeColor,
                      }}
                    >
                      {stop.badge}
                    </span>
                  </div>
                </foreignObject>
              );
            })}
            </g>
          </svg>

          {/* Bottom + left fade overlays so road bleeds in naturally */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'linear-gradient(to right, #050507 0%, #05050730 35%, transparent 65%)' }}/>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{ background:'linear-gradient(to top, #050507 0%, transparent 100%)' }}/>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-t border-white/[0.04] bg-[#050507]">
        <div className="max-w-4xl mx-auto px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.03] bg-[#050507] py-6 text-center">
        <span className="text-[9px] font-mono text-zinc-700 tracking-widest uppercase">© 2026 CareerPilot AI — All rights reserved</span>
      </footer>

      {/* ── AUTH MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/78 backdrop-blur-md"/>
          <div className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl shadow-black/80 a-fade-in"
            style={{ background:'rgba(10,10,14,.96)', border:'1px solid rgba(255,255,255,.08)' }}
            onClick={e => e.stopPropagation()}>

            <div className="absolute top-0 left-8 right-8 h-px rounded-full"
              style={{ background:'linear-gradient(90deg,transparent,rgba(99,102,241,.6),transparent)' }}/>

            <button onClick={closeModal}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white transition">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <div className="text-center mb-7">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mx-auto mb-3">
                <span className="text-black font-black text-[10px]">CP</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {activeTab==='login' ? 'Welcome back.' : 'Join CareerPilot.'}
              </h2>
              <p className="text-zinc-500 text-xs mt-1">
                {activeTab==='login' ? 'Sign in to your command center.' : 'Create your free account.'}
              </p>
            </div>

            <div className="flex border-b border-zinc-800 relative mb-6">
              {['login','signup'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setError(''); }}
                  className={`flex-1 pb-3 text-xs font-bold text-center transition-colors ${activeTab===tab?'text-white':'text-zinc-500 hover:text-zinc-300'}`}>
                  {tab==='login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
              <div className="absolute bottom-0 h-0.5 rounded-full transition-all duration-300"
                style={{ width:'50%', left:activeTab==='login'?'0%':'50%',
                  background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/25 rounded-lg px-3.5 py-3 mb-4">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5"/>
                <p className="text-[11px] text-red-300 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab==='signup' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <input type="text" required placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}
                    className="w-full bg-zinc-900/70 border border-zinc-800 focus:border-indigo-500/50 rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none transition"/>
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"/>
                  <input type="email" required placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)}
                    className="w-full bg-zinc-900/70 border border-zinc-800 focus:border-indigo-500/50 rounded-lg p-3 pl-10 text-xs text-white placeholder-zinc-600 focus:outline-none transition"/>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Password</label>
                  {activeTab==='login' && (
                    <button type="button" className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold transition">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"/>
                  <input type="password" required placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
                    className="w-full bg-zinc-900/70 border border-zinc-800 focus:border-indigo-500/50 rounded-lg p-3 pl-10 text-xs text-white placeholder-zinc-600 focus:outline-none transition"/>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="gbtn w-full bg-white text-black font-black text-[12px] h-11 rounded-xl flex items-center justify-center gap-2 mt-1 disabled:opacity-60 hover:bg-zinc-100 transition-colors">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin"/>{activeTab==='login'?'Signing in…':'Creating account…'}</>
                  : <>{activeTab==='login'?'Sign In':'Create Account'} <ArrowRight className="w-4 h-4"/></>
                }
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-grow border-t border-zinc-800/70"/>
              <span className="text-[8px] font-mono tracking-widest text-zinc-600 uppercase">or</span>
              <div className="flex-grow border-t border-zinc-800/70"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { window.location.href='http://localhost:5000/api/auth/github'; }}
                className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-bold text-[11px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
                <GithubIcon className="w-4 h-4"/> GitHub
              </button>
              <button onClick={() => { window.location.href='http://localhost:5000/api/auth/google'; }}
                className="bg-zinc-900/70 border border-zinc-800 hover:border-zinc-600 text-zinc-300 font-bold text-[11px] py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

            <p className="text-center mt-5 text-[10px] text-zinc-500">
              {activeTab==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button"
                onClick={() => { setActiveTab(activeTab==='login'?'signup':'login'); setError(''); }}
                className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition">
                {activeTab==='login' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
