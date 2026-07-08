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

const SLabel = ({ c }) => (
  <span style={{ color:C.blue, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12,
    letterSpacing:"0.18em", textTransform:"uppercase" }}>{c}</span>
);
const STitle = ({ c }) => (
  <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
    fontSize:"clamp(1.8rem,4vw,2.8rem)", color:C.txt, lineHeight:1.1, marginTop:6 }}>
    {c}<span style={{ color:C.neon }}>.</span>
  </h2>
);
const Divider = () => (
  <div style={{ width:52, height:4, background:C.neon, borderRadius:2, margin:"14px 0 36px" }} />
);

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
  { label:"Tentang",    href:"about" },
  { label:"Pendidikan", href:"edu" },
  { label:"Proyek",     href:"projects" },
  { label:"Desain",     href:"gallery" },
  { label:"Organisasi", href:"org" },
  { label:"Keahlian",   href:"skills" },
  { label:"Tools",      href:"tools" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("");
  const [open,     setOpen]     = useState(false);

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

  const go = (id) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" }); };

  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100,
      background:scrolled?"rgba(255,255,255,.95)":"transparent",
      backdropFilter:scrolled?"blur(20px)":"none",
      boxShadow:scrolled?"0 2px 28px rgba(37,99,235,.08)":"none",
      transition:"all .35s ease" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          style={{ background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22,
            color:scrolled?C.blue:"#fff" }}>
          DNS<span style={{ color:C.neon }}>.</span>
        </button>
        <div style={{ display:"flex", gap:4, alignItems:"center" }} className="desk-nav">
          {NAV_LINKS.map(({ label, href }) => {
            const isAct = active === href;
            return (
              <button key={href} onClick={()=>go(href)}
                style={{ background:isAct?C.blue:"transparent", border:"none", cursor:"pointer",
                  padding:"7px 16px", borderRadius:999,
                  fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                  color:isAct?"#fff":(scrolled?C.muted:"rgba(255,255,255,.8)"),
                  transition:"all .25s ease" }}
                onMouseEnter={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.blue:"#fff"; e.currentTarget.style.background=scrolled?C.blueLt:"rgba(255,255,255,.12)"; }}}
                onMouseLeave={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.muted:"rgba(255,255,255,.8)"; e.currentTarget.style.background="transparent"; }}}>
                {label}
              </button>
            );
          })}
          <button onClick={()=>go("about")}
            style={{ marginLeft:8, padding:"8px 20px", borderRadius:999, background:C.neon,
              border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:13, color:"#111", transition:"all .25s ease" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.06)"; e.currentTarget.style.boxShadow=`0 6px 20px ${C.neon}88`; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            Kontak Saya
          </button>
        </div>
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
  const f = (d,dy="Y",dist=30) => ({
    opacity:ok?1:0, transform:ok?"none":`translate${dy}(${dist}px)`,
    transition:`opacity .9s ease ${d}s, transform .9s ease ${d}s`
  });
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative",
      overflow:"hidden", background:"linear-gradient(135deg,#1d4ed8 0%,#2563eb 45%,#1e3a8a 100%)" }}>
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
        <div style={{ ...f(0.2), display:"flex", alignItems:"center", gap:20, marginBottom:12 }}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
            fontSize:"clamp(3rem,9vw,7rem)", color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>
            Porto<span style={{ color:C.neon }}>folio</span>
          </h1>
        </div>
        <div style={f(0.35)}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
            fontSize:"clamp(1.4rem,4vw,2.8rem)", color:"#fff", lineHeight:1.15 }}>
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
        <div style={{ width:26, height:42, borderRadius:13, border:"2px solid rgba(255,255,255,.3)",
          display:"flex", justifyContent:"center", paddingTop:6 }}>
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
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:16 }}>
            {[
              { label:"ssalsabilaa235@gmail.com", href:"mailto:ssalsabilaa235@gmail.com" },
              { label:"Instagram", href:"https://www.instagram.com/dnfsalsabila/" },
              { label:"GitHub",    href:"https://github.com/billknwv" },
              { label:"LinkedIn",  href:"https://www.linkedin.com/in/dwi-nurfitriana-salsabila" },
              { label:"CV",  href:"https://drive.google.com/file/d/1sh6XLKprALCkz1SpqKuspVzBLOT0ddDL/view?usp=sharing", download:true },
            ].map(l=>(
              <a key={l.label} href={l.href}
                target={l.download?undefined:"_blank"} rel="noreferrer"
                download={l.download||undefined}
                style={{ display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, color:"#0077b5", textDecoration:"none", background:"#f0f9ff",
                  padding:"8px 16px", borderRadius:999, fontWeight:600, border:"1px solid #bae6fd",
                  transition:"all .2s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.background="#0077b5";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="#f0f9ff";e.currentTarget.style.color="#0077b5";}}>
                {l.label}
              </a>
            ))}
          </div>
        </FadeIn>
        <FadeIn dir="right" delay={0.15}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div style={{ position:"absolute", inset:-7, borderRadius:36, border:`3px solid ${C.neon}`,
                boxShadow:`0 0 36px ${C.neon}44`, zIndex:0 }}/>
              <div style={{ position:"absolute", top:18, left:18, right:-18, bottom:-18, borderRadius:32,
                background:C.blue, opacity:.12, zIndex:0 }}/>
              <div id="photo-wrap" style={{ width:300, height:360, borderRadius:32, overflow:"hidden",
                position:"relative", zIndex:1, boxShadow:"0 28px 64px rgba(37,99,235,.2)",
                background:`linear-gradient(135deg,${C.blueLt},#bfdbfe)`,
                display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                <img src="bila.jpg" alt="Dwi Nurfitriana Salsabila"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e=>{
                    const wrap = e.currentTarget.parentElement;
                    e.currentTarget.remove();
                    wrap.innerHTML=`<div style="font-size:80px;text-align:center">👩‍💻</div>
                      <p style="font-family:'Syne',sans-serif;font-weight:800;color:#2563eb;font-size:15px;text-align:center;padding:0 20px;margin-top:14px">Dwi Nurfitriana Salsabila</p>
                      <p style="font-family:'DM Sans',sans-serif;color:#6b7280;font-size:13px;margin-top:4px">D3 Teknologi Informasi</p>`;
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
  {
    icon:"☕", title:"Website Coffee Shop & Sistem Reservasi", year:"2025",
    tech:["Laravel","MySQL","UI/UX","UML"],
    items:["Aplikasi berbasis web yang dirancang sebagai media branding digital sekaligus platform layanan reservasi online untuk bisnis coffee shop."],
    links: [
      { label:"Source Code", url:"https://github.com/Oliviafzhh/maocoffee", meta:"Laravel · Private" },
      { label:"Figma", url:"https://www.figma.com/design/03Q7nADDyhAL5ifu6eLMvy/UI-UX-T3E?node-id=0-1&t=GGAG0aEFBlsUh5uO-1", meta:"UI/UX Design · Figma" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/1hXV6VB7EpLjGK-8PN5aHniigau9y6YXG/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    icon:"📊", title:"Analisis Sistem Informasi MaoPlace", year:"2025",
    tech:["Business Analysis","SDLC","Dashboard"],
    items:["Proyek analisis proses bisnis yang bertujuan untuk mengidentifikasi hambatan operasional pada UMKM MaoPlace."],
    links: [
      { label:"Dokumen", url:"https://drive.google.com/file/d/1O3OE9qUsfZA7CHGhLSrOIAkybkWHhL9u/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    icon:"🎓", title:"Sistem Informasi Akademik", year:"2025",
    tech:["UI/UX","Figma","Web Dev"],
    items:["Perancangan dan pengembangan platform sistem informasi akademik berbasis desktop untuk mengoptimalkan pengelolaan data pendidikan."],
    links: [
      { label:"Source Code", url:"https://github.com/billknwv/Sistem-Informasi-Akademik-UNIVERSITAS-ALTHERA", meta:"Web · Public" },
      { label:"Figma", url:"https://www.figma.com/design/ccWj4ULlFehFBwmr432Y6s/T2E?node-id=0-1&t=lhD5WZ8gUKRqX0Cm-1", meta:"UI/UX Design · Figma" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/147516eyw4CRI8BD5CwbTO_5ca7_R1YBq/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    icon:"🤖", title:"Waste Material Detector", year:"2025",
    tech:["AI","Python","Web Dev"],
    items:["Aplikasi berbasis web terintegrasi kecerdasan buatan (AI) yang berfungsi untuk mendeteksi dan mengidentifikasi jenis material sampah secara otomatis."],
    links: [
      { label:"Source Code", url:"https://github.com/billknwv/Waste-Material-Detector", meta:"Python · Public" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/1xlHa6mmmve7CNy-uUDlvNHVi2Hu4iqUt/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    icon:"♻️", title:"SORTIR.IN – Smart Waste Management", year:"2026",
    tech:["IoT","Arduino","Cloud"],
    items:["Inovasi sistem pengelolaan sampah pintar berbasis IoT yang mengombinasikan perangkat keras pemilah sampah otomatis dengan platform monitoring berbasis web."],
    links: [
      { label:"Source Code", url:"https://github.com/grizzyll/sortirin.git", meta:"Arduino / Web · Public" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/1SpDb2A8iUj5qH_qPSWjOEjcL5sFKGJGb/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
];

/* ── Project Modal ─── */
const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:999,
        background:"rgba(5,10,24,.82)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"20px", animation:"pmFade .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:C.white,
          borderRadius:20,
          width:"100%",
          maxWidth:480,
          boxShadow:"0 32px 80px rgba(0,0,0,.35)",
          overflow:"hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding:"20px 22px 18px",
          borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{
              fontFamily:"'Syne',sans-serif", fontWeight:900,
              fontSize:15, color:C.txt, margin:0, lineHeight:1.4,
            }}>
              {project.title}
            </p>
            <p style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:13,
              color:C.muted, margin:"5px 0 0",
            }}>
              {project.year} · {project.tech.join(" · ")}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink:0, width:32, height:32, borderRadius:"50%",
              border:`1.5px solid ${C.border}`, background:"none",
              cursor:"pointer", fontSize:16, color:C.muted,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.blueLt; e.currentTarget.style.color=C.blue; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=C.muted; }}
          >
            ✕
          </button>
        </div>

        {/* Deskripsi */}
        <div style={{ padding:"16px 22px 0" }}>
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:14,
            color:"#374151", lineHeight:1.75, margin:0,
          }}>
            {project.items[0]}
          </p>
        </div>

        {/* Link List */}
        <div style={{ padding:"16px 22px 22px", display:"flex", flexDirection:"column", gap:10 }}>
          {project.links && project.links.map((link, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px 16px",
              border:`1.5px solid ${C.border}`,
              borderRadius:12,
              gap:12,
            }}>
              <div style={{ minWidth:0 }}>
                <p style={{
                  fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                  fontSize:14, color:C.txt, margin:0,
                }}>
                  {link.label}
                </p>
                {link.meta && (
                  <p style={{
                    fontFamily:"'DM Sans',sans-serif", fontSize:11,
                    color:C.muted, margin:"3px 0 0",
                  }}>
                    {link.meta}
                  </p>
                )}
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flexShrink:0,
                  padding:"7px 16px",
                  borderRadius:8,
                  background:C.blue,
                  color:"#fff",
                  fontFamily:"'DM Sans',sans-serif",
                  fontWeight:700,
                  fontSize:13,
                  textDecoration:"none",
                  transition:"all .2s",
                  whiteSpace:"nowrap",
                }}
                onMouseEnter={e=>{ e.currentTarget.style.background=C.blueDk; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.blue; e.currentTarget.style.transform="none"; }}
              >
                Buka
              </a>
            </div>
          ))}

          {(!project.links || project.links.length === 0) && (
            <p style={{
              fontFamily:"'DM Sans',sans-serif", color:C.muted,
              fontSize:14, textAlign:"center", padding:"12px 0", margin:0,
            }}>
              Belum ada tautan yang tersedia.
            </p>
          )}
        </div>
      </div>

      <style>{`@keyframes pmFade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

/* ── Projects Section ── */
const Projects = () => {
  const [modalProject, setModalProject] = useState(null);

  return (
    <section id="projects" style={{ background:C.white, padding:"96px 0" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        <FadeIn><SLabel c="Pengalaman Proyek"/><STitle c="Project"/><Divider/></FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {projects.map((p,i)=>(
            <FadeIn key={i} delay={i*0.08}>
              <Card style={{ height:"100%", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                  <div style={{ width:52, height:52, borderRadius:16, background:`${C.blue}12`,
                    border:`1.5px solid ${C.blue}22`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:26 }}>{p.icon}</div>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700,
                    color:"#9ca3af", background:"#f3f4f6", padding:"3px 10px", borderRadius:999 }}>{p.year}</span>
                </div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt,
                  fontSize:15, lineHeight:1.3, marginBottom:10 }}>{p.title}</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                  {p.tech.map(t=>(
                    <span key={t} style={{ background:C.blueLt, color:C.blue, fontFamily:"'DM Sans',sans-serif",
                      fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:999 }}>{t}</span>
                  ))}
                </div>
                <ul style={{ listStyle:"none", padding:0, margin:0, flex:1 }}>
                  {p.items.map((item,j)=>(
                    <li key={j} style={{ fontFamily:"'DM Sans',sans-serif", color:"#4b5563", fontSize:14,
                      padding:"4px 0", display:"flex", gap:8, alignItems:"flex-start", lineHeight:1.5 }}>
                      <span style={{ color:C.neon, fontSize:18, lineHeight:1.2, flexShrink:0, fontWeight:900 }}>›</span>{item}
                    </li>
                  ))}
                </ul>

                {p.links && p.links.length > 0 && (
                  <button
                    onClick={() => setModalProject(p)}
                    style={{
                      marginTop:18,
                      width:"100%", padding:"9px 0",
                      borderRadius:10,
                      border:`1.5px solid ${C.border}`,
                      background:"transparent",
                      cursor:"pointer",
                      fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13,
                      color:C.muted,
                      transition:"all .22s ease",
                    }}
                    onMouseEnter={e=>{
                      e.currentTarget.style.borderColor=C.blue;
                      e.currentTarget.style.color=C.blue;
                      e.currentTarget.style.background=C.blueLt;
                    }}
                    onMouseLeave={e=>{
                      e.currentTarget.style.borderColor=C.border;
                      e.currentTarget.style.color=C.muted;
                      e.currentTarget.style.background="transparent";
                    }}
                  >
                    Lihat Detail
                  </button>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          onClose={() => setModalProject(null)}
        />
      )}
    </section>
  );
};

/* ══ GALLERY DATA ═════════════════════════════════════ */

const galleryItems = [
  { id:1,  cat:"Poster", title:"Techno Cup",   img:"/desain/poster-1.png" },
  { id:2,  cat:"Poster", title: "Techno Competition",  img:"/desain/poster-13.png"},
  { id:3,  cat:"Poster", title: "HMPSTI MERCH",   img:"/desain/poster-4.png"},
  { id:4,  cat:"Poster", title: "Techfair",  img:"/desain/poster-14.png" },
  { id:5,  cat:"Poster", title:"Market Day Ekraf",   img:"/desain/poster-2.png" },
  { id:6,  cat:"Poster", title:"Vintage Ekraf",   img:"/desain/poster-3.png" },
  { id:7,  cat:"Poster", title:"Mubes HMPSTi", img:"/desain/poster-115.png" },
  { id:8,  cat:"Poster", title:"Berani Bicara",  img:"/desain/poster-11.png" },
  { id:9,  cat:"Poster", title:"Bazar",   img:"/desain/poster-8.png" },
  { id:10, cat:"Poster", title:"Bazar",   img:"/desain/poster-9.png" },
  { id:11, cat:"Poster", title:"Feed your mind",  img:"/desain/poster-12.png"},
  { id:12, cat:"Poster", title:"I CARE",   img:"/desain/poster-7.png"},
  { id:13, cat:"Poster", title:"Pentas Seni Live",   img:"/desain/poster-6.png"},
  { id:20, cat:"Banner", title:"IPB Wellcome Banner",   img:"/desain/banner-1.png" },
  { id:21, cat:"Banner", title:"Techno Competition",   img:"/desain/banner-2.png" },
  { id:22, cat:"Banner", title:"Techfair",   img:"/desain/banner-3.png" },
  { id:23, cat:"Banner", title:"Bazar",   img:"/desain/banner-4.png" },
];

const stuffGroups = [
  {
    id: "stuff-1",
    title: "T-shirt",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-1.png" },
      { img: "/desain/stuff-1(2).png" },
      { img: "/desain/stuff-1(3).png" },
      { img: "/desain/stuff-1(4).png" },
    ],
  },
  {
    id: "stuff-3",
    title: "PDH",
    bio: "Koleksi desain stuff",
    images: [
      {  img: "/desain/stuff-3.png" },
      { img: "/desain/stuff-3(2).png" },
    ],
  },
  {
    id: "stuff-4",
    title: "Totebag",
    bio: "Koleksi desain stuff",
    images: [
      {img: "/desain/stuff-4.png" },
    ],
  },
  {
    id: "stuff-5",
    title: "Landyard",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-5.png" },
    ],
  },
  {
    id: "stuff-6",
    title: "Tumblr",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-6.png" },
    ],
  },
  {
    id: "stuff-7",
    title: "Sticker",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-7.png" },
      { img: "/desain/stuff-7(2).png" },
      { img: "/desain/stuff-7(3).png" },
    ],
  },
  {
    id: "stuff-8",
    title: "Keychain",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-8.png" },
      {  img: "/desain/stuff-8(2).png" },
      {  img: "/desain/stuff-8(3).png" },
    ],
  },
  {
    id: "stuff-9",
    title: "Buku",
    bio: "Koleksi desain stuff",
    images: [
      { img: "/desain/stuff-9.png" },
      {img: "/desain/stuff-9(2).png" },
    ],
  },
];

const igAccounts = [
  {
    id: "ig-1",
    account: "@osis_ickotapalu",
    profileUrl: "https://www.instagram.com/osis_ickotapalu/",
    bio: "Konten desain untuk akun OSIS IC Kota Palu",
    images: [
      {img: "/desain/sosmed-1.png" },
      { img: "/desain/sosmed-1(2).png" },
      { img: "/desain/sosmed-1(3).png" },
      { img: "/desain/sosmed-1(4).png" },
      { img: "/desain/sosmed-1(5).png" },
    ],
  },
  {
    id: "ig-2",
    account: "@nahlw_ui",
    profileUrl: "https://www.instagram.com/nahlw_ui/",
    bio: "Konten desain untuk akun @nahlw_ui",
    images: [
      {  img: "/desain/sosmed-2.png" },
      {  img: "/desain/sosmed-2(2).png" },
      {  img: "/desain/sosmed-2(3).png" },
    ],
  },
  {
    id: "ig-3",
    account: "@twinkle_grow",
    profileUrl: "https://www.instagram.com/twinkle_grow/",
    bio: "Konten desain untuk akun @twinkle_grow",
    images: [
      {img: "/desain/sosmed-3.png" },
      {img: "/desain/sosmed-3(2).png" },
      {img: "/desain/sosmed-3(3).png" },
      {img: "/desain/sosmed-3(4).png" },
    ],
  },
  {
    id: "ig-4",
    account: "@hmpsti.vokasiub",
    profileUrl: "https://www.instagram.com/hmpsti.vokasiub/",
    bio: "Company Profile HMPSTI 2025",
    images: [
      { img: "/desain/sosmed-4.png" },
      { title: "Company Profile HMPSTI 2025", img: "/desain/sosmed-4(2).png", href: "https://youtu.be/PPW3ELB-8xs?si=rHtAN2liDeIYe1nM" },
  ],
  },
];

const CATS = ["Semua", "Poster", "Banner", "stuff", "konten instagram"];

const CAT_META = {
  "Poster":            { color:"#6366f1", icon:"" },
  "Banner":            { color:"#f59e0b", icon:"" },
  "stuff":             { color:"#10b981", icon:"" },
  "konten instagram":  { color:"#ef4444", icon:"" },
};

/* ── Stuff Multi-Image Lightbox ── */
const StuffLightbox = ({ group, startIdx = 0, onClose }) => {
  const [cur, setCur] = useState(startIdx);
  const images = group.images;

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  setCur(i => (i + 1) % images.length);
      if (e.key === "ArrowLeft")   setCur(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, images.length]);

  const accent = CAT_META["stuff"].color;
  const hasSingle = images.length === 1;

  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(5,10,24,.93)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20, animation:"lbFade .2s ease" }}>

      <button onClick={onClose}
        style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,.1)",
          border:"1px solid rgba(255,255,255,.15)", borderRadius:"50%", width:44, height:44,
          cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center",
          justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>✕</button>

      {!hasSingle && (
        <button onClick={e=>{ e.stopPropagation(); setCur(i=>(i-1+images.length)%images.length); }}
          style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
            background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
            borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
            display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>‹</button>
      )}

      <div onClick={e=>e.stopPropagation()}
        style={{ borderRadius:20, overflow:"hidden",
          boxShadow:`0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)`,
          background:"#0f172a", display:"flex", flexDirection:"column",
          maxWidth:"min(92vw, 900px)" }}>

        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)",
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:`linear-gradient(135deg,${accent},#059669)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, flexShrink:0 }}>🎨</div>
          <div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#f1f5f9",
              fontSize:15, margin:0 }}>{group.title}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#64748b", fontSize:12,
              margin:"2px 0 0" }}>{group.bio}</p>
          </div>
          {!hasSingle && (
            <span style={{ marginLeft:"auto", fontFamily:"'DM Sans',sans-serif",
              fontSize:12, fontWeight:700, color:accent,
              background:`${accent}18`, padding:"4px 12px", borderRadius:999,
              border:`1px solid ${accent}30` }}>
              {cur + 1} / {images.length}
            </span>
          )}
        </div>

        <img key={cur} src={images[cur].img} alt={images[cur].title}
          style={{ display:"block",
            maxWidth:"min(92vw, 900px)",
            maxHeight:"70vh",
            width:"auto",
            height:"auto",
            objectFit:"contain",
            background:"#1e293b",
            margin:"0 auto",
            animation:"lbFade .18s ease" }}
          onError={e=>{
            const p = e.currentTarget.parentElement;
            e.currentTarget.remove();
            const d = document.createElement("div");
            d.style.cssText="background:#1e293b;width:400px;height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px";
            d.innerHTML=`<span style="font-size:44px">🖼️</span>
              <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#64748b;text-align:center;padding:0 24px;line-height:1.6">
                Foto belum tersedia<br/><code style="font-size:11px;opacity:.7">${images[cur].img}</code></p>`;
            p.insertBefore(d, p.firstChild);
          }}
        />

        <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#f1f5f9",
            fontSize:14, margin:0, lineHeight:1.3 }}>{images[cur].title}</p>
          {!hasSingle && (
            <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#475569", fontSize:11,
              margin:"4px 0 0" }}>← → untuk navigasi antar gambar</p>
          )}
        </div>

        {!hasSingle && (
          <div style={{ display:"flex", gap:8, padding:"10px 20px 16px",
            overflowX:"auto", borderTop:"1px solid rgba(255,255,255,.05)" }}>
            {images.map((img, idx) => (
              <button key={idx} onClick={()=>setCur(idx)}
                style={{ flexShrink:0, width:60, height:60, borderRadius:10, overflow:"hidden",
                  border:`2px solid ${idx===cur ? accent : "rgba(255,255,255,.12)"}`,
                  cursor:"pointer", padding:0, background:"#1e293b",
                  transition:"border-color .2s ease",
                  boxShadow: idx===cur ? `0 0 12px ${accent}66` : "none" }}>
                <img src={img.img} alt={img.title}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e=>{ e.currentTarget.parentElement.innerHTML="🎨"; e.currentTarget.parentElement.style.cssText+="display:flex;align-items:center;justify-content:center;font-size:22px"; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {!hasSingle && (
        <button onClick={e=>{ e.stopPropagation(); setCur(i=>(i+1)%images.length); }}
          style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)",
            background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
            borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
            display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>›</button>
      )}

      <style>{`@keyframes lbFade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

/* ── Instagram Multi-Image Lightbox ── */
const IgLightbox = ({ account, startIdx = 0, onClose }) => {
  const [cur, setCur] = useState(startIdx);
  const images = account.images;

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  setCur(i => (i + 1) % images.length);
      if (e.key === "ArrowLeft")   setCur(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, images.length]);

  const accent = CAT_META["konten instagram"].color;

  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(5,10,24,.93)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20, animation:"lbFade .2s ease" }}>

      <button onClick={onClose}
        style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,.1)",
          border:"1px solid rgba(255,255,255,.15)", borderRadius:"50%", width:44, height:44,
          cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center",
          justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>✕</button>

      <button onClick={e=>{ e.stopPropagation(); setCur(i=>(i-1+images.length)%images.length); }}
        style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
          borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
          display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>‹</button>

      <div onClick={e=>e.stopPropagation()}
        style={{ borderRadius:20, overflow:"hidden",
          boxShadow:`0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)`,
          background:"#0f172a", display:"flex", flexDirection:"column",
          maxWidth:"min(92vw, 900px)" }}>

        <div style={{ padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,.07)",
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
            background:`linear-gradient(135deg,${accent},#f97316)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, flexShrink:0 }}>📸</div>
          <div>
            <a href={account.profileUrl} target="_blank" rel="noreferrer"
              style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#f1f5f9",
                fontSize:15, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}
              onMouseEnter={e=>{e.currentTarget.style.color=accent;}}
              onMouseLeave={e=>{e.currentTarget.style.color="#f1f5f9";}}>
              {account.account}
              <span style={{ fontSize:11, opacity:.6 }}>↗</span>
            </a>
            <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#64748b", fontSize:12,
              margin:"2px 0 0" }}>{account.bio}</p>
          </div>
          <span style={{ marginLeft:"auto", fontFamily:"'DM Sans',sans-serif",
            fontSize:12, fontWeight:700, color:accent,
            background:`${accent}18`, padding:"4px 12px", borderRadius:999,
            border:`1px solid ${accent}30` }}>
            {cur + 1} / {images.length}
          </span>
        </div>

        <img key={cur} src={images[cur].img} alt={images[cur].title}
          style={{ display:"block",
            maxWidth:"min(92vw, 900px)",
            maxHeight:"70vh",
            width:"auto",
            height:"auto",
            objectFit:"contain",
            background:"#1e293b",
            margin:"0 auto",
            animation:"lbFade .18s ease" }}
          onError={e=>{
            const p = e.currentTarget.parentElement;
            e.currentTarget.remove();
            const d = document.createElement("div");
            d.style.cssText="background:#1e293b;width:400px;height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px";
            d.innerHTML=`<span style="font-size:44px">🖼️</span>
              <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#64748b;text-align:center;padding:0 24px;line-height:1.6">
                Foto belum tersedia<br/><code style="font-size:11px;opacity:.7">${images[cur].img}</code></p>`;
            p.insertBefore(d, p.firstChild);
          }}
        />

        <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#f1f5f9",
            fontSize:14, margin:0, lineHeight:1.3 }}>{images[cur].title}</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#475569", fontSize:11,
            margin:"4px 0 0" }}>← → untuk navigasi antar gambar</p>
        </div>

        <div style={{ display:"flex", gap:8, padding:"10px 20px 16px",
          overflowX:"auto", borderTop:"1px solid rgba(255,255,255,.05)" }}>
          {images.map((img, idx) => (
            <button key={idx} onClick={()=>setCur(idx)}
              style={{ flexShrink:0, width:60, height:60, borderRadius:10, overflow:"hidden",
                border:`2px solid ${idx===cur ? accent : "rgba(255,255,255,.12)"}`,
                cursor:"pointer", padding:0, background:"#1e293b",
                transition:"border-color .2s ease",
                boxShadow: idx===cur ? `0 0 12px ${accent}66` : "none" }}>
              <img src={img.img} alt={img.title}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                onError={e=>{ e.currentTarget.parentElement.innerHTML="🎨"; e.currentTarget.parentElement.style.cssText+="display:flex;align-items:center;justify-content:center;font-size:22px"; }}
              />
            </button>
          ))}
        </div>
      </div>

      <button onClick={e=>{ e.stopPropagation(); setCur(i=>(i+1)%images.length); }}
        style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)",
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
          borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
          display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>›</button>

      <style>{`@keyframes lbFade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

/* ── Lightbox (Poster & Banner) ── */
const Lightbox = ({ item, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const fn = (e) => {
      if (e.key==="Escape")     onClose();
      if (e.key==="ArrowRight") onNext();
      if (e.key==="ArrowLeft")  onPrev();
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow=""; };
  }, [onClose, onPrev, onNext]);

  const accent = CAT_META[item.cat]?.color || C.blue;

  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(5,10,24,.92)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:20, animation:"lbFade .2s ease" }}>

      <button onClick={onClose}
        style={{ position:"absolute", top:20, right:24, background:"rgba(255,255,255,.1)",
          border:"1px solid rgba(255,255,255,.15)", borderRadius:"50%", width:44, height:44,
          cursor:"pointer", color:"#fff", fontSize:20, display:"flex", alignItems:"center",
          justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>✕</button>

      <button onClick={e=>{ e.stopPropagation(); onPrev(); }}
        style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
          borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
          display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>‹</button>

      <div onClick={e=>e.stopPropagation()}
        style={{ borderRadius:20, overflow:"hidden",
          boxShadow:`0 40px 100px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)`,
          background:"#0f172a", maxWidth:"min(92vw, 900px)" }}>
        <img src={item.img} alt={item.title}
          style={{ display:"block",
            maxWidth:"min(92vw, 900px)",
            maxHeight:"76vh",
            width:"auto",
            height:"auto",
            objectFit:"contain",
            background:"#1e293b",
            margin:"0 auto" }}
          onError={e=>{
            const p = e.currentTarget.parentElement;
            e.currentTarget.remove();
            const d = document.createElement("div");
            d.style.cssText="background:#1e293b;width:400px;height:260px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px";
            d.innerHTML=`<span style="font-size:44px">🖼️</span>
              <p style="font-family:'DM Sans',sans-serif;font-size:13px;color:#64748b;text-align:center;padding:0 24px;line-height:1.6">
                Foto belum tersedia<br/><code style="font-size:11px;opacity:.7">${item.img}</code></p>`;
            p.insertBefore(d, p.firstChild);
          }}
        />
        <div style={{ padding:"14px 20px", display:"flex", alignItems:"center",
          justifyContent:"space-between", gap:16, borderTop:"1px solid rgba(255,255,255,.07)" }}>
          <div>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#f1f5f9",
              fontSize:15, margin:0, lineHeight:1.3 }}>{item.title}</p>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700,
              margin:"5px 0 0", color:accent, textTransform:"uppercase", letterSpacing:"0.1em" }}>
              {item.cat}
            </p>
          </div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#475569", flexShrink:0 }}>
            ← → untuk navigasi
          </span>
        </div>
      </div>

      <button onClick={e=>{ e.stopPropagation(); onNext(); }}
        style={{ position:"absolute", right:16, top:"50%", transform:"translateY(-50%)",
          background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
          borderRadius:"50%", width:52, height:52, cursor:"pointer", color:"#fff", fontSize:30,
          display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", zIndex:2 }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.22)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";}}>›</button>

      <style>{`@keyframes lbFade{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
};

