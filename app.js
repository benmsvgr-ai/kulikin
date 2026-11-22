/* KULIKIN — musik interaktif, local-first. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const NOTE_SHARPS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const NOTE_LABELS=['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];
const QUALITY={
 maj:{label:'Mayor',symbol:'',ints:[0,4,7],formula:'1 · 3 · 5'},m:{label:'Minor',symbol:'m',ints:[0,3,7],formula:'1 · ♭3 · 5'},
 '7':{label:'Dominant 7',symbol:'7',ints:[0,4,7,10],formula:'1 · 3 · 5 · ♭7'},maj7:{label:'Major 7',symbol:'maj7',ints:[0,4,7,11],formula:'1 · 3 · 5 · 7'},
 m7:{label:'Minor 7',symbol:'m7',ints:[0,3,7,10],formula:'1 · ♭3 · 5 · ♭7'},m7b5:{label:'Minor 7 ♭5',symbol:'m7♭5',ints:[0,3,6,10],formula:'1 · ♭3 · ♭5 · ♭7'},
 dim:{label:'Diminished',symbol:'dim',ints:[0,3,6],formula:'1 · ♭3 · ♭5'},dim7:{label:'Diminished 7',symbol:'dim7',ints:[0,3,6,9],formula:'1 · ♭3 · ♭5 · 6'},
 sus4:{label:'Sus 4',symbol:'sus4',ints:[0,5,7],formula:'1 · 4 · 5'},sus2:{label:'Sus 2',symbol:'sus2',ints:[0,2,7],formula:'1 · 2 · 5'},
 add9:{label:'Add 9',symbol:'add9',ints:[0,4,7,14],formula:'1 · 3 · 5 · 9'},'9':{label:'Dominant 9',symbol:'9',ints:[0,4,7,10,14],formula:'1 · 3 · 5 · ♭7 · 9'},
 maj9:{label:'Major 9',symbol:'maj9',ints:[0,4,7,11,14],formula:'1 · 3 · 5 · 7 · 9'},m9:{label:'Minor 9',symbol:'m9',ints:[0,3,7,10,14],formula:'1 · ♭3 · 5 · ♭7 · 9'},
 '7b9':{label:'7 ♭9',symbol:'7(♭9)',ints:[0,4,7,10,13],formula:'1 · 3 · 5 · ♭7 · ♭9'},'7b9b13':{label:'7 ♭9 ♭13',symbol:'7(♭9,♭13)',ints:[0,4,7,10,13,20],formula:'1 · 3 · 5 · ♭7 · ♭9 · ♭13'},
 '7#9':{label:'7 #9',symbol:'7(#9)',ints:[0,4,7,10,15],formula:'1 · 3 · 5 · ♭7 · ♯9'},'6':{label:'Major 6',symbol:'6',ints:[0,4,7,9],formula:'1 · 3 · 5 · 6'},
 m6:{label:'Minor 6',symbol:'m6',ints:[0,3,7,9],formula:'1 · ♭3 · 5 · 6'},'7b13':{label:'7 ♭13',symbol:'7(♭13)',ints:[0,4,7,10,20],formula:'1 · 3 · 5 · ♭7 · ♭13'}
};
const SCALES={
 major:{label:'Major (Ionian)',steps:[0,2,4,5,7,9,11],desc:'Terang, stabil, dan akrab di telinga.'},
 minor:{label:'Natural Minor (Aeolian)',steps:[0,2,3,5,7,8,10],desc:'Lebih sendu, hangat, dan reflektif.'},
 dorian:{label:'Dorian',steps:[0,2,3,5,7,9,10],desc:'Minor dengan nada ke-6 yang lebih cerah.'},
 phrygian:{label:'Phrygian',steps:[0,1,3,5,7,8,10],desc:'Minor dengan nada kedua turun, warna gelap.'},
 locrian:{label:'Locrian',steps:[0,1,3,5,6,8,10],desc:'Minor yang labil dengan nada kelima turun.'},
 mixolydian:{label:'Mixolydian',steps:[0,2,4,5,7,9,10],desc:'Groovy, sering dipakai blues dan funk.'},
 lydian:{label:'Lydian',steps:[0,2,4,6,7,9,11],desc:'Nuansa mengambang dengan nada ke-4 naik.'},
 harmonic_minor:{label:'Harmonic Minor',steps:[0,2,3,5,7,8,11],desc:'Minor dramatis dengan dominant mayor yang kuat.'},
 melodic_minor:{label:'Jazz Melodic Minor',steps:[0,2,3,5,7,9,11],desc:'Minor modern dengan warna jazz.'}
};
const ROM_MAJOR=['I','ii','iii','IV','V','vi','vii°'];
const ROM_MINOR=['i','ii°','III','iv','V','VI','VII'];
const HARMONY_MAJOR={1:[4,5,6,2],2:[5,4,7,1],3:[6,4,2,1],4:[5,1,2,6],5:[1,6,4,3],6:[2,4,5,1],7:[1,3,5,6]};
const HARMONY_MINOR={1:[4,6,5,2],2:[5,1,6,7],3:[6,4,7,5],4:[5,1,7,2],5:[1,6,4,3],6:[4,2,5,7],7:[1,3,6,5]};
const HARMONY_JAZZ={1:[6,2,4,3],2:[5,7,4,1],3:[6,2,5,4],4:[7,2,5,1],5:[1,6,3,2],6:[2,4,5,1],7:[3,1,5,2]};
const ROUTE_HINTS={1:'Pulang ke rumah. Stabil dan pas buat mengakhiri bagian lagu.',2:'Mulai membangun ketegangan; biasanya enak menuju V.',3:'Warna yang lebih lembut. Sering mengantar ke vi atau IV.',4:'Ruang baru yang terasa lega; bisa lanjut ke V atau I.',5:'Puncak ketegangan. Umumnya ingin balik ke I.',6:'Membawa rasa emosional dan membuka banyak arah.',7:'Nada penghubung yang mendorong kembali ke pusat nada.'};
const PAGES={cheats:['PANDUAN MUSIK','SCALE · INTERVAL · CHORD','Belajar <em>harmoni.</em>','Semua teori dasar dalam satu tempat.'],transcribe:['TRANSKRIPSI LAGU','AUDIO · STEM · MIDI','Dengar, pisah, <em>latih.</em>','Ambil audio, pisahkan instrumen, lalu ulik hasilnya di piano roll.'],studio:['PIANO STUDIO','PIANO 88 TUTS','Mainkan <em>chord.</em>','Dengarkan chord dan lihat posisi nada kiri dan kanan.'],circle:['CIRCLE OF FIFTHS','LINGKARAN NADA','Kenali hubungan <em>nada.</em>','Cari keluarga chord dan nada dasar yang berdekatan.'],paths:['JALUR CHORD','PROGRESI INTERAKTIF','Rangkai <em>musikmu.</em>','Mulai dari satu chord lalu pilih ke mana lanjutannya.'],learn:['BELAJAR NOTASI','LATIHAN MUSIK','Baca dan <em>mainkan.</em>','Belajar mengenali not balok lewat latihan singkat.']};
let state={page:'studio',key:0,scale:'major',transpose:0,sound:true,root:0,quality:'maj7',bass:-1,circleMode:'major',style:'major',start:1,progression:[],lesson:'notes',lessonNote:60,quiz:{midi:64,correct:0,total:0,streak:0,answered:false}};
let audio=null,master=null,activeKeys=new Set(),playSerial=0,toastTimer=null,graphSuggestions=[];
let hadSavedJourney=false, chordGuideEnabled=false;
function saveLocal(){try{localStorage.setItem('chord-atlas-state-v1',JSON.stringify({key:state.key,scale:state.scale,transpose:state.transpose,root:state.root,quality:state.quality,bass:state.bass,circleMode:state.circleMode,style:state.style,start:state.start,progression:state.progression}));}catch(_){/* private browsing may restrict storage */}}
function restoreLocal(){try{const raw=localStorage.getItem('chord-atlas-state-v1');if(!raw)return;const s=JSON.parse(raw);if(!s||typeof s!=='object')return;for(const k of ['key','root','transpose','bass','start'])if(Number.isInteger(s[k]))state[k]=s[k];for(const k of ['scale','quality','circleMode','style'])if(typeof s[k]==='string')state[k]=s[k];if(!SCALES[state.scale])state.scale='major';if(!QUALITY[state.quality])state.quality='maj7';if(!['major','minor'].includes(state.circleMode))state.circleMode='major';if(!['major','minor','jazz'].includes(state.style))state.style='major';state.key=mod(state.key);state.root=mod(state.root);state.transpose=Math.max(-11,Math.min(11,state.transpose));state.bass=state.bass<0?-1:mod(state.bass);if(Array.isArray(s.progression)){state.progression=s.progression.filter(c=>c&&Number.isInteger(c.root)&&QUALITY[c.quality]).slice(0,64).map(c=>chordObj(c.root,c.quality,Number.isInteger(c.bass)?c.bass:-1,Number.isInteger(c.degree)?c.degree:null));hadSavedJourney=true;}}catch(_){}}
function mod(n,m=12){return ((n%m)+m)%m}
function noteName(pc){return NOTE_LABELS[mod(pc)]}
function shortName(midi){return noteName(midi)+String(Math.floor(midi/12)-1)}
function chordObj(root,quality='maj',bass=-1,degree=null){return {root:mod(root),quality,bass,degree}}
function chordText(c){if(!c)return '—';return noteName(c.root)+(QUALITY[c.quality]?.symbol||'')+(c.bass>=0?'/'+noteName(c.bass):'')}
function chordTones(c){return (QUALITY[c.quality]||QUALITY.maj).ints.map(i=>mod(c.root+i))}
function midiNotes(c){let bass=c.bass>=0?c.bass:c.root;let low=36+bass; // C2–B2
 let base=(c.root>=7?48:60)+c.root; // keys around C4, A3–B3
 let right=(QUALITY[c.quality]||QUALITY.maj).ints.map(i=>base+i);
 right=right.map(n=>n>84?n-12:n);
 return {left:[low,low+7],right,rightAll:right};}
function transposeChord(c,semi){return chordObj(c.root+semi,c.quality,c.bass<0?-1:c.bass+semi,c.degree)}
function setGlobalSelect(id,options,val){const el=$(id);el.innerHTML=options.map(o=>`<option value="${o.value}">${o.label}</option>`).join('');el.value=String(val)}
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3000)}
function updateRootOptions(){let opt=NOTE_LABELS.map((n,i)=>({value:i,label:n}));setGlobalSelect('#global-key',opt,state.key);setGlobalSelect('#root-note',opt,state.root);setGlobalSelect('#bass-note',[{value:-1,label:'Tanpa slash'},...opt],state.bass)}
function initControls(){updateRootOptions();setGlobalSelect('#global-scale',Object.entries(SCALES).map(([value,a])=>({value,label:a.label})),state.scale);setGlobalSelect('#chord-quality',Object.entries(QUALITY).map(([value,q])=>({value,label:q.label})),state.quality);$('#year').textContent=new Date().getFullYear();$('#bpm-value').textContent=$('#bpm').value+' BPM';}
function currentChord(){return chordObj(state.root,state.quality,state.bass)}
function audioContext(){if(!state.sound)return null;if(!audio){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx){toast('Browser ini belum mendukung audio Web Audio.');return null;}audio=new Ctx();master=audio.createDynamicsCompressor();master.threshold.value=-16;master.knee.value=24;master.ratio.value=3;master.attack.value=.006;master.release.value=.3;const gain=audio.createGain();gain.gain.value=.7;master.connect(gain);gain.connect(audio.destination);}if(audio.state==='suspended'){audio.resume().catch(err=>{console.warn('Audio belum dapat dibuka:',err);sampleIndicator('Klik Tes suara untuk mengaktifkan audio');});}return audio}
// TimGM6mb sampled grand piano bank: 17 notes, one every minor third.
// Unlike oscillators these are recordings of a sampled acoustic piano.
let pianoSamples=new Map(),pianoBankLoading=null,pianoBankReady=false,pianoQueue=[];
function sampleIndicator(t){const el=$('#sample-status');if(el)el.textContent=t}
async function loadPianoBank(){
 if(pianoBankLoading)return pianoBankLoading;
 const ctx=audioContext();if(!ctx)return;
 sampleIndicator('Menyiapkan piano akustik...');
 pianoBankLoading=(async()=>{
  const bank=window.CHORD_ATLAS_PIANO_BANK||{};
  const keys=Object.keys(bank);
  if(!keys.length){sampleIndicator('Sampel belum terpasang · audio-bank.js tidak ditemukan');pianoQueue.length=0;toast('File audio-bank.js tidak ditemukan. Ekstrak ZIP lengkap.');return;}
  let loaded=0;
  const results=await Promise.allSettled(keys.map(async key=>{
    // decode from inline sample bytes; no fetch(), CORS, or server required.
    const bin=atob(bank[key]);const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const buffer=await ctx.decodeAudioData(bytes.buffer);
    pianoSamples.set(Number(key),buffer);loaded++;
    if(loaded===keys.length||loaded%4===0)sampleIndicator('Menyiapkan piano '+loaded+'/'+keys.length);
  }));
  pianoBankReady=pianoSamples.size>0;
  if(pianoBankReady){sampleIndicator('Grand Piano · siap dimainkan ('+pianoSamples.size+' sampel)');
   const todo=pianoQueue.splice(0),now=ctx.currentTime;
   for(const item of todo)sampledTone(item.midi,now+.055+Math.max(0,item.delay),item.duration,item.volume);
  }else{sampleIndicator('Sampel piano tidak dapat dibaca');pianoQueue.length=0;toast('Audio gagal: coba Chrome atau Edge versi terbaru.');}
  const missing=results.filter(v=>v.status==='rejected').length;
  if(missing)console.warn('Sampel audio yang tidak berhasil didekode:',missing,results.find(v=>v.status==='rejected')?.reason);
 })();return pianoBankLoading;
}
function sampledTone(midi,when,duration=.9,volume=.3){
 const ctx=audioContext();if(!ctx||pianoSamples.size===0)return;
 const bases=[...pianoSamples.keys()],base=bases.reduce((best,m)=>Math.abs(m-midi)<Math.abs(best-midi)?m:best,bases[0]);
 const sample=pianoSamples.get(base);if(!sample)return;
 const src=ctx.createBufferSource();src.buffer=sample;src.playbackRate.value=Math.pow(2,(midi-base)/12);
 const g=ctx.createGain(),t=Math.max(ctx.currentTime+.002,when||ctx.currentTime+.008);
 const velocity=Math.max(.045,Math.min(.78,volume))*.82;
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(velocity,t+.009);
 g.gain.setValueAtTime(velocity,t+Math.min(.23,Math.max(.1,duration*.26)));
 const end=t+Math.min(duration,Math.max(.25,sample.duration/src.playbackRate.value-.04));
 g.gain.setValueAtTime(velocity,end);g.gain.exponentialRampToValueAtTime(.0001,end+.22);
 src.connect(g);g.connect(master);src.start(t);src.stop(Math.min(t+sample.duration/src.playbackRate.value,end+.24));
}
function tone(midi,when=null,duration=.8,volume=.30){
 const ctx=audioContext();if(!ctx)return;
 if(!pianoBankReady){pianoQueue.push({midi,delay:Math.max(0,(when??ctx.currentTime)-ctx.currentTime),duration,volume});loadPianoBank();return;}
 sampledTone(midi,Math.max(ctx.currentTime+.006,when??ctx.currentTime+.008),duration,volume);
}

function playNote(midi){tone(midi+state.transpose,null,.7,.30);flashKey(midi)}
function playChord(c=currentChord(),delaySec=0,duration=1.15){if(!state.sound){toast('Aktifkan suara di bagian OUTPUT AUDIO.');return}const ctx=audioContext();if(!ctx)return;const m=midiNotes(c),time=ctx.currentTime+delaySec+.025;
 m.left.forEach((n,i)=>tone(n+state.transpose,time+i*.022,duration,.19));m.right.forEach((n,i)=>tone(n+state.transpose,time+i*.012,duration,.16));
 if(delaySec===0){setTimeout(()=>flashChord(c),30)} }
function flashKey(midi){const target=$(`#piano [data-midi="${midi}"]`);if(!target)return;target.classList.add('is-pressed');setTimeout(()=>target.classList.remove('is-pressed'),270)}
function flashChord(c){const n=midiNotes(c);[...n.left,...n.right].forEach(flashKey)}
function switchPage(page){if(!PAGES[page])return;state.page=page;$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));const meta=PAGES[page];$('#breadcrumb-name').textContent=meta[0];if($('#page-eyebrow'))$('#page-eyebrow').innerHTML=meta[1];if($('#page-title'))$('#page-title').innerHTML=meta[2];if($('#page-desc'))$('#page-desc').textContent=meta[3];$('#sidebar').classList.remove('is-open');if(page==='circle')renderCircle();if(page==='paths')renderJourney();if(page==='learn')renderLearning();if(page==='cheats')renderCheatSheet();if(page==='transcribe')renderRoll();else if(rollState.playing)stopRoll();window.scrollTo({top:0,behavior:'smooth'});}
function scaleSteps(){return SCALES[state.scale].steps}
function degreeQuality(scale,index,style='major'){const ints=[0,2,4,6].map(d=>mod(scale[(index+d)%7]-scale[index]+(index+d>=7?12:0)));const third=mod(ints[1]),fifth=mod(ints[2]),seventh=mod(ints[3]);if(style==='jazz'){if(third===4&&fifth===7&&seventh===11)return 'maj7';if(third===3&&fifth===7&&seventh===10)return 'm7';if(third===3&&fifth===6&&seventh===10)return 'm7b5';if(third===4&&seventh===10)return '7';}if(third===4&&fifth===7)return 'maj';if(third===3&&fifth===7)return 'm';if(third===3&&fifth===6)return 'dim';if(third===4&&fifth===8)return 'maj';return 'm'}
function diatonicChord(degree,style=state.style){const minor=style==='minor';const s=(minor?SCALES.harmonic_minor:SCALES.major).steps;const i=degree-1;let q=degreeQuality(s,i,style==='jazz'?'jazz':style);
 // Jazz: conventional major-key seventh chords, with dominant seventh on V.
 if(style==='jazz')q=['maj9','m9','m7','maj7','9','m7','m7b5'][i];
 if(style==='minor'){q=['m','dim','maj','m','7','maj','dim'][i];}
 return chordObj(state.key+s[i],q,-1,degree)}
