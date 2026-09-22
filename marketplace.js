window.Marketplace = (() => {
  const catalog = [
    ["moneybtw",12000,"Legendary"],["uzbbtw",11000,"Legendary"],["rusbtw",15000,"Legendary"],["wzz7f",10000,"Legendary"],
    ["lt7ff",4500,"Rare"],["8uzzdd",4200,"Rare"],["2suzd",3900,"Rare"],["uzdwm",4800,"Rare"],["btwusa",4500,"Rare"],["vip7usa",4900,"Rare"],["uzdsc",4300,"Rare"],["1x1uz",4600,"Rare"],["uzd0s",3700,"Rare"],["nyc7ae",4100,"Rare"],["ae9uz",3500,"Rare"],["ct8g8",3000,"Rare"]
  ];
  let filter="all", dbListings=[];

  async function page(){
    const {data,error}=await supabaseClient.from("username_listings").select("*, profiles!username_listings_seller_id_fkey(username,display_name)").eq("status","active").order("price",{ascending:true}).limit(100);
    if(error && !String(error.message).includes("relationship")) throw error;
    dbListings=data||[];
    return `<div class="page-intro"><span class="eyebrow">MARKET</span><h1>Username Marketplace</h1><p>Collect rare virtual identities. Prices are fictional VLX points.</p></div>
      <div class="filter-bar"><button class="filter active" data-filter="all">All</button><button class="filter" data-filter="Legendary">Legendary</button><button class="filter" data-filter="Rare">Rare</button><button class="filter" data-filter="cheap">Cheapest</button><button class="filter" data-filter="expensive">Most expensive</button></div>
      <div id="marketGrid" class="market-grid">${renderItems()}</div>`;
  }
  function renderItems(){
    const items=dbListings.length?dbListings.map(x=>({id:x.id,username:x.username,price:x.price,rarity:x.rarity,seller:x.profiles?.username||"Seller"})):catalog.map((x,i)=>({id:null,username:x[0],price:x[1],rarity:x[2],seller:"Collection"}));
    let a=items.filter(x=>filter==="all"||x.rarity===filter);
    if(filter==="cheap")a.sort((x,y)=>x.price-y.price); if(filter==="expensive")a.sort((x,y)=>y.price-x.price);
    return a.map(x=>`<article class="market-card"><div class="username-tile"><span>${x.rarity}</span><b>${escapeHTML(x.username)}</b></div><div class="market-meta"><div><small>Seller</small><b>${escapeHTML(x.seller)}</b></div><div><small>Price</small><strong>${Number(x.price).toLocaleString()} VLX</strong></div></div><div class="card-actions"><button class="icon-btn favorite" title="Favorite">♡</button>${x.id?`<button class="primary buy-btn" data-id="${x.id}">Buy</button>`:`<button class="secondary" disabled>Demo catalog</button>`}</div></article>`).join("");
  }
  function bind(){
    document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.getElementById("marketGrid").innerHTML=renderItems();bindBuy();});
    bindBuy();
  }
  function bindBuy(){document.querySelectorAll(".buy-btn").forEach(b=>b.onclick=()=>buy(b));}
  async function buy(btn){
    const id=btn.dataset.id;
    if(!confirm("Buy this username for virtual VLX?"))return;
    await UI.busy(btn,async()=>{const {data,error}=await supabaseClient.rpc("purchase_username_listing",{p_listing_id:Number(id)});if(error)throw error;UI.toast(data?.message||"Purchase completed.","success");await App.loadUser();await App.render();});
  }
  return {page,bind};
})();
