import { useState, useEffect, useRef } from "react";

/* ── DESIGN TOKENS — minimalist, single-hue blue system ──────── */
const C = {
  blue:    "#2563eb",
  blueDk:  "#1e3a8a",
  blueMd:  "#60a5fa",
  blueLt:  "#eff6ff",
  green:   "#c6ff00",
  greenDk: "#7cb305",
  greenLt: "#d9ff66",
  bg:      "#f7f9fc",
  white:   "#ffffff",
  txt:     "#0f172a",
  muted:   "#64748b",
  border:  "#e2e8f0",
};

/* ── INTERSECTION OBSERVER HOOK ────────────────────── */
const useInView = (threshold = 0.15) => {
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
  const t = { up:"translateY(32px)", left:"translateX(-32px)", right:"translateX(32px)", none:"none" };
  return (
    <div ref={ref} className={className}
      style={{ opacity:vis?1:0, transform:vis?"none":t[dir],
        transition:`opacity .6s cubic-bezier(.22,.61,.36,1) ${delay}s, transform .6s cubic-bezier(.22,.61,.36,1) ${delay}s` }}>
      {children}
    </div>
  );
};

const SLabel = ({ c }) => (
  <span style={{ color:C.blue, fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12,
    letterSpacing:"0.18em", textTransform:"uppercase" }}>{c}</span>
);
const STitle = ({ c }) => (
  <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
    fontSize:"clamp(1.7rem,3.6vw,2.5rem)", color:C.txt, lineHeight:1.15, marginTop:6 }}>
    {c}<span style={{ color:C.green }}>.</span>
  </h2>
);
const Divider = () => (
  <div style={{ width:44, height:3, borderRadius:2, margin:"14px 0 34px",
    background:`linear-gradient(90deg,${C.blue},${C.green})` }} />
);

const Card = ({ children, className="", style={} }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className={className}
      style={{ background:C.white, borderRadius:16, border:`1px solid ${C.border}`, padding:24,
        transition:"all .25s ease",
        transform:hov?"translateY(-3px)":"none",
        boxShadow:hov?"0 12px 32px rgba(37,99,235,.10)":"0 1px 3px rgba(15,23,42,.04)",
        ...style }}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </div>
  );
};

const Pill = ({ label, color=C.blue }) => (
  <span style={{ display:"inline-block", padding:"5px 14px", borderRadius:999,
    border:`1.5px solid ${color}33`, color, background:`${color}0d`,
    fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12.5 }}>
    {label}
  </span>
);