function diatonicChordsForScale(){let scale=scaleSteps();return scale.map((s,i)=>chordObj(state.key+s,degreeQuality(scale,i,'jazz'),-1,i+1))}
function renderStudio(){saveLocal();const c=currentChord(),notes=midiNotes(c);$('#selected-chord').textContent=chordText(c);$('#chord-formula').textContent='Rumus '+(QUALITY[c.quality]?.formula||'1 · 3 · 5');$('#left-hand').textContent=notes.left.map(shortName).join(' · ');$('#right-hand').textContent=notes.right.map(shortName).join(' · ');$('#heard-as').textContent='Suara yang keluar: '+chordText(transposeChord(c,state.transpose));$('#transpose-value').textContent=(state.transpose>0?'+':'')+state.transpose;$('#keyboard-caption').textContent=state.transpose!==0?'Tekan '+chordText(c)+' → suara '+chordText(transposeChord(c,state.transpose)):'Klik tuts untuk bunyi';const scale=scaleSteps();$('#scale-notes').textContent=scale.map(i=>noteName(state.key+i)).join('  ·  ');$('#scale-degrees').innerHTML=scale.map((_,i)=>`<span>${['1','2','3','4','5','6','7'][i]}</span>`).join('');const degreeLabels=['TONIC','SUPERTONIC','MEDIANT','SUBDOMINANT','DOMINANT','SUBMEDIANT','LEADING'];$('#diatonic-list').innerHTML=diatonicChordsForScale().map((d,i)=>`<button class="diatonic-row" data-degree="${i}"><span class="degree-chip">${state.scale==='minor'?ROM_MINOR[i]:ROM_MAJOR[i]}</span><strong>${chordText(d)}</strong><span class="function-label">${degreeLabels[i]}</span><span class="inline-play">▶</span></button>`).join('');paintPiano();}
const PIANO_MIN=21,PIANO_MAX=108;
const pianoWhites=Array.from({length:PIANO_MAX-PIANO_MIN+1},(_,i)=>PIANO_MIN+i).filter(m=>![1,3,6,8,10].includes(m%12));
function jumpToPiano(){/* Semua 88 tuts selalu terlihat; tidak perlu menggulir. */}
function createKeyboard(){
 const shell=$('#piano'),inner=document.createElement('div');inner.className='piano-inner';
 inner.style.cssText='display:flex;position:relative;width:100%;min-width:0;height:100%';
 const unit=100/pianoWhites.length;
 for(const m of pianoWhites){const b=document.createElement('button');b.className='white-key';b.type='button';b.dataset.midi=m;b.setAttribute('aria-label',shortName(m));b.style.cssText=`flex:0 0 ${unit}%;width:${unit}%;max-width:${unit}%;min-width:0`;b.textContent=shortName(m);inner.appendChild(b)}
 for(let m=PIANO_MIN;m<=PIANO_MAX;m++){
  if(![1,3,6,8,10].includes(m%12))continue;
  const before=pianoWhites.filter(x=>x<m).length,b=document.createElement('button');b.type='button';b.className='black-key';b.dataset.midi=m;
  b.setAttribute('aria-label',shortName(m));b.textContent=shortName(m);
  b.style.left=((before-.32)*unit)+'%';b.style.width=(unit*.64)+'%';b.style.minWidth='0';inner.appendChild(b);
 }
 shell.replaceChildren(inner);
 shell.addEventListener('pointerdown',e=>{const button=e.target.closest('[data-midi]');if(!button)return;e.preventDefault();playNote(Number(button.dataset.midi));});
}
function paintPiano(){const c=currentChord(),notes=midiNotes(c),l=new Set(notes.left),r=new Set(notes.right),scale=new Set(scaleSteps().map(i=>mod(i+state.key)));$$('#piano [data-midi]').forEach(el=>{const m=Number(el.dataset.midi);el.classList.toggle('is-left',chordGuideEnabled&&l.has(m));el.classList.toggle('is-right',chordGuideEnabled&&r.has(m));el.classList.toggle('in-scale',chordGuideEnabled&&scale.has(mod(m)));});}
// SVG geometry
function polar(x,y,r,a){const t=(a-90)*Math.PI/180;return [x+r*Math.cos(t),y+r*Math.sin(t)]}
function annular(cx,cy,r1,r2,a1,a2){const p1=polar(cx,cy,r2,a1),p2=polar(cx,cy,r2,a2),p3=polar(cx,cy,r1,a2),p4=polar(cx,cy,r1,a1);return `M ${p1.join(' ')} A ${r2} ${r2} 0 0 1 ${p2.join(' ')} L ${p3.join(' ')} A ${r1} ${r1} 0 0 0 ${p4.join(' ')} Z`}
function renderCircle(){let minor=state.circleMode==='minor';$$('[data-circle-mode]').forEach(b=>b.classList.toggle('active',b.dataset.circleMode===state.circleMode));let baseMajor=minor?mod(state.key+3):state.key;const majorName=noteName(baseMajor),minorName=noteName(baseMajor+9);$('#circle-key-big').innerHTML=(minor?minorName:majorName)+' <span>'+(minor?'minor':'major')+'</span>';$('#relative-key').textContent=minor?majorName+' major':minorName+' minor';$('#circle-description').textContent=minor?'Keluarga nada minor dan progresi yang lebih emosional.':'Nada di satu keluarga bisa berpindah dengan natural.';
 const chords=(minor?Array.from({length:7},(_,i)=>diatonicChord(i+1,'minor')):Array.from({length:7},(_,i)=>diatonicChord(i+1,'major')));
 $('#circle-family').innerHTML=chords.map((c,i)=>`<button class="family-chord" data-family="${i}"><span>${minor?ROM_MINOR[i]:ROM_MAJOR[i]}</span>${chordText(c)}</button>`).join('');
 let svg=`<defs><radialGradient id="globeCore"><stop stop-color="#1c3c63"/><stop offset=".55" stop-color="#172b49"/><stop offset="1" stop-color="#0e1a33"/></radialGradient><linearGradient id="ringColor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6cdbd1"/><stop offset="1" stop-color="#836fea"/></linearGradient><filter id="halo"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
 svg+=`<circle cx="320" cy="320" r="283" fill="#101d32" stroke="#334763" stroke-width="1"/><circle cx="320" cy="320" r="270" fill="none" stroke="#67dfd4" stroke-opacity=".27" stroke-width="2"/><circle cx="320" cy="320" r="235" fill="none" stroke="#7290b8" stroke-opacity=".15" stroke-dasharray="3 9"/>`;
 // decorative globe longitude and latitude arcs (non-interactive)
 svg+=`<g opacity=".20" pointer-events="none"><circle cx="320" cy="320" r="149" fill="url(#globeCore)" stroke="#7a83d4" stroke-width="1"/><ellipse cx="320" cy="320" rx="54" ry="147" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="105" ry="147" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="147" ry="59" fill="none" stroke="#61a1c8"/><ellipse cx="320" cy="320" rx="147" ry="112" fill="none" stroke="#61a1c8"/></g>`;
 FIFTHS.forEach((pc,i)=>{const a1=-15+i*30,a2=a1+30;let sel=pc===baseMajor;svg+=`<path class="wheel-slice" data-wheel="${i}" data-inner="0" d="${annular(320,320,222,268,a1+.7,a2-.7)}" fill="${sel?'#254d5b':'#192b43'}" stroke="${sel?'#74eddf':'#314960'}" stroke-width="${sel?2:1}"/>`;
 const pt=polar(320,320,245,i*30);svg+=`<text class="wheel-label ${sel?'active':''}" x="${pt[0]}" y="${pt[1]+5}" text-anchor="middle" font-size="${sel?18:15}">${noteName(pc)}</text>`;
 const rel=mod(pc+9),selMin=minor&&rel===state.key,p=polar(320,320,185,i*30);svg+=`<path class="wheel-slice" data-wheel="${i}" data-inner="1" d="${annular(320,320,165,209,a1+.7,a2-.7)}" fill="${selMin?'#493969':'#22243d'}" stroke="${selMin?'#bc99fa':'#4b4a70'}" stroke-width="${selMin?2:1}"/><text class="wheel-label minor-label ${selMin?'active':''}" x="${p[0]}" y="${p[1]+4}" text-anchor="middle">${noteName(rel)}m</text>`;
 });
 svg+=`<g pointer-events="none"><circle cx="320" cy="320" r="137" fill="#102036a1" stroke="#6a9ebd" stroke-opacity=".24"/><circle cx="320" cy="320" r="118" fill="none" stroke="#6293b2" stroke-opacity=".18" stroke-dasharray="2 8"/><text x="320" y="282" text-anchor="middle" class="orbit-center-small">CURRENT KEY</text><text x="320" y="349" text-anchor="middle" class="orbit-center-big">${minor?minorName:majorName}</text><text x="320" y="377" text-anchor="middle" class="orbit-center-small">${minor?'MINOR':'MAJOR'} • ${SCALES[state.scale].label.toUpperCase()}</text><path d="M302 404 L320 418 L338 404" fill="none" stroke="#62d7d2" stroke-width="2" opacity=".6"/></g>`;
 svg+=`<circle cx="320" cy="320" r="289" fill="none" stroke="#5879a7" stroke-opacity=".14" stroke-dasharray="4 11"/>`;$('#fifths-svg').innerHTML=svg;}
function changeKey(key,scale=null){const oldKey=state.key;state.key=mod(key);if(scale)state.scale=scale;const shift=mod(state.key-oldKey);if(shift)state.progression=state.progression.map(c=>c.degree?journeyRootChord(c.degree):transposeChord(c,shift));$('#global-key').value=state.key;$('#global-scale').value=state.scale;renderStudio();renderCircle();renderJourney();renderLearning();renderCheatSheet();}
function journeyRootChord(degree,style=state.style){return diatonicChord(degree,style)}
function setProgression(degrees){state.progression=degrees.map(d=>journeyRootChord(d));renderJourney()}
function setPreset(preset){const patterns={1452:[1,4,5,2],1564:[1,5,6,4],251:[2,5,1],1645:[1,6,4,5]};setProgression(patterns[preset]||[1,4,5,2]);$$('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===preset));}
function progressionStyleInfo(degree){const roman=(state.style==='minor'?ROM_MINOR:ROM_MAJOR)[degree-1];return roman}
function getSuggestions(){const last=state.progression.at(-1);const deg=last?.degree||state.start;const table=state.style==='minor'?HARMONY_MINOR:state.style==='jazz'?HARMONY_JAZZ:HARMONY_MAJOR;let arr=table[deg].map((d,i)=>({chord:journeyRootChord(d),degree:d,why:ROUTE_HINTS[d],label:i===0?'Paling natural':i===1?'Alternatif enak':i===2?'Coba warna lain':'Jalur baru'}));
 if(state.style==='jazz') {const tonic=state.key;const special=deg===2?chordObj(tonic+7,'7b9',-1,null):deg===5?chordObj(tonic+1,'7',-1,null):deg===1?chordObj(tonic+9,'7',-1,null):chordObj(tonic+2,'7',-1,null);arr.push({chord:special,degree:null,why:deg===5?'Substitusi tritone: dominant alternatif yang mengarah ke I.':'Secondary dominant: memberi dorongan kuat ke chord tujuan.',label:'Jazz detour'});}
 return arr;}
function renderRouteSvg(){const last=state.progression.at(-1)||journeyRootChord(state.start),suggestions=graphSuggestions;let svg=`<defs><linearGradient id="linkGradient"><stop stop-color="#55d7d1"/><stop offset="1" stop-color="#9676df"/></linearGradient><filter id="blurGlow"><feGaussianBlur stdDeviation="5"/></filter></defs><g opacity=".13">${[50,100,150,200,250,300,350,400,450,500,550].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="350" stroke="#9ab6d4" stroke-dasharray="2 14"/>`).join('')}${[50,100,150,200,250,300].map(y=>`<line x1="0" y1="${y}" x2="600" y2="${y}" stroke="#9ab6d4" stroke-dasharray="2 14"/>`).join('')}</g>`;
 const target=suggestions.map((s,i)=>({x:338,y:43+(i*(265/Math.max(1,suggestions.length-1))),s,i}));const root={x:112,y:175};target.forEach(t=>{let p=`M ${root.x+44} ${root.y} C 240 ${root.y},242 ${t.y},${t.x-48} ${t.y}`;svg+=`<path d="${p}" fill="none" stroke="#73dcd7" stroke-opacity=".13" stroke-width="9" filter="url(#blurGlow)"/><path class="path-graph-line" d="${p}" stroke="url(#linkGradient)"/><path d="M ${t.x+45} ${t.y} C ${t.x+80} ${t.y},${t.x+90} ${t.y+12},${t.x+118} ${t.y+12}" fill="none" stroke="#53698a" stroke-width="1.2" stroke-dasharray="3 7"/><circle cx="${t.x+118}" cy="${t.y+12}" r="4" fill="#637694"/>`});
 svg+=`<circle cx="${root.x}" cy="${root.y}" r="55" fill="#21565c" opacity=".17" filter="url(#blurGlow)"/><circle cx="${root.x}" cy="${root.y}" r="47" fill="#1e4653" stroke="#61e4d5" stroke-width="2"/><text x="${root.x}" y="${root.y-5}" text-anchor="middle" class="path-graph-label">${chordText(last)}</text><text x="${root.x}" y="${root.y+15}" text-anchor="middle" class="path-graph-small">${last.degree?progressionStyleInfo(last.degree):'ALT'}</text>`;
 target.forEach(t=>{svg+=`<g class="route-option-node" data-route="${t.i}" tabindex="0" role="button" aria-label="Pilih chord ${chordText(t.s.chord)}"><circle class="node-circle" cx="${t.x}" cy="${t.y}" r="34" fill="#252c4b" stroke="#716da9" stroke-width="1.5"/><text x="${t.x}" y="${t.y+4}" text-anchor="middle" class="path-graph-label" style="font-size:${chordText(t.s.chord).length>7?12:15}px">${chordText(t.s.chord)}</text></g>`});
 $('#route-svg').innerHTML=svg;}
function renderJourney(){saveLocal();const chords=state.progression;$('#progression-count').textContent=chords.length+' CHORD';$('#progression-track').innerHTML=chords.length?chords.map((c,i)=>`${i?'<span class="progression-arrow">→</span>':''}<button class="progression-chip" data-existing="${i}">${chordText(c)}<span>${c.degree?progressionStyleInfo(c.degree):'jazz'}</span></button>`).join(''):'<span class="empty-track">Pilih titik awal atau jalur cepat untuk mulai.</span>';
 graphSuggestions=getSuggestions();$('#route-options').innerHTML=graphSuggestions.map((s,i)=>`<button class="route-option" data-add-route="${i}"><span class="route-roman">${s.degree?progressionStyleInfo(s.degree):'♯'}</span><span><strong>${chordText(s.chord)}</strong><small>${s.label}</small></span></button>`).join('');renderRouteSvg();let last=chords.at(-1),d=last?.degree;$('#journey-insight').textContent=last?`${chordText(last)} — mau ke mana lagi?`:'Mulai dari chord apa?';$('#journey-explain').textContent=d?ROUTE_HINTS[d]+' Pilih salah satu cabang untuk lanjut.':'Pilih jalur cepat, atau tentukan titik awal dari daftar.';$('#journey-style').value=state.style;$('#journey-start').value=state.start;}
function addSuggestion(index){const s=graphSuggestions[index];if(!s)return;state.progression.push({...s.chord});$$('.preset').forEach(b=>b.classList.remove('active'));renderJourney();playChord(s.chord)}
function playProgression(){if(!state.progression.length){toast('Belum ada chord dalam jalur.');return}const bpm=Number($('#bpm').value),step=60/bpm*4,sequence=++playSerial;state.progression.forEach((c,i)=>playChord(c,i*step,Math.min(2.1,step*.81)));toast(`Memutar ${state.progression.length} chord · ${bpm} BPM`);}
function downloadFile(name,bytes,type){const blob=new Blob([bytes],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}
function midiVar(n){let bytes=[n&127];while(n>>=7)bytes.unshift((n&127)|128);return bytes}
function writeMidi(){const ppq=480,bpm=Number($('#bpm').value),seq=state.progression;if(!seq.length){toast('Buat jalur chord dulu sebelum ekspor.');return}let events=[];function push(t,bytes,priority=1){events.push({t,bytes,priority})}push(0,[0xFF,0x51,3,...[(60000000/bpm>>16)&255,(60000000/bpm>>8)&255,(60000000/bpm)&255]]);push(0,[0xC0,0]);seq.forEach((c,i)=>{let all=midiNotes(transposeChord(c,state.transpose)),beat=i*ppq*4;[...new Set([...all.left,...all.right])].forEach(n=>{let v=Math.max(40,Math.min(100,72+(n<55?-8:0)));push(beat,[0x90,n,v],1);push(beat+ppq*3.3,[0x80,n,0],0)})});events.sort((a,b)=>a.t-b.t||a.priority-b.priority);let tr=[],prev=0;for(const e of events){tr.push(...midiVar(Math.round(e.t-prev)),...e.bytes);prev=e.t}tr.push(0,0xFF,0x2F,0);function u32(x){return [(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255]}let data=new Uint8Array([...Array.from('MThd').map(x=>x.charCodeAt(0)),...u32(6),0,0,0,1,(ppq>>8)&255,ppq&255,...Array.from('MTrk').map(x=>x.charCodeAt(0)),...u32(tr.length),...tr]);downloadFile('KULIKIN_Progression.mid',data,'audio/midi');toast('File MIDI berhasil dibuat.');}
// Music reading & notation. Noteheads and staves generated as SVG (no image assets).
const NATURAL_LETTERS=['C','D','E','F','G','A','B'];
function pitchInfo(midi){const pc=mod(midi),name=NOTE_LABELS[pc],letter=name[0],octave=Math.floor(midi/12)-1,acc=name.includes('#')?'♯':name.includes('b')?'♭':'';return {letter,octave,acc,name:name+octave}}
function naturalStep(letter,oct){return oct*7+NATURAL_LETTERS.indexOf(letter)}
function staffY(midi,clef='treble'){const p=pitchInfo(midi),baseline=clef==='treble'?160:288,ref=clef==='treble'?naturalStep('E',4):naturalStep('G',2);return baseline-(naturalStep(p.letter,p.octave)-ref)*10}
function drawStaffLines(startX=100,endX=680){let s='';for(let y=80;y<=160;y+=20)s+=`<line x1="${startX}" x2="${endX}" y1="${y}" y2="${y}" stroke="#647b93" stroke-width="1.4"/>`;for(let y=208;y<=288;y+=20)s+=`<line x1="${startX}" x2="${endX}" y1="${y}" y2="${y}" stroke="#647b93" stroke-width="1.4"/>`;return s}
function noteSvg(midi,x,clef='treble',active=false,scale=1){const y=staffY(midi,clef),base=clef==='treble'?160:288,top=clef==='treble'?80:208;let ledgers='';if(y>base+4){for(let ly=base+20;ly<=y+2;ly+=20)ledgers+=`<line x1="${x-19*scale}" x2="${x+19*scale}" y1="${ly}" y2="${ly}" stroke="#475e78" stroke-width="1.5"/>`;}if(y<top-4){for(let ly=top-20;ly>=y-2;ly-=20)ledgers+=`<line x1="${x-19*scale}" x2="${x+19*scale}" y1="${ly}" y2="${ly}" stroke="#475e78" stroke-width="1.5"/>`;}const p=pitchInfo(midi);let accidental=p.acc?`<text x="${x-25}" y="${y+6}" font-size="24" font-family="Georgia" fill="#52728c">${p.acc}</text>`:'';return `${ledgers}${accidental}<ellipse class="${active?'staff-active':'staff-note'}" cx="${x}" cy="${y}" rx="${12*scale}" ry="${8*scale}" transform="rotate(-18 ${x} ${y})"/><line x1="${x+10*scale}" x2="${x+10*scale}" y1="${y-3}" y2="${y-60}" stroke="${active?'#179d9f':'#263650'}" stroke-width="2"/>`}
function quizSvg(midi){const y=staffY(midi,'treble');return `<svg viewBox="0 0 240 130" style="max-width:240px;width:100%;height:100%;" aria-label="Tebak nada ini"><rect width="240" height="130" fill="none"/>${[20,40,60,80,100].map(y=>`<line x1="22" y1="${y}" x2="219" y2="${y}" stroke="#8da1b4" stroke-width="1.3"/>`).join('')}<text x="37" y="98" font-size="92" font-family="Georgia" fill="#b2c5df">𝄞</text>${(()=>{let step=(naturalStep(pitchInfo(midi).letter,pitchInfo(midi).octave)-naturalStep('E',4)),qy=100-step*10,lines='';if(qy>100){for(let a=120;a<=qy;a+=20)lines+=`<line x1="114" x2="154" y1="${a}" y2="${a}" stroke="#8da1b4"/>`;}if(qy<20){for(let a=0;a>=qy;a-=20)lines+=`<line x1="114" x2="154" y1="${a}" y2="${a}" stroke="#8da1b4"/>`;}return `${lines}<ellipse cx="135" cy="${qy}" rx="12" ry="7.5" transform="rotate(-18 135 ${qy})" fill="#6ce6d6"/><line x1="145" y1="${qy-3}" x2="145" y2="${qy-47}" stroke="#6ce6d6" stroke-width="2"/>`})()}</svg>`}
function renderLearning(){let lesson=state.lesson;$$('.lesson-tab').forEach(b=>b.classList.toggle('active',b.dataset.lesson===lesson));const texts={notes:'Klik sebuah nada. Perhatikan letaknya di garis paranada dan tuts piano.',chords:'Chord dibuat dari beberapa nada yang dimainkan bersamaan. Coba ganti chord di Piano Studio.',rhythm:'Kenali lama bunyi not. Tekan contoh untuk mendengarkan ketukannya.'};$('#lesson-intro').textContent=texts[lesson];let svg=`<rect x="0" y="0" width="750" height="315" fill="#f1f5fa" rx="12"/>${drawStaffLines(112,700)}<text x="20" y="75" class="staff-label">TREBLE</text><text x="22" y="204" class="staff-label">BASS</text><text x="66" y="158" font-size="89" font-family="Georgia" fill="#253c58">𝄞</text><text x="75" y="288" font-size="84" font-family="Georgia" fill="#253c58">𝄢</text>`;
 if(lesson==='notes'){let m=state.lessonNote,clef=m<60?'bass':'treble';svg+=`<circle cx="370" cy="${staffY(m,clef)}" r="34" fill="#5ae2d1" opacity=".12"/>${noteSvg(m,370,clef,true,1.12)}<text x="516" y="155" font-size="38" font-family="Inter,Segoe UI,sans-serif" font-weight="800" fill="#23435d">${shortName(m)}</text><text x="517" y="178" class="staff-label">${clef==='bass'?'TANGAN KIRI':'TANGAN KANAN'}</text>`;}
 if(lesson==='chords'){const c=currentChord(),notes=midiNotes(c);notes.left.forEach((m,i)=>svg+=noteSvg(m,300+i*23,'bass',true,.84));notes.right.forEach((m,i)=>svg+=noteSvg(m,380+i*24,'treble',true,.84));svg+=`<text x="530" y="158" font-size="32" font-weight="800" fill="#25435b">${chordText(c)}</text>`;}
 if(lesson==='rhythm'){svg+=`<text x="155" y="140" font-size="110" font-family="Georgia" fill="#263650">𝅝</text><text x="317" y="140" font-size="108" font-family="Georgia" fill="#263650">𝅗𝅥</text><text x="478" y="140" font-size="108" font-family="Georgia" fill="#263650">♩</text><text x="624" y="140" font-size="109" font-family="Georgia" fill="#263650">♪</text>${[['1 not penuh',158],['1/2 not',310],['1/4 not',473],['1/8 not',613]].map(([t,x])=>`<text x="${x}" y="183" class="staff-label" text-anchor="middle">${t}</text>`).join('')}`;}
 svg+='<text x="114" y="303" class="staff-tiny">NOTASI STANDAR • GARIS DAN SPASI</text>';$('#staff-svg').innerHTML=svg;
 if(lesson==='notes'){$('#note-picker').innerHTML=[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72].map(m=>`<button data-lesson-note="${m}" class="${state.lessonNote===m?'active':''}">${shortName(m)}</button>`).join('');$('#lesson-explain').innerHTML=`<b>${shortName(state.lessonNote)}: ${state.lessonNote<60?'kunci F / bass':'kunci G / treble'}.</b> Lima garis paranada dibaca dari bawah ke atas. Kalau not bergerak naik satu spasi/garis, namanya juga naik satu tingkat. Klik not lain untuk melihat perbedaannya.`;}
 if(lesson==='chords'){$('#note-picker').innerHTML=`<button id="lesson-play-chord">▶ Dengarkan ${chordText(currentChord())}</button><button id="lesson-go-studio">Buka Piano Studio ↗</button>`;$('#lesson-explain').innerHTML=`<b>Chord ${chordText(currentChord())}</b> — tangan kiri: ${midiNotes(currentChord()).left.map(shortName).join(', ')}. Tangan kanan: ${midiNotes(currentChord()).right.map(shortName).join(', ')}. Not ditampilkan pada dua paranada.`;}
 if(lesson==='rhythm'){$('#note-picker').innerHTML=[{label:'4 ketuk',beats:4},{label:'2 ketuk',beats:2},{label:'1 ketuk',beats:1},{label:'½ ketuk',beats:.5}].map(o=>`<button data-beats="${o.beats}">▶ ${o.label}</button>`).join('');$('#lesson-explain').innerHTML='<b>Dalam birama 4/4:</b> not penuh = 4 ketuk, setengah = 2, seperempat = 1, seperdelapan = setengah ketuk. Gunakan tempo yang stabil untuk merasakannya.';}
 renderQuiz();}
function renderQuiz(){const q=state.quiz;$('#quiz-streak').textContent=q.streak+' benar berturut-turut';$('#quiz-score').textContent=q.correct+' / '+q.total;$('#quiz-note').innerHTML=quizSvg(q.midi);const opts=new Set([mod(q.midi)]);for(let k=1;opts.size<4;k++){opts.add(mod(q.midi+k*2+1))}const possible=[...opts].sort((a,b)=>a-b);$('#quiz-options').innerHTML=possible.map(pc=>`<button data-answer="${pc}" ${q.answered?'disabled':''} class="${q.answered?(pc===mod(q.midi)?'correct':''):''}">${noteName(pc)}</button>`).join('');}
function nextQuiz(){const candidates=[60,62,64,65,67,69,71,72,74,76];let before=state.quiz.midi;let next=candidates[Math.floor(Math.random()*candidates.length)];if(next===before)next=candidates[(candidates.indexOf(next)+3)%candidates.length];state.quiz.midi=next;state.quiz.answered=false;renderQuiz();$('#quiz-feedback').textContent='Pilih jawaban untuk mulai.'}
function checkAnswer(pc){let q=state.quiz;if(q.answered)return;let good=pc===mod(q.midi);q.total++;q.correct+=good?1:0;q.streak=good?q.streak+1:0;q.answered=true;renderQuiz();const button=$(`#quiz-options [data-answer="${pc}"]`);if(button&&!good)button.classList.add('incorrect');$('#quiz-feedback').textContent=good?'Pas! Itu nada '+shortName(q.midi)+'.':'Belum tepat. Jawabannya '+shortName(q.midi)+'. Coba soal berikutnya.';if(good)playNote(q.midi)}
function playRhythm(beats){const bpm=100,ctx=audioContext();if(!ctx)return;const start=ctx.currentTime+.03,tick=60/bpm;for(let i=0;i<4;i++){tone(i===0?84:79,start+i*tick,.1,.11)}tone(60,start,Math.max(.25,beats*tick*.9),.25);toast(`Nada ditahan ${beats} ketuk · tempo ${bpm} BPM`)}
// ------------------------------------------------------------
// CHEAT SHEET: a concise, interactive reference in our own design.
// ------------------------------------------------------------
const INTERVAL_NAMES=['Unison','Minor 2nd','Major 2nd','Minor 3rd','Major 3rd','Perfect 4th','Tritone','Perfect 5th','Minor 6th','Major 6th','Minor 7th','Major 7th','Octave'];
const MODE_REFERENCES=[
 {name:'Ionian',degree:0,steps:[0,2,4,5,7,9,11],desc:'Mayor yang stabil',scale:'major'},
 {name:'Dorian',degree:1,steps:[0,2,3,5,7,9,10],desc:'Minor · nada 6 terang',scale:'dorian'},
 {name:'Phrygian',degree:2,steps:[0,1,3,5,7,8,10],desc:'Minor yang gelap',scale:'phrygian'},
 {name:'Lydian',degree:3,steps:[0,2,4,6,7,9,11],desc:'Mayor · #4',scale:'lydian'},
 {name:'Mixolydian',degree:4,steps:[0,2,4,5,7,9,10],desc:'Dominant / funky',scale:'mixolydian'},
 {name:'Aeolian',degree:5,steps:[0,2,3,5,7,8,10],desc:'Natural minor',scale:'minor'},
 {name:'Locrian',degree:6,steps:[0,1,3,5,6,8,10],desc:'Diminished / tegang',scale:'locrian'}
];
function renderCheatSheet(){
 const s=scaleSteps(),minor=['minor','harmonic_minor','melodic_minor'].includes(state.scale),key=noteName(state.key);
 $('#cheat-key').textContent=key+' '+SCALES[state.scale].label;
 $('#cheat-relative').textContent=minor?'Relatif mayor: '+noteName(state.key+3)+' mayor':'Relatif minor: '+noteName(state.key+9)+' minor';
 $('#cheat-scale').innerHTML=s.map((step,i)=>`<button class="cheat-note" data-cheat-note="${60+state.key+step}"><b>${noteName(state.key+step)}</b><small>${i+1}</small></button>`).join('');
 $('#cheat-degree').innerHTML=s.map((step,i)=>`<span>${i+1} = ${step} semitone</span>`).join('');
 $('#cheat-intervals').innerHTML=INTERVAL_NAMES.map((name,i)=>`<button class="interval-row" data-cheat-note="${60+state.key+i}"><span>${i} semitone</span><b>${name}</b><strong>${noteName(state.key+i)}</strong></button>`).join('');
 const romans=minor?ROM_MINOR:ROM_MAJOR;
 const triples=s.map((_,i)=>{
  const triad=chordObj(state.key+s[i],degreeQuality(s,i,'major'));
  const intervals=[0,2,4,6].map(d=>s[(i+d)%7]+(i+d>=7?12:0)-s[i]);
  const sev=(intervals[1]===4&&intervals[2]===7&&intervals[3]===11)?'maj7':(intervals[1]===3&&intervals[2]===7&&intervals[3]===10)?'m7':(intervals[1]===3&&intervals[2]===6&&intervals[3]===10)?'m7b5':(intervals[1]===4&&intervals[3]===10)?'7':'dim7';
  return {triad,seventh:chordObj(triad.root,sev)};
 });
 $('#cheat-diatonic').innerHTML=triples.map((x,i)=>`<div class="cheat-chord-row"><b>${romans[i]}</b><button data-cheat-chord="${i}-0">${chordText(x.triad)} <small>${chordTones(x.triad).map(noteName).join(' · ')}</small></button><button data-cheat-chord="${i}-1">${chordText(x.seventh)} <small>${chordTones(x.seventh).map(noteName).join(' · ')}</small></button></div>`).join('');
 const base=state.key;
 $('#cheat-modes').innerHTML=MODE_REFERENCES.map((m,i)=>`<button class="mode-card" data-mode-index="${i}"><span class="mode-index">0${i+1}</span><b>${noteName(base+s[i])} ${m.name}</b><small>${m.desc}</small><span>${m.steps.map(v=>noteName(base+s[i]+v)).join(' · ')}</span></button>`).join('');
 $('#cheat-diatonic').onclick=e=>{const btn=e.target.closest('[data-cheat-chord]');if(!btn)return;const [i,seven]=btn.dataset.cheatChord.split('-').map(Number);const c=seven?triples[i].seventh:triples[i].triad;playChord(c);state.root=c.root;state.quality=c.quality;state.bass=-1;$('#root-note').value=c.root;$('#chord-quality').value=c.quality;$('#bass-note').value=-1;renderStudio()};
 $('#cheat-modes').onclick=e=>{const btn=e.target.closest('[data-mode-index]');if(!btn)return;const m=MODE_REFERENCES[Number(btn.dataset.modeIndex)];let root=base+s[m.degree];changeKey(root,m.scale);playNote(60+mod(root))};
}

// ------------------------------------------------------------
// TRANSKRIPSI LOKAL: MIDI import, single-pitch estimate, note editor.
// Audio tab hanya melalui getDisplayMedia dengan persetujuan pengguna; tidak membaca iframe lintas-origin.
// ------------------------------------------------------------
let midiVolumePercent=200;
function midiPreviewGain(){return midiVolumePercent/100;}
function midiExportVelocity(){return Math.max(1,Math.min(127,Math.round(60+25*midiPreviewGain())));}
let rollTranspose=0; // Semitone offset for piano roll only; imported/analyzed notes remain unchanged.
const rollPitch=note=>note.midi+rollTranspose;
function loadRollTranspose(){try{const saved=Number(localStorage.getItem('kulikin-roll-transpose-v1'));if(Number.isInteger(saved))rollTranspose=Math.max(-12,Math.min(12,saved));}catch(_){}}
function changeRollTranspose(next){
 const shift=Math.max(-12,Math.min(12,Math.round(Number(next)||0)));
 if(shift===rollTranspose)return;
 const resume=rollState.playing;
 if(resume)stopRoll();
 rollTranspose=shift;
 try{localStorage.setItem('kulikin-roll-transpose-v1',String(shift));}catch(_){}
 renderRoll();
 if(resume)playRoll();
}
function updateRollTransposeUI(){
 const shift=rollTranspose;
 $('#roll-shift-label').textContent=(shift>0?'+':'')+shift;
 $('#roll-shift-down').disabled=shift<=-12;
 $('#roll-shift-up').disabled=shift>=12;
 $('#roll-shift-reset').disabled=shift===0;
 const hidden=rollState.notes.filter(n=>rollPitch(n)<ROLL_LOW||rollPitch(n)>ROLL_HIGH).length;
 const explanation=shift===0?'Nada asli':(shift>0?`Naik ${shift} semitone`:`Turun ${Math.abs(shift)} semitone`);
 $('#roll-shift-status').textContent=explanation+' · suara, tampilan, dan MIDI ekspor ikut berubah'+(hidden?` · ${hidden} not di luar 88 tuts`:'');
}
const rollState={notes:[],seconds:16,playing:false,timers:[],raf:0,playStarted:0,playBase:0,playhead:-2.8,rate:1,objectURL:null,sourceBuffer:null,filename:'',worker:null,sourcePCM:null,sourceRate:11025};
const ROLL_H=20,ROLL_LOW=21,ROLL_HIGH=108;
let FALL_W=26,FALL_B=17,FALL_WIDTH=1352;const FALL_H=460,FALL_LOW=21,FALL_HIGH=108,FALL_LOOKAHEAD=3.15;
const fallWhites=Array.from({length:FALL_HIGH-FALL_LOW+1},(_,i)=>FALL_LOW+i).filter(n=>![1,3,6,8,10].includes(n%12));
const fallAll=Array.from({length:FALL_HIGH-FALL_LOW+1},(_,i)=>FALL_LOW+i);

let fallLastActive='',fallCanvasReady=false;
function fallPosition(midi){
 const idx=fallWhites.indexOf(midi);if(idx>=0)return {x:idx*FALL_W,w:FALL_W,black:false};
 const before=fallWhites.filter(n=>n<midi).length;return {x:before*FALL_W-FALL_B/2,w:FALL_B,black:true};
}
function setupFallingKeyboard(){
 if(fallCanvasReady)return;const canvas=$('#fall-canvas'), keys=$('#fall-keys');
 if(!canvas||!keys)return;
 canvas.width=FALL_WIDTH;canvas.height=FALL_H;canvas.style.width=FALL_WIDTH+'px';canvas.style.height=FALL_H+'px';
 const stage=$('#fall-stage');stage.style.width='100%';keys.style.width='100%';
 for(const midi of fallWhites){const position=fallPosition(midi),b=document.createElement('button');
  b.className='fall-white-key';b.type='button';b.dataset.fallMidi=midi;
  b.style.left=position.x+'px';b.style.width=position.w+'px';
  b.title=shortName(midi);b.textContent=mod(midi)===0?shortName(midi):'';keys.appendChild(b);}
 for(const midi of fallAll.filter(m=>[1,3,6,8,10].includes(m%12))){const position=fallPosition(midi),b=document.createElement('button');
  b.className='fall-black-key';b.type='button';b.dataset.fallMidi=midi;
  b.style.left=position.x+'px';b.style.width=position.w+'px';b.title=shortName(midi);keys.appendChild(b);}
 keys.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-fall-midi]');if(!b)return;e.preventDefault();const midi=Number(b.dataset.fallMidi);tone(midi,null,.7,.30);flashKey(midi);b.classList.add('is-active');setTimeout(()=>{if(!rollState.playing)b.classList.remove('is-active')},300);});
 fallCanvasReady=true;requestAnimationFrame(resizeFallCanvas);
}
function resizeFallCanvas(){
 const panel=$('#fall-scroller'),canvas=$('#fall-canvas'),stage=$('#fall-stage'),keys=$('#fall-keys');
 if(!panel||!canvas||!stage||!keys||!fallCanvasReady)return;
 FALL_WIDTH=Math.max(300,Math.floor(panel.clientWidth-2));FALL_W=FALL_WIDTH/fallWhites.length;FALL_B=FALL_W*.64;
 canvas.width=FALL_WIDTH;canvas.height=FALL_H;canvas.style.width='100%';canvas.style.height=FALL_H+'px';
 stage.style.width='100%';stage.style.minWidth='0';keys.style.width='100%';
 for(const b of keys.querySelectorAll('[data-fall-midi]')){const pos=fallPosition(Number(b.dataset.fallMidi));b.style.left=(pos.x/FALL_WIDTH*100)+'%';b.style.width=(pos.w/FALL_WIDTH*100)+'%';}
 drawFallingRoll();
}
function fallTime(sec){const x=Math.max(0,sec);return String(Math.floor(x/60)).padStart(2,'0')+':'+String(Math.floor(x%60)).padStart(2,'0')}
function fallDuration(){return Math.max(1,rollState.seconds,rollState.notes.reduce((max,n)=>Math.max(max,n.start+n.duration),0));}
function drawFallingRoll(){
 const canvas=$('#fall-canvas');if(!canvas||!fallCanvasReady)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const w=FALL_WIDTH,h=FALL_H,now=rollState.playhead,pps=h/FALL_LOOKAHEAD;
 ctx.clearRect(0,0,w,h);
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0c142b');bg.addColorStop(1,'#0c2132');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(let i=0;i<fallWhites.length;i++){if(i%2===0){ctx.fillStyle='#18273d55';ctx.fillRect(i*FALL_W,0,FALL_W,h)}ctx.strokeStyle='#2c46635e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(i*FALL_W+.5,0);ctx.lineTo(i*FALL_W+.5,h);ctx.stroke();}
 for(const n of fallAll.filter(x=>[1,3,6,8,10].includes(x%12))){const {x,w:width}=fallPosition(n);ctx.fillStyle='#050a1b66';ctx.fillRect(x,0,width,h);}
 const first=Math.max(-4,Math.ceil(now));for(let sec=first;sec<=now+FALL_LOOKAHEAD;sec++){
  const y=h-(sec-now)*pps;if(y<0||y>h)continue;ctx.strokeStyle=sec%4===0?'#7a92be55':'#67819d22';ctx.lineWidth=sec%4===0?1.4:1;
  ctx.beginPath();ctx.moveTo(0,y+.5);ctx.lineTo(w,y+.5);ctx.stroke();
  if(sec>=0&&sec%4===0){ctx.fillStyle='#8baacc';ctx.font='11px system-ui';ctx.fillText(fallTime(sec),8,Math.max(13,y-5));}}
 for(const n of rollState.notes){const displayMidi=rollPitch(n);if(displayMidi<FALL_LOW||displayMidi>FALL_HIGH)continue;
  const yBottom=h-(n.start-now)*pps, yTop=h-(n.start+n.duration-now)*pps;
  if(yBottom<0||yTop>h)continue;
  const pos=fallPosition(displayMidi),x=pos.x+2,width=pos.w-4,top=Math.max(-2,yTop),bottom=Math.min(h+2,yBottom),height=Math.max(0,bottom-top);
  if(height<1)continue;
  const active=n.start<=now&&now<n.start+n.duration,low=displayMidi<60,manual=n.source==='manual',generated=['ai-generated','arranged'].includes(n.source);
  let topColor=generated?'#9cf7d1':manual?'#ffcc85':low?'#9ad2ff':'#c9a6ff',baseColor=generated?'#18a981':manual?'#e98a43':low?'#338cd3':'#8a58d9';
  const grad=ctx.createLinearGradient(x,top,x+width,top);grad.addColorStop(0,baseColor);grad.addColorStop(.55,topColor);grad.addColorStop(1,baseColor);
  ctx.fillStyle=grad;ctx.shadowBlur=active?18:6;ctx.shadowColor=generated?'#63ffc8bb':manual?'#ffbd75bb':low?'#5daafc88':'#c493ff88';
  ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,top,width,height,Math.min(5,height/2));else ctx.rect(x,top,width,height);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#ffffff7a';ctx.fillRect(x+2,top+2,Math.max(1,width-4),Math.min(2,height-2));
  if(height>30&&width>24){ctx.fillStyle='#101526';ctx.font='bold 10px system-ui';ctx.fillText(noteName(displayMidi),x+4,Math.min(bottom-5,top+17));}
 }
 if(!rollState.notes.length){
  ctx.textAlign='center';ctx.fillStyle='#a5c9d6';ctx.font='600 18px system-ui';ctx.fillText('Belum ada nada',w/2,h*.42);
  ctx.font='12px system-ui';ctx.fillStyle='#769caf';ctx.fillText('Tangkap audio tab atau unggah file audio, lalu klik Deteksi Audio → MIDI',w/2,h*.42+28);
  ctx.textAlign='left';
 }
 ctx.shadowColor='#58ebdc';ctx.shadowBlur=14;ctx.fillStyle='#65ffdf';ctx.fillRect(0,h-3,w,3);ctx.shadowBlur=0;
 const activeNotes=rollState.playing?rollState.notes.filter(n=>n.start<=now&&now<n.start+n.duration).map(n=>rollPitch(n)):[];
 const activeSet=new Set(activeNotes),signature=[...activeSet].sort((a,b)=>a-b).join(',');
 if(signature!==fallLastActive){$$('#fall-keys [data-fall-midi]').forEach(b=>b.classList.toggle('is-active',activeSet.has(Number(b.dataset.fallMidi))));fallLastActive=signature;}
 const end=fallDuration();$('#fall-current-time').textContent=fallTime(now)+' / '+fallTime(end);
 const seek=$('#fall-seek');seek.max=String(end);if(!seek.matches(':active'))seek.value=String(Math.max(0,Math.min(now,end)));
 $('#fall-counter').textContent=now<0?String(Math.ceil(-now))+' · mulai':rollState.playing?'● BERJALAN':'● SIAP';
}
function renderRoll(){
 const zoom=Number($('#roll-zoom').value),bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),length=Math.max(16,rollState.seconds+2),width=Math.ceil(length*zoom),height=(ROLL_HIGH-ROLL_LOW+1)*ROLL_H;
 const beat=60/bpm,beats=Math.ceil(length/beat);
 let grid=`<div class="roll-background" style="width:${width}px;height:${height}px"></div>`;
 for(let note=ROLL_HIGH;note>=ROLL_LOW;note--){const y=(ROLL_HIGH-note)*ROLL_H;grid+=`<div class="roll-row ${[1,3,6,8,10].includes(note%12)?'sharprow':''}" style="top:${y}px;width:${width}px"><span class="roll-note-label">${shortName(note)}</span></div>`}
 for(let i=0;i<=beats;i++){const x=i*beat*zoom;grid+=`<div class="roll-beat ${i%4===0?'is-bar':''}" style="left:${x}px;height:${height}px">${i%4===0?'<span class="roll-bar-number">'+(Math.floor(i/4)+1)+'</span>':''}</div>`}
 rollState.notes.forEach((n,i)=>{const displayMidi=rollPitch(n),x=Math.max(0,n.start*zoom),w=Math.max(9,n.duration*zoom-2),y=(ROLL_HIGH-displayMidi)*ROLL_H+2;if(displayMidi<ROLL_LOW||displayMidi>ROLL_HIGH)return;grid+=`<button class="roll-note ${n.source==='manual'?'manual':(['ai-generated','arranged'].includes(n.source)?'generated':'')}" data-roll-note="${i}" style="left:${x}px;top:${y}px;width:${w}px;height:${ROLL_H-3}px" title="${shortName(displayMidi)} · ${n.start.toFixed(2)}s (klik hapus)">${shortName(displayMidi)}</button>`});
 grid+=`<div id="roll-playhead" class="roll-playhead" style="left:${rollState.playhead*zoom}px;height:${height}px"></div>`;
 const el=$('#roll-track');el.style.width=width+'px';el.style.height=height+'px';el.innerHTML=grid;
 $('#roll-info').textContent=`${rollState.notes.length} nada · ${Math.round(length)} detik · editor tersedia`;
 updateRollTransposeUI();
 setupFallingKeyboard();drawFallingRoll();
}
function addRollNote(midi,start,duration=null,source='manual'){
 if(!Number.isFinite(midi)||!Number.isFinite(start)||midi<ROLL_LOW||midi>ROLL_HIGH)return;
 const bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),beat=60/bpm;
 rollState.notes.push({midi:Math.round(midi),start:Math.round(Math.max(0,start)/beat*4)/4*beat,duration:duration||beat,source});
 rollState.notes.sort((a,b)=>a.start-b.start||a.midi-b.midi);
 rollState.seconds=Math.max(rollState.seconds,start+(duration||beat)+1);renderRoll();
}
function stopRoll(){
 rollState.playing=false;for(const t of rollState.timers)clearTimeout(t);rollState.timers=[];
 cancelAnimationFrame(rollState.raf);rollState.raf=0;
 $('#roll-play').textContent='▶ Putar';fallLastActive='__stopped__';drawFallingRoll();
}
function playRoll(){
 if(rollState.playing){stopRoll();$('#roll-play').textContent='▶ Lanjutkan';return;}
 if(!rollState.notes.length){toast('Belum ada nada. Klik Contoh atau impor MIDI dulu.');return;}
 const ctx=audioContext();if(!ctx)return;
 stopRoll();const end=fallDuration();if(rollState.playhead>=end)rollState.playhead=-2.8;
 // Countdown makes the first bars visible as they fall toward the keys.
 if(rollState.playhead===0)rollState.playhead=-2.8;
 const begin=rollState.playhead,rate=rollState.rate;
 rollState.playing=true;$('#roll-play').textContent='❚❚ Jeda';rollState.playBase=begin;rollState.playStarted=performance.now();
 for(const n of rollState.notes){
  const noteEnd=n.start+n.duration;
  if(noteEnd<=begin || n.start>end)continue;
  const startDelay=Math.max(0,(n.start-begin)/rate)*1000;
  const remaining=Math.min(n.duration,noteEnd-Math.max(begin,n.start));
  const t=setTimeout(()=>{if(!rollState.playing)return;tone(rollPitch(n),null,Math.max(.12,remaining/rate),.28*midiPreviewGain());flashKey(rollPitch(n));},startDelay);
  rollState.timers.push(t);
 }
 const frame=()=>{
  if(!rollState.playing)return;
  rollState.playhead=rollState.playBase+(performance.now()-rollState.playStarted)/1000*rollState.rate;
  const marker=$('#roll-playhead');if(marker)marker.style.left=(Math.max(0,rollState.playhead)*Number($('#roll-zoom').value))+'px';
  drawFallingRoll();
  if(rollState.playhead>=end+.35){stopRoll();rollState.playhead=end;drawFallingRoll();return;}
  rollState.raf=requestAnimationFrame(frame);
 };frame();
}
function demoRoll(){
 stopRoll();rollState.notes=[];
 // Original four-bar example with left-hand bass, right-hand chords and a melody.
 const bars=[{bass:48,fifth:55,chord:[60,64,67,71],melody:[72,74,76,79]},
             {bass:45,fifth:52,chord:[57,60,64,69],melody:[76,74,72,69]},
             {bass:41,fifth:48,chord:[53,57,60,64],melody:[69,72,76,72]},
             {bass:43,fifth:50,chord:[55,59,62,65],melody:[71,74,77,74]}];
 const beat=60/110,add=(midi,start,duration)=>rollState.notes.push({midi,start,duration,source:'analyzed'});
 bars.forEach((b,i)=>{let t=i*beat*4;add(b.bass,t,beat*3.7);add(b.fifth,t,beat*2);
  b.chord.forEach(m=>add(m,t,beat*1.6));b.melody.forEach((m,k)=>add(m,t+k*beat,beat*.85));});
 rollState.notes.sort((a,b)=>a.start-b.start||a.midi-b.midi);
 rollState.seconds=16;rollState.playhead=-2.8;renderRoll();
 document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
 toast('Contoh lagu dua tangan siap. Klik Putar untuk melihat nada turun.');
}
function exportRollMidi(){
 if(!rollState.notes.length){toast('Belum ada nada untuk diekspor.');return}
 const bpm=Math.max(40,Math.min(240,Number($('#roll-bpm').value)||110)),ppq=480,mpq=Math.round(60000000/bpm),ticksPerSecond=ppq*bpm/60,events=[{t:0,priority:0,bytes:[0xFF,0x51,3,(mpq>>16)&255,(mpq>>8)&255,mpq&255]},{t:0,priority:0,bytes:[0xC0,0]}];
 for(const n of rollState.notes){const on=Math.round(n.start*ticksPerSecond),off=Math.round((n.start+n.duration)*ticksPerSecond);events.push({t:on,priority:1,bytes:[0x90,rollPitch(n),midiExportVelocity()]},{t:off,priority:0,bytes:[0x80,rollPitch(n),0]})}
 events.sort((a,b)=>a.t-b.t||a.priority-b.priority);let tr=[],t=0;
 for(const e of events){tr.push(...midiVar(e.t-t),...e.bytes);t=e.t}tr.push(0,0xff,0x2f,0);
 const d=x=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255];
 downloadFile('KULIKIN_Piano_Roll'+(rollTranspose?('_Transpose_'+(rollTranspose>0?'+':'')+rollTranspose):'')+'.mid',new Uint8Array([...Array.from('MThd').map(c=>c.charCodeAt(0)),...d(6),0,0,0,1,(ppq>>8)&255,ppq&255,...Array.from('MTrk').map(c=>c.charCodeAt(0)),...d(tr.length),...tr]),'audio/midi');toast('Piano roll tersimpan sebagai MIDI.');
}
// Impor MIDI mempertahankan identitas instrumen per track/channel.
function readMidiNotes(arraybuffer){
 const v=new DataView(arraybuffer);let p=0;
 const byte=()=>v.getUint8(p++),u16=()=>{let a=v.getUint16(p);p+=2;return a},u32=()=>{let a=v.getUint32(p);p+=4;return a};
 const str=n=>{let a='';for(let i=0;i<n;i++)a+=String.fromCharCode(byte());return a};
 const vlq=()=>{let n=0,b=0;do{b=byte();n=(n<<7)|(b&127)}while((b&128)&&p<v.byteLength);return n};
 if(str(4)!=='MThd')throw Error('Bukan file MIDI.');
 const hsize=u32(),format=u16(),ntr=u16(),division=u16();p=8+hsize;
 if(division&0x8000)throw Error('MIDI SMPTE belum didukung.');
 let events=[],tempos=[{tick:0,us:500000}];
 for(let tr=0;tr<ntr;tr++){
  if(str(4)!=='MTrk')break;
  const size=u32(),limit=p+size;let tick=0,runStatus=0,trackName='Track '+(tr+1);
  const playing=new Map(),programs=new Uint8Array(16);
  const trackEvents=[];
  while(p<limit){
   tick+=vlq();let status=byte();
   if(status<0x80){p--;status=runStatus;}else if(status<0xf0)runStatus=status;
   if(status===0xff){
    const kind=byte(),len=vlq(),metaStart=p;
    if(kind===0x51&&len===3){const us=(byte()<<16)|(byte()<<8)|byte();tempos.push({tick,us});}
    else if(kind===0x03&&len>0){const bytes=new Uint8Array(arraybuffer,metaStart,Math.min(len,150));trackName=new TextDecoder('utf-8').decode(bytes).replace(/[\u0000-\u001f]/g,' ').trim()||trackName;}
    p=metaStart+len;continue;
   }
   if(status===0xf0||status===0xf7){p+=vlq();continue;}
   const type=status&0xf0,chan=status&0x0f;
   if(type===0x90||type===0x80){
    const midi=byte(),vel=byte(),key=chan+':'+midi;
    if(type===0x90&&vel>0){
     if(playing.has(key)){const prev=playing.get(key);trackEvents.push({...prev,endTick:tick});}
     playing.set(key,{tick,midi,channel:chan,program:programs[chan],track:tr,velocity:vel});
    }else if(playing.has(key)){const note=playing.get(key);trackEvents.push({...note,endTick:tick});playing.delete(key)}
   }else if(type===0xc0){programs[chan]=byte();}
   else if(type===0xd0)p++;
   else if([0xa0,0xb0,0xe0].includes(type))p+=2;
   else throw Error('Event MIDI tidak dikenali.');
  }
  for(const ev of trackEvents)ev.trackName=trackName;
  events.push(...trackEvents);p=limit;
 }
 tempos.sort((a,b)=>a.tick-b.tick);
 const timeAt=tick=>{let at=0,old=0,rate=500000;for(const ev of tempos){if(ev.tick>tick)break;at+=(ev.tick-old)/division*rate/1000000;old=ev.tick;rate=ev.us}return at+(tick-old)/division*rate/1000000};
 return events.map(e=>({midi:e.midi,start:timeAt(e.tick),duration:Math.max(.08,timeAt(e.endTick)-timeAt(e.tick)),source:'midi',instrument:midiInstrumentGroup(e.program,e.channel,e.trackName),trackName:e.trackName,track:e.track,program:e.program,channel:e.channel,velocity:e.velocity}))
  .filter(e=>e.midi>=ROLL_LOW&&e.midi<=ROLL_HIGH).sort((a,b)=>a.start-b.start||a.midi-b.midi).slice(0,16000);
}
function midiInstrumentGroup(program,channel,trackName=''){
 if(channel===9)return 'drums';
 const name=trackName.toLowerCase();
 // MIDI program (General MIDI) is prioritized; track name helps when a track has no explicit program change.
 if(program===1)return 'piano';
 if(program>=2&&program<=23)return 'keyboard';
 if(program>=24&&program<=31)return 'guitar';
 if(program>=32&&program<=39)return 'bass';
 if(program>=40&&program<=55)return 'strings';
 if(program>=56&&program<=79)return 'lead';
 if(program>=80&&program<=103)return 'keyboard';
 if(program>=104&&program<=111)return 'lead';
 if(/synth|keyboard|keys|organ|epiano|e-piano|rhodes|electric piano|clav/i.test(name))return 'keyboard';
 if(/bass/i.test(name))return 'bass';
 if(/guitar|gtr/i.test(name))return 'guitar';
 if(/sax|horn|trumpet|flute|lead|melody|ewi/i.test(name))return 'lead';
 if(/string|brass|pad/i.test(name))return 'strings';
 if(/drum|percussion/i.test(name))return 'drums';
 return 'piano';
}

