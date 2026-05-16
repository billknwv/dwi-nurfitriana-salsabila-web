import { useState, useEffect, useRef } from "react";

/* ── DESIGN TOKENS ─────────────────────────────────── */
const C = {
  blue:    "#2563eb",
  blueDk:  "#1e40af",
  blueLt:  "#eff6ff",
  neon:    "#c6ff00",
  bg:      "#f8faff",
  white:   "#ffffff",
  txt:     "#111827",
  muted:   "#6b7280",
  border:  "#e5e7eb",
};

/* ── INTERSECTION OBSERVER HOOK ────────────────────── */
const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
};

const FadeIn = ({ children, delay = 0, dir = "up", className = "" }) => {
  const [ref, vis] = useInView();
  const t = { up:"translateY(36px)", left:"translateX(-36px)", right:"translateX(36px)", none:"none" };
  return (
    <div ref={ref} className={className}
      style={{ opacity:vis?1:0, transform:vis?"none":t[dir],
        transition:`opacity .7s ease ${delay}s, transform .7s ease ${delay}s` }}>
      {children}
    </div>
  );
};

const SLabel = ({ c }) => <span style={{ color:C.blue, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, letterSpacing:"0.18em", textTransform:"uppercase" }}>{c}</span>;
const STitle = ({ c }) => (
  <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"clamp(1.8rem,4vw,2.8rem)", color:C.txt, lineHeight:1.1, marginTop:6 }}>
    {c}<span style={{ color:C.neon }}>.</span>
  </h2>
);
const Divider = () => <div style={{ width:52, height:4, background:C.neon, borderRadius:2, margin:"14px 0 36px" }} />;

