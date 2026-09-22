window.App = (() => {
  const NAV = [
    ["home","⌂","Home"],["games","▦","Games"],["case","◇","Case"],["miner","◈","Miner"],
    ["marketplace","◫","Marketplace"],["inventory","□","Inventory"],["trade","⇄","Trade"],
    ["leaderboard","♛","Leaderboard"],["achievements","✦","Achievements"],["profile","◎","Profile"],["wallet","◉","Wallet"]
  ];
  const state = { page: "home", user: null, profile: null, wallet: null };

  function navMarkup(cls="") {
    return NAV.map(([id,icon,label]) => `<button class="nav-item ${cls}" data-page="${id}"><span>${icon}</span><b>${label}</b></button>`).join("");
  }

  async function start() {
    document.getElementById("sideNav").innerHTML = navMarkup();
    document.getElementById("bottomNav").innerHTML = NAV.slice(0,5).map(([id,icon,label]) => `<button class="nav-item" data-page="${id}"><span>${icon}</span><b>${label}</b></button>`).join("");
    document.addEventListener("click", handleClick);
    UI.initTheme();
    if (!initSupabase()) {
      document.getElementById("splash").innerHTML = `<div class="brand-mark">V</div><strong>Connect Supabase</strong><span>Edit supabase.js with your project URL and anon key.</span><code class="config-hint">No service_role key belongs in the browser.</code>`;
      return;
    }
    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        state.user = session.user;
        await loadUser();
        showApp();
      } else {
        state.user = null; state.profile = null; state.wallet = null;
        showAuth();
      }
    });
    const { data } = await supabaseClient.auth.getSession();
    if (data.session?.user) {
      state.user = data.session.user; await loadUser(); showApp();
    } else showAuth();
  }

  async function loadUser() {
    const id = state.user.id;
    const [p,w] = await Promise.all([
      supabaseClient.from("profiles").select("*").eq("id",id).maybeSingle(),
      supabaseClient.from("wallets").select("*").eq("user_id",id).maybeSingle()
    ]);
    if (p.error) throw p.error;
    state.profile = p.data;
    state.wallet = w.data || { balance: 0 };
    if (!state.profile) {
      const username = state.user.user_metadata?.username || `user_${id.slice(0,6)}`;
      const { data } = await supabaseClient.from("profiles").insert({ id, username, display_name: state.user.user_metadata?.display_name || username }).select().single();
      state.profile = data;
    }
    updateHeader();
  }

  function showAuth() {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("appView").classList.add("hidden");
    document.getElementById("bottomNav").classList.add("hidden");
    document.getElementById("authView").classList.remove("hidden");
    Auth.render("login");
  }
  function showApp() {
    document.getElementById("splash").classList.add("hidden");
    document.getElementById("authView").classList.add("hidden");
    document.getElementById("appView").classList.remove("hidden");
    document.getElementById("bottomNav").classList.remove("hidden");
    render();
  }
  function updateHeader() {
    document.getElementById("headerBalance").textContent = Number(state.wallet?.balance || 0).toLocaleString();
    const letter = (state.profile?.display_name || state.profile?.username || "V")[0].toUpperCase();
    document.getElementById("headerAvatar").textContent = state.profile?.is_vip ? "♛" : letter;
  }

  function handleClick(e) {
    const page = e.target.closest("[data-page]")?.dataset.page;
    if (page) return navigate(page);
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "theme") toggleTheme();
    if (action === "menu") document.querySelector(".sidebar")?.classList.toggle("open");
    if (action === "notifications") showNotifications();
  }

  function navigate(page) {
    state.page = page;
    document.querySelectorAll("[data-page]").forEach(x => x.classList.toggle("active", x.dataset.page === page));
    document.querySelector(".sidebar")?.classList.remove("open");
    render();
  }

  async function render() {
    const title = NAV.find(x => x[0] === state.page)?.[2] || "Home";
    document.getElementById("pageTitle").textContent = title;
    const c = document.getElementById("content");
    c.innerHTML = `<div class="skeleton-page"><div class="sk wide"></div><div class="sk card"></div><div class="sk card"></div></div>`;
    try {
      let html = "";
      if (state.page === "home") html = await HomePage();
      else if (state.page === "games") html = GamesPage.hub();
      else if (state.page === "case") html = GamesPage.case();
      else if (state.page === "miner") html = GamesPage.miner();
      else if (state.page === "marketplace") html = await Marketplace.page();
      else if (state.page === "inventory") html = await Inventory.page();
      else if (state.page === "trade") html = await Trade.page();
      else if (state.page === "leaderboard") html = await leaderboardPage();
      else if (state.page === "achievements") html = await achievementsPage();
      else if (state.page === "profile") html = await Profile.page();
      else if (state.page === "wallet") html = await walletPage();
      c.innerHTML = html;
      bindPage();
    } catch (err) {
      console.error(err);
      c.innerHTML = `<div class="error-state"><b>Something went wrong</b><p>${escapeHTML(err.message || "Unable to load this page.")}</p><button class="primary" data-action="retry">Retry</button></div>`;
      document.querySelector('[data-action="retry"]')?.addEventListener("click", render);
    }
  }

  function bindPage() {
    GamesPage.bind?.();
    Marketplace.bind?.();
    Inventory.bind?.();
    Trade.bind?.();
    Profile.bind?.();
    bindGlobalForms();
  }

  function bindGlobalForms() {
    document.querySelectorAll("[data-action='daily']").forEach(b => b.onclick = claimDaily);
    document.querySelectorAll("[data-action='promo']").forEach(b => b.onclick = redeemPromo);
    document.querySelectorAll("[data-action='vip']").forEach(b => b.onclick = buyVip);
    document.querySelectorAll("[data-action='logout']").forEach(b => b.onclick = Auth.logout);
  }

  async function claimDaily() {
    const btn = document.querySelector("[data-action='daily']");
    await UI.busy(btn, async () => {
      const { data, error } = await supabaseClient.rpc("claim_daily_reward");
      if (error) throw error;
      UI.toast(data?.message || "Daily reward claimed: +10 VLX", "success");
      await loadUser(); await render();
    });
  }

  async function redeemPromo() {
    const code = document.getElementById("promoCode")?.value?.trim();
    if (!code) return UI.toast("Enter a promo code.", "error");
    const btn = document.querySelector("[data-action='promo']");
    await UI.busy(btn, async () => {
      const { data, error } = await supabaseClient.rpc("redeem_promo_code", { p_code: code });
      if (error) throw error;
      UI.toast(data?.message || "Promo redeemed.", "success");
      await loadUser(); await render();
    });
  }

  async function buyVip() {
    const btn = document.querySelector("[data-action='vip']");
    if (!confirm("Activate VIP for 1000 virtual VLX?")) return;
    await UI.busy(btn, async () => {
      const { data, error } = await supabaseClient.rpc("activate_vip");
      if (error) throw error;
      UI.toast(data?.message || "VIP activated.", "success");
      await loadUser(); await render();
    });
  }

  async function HomePage() {
    const p = state.profile || {}, w = state.wallet || {};
    const xp = Number(p.xp||0), level = Number(p.level||1), next = Math.max(100, level*100);
    const dailyReady = p.last_daily_claim !== new Date().toISOString().slice(0,10);
    const [activity, listings] = await Promise.all([
      supabaseClient.from("wallet_transactions").select("*").eq("user_id",state.user.id).order("created_at",{ascending:false}).limit(5),
      supabaseClient.from("username_listings").select("*").eq("status","active").order("price",{ascending:true}).limit(4)
    ]);
    return `
      <div class="hero hero-home"><div><span class="eyebrow">VELIXCOIN / DASHBOARD</span><h1>Your virtual economy, <em>your collection.</em></h1><p>Play, collect and trade fictional VLX points. No deposits, withdrawals or real-money transactions.</p></div><div class="hero-orb"><span>VLX</span><b>${Number(w.balance||0).toLocaleString()}</b></div></div>
      <div class="stat-grid">
        <div class="stat-card"><span>Available VLX</span><b>${Number(w.balance||0).toLocaleString()}</b><small>Virtual points</small></div>
        <div class="stat-card"><span>Level</span><b>${level}</b><div class="progress"><i style="width:${Math.min(100,xp/next*100)}%"></i></div><small>${xp} / ${next} XP</small></div>
        <div class="stat-card"><span>Daily streak</span><b>${p.streak||0} days</b><small>Keep your streak alive</small></div>
        <div class="stat-card"><span>VIP</span><b>${p.is_vip ? "Active" : "Standard"}</b><small>${p.is_vip ? "Premium profile enabled" : "1000 VLX virtual points"}</small></div>
      </div>
      <div class="grid-2">
        <section class="panel"><div class="section-head"><div><span class="eyebrow">DAILY</span><h2>Reward</h2></div><span class="pill">${dailyReady ? "Ready" : "Claimed"}</span></div>
          <div class="reward-box"><div class="reward-icon">＋10</div><div><b>Daily VLX</b><p>One virtual reward every calendar day.</p></div><button class="primary" data-action="daily" ${dailyReady?"":"disabled"}>${dailyReady?"Claim reward":"Claimed today"}</button></div>
          <div class="promo-row"><input id="promoCode" placeholder="Promo code"><button class="secondary" data-action="promo">Redeem</button></div>
          <small id="dailyCountdown" class="muted">${dailyReady ? "Reward is ready now." : "Next reward resets at the next UTC day."}</small><br><small class="muted">Available demo codes: jorka10, jorkatop.</small>
        </section>
        <section class="panel"><div class="section-head"><div><span class="eyebrow">QUICK ACCESS</span><h2>Play & collect</h2></div></div>
          <div class="quick-grid"><button data-page="case"><span>◇</span><b>Velix Case</b><small>100 VLX</small></button><button data-page="miner"><span>◈</span><b>Virtual Miner</b><small>25 cells</small></button><button data-page="marketplace"><span>◫</span><b>Marketplace</b><small>Username collection</small></button><button data-page="inventory"><span>□</span><b>Inventory</b><small>Your items</small></button></div>
        </section>
      </div>
      <div class="grid-2">
        <section class="panel"><div class="section-head"><div><span class="eyebrow">ACTIVITY</span><h2>Recent transactions</h2></div><button class="link-btn" data-page="wallet">View all</button></div>
          ${(activity.data||[]).length ? `<div class="activity-list">${activity.data.map(t=>`<div class="activity"><span class="activity-dot"></span><div><b>${escapeHTML(t.description||t.type)}</b><small>${new Date(t.created_at).toLocaleString()}</small></div><strong class="${Number(t.amount)>=0?"positive":"negative"}">${Number(t.amount)>=0?"+":""}${Number(t.amount).toLocaleString()} VLX</strong></div>`).join("")}</div>` : empty("No activity yet","Your virtual transactions will appear here.")}
        </section>
        <section class="panel"><div class="section-head"><div><span class="eyebrow">FEATURED</span><h2>Marketplace</h2></div><button class="link-btn" data-page="marketplace">Browse</button></div>
          ${(listings.data||[]).length ? `<div class="mini-list">${listings.data.map(x=>`<div class="mini-item"><div class="username-tile">${escapeHTML(x.username)}</div><div><b>${escapeHTML(x.rarity)}</b><small>${Number(x.price).toLocaleString()} VLX</small></div></div>`).join("")}</div>` : empty("Marketplace is ready","Create listings from your inventory.")}
        </section>
      </div>`;
  }

  async function walletPage() {
    const { data, error } = await supabaseClient.from("wallet_transactions").select("*").eq("user_id",state.user.id).order("created_at",{ascending:false}).limit(100);
    if (error) throw error;
    const totalEarned = (data||[]).filter(x=>Number(x.amount)>0).reduce((s,x)=>s+Number(x.amount),0);
    return `<div class="page-intro"><span class="eyebrow">WALLET</span><h1>VLX Wallet</h1><p>Virtual points only. This wallet has no cash value.</p></div>
      <div class="wallet-hero"><div><span>Current balance</span><strong>${Number(state.wallet.balance||0).toLocaleString()} <small>VLX</small></strong></div><div><span>Total earned</span><strong>${totalEarned.toLocaleString()} <small>VLX</small></strong></div></div>
      <section class="panel"><div class="section-head"><h2>Transaction history</h2></div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Amount</th><th>Balance after</th><th>Date</th></tr></thead><tbody>${(data||[]).map(t=>`<tr><td><b>${escapeHTML(t.type||"transaction")}</b><small>${escapeHTML(t.description||"")}</small></td><td class="${Number(t.amount)>=0?"positive":"negative"}">${Number(t.amount)>=0?"+":""}${Number(t.amount).toLocaleString()} VLX</td><td>${Number(t.balance_after).toLocaleString()}</td><td>${new Date(t.created_at).toLocaleString()}</td></tr>`).join("") || `<tr><td colspan="4">${empty("No transactions","Your wallet history will appear here.")}</td></tr>`}</tbody></table></div></section>`;
  }

  async function leaderboardPage() {
    const { data, error } = await supabaseClient.from("profiles").select("id,username,display_name,level,xp,is_vip").order("xp",{ascending:false}).limit(50);
    if (error) throw error;
    return `<div class="page-intro"><span class="eyebrow">COMMUNITY</span><h1>Leaderboard</h1><p>Progress rankings based on virtual XP.</p></div><section class="panel"><div class="leaderboard">${(data||[]).map((u,i)=>`<div class="leader-row ${u.id===state.user.id?"me":""}"><span class="rank">${String(i+1).padStart(2,"0")}</span><div class="avatar">${u.is_vip?"♛":(u.username||"V")[0].toUpperCase()}</div><div class="leader-name"><b>${escapeHTML(u.display_name||u.username)}</b><small>@${escapeHTML(u.username)}</small></div><span>Lv.${u.level||1}</span><strong>${Number(u.xp||0).toLocaleString()} XP</strong>${u.is_vip?'<span class="vip-badge">VIP</span>':""}</div>`).join("")}</div></section>`;
  }

  async function achievementsPage() {
    const p = state.profile || {};
    const { count } = await supabaseClient.from("inventory_items").select("*",{count:"exact",head:true}).eq("user_id",state.user.id);
    const achievements = [
      ["First Step","Create your VelixCoin identity",p?.created_at ? 1:0,1,"✦"],
      ["Daily Player","Claim a daily reward",p?.last_daily_claim ? 1:0,1,"◷"],
      ["7 Day Streak","Reach a 7 day streak",Math.min(7,Number(p.streak||0)),7,"◉"],
      ["Miner","Open your first virtual miner round",0,1,"◈"],
      ["Collector","Own 5 inventory items",Math.min(5,count||0),5,"□"],
      ["VIP Member","Activate VIP",p.is_vip?1:0,1,"♛"],
      ["Level 5","Reach level 5",Math.min(5,Number(p.level||1)),5,"↑"],
      ["Legend Hunter","Collect a legendary username",0,1,"◆"]
    ];
    return `<div class="page-intro"><span class="eyebrow">PROGRESSION</span><h1>Achievements</h1><p>Milestones for your virtual collection journey.</p></div><div class="achievement-grid">${achievements.map(a=>{const done=a[2]>=a[3];return `<article class="achievement ${done?"unlocked":""}"><div class="ach-icon">${a[4]}</div><div><b>${a[0]}</b><p>${a[1]}</p><div class="progress"><i style="width:${Math.min(100,a[2]/a[3]*100)}%"></i></div><small>${a[2]} / ${a[3]}</small></div><span>${done?"Unlocked":"Locked"}</span></article>`}).join("")}</div>`;
  }

  function showNotifications() {
    UI.modal(`<div class="modal-card"><button class="modal-close" data-close>×</button><span class="eyebrow">ACTIVITY</span><h2>Notifications</h2><p>Your latest wallet and collection activity is shown on the Home dashboard.</p><button class="secondary wide" data-close>Close</button></div>`);
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next; localStorage.setItem("velix_theme",next);
  }
  function initTheme() { document.documentElement.dataset.theme = localStorage.getItem("velix_theme") || "dark"; }

  return { start, navigate, render, state, loadUser, updateHeader };
})();

window.UI = {
  toast(msg,type="info") {
    const root=document.getElementById("toastRoot"), el=document.createElement("div");
    el.className=`toast ${type}`; el.textContent=msg; root.appendChild(el);
    setTimeout(()=>el.remove(),3500);
  },
  async busy(btn, fn) {
    if (!btn) return fn();
    const old=btn.innerHTML; btn.disabled=true; btn.innerHTML=`<span class="spinner"></span>`;
    try { return await fn(); } catch(e) { console.error(e); UI.toast(e.message || "Request failed.","error"); throw e; } finally { btn.disabled=false; btn.innerHTML=old; }
  },
  modal(html) {
    const r=document.getElementById("modalRoot"); r.innerHTML=`<div class="modal-backdrop">${html}</div>`;
    r.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>r.innerHTML="");
    r.firstElementChild.onclick=e=>{if(e.target===r.firstElementChild)r.innerHTML=""};
  }
};
function escapeHTML(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function empty(title,text){return `<div class="empty"><div class="empty-icon">—</div><b>${title}</b><p>${text}</p></div>`;}

document.addEventListener("DOMContentLoaded",()=>App.start());