function openReference(){
 const raw=$('#source-link').value.trim(),target=$('#video-container');target.hidden=true;target.replaceChildren();
 if(!raw)return toast('Tempel link YouTube atau Instagram.');
 let url;try{url=new URL(raw)}catch{return toast('Format link tidak valid.')}if(url.protocol!=='https:')return toast('Gunakan link https.');
 const host=url.hostname.toLowerCase().replace(/^www\./,'');
 if(['youtube.com','m.youtube.com','youtu.be','music.youtube.com'].includes(host)){
  const id=host==='youtu.be'?url.pathname.slice(1).split('/')[0]:url.searchParams.get('v')||url.pathname.match(/\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
  if(!id||!/^[\w-]{11}$/.test(id))return toast('ID video YouTube tidak ditemukan.');
  const directLink='https://www.youtube.com/watch?v='+id;
  const local=location.protocol==='file:';
  const out=document.createElement('div');out.className='reference-actions';
  const a=document.createElement('a');a.className='reference-open';a.href=directLink;a.target='_blank';a.rel='noopener noreferrer';a.textContent='▶ Buka video di YouTube ↗';out.appendChild(a);
  const tip=document.createElement('span');tip.textContent=local?'File lokal: YouTube tidak mengizinkan pemutar tertanam tanpa alamat situs.':'Kalau pemutar ditolak YouTube, gunakan tombol buka video.';out.appendChild(tip);
  if(!local){
    const frame=document.createElement('iframe');
    const origin=location.origin&&location.origin!=='null'?'?origin='+encodeURIComponent(location.origin):'';
    frame.src='https://www.youtube.com/embed/'+id+origin;
    frame.title='Video referensi YouTube';frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.setAttribute('allow','accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');frame.allowFullscreen=true;
    target.appendChild(frame);
  }else{
    const message=document.createElement('div');message.className='video-file-message';
    message.innerHTML='<div class="video-file-icon">▶</div><strong>Video dibuka melalui YouTube</strong><p>Aplikasi sedang dijalankan dari folder lokal. Gunakan tombol di bawah supaya tidak muncul Error 153.</p>';
    target.appendChild(message);
  }
  target.appendChild(out);target.hidden=false;
  $('#source-feedback').textContent='Putar video di atas. Klik Rekam Video Ini, izinkan Tab ini (This Tab) + Bagikan audio tab, lalu Selesai Rekam dan Analisis Audio → MIDI.';
 }else if(host==='instagram.com'||host==='instagr.am'){
  if(!/^\/(reel|p|tv)\//.test(url.pathname))return toast('Gunakan link post atau Reel Instagram.');
  const out=document.createElement('div');out.className='reference-actions instagram-reference';
  const a=document.createElement('a');a.className='reference-open';a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Buka video di Instagram ↗';out.appendChild(a);
  target.appendChild(out);target.hidden=false;
  $('#source-feedback').textContent='Instagram tidak bisa diputar langsung di panel ini. Buka Instagram lewat tautan, lalu rekam tab tersebut atau unggah file audio.';
 }else toast('Yang didukung: YouTube dan Instagram.');
}
// Capture via browser tab sharing permission. Never download audio by URL or read iframe contents.
const captureState={stream:null,recorder:null,chunks:[],timer:null,start:0,stopping:false,lastError:''};
const CAPTURE_RATE=11025,CAPTURE_LIMIT_SEC=1800; // 30 menit; tidak dipotong diam-diam
function captureMessage(message){const el=$('#capture-status');if(el)el.textContent=message;}
function captureUI(recording){$('#capture-start').disabled=recording;$('#capture-stop').disabled=!recording;$('#tab-capture-panel').classList.toggle('is-recording',recording)}
async function startTabCapture(){
 if(captureState.stream)return;
 if(!navigator.mediaDevices?.getDisplayMedia||typeof MediaRecorder==='undefined'){
  captureMessage('Fitur tangkap tab tidak tersedia. Gunakan Chrome/Edge desktop lewat HTTPS atau pilih file audio.');return;
 }
 let stream;
 try{
  stream=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:'browser'},audio:{suppressLocalAudioPlayback:false},preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'exclude'});
 }catch(err){captureMessage(err.name==='NotAllowedError'?'Izin perekaman dibatalkan. Klik Rekam Video Ini, pilih Tab ini / This Tab, dan aktifkan Bagikan audio tab.':'Gagal membuka pemilih tab: '+(err.message||err.name));return;}
 if(!stream.getAudioTracks().length){stream.getTracks().forEach(t=>t.stop());captureMessage('Audio belum dibagikan. Pilih Tab ini / This Tab di Chrome, lalu aktifkan Bagikan audio tab (Share tab audio). Jangan pilih Seluruh Layar.');return;}
 try{
  const mime=['audio/webm;codecs=opus','audio/webm','audio/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
  const audioStream=new MediaStream(stream.getAudioTracks());
  const recorder=new MediaRecorder(audioStream,mime?{mimeType:mime,audioBitsPerSecond:128000}:undefined);
  captureState.stream=stream;captureState.recorder=recorder;captureState.chunks=[];captureState.stopping=false;captureState.start=performance.now();
  recorder.addEventListener('dataavailable',e=>{if(e.data?.size)captureState.chunks.push(e.data)});
  recorder.addEventListener('error',e=>{captureMessage('Rekaman audio gagal: '+(e.error?.message||'MediaRecorder error'))});
  recorder.addEventListener('stop',async()=>{
   const chunks=captureState.chunks;captureState.chunks=[];
   stream.getTracks().forEach(t=>t.stop());captureState.stream=null;captureState.recorder=null;
   clearInterval(captureState.timer);captureUI(false);
   const blob=new Blob(chunks,{type:mime||recorder.mimeType||'audio/webm'});
   if(blob.size<1500){captureMessage('Rekaman kosong. Pastikan tab video sedang diputar dan “Bagikan audio tab” aktif.');return;}
   try{
    if(rollState.objectURL)URL.revokeObjectURL(rollState.objectURL);
    rollState.objectURL=URL.createObjectURL(blob);rollState.sourceBuffer=await blob.arrayBuffer();rollState.sourcePCM=null;rollState.filename='rekaman-tab.webm';rollState.midiAll=null;$('#midi-track-info').hidden=true;
    $('#audio-reference').src=rollState.objectURL;$('#analyze-audio').disabled=false;
    captureMessage('Rekaman berhasil ('+Math.round(blob.size/1024)+' KB). Pilih metode analisis di bawah lalu klik Analisis Audio → MIDI. Rekaman tidak diputar ulang, jadi tidak menggema.');
    $('#analysis-message').textContent='Rekaman diterima. Pilih AI Piano Solo untuk rekaman piano, atau mode cepat untuk melodi tunggal.';
   }catch(err){captureMessage('Audio terekam tetapi belum bisa dibaca: '+err.message)}
  },{once:true});
  stream.getVideoTracks().forEach(t=>t.addEventListener('ended',()=>finishTabCapture(),{once:true}));
  recorder.start(1000);captureUI(true);$('#analysis-progress').value=0;$('#capture-elapsed').textContent='00:00';
  captureMessage('SEDANG MEREKAM TAB INI. Putar video YouTube di atas. Setelah bagian yang ingin dikulik selesai, klik Selesai Rekam → Analisis Audio → MIDI. Audio tidak diputar ulang agar tidak menggema.');
  captureState.timer=setInterval(()=>{
   if(!captureState.stream)return;
   const sec=(performance.now()-captureState.start)/1000;
   $('#capture-elapsed').textContent=fallTime(sec);
   $('#capture-meter-fill').style.width=Math.min(100,sec/CAPTURE_LIMIT_SEC*100)+'%';
   if(sec>=CAPTURE_LIMIT_SEC){captureMessage('Batas aman 30 menit tercapai; menyelesaikan rekaman untuk dianalisis.');finishTabCapture();}
  },250);
 }catch(err){stream.getTracks().forEach(t=>t.stop());captureState.stream=null;captureUI(false);captureMessage('Gagal merekam audio: '+(err.message||err.name));}
}
function finishTabCapture(){
 if(!captureState.stream||captureState.stopping)return;
 captureState.stopping=true;clearInterval(captureState.timer);
 const r=captureState.recorder;
 captureMessage('Menyelesaikan rekaman, membaca audio…');
 if(r&&r.state!=='inactive'){try{r.requestData();r.stop();}catch(err){captureMessage('Tidak dapat menyelesaikan rekaman: '+err.message);captureState.stream?.getTracks().forEach(t=>t.stop());captureState.stream=null;captureUI(false)}}
 else{captureState.stream.getTracks().forEach(t=>t.stop());captureState.stream=null;captureUI(false)}
}
// AI Piano (Magenta.js Onsets & Frames) on-demand.
// Model ini sengaja tidak dimuat saat startup, supaya piano dan menu teori langsung ringan.
let aiPianoModel=null, aiPianoLoading=null;
function loadScriptOnce(url, check){
 if(check?.())return Promise.resolve();
 return new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src=url;s.async=true;s.crossOrigin='anonymous';
  const t=setTimeout(()=>{s.remove();reject(new Error('Pengunduhan pustaka terlalu lama. Periksa internet lalu coba lagi.'))},45000);
  s.onload=()=>{clearTimeout(t);if(check&&!check())reject(new Error('Pustaka gagal dibaca.'));else resolve()};
  s.onerror=()=>{clearTimeout(t);reject(new Error('Pustaka audio tidak dapat diunduh. Periksa koneksi internet atau pemblokir skrip.'))};
  document.head.appendChild(s);
 });
}
async function getAiPianoModel(status){
 if(aiPianoModel)return aiPianoModel;
 if(!aiPianoLoading){
  aiPianoLoading=(async()=>{
   status('Memuat TensorFlow.js untuk transkripsi piano…');
   await loadScriptOnce('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.7.4/dist/tf.min.js',()=>!!window.tf);
   status('Memuat mesin transkripsi Magenta…');
   await loadScriptOnce('https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1/es6/core.js',()=>!!window.core);
   await loadScriptOnce('https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1/es6/transcription.js',()=>!!window.transcription?.OnsetsAndFrames);
   status('Mengunduh model piano (±30 MB, hanya saat pertama dipakai)…');
   const model=new window.transcription.OnsetsAndFrames('https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni_q2');
   await model.initialize();
   aiPianoModel=model;
   return model;
  })().catch(err=>{aiPianoLoading=null;throw err});
 }
 return aiPianoLoading;
}
async function runAiPianoAnalysis(msg,prog){
 if(!rollState.sourceBuffer&&!rollState.sourcePCM)throw new Error('Belum ada audio. Rekam tab atau unggah audio dahulu.');
 const status=s=>{msg.textContent=s};
 const model=await getAiPianoModel(status);
 const ctx=audioContext();if(!ctx)throw new Error('Web Audio tidak tersedia.');
 const requested=Number($('#ai-limit').value); // 0 = seluruh durasi
 let decoded;
 if(rollState.sourcePCM){
  const rate=rollState.sourceRate||11025;
  const length=rollState.sourcePCM.length;
  decoded=ctx.createBuffer(1,length,rate);
  decoded.copyToChannel(rollState.sourcePCM,0);
 }else{
  status('Membaca durasi audio sumber…');
  decoded=await ctx.decodeAudioData(rollState.sourceBuffer.slice(0));
 }
 const originalDuration=decoded.duration;
 if(!Number.isFinite(originalDuration)||originalDuration<1)throw new Error('Durasi audio tidak terbaca.');
 if(originalDuration>CAPTURE_LIMIT_SEC && !(requested>0&&requested<=CAPTURE_LIMIT_SEC))
  throw new Error('Audio '+fallTime(originalDuration)+' melewati batas 30 menit per proses. Pilih cuplikan, atau bagi sumber menjadi beberapa bagian.');
 const duration=Math.min(originalDuration,requested>0?requested:originalDuration,CAPTURE_LIMIT_SEC);
 const rate=decoded.sampleRate,CHUNK=25,OVERLAP=.35,totalChunks=Math.ceil(duration/CHUNK),events=[];
 for(let i=0;i<totalChunks;i++){
  const offset=i*CHUNK,seconds=Math.min(duration-offset,CHUNK+OVERLAP);
  const begin=Math.floor(offset*rate),size=Math.min(decoded.length-begin,Math.ceil(seconds*rate));
  if(size<=0)break;
  const part=ctx.createBuffer(decoded.numberOfChannels,size,rate);
  for(let c=0;c<decoded.numberOfChannels;c++)part.copyToChannel(decoded.getChannelData(c).subarray(begin,begin+size),c);
  status('AI Piano: memeriksa bagian '+(i+1)+'/'+totalChunks+' ('+fallTime(Math.min(offset,duration))+' / '+fallTime(duration)+').');
  await new Promise(resolve=>setTimeout(resolve,0));
  const seq=await model.transcribeFromAudioBuffer(part,1);
  for(const n of seq.notes||[]){
   const localStart=Number(n.startTime),localEnd=Number(n.endTime);
   if(!Number.isInteger(n.pitch)||n.pitch<ROLL_LOW||n.pitch>ROLL_HIGH||!Number.isFinite(localStart)||!Number.isFinite(localEnd)||localEnd-localStart<.06)continue;
   if(i<totalChunks-1&&localStart>=CHUNK)continue; // overlap hanya untuk konteks tepi
   events.push({midi:n.pitch,start:Math.max(0,localStart+offset),duration:Math.max(.06,Math.min(duration,localEnd+offset)-Math.max(0,localStart+offset)),source:'analyzed'});
  }
  prog.value=Math.min(98,Math.round(10+(i+1)/totalChunks*88));
 }
 events.sort((a,b)=>a.start-b.start||a.midi-b.midi);
 const unique=[];
 for(const n of events){
  const last=unique.length?unique[unique.length-1]:null;
  if(last&&last.midi===n.midi&&Math.abs(last.start-n.start)<.12){last.duration=Math.max(last.duration,n.start+n.duration-last.start);continue;}
  unique.push(n);
 }
 stopRoll();rollState.midiAll=null;$('#midi-track-info').hidden=true;
 rollState.notes=unique.slice(0,30000);rollState.seconds=duration;rollState.playhead=-2.8;
 renderRoll();prog.value=100;
 if(unique.length===0)status('Durasi '+fallTime(duration)+' telah diperiksa, tetapi model tidak menemukan nada piano yang jelas. Coba stem piano terpisah.');
 else status('AI Piano: '+rollState.notes.length+' nada perkiraan dari '+fallTime(duration)+' audio. Semua bagian dianalisis, tetapi not belum tentu akurat. Periksa sebelum ekspor MIDI.');
 document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}