const Card = ({ children, className="", style={} }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className={className}
      style={{ background:C.white, borderRadius:20, border:`1.5px solid ${C.border}`, padding:24,
        transition:"all .3s ease",
        transform:hov?"translateY(-5px)":"none",
        boxShadow:hov?"0 20px 50px rgba(37,99,235,.13)":"0 4px 20px rgba(0,0,0,.06)",
        ...style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </div>
  );
};

const Pill = ({ label, color=C.blue }) => {
  const [hov, setHov] = useState(false);
  return (
    <span style={{ display:"inline-block", padding:"6px 16px", borderRadius:999,
      border:`2px solid ${color}`, color:hov?"#fff":color, background:hov?color:"transparent",
      fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
      transition:"all .25s ease", cursor:"default",
      transform:hov?"translateY(-2px)":"none",
      boxShadow:hov?`0 6px 16px ${color}44`:"none" }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {label}
    </span>
  );
};

/* ══ NAV ══════════════════════════════════════════════ */
const NAV_LINKS = [
  { label:"Tentang",     href:"about" },
    { label:"Pendidikan",  href:"edu" },
  { label:"Proyek",      href:"projects" },
  { label:"Organisasi",  href:"org" },
  { label:"Keahlian",    href:"skills" },
  { label:"Tools",       href:"tools" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("");
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 50);
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].href);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(NAV_LINKS[i].href); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
      background:scrolled?"rgba(255,255,255,.93)":"transparent",
      backdropFilter:scrolled?"blur(16px)":"none",
      boxShadow:scrolled?"0 2px 28px rgba(37,99,235,.1)":"none",
      transition:"all .35s ease" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* Logo */}
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          style={{ background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22,
            color:scrolled?C.blue:"#fff" }}>
          DNS<span style={{ color:C.neon }}>.</span>
        </button>

        {/* Desktop links */}
        <div style={{ display:"flex", gap:4, alignItems:"center" }}
          className="desk-nav">
          {NAV_LINKS.map(({ label, href }) => {
            const isAct = active === href;
            return (
              <button key={href} onClick={()=>go(href)}
                style={{ background:isAct?C.blue:"transparent", border:"none", cursor:"pointer",
                  padding:"7px 16px", borderRadius:999,
                  fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                  color:isAct?"#fff":(scrolled?C.muted:"rgba(255,255,255,.8)"),
                  transition:"all .25s ease" }}
                onMouseEnter={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.blue:"#fff"; e.currentTarget.style.background=scrolled?C.blueLt:"rgba(255,255,255,.12)"; } }}
                onMouseLeave={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.muted:"rgba(255,255,255,.8)"; e.currentTarget.style.background="transparent"; } }}>
                {label}
              </button>
            );
          })}
          <button onClick={()=>go("about")}
            style={{ marginLeft:8, padding:"8px 20px", borderRadius:999, background:C.neon,
              border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:"#111", transition:"all .25s ease" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.06)"; e.currentTarget.style.boxShadow=`0 6px 20px ${C.neon}88`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            Kontak Saya
          </button>
        </div>

        {/* Hamburger */}
        <button className="mob-nav" onClick={()=>setOpen(!open)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:4 }}>
          {[0,1,2].map(i=>(
            <span key={i} style={{ display:"block", width:24, height:2.5, borderRadius:2,
              background:scrolled?C.blue:"#fff", transition:"all .3s ease",
              transform:open&&i===0?"rotate(45deg) translateY(10px)":open&&i===2?"rotate(-45deg) translateY(-10px)":"none",
              opacity:open&&i===1?0:1 }}/>
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <div style={{ overflow:"hidden", maxHeight:open?500:0, transition:"max-height .35s ease",
        background:"rgba(255,255,255,.97)", backdropFilter:"blur(16px)" }}>
        <div style={{ padding:"12px 24px 20px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button key={href} onClick={()=>go(href)}
              style={{ background:active===href?C.blueLt:"none", border:"none", cursor:"pointer",
                padding:"10px 16px", borderRadius:12, textAlign:"left",
                fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:15,
                color:active===href?C.blue:C.txt, transition:"all .2s ease" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

/* ══ HERO ═════════════════════════════════════════════ */
const Hero = () => {
  const [ok, setOk] = useState(false);
  useEffect(()=>{ setTimeout(()=>setOk(true),80); },[]);
  const f = (d,dy="Y",dist=30) => ({ opacity:ok?1:0, transform:ok?"none":`translate${dy}(${dist}px)`,
    transition:`opacity .9s ease ${d}s, transform .9s ease ${d}s` });

  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative",
      overflow:"hidden", background:"linear-gradient(135deg,#1d4ed8 0%,#2563eb 45%,#1e3a8a 100%)" }}>

      {/* Blobs */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-100px", right:"-80px", width:480, height:480,
          borderRadius:"62% 38% 50% 50%/48% 52% 48% 52%",
          background:"rgba(198,255,0,.12)", animation:"blob1 8s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", bottom:"40px", left:"-60px", width:320, height:320,
          borderRadius:"45% 55% 38% 62%/60% 40% 60% 40%",
          background:"rgba(255,255,255,.07)", animation:"blob2 10s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", top:"35%", right:"22%", width:160, height:160, borderRadius:"50%",
          background:"rgba(198,255,0,.08)", animation:"blob1 6s ease-in-out infinite reverse" }}/>
        <svg width="100%" height="100%" style={{ opacity:.07, position:"absolute", inset:0 }}>
          <defs><pattern id="gdots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#fff"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#gdots)"/>
        </svg>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"100px 24px 80px", width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ ...f(0.1), display:"flex", gap:10, flexWrap:"wrap", marginBottom:24 }}>
          {[].map(b=>(
            <span key={b} style={{ background:C.neon, color:"#111", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11,
              padding:"5px 14px", borderRadius:999, letterSpacing:"0.12em", textTransform:"uppercase" }}>{b}</span>
          ))}
        </div>

        <div style={{ ...f(0.2), display:"flex", alignItems:"center", gap:20, marginBottom:12 }}>
           <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"clamp(3rem,9vw,7rem)",
            color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>
            Porto<span style={{ color:C.neon }}>folio</span>
          </h1>
        </div>

        <div style={f(0.35)}>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,.65)", fontSize:14, marginBottom:4 }}></p>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"clamp(1.4rem, 4vw, 2.8rem)", color:"#fff", lineHeight:1.15 }}>
        Dwi Nurfitriana <span style={{ color:C.neon }}>Salsabila</span>
        </p>
        </div>

        <div style={f(0.5)}>
          <div style={{ display:"flex", gap:14, marginTop:28, flexWrap:"wrap" }}>
            <button onClick={()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"12px 28px", borderRadius:999, background:C.neon, border:"none", cursor:"pointer",
                fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:"#111", transition:"all .3s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 14px 32px ${C.neon}66`;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              Lihat Profil
            </button>
            <button onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"12px 28px", borderRadius:999, background:"transparent",
                border:"2px solid rgba(255,255,255,.4)", cursor:"pointer",
                fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"#fff", transition:"all .3s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.12)";e.currentTarget.style.borderColor="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,.4)";}}>
              Lihat Proyek
            </button>
          </div>
        </div>
      </div>

      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", animation:"bounce 2s infinite" }}>
        <div style={{ width:26, height:42, borderRadius:13, border:"2px solid rgba(255,255,255,.3)", display:"flex", justifyContent:"center", paddingTop:6 }}>
          <div style={{ width:4, height:10, borderRadius:2, background:C.neon, animation:"sdot 1.8s infinite" }}/>
        </div>
      </div>

      <style>{`
        @keyframes blob1{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(5deg)}}
        @keyframes blob2{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(14px) rotate(-4deg)}}
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-10px)}}
        @keyframes sdot{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(16px)}}
        .desk-nav{display:flex}
        .mob-nav{display:none}
        @media(max-width:767px){.desk-nav{display:none!important}.mob-nav{display:flex!important}}
      `}</style>
    </section>
  );
};

