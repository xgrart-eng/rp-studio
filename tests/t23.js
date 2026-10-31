const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??''))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>localStorage.setItem('rp_age','ok'));await pg.reload();await w(800);
const f=await pg.evaluate(()=>{const K=['id','name','age','tagline','tags','description','personality','scenario','first_mes','appearance','imgTags'];return{n:PREMADE.length,ids:new Set(PREMADE.map(p=>p.id)).size,miss:PREMADE.flatMap(p=>K.filter(k=>!p[k]||(Array.isArray(p[k])&&!p[k].length)).map(k=>p.id+':'+k)),young:PREMADE.filter(p=>!(p.age>=21)||!/adult/.test(p.appearance)||/\b(teen|school|child|young girl|loli|flat|petite girl)\b/i.test(JSON.stringify(p))).map(p=>p.id),act:PREMADE.filter(p=>!/\*[^*]+\*/.test(p.first_mes)).map(p=>p.id)}});
ok('16-20 chars',f.n>=16&&f.n<=20,f);ok('unique ids',f.ids===f.n);ok('fields complete',!f.miss.length,f.miss);ok('all adult 21+',!f.young.length,f.young);ok('first_mes actions',!f.act.length,f.act);
await pg.evaluate(()=>{view='chars';render()});await w(600);await pg.evaluate(()=>openPremade($('#main')));await w(500);
let r=await pg.evaluate(()=>({cards:document.querySelectorAll('.pmcard').length,ov:document.documentElement.scrollWidth>412||[...document.querySelectorAll('.pmcard')].some(e=>e.getBoundingClientRect().right>413)}));ok('library renders',r.cards===f.n,r);ok('no overflow 412',!r.ov,r);
await pg.click('[data-pmadd=pm-claire]');await w(500);r=await pg.evaluate(async()=>({n:(await all('chars')).filter(c=>c.premadeId).length,dis:!document.querySelector('[data-pmadd=pm-claire]')&&!!document.querySelector('[data-pmupd=pm-claire]')}));ok('add one',r.n===1&&r.dis,r);
await pg.evaluate(()=>addPm(['pm-claire']));await pg.click('#pmall');await w(1200);
r=await pg.evaluate(async()=>{const c=(await all('chars')).filter(c=>c.premadeId);return{n:c.length,u:new Set(c.map(x=>x.premadeId)).size,claire:c.find(x=>x.premadeId==='pm-claire'),allDis:document.querySelector('#pmall').disabled}});
ok('add all no dupes',r.n===f.n&&r.u===f.n&&r.allDis,{n:r.n,u:r.u});ok('schema fields',r.claire&&r.claire.first_mes&&r.claire.imgTags&&r.claire.appearance&&r.claire.fav===false,r.claire);
await pg.click('#pmx');await w(600);r=await pg.evaluate(()=>document.querySelectorAll('.ccard').length);ok('chars list shows them',r>=f.n,r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();
