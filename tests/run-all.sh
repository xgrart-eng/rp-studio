set -e;cd /workspace/rp-app;python3 /workspace/rp-app/tests/build.py;node --check app.js;node --check premade.js;node --check sw.js;cp /workspace/rp-app/tests/t*.js /tmp/pt/;cd /tmp/pt
for f in t*.js; do t=${f%.js}; [ "$t" = t ] && continue; r=$(timeout 240 node $t.js | grep -E 'FAIL|ALL PASS'||true); echo "$t $r"; done;echo END
