# 🧬 DNA & Protein explainers

**▶ Hub: https://brijs.github.io/human-dna-explainer/**  ·  [DNA Lab](https://brijs.github.io/human-dna-explainer/dna/)  ·  [Genomes & Proteins](https://brijs.github.io/human-dna-explainer/genome-proteins/)

[![Live](https://img.shields.io/badge/live-GitHub%20Pages-22d3ee)](https://brijs.github.io/human-dna-explainer/)

A narrated, interactive, 3D-ish explainer on chromosomes, DNA, genes and the double helix, written for a 9th grader (with extra detail for the curious). Hosted by **Dr. Helix** the robot.

## What it covers (12 scenes)
1. Welcome · 2. Zoom from body → cell → nucleus → chromosome → DNA · 3. Packing 2 m of DNA (histones, chromatin) · 4. Karyotype: 23 pairs, XX/XY · 5. The double helix (rotate, untwist, click parts) · 6. Base-pair builder & replication · 7. Genes on chromosomes (HBB, CFTR, LCT, SRY…) · 8. DNA → RNA → protein with a real codon table · 9. Mutation lab (silent, missense/sickle cell, nonsense, frameshift) · 10. Punnett squares, sex determination, calico cats · 11. Humans vs other species in a 3D tree · 12. Quiz + cheat sheet.

Everything is one self-contained HTML file (3D is a small custom canvas engine, narration is embedded Kokoro TTS audio). No external requests. Drag any 3D view to rotate.

## Rebuild
```bash
python3 -m venv .venv && . .venv/bin/activate
pip install kokoro-onnx soundfile imageio-ffmpeg
# model files (~350 MB) go in ~/.cache/kokoro, see https://github.com/thewh1teagle/kokoro-onnx
python tts.py      # narration.json -> audio/*.mp3 (cached by hash)
python build.py    # parts/ + audio -> dist/ and docs/index.html
```
Published from `main` + `/docs` via GitHub Pages.

## Sources and caveats
Figures are standard textbook / consortium values (e.g. ~3.1 billion base pairs per haploid set, ~20,000 protein-coding genes, 2 nm helix width, ~10.5 bp per turn, human chromosome 2 fusion, HBB sickle-cell Glu→Val). Cross-species similarity numbers are approximate and marked as such in the UI. Gene positions on chromosomes are illustrative, not to scale.

## Module 2: Genomes & Proteins (adult level, three.js)
15 scenes on the human genome (scale, repeats, variation, regulation), proteins (amino acids, four levels of structure, folding, misfolding), AlphaFold, design and drugs, and open problems. Uses **three.js** (vendored, MIT, `vendor/three-bundle.js`, rebuilt from `vendor/entry.js` with esbuild) and real structures from the RCSB PDB and AlphaFold DB (`genome/data`, packed by `genome/pack_data.py`). Storyboard: `storyboard-genome.md`.

### Layout and rebuild
```
python build.py all          # dna -> docs/dna, genome -> docs/genome-proteins, hub -> docs/index.html
python tts.py genome         # genome/narration.json -> genome/audio (Kokoro)
python tests/gtest.py        # Playwright smoke test (needs system Chrome)
```
Data credits: PDB entries 1UBQ, 2HHB, 1HHO, 1HSG, 1QYS, 1C3W (RCSB PDB, CC0); AlphaFold DB models AF-P04637, AF-P37840, AF-P68871 (EMBL-EBI/DeepMind, CC BY 4.0). Key facts: Nurk et al. Science 2022 (T2T-CHM13); Liao et al. Nature 2023 (pangenome); Jumper et al. Nature 2021; 2024 Chemistry Nobel. Approximate figures are marked in the app.
