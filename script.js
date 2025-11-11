
// Sample data for athletes
const fighters = [
  { id: 'f1', name: 'Lucas "Thunder" Silva', weight: '72 kg', age: 24, modal: 'Boxe', wins: 12, loss: 3, likes: 1200, rank: 'Ouro II', bets: 0 },
  { id: 'f2', name: 'Rafael "Pitbull" Costa', weight: '80 kg', age: 28, modal: 'Jiu Jitsu', wins: 8, loss: 5, likes: 700, rank: 'Prata I', bets: 0 },
  { id: 'f3', name: 'Felipe "Cobra" Mendes', weight: '68 kg', age: 22, modal: 'Muay Thai', wins: 5, loss: 2, likes: 320, rank: 'Bronze III', bets: 0 }
];

// user state (simulated)
let userCoins = 0;
const COIN_RATE = 10; // 1 BRL = 10 FightCoins

function formatNumber(n){
  if(n >= 1000) return (n/1000).toFixed(1) + 'k';
  return n.toString();
}

// render fighters
function renderFighters(){
  const container = document.getElementById('fighters-container');
  container.innerHTML = '';
  fighters.forEach(f => {
    const card = document.createElement('article');
    card.className = 'fighter-card ' + tierClass(f.rank);
    card.innerHTML = `
      <img class="fighter-photo" src="${f.image || defaultImage()}" alt="${f.name}" />
      <div class="fighter-body">
        <h3 class="fighter-name">${f.name}</h3>
        <div class="fighter-details">🏋️ ${f.weight} | ${f.age} anos | ${f.modal}</div>
        <div class="fighter-rank">🏆 Nível: <span>${f.rank}</span></div>
      </div>
      <div class="fighter-stats">
        <div class="stat">${f.wins} <small>V</small></div>
        <div class="stat">${f.loss} <small>D</small></div>
        <div class="stat">${formatNumber(f.likes)} <small>Likes</small></div>
      </div>
      <div class="card-actions">
        <button class="match-btn" data-id="${f.id}">Dar Match ⚡</button>
        <button class="bet-btn" data-id="${f.id}">Apostar 50 FC</button>
      </div>
    `;
    container.appendChild(card);
  });
  attachListeners();
}

function tierClass(rank){
  const r = rank.toLowerCase();
  if(r.includes('bronze')) return 'tier-bronze';
  if(r.includes('prata')) return 'tier-prata';
  if(r.includes('ouro')) return 'tier-ouro';
  if(r.includes('platina')) return 'tier-platina';
  if(r.includes('diamante')) return 'tier-diamante';
  return '';
}

function defaultImage(){
  // Unsplash images used as remote placeholders (no need to upload)
  const imgs = [
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1000&q=60',
    'https://images.unsplash.com/photo-1618236614093-cc80b77a1a1a?auto=format&fit=crop&w=1000&q=60',
    'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=1000&q=60'
  ];
  return imgs[Math.floor(Math.random()*imgs.length)];
}

function attachListeners(){
  document.querySelectorAll('.match-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.id;
      const f = fighters.find(x=>x.id===id);
      f.likes += 1;
      // simple rank progression (demo)
      if(f.likes >= 2000) f.rank = 'Diamante I';
      else if(f.likes >= 1000) f.rank = 'Ouro I';
      renderFighters();
      flashButton(btn,'🔥 Match Feito!',2000);
    };
  });

  document.querySelectorAll('.bet-btn').forEach(btn=>{
    btn.onclick = ()=>{
      const id = btn.dataset.id;
      placeBet(id,50); // fixed bet of 50 FightCoins for demo
    };
  });
}

// deposit modal logic
const depositModal = document.getElementById('deposit-modal');
const depositBtn = document.getElementById('deposit-btn');
const cancelDeposit = document.getElementById('cancel-deposit');
const confirmDeposit = document.getElementById('confirm-deposit');
const depositAmount = document.getElementById('deposit-amount');
const userCoinsEl = document.getElementById('user-coins');

depositBtn.onclick = ()=>{ depositModal.classList.remove('hidden'); depositModal.setAttribute('aria-hidden','false'); depositAmount.value = ''; };
cancelDeposit.onclick = ()=>{ depositModal.classList.add('hidden'); depositModal.setAttribute('aria-hidden','true'); };
confirmDeposit.onclick = ()=>{
  const val = Number(depositAmount.value);
  if(!val || val <= 0){ alert('Informe um valor válido em R$'); return; }
  const coins = Math.floor(val * COIN_RATE);
  userCoins += coins;
  updateCoinsDisplay();
  depositModal.classList.add('hidden');
  depositModal.setAttribute('aria-hidden','true');
  alert('Depósito simulado: R$' + val + ' convertido em ' + coins + ' FightCoins');
};

function updateCoinsDisplay(){ userCoinsEl.textContent = userCoins; }

function placeBet(fighterId, amountCoins){
  if(userCoins < amountCoins){ alert('Saldo insuficiente. Deposite FightCoins antes de apostar.'); return; }
  userCoins -= amountCoins;
  const fighter = fighters.find(f=>f.id===fighterId);
  fighter.bets += amountCoins;
  // simulate effect: more bets increase likes slightly
  fighter.likes += Math.round(amountCoins/5);
  updateCoinsDisplay();
  renderFighters();
  alert('Aposta de ' + amountCoins + ' FC registrada em ' + fighter.name);
}

function flashButton(btn,text,ms){
  const orig = btn.innerHTML;
  btn.innerHTML = text;
  btn.disabled = true;
  setTimeout(()=>{ btn.innerHTML = orig; btn.disabled = false; }, ms);
}

// init
renderFighters();
updateCoinsDisplay();
