window.Profile = (() => {
  async function page(){
    const p=App.state.profile||{};
    const {count:inv}=await supabaseClient.from("inventory_items").select("*",{count:"exact",head:true}).eq("user_id",App.state.user.id);
    return `<div class="profile-cover ${p.is_vip?"vip-cover":""}"><div class="profile-avatar">${p.is_vip?"♛":(p.display_name||p.username||"V")[0].toUpperCase()}</div><div><span class="eyebrow">${p.is_vip?"VIP MEMBER":"PROFILE"}</span><h1>${escapeHTML(p.display_name||p.username)}</h1><p>@${escapeHTML(p.username)}</p></div><div class="profile-actions"><button class="secondary" data-action="logout">Log out</button></div></div>
      <div class="stat-grid"><div class="stat-card"><span>Level</span><b>${p.level||1}</b></div><div class="stat-card"><span>XP</span><b>${Number(p.xp||0).toLocaleString()}</b></div><div class="stat-card"><span>Streak</span><b>${p.streak||0}</b></div><div class="stat-card"><span>Inventory</span><b>${inv||0}</b></div></div>
      <section class="panel"><div class="section-head"><div><span class="eyebrow">VIP</span><h2>${p.is_vip?"VIP is active":"Unlock VIP"}</h2></div>${p.is_vip?'<span class="vip-badge">♛ VIP</span>':`<button class="primary" data-action="vip">Activate • 1000 VLX</button>`}</div><div class="vip-benefits"><span>♛ VIP badge</span><span>◈ Premium frame</span><span>✦ Special background</span><span>◆ Visual effects</span></div></section>
      <section class="panel"><div class="section-head"><h2>Account</h2></div><div class="details"><div><small>Username</small><b>@${escapeHTML(p.username)}</b></div><div><small>Joined</small><b>${p.created_at?new Date(p.created_at).toLocaleDateString():"—"}</b></div><div><small>VIP until</small><b>${p.vip_until?new Date(p.vip_until).toLocaleDateString():"Not active"}</b></div></div></section>`;
  }
  function bind(){}
  return {page,bind};
})();
