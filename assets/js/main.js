/* Progressive enhancements. No build tools, frameworks, or runtime CDNs. */
(() => {
 'use strict';
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const projects = window.ELECTROFINE_PROJECTS || [];
 const config = window.ELECTROFINE_CONFIG || {};
 const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const url = project => `project.html?id=${encodeURIComponent(project.id)}`;
 const card = (project, index=0) => `<article class="project-card" data-category="${escape(project.category)}"><a href="${url(project)}" class="project-image" data-cursor aria-label="Explore ${escape(project.title)} — illustrative project"><img src="assets/images/${escape(project.image)}" alt="${escape(project.alt)}" loading="lazy" width="1600" height="1100"><span class="project-preview-tag">ILLUSTRATIVE PROJECT / ${String(index+1).padStart(2,'0')}</span><div class="project-overlay"><p>${escape(project.intro)}</p><span class="text-link">Explore the project ↗</span></div></a><a class="project-meta" href="${url(project)}"><div><span>${escape(project.label.toUpperCase())}</span><h3>${escape(project.title)}</h3></div><span aria-hidden="true">↗</span></a></article>`;
 $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
 const menuButton = $('.menu-toggle'), menu = $('#mobile-menu');
 const setMenu = open => {
  if(!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.hidden = !open; document.body.classList.toggle('menu-open', open);
 };
 menuButton?.addEventListener('click', () => setMenu(menu.hidden));
 document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && menu && !menu.hidden){setMenu(false);menuButton.focus();}
  if(event.key === 'Tab' && menu && !menu.hidden){
   const items=[menuButton,...$$('a',menu)];const first=items[0],last=items.at(-1);
   if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 matchMedia('(min-width: 901px)').addEventListener('change', event => {if(event.matches)setMenu(false);});
 $$('a',menu || document.createElement('nav')).forEach(link=>link.addEventListener('click',()=>setMenu(false)));
 const homeProjects=$('[data-home-projects]');if(homeProjects)homeProjects.innerHTML=projects.slice(0,2).map(card).join('');
 const detail=$('[data-project-detail]');
 if(detail){
  const id=new URLSearchParams(location.search).get('id');
  const project=projects.find(p=>p.id===id) || (!id ? projects[0] : null);
  if(!project){detail.innerHTML='<section class="page-heading"><div class="eyebrow">PROJECT NOT FOUND</div><h1>Let’s reconnect<br><em>with the work.</em></h1><p>This project is not available.</p><a class="text-link" href="portfolio.html">← Back to portfolio</a></section>';}
  else{
   const next=projects[(projects.indexOf(project)+1)%projects.length];
   document.title=`${project.title} | ELECTROFINE`;
   detail.innerHTML=`<section class="page-heading project-detail-heading"><a class="breadcrumb" href="portfolio.html">← BACK TO ALL WORK</a><h1>${escape(project.title.split(',')[0])}${project.title.includes(',')?'<br><em>'+escape(project.title.split(',').slice(1).join(',').trim())+'</em>':''}</h1><div class="detail-tags"><span>${escape(project.label.toUpperCase())}</span><span class="sample-label">ILLUSTRATIVE PROJECT / PORTFOLIO PREVIEW</span></div></section><figure class="project-cover"><img src="assets/images/${escape(project.image)}" alt="${escape(project.alt)}" fetchpriority="high"></figure><section class="section project-overview"><dl class="project-facts"><div><dt>SECTOR</dt><dd>${escape(project.context)}</dd></div><div><dt>DISCIPLINE</dt><dd>${escape(project.label)}</dd></div><div><dt>PROJECT STATUS</dt><dd>Illustrative placeholder</dd></div><div><dt>LOCATION & CLIENT</dt><dd>To be confirmed</dd></div></dl><div><div class="section-label">01 — THE OVERVIEW</div><h2>${escape(project.intro)}</h2><p>${escape(project.overview)}</p><p class="sample-disclaimer">This is a sample project presentation, not a claim of completed work. Photographs are reference imagery. Verified client, location, dates, technical scope, and outcomes will be added with the actual case study.</p></div></section><section class="section dark-section project-scope"><div><div class="section-label">02 — THE ENGINEERING CONTEXT</div><h2>The detail behind<br><em>the delivery.</em></h2><p>${escape(project.challenge)}</p></div><div><div class="section-label">ILLUSTRATIVE SCOPE</div><ul class="line-list">${project.scope.map(item=>`<li>${escape(item)}<span>↗</span></li>`).join('')}</ul><a class="text-link" href="contact.html?service=${encodeURIComponent(project.category==='commercial'?'low-voltage':project.category)}">Discuss a similar requirement ↗</a></div></section><nav class="project-pagination" aria-label="Project navigation"><a class="text-link" href="portfolio.html">← All projects</a><a class="next-project" href="${url(next)}"><small>NEXT PROJECT</small>${escape(next.title)} ↗</a></nav>`;
  }
 }
 // Portfolio behaviour is owned by orbit.js.
 const updateProgress=()=>{
  const bar=$('.scroll-progress');const total=document.documentElement.scrollHeight-innerHeight;
  if(bar)bar.style.width=`${total>0?scrollY/total*100:0}%`;
 };
 addEventListener('scroll',updateProgress,{passive:true});updateProgress();
 // Reveal only when IntersectionObserver is supported; content is visible without JS.
 if('IntersectionObserver' in window && !reduced.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.1});
  document.documentElement.classList.add('js-motion');$$('.reveal').forEach(el=>observer.observe(el));
 }
 const cursor=$('.cursor-label');
 if(cursor && matchMedia('(hover:hover) and (pointer:fine)').matches && !reduced.matches){
  document.addEventListener('pointermove',event=>{cursor.style.left=event.clientX+'px';cursor.style.top=event.clientY+'px';cursor.classList.toggle('visible',!!event.target.closest('[data-cursor]'));},{passive:true});
  document.addEventListener('pointerleave',()=>cursor.classList.remove('visible'));
 }
 const contact=$('[data-contact-details]');
 if(contact){
  if(config.email){const a=document.createElement('a');a.href='mailto:'+config.email;a.textContent=config.email;contact.append(a);}
  if(config.phoneDisplay){const a=document.createElement(config.phoneLink?'a':'p');if(config.phoneLink)a.href='tel:'+config.phoneLink;a.textContent=config.phoneDisplay;contact.append(a);}
  if(config.address){const el=document.createElement('p');el.textContent=config.address;contact.append(el);}
  if(config.mapUrl && /^https:\/\//.test(config.mapUrl)){const a=document.createElement('a');a.href=config.mapUrl;a.textContent='Find us on the map ↗';a.target='_blank';a.rel='noopener noreferrer';contact.append(a);}
  if(!contact.children.length){contact.innerHTML='<p>Direct contact details will be available here soon. You can prepare a project brief using the form.</p>';}
 }
 const form=$('#enquiry-form');
 if(form){
  $('[data-submit-label]').disabled=false;
  const emailMode=Boolean(config.email && config.enquiryMode==='email');
  $('[data-submit-label]').innerHTML=emailMode?'Open email draft <span>↗</span>':'Download project brief <span>↗</span>';
  $('[data-form-note]').textContent=emailMode?'This opens a draft in your email app. Review it and press Send there. Nothing is submitted automatically.':'Preview mode: download a text copy of your brief. Nothing is sent or stored by this website. Direct enquiries will be enabled when business contact details are added.';
  const productId=new URLSearchParams(location.search).get('product');const product=(window.ELECTROFINE_PRODUCTS||[]).find(p=>p.id===productId);if(product){form.elements.service.value='products';form.elements.message.value='Product enquiry: '+product.title+'\n\nPlease share further information for our project.\n';}
  const requested=new URLSearchParams(location.search).get('service');if(requested && $$('option',form).some(o=>o.value===requested))form.elements.service.value=requested;
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form);const service=form.elements.service.selectedOptions[0].textContent;
   const brief=`ELECTROFINE — PROJECT ENQUIRY\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')||'Not provided'}\nPhone: ${data.get('phone')||'Not provided'}\nExpertise: ${service}\nLocation: ${data.get('location')||'Not provided'}\n\nPROJECT DETAILS\n${data.get('message')}\n`;
   const download=()=>{const blob=new Blob([brief],{type:'text/plain;charset=utf-8'});const objectUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=objectUrl;a.download='electrofine-project-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),1500);};
   const status=$('.form-status');status.replaceChildren();
   if(emailMode){
    // mailto has inconsistent length limits. Long briefs are downloaded to attach manually.
    const mailto=`mailto:${config.email}?subject=${encodeURIComponent('Project enquiry — '+service)}&body=${encodeURIComponent(brief)}`;
    if(mailto.length>1800){download();location.href=`mailto:${config.email}?subject=${encodeURIComponent('Project enquiry — '+service)}&body=${encodeURIComponent('Please find my project brief attached.\n\n[Attach the downloaded electrofine-project-brief.txt before sending.]')}`;status.textContent='Your brief was downloaded. Attach it to the email draft, then review and send. No enquiry has been sent yet.';}
    else{location.href=mailto;status.textContent='Email draft requested. Review and send it in your email app. If no app opens, download the brief below and email it to '+config.email+'.';}
    const fallback=document.createElement('button');fallback.type='button';fallback.className='text-link';fallback.style.background='transparent';fallback.textContent='Download a copy ↓';fallback.addEventListener('click',download);status.append(document.createElement('br'),fallback);
   }else{download();status.textContent='Your project brief is ready. Save the downloaded text file for sharing. This has not been sent to ELECTROFINE.';}
  });
 }
})();
