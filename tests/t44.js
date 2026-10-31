const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE'}))});await pg.reload();await w(700);
let r=await pg.evaluate(async()=>{const base={id:'s1',name:'Sia',description:'A 30-year-old woman.'};
curChat={id:'cs',charId:'s1',messages:[{role:'user',text:'hi',id:'u'}]};
const m0=buildMessages({...base,mes_example:''}).map(x=>x.content).join('\n');
const m1=buildMessages({...base,mes_example:'{{user}}: hey\nSia: *smiles* hi you'}).map(x=>x.content).join('\n');
const m2=buildMessages({...base,example_dialogue:'Sia: alias line'}).map(x=>x.content).join('\n');
const n=normDlg({example_dialogue:'X'});const pm=pmChar({...PREMADE[0],example_dialogue:'Y'});
return{m0:/sample_dialogue/.test(m0),m1:/<sample_dialogue>[\s\S]*hi you[\s\S]*<\/sample_dialogue>/.test(m1),m1u:/\{\{user\}\}/.test(m1),m2:/alias line/.test(m2),n:n.mes_example==='X'&&!('example_dialogue' in n),pm:pm.mes_example==='Y'&&!('example_dialogue' in pm)}});
ok('empty -> no block',!r.m0,r);ok('delimited block',r.m1,r);ok('{{user}} filled',!r.m1u,r);ok('alias in prompt',r.m2,r);ok('normDlg',r.n,r);ok('premade alias',r.pm,r);
r=await pg.evaluate(async()=>{const f=new File([JSON.stringify({app:'rpstudio',v:1,chars:[{id:'b1',name:'Bea',description:'A 40-year-old woman.',example_dialogue:'Bea: hello'}],chats:[]})],'b.json');await importAll(f);await new Promise(z=>setTimeout(z,300));const c=(await all('chars')).find(x=>x.id==='b1');return c&&c.mes_example});ok('backup import alias',r==='Bea: hello',r);
r=await pg.evaluate(async()=>{editId='b1';view='edit';render();await new Promise(z=>setTimeout(z,400));const t=document.querySelector('#f_mes_example');return{v:t&&t.value,inMore:!!t?.closest('details.more'),lbl:t?.closest('label')?.textContent.slice(0,16)}});ok('editor field under More details',r.v==='Bea: hello'&&r.inMore&&/Sample dialogue/.test(r.lbl),r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS');process.exit(F?1:0)})();
