window.GamesPage = (() => {
  let miner = { mines: 3, amount: 100, cells: [], revealed: [], multiplier: 1, active: false };
  const rewards = [
    {name:"100 VLX", value:100, rarity:"Common", type:"vlx"},
    {name:"250 VLX", value:250, rarity:"Rare", type:"vlx"},
    {name:"500 VLX", value:500, rarity:"Epic", type:"vlx"},
    {name:"Rare Username", value:0, rarity:"Rare", type:"username"},
    {name:"Epic Badge", value:0, rarity:"Epic", type:"badge"},
    {name:"Legendary Username", value:0, rarity:"Legendary", type:"username"}
  ];

  function hub(){return `<div class="page-intro"><span class="eyebrow">ARCADE</span><h1>Games</h1><p>Virtual score games built for the VelixCoin collection.</p></div><div class="game-grid"><article class="game-card" data-page="miner"><div class="game-art miner-art"><span>25</span></div><div><span class="eyebrow">VIRTUAL GAME</span><h2>Virtual Miner</h2><p>Reveal safe cells and grow your virtual multiplier.</p><button class="primary" data-page="miner">Play Miner</button></div></article><article class="game-card" data-page="case"><div class="game-art case-art"><span>VLX</span></div><div><span class="eyebrow">COLLECTION</span><h2>Velix Case</h2><p>Open a 100 VLX virtual case and reveal a random collectible.</p><button class="primary" data-page="case">Open Case</button></div></article></div>`;}

  function casePage(){return `<div class="page-intro"><span class="eyebrow">COLLECTION DROP</span><h1>Velix Case</h1><p>100 VLX virtual points per opening. No real-money value.</p></div><div class="case-layout"><section class="case-stage"><div id="caseBox" class="case-box"><div class="case-logo">V</div><span>VELIX</span><b>CASE 01</b></div><button id="openCase" class="primary xl">Open for 100 VLX</button><div id="caseResult"></div></section><section class="panel"><div class="section-head"><h2>Reward pool</h2><span class="pill">6 drops</span></div><div class="reward-pool">${rewards.map(r=>`<div class="reward-card"><span class="rarity ${r.rarity.toLowerCase()}">${r.rarity}</span><b>${r.name}</b><small>${r.value?`+${r.value} VLX`:"Collectible"}</small></div>`).join("")}</div></section></div>`;}

  function minerPage(){return `<div class="page-intro"><span class="eyebrow">VIRTUAL GAME</span><h1>Virtual Miner</h1><p>This is a fictional score game. The amount is a demo value, not a wager.</p></div><div class="miner-layout"><section class="panel miner-panel"><div class="miner-controls"><label>Mines<select id="mineCount"><option>1</option><option selected>3</option><option>5</option></select></label><label>Virtual score<input id="mineAmount" type="number" min="1" value="100"></label><button id="startMiner" class="primary">Start round</button></div><div class="miner-stats"><span>Multiplier <b id="multiplier">1.00×</b></span><span>Virtual reward <b id="minerReward">0 VLX</b></span><span id="minerStatus">Ready</span></div><div id="minerGrid" class="miner-grid"></div><button id="restartMiner" class="secondary wide">Restart</button></section></div>`;}

  function bind(){
    document.getElementById("openCase")?.addEventListener("click", openCase);
    document.getElementById("startMiner")?.addEventListener("click", startMiner);
    document.getElementById("restartMiner")?.addEventListener("click", ()=>resetMiner());
    document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>App.navigate(b.dataset.page));
    if(document.getElementById("minerGrid")) resetMiner();
  }

  async function openCase(){
    const btn=document.getElementById("openCase");
    await UI.busy(btn,async()=>{
      if(Number(App.state.wallet.balance)<100) throw new Error("You need at least 100 virtual VLX.");
      const {data,error}=await supabaseClient.rpc("open_velix_case");
      if(error) throw error;
      document.getElementById("caseBox").classList.add("opening");
      await new Promise(r=>setTimeout(r,900));
      const r=data?.reward || data;
      document.getElementById("caseResult").innerHTML=`<div class="result-card"><span class="rarity ${(r.rarity||"common").toLowerCase()}">${r.rarity||"Common"}</span><h2>${escapeHTML(r.reward_name||r.name||"Reward")}</h2><p>${r.reward_value?`+${Number(r.reward_value).toLocaleString()} VLX`:"Added to inventory"}</p></div>`;
      UI.toast("Case opened successfully.","success"); await App.loadUser();
    });
  }

  function resetMiner(){
    miner={mines:Number(document.getElementById("mineCount")?.value||3),amount:Number(document.getElementById("mineAmount")?.value||100),cells:[],revealed:[],multiplier:1,active:false};
    const grid=document.getElementById("minerGrid"); if(!grid)return;
    grid.innerHTML=Array.from({length:25},(_,i)=>`<button class="mine-cell" data-cell="${i}" aria-label="Cell ${i+1}">?</button>`).join("");
    grid.querySelectorAll(".mine-cell").forEach(c=>c.onclick=()=>reveal(Number(c.dataset.cell)));
    document.getElementById("multiplier").textContent="1.00×"; document.getElementById("minerReward").textContent="0 VLX"; document.getElementById("minerStatus").textContent="Ready";
  }

  function startMiner(){
    const count=Number(document.getElementById("mineCount").value), amount=Number(document.getElementById("mineAmount").value);
    if(amount<1)return UI.toast("Enter a positive virtual score amount.","error");
    miner={mines:count,amount,cells:[],revealed:[],multiplier:1,active:true};
    while(miner.cells.length<count){const n=Math.floor(Math.random()*25);if(!miner.cells.includes(n))miner.cells.push(n);}
    resetMinerGrid(); document.getElementById("minerStatus").textContent="Round active";
  }
  function resetMinerGrid(){document.querySelectorAll(".mine-cell").forEach(c=>{c.className="mine-cell";c.textContent="?";});document.getElementById("multiplier").textContent="1.00×";document.getElementById("minerReward").textContent="0 VLX";}
  function reveal(i){
    if(!miner.active || miner.revealed.includes(i))return;
    miner.revealed.push(i); const c=document.querySelector(`[data-cell="${i}"]`);
    if(miner.cells.includes(i)){c.classList.add("mine");c.textContent="✕";miner.active=false;document.getElementById("minerStatus").textContent="Mine found — demo round ended";document.querySelectorAll(".mine-cell").forEach((x,n)=>{if(miner.cells.includes(n)){x.classList.add("mine");x.textContent="✕"}});return;}
    c.classList.add("safe");c.textContent="✓";miner.multiplier=1+(miner.revealed.length*(miner.mines===5?.08:miner.mines===3?.12:.18));const reward=Math.round(miner.amount*miner.multiplier);
    document.getElementById("multiplier").textContent=miner.multiplier.toFixed(2)+"×";document.getElementById("minerReward").textContent=reward.toLocaleString()+" VLX";
    if(miner.revealed.length>=25-miner.mines){miner.active=false;document.getElementById("minerStatus").textContent="All safe cells revealed";}
  }
  return {hub,case:casePage,miner:minerPage,bind};
})();
