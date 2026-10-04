import os
from playwright.sync_api import sync_playwright
errs=[]
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=chrome,headless=True,args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    for name,url in [('hub','docs/index.html'),('g','docs/genome-proteins/index.html')]:
        pg=b.new_page(viewport={'width':390,'height':800})
        pg.on('pageerror',lambda e:errs.append(('pageerror',str(e))))
        pg.on('console',lambda m:errs.append(('console',m.text)) if m.type=='error' else None)
        pg.goto('file://'+os.path.abspath(url))
        if name=='hub': pg.wait_for_timeout(500); pg.screenshot(path='/tmp/m_hub.png'); print('hub overflow',not pg.evaluate('document.documentElement.scrollWidth<=innerWidth')); continue
        pg.click('#enterSilent')
        for i in range(15):
            pg.evaluate(f'go({i})'); pg.wait_for_timeout(700)
            if not pg.evaluate('document.documentElement.scrollWidth<=innerWidth'): errs.append(('overflow',i+1))
            if i in(0,6,11,13): pg.screenshot(path=f'/tmp/m_{i+1}.png')
    b.close()
print(errs or 'no errors')
