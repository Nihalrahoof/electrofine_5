/* Lightweight glass motion. Effect intensity adapts to touch and motion preferences. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(pointer:fine)');
 const header=document.querySelector('.site-header');const chips=[...document.querySelectorAll('.capability-chip')];
 const panels=[...document.querySelectorAll('.glass-panel,.floating-glass,.service-row,.process-grid article')];
 const ambient=[...document.querySelectorAll('.ambient-field i')];
 const fallback=document.querySelector('.energy-fallback');
 let frame=0,last=0,scroll=scrollY,pointer={x:0,y:0},position={x:0,y:0};
 function render(time){
  const dt=Math.min(50,time-(last||time-16));last=time;
  const smooth=1-Math.exp(-dt/150);scroll+=(scrollY-scroll)*smooth;
  position.x+=(pointer.x-position.x)*smooth;position.y+=(pointer.y-position.y)*smooth;
  header.classList.toggle('scrolled',scrollY>30);
  if(!reduced.matches){
   if(fallback)fallback.style.transform=`translate3d(0,${Math.sin(time*.0006)*8-scroll*.035}px,0) rotate(${-24+Math.sin(time*.0003)*5+position.x*3}deg)`;
   chips.forEach((el,i)=>{const direction=i%2?1:-1;el.style.setProperty('--float-y',`${Math.sin(time*.00055+i*2)*8+scroll*.035*direction+position.y*6}px`);el.style.setProperty('--float-angle',`${direction*3+position.x*1.5}deg`);});
   ambient.forEach((el,i)=>el.style.transform=`translate3d(${position.x*(i+1)*12}px,${Math.sin(time*.00015+i)*18}px,0)`);
  }
  frame=0;
  if(!document.hidden&&!reduced.matches && (scrollY<innerHeight*1.8||Math.abs(scrollY-scroll)>.2))frame=requestAnimationFrame(render);
 }
 const tick=()=>{if(!frame)frame=requestAnimationFrame(render);};
 addEventListener('scroll',tick,{passive:true});addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2;tick();},{passive:true});
 panels.forEach(panel=>panel.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=panel.getBoundingClientRect();panel.style.setProperty('--shine-x',`${(e.clientX-r.left)/r.width*100}%`);panel.style.setProperty('--shine-y',`${(e.clientY-r.top)/r.height*100}%`);},{passive:true}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else tick();});reduced.addEventListener('change',()=>{chips.forEach(c=>{c.style.removeProperty('--float-y');c.style.removeProperty('--float-angle');});tick();});
 const copy=document.querySelector('.liquid-hero-copy');if(copy&&!reduced.matches){copy.animate([{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)'});}
 tick();
})();
