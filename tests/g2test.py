import os,re,sys
from playwright.sync_api import sync_playwright
errs=[]
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=chrome,headless=True,args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':1280,'height':900})
    pg.on('pageerror',lambda e:errs.append(('pageerror',str(e))))
    pg.on('console',lambda m:errs.append(('console',m.text)) if m.type=='error' or (m.type=='warning' and 'GPU stall' not in m.text and 'GL Driver' not in m.text) else None)
    pg.goto('file://'+os.path.abspath('docs/genome-proteins/index.html')); pg.click('#enterSound'); pg.wait_for_timeout(1500)
    print('audio',pg.evaluate('[au.paused,au.duration>5,speaking]'))
    def go(i,w=900): pg.evaluate(f'go({i})'); pg.wait_for_timeout(w)
    def shot(n): pg.evaluate('window.scrollTo(0,0)'); pg.screenshot(path=f'/tmp/h_{n}.png')
    def cvclick(x,y): 
        bx=pg.query_selector('canvas').bounding_box(); pg.mouse.click(bx['x']+bx['width']*x,bx['y']+bx['height']*y)
    # g1 node click
    go(0); cvclick(.25,.5); pg.wait_for_timeout(1000); print('g1',pg.inner_text('#gi')[:60]); shot('1')
    go(1); pg.click('#md .chip:nth-child(3)'); pg.wait_for_timeout(1200); cvclick(.3,.5); shot('2')
    go(2); pg.click('#ln .chip:nth-child(1)'); pg.wait_for_timeout(500); cvclick(.5,.6); shot('3')
    go(3); pg.click('#vm .chip:nth-child(2)'); pg.wait_for_timeout(500); shot('4')
    go(4); pg.click('#ct .chip:nth-child(1)'); pg.wait_for_timeout(4000); shot('5a'); pg.click('#meth'); pg.wait_for_timeout(500); shot('5b'); print('g5',pg.inner_text('#gi')[:120])
    go(5); cvclick(.5,.5); pg.click('#cm .chip:nth-child(2)'); shot('6')
    go(6)
    for k in (2,3):
        pg.click(f'#lv .chip:nth-child({k+1})'); pg.wait_for_timeout(800)
    pg.click('#lv .chip:nth-child(3)'); pg.wait_for_timeout(500)
    # zoom in with wheel to trigger atoms
    bx=pg.query_selector('canvas').bounding_box(); pg.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2)
    for _ in range(14): pg.mouse.wheel(0,-400); pg.wait_for_timeout(60)
    pg.wait_for_timeout(1200); shot('7zoom')
    pg.click('#lv .chip:nth-child(4)'); pg.wait_for_timeout(800); shot('7q')
    pg.click('#lv .chip:nth-child(1)'); pg.fill('#fs','55'); pg.dispatch_event('#fs','input'); pg.wait_for_timeout(800); shot('7f')
    go(7); pg.click('#d40'); pg.wait_for_timeout(300); print('g8',pg.inner_text('#res')); pg.click('#lm .chip:nth-child(1)'); pg.click('#d40'); print('g8 golf',pg.inner_text('#res')); pg.click('#lm .chip:nth-child(3)'); cvclick(.8,.6); pg.wait_for_timeout(5000); shot('8'); print('g8',pg.inner_text('#res'))
    go(8,200); pg.click('#rel'); pg.wait_for_timeout(9000); print('g9',pg.inner_text('#rd')); shot('9'); pg.click('#gc .chip:nth-child(3)'); pg.wait_for_timeout(6000); print('g9x4',pg.inner_text('#rd')); shot('9b')
    go(9); pg.click('#mt'); pg.wait_for_timeout(400); shot('10a'); pg.click('#tb .chip:nth-child(2)'); pg.wait_for_timeout(2500); pg.click('#ad'); pg.wait_for_timeout(1500); shot('10b')
    go(10); pg.click('#tn'); pg.wait_for_timeout(1000); pg.click('#tn'); pg.wait_for_timeout(1000); shot('11')
    go(11); cvf=pg.query_selector('#cm'); bb=cvf.bounding_box(); pg.mouse.click(bb['x']+bb['width']*.2,bb['y']+bb['height']*.8); pg.wait_for_timeout(400); shot('12a')
    pg.click('#tb .chip:nth-child(2)'); pg.wait_for_timeout(1500); shot('12b'); pg.click('#tb .chip:nth-child(3)'); pg.wait_for_timeout(1500); shot('12c')
    go(12); pg.fill('#ps','18'); pg.dispatch_event('#ps','input'); pg.wait_for_timeout(600); shot('13a'); pg.click('#tb .chip:nth-child(2)'); pg.wait_for_timeout(1500); shot('13b')
    go(13); pg.click('#tb .chip:nth-child(2)'); pg.wait_for_timeout(500); pg.fill('#dm','100'); pg.dispatch_event('#dm','input'); pg.wait_for_timeout(1200); shot('14a'); pg.click('#tb .chip:nth-child(4)'); pg.wait_for_timeout(1500); shot('14b'); pg.click('#tb .chip:nth-child(1)'); pg.wait_for_timeout(1500); cvclick(.45,.4); shot('14c')
    go(14)
    for i in range(8):
        pg.click('#qz .opt >> nth=1'); pg.click('#qz .btn')
    print(pg.inner_text('#qz')[:80])
    print('live',pg.evaluate('LIVE.length'))
    b.close()
print(errs or 'no errors')
