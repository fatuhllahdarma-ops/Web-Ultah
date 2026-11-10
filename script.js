'use strict';
const $ = (selector) => document.querySelector(selector);
const gate = $('#gate');
const site = $('#site');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let letterStarted = false;
let toastTimer = null;
const letter = `Barakallah fii umrik, Mahh. 🤍\n\nMakin sehat, makin berkah umurnya, makin banyak dan berkah rezekinya. Semoga Mamah selalu bahagia dan Allah mudahkan setiap urusan Mamah.\n\nMakasii banyak yaa, Mah, karena selalu jadi Mamah yang selalu ada buat keluarga. Terima kasih buat semua kasih sayang, perjuangan, doa, dan pengorbanan Mamah yang mungkin belum bisa Aa balas satu per satu.\n\nMaaf Aa belum bisa ngasih apa-apa yang besar buat Mamah sekarang. Tapi Aa akan terus berusaha supaya suatu hari nanti Aa bisa bikin Mamah bangga dan bahagia.\n\nDoain Aa yaa, Mah, biar jadi orang yang sholeh, bertakwa, kaya raya yang dermawan, dan bermanfaat buat banyak orang. Semoga setiap keberhasilan Aa nanti juga jadi amal baik dan kebahagiaan buat Mamah.\n\nAa sayang Mamah. Semoga Allah selalu menjaga Mamah, di dunia sampai surga-Nya nanti. Aamiin. ♡`;

function toast(message){
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3500);
}

$('#openGift').addEventListener('click',()=>{
  gate.remove(); site.removeAttribute('aria-hidden');
  window.scrollTo({top:0,behavior:'instant'});
  setupReveals();confettiBurst(150);
});

function setupReveals(){
  const elements = document.querySelectorAll('.reveal');
  if(reducedMotion || !('IntersectionObserver' in window)){
    elements.forEach(el=>el.classList.add('visible'));return;
  }
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
  },{threshold:.12});
  elements.forEach(el=>observer.observe(el));
}

let candleBlown=false;
$('#blowButton').addEventListener('click',()=>{
  const cake=$('#cakeScene');const button=$('#blowButton');
  if(candleBlown){
    candleBlown=false;cake.classList.remove('blown');
    button.innerHTML='Tiup lilinnya, Mah <span aria-hidden="true">✦</span>';
    $('#cakeFeedback').textContent='Make a wish… ✨';
    cake.setAttribute('aria-label','Kue ulang tahun dengan lilin menyala');return;
  }
  candleBlown=true;cake.classList.add('blown');
  button.innerHTML='Nyalakan lilin lagi <span aria-hidden="true">↻</span>';
  $('#cakeFeedback').textContent='Aamiin! Semoga semua doa baik Mamah dikabulkan Allah. 🤍';
  cake.setAttribute('aria-label','Kue ulang tahun dengan lilin yang sudah ditiup');
  confettiBurst(190);
});

$('#photoInput').addEventListener('change',async (event)=>{
  const files=Array.from(event.target.files||[]).filter(file=>file.type.startsWith('image/')).slice(0,4);
  if(!files.length){toast('Pilih file gambar dulu ya.');return;}
  const slots=Array.from(document.querySelectorAll('.photo-card'));
  slots.forEach((slot,i)=>{
    const img=slot.querySelector('img');
    if(img.dataset.objectUrl){URL.revokeObjectURL(img.dataset.objectUrl);delete img.dataset.objectUrl;}
    if(!files[i]) return;
    const url=URL.createObjectURL(files[i]);
    img.src=url;img.dataset.objectUrl=url;img.hidden=false;
    slot.querySelector('.photo-fallback').hidden=true;
  });
  $('#galleryHint').textContent=`${files.length} foto tampil di perangkat ini. Agar foto selalu ada saat dibagikan, gunakan folder foto di paket website (lihat README).`;
  toast('Foto kenangan berhasil ditambahkan ♡');
});

// Otomatis mengisi galeri jika ada foto bernama foto-1.png ... foto-4.png di folder 'foto'.
// Kesalahan loading tidak akan menghilangkan placeholder yang sudah ada.
for(let i=1;i<=4;i++){
  const test=new Image();
  test.onload=()=>{
    const card=document.querySelector(`[data-slot="${i-1}"]`);
    const image=card.querySelector('img');
    if(image.dataset.objectUrl)return;
    image.src=`foto/foto-${i}.png`;image.hidden=false;card.querySelector('.photo-fallback').hidden=true;
  };
  test.src=`foto/foto-${i}.png`;
}

$('#openLetter').addEventListener('click',()=>{
  if(letterStarted) return;
  letterStarted=true;
  $('#openLetter').setAttribute('aria-expanded','true');
  $('#envelopeWrap').classList.add('opened');
  const paper=$('#letterPaper');paper.hidden=false;
  const target=$('#typedLetter');
  if(reducedMotion){target.textContent=letter;return;}
  let position=0;
  const typeNext=()=>{
    const increment=2;
    position=Math.min(letter.length,position+increment);
    target.textContent=letter.slice(0,position);
    if(position<letter.length){
      const current=letter[position-1];
      setTimeout(typeNext,current==='\n'?210:current==='.'?120:13);
    }
  };
  typeNext();
  setTimeout(()=>paper.scrollIntoView({behavior:'smooth',block:'nearest'}),250);
});
$('#replayConfetti').addEventListener('click',()=>{confettiBurst(220);toast('Peluk paling hangat dari Aa untuk Mamah! ♥');});

const canvas=$('#confetti');const ctx=canvas.getContext('2d');
let pieces=[];let frameRunning=false;
function resizeCanvas(){
  const ratio=Math.min(window.devicePixelRatio||1,2);
  canvas.width=window.innerWidth*ratio;canvas.height=window.innerHeight*ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
}
window.addEventListener('resize',resizeCanvas,{passive:true});resizeCanvas();
function confettiBurst(count=150){
  if(reducedMotion){toast('Selamat ulang tahun, Mamah! ♡');return;}
  const colors=['#df91ac','#f4c8d3','#ffffff','#e4b275','#b56d89','#e8a8af'];
  const originX=window.innerWidth/2,originY=window.innerHeight*.38;
  for(let i=0;i<count;i++){
    const angle=Math.random()*Math.PI*2;
    const speed=3+Math.random()*9;
    pieces.push({x:originX,y:originY,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-5,
      gravity:.11+Math.random()*.13,spin:Math.random()*6.28,spinSpeed:(Math.random()-.5)*.25,
      w:4+Math.random()*6,h:5+Math.random()*9,color:colors[Math.floor(Math.random()*colors.length)],life:0,maxLife:110+Math.random()*60});
  }
  if(!frameRunning){frameRunning=true;requestAnimationFrame(drawConfetti);}
}
function drawConfetti(){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  pieces=pieces.filter(p=>p.life<p.maxLife && p.y<window.innerHeight+30);
  for(const p of pieces){
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.995;p.spin+=p.spinSpeed;p.life++;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.spin);
    ctx.globalAlpha=Math.min(1,(p.maxLife-p.life)/25);
    ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
  }
  if(pieces.length)requestAnimationFrame(drawConfetti);
  else{frameRunning=false;ctx.clearRect(0,0,window.innerWidth,window.innerHeight);}
}
