import os,sys
from playwright.sync_api import sync_playwright
errs=[]
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
url='file://'+os.path.abspath(sys.argv[1] if len(sys.argv)>1 else 'docs/genome-proteins/index.html')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=chrome,headless=True,args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1280,'height':850})
    pg.on('pageerror',lambda e:errs.append(('pageerror',str(e))))
    pg.on('console',lambda m:errs.append(('console',m.text)) if m.type=='error' or (m.type=='warning' and 'GPU stall' not in m.text and 'GL Driver' not in m.text) else None)
    pg.goto(url); pg.click('#enterSilent'); pg.wait_for_timeout(1500)
    n=pg.evaluate('SCENES.length'); print('scenes',n)
    only=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else range(n)
    for i in only:
        pg.evaluate(f'go({i})'); pg.wait_for_timeout(1800)
        pg.screenshot(path=f'/tmp/g_{i+1}.png')
    print('live',pg.evaluate('LIVE.length'))
    b.close()
print(errs or 'no errors')
