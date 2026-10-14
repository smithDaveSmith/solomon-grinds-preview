(() => {
 'use strict';
 const header=document.querySelector('.site-header'),menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav');
 if(menu){menu.hidden=false;header.classList.add('js-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu';nav.classList.toggle('open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');menu.textContent='Menu';nav.classList.remove('open');menu.focus()}})}
 const exampleIds={lc:['lc-03','lc-10','lc-18'],jc:['jc-24','jc-26','jc-40']};
 const renderExample=cycle=>{
  const data=window.SOLOMON_CLASSES||[],tones=['gold','white','rose'],symbols=cycle==='lc'?['à','Aa','∑']:['⚗','∑','H'];
  return exampleIds[cycle].map((id,i)=>{const c=data.find(r=>r.id===id);if(!c)return '';const name=c.subject+(c.detail==='Oral'?' oral':'');return '<div class="week-ticket ticket-'+tones[i]+'" data-ticket="'+(i+1)+'"><div class="ticket-symbol" aria-hidden="true">'+symbols[i]+'</div><div class="ticket-subject"><strong>'+name+'</strong><span>'+(cycle==='lc'?'Leaving Cert · '+c.level:'Junior Cycle'+(c.level!=='Common'?' · '+c.level:''))+'</span></div><div class="ticket-time"><span>'+(c.day==='Wednesday'?'WED':'SAT')+'</span><strong>'+c.start+'</strong></div></div>'}).join('');
 };
 document.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-example]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const c=document.querySelector('[data-example-content]');c.innerHTML=renderExample(b.dataset.example);document.dispatchEvent(new CustomEvent('solomon:updated',{detail:{element:c,kind:'hero'}}))}));
 const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const params=new URLSearchParams(location.search),classes=window.SOLOMON_CLASSES||[];
 const timeline=document.querySelector('[data-timetable]');
 if(timeline){
  const filters=timeline.querySelector('.filters'),cycle=timeline.querySelector('#filter-cycle'),subject=timeline.querySelector('#filter-subject'),day=timeline.querySelector('#filter-day'),panel=timeline.querySelector('.plan-panel'),count=timeline.querySelector('.results-count'),rows=[...timeline.querySelectorAll('[data-class-id]')],groups=[...timeline.querySelectorAll('[data-cycle-group]')],dayGroups=[...timeline.querySelectorAll('[data-day-group]')];
  const availableCycles=new Set(groups.map(g=>g.dataset.cycleGroup));
  [...cycle.options].forEach(o=>{if(!availableCycles.has(o.value))o.remove()});
  cycle.value=availableCycles.has(params.get('cycle'))?params.get('cycle'):timeline.dataset.defaultCycle;
  filters.hidden=false; if(panel){panel.hidden=false;timeline.querySelectorAll('[data-select-class]').forEach(b=>b.hidden=false)}
  let selected=[],hasClash=false,updatePlan=()=>{};
  const fillSubjects=wanted=>{const subjects=[...new Set(rows.filter(r=>r.dataset.cycle===cycle.value).map(r=>r.dataset.subject))].sort();subject.replaceChildren(new Option('All subjects','all'));subjects.forEach(s=>subject.add(new Option(s,s)));if(wanted&&!subjects.includes(wanted)){subject.add(new Option(wanted+' — ask for times',wanted))}subject.value=wanted||'all'};
  const filter=()=>{let n=0;rows.forEach(r=>{const show=r.dataset.cycle===cycle.value&&(subject.value==='all'||r.dataset.subject===subject.value)&&(day.value==='all'||r.dataset.day===day.value);r.hidden=!show;if(show)n++});groups.forEach(g=>g.hidden=g.dataset.cycleGroup!==cycle.value);dayGroups.forEach(g=>g.hidden=![...g.querySelectorAll('[data-class-id]')].some(r=>!r.hidden));count.textContent=n+' published '+(n===1?'class':'classes')+' shown · one-hour sessions';const empty=timeline.querySelector('.empty-filter');empty.hidden=n>0;if(!n){empty.textContent='No weekly time is published for this selection. Change the filters or ';const a=document.createElement('a');a.href=new URL('../contact-us/?interest='+encodeURIComponent(subject.value==='all'?'Class times':subject.value),location.href);a.textContent='ask Caitriona about times';empty.append(a)} };
  fillSubjects(params.get('subject'));filter();
  cycle.addEventListener('change',()=>{fillSubjects();filter();if(panel){selected=[];updatePlan('Exam cycle changed. Start a new plan for this cycle.')}});subject.addEventListener('change',filter);day.addEventListener('change',filter);
  if(panel){
   const planContent=panel.querySelector('[data-plan-content]'),message=panel.querySelector('.plan-message'),enquire=panel.querySelector('.plan-enquire'),contactUrl=new URL(enquire.getAttribute('href'),location.href),sort=(a,b)=>((a.day==='Wednesday'?0:1)-(b.day==='Wednesday'?0:1))||a.start.localeCompare(b.start);
   function renderPlan(note=''){
    const clashes=new Set();selected.forEach((a,i)=>selected.slice(i+1).forEach(b=>{if(a.day===b.day&&a.start<b.end&&b.start<a.end){clashes.add(a.id);clashes.add(b.id)}}));hasClash=clashes.size>0;
    rows.forEach(r=>{const picked=selected.some(c=>c.id===r.dataset.classId);r.classList.toggle('selected',picked);const button=r.querySelector('[data-select-class]');if(button){button.setAttribute('aria-pressed',String(picked));button.querySelector('span').textContent=picked?'−':'+';button.setAttribute('aria-label',(picked?'Remove ':'Add ')+r.dataset.subject+' '+r.querySelector('p').textContent+' on '+r.dataset.day+' at '+r.querySelector('.class-time').childNodes[0].textContent+(picked?' from':' to')+' your plan')}});
    if(!selected.length)planContent.innerHTML='<p class="plan-empty">Your week starts here.<br>Add a class from the timetable.</p>';
    else{planContent.innerHTML=['Wednesday','Saturday'].map(d=>{const choices=selected.filter(c=>c.day===d).sort(sort);return choices.length?'<div class="plan-day-title">'+d+'</div>'+choices.map(c=>'<div class="plan-entry '+(clashes.has(c.id)?'clash':'')+'"><time>'+c.start+'</time><div><strong>'+safe(c.subject)+'</strong><small>'+safe((c.detail?c.detail+' · ':'')+(c.level==='Common'?'Junior Cycle':c.level))+(clashes.has(c.id)?' · Time clash':'')+'</small></div><button class="remove-class" type="button" data-remove="'+c.id+'" aria-label="Remove '+safe(c.subject)+' from your plan">×</button></div>').join(''):''}).join('')}
    panel.querySelector('[data-plan-count]').textContent=selected.length+' '+(selected.length===1?'subject':'subjects')+' selected';panel.querySelector('[data-plan-price]').textContent='€'+(selected.length===3?55:selected.length*20);
    const mobile=timeline.querySelector('.mobile-plan-summary');if(mobile){mobile.hidden=selected.length===0;document.body.classList.toggle('has-mobile-plan',selected.length>0);mobile.querySelector('[data-mobile-count]').textContent=selected.length+' '+(selected.length===1?'subject':'subjects')+(hasClash?' · Time clash':'');mobile.querySelector('[data-mobile-price]').textContent='€'+(selected.length===3?55:selected.length*20)+' / week';mobile.classList.toggle('clashed',hasClash)}
    message.classList.toggle('has-clash',hasClash);message.classList.remove('is-warning');
    message.textContent=hasClash?'These subjects overlap. Choose another published time or remove a class before requesting this plan.':note||(selected.length===3?'Three different subjects fit the timetable. Published weekly rate: €55.':selected.length?'These class times fit together. Availability still needs to be confirmed.':'');
    enquire.href=contactUrl.href;enquire.setAttribute('aria-disabled',String(hasClash));enquire.innerHTML=(selected.length?'Ask about this plan':'Ask about a class')+' <span aria-hidden="true">↗</span>';
    if(selected.length){const url=new URL(contactUrl);url.searchParams.set('plan',selected.map(c=>c.id).join(','));url.searchParams.set('cycle',cycle.value);enquire.href=url.href}
    document.dispatchEvent(new CustomEvent('solomon:updated',{detail:{element:planContent}}));
   }
   timeline.addEventListener('click',e=>{const add=e.target.closest('[data-select-class]'),remove=e.target.closest('[data-remove]');if(add){const id=add.dataset.selectClass,c=classes.find(r=>r.id===id);if(!c)return;if(selected.some(r=>r.id===id)){selected=selected.filter(r=>r.id!==id);renderPlan();return}const existing=selected.find(r=>r.subject===c.subject);if(!existing&&selected.length>=3){message.textContent='This planner estimates up to three different subjects. Remove one, or ask Caitriona about a larger plan.';message.classList.add('is-warning');return}selected=selected.filter(r=>r.subject!==c.subject);selected.push(c);renderPlan(existing?'Replaced the previous '+c.subject+' class. This plan includes one class per subject.':'')}if(remove){selected=selected.filter(r=>r.id!==remove.dataset.remove);renderPlan();const sourceButton=timeline.querySelector('[data-select-class="'+remove.dataset.remove+'"]');if(sourceButton&&!sourceButton.closest('[hidden]'))sourceButton.focus();else panel.querySelector('.clear-plan').focus()}});
   updatePlan=renderPlan;panel.querySelector('.clear-plan').addEventListener('click',()=>{selected=[];renderPlan('Your plan has been cleared.')});enquire.addEventListener('click',e=>{if(hasClash){e.preventDefault();message.textContent='Resolve the overlapping classes first. You can still call Caitriona on 01 628 4171.'}});renderPlan();
  }
 }
 const form=document.querySelector('#enquiry-form');
 if(form){
  form.hidden=false;const cycle=form.querySelector('#enquiry-cycle'),subjects=form.querySelector('#enquiry-subjects'),message=form.querySelector('#enquiry-message'),name=form.querySelector('#enquiry-name');
  const ids=(params.get('plan')||'').split(',').slice(0,3),chosen=ids.map(id=>classes.find(c=>c.id===id)).filter(Boolean);let planText='';
  if(chosen.length){cycle.value=chosen[0].cycle==='lc'?'Leaving Cert':'Junior Cycle';subjects.value=chosen.map(c=>c.subject+(c.level==='Common'?'':' ('+c.level+')')).join(', ');planText='Possible weekly plan (not booked):\n'+chosen.map(c=>c.day+' '+c.start+'–'+c.end+' · '+c.subject+(c.detail?' · '+c.detail:'')).join('\n');message.value='Could you confirm suitability, availability and attendance options for these classes?'}
  else if(params.get('interest')){const interest=params.get('interest').slice(0,250);if([...cycle.options].some(o=>o.value.toLowerCase()===interest.toLowerCase()))cycle.value=[...cycle.options].find(o=>o.value.toLowerCase()===interest.toLowerCase()).value;else subjects.value=interest;}
  name.addEventListener('input',()=>name.setCustomValidity(''));
  form.addEventListener('submit',e=>{e.preventDefault();name.value=name.value.trim();if(name.value.length<2){name.setCustomValidity('Please enter at least two non-space characters.');name.reportValidity();return}if(!form.reportValidity())return;const values=new FormData(form),draft='Hello Caitriona,\n\nI’d like to ask about '+values.get('cycle')+'.\n'+(values.get('subjects')?'Subjects: '+values.get('subjects')+'\n':'')+(planText?'\n'+planText+'\n':'')+'\n'+(values.get('message')||'Could you let me know the next steps?')+'\n\nBest wishes,\n'+values.get('name')+'\nReply email: '+values.get('email');document.querySelector('#draft-text').textContent=draft;document.querySelector('#draft-email-link').href='mailto:caitrionahayes@yahoo.ie?subject='+encodeURIComponent('Enquiry: '+values.get('cycle'))+'&body='+encodeURIComponent(draft);const result=document.querySelector('#draft-result');result.hidden=false;result.focus();});
 }
 if(window.gsap){
  if(window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add({desktop:'(min-width: 961px)',mobile:'(max-width: 960px)',reduce:'(prefers-reduced-motion: reduce)'},ctx=>{
   const clean=[],ease='power3.out',replay=document.querySelector('.motion-replay');
   if(replay)replay.hidden=ctx.conditions.reduce;
   if(!ctx.conditions.reduce){
    const hero=document.querySelector('.hero-new');
    let opening;
    if(hero){
     opening=gsap.timeline({defaults:{ease}});
     opening.from('.hero-line',{yPercent:70,rotation:3,opacity:0,duration:.95,stagger:.12},.05)
      .from('.hero-copy .eyebrow,.hero-copy .lead,.hero-actions,.hero-note',{y:28,opacity:0,duration:.65,stagger:.09},.36)
      .from('.week-board',{y:55,rotation:-8,scale:.86,opacity:0,duration:1.05},.18)
      .from('.week-ticket',{x:i=>i%2?-90:90,y:35,rotation:i=>i%2?-10:10,opacity:0,duration:.85,stagger:.19},.52)
      .from('.week-price',{scale:.2,rotation:-45,opacity:0,duration:.9},1.03);
     const line=document.querySelector('.hero-highlight path');
     if(line){const len=line.getTotalLength();gsap.set(line,{strokeDasharray:len,strokeDashoffset:len});opening.to(line,{strokeDashoffset:0,duration:1},.5)}
     if(replay){const play=()=>opening.restart();replay.addEventListener('click',play);clean.push(()=>replay.removeEventListener('click',play))}
    }
    document.querySelectorAll('[data-reveal]').forEach(el=>{if(window.ScrollTrigger)gsap.from(el,{y:ctx.conditions.mobile?28:55,opacity:0,duration:.9,ease,scrollTrigger:{trigger:el,start:'top 89%',once:true}})});
    if(window.ScrollTrigger){
     if(document.querySelector('.pathways'))gsap.from('.pathway',{y:70,rotation:i=>i?-4:4,opacity:0,duration:1,ease,stagger:.15,scrollTrigger:{trigger:'.pathways',start:'top 85%',once:true}});
     if(document.querySelector('.difference-grid'))gsap.from('.difference-number',{y:35,opacity:0,duration:.8,ease,stagger:.15,scrollTrigger:{trigger:'.difference-grid',start:'top 86%',once:true}});
     if(document.querySelector('.courses-grid'))gsap.from('.course-feature',{y:55,opacity:0,duration:.9,ease,stagger:.15,scrollTrigger:{trigger:'.courses-grid',start:'top 89%',once:true}});
     const zone=document.querySelector('.signature-zone');
     if(zone){
      if(ctx.conditions.desktop){
       const cards=[...zone.querySelectorAll('.signature-card')],steps=[...zone.querySelectorAll('.signature-steps li')];
       const sequence=gsap.timeline({defaults:{ease},scrollTrigger:{id:'solomon-week',trigger:zone,start:'top 55px',end:'+=1050',pin:zone.querySelector('.signature-inner'),scrub:.55,anticipatePin:1,onUpdate:self=>{const phase=Math.min(2,Math.floor(self.progress*3));steps.forEach((e,i)=>e.classList.toggle('active',i<=phase))}}});
       cards.forEach((card,i)=>sequence.from(card,{x:i%2?-120:120,y:(i-1)*95,rotation:i%2?-12:12,scale:.88,duration:.75},i*.6));
       sequence.from(zone.querySelector('.signature-total'),{y:30,scale:.85,duration:.6},1.6)
        .from(zone.querySelector('.signature-progress span'),{scaleX:0,duration:2.2},0);
       clean.push(()=>steps.forEach(e=>e.classList.remove('active')));
      }else{
       gsap.from(zone.querySelectorAll('.signature-card'),{y:35,rotation:3,opacity:0,stagger:.15,duration:.8,ease,scrollTrigger:{trigger:zone.querySelector('.signature-board'),start:'top 87%',once:true}});
      }
     }
    }
    ctx.add('animateUpdate',e=>{
     const el=e.detail.element;
     if(e.detail.kind==='hero')gsap.from(el.querySelectorAll('.week-ticket'),{x:i=>i%2?-60:60,y:20,rotation:i=>i%2?-7:7,opacity:0,duration:.7,stagger:.1,ease,clearProps:'transform,opacity'});
     else{gsap.from(el.querySelectorAll('.plan-entry'),{x:-28,opacity:0,duration:.55,stagger:.08,ease,clearProps:'transform,opacity'});const price=document.querySelector('[data-plan-price]');if(price)gsap.fromTo(price,{scale:1.16},{scale:1,duration:.55,ease,clearProps:'transform'})}
    });
    const update=e=>ctx.animateUpdate(e);document.addEventListener('solomon:updated',update);clean.push(()=>document.removeEventListener('solomon:updated',update));
   }
   return()=>{clean.forEach(fn=>fn());if(replay)replay.hidden=true};
  });
 }
})();
