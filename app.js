const map=document.getElementById('map'),panel=document.getElementById('panel');
fetch('content.json').then(r=>r.json()).then(items=>items.forEach(it=>{
  const b=document.createElement('button');
  b.className='marker';b.style.left=it.x+'%';b.style.top=it.y+'%';
  b.setAttribute('aria-label',it.place_ar);
  b.addEventListener('click',()=>{
    panel.hidden=false;
    panel.innerHTML=`
      <button id="close">✕</button>
      <h2>${it.place_ar} · ${it.place_en}</h2>
      <p class="ar">${it.text_ar}</p>
      <p dir="ltr">${it.text_en}</p>
      <p dir="ltr">${it.text_fr}</p>
      <p><small>${it.source} — ${it.grade}</small></p>
      ${it.dorar?`<p><a href="${it.dorar}" target="_blank" rel="noopener">الشرح على الدرر السنية ↗</a></p>`:''}`;
    panel.querySelector('#close').onclick=()=>panel.hidden=true;
  });
  map.appendChild(b);
}));