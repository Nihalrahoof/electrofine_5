/* Curved portfolio: native page scrolling moves cards along a 3D arc. */
(()=>{
 const gallery=document.querySelector('.orbit-gallery');if(!gallery)return;
 const track=gallery.querySelector('[data-orbit-cards]');const dots=gallery.querySelector('.orbit-dots');
 const previous=gallery.querySelector('.orbit-prev'),next=gallery.querySelector('.orbit-next');
 const toggle=document.querySelector('.view-toggle');const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const isProduct=gallery.dataset.collection==='products';
 const projects=(isProduct?window.ELECTROFINE_PRODUCTS:window.ELECTROFINE_PROJECTS)||[];
 const noun=isProduct?'product':'project';const detailPage=isProduct?'product.html':'project.html';
 let visible=projects,grid=false,active=false,current=0,target=0,unit=600,frame=0,last=0;
 let cards=[],dotButtons=[],start=0,end=0,radius=1080,scrollTarget=null,animatedY=scrollY,lastWritten=scrollY,shownIndex=-1;
 const position=gallery.querySelector('.orbit-position');

 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function render(){
  track.innerHTML=visible.map((p,i)=>`<article class="orbit-card" data-index="${i}" aria-label="${esc(p.title)}"><div class="orbit-image"><img src="assets/images/${esc(p.image)}" alt="${esc(p.alt)}" loading="lazy"><span class="project-preview-tag">${isProduct?'PRODUCT PREVIEW':'CONCEPT PROJECT'} / ${String(projects.indexOf(p)+1).padStart(2,'0')}</span></div><div class="orbit-summary"><div><small>${esc(p.label)}</small><h3>${esc(p.title)}</h3></div><button class="orbit-expand" aria-label="Read about ${esc(p.title)}" aria-expanded="false" aria-controls="orbit-details-${i}">↗</button></div><div class="orbit-detail" id="orbit-details-${i}"><button class="orbit-close" aria-label="Close ${esc(p.title)} details">×</button><span class="detail-eyebrow">${esc(p.label.toUpperCase())}</span><h3>${esc(p.title)}</h3><p>${esc(p.intro)}</p><ul>${p.scope.slice(0,3).map(s=>`<li>${esc(s)}</li>`).join('')}</ul><a class="text-link" href="${detailPage}?id=${encodeURIComponent(p.id)}">Full ${noun} overview ↗</a></div></article>`).join('');
  dots.innerHTML=visible.map((p,i)=>`<button aria-label="Show ${esc(p.title)}" aria-pressed="${i===0}" data-index="${i}"></button>`).join('');
  document.querySelector('.portfolio-result').textContent=`${visible.length} ${noun}s shown`;
  cards=[...track.children];dotButtons=[...dots.children];shownIndex=-1;current=target=0;layout();
 }
 function layout(){
  cancelAnimationFrame(frame);frame=0;last=0;scrollTarget=null;
  active=innerWidth>900&&innerHeight>640&&!reduced.matches&&!grid&&visible.length>1;
  gallery.classList.toggle('is-orbit',active);
  unit=Math.max(520,innerHeight*.8);
  if(active){
   const pinHeight=gallery.querySelector('.orbit-pin').getBoundingClientRect().height;
   gallery.style.setProperty('--orbit-height',`${pinHeight+unit*(visible.length-1)}px`);
  }else gallery.style.removeProperty('--orbit-height');
  start=scrollY+gallery.getBoundingClientRect().top-105;end=start+unit*(visible.length-1);
  radius=innerWidth>1600?1180:innerWidth>1100?1080:940;
  cards.forEach(card=>{card.style.transform='';card.style.opacity='';card.style.visibility='';card.style.zIndex='';card.removeAttribute('aria-current');card.inert=false;});
  toggle.setAttribute('aria-pressed',String(grid));toggle.innerHTML=grid?'Curve view <span>⌒</span>':'Grid view <span>▦</span>';
  current=target=clamp((scrollY-start)/unit,0,visible.length-1);shownIndex=-1;
  if(active)paint();requestTick();
 }
 function paint(){
  const index=clamp(Math.round(current),0,visible.length-1);
  cards.forEach((card,i)=>{
   // A finite arc avoids visible cards teleporting from one edge to the other.
   const distance=i-current,angle=clamp(distance,-3.5,3.5)*.31;
   const x=Math.sin(angle)*radius,y=(1-Math.cos(angle))*radius*.68;
   const opacity=clamp((3.25-Math.abs(distance))/.65,0,1);
   card.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${(1400/(1400+Math.abs(distance)*65)).toFixed(4)}) rotate(${(distance*9).toFixed(3)}deg)`;
   card.style.opacity=String(opacity);card.style.visibility=opacity===0?'hidden':'visible';card.inert=opacity===0;
   card.style.zIndex=String(10-Math.round(Math.abs(distance)*2));
  });
  if(index!==shownIndex){
   shownIndex=index;
   position.innerHTML=`${String(index+1).padStart(2,'0')} <i>/</i> ${String(visible.length).padStart(2,'0')}`;
   cards.forEach((card,i)=>card.setAttribute('aria-current',String(i===index)));
   dotButtons.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
   previous.disabled=index===0;next.disabled=index===visible.length-1;
  }
 }
 function tick(time){
  frame=0;if(!active)return;
  const dt=Math.min(40,time-(last||time-16));last=time;
  const controlled=scrollTarget!==null;
  if(controlled){
   animatedY+=(scrollTarget-animatedY)*(1-Math.exp(-dt/125));
   if(Math.abs(scrollTarget-animatedY)<.3){animatedY=scrollTarget;scrollTarget=null;}
   window.scrollTo({top:animatedY,behavior:'instant'});lastWritten=scrollY;
  }
  target=clamp((scrollY-start)/unit,0,visible.length-1);
  // Wheel and buttons share this clock. Native scrollbar/touch input is eased too.
  current=controlled?target:current+(target-current)*(1-Math.exp(-dt/100));
  if(Math.abs(target-current)<.0005)current=target;
  paint();
  if(scrollTarget!==null||current!==target)frame=requestAnimationFrame(tick);else last=0;
 }
 function requestTick(){if(active&&!frame)frame=requestAnimationFrame(tick);}
 function animateTo(y){
  if(scrollTarget===null)animatedY=scrollY;
  scrollTarget=clamp(y,0,document.documentElement.scrollHeight-innerHeight);requestTick();
 }
 function go(index){if(active)animateTo(start+clamp(index,0,visible.length-1)*unit);}
 // Only smooth wheel input near the pinned collection. Normal page scrolling,
 // zoom, touch, keyboard and scrollable detail panels retain their native controls.
 addEventListener('wheel',event=>{
  if(!active||event.ctrlKey||event.metaKey||!event.cancelable||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  if(event.target.closest('.orbit-detail,.mobile-menu,input,textarea,select,[contenteditable="true"]'))return;
  const y=scrollY,base=scrollTarget===null?y:scrollTarget;
  if(y<start-80||y>end+40)return;
  if((base<=start&&event.deltaY<0)||(base>=end&&event.deltaY>0)){scrollTarget=null;return;}
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  event.preventDefault();animateTo(base+delta);
 },{passive:false});
 function interrupt(){scrollTarget=null;last=0;requestTick();}
 addEventListener('touchstart',interrupt,{passive:true});
 addEventListener('pointerdown',event=>{if(!event.target.closest('.orbit-controls'))interrupt();},{passive:true});
 addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key))interrupt();});
 previous.addEventListener('click',()=>go(Math.round(scrollTarget===null?current:(scrollTarget-start)/unit)-1));next.addEventListener('click',()=>go(Math.round(scrollTarget===null?current:(scrollTarget-start)/unit)+1));
 dots.addEventListener('click',event=>{const button=event.target.closest('button');if(button)go(Number(button.dataset.index));});
 track.addEventListener('click',event=>{
  const card=event.target.closest('.orbit-card');if(!card)return;
  if(event.target.closest('.orbit-expand')){
   [...track.children].forEach(c=>{c.classList.remove('is-open','is-dismissed');c.querySelector('.orbit-expand').setAttribute('aria-expanded','false');});
   card.classList.add('is-open');card.querySelector('.orbit-expand').setAttribute('aria-expanded','true');
   if(active)go(Number(card.dataset.index));
   card.querySelector('.orbit-close').focus({preventScroll:true});
  }
  if(event.target.closest('.orbit-close')){close(card);}
 });
 function close(card){card.classList.remove('is-open');card.classList.add('is-dismissed');const b=card.querySelector('.orbit-expand');b.setAttribute('aria-expanded','false');b.focus({preventScroll:true});}
 track.addEventListener('keydown',e=>{if(e.key==='Escape'){const card=e.target.closest('.orbit-card');if(card)close(card);}});
 track.addEventListener('pointerout',e=>{const card=e.target.closest('.orbit-card');if(card&&!card.contains(e.relatedTarget))card.classList.remove('is-dismissed');});
 toggle.addEventListener('click',()=>{grid=!grid;layout();});
 document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filters button').forEach(el=>{el.classList.toggle('active',el===b);el.setAttribute('aria-pressed',String(el===b));});
  const wasPinned=active&&scrollY>=start;visible=b.dataset.filter==='all'?projects:projects.filter(p=>p.category===b.dataset.filter);render();if(wasPinned){window.scrollTo({top:start,behavior:'instant'});current=target=0;requestTick();}
 }));
 document.querySelector('[data-filter=all] sup').textContent=String(projects.length).padStart(2,'0');
 addEventListener('scroll',()=>{if(scrollTarget!==null&&Math.abs(scrollY-lastWritten)>3)scrollTarget=null;requestTick();},{passive:true});let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,120);});reduced.addEventListener('change',layout);
 if(document.fonts)document.fonts.ready.then(layout);addEventListener('pageshow',layout);
 render();
})();
