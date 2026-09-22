window.Inventory = (() => {
  let items=[];
  async function page(){
    const {data,error}=await supabaseClient.from("inventory_items").select("*").eq("user_id",App.state.user.id).order("created_at",{ascending:false});
    if(error)throw error; items=data||[];
    return `<div class="page-intro"><span class="eyebrow">COLLECTION</span><h1>Inventory</h1><p>Your usernames, badges and VIP collectibles.</p></div>
      ${items.length?`<div class="inventory-grid">${items.map(i=>`<article class="inventory-card"><div class="item-art ${String(i.rarity||"common").toLowerCase()}">${i.item_type==="username"?"@":"✦"}</div><div><span class="rarity ${String(i.rarity||"common").toLowerCase()}">${escapeHTML(i.rarity||"Common")}</span><h3>${escapeHTML(i.item_name)}</h3><p>${Number(i.value||0).toLocaleString()} VLX value</p></div><div class="card-actions"><button class="secondary list-item" data-id="${i.id}">List</button><button class="icon-btn trade-item" data-id="${i.id}" title="Trade">⇄</button></div></article>`).join("")}</div>`:empty("Your collection is empty","Open a case or acquire a listed item to start collecting.")}`;
  }
  function bind(){document.querySelectorAll(".list-item").forEach(b=>b.onclick=()=>listItem(b));document.querySelectorAll(".trade-item").forEach(b=>b.onclick=()=>App.navigate("trade"));}
  async function listItem(btn){
    const item=items.find(x=>String(x.id)===String(btn.dataset.id)); if(!item)return;
    UI.modal(`<div class="modal-card"><button class="modal-close" data-close>×</button><span class="eyebrow">LIST ITEM</span><h2>${escapeHTML(item.item_name)}</h2><label>Virtual price<input id="listingPrice" type="number" min="1" value="${item.value||1000}"></label><button id="confirmList" class="primary wide">Create listing</button></div>`);
    document.getElementById("confirmList").onclick=async()=>{const price=Number(document.getElementById("listingPrice").value);await UI.busy(document.getElementById("confirmList"),async()=>{const {error}=await supabaseClient.from("username_listings").insert({seller_id:App.state.user.id,username:item.item_name,price,rarity:item.rarity,status:"active"});if(error)throw error;document.getElementById("modalRoot").innerHTML="";UI.toast("Item listed.","success");await App.render();});};
  }
  return {page,bind};
})();
