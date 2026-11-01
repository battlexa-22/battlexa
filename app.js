const seed=[
{id:1,title:"Friday Night Showdown",game:"BGMI",entry:"Free",fee:0,prize:"₹1,000",date:"2026-11-06T20:00",slots:48,joined:19},
{id:2,title:"Headshot Rush",game:"Free Fire MAX",entry:"Paid",fee:20,prize:"₹800",date:"2026-11-07T19:30",slots:48,joined:32},
{id:3,title:"Squad Survival Cup",game:"BGMI",entry:"Free",fee:0,prize:"₹500",date:"2026-11-08T18:00",slots:25,joined:11}
];
let tournaments=JSON.parse(localStorage.getItem("bx_tournaments")||"null")||seed;
let profile=JSON.parse(localStorage.getItem("bx_profile")||"null");
let filter="All", selected=null;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("bx_tournaments",JSON.stringify(tournaments))}
function dateLabel(d){let x=new Date(d);return isNaN(x)?d:x.toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}
function render(){
 const list=tournaments.filter(t=>filter==="All"||(filter==="Free"?t.entry==="Free":t.game===filter));
 $("tournamentGrid").innerHTML=list.map(t=>`<article class="tour-card"><div class="game-label">${t.game.toUpperCase()} · ${t.entry.toUpperCase()}</div><h3>${esc(t.title)}</h3><div class="tour-meta"><div>STARTS<b>${dateLabel(t.date)}</b></div><div>PRIZE POOL<b>${esc(t.prize||"TBA")}</b></div><div>ENTRY FEE<b>${t.entry==="Free"?"FREE":"₹"+Number(t.fee||0)}</b></div><div>AVAILABLE SLOTS<b>${Math.max(0,t.slots-t.joined)} / ${t.slots}</b></div></div><div class="tour-foot"><span class="entry">${t.joined>=t.slots?"FULL":"REGISTRATION OPEN"}</span><button class="join" onclick="openTour(${t.id})" ${t.joined>=t.slots?"disabled":""}>View / Join →</button></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",list.length>0);
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
window.openTour=id=>{selected=tournaments.find(t=>t.id===id);if(!selected)return;$("modalTitle").textContent=selected.title;$("modalBody").innerHTML=`<p class="muted">${esc(selected.game)} · ${selected.entry==="Free"?"Free entry":"Entry ₹"+selected.fee}</p><p>Prize pool: <b>${esc(selected.prize||"TBA")}</b></p><p>Match time: <b>${dateLabel(selected.date)}</b></p><p>Slots: <b>${selected.joined}/${selected.slots} filled</b></p><p class="muted">Demo only: joining updates this device's local slot count. No payment or room credentials are processed.</p>`;$("modalAction").textContent="Join tournament";$("modal").classList.remove("hidden")};
$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target===$("modal"))$("modal").classList.add("hidden")};
$("modalAction").onclick=()=>{if(!selected)return;if(!profile){$("modal").classList.add("hidden");$("profileForm").scrollIntoView({behavior:"smooth"});$("profileStatus").textContent="Create your player profile before joining.";return}if(selected.joined>=selected.slots)return;selected.joined++;save();render();$("modalBody").innerHTML="<p class='lime'>Slot reserved in this local demo!</p><p class='muted'>This is not a real tournament registration. A production version needs shared accounts and a server.</p>";$("modalAction").textContent="Done";$("modalAction").onclick=()=>$("modal").classList.add("hidden")};
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render()});
$("refreshBtn").onclick=render;
$("profileForm").onsubmit=e=>{e.preventDefault();profile={name:$("playerName").value.trim(),game:$("favGame").value};localStorage.setItem("bx_profile",JSON.stringify(profile));$("profileStatus").textContent="Profile saved on this device. Welcome, "+profile.name+"!";};
if(profile){$("playerName").value=profile.name;$("favGame").value=profile.game;$("profileStatus").textContent="Saved profile: "+profile.name}
$("tournamentForm").onsubmit=e=>{e.preventDefault();let entry=$("tEntry").value;let t={id:Date.now(),title:$("tTitle").value.trim(),game:$("tGame").value,entry,fee:entry==="Free"?0:Number($("tFee").value||0),prize:$("tPrize").value.trim()||"TBA",date:$("tDate").value,slots:Number($("tSlots").value||48),joined:0};tournaments.unshift(t);save();render();e.target.reset();$("tSlots").value=48;alert("Tournament added to this device's demo.")};
$("howBtn").onclick=()=>$("how").scrollIntoView({behavior:"smooth"});
let deferredPrompt;$("installBtn").onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")}};
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();