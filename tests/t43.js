const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',runKey:'FAKE',imgProvider:'runware',favModels:[{id:'a',name:'Alpha',provider:'runware',model:'civitai:391659@1',preset:'pony'},{id:'b',name:'Beta',provider:'runware',model:'civitai:827184@1',preset:'illustrious'}]}))});await pg.reload();await w(700);
await pg.evaluate(async()=>{window._calls=0;window.directivePrompt=async()=>{_calls++;return 'built'};window.scenePrompt=async()=>'auto';const c={id:'ch',name:'Hazel',description:'d'};await put('chars',c);curChat={id:'c43',charId:'ch',messages:[{role:'assistant',text:'hi',id:'a'}]};window._pp=editPrompt('Image prompt','', 'x','Generate',null,{c,i:0})});await w(500);
const order=await pg.evaluate(()=>{const ids=['pe_dir','pe_chips','pe_build','pet','pe_model','peadv'];const els=ids.map(i=>document.getElementById(i));if(els.some(x=>!x))return ids.filter((i,k)=>!els[k]);for(let k=1;k<els.length;k++)if(!(els[k-1].compareDocumentPosition(els[k])&Node.DOCUMENT_POSITION_FOLLOWING))return 'bad '+ids[k];return document.querySelector('#peadv #pe_dbg')?'ok':'dbg'});ok('section order',order==='ok',order);
ok('renamed',await pg.evaluate(()=>$('#pe_auto').textContent==='Fill scene from chat'&&!document.querySelector('#pefav [data-fmrm]')&&/Saved to Settings/i.test(document.querySelector('#pedit').textContent)));
ok('family tags',await pg.evaluate(()=>/Pony/.test($('#pefav').textContent)&&/Illustrious/.test($('#pefav').textContent)));
await pg.evaluate(()=>{const s=$('#pe_st');s.value='41';s.dispatchEvent(new Event('input'))});
await pg.evaluate(()=>{$('#pe_model').click();document.querySelector('#pefav [data-fm="b"]').click()});await w(200);
const r=await pg.evaluate(()=>({st:$('#pe_st').value,toast:$('#toast').textContent,n:S.favModels.length,on:document.querySelector('#pefav .fmchip.on')?.textContent}));
ok('no overwrite edited steps',r.st==='41',r);ok('switch toast',/Switched to Beta/.test(r.toast)&&/Default for new images changed/.test(r.toast),r);ok('chip does not delete',r.n>=2&&/✓/.test(r.on),r);
await pg.evaluate(()=>{const d=$('#pe_dir');d.value='she sits on the desk';d.dispatchEvent(new Event('input'))});await w(300);
const st1=await pg.evaluate(()=>({stale:!$('#pe_stale').hidden,c:_calls}));await w(1300);const st2=await pg.evaluate(()=>({c:_calls,v:$('#pet').value}));
ok('stale dot then debounce build',st1.stale&&st1.c===0&&st2.c>=1&&st2.v==='built',[st1,st2]);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();
