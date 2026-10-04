"""Build explainers. Usage: python build.py [dna|genome|hub|all]"""
import json,glob,base64,os,sys
def audio(d):
    A={}
    for f in sorted(glob.glob(d+'/*.mp3')):
        A[os.path.basename(f).split('.')[0]]='data:audio/mpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode()
    return A
def rd(p):return open(p).read()
def write(path,html):
    os.makedirs(os.path.dirname(path),exist_ok=True);open(path,'w').write(html)
INTRO_G='''<div style="font-size:60px">🧬</div><h1>Genomes &amp; Proteins</h1>
<p>A deeper, adult-level tour: the human genome, what proteins are, why folding is so hard, how AlphaFold changed biology, and what is still unsolved. Real protein structures you can zoom from ribbon to atoms. Hosted by <b>Dr. Helix</b>.</p>
<button class="btn" id="enterSound">🔊 Enter with narration</button><br><button class="btn sec" id="enterSilent">🔇 Enter silently (captions only)</button>
<p class="mini">Drag to rotate · right-drag or two fingers to pan · scroll or pinch to zoom · click things. Needs WebGL. &nbsp;<a href="__HUB__" style="color:#22d3ee">All explainers</a></p>'''
def build(mod):
    head=rd('parts/head.html')
    if mod=='dna':
        N=json.load(open('narration.json'));A=audio('audio')
        parts=['common_a','s3','common_b','scenes1','scenes2'];title='DNA Lab: Chromosomes, Genes &amp; the Double Helix';brand='🧬 DNA LAB';intro=rd('parts/intro_dna.html');out='docs/dna/index.html';pre='';vendor='';base='parts/'
    else:
        N=json.load(open('genome/narration.json'));A=audio('genome/audio')
        parts=['common_a','common_b','gl','data','scenes_a','scenes_b','scenes_c'];title='Genomes &amp; Proteins: genome, folding, AlphaFold';brand='🧬 GENOMES &amp; PROTEINS';intro=INTRO_G;out='docs/genome-proteins/index.html'
        pre="window.MODULE_RANKS=['Rookie','Analyst','Specialist','Frontier'];";vendor='<script>'+rd('vendor/three-bundle.js')+'</script>\n';base='genome/parts/'
    js=''
    for p in parts:
        f=('parts/'+p+'.js') if os.path.exists('parts/'+p+'.js') else ('genome/parts/'+p+'.js' if os.path.exists('genome/parts/'+p+'.js') else 'genome/data/structures.js')
        js+=rd(f)+'\n'
    if mod=='genome':
        pass
    html=head.replace('__TITLE__',title).replace('__BRAND__',brand).replace('__INTRO__',intro).replace('__HUB__','../').replace('__PRELUDE__',pre)
    html=html.replace('<script>\n'+pre+'\nconst NARR','<script>\n'+pre+'\nconst NARR') if False else html
    k=html.index('<script>\n')
    html=html[:k]+vendor+html[k:]
    html=html.replace('__NARR__',json.dumps(N)).replace('__AUDIO__',json.dumps(A))+js+'\n</script></body></html>\n'
    write(out,html);write('dist/'+out.split('/')[1]+'.html',html);write('docs/.nojekyll','');print(mod,len(html)//1024,'KB ->',out)
def hub():
    write('docs/index.html',rd('hub.html'));print('hub')
m=sys.argv[1] if len(sys.argv)>1 else 'all'
if m in('dna','all'):build('dna')
if m in('genome','all'):build('genome')
if m in('hub','all'):hub()