/* ══ NAV ══════════════════════════════════════════════ */
const NAV_LINKS = [
  { label:"Tentang",    href:"about" },
  { label:"Pendidikan", href:"edu" },
  { label:"Proyek",     href:"projects" },
  { label:"Organisasi", href:"org" },
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
      background:scrolled?"rgba(255,255,255,.96)":"transparent",
      backdropFilter:scrolled?"blur(18px)":"none",
      boxShadow:scrolled?"0 1px 0 rgba(15,23,42,.06)":"none",
      transition:"all .3s ease" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", height:64,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          style={{ background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:21,
            color:scrolled?C.blue:"#fff" }}>
          DNS<span style={{ color:scrolled?C.blueMd:C.blueMd }}>.</span>
        </button>
        <div style={{ display:"flex", gap:4, alignItems:"center" }} className="desk-nav">
          {NAV_LINKS.map(({ label, href }) => {
            const isAct = active === href;
            return (
              <button key={href} onClick={()=>go(href)}
                style={{ background:isAct?C.blue:"transparent", border:"none", cursor:"pointer",
                  padding:"7px 16px", borderRadius:999,
                  fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                  color:isAct?"#fff":(scrolled?C.muted:"rgba(255,255,255,.82)"),
                  transition:"all .2s ease" }}
                onMouseEnter={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.blue:"#fff"; e.currentTarget.style.background=scrolled?C.blueLt:"rgba(255,255,255,.12)"; }}}
                onMouseLeave={e=>{ if(!isAct){ e.currentTarget.style.color=scrolled?C.muted:"rgba(255,255,255,.82)"; e.currentTarget.style.background="transparent"; }}}>
                {label}
              </button>
            );
          })}
          <button onClick={()=>go("about")}
            style={{ marginLeft:8, padding:"8px 20px", borderRadius:999, background:C.blue,
              border:"none", cursor:"pointer", fontFamily:"'Syne',sans-serif", fontWeight:700,
              fontSize:13, color:"#fff", transition:"all .2s ease" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.blueDk; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=C.blue; }}>
            Kontak Saya
          </button>
        </div>
        <button className="mob-nav" onClick={()=>setOpen(!open)}
          style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:5, padding:4 }}>
          {[0,1,2].map(i=>(
            <span key={i} style={{ display:"block", width:24, height:2, borderRadius:2,
              background:scrolled?C.blue:"#fff", transition:"all .3s ease",
              transform:open&&i===0?"rotate(45deg) translateY(7px)":open&&i===2?"rotate(-45deg) translateY(-7px)":"none",
              opacity:open&&i===1?0:1 }}/>
          ))}
        </button>
      </div>
      <div style={{ overflow:"hidden", maxHeight:open?400:0, transition:"max-height .3s ease",
        background:"rgba(255,255,255,.98)", backdropFilter:"blur(14px)" }}>
        <div style={{ padding:"12px 24px 20px", display:"flex", flexDirection:"column", gap:4 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <button key={href} onClick={()=>go(href)}
              style={{ background:active===href?C.blueLt:"none", border:"none", cursor:"pointer",
                padding:"10px 16px", borderRadius:10, textAlign:"left",
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

/* ══ HERO — flat blue field, no ornament ═════════════════════ */
const Hero = () => {
  const [ok, setOk] = useState(false);
  useEffect(()=>{ setTimeout(()=>setOk(true),80); },[]);
  const f = (d,dy="Y",dist=24) => ({
    opacity:ok?1:0, transform:ok?"none":`translate${dy}(${dist}px)`,
    transition:`opacity .8s ease ${d}s, transform .8s ease ${d}s`
  });
  return (
    <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative",
      overflow:"hidden", background:`linear-gradient(150deg,${C.blueDk} 0%,${C.blue} 60%,#1d4ed8 100%)` }}>

      {/* simple blob background — like the original version */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-100px", right:"-80px", width:480, height:480,
          borderRadius:"62% 38% 50% 50%/48% 52% 48% 52%",
          background:`${C.green}1f`, animation:"blob1 8s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", bottom:"40px", left:"-60px", width:320, height:320,
          borderRadius:"45% 55% 38% 62%/60% 40% 60% 40%",
          background:"rgba(255,255,255,.07)", animation:"blob2 10s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", top:"35%", right:"22%", width:160, height:160, borderRadius:"50%",
          background:`${C.green}14`, animation:"blob1 6s ease-in-out infinite reverse" }}/>
        <svg width="100%" height="100%" style={{ opacity:.07, position:"absolute", inset:0 }}>
          <defs><pattern id="gdots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#fff"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#gdots)"/>
        </svg>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"100px 24px 80px", width:"100%", position:"relative", zIndex:1 }}>
        <div style={f(0.2)}>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
            fontSize:"clamp(3rem,9vw,7rem)", color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>
            Porto<span style={{ color:C.green }}>folio</span>
          </h1>
        </div>
        <div style={f(0.35)}>
          <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(1.3rem,3.6vw,2.4rem)", color:"#fff", lineHeight:1.2, marginTop:8 }}>
            Dwi Nurfitriana <span style={{ color:C.green }}>Salsabila</span>
          </p>
        </div>
        <div style={f(0.5)}>
          <div style={{ display:"flex", gap:14, marginTop:28, flexWrap:"wrap" }}>
            <button onClick={()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"12px 26px", borderRadius:999, background:"#fff", border:"none", cursor:"pointer",
                fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14.5, color:C.blueDk, transition:"all .25s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
              Lihat Profil
            </button>
            <button onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}
              style={{ padding:"12px 26px", borderRadius:999, background:"transparent",
                border:"1.5px solid rgba(255,255,255,.4)", cursor:"pointer",
                fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:14.5, color:"#fff", transition:"all .25s ease" }}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.1)";e.currentTarget.style.borderColor="#fff";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,.4)";}}>
              Lihat Proyek
            </button>
          </div>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", animation:"bounce 2.2s infinite" }}>
        <div style={{ width:22, height:36, borderRadius:12, border:"1.5px solid rgba(255,255,255,.3)",
          display:"flex", justifyContent:"center", paddingTop:6 }}>
          <div style={{ width:3, height:8, borderRadius:2, background:"rgba(255,255,255,.8)", animation:"sdot 1.8s infinite" }}/>
        </div>
      </div>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)}}
        @keyframes sdot{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(14px)}}
        @keyframes blob1{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-20px) rotate(5deg)}}
        @keyframes blob2{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(14px) rotate(-4deg)}}
        .desk-nav{display:flex}
        .mob-nav{display:none}
        @media(max-width:767px){.desk-nav{display:none!important}.mob-nav{display:flex!important}}
      `}</style>
    </section>
  );
};

/* ══ ABOUT ════════════════════════════════════════════ */
const About = () => (
  <section id="about" style={{ background:C.white, padding:"92px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <div className="about-grid">
        <FadeIn dir="left">
          <SLabel c="About Me"/>
          <STitle c="I'm Dwi Nurfitriana Salsabila"/>
          <Divider/>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#374151", lineHeight:1.85, fontSize:16 }}>
            Mahasiswa D3 Teknologi Informasi di Universitas Brawijaya dengan minat pada pengembangan perangkat lunak dan analisis sistem. Berpengalaman dalam pengembangan aplikasi web, perancangan antarmuka, serta pengolahan data. Terbiasa berkolaborasi dalam tim dan memiliki kemampuan <em>problem solving</em> yang baik untuk menghasilkan solusi yang efektif dan efisien.
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
                style={{ fontFamily:"'DM Sans',sans-serif",
                  fontSize:13, color:C.blue, textDecoration:"none", background:C.blueLt,
                  padding:"8px 16px", borderRadius:999, fontWeight:600, border:`1px solid ${C.border}`,
                  transition:"all .2s ease" }}
                onMouseEnter={e=>{e.currentTarget.style.background=C.blue;e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background=C.blueLt;e.currentTarget.style.color=C.blue;}}>
                {l.label}
              </a>
            ))}
          </div>
        </FadeIn>
        <FadeIn dir="right" delay={0.15}>
          <div style={{ display:"flex", justifyContent:"center" }}>
            <div style={{ position:"relative", display:"inline-block" }}>
              <div style={{ position:"absolute", top:14, left:14, right:-14, bottom:-14, borderRadius:24,
                background:C.blueLt, zIndex:0 }}/>
              <div id="photo-wrap" style={{ width:290, height:350, borderRadius:20, overflow:"hidden",
                position:"relative", zIndex:1, boxShadow:"0 20px 48px rgba(15,23,42,.12)",
                background:C.blueLt,
                display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                <img src="bila.jpg" alt="Dwi Nurfitriana Salsabila"
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e=>{
                    const wrap = e.currentTarget.parentElement;
                    e.currentTarget.remove();
                    wrap.innerHTML=`<div style="width:76px;height:76px;border-radius:50%;background:${C.blue};color:#fff;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:28px">DN</div>
                      <p style="font-family:'Syne',sans-serif;font-weight:800;color:${C.blue};font-size:15px;text-align:center;padding:0 20px;margin-top:16px">Dwi Nurfitriana Salsabila</p>
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
  <section id="edu" style={{ background:C.bg, padding:"92px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Akademik"/><STitle c="Pendidikan"/><Divider/></FadeIn>
      <FadeIn delay={0.1}>
        <Card style={{ maxWidth:420 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:18 }}>Universitas Brawijaya</h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.blue, fontSize:15, fontWeight:600, marginTop:5 }}>D3 Teknologi Informasi – Fakultas Vokasi</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#9ca3af", fontSize:13, marginTop:4 }}>2024 – Sekarang · Malang, Jawa Timur</p>
          <span style={{ display:"inline-block", marginTop:12, background:C.blueLt, color:C.blue,
            fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, padding:"4px 12px", borderRadius:999 }}>Aktif</span>
        </Card>
      </FadeIn>
    </div>
  </section>
);

