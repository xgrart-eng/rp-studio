const fs=require('fs');const run=require('./golden/run.js');const G='/tmp/pt/golden/golden.json';
(async()=>{let F=0;const want=fs.existsSync(G)?JSON.parse(fs.readFileSync(G)):null;const all={};
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const got=await run(url);all[url]=got;
 if(process.env.UPDATE){if(url.endsWith('/'))fs.writeFileSync(G,JSON.stringify(got,null,1));continue}
 if(!want){console.log('FAIL no golden');F++;continue}
 for(const k of new Set([...Object.keys(want),...Object.keys(got)]))if(want[k]!==got[k]){F++;console.log('FAIL',url.slice(22)||'index',k,'\n  - '+want[k]+'\n  + '+got[k])}}
if(process.env.UPDATE){const a=Object.values(all);console.log(JSON.stringify(a[0])===JSON.stringify(a[1])?'golden written; single==index':'FAIL single differs');}
console.log(F?F+' FAILED':'ALL PASS')})();
