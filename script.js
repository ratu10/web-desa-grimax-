// script.js — interactivity + map fallback
document.addEventListener('DOMContentLoaded', function(){
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // agenda sample
  const sampleAgenda = [
    {date:'2025-10-12', title:'Musyawarah Dusun', place:'Balai Dusun I'},
    {date:'2025-10-20', title:'Bazar UMKM', place:'Alun-alun Desa'},
    {date:'2025-11-02', title:'Penyuluhan Kesehatan', place:'Puskesmas Pembantu'}
  ];
  if(!localStorage.getItem('agenda')) localStorage.setItem('agenda', JSON.stringify(sampleAgenda));
  loadAgenda();

  function loadAgenda(){
    const tbody = document.getElementById('agenda-table');
    if(!tbody) return;
    const data = JSON.parse(localStorage.getItem('agenda')) || [];
    tbody.innerHTML = '';
    data.forEach(a=>{
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>'+a.date+'</td><td>'+a.title+'</td><td>'+a.place+'</td>';
      tbody.appendChild(tr);
    });
  }

  // announces
  function renderAnnounces(){
    const list = document.getElementById('announceList');
    if(!list) return;
    const anns = JSON.parse(localStorage.getItem('announcements')) || [
      'Penerimaan BLT tahap 3 dimulai 15 Oktober.',
      'Vaksinasi massal gratis di Balai Desa, 18 Oktober.'
    ];
    list.innerHTML='';
    anns.forEach(a=>{
      const d=document.createElement('div'); d.className='announce'; d.textContent=a; list.appendChild(d);
    });
  }
  renderAnnounces();

  document.getElementById('addAnn')?.addEventListener('click', ()=>{
    const v = document.getElementById('new-announce').value.trim();
    if(!v) return alert('Tulis pengumuman dulu.');
    const anns = JSON.parse(localStorage.getItem('announcements')) || [];
    anns.unshift(v); localStorage.setItem('announcements', JSON.stringify(anns));
    document.getElementById('new-announce').value=''; renderAnnounces();
  });
  document.getElementById('clearAnn')?.addEventListener('click', ()=>{
    if(confirm('Kosongkan semua pengumuman lokal?')){ localStorage.removeItem('announcements'); renderAnnounces(); }
  });

  // gallery (Unsplash images)
  const galleryImgs = [
    'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=80&auto=format&fit=crop'
  ];
  const g = document.getElementById('gallery');
  if(g){
    galleryImgs.forEach(src=>{
      const img = document.createElement('img');
      img.src = src; img.alt='Foto Desa / Alam'; img.loading='lazy';
      img.addEventListener('click', ()=> openModal('Foto', '<img src="'+src+'" style="width:100%;height:auto;border-radius:8px" />'));
      g.appendChild(img);
    });
  }

  // modal
  function openModal(title, html){
    const modal = document.getElementById('modal');
    if(!modal) return;
    document.getElementById('modalContent').innerHTML = html;
    modal.setAttribute('aria-hidden','false');
  }
  document.getElementById('closeModal')?.addEventListener('click', ()=>{
    const modal = document.getElementById('modal');
    if(modal) modal.setAttribute('aria-hidden','true');
  });

  // contact form demo
  document.getElementById('sendMsg')?.addEventListener('click', function(e){
    e.preventDefault();
    const name = document.getElementById('c-name')?.value.trim();
    const msg = document.getElementById('c-message')?.value.trim();
    if(!name || !msg) return alert('Isi nama dan pesan.');
    const subject = encodeURIComponent('Pesan dari warga: '+name);
    const body = encodeURIComponent(msg + '\n\n--\nKirim lewat website Desa Gerimax Indah');
    window.location.href = 'mailto:desa@gerimaxindah.id?subject='+subject+'&body='+body;
  });

  document.getElementById('saveMsg')?.addEventListener('click', function(e){
    e.preventDefault();
    const name = document.getElementById('c-name')?.value.trim();
    const msg = document.getElementById('c-message')?.value.trim();
    if(!name||!msg) return alert('Isi nama dan pesan.');
    const msgs = JSON.parse(localStorage.getItem('messages')||'[]');
    msgs.unshift({name,msg,date:new Date().toISOString()});
    localStorage.setItem('messages', JSON.stringify(msgs));
    alert('Pesan tersimpan secara lokal.');
  });

  // population update
  setTimeout(()=>{ const el=document.getElementById('popCount'); if(el) el.textContent='3.728'; }, 500);

  // Map: try Google Maps if loaded (initGmaps callback), otherwise insert OSM iframe
  function initMapFallback(){
    const mapEl = document.getElementById('map');
    if(!mapEl) return;
    const lat = -8.596789, lng = 116.229927;
    if(window.google && window.google.maps){
      const center = {lat:lat,lng:lng};
      const map = new google.maps.Map(mapEl, {center:center,zoom:15});
      new google.maps.Marker({position:center,map:map,title:'Desa Gerimax Indah'});
      return;
    }
    // fallback: OpenStreetMap embed
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lng-0.01) + '%2C' + (lat-0.01) + '%2C' + (lng+0.01) + '%2C' + (lat+0.01) + '&layer=mapnik&marker=' + lat + '%2C' + lng;
    iframe.style.border='none'; iframe.style.width='100%'; iframe.style.height='250px'; iframe.loading='lazy';
    mapEl.appendChild(iframe);
  }

  window.initGmaps = function(){ initMapFallback(); };
  initMapFallback();

}); // end DOMContentLoaded