/* ══ PROJECTS ═════════════════════════════════════════ */
const projects = [
  {
    img:"/proyek/mao.png",
    title:"Website Coffee Shop & Sistem Reservasi", year:"2025",
    desc:"Aplikasi berbasis web yang dirancang sebagai media branding digital sekaligus platform layanan reservasi online untuk bisnis coffee shop.",
    links: [
      { label:"Source Code", url:"https://github.com/Oliviafzhh/maocoffee", meta:"Laravel · Private" },
      { label:"Figma", url:"https://www.figma.com/design/03Q7nADDyhAL5ifu6eLMvy/UI-UX-T3E?node-id=0-1&t=GGAG0aEFBlsUh5uO-1", meta:"Desain · Figma" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/1hXV6VB7EpLjGK-8PN5aHniigau9y6YXG/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    img:"/proyek/msi.png",
    title:"Analisis Sistem Informasi MaoPlace", year:"2025",
    desc:"Proyek analisis proses bisnis yang bertujuan untuk mengidentifikasi hambatan operasional pada UMKM MaoPlace.",
    links: [
      { label:"Dokumen", url:"https://drive.google.com/file/d/1O3OE9qUsfZA7CHGhLSrOIAkybkWHhL9u/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    img:"/proyek/althera.png",
    title:"Sistem Informasi Akademik", year:"2025",
    desc:"Perancangan dan pengembangan platform sistem informasi akademik berbasis desktop untuk mengoptimalkan pengelolaan data pendidikan.",
    links: [
      { label:"Source Code", url:"https://github.com/billknwv/Sistem-Informasi-Akademik-UNIVERSITAS-ALTHERA", meta:"Web · Public" },
      { label:"Figma", url:"https://www.figma.com/design/ccWj4ULlFehFBwmr432Y6s/T2E?node-id=0-1&t=lhD5WZ8gUKRqX0Cm-1", meta:"Desain · Figma" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/147516eyw4CRI8BD5CwbTO_5ca7_R1YBq/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    img:"/proyek/ai.png",
    title:"Waste Material Detector", year:"2025",
    desc:"Aplikasi berbasis web terintegrasi kecerdasan buatan (AI) yang berfungsi untuk mendeteksi dan mengidentifikasi jenis material sampah secara otomatis.",
    links: [
      { label:"Source Code", url:"https://github.com/billknwv/Waste-Material-Detector", meta:"Python · Public" },
      { label:"Dokumen", url:"https://drive.google.com/file/d/1xlHa6mmmve7CNy-uUDlvNHVi2Hu4iqUt/view?usp=sharing", meta:"PDF · Google Drive" },
    ],
  },
  {
    img:"/proyek/iot.png",
    title:"SORTIR.IN – Smart Waste Management", year:"2026",
    desc:"Inovasi sistem pengelolaan sampah pintar berbasis IoT yang mengombinasikan perangkat keras pemilah sampah otomatis dengan platform monitoring berbasis web.",
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
        background:"rgba(8,15,32,.78)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"20px", animation:"pmFade .2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:C.white,
          borderRadius:18,
          width:"100%",
          maxWidth:480,
          boxShadow:"0 32px 80px rgba(0,0,0,.3)",
          overflow:"hidden",
        }}
      >
        <div style={{
          padding:"20px 22px 18px",
          borderBottom:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:15, color:C.txt, margin:0, lineHeight:1.4,
            }}>
              {project.title}
            </p>
            <p style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:13,
              color:C.muted, margin:"5px 0 0",
            }}>
              {project.year}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink:0, width:32, height:32, borderRadius:"50%",
              border:`1.5px solid ${C.border}`, background:"none",
              cursor:"pointer", fontSize:15, color:C.muted,
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background=C.blueLt; e.currentTarget.style.color=C.blue; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=C.muted; }}
          >
            ×
          </button>
        </div>

        <div style={{ padding:"16px 22px 0" }}>
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize:14,
            color:"#374151", lineHeight:1.75, margin:0,
          }}>
            {project.desc}
          </p>
        </div>

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
                onMouseEnter={e=>{ e.currentTarget.style.background=C.blueDk; }}
                onMouseLeave={e=>{ e.currentTarget.style.background=C.blue; }}
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