const INSTRUMENTS={
 piano:{label:'PIANO',lo:36,hi:96,method:'piano_ai',mode:'poly',desc:'Piano akustik. AI Piano cocok untuk piano solo/rekaman bersih. MIDI bisa difilter berdasarkan instrumen.'},
 keyboard:{label:'KEYBOARD',lo:44,hi:96,method:'poly',mode:'poly',desc:'Keyboard / synth / organ. Dari MIDI bisa dipilih tepat menurut program instrumen. Dari audio campuran, hanya tebakan nada—bukan pemisahan synth.'},
 bass:{label:'BASS',lo:28,hi:64,method:'melody',mode:'melody',desc:'Bass: fokus register rendah dan nada tunggal. Akurat dari track MIDI; audio band bisa terganggu kick drum.'},
 guitar:{label:'GITAR',lo:40,hi:89,method:'poly',mode:'poly',desc:'Gitar: fokus register gitar. FFT perkiraan, bukan stem gitar. Untuk lagu penuh gunakan rekaman gitar terpisah.'},
 lead:{label:'MELODI',lo:52,hi:96,method:'melody',mode:'melody',desc:'Sax / EWI / melodi: fokus nada tunggal. Akurat jika instrumennya terdengar sendiri; audio band tetap perkiraan.'},
 strings:{label:'STRINGS',lo:45,hi:96,method:'poly',mode:'poly',desc:'Strings / brass: hasil audio masih perkiraan; MIDI multi-track dapat disaring berdasarkan kelompok instrumen.'},
 drums:{label:'DRUMS',lo:35,hi:81,method:'none',mode:'none',desc:'Drum bukan nada piano. Saat ini hanya bisa dipilih dari jalur drum di MIDI (channel 10). Audio drum → MIDI membutuhkan model khusus.'},
 all:{label:'SEMUA',lo:28,hi:108,method:'poly',mode:'poly',desc:'Semua instrumen. MIDI menampilkan semua jalur. Deteksi audio FFT untuk band penuh sangat eksperimental dan mudah salah.'}
};
function selectedInstrument(){return $('#instrument-focus')?.value||'piano'}
function applyImportedMidiFocus({scroll=false}={}){
 if(!rollState.midiAll)return;
 const focus=selectedInstrument();let notes=focus==='all'?rollState.midiAll:rollState.midiAll.filter(n=>n.instrument===focus);
 stopRoll();rollState.notes=notes.slice(0,30000);rollState.seconds=Math.max(16,rollState.midiAll.reduce((mx,n)=>Math.max(mx,n.start+n.duration),0)+2);rollState.playhead=-2.8;renderRoll();
 const label=INSTRUMENTS[focus]?.label||focus;
 $('#analysis-message').textContent=`MIDI: ${rollState.notes.length} nada ${label.toLowerCase()} dari ${rollState.midiAll.length} nada. ${rollState.notes.length?'Pilih Putar untuk melihatnya.':'Tidak ada jalur instrumen ini. Coba Semua instrumen.'}`;
 const box=$('#midi-track-info');
 if(box){box.hidden=false;const groups={};for(const n of rollState.midiAll)groups[n.instrument]=(groups[n.instrument]||0)+1;
  box.textContent='Jalur MIDI terdeteksi: '+Object.entries(groups).map(([k,v])=>`${INSTRUMENTS[k]?.label||k} ${v}`).join(' · ');}
 if(scroll)document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function updateInstrumentFocus({autoMode=false}={}){
 const focus=selectedInstrument(),cfg=INSTRUMENTS[focus]||INSTRUMENTS.piano;
 $('#instrument-hint').textContent=cfg.desc;
 $('#instrument-mode-badge').textContent=cfg.label;
 if(autoMode){$('#analysis-mode').value=cfg.method==='none'?'melody':cfg.method;}
 const noAudio=focus==='drums';
 $('#analyze-audio').disabled=noAudio||(!rollState.sourceBuffer&&!rollState.sourcePCM);
 $('#analyze-audio').title=noAudio?'Pilih file MIDI untuk mengambil jalur drum. Deteksi audio drum belum tersedia.':'';
 if(rollState.midiAll)applyImportedMidiFocus();
 updateAnalysisModeHelp();
}
function updateAnalysisModeHelp(){
 const mode=$('#analysis-mode')?.value,focus=selectedInstrument();
 const note=$('#ai-mode-notice');if(!note)return;
 if(focus==='drums'){
  note.dataset.fft='true';note.innerHTML='<strong>Drum dari MIDI saja.</strong> Rekaman drum belum bisa dikonversi akurat menggunakan mesin deteksi audio ini. Unggah file MIDI dengan track drum.';
  $('#ai-limit').disabled=true;return;
 }
 if(mode==='piano_ai'){
  note.dataset.fft='false';
  note.innerHTML='<strong>AI Piano (Onsets &amp; Frames)</strong> — membaca nada seperti piano; bukan pemisah instrumen dari band. Untuk synth/keyboard, kualitasnya belum terjamin. Sebaiknya gunakan stem instrumen terpisah.';
  $('#ai-limit').disabled=false;
 }else{
  note.dataset.fft='true';
  note.innerHTML='<strong>Deteksi audio perkiraan</strong> — mencari nada di rentang '+(INSTRUMENTS[focus]?.lo||36)+'–'+(INSTRUMENTS[focus]?.hi||96)+' (MIDI). Ini <b>bukan</b> pemisahan instrumen. Untuk track piano/keyboard yang akurat, impor MIDI multi-track atau audio stem terpisah.';
  $('#ai-limit').disabled=true;
 }
}

async function analyzeUploadedAudio(){
 const btn=$('#analyze-audio'),msg=$('#analysis-message'),prog=$('#analysis-progress');
 if(selectedInstrument()==='drums')return toast('Deteksi drum dari audio belum tersedia. Impor MIDI track drum.');
 if(!rollState.sourceBuffer&&!rollState.sourcePCM)return toast('Pilih audio atau tangkap suara tab YouTube dahulu.');
 if($('#analysis-mode').value==='piano_ai'){
  btn.disabled=true;btn.textContent='Memproses dengan AI Piano…';prog.value=0;
  try{await runAiPianoAnalysis(msg,prog)}catch(err){msg.textContent='AI Piano gagal: '+(err.message||err)+'. Gunakan audio piano solo atau impor MIDI.';toast('AI Piano belum berhasil. Periksa koneksi dan audio.');}
  finally{btn.disabled=false;btn.textContent='♫ Analisis Audio → MIDI'}
  return;
 }
 btn.disabled=true;btn.textContent='Menganalisis dengan FFT...';prog.value=0;msg.textContent='Membaca gelombang audio...';
 try{
  let raw,max;
  if(rollState.sourcePCM){max=rollState.sourcePCM.length/rollState.sourceRate;if(max>CAPTURE_LIMIT_SEC)throw Error('Durasi melebihi 30 menit; pecah audio menjadi beberapa bagian.');raw=rollState.sourcePCM.slice();}
  else{
   const ctx=audioContext();if(!ctx)throw Error('Web Audio belum didukung.');const decoded=await ctx.decodeAudioData(rollState.sourceBuffer.slice(0));
   const rate=11025,step=decoded.sampleRate/rate;max=decoded.duration;if(max>CAPTURE_LIMIT_SEC)throw Error('Durasi melebihi 30 menit; pecah audio menjadi beberapa bagian.');
   const count=Math.floor(max*rate);raw=new Float32Array(count);const channels=Array.from({length:decoded.numberOfChannels},(_,c)=>decoded.getChannelData(c));
   for(let i=0;i<count;i++){const j=Math.floor(i*step);let val=0;for(const arr of channels)val+=arr[j]||0;raw[i]=val/channels.length;}
  }
  msg.textContent='Memisahkan nada dari rekaman (melodi atau chord)…';
  const workerCode="onmessage=e=>{\n try{\n const data=new Float32Array(e.data.buffer),mode=e.data.mode||'melody',rate=11025;\n const hop=512,N=e.data.lowMidi<=35?4096:2048,minMidi=e.data.lowMidi||36,maxMidi=e.data.highMidi||96;\n const notesByFrame=[],total=Math.max(0,Math.floor((data.length-N)/hop));\n if(!total){postMessage({done:true,notes:[]});return;}\n const real=new Float32Array(N),imag=new Float32Array(N),power=new Float32Array(N/2);\n const rev=new Uint16Array(N);\n for(let i=0;i<N;i++){let x=i,r=0;for(let b=0;b<Math.log2(N);b++){r=(r<<1)|(x&1);x>>=1;}rev[i]=r;}\n // FFT iterative radix-2 + Hann window (browser local/offline)\n function spectrum(at){\n  let rms=0;\n  for(let i=0;i<N;i++){let v=data[at+i]||0;rms+=v*v;let w=.5-.5*Math.cos(2*Math.PI*i/(N-1)),j=rev[i];real[j]=v*w;imag[j]=0;}\n  for(let size=2;size<=N;size<<=1){let h=size>>1;\n   for(let from=0;from<N;from+=size)for(let j=0;j<h;j++){\n    const a=-2*Math.PI*j/size,wr=Math.cos(a),wi=Math.sin(a),id=from+j,other=id+h;\n    const tr=wr*real[other]-wi*imag[other],ti=wr*imag[other]+wi*real[other];\n    real[other]=real[id]-tr;imag[other]=imag[id]-ti;real[id]+=tr;imag[id]+=ti;\n   }\n  }\n  for(let i=0;i<power.length;i++)power[i]=Math.sqrt(real[i]*real[i]+imag[i]*imag[i]);\n  return Math.sqrt(rms/N);\n }\n function interp(bin){\n  if(bin<1||bin>=power.length-1)return 0;\n  const low=Math.floor(bin),frac=bin-low;\n  const a=Math.max(power[Math.max(1,low-1)],power[low],power[Math.min(power.length-1,low+1)]);\n  const b=Math.max(power[Math.max(1,low)],power[Math.min(power.length-1,low+1)],power[Math.min(power.length-1,low+2)]);\n  return a*(1-frac)+b*frac;\n }\n let maxAmp=0;for(let p=0;p<data.length;p+=101)maxAmp=Math.max(maxAmp,Math.abs(data[p]));\n const threshold=Math.max(.007,maxAmp*.023);\n for(let f=0;f<total;f++){\n  const rms=spectrum(f*hop);if(rms<threshold){notesByFrame.push([]);continue;}\n  const sal=[];\n  for(let m=minMidi;m<=maxMidi;m++){\n   const freq=440*Math.pow(2,(m-69)/12),bin=freq*N/rate;\n   let score=0;\n   for(let harm=1;harm<=Math.min(5,Math.floor(rate*.48/freq));harm++)score+=interp(bin*harm)/Math.pow(harm,1.12);\n   // favor the actual fundamental over a spurious octave\n   const fundamental=interp(bin);\n   score=score*.72+fundamental*.28;\n   sal.push({m,score});\n  }\n  sal.sort((a,b)=>b.score-a.score);\n  const best=sal[0]?.score||0;\n  if(best<.1){notesByFrame.push([]);continue;}\n  if(mode==='melody'){\n   let candidate=sal[0];\n   // a lightly weighted continuity prior avoids some octave jumps\n   const previous=notesByFrame.length?notesByFrame[notesByFrame.length-1][0]:null;\n   if(previous!==undefined&&previous!==null){const near=sal.find(s=>Math.abs(s.m-previous)<=2 && s.score>=best*.75);if(near)candidate=near;}\n   notesByFrame.push([candidate.m]);\n  }else{\n   // Experimental multi-note estimation. Avoid pure harmonic false positives by limiting to 4 notes.\n   const found=[],cutoff=best*.66;\n   for(const item of sal){\n    if(found.length>=4||item.score<cutoff)break;\n    if(found.some(n=>Math.abs(n-item.m)<=1))continue;\n    // octave harmonic collisions require extra prominence\n    if(found.some(n=>Math.abs(n-item.m)===12)&&item.score<best*.88)continue;\n    found.push(item.m);\n   }\n   notesByFrame.push(found);\n  }\n  if(f%65===0)postMessage({progress:Math.round(f/total*100)});\n }\n const count=new Map(),output=[],step=hop/rate;\n for(let i=0;i<notesByFrame.length;i++){\n  const list=new Set(notesByFrame[i]);\n  for(const [m,t] of count){if(!list.has(m)){if(i-t.from>=3)output.push({midi:m,start:t.from*step,duration:(i-t.from)*step,source:'analyzed'});count.delete(m)}}\n  for(const m of list)if(!count.has(m))count.set(m,{from:i});\n }\n for(const [m,t] of count)if(notesByFrame.length-t.from>=3)output.push({midi:m,start:t.from*step,duration:(notesByFrame.length-t.from)*step,source:'analyzed'});\n output.sort((a,b)=>a.start-b.start||a.midi-b.midi);\n // Merge brief neighboring notes of same pitch to remove fragmentation.\n const merged=[];\n for(const n of output){const last=merged.findLast(x=>x.midi===n.midi&&n.start-(x.start+x.duration)<.10&&n.start>=x.start);\n  if(last)last.duration=n.start+n.duration-last.start;else merged.push(n);\n }\n postMessage({done:true,notes:merged.slice(0,30000),duration:data.length/rate});\n }catch(err){postMessage({error:String(err?.message||err)})}\n};"
  const objectURL=URL.createObjectURL(new Blob([workerCode],{type:'application/javascript'}));
  const worker=new Worker(objectURL);rollState.worker=worker;
  const notes=await new Promise((resolve,reject)=>{worker.onmessage=e=>{if(e.data.error)reject(new Error(e.data.error));if(e.data.progress!==undefined){prog.value=e.data.progress;msg.textContent='Membaca nada... '+e.data.progress+'%'}if(e.data.done)resolve(e.data.notes)};worker.onerror=reject;worker.postMessage({buffer:raw.buffer,mode:$('#analysis-mode').value,lowMidi:(INSTRUMENTS[selectedInstrument()]||INSTRUMENTS.piano).lo,highMidi:(INSTRUMENTS[selectedInstrument()]||INSTRUMENTS.piano).hi},[raw.buffer])});
  worker.terminate();rollState.worker=null;URL.revokeObjectURL(objectURL);
  stopRoll();rollState.midiAll=null;$('#midi-track-info').hidden=true;rollState.notes=notes;rollState.seconds=Math.max(16,max);rollState.playhead=-2.8;renderRoll();prog.value=100;
  msg.textContent=`${INSTRUMENTS[selectedInstrument()]?.label}: ${notes.length} nada perkiraan terdeteksi (bukan isolasi instrumen). Periksa hasil sebelum ekspor MIDI.`;document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
  if(!notes.length)toast('Tidak terdeteksi nada. Periksa rekamannya di pemutar audio, lalu pilih mode Melodi utama.');
 }catch(err){if(rollState.worker){rollState.worker.terminate();rollState.worker=null;}msg.textContent='Analisis gagal: '+(err.message||err);toast('Deteksi audio gagal. Coba file WAV/MP3 atau pilih mode Melodi utama.');}
 finally{btn.disabled=false;btn.textContent='♫ Analisis Audio → MIDI';}
}
// Offline MP4 export in Windows engine; uses the piano roll's current notes and transpose.
let videoExportInProgress=false;
async function exportRollVideo(){
 if(videoExportInProgress)return;
 if(!rollState.notes.length){toast('Belum ada nada. Impor MIDI, analisis audio, atau klik Contoh dulu.');return;}
 const msg=$('#roll-video-message'),link=$('#roll-video-download'),button=$('#roll-video-export');
 const wrap=$('#mp4-progress-wrap'),bar=$('#roll-video-progress'),pct=$('#roll-video-progress-text');
 const usable=rollState.notes.map(n=>({...n,midi:rollPitch(n)})).filter(n=>n.midi>=21&&n.midi<=108&&n.start>=0&&n.duration>0);
 if(!usable.length){toast('Nada setelah transpose berada di luar jangkauan 88 tuts.');return;}
 videoExportInProgress=true;button.disabled=true;link.hidden=true;wrap.hidden=false;bar.value=0;pct.textContent='0%';
 msg.textContent='Menghubungi mesin lokal...';
 const url='http://127.0.0.1:8765';
 try{
  const length=fallDuration();if(length>1800)throw Error('Ekspor dibatasi 30 menit per video.');
  const payload={notes:usable.map(n=>({midi:n.midi,start:n.start,duration:n.duration,velocity:n.velocity||85,source:n.source||'analyzed'})),duration:length,speed:rollState.rate,volume:midiVolumePercent,resolution:$('#roll-video-resolution').value,title:'KULIKIN · Piano Roll'};
  let response;try{response=await fetch(url+'/api/video/create',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});}catch(_){throw Error('Mesin lokal tidak tersambung. Jalankan START_WINDOWS.bat dari engine KULIKIN v1.3.');}
  if(!response.ok){const err=await response.json().catch(()=>({}));throw Error(err.detail||'Mesin lokal menolak permintaan MP4. Update engine ke v1.3.');}
  const {job_id}=await response.json();
  for(;;){
   await new Promise(resolve=>setTimeout(resolve,1300));
   let statusResponse;try{statusResponse=await fetch(url+'/api/video/status/'+encodeURIComponent(job_id));}catch(_){throw Error('Koneksi mesin lokal terputus. Periksa CMD engine.');}
   if(!statusResponse.ok)throw Error('Tidak bisa memantau ekspor MP4.');
   const job=await statusResponse.json();bar.value=Math.max(0,Math.min(100,job.progress||0));pct.textContent=String(Math.round(bar.value))+'%';msg.textContent=job.stage||'Membuat MP4...';
   if(job.status==='failed')throw Error(job.error||'Gagal membuat MP4.');
   if(job.status==='done'){link.href=url+job.download;link.hidden=false;msg.textContent='Video siap diunduh · suara piano dan transpose sudah termasuk.';toast('MP4 selesai. Klik Unduh MP4.');break;}
  }
 }catch(err){msg.textContent='Ekspor gagal: '+(err.message||err);toast('MP4 gagal. Periksa mesin lokal dan FFmpeg.');}
 finally{videoExportInProgress=false;button.disabled=false;}
}