/* ── Gallery Item (Poster & Banner) ── */
const GalleryItem = ({ item, onClick, isPortrait }) => {
  const [hov, setHov] = useState(false);
  const accent = CAT_META[item.cat]?.color || C.blue;

  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:16, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"#e2e8f0",
        boxShadow:hov?`0 24px 56px rgba(0,0,0,.18), 0 0 0 2px ${accent}66`:"0 4px 16px rgba(0,0,0,.08)",
        transform:hov?"translateY(-7px) scale(1.015)":"none",
        transition:"all .32s cubic-bezier(.34,1.56,.64,1)",
        aspectRatio: isPortrait ? "3/4" : "4/3" }}>

      <img src={item.img} alt={item.title}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"transform .4s ease", transform:hov?"scale(1.07)":"scale(1)" }}
        onError={e=>{
          e.currentTarget.style.display="none";
          const par = e.currentTarget.parentElement;
          const d = document.createElement("div");
          d.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#f1f5f9;gap:10px";
          d.innerHTML=`<div style="font-size:36px">🎨</div>
            <p style="font-family:'DM Sans',sans-serif;font-size:11px;color:#94a3b8;text-align:center;padding:0 16px;line-height:1.6">
              ${item.title}<br/><span style="font-size:10px;opacity:.6;word-break:break-all">${item.img}</span></p>`;
          par.appendChild(d);
        }}
      />

      <div style={{ position:"absolute", inset:0,
        background:hov
          ? "linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 50%,transparent 100%)"
          : "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)",
        transition:"background .32s ease", pointerEvents:"none" }}/>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", pointerEvents:"none" }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#fff",
          fontSize:13, margin:0, lineHeight:1.3,
          opacity:hov?1:0.9, transition:"opacity .25s ease" }}>
          {item.title}
        </p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.neon, fontSize:10, fontWeight:700,
          margin:"4px 0 0", letterSpacing:"0.1em", textTransform:"uppercase",
          opacity:hov?1:0, transform:hov?"translateY(0)":"translateY(6px)",
          transition:"all .3s ease" }}>
          Klik untuk perbesar ↗
        </p>
      </div>
    </div>
  );
};