/* ── Project Card: image-filled, title with text-shadow ── */
const ProjectCard = ({ project, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ position:"relative", borderRadius:18, overflow:"hidden", cursor:"pointer",
        aspectRatio:"4/3", background:C.blueDk,
        boxShadow:hov?"0 24px 48px rgba(15,23,42,.22)":"0 4px 16px rgba(15,23,42,.08)",
        transform:hov?"translateY(-6px)":"none",
        transition:"all .3s cubic-bezier(.22,.61,.36,1)" }}>

      <img src={project.img} alt={project.title}
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block",
          transition:"transform .45s ease", transform:hov?"scale(1.06)":"scale(1)" }}
        onError={e=>{
          e.currentTarget.style.display="none";
          const par = e.currentTarget.parentElement;
          const d = document.createElement("div");
          d.style.cssText=`position:absolute;inset:0;background:linear-gradient(135deg,${C.blue},${C.blueDk})`;
          par.insertBefore(d, par.firstChild);
        }}
      />

      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to top,rgba(8,15,32,.9) 0%,rgba(8,15,32,.25) 55%,transparent 100%)" }}/>

      <span style={{ position:"absolute", top:14, right:14, fontFamily:"'DM Sans',sans-serif",
        fontWeight:700, fontSize:11, color:"rgba(255,255,255,.85)" }}>{project.year}</span>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"18px 18px 20px" }}>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff",
          fontSize:17, lineHeight:1.3, margin:0, textShadow:"0 2px 12px rgba(0,0,0,.5)" }}>
          {project.title}
        </h3>
        <span style={{ display:"inline-block", marginTop:8, fontFamily:"'DM Sans',sans-serif",
          fontWeight:600, fontSize:12.5, color:C.blueMd,
          opacity:hov?1:0, transform:hov?"translateY(0)":"translateY(6px)",
          transition:"all .25s ease" }}>
          Lihat detail →
        </span>
      </div>
    </div>
  );
};