/* ══ ABOUT ════════════════════════════════════════════ */
const About = () => (
  <section id="about" style={{ background:C.white, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <div className="about-grid">
        <FadeIn dir="left">
          <SLabel c="About Me"/>
          <STitle c="I'm Dwi Nurfitriana Salsabila"/>
          <Divider/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#374151", lineHeight:1.85, fontSize:16 }}>
            Mahasiswa D3 Teknologi Informasi di Universitas Brawijaya dengan minat pada pengembangan perangkat lunak dan analisis sistem. Berpengalaman dalam pengembangan aplikasi web, perancangan UI/UX, serta pengolahan data. Terbiasa berkolaborasi dalam tim dan memiliki kemampuan <em>problem solving</em> yang baik untuk menghasilkan solusi yang efektif dan efisien.
          </p>
          
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:12 }}>
            <a href="https://instagram.com/dwinurftrn" target="_blank" rel="noreferrer"
               style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:"#0077b5", textDecoration:"none", background:"#f0f9ff", padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd", transition:"all .2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#0077b5"; e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff"; e.currentTarget.style.color="#0077b5"}}>
           ssalsabilaa235@gmail.com
            </a>
            <a href="https://www.instagram.com/dnfsalsabila/" rel="noreferrer"
               style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:"#0077b5", textDecoration:"none", background:"#f0f9ff", padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd", transition:"all .2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#0077b5"; e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff"; e.currentTarget.style.color="#0077b5"}}>
           Instagram
            </a>
            <a href="https://github.com/billknwv" target="_blank" rel="noreferrer"
               style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:"#0077b5", textDecoration:"none", background:"#f0f9ff", padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd", transition:"all .2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#0077b5"; e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff"; e.currentTarget.style.color="#0077b5"}}>
           GitHub
            </a>
            <a href="https://www.linkedin.com/in/dwi-nurfitriana-salsabila" target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:"#0077b5", textDecoration:"none", background:"#f0f9ff", padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd", transition:"all .2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#0077b5"; e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff"; e.currentTarget.style.color="#0077b5"}}>
            LinkedIn
            </a>
            <a href="/CV.pdf" download
              style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif", fontSize:13,
                color:"#0077b5", textDecoration:"none", background:"#f0f9ff", padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd", transition:"all .2s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="#0077b5"; e.currentTarget.style.color="#fff"}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff"; e.currentTarget.style.color="#0077b5"}}>
            Unduh CV
            </a>
          </div>
        </FadeIn>

        {/* Photo */}
        <FadeIn dir="right" delay={0.15}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div style={{ position:"absolute", inset:-7, borderRadius:36, border:`3px solid ${C.neon}`,
                boxShadow:`0 0 36px ${C.neon}44`, zIndex:0 }}/>
              <div style={{ position:"absolute", top:18, left:18, right:-18, bottom:-18, borderRadius:32,
                background:C.blue, opacity:.12, zIndex:0 }}/>
              <div id="photo-wrap" style={{ width:300, height:360, borderRadius:32, overflow:"hidden",
                position:"relative", zIndex:1,
                boxShadow:"0 28px 64px rgba(37,99,235,.2)",
                background:`linear-gradient(135deg,${C.blueLt},#bfdbfe)`,
                display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                <img
                  src="bila.jpg"
                  alt="Dwi Nurfitriana Salsabila"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e => {
                    const wrap = e.currentTarget.parentElement;
                    e.currentTarget.remove();
                    wrap.innerHTML = `
                      <div style="font-size:80px;filter:drop-shadow(0 4px 16px rgba(37,99,235,.4));text-align:center">👩‍💻</div>
                      <p style="font-family:'Syne',sans-serif;font-weight:800;color:#2563eb;font-size:15px;text-align:center;padding:0 20px;margin-top:14px">Dwi Nurfitriana Salsabila</p>
                      <p style="font-family:'DM Sans',sans-serif;color:#6b7280;font-size:13px;margin-top:4px">D3 Teknologi Informasi</p>
                      <p style="font-family:'DM Sans',sans-serif;color:#9ca3af;font-size:11px;margin-top:8px;text-align:center;padding:0 16px;line-height:1.5">Letakkan <strong>bila.jpg</strong> </p>`;
                  }}
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
    <style>{`.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}@media(max-width:768px){.about-grid{grid-template-columns:1fr;gap:48px}}`}</style>
  </section>
);
/* ══ EDUCATION ════════════════════════════════════════ */
const Education = () => (
  <section id="edu" style={{ background:C.bg, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Akademik"/><STitle c="Pendidikan"/><Divider/></FadeIn>
      <FadeIn delay={0.1}>
        <Card style={{ position:"relative", overflow:"hidden", maxWidth:420 }}>
          <div style={{ position:"absolute", top:0, right:0, width:80, height:80,
            background:`linear-gradient(135deg,${C.neon}22,transparent)`, borderBottomLeftRadius:80 }}/>
          <span style={{ fontSize:40, display:"block", marginBottom:14 }}>🎓</span>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:18 }}>Universitas Brawijaya</h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.blue, fontSize:15, fontWeight:600, marginTop:5 }}>D3 Teknologi Informasi – Fakultas Vokasi</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#9ca3af", fontSize:13, marginTop:4 }}>2024 – Sekarang · Malang, Jawa Timur</p>
          <span style={{ display:"inline-block", marginTop:12, background:`${C.neon}33`, color:"#365314",
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, padding:"4px 12px", borderRadius:999 }}>Aktif</span>
        </Card>
      </FadeIn>
    </div>
  </section>
);