function initTranscription(){
 loadRollTranspose();
 try{const v=Number(localStorage.getItem('chord-atlas-midi-volume'));if(v>=50&&v<=250)midiVolumePercent=v;}catch(_){/* local storage may be disabled */}
 const volumeInput=$('#roll-volume'),volumeLabel=$('#roll-volume-value');
 volumeInput.value=String(midiVolumePercent);volumeLabel.textContent=midiVolumePercent+'%';
 volumeInput.addEventListener('input',e=>{midiVolumePercent=Math.max(50,Math.min(250,Number(e.target.value)||200));volumeLabel.textContent=midiVolumePercent+'%';try{localStorage.setItem('chord-atlas-midi-volume',String(midiVolumePercent));}catch(_){/* private mode */}});
 renderRoll();updateInstrumentFocus({autoMode:true});$('#instrument-focus').addEventListener('change',()=>updateInstrumentFocus({autoMode:true}));$('#analysis-mode').addEventListener('change',updateAnalysisModeHelp);$('#open-source').addEventListener('click',openReference);$('#capture-start').addEventListener('click',startTabCapture);$('#capture-stop').addEventListener('click',finishTabCapture);
 $('#source-speed').addEventListener('change',e=>$('#audio-reference').playbackRate=Number(e.target.value));
 $('#audio-reference').addEventListener('loadedmetadata',()=>{const duration=$('#audio-reference').duration;const box=$('#source-duration');if(box)box.textContent=Number.isFinite(duration)?('Durasi sumber: '+fallTime(duration)+(duration>CAPTURE_LIMIT_SEC?' · melebihi batas 30 menit per proses':'')):'Durasi sumber tidak terbaca';});
 $('#source-audio').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(rollState.objectURL)URL.revokeObjectURL(rollState.objectURL);rollState.objectURL=URL.createObjectURL(file);rollState.sourceBuffer=await file.arrayBuffer();rollState.sourcePCM=null;rollState.midiAll=null;$('#midi-track-info').hidden=true;rollState.filename=file.name;
  $('#audio-reference').src=rollState.objectURL;$('#analyze-audio').disabled=false;$('#analysis-message').textContent=file.name+' · siap dianalisis';$('#analysis-progress').value=0;});
 $('#source-midi').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const notes=readMidiNotes(await file.arrayBuffer());rollState.midiAll=notes;rollState.sourceBuffer=null;rollState.sourcePCM=null;applyImportedMidiFocus({scroll:true});toast('MIDI dibaca. Pilih instrumen untuk menyaring jalurnya.');}catch(err){toast('File MIDI gagal dibaca: '+err.message)}});
 $('#analyze-audio').addEventListener('click',analyzeUploadedAudio);
 $('#roll-shift-down').addEventListener('click',()=>changeRollTranspose(rollTranspose-1));
 $('#roll-shift-up').addEventListener('click',()=>changeRollTranspose(rollTranspose+1));
 $('#roll-shift-reset').addEventListener('click',()=>changeRollTranspose(0));
 $('#roll-play').addEventListener('click',playRoll);$('#roll-stop').addEventListener('click',()=>{stopRoll();rollState.playhead=-2.8;renderRoll()});
 $('#roll-demo').addEventListener('click',demoRoll);$('#roll-export').addEventListener('click',exportRollMidi);$('#roll-video-export').addEventListener('click',exportRollVideo);
 $('#roll-clear').addEventListener('click',()=>{stopRoll();rollState.notes=[];rollState.seconds=16;rollState.playhead=-2.8;renderRoll()});
 $('#roll-edit-toggle').addEventListener('click',()=>{const wrap=$('#roll-editor-wrap'),expanded=wrap.hidden;wrap.hidden=!expanded;$('#roll-edit-toggle').setAttribute('aria-expanded',String(expanded));$('#roll-edit-toggle').textContent=expanded?'✕ Tutup editor':'✎ Editor nada';});
 $('#fall-speed').addEventListener('change',e=>{const next=Number(e.target.value);if(!Number.isFinite(next)||next<=0)return;const wasPlaying=rollState.playing;if(wasPlaying)stopRoll();rollState.rate=next;if(wasPlaying)playRoll();});
 $('#fall-seek').addEventListener('input',e=>{stopRoll();rollState.playhead=Number(e.target.value);drawFallingRoll();});
 $('#roll-zoom').addEventListener('input',renderRoll);$('#roll-bpm').addEventListener('change',renderRoll);
 $('#roll-track').addEventListener('click',e=>{const n=e.target.closest('[data-roll-note]');if(n){rollState.notes.splice(Number(n.dataset.rollNote),1);renderRoll();return}
  const rect=$('#roll-track').getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const midi=ROLL_HIGH-Math.floor(y/ROLL_H);if(midi<ROLL_LOW||midi>ROLL_HIGH)return;
  const start=Math.max(0,x/Number($('#roll-zoom').value)),originalMidi=midi-rollTranspose;if(originalMidi<ROLL_LOW||originalMidi>ROLL_HIGH){toast('Nada ini di luar jangkauan 88 tuts setelah transpose. Kembalikan transpose untuk menambahnya.');return;}addRollNote(originalMidi,start);tone(midi,null,.65,.30);flashKey(midi)});
 $('#cheat-scale').addEventListener('click',e=>{const el=e.target.closest('[data-cheat-note]');if(el)playNote(Number(el.dataset.cheatNote))});
 $('#cheat-intervals').addEventListener('click',e=>{const el=e.target.closest('[data-cheat-note]');if(el){playNote(60+state.key);const n=Number(el.dataset.cheatNote);setTimeout(()=>playNote(n),260)}});
}

