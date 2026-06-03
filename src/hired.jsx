/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase, signIn, signUp, signOut, getProfile, updateProfile,
  uploadAvatar, uploadBanner, getPosts, getPost, getUserPosts, createPost,
  updatePost, deletePost, renewPost, getSavedPostIds, savePost, unsavePost,
  getSavedPosts, getOrCreateConversation, getConversations, getMessages,
  sendMessage, markMessagesRead, subscribeToMessages, subscribeToConversations,
  getNotifications, markNotifRead, markAllNotifsRead, createNotification,
  subscribeToNotifications, submitProposal, getProposalsForUser, getSentProposals,
  updateProposalStatus, hasUnlocked, unlockPost, getUnlockedPostIds,
  getPortfolio, addPortfolioItem, deletePortfolioItem, resetPassword
} from "./supabase.js";

/* ─────────────────────────────────────────────────────────────────────────────
   HIRED  –  Global Work Marketplace  (Polished v2)
   Two sides: clients post work needed · freelancers post services offered
   Monetization: free 1 unlock/day · $3 for 5 credits · $10/mo unlimited
─────────────────────────────────────────────────────────────────────────────*/

const T = {
  bg:       "#F7F6F2",
  white:    "#FFFFFF",
  ink:      "#141210",
  ink2:     "#3B3834",
  ink3:     "#78756F",
  ink4:     "#B0ADA6",
  border:   "#E8E5DE",
  border2:  "#CECAC0",
  accent:   "#1A56DB",
  accentL:  "#EBF2FF",
  accentM:  "#BFCFFA",
  accentGrad:"linear-gradient(135deg,#1A56DB,#3B82F6)",
  green:    "#166534",
  greenBg:  "#DCFCE7",
  amber:    "#92400E",
  amberBg:  "#FEF3C7",
  rose:     "#9D174D",
  roseBg:   "#FCE7F3",
  slate:    "#1E3A5F",
  slateBg:  "#DBEAFE",
  purple:   "#5B21B6",
  purpleBg: "#EDE9FE",
  teal:     "#0F766E",
  tealBg:   "#CCFBF1",
  orange:   "#EA580C",
  orangeBg: "#FFEDD5",
  pink:     "#DB2777",
  pinkBg:   "#FCE7F3",
  r:        "10px",
  r2:       "16px",
  r3:       "22px",
};

/* ─── CSS ───────────────────────────────────────────────────────────────────*/
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:${T.bg};color:${T.ink};font-family:'Manrope',sans-serif;font-size:14px;line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;background:${T.bg};}
::-webkit-scrollbar-thumb{background:#CECAC0;border-radius:4px;}



@keyframes up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes toast-in{from{opacity:0;transform:translateX(32px) scale(.95)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes modal-in{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
.shimmer{background:linear-gradient(90deg,${T.border} 25%,${T.bg} 50%,${T.border} 75%);background-size:400% 100%;animation:shimmer 1.5s ease-in-out infinite;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes pulse-ring{0%{transform:scale(.9);opacity:.8}70%{transform:scale(2);opacity:0}100%{transform:scale(2);opacity:0}}
@keyframes slide-in-right{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
@keyframes count-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes card-in{from{opacity:0;transform:translateY(36px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes float{0%,100%{transform:translateY(0px)}50%{transform:translateY(-14px)}}
@keyframes orb-drift{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(22px,-14px) scale(1.08)}66%{transform:translate(-12px,10px) scale(.94)}}
@keyframes ticker-in{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes ticker-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-100%)}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(26,86,219,.0)}50%{box-shadow:0 0 24px 6px rgba(26,86,219,.22)}}
@keyframes card-hover-glow{from{box-shadow:0 18px 50px rgba(20,18,16,.11)}to{box-shadow:0 26px 68px rgba(26,86,219,.2)}}
@keyframes page-fade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fab-bounce{0%{transform:scale(0) rotate(-20deg)}70%{transform:scale(1.14) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
@keyframes shimmer-sweep{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes wordmark-shine{0%,100%{background-position:200% center}40%{background-position:-200% center}}
@keyframes ambient-glow{0%,100%{box-shadow:0 0 0 0 rgba(26,86,219,0),0 18px 50px rgba(20,18,16,.11)}50%{box-shadow:0 0 32px 8px rgba(26,86,219,.13),0 24px 60px rgba(26,86,219,.12)}}
@keyframes mesh-shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes live-dot-fast{0%,100%{transform:scale(.9);opacity:.9}50%{transform:scale(2.2);opacity:0}}
@keyframes activity-in{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes activity-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}
@keyframes swipe-out-right{from{transform:translateX(0);opacity:1;max-height:80px}to{transform:translateX(110%);opacity:0;max-height:0;padding-top:0;padding-bottom:0;border-width:0}}
@keyframes swipe-out-left{from{transform:translateX(0);opacity:1;max-height:80px}to{transform:translateX(-110%);opacity:0;max-height:0;padding-top:0;padding-bottom:0;border-width:0}}
.notif-swipe-right{animation:swipe-out-right .32s cubic-bezier(.4,0,.2,1) forwards!important;}
.notif-swipe-left{animation:swipe-out-left .32s cubic-bezier(.4,0,.2,1) forwards!important;}
@keyframes spring-press{0%{transform:scale(1)}40%{transform:scale(.94)}70%{transform:scale(1.04)}100%{transform:scale(1)}}
.page-fade{animation:page-fade .28s cubic-bezier(.22,1,.36,1) both}
.fab-anim{animation:fab-bounce .4s cubic-bezier(.22,1,.36,1) both}

/* ── GLASS header ── */
header{background:rgba(255,255,255,.72)!important;backdrop-filter:blur(28px) saturate(180%)!important;-webkit-backdrop-filter:blur(28px) saturate(180%)!important;}

/* ── Wordmark shimmer ── */
.wordmark-shine{background:linear-gradient(90deg,#1A56DB 0%,#1A56DB 30%,#60A5FA 50%,#1A56DB 70%,#1A56DB 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:wordmark-shine 4s ease-in-out infinite;}

/* ── Skeleton shimmer wave ── */
.skel-wave{background:linear-gradient(90deg,${T.border} 0%,${T.bg} 40%,#fff 50%,${T.bg} 60%,${T.border} 100%);background-size:400px 100%;animation:shimmer-sweep 1.6s ease-in-out infinite;}

/* ── Card ambient glow on featured ── */
.card.featured-card{animation:ambient-glow 4s ease-in-out infinite!important;}

/* ── Card active spring ── */
.card-lift:active{animation:spring-press .35s cubic-bezier(.22,1,.36,1) both!important;transform:scale(.97)!important;}

/* ── Gradient mesh hero bg ── */
.mesh-bg{background:linear-gradient(135deg,#f7f6f2,#EBF2FF,#f0fffe,#f7f6f2);background-size:400% 400%;animation:mesh-shift 12s ease infinite;}

/* ── Activity feed ── */
.activity-in{animation:activity-in .38s cubic-bezier(.22,1,.36,1) both;}
.activity-out{animation:activity-out .28s ease both;}

/* ── Fast pulse for active-online dot ── */
.pulse-dot-fast::before{content:'';position:absolute;inset:0;border-radius:50%;background:#22c55e;animation:live-dot-fast 1.1s ease-out infinite;}
.pulse-dot-fast::after{content:'';position:absolute;inset:1px;border-radius:50%;background:#22c55e;}
.pulse-dot-fast{position:relative;width:8px;height:8px;}

/* ── DEEP BLUE DARK MODE ── */
@keyframes breathe { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
@keyframes orb-breathe { 0%,100%{opacity:.18;transform:scale(1) translate(0,0)} 50%{opacity:.28;transform:scale(1.12) translate(6px,-8px)} }
@keyframes live-border { 0%,100%{border-color:#1a2d4a} 50%{border-color:#1e3f6a} }
@keyframes glow-breathe { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0)} 50%{box-shadow:0 0 20px 4px rgba(59,130,246,.10)} }
@keyframes msg-pulse { 0%,100%{background:#0a1628} 50%{background:#0c1e3a} }

[data-dark] { color-scheme: dark; }
[data-dark] body, [data-dark] { background: #050d1a !important; color: #e8eaf0 !important; }

/* ── Main wrapper & page background ── */
[data-dark] .dark-page-bg { background: #050d1a !important; }
[data-dark] [style*="background:"][style*="F7F6F2"] { background: #050d1a !important; }

/* ── Cards — dark + living border ── */
[data-dark] .card { background: #0a1628 !important; border-color: #1a2d4a !important; animation: live-border 4s ease-in-out infinite; }
[data-dark] .card-lift:hover { border-color: #2a4f80 !important; box-shadow: 0 18px 50px rgba(30,60,100,.35) !important; }

/* ── Header & nav bars ── */
[data-dark] header { background: rgba(5,13,26,.97) !important; border-color: #1a2d4a !important; }
[data-dark] nav[style] { background: rgba(5,13,26,.98) !important; border-color: #1a2d4a !important; }

/* ── All inline-white backgrounds killed ── */
[data-dark] [style*="background:rgb(255"] { background: #0a1628 !important; }
[data-dark] [style*="background: rgb(255"] { background: #0a1628 !important; }
[data-dark] [style*="background:#FFFFFF"] { background: #0a1628 !important; }
[data-dark] [style*="background: #FFFFFF"] { background: #0a1628 !important; }
[data-dark] [style*="background:rgba(255,255,255"] { background: rgba(10,22,40,.98) !important; }
[data-dark] [style*="background: rgba(255,255,255"] { background: rgba(10,22,40,.98) !important; }

/* ── Text colors — comprehensive ink overrides ── */
[data-dark] [style*="color:#141210"],
[data-dark] [style*="color: #141210"],
[data-dark] [style*="color: rgb(20, 18, 16)"] { color: #e8eaf0 !important; }

[data-dark] [style*="color:#3B3834"],
[data-dark] [style*="color: #3B3834"],
[data-dark] [style*="color:#3b3834"],
[data-dark] [style*="color: #3b3834"] { color: #c8d0df !important; }

[data-dark] [style*="color:#78756F"],
[data-dark] [style*="color: #78756F"],
[data-dark] [style*="color:#78756f"],
[data-dark] [style*="color: #78756f"] { color: #7a9ab8 !important; }

[data-dark] [style*="color:#B0ADA6"],
[data-dark] [style*="color: #B0ADA6"],
[data-dark] [style*="color:#b0ada6"],
[data-dark] [style*="color: #b0ada6"] { color: #4a6a88 !important; }

/* ── Surface backgrounds — T.bg only ── */
[data-dark] [style*="background:#F7F6F2"],
[data-dark] [style*="background: #F7F6F2"] { background: #060f1f !important; }

/* ── Targeted sticky bars (via classname only — never position:sticky broadly) ── */
[data-dark] .filterbar { background: #081326 !important; border-color: #0f2040 !important; }
[data-dark] .topnav { background: rgba(4,12,26,.97) !important; border-color: #0f2040 !important; }

/* ── Tag component ── */
[data-dark] .tag { background: #0d1f38 !important; color: #7a9ab8 !important; border-color: #1a2d4a !important; }

/* General fallback */
[data-dark] { color: #e8eaf0; }

/* ── Inputs ── */
[data-dark] .input { background: #060f1f !important; border-color: #1a2d4a !important; color: #e8eaf0 !important; }
[data-dark] .input::placeholder { color: #3a5070 !important; }
[data-dark] .input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.12) !important; }
[data-dark] select.input { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234a6890' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") !important; }
[data-dark] select.input option { background: #060f1f; color: #e8eaf0; }

/* ── Filter pills ── */
[data-dark] .fp { background: #0a1628 !important; border-color: #1a2d4a !important; color: #5a7290 !important; }
[data-dark] .fp.on { background: #1A56DB !important; border-color: #1A56DB !important; color: #fff !important; }
[data-dark] .fp:hover:not(.on) { background: #112440 !important; border-color: #2a4a70 !important; color: #94a3b8 !important; }

/* ── Nav links ── */
[data-dark] .nl { color: #64748b !important; }
[data-dark] .nl:hover { background: #0d1f38 !important; color: #94a3b8 !important; }
[data-dark] .nl.on { background: #0d2a50 !important; color: #60a5fa !important; }

/* ── Buttons ── */
[data-dark] .btn-outline { background: transparent !important; border-color: #1e3450 !important; color: #94a3b8 !important; }
[data-dark] .btn-ghost { color: #64748b !important; }
[data-dark] .btn-ghost:hover { background: #0d1f38 !important; color: #94a3b8 !important; }

/* ── Modal ── */
[data-dark] .mbox { background: #081326 !important; border-color: #1a2d4a !important; }
[data-dark] .mbg { background: rgba(2,6,14,.85) !important; }

/* ── Tags ── */
[data-dark] .tag { background: #0a1628 !important; border-color: #1a2d4a !important; color: #5a7290 !important; }

/* ── Hero ── */
[data-dark] .mesh-bg { background: #040c1a !important; border-color: #0f2040 !important; }

/* ── Step dots ── */
[data-dark] .dv { border-color: #1a2d4a !important; }
[data-dark] .lock { background: rgba(5,13,26,.93) !important; }
[data-dark] .save-btn { background: rgba(10,22,40,.9) !important; color: #94a3b8 !important; }
[data-dark] .skel { background: linear-gradient(90deg,#0d1f38 25%,#112440 50%,#0d1f38 75%) !important; background-size: 600px 100% !important; }
[data-dark] .toast { background: #0a1628 !important; border: 1px solid #1a2d4a !important; color: #e8eaf0 !important; }
[data-dark] .bnav-item:not(.on) { color: #334d6e !important; }

/* ── Credits badge & unlock counter ── */
[data-dark] [style*="background:#DCFCE7"], [data-dark] [style*="background: #DCFCE7"] { background: #0d2a1a !important; }
[data-dark] [style*="color:#166534"], [data-dark] [style*="color: #166534"] { color: #34d399 !important; }

/* ── Breathing ambient orb behind board header (lively feel) ── */
[data-dark] .dark-orb { animation: orb-breathe 6s ease-in-out infinite !important; filter: brightness(4) saturate(2); }

/* ── Message rows pulse ── */
[data-dark] .msg-row { animation: msg-pulse 5s ease-in-out infinite; }
[data-dark] .msg-row:nth-child(2) { animation-delay: 1.5s; }
[data-dark] .msg-row:nth-child(3) { animation-delay: 3s; }

/* ── Message bubbles ── */
[data-dark] .msg-bubble-them { background: #0d1f38 !important; border-color: #1e3450 !important; color: #e8eaf0 !important; }
[data-dark] .msg-row[style*="#EBF2FF"] { background: #0d2a50 !important; }

/* ── Pulse dot stays green & glows ── */
[data-dark] .pulse-dot::before { background: #22c55e; animation: pulse-ring 1.8s ease-out infinite, glow-breathe 3s ease-in-out infinite; }
[data-dark] .pulse-dot::after { background: #22c55e; }

/* ── Step dots ── */
[data-dark] .step-dot { background: #1a2d4a !important; }
[data-dark] .step-dot.on { background: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,.2) !important; }
[data-dark] .step-dot.done { background: #3b82f6 !important; opacity:.4 !important; }

/* ── Emoji picker ── */
[data-dark] .emoji-picker-area > div { background: #0a1628 !important; border-color: #1a2d4a !important; }
[data-dark] .emoji-picker-area button { color: inherit; }
[data-dark] .emoji-picker-area button:hover { background: #112440 !important; border-radius: 6px; }

/* ── Settings toggle track ── */
[data-dark] [style*="background:${T.border}"][style*="border-radius:99"] { background: #1a2d4a !important; }

/* ── Featured / highlighted cards breathe ── */
[data-dark] .card.featured-card { animation: live-border 4s ease-in-out infinite, glow-breathe 5s ease-in-out infinite; }

.u{animation:up .48s cubic-bezier(.22,1,.36,1) both;}
.au{animation:card-in .55s cubic-bezier(.22,1,.36,1) both;}
.au:nth-child(1){animation-delay:.04s}
.au:nth-child(2){animation-delay:.10s}
.au:nth-child(3){animation-delay:.17s}
.au:nth-child(4){animation-delay:.24s}
.au:nth-child(5){animation-delay:.31s}
.au:nth-child(6){animation-delay:.38s}
.au:nth-child(7){animation-delay:.44s}
.au:nth-child(8){animation-delay:.50s}
.blink{animation:blink 2s ease-in-out infinite;}
.fade-in{animation:fadeIn .32s ease both;}
.slide-right{animation:slide-in-right .38s cubic-bezier(.22,1,.36,1) both;}

.serif{font-family:'Playfair Display',serif;}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:'Manrope',sans-serif;font-weight:700;font-size:13.5px;border:none;cursor:pointer;transition:all .18s;white-space:nowrap;padding:10px 20px;border-radius:${T.r};}
.btn-blue{background:linear-gradient(135deg,#1A56DB,#3B82F6);color:#fff;box-shadow:0 4px 14px rgba(26,86,219,.3);}
.btn-blue:hover{background:linear-gradient(135deg,#1647C0,#2563EB);transform:translateY(-2px);box-shadow:0 8px 24px rgba(26,86,219,.45);}
.btn-blue:active{transform:translateY(0);box-shadow:none;}
.btn-outline{background:transparent;color:${T.accent};border:2px solid ${T.accentM};}
.btn-outline:hover{border-color:${T.accent};color:${T.accent};background:${T.accentL};}
.btn-ghost{background:transparent;color:${T.ink3};border:none;}
.btn-ghost:hover{color:${T.accent};background:${T.accentL};}
.btn-green{background:linear-gradient(135deg,#16A34A,#22C55E);color:#fff;box-shadow:0 4px 14px rgba(22,163,74,.3);}
.btn-green:hover{background:linear-gradient(135deg,#15803D,#16A34A);transform:translateY(-2px);box-shadow:0 8px 24px rgba(22,163,74,.4);}
.btn-danger{background:#FEF0F9;color:#9D175D;border:1.5px solid #FBCFE8;}
.btn-danger:hover{background:#FCE7F5;}
.btn-sm{padding:7px 15px;font-size:12.5px;}
.btn-xs{padding:5px 11px;font-size:12px;border-radius:7px;}
.btn-icon{padding:8px;border-radius:${T.r};width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;}

/* Cards */
.card{background:${T.white};border:1px solid ${T.border};border-radius:${T.r2};}
.card-lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s,border-color .22s;cursor:pointer;}
.card-lift:hover{transform:translateY(-8px) scale(1.013);box-shadow:0 28px 70px rgba(26,86,219,.12),0 0 0 2px rgba(26,86,219,.1);border-color:${T.accentM};}
.card-lift:active{transform:translateY(-2px) scale(1.004);}

/* Input */
.input{background:${T.white};border:1.5px solid ${T.border};border-radius:${T.r};padding:11px 14px;color:${T.ink};font-family:'Manrope',sans-serif;font-size:13.5px;outline:none;transition:all .18s;width:100%;}
.input:focus{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accentL};}
.input:focus{border-color:${T.accent};box-shadow:0 0 0 3px rgba(26,86,219,.07);}
.input::placeholder{color:${T.ink4};}
select.input{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23787570' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px;}
textarea.input{resize:vertical;min-height:110px;line-height:1.6;max-width:100%;}
.input-group{position:relative;}
.input-group .input{padding-left:44px;}
.input-group .input-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:${T.ink4};pointer-events:none;}

/* Tags */
.tag{display:inline-flex;align-items:center;padding:4px 11px;border-radius:99px;font-size:11.5px;font-weight:700;white-space:nowrap;gap:4px;letter-spacing:.1px;}

/* Filter pills */
.fp{padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid ${T.border};background:${T.white};color:${T.ink3};transition:all .18s;white-space:nowrap;font-family:'Manrope',sans-serif;}
.fp:hover{border-color:${T.accentM};color:${T.accent};background:${T.accentL};}
.fp.on{background:linear-gradient(135deg,#1A56DB,#3B82F6);border-color:transparent;color:#fff;box-shadow:0 4px 12px rgba(26,86,219,.3);}
.fp:hover{border-color:#CECAC0;background:${T.bg};}
.fp.on{background:${T.accent};border-color:${T.accent};color:#fff;box-shadow:0 2px 8px rgba(26,86,219,.22);}

/* Nav */
.nl{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:${T.r};font-size:13.5px;font-weight:500;color:${T.ink3};cursor:pointer;transition:all .15s;border:none;background:none;font-family:'Manrope',sans-serif;}
.nl:hover{color:${T.ink};background:${T.border};}
.nl.on{color:${T.accent};background:${T.accentL};font-weight:700;}

/* Lock overlay */
.lock{position:absolute;inset:0;border-radius:inherit;background:rgba(247,246,242,.93);backdrop-filter:blur(6px);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:background .2s;}
.lock:hover{background:rgba(247,246,242,.97);}

/* Modal */
.mbg{position:fixed;inset:0;background:rgba(20,18,16,.6);backdrop-filter:blur(8px);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:16px;padding-top:env(safe-area-inset-top,16px);animation:fadeIn .2s ease;overflow-y:auto;-webkit-overflow-scrolling:touch;}
.mbox{background:${T.white};border:1px solid ${T.border};border-radius:${T.r3};max-width:520px;width:100%;padding:36px;box-shadow:0 32px 80px rgba(20,18,16,.18);position:relative;animation:modal-in .3s cubic-bezier(.22,1,.36,1) both;max-height:94vh;overflow-y:auto;-webkit-overflow-scrolling:touch;}
@media(max-width:480px){
  .board-grid{grid-template-columns:1fr!important;}
  .board-grid .card .cover-img{height:100px!important;}
  .board-grid .card{font-size:13px;}
  .hero-search{flex-direction:column;}
  .hero-search input{font-size:14px;}
}
@media(min-width:481px) and (max-width:768px){
  .board-grid{grid-template-columns:repeat(2,1fr)!important;gap:10px!important;}
}

/* Toast */
.toast{position:fixed;top:18px;right:18px;background:${T.ink};color:#fff;padding:11px 18px;border-radius:${T.r};font-size:13px;font-weight:600;z-index:300;animation:toast-in .25s cubic-bezier(.22,1,.36,1);white-space:nowrap;box-shadow:0 8px 28px rgba(20,18,16,.28);display:flex;align-items:center;gap:8px;max-width:320px;}

/* Misc */
.dv{border:none;border-top:1px solid ${T.border};}
.lbl{font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${T.ink3};}
.sx{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;flex-shrink:0;}
.sx::-webkit-scrollbar{display:none;}
.pt{background:${T.border};border-radius:99px;overflow:hidden;}
.pf{height:100%;background:${T.accent};border-radius:99px;transition:width .5s ease;}
.blurred{filter:blur(5px);user-select:none;pointer-events:none;}

/* Save button */
.save-btn{position:absolute;top:12px;right:12px;width:34px;height:34px;min-width:34px;min-height:34px!important;border-radius:50%;border:none;background:rgba(255,255,255,.92);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:3;box-shadow:0 2px 10px rgba(0,0,0,.18);padding:0;flex-shrink:0;}
.save-btn:hover{transform:scale(1.12);background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.22);}
.save-btn.saved{background:linear-gradient(135deg,#E11D8A,#F43F5E);color:#fff;box-shadow:0 4px 14px rgba(225,29,138,.4);}

/* ── Protect all circular icon buttons from browser/CSS inflation ── */
.btn-icon{padding:0!important;flex-shrink:0!important;}
button[style*="border-radius:\"50%\""]{padding:0!important;}

/* Progress dots */
.step-dot{width:8px;height:8px;border-radius:50%;background:${T.border};transition:all .3s cubic-bezier(.22,1,.36,1);}
.step-dot.on{background:linear-gradient(135deg,#1A56DB,#3B82F6);width:28px;border-radius:4px;box-shadow:0 0 0 3px ${T.accentL};}
.step-dot.done{background:${T.accent};opacity:.45;}

/* Pulse dot */
.pulse-dot{position:relative;width:8px;height:8px;}
.pulse-dot::before{content:'';position:absolute;inset:0;border-radius:50%;background:${T.green};animation:pulse-ring 1.8s ease-out infinite;}
.pulse-dot::after{content:'';position:absolute;inset:1px;border-radius:50%;background:${T.green};}

/* Skeleton loader */
.skel{background:linear-gradient(90deg,${T.border} 0%,${T.bg} 40%,#fff 50%,${T.bg} 60%,${T.border} 100%);background-size:400px 100%;animation:shimmer-sweep 1.6s ease-in-out infinite;border-radius:6px;}

/* Bottom nav */
.bnav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:8px 0 12px;transition:color .15s;font-family:'Manrope',sans-serif;position:relative;}
.bnav-item.on{color:${T.accent};}
.bnav-item:not(.on){color:${T.ink4};}
.bnav-item.on::after{content:'';position:absolute;bottom:6px;width:20px;height:3px;background:linear-gradient(90deg,#1A56DB,#3B82F6);border-radius:99px;box-shadow:0 0 8px rgba(26,86,219,.4);}

/* Responsive */
@media(max-width:960px){
  .hide-md{display:none!important;}
  .g2{grid-template-columns:1fr!important;}
  .g3{grid-template-columns:1fr 1fr!important;}
  .g4{grid-template-columns:1fr 1fr!important;}
  .feed-layout{grid-template-columns:1fr!important;}
  .dash-pad{padding:0 12px!important;}
}
@media(max-width:620px){
  .g2{grid-template-columns:1fr!important;}
  .g3{grid-template-columns:1fr!important;}
  .g4{grid-template-columns:1fr 1fr!important;}
  .mbox{padding:22px!important;border-radius:${T.r2}!important;}
  .hero-h{font-size:30px!important;}
  .hero-row{flex-direction:column!important;align-items:stretch!important;}
  .hero-stats{gap:16px!important;}
  .dash-pad{padding:0 8px!important;}
  .saved-grid{grid-template-columns:1fr!important;}
  .dash-tabs{overflow-x:auto!important;scrollbar-width:none!important;}
  .dash-tabs::-webkit-scrollbar{display:none!important;}
  .dash-header-pad{padding:16px 12px 0!important;}
  .dash-section-pad{padding:0 12px!important;}
  .dash-page-wrap{padding:12px 0 0!important;}
}
`;

/* ─── CATEGORIES ────────────────────────────────────────────────────────────*/
const CATS = [
  "All","Technology","Design","Writing","Marketing",
  "Video & Media","Admin & VA","Finance","Legal",
  "Engineering","Sales","Customer Support",
  "Education","Architecture","Health & Wellness","Music & Audio","Other"
];

/* ─── POSTS DATA ────────────────────────────────────────────────────────────*/
const POSTS_DATA = [
  {
    id:1, type:"need", title:"Need a full-stack developer for a fintech MVP",
    user:"Daniel Osei", userAv:"DO", userColor:"linear-gradient(135deg,#1A56DB,#3B82F6)", userCountry:"Ghana",
    category:"Technology", workType:"Remote", country:"Ghana",
    budget:"$3,000", budgetType:"Fixed", budgetNum:3000,
    tags:["React","Node.js","PostgreSQL","Fintech"],
    cover:"linear-gradient(135deg,#6C3EE8 0%,#A855F7 60%,#F0ABFC 100%)",
    summary:"Looking for an experienced full-stack developer to build a mobile money integration app. Timeline is 6 weeks.",
    verified:true, featured:true, posted:"1h ago", postedMs: Date.now()-3600000, apps:12, rating:4.9, reviews:38,
    full:"We are a Ghanaian fintech startup seeking a talented developer to build our MVP. The app integrates with MTN Mobile Money and Vodafone Cash APIs. Must have prior fintech or payment integration experience. Timeline is strict — 6 weeks from start to launch. Budget is negotiable for the right candidate.",
    contact:{ email:"daniel@fintechgh.com", phone:"+233 24 000 0000", whatsapp:"+233 24 000 0000" }
  },
  {
    id:2, type:"offer", title:"Professional brand identity & UI/UX design",
    user:"Amara Diallo", userAv:"AD", userColor:"linear-gradient(135deg,#E11D8A,#F43F5E)",
    userCountry:"Senegal", category:"Design", workType:"Remote", country:"Global",
    budget:"$80", budgetType:"/ hr", budgetNum:80,
    tags:["Figma","Branding","UI/UX","Webflow"],
    cover:"linear-gradient(135deg,#E11D8A 0%,#F43F5E 60%,#FB7185 100%)",
    summary:"5 years of brand identity and product design. I help startups build beautiful, functional digital products from scratch.",
    verified:true, featured:false, posted:"3h ago", postedMs: Date.now()-10800000, apps:0, rating:5.0, reviews:61,
    full:"I am a senior product designer with 5+ years working with startups across Africa, Europe, and North America. Services include brand identity, logo design, UI/UX for web and mobile, pitch deck design, and Webflow development. I work async and deliver on time. Portfolio available on request.",
    contact:{ email:"amara@designstudio.co", phone:"+221 77 000 0000", whatsapp:"+221 77 000 0000" }
  },
  {
    id:3, type:"need", title:"Content writer needed for SaaS blog — 8 articles/mo",
    user:"Sophie Chen", userAv:"SC", userColor:"linear-gradient(135deg,#0891B2,#06B6D4)",
    userCountry:"Singapore", category:"Writing", workType:"Remote", country:"Global",
    budget:"$400", budgetType:"/ mo", budgetNum:400,
    tags:["SEO","SaaS","Copywriting","B2B"],
    cover:"linear-gradient(135deg,#0891B2 0%,#06B6D4 60%,#67E8F9 100%)",
    summary:"Growing SaaS company looking for a consistent content writer. Must understand SEO and B2B SaaS audiences.",
    verified:false, featured:false, posted:"5h ago", postedMs: Date.now()-18000000, apps:34,
    full:"We run a project management SaaS tool with 10,000+ users. We need a reliable writer to produce 8 long-form blog articles per month targeting SMB and startup audiences. Topics include productivity, remote work, and team management. Writers with prior SaaS content experience will be prioritised.",
    contact:{ email:"sophie@projectly.io", phone:"+65 9000 0000", whatsapp:"+65 9000 0000" }
  },
  {
    id:4, type:"offer", title:"DevOps & cloud infrastructure — AWS, GCP, Kubernetes",
    user:"Marco Silva", userAv:"MS", userColor:"linear-gradient(135deg,#059669,#10B981)",
    userCountry:"Brazil", category:"Technology", workType:"Remote", country:"Global",
    budget:"$90", budgetType:"/ hr", budgetNum:90,
    tags:["AWS","GCP","Kubernetes","Terraform","CI/CD"],
    cover:"linear-gradient(135deg,#059669 0%,#10B981 60%,#6EE7B7 100%)",
    summary:"Senior DevOps engineer available for cloud infrastructure setup, CI/CD pipelines, cost optimisation, and on-call support.",
    verified:true, featured:true, posted:"2h ago", postedMs: Date.now()-7200000, apps:0, rating:4.7, reviews:29,
    full:"8 years of DevOps experience across startups and enterprise. I specialise in cloud migrations, Kubernetes cluster management, infrastructure as code with Terraform, and building robust CI/CD pipelines. Available for both short-term projects and ongoing retainer arrangements. Fast turnaround guaranteed.",
    contact:{ email:"marco@devops.pro", phone:"+55 11 00000-0000", whatsapp:"+55 11 00000-0000" }
  },
  {
    id:5, type:"need", title:"Video editor for weekly YouTube content — tech channel",
    user:"Kwame Boateng", userAv:"KB", userColor:"linear-gradient(135deg,#5B21B6,#7C3AED)",
    userCountry:"Ghana", category:"Video & Media", workType:"Remote", country:"Global",
    budget:"$150", budgetType:"/ video", budgetNum:150,
    tags:["Premiere Pro","After Effects","YouTube","Motion Graphics"],
    cover:"linear-gradient(135deg,#7C3AED 0%,#A855F7 60%,#D8B4FE 100%)",
    summary:"YouTube tech channel with 80k subscribers needs a weekly video editor. Long-term collaboration preferred.",
    verified:false, featured:false, posted:"8h ago", postedMs: Date.now()-28800000, apps:27,
    full:"We run a tech review YouTube channel with 80,000 subscribers and growing. We upload one video per week — typically 10 to 15 minutes. Looking for an editor who can handle cuts, colour grading, motion graphics intros/outros, and captions. Raw footage provided via Google Drive. Consistent weekly deadline is non-negotiable.",
    contact:{ email:"kwame@techchannel.com", phone:"+233 20 000 0000", whatsapp:"+233 20 000 0000" }
  },
  {
    id:6, type:"offer", title:"Virtual assistant — scheduling, email management & research",
    user:"Priya Nair", userAv:"PN", userColor:"linear-gradient(135deg,#EA580C,#F97316)",
    userCountry:"India", category:"Admin & VA", workType:"Remote", country:"Global",
    budget:"$15", budgetType:"/ hr", budgetNum:15,
    tags:["Admin","Scheduling","Research","CRM","Notion"],
    cover:"linear-gradient(135deg,#EA580C 0%,#F97316 60%,#FDBA74 100%)",
    summary:"Experienced VA with 4 years supporting executives and founders. Available for part-time or full-time remote work.",
    verified:false, featured:false, posted:"1d ago", postedMs: Date.now()-86400000, apps:0,
    full:"I am a professional virtual assistant with 4 years of experience supporting CEOs, founders, and busy professionals. I handle calendar management, inbox zero, travel arrangements, data entry, research, and CRM updates. I work across time zones and respond within 2 hours during agreed working hours. References available.",
    contact:{ email:"priya.va@gmail.com", phone:"+91 98000 00000", whatsapp:"+91 98000 00000" }
  },
  {
    id:7, type:"need", title:"On-site architect needed — residential project in Nairobi",
    user:"James Kariuki", userAv:"JK", userColor:"linear-gradient(135deg,#1E3A5F,#1D4ED8)",
    userCountry:"Kenya", category:"Architecture", workType:"On-site", country:"Kenya",
    budget:"$2,500", budgetType:"/ mo", budgetNum:2500,
    tags:["Architecture","AutoCAD","Residential","Nairobi"],
    cover:"linear-gradient(135deg,#1D4ED8 0%,#6C3EE8 60%,#A855F7 100%)",
    summary:"Real estate developer seeking a licensed architect for a 12-unit residential project in Karen, Nairobi. Relocation support available.",
    verified:true, featured:false, posted:"2d ago", postedMs: Date.now()-172800000, apps:8,
    full:"We are developing a 12-unit gated residential complex in Karen, Nairobi. We need a licensed architect who can manage design drawings, liaise with local county planning offices, and oversee construction supervision. 18-month contract with possibility of extension. Relocation support offered for candidates outside Nairobi.",
    contact:{ email:"james@kariukiland.co.ke", phone:"+254 700 000000", whatsapp:"+254 700 000000" }
  },
  {
    id:8, type:"offer", title:"Certified accountant — bookkeeping, tax & financial reporting",
    user:"Lena Fischer", userAv:"LF", userColor:"linear-gradient(135deg,#0891B2,#06B6D4)",
    userCountry:"Germany", category:"Finance", workType:"Remote", country:"Global",
    budget:"$70", budgetType:"/ hr", budgetNum:70,
    tags:["Bookkeeping","Tax","IFRS","Xero","QuickBooks"],
    cover:"linear-gradient(135deg,#0E7490 0%,#0891B2 60%,#38BDF8 100%)",
    summary:"CPA with 9 years in SME accounting. Specialising in remote bookkeeping, tax preparation, and monthly financial reporting.",
    verified:true, featured:false, posted:"6h ago", postedMs: Date.now()-21600000, apps:0,
    full:"I am a Certified Public Accountant based in Germany with 9 years of experience working with small and medium businesses across Europe and internationally. Services include monthly bookkeeping, VAT and corporate tax preparation, cash flow forecasting, and IFRS-compliant financial statements. I work with Xero, QuickBooks, and Wave. English and German speaking.",
    contact:{ email:"lena@fischeraccounting.de", phone:"+49 170 0000000", whatsapp:"+49 170 0000000" }
  },
  {
    id:9, type:"need", title:"Mobile app developer for iOS & Android — health & fitness",
    user:"Fatima Al-Hassan", userAv:"FA", userColor:"linear-gradient(135deg,#7C3AED,#9333EA)",
    userCountry:"UAE", category:"Technology", workType:"Remote", country:"Global",
    budget:"$8,000", budgetType:"Fixed", budgetNum:8000,
    tags:["React Native","iOS","Android","HealthKit"],
    cover:"linear-gradient(135deg,#7C3AED 0%,#8B5CF6 60%,#C4B5FD 100%)",
    summary:"UAE-based wellness startup seeking a React Native developer to build our flagship health tracking app.",
    verified:true, featured:true, posted:"4h ago", postedMs: Date.now()-14400000, apps:19,
    full:"We are a wellness startup based in Dubai looking to build our core mobile application. The app will integrate with Apple HealthKit and Google Fit, feature workout tracking, nutrition logging, and AI coaching. We have full UI/UX designs ready. You will be the sole mobile developer working closely with our CTO.",
    contact:{ email:"fatima@wellnessae.com", phone:"+971 50 000 0000", whatsapp:"+971 50 000 0000" }
  },
  {
    id:10, type:"offer", title:"Growth marketer & paid ads specialist — ROAS 4x+",
    user:"Carlos Mendez", userAv:"CM", userColor:"linear-gradient(135deg,#DB2777,#E11D8A)",
    userCountry:"Mexico", category:"Marketing", workType:"Remote", country:"Global",
    budget:"$60", budgetType:"/ hr", budgetNum:60,
    tags:["Meta Ads","Google Ads","Growth","Analytics","E-commerce"],
    cover:"linear-gradient(135deg,#DB2777 0%,#E11D8A 60%,#F9A8D4 100%)",
    summary:"Growth marketer with $2M+ in ad spend managed. Specialising in paid social, search, and conversion rate optimisation.",
    verified:false, featured:false, posted:"12h ago", postedMs: Date.now()-43200000, apps:0,
    full:"I have managed over $2 million in paid ad spend across Meta, Google, TikTok, and LinkedIn for e-commerce and SaaS clients. My average ROAS for e-commerce clients is 4x. I handle full-funnel strategy, creative briefing, campaign management, and monthly reporting. Available for retainer or project-based work.",
    contact:{ email:"carlos@growthlab.mx", phone:"+52 55 0000 0000", whatsapp:"+52 55 0000 0000" }
  },
  {
    id:11, type:"need", title:"Legal counsel needed — contract law & international agreements",
    user:"Nadia Rousseau", userAv:"NR", userColor:"linear-gradient(135deg,#0891B2,#06B6D4)",
    userCountry:"France", category:"Legal", workType:"Remote", country:"France",
    budget:"$120", budgetType:"/ hr", budgetNum:120,
    tags:["Contract Law","International","GDPR","Corporate"],
    cover:"linear-gradient(135deg,#059669 0%,#0D9488 60%,#5EEAD4 100%)",
    summary:"Paris-based tech company seeking a bilingual (EN/FR) legal counsel for international partnership contracts.",
    verified:true, featured:false, posted:"3d ago", postedMs: Date.now()-259200000, apps:5,
    full:"Our company operates across Europe and North America. We need an experienced legal counsel to review, draft, and negotiate international commercial contracts, partnership agreements, and data processing agreements under GDPR. Bilingual French and English is mandatory. Must have prior experience in the tech sector.",
    contact:{ email:"nadia.legal@techfr.io", phone:"+33 6 00 00 00 00", whatsapp:"+33 6 00 00 00 00" }
  },
  {
    id:12, type:"offer", title:"Music producer & audio engineer — cinematic & commercial",
    user:"Tobias Adeyemi", userAv:"TA", userColor:"#1D4ED8",
    userCountry:"Nigeria", category:"Music & Audio", workType:"Remote", country:"Global",
    budget:"$500", budgetType:"/ track", budgetNum:500,
    tags:["Music Production","Mixing","Mastering","Cinematic"],
    cover:"linear-gradient(135deg,#4F46E5 0%,#6C3EE8 60%,#A5B4FC 100%)",
    summary:"Award-winning music producer and audio engineer. Cinematic scoring, commercial jingles, podcast audio, and full album production.",
    verified:true, featured:false, posted:"18h ago", postedMs: Date.now()-64800000, apps:0,
    full:"I am a Lagos and London-based music producer with credits on projects for Netflix, BBC, and multiple chart-topping artists. I specialise in cinematic scoring, Afrobeats, R&B, and commercial audio production. I work with Logic Pro and Pro Tools and deliver broadcast-quality audio. Turnaround is typically 3–5 days per track.",
    contact:{ email:"tobias@soundcraft.ng", phone:"+234 80 000 00000", whatsapp:"+234 80 000 00000" }
  },
];

// Enrich posts with response metadata
const RESPONSE_DATA = [
  { responseRate:96, replyTime:"< 1h"  },
  { responseRate:98, replyTime:"< 2h"  },
  { responseRate:72, replyTime:"< 6h"  },
  { responseRate:94, replyTime:"< 2h"  },
  { responseRate:65, replyTime:"same day"},
  { responseRate:100,replyTime:"< 1h"  },
  { responseRate:88, replyTime:"< 4h"  },
  { responseRate:97, replyTime:"< 1h"  },
  { responseRate:91, replyTime:"< 3h"  },
  { responseRate:83, replyTime:"< 5h"  },
  { responseRate:76, replyTime:"< 8h"  },
  { responseRate:99, replyTime:"< 2h"  },
];
POSTS_DATA.forEach((p,i) => { Object.assign(p, RESPONSE_DATA[i]||{ responseRate:85, replyTime:"< 4h" }); });

/* ─── ICONS ─────────────────────────────────────────────────────────────────*/
const I = {
  search:  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  lock:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  check:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  ver:     <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A56DB"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  close:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  back:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  filter:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
  globe:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  pin:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.07 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17v-.08z"/></svg>,
  whatsapp:<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  heart:   (f) => <svg width="16" height="16" viewBox="0 0 24 24" fill={f?"#9D174D":"none"} stroke={f?"#9D174D":"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  share:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  home:    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  post:    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  dash:    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bookmark:<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  star:    (f) => <svg width="13" height="13" viewBox="0 0 24 24" fill={f?"#D97706":"#E6E3DC"} stroke={f?"#D97706":"#D4D0C8"} strokeWidth=".5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  trending:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  copy:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  spark:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  edit:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  msg:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  send:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  flag:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  bell:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  moon:    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  link:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  chart:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  refer:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

/* ─── ATOMS ─────────────────────────────────────────────────────────────────*/
const Av = ({ text, color, size=38, r="50%" }) => (
  <div style={{
    width:size, height:size, borderRadius:r,
    background:color||"linear-gradient(135deg,#1A56DB,#3B82F6)",
    flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Manrope',sans-serif", fontWeight:800, fontSize:size*.32, color:"#fff",
    letterSpacing:"-.5px", boxShadow:`0 2px 8px rgba(20,18,16,.2)`,
  }}>
    {text}
  </div>
);

const TAG_PALETTES = [
  { c:"#1A56DB", bg:"#EBF2FF" },
  { c:"#9D174D", bg:"#FCE7F3" },
  { c:"#0F766E", bg:"#CCFBF1" },
  { c:"#166534", bg:"#DCFCE7" },
  { c:"#EA580C", bg:"#FFEDD5" },
  { c:"#5B21B6", bg:"#EDE9FE" },
  { c:"#1E3A5F", bg:"#DBEAFE" },
  { c:"#92400E", bg:"#FEF3C7" },
];
const tagColor = (label) => TAG_PALETTES[label.charCodeAt(0) % TAG_PALETTES.length];

const Tag = ({ label, color, bg, onClick }) => {
  const palette = (color && bg) ? { c:color, bg } : tagColor(label||"");
  return (
    <span className="tag" style={{ color:palette.c, background:palette.bg, cursor:onClick?"pointer":undefined, transition:"opacity .15s", border:`1px solid ${palette.c}22` }}
      onClick={onClick}
      onMouseEnter={onClick?e=>e.currentTarget.style.opacity=".7":undefined}
      onMouseLeave={onClick?e=>e.currentTarget.style.opacity="1":undefined}
    >{label}</span>
  );
};

const WorkTypeBadge = ({ type }) => {
  const m = {
    "Remote":  { c:"#fff", bg:"linear-gradient(135deg,#059669,#10B981)" },
    "On-site": { c:"#fff", bg:"linear-gradient(135deg,#D97706,#F59E0B)" },
    "Hybrid":  { c:"#fff", bg:"linear-gradient(135deg,#1E40AF,#3B82F6)" },
    "Relocate":{ c:"#fff", bg:"linear-gradient(135deg,#7C3AED,#A855F7)" },
  };
  const s = m[type] || { c:T.ink3, bg:T.border };
  return <span className="tag" style={{ color:s.c, background:s.bg, fontWeight:700, boxShadow:"0 2px 8px rgba(0,0,0,.15)" }}>{type}</span>;
};

const PostTypeBadge = ({ type }) => (
  <span className="tag" style={{
    color:"#fff",
    background: type==="need" ? "linear-gradient(135deg,#E11D8A,#EC4899)" : "linear-gradient(135deg,#0891B2,#06B6D4)",
    fontWeight:700, fontSize:11, boxShadow:"0 2px 8px rgba(0,0,0,.15)"
  }}>
    {type==="need" ? "Needs Work" : "Offering Services"}
  </span>
);

const LockWall = ({ onUnlock, credits }) => (
  <div className="lock" onClick={onUnlock}>
    <div style={{ textAlign:"center" }}>
      <div style={{ width:48, height:48, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px", color:"#fff", boxShadow:"0 4px 16px rgba(26,86,219,.35)" }}>
        {I.lock}
      </div>
      <div style={{ fontWeight:700, fontSize:13.5, marginBottom:4 }}>Unlock Contact Details</div>
      <div style={{ fontSize:12.5, color:T.ink3, marginBottom:10 }}>
        {credits > 0 ? `${credits} free unlock${credits>1?"s":""} remaining` : "No free unlocks left today"}
      </div>
      <button className="btn btn-blue btn-sm" style={{ fontSize:12, padding:"6px 16px" }}>
        {credits > 0 ? "Use Free Unlock" : "Upgrade to Unlock"}
      </button>
    </div>
  </div>
);

const Dv = ({ my=14 }) => <hr className="dv" style={{ margin:`${my}px 0` }} />;

/* ─── ANIMATED COUNT ────────────────────────────────────────────────────────*/
function AnimatedCount({ value, suffix="" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(String(value).replace(/\D/g,"")) || 0;
    let start = 0;
    const step = Math.ceil(num / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setDisplay(start);
      if (start >= num) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  const raw = String(value);
  const hasPlus = raw.includes("+");
  const formatted = display > 999 ? (display/1000).toFixed(1)+"k" : display;
  return <span>{formatted}{hasPlus?"+":""}{suffix}</span>;
}

/* ─── RELATIVE TIME ─────────────────────────────────────────────────────────*/
function useRelativeTime(ms) {
  const calc = () => {
    if (!ms) return "";
    const d = Date.now() - ms;
    const m = Math.floor(d / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 60000); return () => clearInterval(id); }, [ms]);
  return t;
}

/* ─── LIVE TICKER ────────────────────────────────────────────────────────────*/
const TICKER_EVENTS = [
  "Daniel O. just posted a fintech project 🇬🇭",
  "Sara K. unlocked a design brief 🇿🇦",
  "New offer: React dev available · Remote 🌐",
  "Amara T. expressed interest in a project 🇳🇬",
  "3 new posts in Technology this hour ⚡",
  "Kemi A. just joined Hired 🎉",
  "Featured post: Brand identity · $2,400 Fixed",
  "New post: Mobile app MVP · Kenya 🇰🇪",
];
function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const cycle = () => {
      setPhase("out");
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_EVENTS.length);
        setPhase("in");
      }, 380);
    };
    const t = setInterval(cycle, 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, overflow:"hidden", height:22 }}>
      <div className="pulse-dot" style={{ flexShrink:0 }} />
      <div style={{
        fontSize:12, fontWeight:600, color:T.ink3,
        animation: phase==="in" ? "ticker-in .38s cubic-bezier(.22,1,.36,1) both" : "ticker-out .28s ease both",
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:260
      }}>
        {TICKER_EVENTS[idx]}
      </div>
    </div>
  );
}

/* ─── COUNTRY FLAG MAP ───────────────────────────────────────────────────────*/
const FLAGS = { Ghana:"🇬🇭", Nigeria:"🇳🇬", Kenya:"🇰🇪", Senegal:"🇸🇳", "South Africa":"🇿🇦", Egypt:"🇪🇬", Tanzania:"🇹🇿", Ethiopia:"🇪🇹", Uganda:"🇺🇬", Rwanda:"🇷🇼", USA:"🇺🇸", UK:"🇬🇧", Canada:"🇨🇦", Germany:"🇩🇪", France:"🇫🇷", Spain:"🇪🇸", Italy:"🇮🇹", Netherlands:"🇳🇱", UAE:"🇦🇪", India:"🇮🇳", Singapore:"🇸🇬", Japan:"🇯🇵", China:"🇨🇳", Brazil:"🇧🇷", Mexico:"🇲🇽", Argentina:"🇦🇷", Australia:"🇦🇺", "New Zealand":"🇳🇿", Global:"🌐", Remote:"🌐" };
const flag = c => FLAGS[c] || "🌐";
const SkeletonCard = () => (
  <div className="card" style={{ padding:0, overflow:"hidden" }}>
    <div className="shimmer" style={{ height:120 }} />
    <div style={{ padding:"14px 16px 18px" }}>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        <div className="shimmer" style={{ width:44, height:44, borderRadius:"50%", flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div className="shimmer" style={{ height:12, width:"60%", borderRadius:6, marginBottom:6 }} />
          <div className="shimmer" style={{ height:10, width:"40%", borderRadius:6 }} />
        </div>
      </div>
      <div className="shimmer" style={{ height:14, borderRadius:6, marginBottom:8 }} />
      <div className="shimmer" style={{ height:14, borderRadius:6, width:"80%", marginBottom:14 }} />
      <div className="shimmer" style={{ height:11, borderRadius:6, width:"90%", marginBottom:12 }} />
      <div style={{ display:"flex", gap:6 }}>
        {[70,55,80].map((w,i)=><div key={i} className="shimmer" style={{ height:22, width:w, borderRadius:99 }} />)}
      </div>
    </div>
  </div>
);

/* ─── TIME AGO (non-hook, for static contexts) ───────────────────────────────*/
const timeAgo = (ms) => {
  if (!ms) return "";
  const diff = Date.now() - ms;
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  if (diff < 604800000)return `${Math.floor(diff/86400000)}d ago`;
  return new Date(ms).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
};

/* ─── POST CARD ──────────────────────────────────────────────────────────────*/
const PostCard = ({ post, onOpen, saved, onSave }) => {
  const [hovered, setHovered] = useState(false);
  const relTime = useRelativeTime(post.postedMs);
  const daysLeft = post.postedMs ? Math.max(0, 30 - Math.floor((Date.now() - post.postedMs) / 86400000)) : null;

  return (
    <div
      className={`card card-lift au${post.featured?" featured-card":""}`}
      onClick={() => onOpen(post)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow:"hidden", position:"relative",
        animation: post.featured ? "ambient-glow 4s ease-in-out infinite" : undefined,
        borderLeft: hovered ? `3px solid ${post.userColor}` : `3px solid transparent`,
        transition:"border-left-color .25s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Cover / Thumbnail */}
      <div className="cover-img" style={{ height:136, background:post.cover, position:"relative", overflow:"hidden" }}>
        {/* Ken Burns on hover */}
        <div style={{ position:"absolute", inset:0, background:post.cover, transition:"transform .6s cubic-bezier(.22,1,.36,1)", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 75% 25%, rgba(255,255,255,.15) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(0,0,0,.12) 0%, transparent 40%)" }} />

        {/* Featured top accent strip */}
        {post.featured && (
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#EA580C,#F97316,#FCD34D)", zIndex:4 }} />
        )}

        {/* Post type badge — top left */}
        <div style={{ position:"absolute", top:12, left:12, zIndex:2 }}>
          <PostTypeBadge type={post.type} />
        </div>

        {/* Featured badge — top RIGHT, clear of type badge (top-left) and avatar (bottom-left) */}
        {post.featured && (
          <div style={{ position:"absolute", top:12, right:48, zIndex:3 }}>
            <span style={{ background:"linear-gradient(135deg,#EA580C,#F97316,#FCD34D)", color:"#fff", padding:"4px 12px", borderRadius:99, fontSize:11, fontWeight:800, boxShadow:"0 4px 12px rgba(234,88,12,.45)", display:"flex", alignItems:"center", gap:4, letterSpacing:".3px" }}>
              {I.spark} FEATURED
            </span>
          </div>
        )}

        {/* Save button */}
        <button
          className={`save-btn${saved?" saved":""}`}
          onClick={e=>{e.stopPropagation();onSave(post.id);}}
          title={saved?"Remove from saved":"Save post"}
        >
          {I.heart(saved)}
        </button>

        {/* Category pill */}
        <div style={{ position:"absolute", bottom:12, right:12 }}>
          <span style={{ background:"rgba(255,255,255,.22)", color:"#fff", padding:"3px 12px", borderRadius:99, fontSize:11, fontWeight:700, backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.3)", letterSpacing:".3px" }}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Avatar — outside cover so overflow:hidden doesn't clip it */}
      <div style={{ position:"relative", height:0 }}>
        <div style={{ position:"absolute", top:-24, left:16, border:`3px solid ${T.white}`, borderRadius:"50%", boxShadow:"0 2px 12px rgba(0,0,0,.22)", zIndex:2 }}>
          <Av text={post.userAv} color={post.userColor} size={46} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:"30px 16px 18px", borderLeft:`4px solid ${post.type==="need" ? "#E11D8A" : "#0891B2"}` }}>
        {/* User + budget row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:12.5, color:T.ink3, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontWeight:600, color:T.ink2 }}>{post.user}</span>
            {post.verified && I.ver}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, lineHeight:1,
            background: post.budgetNum > 5000 ? "linear-gradient(135deg,#EA580C,#F97316)" : post.budgetNum > 1000 ? "linear-gradient(135deg,#166534,#22C55E)" : "linear-gradient(135deg,#1A56DB,#3B82F6)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", fontWeight:700
          }}>
            {post.budget} <span style={{ fontSize:11.5, fontWeight:600, fontFamily:"'Manrope',sans-serif" }}>{post.budgetType}</span>
          </div>
        </div>
        {post.responseRate && (
          <div style={{ marginBottom:8 }}>
            <ResponseBadge rate={post.responseRate} replyTime={post.replyTime||"< 4h"} />
          </div>
        )}

        {/* Title */}
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, lineHeight:1.35, marginBottom:9, color:T.ink }}>
          {post.title}
        </div>

        {/* Summary */}
        <p style={{ fontSize:13, color:T.ink3, lineHeight:1.65, marginBottom:12 }}>
          {post.summary.length > 85 ? post.summary.slice(0,85)+"…" : post.summary}
        </p>

        {/* Tags */}
        <div className="sx" style={{ marginBottom:13, gap:6 }}>
          <WorkTypeBadge type={post.workType} />
          <Tag label={post.country} />
          {post.tags.slice(0,2).map(t=><Tag key={t} label={t} />)}
          <MatchScore post={post} userSkills={(()=>{ try { return JSON.parse(localStorage.getItem("hired_profile_skills")||"[]"); } catch { return []; } })()} />
        </div>

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.ink4 }}>
            <span>{flag(post.userCountry)}</span>
            <span>{post.userCountry}</span>
            <span style={{ color:T.border2 }}>·</span>
            <span>{relTime || post.posted}</span>
            {daysLeft !== null && daysLeft <= 5 && (
              <span style={{ color:T.rose, fontWeight:700, marginLeft:4 }}>· {daysLeft === 0 ? "Expires today" : `Expires in ${daysLeft}d`}</span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            {post.rating && (
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                {I.star(true)}
                <span style={{ fontSize:12, fontWeight:700, color:T.ink3 }}>{post.rating}</span>
              </div>
            )}
            {post.type==="need"
              ? <span style={{ fontSize:12, fontWeight:700 }}>
                  <span style={{ background:"linear-gradient(135deg,#E11D8A,#F43F5E)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{post.apps}</span>
                  <span style={{ color:T.ink3, fontWeight:500 }}> interested</span>
                </span>
              : <span style={{ fontSize:12, fontWeight:700, color:"#059669", display:"flex", alignItems:"center", gap:4, background:"#D1FAE5", padding:"2px 8px", borderRadius:99 }}>
                  <div className="pulse-dot" style={{ width:6, height:6 }} />Available
                </span>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── POST DETAIL MODAL ─────────────────────────────────────────────────────*/
const PostDetail = ({ post, onClose, credits, setCredits, isPaid, onUpgrade, saved, onSave, fire, onTagFilter, onMessage, onPropose, onBoost, isOwn, allPosts=[], isGuest, onRequireAuth }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showBoostConfirm, setShowBoostConfirm] = useState(false);

  const handleUnlock = () => {
    if (isPaid) { setUnlocked(true); return; }
    if (credits > 0) { setCredits(c=>c-1); setUnlocked(true); fire("🔓 Contact unlocked!"); return; }
    onUpgrade();
  };

  const handleCopy = (val, key) => {
    navigator.clipboard?.writeText(val).catch(()=>{});
    setCopied(key);
    setTimeout(()=>setCopied(null), 2000);
    fire("📋 Copied to clipboard");
  };

  const canSee = unlocked || isPaid;

  return (
    <div className="mbg" onClick={onClose}>
      <div className="mbox" style={{ maxWidth:660 }} onClick={e=>e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:T.border, border:"none", borderRadius:"50%", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3, zIndex:10 }}>
          {I.close}
        </button>

        {/* Cover */}
        <div style={{ height:112, background:post.cover, borderRadius:T.r2, marginBottom:20, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 75% 25%, rgba(255,255,255,.15) 0%, transparent 55%)" }} />
          <div style={{ position:"absolute", bottom:-22, left:20, border:`3px solid ${T.white}`, borderRadius:"50%", boxShadow:"0 2px 12px rgba(0,0,0,.18)" }}>
            <Av text={post.userAv} color={post.userColor} size={48} />
          </div>
          <div style={{ position:"absolute", top:12, left:12 }}>
            <PostTypeBadge type={post.type} />
          </div>
          {post.featured && (
            <div style={{ position:"absolute", top:12, right:12 }}>
              <span className="tag" style={{ color:T.amber, background:"rgba(254,243,199,.9)", fontSize:11, fontWeight:700 }}>{I.spark} Featured</span>
            </div>
          )}
          {/* Save in modal */}
          <button
            className={`save-btn${saved?" saved":""}`}
            style={{ top:"auto", bottom:12, right:12 }}
            onClick={e=>{e.stopPropagation();onSave(post.id);}}
          >
            {I.heart(saved)}
          </button>
        </div>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, marginTop:8 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
              <span style={{ fontWeight:700, fontSize:15 }}>{post.user}</span>
              {post.verified && I.ver}
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", fontSize:12.5, color:T.ink3 }}>
              {I.pin}<span>{flag(post.userCountry)} {post.userCountry}</span>
              <span style={{ color:T.border2 }}>·</span>
              {I.globe}<span>{post.category}</span>
              <span style={{ color:T.border2 }}>·</span>
              <span>{post.posted}</span>
            </div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, color:T.ink, lineHeight:1 }}>{post.budget}</div>
            <div style={{ fontSize:12.5, color:T.ink3 }}>{post.budgetType}</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:600, lineHeight:1.3, marginBottom:14 }}>
          {post.title}
        </div>

        {/* Tags */}
        <div className="sx" style={{ marginBottom:18, flexWrap:"wrap", gap:6 }}>
          <WorkTypeBadge type={post.workType} />
          <Tag label={post.country} />
          {post.type==="offer" && (
            <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", background:T.greenBg, borderRadius:99, border:`1px solid ${T.green}33` }}>
              <div className="pulse-dot" style={{ width:6, height:6, flexShrink:0 }} />
              <span style={{ fontSize:11, fontWeight:700, color:T.green }}>Available Now</span>
            </span>
          )}
          <ResponseBadge rate={post.responseRate||88} replyTime={post.replyTime||"< 3h"} />
          {post.tags.map(t=>(
            <Tag key={t} label={t}
              onClick={onTagFilter ? () => { onTagFilter(t); onClose(); } : undefined}
              color={T.accent} bg={T.accentL}
            />
          ))}
        </div>

        {/* Full description */}
        <div style={{ background:T.bg, borderRadius:T.r, padding:"16px 18px", marginBottom:20, border:`1px solid ${T.border}` }}>
          <p style={{ fontSize:14, color:T.ink2, lineHeight:1.85 }}>{post.full}</p>
        </div>

        {post.type==="need" && (
          <div style={{ display:"flex", gap:14, padding:"12px 16px", background:T.accentL, borderRadius:T.r, border:`1px solid ${T.accentM}`, marginBottom:18, alignItems:"center" }}>
            <div style={{ color:T.accent, fontWeight:800, fontSize:22, fontFamily:"'Playfair Display',serif" }}>{post.apps}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13.5, color:T.accent }}>People Interested</div>
              <div style={{ fontSize:12.5, color:T.ink3 }}>Be among the first to apply</div>
            </div>
          </div>
        )}

        <Dv my={18} />

        {/* Contact section */}
        <div style={{ marginBottom:8 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:14.5 }}>Contact Details</div>
            {canSee && (
              <span className="tag" style={{ color:T.green, background:T.greenBg, fontSize:11 }}>
                {I.check} Unlocked
              </span>
            )}
          </div>

          {!canSee && credits > 0 && (
            <div style={{ fontSize:13, color:T.ink3, marginBottom:12, padding:"10px 14px", background:T.greenBg, borderRadius:T.r, border:`1px solid ${T.green}33` }}>
              You have <strong style={{ color:T.green }}>{credits} free unlock{credits>1?"s":""}</strong> left today
            </div>
          )}
          {!canSee && credits === 0 && (
            <div style={{ fontSize:13, color:T.ink3, marginBottom:12, padding:"10px 14px", background:T.amberBg, borderRadius:T.r, border:`1px solid ${T.amber}44` }}>
              Free unlocks used. <span style={{ color:T.accent, cursor:"pointer", fontWeight:600 }} onClick={onUpgrade}>Upgrade for unlimited access →</span>
            </div>
          )}

          <div style={{ position:"relative", borderRadius:T.r, overflow:"hidden" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:I.mail, label:"Email", val:post.contact.email, key:"email" },
                { icon:I.phone, label:"Phone", val:post.contact.phone, key:"phone" },
                { icon:I.whatsapp, label:"WhatsApp", val:post.contact.whatsapp, key:"wa", color:T.teal },
              ].map(c=>(
                <div key={c.key} style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}`, justifyContent:"space-between" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ color:c.color||T.accent, flexShrink:0 }}>{c.icon}</div>
                    <div>
                      <div className="lbl" style={{ marginBottom:2 }}>{c.label}</div>
                      <div style={{ fontSize:13.5, fontWeight:600, filter:canSee?"none":"blur(5px)", userSelect:canSee?"auto":"none", transition:"filter .3s" }}>{c.val}</div>
                    </div>
                  </div>
                  {canSee && (
                    <button className="btn btn-ghost btn-icon" style={{ flexShrink:0 }} onClick={()=>handleCopy(c.val, c.key)} title="Copy">
                      {copied===c.key ? <span style={{ color:T.green, fontSize:11, fontWeight:700 }}>✓</span> : I.copy}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {!canSee && <LockWall onUnlock={handleUnlock} credits={credits} />}
          </div>
        </div>

        {/* CTAs */}
        {!canSee && (
          <div style={{ marginTop:16, display:"flex", gap:10, flexWrap:"wrap" }}>
            {credits > 0
              ? <button className="btn btn-blue" style={{ flex:1, minWidth:160 }} onClick={handleUnlock}>Use 1 Free Unlock Today</button>
              : <button className="btn btn-blue" style={{ flex:1, minWidth:160 }} onClick={onUpgrade}>Get Unlimited — $10/mo</button>
            }
            <button className="btn btn-outline btn-sm" onClick={onUpgrade}>Buy 5 Unlocks — $3</button>
          </div>
        )}

        {/* Upgrade awareness banner — always visible for free users */}
        {!isPaid && (
          <div onClick={onUpgrade} style={{ marginTop:14, padding:"12px 16px", background:`linear-gradient(135deg,${T.accentL},#f0f4ff)`, border:`1.5px solid ${T.accentM}`, borderRadius:T.r, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}
            onMouseEnter={e=>e.currentTarget.style.background=`linear-gradient(135deg,#dbeafe,#e0e7ff)`}
            onMouseLeave={e=>e.currentTarget.style.background=`linear-gradient(135deg,${T.accentL},#f0f4ff)`}>
            <div>
              <div style={{ fontWeight:800, fontSize:13, color:T.accent, marginBottom:2 }}>🚀 Unlock full access</div>
              <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5 }}>
                Unlimited messages, contacts & more — <strong style={{ color:T.accent }}>$10/mo</strong> or <strong style={{ color:T.accent }}>5 unlocks for $3</strong>
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:T.accent, flexShrink:0, whiteSpace:"nowrap" }}>See plans →</div>
          </div>
        )}

        {/* Express Interest / Boost */}
        <div style={{ marginTop:16, display:"flex", gap:10, flexWrap:"wrap" }}>
          {isOwn ? (
            <>
              <button className="btn btn-blue" style={{ flex:1 }} onClick={()=>setShowBoostConfirm(true)}>
                ⭐ Boost Post — $5
              </button>
              <button className="btn btn-outline" style={{ flex:1 }} onClick={onClose}>
                Close
              </button>
              {/* Boost confirmation sheet */}
              {showBoostConfirm && (
                <div style={{ position:"fixed", inset:0, zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(20,18,16,.5)", backdropFilter:"blur(6px)" }} onClick={()=>setShowBoostConfirm(false)}>
                  <div className="mbox" style={{ borderRadius:`${T.r2} ${T.r2} 0 0`, maxWidth:520, width:"100%", padding:"28px 24px calc(28px + env(safe-area-inset-bottom,0px))", animation:"modal-in .28s cubic-bezier(.22,1,.36,1) both" }} onClick={e=>e.stopPropagation()}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:8 }}>⭐ Boost this post</div>
                    <p style={{ fontSize:13.5, color:T.ink3, lineHeight:1.7, marginBottom:16 }}>
                      Boosting pins your post to the <strong>top of the board</strong> and adds a Featured badge for 7 days, giving it 3–5× more visibility.
                    </p>
                    <div style={{ background:T.amberBg, border:`1px solid ${T.amber}44`, borderRadius:T.r, padding:"10px 14px", marginBottom:20, fontSize:12.5, color:T.amber, fontWeight:600 }}>
                      One-time fee of $5 · Charged via your saved payment method
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="btn btn-outline" style={{ flex:1 }} onClick={()=>setShowBoostConfirm(false)}>Cancel</button>
                      <button className="btn btn-blue" style={{ flex:2 }} onClick={()=>{ setShowBoostConfirm(false); onBoost&&onBoost(post); }}>Confirm — Boost for $5</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-green" style={{ flex:1 }} onClick={()=>{
                if (isGuest) { onRequireAuth&&onRequireAuth("express interest"); return; }
                if(onPropose){ onPropose(post); } else if(onMessage){ onMessage(post); onClose(); }
              }}>
                {I.check} Express Interest
              </button>

              {/* Message button — always shown, state-aware */}
              {isGuest ? (
                <button className="btn btn-ghost" style={{ color:T.ink3, border:`1px solid ${T.border}` }} onClick={()=>onRequireAuth&&onRequireAuth("send messages")}>
                  🔒 Message
                </button>
              ) : canSee ? (
                <button className="btn btn-blue" onClick={()=>{ onMessage(post); onClose(); }}>
                  {I.msg} Message
                </button>
              ) : (
                <button className="btn btn-outline" style={{ color:T.accent, borderColor:T.accentM, background:T.accentL, display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"8px 14px", lineHeight:1.2 }}
                  onClick={onUpgrade} title="Upgrade to message directly">
                  <span style={{ display:"flex", alignItems:"center", gap:5, fontWeight:700, fontSize:13 }}>{I.msg} Message</span>
                  <span style={{ fontSize:10, fontWeight:600, color:T.accent, opacity:.8 }}>Upgrade to unlock</span>
                </button>
              )}

              <button className="btn btn-ghost btn-icon" title="Report this post" onClick={()=>fire("🚩 Post reported. We'll review it shortly.")}>
                {I.flag}
              </button>
              <button className="btn btn-ghost btn-icon" title="Save" onClick={()=>{ onSave(post.id); }}>
                {I.heart(saved)}
              </button>
              <button className="btn btn-ghost btn-icon" title="Share this post" onClick={()=>{
                const text = `${post.title} — ${post.budget} ${post.budgetType} · Hired`;
                if (navigator.share) { navigator.share({ title: post.title, text }); }
                else { navigator.clipboard.writeText(text).then(()=>fire("🔗 Link copied to clipboard!")); }
              }}>
                {I.share}
              </button>
            </>
          )}
        </div>

        {/* Rating & reviews */}
        {post.rating && (
          <>
            <Dv my={20} />
            <div style={{ marginBottom:4 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Reviews</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:40, color:T.ink, lineHeight:1 }}>{post.rating}</div>
                <div>
                  <div style={{ display:"flex", gap:3, marginBottom:5 }}>
                    {[1,2,3,4,5].map(s=><span key={s}>{I.star(s<=Math.round(post.rating))}</span>)}
                  </div>
                  <div style={{ fontSize:13, color:T.ink3 }}>Based on {post.reviews} reviews</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Similar posts */}
        <Dv my={20} />
        <div>
          <div className="lbl" style={{ marginBottom:12 }}>Similar Posts</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(allPosts.length ? allPosts : POSTS_DATA).filter(p=>p.id!==post.id && (p.category===post.category||p.type===post.type)).slice(0,3).map(p=>(
              <div key={p.id} onClick={()=>{onClose(); setTimeout(()=>{ /* caller will handle */ },50);}}
                style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 14px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}`, cursor:"pointer", transition:"border-color .15s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <Av text={p.userAv} color={p.userColor} size={36} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
                  <div style={{ fontSize:12, color:T.ink3, marginTop:2 }}>{p.category} · {p.budget} {p.budgetType}</div>
                </div>
                <PostTypeBadge type={p.type} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── PRICING MODAL ─────────────────────────────────────────────────────────*/
/* ─── PAYMENT MODAL ─────────────────────────────────────────────────────────*/
const PaymentModal = ({ onClose, onSuccess }) => {
  const PLANS = [
    { k:"credits",  title:"5 Contact Unlocks", desc:"Use anytime, never expire",        price:"$3",  amount:3,  currency:"USD", best:false },
    { k:"monthly",  title:"Unlimited Monthly",  desc:"Unlimited unlocks + premium badge", price:"$10", amount:10, currency:"USD", best:true  },
    { k:"verified", title:"Verified Badge",      desc:"Blue tick on all your posts",       price:"$9",  amount:9,  currency:"USD", best:false },
  ];
  const METHODS = [
    { k:"card",    label:"Card",         icon:"💳", sub:"Visa / Mastercard"   },
    { k:"ecocash", label:"EcoCash",      icon:"🟢", sub:"Zimbabwe · USSD"      },
    { k:"mpesa",   label:"M-Pesa",       icon:"🔴", sub:"Kenya / Tanzania"     },
    { k:"mtn",     label:"MTN MoMo",     icon:"🟡", sub:"Ghana / Uganda / RW"  },
    { k:"paypal",  label:"PayPal",       icon:"🔵", sub:"Global"              },
    { k:"airtel",  label:"Airtel Money", icon:"⚫", sub:"Multiple countries"   },
  ];

  const [step,    setStep]    = useState("plan");   // plan | method | form | processing | success
  const [plan,    setPlan]    = useState("monthly");
  const [method,  setMethod]  = useState(null);
  const [receiptRef]          = useState(() => "HRD-" + Math.random().toString(36).slice(2,8).toUpperCase());

  // Card fields
  const [cardNum,  setCardNum]  = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry,   setExpiry]   = useState("");
  const [cvv,      setCvv]      = useState("");
  const [cardType, setCardType] = useState(null); // visa | mastercard

  // Mobile money fields
  const [phone,    setPhone]    = useState("");
  const [network,  setNetwork]  = useState("");
  const [pin,      setPin]      = useState("");

  // State
  const [errors,   setErrors]   = useState({});
  const [progress, setProgress] = useState(0);
  const [receipt,  setReceipt]  = useState(null);
  const [showCvv,  setShowCvv]  = useState(false);

  const selPlan = PLANS.find(p=>p.k===plan);
  const selMethod = METHODS.find(m=>m.k===method);

  // Card number formatting & type detection
  const fmtCard = (v) => {
    const d = v.replace(/\D/g,"").slice(0,16);
    if (d.startsWith("4")) setCardType("visa");
    else if (d.startsWith("5")||d.startsWith("2")) setCardType("mastercard");
    else setCardType(null);
    return d.replace(/(.{4})/g,"$1 ").trim();
  };
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length>2 ? d.slice(0,2)+"/"+d.slice(2) : d;
  };

  const validate = () => {
    const e = {};
    if (method==="card") {
      if (cardNum.replace(/\s/g,"").length < 16) e.cardNum = "Enter a valid 16-digit card number";
      if (!cardName.trim()) e.cardName = "Name required";
      if (expiry.length < 5) e.expiry = "Enter MM/YY";
      if (cvv.length < 3) e.cvv = "Enter 3-digit CVV";
    }
    if (["ecocash","mpesa","mtn","airtel"].includes(method)) {
      if (phone.replace(/\D/g,"").length < 9) e.phone = "Enter a valid phone number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const processPayment = () => {
    if (!validate()) return;
    setStep("processing");
    setProgress(0);
    const ticks = [10,25,45,60,78,90,100];
    let i = 0;
    const t = setInterval(()=>{
      setProgress(ticks[i]);
      i++;
      if (i>=ticks.length) {
        clearInterval(t);
        const ref = receiptRef;
        setReceipt({
          ref, plan: selPlan.title, amount: selPlan.price,
          method: selMethod.label, date: new Date().toLocaleString(),
          last4: method==="card" ? cardNum.replace(/\s/g,"").slice(-4) : null,
          phone: ["ecocash","mpesa","mtn","airtel"].includes(method) ? phone : null,
        });
        setStep("success");
      }
    }, 320);
  };

  const field = (label, value, onChange, opts={}) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11.5, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".5px", marginBottom:6 }}>{label}</div>
      <div style={{ position:"relative" }}>
        <input
          className="input"
          type={opts.type||"text"}
          placeholder={opts.placeholder||""}
          value={value}
          maxLength={opts.maxLength}
          inputMode={opts.inputMode}
          onChange={e=>{ onChange(e.target.value); if(errors[opts.key]) setErrors(er=>({...er,[opts.key]:undefined})); }}
          style={{ paddingRight: opts.icon ? 40 : undefined, borderColor: errors[opts.key] ? T.rose : undefined }}
        />
        {opts.icon && <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>{opts.icon}</div>}
      </div>
      {errors[opts.key] && <div style={{ fontSize:11.5, color:T.rose, marginTop:4 }}>⚠ {errors[opts.key]}</div>}
    </div>
  );

  return (
    <div className="mbg">
      <div className="mbox" style={{ maxWidth:500 }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        {step !== "success" && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              {(step==="method"||step==="form") && (
                <button onClick={()=>setStep(step==="form"?"method":"plan")} style={{ background:"none", border:"none", cursor:"pointer", color:T.ink3, display:"flex", alignItems:"center", gap:4, fontSize:13, fontFamily:"'Manrope',sans-serif", fontWeight:600 }}>
                  ← Back
                </button>
              )}
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20 }}>
                  {step==="plan"?"Choose a Plan":step==="method"?"Payment Method":step==="processing"?"Processing…":"Pay "+selPlan?.price}
                </div>
                {step==="form" && <div style={{ fontSize:12, color:T.ink4, marginTop:1 }}>{selMethod?.icon} {selMethod?.label} · {selPlan?.price}</div>}
              </div>
            </div>
            {step!=="processing" && (
              <button onClick={onClose} style={{ background:T.border, border:"none", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3 }}>{I.close}</button>
            )}
          </div>
        )}

        {/* STEP: Plan selection */}
        {step==="plan" && (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
              {PLANS.map(p=>(
                <div key={p.k} onClick={()=>setPlan(p.k)} style={{ padding:"16px 18px", border:`2px solid ${plan===p.k?T.accent:T.border}`, borderRadius:T.r2, cursor:"pointer", transition:"all .15s", background:plan===p.k?T.accentL:T.white, display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative" }}>
                  {p.best && <div style={{ position:"absolute", top:-10, right:14, background:T.accent, color:"#fff", padding:"2px 12px", borderRadius:99, fontSize:10, fontWeight:700 }}>Best Value</div>}
                  <div>
                    <div style={{ fontWeight:700, fontSize:14.5, marginBottom:3 }}>{p.title}</div>
                    <div style={{ fontSize:12.5, color:T.ink3 }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0, marginLeft:12 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:plan===p.k?T.accent:T.ink }}>{p.price}</div>
                    {p.k==="monthly" && <div style={{ fontSize:11, color:T.ink4 }}>/month</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 14px", marginBottom:22 }}>
              {["1 free unlock/day always","5 unlocks pack — $3","$10/mo unlimited","Post free — both sides","Verified badge — $9","Featured boost available"].map(f=>(
                <div key={f} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:T.greenBg, color:T.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10, marginTop:1 }}>✓</div>
                  <span style={{ fontSize:12, color:T.ink2, lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-blue" style={{ width:"100%", padding:"13px", fontSize:15 }} onClick={()=>setStep("method")}>
              Continue → {selPlan?.price}
            </button>
            <div style={{ textAlign:"center", marginTop:10, fontSize:11.5, color:T.ink4 }}>🔒 256-bit encryption · Cancel anytime</div>
          </>
        )}

        {/* STEP: Method selection */}
        {step==="method" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
              {METHODS.map(m=>(
                <div key={m.k} onClick={()=>{ setMethod(m.k); setStep("form"); }} style={{ padding:"16px 14px", border:`2px solid ${method===m.k?T.accent:T.border}`, borderRadius:T.r2, cursor:"pointer", transition:"all .15s", background:method===m.k?T.accentL:T.white, display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center" }}
                  onMouseEnter={e=>{ if(method!==m.k) e.currentTarget.style.borderColor=T.accentM; }}
                  onMouseLeave={e=>{ if(method!==m.k) e.currentTarget.style.borderColor=T.border; }}>
                  <div style={{ fontSize:28 }}>{m.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5 }}>{m.label}</div>
                    <div style={{ fontSize:11, color:T.ink3, marginTop:2 }}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center", fontSize:11.5, color:T.ink4 }}>🔒 All payments encrypted end-to-end</div>
          </>
        )}

        {/* STEP: Payment form */}
        {step==="form" && (
          <>
            {/* CARD */}
            {method==="card" && (
              <div>
                {/* Card preview */}
                <div style={{ background:`linear-gradient(135deg,${T.accent},#1e40af)`, borderRadius:T.r2, padding:"22px 22px 18px", marginBottom:20, color:"#fff", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:-20, top:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,.07)" }} />
                  <div style={{ position:"absolute", right:30, bottom:-30, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.05)" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
                    <div style={{ fontFamily:"monospace", fontSize:11, opacity:.7, letterSpacing:"1px" }}>HIRED PAY</div>
                    <div style={{ fontSize:22 }}>
                      {cardType==="visa" ? "💳 VISA" : cardType==="mastercard" ? "🔴🟡 MC" : "💳"}
                    </div>
                  </div>
                  <div style={{ fontFamily:"monospace", fontSize:18, letterSpacing:"3px", marginBottom:16, minHeight:28 }}>
                    {cardNum || "•••• •••• •••• ••••"}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:9, opacity:.6, textTransform:"uppercase", letterSpacing:".8px" }}>Card Holder</div>
                      <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{cardName||"YOUR NAME"}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:9, opacity:.6, textTransform:"uppercase", letterSpacing:".8px" }}>Expires</div>
                      <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{expiry||"MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {field("Card Number", cardNum, v=>setCardNum(fmtCard(v)), { key:"cardNum", placeholder:"1234 5678 9012 3456", inputMode:"numeric", maxLength:19, icon: cardType==="visa"?"💳":cardType==="mastercard"?"🔴":null })}
                {field("Cardholder Name", cardName, setCardName, { key:"cardName", placeholder:"As it appears on card" })}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".5px", marginBottom:6 }}>Expiry</div>
                    <input className="input" placeholder="MM/YY" value={expiry} maxLength={5} inputMode="numeric" onChange={e=>{ setExpiry(fmtExpiry(e.target.value)); if(errors.expiry) setErrors(er=>({...er,expiry:undefined})); }} style={{ borderColor:errors.expiry?T.rose:undefined }} />
                    {errors.expiry && <div style={{ fontSize:11.5, color:T.rose, marginTop:4 }}>⚠ {errors.expiry}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:11.5, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".5px", marginBottom:6 }}>CVV</div>
                    <div style={{ position:"relative" }}>
                      <input className="input" placeholder="•••" value={cvv} type={showCvv?"text":"password"} maxLength={4} inputMode="numeric" onChange={e=>{ setCvv(e.target.value.replace(/\D/g,"")); if(errors.cvv) setErrors(er=>({...er,cvv:undefined})); }} style={{ paddingRight:40, borderColor:errors.cvv?T.rose:undefined }} />
                      <button onClick={()=>setShowCvv(v=>!v)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:T.ink3 }}>{showCvv?"🙈":"👁"}</button>
                    </div>
                    {errors.cvv && <div style={{ fontSize:11.5, color:T.rose, marginTop:4 }}>⚠ {errors.cvv}</div>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:6, marginBottom:20 }}>
                  {["🔒 SSL Encrypted","✓ No card stored","✓ PCI Compliant"].map(b=>(
                    <span key={b} style={{ fontSize:10.5, color:T.ink4, background:T.bg, padding:"3px 8px", borderRadius:99, border:`1px solid ${T.border}` }}>{b}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ECOCASH */}
            {method==="ecocash" && (
              <div style={{ marginBottom:20 }}>
                <div style={{ background:"linear-gradient(135deg,#16a34a,#15803d)", borderRadius:T.r2, padding:20, color:"#fff", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:48 }}>🟢</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18 }}>EcoCash</div>
                    <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>Zimbabwe's leading mobile money</div>
                    <div style={{ fontSize:13, fontWeight:700, marginTop:6 }}>ZWL equivalent of {selPlan?.price}</div>
                  </div>
                </div>
                {field("EcoCash Number", phone, setPhone, { key:"phone", placeholder:"e.g. 0771 234 567", inputMode:"tel" })}
                <div style={{ padding:"12px 14px", background:T.amberBg, border:`1px solid ${T.amber}33`, borderRadius:T.r, marginBottom:14 }}>
                  <div style={{ fontSize:12.5, color:T.amber, fontWeight:600, marginBottom:4 }}>How it works</div>
                  <div style={{ fontSize:12, color:T.ink2, lineHeight:1.6 }}>1. Enter your EcoCash number<br/>2. You'll receive a USSD prompt<br/>3. Enter your EcoCash PIN to confirm<br/>4. Access unlocks instantly</div>
                </div>
              </div>
            )}

            {/* M-PESA */}
            {method==="mpesa" && (
              <div style={{ marginBottom:20 }}>
                <div style={{ background:"linear-gradient(135deg,#dc2626,#b91c1c)", borderRadius:T.r2, padding:20, color:"#fff", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:48 }}>🔴</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18 }}>M-Pesa</div>
                    <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>Safaricom · Kenya & Tanzania</div>
                    <div style={{ fontSize:13, fontWeight:700, marginTop:6 }}>KES equivalent of {selPlan?.price}</div>
                  </div>
                </div>
                {field("Safaricom Number", phone, setPhone, { key:"phone", placeholder:"e.g. 0712 345 678", inputMode:"tel" })}
                <div style={{ padding:"12px 14px", background:"rgba(220,38,38,.06)", border:"1px solid rgba(220,38,38,.15)", borderRadius:T.r, marginBottom:14 }}>
                  <div style={{ fontSize:12.5, color:"#dc2626", fontWeight:600, marginBottom:4 }}>STK Push</div>
                  <div style={{ fontSize:12, color:T.ink2, lineHeight:1.6 }}>1. Enter your M-Pesa number<br/>2. An STK push will be sent to your phone<br/>3. Enter your M-Pesa PIN to confirm<br/>4. You'll get an SMS confirmation</div>
                </div>
              </div>
            )}

            {/* MTN MOMO */}
            {method==="mtn" && (
              <div style={{ marginBottom:20 }}>
                <div style={{ background:"linear-gradient(135deg,#ca8a04,#a16207)", borderRadius:T.r2, padding:20, color:"#fff", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:48 }}>🟡</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18 }}>MTN Mobile Money</div>
                    <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>Ghana · Uganda · Rwanda · Cameroon</div>
                    <div style={{ fontSize:13, fontWeight:700, marginTop:6 }}>{selPlan?.price} equivalent</div>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11.5, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".5px", marginBottom:6 }}>Country</div>
                  <select className="input" value={network} onChange={e=>setNetwork(e.target.value)}>
                    <option value="">Select your country</option>
                    {["Ghana (GHS)","Uganda (UGX)","Rwanda (RWF)","Cameroon (XAF)","Ivory Coast (XOF)"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                {field("MTN Number", phone, setPhone, { key:"phone", placeholder:"e.g. 024 123 4567", inputMode:"tel" })}
              </div>
            )}

            {/* AIRTEL */}
            {method==="airtel" && (
              <div style={{ marginBottom:20 }}>
                <div style={{ background:"linear-gradient(135deg,#111827,#1f2937)", borderRadius:T.r2, padding:20, color:"#fff", marginBottom:20, display:"flex", alignItems:"center", gap:16 }}>
                  <div style={{ fontSize:48 }}>⚫</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:18 }}>Airtel Money</div>
                    <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>Kenya · Tanzania · Uganda · Zambia</div>
                    <div style={{ fontSize:13, fontWeight:700, marginTop:6 }}>{selPlan?.price} equivalent</div>
                  </div>
                </div>
                {field("Airtel Number", phone, setPhone, { key:"phone", placeholder:"e.g. 0733 123 456", inputMode:"tel" })}
              </div>
            )}

            {/* PAYPAL */}
            {method==="paypal" && (
              <div style={{ marginBottom:20 }}>
                <div style={{ background:"linear-gradient(135deg,#003087,#009cde)", borderRadius:T.r2, padding:24, color:"#fff", marginBottom:20, textAlign:"center" }}>
                  <div style={{ fontSize:48, marginBottom:8 }}>🔵</div>
                  <div style={{ fontWeight:800, fontSize:22, marginBottom:4 }}>PayPal</div>
                  <div style={{ fontSize:13, opacity:.85 }}>You'll be redirected to PayPal to complete your {selPlan?.price} payment securely.</div>
                </div>
                <div style={{ padding:"14px 16px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}`, marginBottom:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:13, color:T.ink3 }}>Plan</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{selPlan?.title}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:T.ink3 }}>Total</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:T.accent }}>{selPlan?.price}</span>
                  </div>
                </div>
              </div>
            )}

            <button className="btn btn-blue" style={{ width:"100%", padding:"14px", fontSize:15, marginBottom:10 }} onClick={processPayment}>
              {method==="paypal" ? "Continue to PayPal →" : method==="card" ? `Pay ${selPlan?.price} Securely` : `Send Payment Request`}
            </button>
            <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
              {["🔒 Encrypted","✓ Instant","✓ No hidden fees"].map(b=>(
                <span key={b} style={{ fontSize:11, color:T.ink4 }}>{b}</span>
              ))}
            </div>
          </>
        )}

        {/* STEP: Processing */}
        {step==="processing" && (
          <div style={{ textAlign:"center", padding:"32px 0" }}>
            <div style={{ fontSize:52, marginBottom:20, animation:"spin 1.5s linear infinite", display:"inline-block" }}>⚙️</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8 }}>Processing Payment</div>
            <div style={{ fontSize:13.5, color:T.ink3, marginBottom:28 }}>
              {method==="card" ? "Authorising your card…" : method==="paypal" ? "Connecting to PayPal…" : "Waiting for mobile confirmation…"}
            </div>
            {/* Progress bar */}
            <div style={{ height:6, background:T.border, borderRadius:99, overflow:"hidden", marginBottom:10 }}>
              <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${T.accent},#06b6d4)`, borderRadius:99, transition:"width .35s ease" }} />
            </div>
            <div style={{ fontSize:12, color:T.ink4 }}>{progress}%</div>
            {method!=="card" && method!=="paypal" && (
              <div style={{ marginTop:20, padding:"12px 16px", background:T.amberBg, borderRadius:T.r, border:`1px solid ${T.amber}33` }}>
                <div style={{ fontSize:12.5, color:T.amber, fontWeight:600 }}>📱 Check your phone</div>
                <div style={{ fontSize:12, color:T.ink2, marginTop:4 }}>A payment prompt has been sent to {phone}. Please confirm with your PIN.</div>
              </div>
            )}
          </div>
        )}

        {/* STEP: Success */}
        {step==="success" && receipt && (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:T.greenBg, border:`2px solid ${T.green}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:32 }}>✅</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:6 }}>Payment Successful!</div>
            <div style={{ fontSize:14, color:T.ink3, marginBottom:24 }}>Your {receipt.plan} is now active.</div>

            {/* Receipt card */}
            <div style={{ background:T.bg, borderRadius:T.r2, border:`1px solid ${T.border}`, padding:"18px 20px", marginBottom:22, textAlign:"left" }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".7px", marginBottom:14 }}>Receipt</div>
              {[
                ["Reference",  receipt.ref],
                ["Plan",       receipt.plan],
                ["Amount",     receipt.amount],
                ["Method",     `${selMethod?.icon} ${receipt.method}`],
                receipt.last4 ? ["Card", `•••• •••• •••• ${receipt.last4}`] : null,
                receipt.phone ? ["Phone", receipt.phone] : null,
                ["Date",       receipt.date],
                ["Status",     "✅ Confirmed"],
              ].filter(Boolean).map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}`, fontSize:13 }}>
                  <span style={{ color:T.ink3 }}>{k}</span>
                  <span style={{ fontWeight:600, color:T.ink, fontFamily:k==="Reference"?"monospace":"inherit" }}>{v}</span>
                </div>
              ))}
            </div>

            <button className="btn btn-blue" style={{ width:"100%", padding:"13px", marginBottom:10 }} onClick={()=>{ onSuccess(); onClose(); }}>
              🎉 Start Using Premium
            </button>
            <button className="btn btn-ghost btn-sm" style={{ width:"100%" }} onClick={()=>{
              const txt = `Hired Payment Receipt\n${Object.entries({Reference:receipt.ref,Plan:receipt.plan,Amount:receipt.amount,Method:receipt.method,Date:receipt.date}).map(([k,v])=>`${k}: ${v}`).join("\n")}`;
              navigator.clipboard?.writeText(txt).catch(()=>{});
            }}>📋 Copy Receipt</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── POST MODAL ────────────────────────────────────────────────────────────*/
const PostModal = ({ onClose, onSuccess }) => {
  const DRAFT_KEY = "hired_post_draft";
  const savedDraft = (() => { try { return JSON.parse(localStorage.getItem(DRAFT_KEY)||"null"); } catch { return null; } })();

  const [type, setType] = useState(savedDraft?.type||"need");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(savedDraft?.form||{ title:"", category:"Technology", desc:"", workType:"Remote", country:"", tags:"", amount:"", currency:"USD $", per:"Fixed" });
  const [hasDraft, setHasDraft] = useState(!!savedDraft);
  const STEPS = ["Type","Details","Pricing","Publish"];
  const N = STEPS.length;

  const set = (k,v) => {
    setForm(f => {
      const next = {...f,[k]:v};
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ type, form:next }));
      return next;
    });
  };

  const clearDraft = () => { localStorage.removeItem(DRAFT_KEY); setHasDraft(false); };

  const canNext = () => {
    if (step===1) return true;
    if (step===2) return form.title.length > 3 && form.desc.length > 10;
    if (step===3) return form.amount.length > 0;
    return true;
  };

  const validationHint = () => {
    if (step===2 && form.title.length <= 3 && form.title.length > 0) return "Title needs to be a bit longer";
    if (step===2 && form.desc.length <= 10 && form.desc.length > 0) return "Add more detail to your description";
    if (step===2 && !form.title) return "Enter a title to continue";
    if (step===3 && !form.amount) return "Enter a budget amount to continue";
    return null;
  };

  return (
    <div className="mbg" onClick={onClose}>
      <div className="mbox" style={{ maxWidth:580 }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:T.border, border:"none", borderRadius:"50%", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3 }}>{I.close}</button>

        {/* Draft restored banner */}
        {hasDraft && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:T.amberBg, border:`1px solid ${T.amber}33`, borderRadius:T.r, padding:"9px 14px", marginBottom:16 }}>
            <span style={{ fontSize:12.5, color:T.amber, fontWeight:600 }}>📝 Draft restored from your last session</span>
            <button onClick={()=>{ setForm({ title:"", category:"Technology", desc:"", workType:"Remote", country:"", tags:"", amount:"", currency:"USD $", per:"Fixed" }); setType("need"); clearDraft(); }} style={{ fontSize:11, color:T.amber, background:"none", border:"none", cursor:"pointer", fontFamily:"'Manrope',sans-serif", fontWeight:700, textDecoration:"underline" }}>Discard</button>
          </div>
        )}

        {/* Progress */}
        <div style={{ marginBottom:26 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22 }}>Post on Hired</div>
            <div className="lbl">{step} / {N}</div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {STEPS.map((_,i)=>(
              <div key={i} className={`step-dot${i<step?" on":""}`} style={{ flex:i===step-1?1:undefined }} />
            ))}
          </div>
        </div>

        {/* Step 1 */}
        {step===1 && (
          <div className="u">
            <div style={{ fontSize:14, color:T.ink3, marginBottom:20 }}>What are you posting?</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
              {[
                { v:"need", title:"I Need Work Done", desc:"Post a task or project and receive proposals", color:T.rose, bg:T.roseBg, icon:"🎯" },
                { v:"offer", title:"I Offer a Service", desc:"Post what you do and attract clients to you", color:T.teal, bg:T.tealBg, icon:"✨" },
              ].map(o=>(
                <div key={o.v} onClick={()=>setType(o.v)} style={{ padding:"22px 18px", border:`2px solid ${type===o.v?o.color:T.border}`, borderRadius:T.r2, cursor:"pointer", transition:"all .18s", background:type===o.v?o.bg:T.white, textAlign:"center" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{o.icon}</div>
                  <div style={{ fontWeight:700, fontSize:14.5, marginBottom:6 }}>{o.title}</div>
                  <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55 }}>{o.desc}</div>
                  {type===o.v && <div style={{ marginTop:10, width:20, height:20, borderRadius:"50%", background:o.color, margin:"10px auto 0", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>{I.check}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step===2 && (
          <div className="u">
            <div style={{ fontSize:14, color:T.ink3, marginBottom:20 }}>
              {type==="need" ? "Describe the work you need done" : "Describe the service you offer"}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label className="lbl" style={{ display:"block", marginBottom:6 }}>Title *</label>
                <input className="input" placeholder={type==="need" ? "e.g. Need a logo designer for my startup" : "e.g. Professional logo design & brand identity"}
                  value={form.title} onChange={e=>set("title",e.target.value)} />
                <div style={{ fontSize:11.5, color:T.ink4, marginTop:4 }}>{form.title.length}/100 characters</div>
              </div>
              <div>
                <label className="lbl" style={{ display:"block", marginBottom:6 }}>Category *</label>
                <select className="input" value={form.category} onChange={e=>set("category",e.target.value)}>
                  {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="lbl" style={{ display:"block", marginBottom:6 }}>Description *</label>
                <textarea className="input" rows={4}
                  placeholder={type==="need" ? "Describe your project, requirements, skills needed, and timeline…" : "Describe your service, experience, tools you use, and what clients get…"}
                  value={form.desc} onChange={e=>set("desc",e.target.value)} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label className="lbl" style={{ display:"block", marginBottom:6 }}>Work Type *</label>
                  <select className="input" value={form.workType} onChange={e=>set("workType",e.target.value)}>
                    <option>Remote</option><option>On-site</option><option>Hybrid</option><option>Relocate</option>
                  </select>
                </div>
                <div>
                  <label className="lbl" style={{ display:"block", marginBottom:6 }}>Country *</label>
                  <input className="input" placeholder="e.g. Nigeria" value={form.country} onChange={e=>set("country",e.target.value)} />
                </div>
              </div>
              <div>
                <label className="lbl" style={{ display:"block", marginBottom:6 }}>Skills / Tags</label>
                <input className="input" placeholder="React, Design, Writing (comma separated)" value={form.tags} onChange={e=>set("tags",e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step===3 && (
          <div className="u">
            <div style={{ fontSize:14, color:T.ink3, marginBottom:20 }}>
              {type==="need" ? "What is your budget?" : "What do you charge?"}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <div>
                  <label className="lbl" style={{ display:"block", marginBottom:6 }}>Amount *</label>
                  <input className="input" placeholder="500" type="number" min="0" value={form.amount} onChange={e=>set("amount",e.target.value)} />
                </div>
                <div>
                  <label className="lbl" style={{ display:"block", marginBottom:6 }}>Currency</label>
                  <select className="input" value={form.currency} onChange={e=>set("currency",e.target.value)}>
                    <option>USD $</option><option>EUR €</option><option>GBP £</option><option>NGN ₦</option><option>GHS ₵</option><option>KES KSh</option><option>ZAR R</option><option>AED د.إ</option>
                  </select>
                </div>
                <div>
                  <label className="lbl" style={{ display:"block", marginBottom:6 }}>Per</label>
                  <select className="input" value={form.per} onChange={e=>set("per",e.target.value)}>
                    <option>Fixed</option><option>/ hr</option><option>/ day</option><option>/ mo</option><option>/ project</option><option>/ video</option><option>/ track</option>
                  </select>
                </div>
              </div>

              {form.amount && (
                <div style={{ padding:"14px 16px", background:T.accentL, borderRadius:T.r, border:`1px solid ${T.accentM}`, display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ fontSize:28, fontFamily:"'Playfair Display',serif", color:T.accent }}>{form.currency.split(" ")[1]||"$"}{form.amount}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13, color:T.accent }}>Your listed rate</div>
                    <div style={{ fontSize:12.5, color:T.ink3 }}>{form.per==="Fixed"?"One-time payment":form.per+" rate"}</div>
                  </div>
                </div>
              )}

              <div>
                <label className="lbl" style={{ display:"block", marginBottom:12 }}>Optional Boosts</label>
                {[
                  { t:"Featured Post", d:"Pin to top of feed for 7 days — get 3× more visibility", p:"$5", icon:"⚡" },
                  { t:"Verified Badge", d:"Blue tick on your profile and all posts — build trust", p:"$9", icon:"✓" },
                ].map(o=>(
                  <label key={o.t} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", border:`1.5px solid ${T.border}`, borderRadius:T.r, cursor:"pointer", marginBottom:8 }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:18 }}>{o.icon}</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13.5 }}>{o.t}</div>
                        <div style={{ fontSize:12, color:T.ink3 }}>{o.d}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                      <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:T.accent }}>{o.p}</span>
                      <input type="checkbox" style={{ accentColor:T.accent, width:16, height:16 }} />
                    </div>
                  </label>
                ))}
              </div>

              <div style={{ padding:"12px 14px", background:T.greenBg, borderRadius:T.r, border:`1px solid ${T.green}33` }}>
                <div style={{ fontWeight:700, fontSize:12.5, color:T.green }}>✅ Basic posting is always free</div>
                <div style={{ fontSize:12, color:T.ink3, marginTop:3 }}>Boosts are optional and help you get discovered faster.</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step===4 && (
          <div className="u" style={{ textAlign:"center", padding:"20px 0 10px" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,"+T.accentL+","+T.greenBg+")", border:`2px solid ${T.accent}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", color:T.accent }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:10 }}>Ready to Publish!</div>
            <div style={{ color:T.ink3, fontSize:14, lineHeight:1.8, maxWidth:360, margin:"0 auto 28px" }}>
              Your post will be live immediately and visible to everyone on Hired across 94+ countries.
            </div>
            {form.title && (
              <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:T.r, padding:"14px 18px", marginBottom:24, textAlign:"left" }}>
                <div className="lbl" style={{ marginBottom:6 }}>Preview</div>
                <div style={{ fontWeight:700, marginBottom:3 }}>{form.title}</div>
                <div style={{ fontSize:13, color:T.ink3, display:"flex", gap:10, flexWrap:"wrap" }}>
                  <PostTypeBadge type={type} />
                  <WorkTypeBadge type={form.workType} />
                  {form.amount && <span style={{ fontFamily:"'Playfair Display',serif", fontSize:14, color:T.ink }}>${form.amount} {form.per}</span>}
                </div>
              </div>
            )}
            <button className="btn btn-blue" style={{ padding:"13px 48px", fontSize:15 }} onClick={()=>onSuccess({ ...form, type })}>
              Publish Now 🚀
            </button>
            <div style={{ marginTop:12, fontSize:12.5, color:T.ink4 }}>You can edit or remove your post anytime from your dashboard</div>
          </div>
        )}

        {step < N && (
          <>
            <Dv my={24} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <button className="btn btn-ghost" onClick={()=>setStep(s=>Math.max(1,s-1))} style={{ opacity:step===1?.3:1, pointerEvents:step===1?"none":"all" }}>
                {I.back} Back
              </button>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                {!canNext() && validationHint() && (
                  <div style={{ fontSize:11.5, color:T.amber, fontWeight:600, textAlign:"right" }}>⚠ {validationHint()}</div>
                )}
                <button className="btn btn-blue" onClick={()=>canNext()&&setStep(s=>Math.min(N,s+1))} style={{ opacity:canNext()?1:.55 }}>
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── AI MATCH CARD ──────────────────────────────────────────────────────────*/
const AiMatchCard = ({ onPostOpen, savedIds, onSave, allPosts=[] }) => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    const profileName = localStorage.getItem("hired_profile_name") || "User";
    try {
      const profileSkills = (() => { try { return JSON.parse(localStorage.getItem("hired_profile_skills")||"[]").join(", "); } catch { return ""; } })();
      const profileBio = localStorage.getItem("hired_profile_bio") || "";
      const profile = `${profileName}${profileSkills ? ` — ${profileSkills}` : ""}${profileBio ? `. ${profileBio.slice(0,100)}` : ""}`;
      const postList = allPosts.slice(0,10).map(p=>`[${p.id}] ${p.title} (${p.category}, ${p.budget})`).join("\n");
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:300,
          system:"Return ONLY a JSON array of 3 objects with keys: id (number), reason (string, max 10 words). No markdown, no extra text.",
          messages:[{ role:"user", content:`Profile: ${profile}\n\nPosts:\n${postList}\n\nReturn top 3 matching post IDs with reason.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(text);
      setMatches(parsed);
    } catch { setMatches(allPosts.slice(0,3).map(p=>({id:p.id,reason:"Matches your skills & category"}))); }
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding:20, background:"linear-gradient(135deg,#EDE9FE,#F3F4F6)" }}>
      <div className="lbl" style={{ marginBottom:10, color:T.purple, display:"flex", alignItems:"center", gap:5 }}>
        {I.spark} AI Matching
      </div>
      {!matches && !loading && (
        <>
          <div style={{ fontSize:13, color:T.ink3, lineHeight:1.6, marginBottom:14 }}>Posts matched to your profile & saved posts</div>
          <button className="btn btn-sm" style={{ background:T.purple, color:"#fff", width:"100%" }} onClick={fetchMatches}>Find Matches</button>
        </>
      )}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[1,2,3].map(i=><div key={i} className="skel" style={{ height:38, borderRadius:8 }} />)}
        </div>
      )}
      {matches && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {matches.map(m=>{
            const p = allPosts.find(x=>x.id===m.id) || POSTS_DATA.find(x=>x.id===m.id);
            if (!p) return null;
            return (
              <div key={m.id} onClick={()=>onPostOpen(p)} style={{ padding:"10px 12px", background:"rgba(255,255,255,.7)", borderRadius:8, cursor:"pointer", border:`1px solid ${T.border}`, backdropFilter:"blur(4px)" }}
                onMouseEnter={e=>e.currentTarget.style.background="#fff"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.7)"}>
                <div style={{ fontWeight:600, fontSize:12.5, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
                <div style={{ fontSize:11.5, color:T.purple }}>{m.reason}</div>
              </div>
            );
          })}
          <button className="btn btn-ghost btn-xs" onClick={()=>setMatches(null)} style={{ width:"100%", marginTop:4 }}>Refresh</button>
        </div>
      )}
    </div>
  );
};

/* ─── COMPOSE MESSAGE MODAL ─────────────────────────────────────────────────*/
/* ─── ONBOARDING MODAL ───────────────────────────────────────────────────────*/
/* ─── SESSION REGISTRY ──────────────────────────────────────────────────────
   localStorage key: hired_sessions → array of session objects
   hired_uid → this browser's persistent user id
────────────────────────────────────────────────────────────────────────────*/
const SR = {
  KEY: "hired_sessions",
  UID: "hired_uid",
  _read() { try { return JSON.parse(localStorage.getItem(this.KEY)||"[]"); } catch { return []; } },
  _write(s) { try { localStorage.setItem(this.KEY,JSON.stringify(s)); } catch {} },
  _uid() {
    let id = localStorage.getItem(this.UID);
    if (!id) { id = "u_"+Math.random().toString(36).slice(2,10); localStorage.setItem(this.UID,id); }
    return id;
  },
  register(name, role) {
    const uid = this._uid();
    const all = this._read();
    const device = /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
    const browser = navigator.userAgent.includes("Firefox") ? "Firefox" : navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Safari") ? "Safari" : "Other";
    const existing = all.find(s => s.id === uid);
    if (existing) {
      existing.lastSeen = Date.now(); existing.online = true;
      existing.sessions = (existing.sessions||1)+1;
      if (name) existing.name = name; if (role) existing.role = role;
    } else {
      all.push({ id:uid, name:name||"Anonymous", role:role||"visitor", joinedAt:Date.now(), lastSeen:Date.now(), online:true, device, browser, sessions:1, pageViews:1, actions:[], plan:"Free", status:"active", badge:false, country:"🌐" });
    }
    this._write(all); return uid;
  },
  heartbeat() {
    const uid = localStorage.getItem(this.UID); if (!uid) return;
    const all = this._read(); const s = all.find(x=>x.id===uid);
    if (s) { s.lastSeen=Date.now(); s.online=true; this._write(all); }
  },
  markOffline() {
    const uid = localStorage.getItem(this.UID); if (!uid) return;
    const all = this._read(); const s = all.find(x=>x.id===uid);
    if (s) { s.online=false; s.lastSeen=Date.now(); this._write(all); }
  },
  logAction(type, detail) {
    const uid = localStorage.getItem(this.UID); if (!uid) return;
    const all = this._read(); const s = all.find(x=>x.id===uid);
    if (s) { if (!s.actions) s.actions=[]; s.actions.unshift({type,detail,at:Date.now()}); s.actions=s.actions.slice(0,20); s.lastSeen=Date.now(); this._write(all); }
  },
  getAll() {
    const all = this._read(); const now = Date.now(); let ch=false;
    all.forEach(s=>{ if(s.online && now-s.lastSeen>120000){s.online=false;ch=true;} });
    if(ch) this._write(all); return all;
  },
  onlineCount() { return this.getAll().filter(s=>s.online).length; },
};

/* ─── AUTH HELPERS ───────────────────────────────────────────────────────────*/
const AUTH_KEY = "hired_accounts";
const AUTH_SESSION = "hired_session";

const getAccounts = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)||"[]"); } catch { return []; } };
const saveAccounts = (accounts) => localStorage.setItem(AUTH_KEY, JSON.stringify(accounts));
const getSession = () => { try { return JSON.parse(localStorage.getItem(AUTH_SESSION)||"null"); } catch { return null; } };
const saveSession = (user) => localStorage.setItem(AUTH_SESSION, JSON.stringify(user));
const clearSession = () => localStorage.removeItem(AUTH_SESSION);

/* ─── GUEST PROMPT ───────────────────────────────────────────────────────────*/
const GUEST_PROMPTS = {
  "post a job or service":  { icon:"✍️", title:"Post on Hired",        desc:"Reach thousands of clients and freelancers across 94+ countries. Free to post.", grad:"linear-gradient(135deg,#1A56DB,#6366F1)" },
  "send messages":          { icon:"💬", title:"Start a Conversation",  desc:"Message directly. No middleman, no delays. Real connections, real work.", grad:"linear-gradient(135deg,#0891B2,#6366F1)" },
  "send a message":         { icon:"💬", title:"Start a Conversation",  desc:"Message directly. No middleman, no delays. Real connections, real work.", grad:"linear-gradient(135deg,#0891B2,#6366F1)" },
  "express interest":       { icon:"🤝", title:"Express Your Interest", desc:"Let the poster know you're the right fit. One tap, zero friction.", grad:"linear-gradient(135deg,#059669,#0891B2)" },
  "send a proposal":        { icon:"🚀", title:"Send a Proposal",       desc:"Pitch your skills directly and land your next opportunity.", grad:"linear-gradient(135deg,#7C3AED,#1A56DB)" },
  "save posts":             { icon:"🔖", title:"Save Opportunities",    desc:"Bookmark posts you like and come back to them anytime.", grad:"linear-gradient(135deg,#DB2777,#EA580C)" },
  "access this page":       { icon:"🔐", title:"Members Only",          desc:"This section is for registered users. Join free in under a minute.", grad:"linear-gradient(135deg,#1A56DB,#0891B2)" },
  "unlock contact details": { icon:"🔓", title:"Unlock Contact Info",   desc:"See full details and start working together today.", grad:"linear-gradient(135deg,#EA580C,#F97316)" },
  "default":                { icon:"🌍", title:"Join Hired Free",       desc:"The global work marketplace. Post work, find talent, get hired.", grad:"linear-gradient(135deg,#1A56DB,#7C3AED)" },
};

const GuestPrompt = ({ reason, onSignIn, onDismiss }) => {
  const p = GUEST_PROMPTS[reason] || GUEST_PROMPTS["default"];
  const PERKS = ["Free to join — no credit card", "Post work or offer services", "Connect across 94+ countries", "1 free unlock daily"];
  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(10,8,6,.6)", backdropFilter:"blur(14px)", zIndex:210, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 16px" }}
      onClick={onDismiss}
    >
      <div
        style={{ width:"min(380px,100%)", background:T.white, borderRadius:24, overflow:"hidden", boxShadow:"0 24px 64px rgba(20,18,16,.32)", animation:"modal-in .28s cubic-bezier(.22,1,.36,1) both", position:"relative" }}
        onClick={e=>e.stopPropagation()}
      >
        {/* Dismiss */}
        {onDismiss && (
          <button onClick={onDismiss} style={{ position:"absolute", top:12, right:12, zIndex:10, width:30, height:30, borderRadius:"50%", background:"rgba(0,0,0,.18)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:14, lineHeight:1 }}>✕</button>
        )}

        {/* Compact gradient header */}
        <div style={{ background:p.grad, padding:"28px 24px 24px", position:"relative", overflow:"hidden", textAlign:"center" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.09)", pointerEvents:"none" }} />
          <div style={{ fontSize:36, marginBottom:8 }}>{p.icon}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:"#fff", fontWeight:700, marginBottom:6 }}>{p.title}</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.82)", lineHeight:1.55 }}>{p.desc}</div>
        </div>

        {/* Perks + CTAs */}
        <div style={{ padding:"18px 20px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 10px", marginBottom:18 }}>
            {PERKS.map(perk=>(
              <div key={perk} style={{ display:"flex", alignItems:"flex-start", gap:7 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:T.accentL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10, color:T.accent, fontWeight:800, marginTop:1 }}>✓</div>
                <span style={{ fontSize:12, color:T.ink3, fontWeight:500, lineHeight:1.4 }}>{perk}</span>
              </div>
            ))}
          </div>
          <button
            onClick={()=>onSignIn("signup")}
            style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:p.grad, color:"#fff", fontFamily:"'Manrope',sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", boxShadow:`0 6px 18px rgba(26,86,219,.3)`, marginBottom:8, letterSpacing:".1px" }}
          >
            Create Free Account 🎉
          </button>
          <button
            onClick={()=>onSignIn("login")}
            style={{ width:"100%", padding:"11px", borderRadius:12, border:`1.5px solid ${T.border}`, background:"transparent", color:T.ink2, fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer" }}
          >
            I have an account — <span style={{ color:T.accent }}>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── AUTH MODAL ─────────────────────────────────────────────────────────────*/
const AuthModal = ({ onAuth, reason, canDismiss, onDismiss, initialMode }) => {
  const [mode, setMode] = useState(initialMode || "login");
  const [step, setStep] = useState(0); // signup steps
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [role, setRole] = useState(null);
  const [country, setCountry] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signupSteps = [
    { id:"role" },
    { id:"details" },
    { id:"password" },
  ];

  const handleLogin = () => {
    setError("");
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    const accounts = getAccounts();
    const user = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) { setError("No account found with that email. Sign up instead?"); return; }
    if (user.password !== password) { setError("Incorrect password. Please try again."); return; }
    setLoading(true);
    setTimeout(() => {
      saveSession(user);
      SR.register(user.name, user.role || "visitor");
      onAuth(user);
    }, 600);
  };

  const handleSignup = () => {
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPw) { setError("Passwords don't match."); return; }
    const accounts = getAccounts();
    if (accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("An account with this email already exists. Sign in instead?"); return;
    }
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role || "both",
        country: country || "",
        createdAt: Date.now(),
        av: name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
        avatarColor: ["linear-gradient(135deg,#1A56DB,#3B82F6)","linear-gradient(135deg,#7C3AED,#A855F7)","linear-gradient(135deg,#0891B2,#06B6D4)","linear-gradient(135deg,#059669,#10B981)","linear-gradient(135deg,#EA580C,#F97316)","linear-gradient(135deg,#DB2777,#F43F5E)"][Math.floor(Math.random()*6)],
      };
      const updated = [...accounts, newUser];
      saveAccounts(updated);
      saveSession(newUser);
      // Store name + headline for profile
      localStorage.setItem("hired_profile_name", newUser.name);
      localStorage.setItem("hired_profile_headline", "");
      SR.register(newUser.name, newUser.role);
      onAuth(newUser);
    }, 700);
  };

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    const accounts = getAccounts();
    const found = accounts.find(a => a.email.toLowerCase() === resetEmail.trim().toLowerCase());
    setResetDone(true);
  };

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {showPw
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(20,18,16,.6)", backdropFilter:"blur(16px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16, overflowY:"auto" }}>
      <div data-auth-modal style={{ width:"min(420px,100%)", background:T.white, borderRadius:T.r3, padding:"36px 32px", boxShadow:"0 32px 80px rgba(20,18,16,.22)", animation:"modal-in .3s cubic-bezier(.22,1,.36,1) both", position:"relative", margin:"auto" }}>

        {/* Dismiss button for guest prompt */}
        {canDismiss && onDismiss && (
          <button onClick={onDismiss} style={{ position:"absolute", top:14, right:14, background:T.border, border:"none", borderRadius:"50%", width:32, height:32, minWidth:32, minHeight:32, padding:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3, fontSize:14, flexShrink:0 }}>✕</button>
        )}

        {/* Reason banner */}
        {reason && (
          <div style={{ background:T.accentL, border:`1px solid ${T.accentM}`, borderRadius:T.r, padding:"10px 14px", marginBottom:20, fontSize:13, color:T.accent, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
            🔒 Sign in to {reason}
          </div>
        )}

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div className="wordmark-shine" style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, letterSpacing:"-.3px", display:"inline-block" }}>Hired</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:4 }}>
            {mode==="login" ? "Welcome back. Sign in to continue." : "Join the global work marketplace."}
          </div>
        </div>

        {/* Toggle tabs */}
        <div style={{ display:"flex", background:T.bg, borderRadius:T.r, padding:4, marginBottom:24 }}>
          {[["login","Sign In"],["signup","Create Account"]].map(([m,l])=>(
            <button key={m} onClick={()=>{ setMode(m); setStep(0); setError(""); }} style={{ flex:1, padding:"9px", borderRadius:8, border:"none", fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", background:mode===m?T.white:"transparent", color:mode===m?T.ink:T.ink3, boxShadow:mode===m?"0 1px 6px rgba(20,18,16,.1)":"none", transition:"all .15s" }}>{l}</button>
          ))}
        </div>

        {error && (
          <div style={{ background:"#FFF1F2", border:`1px solid ${T.rose}33`, borderRadius:T.r, padding:"10px 14px", fontSize:13, color:T.rose, marginBottom:16, fontWeight:500 }}>
            {error}
          </div>
        )}

        {/* ── SIGN IN FORM ── */}
        {mode === "login" && !showForgot && (
          <div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoFocus />
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".5px" }}>Password</label>
                <button onClick={()=>setShowForgot(true)} style={{ background:"none", border:"none", color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Forgot password?</button>
              </div>
              <div style={{ position:"relative" }}>
                <input className="input" type={showPw?"text":"password"} placeholder="Your password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} style={{ paddingRight:44 }} />
                <button onClick={()=>setShowPw(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.ink4 }}><EyeIcon /></button>
              </div>
            </div>
            <button className="btn btn-blue" style={{ width:"100%", padding:"13px", fontSize:14, position:"relative" }} onClick={handleLogin} disabled={loading}>
              {loading ? <span style={{ display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : "Sign In →"}
            </button>
            <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.ink3 }}>
              Don't have an account?{" "}
              <button onClick={()=>{ setMode("signup"); setError(""); }} style={{ background:"none", border:"none", color:T.accent, fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif", fontSize:13 }}>Create one</button>
            </div>
          </div>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "login" && showForgot && (
          <div>
            {!resetDone ? (
              <>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:6 }}>Reset your password</div>
                <div style={{ fontSize:13, color:T.ink3, marginBottom:18, lineHeight:1.6 }}>Enter your email and we'll show you how to reset your password.</div>
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Email Address</label>
                  <input className="input" type="email" placeholder="you@example.com" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleReset()} autoFocus />
                </div>
                <button className="btn btn-blue" style={{ width:"100%", padding:"13px" }} onClick={handleReset} disabled={!resetEmail.includes("@")}>Send Reset Instructions</button>
                <div style={{ textAlign:"center", marginTop:14 }}>
                  <button onClick={()=>setShowForgot(false)} style={{ background:"none", border:"none", color:T.ink3, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>← Back to Sign In</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>📬</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:8 }}>Check your email</div>
                  <div style={{ fontSize:13, color:T.ink3, lineHeight:1.7 }}>
                    If an account exists for <strong>{resetEmail}</strong>, you'll receive a reset link shortly.
                    <br /><br />
                    <span style={{ color:T.ink4, fontSize:12 }}>No email? Check your spam folder, or try signing up for a new account.</span>
                  </div>
                </div>
                <button className="btn btn-blue" style={{ width:"100%", padding:"13px" }} onClick={()=>{ setShowForgot(false); setResetDone(false); setResetEmail(""); }}>Back to Sign In</button>
              </>
            )}
          </div>
        )}
        {mode === "signup" && (
          <div>
            {/* Step dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
              {signupSteps.map((_,i)=><div key={i} style={{ width:i===step?24:8, height:8, borderRadius:99, background:i===step?T.accent:i<step?T.accentM:T.border, transition:"all .2s" }} />)}
            </div>

            {/* Step 0: Role */}
            {step === 0 && (
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:6 }}>What brings you here?</div>
                <div style={{ fontSize:13, color:T.ink3, marginBottom:18, lineHeight:1.6 }}>This helps personalise your experience. You can change it anytime.</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {[
                    { k:"client",     label:"🎯 I need work done",   sub:"Hiring freelancers or posting projects" },
                    { k:"freelancer", label:"✨ I offer services",    sub:"Looking for clients and opportunities" },
                    { k:"both",       label:"🔄 Both",               sub:"I hire and offer services" },
                  ].map(o=>(
                    <button key={o.k} onClick={()=>setRole(o.k)} style={{ padding:"14px 18px", border:`2px solid ${role===o.k?T.accent:T.border}`, borderRadius:T.r, background:role===o.k?T.accentL:T.white, cursor:"pointer", textAlign:"left", transition:"all .15s", fontFamily:"'Manrope',sans-serif" }}>
                      <div style={{ fontWeight:700, fontSize:14, color:role===o.k?T.accent:T.ink }}>{o.label}</div>
                      <div style={{ fontSize:12.5, color:T.ink3, marginTop:2 }}>{o.sub}</div>
                    </button>
                  ))}
                </div>
                <button className="btn btn-blue" style={{ width:"100%", padding:"13px" }} disabled={!role} onClick={()=>{ setError(""); setStep(1); }}>Next →</button>
              </div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:18 }}>About you</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Full Name *</label>
                  <input className="input" placeholder="e.g. Amara Diallo" value={name} onChange={e=>setName(e.target.value)} autoFocus />
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Email Address *</label>
                  <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div style={{ marginBottom:22 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Country</label>
                  <input className="input" placeholder="e.g. Nigeria, Kenya, USA…" value={country} onChange={e=>setCountry(e.target.value)} />
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{ setError(""); setStep(0); }}>← Back</button>
                  <button className="btn btn-blue" style={{ flex:1, padding:"13px" }} disabled={!name.trim()||!email.includes("@")} onClick={()=>{ setError(""); setStep(2); }}>Next →</button>
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:6 }}>Set a password</div>
                <div style={{ fontSize:13, color:T.ink3, marginBottom:18, lineHeight:1.6 }}>At least 6 characters. You'll use this to sign back in.</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Password</label>
                  <div style={{ position:"relative" }}>
                    <input className="input" type={showPw?"text":"password"} placeholder="Min. 6 characters" value={password} onChange={e=>setPassword(e.target.value)} style={{ paddingRight:44 }} autoFocus />
                    <button onClick={()=>setShowPw(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.ink4 }}><EyeIcon /></button>
                  </div>
                </div>
                <div style={{ marginBottom:22 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:T.ink3, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".5px" }}>Confirm Password</label>
                  <input className="input" type={showPw?"text":"password"} placeholder="Repeat password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSignup()} />
                  {confirmPw && password !== confirmPw && <div style={{ fontSize:12, color:T.rose, marginTop:5 }}>Passwords don't match</div>}
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{ setError(""); setStep(1); }}>← Back</button>
                  <button className="btn btn-green" style={{ flex:1, padding:"13px", position:"relative" }} onClick={handleSignup} disabled={loading||password.length<6||password!==confirmPw}>
                    {loading ? <span style={{ display:"inline-block", width:16, height:16, border:"2px solid rgba(255,255,255,.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} /> : "Create Account 🎉"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:T.ink3 }}>
              Already have an account?{" "}
              <button onClick={()=>{ setMode("login"); setStep(0); setError(""); }} style={{ background:"none", border:"none", color:T.accent, fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif", fontSize:13 }}>Sign in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MESSAGES PAGE ──────────────────────────────────────────────────────────*/
const CONVOS = [];
const DEFAULT_CONVOS = [];
const DEFAULT_THREADS = {};

const MessagesPage = ({ fire, messages, setMessages, convos: convoProp, setConvos: setConvoProp, addNotif, composeTarget, onComposeClose }) => {
  const liveConvos  = convoProp || DEFAULT_CONVOS;
  const liveThreads = messages  || DEFAULT_THREADS;
  const [active,  setActive]     = useState(null);
  const [input,   setInput]      = useState("");
  const [typing,  setTyping]     = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const threadRef  = useRef(null);
  const fileInputRef = useRef(null);

  const EMOJI_LIST = ["😊","😂","🔥","👍","❤️","🙏","💯","😍","🤝","✅","🚀","💪","😅","🤔","👏","🎉","💡","📌","⭐","🌍","💬","📎","🔗","📝","💰","🎯","⚡","🙌","😎","💼"];

  const saveConvos  = (next) => { if(setConvoProp) setConvoProp(next);  localStorage.setItem("hired_convos",   JSON.stringify(next)); };
  const saveThreads = (next) => { if(setMessages)  setMessages(next);   localStorage.setItem("hired_messages", JSON.stringify(next)); };

  // Handle compose target from Express Interest
  useEffect(() => {
    if (!composeTarget) return;
    const existing = liveConvos.find(c=>c.name===composeTarget.user);
    if (existing) { setActive(existing); }
    else {
      const nc = { id:Date.now(), name:composeTarget.user, av:(composeTarget.userAv||composeTarget.user.slice(0,2)).toUpperCase(), color:composeTarget.userColor||"#1A56DB", last:"", time:"now", unread:0 };
      const next = [nc, ...liveConvos]; saveConvos(next); setActive(nc);
    }
    if (onComposeClose) onComposeClose();
  }, [composeTarget]);

  useEffect(() => { setTimeout(()=>{ if(threadRef.current) threadRef.current.scrollTop=threadRef.current.scrollHeight; },60); }, [active, liveThreads]);

  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e) => { if (!e.target.closest(".emoji-picker-area")) setShowEmoji(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const openConvo = (c) => {
    setActive(c);
    const nextT = { ...liveThreads, [c.id]:(liveThreads[c.id]||[]).map(m=>({...m,read:true})) };
    saveThreads(nextT);
    const nextC = liveConvos.map(x=>x.id===c.id?{...x,unread:0}:x); saveConvos(nextC);
  };

  const sendMsg = () => {
    if (!input.trim() && attachments.length === 0) return;
    if (!active) return;
    setShowEmoji(false);
    const msg = {
      from:"me",
      text: input.trim(),
      time:"now",
      read:true,
      attachments: attachments.map(a=>({ name:a.name, type:a.type, url:a.type.startsWith("image/")?a.url:null })),
    };
    const nextT = { ...liveThreads, [active.id]:[...(liveThreads[active.id]||[]), msg] };
    saveThreads(nextT);
    const nextC = liveConvos.map(c=>c.id===active.id?{...c,last:input.trim()||`📎 ${attachments[0].name}`,time:"now"}:c);
    saveConvos(nextC);
    setInput(""); setAttachments([]);
    fire("📨 Message sent!");

    // Simulated reply with typing indicator
    setTyping(true);
    const delay = 1400 + Math.random()*1200;
    setTimeout(() => {
      setTyping(false);
      const replies = ["Got it, thanks!","Sounds great, let's connect.","I'll send more details shortly.","Perfect, looking forward to it!","Can we jump on a call this week?","That works for me!","Let me review and get back to you."];
      const reply = { from:"them", text:replies[Math.floor(Math.random()*replies.length)], time:"just now", read:false, attachments:[] };
      // Mark our sent messages as read (✓✓) when they reply
      const withReadReceipts = { ...nextT, [active.id]: nextT[active.id].map(m => m.from==="me" ? { ...m, read:true } : m) };
      const withReply = { ...withReadReceipts, [active.id]:[...withReadReceipts[active.id], reply] };
      saveThreads(withReply);
      const withUnread = liveConvos.map(c=>c.id===active.id?{...c,last:reply.text,time:"just now"}:c);
      saveConvos(withUnread);
      if (addNotif) addNotif({ icon:"💬", text:`New message from ${active.name}`, type:"message" });
    }, delay);
  };

  const unreadFor = (id) => (liveThreads[id]||[]).filter(m=>m.from==="them"&&!m.read).length;
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const onR = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const isMobileMsg = winW < 640;
  const showList  = !active || !isMobileMsg;
  const showThread = !!active;

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px 0" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
        {active && <button className="btn btn-ghost btn-icon" onClick={()=>setActive(null)}>{I.back}</button>}
        <div>
          <div className="lbl" style={{ marginBottom:2 }}>{active?active.name:"Direct Messages"}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:active?20:28 }}>
            {active ? <span style={{ display:"flex", alignItems:"center", gap:7 }}><div className="pulse-dot-fast"/><span style={{ fontSize:12, fontWeight:600, color:T.green }}>Online</span></span> : "Messages"}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:active&&!isMobileMsg?"300px 1fr":"1fr", gap:16, alignItems:"start" }} className="feed-layout">
        {showList && (
          <div className="card" style={{ overflow:"hidden" }}>
            {liveConvos.map((c,i)=>{
              const unread = unreadFor(c.id);
              return (
                <div key={c.id} onClick={()=>openConvo(c)} style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 16px", cursor:"pointer", background:active?.id===c.id?T.accentL:"transparent", borderBottom:i<liveConvos.length-1?`1px solid ${T.border}`:"none", transition:"background .15s" }}
                  onMouseEnter={e=>{ if(active?.id!==c.id) e.currentTarget.style.background=T.bg; }}
                  onMouseLeave={e=>{ if(active?.id!==c.id) e.currentTarget.style.background=""; }}>
                  <div style={{ position:"relative" }}>
                    <Av text={c.av} color={c.color} size={42} />
                    {unread>0 && <div style={{ position:"absolute",top:-3,right:-3,width:18,height:18,borderRadius:"50%",background:T.accent,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>{unread}</div>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:unread>0?800:700, fontSize:13.5 }}>{c.name}</div>
                    <div style={{ fontSize:12.5, color:T.ink3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:unread>0?600:400 }}>{c.last||"Start a conversation"}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                    <div style={{ fontSize:11, color:T.ink4 }}>{c.time}</div>
                    {unread>0 && <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent }} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {active ? (
          <div className="card" style={{ display:"flex", flexDirection:"column", minHeight:440 }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10 }}>
              <Av text={active.av} color={active.color} size={34} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{active.name}</div>
                <div style={{ fontSize:11.5, color:T.green, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                  {typing ? <span style={{ color:T.ink3, fontStyle:"italic" }}>typing…</span> : <><div className="pulse-dot-fast"/> Online now</>}
                </div>
              </div>
            </div>
            <div ref={threadRef} style={{ flex:1, padding:"16px 20px", display:"flex", flexDirection:"column", gap:10, overflowY:"auto", maxHeight:340 }}>
              {(liveThreads[active.id]||[]).length===0 && <div style={{ textAlign:"center", color:T.ink4, fontSize:13, padding:"40px 0" }}>No messages yet. Say hello! 👋</div>}
              {(liveThreads[active.id]||[]).map((m,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
                  {m.from==="them" && <Av text={active.av} color={active.color} size={26} />}
                  <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", gap:4, alignItems:m.from==="me"?"flex-end":"flex-start" }}>
                    {/* Image attachments */}
                    {m.attachments?.filter(a=>a.url).map((a,ai)=>(
                      <img key={ai} src={a.url} alt={a.name} style={{ maxWidth:200, maxHeight:160, borderRadius:10, objectFit:"cover", display:"block", border:`1px solid ${T.border}` }} />
                    ))}
                    {/* File attachments */}
                    {m.attachments?.filter(a=>!a.url&&a.name).map((a,ai)=>(
                      <div key={ai} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:m.from==="me"?T.accent:T.bg, borderRadius:10, border:`1px solid ${m.from==="me"?"transparent":T.border}` }}>
                        <span style={{ fontSize:18 }}>📎</span>
                        <span style={{ fontSize:12, color:m.from==="me"?"rgba(255,255,255,.9)":T.ink2, fontWeight:600 }}>{a.name}</span>
                      </div>
                    ))}
                    {/* Text bubble */}
                    {m.text && (
                      <div style={{ padding:"10px 14px", borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.from==="me"?T.accent:T.bg, color:m.from==="me"?"#fff":T.ink, fontSize:13.5, lineHeight:1.6, border:`1px solid ${m.from==="me"?"transparent":T.border}` }}>
                        {m.text}
                        <div style={{ fontSize:10, opacity:.55, marginTop:4, textAlign:m.from==="me"?"right":"left", display:"flex", alignItems:"center", justifyContent:m.from==="me"?"flex-end":"flex-start", gap:3 }}>
                          <span>{m.time}</span>
                          {m.from==="me" && (
                            <span style={{ color: m.read ? "#60a5fa" : "rgba(255,255,255,.55)", fontSize:11, letterSpacing:"-2px", lineHeight:1 }} title={m.read?"Seen":"Delivered"}>
                              {m.read ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
                  <Av text={active.av} color={active.color} size={26} />
                  <div style={{ padding:"10px 14px", borderRadius:"16px 16px 16px 4px", background:T.bg, border:`1px solid ${T.border}` }}>
                    <div style={{ display:"flex", gap:4 }}>
                      {[0,1,2].map(i=><div key={i} style={{ width:6,height:6,borderRadius:"50%",background:T.ink4,animation:`blink 1.2s ${i*.2}s infinite` }}/>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
              {/* Attachment previews */}
              {attachments.length > 0 && (
                <div style={{ display:"flex", gap:8, padding:"10px 14px 0", flexWrap:"wrap" }}>
                  {attachments.map((a,i)=>(
                    <div key={i} style={{ position:"relative", borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}`, background:T.bg }}>
                      {a.type.startsWith("image/") ? (
                        <img src={a.url} alt={a.name} style={{ width:64, height:64, objectFit:"cover", display:"block" }} />
                      ) : (
                        <div style={{ width:80, height:64, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:6 }}>
                          <span style={{ fontSize:22 }}>{a.name.endsWith(".pdf")?"📄":a.name.match(/\.(doc|docx)$/)?"📝":"📎"}</span>
                          <span style={{ fontSize:9, color:T.ink3, textAlign:"center", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:70 }}>{a.name}</span>
                        </div>
                      )}
                      <button onClick={()=>setAttachments(prev=>prev.filter((_,j)=>j!==i))} style={{ position:"absolute", top:3, right:3, width:16, height:16, borderRadius:"50%", background:"rgba(0,0,0,.6)", border:"none", cursor:"pointer", color:"#fff", fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Emoji picker */}
              {showEmoji && (
                <div className="emoji-picker-area" style={{ padding:"10px 14px 0" }}>
                  <div style={{ background:T.white, border:`1px solid ${T.border}`, borderRadius:T.r2, padding:10, boxShadow:"0 8px 24px rgba(20,18,16,.12)" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".5px", marginBottom:8 }}>Frequently used</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:2 }}>
                      {EMOJI_LIST.map(e=>(
                        <button key={e} onClick={()=>{ setInput(v=>v+e); setShowEmoji(false); }} style={{ width:36, height:36, background:"none", border:"none", borderRadius:6, cursor:"pointer", fontSize:20, transition:"background .1s", display:"flex", alignItems:"center", justifyContent:"center" }}
                          onMouseEnter={ev=>ev.currentTarget.style.background=T.bg}
                          onMouseLeave={ev=>ev.currentTarget.style.background="none"}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Input row */}
              <div style={{ display:"flex", gap:6, alignItems:"flex-end", padding:"10px 14px 12px" }}>
                {/* Attachment */}
                <button onClick={()=>fileInputRef.current?.click()} style={{ width:34, height:34, borderRadius:"50%", background:T.bg, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, transition:"background .15s", color:T.ink3 }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.border}
                  onMouseLeave={e=>e.currentTarget.style.background=T.bg}
                  title="Attach file">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" multiple style={{ display:"none" }} onChange={e=>{
                  Array.from(e.target.files||[]).forEach(f=>{
                    const url = URL.createObjectURL(f);
                    setAttachments(prev=>[...prev,{ name:f.name, type:f.type, url, size:f.size }]);
                  });
                  e.target.value="";
                }} />

                {/* Textarea */}
                <div style={{ flex:1, position:"relative" }}>
                  <textarea
                    className="input"
                    placeholder="Type a message…"
                    value={input}
                    rows={1}
                    onChange={e=>{ setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; }}
                    onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); } }}
                    style={{ resize:"none", borderRadius:18, paddingLeft:14, paddingRight:14, paddingTop:9, paddingBottom:9, lineHeight:1.5, overflowY:"auto", minHeight:38, maxHeight:120, display:"block", width:"100%", boxSizing:"border-box" }}
                    autoFocus
                  />
                  {input.length > 200 && (
                    <div style={{ position:"absolute", bottom:-16, right:4, fontSize:10, color:input.length>500?T.rose:T.ink4 }}>{input.length}/500</div>
                  )}
                </div>

                {/* Emoji */}
                <button className="emoji-picker-area" onClick={()=>setShowEmoji(v=>!v)} style={{ width:34, height:34, borderRadius:"50%", background:showEmoji?T.accentL:T.bg, border:`1px solid ${showEmoji?T.accentM:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, fontSize:18, transition:"all .15s" }}
                  title="Emoji">
                  😊
                </button>

                {/* Send */}
                <button onClick={sendMsg} style={{ width:36, height:36, borderRadius:"50%", background:(input.trim()||attachments.length)?T.accent:"#e8e5de", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:(input.trim()||attachments.length)?"pointer":"default", flexShrink:0, transition:"all .2s", transform:(input.trim()||attachments.length)?"scale(1)":"scale(.9)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform:"translateX(1px)" }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <div style={{ textAlign:"center", fontSize:10.5, color:T.ink4, paddingBottom:8 }}>Enter to send · Shift+Enter for new line</div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding:"60px 24px", textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, marginBottom:8 }}>Select a conversation</div>
            <div style={{ color:T.ink3, fontSize:13 }}>Tap any conversation to read and reply</div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── REFER CARD ─────────────────────────────────────────────────────────────*/
const ReferCard = ({ fire, onReferral }) => {
  const [copied, setCopied] = useState(false);
  const userName = (localStorage.getItem("hired_profile_name")||"user").toLowerCase().replace(/\s+/g,"-");
  const refCount = Number(localStorage.getItem("hired_ref_count")||0);
  const REFS_PER_CREDIT = 3;
  const progress = refCount % REFS_PER_CREDIT;
  const totalEarned = Math.floor(refCount / REFS_PER_CREDIT);

  const handleShare = () => {
    onReferral && onReferral();
    setCopied(true);
    setTimeout(()=>setCopied(false),2500);
  };
  return (
    <div style={{ background:`linear-gradient(135deg,${T.purpleBg},${T.accentL})`, borderRadius:T.r2, padding:"22px 22px", border:`1px solid ${T.accentM}`, marginBottom:16 }}>
      <div className="lbl" style={{ marginBottom:4, color:T.purple, display:"flex", alignItems:"center", gap:5 }}>{I.refer} Refer a Friend</div>
      <div style={{ fontSize:13, color:T.ink3, marginBottom:14, lineHeight:1.6 }}>
        Share Hired with your network. Every <strong style={{ color:T.purple }}>3 referrals</strong> earns you <strong style={{ color:T.purple }}>1 free unlock credit</strong>.
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:12, fontWeight:700, color:T.ink3 }}>{progress}/{REFS_PER_CREDIT} towards next credit</span>
          {totalEarned > 0 && <span style={{ fontSize:12, fontWeight:700, color:T.purple }}>{totalEarned} credit{totalEarned!==1?"s":""} earned</span>}
        </div>
        <div style={{ height:8, background:T.border, borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(progress/REFS_PER_CREDIT)*100}%`, background:`linear-gradient(90deg,${T.purple},${T.accent})`, borderRadius:99, transition:"width .5s ease" }} />
        </div>
        <div style={{ display:"flex", gap:8, marginTop:8 }}>
          {Array.from({length:REFS_PER_CREDIT},(_,i)=>(
            <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<progress?T.purple:T.border }} />
          ))}
        </div>
      </div>

      <button className="btn btn-sm" style={{ background:T.purple, color:"#fff", border:"none", width:"100%", padding:"11px" }} onClick={handleShare}>
        {copied ? "✓ Link shared!" : "📣 Share Your Referral Link"}
      </button>
      <div style={{ fontSize:11.5, color:T.ink4, marginTop:10, textAlign:"center" }}>{refCount} referral{refCount!==1?"s":""} sent · {totalEarned} free credit{totalEarned!==1?"s":""} earned</div>
    </div>
  );
};

/* ─── ANALYTICS CHART ────────────────────────────────────────────────────────*/
const AnalyticsChart = () => {
  const data = [
    { label:"Mon", views:24, unlocks:3 },{ label:"Tue", views:38, unlocks:5 },
    { label:"Wed", views:61, unlocks:8 },{ label:"Thu", views:47, unlocks:6 },
    { label:"Fri", views:82, unlocks:11 },{ label:"Sat", views:55, unlocks:7 },
    { label:"Sun", views:71, unlocks:9 },
  ];
  const maxV = Math.max(...data.map(d=>d.views));
  const [tip, setTip] = useState(null); // { label, views, unlocks }
  return (
    <div className="card" style={{ padding:22, marginBottom:16, overflow:"hidden", minWidth:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:8 }}>
        <div className="lbl">{I.chart} Post Views This Week</div>
        <div style={{ display:"flex", gap:14, fontSize:12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:T.accent, display:"inline-block" }} /> Views</span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:T.teal, display:"inline-block" }} /> Unlocks</span>
        </div>
      </div>
      {/* Tooltip */}
      {tip && (
        <div className="fade-in" style={{ marginBottom:12, padding:"8px 14px", background:T.ink, color:"#fff", borderRadius:T.r, fontSize:12, fontWeight:600, display:"inline-flex", gap:16 }}>
          <span>{tip.label}</span>
          <span style={{ color:"#93C5FD" }}>👁 {tip.views} views</span>
          <span style={{ color:"#5EEAD4" }}>🔓 {tip.unlocks} unlocks</span>
        </div>
      )}
      <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:120, width:"100%", overflow:"hidden" }}>
        {data.map(d=>(
          <div key={d.label} style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}
            onMouseEnter={()=>setTip(d)} onMouseLeave={()=>setTip(null)}
            onClick={()=>setTip(tip?.label===d.label?null:d)}>
            <div style={{ width:"100%", display:"flex", gap:1, alignItems:"flex-end", height:96, cursor:"pointer" }}>
              <div title={`${d.views} views`} style={{ flex:1, minWidth:0, height:`${(d.views/maxV)*100}%`, background:tip?.label===d.label?T.accent:"#93C5FD", borderRadius:"3px 3px 0 0", transition:"height .5s ease, background .15s" }} />
              <div title={`${d.unlocks} unlocks`} style={{ flex:1, minWidth:0, height:`${(d.unlocks/maxV)*100}%`, background:tip?.label===d.label?T.teal:"#5EEAD4", borderRadius:"3px 3px 0 0", transition:"height .5s ease, background .15s" }} />
            </div>
            <div style={{ fontSize:10, color:tip?.label===d.label?T.accent:T.ink4, fontWeight:tip?.label===d.label?700:400, transition:"color .15s" }}>{d.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:16, padding:"12px 14px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}`, flexWrap:"wrap" }}>
        <div><div style={{ fontSize:11, color:T.ink4 }}>Total Views</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:T.accent }}>378</div></div>
        <div><div style={{ fontSize:11, color:T.ink4 }}>Unlocks</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:T.teal }}>49</div></div>
        <div><div style={{ fontSize:11, color:T.ink4 }}>Conversion</div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:T.green }}>13%</div></div>
      </div>
    </div>
  );
};

/* ─── PROPOSAL MODAL ────────────────────────────────────────────────────────*/
const ProposalModal = ({ post, onClose, onSubmit, fire }) => {
  const [pitch, setPitch] = useState("");
  const [rate,  setRate]  = useState("");
  const [avail, setAvail] = useState("Immediately");
  const MIN = 50;
  const canSend = pitch.trim().length >= MIN;
  const send = () => {
    if (!canSend) return;
    onSubmit(post.id, post.title, pitch, rate, avail);
    onClose();
  };
  return (
    <div className="mbg" onClick={onClose}>
      <div className="mbox" style={{ maxWidth:500 }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute",top:14,right:14,background:T.border,border:"none",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.ink3 }}>{I.close}</button>
        <div className="lbl" style={{ marginBottom:6 }}>Proposal</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:4 }}>Apply to this post</div>
        <div style={{ fontSize:13, color:T.ink3, marginBottom:20 }}>{post.title}</div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div className="lbl" style={{ marginBottom:6 }}>Your pitch <span style={{ color:T.rose }}>*</span></div>
            <textarea className="input" rows={5} placeholder="Why are you the right fit? Include relevant experience, approach, and any questions you have for the poster…" value={pitch} onChange={e=>setPitch(e.target.value)} style={{ resize:"vertical", minHeight:120 }} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
              <span style={{ fontSize:11, color:pitch.trim().length>=MIN?T.green:pitch.length>0?T.amber:T.ink4, fontWeight:pitch.length>0?600:400 }}>
                {pitch.trim().length>=MIN ? "✓ Good length" : pitch.length>0 ? `${MIN - pitch.trim().length} more chars needed` : `Min ${MIN} characters`}
              </span>
              <span style={{ fontSize:11, color:pitch.length>600?T.rose:T.ink4 }}>{pitch.length}/800</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Your rate / bid</div>
              <input className="input" placeholder={`e.g. ${post.budget}`} value={rate} onChange={e=>setRate(e.target.value)} />
            </div>
            <div>
              <div className="lbl" style={{ marginBottom:6 }}>Availability</div>
              <select className="input" value={avail} onChange={e=>setAvail(e.target.value)}>
                {["Immediately","Within 1 week","Within 2 weeks","Within a month"].map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-green" style={{ padding:"13px", opacity:canSend?1:.5, cursor:canSend?"pointer":"not-allowed" }} onClick={send}>
            {I.check} Submit Proposal
          </button>
          {!canSend && pitch.length > 0 && (
            <div style={{ fontSize:12, color:T.amber, textAlign:"center", marginTop:-6 }}>Add a bit more detail to submit</div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── BATCH 1: RESPONSE RATE BADGE ─────────────────────────────────────────*/
const ResponseBadge = ({ rate=92, replyTime="< 2h" }) => (
  <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", background:rate>=80?T.greenBg:rate>=50?T.amberBg:T.roseBg, borderRadius:99, border:`1px solid ${rate>=80?T.green+"33":rate>=50?T.amber+"33":T.rose+"33"}` }}>
    <div style={{ width:6, height:6, borderRadius:"50%", background:rate>=80?"#22C55E":rate>=50?"#F59E0B":"#EF4444", flexShrink:0 }} />
    <span style={{ fontSize:11, fontWeight:700, color:rate>=80?T.green:rate>=50?T.amber:T.rose }}>{rate}% response · {replyTime}</span>
  </div>
);

/* ─── BATCH 1: MATCH SCORE ──────────────────────────────────────────────────*/
const MatchScore = ({ post, userSkills=[] }) => {
  if (!userSkills.length) return null;
  const tags = (post.tags||[]).map(t=>t.toLowerCase());
  const matched = userSkills.filter(s => tags.some(t=>t.includes(s.toLowerCase())||s.toLowerCase().includes(t)));
  const pct = Math.min(100, Math.round((matched.length / Math.max(tags.length,1)) * 100) + 30);
  if (pct < 40) return null;
  const color = pct >= 80 ? T.green : pct >= 60 ? T.teal : T.amber;
  const bg    = pct >= 80 ? T.greenBg : pct >= 60 ? T.tealBg : T.amberBg;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", background:bg, borderRadius:99, border:`1px solid ${color}33` }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill={color}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      <span style={{ fontSize:10.5, fontWeight:800, color }}>{pct}% match</span>
    </div>
  );
};

/* ─── BATCH 1: RECENTLY VIEWED BAR ─────────────────────────────────────────*/
const RecentlyViewedBar = ({ posts, onOpen, onSave, savedIds }) => {
  if (!posts || posts.length === 0) return null;
  return (
    <div style={{ padding:"14px 0 0", marginBottom:4 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10, padding:"0 2px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".6px", display:"flex", alignItems:"center", gap:6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Recently Viewed
        </div>
      </div>
      <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
        {posts.slice(0,6).map(p=>(
          <div key={p.id} onClick={()=>onOpen(p)} style={{ flexShrink:0, width:180, background:T.white, borderRadius:T.r2, border:`1px solid ${T.border}`, overflow:"hidden", cursor:"pointer", transition:"transform .15s, box-shadow .15s", boxShadow:"0 2px 8px rgba(20,18,16,.06)" }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(20,18,16,.1)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 2px 8px rgba(20,18,16,.06)"; }}>
            <div style={{ height:48, background:p.cover, position:"relative" }}>
              <PostTypeBadge type={p.type} />
              <button onClick={e=>{e.stopPropagation();onSave(p.id);}} style={{ position:"absolute", top:6, right:6, width:22, height:22, borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0 }}>
                {I.heart(savedIds.includes(p.id))}
              </button>
            </div>
            <div style={{ padding:"8px 10px" }}>
              <div style={{ fontSize:11.5, fontWeight:700, lineHeight:1.3, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", color:T.ink }}>{p.title}</div>
              <div style={{ fontSize:11, color:T.accent, fontWeight:700 }}>{p.budget} <span style={{ color:T.ink4, fontWeight:400 }}>{p.budgetType}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── BOARD PAGE ─────────────────────────────────────────────────────────────*/
const BoardPage = ({ isPaid, onUpgrade, credits, setCredits, onPostOpen, savedIds, onSave, onPostNew, fire, defaultSearch="", onSearchChange, loggedIn=false, userPosts=[], searchHistory=[], onAddSearchHistory, savedSearches=[], onSaveSearch, onMessage, onRenewPost, showWelcome, onDismissWelcome, onGoProfile, recentlyViewed=[] }) => {
  const [cat, setCat]         = useState("All");
  const [type, setType]       = useState("all");
  const [workType, setWkType] = useState("all");
  const [search, setSearch]   = useState(defaultSearch);
  const [sort, setSort]       = useState("recent");
  const [showFilters, setFilters] = useState(false);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [availOnly, setAvailOnly] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading,   setIsLoading]   = useState(true);
  const searchRef = useRef(null);

  // Skeleton on mount
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 650); return () => clearTimeout(t); }, []);

  const allPosts = [...userPosts.filter(p => !p.expiresAt || p.expiresAt > Date.now()), ...POSTS_DATA];
  const expiringPosts = userPosts.filter(p => p.expiresAt && p.expiresAt > Date.now() && p.expiresAt - Date.now() < 3 * 24 * 60 * 60 * 1000);

  useEffect(() => { if (defaultSearch !== undefined) setSearch(defaultSearch); }, [defaultSearch]);

  const handleSearch = (val) => { setSearch(val); if(onSearchChange) onSearchChange(val); };
  const handleSearchSubmit = () => { if(search.trim() && onAddSearchHistory) onAddSearchHistory(search.trim()); setShowHistory(false); };

  const filtered = allPosts.filter(p => {
    const mc  = cat==="All" || p.category===cat;
    const mt  = type==="all" || p.type===type;
    const mwt = workType==="all" || p.workType===workType;
    const mb  = (p.budgetNum||0) <= maxBudget;
    const ma  = !availOnly || p.type==="offer"; // "offer" = freelancer available
    const ms  = !search || [p.title,p.user,p.category,...(p.tags||[]),p.country,p.userCountry]
                  .filter(Boolean).some(x=>x.toLowerCase().includes(search.toLowerCase()));
    return mc&&mt&&mwt&&mb&&ma&&ms;
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const sorted = [...filtered].sort((a,b)=>{
    if (sort==="recent")   return b.postedMs - a.postedMs;
    if (sort==="budget")   return b.budgetNum - a.budgetNum;
    if (sort==="featured") return (b.featured?1:0)-(a.featured?1:0);
    return 0;
  });
  const shown    = sorted.slice(0, page * PAGE_SIZE);
  const hasMore  = shown.length < sorted.length;

  useEffect(() => { setPage(1); }, [search, cat, type, workType, sort, maxBudget, availOnly]);

  const clearFilters = () => { handleSearch(""); setCat("All"); setType("all"); setWkType("all"); setMaxBudget(10000); setAvailOnly(false); };
  const activeFilterCount = [cat!=="All", type!=="all", workType!=="all", !!search, maxBudget<10000, availOnly].filter(Boolean).length;

  return (
    <div>
      {/* ── HERO — logged-out only ── */}
      {!loggedIn && (
      <div style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"50px 0 42px", position:"relative", overflow:"hidden" }} className="mesh-bg">
        {/* Noise grain overlay */}
        <div style={{ position:"absolute", inset:0, opacity:.028, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:"180px", pointerEvents:"none", zIndex:0 }} />
        {/* Floating background orbs */}
        <div className="dark-orb" style={{ position:"absolute", top:-60, right:-40, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle, rgba(26,86,219,.07) 0%, transparent 70%)", animation:"orb-drift 9s ease-in-out infinite", pointerEvents:"none" }} />
        <div className="dark-orb" style={{ position:"absolute", bottom:-80, left:-60, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(15,118,110,.06) 0%, transparent 70%)", animation:"orb-drift 12s ease-in-out infinite reverse", pointerEvents:"none" }} />
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px", position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, animation:"up .4s .05s both" }}>
            <div style={{ display:"flex", gap:5 }}>
              <span style={{ width:9, height:9, borderRadius:"50%", background:T.rose, display:"inline-block" }} />
              <span style={{ width:9, height:9, borderRadius:"50%", background:T.teal, display:"inline-block" }} />
              <span style={{ width:9, height:9, borderRadius:"50%", background:T.accent, display:"inline-block" }} />
            </div>
            <span className="lbl">Work opportunities across 94+ countries</span>
          </div>

          {/* Live ticker */}
          <div style={{ marginBottom:18, animation:"up .4s .1s both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,rgba(26,86,219,.08),rgba(59,130,246,.08))", border:"1px solid rgba(26,86,219,.18)", borderRadius:99, padding:"6px 14px" }}>
              <LiveTicker />
            </div>
          </div>

          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:"clamp(32px,5vw,56px)", lineHeight:1.1, marginBottom:14, maxWidth:680, animation:"up .5s .15s both" }} className="hero-h">
            Find work, find talent.<br />
            <span style={{ fontStyle:"italic", background:"linear-gradient(135deg,#1A56DB,#3B82F6,#60A5FA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>All in one place.</span>
          </div>

          <p style={{ fontSize:15.5, color:T.ink3, marginBottom:32, maxWidth:500, lineHeight:1.75, animation:"up .5s .22s both" }}>
            Clients post what they need. Freelancers post what they offer. Everyone connects.
          </p>

          {/* Search */}
          <div ref={searchRef} style={{ display:"flex", gap:10, maxWidth:580, flexWrap:"wrap", animation:"up .5s .28s both" }} className="hero-row">
            <div style={{ position:"relative", flex:1 }}>
              <div style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:T.ink4 }}>{I.search}</div>
              <input className="input" placeholder="Search by keyword, skill, location, or name…" value={search}
                onChange={e=>handleSearch(e.target.value)}
                onFocus={()=>{ setShowHistory(true); setTimeout(()=>{ if(searchRef.current) searchRef.current.scrollIntoView({ behavior:"smooth", block:"center" }); }, 100); }}
                onBlur={()=>setTimeout(()=>setShowHistory(false),180)}
                onKeyDown={e=>e.key==="Enter"&&handleSearchSubmit()}
                style={{ paddingLeft:48, height:52, borderRadius:99, boxShadow:"0 4px 20px rgba(26,86,219,.1)", fontSize:14, border:`1.5px solid ${T.accentM}` }} />
              {search && (
                <button onClick={()=>handleSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:T.border, border:"none", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
              {/* Search history + save search dropdown */}
              {showHistory && (searchHistory.length > 0 || savedSearches.length > 0) && !search && (
                <div className="card" style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:50, padding:0, overflow:"hidden", boxShadow:"0 8px 32px rgba(20,18,16,.12)" }}>
                  {searchHistory.length > 0 && (
                    <>
                      <div style={{ padding:"8px 14px 4px", fontSize:11, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".6px" }}>Recent</div>
                      {searchHistory.slice(0,4).map((q,i)=>(
                        <div key={i} onMouseDown={()=>{ handleSearch(q); handleSearchSubmit(); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", cursor:"pointer", transition:"background .1s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=""}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.ink4} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <span style={{ fontSize:13, color:T.ink2 }}>{q}</span>
                        </div>
                      ))}
                    </>
                  )}
                  {savedSearches.length > 0 && (
                    <>
                      <div style={{ padding:"8px 14px 4px", fontSize:11, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".6px", borderTop:`1px solid ${T.border}` }}>Saved Searches 🔔</div>
                      {savedSearches.slice(0,3).map((q,i)=>(
                        <div key={i} onMouseDown={()=>{ handleSearch(q); handleSearchSubmit(); }} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", cursor:"pointer", transition:"background .1s" }}
                          onMouseEnter={e=>e.currentTarget.style.background=T.bg} onMouseLeave={e=>e.currentTarget.style.background=""}>
                          <span style={{ fontSize:12 }}>🔔</span>
                          <span style={{ fontSize:13, color:T.ink2 }}>{q}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
            {search && onSaveSearch && (
              <button className="btn btn-outline" style={{ height:52, padding:"0 18px", borderRadius:99, fontSize:12 }} onClick={()=>onSaveSearch(search)}>🔔 Save</button>
            )}
            <button className="btn btn-blue" style={{ height:52, padding:"0 28px", borderRadius:99 }} onClick={onPostNew}>Post</button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:28, marginTop:32, flexWrap:"wrap" }} className="hero-stats">
            {[
              ["3,200+","Active Posts",   "linear-gradient(135deg,#1A56DB,#3B82F6)"],
              ["1,800+","Freelancers",    "linear-gradient(135deg,#DB2777,#F43F5E)"],
              ["1,400+","Clients",        "linear-gradient(135deg,#0F766E,#06B6D4)"],
              ["94+",   "Countries",      "linear-gradient(135deg,#166534,#22C55E)"],
            ].map(([v,l,grad],i)=>(
              <div key={l} style={{ animation:`up .5s ${.32+i*.07}s both` }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, background:grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{v} </span>
                <span style={{ fontSize:13, color:T.ink3, fontWeight:600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ── FILTER BAR ── */}
      <div className="filterbar" style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"10px 16px", position:"sticky", top:60, zIndex:40 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {/* Mobile search row — only shown when hero is hidden (logged in) */}
          {loggedIn && (
            <div style={{ marginBottom:8, position:"relative" }}>
              <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.ink4, pointerEvents:"none" }}>{I.search}</div>
              <input
                ref={searchRef}
                className="input"
                placeholder="Search skills, roles, locations…"
                value={search}
                onChange={e=>{ setSearch(e.target.value); if(onSearchChange) onSearchChange(e.target.value); }}
                style={{ paddingLeft:42, paddingRight:search?40:14, borderRadius:99, height:40, fontSize:13 }}
              />
              {search && (
                <button onClick={()=>{ setSearch(""); if(onSearchChange) onSearchChange(""); searchRef.current?.focus(); }}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:T.border, border:"none", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          )}
          {/* Single scrollable row - no wrapping */}
          <div style={{ display:"flex", gap:8, alignItems:"center", overflowX:"auto", scrollbarWidth:"none", WebkitOverflowScrolling:"touch" }}>
            {/* Type toggle */}
            <div style={{ display:"flex", background:T.bg, borderRadius:99, padding:3, border:`1px solid ${T.border}`, flexShrink:0 }}>
              {[["all","All"],["need","Needs Work"],["offer","Offering"]].map(([v,l])=>(
                <button key={v} onClick={()=>setType(v)} style={{ padding:"6px 13px", borderRadius:99, border:"none", fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all .18s", background:type===v?"linear-gradient(135deg,#1A56DB,#3B82F6)":"transparent", color:type===v?"#fff":T.ink3, boxShadow:type===v?"0 3px 10px rgba(26,86,219,.3)":"none", whiteSpace:"nowrap", flexShrink:0 }}>{l}</button>
              ))}
            </div>
            {/* Work type pills */}
            {[["all","Any Type"],["Remote","Remote 🌐"],["On-site","On-site 📍"],["Hybrid","Hybrid"],["Relocate","Relocate ✈️"]].map(([v,l])=>(
              <button key={v} className={`fp${workType===v?" on":""}`} style={{ fontSize:12, padding:"6px 13px", flexShrink:0 }} onClick={()=>setWkType(v)}>{l}</button>
            ))}
            {/* Available Now quick filter */}
            <button
              onClick={()=>setAvailOnly(v=>!v)}
              style={{ padding:"6px 13px", borderRadius:99, border:`1.5px solid ${availOnly?T.green:T.border}`, background:availOnly?T.greenBg:"transparent", color:availOnly?T.green:T.ink3, fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:5, transition:"all .18s", whiteSpace:"nowrap" }}>
              {availOnly && <div className="pulse-dot" style={{ width:6, height:6, background:T.green, flexShrink:0 }} />}
              {!availOnly && <div style={{ width:6, height:6, borderRadius:"50%", background:T.border2, flexShrink:0 }} />}
              Available Now
            </button>
            {/* Sort */}
            <div style={{ display:"flex", background:T.bg, borderRadius:99, padding:3, border:`1px solid ${T.border}`, flexShrink:0 }}>
              {[["recent","🕐"],["budget","💰"],["featured","⭐"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSort(v)} title={v==="recent"?"Most Recent":v==="budget"?"Highest Budget":"Featured First"} style={{ padding:"6px 12px", borderRadius:99, border:"none", fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .18s", background:sort===v?"linear-gradient(135deg,#1A56DB,#3B82F6)":"transparent", color:sort===v?"#fff":T.ink3, boxShadow:sort===v?"0 3px 10px rgba(26,86,219,.3)":"none", flexShrink:0 }}>{l}</button>
              ))}
            </div>
            {/* Filter toggle */}
            <button className="btn btn-outline btn-sm" onClick={()=>setFilters(!showFilters)} style={{ flexShrink:0, position:"relative", borderColor:activeFilterCount>0?T.accent:undefined, color:activeFilterCount>0?T.accent:undefined }}>
              {I.filter} Filters
              {activeFilterCount>0 && <span style={{ position:"absolute", top:-6, right:-6, width:16, height:16, borderRadius:"50%", background:T.accent, color:"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{activeFilterCount}</span>}
            </button>
          </div>

          {/* Category filters */}
          {showFilters && (
            <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}` }} className="fade-in">
              <div style={{ display:"flex", gap:28, flexWrap:"wrap", alignItems:"flex-start" }}>
                <div style={{ flex:1, minWidth:220 }}>
                  <div className="lbl" style={{ marginBottom:10 }}>Category</div>
                  <div className="sx" style={{ paddingBottom:4, flexWrap:"wrap", gap:7 }}>
                    {CATS.map(c=>(
                      <button key={c} className={`fp${cat===c?" on":""}`} style={{ fontSize:12, padding:"5px 13px" }} onClick={()=>setCat(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                <div style={{ minWidth:200 }}>
                  <div className="lbl" style={{ marginBottom:10 }}>Max Budget / Rate</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:6 }}>
                    <div style={{ fontSize:20, fontFamily:"'Playfair Display',serif", color:T.accent }}>
                      ${maxBudget===10000?"Any":maxBudget.toLocaleString()}
                    </div>
                    {maxBudget < 10000 && (
                      <button onClick={()=>setMaxBudget(10000)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:T.ink4, fontFamily:"'Manrope',sans-serif", fontWeight:600 }}>Reset</button>
                    )}
                  </div>
                  <input type="range" min="100" max="10000" step="100" value={maxBudget}
                    onChange={e=>setMaxBudget(Number(e.target.value))}
                    style={{ width:"100%", accentColor:T.accent, cursor:"pointer", height:4 }} />
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.ink4, marginTop:4 }}>
                    <span>$100</span>
                    <div style={{ display:"flex", gap:6 }}>
                      {[500,1000,5000].map(v=>(
                        <button key={v} onClick={()=>setMaxBudget(v)} style={{ background:maxBudget===v?T.accentL:"none", border:`1px solid ${maxBudget===v?T.accentM:T.border}`, borderRadius:99, padding:"1px 7px", fontSize:10, cursor:"pointer", color:maxBudget===v?T.accent:T.ink4, fontFamily:"'Manrope',sans-serif", fontWeight:600 }}>${(v/1000).toFixed(v<1000?0:0)}k{v<1000?"":"+"}</button>
                      ))}
                    </div>
                    <span>$10k+</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── WELCOME BANNER ── */}
      {showWelcome && (
        <div style={{ maxWidth:1100, margin:"16px auto 0", padding:"0 24px" }}>
          <div style={{ background:"linear-gradient(135deg,#1A56DB,#1e40af,#3B82F6)", borderRadius:T.r2, padding:"20px 24px", color:"#fff", display:"flex", gap:16, alignItems:"center", flexWrap:"wrap", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-20, top:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }} />
            <div style={{ fontSize:36 }}>🎉</div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, marginBottom:4 }}>Welcome to Hired!</div>
              <div style={{ fontSize:13, opacity:.88, lineHeight:1.6 }}>You're all set. Browse the board, post your first opportunity, or complete your profile to get discovered.</div>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", flexShrink:0 }}>
              <button onClick={onPostNew} style={{ padding:"8px 16px", background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.3)", borderRadius:99, color:"#fff", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif", backdropFilter:"blur(6px)" }}>
                + Post Something
              </button>
              <button onClick={onGoProfile} style={{ padding:"8px 16px", background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", borderRadius:99, color:"rgba(255,255,255,.9)", fontWeight:600, fontSize:12.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>
                Complete Profile
              </button>
            </div>
            <button onClick={onDismissWelcome} style={{ position:"absolute", top:12, right:12, background:"rgba(255,255,255,.15)", border:"none", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.8)", fontSize:14 }}>✕</button>
          </div>
        </div>
      )}

      {/* ── EXPIRY BANNER ── */}
      {expiringPosts.length > 0 && (
        <div style={{ maxWidth:1100, margin:"16px auto 0", padding:"0 24px" }}>
          {expiringPosts.map(p=>{
            const hoursLeft = Math.max(0, Math.floor((p.expiresAt - Date.now()) / 3600000));
            const label = hoursLeft < 24 ? `${hoursLeft}h` : `${Math.floor(hoursLeft/24)}d`;
            return (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:T.amberBg, border:`1px solid ${T.amber}44`, borderRadius:T.r, marginBottom:8 }}>
                <span style={{ fontSize:18 }}>⏰</span>
                <div style={{ flex:1, fontSize:13, color:T.amber, fontWeight:600 }}>
                  "{p.title}" expires in {label}
                </div>
                <button onClick={()=>onRenewPost && onRenewPost(p.id)} style={{ padding:"5px 14px", background:T.amber, border:"none", borderRadius:99, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif", flexShrink:0 }}>
                  Renew 30 days
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── CONTENT GRID ── */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:26, alignItems:"start" }} className="feed-layout">

          {/* Posts grid */}
          <div>
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && !search && cat==="All" && (
              <RecentlyViewedBar posts={recentlyViewed} onOpen={onPostOpen} onSave={onSave} savedIds={savedIds} />
            )}

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, marginTop: recentlyViewed.length > 0 && !search && cat==="All" ? 16 : 0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:T.ink3 }}>
                {shown.length > 0 ? <><span style={{ color:T.ink }}>{sorted.length}</span> posts found</> : "No posts found"}
                {activeFilterCount > 0 && <button onClick={clearFilters} style={{ marginLeft:10, fontSize:12, color:T.accent, background:"none", border:"none", cursor:"pointer", fontWeight:700, fontFamily:"'Manrope',sans-serif" }}>Clear filters</button>}
              </div>
              {savedIds.length > 0 && (
                <div style={{ fontSize:13, color:T.ink3 }}>
                  {I.heart(true)} <span style={{ fontSize:12, color:T.rose, fontWeight:600 }}>{savedIds.length} saved</span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="board-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))", gap:16 }}>
                {Array(6).fill(0).map((_,i)=><SkeletonCard key={i} />)}
              </div>
            ) : shown.length > 0 ? (
              <>
                <div className="board-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))", gap:16 }}>
                  {shown.map(p=>(
                    <PostCard key={p.id} post={p} onOpen={onPostOpen}
                      saved={savedIds.includes(p.id)} onSave={onSave} />
                  ))}
                </div>
                {hasMore && (
                  <div style={{ textAlign:"center", padding:"28px 0 8px" }}>
                    <button className="btn btn-outline" style={{ padding:"11px 36px", borderRadius:99, fontSize:14 }} onClick={()=>setPage(p=>p+1)}>
                      Load more · {sorted.length - shown.length} remaining
                    </button>
                  </div>
                )}
                {!hasMore && sorted.length > PAGE_SIZE && (
                  <div style={{ textAlign:"center", padding:"20px 0 8px", fontSize:12.5, color:T.ink4 }}>
                    You've seen all {sorted.length} posts
                  </div>
                )}
              </>
            ) : (
              <div className="card" style={{ padding:"52px 28px", textAlign:"center" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", background:T.accentL, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:28 }}>🔍</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, marginBottom:8, color:T.ink }}>No posts match your search</div>
                <div style={{ color:T.ink3, marginBottom:16, lineHeight:1.7, maxWidth:320, margin:"0 auto 12px" }}>
                  Nothing came up for those filters. Try a popular topic:
                </div>
                <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
                  {["React","Design","Fintech","Mobile","SEO","Copywriting","Python","Branding"].map(t=>(
                    <button key={t} className="tag" onClick={()=>{ handleSearch(t); }} style={{ cursor:"pointer", padding:"5px 12px", fontSize:12, fontWeight:600, border:`1px solid ${T.border2}`, borderRadius:99 }}>{t}</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear filters</button>
                  <button className="btn btn-blue btn-sm" onClick={onPostNew}>+ Post something</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hide-md" style={{ display:"flex", flexDirection:"column", gap:16, position:"sticky", top:130 }}>
            {/* Credits card */}
            <div className="card" style={{ padding:20 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Daily Free Unlocks</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:40, color:isPaid?T.accent:credits>0?T.green:T.ink4, lineHeight:1 }}>
                  {isPaid ? "∞" : credits}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{isPaid ? "Unlimited" : `unlock${credits!==1?"s":""} left`}</div>
                  <div style={{ fontSize:12, color:T.ink3, marginTop:2 }}>{isPaid ? "Full access active" : "Resets every 24 hours"}</div>
                </div>
              </div>
              {!isPaid && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <button className="btn btn-blue btn-sm" style={{ width:"100%" }} onClick={onUpgrade}>Get Unlimited — $10/mo</button>
                  <button className="btn btn-outline btn-sm" style={{ width:"100%" }} onClick={onUpgrade}>Buy 5 Unlocks — $3</button>
                </div>
              )}
              {isPaid && (
                <div style={{ padding:"10px 14px", background:T.greenBg, borderRadius:T.r, fontSize:13, color:T.green, fontWeight:600 }}>
                  ✅ Unlimited plan active
                </div>
              )}
            </div>

            {/* How it works */}
            <div className="card" style={{ padding:20 }}>
              <div className="lbl" style={{ marginBottom:16 }}>How Hired Works</div>
              {[
                { n:"01", t:"Post for free", d:"Both clients & freelancers post at no cost" },
                { n:"02", t:"Browse the board", d:"See all posts with summaries & tags" },
                { n:"03", t:"Unlock to connect", d:"1 free/day, or upgrade for more" },
              ].map(s=>(
                <div key={s.n} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:T.accentL, color:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, flexShrink:0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{s.t}</div>
                    <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending categories */}
            <div className="card" style={{ padding:20 }}>
              <div className="lbl" style={{ marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>{I.trending} Trending</div>
              {[["Technology",38],["Design",24],["Writing",19],["Marketing",16],["Video & Media",14]].map(([c,n],i)=>(
                <div key={c} onClick={()=>{setCat(c);setFilters(true);}}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:i<4?`1px solid ${T.border}`:"none", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.color=T.accent}
                  onMouseLeave={e=>e.currentTarget.style.color=""}>
                  <span style={{ fontSize:13.5, fontWeight:500, transition:"color .15s" }}>{c}</span>
                  <span style={{ fontSize:12, color:T.ink4, background:T.bg, padding:"2px 8px", borderRadius:99 }}>{n}</span>
                </div>
              ))}
            </div>

            {/* AI Matching */}
            <AiMatchCard onPostOpen={onPostOpen} savedIds={savedIds} onSave={onSave} allPosts={allPosts} />

            {/* Post CTA */}
            <div style={{ background:"linear-gradient(135deg,"+T.accent+",#3B82F6)", borderRadius:T.r2, padding:"22px 20px", color:"#fff" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, marginBottom:8 }}>Ready to post?</div>
              <div style={{ fontSize:13, opacity:.85, marginBottom:16, lineHeight:1.6 }}>It's free. Reach thousands of professionals worldwide.</div>
              <button className="btn" style={{ background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.3)", width:"100%", backdropFilter:"blur(4px)" }} onClick={onPostNew}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── DASHBOARD PAGE ────────────────────────────────────────────────────────*/
const DashboardPage = ({ isPaid, onUpgrade, credits, savedIds, onSave, allPosts, onPostOpen, fire, userPosts=[], proposals=[], onEditPost, onDeletePost, onReferral, onPostNew, onNavigate }) => {
  const [activeTab, setTab] = useState("overview");

  const savedPosts = allPosts.filter(p => savedIds.includes(p.id));

  return (
    <div style={{ maxWidth:1100, margin:"0 auto" }} className="dash-page-wrap">
      {/* Header */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"28px 20px 0", borderRadius:`${T.r2} ${T.r2} 0 0`, marginBottom:28 }} className="dash-header-pad">
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="lbl" style={{ marginBottom:10 }}>Your Dashboard</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:4 }}>Welcome back, {localStorage.getItem("hired_profile_name")||"there"} 👋</div>
          <div style={{ fontSize:14, color:T.ink3, marginBottom:20 }}>Here's how your posts are performing</div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:0, borderBottom:"none" }} className="dash-tabs">
            {[["overview","Overview"],["saved","Saved Posts"],["posts","My Posts"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2.5px solid ${activeTab===k?T.accent:"transparent"}`, cursor:"pointer", fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:13.5, color:activeTab===k?T.accent:T.ink3, transition:"all .15s" }}>
                {l}
                {k==="saved" && savedIds.length>0 && <span style={{ marginLeft:6, background:T.accent, color:"#fff", borderRadius:99, fontSize:11, fontWeight:700, padding:"1px 7px" }}>{savedIds.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab==="overview" && (
        <div className="fade-in">
          {/* First-time CTA — shown when user has no posts yet */}
          {userPosts.length === 0 && proposals.length === 0 && savedIds.length === 0 && (
            <div style={{ padding:"0 24px 20px" }} className="dash-pad">
              <div style={{ background:"linear-gradient(135deg,#1A56DB,#1e40af)", borderRadius:T.r2, padding:"28px 28px", color:"#fff", display:"flex", gap:20, alignItems:"center", flexWrap:"wrap", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", right:-30, top:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }} />
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:6 }}>Welcome to your dashboard 👋</div>
                  <div style={{ fontSize:13.5, opacity:.88, lineHeight:1.7 }}>Post your first opportunity or offer to get discovered by clients and freelancers across 94+ countries.</div>
                </div>
                <div style={{ display:"flex", gap:10, flexShrink:0, flexWrap:"wrap" }}>
                  <button onClick={onPostNew} style={{ padding:"11px 22px", background:"#fff", border:"none", borderRadius:99, color:T.accent, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif", boxShadow:"0 4px 14px rgba(0,0,0,.15)" }}>
                    + Post Now
                  </button>
                  <button onClick={()=>onNavigate&&onNavigate("board")} style={{ padding:"11px 22px", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", borderRadius:99, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif", backdropFilter:"blur(6px)" }}>
                    Browse Board
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats grid — derived from real state */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24, padding:"0 24px" }} className="g4 dash-pad">
            {[
              { l:"Total Posts",    v:String(userPosts.length),   d:userPosts.filter(p=>p.expiresAt>Date.now()).length+" active",  grad:"linear-gradient(135deg,#1A56DB,#3B82F6)", icon:"📝", shadow:"rgba(26,86,219,.2)",  tab:null },
              { l:"Proposals Sent", v:String(proposals.length),   d:proposals.filter(p=>p.status==="pending").length+" pending",   grad:"linear-gradient(135deg,#0F766E,#06B6D4)", icon:"📨", shadow:"rgba(15,118,110,.2)", tab:"posts" },
              { l:"Unlocks Left",   v:isPaid?"∞":String(credits), d:isPaid?"Unlimited":"today",                                    grad:"linear-gradient(135deg,#166534,#22C55E)", icon:"✨", shadow:"rgba(22,101,52,.2)",  tab:null },
              { l:"Saved Posts",    v:String(savedIds.length),    d:"tap to view saved",                                           grad:"linear-gradient(135deg,#DB2777,#F43F5E)", icon:"❤️", shadow:"rgba(219,39,119,.2)", tab:"saved" },
            ].map(s=>(
              <div key={s.l} className="card" onClick={s.tab ? ()=>setTab(s.tab) : undefined}
                style={{ padding:"20px 18px", borderTop:`3px solid transparent`, backgroundImage:`linear-gradient(${T.white},${T.white}),${s.grad}`, backgroundOrigin:"border-box", backgroundClip:"padding-box,border-box", boxShadow:`0 4px 20px ${s.shadow}`, cursor:s.tab?"pointer":"default", transition:"transform .15s, box-shadow .15s" }}
                onMouseEnter={s.tab ? e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 28px ${s.shadow}`; } : undefined}
                onMouseLeave={s.tab ? e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 4px 20px ${s.shadow}`; } : undefined}
              >
                <div style={{ width:40, height:40, borderRadius:12, background:s.grad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12, boxShadow:`0 4px 12px ${s.shadow}` }}>{s.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".5px", marginBottom:8, background:s.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{s.l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:T.ink, lineHeight:1, marginBottom:5 }}>{s.v}</div>
                <div style={{ fontSize:12, color:s.tab?T.accent:T.ink3, fontWeight:s.tab?600:400 }}>{s.d}</div>
              </div>
            ))}
          </div>

          <div style={{ padding:"0 24px", marginTop:16 }} className="dash-section-pad">
            <AnalyticsChart />
            {/* Soft upgrade nudge — free users only, shown mid-session */}
            {!isPaid && credits <= 0 && (
              <div style={{ background:`linear-gradient(135deg,${T.accentL},#f0f4ff)`, border:`1.5px solid ${T.accentM}`, borderRadius:T.r2, padding:"18px 20px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:13.5, color:T.accent, marginBottom:4 }}>You've used all your free unlocks today 🔓</div>
                  <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.6 }}>Go unlimited for <strong>$10/mo</strong>, or grab 5 more unlocks for just <strong>$3</strong>.</div>
                </div>
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  <button className="btn btn-outline btn-sm" style={{ fontSize:12 }} onClick={onUpgrade}>5 for $3</button>
                  <button className="btn btn-blue btn-sm" style={{ fontSize:12 }} onClick={onUpgrade}>Go Unlimited →</button>
                </div>
              </div>
            )}
            <ReferCard fire={fire} onReferral={onReferral} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, padding:"0 24px" }} className="g2 dash-section-pad">
            {/* My Posts */}
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:14 }}>My Posts</div>
              {userPosts.length === 0 ? (
                <div style={{ fontSize:12.5, color:T.ink3, padding:"12px 0", textAlign:"center" }}>No posts yet — publish your first one!</div>
              ) : userPosts.slice(0,3).map((p,i)=>(
                <div key={p.id} onClick={()=>onPostOpen(p)} style={{ display:"flex", gap:8, padding:"10px 0", borderBottom:i<Math.min(2,userPosts.length-1)?`1px solid ${T.border}`:"none", alignItems:"center", cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <div style={{ width:3, alignSelf:"stretch", borderRadius:99, background:p.type==="need"?T.rose:T.teal, flexShrink:0, minHeight:36 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{p.title}</div>
                    <div style={{ fontSize:11, color:T.ink3, display:"flex", gap:6, flexWrap:"wrap" }}>
                      <span>{p.type==="need"?"Client":"Service"} · {p.posted}</span>
                      {p.postedMs && (()=>{ const d=Math.max(0,30-Math.floor((Date.now()-p.postedMs)/86400000)); return d<=7 ? <span style={{ color:d===0?T.rose:T.amber, fontWeight:700 }}>{d===0?"Expires today":`${d}d left`}</span> : null; })()}
                    </div>
                  </div>
                  {onDeletePost && <button onClick={e=>{e.stopPropagation();onDeletePost(p.id);}} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:14, flexShrink:0 }}>🗑</button>}
                </div>
              ))}
              <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}` }}>
                <button className="btn btn-outline btn-sm" style={{ width:"100%", fontSize:12 }} onClick={()=>onPostNew&&onPostNew()}>+ New Post</button>
              </div>
            </div>

            {/* Plan & Access */}
            <div className="card" style={{ padding:16 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Plan & Access</div>
              <div style={{ padding:"12px", background:isPaid?T.greenBg:T.accentL, borderRadius:T.r, marginBottom:12, border:`1px solid ${isPaid?T.green+"44":T.accentM}` }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:4, color:isPaid?T.green:T.accent }}>
                  {isPaid ? "✅ Unlimited" : "🆓 Free Plan"}
                </div>
                <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.5 }}>
                  {isPaid ? "Unlimited unlocks active." : `${credits} unlock${credits!==1?"s":""} left today.`}
                </div>
              </div>
              {!isPaid && (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  <button className="btn btn-blue btn-sm" style={{ width:"100%", fontSize:11.5 }} onClick={onUpgrade}>Upgrade — $10/mo</button>
                  <button className="btn btn-outline btn-sm" style={{ width:"100%", fontSize:11.5 }} onClick={onUpgrade}>5 Unlocks — $3</button>
                </div>
              )}
              <Dv my={12} />
              <div className="lbl" style={{ marginBottom:10 }}>Quick Actions</div>
              {[["📝 Post a Job","btn-blue"],["✅ Get Verified","btn-outline"],["⚡ Boost","btn-outline"]].map(([l,s])=>(
                <button key={l} className={`btn ${s} btn-sm`} style={{ width:"100%", marginBottom:6, justifyContent:"flex-start", fontSize:11.5 }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==="saved" && (
        <div className="fade-in dash-section-pad" style={{ padding:"0 24px" }}>
          {savedPosts.length===0 ? (
            <div className="card" style={{ padding:"52px 28px", textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:T.roseBg||"#FFF1F2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:32 }}>❤️</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8 }}>Nothing saved yet</div>
              <div style={{ color:T.ink3, fontSize:13.5, lineHeight:1.7, maxWidth:280, margin:"0 auto 20px" }}>Tap the heart on any post to save it here for later.</div>
              <button className="btn btn-outline btn-sm" onClick={()=>onNavigate&&onNavigate("board")}>Browse the board →</button>
            </div>
          ) : (
            <div className="board-grid saved-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))", gap:16 }}>
              {savedPosts.map(p=>(
                <PostCard key={p.id} post={p} onOpen={onPostOpen} saved={savedIds.includes(p.id)} onSave={onSave} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab==="posts" && (
        <div className="fade-in dash-section-pad" style={{ padding:"0 24px" }}>
          <div className="card" style={{ padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div className="lbl">Your Active Posts</div>
              <span style={{ fontSize:12, color:T.ink4 }}>{userPosts.length} post{userPosts.length!==1?"s":""}</span>
            </div>
            {userPosts.length === 0 ? (
              <div style={{ padding:"32px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>📝</div>
                <div style={{ fontSize:14, color:T.ink3 }}>You haven't posted anything yet.</div>
              </div>
            ) : userPosts.map((p,i,arr)=>(
              <div key={p.id} style={{ display:"flex", gap:10, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", alignItems:"flex-start" }}>
                <div style={{ width:3, borderRadius:99, background:p.type==="need"?T.rose:T.teal, flexShrink:0, minHeight:50, alignSelf:"stretch" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, marginBottom:5, lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{p.title}</div>
                  <div className="sx" style={{ marginBottom:6, gap:4 }}>
                    <PostTypeBadge type={p.type} />
                    <WorkTypeBadge type={p.workType} />
                  </div>
                  <div style={{ fontSize:12, color:T.ink3 }}>{p.apps||0} interested · {p.posted}</div>
                </div>
                <div style={{ flexShrink:0, textAlign:"right" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:6 }}>{p.budget}</div>
                  <div style={{ display:"flex", gap:5 }}>
                    {onEditPost && <button className="btn btn-outline btn-xs" onClick={()=>onEditPost(p)}>{I.edit}</button>}
                    {onDeletePost && <button className="btn btn-danger btn-xs" onClick={()=>onDeletePost(p.id)}>{I.trash}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {proposals.length > 0 && (
            <div className="card" style={{ padding:16, marginTop:16 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Proposals Sent ({proposals.length})</div>
              {proposals.map((p,i,arr)=>{
                const statusMap = {
                  pending:  { label:"⏳ Pending",  color:T.amber,  bg:T.amberBg  },
                  viewed:   { label:"👀 Viewed",   color:T.accent, bg:T.accentL  },
                  accepted: { label:"✅ Accepted",  color:T.green,  bg:T.greenBg  },
                  declined: { label:"❌ Declined",  color:T.rose,   bg:T.roseBg   },
                };
                const s = statusMap[p.status] || statusMap.pending;
                return (
                <div key={p.id} style={{ padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <div style={{ fontWeight:600, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{p.postTitle}</div>
                    <span style={{ fontSize:11, fontWeight:700, color:s.color, background:s.bg, padding:"3px 9px", borderRadius:99, flexShrink:0 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.pitch}</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:3 }}>{new Date(p.sentAt).toLocaleDateString()}{p.rate ? ` · ${p.rate}` : ""}{p.avail ? ` · ${p.avail}` : ""}</div>
                  {p.status==="accepted" && (
                    <div style={{ marginTop:6, fontSize:11.5, color:T.green, fontWeight:600 }}>🎉 Congratulations! The client accepted your proposal.</div>
                  )}
                  {p.status==="declined" && (
                    <div style={{ marginTop:6, fontSize:11.5, color:T.rose }}>This proposal wasn't a fit — keep going!</div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── PORTFOLIO TAB ─────────────────────────────────────────────────────────*/
const PortfolioTab = ({ PORTFOLIO }) => {
  const [portfolio, setPortfolio] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_portfolio")||"null")||PORTFOLIO; } catch { return PORTFOLIO; } });
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newEmoji, setNewEmoji] = useState("🚀");
  const [newImage, setNewImage] = useState(null);
  const [newColor, setNewColor] = useState(T.accent);
  const imgRef = useRef(null);
  const EMOJIS = ["🚀","💡","🎨","📊","💳","📱","🌍","🔧","✨","🎯","📝","🔬"];
  const COLORS = [T.accent,"#9D174D","#0F766E","#7C3AED","#92400E","#166534","#0F172A"];
  const savePortfolio = (next) => { setPortfolio(next); try { localStorage.setItem("hired_portfolio",JSON.stringify(next)); } catch {} };
  const addItem = () => {
    if (!newTitle.trim()) return;
    const item = { title:newTitle.trim(), desc:newDesc.trim(), link:newLink.trim(), tags:newTags.split(",").map(t=>t.trim()).filter(Boolean), emoji:newEmoji, color:newColor, cat:"Project", image:newImage, isOwn:true };
    savePortfolio([item, ...portfolio]);
    setShowAdd(false); setNewTitle(""); setNewDesc(""); setNewLink(""); setNewTags(""); setNewImage(null);
  };
  const deleteItem = (i) => savePortfolio(portfolio.filter((_,idx)=>idx!==i));
  return (
    <div className="fade-in">
      {showAdd && (
        <div className="card" style={{ padding:20, marginBottom:14, border:`2px solid ${T.accentM}` }}>
          <div className="lbl" style={{ marginBottom:14 }}>New Portfolio Item</div>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            {EMOJIS.map(e=><button key={e} onClick={()=>setNewEmoji(e)} style={{ width:36,height:36,borderRadius:8,border:`2px solid ${newEmoji===e?T.accent:T.border}`,background:newEmoji===e?T.accentL:"transparent",fontSize:18,cursor:"pointer" }}>{e}</button>)}
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            {COLORS.map(c=><button key={c} onClick={()=>setNewColor(c)} style={{ width:24,height:24,borderRadius:"50%",background:c,border:`3px solid ${newColor===c?"#fff":"transparent"}`,outline:`2px solid ${newColor===c?c:"transparent"}`,cursor:"pointer" }}/>)}
          </div>
          <input className="input" placeholder="Project title *" value={newTitle} onChange={e=>setNewTitle(e.target.value)} style={{ marginBottom:10 }} />
          <textarea className="input" rows={2} placeholder="Short description" value={newDesc} onChange={e=>setNewDesc(e.target.value)} style={{ resize:"vertical", marginBottom:10 }} />
          <input className="input" placeholder="Link (optional)" value={newLink} onChange={e=>setNewLink(e.target.value)} style={{ marginBottom:10 }} />
          <input className="input" placeholder="Tags — comma separated" value={newTags} onChange={e=>setNewTags(e.target.value)} style={{ marginBottom:14 }} />
          <div style={{ marginBottom:14 }}>
            <div className="lbl" style={{ marginBottom:8 }}>Cover Image (optional)</div>
            <div onClick={()=>imgRef.current?.click()} style={{ height:80, border:`2px dashed ${newImage?T.accent:T.border}`, borderRadius:T.r, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", background:newImage?T.accentL:T.bg, transition:"all .15s", overflow:"hidden" }}>
              {newImage ? <img src={newImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <div style={{ textAlign:"center" }}><div style={{ fontSize:20 }}>📎</div><div style={{ fontSize:12, color:T.ink3, marginTop:4 }}>Upload image</div></div>}
            </div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>setNewImage(ev.target.result); r.readAsDataURL(f); }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button className="btn btn-blue btn-sm" onClick={addItem} disabled={!newTitle.trim()}>Add to Portfolio</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }} className="g2">
        {portfolio.map((p,i)=>(
          <div key={i} className="card card-lift" style={{ padding:0, overflow:"hidden", cursor:"pointer", position:"relative" }}>
            {p.image && <img src={p.image} alt={p.title} loading="lazy" style={{ width:"100%", height:100, objectFit:"cover", display:"block" }} />}
            {!p.image && <div style={{ height:6, background:p.color }} />}
            <div style={{ padding:16 }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{p.emoji}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, marginBottom:4, lineHeight:1.3 }}>{p.title}</div>
              <div style={{ fontSize:11, color:T.ink4, marginBottom:6 }}>{p.cat}</div>
              {p.desc && <p style={{ fontSize:12.5, color:T.ink3, lineHeight:1.6, marginBottom:10 }}>{p.desc}</p>}
              {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:11.5, color:T.accent, fontWeight:600, textDecoration:"none" }}>🔗 View Project</a>}
              {p.tags?.length > 0 && <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>{p.tags.map(t=><span key={t} className="tag" style={{ fontSize:10.5, color:T.ink3 }}>{t}</span>)}</div>}
            </div>
            {p.isOwn && <button onClick={e=>{e.stopPropagation();deleteItem(i);}} style={{ position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",border:"none",borderRadius:"50%",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:12 }}>✕</button>}
          </div>
        ))}
        <div className="card" onClick={()=>setShowAdd(true)} style={{ padding:18, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", border:`2px dashed ${T.border}`, cursor:"pointer", minHeight:140, transition:"border-color .15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <div style={{ fontSize:28, marginBottom:6 }}>+</div>
          <div style={{ fontSize:12.5, fontWeight:600, color:T.ink3 }}>Add Project</div>
          <div style={{ fontSize:11, color:T.ink4, marginTop:4 }}>Image, link, or description</div>
        </div>
      </div>
    </div>
  );
};

/* ─── REVIEWS TAB ────────────────────────────────────────────────────────────*/
const ReviewsTab = ({ REVIEWS }) => {
  const [userReviews, setUserReviews] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_reviews")||"null")||REVIEWS; } catch { return REVIEWS; } });
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [newProject, setNewProject] = useState("");
  const [hoverStar, setHoverStar] = useState(0);
  const submitReview = () => {
    if (!newText.trim()) return;
    const r = { name:"You (Demo)", av:"YO", color:T.accent, rating:newRating, text:newText.trim(), time:"just now", project:newProject||"Project", isOwn:true };
    const next = [r, ...userReviews];
    setUserReviews(next);
    localStorage.setItem("hired_reviews", JSON.stringify(next));
    setShowForm(false); setNewText(""); setNewProject(""); setNewRating(5);
  };
  const avgRating = (userReviews.reduce((a,r)=>a+r.rating,0)/userReviews.length).toFixed(1);
  const ratingCounts = [5,4,3,2,1].map(s=>({ star:s, count:userReviews.filter(r=>r.rating===s).length }));
  return (
    <div className="fade-in">
      <div className="card" style={{ padding:20, marginBottom:14, display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:48, color:T.ink, lineHeight:1 }}>{avgRating}</div>
          <div style={{ display:"flex", gap:2, justifyContent:"center", margin:"5px 0" }}>{[1,2,3,4,5].map(i=><span key={i} style={{ color:"#FBBF24", fontSize:16 }}>★</span>)}</div>
          <div style={{ fontSize:11.5, color:T.ink4 }}>{userReviews.length} reviews</div>
        </div>
        <div style={{ flex:1, minWidth:160 }}>
          {ratingCounts.map(({star,count})=>(
            <div key={star} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
              <span style={{ fontSize:11, color:T.ink3, width:10 }}>{star}</span>
              <span style={{ color:"#FBBF24", fontSize:12 }}>★</span>
              <div style={{ flex:1, height:5, background:T.border, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${userReviews.length?count/userReviews.length*100:0}%`, background:"#FBBF24", borderRadius:99, transition:"width .6s ease" }} />
              </div>
              <span style={{ fontSize:11, color:T.ink4, width:12 }}>{count}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" onClick={()=>setShowForm(v=>!v)} style={{ flexShrink:0 }}>{showForm?"Cancel":"+ Leave a Review"}</button>
      </div>
      {showForm && (
        <div className="card" style={{ padding:20, marginBottom:14, border:`2px solid ${T.accentM}` }}>
          <div className="lbl" style={{ marginBottom:12 }}>Leave a Review</div>
          <div style={{ display:"flex", gap:4, marginBottom:14 }}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} onMouseEnter={()=>setHoverStar(s)} onMouseLeave={()=>setHoverStar(0)} onClick={()=>setNewRating(s)}
                style={{ fontSize:28, background:"none", border:"none", cursor:"pointer", color:(hoverStar||newRating)>=s?"#FBBF24":T.border, transition:"color .1s" }}>★</button>
            ))}
          </div>
          <input className="input" placeholder="Project name (optional)" value={newProject} onChange={e=>setNewProject(e.target.value)} style={{ marginBottom:10 }} />
          <textarea className="input" rows={3} placeholder="Share your experience…" value={newText} onChange={e=>setNewText(e.target.value)} style={{ resize:"vertical", marginBottom:12 }} />
          <button className="btn btn-blue btn-sm" onClick={submitReview} disabled={!newText.trim()}>Submit Review</button>
        </div>
      )}
      {userReviews.map((r,i)=>(
        <div key={i} className="card" style={{ padding:18, marginBottom:10, border:r.isOwn?`1.5px solid ${T.accentM}`:undefined }}>
          {r.isOwn && <div style={{ fontSize:11, fontWeight:700, color:T.accent, marginBottom:8, textTransform:"uppercase", letterSpacing:".5px" }}>Your review</div>}
          <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
            <Av text={r.av} color={r.color} size={36} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{r.name}</div>
              <div style={{ fontSize:11.5, color:T.ink4 }}>{r.project} · {r.time}</div>
            </div>
            <div style={{ display:"flex", gap:1 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=r.rating?"#FBBF24":T.border, fontSize:13 }}>★</span>)}</div>
          </div>
          <p style={{ fontSize:13, color:T.ink2, lineHeight:1.7 }}>{r.text}</p>
        </div>
      ))}
    </div>
  );
};

/* ─── PROFILE HELPER FORMS ──────────────────────────────────────────────────*/
const AddExperienceForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(""); const [company, setCompany] = useState(""); const [period, setPeriod] = useState(""); const [desc, setDesc] = useState("");
  const COLORS = ["#1A56DB","#7C3AED","#059669","#EA580C","#0891B2","#DB2777"];
  const [color, setColor] = useState(COLORS[0]);
  const submit = () => { if (!role.trim()||!company.trim()) return; onAdd({ role:role.trim(), company:company.trim(), period:period.trim(), desc:desc.trim(), color }); setRole(""); setCompany(""); setPeriod(""); setDesc(""); setOpen(false); };
  if (!open) return <button className="btn btn-outline btn-sm" style={{ width:"100%", marginTop:14 }} onClick={()=>setOpen(true)}>+ Add Experience</button>;
  return (
    <div style={{ background:T.bg, borderRadius:T.r, padding:16, marginTop:14, border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>New Experience</div>
      {[["Job Title *",role,setRole,"e.g. Software Engineer"],["Company *",company,setCompany,"e.g. Acme Corp"],["Period",period,setPeriod,"e.g. 2022 – Present"]].map(([l,v,sv,ph])=>(
        <div key={l} style={{ marginBottom:10 }}><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>{l}</label><input className="input" value={v} onChange={e=>sv(e.target.value)} placeholder={ph} /></div>
      ))}
      <div style={{ marginBottom:10 }}><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>Description</label><textarea className="input" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Brief description of your role…" style={{ resize:"vertical" }} /></div>
      <div style={{ marginBottom:14, display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:700, color:T.ink3 }}>Color:</span>
        {COLORS.map(c=><button key={c} onClick={()=>setColor(c)} style={{ width:22, height:22, borderRadius:"50%", background:c, border:color===c?"3px solid #fff":"2px solid transparent", boxShadow:color===c?`0 0 0 2px ${c}`:"none", cursor:"pointer" }} />)}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(false)}>Cancel</button>
        <button className="btn btn-blue btn-sm" style={{ flex:1 }} onClick={submit} disabled={!role.trim()||!company.trim()}>Add</button>
      </div>
    </div>
  );
};

const AddCertForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(""); const [issuer, setIssuer] = useState(""); const [year, setYear] = useState("");
  const ICONS = ["🏅","📜","☁️","🔄","🎯","💡","🔐","📊","🌐","🔬"];
  const [icon, setIcon] = useState("🏅");
  const submit = () => { if (!title.trim()) return; onAdd({ title:title.trim(), issuer:issuer.trim(), year:year.trim(), icon }); setTitle(""); setIssuer(""); setYear(""); setOpen(false); };
  if (!open) return <button className="btn btn-outline btn-sm" style={{ width:"100%", marginTop:14 }} onClick={()=>setOpen(true)}>+ Add Certification</button>;
  return (
    <div style={{ background:T.bg, borderRadius:T.r, padding:16, marginTop:14, border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>New Certification</div>
      {[["Certificate Name *",title,setTitle,"e.g. AWS Cloud Practitioner"],["Issuing Organisation",issuer,setIssuer,"e.g. Amazon Web Services"],["Year",year,setYear,"e.g. 2024"]].map(([l,v,sv,ph])=>(
        <div key={l} style={{ marginBottom:10 }}><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>{l}</label><input className="input" value={v} onChange={e=>sv(e.target.value)} placeholder={ph} /></div>
      ))}
      <div style={{ marginBottom:14, display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:11, fontWeight:700, color:T.ink3 }}>Icon:</span>
        {ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{ fontSize:18, background:icon===ic?T.accentL:"none", border:icon===ic?`1px solid ${T.accentM}`:"1px solid transparent", borderRadius:6, padding:"2px 6px", cursor:"pointer" }}>{ic}</button>)}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(false)}>Cancel</button>
        <button className="btn btn-blue btn-sm" style={{ flex:1 }} onClick={submit} disabled={!title.trim()}>Add</button>
      </div>
    </div>
  );
};

const AddEducationForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [deg, setDeg] = useState(""); const [school, setSchool] = useState(""); const [year, setYear] = useState("");
  const submit = () => { if (!deg.trim()||!school.trim()) return; onAdd({ deg:deg.trim(), school:school.trim(), year:year.trim() }); setDeg(""); setSchool(""); setYear(""); setOpen(false); };
  if (!open) return <button className="btn btn-outline btn-sm" style={{ width:"100%", marginTop:14 }} onClick={()=>setOpen(true)}>+ Add Education</button>;
  return (
    <div style={{ background:T.bg, borderRadius:T.r, padding:16, marginTop:14, border:`1px solid ${T.border}` }}>
      <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>New Education</div>
      {[["Degree / Qualification *",deg,setDeg,"e.g. BSc Computer Science"],["School / University *",school,setSchool,"e.g. University of Lagos"],["Years",year,setYear,"e.g. 2018–2022"]].map(([l,v,sv,ph])=>(
        <div key={l} style={{ marginBottom:10 }}><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>{l}</label><input className="input" value={v} onChange={e=>sv(e.target.value)} placeholder={ph} /></div>
      ))}
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(false)}>Cancel</button>
        <button className="btn btn-blue btn-sm" style={{ flex:1 }} onClick={submit} disabled={!deg.trim()||!school.trim()}>Add</button>
      </div>
    </div>
  );
};

const AddLanguageForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(""); const [level, setLevel] = useState("Conversational");
  const LEVELS = ["Native","Fluent","Conversational","Basic"];
  const submit = () => { if (!lang.trim()) return; onAdd({ lang:lang.trim(), level }); setLang(""); setLevel("Conversational"); setOpen(false); };
  if (!open) return <button className="btn btn-outline btn-sm" style={{ width:"100%" }} onClick={()=>setOpen(true)}>+ Add Language</button>;
  return (
    <div style={{ background:T.bg, borderRadius:T.r, padding:14, border:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", gap:10, marginBottom:10 }}>
        <div style={{ flex:1 }}><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>Language *</label><input className="input" value={lang} onChange={e=>setLang(e.target.value)} placeholder="e.g. French" autoFocus /></div>
        <div><label style={{ fontSize:11, fontWeight:700, color:T.ink3, display:"block", marginBottom:4 }}>Level</label><select className="input" value={level} onChange={e=>setLevel(e.target.value)}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setOpen(false)}>Cancel</button>
        <button className="btn btn-blue btn-sm" style={{ flex:1 }} onClick={submit} disabled={!lang.trim()}>Add</button>
      </div>
    </div>
  );
};

const SocialLinksEditor = () => {
  const LINKS = [
    { k:"linkedin", label:"LinkedIn", icon:"🔗", ph:"linkedin.com/in/yourname" },
    { k:"github",   label:"GitHub",   icon:"🐙", ph:"github.com/yourname" },
    { k:"portfolio",label:"Portfolio",icon:"🌐", ph:"yourwebsite.com" },
    { k:"twitter",  label:"Twitter/X",icon:"𝕏",  ph:"x.com/yourname" },
  ];
  const [vals, setVals] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_social_links")||"{}"); } catch { return {}; } });
  const save = (k, v) => { const next = { ...vals, [k]:v }; setVals(next); localStorage.setItem("hired_social_links", JSON.stringify(next)); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {LINKS.map(s=>(
        <div key={s.k} style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:15, width:22, textAlign:"center", flexShrink:0 }}>{s.icon}</span>
          <div style={{ width:76, fontSize:12, fontWeight:600, color:T.ink3, flexShrink:0 }}>{s.label}</div>
          <input className="input" value={vals[s.k]||""} onChange={e=>save(s.k, e.target.value)} placeholder={s.ph} style={{ fontSize:12 }} />
        </div>
      ))}
    </div>
  );
};

/* ─── PROFILE PAGE ──────────────────────────────────────────────────────────*/
const ProfilePage = ({ isPaid, onUpgrade, onLogout, onReferral, onSettings, userPosts=[], fire=()=>{} }) => {
  const [tab, setTab]         = useState("overview");
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(() => { try { return localStorage.getItem("hired_profile_name")||""; } catch { return ""; } });
  const [headline, setHeadline] = useState(() => { try { return localStorage.getItem("hired_profile_headline")||""; } catch { return ""; } });
  const [bio, setBio]         = useState(() => { try { return localStorage.getItem("hired_profile_bio")||""; } catch { return ""; } });
  const [avail, setAvail]     = useState(() => { try { return localStorage.getItem("hired_avail")||"open"; } catch { return "open"; } });
  const [skills, setSkills]   = useState(() => { try { return JSON.parse(localStorage.getItem("hired_profile_skills")||"[]"); } catch { return []; } });
  const [skillInput, setSkillInput] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [bannerGrad, setBannerGrad] = useState(0);
  const [bannerImg,  setBannerImg]  = useState(() => { try { return localStorage.getItem("hired_banner_img")||null; } catch { return null; } });
  const [avatarImg,  setAvatarImg]  = useState(() => { try { return localStorage.getItem("hired_avatar_img")||null; } catch { return null; } });
  const [avatarHover, setAvatarHover] = useState(false);
  const [bannerHover, setBannerHover] = useState(false);
  const [uploadErr, setUploadErr] = useState(null);
  const [uploading, setUploading] = useState(null); // "banner" | "avatar" | null
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleBannerUpload = e => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadErr("Please choose an image file (JPG, PNG, etc.)"); return; }
    if (file.size > 4 * 1024 * 1024) { setUploadErr("Image is too large — please use one under 4 MB"); return; }
    setUploadErr(null); setUploading("banner");
    const r = new FileReader();
    r.onload = ev => { setBannerImg(ev.target.result); try { localStorage.setItem("hired_banner_img", ev.target.result); } catch {} setUploading(null); };
    r.onerror = () => { setUploadErr("Failed to read file — please try again"); setUploading(null); };
    r.readAsDataURL(file);
  };

  const handleAvatarUpload = e => {
    const file = e.target.files[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadErr("Please choose an image file (JPG, PNG, etc.)"); return; }
    if (file.size > 2 * 1024 * 1024) { setUploadErr("Avatar is too large — please use one under 2 MB"); return; }
    setUploadErr(null); setUploading("avatar");
    const r = new FileReader();
    r.onload = ev => { setAvatarImg(ev.target.result); try { localStorage.setItem("hired_avatar_img", ev.target.result); } catch {} setUploading(null); };
    r.onerror = () => { setUploadErr("Failed to read file — please try again"); setUploading(null); };
    r.readAsDataURL(file);
  };
  const [endorsements, setEndorsements] = useState({});
  const [savedJobs, setSavedJobs] = useState(0);
  const [earning, setEarning] = useState("$0");
  const [hiresCount, setHiresCount] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [profileViews, setProfileViews] = useState([0,0,0,0,0,0,0]);
  const [languages, setLanguages] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_profile_langs")||"[]"); } catch { return []; } });
  const [certifications, setCertifications] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_profile_certs")||"[]"); } catch { return []; } });
  const [experience, setExperience] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_profile_exp")||"[]"); } catch { return []; } });

  const BANNERS = [
    "linear-gradient(120deg,#1A56DB 0%,#3B82F6 50%,#818CF8 100%)",
    "linear-gradient(120deg,#DB2777 0%,#F43F5E 50%,#FB923C 100%)",
    "linear-gradient(120deg,#0891B2 0%,#06B6D4 50%,#67E8F9 100%)",
    "linear-gradient(120deg,#166534 0%,#22C55E 50%,#86EFAC 100%)",
    "linear-gradient(120deg,#EA580C 0%,#F97316 50%,#FCD34D 100%)",
    "linear-gradient(120deg,#5B21B6 0%,#7C3AED 50%,#A78BFA 100%)",
  ];

  const availOpts = [
    { k:"hiring", label:"🟢 Actively Hiring", color:T.green,  bg:T.greenBg },
    { k:"open",   label:"🔵 Open to Work",    color:T.accent, bg:T.accentL },
    { k:"busy",   label:"🟡 Busy",            color:T.amber,  bg:T.amberBg },
    { k:"break",  label:"⛔ Taking a Break",  color:T.ink3,   bg:T.border  },
  ];

  const REVIEWS = [];
  const PORTFOLIO = [];
  const ACTIVITY = [];

  const profileFields = [
    { label:"Name", done:!!name }, { label:"Bio", done:!!bio },
    { label:"Availability", done:!!avail }, { label:"Skills", done:skills.length>0 },
    { label:"Portfolio", done:PORTFOLIO.length>0 }, { label:"Verified", done:false },
    { label:"Experience", done:experience.length>0 }, { label:"Certifications", done:certifications.length>0 },
  ];
  const completionPct = Math.round((profileFields.filter(f=>f.done).length / profileFields.length) * 100);

  const trustItems = [
    { label:"Email verified",    done:!!name  },
    { label:"Phone verified",    done:false },
    { label:"ID verified",       done:false },
    { label:"Payment method",    done:false },
    { label:"3+ reviews",        done:false },
    { label:"Profile complete",  done:completionPct>=80 },
  ];
  const trustScore = Math.round(trustItems.filter(t=>t.done).length / 6 * 100);

  const TABS = ["overview","experience","portfolio","reviews","activity","settings"];

  const Switch = ({ on, onChange }) => (
    <div onClick={onChange} style={{ width:42, height:24, borderRadius:99, background:on?T.accent:T.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:on?20:3, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", transition:"left .2s" }} />
    </div>
  );

  const [notifState, setNotifState] = useState({ msg:true, interest:true, digest:false, views:true, promos:false });
  const [privState,  setPrivState]  = useState({ search:true, online:true, dms:true, count:false });

  return (
    <div style={{ maxWidth:820, margin:"0 auto" }}>

      {/* ── BANNER ── */}
      <div
        style={{ height:160, borderRadius:T.r2, background:BANNERS[bannerGrad], position:"relative", overflow:"hidden", cursor:"pointer" }}
        onMouseEnter={()=>setBannerHover(true)}
        onMouseLeave={()=>setBannerHover(false)}
        onClick={()=>bannerInputRef.current?.click()}
      >
        {/* Cover image rendered as <img> so objectFit:cover works correctly */}
        {bannerImg && (
          <img src={bannerImg} alt="cover" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block", pointerEvents:"none" }} />
        )}
        {/* Decorative orbs — only show on gradient */}
        {!bannerImg && <>
          <div style={{ position:"absolute", right:-50, top:-50, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,.07)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", left:-30, bottom:-60, width:200, height:200, borderRadius:"50%", background:"rgba(0,0,0,.08)", pointerEvents:"none" }} />
        </>}

        {/* Gradient swatches — only show when no image uploaded */}
        {!bannerImg && (
          <div style={{ position:"absolute", top:12, left:14, display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
            {BANNERS.map((b,i)=>(
              <button key={i} onClick={()=>setBannerGrad(i)} style={{ width:18, height:18, borderRadius:"50%", background:b, border:`2px solid ${bannerGrad===i?"#fff":"rgba(255,255,255,.4)"}`, cursor:"pointer", transition:"transform .15s", transform:bannerGrad===i?"scale(1.25)":"scale(1)" }} />
            ))}
          </div>
        )}

        {/* Hover overlay */}
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.45)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, opacity:bannerHover&&uploading!=="banner"?1:0, transition:"opacity .2s", pointerEvents:"none" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{ color:"#fff", fontSize:12, fontWeight:700, fontFamily:"'Manrope',sans-serif" }}>{bannerImg ? "Change cover photo" : "Upload cover photo"}</span>
        </div>
        {uploading==="banner" && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.55)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, animation:"spin 1s linear infinite" }}>⚙️</div>
        )}

        {/* Remove image button */}
        {bannerImg && (
          <button onClick={e=>{ e.stopPropagation(); setBannerImg(null); localStorage.removeItem("hired_banner_img"); }} style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,.55)", border:"none", borderRadius:99, padding:"4px 10px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif", backdropFilter:"blur(6px)" }}>✕ Remove</button>
        )}

        {/* Edit profile button */}
        <div style={{ position:"absolute", bottom:14, right:14, display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
          {onSettings && (
            <button onClick={onSettings} style={{ background:"rgba(255,255,255,.13)", color:"rgba(255,255,255,.85)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(6px)", fontFamily:"'Manrope',sans-serif", fontSize:12, padding:"6px 12px", borderRadius:T.r, cursor:"pointer" }}>
              ⚙️
            </button>
          )}
          <button className="btn btn-sm" style={{ background:"rgba(255,255,255,.18)", color:"#fff", border:"1px solid rgba(255,255,255,.3)", backdropFilter:"blur(6px)", fontFamily:"'Manrope',sans-serif", fontSize:12 }} onClick={()=>setEditing(e=>!e)}>
            {I.edit} {editing?"Cancel":"Edit"}
          </button>
        </div>

        {/* Hidden file input */}
        <input ref={bannerInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleBannerUpload} />
      </div>

      {/* ── AVATAR ── */}
      <div style={{ position:"relative", height:0 }}>
        <div
          style={{ position:"absolute", top:-44, left:20, border:`4px solid ${T.bg}`, borderRadius:"50%", boxShadow:"0 4px 20px rgba(0,0,0,.22)", zIndex:2, cursor:"pointer", overflow:"hidden", width:88, height:88 }}
          onMouseEnter={()=>setAvatarHover(true)}
          onMouseLeave={()=>setAvatarHover(false)}
          onClick={()=>avatarInputRef.current?.click()}
        >
          {uploading==="avatar"
            ? <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.35)", fontSize:22, animation:"spin 1s linear infinite" }}>⚙️</div>
            : avatarImg
              ? <img src={avatarImg} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              : <Av text="DO" color="#1A56DB" size={80} />
          }
          {/* Camera overlay */}
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", opacity:avatarHover&&uploading!=="avatar"?1:0, transition:"opacity .2s", borderRadius:"50%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarUpload} />
      </div>

      <div style={{ padding:"0 4px", marginTop:50 }}>

        {/* Upload error banner */}
        {uploadErr && (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:T.roseBg, border:`1px solid ${T.rose}44`, borderRadius:T.r, padding:"10px 14px", marginBottom:14 }}>
            <span style={{ fontSize:12.5, color:T.rose, fontWeight:600 }}>⚠ {uploadErr}</span>
            <button onClick={()=>setUploadErr(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.rose, fontSize:16, lineHeight:1, padding:2 }}>✕</button>
          </div>
        )}

        {/* ── IDENTITY CARD ── */}
        <div className="card" style={{ padding:20, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:14 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
                {editing ? (
                  <input className="input" value={name} onChange={e=>setName(e.target.value)} onBlur={()=>localStorage.setItem("hired_profile_name",name)} style={{ fontFamily:"'Playfair Display',serif", fontSize:18, padding:"4px 10px", marginBottom:0, maxWidth:260 }} />
                ) : (
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22 }}>{name}</div>
                )}
                {I.ver}
                {isPaid && <span className="tag" style={{ color:T.green, background:T.greenBg, fontSize:10 }}>Premium</span>}
              </div>
              {editing ? (
                <input className="input" value={headline} onChange={e=>setHeadline(e.target.value)} onBlur={()=>localStorage.setItem("hired_profile_headline",headline)} style={{ fontSize:13, padding:"4px 10px", marginBottom:8, width:"100%" }} />
              ) : (
                <div style={{ color:T.ink3, fontSize:13, marginBottom:8 }}>{headline}</div>
              )}
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                <Tag label="Client" color={T.rose} bg={T.roseBg} />
                <Tag label="Verified" color={T.accent} bg={T.accentL} />
                <Tag label="Top Hirer" color={T.teal} bg={T.tealBg} />
                {isPaid && <Tag label="Premium" color={T.green} bg={T.greenBg} />}
              </div>
              {(()=>{ const o=availOpts.find(x=>x.k===avail); return (
                editing ? (
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                    {availOpts.map(o=>(
                      <button key={o.k} onClick={()=>{ setAvail(o.k); localStorage.setItem("hired_avail",o.k); }}
                        style={{ padding:"5px 12px", borderRadius:99, border:`1.5px solid ${avail===o.k?o.color:T.border}`, background:avail===o.k?o.bg:"transparent", color:avail===o.k?o.color:T.ink3, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif", transition:"all .15s" }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                ) : <span className="tag" style={{ color:o.color, background:o.bg, fontSize:12, cursor:"pointer" }} onClick={()=>setEditing(true)}>{o.label}</span>
              ); })()}
            </div>
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <svg width="64" height="64" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke={T.border} strokeWidth="6"/>
                <circle cx="36" cy="36" r="30" fill="none" stroke={T.accent} strokeWidth="6"
                  strokeDasharray={`${2*Math.PI*30*trustScore/100} ${2*Math.PI*30}`}
                  strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition:"stroke-dasharray .8s ease" }}/>
                <text x="36" y="40" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="16" fill={T.ink} fontWeight="700">{trustScore}</text>
              </svg>
              <div style={{ fontSize:10, color:T.ink4, marginTop:2, fontWeight:600 }}>Trust Score</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }} className="g4">
            {[
              { v: String(SR.getAll().filter(s=>s.online).length || 1), l:"Online Now", c:T.green  },
              { v: String(SR.getAll().length || 1),                      l:"Visitors",  c:T.teal   },
              { v:"4.9★",                                                l:"Rating",   c:"#FBBF24" },
              { v: String(SR.getAll().reduce((a,s)=>a+(s.sessions||1),0)||1), l:"Sessions", c:T.rose },
            ].map(s=>(
              <div key={s.l} style={{ padding:"10px 6px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}`, textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:s.c, marginBottom:2 }}>{s.v}</div>
                <div style={{ fontSize:10.5, color:T.ink4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Earnings teaser */}
          <div style={{ background:`linear-gradient(135deg,${T.greenBg},#f0fdf4)`, border:`1px solid ${T.green}33`, borderRadius:T.r, padding:"12px 14px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.green, letterSpacing:".5px", textTransform:"uppercase", marginBottom:3 }}>Total Spent on Hired</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:T.ink }}>
                {showEarnings ? earning : "••••••"}
              </div>
            </div>
            <button className="btn btn-ghost btn-xs" style={{ color:T.green }} onClick={()=>setShowEarnings(e=>!e)}>
              {showEarnings ? "Hide" : "Show"}
            </button>
          </div>

          {/* Completion bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <span style={{ fontSize:11.5, fontWeight:700, color:T.ink3 }}>Profile Completion</span>
              <span style={{ fontSize:11.5, fontWeight:800, color:completionPct===100?T.green:T.accent }}>{completionPct}%</span>
            </div>
              <div style={{ height:6, background:T.border, borderRadius:99, overflow:"hidden", marginBottom:8 }}>
                <div style={{ height:"100%", width:`${completionPct}%`, background:`linear-gradient(90deg,${T.accent},#3B82F6)`, borderRadius:99, transition:"width .7s ease" }} />
              </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {profileFields.filter(f=>!f.done).map(f=>(
                <button key={f.label} onClick={()=>setEditing(true)} style={{ fontSize:11, padding:"3px 10px", borderRadius:99, background:T.amberBg, color:T.amber, fontWeight:600, border:`1px solid ${T.amber}33`, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>+ {f.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[
            { icon:"💬", label:"Messages", sub:`${messageCount} unread`, color:T.accent, bg:T.accentL },
            { icon:"🔖", label:"Saved",    sub:`${savedJobs} posts`,      color:T.rose,   bg:T.roseBg  },
            { icon:"🤝", label:"Hires",    sub:`${hiresCount} total`,     color:T.teal,   bg:T.tealBg  },
          ].map(a=>(
            <div key={a.label} className="card" style={{ padding:"12px 10px", textAlign:"center", cursor:"pointer", background:a.bg, border:`1px solid ${a.color}22` }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}>
              <div style={{ fontSize:20, marginBottom:4 }}>{a.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:a.color }}>{a.label}</div>
              <div style={{ fontSize:10.5, color:T.ink3 }}>{a.sub}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", gap:2, background:T.bg, borderRadius:T.r, padding:4, border:`1px solid ${T.border}`, marginBottom:14, overflowX:"auto", scrollbarWidth:"none" }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:"0 0 auto", padding:"7px 14px", borderRadius:8, border:"none", fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer", transition:"all .15s", background:tab===t?T.white:"transparent", color:tab===t?T.ink:T.ink3, boxShadow:tab===t?"0 1px 4px rgba(20,18,16,.1)":"none", textTransform:"capitalize", whiteSpace:"nowrap" }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {tab==="overview" && (
          <div className="fade-in">

            {/* About */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div className="lbl">About</div>
                {!editing && <button className="btn btn-ghost btn-xs" onClick={()=>setEditing(true)}>{I.edit} Edit</button>}
              </div>
              {editing ? (
                <div>
                  <textarea className="input" rows={4} value={bio} onChange={e=>setBio(e.target.value)} style={{ marginBottom:12 }} />
                  <div className="lbl" style={{ marginBottom:8 }}>Availability</div>
                  <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:12 }}>
                    {availOpts.map(o=>(
                      <button key={o.k} onClick={()=>setAvail(o.k)} style={{ padding:"6px 12px", borderRadius:99, border:`2px solid ${avail===o.k?o.color:T.border}`, background:avail===o.k?o.bg:"transparent", color:avail===o.k?o.color:T.ink3, fontFamily:"'Manrope',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer", transition:"all .15s" }}>{o.label}</button>
                    ))}
                  </div>
                  <div className="lbl" style={{ marginBottom:8 }}>Skills</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                    {skills.map(s=>(
                      <span key={s} className="tag" style={{ color:T.accent, background:T.accentL, fontSize:12, cursor:"pointer" }} onClick={()=>setSkills(skills.filter(x=>x!==s))}>{s} ×</span>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                    <input className="input" placeholder="Add a skill…" value={skillInput} onChange={e=>setSkillInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter"&&skillInput.trim()){ setSkills([...skills,skillInput.trim()]); setSkillInput(""); }}}
                      style={{ flex:1 }} />
                    <button className="btn btn-blue btn-sm" onClick={()=>{ if(skillInput.trim()){ setSkills([...skills,skillInput.trim()]); setSkillInput(""); }}}>Add</button>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <button className="btn btn-blue btn-sm" onClick={()=>{ setEditing(false); localStorage.setItem("hired_profile_name",name); localStorage.setItem("hired_profile_headline",headline); localStorage.setItem("hired_profile_bio",bio); localStorage.setItem("hired_profile_skills",JSON.stringify(skills)); fire("✅ Profile saved"); }}>Save Changes</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize:13.5, color:T.ink2, lineHeight:1.8, marginBottom:14 }}>{bio}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                    {skills.map(s=>(
                      <span key={s} className="tag" style={{ color:T.accent, background:T.accentL, fontSize:11.5, position:"relative" }}>
                        {s}
                        {endorsements[s] && <span style={{ marginLeft:4, fontSize:10, color:T.green, fontWeight:800 }}>+{endorsements[s]}</span>}
                      </span>
                    ))}
                  </div>
                  {/* Profile actions */}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button className="btn btn-outline btn-sm" onClick={()=>{
                      const profileSlug = (localStorage.getItem("hired_profile_name")||name||"user").toLowerCase().replace(/\s+/g,"-");
                      const url = `https://hired.app/profile/${profileSlug}`;
                      if (navigator.share) { navigator.share({ title:`${name} on Hired`, url }); }
                      else { navigator.clipboard?.writeText(url).then(()=>fire("🔗 Profile link copied!")); }
                    }}>🔗 Share Profile</button>
                    {onReferral && <button className="btn btn-outline btn-sm" onClick={onReferral}>🎁 Refer & Earn</button>}
                  </div>
                </>
              )}
            </div>

            {/* Profile views mini chart */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Profile Views — Last 7 Days</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:60, marginBottom:8 }}>
                {profileViews.map((v,i)=>(
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <div style={{ width:"100%", background:i===6?T.accent:T.accentM, borderRadius:"4px 4px 0 0", height:`${(v/Math.max(...profileViews))*52}px`, transition:"height .5s ease", minHeight:4 }} />
                    <div style={{ fontSize:9, color:T.ink4 }}>{"MTWTFSS"[i]}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.ink3 }}><b style={{ color:T.ink }}>{profileViews.reduce((a,b)=>a+b,0)}</b> total views this week</span>
                <span style={{ fontSize:12, color:T.green, fontWeight:700 }}>↑ 23% vs last week</span>
              </div>
            </div>

            {/* Trust & Verification */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div className="lbl">Trust & Verification</div>
                <span style={{ fontSize:12, fontWeight:700, color:T.accent }}>{trustScore}/100</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {trustItems.map(item=>(
                  <div key={item.label} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background:item.done?T.greenBg:T.bg, borderRadius:T.r, border:`1px solid ${item.done?T.green+"33":T.border}` }}>
                    <span style={{ fontSize:14 }}>{item.done?"✅":"⬜"}</span>
                    <span style={{ fontSize:12, fontWeight:600, color:item.done?T.green:T.ink3 }}>{item.label}</span>
                  </div>
                ))}
              </div>
              {!trustItems.find(x=>x.label==="ID verified")?.done && (
                <button className="btn btn-blue btn-sm" style={{ marginTop:12, width:"100%" }}>🪪 Verify ID — Boost Trust to 95+</button>
              )}
            </div>

            {/* Languages */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Languages</div>
              {languages.length === 0 ? (
                <div style={{ fontSize:12.5, color:T.ink3, textAlign:"center", padding:"8px 0" }}>
                  No languages added yet — add them in the Experience tab
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {languages.map((l,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}` }}>
                      <span style={{ fontSize:13, fontWeight:600 }}>{l.lang}</span>
                      <span style={{ fontSize:12, color:T.ink3, background:T.border, padding:"2px 10px", borderRadius:99 }}>{l.level}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Links</div>
              <SocialLinksEditor />
            </div>

            {/* Active posts */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Active Posts</div>
              {userPosts.length === 0 ? (
                <div style={{ fontSize:12.5, color:T.ink3, textAlign:"center", padding:"12px 0" }}>No posts yet</div>
              ) : userPosts.slice(0,4).map((p,i,arr)=>(
                <div key={p.id} style={{ display:"flex", gap:10, padding:"11px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}>
                  <div style={{ width:3, borderRadius:99, background:p.type==="need"?T.rose:T.teal, flexShrink:0, alignSelf:"stretch", minHeight:36 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4 }}>{p.title}</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      <PostTypeBadge type={p.type} />
                      <WorkTypeBadge type={p.workType} />
                    </div>
                  </div>
                  <div style={{ flexShrink:0, textAlign:"right" }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{p.budget}</div>
                    <div style={{ fontSize:11, color:T.ink3 }}>{timeAgo(p.postedMs)}</div>
                  </div>
                </div>
              ))}
            </div>

            {!isPaid && (
              <div style={{ background:`linear-gradient(135deg,${T.accent},#3B82F6)`, borderRadius:T.r2, padding:"22px 20px", color:"#fff", marginBottom:14 }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:6 }}>Unlock Full Access</div>
                <div style={{ fontSize:13, opacity:.85, marginBottom:16, lineHeight:1.7 }}>Unlimited unlocks, verified badge, and featured post placement.</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button className="btn btn-sm" style={{ background:"#fff", color:T.accent, fontWeight:700 }} onClick={onUpgrade}>Unlimited — $10/mo</button>
                  <button className="btn btn-sm" style={{ background:"rgba(255,255,255,.2)", color:"#fff", border:"1.5px solid rgba(255,255,255,.3)" }} onClick={onUpgrade}>5 Unlocks — $3</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: EXPERIENCE ── */}
        {tab==="experience" && (
          <div className="fade-in">
            {/* Experience timeline */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div className="lbl">Work Experience</div>
              </div>
              {experience.length === 0 && (
                <div style={{ textAlign:"center", padding:"24px 0", color:T.ink3, fontSize:13 }}>No experience added yet</div>
              )}
              {experience.map((e,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:12, paddingBottom:i<arr.length-1?20:0, marginBottom:i<arr.length-1?20:0, borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:(e.color||T.accent)+"18", border:`2px solid ${e.color||T.accent}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, fontWeight:800, color:e.color||T.accent }}>
                      {(e.company||"?")[0]}
                    </div>
                    {i<arr.length-1 && <div style={{ width:2, flex:1, background:T.border, marginTop:6 }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0, paddingTop:4 }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{e.role}</div>
                    <div style={{ fontSize:13, color:e.color||T.accent, fontWeight:600, marginBottom:3 }}>{e.company}</div>
                    <div style={{ fontSize:11.5, color:T.ink4, marginBottom:8 }}>{e.period}</div>
                    <p style={{ fontSize:13, color:T.ink3, lineHeight:1.6 }}>{e.desc}</p>
                  </div>
                  <button onClick={()=>{ const next=experience.filter((_,j)=>j!==i); setExperience(next); localStorage.setItem("hired_profile_exp",JSON.stringify(next)); }} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:14, flexShrink:0, alignSelf:"flex-start" }}>🗑</button>
                </div>
              ))}
              <AddExperienceForm onAdd={(item)=>{ const next=[...experience,item]; setExperience(next); localStorage.setItem("hired_profile_exp",JSON.stringify(next)); fire("✅ Experience added"); }} />
            </div>

            {/* Certifications */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Certifications</div>
              {certifications.length === 0 && (
                <div style={{ textAlign:"center", padding:"12px 0", color:T.ink3, fontSize:13 }}>No certifications added yet</div>
              )}
              {certifications.map((c,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}>
                  <div style={{ width:40, height:40, borderRadius:T.r, background:T.accentL, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon||"🏅"}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.title}</div>
                    <div style={{ fontSize:12, color:T.ink3 }}>{c.issuer}</div>
                  </div>
                  <div style={{ fontSize:12, color:T.ink4, fontWeight:600, flexShrink:0 }}>{c.year}</div>
                  <button onClick={()=>{ const next=certifications.filter((_,j)=>j!==i); setCertifications(next); localStorage.setItem("hired_profile_certs",JSON.stringify(next)); }} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:14, flexShrink:0 }}>🗑</button>
                </div>
              ))}
              <AddCertForm onAdd={(item)=>{ const next=[...certifications,item]; setCertifications(next); localStorage.setItem("hired_profile_certs",JSON.stringify(next)); fire("✅ Certification added"); }} />
            </div>

            {/* Education */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Education</div>
              {(()=>{ const edu = (() => { try { return JSON.parse(localStorage.getItem("hired_profile_edu")||"[]"); } catch { return []; } })(); return edu.length === 0 ? (
                <div style={{ textAlign:"center", padding:"12px 0", color:T.ink3, fontSize:13 }}>No education added yet</div>
              ) : edu.map((e,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}>
                  <div style={{ width:40, height:40, borderRadius:T.r, background:T.purpleBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎓</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{e.deg}</div>
                    <div style={{ fontSize:12, color:T.ink3 }}>{e.school}</div>
                  </div>
                  <div style={{ fontSize:12, color:T.ink4, fontWeight:600, flexShrink:0 }}>{e.year}</div>
                  <button onClick={()=>{ const next=edu.filter((_,j)=>j!==i); localStorage.setItem("hired_profile_edu",JSON.stringify(next)); fire("🗑️ Removed"); }} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:14, flexShrink:0 }}>🗑</button>
                </div>
              )); })()}
              <AddEducationForm onAdd={(item)=>{ const edu=(()=>{ try{return JSON.parse(localStorage.getItem("hired_profile_edu")||"[]");}catch{return[];} })(); const next=[...edu,item]; localStorage.setItem("hired_profile_edu",JSON.stringify(next)); fire("✅ Education added"); }} />
            </div>

            {/* Languages */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Languages</div>
              {languages.length === 0 && (
                <div style={{ textAlign:"center", padding:"8px 0", color:T.ink3, fontSize:13 }}>No languages added yet</div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
                {languages.map((l,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", background:T.bg, borderRadius:T.r, border:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{l.lang}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:12, color:T.ink3, background:T.border, padding:"2px 10px", borderRadius:99 }}>{l.level}</span>
                      <button onClick={()=>{ const next=languages.filter((_,j)=>j!==i); setLanguages(next); localStorage.setItem("hired_profile_langs",JSON.stringify(next)); }} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:13 }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <AddLanguageForm onAdd={(item)=>{ const next=[...languages,item]; setLanguages(next); localStorage.setItem("hired_profile_langs",JSON.stringify(next)); fire("✅ Language added"); }} />
            </div>

            {/* Social links */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:12 }}>Links</div>
              <SocialLinksEditor />
            </div>

            {/* Skills with endorsements */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Skills</div>
              {skills.length === 0 && (
                <div style={{ textAlign:"center", padding:"8px 0", color:T.ink3, fontSize:13 }}>Add skills from the Overview tab</div>
              )}
              {skills.map(s=>(
                <div key={s} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{s}</div>
                    <div style={{ height:4, background:T.border, borderRadius:99, overflow:"hidden", width:"100%" }}>
                      <div style={{ height:"100%", width:`${Math.min(100,(endorsements[s]||0)*5||20)}%`, background:`linear-gradient(90deg,${T.accent},#3B82F6)`, borderRadius:99 }} />
                    </div>
                  </div>
                  {endorsements[s] && (
                    <span style={{ fontSize:11.5, fontWeight:700, color:T.green, background:T.greenBg, padding:"2px 9px", borderRadius:99, flexShrink:0 }}>+{endorsements[s]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: PORTFOLIO ── */}
        {tab==="portfolio" && <PortfolioTab PORTFOLIO={PORTFOLIO} />}

        {/* ── TAB: REVIEWS ── */}
        {tab==="reviews" && <ReviewsTab REVIEWS={REVIEWS} />}

        {/* ── TAB: ACTIVITY ── */}
        {tab==="activity" && (
          <div className="fade-in">
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <div className="lbl">Recent Activity</div>
                <span style={{ fontSize:12, color:T.ink4 }}>{ACTIVITY.length} events</span>
              </div>
              {ACTIVITY.map((a,i,arr)=>(
                <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"11px 0", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:a.color+"18", border:`1.5px solid ${a.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{a.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:T.ink2, fontWeight:500, lineHeight:1.4 }}>{a.text}</div>
                    <div style={{ fontSize:11.5, color:T.ink4, marginTop:3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: SETTINGS ── */}
        {tab==="settings" && (
          <div className="fade-in">

            {/* Account info */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Account Info</div>
              {[
                { label:"Full Name",   val:name||"—",          icon:"👤" },
                { label:"Email",       val:localStorage.getItem("hired_email")||"—", icon:"📧" },
                { label:"Country",     val:localStorage.getItem("hired_profile_country")||"—", icon:"🌍" },
                { label:"Member since",val:new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"}), icon:"📅" },
              ].map(f=>(
                <div key={f.label} style={{ display:"flex", gap:10, alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:16, width:22, flexShrink:0 }}>{f.icon}</span>
                  <div style={{ width:90, fontSize:12, fontWeight:700, color:T.ink3, flexShrink:0 }}>{f.label}</div>
                  <div style={{ flex:1, fontSize:13, color:T.ink, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.val}</div>
                  <button className="btn btn-ghost btn-xs" style={{ fontSize:11 }}>{I.edit}</button>
                </div>
              ))}
            </div>

            {/* Plan */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Plan & Billing</div>
              <div style={{ padding:"14px", background:isPaid?T.greenBg:T.accentL, borderRadius:T.r, marginBottom:12, border:`1px solid ${isPaid?T.green+"44":T.accentM}` }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:4, color:isPaid?T.green:T.accent }}>{isPaid?"✅ Unlimited Plan Active":"🆓 Free Plan"}</div>
                <div style={{ fontSize:12.5, color:T.ink3 }}>{isPaid?"Unlimited contact unlocks this month.":"1 free unlock remaining today. Resets in 24h."}</div>
              </div>
              {!isPaid && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <button className="btn btn-blue btn-sm" style={{ width:"100%" }} onClick={onUpgrade}>Upgrade to Unlimited — $10/mo</button>
                  <button className="btn btn-outline btn-sm" style={{ width:"100%" }} onClick={onUpgrade}>Buy 5 Unlocks — $3</button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Notifications</div>
              {[
                ["msg",      "New messages",         notifState.msg     ],
                ["interest", "Post interest alerts", notifState.interest],
                ["digest",   "Weekly digest email",  notifState.digest  ],
                ["views",    "Profile view alerts",  notifState.views   ],
                ["promos",   "Promotions & offers",  notifState.promos  ],
              ].map(([k,label,on])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:13, color:T.ink2 }}>{label}</span>
                  <Switch on={on} onChange={()=>setNotifState(s=>({...s,[k]:!s[k]}))} />
                </div>
              ))}
            </div>

            {/* Privacy */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Privacy</div>
              {[
                ["search","Show profile in search results", privState.search],
                ["online","Show online status",             privState.online],
                ["dms",   "Allow direct messages",          privState.dms   ],
                ["count", "Show contact view count",        privState.count ],
              ].map(([k,label,on])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:13, color:T.ink2 }}>{label}</span>
                  <Switch on={on} onChange={()=>setPrivState(s=>({...s,[k]:!s[k]}))} />
                </div>
              ))}
            </div>

            {/* Security */}
            <div className="card" style={{ padding:20, marginBottom:14 }}>
              <div className="lbl" style={{ marginBottom:14 }}>Security</div>
              {[
                { label:"Change Password",        icon:"🔑", sub:"Last changed 3 months ago" },
                { label:"Two-Factor Auth",         icon:"🛡️", sub:"Not enabled — recommended" },
                { label:"Active Sessions",         icon:"💻", sub:"2 devices logged in" },
                { label:"Download My Data",        icon:"📦", sub:"Export your profile & posts" },
              ].map(s=>(
                <div key={s.label} style={{ display:"flex", gap:12, alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${T.border}`, cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{s.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{s.label}</div>
                    <div style={{ fontSize:11.5, color:T.ink4 }}>{s.sub}</div>
                  </div>
                  <span style={{ color:T.ink4, fontSize:16 }}>›</span>
                </div>
              ))}
            </div>

            {/* Danger zone */}
            <div className="card" style={{ padding:20, marginBottom:14, border:`1px solid #FECACA` }}>
              <div className="lbl" style={{ marginBottom:14, color:T.rose }}>Account</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button className="btn btn-outline btn-sm" style={{ justifyContent:"flex-start", color:T.ink2 }} onClick={()=>setShowLogoutConfirm(true)}>🚪 Sign out</button>
                <button className="btn btn-danger btn-sm" style={{ justifyContent:"flex-start" }}>🗑️ Delete account</button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogoutConfirm && (
        <div className="mbg" onClick={()=>setShowLogoutConfirm(false)}>
          <div className="mbox" style={{ maxWidth:380, textAlign:"center" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:48, marginBottom:16 }}>🚪</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8 }}>Sign out?</div>
            <p style={{ color:T.ink3, fontSize:14, lineHeight:1.7, marginBottom:24 }}>You'll be taken back to the welcome screen. Your data stays safe.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-ghost" style={{ flex:1 }} onClick={()=>setShowLogoutConfirm(false)}>Cancel</button>
              <button className="btn btn-blue" style={{ flex:1 }} onClick={onLogout}>Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── POST PAGE ─────────────────────────────────────────────────────────────*/
const PostPage = ({ onPostNew }) => (
  <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px 0" }}>
    <div style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"36px 0 28px", margin:"0 -24px 28px" }}>
      <div style={{ padding:"0 24px" }}>
        <div className="lbl" style={{ marginBottom:10 }}>Get Started</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:6 }}>Post on Hired</div>
        <div style={{ fontSize:14.5, color:T.ink3 }}>Free for everyone — clients and freelancers alike</div>
      </div>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:32 }} className="g2">
      {[
        { type:"need", title:"I Need Work Done", desc:"Post a task, project, or job and receive proposals from talented professionals worldwide.", color:T.rose, bg:T.roseBg, icon:"🎯" },
        { type:"offer", title:"I Offer a Service", desc:"Showcase your skills and services to attract clients looking for exactly what you do.", color:T.teal, bg:T.tealBg, icon:"✨" },
      ].map(o=>(
        <div key={o.type} className="card card-lift" onClick={onPostNew} style={{ padding:"32px 28px", borderLeft:`4px solid ${o.color}`, cursor:"pointer" }}>
          <div style={{ fontSize:36, marginBottom:14 }}>{o.icon}</div>
          <PostTypeBadge type={o.type} />
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, margin:"12px 0 10px" }}>{o.title}</div>
          <div style={{ fontSize:14, color:T.ink3, lineHeight:1.75, marginBottom:20 }}>{o.desc}</div>
          <button className="btn btn-blue btn-sm" onClick={e=>{e.stopPropagation();onPostNew();}}>Post →</button>
        </div>
      ))}
    </div>

    <div className="card" style={{ padding:28 }}>
      <div className="lbl" style={{ marginBottom:18 }}>Posting Rules & Guidelines</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }} className="g2">
        {[
          "Be specific and honest about requirements or skills",
          "State your budget or rate clearly for better matches",
          "No spam, duplicate posts, or misleading titles",
          "Contact details are hidden — users unlock them to connect",
          "You can boost posts with featured placement for $5",
          "Get a verified badge for $9 to build trust on the platform",
        ].map(r=>(
          <div key={r} style={{ display:"flex", gap:10 }}>
            <div style={{ width:20, height:20, borderRadius:"50%", background:T.accentL, color:T.accent, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{I.check}</div>
            <span style={{ fontSize:13.5, color:T.ink2, lineHeight:1.6 }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── LIVE ACTIVITY FEED ────────────────────────────────────────────────────*/
const ACTIVITY_FEED = [
  { icon:"🚀", text:"Daniel O. just posted a fintech project", country:"🇬🇭" },
  { icon:"🔓", text:"Sara K. unlocked a design brief", country:"🇿🇦" },
  { icon:"✨", text:"Amara D. is now offering UI/UX services", country:"🇸🇳" },
  { icon:"💬", text:"Marco S. sent a message about DevOps", country:"🇧🇷" },
  { icon:"⚡", text:"3 new posts in Technology this hour", country:"🌐" },
  { icon:"🎉", text:"Priya N. just joined Hired", country:"🇮🇳" },
  { icon:"❤️", text:"James K. saved your profile post", country:"🇰🇪" },
  { icon:"🔥", text:"Featured post trending: Brand identity", country:"🌐" },
];
function LiveActivityFeed() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(i => (i + 1) % ACTIVITY_FEED.length);
        setVisible(true);
      }, 320);
    };
    const t = setInterval(cycle, 4200);
    return () => clearInterval(t);
  }, []);
  if (dismissed) return null;
  const a = ACTIVITY_FEED[current];
  return (
    <div style={{ position:"fixed", bottom:100, left:16, zIndex:90 }}>
      <div className={visible ? "activity-in" : "activity-out"} style={{
        display:"flex", alignItems:"center", gap:9,
        background:"rgba(255,255,255,.92)", backdropFilter:"blur(20px)",
        border:`1px solid ${T.border}`, borderRadius:99,
        padding:"8px 10px 8px 12px",
        boxShadow:"0 4px 24px rgba(20,18,16,.12)",
        maxWidth:260,
      }}>
        <span style={{ fontSize:15, flexShrink:0 }}>{a.icon}</span>
        <span style={{ fontSize:11.5, fontWeight:600, color:T.ink2, lineHeight:1.4, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.text}</span>
        <span style={{ fontSize:13, flexShrink:0 }}>{a.country}</span>
        <button onClick={()=>setDismissed(true)} style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", fontSize:14, lineHeight:1, padding:"0 2px", flexShrink:0, opacity:.6, transition:"opacity .15s", marginLeft:2 }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.6} title="Dismiss">×</button>
      </div>
    </div>
  );
}

/* ─── ADMIN CREDENTIALS (secret) ───────────────────────────────────────────*/
const ADMIN_USER = "admin";
const ADMIN_PASS = "hired@2025";

/* ─── ADMIN LOGIN MODAL ─────────────────────────────────────────────────────*/
function AdminLoginModal({ onAuth, onClose }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (u === ADMIN_USER && p === ADMIN_PASS) { onAuth(); }
    else {
      setErr("Invalid credentials");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="mbg" onClick={onClose}>
      <div className="mbox" style={{ maxWidth:380, padding:40 }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:T.border, border:"none", borderRadius:"50%", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3 }}>{I.close}</button>

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},#3B82F6)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", boxShadow:`0 6px 20px rgba(26,86,219,.35)` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginBottom:4 }}>Admin Access</div>
          <div style={{ fontSize:13, color:T.ink3 }}>Restricted area · Authorised personnel only</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12, animation: shake ? "spring-press .35s cubic-bezier(.22,1,.36,1)" : "none" }}>
          <div>
            <div className="lbl" style={{ marginBottom:5 }}>Username</div>
            <input className="input" value={u} onChange={e=>{setU(e.target.value);setErr("");}} placeholder="Enter username" autoComplete="off" onKeyDown={e=>e.key==="Enter"&&attempt()} />
          </div>
          <div>
            <div className="lbl" style={{ marginBottom:5 }}>Password</div>
            <input className="input" type="password" value={p} onChange={e=>{setP(e.target.value);setErr("");}} placeholder="Enter password" onKeyDown={e=>e.key==="Enter"&&attempt()} />
          </div>
          {err && <div style={{ fontSize:12.5, color:"#DC2626", fontWeight:600, textAlign:"center", padding:"6px 12px", background:"#FEF2F2", borderRadius:T.r, border:"1px solid #FECACA" }}>{err}</div>}
          <button className="btn btn-blue" style={{ width:"100%", marginTop:4 }} onClick={attempt}>Sign In to Admin</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN CLOCK ───────────────────────────────────────────────────────────*/
function AdminClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2,"0");
  return (
    <div style={{ fontFamily:"monospace", fontSize:11, color:"#3b82f6", fontWeight:700, letterSpacing:"1px" }}>
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())} UTC
    </div>
  );
}

/* ─── ADMIN PANEL ───────────────────────────────────────────────────────────*/
function AdminPanel({ onClose, fire, auditLog=[], addAudit, userPosts=[], onUpdateUserPosts }) {
  const [tab, setTab]       = useState("overview");
  const [posts, setPosts] = useState(() => {
    const base = POSTS_DATA.map(p => ({ ...p, status: p.status || "approved", flagged: p.flagged || false }));
    const up = userPosts.map(p => ({ ...p, status: p.status || "approved", flagged: p.flagged || false, isUserPost: true }));
    return [...up, ...base];
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [sideOpen, setSideOpen]     = useState(false);
  const [cmdK, setCmdK]             = useState(false);
  const [cmdKQuery, setCmdKQuery]   = useState("");
  const [liveSessions, setLiveSessions] = useState(() => SR.getAll());
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPosts,   setSelectedPosts]   = useState(new Set());
  const [selectedUsers,   setSelectedUsers]   = useState(new Set());
  const [banTarget,       setBanTarget]       = useState(null);
  const [banReason,       setBanReason]       = useState("");
  const [sessionSearch,   setSessionSearch]   = useState("");
  const [broadcastSubj,   setBroadcastSubj]   = useState("");
  const [broadcastBody,   setBroadcastBody]   = useState("");
  const [broadcastSent,   setBroadcastSent]   = useState(false);

  /* ── Poll sessions every 10s ── */
  useEffect(() => {
    const t = setInterval(() => setLiveSessions(SR.getAll()), 10000);
    return () => clearInterval(t);
  }, []);

  /* ── Cmd+K global shortcut ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdK(v => !v); setCmdKQuery(""); }
      if (e.key === "Escape") { setCmdK(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Branding state ── */
  const [brandName, setBrandName]   = useState("Hired");
  const [brandAccent, setBrandAccent] = useState("#1A56DB");
  const [brandLogo, setBrandLogo]   = useState(null); // base64 or null
  const logoInputRef = useRef(null);

  /* ── Platform settings state ── */
  const [settings, setSettings] = useState({
    supportEmail: "hello@hired.com",
    freeUnlocks: "1",
    creditPackPrice: "3",
    monthlyPrice: "10",
    badgePrice: "9",
    maintenanceMode: false,
    requireApproval: false,
    allowNewSignups: true,
  });

  /* ── Announcement state ── */
  const [announcements, setAnnouncements] = useState([
    { id:1, text:"Welcome to Hired! Post your first job or offer today.", type:"info",   active:true,  created:"May 2025" },
    { id:2, text:"New feature: Direct messaging is now available for all users.", type:"success", active:true, created:"May 2025" },
  ]);
  const [newAnnounce, setNewAnnounce]   = useState({ text:"", type:"info" });

  /* ── Category management ── */
  const [categories, setCategories] = useState([...CATS.filter(c=>c!=="All")]);
  const [newCat, setNewCat]         = useState("");

  /* ── Users with actions ── */
  const [users, setUsers] = useState([
    { id:1, name:"Alex Johnson",  email:"alex@example.com",   plan:"Free",     posts:3,  joined:"Jan 2025", status:"active",    country:"🇺🇸", badge:false },
    { id:2, name:"Marco Silva",   email:"marco@example.com",  plan:"Premium",  posts:7,  joined:"Feb 2025", status:"active",    country:"🇧🇷", badge:false },
    { id:3, name:"Sophie Chen",   email:"sophie@example.com", plan:"Premium",  posts:12, joined:"Dec 2024", status:"active",    country:"🇸🇬", badge:true  },
    { id:4, name:"Amara Diallo",  email:"amara@example.com",  plan:"Free",     posts:1,  joined:"Mar 2025", status:"active",    country:"🇳🇬", badge:false },
    { id:5, name:"Patel Rohan",   email:"rohan@example.com",  plan:"Verified", posts:9,  joined:"Nov 2024", status:"active",    country:"🇮🇳", badge:true  },
    { id:6, name:"Ivan Petrov",   email:"ivan@example.com",   plan:"Free",     posts:2,  joined:"Apr 2025", status:"suspended", country:"🇷🇺", badge:false },
    { id:7, name:"Yuki Nakamura", email:"yuki@example.com",   plan:"Premium",  posts:5,  joined:"Jan 2025", status:"active",    country:"🇯🇵", badge:false },
    { id:8, name:"Zara Mohammed", email:"zara@example.com",   plan:"Verified", posts:14, joined:"Oct 2024", status:"active",    country:"🇦🇪", badge:true  },
  ]);
  const [selectedUser, setSelectedUser] = useState(null); // for user detail drawer

  /* ── useWindowWidth hook for responsive breakpoints ── */
  const [winW, setWinW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = winW < 640;
  const isTablet = winW < 960;

  const ADMIN_TABS = [
    { id:"overview",      label:"Overview",    icon:"📊" },
    { id:"sessions",      label:"Sessions",    icon:"🟢" },
    { id:"posts",         label:"Posts",       icon:"📋" },
    { id:"moderation",    label:"Moderate",    icon:"🚩" },
    { id:"users",         label:"Users",       icon:"👥" },
    { id:"badges",        label:"Badges",      icon:"✅" },
    { id:"revenue",       label:"Revenue",     icon:"💰" },
    { id:"announcements", label:"Announce",    icon:"📢" },
    { id:"broadcast",     label:"Broadcast",   icon:"📧" },
    { id:"audit",         label:"Audit Log",   icon:"🔍" },
    { id:"categories",    label:"Categories",  icon:"🗂️" },
    { id:"branding",      label:"Branding",    icon:"🎨" },
    { id:"settings",      label:"Settings",    icon:"⚙️" },
  ];

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const flaggedPosts  = posts.filter(p => p.flagged);
  const pendingPosts  = posts.filter(p => p.status === "pending");
  const badgeRequests = users.filter(u => u.badgeRequested && !u.badge);

  /* ── Post handlers ── */
  const syncUserPosts = (updatedPosts) => {
    if (!onUpdateUserPosts) return;
    const up = updatedPosts.filter(p=>p.isUserPost);
    onUpdateUserPosts(up);
  };

  const handleDeletePost = (id) => {
    const next = posts.filter(p => p.id !== id);
    setPosts(next); syncUserPosts(next);
    setConfirmDel(null);
    if(addAudit) addAudit("DELETE_POST", `Deleted post #${id}`);
    fire("🗑️ Post deleted by admin");
  };

  const handleApprovePost = (id) => {
    const next = posts.map(p => p.id === id ? { ...p, status:"approved", flagged:false } : p);
    setPosts(next); syncUserPosts(next);
    fire("✅ Post approved");
  };

  const handleRejectPost = (id) => {
    const next = posts.filter(p => p.id !== id);
    setPosts(next); syncUserPosts(next);
    fire("❌ Post rejected and removed");
  };

  const handleToggleFeatured = (id) => {
    const next = posts.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
    setPosts(next); syncUserPosts(next);
  };

  const handleBulkDeletePosts = () => {
    const next = posts.filter(p => !selectedPosts.has(p.id));
    setPosts(next); syncUserPosts(next);
    if(addAudit) addAudit("BULK_DELETE_POSTS", `Deleted ${selectedPosts.size} posts`);
    fire(`🗑️ ${selectedPosts.size} posts deleted`);
    setSelectedPosts(new Set());
  };

  const handleBulkApprovePosts = () => {
    const next = posts.map(p => selectedPosts.has(p.id) ? { ...p, status:"approved", flagged:false } : p);
    setPosts(next); syncUserPosts(next);
    if(addAudit) addAudit("BULK_APPROVE_POSTS", `Approved ${selectedPosts.size} posts`);
    fire(`✅ ${selectedPosts.size} posts approved`);
    setSelectedPosts(new Set());
  };

  const handleBanUser = (id, reason) => {
    setUsers(us => us.map(u => u.id===id ? { ...u, status:"banned", banReason:reason, bannedAt:new Date().toISOString() } : u));
    if(addAudit) addAudit("BAN_USER", `Banned user #${id}: ${reason}`);
    setBanTarget(null); setBanReason("");
    fire("🚫 User banned");
  };

  const handleBulkSuspendUsers = () => {
    setUsers(us => us.map(u => selectedUsers.has(u.id) ? { ...u, status:"suspended" } : u));
    if(addAudit) addAudit("BULK_SUSPEND_USERS", `Suspended ${selectedUsers.size} users`);
    fire(`🚫 ${selectedUsers.size} users suspended`);
    setSelectedUsers(new Set());
  };
  const handleUnflagPost = (id) => {
    const next = posts.map(p => p.id === id ? { ...p, flagged:false } : p);
    setPosts(next); syncUserPosts(next);
  };
  const handleFlagPost = (id) => {
    const next = posts.map(p => p.id === id ? { ...p, flagged:true } : p);
    setPosts(next); syncUserPosts(next);
  };

  /* ── User handlers ── */
  const handleToggleSuspend = (id) => {
    setUsers(us => us.map(u => {
      if (u.id !== id) return u;
      const next = u.status === "suspended" ? "active" : "suspended";
      if(addAudit) addAudit(next==="suspended"?"SUSPEND_USER":"REINSTATE_USER", `User #${id}`);
      fire(next === "suspended" ? "🚫 User suspended" : "✅ User reinstated");
      return { ...u, status: next };
    }));
  };
  const handleChangePlan = (id, plan) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, plan } : u));
    if(addAudit) addAudit("CHANGE_PLAN", `User #${id} → ${plan}`);
  };
  const handleDeleteUser = (id) => {
    setUsers(us => us.filter(u => u.id !== id));
    setSelectedUser(null);
    if(addAudit) addAudit("DELETE_USER", `Deleted user #${id}`);
    fire("🗑️ User account deleted");
  };
  const handleGrantBadge = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, badge:true, badgeRequested:false, plan:"Verified" } : u));
    if(addAudit) addAudit("GRANT_BADGE", `User #${id}`);
    fire("✅ Verified badge granted");
  };
  const handleRevokeBadge = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, badge:false, plan: u.plan==="Verified"?"Free":u.plan } : u));
    if(addAudit) addAudit("REVOKE_BADGE", `User #${id}`);
  };
  const handleRequestBadge = (id) => {
    setUsers(us => us.map(u => u.id === id ? { ...u, badgeRequested:true } : u));
  };

  /* ── Announcement handlers ── */
  const handleAddAnnounce = () => {
    if (!newAnnounce.text.trim()) return;
    setAnnouncements(prev => [...prev, { id:Date.now(), text:newAnnounce.text, type:newAnnounce.type, active:true, created:"Now" }]);
    setNewAnnounce({ text:"", type:"info" });
    fire("📢 Announcement published");
  };
  const handleToggleAnnounce = (id) => {
    setAnnouncements(prev => prev.map(a => a.id===id ? { ...a, active:!a.active } : a));
  };
  const handleDeleteAnnounce = (id) => {
    setAnnouncements(prev => prev.filter(a => a.id!==id));
  };

  /* ── Category handlers ── */
  const handleAddCategory = () => {
    const c = newCat.trim();
    if (!c || categories.includes(c)) return;
    setCategories(prev => [...prev, c]);
    setNewCat("");
  };
  const handleDeleteCategory = (c) => {
    setCategories(prev => prev.filter(x => x!==c));
  };

  /* ── Logo upload handler ── */
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setBrandLogo(ev.target.result); fire("🖼️ Logo updated"); };
    reader.readAsDataURL(file);
  };

  /* ── Export handler ── */
  const handleExportCSV = (type) => {
    let rows, filename;
    if (type === "posts") {
      rows = [["ID","Title","User","Category","Budget","Type","Status","Featured"],...posts.map(p=>[p.id,p.title,p.user,p.category,p.budget,p.type,p.status||"approved",p.featured?"Yes":"No"])];
      filename = "hired_posts.csv";
    } else {
      rows = [["ID","Name","Email","Plan","Posts","Status","Badge","Joined"],...users.map(u=>[u.id,u.name,u.email,u.plan,u.posts,u.status,u.badge?"Yes":"No",u.joined])];
      filename = "hired_users.csv";
    }
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url);
    fire(`📥 ${filename} downloaded`);
  };

  /* ── Derived revenue from live user state ── */
  const premiumCount  = users.filter(u=>u.plan==="Premium").length;
  const verifiedCount = users.filter(u=>u.plan==="Verified" || u.badge).length;
  const featuredCount = posts.filter(p=>p.featured).length;
  const subRevenue    = premiumCount  * 10;
  const badgeRevenue  = verifiedCount * 9;
  const featRevenue   = featuredCount * 15;
  const creditRevenue = Math.round(users.filter(u=>u.plan==="Free").length * 1.8);
  const totalRevenue  = subRevenue + badgeRevenue + featRevenue + creditRevenue;
  const revenueRows = [
    { label:"Unlimited subscriptions", amount:`$${subRevenue}`,    raw:subRevenue,    color:"#3b82f6" },
    { label:"5-pack credits",          amount:`$${creditRevenue}`, raw:creditRevenue, color:"#34d399" },
    { label:"Verified badges",         amount:`$${badgeRevenue}`,  raw:badgeRevenue,  color:"#a78bfa" },
    { label:"Featured post boosts",    amount:`$${featRevenue}`,   raw:featRevenue,   color:"#f59e0b" },
  ].map(r => ({ ...r, pct: totalRevenue > 0 ? Math.round((r.raw / totalRevenue) * 100) : 0 }));

  /* ── Activity log derived from real state ── */
  const recentActivity = [
    ...flaggedPosts.map(p => ({ icon:"🚩", text:`Flagged: ${p.title}`, time:"recent" })),
    ...pendingPosts.map(p => ({ icon:"⏳", text:`Pending approval: ${p.title}`, time:"recent" })),
    ...badgeRequests.map(u => ({ icon:"✅", text:`Badge request: ${u.name}`, time:"recent" })),
    ...users.filter(u=>u.status==="suspended").map(u => ({ icon:"🚫", text:`Suspended: ${u.name}`, time:"recent" })),
    ...posts.filter(p=>p.featured).slice(0,2).map(p => ({ icon:"⭐", text:`Featured: ${p.title}`, time:"recent" })),
  ].slice(0,5);
  const activityFeed = recentActivity.length > 0 ? recentActivity : [
    { icon:"📌", text:`${posts.length} posts live on the board`, time:"now" },
    { icon:"👥", text:`${users.filter(u=>u.status==="active").length} active users`, time:"now" },
    { icon:"💳", text:`${premiumCount} Premium subscribers`, time:"now" },
    { icon:"✅", text:`${verifiedCount} Verified badges issued`, time:"now" },
    { icon:"⭐", text:`${featuredCount} featured posts`, time:"now" },
  ];

  const STAT_CARDS = [
    { label:"Total Posts",     value:String(posts.length),      sub:`${posts.filter(p=>p.featured).length} featured`, color:"#3b82f6" },
    { label:"Active Users",    value:String(users.filter(u=>u.status==="active").length), sub:`${users.length} total · ${users.filter(u=>u.status==="suspended").length} suspended`, color:"#34d399" },
    { label:"Est. Revenue",    value:`$${totalRevenue}`,         sub:`${premiumCount} Premium · ${verifiedCount} Verified`, color:"#2dd4bf" },
    { label:"Pending Actions", value:String(flaggedPosts.length + pendingPosts.length + badgeRequests.length), sub: flaggedPosts.length + pendingPosts.length + badgeRequests.length > 0 ? "Needs attention" : "All clear ✓", color: flaggedPosts.length + pendingPosts.length + badgeRequests.length > 0 ? "#f59e0b" : "#34d399" },
  ];

  /* ── Live session count for sidebar badge ── */
  const onlineNow = liveSessions.filter(s=>s.online).length;

  /* ── shared card style ── */
  const card = { background:"#0a1628", border:"1px solid #1a2d4a", borderRadius:T.r2, padding: isMobile ? "16px" : "20px 22px" };

  /* ── Content padding responsive ── */
  const contentPad = isMobile ? "16px" : isTablet ? "20px" : "28px";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(5,10,20,.97)", zIndex:300, display:"flex", flexDirection:"column", animation:"fadeIn .25s ease", fontFamily:"'Manrope',sans-serif" }}>

      {/* ── TOP BAR (always visible) ── */}
      <div style={{ height:56, background:"#0a1628", borderBottom:"1px solid #1a2d4a", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Hamburger on mobile */}
          {isMobile && (
            <button onClick={()=>setSideOpen(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer", color:"#5a7290", padding:4, display:"flex", alignItems:"center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:"#e8eaf0", fontWeight:700 }}>Hired</span>
            <span style={{ fontSize:11, color:"#3a5070", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginLeft:8 }}>Admin</span>
          </div>
          {!isMobile && (
            <div style={{ fontSize:12, color:"#3a5070", marginLeft:4 }}>
              {ADMIN_TABS.find(t=>t.id===tab)?.icon} {ADMIN_TABS.find(t=>t.id===tab)?.label}
            </div>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {/* Cmd+K palette trigger */}
          {!isMobile && (
            <button onClick={()=>{ setCmdK(true); setCmdKQuery(""); }} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 10px", background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:8, cursor:"pointer", color:"#3a5070", fontFamily:"'Manrope',sans-serif", fontSize:12, transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="#2a4a70"; e.currentTarget.style.color="#60a5fa"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="#1a2d4a"; e.currentTarget.style.color="#3a5070"; }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search
              <kbd style={{ fontSize:10, background:"#0a1628", border:"1px solid #1a2d4a", borderRadius:4, padding:"1px 5px", fontFamily:"monospace" }}>⌘K</kbd>
            </button>
          )}
          <div style={{ padding:"4px 10px", background:"rgba(22,163,74,.12)", border:"1px solid rgba(22,163,74,.25)", borderRadius:99, fontSize:11, fontWeight:700, color:"#34d399", display:"flex", alignItems:"center", gap:5 }}>
            <div className="pulse-dot-fast" /> {liveSessions.filter(s=>s.online).length > 0 ? `${liveSessions.filter(s=>s.online).length} Online` : "Live"}
          </div>
          {!isMobile && (
            <div style={{ padding:"4px 10px", background:"rgba(26,86,219,.12)", border:"1px solid rgba(26,86,219,.2)", borderRadius:99, fontSize:11, fontWeight:700, color:"#60a5fa" }}>
              admin
            </div>
          )}
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.06)", border:"1px solid #1a2d4a", borderRadius:T.r, padding:"6px 12px", color:"#94a3b8", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Manrope',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
            {I.close}{!isMobile && " Exit"}
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", position:"relative" }}>

        {/* ── SIDEBAR OVERLAY on mobile ── */}
        {isMobile && sideOpen && (
          <div style={{ position:"absolute", inset:0, zIndex:20, display:"flex" }} onClick={()=>setSideOpen(false)}>
            <div style={{ width:220, background:"#0a1628", borderRight:"1px solid #1a2d4a", display:"flex", flexDirection:"column", boxShadow:"4px 0 24px rgba(0,0,0,.5)", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
              <div style={{ padding:"16px 12px 12px", borderBottom:"1px solid #1a2d4a", marginBottom:4, flexShrink:0 }}>
                <div style={{ fontSize:11, color:"#3a5070", fontWeight:700, letterSpacing:".8px", textTransform:"uppercase" }}>Navigation</div>
              </div>
              {ADMIN_TABS.map(t => (
                <button key={t.id} onClick={()=>{setTab(t.id);setSideOpen(false);}} style={{
                  display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                  background: tab===t.id ? "rgba(26,86,219,.18)" : "transparent",
                  borderLeft: tab===t.id ? "3px solid #3b82f6" : "3px solid transparent",
                  border:"none", color: tab===t.id ? "#60a5fa" : "#5a7290",
                  cursor:"pointer", fontSize:14, fontWeight:tab===t.id?700:500,
                  fontFamily:"'Manrope',sans-serif", textAlign:"left", width:"100%", flexShrink:0,
                }}>
                  <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
            <div style={{ flex:1, background:"rgba(0,0,0,.3)" }} />
          </div>
        )}

        {/* ── SIDEBAR (desktop/tablet) ── */}
        {!isMobile && (
          <div style={{ width: isTablet ? 60 : 210, background:"#0a1628", borderRight:"1px solid #1a2d4a", display:"flex", flexDirection:"column", flexShrink:0, transition:"width .2s", overflow:"hidden" }}>
            <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", display:"flex", flexDirection:"column", gap:2, padding: isTablet ? "12px 8px" : "12px 10px" }}>
              {ADMIN_TABS.map(t => {
                const badge = t.id==="moderation" ? (flaggedPosts.length+pendingPosts.length) : t.id==="badges" ? badgeRequests.length : t.id==="sessions" ? onlineNow : 0;
                const badgeColor = t.id==="sessions" ? "#22c55e" : "#DC2626";
                const badgeBg = t.id==="sessions" ? "rgba(34,197,94,.15)" : "rgba(220,38,38,.15)";
                return (
                  <button key={t.id} onClick={()=>setTab(t.id)} title={isTablet ? t.label : undefined} style={{
                    display:"flex", alignItems:"center", gap: isTablet ? 0 : 10,
                    justifyContent: isTablet ? "center" : "flex-start",
                    padding: isTablet ? "12px 0" : "10px 12px", borderRadius:T.r,
                    background: tab===t.id ? "rgba(26,86,219,.18)" : "transparent",
                    border: tab===t.id ? "1px solid rgba(26,86,219,.25)" : "1px solid transparent",
                    color: tab===t.id ? "#60a5fa" : "#5a7290",
                    cursor:"pointer", fontSize: isTablet ? 20 : 13.5, fontWeight:tab===t.id?700:500,
                    fontFamily:"'Manrope',sans-serif", textAlign:"left", transition:"all .15s", width:"100%",
                    flexShrink:0, position:"relative",
                  }}>
                    <span style={{ fontSize: isTablet ? 18 : 15 }}>{t.icon}</span>
                    {!isTablet && t.label}
                    {badge > 0 && (
                      <span style={{ marginLeft:"auto", minWidth:18, height:18, borderRadius:99, background:badgeColor, color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px", flexShrink:0 }}>{badge}</span>
                    )}
                    {isTablet && badge > 0 && (
                      <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:badgeColor }} />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Sidebar footer */}
            {!isTablet && (
              <div style={{ padding:"12px 14px", borderTop:"1px solid #0f2040", flexShrink:0 }}>
                <AdminClock />
                <div style={{ marginTop:6, fontSize:10, color:"#2a4a70", fontWeight:600, letterSpacing:".4px" }}>v2.0 · Hired Admin</div>
              </div>
            )}
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex:1, overflow:"auto", background:"#060f1f" }}>
          <div style={{ padding: contentPad }}>

            {/* ── SESSIONS ── */}
            {tab === "sessions" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                {/* Header stats */}
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 24 }}>
                  {[
                    { label:"Online Now",      value:String(liveSessions.filter(s=>s.online).length), color:"#22c55e" },
                    { label:"Total Signups",   value:String(liveSessions.length), color:"#3b82f6" },
                    { label:"Mobile Users",    value:String(liveSessions.filter(s=>s.device==="Mobile").length), color:"#a78bfa" },
                    { label:"Avg Sessions",    value: liveSessions.length ? (liveSessions.reduce((a,s)=>a+(s.sessions||1),0)/liveSessions.length).toFixed(1) : "0", color:"#f59e0b" },
                  ].map(s=>(
                    <div key={s.label} style={{ ...card }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", marginBottom:8 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 28, color:"#e8eaf0", lineHeight:1, marginBottom:4 }}>{s.value}</div>
                      <div style={{ width:24, height:3, borderRadius:99, background:s.color, marginTop:6 }} />
                    </div>
                  ))}
                </div>

                {liveSessions.length === 0 ? (
                  <div style={{ ...card, padding:"52px 28px", textAlign:"center" }}>
                    <div style={{ fontSize:40, marginBottom:16 }}>👥</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"#e8eaf0", marginBottom:10 }}>No real sessions yet</div>
                    <div style={{ fontSize:13.5, color:"#5a7290", lineHeight:1.7, maxWidth:360, margin:"0 auto" }}>
                      Sessions are recorded when users complete the onboarding flow. Close the admin panel, go through onboarding, then come back here to see your session appear.
                    </div>
                  </div>
                ) : (
                  <div style={{ ...card, overflow:"hidden" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #0f2040", gap:10, flexWrap:"wrap" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0" }}>Live Session Registry</div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <input value={sessionSearch} onChange={e=>setSessionSearch(e.target.value)} placeholder="Search by name or role…" style={{ background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#e8eaf0", padding:"5px 12px", fontFamily:"'Manrope',sans-serif", fontSize:12, outline:"none", width:180 }} />
                        <button onClick={()=>setLiveSessions(SR.getAll())} style={{ padding:"5px 12px", background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", borderRadius:T.r, color:"#60a5fa", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>↻ Refresh</button>
                      </div>
                    </div>
                    <div style={{ overflowX:"auto" }}>
                      {/* Table header */}
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr 1fr 1fr 1fr 1.4fr", padding:"10px 20px", fontSize:11, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", borderBottom:"1px solid #0f2040", minWidth:600 }}>
                        <span>User</span><span>Role</span><span>Device</span><span>Sessions</span><span>Status</span><span>Last Seen</span>
                      </div>
                      {[...liveSessions].filter(s=>!sessionSearch || s.name?.toLowerCase().includes(sessionSearch.toLowerCase()) || s.role?.toLowerCase().includes(sessionSearch.toLowerCase())).sort((a,b)=>b.lastSeen-a.lastSeen).map((s,i,arr)=>(
                        <div key={s.id}
                          style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr 1fr 1fr 1fr 1.4fr", padding:"13px 20px", borderBottom:i<arr.length-1?"1px solid #060f1f":"none", alignItems:"center", cursor:"pointer", transition:"background .1s", minWidth:600 }}
                          onMouseEnter={e=>e.currentTarget.style.background="#0d1f38"}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                          onClick={()=>setSelectedSession(s)}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            {/* Online indicator */}
                            <div style={{ position:"relative", width:8, height:8, borderRadius:"50%", background:s.online?"#22c55e":"#3a5070", flexShrink:0, boxShadow:s.online?"0 0 0 3px rgba(34,197,94,.2)":"none" }} />
                            <div>
                              <div style={{ fontSize:13, fontWeight:600, color:"#e8eaf0" }}>{s.name}</div>
                              <div style={{ fontSize:11, color:"#3a5070", fontFamily:"monospace" }}>{s.id}</div>
                            </div>
                          </div>
                          <span style={{ fontSize:12, color:"#94a3b8", textTransform:"capitalize" }}>{s.role}</span>
                          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                            <span style={{ fontSize:11 }}>{s.device==="Mobile"?"📱":"🖥️"}</span>
                            <span style={{ fontSize:12, color:"#5a7290" }}>{s.device}</span>
                          </div>
                          <span style={{ fontSize:13, color:"#c8d0df" }}>{s.sessions||1}</span>
                          <span style={{ fontSize:11, fontWeight:700, color:s.online?"#22c55e":"#5a7290", background:s.online?"rgba(34,197,94,.1)":"rgba(255,255,255,.04)", padding:"2px 9px", borderRadius:99 }}>{s.online?"● Online":"Offline"}</span>
                          <span style={{ fontSize:12, color:"#5a7290" }}>
                            {s.lastSeen ? (Date.now()-s.lastSeen < 60000 ? "just now" : Date.now()-s.lastSeen < 3600000 ? Math.floor((Date.now()-s.lastSeen)/60000)+"m ago" : Math.floor((Date.now()-s.lastSeen)/3600000)+"h ago") : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Session detail drawer */}
                {selectedSession && (
                  <div className="mbg" onClick={()=>setSelectedSession(null)}>
                    <div className="mbox" style={{ maxWidth:460, background:"#0a1628", border:"1px solid #1a2d4a" }} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>setSelectedSession(null)} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.07)", border:"1px solid #1a2d4a", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#5a7290" }}>{I.close}</button>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                        <div style={{ position:"relative" }}>
                          <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#1A56DB,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff" }}>{selectedSession.name[0]?.toUpperCase()}</div>
                          {selectedSession.online && <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #0a1628" }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:16, color:"#e8eaf0" }}>{selectedSession.name}</div>
                          <div style={{ fontSize:12, color:"#5a7290", fontFamily:"monospace" }}>{selectedSession.id}</div>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                        {[
                          ["Role", selectedSession.role||"visitor"],
                          ["Device", `${selectedSession.device==="Mobile"?"📱":"🖥️"} ${selectedSession.device}`],
                          ["Browser", selectedSession.browser||"Unknown"],
                          ["Sessions", selectedSession.sessions||1],
                          ["Status", selectedSession.online?"🟢 Online":"⚫ Offline"],
                          ["Joined", selectedSession.joinedAt ? new Date(selectedSession.joinedAt).toLocaleDateString() : "—"],
                        ].map(([k,v])=>(
                          <div key={k} style={{ background:"#060f1f", borderRadius:T.r, padding:"10px 12px", border:"1px solid #0f2040" }}>
                            <div style={{ fontSize:10, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".5px", marginBottom:4 }}>{k}</div>
                            <div style={{ fontSize:13, color:"#c8d0df", fontWeight:600, textTransform:"capitalize" }}>{String(v)}</div>
                          </div>
                        ))}
                      </div>
                      {/* Activity log */}
                      <div style={{ fontSize:12, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".6px", marginBottom:10 }}>Activity Log</div>
                      {selectedSession.actions?.length > 0 ? (
                        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:180, overflowY:"auto" }}>
                          {selectedSession.actions.map((a,i)=>(
                            <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 12px", background:"#060f1f", borderRadius:T.r, border:"1px solid #0f2040" }}>
                              <span style={{ fontSize:14 }}>{a.type==="save"?"❤️":a.type==="upgrade"?"💳":a.type==="post"?"📌":"⚡"}</span>
                              <div style={{ flex:1 }}>
                                <div style={{ fontSize:12.5, color:"#c8d0df" }}>{a.detail}</div>
                                <div style={{ fontSize:11, color:"#3a5070", marginTop:1 }}>
                                  {a.at ? (Date.now()-a.at<60000?"just now":Math.floor((Date.now()-a.at)/60000)+"m ago") : ""}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding:"20px", textAlign:"center", color:"#3a5070", fontSize:13, background:"#060f1f", borderRadius:T.r, border:"1px solid #0f2040" }}>
                          No actions logged yet for this session
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                {/* Stat grid — 2 col on mobile, 4 on desktop */}
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 24 }}>
                  {STAT_CARDS.map(s => (
                    <div key={s.label} style={{ ...card }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", marginBottom:8 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 22 : 28, color:"#e8eaf0", lineHeight:1, marginBottom:4 }}>{s.value}</div>
                      <div style={{ fontSize:11, color:s.color, fontWeight:600 }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Activity + Revenue — stacked on mobile */}
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 16 }}>
                  <div style={{ ...card }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:14 }}>Recent Activity</div>
                    {activityFeed.map((a,i) => (
                      <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<activityFeed.length-1?"1px solid #0f2040":"none" }}>
                        <span style={{ fontSize:14, flexShrink:0 }}>{a.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12.5, color:"#c8d0df", lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.text}</div>
                          <div style={{ fontSize:11, color:"#3a5070", marginTop:2 }}>{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ ...card }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:14 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0" }}>Revenue Breakdown</div>
                      <div style={{ fontSize:11, color:"#34d399", fontWeight:700 }}>Est. ${totalRevenue} total</div>
                    </div>
                    {revenueRows.map(r => (
                      <div key={r.label} style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, gap:8 }}>
                          <span style={{ fontSize:12, color:"#c8d0df", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.label}</span>
                          <span style={{ fontSize:12, color:"#e8eaf0", fontWeight:700, flexShrink:0 }}>{r.amount} <span style={{ color:"#3a5070", fontWeight:500 }}>({r.pct}%)</span></span>
                        </div>
                        <div style={{ height:5, background:"#0f2040", borderRadius:99, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${r.pct}%`, background:r.color, borderRadius:99, transition:"width .6s cubic-bezier(.22,1,.36,1)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── POSTS ── */}
            {tab === "posts" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
                  <div className="input-group" style={{ flex:1, minWidth:200 }}>
                    <span className="input-icon">{I.search}</span>
                    <input className="input" placeholder="Search posts…" value={search} onChange={e=>setSearch(e.target.value)} style={{ background:"#0a1628", borderColor:"#1a2d4a", color:"#e8eaf0" }} />
                  </div>
                  <div style={{ fontSize:12.5, color:"#3a5070", fontWeight:600, flexShrink:0 }}>{filteredPosts.length} posts</div>
                </div>
                {/* Bulk actions */}
                {selectedPosts.size > 0 && (
                  <div style={{ display:"flex", gap:8, alignItems:"center", padding:"10px 14px", background:"rgba(26,86,219,.1)", border:"1px solid rgba(26,86,219,.2)", borderRadius:T.r, marginBottom:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12.5, color:"#60a5fa", fontWeight:700 }}>{selectedPosts.size} selected</span>
                    <button onClick={handleBulkApprovePosts} style={{ padding:"5px 12px", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", borderRadius:T.r, color:"#22c55e", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✅ Approve All</button>
                    <button onClick={handleBulkDeletePosts} style={{ padding:"5px 12px", background:"rgba(220,38,38,.1)", border:"1px solid rgba(220,38,38,.2)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>🗑️ Delete All</button>
                    <button onClick={()=>setSelectedPosts(new Set())} style={{ padding:"5px 12px", background:"rgba(255,255,255,.04)", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#5a7290", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✕ Clear</button>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {filteredPosts.map(post => (
                    <div key={post.id} style={{ ...card, display:"flex", gap:12, alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row" }}>
                      <input type="checkbox" checked={selectedPosts.has(post.id)} onChange={e=>{ const next=new Set(selectedPosts); e.target.checked?next.add(post.id):next.delete(post.id); setSelectedPosts(next); }} style={{ width:16, height:16, cursor:"pointer", flexShrink:0 }} />
                      <div style={{ display:"flex", gap:12, alignItems:"center", width:"100%", minWidth:0 }}>
                        <div style={{ width:40, height:40, borderRadius:8, background:post.cover, flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:700, fontSize:13.5, color:"#e8eaf0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth: isMobile ? 180 : 300 }}>{post.title}</span>
                            {post.featured && <span style={{ fontSize:10, fontWeight:700, color:"#f59e0b", background:"rgba(245,158,11,.12)", border:"1px solid rgba(245,158,11,.2)", borderRadius:99, padding:"1px 7px", flexShrink:0 }}>⭐</span>}
                          </div>
                          <div style={{ display:"flex", gap:6, fontSize:11.5, color:"#5a7290", flexWrap:"wrap" }}>
                            <span>{post.user}</span><span>·</span><span>{post.category}</span>
                            {!isMobile && <><span>·</span><span>{post.budget} {post.budgetType}</span></>}
                            <span>·</span><span style={{ color:post.type==="need"?"#f87171":"#34d399", fontWeight:600 }}>{post.type==="need"?"Need":"Offer"}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:8, flexShrink:0, width: isMobile ? "100%" : "auto" }}>
                        <button onClick={()=>handleToggleFeatured(post.id)} style={{ flex: isMobile ? 1 : "none", padding:"7px 12px", borderRadius:T.r, background: post.featured ? "rgba(245,158,11,.12)" : "rgba(255,255,255,.04)", border: post.featured ? "1px solid rgba(245,158,11,.25)" : "1px solid #1a2d4a", color: post.featured ? "#f59e0b" : "#5a7290", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Manrope',sans-serif", transition:"all .15s" }}>
                          {post.featured ? "⭐ Unfeature" : "☆ Feature"}
                        </button>
                        <button onClick={()=>setConfirmDel(post.id)} style={{ flex: isMobile ? 1 : "none", padding:"7px 12px", borderRadius:T.r, background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", color:"#f87171", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Manrope',sans-serif" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {confirmDel && (
                  <div className="mbg" onClick={()=>setConfirmDel(null)}>
                    <div className="mbox" style={{ maxWidth:360, background:"#0a1628", border:"1px solid #1a2d4a" }} onClick={e=>e.stopPropagation()}>
                      <div style={{ fontWeight:700, fontSize:16, color:"#e8eaf0", marginBottom:10 }}>Delete Post?</div>
                      <div style={{ fontSize:13.5, color:"#94a3b8", marginBottom:22, lineHeight:1.6 }}>This action cannot be undone. The post and all associated data will be permanently removed.</div>
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={()=>handleDeletePost(confirmDel)} style={{ flex:1, padding:"11px", borderRadius:T.r, background:"#DC2626", border:"none", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Yes, Delete</button>
                        <button onClick={()=>setConfirmDel(null)} style={{ flex:1, padding:"11px", borderRadius:T.r, background:"transparent", border:"1px solid #1a2d4a", color:"#94a3b8", fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
                  <div className="input-group" style={{ flex:1, minWidth:200 }}>
                    <span className="input-icon">{I.search}</span>
                    <input className="input" placeholder="Search users by name, email, country…" value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{ background:"#0a1628", borderColor:"#1a2d4a", color:"#e8eaf0" }} />
                  </div>
                  <div style={{ fontSize:12.5, color:"#3a5070", fontWeight:600, flexShrink:0 }}>{filteredUsers.length} users</div>
                  <button onClick={()=>handleExportCSV("users")} style={{ padding:"7px 13px", background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.2)", borderRadius:T.r, color:"#34d399", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>📥 Export</button>
                </div>
                {selectedUsers.size > 0 && (
                  <div style={{ display:"flex", gap:8, alignItems:"center", padding:"10px 14px", background:"rgba(26,86,219,.1)", border:"1px solid rgba(26,86,219,.2)", borderRadius:T.r, marginBottom:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12.5, color:"#60a5fa", fontWeight:700 }}>{selectedUsers.size} selected</span>
                    <button onClick={handleBulkSuspendUsers} style={{ padding:"5px 12px", background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)", borderRadius:T.r, color:"#f59e0b", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>🚫 Suspend All</button>
                    <button onClick={()=>setSelectedUsers(new Set())} style={{ padding:"5px 12px", background:"rgba(255,255,255,.04)", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#5a7290", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✕ Clear</button>
                  </div>
                )}

                {/* Mobile: cards. Desktop: table */}
                {isMobile ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {filteredUsers.map(u => (
                      <div key={u.id} style={{ ...card, cursor:"pointer" }} onClick={()=>setSelectedUser(u)}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:22 }}>{u.country}</span>
                            <div>
                              <div style={{ fontWeight:700, fontSize:14, color:"#e8eaf0", display:"flex", alignItems:"center", gap:6 }}>
                                {u.name}
                                {u.badge && <span style={{ fontSize:9, color:"#a78bfa" }}>✅</span>}
                              </div>
                              <div style={{ fontSize:12, color:"#5a7290", marginTop:1 }}>{u.email}</div>
                            </div>
                          </div>
                          <span style={{ fontSize:11, fontWeight:700, color: u.status==="active"?"#34d399":"#f87171", background: u.status==="active"?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)", padding:"3px 9px", borderRadius:99 }}>{u.status}</span>
                        </div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
                          <span style={{ fontSize:11.5, fontWeight:700, color: u.plan==="Premium"?"#60a5fa":u.plan==="Verified"?"#a78bfa":"#5a7290", background: u.plan==="Premium"?"rgba(96,165,250,.1)":u.plan==="Verified"?"rgba(167,139,250,.1)":"rgba(255,255,255,.04)", padding:"3px 9px", borderRadius:99, border:"1px solid rgba(255,255,255,.06)" }}>{u.plan}</span>
                          <span style={{ fontSize:11.5, color:"#5a7290", padding:"3px 9px", borderRadius:99, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)" }}>{u.posts} posts</span>
                          <span style={{ fontSize:11.5, color:"#5a7290", padding:"3px 9px", borderRadius:99, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)" }}>Joined {u.joined}</span>
                        </div>
                        <div style={{ display:"flex", gap:7 }}>
                          <button onClick={e=>{e.stopPropagation();handleToggleSuspend(u.id);}} style={{ flex:1, padding:"6px", background:u.status==="suspended"?"rgba(52,211,153,.08)":"rgba(245,158,11,.08)", border:u.status==="suspended"?"1px solid rgba(52,211,153,.2)":"1px solid rgba(245,158,11,.18)", borderRadius:T.r, color:u.status==="suspended"?"#34d399":"#f59e0b", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{u.status==="suspended"?"Reinstate":"Suspend"}</button>
                          <button onClick={e=>{e.stopPropagation();u.badge?handleRevokeBadge(u.id):handleGrantBadge(u.id);}} style={{ flex:1, padding:"6px", background:"rgba(167,139,250,.08)", border:"1px solid rgba(167,139,250,.18)", borderRadius:T.r, color:"#a78bfa", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{u.badge?"Revoke Badge":"Grant Badge"}</button>
                          <button onClick={e=>{e.stopPropagation();setSelectedUser(u);}} style={{ flex:1, padding:"6px", background:"rgba(59,130,246,.08)", border:"1px solid rgba(59,130,246,.18)", borderRadius:T.r, color:"#60a5fa", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background:"#0a1628", border:"1px solid #1a2d4a", borderRadius:T.r2, overflow:"auto" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr 1fr 1fr", padding:"12px 20px", borderBottom:"1px solid #0f2040", fontSize:11, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", minWidth:680 }}>
                      <span>Name</span><span>Email</span><span>Plan</span><span>Posts</span><span>Badge</span><span>Status</span><span>Actions</span>
                    </div>
                    {filteredUsers.map((u,i) => (
                      <div key={u.id} style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1fr 1fr 1fr", padding:"12px 20px", borderBottom:i<filteredUsers.length-1?"1px solid #0f2040":"none", alignItems:"center", transition:"background .12s", minWidth:680, cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#0d1f38"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        onClick={()=>setSelectedUser(u)}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <span style={{ fontSize:16 }}>{u.country}</span>
                          <span style={{ fontSize:13, fontWeight:600, color:"#e8eaf0" }}>{u.name}</span>
                        </div>
                        <span style={{ fontSize:12.5, color:"#5a7290" }}>{u.email}</span>
                        <span style={{ fontSize:12, fontWeight:700, color: u.plan==="Premium"?"#60a5fa":u.plan==="Verified"?"#a78bfa":"#5a7290", background: u.plan==="Premium"?"rgba(96,165,250,.1)":u.plan==="Verified"?"rgba(167,139,250,.1)":"transparent", padding:"2px 8px", borderRadius:99 }}>{u.plan}</span>
                        <span style={{ fontSize:13, color:"#c8d0df" }}>{u.posts}</span>
                        <span style={{ fontSize:12, color: u.badge?"#a78bfa":"#3a5070" }}>{u.badge?"✅ Yes":"—"}</span>
                        <span style={{ fontSize:11, fontWeight:700, color: u.status==="active"?"#34d399":"#f87171", background: u.status==="active"?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)", padding:"2px 8px", borderRadius:99, display:"inline-block" }}>{u.status}</span>
                        <div style={{ display:"flex", gap:6 }} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>handleToggleSuspend(u.id)} style={{ padding:"4px 9px", background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.18)", borderRadius:T.r, color:u.status==="suspended"?"#34d399":"#f59e0b", fontWeight:600, fontSize:11, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{u.status==="suspended"?"✅":"🚫"}</button>
                          <button onClick={()=>u.badge?handleRevokeBadge(u.id):handleGrantBadge(u.id)} style={{ padding:"4px 9px", background:"rgba(167,139,250,.08)", border:"1px solid rgba(167,139,250,.18)", borderRadius:T.r, color:"#a78bfa", fontWeight:600, fontSize:11, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{u.badge?"−✅":"+✅"}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── REVENUE ── */}
            {tab === "revenue" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 14, marginBottom: isMobile ? 16 : 20 }}>
                  {[
                    { label:"This Month",    value:"$4,820", change:"+18%" },
                    { label:"Last Month",    value:"$4,083", change:"+7%" },
                    { label:"Total Revenue", value:"$28,440",change:"" },
                    { label:"Avg per User",  value:"$9.98",  change:"+$0.40" },
                  ].map(s => (
                    <div key={s.label} style={{ ...card }}>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", marginBottom:8 }}>{s.label}</div>
                      <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isMobile ? 20 : 28, color:"#e8eaf0", lineHeight:1 }}>{s.value}</div>
                      {s.change && <div style={{ fontSize:11, color:"#34d399", fontWeight:600, marginTop:5 }}>{s.change} vs prior</div>}
                    </div>
                  ))}
                </div>
                <div style={{ ...card, marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:18 }}>Monthly Revenue — Last 6 Months</div>
                  {[
                    { month:"Dec 2024", val:2800, pct:58 },
                    { month:"Jan 2025", val:3200, pct:66 },
                    { month:"Feb 2025", val:3580, pct:74 },
                    { month:"Mar 2025", val:4083, pct:84 },
                    { month:"Apr 2025", val:4500, pct:93 },
                    { month:"May 2025", val:4820, pct:100 },
                  ].map(m => (
                    <div key={m.month} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                      <div style={{ width: isMobile ? 60 : 80, fontSize:12, color:"#5a7290", flexShrink:0 }}>{m.month}</div>
                      <div style={{ flex:1, height:8, background:"#0f2040", borderRadius:99, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${m.pct}%`, background:"linear-gradient(90deg,#1a56db,#3b82f6)", borderRadius:99 }} />
                      </div>
                      <div style={{ width:56, textAlign:"right", fontSize:12.5, fontWeight:700, color:"#e8eaf0", flexShrink:0 }}>${m.val.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <button onClick={()=>handleExportCSV("posts")} style={{ padding:"9px 18px", background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.25)", borderRadius:T.r, color:"#60a5fa", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>📥 Export Posts CSV</button>
                  <button onClick={()=>handleExportCSV("users")} style={{ padding:"9px 18px", background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.2)", borderRadius:T.r, color:"#34d399", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>📥 Export Users CSV</button>
                </div>
              </div>
            )}

            {/* ── MODERATION ── */}
            {tab === "moderation" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                {/* Flagged posts */}
                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:12 }}>🚩 Flagged Posts ({flaggedPosts.length})</div>
                {flaggedPosts.length === 0 ? (
                  <div style={{ ...card, textAlign:"center", color:"#3a5070", fontSize:13, padding:32, marginBottom:18 }}>No flagged posts. All clear ✅</div>
                ) : flaggedPosts.map(post => (
                  <div key={post.id} style={{ ...card, marginBottom:10, display:"flex", gap:12, alignItems:isMobile?"flex-start":"center", flexDirection:isMobile?"column":"row" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:"#e8eaf0", marginBottom:3 }}>{post.title}</div>
                      <div style={{ fontSize:12, color:"#5a7290" }}>{post.user} · {post.category} · <span style={{ color:"#f87171" }}>Flagged</span></div>
                    </div>
                    <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap" }}>
                      <button onClick={()=>handleUnflagPost(post.id)} style={{ padding:"6px 12px", background:"rgba(52,211,153,.1)", border:"1px solid rgba(52,211,153,.2)", borderRadius:T.r, color:"#34d399", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Unflag</button>
                      <button onClick={()=>handleToggleFeatured(post.id)} style={{ padding:"6px 12px", background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)", borderRadius:T.r, color:"#f59e0b", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{post.featured?"Unfeature":"Feature"}</button>
                      <button onClick={()=>setConfirmDel(post.id)} style={{ padding:"6px 12px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ))}

                {/* Pending approval */}
                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", margin:"22px 0 12px" }}>⏳ Pending Approval ({pendingPosts.length})</div>
                {pendingPosts.length === 0 ? (
                  <div style={{ ...card, textAlign:"center", color:"#3a5070", fontSize:13, padding:32 }}>No posts awaiting approval.</div>
                ) : pendingPosts.map(post => (
                  <div key={post.id} style={{ ...card, marginBottom:10, display:"flex", gap:12, alignItems:isMobile?"flex-start":"center", flexDirection:isMobile?"column":"row" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:"#e8eaf0", marginBottom:3 }}>{post.title}</div>
                      <div style={{ fontSize:12, color:"#5a7290" }}>{post.user} · {post.category}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                      <button onClick={()=>handleApprovePost(post.id)} style={{ padding:"6px 14px", background:"rgba(52,211,153,.12)", border:"1px solid rgba(52,211,153,.25)", borderRadius:T.r, color:"#34d399", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✅ Approve</button>
                      <button onClick={()=>handleRejectPost(post.id)} style={{ padding:"6px 14px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", borderRadius:T.r, color:"#f87171", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>❌ Reject</button>
                    </div>
                  </div>
                ))}

                {/* Demo: add a test pending post */}
                <button onClick={()=>{ setPosts(ps=>[...ps,{ id:Date.now(),title:"Test pending post",user:"Demo User",category:"Technology",type:"need",status:"pending",flagged:false,featured:false,cover:"linear-gradient(135deg,#1A56DB,#3B82F6)",budget:"$100",budgetType:"Fixed",tags:[],summary:"Pending approval demo",apps:0,posted:"now",postedMs:Date.now() }]); }} style={{ marginTop:18, padding:"8px 16px", background:"rgba(255,255,255,.04)", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#5a7290", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>+ Add test pending post</button>

                {confirmDel && (
                  <div className="mbg" onClick={()=>setConfirmDel(null)}>
                    <div className="mbox" style={{ maxWidth:360, background:"#0a1628", border:"1px solid #1a2d4a" }} onClick={e=>e.stopPropagation()}>
                      <div style={{ fontWeight:700, fontSize:16, color:"#e8eaf0", marginBottom:10 }}>Delete Post?</div>
                      <div style={{ fontSize:13.5, color:"#94a3b8", marginBottom:22, lineHeight:1.6 }}>This cannot be undone.</div>
                      <div style={{ display:"flex", gap:10 }}>
                        <button onClick={()=>handleDeletePost(confirmDel)} style={{ flex:1, padding:"11px", borderRadius:T.r, background:"#DC2626", border:"none", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Yes, Delete</button>
                        <button onClick={()=>setConfirmDel(null)} style={{ flex:1, padding:"11px", borderRadius:T.r, background:"transparent", border:"1px solid #1a2d4a", color:"#94a3b8", fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── BADGES ── */}
            {tab === "badges" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:12 }}>✅ Badge Requests ({badgeRequests.length})</div>
                {badgeRequests.length === 0 ? (
                  <div style={{ ...card, textAlign:"center", color:"#3a5070", fontSize:13, padding:28, marginBottom:18 }}>No pending badge requests.</div>
                ) : badgeRequests.map(u => (
                  <div key={u.id} style={{ ...card, marginBottom:10, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:22 }}>{u.country}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:"#e8eaf0" }}>{u.name}</div>
                      <div style={{ fontSize:12, color:"#5a7290" }}>{u.email} · {u.posts} posts · {u.plan}</div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>handleGrantBadge(u.id)} style={{ padding:"7px 14px", background:"rgba(167,139,250,.12)", border:"1px solid rgba(167,139,250,.25)", borderRadius:T.r, color:"#a78bfa", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✅ Grant Badge</button>
                      <button onClick={()=>{ setUsers(us=>us.map(x=>x.id===u.id?{...x,badgeRequested:false}:x)); }} style={{ padding:"7px 12px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.18)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Dismiss</button>
                    </div>
                  </div>
                ))}

                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", margin:"22px 0 12px" }}>All Users — Badge Management</div>
                {users.map(u => (
                  <div key={u.id} style={{ ...card, marginBottom:10, display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:20 }}>{u.country}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontWeight:700, fontSize:13.5, color:"#e8eaf0" }}>{u.name}</span>
                        {u.badge && <span style={{ fontSize:10, fontWeight:700, color:"#a78bfa", background:"rgba(167,139,250,.12)", border:"1px solid rgba(167,139,250,.2)", borderRadius:99, padding:"1px 7px" }}>✅ Verified</span>}
                      </div>
                      <div style={{ fontSize:12, color:"#5a7290" }}>{u.plan} · {u.posts} posts</div>
                    </div>
                    {u.badge ? (
                      <button onClick={()=>handleRevokeBadge(u.id)} style={{ padding:"6px 14px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.18)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Revoke</button>
                    ) : (
                      <button onClick={()=>handleGrantBadge(u.id)} style={{ padding:"6px 14px", background:"rgba(167,139,250,.1)", border:"1px solid rgba(167,139,250,.2)", borderRadius:T.r, color:"#a78bfa", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Grant</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── ANNOUNCEMENTS ── */}
            {tab === "announcements" && (
              <div style={{ animation:"page-fade .28s ease both", maxWidth:620 }}>
                <div style={{ ...card, marginBottom:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:14 }}>📢 New Announcement</div>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Type your announcement to all users…"
                    value={newAnnounce.text}
                    onChange={e=>setNewAnnounce(a=>({...a,text:e.target.value}))}
                    style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0", marginBottom:10 }}
                  />
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
                    <select className="input" value={newAnnounce.type} onChange={e=>setNewAnnounce(a=>({...a,type:e.target.value}))} style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0", width:"auto", flex:1 }}>
                      <option value="info">ℹ️ Info</option>
                      <option value="success">✅ Success</option>
                      <option value="warning">⚠️ Warning</option>
                      <option value="danger">🚨 Danger</option>
                    </select>
                    <button onClick={handleAddAnnounce} style={{ padding:"9px 20px", background:"#1A56DB", border:"none", borderRadius:T.r, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Publish</button>
                  </div>
                </div>

                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:12 }}>Active Announcements ({announcements.filter(a=>a.active).length})</div>
                {announcements.map(a => {
                  const typeStyle = { info:{c:"#60a5fa",bg:"rgba(96,165,250,.1)",border:"rgba(96,165,250,.2)"}, success:{c:"#34d399",bg:"rgba(52,211,153,.08)",border:"rgba(52,211,153,.18)"}, warning:{c:"#f59e0b",bg:"rgba(245,158,11,.08)",border:"rgba(245,158,11,.18)"}, danger:{c:"#f87171",bg:"rgba(248,113,113,.08)",border:"rgba(248,113,113,.18)"} }[a.type]||{c:"#60a5fa",bg:"rgba(96,165,250,.1)",border:"rgba(96,165,250,.2)"};
                  return (
                    <div key={a.id} style={{ background:typeStyle.bg, border:`1px solid ${typeStyle.border}`, borderRadius:T.r2, padding:"14px 18px", marginBottom:10, display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, color:typeStyle.c, fontWeight:600, lineHeight:1.5 }}>{a.text}</div>
                        <div style={{ fontSize:11.5, color:"#3a5070", marginTop:4 }}>Created {a.created} · {a.active ? "Active":"Hidden"}</div>
                      </div>
                      <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                        <button onClick={()=>handleToggleAnnounce(a.id)} style={{ padding:"5px 10px", background:"rgba(255,255,255,.05)", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#94a3b8", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{a.active?"Hide":"Show"}</button>
                        <button onClick={()=>handleDeleteAnnounce(a.id)} style={{ padding:"5px 10px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.18)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:11.5, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── CATEGORIES ── */}
            {tab === "categories" && (
              <div style={{ animation:"page-fade .28s ease both", maxWidth:540 }}>
                <div style={{ ...card, marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:12 }}>➕ Add Category</div>
                  <div style={{ display:"flex", gap:10 }}>
                    <input className="input" value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddCategory()} placeholder="New category name…" style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0" }} />
                    <button onClick={handleAddCategory} style={{ padding:"10px 18px", background:"#1A56DB", border:"none", borderRadius:T.r, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif", flexShrink:0 }}>Add</button>
                  </div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:10 }}>All Categories ({categories.length})</div>
                <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"1fr 1fr 1fr", gap:8 }}>
                  {categories.map(c => (
                    <div key={c} style={{ ...card, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px", gap:8 }}>
                      <span style={{ fontSize:13, color:"#c8d0df", fontWeight:600 }}>{c}</span>
                      <button onClick={()=>handleDeleteCategory(c)} style={{ background:"none", border:"none", color:"#f87171", cursor:"pointer", fontSize:14, padding:2, lineHeight:1 }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── BRANDING ── */}
            {/* ── BROADCAST ── */}
            {tab === "broadcast" && (
              <div style={{ animation:"page-fade .28s ease both", maxWidth:600 }}>
                <div style={{ ...card, marginBottom:16 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:16 }}>📧 Email Broadcast</div>
                  <div style={{ fontSize:12, color:"#5a7290", marginBottom:16 }}>Send a message to all users or a specific segment. Simulated — in production this would trigger a real email send.</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".6px", marginBottom:6 }}>Audience</div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {["All Users","Free Plan","Premium","Suspended","Inactive 7d+"].map(a=>(
                          <button key={a} style={{ padding:"5px 12px", background:"rgba(59,130,246,.1)", border:"1px solid rgba(59,130,246,.2)", borderRadius:T.r, color:"#60a5fa", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{a}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".6px", marginBottom:6 }}>Subject</div>
                      <input value={broadcastSubj} onChange={e=>setBroadcastSubj(e.target.value)} placeholder="e.g. New features are live on Hired!" className="input" style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0" }} />
                    </div>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".6px", marginBottom:6 }}>Message</div>
                      <textarea value={broadcastBody} onChange={e=>setBroadcastBody(e.target.value)} rows={5} placeholder="Write your message here…" className="input" style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0", resize:"vertical" }} />
                    </div>
                    {broadcastSent ? (
                      <div style={{ padding:"12px 16px", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.2)", borderRadius:T.r, color:"#22c55e", fontWeight:600, fontSize:13 }}>✅ Broadcast sent to {users.length} users</div>
                    ) : (
                      <button onClick={()=>{ if(!broadcastSubj.trim()||!broadcastBody.trim()) return; setBroadcastSent(true); if(addAudit) addAudit("BROADCAST", broadcastSubj); setTimeout(()=>setBroadcastSent(false),4000); fire("📧 Broadcast sent!"); }} style={{ padding:"11px", background:"#1A56DB", border:"none", borderRadius:T.r, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif", opacity:broadcastSubj&&broadcastBody?1:.5 }}>
                        Send Broadcast
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── AUDIT LOG ── */}
            {tab === "audit" && (
              <div style={{ animation:"page-fade .28s ease both" }}>
                <div style={{ ...card, overflow:"hidden" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #0f2040" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0" }}>Admin Audit Log</div>
                    <div style={{ fontSize:11, color:"#3a5070" }}>{auditLog.length} entries</div>
                  </div>
                  {auditLog.length === 0 ? (
                    <div style={{ padding:"40px 20px", textAlign:"center", color:"#3a5070", fontSize:13 }}>No admin actions recorded yet. Actions like approving posts, banning users, and changing plans will appear here.</div>
                  ) : (
                    <div style={{ overflowX:"auto" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 2fr 1.5fr", padding:"10px 20px", fontSize:11, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:"#3a5070", borderBottom:"1px solid #0f2040", minWidth:500 }}>
                        <span>Action</span><span>Detail</span><span>Time</span>
                      </div>
                      {auditLog.map((e,i)=>(
                        <div key={e.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 2fr 1.5fr", padding:"11px 20px", borderBottom:i<auditLog.length-1?"1px solid #060f1f":"none", alignItems:"center", minWidth:500 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:"#60a5fa", fontFamily:"monospace" }}>{e.action}</span>
                          <span style={{ fontSize:12, color:"#c8d0df" }}>{e.detail}</span>
                          <span style={{ fontSize:11, color:"#3a5070" }}>{new Date(e.at).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "branding" && (
              <div style={{ animation:"page-fade .28s ease both", maxWidth:540 }}>
                {/* Logo upload */}
                <div style={{ ...card, marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:14 }}>🖼️ App Logo</div>
                  <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <div style={{ width:72, height:72, borderRadius:16, background:"#060f1f", border:"1px solid #1a2d4a", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
                      {brandLogo ? <img src={brandLogo} alt="logo" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:28, fontFamily:"'Playfair Display',serif", color:"#3b82f6", fontWeight:700 }}>{brandName[0]}</span>}
                    </div>
                    <div>
                      <input ref={logoInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleLogoUpload} />
                      <button onClick={()=>logoInputRef.current?.click()} style={{ display:"block", padding:"8px 18px", background:"#1A56DB", border:"none", borderRadius:T.r, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif", marginBottom:8 }}>Upload Logo</button>
                      {brandLogo && <button onClick={()=>{setBrandLogo(null);fire("🗑️ Logo removed");}} style={{ display:"block", padding:"6px 18px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.18)", borderRadius:T.r, color:"#f87171", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Remove Logo</button>}
                    </div>
                  </div>
                </div>

                {/* App name */}
                <div style={{ ...card, marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:10 }}>✏️ Platform Name</div>
                  <input className="input" value={brandName} onChange={e=>setBrandName(e.target.value)} style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0" }} />
                </div>

                {/* Accent color */}
                <div style={{ ...card, marginBottom:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:10 }}>🎨 Accent Colour</div>
                  <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                    <input type="color" value={brandAccent} onChange={e=>setBrandAccent(e.target.value)} style={{ width:52, height:44, borderRadius:T.r, border:"1px solid #1a2d4a", background:"none", cursor:"pointer" }} />
                    <input className="input" value={brandAccent} onChange={e=>setBrandAccent(e.target.value)} style={{ background:"#060f1f", borderColor:"#1a2d4a", color:"#e8eaf0", width:130, flex:"none" }} />
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {["#1A56DB","#7C3AED","#0F766E","#DC2626","#D97706","#0284C7"].map(c=>(
                        <button key={c} onClick={()=>setBrandAccent(c)} style={{ width:28, height:28, borderRadius:"50%", background:c, border: brandAccent===c?"3px solid #fff":"2px solid rgba(255,255,255,.15)", cursor:"pointer" }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div style={{ ...card, marginBottom:18 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e8eaf0", marginBottom:12 }}>👁️ Brand Preview</div>
                  <div style={{ background:"#060f1f", borderRadius:T.r2, padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${brandAccent},#3B82F6)`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                      {brandLogo ? <img src={brandLogo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontWeight:700, fontSize:16 }}>{brandName[0]}</span>}
                    </div>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:brandAccent }}>{brandName}</span>
                  </div>
                </div>

                <button onClick={()=>fire("✅ Branding saved")} style={{ padding:"10px 24px", background:"#1A56DB", border:"none", borderRadius:T.r, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Save Branding</button>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === "settings" && (
              <div style={{ animation:"page-fade .28s ease both", maxWidth:580 }}>
                {/* Toggle settings */}
                {[
                  { key:"maintenanceMode", label:"Maintenance Mode",       desc:"Disable public access, show maintenance page" },
                  { key:"requireApproval", label:"Require Post Approval",  desc:"All new posts need admin approval before going live" },
                  { key:"allowNewSignups", label:"Allow New Signups",      desc:"Let new users register on the platform" },
                ].map(s => (
                  <div key={s.key} style={{ ...card, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <div>
                      <div style={{ fontSize:13.5, color:"#c8d0df", fontWeight:700 }}>{s.label}</div>
                      <div style={{ fontSize:12, color:"#3a5070", marginTop:3 }}>{s.desc}</div>
                    </div>
                    <div
                      onClick={()=>setSettings(prev=>({ ...prev, [s.key]:!prev[s.key] }))}
                      style={{ width:44, height:24, borderRadius:99, background:settings[s.key]?"#1A56DB":"#1a2d4a", position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}
                    >
                      <div style={{ position:"absolute", top:3, left:settings[s.key]?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }} />
                    </div>
                  </div>
                ))}

                {/* Text/number settings */}
                <div style={{ marginTop:14 }}>
                  {[
                    { key:"supportEmail",    label:"Support Email",              type:"text",   unit:"" },
                    { key:"freeUnlocks",     label:"Free Unlocks Per Day",       type:"number", unit:"" },
                    { key:"creditPackPrice", label:"Credit Pack Price (USD)",    type:"number", unit:"$" },
                    { key:"monthlyPrice",    label:"Monthly Plan Price (USD)",   type:"number", unit:"$" },
                    { key:"badgePrice",      label:"Verified Badge Price (USD)", type:"number", unit:"$" },
                  ].map(s => (
                    <div key={s.key} style={{ ...card, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:isMobile?"wrap":"nowrap" }}>
                      <div style={{ fontSize:13.5, color:"#c8d0df", fontWeight:600 }}>{s.label}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {s.unit && <span style={{ color:"#5a7290", fontSize:14 }}>{s.unit}</span>}
                        <input
                          type={s.type}
                          value={settings[s.key]}
                          onChange={e=>setSettings(prev=>({...prev,[s.key]:e.target.value}))}
                          style={{ background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:T.r, padding:"7px 12px", color:"#e8eaf0", fontSize:13.5, fontFamily:"'Manrope',sans-serif", width:isMobile?"100%":150, outline:"none" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
                  <button className="btn btn-blue" style={{ flex:isMobile?1:"none" }} onClick={()=>fire("✅ Settings saved successfully")}>Save Changes</button>
                  <button className="btn btn-outline" style={{ flex:isMobile?1:"none", borderColor:"#1a2d4a", color:"#5a7290" }} onClick={()=>{ setSettings({ supportEmail:"hello@hired.com", freeUnlocks:"1", creditPackPrice:"3", monthlyPrice:"10", badgePrice:"9", maintenanceMode:false, requireApproval:false, allowNewSignups:true }); fire("🔄 Settings reset to defaults"); }}>Reset</button>
                </div>

                <div style={{ marginTop:24, padding:"16px 18px", background:"rgba(220,38,38,.06)", border:"1px solid rgba(220,38,38,.18)", borderRadius:T.r2 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#f87171", marginBottom:6 }}>⚠️ Danger Zone</div>
                  <div style={{ fontSize:13, color:"#94a3b8", marginBottom:14, lineHeight:1.6 }}>These actions cannot be undone.</div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    <button className="btn btn-danger btn-sm" style={{ flex:isMobile?1:"none" }} onClick={()=>fire("🚫 Action blocked in demo mode")}>Clear All Posts</button>
                    <button className="btn btn-danger btn-sm" style={{ flex:isMobile?1:"none" }} onClick={()=>fire("🚫 Action blocked in demo mode")}>Reset User Data</button>
                    <button className="btn btn-danger btn-sm" style={{ flex:isMobile?1:"none" }} onClick={()=>fire("🚫 Action blocked in demo mode")}>Wipe Database</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── BOTTOM TAB NAV (mobile only) ── */}
      {isMobile && (
        <nav style={{ height:60, background:"#0a1628", borderTop:"1px solid #1a2d4a", display:"flex", flexShrink:0, overflowX:"auto" }}>
          {ADMIN_TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
              background:"none", border:"none", cursor:"pointer",
              color: tab===t.id ? "#60a5fa" : "#3a5070",
              fontFamily:"'Manrope',sans-serif", padding:"0 4px",
              borderTop: tab===t.id ? "2px solid #3b82f6" : "2px solid transparent",
              transition:"all .15s", minWidth:52,
            }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              <span style={{ fontSize:8, fontWeight:700, letterSpacing:".2px", whiteSpace:"nowrap" }}>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ── USER DETAIL DRAWER ── */}
      {selectedUser && (
        <div className="mbg" onClick={()=>setSelectedUser(null)}>
          <div className="mbox" style={{ maxWidth:440, background:"#0a1628", border:"1px solid #1a2d4a" }} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelectedUser(null)} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.07)", border:"1px solid #1a2d4a", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#5a7290" }}>{I.close}</button>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#1A56DB,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff" }}>{selectedUser.name[0]}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:16, color:"#e8eaf0", display:"flex", alignItems:"center", gap:7 }}>
                  {selectedUser.name}
                  {selectedUser.badge && <span style={{ fontSize:10, fontWeight:700, color:"#a78bfa", background:"rgba(167,139,250,.12)", border:"1px solid rgba(167,139,250,.2)", borderRadius:99, padding:"1px 7px" }}>✅ Verified</span>}
                </div>
                <div style={{ fontSize:13, color:"#5a7290" }}>{selectedUser.email}</div>
              </div>
            </div>
            {[["Country",selectedUser.country],["Plan",selectedUser.plan],["Posts",selectedUser.posts],["Joined",selectedUser.joined],["Status",selectedUser.status]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #0f2040" }}>
                <span style={{ fontSize:13, color:"#5a7290" }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#c8d0df" }}>{String(v)}</span>
              </div>
            ))}
            <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#3a5070", textTransform:"uppercase", letterSpacing:".6px" }}>Change Plan</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {["Free","Premium","Verified"].map(plan=>(
                  <button key={plan} onClick={()=>handleChangePlan(selectedUser.id,plan)} style={{ padding:"6px 14px", background:selectedUser.plan===plan?"rgba(26,86,219,.2)":"rgba(255,255,255,.04)", border:selectedUser.plan===plan?"1px solid #3b82f6":"1px solid #1a2d4a", borderRadius:T.r, color:selectedUser.plan===plan?"#60a5fa":"#5a7290", fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>{plan}</button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                {selectedUser.badge
                  ? <button onClick={()=>handleRevokeBadge(selectedUser.id)} style={{ flex:1, padding:"9px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", borderRadius:T.r, color:"#f87171", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Revoke Badge</button>
                  : <button onClick={()=>handleGrantBadge(selectedUser.id)} style={{ flex:1, padding:"9px", background:"rgba(167,139,250,.1)", border:"1px solid rgba(167,139,250,.2)", borderRadius:T.r, color:"#a78bfa", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Grant Badge</button>
                }
                <button onClick={()=>handleToggleSuspend(selectedUser.id)} style={{ flex:1, padding:"9px", background: selectedUser.status==="suspended"?"rgba(52,211,153,.1)":"rgba(245,158,11,.08)", border: selectedUser.status==="suspended"?"1px solid rgba(52,211,153,.2)":"1px solid rgba(245,158,11,.2)", borderRadius:T.r, color: selectedUser.status==="suspended"?"#34d399":"#f59e0b", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>
                  {selectedUser.status==="suspended" ? "Reinstate" : "Suspend"}
                </button>
                <button onClick={()=>{ setBanTarget(selectedUser); setSelectedUser(null); }} style={{ flex:1, padding:"9px", background:"rgba(220,38,38,.14)", border:"1px solid rgba(220,38,38,.3)", borderRadius:T.r, color:"#f87171", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>🚫 Ban</button>
                <button onClick={()=>handleDeleteUser(selectedUser.id)} style={{ flex:1, padding:"9px", background:"rgba(220,38,38,.08)", border:"1px solid rgba(220,38,38,.2)", borderRadius:T.r, color:"#f87171", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BAN MODAL ── */}
      {banTarget && (
        <div className="mbg" onClick={()=>setBanTarget(null)}>
          <div style={{ width:"min(400px,94vw)", background:"#0a1628", border:"1px solid #1a2d4a", borderRadius:16, padding:24, position:"relative" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:15, fontWeight:700, color:"#e8eaf0", marginBottom:6 }}>🚫 Ban {banTarget.name}</div>
            <div style={{ fontSize:12.5, color:"#5a7290", marginBottom:16 }}>This will permanently block the user from accessing Hired. Provide a reason for the record.</div>
            <textarea value={banReason} onChange={e=>setBanReason(e.target.value)} placeholder="Reason for ban (e.g. repeated spam, fraud, abuse)…" rows={3} style={{ width:"100%", boxSizing:"border-box", background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#e8eaf0", padding:"10px 12px", fontFamily:"'Manrope',sans-serif", fontSize:13, resize:"vertical", marginBottom:14 }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setBanTarget(null)} style={{ flex:1, padding:"9px", background:"rgba(255,255,255,.04)", border:"1px solid #1a2d4a", borderRadius:T.r, color:"#5a7290", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Cancel</button>
              <button onClick={()=>handleBanUser(banTarget.id, banReason||"No reason given")} style={{ flex:1, padding:"9px", background:"rgba(220,38,38,.14)", border:"1px solid rgba(220,38,38,.3)", borderRadius:T.r, color:"#f87171", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'Manrope',sans-serif" }}>Confirm Ban</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CMD+K COMMAND PALETTE ── */}
      {cmdK && (
        <div style={{ position:"fixed", inset:0, background:"rgba(2,8,20,.85)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"12vh", backdropFilter:"blur(12px)" }} onClick={()=>setCmdK(false)}>
          <div style={{ width:"min(560px,94vw)", background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:16, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,.6)", animation:"card-in .2s cubic-bezier(.22,1,.36,1) both" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:"1px solid #0f2040" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a5070" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                autoFocus
                value={cmdKQuery}
                onChange={e=>setCmdKQuery(e.target.value)}
                placeholder="Jump to section, search users or posts…"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#e8eaf0", fontSize:15, fontFamily:"'Manrope',sans-serif", fontWeight:500 }}
              />
              <kbd style={{ fontSize:10, color:"#3a5070", background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:5, padding:"2px 6px", fontFamily:"monospace" }}>ESC</kbd>
            </div>
            <div style={{ maxHeight:360, overflowY:"auto" }}>
              {/* Tab navigation results */}
              {ADMIN_TABS.filter(t => !cmdKQuery || t.label.toLowerCase().includes(cmdKQuery.toLowerCase())).map(t=>(
                <button key={t.id} onClick={()=>{ setTab(t.id); setCmdK(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"12px 18px", background:"transparent", border:"none", borderBottom:"1px solid #060f1f", cursor:"pointer", textAlign:"left", transition:"background .1s", fontFamily:"'Manrope',sans-serif" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#112440"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{ fontSize:18, width:24, textAlign:"center" }}>{t.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:"#c8d0df" }}>{t.label}</div>
                    <div style={{ fontSize:11.5, color:"#3a5070" }}>Admin section</div>
                  </div>
                  <kbd style={{ fontSize:10, color:"#2a4a70", background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:5, padding:"2px 6px", fontFamily:"monospace" }}>↵</kbd>
                </button>
              ))}
              {/* User results */}
              {users.filter(u => cmdKQuery && (u.name.toLowerCase().includes(cmdKQuery.toLowerCase()) || u.email.toLowerCase().includes(cmdKQuery.toLowerCase()))).map(u=>(
                <button key={u.id} onClick={()=>{ setSelectedUser(u); setTab("users"); setCmdK(false); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"12px 18px", background:"transparent", border:"none", borderBottom:"1px solid #060f1f", cursor:"pointer", textAlign:"left", transition:"background .1s", fontFamily:"'Manrope',sans-serif" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#112440"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1A56DB,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:"#fff", flexShrink:0 }}>{u.name[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:"#c8d0df" }}>{u.name} <span style={{ fontSize:11 }}>{u.country}</span></div>
                    <div style={{ fontSize:11.5, color:"#3a5070" }}>{u.email} · {u.plan}</div>
                  </div>
                  <span style={{ fontSize:11, color:u.status==="suspended"?"#f87171":"#34d399", fontWeight:600, flexShrink:0 }}>{u.status}</span>
                </button>
              ))}
              {cmdKQuery && ADMIN_TABS.filter(t=>t.label.toLowerCase().includes(cmdKQuery.toLowerCase())).length===0 && users.filter(u=>u.name.toLowerCase().includes(cmdKQuery.toLowerCase())||u.email.toLowerCase().includes(cmdKQuery.toLowerCase())).length===0 && (
                <div style={{ padding:"32px", textAlign:"center", color:"#3a5070", fontSize:13.5 }}>No results for "{cmdKQuery}"</div>
              )}
            </div>
            <div style={{ padding:"10px 18px", borderTop:"1px solid #0f2040", display:"flex", gap:16 }}>
              {[["↑↓","Navigate"],["↵","Select"],["ESC","Close"]].map(([k,l])=>(
                <div key={k} style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <kbd style={{ fontSize:10, color:"#3a5070", background:"#060f1f", border:"1px solid #1a2d4a", borderRadius:5, padding:"2px 7px", fontFamily:"monospace" }}>{k}</kbd>
                  <span style={{ fontSize:11, color:"#3a5070" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SWIPEABLE NOTIFICATION ITEM ───────────────────────────────────────────*/
function SwipeableNotif({ notif, isLast, onDismiss, onTap }) {
  const ref = useRef(null);
  const startX = useRef(null);
  const currentX = useRef(0);
  const [dismissed, setDismissed] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'
  const isMessage = notif.type === "message";

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    currentX.current = 0;
    if (ref.current) ref.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    currentX.current = dx;
    if (ref.current) {
      ref.current.style.transform = `translateX(${dx}px)`;
      ref.current.style.opacity = `${Math.max(0, 1 - Math.abs(dx) / 180)}`;
    }
  };

  const handleTouchEnd = () => {
    const dx = currentX.current;
    if (Math.abs(dx) > 80) {
      const dir = dx > 0 ? "right" : "left";
      setSwipeDir(dir);
      setDismissed(true);
      setTimeout(onDismiss, 320);
    } else {
      if (ref.current) {
        ref.current.style.transition = "transform .22s cubic-bezier(.22,1,.36,1), opacity .22s";
        ref.current.style.transform = "translateX(0)";
        ref.current.style.opacity = "1";
      }
    }
    startX.current = null;
  };

  return (
    <div style={{ position:"relative", overflow:"hidden", borderBottom: isLast ? "none" : `1px solid ${T.border}` }}>
      {/* Swipe hint backgrounds */}
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(90deg,${T.roseBg},transparent)`, display:"flex", alignItems:"center", paddingLeft:18, opacity: currentX.current < -20 ? 1 : 0, transition:"opacity .1s", pointerEvents:"none" }}>
        <span style={{ fontSize:16 }}>🗑️</span>
      </div>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(270deg,${T.roseBg},transparent)`, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:18, opacity: currentX.current > 20 ? 1 : 0, transition:"opacity .1s", pointerEvents:"none" }}>
        <span style={{ fontSize:16 }}>🗑️</span>
      </div>

      <div
        ref={ref}
        className={dismissed ? (swipeDir === "right" ? "notif-swipe-right" : "notif-swipe-left") : ""}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={isMessage ? onTap : undefined}
        style={{
          display:"flex", gap:12, padding:"13px 18px",
          cursor: isMessage ? "pointer" : "default",
          background: isMessage ? "transparent" : "transparent",
          transition:"background .12s",
          position:"relative", zIndex:1,
          willChange:"transform",
        }}
        onMouseEnter={e=>{ e.currentTarget.style.background=T.bg; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=""; }}
      >
        <span style={{ fontSize:20, flexShrink:0 }}>{notif.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{notif.text}</div>
          <div style={{ fontSize:11.5, color:T.ink4, marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
            {typeof notif.id === "number" && notif.id > 1000000000000 ? timeAgo(notif.id) : notif.time}
            {isMessage && <span style={{ color:T.accent, fontWeight:700, fontSize:11 }}>Tap to open →</span>}
          </div>
        </div>
        {/* Desktop dismiss X */}
        <button
          onClick={e=>{ e.stopPropagation(); onDismiss(); }}
          style={{ background:"none", border:"none", color:T.ink4, cursor:"pointer", padding:"0 2px", fontSize:16, lineHeight:1, flexShrink:0, opacity:.5, transition:"opacity .15s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity="1"}
          onMouseLeave={e=>e.currentTarget.style.opacity=".5"}
          title="Dismiss"
        >×</button>
      </div>
    </div>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────*/
/* ─── SETTINGS PAGE ─────────────────────────────────────────────────────────*/
const SettingsPage = ({ onLogout, isPaid, onUpgrade, dark, onToggleDark, fire }) => {
  const [notifPrefs, setNotifPrefs] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_notif_prefs")||"null") || { messages:true, unlocks:true, proposals:true, trending:false, referrals:true }; } catch { return { messages:true, unlocks:true, proposals:true, trending:false, referrals:true }; } });
  const [email, setEmail] = useState(() => localStorage.getItem("hired_email")||"");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const saveNotifPref = (key, val) => {
    const next = { ...notifPrefs, [key]:val };
    setNotifPrefs(next);
    localStorage.setItem("hired_notif_prefs", JSON.stringify(next));
  };

  const Toggle = ({ on, onChange }) => (
    <div onClick={()=>onChange(!on)} style={{ width:44, height:24, borderRadius:99, background:on?T.accent:T.border, cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:on?22:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.18)" }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="card" style={{ padding:0, overflow:"hidden", marginBottom:14 }}>
      <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, fontSize:12, fontWeight:700, color:T.ink3, textTransform:"uppercase", letterSpacing:".6px" }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, sub, right, danger }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:`1px solid ${T.border}`, gap:12 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:600, color:danger?T.rose:T.ink }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:T.ink3, marginTop:2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  return (
    <div style={{ maxWidth:580, margin:"0 auto", padding:"24px 20px 100px" }}>
      <div className="lbl" style={{ marginBottom:4 }}>Account</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:20 }}>Settings</div>

      <Section title="Appearance">
        <Row label="Dark Mode" sub="Easier on the eyes at night" right={<Toggle on={dark} onChange={onToggleDark} />} />
      </Section>

      <Section title="Notifications">
        {[
          { k:"messages",  l:"New messages",       s:"When someone sends you a message" },
          { k:"unlocks",   l:"Profile unlocks",    s:"When someone views your contact info" },
          { k:"proposals", l:"Proposals received", s:"When someone applies to your post" },
          { k:"trending",  l:"Trending posts",     s:"Weekly digest of popular posts" },
          { k:"referrals", l:"Referral rewards",   s:"When your referral signs up" },
        ].map(({ k,l,s }) => (
          <Row key={k} label={l} sub={s} right={<Toggle on={notifPrefs[k]} onChange={v=>saveNotifPref(k,v)} />} />
        ))}
      </Section>

      <Section title="Account">
        <Row label="Email address" sub={email||"Not set"} right={
          <input className="input" value={email} onChange={e=>{ setEmail(e.target.value); localStorage.setItem("hired_email",e.target.value); }} placeholder="your@email.com" style={{ width:190, fontSize:13 }} />
        } />
        <Row label="Plan" sub={isPaid?"Hired Premium — unlimited unlocks":"Free — 1 unlock per day"} right={
          !isPaid ? <button className="btn btn-blue btn-sm" onClick={onUpgrade}>Upgrade</button>
                  : <span style={{ fontSize:12, fontWeight:700, color:T.green, background:T.greenBg, padding:"3px 10px", borderRadius:99 }}>Premium ✓</span>
        } />
        <Row label="Change password" sub="Update your login credentials" right={
          <button className="btn btn-outline btn-sm" onClick={()=>fire("📧 Password reset email sent!")}>Reset</button>
        } />
      </Section>

      <Section title="Privacy">
        <Row label="Profile visibility" sub="Your profile is visible to all users" right={
          <span style={{ fontSize:12, color:T.green, fontWeight:600 }}>Public</span>
        } />
        <Row label="Download your data" sub="Get a copy of all your Hired data" right={
          <button className="btn btn-outline btn-sm" onClick={()=>{
            const data = { profile: localStorage.getItem("hired_profile_name"), posts: localStorage.getItem("hired_user_posts"), messages: localStorage.getItem("hired_messages") };
            navigator.clipboard?.writeText(JSON.stringify(data,null,2));
            fire("📋 Data copied to clipboard");
          }}>Export</button>
        } />
      </Section>

      <Section title="Danger Zone">
        <div style={{ borderBottom:`1px solid ${T.border}` }}>
          <Row label="Sign out" sub="Log out of your account" danger right={
            <button className="btn btn-outline btn-sm" style={{ borderColor:T.rose, color:T.rose }} onClick={onLogout}>Sign out</button>
          } />
        </div>
        <Row label="Delete account" sub="Permanently delete all your data. This cannot be undone." danger right={
          showDeleteConfirm
            ? <div style={{ display:"flex", gap:6 }}>
                <button className="btn btn-sm" style={{ background:T.rose, color:"#fff", border:"none" }} onClick={()=>{ onLogout(); }}>Yes, delete</button>
                <button className="btn btn-ghost btn-sm" onClick={()=>setShowDeleteConfirm(false)}>Cancel</button>
              </div>
            : <button className="btn btn-sm" style={{ background:"rgba(220,38,38,.08)", border:`1px solid rgba(220,38,38,.2)`, color:T.rose }} onClick={()=>setShowDeleteConfirm(true)}>Delete</button>
        } />
      </Section>
    </div>
  );
};

/* ─── NOTIFICATIONS PAGE ────────────────────────────────────────────────────*/
const NotificationsPage = ({ notifs=[], onDismiss, onMarkAllRead, onNavigate }) => {
  const [tab, setNotifTab] = useState("all");
  const TABS = [
    { k:"all",       l:"All"       },
    { k:"proposal",  l:"Proposals" },
    { k:"message",   l:"Messages"  },
    { k:"referral",  l:"Activity"  },
  ];
  const filtered = tab==="all" ? notifs : notifs.filter(n=>n.type===tab);
  const groups = [
    { label:"Today",    items: filtered.filter((_,i)=>i<3) },
    { label:"Earlier",  items: filtered.filter((_,i)=>i>=3) },
  ].filter(g=>g.items.length>0);

  const iconBg = { unlock:"#EFF6FF", interest:"#F0FDF4", message:"#FDF4FF", boost:"#FFFBEB", referral:"#FFF7ED", post:"#F0FDF4", trending:"#FFF1F2" };
  const EMPTY = filtered.length === 0;

  return (
    <div style={{ maxWidth:640, margin:"0 auto", padding:"24px 20px 100px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <div className="lbl" style={{ marginBottom:4 }}>Inbox</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26 }}>Notifications</div>
        </div>
        {!EMPTY && (
          <button className="btn btn-outline btn-sm" onClick={onMarkAllRead}>Mark all read</button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:20, overflowX:"auto", paddingBottom:2 }}>
        {TABS.map(t=>{
          const cnt = t.k==="all" ? notifs.length : notifs.filter(n=>n.type===t.k).length;
          return (
            <button key={t.k} onClick={()=>setNotifTab(t.k)} style={{ padding:"7px 16px", borderRadius:99, border:`1.5px solid ${tab===t.k?T.accent:T.border}`, background:tab===t.k?T.accentL:"transparent", color:tab===t.k?T.accent:T.ink3, fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:12.5, cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5, transition:"all .15s" }}>
              {t.l}
              {cnt>0 && <span style={{ background:tab===t.k?T.accent:T.border, color:tab===t.k?"#fff":T.ink3, borderRadius:99, fontSize:10, fontWeight:800, padding:"1px 6px", lineHeight:1.4 }}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      {EMPTY ? (
        <div className="card" style={{ padding:"60px 24px", textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:14 }}>🔔</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:8 }}>All caught up</div>
          <div style={{ color:T.ink3, fontSize:13.5, lineHeight:1.7 }}>New messages, unlocks, and activity will appear here.</div>
        </div>
      ) : groups.map(g=>(
        <div key={g.label} style={{ marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, textTransform:"uppercase", letterSpacing:".7px", marginBottom:10, paddingLeft:4 }}>{g.label}</div>
          <div className="card" style={{ overflow:"hidden", padding:0 }}>
            {g.items.map((n,i)=>(
              <div key={n.id} style={{ display:"flex", gap:12, padding:"14px 16px", borderBottom:i<g.items.length-1?`1px solid ${T.border}`:"none", background:n.read?"transparent":"rgba(26,86,219,.03)", transition:"background .15s", cursor:"pointer", alignItems:"flex-start" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg}
                onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"rgba(26,86,219,.03)"}>
                <div style={{ width:42, height:42, borderRadius:"50%", background:iconBg[n.type]||T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, border:`1px solid ${T.border}` }}>
                  {n.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5, fontWeight:n.read?400:600, marginBottom:3 }}>{n.text}</div>
                  <div style={{ fontSize:11.5, color:T.ink4 }}>{typeof n.id === "number" && n.id > 1000000000000 ? timeAgo(n.id) : n.time}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                  {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:T.accent }} />}
                  <button onClick={e=>{ e.stopPropagation(); onDismiss(n.id); }} style={{ background:"none", border:"none", cursor:"pointer", color:T.ink4, fontSize:16, lineHeight:1, padding:2 }} title="Dismiss">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const NAV = [
  { id:"board",         label:"Board",    ico:I.home     },
  { id:"messages",      label:"Messages", ico:I.msg      },
  { id:"notifications", label:"Alerts",   ico:I.bell     },
  { id:"dashboard",     label:"Saved",    ico:I.bookmark },
  { id:"profile",       label:"Profile",  ico:I.user     },
];

export default function App() {
  // ── Auth ──────────────────────────────────────────────────
  const [session,        setSession]        = useState(null);
  const [profile,        setProfile]        = useState(null);
  const [authLoading,    setAuthLoading]     = useState(true);
  const currentUser = session?.user || null;
  const isGuest     = !currentUser;
  const isPaid      = profile?.is_paid   || false;
  const credits     = profile?.credits   ?? 1;

  // ── UI ────────────────────────────────────────────────────
  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [authModalMode,    setAuthModalMode]    = useState("login");
  const [showGuestPrompt,  setShowGuestPrompt]  = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState("");
  const [page,             setPage]             = useState("board");
  const [showPrice,        setShowPrice]        = useState(false);
  const [showPost,         setShowPost]         = useState(false);
  const [activePost,       setPost]             = useState(null);
  const [toast,            setToast]            = useState(null);
  const [dark,             setDark]             = useState(() => localStorage.getItem("hired_dark") === "1");
  const [boardSearch,      setBoardSearch]       = useState("");
  const [showNotifs,       setShowNotifs]        = useState(false);
  const [composePost,      setComposePost]       = useState(null);
  const [editingPost,      setEditingPost]       = useState(null);
  const [proposalTarget,   setProposalTarget]    = useState(null);
  const [boostTarget,      setBoostTarget]       = useState(null);
  const [showWelcome,      setShowWelcome]       = useState(false);
  const [showAdminLogin,   setShowAdminLogin]    = useState(false);
  const [adminAuthed,      setAdminAuthed]       = useState(false);
  const [showAdmin,        setShowAdmin]         = useState(false);
  const [scrollY,          setScrollY]           = useState(0);
  const adminKeyRef  = useRef("");
  const toastRef     = useRef(null);
  const scrollPosRef = useRef(0);
  const showOnboarding = false;

  // ── Data ──────────────────────────────────────────────────
  const [allPosts,       setAllPosts]       = useState([]);
  const [postsLoading,   setPostsLoading]   = useState(true);
  const [userPosts,      setUserPosts]      = useState([]);
  const [savedIds,       setSavedIds]       = useState([]);
  const [savedPosts,     setSavedPosts]     = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(() => { try { return JSON.parse(localStorage.getItem("hired_recently_viewed")||"[]"); } catch { return []; } });
  const [notifs,         setNotifs]         = useState([]);
  const [unlockedIds,    setUnlockedIds]    = useState([]);
  const [proposals,      setProposals]      = useState([]);
  const [convos,         setConvos]         = useState([]);
  const [messages,       setMessages]       = useState({});
  const [activeConvo,    setActiveConvo]    = useState(null);
  const [searchHistory,  setSearchHistory]  = useState(() => { try { return JSON.parse(localStorage.getItem("hired_search_history")||"[]"); } catch { return []; } });
  const [savedSearches,  setSavedSearches]  = useState(() => { try { return JSON.parse(localStorage.getItem("hired_saved_searches")||"[]"); } catch { return []; } });
  const [auditLog,       setAuditLog]       = useState([]);

  const liveNotifs       = notifs;
  const NOTIFS           = notifs;
  const unreadNotifCount = notifs.filter(n => !n.is_read).length;
  const totalUnread      = unreadNotifCount;
  const addNotif         = () => {};
  const addAudit         = () => {};

  const requireAuth = (reason, fn) => {
    if (!currentUser) { setAuthPromptReason(reason||""); setShowGuestPrompt(true); return; }
    fn && fn();
  };

  // ── Toast ─────────────────────────────────────────────────
  const fire = useCallback((msg, dur=3200) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), dur);
  }, []);

  // ── 1. Auth listener ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s); setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) {
        setProfile(null); setUserPosts([]); setSavedIds([]); setSavedPosts([]);
        setNotifs([]); setUnlockedIds([]); setProposals([]); setConvos([]); setMessages({});
        setRecentlyViewed([]); localStorage.removeItem("hired_recently_viewed");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── 2. Load user data on login ────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      getProfile(currentUser.id),
      getUserPosts(currentUser.id),
      getSavedPostIds(currentUser.id),
      getSavedPosts(currentUser.id),
      getNotifications(currentUser.id),
      getUnlockedPostIds(currentUser.id),
      getSentProposals(currentUser.id),
      getConversations(currentUser.id),
    ]).then(([prof, uPosts, sIds, sPosts, nots, unlocked, props, cvs]) => {
      setProfile(prof); setUserPosts(uPosts); setSavedIds(sIds); setSavedPosts(sPosts);
      setNotifs(nots); setUnlockedIds(unlocked); setProposals(props); setConvos(cvs);
      if (!localStorage.getItem("hired_welcomed")) setShowWelcome(true);
    }).catch(e => console.error("loadUserData:", e));
  }, [currentUser?.id]);

  // ── 3. Load posts (with debounced search) ─────────────────
  useEffect(() => {
    setPostsLoading(true);
    const t = setTimeout(() => {
      getPosts({ search: boardSearch, pageSize: 30 })
        .then(({ posts }) => { setAllPosts(posts); setPostsLoading(false); })
        .catch(() => setPostsLoading(false));
    }, boardSearch ? 350 : 0);
    return () => clearTimeout(t);
  }, [boardSearch]);

  // ── 4. Realtime ───────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.id;
    const notifSub = subscribeToNotifications(uid, (n) => {
      setNotifs(prev => [n, ...prev].slice(0, 50));
      fire(`🔔 ${n.title}`);
    });
    const convoSub = subscribeToConversations(uid, () => {
      getConversations(uid).then(setConvos);
    });
    return () => { supabase.removeChannel(notifSub); supabase.removeChannel(convoSub); };
  }, [currentUser?.id]);

  useEffect(() => {
    if (!activeConvo) return;
    const sub = subscribeToMessages(activeConvo.id, (msg) => {
      setMessages(prev => ({ ...prev, [activeConvo.id]: [...(prev[activeConvo.id]||[]), msg] }));
    });
    return () => supabase.removeChannel(sub);
  }, [activeConvo?.id]);

  // ── 5. Effects ────────────────────────────────────────────
  useEffect(() => { const f = () => setScrollY(window.scrollY); window.addEventListener("scroll", f, { passive:true }); return () => window.removeEventListener("scroll", f); }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key !== "Escape") return;
      if (activePost) { closePost(); return; }
      if (showPrice)  { setShowPrice(false); return; }
      if (showPost)   { setShowPost(false); setEditingPost(null); return; }
      if (proposalTarget) { setProposalTarget(null); return; }
      if (showNotifs) { setShowNotifs(false); return; }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activePost, showPrice, showPost, proposalTarget, showNotifs]);

  useEffect(() => {
    const SECRET = "admin";
    const onKey = (e) => {
      if (["INPUT","TEXTAREA"].includes(e.target.tagName)) return;
      adminKeyRef.current = (adminKeyRef.current + e.key).slice(-SECRET.length);
      if (adminKeyRef.current === SECRET) { adminKeyRef.current = ""; if (adminAuthed) setShowAdmin(true); else setShowAdminLogin(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adminAuthed]);

  useEffect(() => {
    const titles = { board:"Board — Hired", messages:"Messages — Hired", notifications:"Alerts — Hired", dashboard:"Dashboard — Hired", profile:"Profile — Hired", settings:"Settings — Hired" };
    document.title = titles[page] || "Hired — Find Work, Find Talent";
  }, [page]);

  useEffect(() => {
    const r = document.documentElement;
    if (dark) { r.setAttribute("data-dark","1"); localStorage.setItem("hired_dark","1"); }
    else { r.removeAttribute("data-dark"); localStorage.setItem("hired_dark","0"); }
    return () => r.removeAttribute("data-dark");
  }, [dark]);

  useEffect(() => {
    if (activePost) { window.history.replaceState(null,"",`#post-${activePost.id}`); }
    else if (window.location.hash.startsWith("#post-")) { window.history.replaceState(null,"","#"); }
  }, [activePost]);

  // ── AUTH HANDLERS ─────────────────────────────────────────
  const handleLogin = async (email, password) => {
    try {
      const data = await signIn(email, password);
      setSession(data.session);
      setShowAuthModal(false);
      fire("👋 Welcome back!");
    } catch (e) { fire("❌ " + (e.message || "Login failed")); }
  };

  const handleSignUp = async (email, password, name) => {
    try {
      await signUp(email, password, name);
      fire("📧 Check your email to confirm your account!");
      setShowAuthModal(false);
    } catch (e) { fire("❌ " + (e.message || "Sign up failed")); }
  };

  const handleLogout = async () => {
    await signOut();
    setPage("board");
    fire("👋 Signed out");
  };

  // ── SAVE ──────────────────────────────────────────────────
  const handleSave = async (postId) => {
    if (!currentUser) { requireAuth("save posts"); return; }
    const was = savedIds.includes(postId);
    setSavedIds(prev => was ? prev.filter(x=>x!==postId) : [...prev, postId]);
    try {
      if (was) { await unsavePost(currentUser.id, postId); setSavedPosts(prev => prev.filter(p=>p.id!==postId)); }
      else { await savePost(currentUser.id, postId); fire("❤️ Saved!"); const p = allPosts.find(x=>x.id===postId)||activePost; if(p) setSavedPosts(prev=>[p,...prev]); }
    } catch { setSavedIds(prev => was ? [...prev,postId] : prev.filter(x=>x!==postId)); fire("Something went wrong"); }
  };

  // ── POSTS ─────────────────────────────────────────────────
  const openPost     = (post) => { scrollPosRef.current = window.scrollY; setPost(post); setRecentlyViewed(prev => { const n=[post,...prev.filter(p=>p.id!==post.id)].slice(0,10); localStorage.setItem("hired_recently_viewed",JSON.stringify(n)); return n; }); };
  const closePost    = () => { setPost(null); setTimeout(()=>window.scrollTo({top:scrollPosRef.current,behavior:"instant"}),50); };
  const handleTagFilter = (tag) => { setBoardSearch(tag); setPost(null); setPage("board"); };
  const openPostNew  = () => requireAuth("post a job or service", () => { setEditingPost(null); setShowPost(true); });

  const handlePostSuccess = async (formData) => {
    if (!currentUser) return;
    try {
      const post = await createPost(currentUser.id, {
        title: formData.title, summary: (formData.desc||"").slice(0,160),
        full_desc: formData.desc||"", category: formData.category||"Technology",
        type: formData.type||"need", work_type: formData.workType||"Remote",
        country: formData.country||"Global",
        budget: `${(formData.currency||"USD $").split(" ")[1]||"$"}${formData.amount}`,
        budget_type: formData.per||"Fixed", budget_num: Number(formData.amount)||0,
        tags: formData.tags ? formData.tags.split(",").map(t=>t.trim()).filter(Boolean) : [],
        cover: "linear-gradient(135deg,#1A56DB,#3B82F6)",
        expires_at: new Date(Date.now()+30*24*60*60*1000).toISOString(),
      });
      setUserPosts(prev => [post,...prev]);
      setAllPosts(prev => [post,...prev]);
      setShowPost(false);
      fire("🚀 Your post is live on Hired!");
    } catch (e) { fire("Failed: " + e.message); }
  };

  const handleEditPost       = (post) => { setEditingPost(post); setShowPost(true); };
  const handleDeleteUserPost = async (id) => { try { await deletePost(id); setUserPosts(prev=>prev.filter(p=>p.id!==id)); setAllPosts(prev=>prev.filter(p=>p.id!==id)); fire("🗑️ Post deleted"); } catch { fire("Delete failed"); } };
  const handleRenewPost      = async (id) => { try { const r=await renewPost(id); setUserPosts(prev=>prev.map(p=>p.id===id?r:p)); fire("🔄 Renewed for 30 days!"); } catch { fire("Renewal failed"); } };
  const handleBoostPost      = (post) => { setPost(null); setBoostTarget(post); setShowPrice(true); };

  // ── UNLOCK ────────────────────────────────────────────────
  const handleUnlock = async (postId) => {
    if (!currentUser) { requireAuth("unlock contacts"); return; }
    try {
      await unlockPost(currentUser.id, postId);
      setUnlockedIds(prev => [...prev, postId]);
      const updated = await getProfile(currentUser.id);
      setProfile(updated);
      fire("🔓 Contact unlocked!");
    } catch (e) { if (e.message==="No credits remaining") setShowPrice(true); else fire("Something went wrong"); }
  };

  const handleUpgradeSuccess = async () => {
    // PayNow webhook will set is_paid=true in DB; for now optimistically set locally
    if (currentUser) { const p = await getProfile(currentUser.id); setProfile(p); }
    setShowPrice(false);
    fire("🎉 Upgrade successful! Unlimited unlocks activated.");
  };

  // ── MESSAGES ─────────────────────────────────────────────
  const handleOpenCompose = async (post) => {
    if (!currentUser) { requireAuth("send messages"); return; }
    try {
      const authorId = post.user_id || post.author?.id;
      if (!authorId || authorId === currentUser.id) return;
      const convo = await getOrCreateConversation(currentUser.id, authorId, post.id);
      const msgs  = await getMessages(convo.id);
      setMessages(prev => ({ ...prev, [convo.id]: msgs }));
      setActiveConvo(convo); setComposePost(post); setPage("messages");
    } catch { fire("Couldn't open conversation"); }
  };

  const handleSendMessage = async (convoId, body) => {
    if (!currentUser || !body.trim()) return;
    try {
      const msg = await sendMessage(convoId, currentUser.id, body);
      setMessages(prev => ({ ...prev, [convoId]: [...(prev[convoId]||[]), msg] }));
      getConversations(currentUser.id).then(setConvos);
    } catch { fire("Failed to send"); }
  };

  const handleSelectConvo = async (convo) => {
    setActiveConvo(convo);
    if (!messages[convo.id]) { const msgs = await getMessages(convo.id); setMessages(prev=>({...prev,[convo.id]:msgs})); }
    await markMessagesRead(convo.id, currentUser.id);
    getConversations(currentUser.id).then(setConvos);
  };

  // ── PROPOSALS ────────────────────────────────────────────
  const handleSendProposal = async (postId, postTitle, pitch) => {
    if (!currentUser) { requireAuth("send proposals"); return; }
    try {
      const authorId = allPosts.find(p=>p.id===postId)?.user_id || activePost?.user_id;
      await submitProposal(postId, currentUser.id, authorId, pitch);
      const updated = await getSentProposals(currentUser.id);
      setProposals(updated);
      fire("📝 Proposal sent!");
    } catch (e) { if (e.code==="23505") fire("Already applied"); else fire("Failed to send proposal"); }
  };

  // ── NOTIFICATIONS ────────────────────────────────────────
  const markNotifsRead = async () => {
    if (!currentUser) return;
    await markAllNotifsRead(currentUser.id);
    setNotifs(prev => prev.map(n=>({...n,is_read:true})));
  };
  const dismissNotif = (id) => setNotifs(prev=>prev.filter(n=>n.id!==id));

  // ── SEARCH HISTORY ────────────────────────────────────────
  const handleAddSearchHistory = (term) => { if(!term.trim())return; setSearchHistory(prev=>{ const n=[term,...prev.filter(t=>t!==term)].slice(0,10); localStorage.setItem("hired_search_history",JSON.stringify(n)); return n; }); };
  const handleSaveSearch       = (term) => { setSavedSearches(prev=>{ const n=[...new Set([term,...prev])].slice(0,10); localStorage.setItem("hired_saved_searches",JSON.stringify(n)); return n; }); fire("🔖 Search saved!"); };

  // ── REFERRAL ─────────────────────────────────────────────
  const handleReferral = () => {
    const url  = `${window.location.origin}?ref=${currentUser?.id?.slice(0,8)}`;
    const text = `Join Hired — the global work marketplace: ${url}`;
    if (navigator.share) navigator.share({ title:"Join me on Hired", text, url }).catch(()=>{});
    else navigator.clipboard?.writeText(text).then(()=>fire("🔗 Referral link copied!"));
  };

  const dismissWelcome = () => { setShowWelcome(false); localStorage.setItem("hired_welcomed","1"); };

  /* ── Session heartbeat + offline on unload ── */
  useEffect(() => {
    const bye = () => {};
    window.addEventListener("beforeunload", bye);
    return () => window.removeEventListener("beforeunload", bye);
  }, []);

  return (
    <div className="dark-page-bg" style={{ minHeight:"100vh", background:T.bg, paddingBottom:76 }} onClick={()=>setShowNotifs(false)}>
      <style>{css}</style>

      {/* ── HEADER ── */}
      <header className="topnav" style={{ position:"sticky", top:0, zIndex:100, height:60, background:"rgba(255,255,255,.97)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div onClick={()=>setPage("board")} onDoubleClick={()=>{ if(adminAuthed){setShowAdmin(true);}else{setShowAdminLogin(true);}}} className="wordmark-shine" style={{ fontFamily:"'Playfair Display',serif", fontSize:22, cursor:"pointer", fontWeight:700, letterSpacing:"-.3px", marginRight:14 }} title="">
            Hired
          </div>
          <nav style={{ display:"flex", gap:2 }} className="hide-md">
            {NAV.map(n=>(
              <button key={n.id} className={`nl${page===n.id?" on":""}`} onClick={()=>setPage(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          {isGuest ? (
            <button className="btn btn-blue btn-sm" onClick={()=>{ setAuthModalMode("login"); setShowAuthModal(true); }} style={{ fontSize:12, padding:"6px 14px" }}>Sign In</button>
          ) : !isPaid ? (
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", background:credits>0?T.greenBg:T.border, border:credits>0?`1px solid ${T.green}33`:"none", borderRadius:99, fontSize:12, fontWeight:700, color:credits>0?T.green:T.ink3, whiteSpace:"nowrap", flexShrink:0 }}>
              {credits>0 ? <div className="pulse-dot" /> : <div style={{ width:8, height:8, borderRadius:"50%", background:T.ink4, flexShrink:0 }} />}
              <span>{credits} unlock{credits!==1?"s":""} left</span>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 14px", background:"linear-gradient(135deg,#16A34A,#22C55E)", borderRadius:99, fontSize:12, fontWeight:700, color:"#fff", whiteSpace:"nowrap", flexShrink:0, boxShadow:"0 3px 10px rgba(22,163,74,.3)" }}>
              <div className="pulse-dot-fast" style={{ flexShrink:0 }} /> Unlimited
            </div>
          )}

          {/* Notification bell */}
          <div style={{ position:"relative" }} onClick={e=>e.stopPropagation()}>
            <button className="btn btn-ghost btn-icon" onClick={()=>{ setShowNotifs(v=>!v); if(!showNotifs) markNotifsRead(); }} style={{ color:T.ink3, position:"relative" }}>
              {I.bell}
              {!isGuest && unreadNotifCount > 0 && (
                <span style={{ position:"absolute", top:2, right:2, width:16, height:16, borderRadius:"50%", background:T.rose, color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {unreadNotifCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="card fade-in" style={{ position:"fixed", top:68, right:12, left:12, width:"auto", maxWidth:380, marginLeft:"auto", zIndex:300, padding:0, overflow:"hidden", boxShadow:"0 12px 40px rgba(20,18,16,.18)", maxHeight:"calc(100vh - 90px)", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>Notifications</span>
                  <button className="btn btn-ghost btn-xs" onClick={()=>{ markNotifsRead(); setShowNotifs(false); }}>Mark all read</button>
                </div>
                <div style={{ overflowY:"auto", flex:1 }}>
                  {liveNotifs.length === 0 ? (
                    <div style={{ padding:"40px 20px", textAlign:"center", color:T.ink4, fontSize:13 }}>
                      <div style={{ fontSize:32, marginBottom:10 }}>🎉</div>
                      All caught up!
                    </div>
                  ) : liveNotifs.map((n,i)=>(
                    <SwipeableNotif
                      key={n.id}
                      notif={n}
                      isLast={i === liveNotifs.length - 1}
                      onDismiss={() => dismissNotif(n.id)}
                      onTap={() => {
                        if (n.type === "message") {
                          setShowNotifs(false);
                          setPage("messages");
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="btn btn-ghost btn-icon" onClick={()=>setDark(d=>!d)} title="Toggle dark mode" style={{ color:T.ink3 }}>
            {dark ? I.sun : I.moon}
          </button>
        </div>
      </header>

      {/* ── PAGES ── */}
      <main>
        {page==="board" && (
          <div key="board" className="page-fade">
            {isGuest && (
              <div style={{ background:`linear-gradient(135deg,${T.accentL},${T.purpleBg})`, borderBottom:`1px solid ${T.accentM}`, padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                <div style={{ fontSize:13, color:T.ink2, fontWeight:500 }}>
                  👀 <strong>Browsing as guest</strong> — Sign in to post, message, or save
                </div>
                <button className="btn btn-blue btn-sm" onClick={()=>{ setAuthModalMode("signup"); setShowAuthModal(true); }}>Sign In / Sign Up</button>
              </div>
            )}
            <BoardPage
              isPaid={isPaid} onUpgrade={()=>setShowPrice(true)}
              credits={credits} setCredits={setCredits}
              onPostOpen={openPost} savedIds={savedIds} onSave={handleSave}
              onPostNew={openPostNew} fire={fire}
              defaultSearch={boardSearch} onSearchChange={setBoardSearch}
              loggedIn={!showOnboarding}
              userPosts={userPosts}
              searchHistory={searchHistory}
              onAddSearchHistory={handleAddSearchHistory}
              savedSearches={savedSearches}
              onSaveSearch={handleSaveSearch}
              onMessage={handleOpenCompose}
              onRenewPost={handleRenewPost}
              showWelcome={showWelcome}
              onDismissWelcome={dismissWelcome}
              onGoProfile={()=>setPage("profile")}
              recentlyViewed={recentlyViewed}
            />
          </div>
        )}
        {page==="messages" && (
          <div key="messages" className="page-fade">
            <MessagesPage
              fire={fire}
              messages={messages} setMessages={setMessages}
              convos={convos} setConvos={setConvos}
              addNotif={addNotif}
              composeTarget={composePost} onComposeClose={()=>setComposePost(null)}
            />
          </div>
        )}
        {page==="settings" && (
          <div key="settings" className="page-fade">
            <SettingsPage
              onLogout={handleLogout}
              isPaid={isPaid}
              onUpgrade={()=>setShowPrice(true)}
              dark={dark}
              onToggleDark={()=>setDark(d=>!d)}
              fire={fire}
            />
          </div>
        )}
        {page==="notifications" && (
          <div key="notifications" className="page-fade">
            <NotificationsPage
              notifs={liveNotifs}
              onDismiss={dismissNotif}
              onMarkAllRead={markNotifsRead}
              onNavigate={setPage}
            />
          </div>
        )}
        {page==="post" && (
          <div key="post" className="page-fade">
            <PostPage onPostNew={openPostNew} />
          </div>
        )}
        {page==="dashboard" && (
          <div key="dashboard" className="page-fade dash-page-wrap" style={{ padding:"28px 24px 0" }}>
            <DashboardPage
              isPaid={isPaid} onUpgrade={()=>setShowPrice(true)}
              credits={credits} savedIds={savedIds} onSave={handleSave}
              allPosts={[...userPosts, ...POSTS_DATA]} onPostOpen={openPost} fire={fire}
              userPosts={userPosts}
              proposals={proposals}
              onEditPost={handleEditPost}
              onDeletePost={handleDeleteUserPost}
              onReferral={handleReferral}
              onPostNew={openPostNew}
              onNavigate={setPage}
            />
          </div>
        )}
        {page==="profile" && (
          <div key="profile" className="page-fade dash-page-wrap" style={{ padding:"28px 24px 0" }}>
            <ProfilePage
              isPaid={isPaid} onUpgrade={()=>setShowPrice(true)}
              onLogout={handleLogout}
              onReferral={handleReferral}
              onSettings={()=>setPage("settings")}
              userPosts={userPosts}
              fire={fire}
            />
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background:"rgba(255,255,255,.72)", backdropFilter:"blur(28px) saturate(180%)", WebkitBackdropFilter:"blur(28px) saturate(180%)", borderTop:`1px solid rgba(232,229,222,.6)`, display:"flex", paddingBottom:"env(safe-area-inset-bottom, 0px)" }}>
        {NAV.map(n=>(
          <button key={n.id} className={`bnav-item${page===n.id?" on":""}`} onClick={()=>{
            const gated = ["messages","dashboard","profile","notifications"];
            if (isGuest && gated.includes(n.id)) { requireAuth("access this page"); return; }
            setPage(n.id); window.scrollTo({top:0,behavior:"smooth"});
            if(n.id==="notifications") markNotifsRead();
          }} style={{ position:"relative" }}>
            <div style={{ position:"relative", display:"inline-flex" }}>
              {n.ico}
              {!isGuest && n.id==="messages" && totalUnread > 0 && (
                <div style={{ position:"absolute", top:-5, right:-7, minWidth:15, height:15, borderRadius:99, background:T.rose, color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", lineHeight:1 }}>
                  {totalUnread}
                </div>
              )}
              {!isGuest && n.id==="notifications" && unreadNotifCount > 0 && (
                <div style={{ position:"absolute", top:-5, right:-7, minWidth:15, height:15, borderRadius:99, background:T.rose, color:"#fff", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", lineHeight:1 }}>
                  {unreadNotifCount}
                </div>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight:page===n.id?700:500 }}>{n.label}</span>
          </button>
        ))}
      </nav>

      {/* ── MODALS ── */}
      {/* ── GUEST PROMPT (bottom sheet) ── */}
      {showGuestPrompt && (
        <GuestPrompt
          reason={authPromptReason}
          onDismiss={()=>setShowGuestPrompt(false)}
          onSignIn={(mode)=>{ setShowGuestPrompt(false); setAuthModalMode(mode||"login"); setShowAuthModal(true); }}
        />
      )}

      {/* ── AUTH MODAL (sign in / sign up) ── */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          reason={authPromptReason}
          canDismiss={true}
          onDismiss={()=>setShowAuthModal(false)}
          onAuth={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            setShowGuestPrompt(false);
            localStorage.setItem("hired_profile_name", user.name);
            localStorage.setItem("hired_email", user.email);
            if (user.country) localStorage.setItem("hired_profile_country", user.country);
          }}
        />
      )}
      {activePost && (
        <PostDetail
          post={activePost} onClose={closePost}
          credits={credits} setCredits={setCredits}
          isPaid={isPaid} onUpgrade={()=>{setPost(null);setShowPrice(true);}}
          saved={savedIds.includes(activePost.id)} onSave={(id)=>requireAuth("save posts", ()=>handleSave(id))}
          fire={fire}
          onTagFilter={handleTagFilter}
          onMessage={handleOpenCompose}
          onPropose={(post)=>requireAuth("send a proposal", ()=>{ setProposalTarget(post); setPost(null); })}
          onBoost={handleBoostPost}
          isOwn={userPosts.some(p=>p.id===activePost.id)}
          allPosts={[...userPosts, ...POSTS_DATA]}
          isGuest={isGuest}
          onRequireAuth={(reason)=>requireAuth(reason)}
        />
      )}
      {proposalTarget && (
        <ProposalModal
          post={proposalTarget}
          onClose={()=>setProposalTarget(null)}
          onSubmit={handleSendProposal}
          fire={fire}
        />
      )}
      {showPrice && <PaymentModal onClose={()=>setShowPrice(false)} onSuccess={handleUpgradeSuccess} />}
      {showPost  && <PostModal onClose={()=>{ setShowPost(false); setEditingPost(null); }} onSuccess={handlePostSuccess} editPost={editingPost} />}

      {/* ── ADMIN ── */}
      {showAdminLogin && (
        <AdminLoginModal
          onAuth={()=>{ setAdminAuthed(true); setShowAdminLogin(false); setShowAdmin(true); fire("🔐 Admin access granted"); }}
          onClose={()=>setShowAdminLogin(false)}
        />
      )}
      {showAdmin && adminAuthed && (
        <AdminPanel onClose={()=>setShowAdmin(false)} fire={fire} auditLog={auditLog} addAudit={addAudit} userPosts={userPosts} onUpdateUserPosts={(next)=>{ setUserPosts(next); localStorage.setItem("hired_user_posts",JSON.stringify(next)); }} />
      )}

      {/* ── FAB ── */}
      {!activePost && !showPost && !showPrice && !showOnboarding && (page==="board" || page==="dashboard") && (
        <button
          onClick={openPostNew}
          className="fab-anim"
          style={{
            position:"fixed", bottom:"calc(72px + env(safe-area-inset-bottom, 0px))", right:20, zIndex:110,
            height:52, borderRadius:99,
            background:"linear-gradient(135deg,#1A56DB,#3B82F6)",
            color:"#fff", border:"none", cursor:"pointer",
            boxShadow:"0 6px 24px rgba(26,86,219,.5)",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            fontSize:22, fontWeight:300, padding:"0 22px",
            transition:"transform .15s, box-shadow .15s, padding .2s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.boxShadow="0 10px 32px rgba(59,130,246,.6)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 6px 24px rgba(26,86,219,.5)"; }}
          title="Post on Hired"
        >
          <span style={{ fontSize:20, lineHeight:1 }}>+</span>
          <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:700, fontSize:13, letterSpacing:".2px" }}>Post</span>
        </button>
      )}

      {/* ── BACK TO TOP ── */}
      {scrollY > 600 && !activePost && (
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{ position:"fixed", bottom:"calc(134px + env(safe-area-inset-bottom, 0px))", right:20, zIndex:109, width:40, height:40, borderRadius:"50%", background:T.white, border:`1px solid ${T.border}`, boxShadow:"0 4px 14px rgba(20,18,16,.14)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:T.ink3, fontSize:16, transition:"all .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background=T.accentL; e.currentTarget.style.color=T.accent; e.currentTarget.style.borderColor=T.accentM; }}
          onMouseLeave={e=>{ e.currentTarget.style.background=T.white; e.currentTarget.style.color=T.ink3; e.currentTarget.style.borderColor=T.border; }}
          title="Back to top"
        >↑</button>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="toast" onClick={()=>setToast(null)} style={{ background:"rgba(20,18,16,.92)", backdropFilter:"blur(16px)", border:"1px solid rgba(255,255,255,.08)", cursor:"pointer", userSelect:"none" }}>
          {toast}
          <span style={{ marginLeft:6, opacity:.5, fontSize:15, fontWeight:300 }}>×</span>
        </div>
      )}

      {/* ── LIVE ACTIVITY ── */}
      {!activePost && !showOnboarding && <LiveActivityFeed />}
    </div>
  );
}