/* ══ PROJECTS ═════════════════════════════════════════ */
const projects = [
  { icon:"☕", title:"Website Coffee Shop & Sistem Reservasi", year:"2025",
    tech:["Laravel","MySQL","UI/UX","UML"],
    items:["Aplikasi berbasis web yang dirancang sebagai media branding digital sekaligus platform layanan reservasi online untuk bisnis coffee shop. Platform ini berfungsi memperkenalkan identitas dan menu unik toko ke audiens yang lebih luas, sekaligus mendigitalisasi sistem pemesanan meja demi meningkatkan kenyamanan pelanggan."] },
  { icon:"📊", title:"Analisis Sistem Informasi MaoPlace", year:"2025",
    tech:["Business Analysis","SDLC","Dashboard"],
    items:["Proyek analisis proses bisnis yang bertujuan untuk mengidentifikasi hambatan operasional pada UMKM MaoPlace. Hasil analisis digunakan sebagai dasar perancangan solusi sistem informasi manajemen stok dan keuangan berbasis digital."] },
  { icon:"🎓", title:"Sistem Informasi Akademik", year:"2025",
    tech:["UI/UX","Figma","Web Dev"],
    items:["Perancangan dan pengembangan platform sistem informasi akademik berbasis desktop untuk mengoptimalkan pengelolaan data pendidikan. Berfokus pada pembuatan alur kerja sistem yang terstruktur serta desain antarmuka pengguna yang modern."] },
  { icon:"🤖", title:"Waste Material Detector", year:"2025",
    tech:["AI","Python","Web Dev"],
    items:["Aplikasi berbasis web terintegrasi kecerdasan buatan (AI) yang berfungsi untuk mendeteksi dan mengidentifikasi jenis material sampah secara otomatis dan real-time guna mendukung proses pemilahan limbah"] },
  { icon:"♻️", title:"SORTIR.IN – Smart Waste Management", year:"2026",
    tech:["IoT","Arduino","Cloud",],
    items:["Inovasi sistem pengelolaan sampah pintar berbasis IoT (Internet of Things) yang mengombinasikan perangkat keras pemilah sampah otomatis dengan platform monitoring berbasis web secara real-time."] },
];

