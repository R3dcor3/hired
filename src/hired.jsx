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
                <div style={{ padding