const Projects = () => {
  const [modalProject, setModalProject] = useState(null);

  return (
    <section id="projects" style={{ background:C.white, padding:"92px 0" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        <FadeIn><SLabel c="Pengalaman Proyek"/><STitle c="Proyek"/><Divider/></FadeIn>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {projects.map((p,i)=>(
            <FadeIn key={i} delay={i*0.15}>
              <ProjectCard project={p} onClick={()=>setModalProject(p)}/>
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

/* ══ ORGANISATION ═════════════════════════════════════ */
const Organization = () => (
  <section id="org" style={{ background:C.bg, padding:"92px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Kontribusi"/><STitle c="Pengalaman Organisasi"/><Divider/></FadeIn>
      <FadeIn delay={0.1}>
        <Card style={{ borderLeft:`3px solid ${C.blue}`, maxWidth:720 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:C.txt, fontSize:16, lineHeight:1.3 }}>
            Staff Ahli Departemen Pusat Komunikasi dan Informatika
          </h3>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:C.blue, fontWeight:700, fontSize:14, marginTop:6 }}>
            Himpunan Mahasiswa Teknologi Informasi — Universitas Brawijaya
          </p>
          <span style={{ fontFamily:"'DM Sans',sans-serif", color:"#9ca3af", fontSize:12 }}>2024 – 2025</span>
          <p style={{ fontFamily:"'DM Sans',sans-serif", color:"#4b5563", fontSize:15,
            marginTop:14, lineHeight:1.7 }}>
            Mengelola publikasi visual, media sosial, dan branding digital organisasi untuk meningkatkan engagement audiens serta menyebarkan informasi seputar program studi teknologi informasi.
          </p>
        </Card>
      </FadeIn>
    </div>
  </section>
);

/* ══ TOOLS ════════════════════════════════════════════ */
const tools = [
  { name:"VS Code",     img:"/icon/vsc.jpg" },
  { name:"Arduino IDE", img:"/icon/arduinoide.jpg" },
  { name:"Python",      img:"/icon/python.jpg" },
  { name:"Flask",       img:"/icon/flask.jpg" },
  { name:"Laravel",     img:"/icon/laravel.jpg" },
  { name:"MySQL",       img:"/icon/mysql.jpg" },
  { name:"GitHub",      img:"/icon/github.jpg" },
  { name:"Figma",       img:"/icon/figma.jpg" },
  { name:"Canva",       img:"/icon/canva.jpg" },
  { name:"Capcut",      img:"/icon/capcut.jpg" },
];

const Tools = () => (
  <section id="tools" style={{ background:C.white, padding:"92px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
      <FadeIn><SLabel c="Alat Kerja"/><STitle c="Tools & Software"/><Divider/></FadeIn>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:16 }}>
        {tools.map((t,i)=>(
          <FadeIn key={i} delay={i*0.05}>
            <Card style={{ textAlign:"center", padding:"24px 16px" }}>
              <div style={{ width:52, height:52, borderRadius:14, background:C.blueLt,
                border:`1px solid ${C.border}`, display:"flex", alignItems:"center",
                justifyContent:"center", margin:"0 auto 12px", overflow:"hidden" }}>
                <img src={t.img} alt={t.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={e=>{
                    const wrap = e.currentTarget.parentElement;
                    e.currentTarget.remove();
                    wrap.innerHTML = `<span style="font-family:'Syne',sans-serif;font-weight:800;color:${C.blue};font-size:15px">${t.name.slice(0,2).toUpperCase()}</span>`;
                  }}
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
  <footer style={{ background:C.blueDk, color:"#fff", padding:"44px 0" }}>
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px",
      display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:20 }}>
      <div>
        <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20 }}>
          DNS<span style={{ color:C.blueMd }}>.</span>
        </p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,.6)", fontSize:14, marginTop:4 }}>
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
            style={{ padding:"8px 18px", borderRadius:999, border:"1.5px solid rgba(255,255,255,.2)",
              color:"rgba(255,255,255,.8)", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13,
              textDecoration:"none", transition:"all .2s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blueMd;e.currentTarget.style.color=C.blueMd;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.2)";e.currentTarget.style.color="rgba(255,255,255,.8)";}}>
            {l.label}
          </a>
        ))}
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", color:"rgba(255,255,255,.4)", fontSize:13 }}>
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
      <Organization/>
      <Tools/>
      <Footer/>
    </>
  );
}