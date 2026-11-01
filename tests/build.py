import re
d='/workspace/rp-app/';h=open(d+'rp-studio-single.html').read()
css=open(d+'style.css').read();pm=open(d+'premade.js').read();app=open(d+'app.js').read()
a=h.index('<style>')+7;b=h.index('</style></head>')
h=h[:a]+css+h[b:]
a=h.index('<script>// Premade')+8;b=h.index('</script><script>// RP Studio')
h=h[:a]+pm+h[b:]
a=h.index('<script>// RP Studio')+8;b=h.rindex('</script></body>')
import base64
ico='data:image/png;base64,'+base64.b64encode(open(d+'icon-192.png','rb').read()).decode()
app=app.replace("'icon-192.png'","'"+ico+"'")
h=h[:a]+app+h[b:]
open(d+'rp-studio-single.html','w').write(h)