function wireEvents(){
 $$('.nav-link').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.page)));
 $('#mobile-menu').addEventListener('click',()=>$('#sidebar').classList.toggle('is-open'));
 $('#sidebar-toggle').addEventListener('click',()=>{const collapsed=document.body.classList.toggle('sidebar-collapsed');$('#sidebar-toggle').setAttribute('aria-expanded',String(!collapsed));$('#sidebar-toggle').title=collapsed?'Buka sidebar':'Lipat sidebar';try{localStorage.setItem('ca-sidebar-collapsed',collapsed?'1':'0')}catch(_){}requestAnimationFrame(resizeFallCanvas)});
 try{if(localStorage.getItem('ca-sidebar-collapsed')==='1'){document.body.classList.add('sidebar-collapsed');$('#sidebar-toggle').setAttribute('aria-expanded','false')}}catch(_){}
 if(typeof ResizeObserver!=='undefined'){new ResizeObserver(()=>{if(fallCanvasReady)resizeFallCanvas()}).observe($('#fall-scroller'));}

 $('#chord-guide-toggle').addEventListener('click',()=>{chordGuideEnabled=!chordGuideEnabled;$('#chord-guide-toggle').textContent=chordGuideEnabled?'Sembunyikan panduan chord':'Lihat posisi chord';$('#chord-guide-toggle').setAttribute('aria-pressed',String(chordGuideEnabled));paintPiano();});
 
 
 $('#keys-label-toggle').addEventListener('click',()=>{const on=$('#piano').classList.toggle('show-all-notes');$('#keys-label-toggle').setAttribute('aria-pressed',String(on));$('#keys-label-toggle').textContent=on?'Sembunyikan nama nada':'Tampilkan semua nada'});
 $('#quick-start').addEventListener('click',()=>{state.style='major';switchPage('paths');setPreset('1452')});
 $('#help-button').addEventListener('click',()=>$('#help-dialog').showModal());$('#close-help').addEventListener('click',()=>$('#help-dialog').close());$('#help-done').addEventListener('click',()=>$('#help-dialog').close());
 $('#global-key').addEventListener('change',e=>changeKey(Number(e.target.value)));
 $('#global-scale').addEventListener('change',e=>changeKey(state.key,e.target.value));
 $('#transpose-down').addEventListener('click',()=>{state.transpose=Math.max(-11,state.transpose-1);renderStudio()});
 $('#transpose-up').addEventListener('click',()=>{state.transpose=Math.min(11,state.transpose+1);renderStudio()});
 $('#audio-test').addEventListener('click',()=>{if(!state.sound){state.sound=true;$('#sound-toggle').setAttribute('aria-pressed','true');$('#sound-label').textContent='Suara aktif';}playNote(60);toast('Memainkan Do tengah (C4).');});
 $('#sound-toggle').addEventListener('click',()=>{state.sound=!state.sound;$('#sound-toggle').setAttribute('aria-pressed',String(state.sound));$('#sound-label').textContent=state.sound?'Suara aktif':'Suara mati';if(state.sound){audioContext();loadPianoBank();playChord()}else toast('Audio dimatikan')});
 $('#root-note').addEventListener('change',e=>{state.root=Number(e.target.value);renderStudio();renderLearning()});
 $('#chord-quality').addEventListener('change',e=>{state.quality=e.target.value;renderStudio();renderLearning()});
 $('#bass-note').addEventListener('change',e=>{state.bass=Number(e.target.value);renderStudio();renderLearning()});
 $('#play-chord').addEventListener('click',()=>playChord());$('#add-current').addEventListener('click',()=>{state.progression.push(currentChord());switchPage('paths');toast('Chord masuk ke jalur. Pilih cabang berikutnya.')});
 $('#play-scale').addEventListener('click',()=>{let arr=scaleSteps().map(s=>60+mod(state.key+s));const ctx=audioContext();if(!ctx)return;arr.concat(arr.slice().reverse()).forEach((n,i)=>{tone(n+state.transpose,ctx.currentTime+i*.21+.04,.3,.24);setTimeout(()=>flashKey(n),i*210+30)})});
 $('#diatonic-list').addEventListener('click',e=>{const b=e.target.closest('[data-degree]');if(!b)return;const c=diatonicChordsForScale()[Number(b.dataset.degree)];state.root=c.root;state.quality=c.quality;state.bass=-1;$('#root-note').value=state.root;$('#chord-quality').value=state.quality;$('#bass-note').value=-1;renderStudio();renderLearning();playChord(c)});
 $('#fifths-svg').addEventListener('click',e=>{const el=e.target.closest('[data-wheel]');if(!el)return;const idx=Number(el.dataset.wheel),pc=FIFTHS[idx],inner=el.dataset.inner==='1';state.circleMode=inner?'minor':'major';changeKey(inner?pc+9:pc,inner?'minor':'major');playChord(chordObj(state.key,state.circleMode==='minor'?'m':'maj'))});
 $$('[data-circle-mode]').forEach(b=>b.addEventListener('click',()=>{const to=b.dataset.circleMode;if(to===state.circleMode)return;state.circleMode=to;changeKey(to==='minor'?state.key+9:state.key+3,to==='minor'?'minor':'major') }));
 $('#circle-family').addEventListener('click',e=>{const b=e.target.closest('[data-family]');if(!b)return;playChord(diatonicChord(Number(b.dataset.family)+1,state.circleMode))});
 $('#circle-to-path').addEventListener('click',()=>{state.style=state.circleMode;state.start=1;state.progression=[journeyRootChord(1)];switchPage('paths')});
 $('#circle-play').addEventListener('click',()=>playChord(chordObj(state.key,state.circleMode==='minor'?'m':'maj')));
 $('#journey-style').addEventListener('change',e=>{state.style=e.target.value;state.progression=state.progression.map(c=>c.degree?journeyRootChord(c.degree):c);renderJourney()});
 $('#journey-start').addEventListener('change',e=>{state.start=Number(e.target.value);state.progression=[journeyRootChord(state.start)];$$('.preset').forEach(b=>b.classList.remove('active'));renderJourney()});
 $('#presets').addEventListener('click',e=>{const b=e.target.closest('[data-preset]');if(b)setPreset(b.dataset.preset)});
 $('#clear-journey').addEventListener('click',()=>{state.progression=[];renderJourney()});
 $('#progression-track').addEventListener('click',e=>{const el=e.target.closest('[data-existing]');if(!el)return;const c=state.progression[Number(el.dataset.existing)];if(c)playChord(c)});
 $('#route-options').addEventListener('click',e=>{const b=e.target.closest('[data-add-route]');if(b)addSuggestion(Number(b.dataset.addRoute))});
 $('#route-svg').addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(b)addSuggestion(Number(b.dataset.route))});
 $('#route-svg').addEventListener('keydown',e=>{const b=e.target.closest('[data-route]');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();addSuggestion(Number(b.dataset.route))}});
 $('#undo-journey').addEventListener('click',()=>{state.progression.pop();renderJourney()});
 $('#play-journey').addEventListener('click',playProgression);$('#export-midi').addEventListener('click',writeMidi);
 $('#bpm').addEventListener('input',e=>$('#bpm-value').textContent=e.target.value+' BPM');
 $('#surprise-me').addEventListener('click',()=>{const list=getSuggestions();const next=list[Math.floor(Math.random()*list.length)];state.progression.push(next.chord);renderJourney();playChord(next.chord);toast('Variasi baru: '+chordText(next.chord))});
 $$('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{state.lesson=b.dataset.lesson;renderLearning()}));
 $('#note-picker').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.lessonNote){state.lessonNote=Number(b.dataset.lessonNote);renderLearning();playNote(state.lessonNote)}else if(b.id==='lesson-play-chord')playChord();else if(b.id==='lesson-go-studio')switchPage('studio');else if(b.dataset.beats)playRhythm(Number(b.dataset.beats))});
 $('#quiz-options').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b)checkAnswer(Number(b.dataset.answer))});
 $('#next-question').addEventListener('click',nextQuiz);
 // Only mapped keyboard shortcuts for piano; bypass inputs and modified shortcuts.
 const keyMap={a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72,o:73,l:74,p:75};
 document.addEventListener('keydown',e=>{if(e.ctrlKey||e.altKey||e.metaKey||e.repeat||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)||document.activeElement.closest('dialog[open]'))return;const midi=keyMap[e.key.toLowerCase()];if(midi!==undefined&&state.page==='studio'){activeKeys.add(midi);playNote(midi);}});
 document.addEventListener('keyup',e=>activeKeys.delete(keyMap[e.key.toLowerCase()]));
 document.addEventListener('pointerdown',e=>{if(window.innerWidth<670&&$('#sidebar').classList.contains('is-open')&&!$('#sidebar').contains(e.target)&&!$('#mobile-menu').contains(e.target))$('#sidebar').classList.remove('is-open')});
}
// --- KULIKIN v11: Optional local Piano AI Studio. Original menus unchanged. ---
const AI_LOCAL_URL='http://127.0.0.1:8765';
const aiStudio={connected:false,original:null,jobId:null,processing:false,lastMidiUrl:null};
function aiReport(message,kind='normal'){
 const el=$('#ai-worker-message');if(el)el.textContent=message;
 if(kind==='error')toast(message.slice(0,140));
}
async function checkAiEngine(){
 const badge=$('#ai-server-status');badge.textContent='Menghubungkan...';badge.classList.remove('ok','bad');
 try{
  const controller=new AbortController(),t=setTimeout(()=>controller.abort(),4500);
  let response;try{response=await fetch(AI_LOCAL_URL+'/health',{signal:controller.signal,cache:'no-store'});}finally{clearTimeout(t)}
  if(!response.ok)throw new Error('Server lokal belum siap ('+response.status+')');
  const info=await response.json();if(!info.ok)throw new Error('Balasan mesin tidak valid.');
  aiStudio.connected=true;badge.classList.add('ok');badge.textContent='Mesin lokal terhubung';
  const missing=[];if(!info.ffmpeg)missing.push('FFmpeg');if(!info.separation)missing.push('Demucs');if(!info.transcription)missing.push('Basic Pitch');
  aiReport(missing.length?'Mesin tersambung, tetapi perlu pasang: '+missing.join(', '):'Mesin siap. Pilih rekaman audio dan proses. Model pertama kali harus diunduh.');
  return true;
 }catch(err){
  aiStudio.connected=false;badge.classList.add('bad');badge.textContent='Mesin belum jalan';
  aiReport('Mesin lokal belum terhubung. Jalankan engine/START_WINDOWS.bat pada komputer ini. '+(err.name==='AbortError'?'Permintaan terlalu lama.':err.message));
  return false;
 }
}
function aiSourceFile(){
 if(!rollState.sourceBuffer)return null;
 const name=rollState.filename||'rekaman-tab.webm';
 const ext=name.split('.').pop().toLowerCase();
 const mime=ext==='wav'?'audio/wav':ext==='mp3'?'audio/mpeg':ext==='m4a'?'audio/mp4':ext==='ogg'?'audio/ogg':'audio/webm';
 return new File([rollState.sourceBuffer],name,{type:mime});
}
async function aiEngineJSON(endpoint,options){
 const r=await fetch(AI_LOCAL_URL+endpoint,options);
 let data=null;try{data=await r.json()}catch(_){throw new Error('Balasan mesin AI tidak dapat dibaca ('+r.status+').')}
 if(!r.ok)throw new Error(typeof data.detail==='string'?data.detail:(data.message||'Mesin AI gagal ('+r.status+').'));
 return data;
}
async function aiSeparateAndTranscribe(){
 if(aiStudio.processing)return;
 const source=aiSourceFile();if(!source){aiReport('Belum ada audio. Rekam video di Sumber Lagu (Rekam Video Ini) atau unggah WAV/MP3 terlebih dahulu.','error');return;}
 if(!(await checkAiEngine()))return;
 const button=$('#ai-run-separate');button.disabled=true;aiStudio.processing=true;
 const progress=$('#ai-worker-progress');progress.value=3;
 $('#ai-stem-result').hidden=true;
 aiReport('Mengirim rekaman ke mesin lokal...');
 try{
  const form=new FormData();form.append('audio',source);form.append('mode',$('#ai-stem-mode').value);
  const accepted=await aiEngineJSON('/api/process',{method:'POST',body:form});aiStudio.jobId=accepted.job_id;
  // Polling reflects real processing state; never claims the result is complete ahead of the model.
  for(let i=0;i<1800;i++){
   await new Promise(resolve=>setTimeout(resolve,1000));
   const job=await aiEngineJSON('/api/jobs/'+encodeURIComponent(aiStudio.jobId));
   progress.value=Number(job.progress||0);aiReport((job.stage||'Memproses audio')+' · '+Math.round(job.progress||0)+'%');
   if(job.status==='failed')throw new Error(job.error||'Pemrosesan audio gagal.');
   if(job.status==='done'){
    const audioLink=AI_LOCAL_URL+job.files.stem;
    $('#ai-stem-audio').src=audioLink;
    $('#ai-stem-save').href=audioLink;
    $('#ai-midi-save').href=AI_LOCAL_URL+job.files.midi;
    $('#ai-stem-result').hidden=false;
    $('#ai-result-warning').textContent=job.warning||'Periksa audio stem dan akurasi not sebelum digunakan.';
    const detected=(job.notes||[]).filter(n=>Number.isFinite(n.midi)&&Number.isFinite(n.start)&&Number.isFinite(n.duration));
    if(detected.length){
     aiStudio.original=rollState.notes.map(n=>({...n}));$('#ai-restore-original').disabled=false;
     stopRoll();rollState.notes=detected.map(n=>({...n,source:'analyzed'}));
     rollState.seconds=Math.max(16,Number(job.audio_duration)||0,detected.reduce((m,n)=>Math.max(m,n.start+n.duration),0)+2);
     rollState.playhead=-2.8;rollState.midiAll=null;renderRoll();
     aiReport('Stem tersedia untuk didengarkan. '+detected.length+' nada masuk Piano Roll. Ini hasil perkiraan AI, belum tentu tepat.');
    }else aiReport('Stem piano berhasil dibuat, tapi tidak ada not yang terdeteksi. Dengarkan hasilnya atau coba mode Audio piano bersih.');
    return;
   }
  }
  throw new Error('Pekerjaan terlalu lama. Periksa terminal mesin lokal.');
 }catch(err){aiReport('Gagal: '+err.message,'error');}
 finally{aiStudio.processing=false;button.disabled=false;}
}
async function aiDevelopPiano(){
 const notes=rollState.notes.map(n=>({midi:n.midi,start:n.start,duration:n.duration,velocity:n.velocity||85})).filter(n=>Number.isFinite(n.midi)&&Number.isFinite(n.start));
 if(!notes.length){$('#ai-gen-message').textContent='Piano roll kosong. Analisis audio atau impor MIDI dulu, baru buat variasi.';return;}
 if(!(await checkAiEngine()))return;
 const btn=$('#ai-generate');btn.disabled=true;
 const msg=$('#ai-gen-message');msg.textContent='Memproses ide permainan...';
 try{
  const bpm=Number($('#roll-bpm').value)||110;
  const opts={notes:notes.slice(-1000),bpm,bars:Number($('#ai-gen-bars').value),style:$('#ai-gen-style').value,
              method:$('#ai-gen-method').value,action:$('#ai-gen-action').value,model:$('#ai-ollama-model').value.trim()||'qwen2.5:3b'};
  const result=await aiEngineJSON('/api/expand',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(opts)});
  if(!Array.isArray(result.notes)||!result.notes.length)throw new Error('Tidak ada not baru yang dihasilkan.');
  aiStudio.original=rollState.notes.map(n=>({...n}));$('#ai-restore-original').disabled=false;
  stopRoll();rollState.notes=(opts.action==='variation'?result.notes:[...rollState.notes,...result.notes]);
  rollState.seconds=Math.max(16,rollState.notes.reduce((m,n)=>Math.max(m,n.start+n.duration),0)+2);
  rollState.playhead=-2.8;renderRoll();
  msg.textContent=(opts.method==='ollama'?'AI Ollama':'Variasi otomatis')+': '+result.notes.length+' not baru. '+(result.warning||'Periksa hasilnya.')+' Klik Putar di Piano Roll.';
  document.querySelector('.roll-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
 }catch(err){msg.textContent='Gagal: '+err.message;}
 finally{btn.disabled=false;}
}
function aiRestoreOriginal(){
 if(!aiStudio.original)return;
 stopRoll();rollState.notes=aiStudio.original.map(n=>({...n}));
 rollState.seconds=Math.max(16,rollState.notes.reduce((m,n)=>Math.max(m,n.start+n.duration),0)+2);
 rollState.playhead=-2.8;renderRoll();$('#ai-gen-message').textContent='Versi sebelumnya dipulihkan.';
 aiStudio.original=null;$('#ai-restore-original').disabled=true;
}
function initAiStudio(){
 // v12: shortcut sekarang diarahkan ke Stem Splitter
 $('#ai-check-engine').addEventListener('click',checkAiEngine);
 $('#ai-run-separate').addEventListener('click',aiSeparateAndTranscribe);
 $('#ai-generate').addEventListener('click',aiDevelopPiano);
 $('#ai-restore-original').addEventListener('click',aiRestoreOriginal);
 $('#ai-gen-method').addEventListener('change',()=>{const ai=$('#ai-gen-method').value==='ollama';$('#ai-ollama-model').disabled=!ai;$('#ai-gen-message').textContent=ai?'Ollama harus berjalan di komputer. Model menghasilkan kreasi baru, bukan not asli.':'Variasi otomatis berbasis aturan musik, tidak memakai model AI.';});
}

