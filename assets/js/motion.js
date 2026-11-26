/* Cinematic motion, driven by native scroll. No scroll interception or dependencies.
   Delete this script reference to return to the simpler presentation. */
(() => {
 'use strict';
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width: 760px)');
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const all=(s)=>[...document.querySelectorAll(s)];
 const splitWords=(el)=>{
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode()){
   if(!walker.currentNode.parentElement.closest('.heading-spark,.motion-word'))nodes.push(walker.currentNode);
  }
  let index=0;
  nodes.forEach(node=>{
   const fragment=document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(word=>{
    if(!word.trim()){fragment.append(document.createTextNode(word));return;}
    const mask=document.createElement('span');mask.className='motion-word';
    const inner=document.createElement('span');inner.className='motion-word-inner';inner.textContent=word;inner.style.setProperty('--word-index',index++);mask.append(inner);fragment.append(mask);
   });node.replaceWith(fragment);
  });return [...el.querySelectorAll('.motion-word-inner')];
 };
 const headings=all('.hero h1,.page-heading h1');headings.forEach(splitWords);
 const reading=all('h2.reveal').map(el=>{
  el.classList.remove('reveal');el.classList.add('read-heading');return {el,words:splitWords(el)};
 });
 const revealTargets=all('.intro-copy>*,.stats>div,.service-row,.process-grid article,.timeline article,.values-grid article,.service-detail-title,.service-detail-body>div,.faq-list details,.contact-guide,.form-heading,.form-row,.project-facts>div,.project-overview>div,.cta-section .eyebrow,.cta-row,.cta-section>p');
 revealTargets.forEach(el=>{
  el.classList.add('motion-reveal');
  el.style.setProperty('--reveal-delay',Math.min(3,[...el.parentElement.children].indexOf(el))*75+'ms');
 });
 const media=all('.expertise-photo,.wide-image,.service-detail-body>img,.project-cover');
 media.forEach(el=>el.classList.add('media-reveal'));
 let observer;
 if('IntersectionObserver' in window){
  observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target);}
  }),{threshold:.12,rootMargin:'0px 0px -20px 0px'});
  [...revealTargets,...media].forEach(el=>observer.observe(el));
 }
 const hero=document.querySelector('.hero');const heroMedia=document.querySelector('.hero-media');
 const heroImg=heroMedia?.querySelector('img');const heroHeadline=document.querySelector('.hero-heading h1');
 const parallax=all('.wide-image,.project-cover,.expertise-photo').map(el=>({el,img:el.querySelector('img')})).filter(x=>x.img);
 let frame=0,last=0,current=scrollY,ready=false;
 function reset(){
  root.classList.toggle('cinematic-motion',!reduced.matches);
  root.classList.toggle('motion-observer',!reduced.matches&&!!observer);
  if(reduced.matches){
   cancelAnimationFrame(frame);frame=0;
   all('.motion-word-inner').forEach(el=>el.style.removeProperty('opacity'));
   [heroImg,heroHeadline,heroMedia,...parallax.map(x=>x.img)].filter(Boolean).forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity');});
  }
  current=scrollY;requestTick();
 }
 function requestTick(){if(!frame&&!reduced.matches)frame=requestAnimationFrame(tick);}
 function tick(time){
  const dt=Math.min(48,time-(last||time-16));last=time;
  current+=(scrollY-current)*(1-Math.exp(-dt/95));
  const vh=innerHeight;
  if(hero && heroMedia){
   const y=clamp(current/Math.max(1,heroMedia.offsetTop),0,1);
   heroMedia.style.setProperty('--hero-expand',String(y));
   if(heroImg)heroImg.style.transform=`translate3d(0,${clamp(current*.10,0,mobile.matches?35:95)}px,0) scale(${1.12-y*.06})`;
   if(heroHeadline&&!mobile.matches){heroHeadline.style.transform=`translate3d(0,${current*.13}px,0)`;heroHeadline.style.opacity=String(1-clamp(current/(vh*.65))*.65);}
  }
  reading.forEach(({el,words})=>{
   const rect=el.getBoundingClientRect();if(rect.bottom<0||rect.top>vh)return;
   const progress=clamp((vh*.88-rect.top)/(vh*.40));
   words.forEach((word,i)=>{word.style.opacity=String(.22+.78*clamp(progress*(words.length+2)-i));});
  });
  if(!mobile.matches)parallax.forEach(({el,img})=>{
   const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh)return;
   const progress=clamp((vh-r.top)/(vh+r.height));
   img.style.transform=`translate3d(0,${(progress-.5)*60}px,0) scale(1.1)`;
  });
  frame=0;
  if(Math.abs(scrollY-current)>.2)frame=requestAnimationFrame(tick);else{current=scrollY;last=0;}
 }
 addEventListener('scroll',requestTick,{passive:true});addEventListener('resize',requestTick,{passive:true});
 reduced.addEventListener('change',reset);mobile.addEventListener('change',reset);
 reset();
 // Content starts visible in the HTML. Entrance motion is enabled only after setup succeeds.
 requestAnimationFrame(()=>requestAnimationFrame(()=>{root.classList.add('motion-ready');ready=true;}));
 addEventListener('pageshow',()=>{if(ready){current=scrollY;requestTick();}});
})();
