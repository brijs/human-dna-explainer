import sys,glob,os
from playwright.sync_api import sync_playwright
errs=[]
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=chrome,headless=True)
    for (W,H,tag) in [(1280,800,'d'),(390,800,'m')]:
        pg=b.new_page(viewport={'width':W,'height':H})
        pg.on('pageerror',lambda e:errs.append(('pageerror',str(e))))
        pg.on('console',lambda m:errs.append(('console',m.text)) if m.type=='error' else None)
        pg.goto('file://'+os.path.abspath('docs/dna/index.html'))
        pg.click('#enterSilent')
        for i in range(12):
            pg.wait_for_timeout(500)
            sw=pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
            if not sw: errs.append(('overflow',tag,i+1))
            pg.screenshot(path=f'/tmp/shot_{tag}_{i+1}.png')
            if i<11: pg.click('#nextBtn')
        pg.close()
    b.close()
print(errs or 'no errors')
