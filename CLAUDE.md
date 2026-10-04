# DNA & protein explainers
Hub https://brijs.github.io/human-dna-explainer/ · DNA Lab /dna/ · Genomes & Proteins /genome-proteins/
Rebuild: `. ~/.cache/kokoro/venv/bin/activate && python tts.py [genome] && python build.py all` (writes docs/ and dist/).
DNA Lab: parts/scenes1.js, scenes2.js, narration.json, audio/. Genome module: genome/parts/*.js, genome/narration.json, genome/data (run genome/pack_data.py after changing PDBs).
Shared engine: parts/common_a.js, common_b.js (+ s3.js canvas engine for DNA Lab, genome/parts/gl.js three.js helpers).
Tests: tests/*.py (Playwright + system Chrome with swiftshader GL).