/* ── Stuff Group Card ── */
const StuffGroupCard = ({ group, onClick }) => {
  const [hov, setHov] = useState(false);
  const accent = CAT_META["stuff"].color;
  const cover = group.images[0]?.img;
  const count = group.images.length;
  const hasMultiple = count > 1;

  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:16, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"#e2e8f0",
        boxShadow:hov?`0 24px 56px rgba(0,0,0,.18), 0 0 0 2px ${accent}66`:"0 4px 16px rgba(0,0,0,.08)",
        transform:hov?"translateY(-7px) scale(1.015)":"none",
        transition:"all .32s cubic-bezier(.34,1.56,.64,1)",
        aspectRatio:"4/3" }}>

      <img src={cover} alt={group.title}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"transform .4s ease", transform:hov?"scale(1.07)":"scale(1)" }}
        onError={e=>{
          e.currentTarget.style.display="none";
          const par = e.currentTarget.parentElement;
          const d = document.createElement("div");
          d.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#f1f5f9;gap:10px";
          d.innerHTML=`<div style="font-size:36px">🎨</div>
            <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#94a3b8;text-align:center;padding:0 16px">${group.title}</p>`;
          par.appendChild(d);
        }}
      />

      <div style={{ position:"absolute", inset:0,
        background:hov
          ? "linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.25) 50%,transparent 100%)"
          : "linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 60%)",
        transition:"background .32s ease", pointerEvents:"none" }}/>

      {hasMultiple && (
        <div style={{ position:"absolute", top:10, right:10,
          background:"rgba(0,0,0,.55)", backdropFilter:"blur(6px)",
          borderRadius:999, padding:"3px 10px",
          fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:10, color:"#fff",
          border:"1px solid rgba(255,255,255,.2)" }}>
          {count} foto
        </div>
      )}

      {hov && hasMultiple && (
        <div style={{ position:"absolute", bottom:60, left:12, right:12,
          display:"flex", gap:5, pointerEvents:"none" }}>
          {group.images.slice(0, 4).map((img, i) => (
            <div key={i} style={{ flex:1, aspectRatio:"1", borderRadius:7, overflow:"hidden",
              border:"1.5px solid rgba(255,255,255,.4)",
              opacity: i === 0 ? 1 : 0.75 }}>
              <img src={img.img} alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={e=>{ e.currentTarget.style.display="none"; }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", pointerEvents:"none" }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff",
          fontSize:13, margin:0, lineHeight:1.3 }}>{group.title}</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,.7)",
          fontSize:11, margin:"3px 0 0", lineHeight:1.4 }}>{group.bio}</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.neon, fontSize:10, fontWeight:700,
          margin:"5px 0 0", letterSpacing:"0.1em", textTransform:"uppercase",
          opacity:hov?1:0, transform:hov?"translateY(0)":"translateY(6px)",
          transition:"all .3s ease" }}>
          {hasMultiple ? "Klik untuk lihat semua foto ↗" : "Klik untuk perbesar ↗"}
        </p>
      </div>
    </div>
  );
};

