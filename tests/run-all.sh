set -e;cd /workspace/rp-app;python3 /tmp/ui/build.py;node --check app.js;node --check premade.js;node --check sw.js;cd /tmp/pt
for t in t8 t10 t11 t12 t13 t14 t15 t16 t17 t18 t19 t20 t21 t22 t23 t24 t25 t26 t27 t28 t29 t30 t31 t32 t33 t34 t35 t36 t37 t38 t39 t40 t41; do r=$(timeout 240 node $t.js | grep -E 'FAIL|ALL PASS'||true); echo "$t $r"; done;echo END
