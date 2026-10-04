"""Pack PDB files from data/ into data/structures.js (compact JSON, heavy atoms only, waters dropped)."""
import json,math,os
D='data'
KEEP_HET={'HEM','MK1'}
CA_ONLY={'1HHO'}
def parse(fn,ca_only=False):
    helix=[];sheet=[];chains={};het=[]
    for l in open(fn):
        r=l[:6].strip()
        if r=='HELIX': helix.append((l[19],int(l[21:25]),int(l[33:37])))
        elif r=='SHEET': sheet.append((l[21],int(l[22:26]),int(l[33:37])))
        elif r in('ATOM','HETATM'):
            an=l[12:16].strip();rn=l[17:20].strip();ch=l[21];rs=int(l[22:26]);x,y,z=(float(l[30:38]),float(l[38:46]),float(l[46:54]));b=float(l[60:66])
            el=(l[76:78].strip() or an[0])
            if el=='H' or rn=='HOH':continue
            if r=='ATOM' or rn=='MSE':
                if ca_only and an!='CA':continue
                c=chains.setdefault(ch,{});key=rs
                if key not in c:c[key]=[rs,'MET' if rn=='MSE' else rn,'C',0,[]]
                c[key][4].append([an,round(x,1),round(y,1),round(z,1)])
                if an=='CA':c[key][3]=round(b)
            elif rn in KEEP_HET:
                het.append((rn,ch,rs,an,round(x,1),round(y,1),round(z,1)))
    out={};
    for ch,c in chains.items():
        res=[c[k] for k in sorted(c)]
        for r in res:
            for (hc,a,b) in helix:
                if hc==ch and a<=r[0]<=b:r[2]='H'
            for (sc,a,b) in sheet:
                if sc==ch and a<=r[0]<=b and r[2]=='C':r[2]='E'
        out[ch]=res
    g={}
    for rn,ch,rs,an,x,y,z in het:g.setdefault((rn,ch,rs),[]).append([an,x,y,z])
    return out,[[k[0],k[1],k[2],v] for k,v in g.items()],bool(helix or sheet)
def dist(a,b):return math.dist(a,b)
def assign_ss(res):
    ca=[next((a[1:] for a in r[4] if a[0]=='CA'),None) for r in res];n=len(res)
    for i in range(n-4):
        if None in ca[i:i+5]:continue
        if 4.5<=dist(ca[i],ca[i+3])<=5.7 and 5.7<=dist(ca[i],ca[i+4])<=6.8:
            for k in range(i,i+4):res[k][2]='H'
    for i in range(n-3):
        if None in ca[i:i+4] or any(res[k][2]=='H' or res[k][3]<70 for k in range(i,i+3)):continue
        if dist(ca[i],ca[i+2])>6.0 and dist(ca[i],ca[i+3])>9.0:
            for k in range(i,i+3):res[k][2]='E'
S={}
for f in sorted(os.listdir(D)):
    if not f.endswith('.pdb'):continue
    sid=f[:-4]
    if sid in('1EMA','1LYZ','4INS','2RH1','1A3N'):continue
    ch,het,has=parse(f'{D}/{f}',sid in CA_ONLY)
    if not has:
        for c in ch.values():assign_ss(c)
    S[sid]={'ch':ch,'het':het}
    print(sid,{k:len(v) for k,v in ch.items()},len(het),'ss' ,{x:sum(r[2]==x for c in ch.values() for r in c) for x in 'HEC'})
js='const STRUCT='+json.dumps(S,separators=(',',':'))+';\n'
open(f'{D}/structures.js','w').write(js);print(len(js)//1024,'KB')