const Projects = () => (
  <section id="projects" style={{ background:C.White, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Pengalaman Proyek"/><STitle c="Project"/><Divider/></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
        {projects.map((p,i)=>(
          <FadeIn key={i} delay={i*0.08}>
            <Card style={{ height:"100%" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:`${C.blue}12`,
                  border:`1.5px solid ${C.blue}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{p.icon}</div>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, color:"#9ca3af",
                  background:"#f3f4f6", padding:"3px 10px", borderRadius:999 }}>{p.year}</span>
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:15, lineHeight:1.3, marginBottom:10 }}>{p.title}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                {p.tech.map(t=>(
                  <span key={t} style={{ background:C.blueLt, color:C.blue, fontFamily:"'DM Sans',sans-serif",
                    fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:999 }}>{t}</span>
                ))}
              </div>
              <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                {p.items.map((item,j)=>(
                  <li key={j} style={{ fontFamily:"'DM Sans',sans-serif", color:"#4b5563", fontSize:14,
                    padding:"4px 0", display:"flex", gap:8, alignItems:"flex-start", lineHeight:1.5 }}>
                    <span style={{ color:C.neon, fontSize:18, lineHeight:1.2, flexShrink:0, fontWeight:900 }}>›</span>{item}
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ══ ORGANISATION ═════════════════════════════════════ */
const Organization = () => (
  <section id="org" style={{ background:C.bg, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Kontribusi"/><STitle c="Pengalaman Organisasi"/><Divider/></FadeIn>
      <FadeIn delay={0.1}>
        <Card style={{ borderLeft:`4px solid ${C.neon}`, maxWidth:720 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
            <div style={{ width:54, height:54, borderRadius:18, background:`${C.blue}14`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🏛️</div>
            <div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:16, lineHeight:1.3 }}>Staff Ahli Departemen Pusat Komunikasi dan Informatika</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.blue, fontWeight:700, fontSize:14, marginTop:4 }}>Himpunan Mahasiswa Teknologi Informasi — Universitas Brawijaya</p>
              <span style={{ fontFamily:"'DM Sans',sans-serif", color:"#9ca3af", fontSize:12 }}>2024 – 2025</span>
            </div>
          </div>
          {["Mengelola publikasi visual, media sosial, dan branding digital organisasi untuk meningkatkan engagement audiens serta menyebarkan informasi seputar program studi teknologi informasi"
          ].map((item,j)=>(
            <div key={j} style={{ fontFamily:"'DM Sans',sans-serif", color:"#4b5563", fontSize:15,
              padding:"6px 0", display:"flex", gap:10, alignItems:"flex-start", lineHeight:1.6 }}>
              <span style={{ color:C.neon, fontSize:20, lineHeight:1.1, flexShrink:0, fontWeight:900 }}>›</span>{item}
            </div>
          ))}
        </Card>
      </FadeIn>
    </div>
  </section>
);


/* ══ SKILLS ═══════════════════════════════════════════ */
const skillGroups = [
  { title:"⚙️ Hard Skills", border:C.blue,
    items:["UI/UX Design","Wireframing","Prototyping","Figma","PHP","Laravel","HTML","CSS","Basic Python","MySQL","SDLC","Requirement Elicitation","UML","DFD"] },
  { title:"🧠 Soft Skills", border:"#8b5cf6",
    items:["Communication","Time Management","Team Collaboration","Problem Solving"] },
  { title:"🎨 Creative Skills", border:"#f43f5e",
    items:["Graphic Design","Video Editing","Photography & Videography"] },
];

const Skills = () => (
  <section id="skills" style={{ background:C.white, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Kompetensi"/><STitle c="Keahlian"/><Divider/></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
        {skillGroups.map((g,i)=>(
          <FadeIn key={i} delay={i*0.1}>
            <Card style={{ borderTop:`4px solid ${g.border}`, height:"100%" }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:18, marginBottom:18 }}>{g.title}</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {g.items.map(s=><Pill key={s} label={s} color={g.border}/>)}
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ══ TOOLS ════════════════════════════════════════════ */
const tools = [
  { name: "VS Code",     img: "/icon/vsc.jpg",         color: "#007acc" },
  { name: "Arduino IDE", img: "/icon/arduinoide.jpg",  color: "#00979d" }, // Ubah ke huruf kecil
  { name: "Python",      img: "/icon/python.jpg",      color: "#3776ab" }, // Ubah ke huruf kecil
  { name: "Laravel",     img: "/icon/laravel.jpg",     color: "#ef4444" }, // Ubah ke huruf kecil
  { name: "MySQL",       img: "/icon/mysql.jpg",       color: "#00758f" }, // Ubah ke huruf kecil
  { name: "GitHub",      img: "/icon/github.jpg",      color: "#24292e" }, // Ubah ke huruf kecil
  { name: "Figma",       img: "/icon/figma.jpg",       color: "#f24e1e" }, // Ubah ke huruf kecil
  { name: "Canva",       img: "/icon/canva.jpg",       color: "#00c4cc" }, // Ubah ke huruf kecil
  { name: "Capcut",      img: "/icon/capcut.jpg",      color: "#252525" }, // Ubah ke huruf kecil
];
const Tools = () => (
  <section id="tools" style={{ background:C.bg, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Alat Kerja"/><STitle c="Tools & Software"/><Divider/></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:16 }}>
        {tools.map((t,i)=>(
          <FadeIn key={i} delay={i*0.06}>
            <Card style={{ textAlign:"center", padding:"26px 16px" }}>
              <div style={{ width:56, height:56, borderRadius:18, background:`${t.color}18`,
                border:`1.5px solid ${t.color}22`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:26, margin:"0 auto 12px" }}><img 
                    src={t.img} 
                    alt={t.name} 
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} 
                />
                </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:C.txt, fontSize:13 }}>{t.name}</p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ══ FOOTER ═══════════════════════════════════════════ */
const Footer = () => (
  <footer style={{ background:"#0f172a", color:"#fff", padding:"48px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px",
      display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:20 }}>
      <div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22 }}>DNS<span style={{ color:C.neon }}>.</span></p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#94a3b8", fontSize:14, marginTop:4 }}>Dwi Nurfitriana Salsabila · D3 TI Universitas Brawijaya</p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {[{ label:"Email", href:"mailto:ssalsabilaa235@gmail.com" },{ label:"GitHub", href:"https://github.com/dwinurfitriana" },{ label:"LinkedIn", href:"https://linkedin.com/in/dwinurfitriana" }].map(l=>(
          <a key={l.label} href={l.href} target={l.label !== "Email" ? "_blank" : undefined} rel="noreferrer"
            style={{ padding:"8px 18px", borderRadius:999, border:"1.5px solid #334155", color:"#cbd5e1",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13, textDecoration:"none", transition:"all .25s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.neon;e.currentTarget.style.color=C.neon;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.color="#cbd5e1";}}>
            {l.label}
          </a>
        ))}
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#475569", fontSize:13 }}>© 2026 Dwi Nurfitriana Salsabila (billknwv)</p>
    </div>
  </footer>
);

/* ══ APP ROOT ═════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#fff;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#f1f5f9}
        ::-webkit-scrollbar-thumb{background:#2563eb;border-radius:3px}
      `}</style>
      <Nav/>
      <Hero/>
      <About/>
      <Education/>
      <Projects/>
      <Organization/>
      <Skills/>
      <Tools/>
      <Footer/>
    </>
  );
}