import { db, auth } from "./firebase.js";
import { doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let selected = null;
const selectedName = document.getElementById('selectedName');
const renameInput = document.getElementById('rename');
const colorInput = document.getElementById('color');
const troopsInput = document.getElementById('troops');
const saveBtn = document.getElementById('save');
const incBtn = document.getElementById('inc');
const decBtn = document.getElementById('dec');
const statusEl = document.getElementById('status');
const troopsLayer = document.getElementById('troopsLayer');

const svg = document.getElementById('world');
const paths = Array.from(svg.querySelectorAll('path[id]'));

// Login anonimo
signInAnonymously(auth).catch(()=>{});
onAuthStateChanged(auth, u => {
  const userEl = document.getElementById('user');
  userEl.textContent = u ? `Connesso anonimo: ${u.uid}` : 'Non connesso';
});

// Selezione stato
paths.forEach(path => {
  path.addEventListener('click', async ()=>{
    selected = path;
    selectedName.textContent = path.id;
    renameInput.value = path.id;
    try {
      const snap = await getDoc(doc(db,'countries', path.id));
      if(snap.exists()){
        const data = snap.data();
        colorInput.value = data.color || '#2b8cff';
        troopsInput.value = data.troops || 0;
      } else {
        colorInput.value = '#2b8cff';
        troopsInput.value = 0;
      }
    }catch(e){}
  });
});

// Salva stato
saveBtn.addEventListener('click', async ()=>{
  if(!selected){ statusEl.textContent='Seleziona prima una regione'; return; }
  const id = selected.id;
  const data = { name: renameInput.value||id, color: colorInput.value, troops: Number(troopsInput.value)||0, updatedAt: Date.now() };
  try{
    await setDoc(doc(db,'countries',id),data,{merge:true});
    selected.style.fill = data.color;
    updateTroopBubbles({[id]:data});
    statusEl.textContent='Salvato ✔';
  }catch(e){ statusEl.textContent='Errore: '+e.message; }
});

// Incrementa / decrementa truppe
incBtn.addEventListener('click',()=>troopsInput.value = Number(troopsInput.value||0)+10);
decBtn.addEventListener('click',()=>troopsInput.value = Math.max(0,Number(troopsInput.value||0)-10));

// Aggiorna bolle truppe
function updateTroopBubbles(allData){
  troopsLayer.innerHTML='';
  for(const [id,d] of Object.entries(allData||{})){
    if(!d||!d.troops) continue;
    const p = document.getElementById(id);
    if(!p) continue;
    const bbox = p.getBBox();
    const cx = bbox.x + bbox.width*0.5;
    const cy = bbox.y + bbox.height*0.15;
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('transform',`translate(${cx},${cy})`);
    const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('r','18');
    c.setAttribute('fill','#0ea5a3');
    c.setAttribute('stroke','#042f33');
    c.setAttribute('stroke-width','3');
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('text-anchor','middle');
    t.setAttribute('dy','6');
    t.setAttribute('class','troop-bubble');
    t.textContent = d.troops;
    g.appendChild(c);
    g.appendChild(t);
    troopsLayer.appendChild(g);
  }
}
