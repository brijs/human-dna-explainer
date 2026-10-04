import json,glob,base64,os,re
N=json.load(open('narration.json'))
A={}
for f in sorted(glob.glob('audio/*.mp3')):
    sid=os.path.basename(f).split('.')[0]
    A[sid]='data:audio/mpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode()
head=open('parts/head.html').read().replace('__NARR__',json.dumps(N)).replace('__AUDIO__',json.dumps(A))
js=''.join(open(f'parts/{p}.js').read()+'\n' for p in['engine','scenes1','scenes2'])
js+="\n"
html=head+js+'</script></body></html>\n'
os.makedirs('dist',exist_ok=True);os.makedirs('docs',exist_ok=True)
open('dist/human-dna-explainer.html','w').write(html);open('docs/index.html','w').write(html);open('docs/.nojekyll','w').write('')
print(len(html)//1024,'KB')
