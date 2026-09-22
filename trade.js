window.Trade = (() => {
  async function page(){
    const {data:items,error}=await supabaseClient.from("inventory_items").select("id,item_name,rarity,value").eq("user_id",App.state.user.id);
    if(error)throw error;
    const {data:trades,error:te}=await supabaseClient.from("trades").select("*").or(`seller_id.eq.${App.state.user.id},buyer_id.eq.${App.state.user.id}`).order("created_at",{ascending:false}).limit(50);
    if(te)throw te;
    return `<div class="page-intro"><span class="eyebrow">PEER TO PEER</span><h1>Trade</h1><p>Exchange collection items using fictional VLX values.</p></div>
      <div class="grid-2"><section class="panel"><div class="section-head"><h2>Create trade</h2></div><form id="tradeForm" class="stack"><label>Inventory item<select id="tradeItem">${(items||[]).map(i=>`<option value="${i.id}">${escapeHTML(i.item_name)} • ${escapeHTML(i.rarity)}</option>`).join("")}</select></label><label>Virtual VLX price<input id="tradePrice" type="number" min="1" placeholder="1000"></label><button class="primary" type="submit" ${(items||[]).length?"":"disabled"}>Create trade listing</button></form></section>
      <section class="panel"><div class="section-head"><h2>Pending trades</h2></div>${(trades||[]).length?`<div class="activity-list">${trades.map(t=>`<div class="activity"><span class="activity-dot"></span><div><b>Item #${t.item_id}</b><small>${t.status} • ${new Date(t.created_at).toLocaleString()}</small></div><strong>${Number(t.price).toLocaleString()} VLX</strong><div class="card-actions">${t.status==="pending"&&t.seller_id!==App.state.user.id?`<button class="primary accept-trade" data-id="${t.id}">Accept</button>`:""}${t.status==="pending"&&t.seller_id===App.state.user.id?`<button class="secondary cancel-trade" data-id="${t.id}">Cancel</button>`:""}</div></div>`).join("")}`:empty("No trades yet","Your created and received trades will appear here.")}</section></div>`;
  }
  function bind(){
  document.getElementById("tradeForm")?.addEventListener("submit",create);
  document.querySelectorAll(".accept-trade").forEach(b=>b.onclick=()=>act(b,"accept_trade"));
  document.querySelectorAll(".cancel-trade").forEach(b=>b.onclick=()=>act(b,"cancel_trade"));
}
async function act(btn,fn){await UI.busy(btn,async()=>{const {data,error}=await supabaseClient.rpc(fn,{p_trade_id:Number(btn.dataset.id)});if(error)throw error;UI.toast(data?.message||"Trade updated.","success");await App.loadUser();await App.render();});}
  async function create(e){e.preventDefault();const item=Number(document.getElementById("tradeItem").value),price=Number(document.getElementById("tradePrice").value);if(!item||price<1)return UI.toast("Choose an item and price.","error");await UI.busy(e.currentTarget.querySelector("button"),async()=>{const {error}=await supabaseClient.rpc("create_trade",{p_item_id:item,p_price:price});if(error)throw error;UI.toast("Trade created.","success");await App.render();});}
  return {page,bind};
})();
