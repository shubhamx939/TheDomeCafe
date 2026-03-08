import { useState, useEffect, useRef, useCallback } from "react";

const PALETTE = {
  bg: "#0A0A0F",
  bgAlt: "#0F0F18",
  primary: "#FF3CAC",
  gold: "#F7B731",
  cyan: "#00D4FF",
  violet: "#7B2FBE",
  dark1: "#1A1A2E",
  dark2: "#16213E",
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0A0A0F;
    --bg-alt: #0F0F18;
    --primary: #FF3CAC;
    --gold: #F7B731;
    --cyan: #00D4FF;
    --violet: #7B2FBE;
    --dark1: #1A1A2E;
    --dark2: #16213E;
    --white: #F0EAF8;
    --muted: rgba(240,234,248,0.45);
  }
  html { scroll-behavior: smooth; }
  body {
    background: var(--bg);
    color: var(--white);
    font-family: 'Lato', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }
  * { cursor: none !important; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--primary), var(--violet)); border-radius: 2px; }

  /* Custom Cursor */
  .cursor-dot {
    position: fixed; top: 0; left: 0; width: 10px; height: 10px;
    background: var(--primary); border-radius: 50%; pointer-events: none;
    z-index: 9999; transform: translate(-50%, -50%);
    transition: transform 0.1s; mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; width: 36px; height: 36px;
    border: 1.5px solid var(--cyan); border-radius: 50%; pointer-events: none;
    z-index: 9998; transform: translate(-50%, -50%);
    transition: all 0.12s ease; mix-blend-mode: difference;
  }

  /* Navbar */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 48px;
    transition: all 0.35s ease;
  }
  .navbar.scrolled {
    backdrop-filter: blur(20px);
    background: rgba(10,10,15,0.85);
    border-bottom: 1px solid rgba(255,60,172,0.18);
    padding: 14px 48px;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900;
    background: linear-gradient(90deg, var(--primary), var(--gold), var(--cyan), var(--primary));
    background-size: 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmerLogo 4s linear infinite; letter-spacing: 0.5px;
  }
  @keyframes shimmerLogo { 0%{background-position:0%} 100%{background-position:300%} }
  .nav-tabs { display: flex; gap: 6px; }
  .nav-tab {
    font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem; letter-spacing: 2px;
    padding: 8px 20px; border-radius: 4px; border: 1px solid transparent;
    color: var(--muted); background: none; transition: all 0.25s;
    position: relative; overflow: hidden;
  }
  .nav-tab:hover { color: var(--white); border-color: rgba(255,60,172,0.4); }
  .nav-tab.active {
    color: var(--white);
    background: linear-gradient(135deg, rgba(255,60,172,0.2), rgba(123,47,190,0.2));
    border-color: var(--primary);
  }
  .nav-phone {
    font-family: 'Bebas Neue'; font-size: 1rem; letter-spacing: 2px;
    color: var(--gold); text-decoration: none;
    border: 1px solid rgba(247,183,49,0.35); padding: 8px 18px; border-radius: 4px;
    transition: all 0.25s;
  }
  .nav-phone:hover { background: rgba(247,183,49,0.12); }

  /* Mobile Nav */
  .mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(10,10,15,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,60,172,0.2);
    flex-direction: row;
  }
  .mobile-tab {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    gap: 3px; padding: 10px 4px; font-family: 'Bebas Neue'; font-size: 0.65rem;
    letter-spacing: 1.5px; color: var(--muted); border: none; background: none;
    transition: all 0.2s;
  }
  .mobile-tab.active { color: var(--primary); }
  .mobile-tab .tab-icon { font-size: 1.2rem; }

  /* Page Transitions */
  .page-content { animation: pageIn 0.4s ease forwards; }
  .page-content.out { animation: pageOut 0.2s ease forwards; }
  @keyframes pageIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
  @keyframes pageOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.02)} }

  /* Particle Canvas */
  .particle-canvas { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

  /* Hero */
  .hero {
    position: relative; min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; overflow: hidden;
    padding: 120px 48px 80px;
  }
  .orb {
    position: absolute; border-radius: 50%; filter: blur(80px); animation: orbDrift 12s ease-in-out infinite;
    pointer-events: none;
  }
  .orb1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,60,172,0.3) 0%, transparent 70%); top: -10%; left: -10%; animation-delay: 0s; }
  .orb2 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(123,47,190,0.25) 0%, transparent 70%); top: 20%; right: -15%; animation-delay: -4s; }
  .orb3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%); bottom: 0; left: 30%; animation-delay: -8s; }
  @keyframes orbDrift {
    0%,100%{transform:translate(0,0) scale(1)}
    33%{transform:translate(40px,-30px) scale(1.08)}
    66%{transform:translate(-30px,40px) scale(0.94)}
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    border: 1px solid rgba(0,212,255,0.3); padding: 6px 16px; border-radius: 100px;
    font-family: 'Lato'; font-size: 0.78rem; letter-spacing: 2px; color: var(--cyan);
    margin-bottom: 24px; animation: fadeSlideIn 0.8s 0.2s both;
    background: rgba(0,212,255,0.06);
  }
  .badge-dot { width: 6px; height: 6px; background: #00ff88; border-radius: 50%; animation: pulseDot 2s infinite; }
  @keyframes pulseDot { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,255,136,0.5)} 50%{opacity:0.7;box-shadow:0 0 0 6px rgba(0,255,136,0)} }
  .hero-title {
    font-family: 'Playfair Display', serif; font-size: clamp(3.5rem, 8vw, 8rem); font-weight: 900;
    line-height: 1; text-align: center; animation: fadeSlideIn 0.8s 0.35s both;
    position: relative; z-index: 1;
  }
  .shimmer-word {
    background: linear-gradient(90deg, var(--primary), var(--gold), var(--cyan), var(--primary));
    background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmerText 3s linear infinite;
  }
  @keyframes shimmerText { 0%{background-position:0%} 100%{background-position:200%} }
  .hero-tagline {
    font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(1rem, 2vw, 1.35rem);
    color: var(--muted); text-align: center; margin-top: 16px;
    animation: fadeSlideIn 0.8s 0.5s both; position: relative; z-index: 1;
  }
  .hero-ctas { display: flex; gap: 16px; margin-top: 40px; animation: fadeSlideIn 0.8s 0.65s both; position: relative; z-index: 1; }
  .hero-stats {
    display: flex; gap: 48px; margin-top: 64px; position: relative; z-index: 1;
    animation: fadeSlideIn 0.8s 0.8s both;
  }
  .stat-item { text-align: center; }
  .stat-num { font-family: 'Bebas Neue'; font-size: 3rem; line-height: 1; color: var(--gold); }
  .stat-label { font-size: 0.7rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-top: 4px; }

  /* Floating Icons */
  .float-icon {
    position: absolute; font-size: 2.5rem; pointer-events: none; z-index: 0;
    animation: floatSin 6s ease-in-out infinite;
  }
  @keyframes floatSin {
    0%,100%{transform:translateY(0) rotate(0deg)}
    25%{transform:translateY(-20px) rotate(5deg)}
    75%{transform:translateY(12px) rotate(-4deg)}
  }

  /* Ribbon */
  .ribbon-wrap { overflow: hidden; padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .ribbon-track { display: flex; gap: 0; white-space: nowrap; animation: ribbonScroll 22s linear infinite; }
  .ribbon-track.rev { animation: ribbonScrollRev 25s linear infinite; }
  @keyframes ribbonScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes ribbonScrollRev { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
  .ribbon-item {
    font-family: 'Bebas Neue'; font-size: 1.1rem; letter-spacing: 3px;
    padding: 0 32px; color: var(--muted);
  }
  .ribbon-item.accent { color: var(--primary); }
  .ribbon-item.gold { color: var(--gold); }
  .ribbon-item.cyan { color: var(--cyan); }

  /* Section */
  .section { padding: 96px 48px; max-width: 1400px; margin: 0 auto; }
  .section-label { font-family: 'Bebas Neue'; font-size: 0.85rem; letter-spacing: 4px; color: var(--primary); margin-bottom: 8px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; line-height: 1.15; margin-bottom: 48px; }
  .section-title .accent { color: var(--gold); }

  /* Cards */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
  .cards-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }

  .tilt-card {
    border-radius: 16px; padding: 28px; position: relative; overflow: hidden;
    transform-style: preserve-3d; transition: transform 0.1s ease, box-shadow 0.1s ease;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .tilt-card::before { content: ''; position: absolute; inset: 0; border-radius: 16px; background: inherit; z-index: -1; }

  .card-badge {
    display: inline-block; font-family: 'Bebas Neue'; font-size: 0.7rem;
    letter-spacing: 2px; padding: 3px 10px; border-radius: 100px; margin-bottom: 12px;
  }
  .card-emoji { font-size: 2.2rem; margin-bottom: 12px; display: block; }
  .card-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; }
  .card-cat { font-size: 0.75rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 10px; }
  .card-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.6; margin-bottom: 16px; }
  .card-price { font-family: 'Bebas Neue'; font-size: 1.5rem; color: var(--gold); }
  .card-img { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-bottom: 14px; }

  /* Magnetic Button */
  .mag-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Bebas Neue'; letter-spacing: 2.5px; font-size: 1rem;
    padding: 14px 32px; border-radius: 6px; border: none;
    transition: box-shadow 0.2s, background 0.2s;
    position: relative; overflow: hidden;
  }
  .mag-btn::after {
    content: ''; position: absolute; inset: 0; opacity: 0;
    background: rgba(255,255,255,0.12); transition: opacity 0.2s;
  }
  .mag-btn:hover::after { opacity: 1; }
  .mag-btn.primary {
    background: linear-gradient(135deg, var(--primary), var(--violet));
    color: #fff; box-shadow: 0 0 30px rgba(255,60,172,0.35);
  }
  .mag-btn.primary:hover { box-shadow: 0 0 50px rgba(255,60,172,0.55); }
  .mag-btn.secondary {
    background: transparent; color: var(--cyan);
    border: 1.5px solid rgba(0,212,255,0.5);
  }
  .mag-btn.secondary:hover { border-color: var(--cyan); box-shadow: 0 0 25px rgba(0,212,255,0.25); }
  .mag-btn.gradient {
    background: linear-gradient(135deg, var(--gold), #ff8c00);
    color: #0A0A0F; font-weight: 700;
  }
  .mag-btn.small { padding: 9px 20px; font-size: 0.82rem; }

  /* Testimonials */
  .quote-mark { font-family: 'Playfair Display'; font-size: 4rem; color: var(--primary); opacity: 0.4; line-height: 0.8; margin-bottom: 8px; }
  .review-text { font-size: 0.95rem; line-height: 1.7; color: var(--muted); font-style: italic; margin-bottom: 16px; }
  .reviewer-name { font-family: 'Bebas Neue'; letter-spacing: 2px; font-size: 0.9rem; }
  .reviewer-stars { color: var(--gold); font-size: 0.9rem; }

  /* Process Steps */
  .process-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
  .process-step { padding: 36px 28px; border-right: 1px solid rgba(255,255,255,0.06); position: relative; }
  .process-step:last-child { border-right: none; }
  .step-num { font-family: 'Bebas Neue'; font-size: 5rem; color: rgba(255,255,255,0.04); position: absolute; top: 16px; right: 20px; line-height: 1; }
  .step-icon { font-size: 2rem; margin-bottom: 12px; }
  .step-title { font-family: 'Playfair Display'; font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; }
  .step-desc { font-size: 0.87rem; color: var(--muted); line-height: 1.65; }

  /* CTA Banner */
  .cta-banner {
    position: relative; overflow: hidden; padding: 80px 48px; text-align: center;
    background: linear-gradient(135deg, var(--dark1), var(--dark2));
  }
  .cta-banner::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .cta-headline { font-family: 'Playfair Display'; font-size: clamp(2rem,4vw,3rem); font-weight: 900; margin-bottom: 12px; position: relative; }
  .cta-sub { color: var(--muted); font-size: 0.95rem; margin-bottom: 32px; position: relative; }
  .cta-btns { display: flex; gap: 16px; justify-content: center; position: relative; }

  /* About */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
  .about-left { position: relative; min-height: 500px; border-radius: 20px; overflow: hidden; background: var(--dark1); }
  .est-bg { position: absolute; font-family: 'Bebas Neue'; font-size: 10rem; color: rgba(255,60,172,0.06); bottom: 20px; left: 50%; transform: translateX(-50%); white-space: nowrap; pointer-events: none; line-height: 1; }
  .est-badge { position: absolute; top: 24px; left: 24px; font-family: 'Bebas Neue'; font-size: 0.8rem; letter-spacing: 3px; color: var(--cyan); border: 1px solid rgba(0,212,255,0.35); padding: 6px 14px; border-radius: 4px; background: rgba(0,212,255,0.05); }
  .about-italic { font-family: 'Playfair Display'; font-style: italic; font-size: 1.3rem; color: var(--white); position: absolute; bottom: 100px; left: 28px; right: 28px; line-height: 1.5; }
  .about-stats { position: absolute; bottom: 28px; left: 28px; display: flex; gap: 28px; }
  .a-stat .num { font-family: 'Bebas Neue'; font-size: 2rem; color: var(--primary); }
  .a-stat .lbl { font-size: 0.68rem; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .glass-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; backdrop-filter: blur(10px); }
  .glass-card .gc-icon { font-size: 1.6rem; margin-bottom: 10px; }
  .glass-card .gc-title { font-family: 'Bebas Neue'; font-size: 1rem; letter-spacing: 2px; margin-bottom: 6px; }
  .glass-card .gc-text { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
  .glass-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
  .about-para { font-size: 0.95rem; color: var(--muted); line-height: 1.8; margin-bottom: 16px; }
  .values-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 64px; }
  .value-card { text-align: center; padding: 32px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
  .value-icon { font-size: 2.2rem; margin-bottom: 12px; }
  .value-title { font-family: 'Bebas Neue'; font-size: 1.05rem; letter-spacing: 2px; margin-bottom: 6px; }
  .value-text { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* Gallery Masonry */
  .masonry-grid { columns: 3; gap: 20px; }
  .masonry-item { break-inside: avoid; margin-bottom: 20px; border-radius: 14px; overflow: hidden; position: relative; }
  .gallery-card { padding: 28px; position: relative; }
  .gallery-bar { height: 3px; border-radius: 2px; margin-top: 14px; }
  .social-cta { text-align: center; padding: 64px 48px; }

  /* Contact */
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .contact-info { position: relative; border-radius: 20px; overflow: hidden; background: var(--dark1); padding: 0; min-height: 560px; }
  .contact-details { padding: 40px 36px; position: relative; z-index: 1; }
  .contact-row { display: flex; align-items: flex-start; gap: 16px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .contact-row:last-of-type { border-bottom: none; }
  .c-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .c-label { font-family: 'Bebas Neue'; font-size: 0.75rem; letter-spacing: 2px; color: var(--muted); margin-bottom: 3px; }
  .c-val { font-size: 0.9rem; line-height: 1.5; }
  .social-row { display: flex; gap: 12px; margin-top: 24px; }
  .soc-btn { font-family: 'Bebas Neue'; font-size: 0.8rem; letter-spacing: 2px; padding: 9px 18px; border-radius: 6px; border: 1.5px solid; text-decoration: none; transition: all 0.2s; }
  .contact-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px 36px; backdrop-filter: blur(12px); }
  .form-title { font-family: 'Playfair Display'; font-size: 1.6rem; font-weight: 700; margin-bottom: 28px; }
  .form-group { margin-bottom: 20px; }
  .form-label { font-family: 'Bebas Neue'; font-size: 0.75rem; letter-spacing: 2px; color: var(--muted); display: block; margin-bottom: 8px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 13px 16px; color: var(--white); font-family: 'Lato'; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--primary); }
  .form-select option { background: var(--dark1); }
  .form-textarea { resize: vertical; min-height: 100px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .success-state { text-align: center; padding: 40px; }
  .success-icon { font-size: 3rem; margin-bottom: 16px; }
  .success-title { font-family: 'Playfair Display'; font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; color: var(--primary); }
  .map-panel { padding: 64px 48px; text-align: center; background: var(--bgAlt); border-top: 1px solid rgba(255,255,255,0.04); }
  .map-address { font-family: 'Playfair Display'; font-style: italic; font-size: 1.2rem; color: var(--muted); margin-bottom: 24px; }

  /* Footer */
  footer {
    background: #070710; padding: 48px 48px 32px;
    border-top: none; position: relative;
  }
  footer::before {
    content: ''; display: block; height: 1px; position: absolute; top: 0; left: 0; right: 0;
    background: linear-gradient(90deg, transparent, var(--primary), var(--gold), var(--cyan), var(--violet), transparent);
  }
  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
  .footer-logo { font-family: 'Playfair Display'; font-size: 1.4rem; font-weight: 900; background: linear-gradient(90deg, var(--primary), var(--gold)); background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmerLogo 4s linear infinite; margin-bottom: 10px; }
  .footer-tagline { font-style: italic; font-size: 0.85rem; color: var(--muted); }
  .footer-heading { font-family: 'Bebas Neue'; letter-spacing: 3px; font-size: 0.85rem; color: var(--cyan); margin-bottom: 16px; }
  .footer-link { display: block; font-size: 0.85rem; color: var(--muted); text-decoration: none; margin-bottom: 10px; transition: color 0.2s; }
  .footer-link:hover { color: var(--primary); }
  .footer-copy { text-align: center; font-size: 0.78rem; color: rgba(240,234,248,0.25); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; }

  /* Animations */
  @keyframes fadeSlideIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  .anim-0 { animation: fadeSlideIn 0.7s 0.1s both; }
  .anim-1 { animation: fadeSlideIn 0.7s 0.22s both; }
  .anim-2 { animation: fadeSlideIn 0.7s 0.34s both; }
  .anim-3 { animation: fadeSlideIn 0.7s 0.46s both; }
  .anim-4 { animation: fadeSlideIn 0.7s 0.58s both; }
  .sl { animation: slideInLeft 0.7s 0.15s both; }
  .sr { animation: slideInRight 0.7s 0.3s both; }

  /* Divider Glow */
  .glow-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--primary), var(--gold), transparent); margin: 0; border: none; }

  @media (max-width: 1024px) {
    .about-grid { grid-template-columns: 1fr; }
    .process-strip { grid-template-columns: repeat(2, 1fr); }
    .masonry-grid { columns: 2; }
    .values-grid { grid-template-columns: repeat(2,1fr); }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .navbar { padding: 16px 20px; }
    .navbar .nav-tabs, .navbar .nav-phone { display: none; }
    .mobile-nav { display: flex; }
    .hero { padding: 100px 24px 100px; }
    .hero-stats { gap: 24px; flex-wrap: wrap; justify-content: center; }
    .section { padding: 64px 24px; }
    .process-strip { grid-template-columns: 1fr; }
    .masonry-grid { columns: 1; }
    .values-grid { grid-template-columns: 1fr 1fr; }
    .cta-btns { flex-direction: column; align-items: center; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .footer { padding: 40px 24px 80px; }
    .form-row { grid-template-columns: 1fr; }
    .hero-ctas { flex-direction: column; align-items: center; }
  }
`;

// ── ParticleCanvas ──────────────────────────────────────────
function ParticleCanvas({ colors = ["#FF3CAC", "#00D4FF", "#F7B731", "#7B2FBE"] }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = Math.floor((canvas.width * canvas.height) / 14000);
    const pts = Array.from({ length: Math.max(N, 20) }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        const op = 0.4 + 0.4 * Math.sin(t / 1000 + p.phase);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(op * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,60,172,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" style={{ width: "100%", height: "100%" }} />;
}

// ── MagBtn ──────────────────────────────────────────────────
function MagBtn({ children, variant = "primary", onClick, href, size = "", style: s = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const b = ref.current.getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const dx = (e.clientX - cx) * 0.22, dy = (e.clientY - cy) * 0.22;
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const onLeave = () => { ref.current.style.transform = "translate(0,0)"; };
  const cls = `mag-btn ${variant} ${size}`;
  if (href) return <a ref={ref} className={cls} href={href} target="_blank" rel="noreferrer" onMouseMove={onMove} onMouseLeave={onLeave} style={{ textDecoration: "none", ...s }}>{children}</a>;
  return <button ref={ref} className={cls} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} style={s}>{children}</button>;
}

// ── TiltCard ────────────────────────────────────────────────
function TiltCard({ children, className = "", style: s = {} }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const b = ref.current.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    ref.current.style.boxShadow = `${-x * 18}px ${y * 18}px 40px rgba(0,0,0,0.4)`;
  };
  const onLeave = () => { ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)"; ref.current.style.boxShadow = ""; };
  return <div ref={ref} className={`tilt-card ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} style={s}>{children}</div>;
}