/* ── Instagram Account Card ── */
const IgAccountCard = ({ account, onClick }) => {
  const [hov, setHov] = useState(false);
  const accent = CAT_META["konten instagram"].color;
  const cover = account.images[0]?.img;
  const count = account.images.length;

  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:16, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"#e2e8f0",
        boxShadow:hov?`0 24px 56px rgba(0,0,0,.18), 0 0 0 2px ${accent}66`:"0 4px 16px rgba(0,0,0,.08)",
        transform:hov?"translateY(-7px) scale(1.015)":"none",
        transition:"all .32s cubic-bezier(.34,1.56,.64,1)",
        aspectRatio:"4/3" }}>

      <img src={cover} alt={account.account}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"transform .4s ease", transform:hov?"scale(1.07)":"scale(1)" }}
        onError={e=>{
          e.currentTarget.style.display="none";
          const par = e.currentTarget.parentElement;
          const d = document.createElement("div");
          d.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#f1f5f9;gap:10px";
          d.innerHTML=`<div style="font-size:36px">📸</div>
            <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:#94a3b8;text-align:center;padding:0 16px">${account.account}</p>`;
          par.appendChild(d);
        }}
      />

      <div style={{ position:"absolute", inset:0,
        background:hov
          ? "linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.25) 50%,transparent 100%)"
          : "linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 60%)",
        transition:"background .32s ease", pointerEvents:"none" }}/>

      <div style={{ position:"absolute", top:10, right:10,
        background:"rgba(0,0,0,.55)", backdropFilter:"blur(6px)",
        borderRadius:999, padding:"3px 10px",
        fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:10, color:"#fff",
        border:"1px solid rgba(255,255,255,.2)" }}>
        {count} foto
      </div>

      {hov && (
        <div style={{ position:"absolute", bottom:60, left:12, right:12,
          display:"flex", gap:5, pointerEvents:"none" }}>
          {account.images.slice(0, 4).map((img, i) => (
            <div key={i} style={{ flex:1, aspectRatio:"1", borderRadius:7, overflow:"hidden",
              border:"1.5px solid rgba(255,255,255,.4)",
              opacity: i === 0 ? 1 : 0.75 }}>
              <img src={img.img} alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover" }}
                onError={e=>{ e.currentTarget.style.display="none"; }}
              />
            </div>
          ))}
        </div>
      )}

      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", pointerEvents:"none" }}>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff",
          fontSize:14, margin:0, lineHeight:1.3 }}>{account.account}</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,.7)",
          fontSize:11, margin:"3px 0 0", lineHeight:1.4 }}>{account.bio}</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.neon, fontSize:10, fontWeight:700,
          margin:"5px 0 0", letterSpacing:"0.1em", textTransform:"uppercase",
          opacity:hov?1:0, transform:hov?"translateY(0)":"translateY(6px)",
          transition:"all .3s ease" }}>
          Klik untuk lihat semua foto ↗
        </p>
      </div>
    </div>
  );
};