function init(){restoreLocal();initControls();createKeyboard();wireEvents();renderStudio();renderCircle();if(hadSavedJourney)renderJourney();else setPreset('1452');renderLearning();renderCheatSheet();initTranscription();initAiStudio();sampleIndicator('Grand Piano · tekan tuts atau Tes suara');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

// KULIKIN v12 - selectable stems. Does not alter the original piano engine.
const stemView={job:null,busy:false,polling:false};
const STEM_ICONS={vocals:'♫',drums:'◉',bass:'♩',guitar:'♬',piano:'♮',other:'◈',synth:'⌁',strings:'≋'};
const STEM_DESCRIPTIONS={vocals:'Vokal',drums:'Drum / perkusi',bass:'Bass',guitar:'Gitar',piano:'Piano',other:'Instrumen lain · campuran',synth:'Synth / Keyboard',strings:'Strings / gesek'};
function stemMsg(message,error=false){$('#split-message').textContent=message;if(error)toast(message.slice(0,130))}
async function stemJSON(path,options={}){
 const res=await fetch(AI_LOCAL_URL+path,{cache:'no-store',...options});
 let payload;try{payload=await res.json()}catch(_){throw Error('Mesin lokal tidak mengirim jawaban JSON ('+res.status+').')}
 if(!res.ok)throw Error(typeof payload.detail==='string'?payload.detail:'Permintaan gagal ('+res.status+').');
 return payload;
}
async function stemCheck(){
 try{
  const info=await stemJSON('/api/stems/capabilities');
  const missing=[];if(!info.ffmpeg)missing.push('FFmpeg');if(!info.demucs)missing.push('Demucs');
  $('#split-ready').textContent=missing.length?'Perlu instal '+missing.join(', '):'● Mesin stem siap';
  stemMsg(missing.length?'Jalankan INSTALL_WINDOWS.bat: '+missing.join(', '):'Siap memisahkan 6 stem. Untuk audio YouTube langsung dibutuhkan yt-dlp.');
  return !missing.length;
 }catch(e){$('#split-ready').textContent='Mesin lokal belum berjalan';stemMsg('Jalankan engine/START_WINDOWS.bat di Windows. '+e.message,true);return false;}
}
function stemInputChanged(){
 const mode=$('#split-input-mode').value;
 $('#split-upload-wrap').hidden=mode!=='upload';$('#split-link-wrap').hidden=mode!=='youtube';
 if(mode==='youtube'&&!$('#split-link').value)$('#split-link').value=$('#source-link').value;
}
async function stemPoll(jobid,callback){
 for(let i=0;i<1800;i++){
  await new Promise(r=>setTimeout(r,1600));
  const current=await stemJSON('/api/stems/jobs/'+encodeURIComponent(jobid));
  callback(current);
  if(current.status==='failed')throw Error(current.error||'Pemisahan gagal.');
  if(current.status==='done')return current;
 }
 throw Error('Masih diproses terlalu lama. Periksa CMD mesin lokal.');
}
async function stemRun(){
 if(stemView.busy)return;
 const mode=$('#split-input-mode').value;
 const form=new FormData();
 if(mode==='youtube'){
  let url=$('#split-link').value.trim()||$('#source-link').value.trim();
  if(!/^https:\/\/(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//i.test(url)){stemMsg('Link harus berupa video YouTube HTTPS.',true);return;}
  form.set('source_url',url);
 }else if(mode==='upload'){
  let file=$('#split-upload').files?.[0];if(!file){stemMsg('Pilih file audio dahulu.',true);return;}
  form.set('audio',file,file.name);
 }else{
  const file=aiSourceFile();if(!file){stemMsg('Belum ada audio. Rekam video atau pilih mode Upload File.',true);return;}
  form.set('audio',file,file.name);
 }
 if(!(await stemCheck()))return;
 stemView.busy=true;$('#split-run').disabled=true;$('#split-results').hidden=true;$('#split-progress').value=2;
 stemMsg('Mengirim lagu ke mesin pemisah...');
 try{
  const accepted=await stemJSON('/api/stems/separate',{method:'POST',body:form});
  const job=await stemPoll(accepted.job_id,data=>{
   $('#split-progress').value=Number(data.progress||0);
   stemMsg((data.stage||'Memproses')+' · '+Math.round(data.progress||0)+'%');
  });
  stemView.job=job.id;$('#split-results').hidden=false;renderStemCards(job.stems||[]);
  stemMsg('6 stem selesai. Klik Putar / Unduh. Pilih yang ingin diubah ke MIDI.',false);
 }catch(e){stemMsg('Gagal: '+e.message,true)}
 finally{stemView.busy=false;$('#split-run').disabled=false}
}
function renderStemCards(items){
 const map=new Map(items.map(s=>[s.key,s]));
 const names=['vocals','drums','bass','guitar','piano','synth','strings','other'];
 const box=$('#split-stem-grid');box.replaceChildren();
 for(const name of names){
  const item=map.get(name),card=document.createElement('div');card.className='split-stem-card'+(item?'':' dim');
  const head=document.createElement('div');head.className='split-stem-top';
  const title=document.createElement('div');title.className='split-stem-heading';
  const ico=document.createElement('span');ico.className='split-ico';ico.textContent=STEM_ICONS[name];
  const pair=document.createElement('div');pair.innerHTML='<div class="split-stem-name"></div><div class="split-stem-status"></div>';
  pair.firstElementChild.textContent=STEM_DESCRIPTIONS[name];
  pair.lastElementChild.textContent=item?(item.provenance==='specialist'?'Model khusus MVSep':'Stem terpisah'):(name==='synth'||name==='strings'?'Perlu model khusus':'Belum tersedia');
  title.append(ico,pair);head.append(title);
  const check=document.createElement('input');check.type='checkbox';check.className='split-check';check.dataset.stemSelect=name;check.checked=!!item;check.disabled=!item;check.setAttribute('aria-label','Pilih '+STEM_DESCRIPTIONS[name]);head.append(check);card.append(head);
  if(item){
   const audio=document.createElement('audio');audio.controls=true;audio.preload='none';audio.src=AI_LOCAL_URL+item.audio;card.append(audio);
   const actions=document.createElement('div');actions.className='split-stem-actions';
   const dlExt=$('#split-audio-format').value==='wav'&&item.wav?'wav':'mp3';
   const download=document.createElement('a');download.href=AI_LOCAL_URL+(dlExt==='wav'?item.wav:item.audio);download.download='CHORD_ATLAS_'+name+'.'+dlExt;download.textContent='↓ Unduh '+dlExt.toUpperCase();actions.append(download);
   if(item.midi_available){
    const midi=document.createElement('button');midi.type='button';midi.dataset.stemMidi=name;midi.textContent='♮ Jadi MIDI → Piano Roll';actions.append(midi);
    if(item.midi){const midilink=document.createElement('a');midilink.href=AI_LOCAL_URL+item.midi;midilink.download=name+'.mid';midilink.textContent='↓ MIDI';actions.append(midilink);}
   }
   card.append(actions);
  }
  box.append(card);
 }
}
async function stemRefresh(){
 if(!stemView.job)return;
 const job=await stemJSON('/api/stems/jobs/'+encodeURIComponent(stemView.job));
 renderStemCards(job.stems||[]);if(job.extra_status)stemMsg(job.extra_status);
}
async function stemZip(){
 if(!stemView.job){stemMsg('Pisahkan lagu terlebih dahulu.',true);return;}
 const names=[...document.querySelectorAll('[data-stem-select]:checked')].map(x=>x.dataset.stemSelect);
 if(!names.length){stemMsg('Pilih minimal satu instrumen untuk diunduh.',true);return;}
 const btn=$('#split-download-zip');btn.disabled=true;
 try{
  stemMsg('Menyiapkan ZIP '+names.length+' stem...');
  const response=await fetch(AI_LOCAL_URL+'/api/stems/jobs/'+stemView.job+'/zip',{
   method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stems:names,format:$('#split-audio-format').value})});
  if(!response.ok){let j=await response.json();throw Error(j.detail||'Gagal membuat ZIP');}
  const blob=await response.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='CHORD_ATLAS_stems.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  stemMsg(names.length+' stem disiapkan dalam ZIP.');
 }catch(e){stemMsg('Unduh gagal: '+e.message,true)}finally{btn.disabled=false}
}
async function stemToMidi(name,button){
 if(!stemView.job)return;
 button.disabled=true;stemMsg('Menyiapkan konversi '+name+' ke MIDI (model Basic Pitch)...');
 try{
  const accept=await stemJSON('/api/stems/jobs/'+stemView.job+'/midi/'+name,{method:'POST'});
  const data=await stemPoll(accept.job_id,job=>stemMsg((job.stage||'Membaca nada')+' · '+name));
  const notes=(data.notes||[]).filter(n=>Number.isFinite(n.midi)&&Number.isFinite(n.start)&&Number.isFinite(n.duration));
  if(notes.length){
   stopRoll();rollState.notes=notes.map(n=>({...n,source:'analyzed'}));rollState.midiAll=null;
   rollState.seconds=Math.max(16,Number(data.audio_duration)||0,notes.reduce((m,n)=>Math.max(m,n.start+n.duration),0)+2);rollState.playhead=-2.8;renderRoll();
   stemMsg(notes.length+' nada perkiraan dari stem '+name+' sudah masuk Piano Roll. Periksa nadanya dulu.');
  }else stemMsg('MIDI dibuat, tapi tidak ada not yang terbaca. Coba stem lain.');
  await stemRefresh();
 }catch(e){stemMsg('MIDI gagal: '+e.message,true)}finally{button.disabled=false}
}
async function stemSpecialist(target,btn){
 if(!stemView.job){stemMsg('Pisahkan 6 stem dulu untuk membuka model khusus.',true);return;}
 const token=$('#split-mvsep-token').value.trim();if(!token){stemMsg('Isi API token MVSep untuk model khusus '+target+'.',true);return;}
 btn.disabled=true;const form=new FormData();form.set('target',target);form.set('api_token',token);
 try{
  await stemJSON('/api/stems/jobs/'+stemView.job+'/specialist',{method:'POST',body:form});
  // Token is never stored in app state; clear it after sending.
  $('#split-mvsep-token').value='';stemMsg('Proses MVSep '+target+' dimulai. Menunggu hasil...');
  for(let i=0;i<360;i++){
   await new Promise(r=>setTimeout(r,5000));
   const job=await stemJSON('/api/stems/jobs/'+stemView.job);
   const available=(job.stems||[]).some(s=>s.key===target);
   if(available){renderStemCards(job.stems);stemMsg(target+' berhasil dipisah. Kini bisa diunduh atau dibuat MIDI.');return;}
   if((job.extra_status||'').startsWith('Pemisahan '+target+' gagal'))throw Error(job.extra_status);
   if(job.extra_status)stemMsg(job.extra_status);
  }
  stemMsg('Model MVSep masih memproses. Klik Cek mesin atau pisahkan ulang jika ingin memeriksa hasilnya.');
 }catch(e){stemMsg('Model khusus gagal: '+e.message,true)}finally{btn.disabled=false}
}
function initStemSplitter(){
 $('#split-input-mode').addEventListener('change',stemInputChanged);stemInputChanged();
 $('#split-check').addEventListener('click',stemCheck);
 $('#split-audio-format').addEventListener('change',()=>{if(stemView.job)stemRefresh().catch(e=>stemMsg(e.message,true))});
 $('#split-run').addEventListener('click',stemRun);
 $('#split-select-all').addEventListener('click',()=>{document.querySelectorAll('[data-stem-select]:not(:disabled)').forEach(x=>x.checked=true);stemZip()});
 $('#split-download-zip').addEventListener('click',stemZip);
 $('#split-stem-grid').addEventListener('click',e=>{const btn=e.target.closest('[data-stem-midi]');if(btn)stemToMidi(btn.dataset.stemMidi,btn)});
 $('#split-extra-synth').addEventListener('click',()=>stemSpecialist('synth',$('#split-extra-synth')));
 $('#split-extra-strings').addEventListener('click',()=>stemSpecialist('strings',$('#split-extra-strings')));
 $('#jump-ai-studio').addEventListener('click',()=>$('#atlas-stem-splitter').scrollIntoView({behavior:'smooth',block:'start'}));
}
initStemSplitter();
})();