// ── Counter ─────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const dur = 1600;
        const step = (t) => {
          const p = Math.min((t - start) / dur, 1);
          setVal(Math.floor(p * p * to));
          if (p < 1) requestAnimationFrame(step);
          else setVal(to);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── FloatingIcon ────────────────────────────────────────────
function FloatingIcon({ emoji, style: s }) {
  return <div className="float-icon" style={s}>{emoji}</div>;
}

// ── Ribbon ──────────────────────────────────────────────────
const RIBBON_ITEMS = [
  { text: "PIZZA", cls: "accent" }, { text: "·", cls: "" },
  { text: "SIZZLERS", cls: "gold" }, { text: "·", cls: "" },
  { text: "PASTA", cls: "cyan" }, { text: "·", cls: "" },
  { text: "DOME DINING", cls: "accent" }, { text: "·", cls: "" },
  { text: "CELEBRATIONS", cls: "gold" }, { text: "·", cls: "" },
  { text: "MOCKTAILS", cls: "cyan" }, { text: "·", cls: "" },
  { text: "DATE NIGHTS", cls: "accent" }, { text: "·", cls: "" },
  { text: "BIRTHDAY MAGIC", cls: "gold" }, { text: "·", cls: "" },
  { text: "LOLLIPOP CHICKEN", cls: "cyan" }, { text: "·", cls: "" },
  { text: "COLD BREWS", cls: "" }, { text: "·", cls: "" },
];
function Ribbon({ reverse = false }) {
  const doubled = [...RIBBON_ITEMS, ...RIBBON_ITEMS];
  return (
    <div className="ribbon-wrap">
      <div className={`ribbon-track ${reverse ? "rev" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className={`ribbon-item ${item.cls}`}>{item.text}</span>
        ))}
      </div>
    </div>
  );
}

// ── HOME TAB ────────────────────────────────────────────────
function HomeTab({ goTo }) {
  const FEATURED = [
    { emoji: "🍗", badge: "BESTSELLER", badgeColor: "#FF3CAC", name: "Chicken Lollipop", cat: "Starters · Non-Veg", desc: "Desi-style drumsticks with fiery marinade, crispy on the outside, juicy within — the dish everyone orders first.", price: "₹280", bg: "linear-gradient(135deg,#1a0a1e,#2d0a2a)" },
    { emoji: "🍕", badge: "POPULAR", badgeColor: "#F7B731", name: "Chicken Tikka Pizza", cat: "Pizza · Non-Veg", desc: "Handcrafted crust layered with tandoori-marinated chicken tikka, bell peppers, and melted mozzarella perfection.", price: "₹380", bg: "linear-gradient(135deg,#0a1a15,#0f2a1a)" },
    { emoji: "🌿", badge: "CHEF'S PICK", badgeColor: "#00D4FF", name: "Hara Bhara Tikka Sizzler", cat: "Sizzlers · Veg", desc: "A veggie-forward sizzler plate with herb-packed tikka medallions, steaming on a cast iron plate with signature sauces.", price: "₹360", bg: "linear-gradient(135deg,#0a0f1e,#0a1530)" },
  ];
  const REVIEWS = [
    { text: "The staff arranged everything so beautifully for my birthday — from the balloon decor to the table. My wife planned it and the team made it unforgettable.", name: "Abhishek C.", city: "Bengaluru", stars: 5, color: "#FF3CAC", bg: "linear-gradient(135deg,#1a0a18,#250a22)" },
    { text: "Loved the quality of service, the ambience is top-tier, and the food was genuinely good. Dragon Baby Corn especially — couldn't stop eating.", name: "Priya M.", city: "Kalyan Nagar", stars: 5, color: "#F7B731", bg: "linear-gradient(135deg,#1a1300,#221b00)" },
    { text: "Perfect spot for a date night. The dome booth felt private and special. Pasta was really well made and the mocktails were refreshing.", name: "Rohit S.", city: "Bengaluru", stars: 4, color: "#00D4FF", bg: "linear-gradient(135deg,#00111a,#001825)" },
  ];
  const STEPS = [
    { icon: "📅", num: "01", title: "Reserve Your Dome", desc: "Book a private dome booth for birthdays, anniversaries, date nights, or surprise celebrations online." },
    { icon: "🎈", num: "02", title: "We Decorate", desc: "Our team sets up balloons, rose petals, mood lighting, and personalized cake arrangements for you." },
    { icon: "🍽️", num: "03", title: "Dine in Style", desc: "Explore our multicuisine menu — from sizzling starters to wood-fired pizzas and indulgent desserts." },
    { icon: "✨", num: "04", title: "Cherish the Memory", desc: "Leave with beautiful moments and a meal worth remembering. We'll be ready for your next celebration too." },
  ];
  return (
    <div className="page-content">
      {/* Hero */}
      <section className="hero">
        <ParticleCanvas />
        <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
        <FloatingIcon emoji="🍕" style={{ top: "18%", left: "8%", animationDelay: "0s", opacity: 0.6 }} />
        <FloatingIcon emoji="🥂" style={{ top: "25%", right: "9%", animationDelay: "1.5s", opacity: 0.55 }} />
        <FloatingIcon emoji="🎂" style={{ bottom: "22%", left: "12%", animationDelay: "3s", opacity: 0.5 }} />
        <FloatingIcon emoji="☕" style={{ bottom: "28%", right: "8%", animationDelay: "0.8s", opacity: 0.5 }} />
        <div className="hero-badge"><div className="badge-dot" /> OPEN DAILY · KALYAN NAGAR, BENGALURU</div>
        <h1 className="hero-title">
          THE <span className="shimmer-word">DOME</span><br />CAFE
        </h1>
        <p className="hero-tagline">Where Every Meal Becomes a Celebration</p>
        <div className="hero-ctas">
          <MagBtn variant="primary" onClick={() => goTo(1)}>✦ Explore Menu</MagBtn>
          <MagBtn variant="secondary" href="https://maps.google.com/?q=The+Dome+Cafe+Kalyan+Nagar+Bangalore">📍 Visit Us</MagBtn>
        </div>
        <div className="hero-stats">
          {[
            { to: 430, suf: "+", label: "Google Reviews" },
            { to: 43, suf: "%", label: "Google Rating ×10" },
            { to: 2000, suf: "+", label: "Happy Diners" },
            { to: 30, suf: "+", label: "Menu Items" },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num"><Counter to={s.to} suffix={s.suf} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Ribbon />

      {/* Featured */}
      <div className="section">
        <div className="section-label">CHEF'S SELECTION</div>
        <h2 className="section-title">Featured <span className="accent">Dishes</span></h2>
        <div className="cards-grid">
          {FEATURED.map((item, i) => (
            <TiltCard key={i} style={{ background: item.bg }}>
              <span className="card-emoji">{item.emoji}</span>
              <div className="card-badge" style={{ background: item.badgeColor + "22", color: item.badgeColor, border: `1px solid ${item.badgeColor}44` }}>{item.badge}</div>
              <div className="card-title">{item.name}</div>
              <div className="card-cat">{item.cat}</div>
              <div className="card-desc">{item.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-price">{item.price}</div>
                <MagBtn variant="secondary" size="small" onClick={() => goTo(1)}>Order →</MagBtn>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      <hr className="glow-divider" />

      {/* Testimonials */}
      <div className="section">
        <div className="section-label">WHAT GUESTS SAY</div>
        <h2 className="section-title">Real <span className="accent">Reviews</span></h2>
        <div className="cards-grid">
          {REVIEWS.map((r, i) => (
            <TiltCard key={i} style={{ background: r.bg, borderColor: r.color + "30" }}>
              <div className="quote-mark" style={{ color: r.color }}>"</div>
              <p className="review-text">{r.text}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="reviewer-name" style={{ color: r.color }}>{r.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{r.city}</div>
                </div>
                <div className="reviewer-stars">{"★".repeat(r.stars)}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Process */}
      <div style={{ background: "var(--bg-alt)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="section">
          <div className="section-label" style={{ textAlign: "center" }}>YOUR EXPERIENCE</div>
          <h2 className="section-title" style={{ textAlign: "center" }}>How We <span className="accent">Celebrate You</span></h2>
          <div className="process-strip">
            {STEPS.map((s, i) => (
              <div className="process-step anim-0" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="cta-banner">
        <h2 className="cta-headline">Your <span className="shimmer-word">Special Moment</span> Awaits</h2>
        <p className="cta-sub">4C-404, 4th & 5th Floor, HRBR Layout 2nd Block, Opp. Max Fashion, Kalyan Nagar · <a href="tel:+919606459934" style={{ color: "var(--gold)", textDecoration: "none" }}>+91 96064 59934</a></p>
        <div className="cta-btns">
          <MagBtn variant="gradient" onClick={() => goTo(4)}>🎉 Reserve a Dome</MagBtn>
          <MagBtn variant="secondary" onClick={() => goTo(1)}>View Full Menu</MagBtn>
        </div>
      </div>
    </div>
  );
}

// ── MENU TAB ─────────────────────────────────────────────────
function MenuTab({ goTo }) {
  const ITEMS = [
    { emoji: "🍗", badge: "BESTSELLER", bc: "#FF3CAC", name: "Chicken Lollipop", cat: "Starters · Non-Veg", desc: "Crispy desi-style drumsticks with house spice blend. Must-order.", price: "₹280", bg: "linear-gradient(135deg,#1a0a1e,#2d0a2a)" },
    { emoji: "🌽", badge: "POPULAR", bc: "#F7B731", name: "Dragon Baby Corn", cat: "Starters · Veg", desc: "Fiery tossed baby corn with Indo-Chinese dragon sauce.", price: "₹240", bg: "linear-gradient(135deg,#1a1200,#2a1e00)" },
    { emoji: "🧀", badge: "VEG", bc: "#00D4FF", name: "Paneer Tikka", cat: "Starters · Veg", desc: "Chargrilled cottage cheese with yogurt marinade and chaat masala.", price: "₹260", bg: "linear-gradient(135deg,#001a1a,#002a2a)" },
    { emoji: "🍕", badge: "BESTSELLER", bc: "#FF3CAC", name: "Chicken Tikka Pizza", cat: "Pizza · Non-Veg", desc: "Tandoori chicken with bell peppers on crispy handmade crust.", price: "₹380", bg: "linear-gradient(135deg,#0a1a15,#0f2a1a)" },
    { emoji: "🍕", badge: "VEG", bc: "#7B2FBE", name: "Margherita Pizza", cat: "Pizza · Veg", desc: "Classic tomato base, fresh mozzarella, basil — done right.", price: "₹280", bg: "linear-gradient(135deg,#100a1e,#1a0a2e)" },
    { emoji: "🍕", badge: "VEG", bc: "#F7B731", name: "Paneer Tikka Pizza", cat: "Pizza · Veg", desc: "Smoky paneer tikka topping on a golden-baked thin crust.", price: "₹340", bg: "linear-gradient(135deg,#1a1200,#221600)" },
    { emoji: "🍕", badge: "LOADED", bc: "#00D4FF", name: "Farmhouse Pizza Indulgence", cat: "Pizza · Veg", desc: "Triple veggie topping overload — mushroom, corn, capsicum, olives.", price: "₹360", bg: "linear-gradient(135deg,#001525,#001a30)" },
    { emoji: "🍝", badge: "CREAMY", bc: "#FF3CAC", name: "Alfredo Chicken", cat: "Pasta · Non-Veg", desc: "Penne in rich cream-butter Alfredo sauce with grilled chicken strips.", price: "₹320", bg: "linear-gradient(135deg,#1a0810,#250a18)" },
    { emoji: "🍝", badge: "VEG", bc: "#7B2FBE", name: "Alfredo Veg", cat: "Pasta · Veg", desc: "Cream-laden Alfredo with seasonal vegetables and herbs.", price: "₹280", bg: "linear-gradient(135deg,#0f0a1e,#160a2a)" },
    { emoji: "🍝", badge: "SPICY", bc: "#F7B731", name: "Arrabiata Spice Chicken", cat: "Pasta · Non-Veg", desc: "Fiery tomato-chilli sauce with penne and tender chicken bites.", price: "₹310", bg: "linear-gradient(135deg,#1a0f00,#251500)" },
    { emoji: "🥩", badge: "SIZZLER", bc: "#00D4FF", name: "Hara Bhara Tikka Sizzler", cat: "Sizzlers · Veg", desc: "Herb tikka medallions on cast iron with garlic butter sauce.", price: "₹360", bg: "linear-gradient(135deg,#00111a,#001825)" },
    { emoji: "🥩", badge: "SIZZLER", bc: "#FF3CAC", name: "Cottage Cheese Medallion Sizzler", cat: "Sizzlers · Veg", desc: "Paneer medallions on a sizzling iron plate with mashed sides.", price: "₹380", bg: "linear-gradient(135deg,#1a0a18,#220a22)" },
    { emoji: "🧋", badge: "REFRESHING", bc: "#00D4FF", name: "Cold Brews & Shakes", cat: "Beverages", desc: "Artisan cold brews, thick milkshakes, fruity coolers, ice teas.", price: "₹150+", bg: "linear-gradient(135deg,#001525,#001525)" },
    { emoji: "🍹", badge: "NO-ALCOHOL", bc: "#7B2FBE", name: "Mocktails", cat: "Beverages", desc: "Signature mocktail blends — vibrant, fresh, and beautifully presented.", price: "₹160+", bg: "linear-gradient(135deg,#100a20,#180a28)" },
    { emoji: "🎂", badge: "PACKAGE", bc: "#F7B731", name: "Private Dome Celebration", cat: "Celebration Package", desc: "Balloon decor, rose petals, cake, mocktails — fully arranged for your special occasion.", price: "₹4000+", bg: "linear-gradient(135deg,#1a1200,#221800)" },
  ];
  return (
    <div className="page-content">
      <section className="hero" style={{ minHeight: "45vh" }}>
        <ParticleCanvas />
        <div className="orb orb1" /><div className="orb orb2" />
        <div className="hero-badge anim-0"><div className="badge-dot" />VEG & NON-VEG · MULTICUISINE</div>
        <h1 className="hero-title anim-1" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>OUR <span className="shimmer-word">MENU</span></h1>
        <p className="hero-tagline anim-2">Crafted with the finest ingredients, served with love</p>
      </section>
      <Ribbon reverse />
      <div className="section">
        <div className="section-label">ALL OFFERINGS</div>
        <h2 className="section-title">Every Dish, <span className="accent">Every Craving</span></h2>
        <div className="cards-grid-2">
          {ITEMS.map((item, i) => (
            <TiltCard key={i} className={`anim-${Math.min(i % 5, 4)}`} style={{ background: item.bg }}>
              <span className="card-emoji">{item.emoji}</span>
              <div className="card-badge" style={{ background: item.bc + "22", color: item.bc, border: `1px solid ${item.bc}44` }}>{item.badge}</div>
              <div className="card-title">{item.name}</div>
              <div className="card-cat">{item.cat}</div>
              <div className="card-desc">{item.desc}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="card-price">{item.price}</div>
                <MagBtn variant="secondary" size="small" onClick={() => goTo(4)}>Reserve →</MagBtn>
              </div>
            </TiltCard>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ color: "var(--muted)", marginBottom: "20px", fontSize: "0.9rem" }}>Looking to book a dome for your special occasion?</p>
          <MagBtn variant="gradient" onClick={() => goTo(4)}>🎉 Reserve a Private Dome</MagBtn>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT TAB ────────────────────────────────────────────────
function AboutTab() {
  const VALS = [
    { icon: "🔥", title: "Bold Flavours", text: "Each dish is crafted to pack a punch — from spicy starters to comforting classics." },
    { icon: "🎭", title: "Unique Ambience", text: "Private dome booths create intimate spaces you won't find anywhere else in North Bangalore." },
    { icon: "🌿", title: "Fresh Ingredients", text: "Handpicked, quality ingredients every single day — no shortcuts in our kitchen." },
    { icon: "💫", title: "Memory Making", text: "We don't just serve meals. We craft experiences that guests talk about for years." },
  ];
  return (
    <div className="page-content">
      <section className="hero" style={{ minHeight: "45vh" }}>
        <ParticleCanvas />
        <div className="orb orb2" /><div className="orb orb3" />
        <div className="hero-badge anim-0"><div className="badge-dot" />THE DOME CAFE — OUR STORY</div>
        <h1 className="hero-title anim-1" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>OUR <span className="shimmer-word">STORY</span></h1>
        <p className="hero-tagline anim-2">A dome. A dream. A dining revolution in Kalyan Nagar.</p>
      </section>
      <Ribbon />
      <div className="section">
        <div className="about-grid">
          <div className="about-left sl">
            <ParticleCanvas />
            <div className="est-bg">DOME</div>
            <div className="est-badge">EST. KALYAN NAGAR</div>
            <p className="about-italic">"Where the dome becomes your world and every bite becomes a memory."</p>
            <div className="about-stats">
              <div className="a-stat"><div className="num">4.3★</div><div className="lbl">Google Rating</div></div>
              <div className="a-stat"><div className="num">2000+</div><div className="lbl">Diners Served</div></div>
              <div className="a-stat"><div className="num">15+</div><div className="lbl">Menu Categories</div></div>
            </div>
          </div>
          <div className="sr">
            <div className="section-label">WHO WE ARE</div>
            <h2 className="section-title">Bengaluru's Most <span className="accent">Intimate Dining</span> Experience</h2>
            <p className="about-para">The Dome Cafe was born from a simple vision: to give people in North Bangalore a place where dining feels like an event. Perched on the 4th and 5th floors of HRBR Layout 2nd Block, our cafe is defined by its signature dome-shaped private booths — cozy, intimate spaces that transform ordinary evenings into extraordinary memories.</p>
            <p className="about-para">From handcrafted pizzas to sizzling tikka plates, from fiery dragon starters to creamy Alfredo pastas — our multicuisine menu spans Indian, Italian, and Chinese cuisines, designed so every guest finds something they love. Whether you're here for a birthday bash, a romantic date night, or a quick catch-up over cold brews, The Dome Cafe wraps it all in warmth.</p>
            <div className="glass-grid">
              {[
                { icon: "🏛️", title: "Private Dome Booths", text: "Exclusive enclosed dining spaces for intimate celebrations" },
                { icon: "🍴", title: "Multicuisine Menu", text: "North Indian, Italian, Chinese, BBQ, and Continental" },
                { icon: "🎉", title: "Full Event Setup", text: "Balloons, decor, cake, rose petals — all arranged for you" },
                { icon: "⭐", title: "4.3 Stars on Google", text: "Trusted by over 400+ guests for celebrations that matter" },
              ].map((c, i) => (
                <div className="glass-card" key={i}>
                  <div className="gc-icon">{c.icon}</div>
                  <div className="gc-title">{c.title}</div>
                  <div className="gc-text">{c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="values-grid">
          {VALS.map((v, i) => (
            <div className="value-card anim-0" key={i}>
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-text">{v.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GALLERY TAB ──────────────────────────────────────────────
function GalleryTab() {
  const ITEMS = [
    { emoji: "🍕", name: "Handcrafted Pizzas", cat: "Wood-Fired", bg: "linear-gradient(135deg,#1a0a1e,#2d0820)", bar: "#FF3CAC", size: "tall" },
    { emoji: "🥂", name: "Private Dome Dining", cat: "Exclusive Experience", bg: "linear-gradient(135deg,#0a1520,#0a1e30)", bar: "#00D4FF", size: "normal" },
    { emoji: "🎂", name: "Birthday Setups", cat: "Celebration Packages", bg: "linear-gradient(135deg,#1a1200,#221a00)", bar: "#F7B731", size: "normal" },
    { emoji: "🍗", name: "Lollipop Chicken", cat: "Starters", bg: "linear-gradient(135deg,#1a0a10,#250a18)", bar: "#FF3CAC", size: "tall" },
    { emoji: "🌿", name: "Dragon Baby Corn", cat: "Indo-Chinese", bg: "linear-gradient(135deg,#001a10,#002a18)", bar: "#00D4FF", size: "normal" },
    { emoji: "🍝", name: "Creamy Pasta", cat: "Italian Selection", bg: "linear-gradient(135deg,#100a1e,#180a2a)", bar: "#7B2FBE", size: "normal" },
    { emoji: "🥩", name: "Cast Iron Sizzlers", cat: "Signature Plates", bg: "linear-gradient(135deg,#001518,#001f24)", bar: "#00D4FF", size: "tall" },
    { emoji: "🍹", name: "Signature Mocktails", cat: "Beverages", bg: "linear-gradient(135deg,#0f0020,#160028)", bar: "#7B2FBE", size: "normal" },
    { emoji: "💑", name: "Date Night Experience", cat: "Romance Package", bg: "linear-gradient(135deg,#1a0812,#22081a)", bar: "#FF3CAC", size: "normal" },
  ];
  return (
    <div className="page-content">
      <section className="hero" style={{ minHeight: "45vh" }}>
        <ParticleCanvas />
        <div className="orb orb1" /><div className="orb orb3" />
        <div className="hero-badge anim-0"><div className="badge-dot" />MOMENTS & MENU</div>
        <h1 className="hero-title anim-1" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>OUR <span className="shimmer-word">GALLERY</span></h1>
        <p className="hero-tagline anim-2">Every frame, a reason to visit</p>
      </section>
      <Ribbon reverse />
      <div className="section">
        <div className="section-label">VISUAL SHOWCASE</div>
        <h2 className="section-title">Food, Vibes & <span className="accent">Celebrations</span></h2>
        <div className="masonry-grid">
          {ITEMS.map((item, i) => (
            <TiltCard key={i} className={`masonry-item gallery-card anim-${Math.min(i % 5, 4)}`}
              style={{ background: item.bg, paddingBottom: item.size === "tall" ? "52px" : "28px" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>{item.emoji}</div>
              <div className="card-title">{item.name}</div>
              <div className="card-cat">{item.cat}</div>
              <div className="gallery-bar" style={{ background: `linear-gradient(90deg, ${item.bar}, transparent)` }} />
            </TiltCard>
          ))}
        </div>
        <div className="social-cta">
          <div className="section-label" style={{ marginBottom: "12px" }}>FOLLOW THE VIBE</div>
          <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginBottom: "24px" }}>Follow Us on <span className="shimmer-word">Instagram</span></h2>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <MagBtn variant="primary" href="https://www.instagram.com/thedomecafe_official/">📸 @thedomecafe_official</MagBtn>
            <MagBtn variant="secondary" href="https://www.facebook.com/thedomecafekalyannagar/">👍 Facebook Page</MagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT TAB ──────────────────────────────────────────────
function ContactTab() {
  const [form, setForm] = useState({ name: "", phone: "", interest: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => { if (form.name && form.phone) setSubmitted(true); };
  const OFFERINGS = ["Chicken Lollipop", "Dragon Baby Corn", "Paneer Tikka", "Chicken Tikka Pizza", "Margherita Pizza", "Paneer Tikka Pizza", "Farmhouse Pizza", "Alfredo Chicken", "Alfredo Veg", "Arrabiata Spice Chicken", "Hara Bhara Tikka Sizzler", "Cottage Cheese Medallion Sizzler", "Mocktails", "Cold Brews & Shakes", "Private Dome Celebration Package", "Birthday Package", "Anniversary Package", "Date Night Package"];
  return (
    <div className="page-content">
      <section className="hero" style={{ minHeight: "45vh" }}>
        <ParticleCanvas />
        <div className="orb orb2" /><div className="orb orb1" />
        <div className="hero-badge anim-0"><div className="badge-dot" />RESERVATIONS & ENQUIRIES</div>
        <h1 className="hero-title anim-1" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>RESERVE <span className="shimmer-word">YOUR DOME</span></h1>
        <p className="hero-tagline anim-2">Let's make your special occasion unforgettable</p>
      </section>
      <Ribbon />
      <div className="section">
        <div className="contact-grid">
          {/* Left Info */}
          <div className="contact-info">
            <ParticleCanvas />
            <div className="contact-details">
              <div style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>The <span style={{ color: "var(--primary)" }}>Dome</span> Cafe®</div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "2px", fontFamily: "Bebas Neue", marginBottom: "28px" }}>KALYAN NAGAR · BENGALURU</div>
              {[
                { icon: "📍", label: "ADDRESS", val: "4C-404, 4th & 5th Floor, HRBR Layout 2nd Block, Opp. Max Fashion, Kalyan Nagar, Bengaluru 560043", color: "#FF3CAC" },
                { icon: "📞", label: "PHONE", val: "+91 96064 59934", color: "#F7B731" },
                { icon: "⏰", label: "HOURS", val: "Monday – Sunday: 11:00 AM – 12:15 AM", color: "#00D4FF" },
                { icon: "✉️", label: "EMAIL", val: "thedomecafekalyannagar@gmail.com", color: "#7B2FBE" },
              ].map((r, i) => (
                <div className="contact-row" key={i}>
                  <div className="c-icon" style={{ background: r.color + "22", color: r.color }}>{r.icon}</div>
                  <div><div className="c-label">{r.label}</div><div className="c-val">{r.val}</div></div>
                </div>
              ))}
              <div className="social-row">
                <a className="soc-btn" href="https://www.instagram.com/thedomecafe_official/" target="_blank" rel="noreferrer" style={{ color: "#FF3CAC", borderColor: "#FF3CAC55" }}>INSTAGRAM</a>
                <a className="soc-btn" href="https://www.facebook.com/thedomecafekalyannagar/" target="_blank" rel="noreferrer" style={{ color: "#00D4FF", borderColor: "#00D4FF55" }}>FACEBOOK</a>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="contact-form">
            {submitted ? (
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <div className="success-title">Reservation Sent!</div>
                <p style={{ color: "var(--muted)", marginBottom: "20px" }}>We'll call you shortly to confirm your dome. For urgent bookings, call us directly:</p>
                <a href="tel:+919606459934" className="mag-btn primary" style={{ textDecoration: "none", display: "inline-flex" }}>📞 +91 96064 59934</a>
              </div>
            ) : (
              <>
                <div className="form-title">Book Your <span style={{ color: "var(--primary)" }}>Experience</span></div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">YOUR NAME</label>
                    <input className="form-input" placeholder="Full Name" value={form.name} onChange={set("name")} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PHONE NUMBER</label>
                    <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set("phone")} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">INTEREST / OCCASION</label>
                  <select className="form-select" value={form.interest} onChange={set("interest")}>
                    <option value="">Select an interest or occasion...</option>
                    {OFFERINGS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">MESSAGE</label>
                  <textarea className="form-textarea" placeholder="Tell us about your celebration or special request..." value={form.message} onChange={set("message")} />
                </div>
                <MagBtn variant="gradient" onClick={submit} style={{ width: "100%", justifyContent: "center" }}>✦ Send Reservation</MagBtn>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-panel">
        <div className="section-label" style={{ marginBottom: "10px" }}>FIND US</div>
        <p className="map-address">4C-404, 4th & 5th Floor, HRBR Layout 2nd Block, Opposite Max Fashion,<br />Kalyan Nagar, Kammanahalli, Bengaluru, Karnataka 560043</p>
        <MagBtn variant="primary" href="https://maps.google.com/?q=The+Dome+Cafe+HRBR+Layout+2nd+Block+Kalyan+Nagar+Bangalore+560043">🗺️ Open Google Maps</MagBtn>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────
const TABS = [
  { label: "Home", icon: "🏠" },
  { label: "Menu", icon: "🍽️" },
  { label: "Our Story", icon: "📖" },
  { label: "Gallery", icon: "🖼️" },
  { label: "Reserve", icon: "🎉" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [prevTab, setPrevTab] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  // Font load
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=Lato:wght@300;400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // Custom cursor
  useEffect(() => {
    const move = (e) => {
      if (cursorDot.current) { cursorDot.current.style.left = e.clientX + "px"; cursorDot.current.style.top = e.clientY + "px"; }
      if (cursorRing.current) { cursorRing.current.style.left = e.clientX + "px"; cursorRing.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Scroll-aware navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx === activeTab || transitioning) return;
    setTransitioning(true);
    setPrevTab(activeTab);
    setTimeout(() => {
      setActiveTab(idx);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }, [activeTab, transitioning]);

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <HomeTab goTo={goTo} />;
      case 1: return <MenuTab goTo={goTo} />;
      case 2: return <AboutTab />;
      case 3: return <GalleryTab />;
      case 4: return <ContactTab />;
      default: return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className="cursor-ring" />

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => goTo(0)} style={{ cursor: "none" }}>The Dome Cafe®</div>
        <div className="nav-tabs">
          {TABS.map((t, i) => (
            <button key={i} className={`nav-tab ${activeTab === i ? "active" : ""}`} onClick={() => goTo(i)}>{t.label}</button>
          ))}
        </div>
        <a className="nav-phone" href="tel:+919606459934">📞 96064 59934</a>
      </nav>

      {/* Page */}
      <main className={transitioning ? "page-content out" : ""} style={{ paddingBottom: "0" }}>
        {renderTab()}
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">The Dome Cafe®</div>
            <div className="footer-tagline">Where Every Meal Becomes a Celebration</div>
            <div style={{ marginTop: "16px", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7 }}>
              4C-404, 4th & 5th Floor, HRBR Layout 2nd Block,<br />
              Opp. Max Fashion, Kalyan Nagar, Bengaluru 560043<br />
              <a href="tel:+919606459934" style={{ color: "var(--gold)", textDecoration: "none" }}>+91 96064 59934</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">NAVIGATE</div>
            {TABS.map((t, i) => <a key={i} className="footer-link" onClick={() => goTo(i)} style={{ cursor: "none" }}>{t.icon} {t.label}</a>)}
          </div>
          <div>
            <div className="footer-heading">CONNECT</div>
            <a href="https://www.instagram.com/thedomecafe_official/" className="footer-link" target="_blank" rel="noreferrer">📸 @thedomecafe_official</a>
            <a href="https://www.facebook.com/thedomecafekalyannagar/" className="footer-link" target="_blank" rel="noreferrer">👍 Facebook Page</a>
            <a href="mailto:thedomecafekalyannagar@gmail.com" className="footer-link">✉️ Email Us</a>
            <a href="https://maps.google.com/?q=The+Dome+Cafe+Kalyan+Nagar+Bangalore" className="footer-link" target="_blank" rel="noreferrer">🗺️ Get Directions</a>
            <div style={{ marginTop: "16px", fontSize: "0.78rem", color: "var(--muted)" }}>
              Mon–Sun: 11:00 AM – 12:15 AM
            </div>
          </div>
        </div>
        <p className="footer-copy">© 2025 The Dome Cafe® · Kalyan Nagar, Bengaluru · Crafted with ♥</p>
      </footer>

      {/* Mobile Nav */}
      <nav className="mobile-nav">
        {TABS.map((t, i) => (
          <button key={i} className={`mobile-tab ${activeTab === i ? "active" : ""}`} onClick={() => goTo(i)}>
            <span className="tab-icon">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </>
  );
}