/* ── Gallery Section ── */
const Gallery = () => {
  const [activeCat, setActiveCat] = useState("Semua");
  const [lightbox,  setLightbox]  = useState(null);
  const [igLightbox, setIgLightbox] = useState(null);
  const [stuffLightbox, setStuffLightbox] = useState(null);

  const filtered = (activeCat === "Semua" || activeCat === "Poster" || activeCat === "Banner")
    ? (activeCat === "Semua"
        ? galleryItems
        : galleryItems.filter(g => g.cat === activeCat))
    : [];

  const catCount = (cat) => {
    if (cat === "Semua") return (
      galleryItems.length +
      igAccounts.reduce((s,a) => s + a.images.length, 0) +
      stuffGroups.reduce((s,g) => s + g.images.length, 0)
    );
    if (cat === "konten instagram") return igAccounts.reduce((s,a) => s + a.images.length, 0);
    if (cat === "stuff") return stuffGroups.reduce((s,g) => s + g.images.length, 0);
    return galleryItems.filter(g => g.cat === cat).length;
  };

  const visibleCats = activeCat === "Semua"
    ? CATS.slice(1)
    : [activeCat];

  return (
    <section id="gallery" style={{ background:C.bg, padding:"96px 0" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>

        <FadeIn>
          <SLabel c="Karya Desain"/>
          <STitle c="Creative Portfolio"/>
          <Divider/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.muted, fontSize:15,
            marginBottom:36, maxWidth:560, lineHeight:1.75 }}>
            Kumpulan karya desain grafis — mulai dari banner &amp; poster event, materi promosi bazaar,
            hingga desain kaos dan konten media sosial.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:44 }}>
            {CATS.map(cat => {
              const act  = activeCat === cat;
              const col  = cat === "Semua" ? C.blue : (CAT_META[cat]?.color || C.blue);
              return (
                <button key={cat} onClick={()=>setActiveCat(cat)}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 20px", borderRadius:999,
                    border:`2px solid ${act ? col : C.border}`,
                    background: act ? col : C.white,
                    color: act ? "#fff" : C.muted,
                    fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13,
                    cursor:"pointer", transition:"all .25s ease",
                    boxShadow: act ? `0 6px 20px ${col}44` : "none",
                    transform: act ? "translateY(-2px)" : "none" }}
                  onMouseEnter={e=>{ if(!act){ e.currentTarget.style.borderColor=col; e.currentTarget.style.color=col; e.currentTarget.style.transform="translateY(-1px)"; }}}
                  onMouseLeave={e=>{ if(!act){ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted; e.currentTarget.style.transform="none"; }}}>
                  {CAT_META[cat]?.icon && <span style={{ fontSize:15 }}>{CAT_META[cat].icon}</span>}
                  {cat}
                  <span style={{ background: act ? "rgba(255,255,255,.25)" : "#f3f4f6",
                    color: act ? "#fff" : C.muted, borderRadius:999, padding:"1px 8px",
                    fontSize:11, fontWeight:800, transition:"all .25s ease" }}>
                    {catCount(cat)}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {visibleCats.map(cat => {
          const accent = CAT_META[cat]?.color || C.blue;

          if (cat === "stuff") {
            return (
              <div key={cat} style={{ marginBottom:56 }}>
                <FadeIn>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                    <span style={{ fontSize:20 }}>🎨</span>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
                      fontSize:"clamp(1.05rem,2.5vw,1.45rem)", color:C.txt }}>{cat}</span>
                    <div style={{ flex:1, height:1.5,
                      background:`linear-gradient(to right,${accent}66,transparent)`, borderRadius:1 }}/>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:accent,
                      background:`${accent}15`, padding:"3px 12px", borderRadius:999,
                      fontWeight:700, border:`1px solid ${accent}30` }}>
                      {stuffGroups.length} set
                    </span>
                  </div>
                </FadeIn>
                <div style={{ display:"grid",
                  gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
                  {stuffGroups.map((grp, idx) => (
                    <FadeIn key={grp.id} delay={idx * 0.05}>
                      <StuffGroupCard
                        group={grp}
                        onClick={()=>setStuffLightbox({ group: grp })}
                      />
                    </FadeIn>
                  ))}
                </div>
              </div>
            );
          }

          if (cat === "konten instagram") {
            return (
              <div key={cat} style={{ marginBottom:56 }}>
                <FadeIn>
                  <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                    <span style={{ fontSize:20 }}>📸</span>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
                      fontSize:"clamp(1.05rem,2.5vw,1.45rem)", color:C.txt }}>{cat}</span>
                    <div style={{ flex:1, height:1.5,
                      background:`linear-gradient(to right,${accent}66,transparent)`, borderRadius:1 }}/>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:accent,
                      background:`${accent}15`, padding:"3px 12px", borderRadius:999,
                      fontWeight:700, border:`1px solid ${accent}30` }}>
                      {igAccounts.length} akun
                    </span>
                  </div>
                </FadeIn>
                <div style={{ display:"grid",
                  gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:16 }}>
                  {igAccounts.map((acc, idx) => (
                    <FadeIn key={acc.id} delay={idx * 0.07}>
                      <IgAccountCard
                        account={acc}
                        onClick={()=>setIgLightbox({ account: acc, startIdx: 0 })}
                      />
                    </FadeIn>
                  ))}
                </div>
              </div>
            );
          }

          const items = filtered.filter(g => g.cat === cat);
          if (items.length === 0) return null;

          const isPortrait = cat === "Poster";

          return (
            <div key={cat} style={{ marginBottom:56 }}>
              <FadeIn>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                  <span style={{ fontSize:20 }}>{CAT_META[cat]?.icon}</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
                    fontSize:"clamp(1.05rem,2.5vw,1.45rem)", color:C.txt }}>{cat}</span>
                  <div style={{ flex:1, height:1.5,
                    background:`linear-gradient(to right,${accent}66,transparent)`, borderRadius:1 }}/>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:accent,
                    background:`${accent}15`, padding:"3px 12px", borderRadius:999,
                    fontWeight:700, border:`1px solid ${accent}30` }}>
                    {items.length} karya
                  </span>
                </div>
              </FadeIn>

              <div style={{ display:"grid",
                gridTemplateColumns: isPortrait
                  ? "repeat(auto-fill,minmax(190px,1fr))"
                  : "repeat(auto-fill,minmax(240px,1fr))",
                gap:16 }}>
                {items.map((item, idx) => {
                  const globalIdx = filtered.findIndex(f => f.id === item.id);
                  return (
                    <FadeIn key={item.id} delay={idx * 0.07}>
                      <GalleryItem
                        item={item}
                        isPortrait={isPortrait}
                        onClick={()=>setLightbox(globalIdx)}
                      />
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {lightbox !== null && (
        <Lightbox
          item={filtered[lightbox]}
          onClose={()=>setLightbox(null)}
          onPrev={()=>setLightbox(i=>(i-1+filtered.length)%filtered.length)}
          onNext={()=>setLightbox(i=>(i+1)%filtered.length)}
        />
      )}

      {igLightbox !== null && (
        <IgLightbox
          account={igLightbox.account}
          startIdx={igLightbox.startIdx}
          onClose={()=>setIgLightbox(null)}
        />
      )}

      {stuffLightbox !== null && (
        <StuffLightbox
          group={stuffLightbox.group}
          startIdx={0}
          onClose={()=>setStuffLightbox(null)}
        />
      )}
    </section>
  );
};

/* ══ ORGANISATION ═════════════════════════════════════ */
const Organization = () => (
  <section id="org" style={{ background:C.white, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Kontribusi"/><STitle c="Pengalaman Organisasi"/><Divider/></FadeIn>
      <FadeIn delay={0.1}>
        <Card style={{ borderLeft:`4px solid ${C.neon}`, maxWidth:720 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
            <div style={{ width:54, height:54, borderRadius:18, background:`${C.blue}14`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>🏛️</div>
            <div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:16, lineHeight:1.3 }}>
                Staff Ahli Departemen Pusat Komunikasi dan Informatika
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.blue, fontWeight:700, fontSize:14, marginTop:4 }}>
                Himpunan Mahasiswa Teknologi Informasi — Universitas Brawijaya
              </p>
              <span style={{ fontFamily:"'DM Sans',sans-serif", color:"#9ca3af", fontSize:12 }}>2024 – 2025</span>
            </div>
          </div>
          {["Mengelola publikasi visual, media sosial, dan branding digital organisasi untuk meningkatkan engagement audiens serta menyebarkan informasi seputar program studi teknologi informasi"].map((item,j)=>(
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
  { title:"Hard Skills", border:C.blue,
    items:["System Analysis","Requirement Elicitation","SDLC","UML","ERD","DFD","UI/UX Design","Wireframing","Prototyping","Figma","PHP","Laravel","JavaScript","HTML","CSS","Python","MySQL"] },
  { title:"Soft Skills", border:"#8b5cf6",
    items:["Communication","Time Management","Team Collaboration","Analytical Thinking","Problem Solving"] },
  { title:"Creative Skills", border:"#f43f5e",
    items:["Graphic Design","Video Editing","Photography & Videography"] },
];

const Skills = () => (
  <section id="skills" style={{ background:C.bg, padding:"96px 0" }}>
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
  { name:"VS Code",     img:"/icon/vsc.jpg",        color:"#007acc" },
  { name:"Arduino IDE", img:"/icon/arduinoide.jpg", color:"#00979d" },
  { name:"Python",      img:"/icon/python.jpg",     color:"#3776ab" },
  { name:"Flask",      img:"/icon/flask.jpg",       color:"#3776ab" },
  { name:"Laravel",     img:"/icon/laravel.jpg",    color:"#ef4444" },
  { name:"MySQL",       img:"/icon/mysql.jpg",      color:"#00758f" },
  { name:"GitHub",      img:"/icon/github.jpg",     color:"#24292e" },
  { name:"Figma",       img:"/icon/figma.jpg",      color:"#f24e1e" },
  { name:"Canva",       img:"/icon/canva.jpg",      color:"#00c4cc" },
  { name:"Capcut",      img:"/icon/capcut.jpg",     color:"#252525" },
];

const Tools = () => (
  <section id="tools" style={{ background:C.white, padding:"96px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Alat Kerja"/><STitle c="Tools & Software"/><Divider/></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:16 }}>
        {tools.map((t,i)=>(
          <FadeIn key={i} delay={i*0.06}>
            <Card style={{ textAlign:"center", padding:"26px 16px" }}>
              <div style={{ width:56, height:56, borderRadius:18, background:`${t.color}18`,
                border:`1.5px solid ${t.color}22`, display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 12px", overflow:"hidden" }}>
                <img src={t.img} alt={t.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e=>{ e.currentTarget.parentElement.innerHTML="🔧"; e.currentTarget.parentElement.style.fontSize="26px"; }}
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
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:22 }}>
          DNS<span style={{ color:C.neon }}>.</span>
        </p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#94a3b8", fontSize:14, marginTop:4 }}>
          Dwi Nurfitriana Salsabila · D3 TI Universitas Brawijaya
        </p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        {[
          { label:"Email",    href:"mailto:ssalsabilaa235@gmail.com" },
          { label:"GitHub",   href:"https://github.com/billknwv" },
          { label:"LinkedIn", href:"https://www.linkedin.com/in/dwi-nurfitriana-salsabila" },
        ].map(l=>(
          <a key={l.label} href={l.href}
            target={l.label!=="Email"?"_blank":undefined} rel="noreferrer"
            style={{ padding:"8px 18px", borderRadius:999, border:"1.5px solid #334155",
              color:"#cbd5e1", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
              textDecoration:"none", transition:"all .25s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.neon;e.currentTarget.style.color=C.neon;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="#334155";e.currentTarget.style.color="#cbd5e1";}}>
            {l.label}
          </a>
        ))}
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#475569", fontSize:13 }}>
        © 2026 Dwi Nurfitriana Salsabila (billknwv)
      </p>
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
      <Gallery/>
      <Organization/>
      <Skills/>
      <Tools/>
      <Footer/>
    </>
  );
}