import os
from playwright.sync_api import sync_playwright
errs=[]
chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=chrome,headless=True,args=['--autoplay-policy=no-user-gesture-required'])
    pg=b.new_page(viewport={'width':1280,'height':900})
    pg.on('pageerror',lambda e:errs.append(('pageerror',str(e))))
    pg.on('console',lambda m:errs.append(('console',m.text)) if m.type=='error' else None)
    pg.goto('file://'+os.path.abspath('docs/dna/index.html'))
    pg.click('#enterSound'); pg.wait_for_timeout(1500)
    print('audio',pg.evaluate('[au.paused,au.duration,au.currentTime>0,speaking]'))
    def shot(n): pg.screenshot(path=f'/tmp/i_{n}.png')
    def nxt(): pg.click('#nextBtn'); pg.wait_for_timeout(300)
    nxt() # s2
    pg.fill('#zs','250'); pg.dispatch_event('#zs','input'); pg.click('#zc .chip:nth-child(5)'); pg.wait_for_timeout(300); shot(2)
    nxt() # s3
    pg.fill('#ps','200'); pg.dispatch_event('#ps','input'); pg.wait_for_timeout(300); shot(3)
    pg.fill('#ps','300'); pg.dispatch_event('#ps','input'); pg.wait_for_timeout(300); shot('3b')
    nxt() # s4
    # pair: find chromosomes by buttons
    for _ in range(4):
        btns=pg.query_selector_all('#kb button')
        labels=[x.inner_html() for x in btns]
        # match by length of svg height attr
        import re
        hs=[re.search(r'height="([\d.]+)"',l).group(1) for l in labels]
        for i in range(len(hs)):
            j=[k for k in range(len(hs)) if k!=i and hs[k]==hs[i]]
            if j:
                btns[i].click(); pg.query_selector_all('#kb button')[j[0]].click(); break
    pg.click('#ks'); pg.click('#ky'); pg.wait_for_timeout(300); shot(4)
    nxt() # s5
    pg.mouse.click(640,400); pg.fill('#tw','30'); pg.dispatch_event('#tw','input'); pg.wait_for_timeout(300); shot(5)
    nxt() # s6
    seq=pg.eval_on_selector_all('#tp .b','e=>e.map(x=>x.textContent)')
    comp={'A':'T','T':'A','C':'G','G':'C'}
    for c in seq:
        pg.click(f'#pick .b{comp[c]}')
    pg.click('#rp'); pg.wait_for_timeout(4500); pg.evaluate('window.scrollTo(0,600)'); pg.wait_for_timeout(200); shot(6)
    nxt() # s7
    pg.click('#cs .chip:nth-child(2)'); pg.wait_for_timeout(300); shot(7)
    nxt() # s8
    pg.click('#tr'); pg.click('#tl'); pg.click('#dn .b >> nth=19'); pg.wait_for_timeout(500); shot(8)
    nxt() # s9
    pg.click('#pre .chip:nth-child(2)'); pg.wait_for_timeout(300); shot(9)
    pg.click('#pre .chip:nth-child(4)'); pg.wait_for_timeout(200); shot('9b')
    nxt() # s10
    pg.click('#tabs .chip:nth-child(1)'); pg.click('#pl'); shot(10)
    pg.click('#tabs .chip:nth-child(3)'); pg.wait_for_timeout(200); shot('10c')
    pg.click('#tabs .chip:nth-child(2)'); pg.wait_for_timeout(200)
    nxt() # s11
    pg.mouse.click(500,450); pg.wait_for_timeout(300); shot(11)
    nxt() # s12
    for i in range(8):
        pg.click('#qz .opt >> nth=%d'%(0 if i==0 else 0)); 
        pg.click('#qz .btn')
    pg.wait_for_timeout(300); shot(12)
    pg.click('#cp')
    print(pg.inner_text('#qz'), pg.inner_text('#rank'))
    # now correct answers
    pg.click('#qz .btn'); 
    ans=[1,2,2,1,0,1,1,1]
    for a in ans:
        pg.click('#qz .opt >> nth=%d'%a); pg.click('#qz .btn')
    pg.wait_for_timeout(500); shot('12b'); print(pg.inner_text('#qz'), pg.inner_text('#rank'))
    b.close()
print(errs or 'no errors')
