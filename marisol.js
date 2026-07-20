/* ============================================================
   1 MARISOL POINT — marisol.js
   Scene library (SVG placeholders) + page behaviors.
   A Bru Design Studio demo listing.
   NOTE: scenes use gradients + SMIL only — never SVG blur
   filters combined with SMIL (Safari/Chrome perf cliff).
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────
     SVG SCENES — injected once per page so every placeholder
     <use href="#scnXxx"> resolves. Single source of truth.
     ───────────────────────────────────────────────────────── */
  var SCENES =
  '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +

  /* gradients */
  '<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1533"/><stop offset=".38" stop-color="#4a2d4e"/><stop offset=".62" stop-color="#94524c"/><stop offset=".82" stop-color="#c97b54"/><stop offset="1" stop-color="#edb27a"/></linearGradient>' +
  '<radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="gWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdca6"/><stop offset="1" stop-color="#d98e4f"/></linearGradient>' +
  '<linearGradient id="gPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d99a63"/><stop offset=".45" stop-color="#7c4a52"/><stop offset="1" stop-color="#241a2e"/></linearGradient>' +
  '<linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a10"/><stop offset="1" stop-color="#0c0805"/></linearGradient>' +
  '<radialGradient id="gFire" cx=".5" cy=".8" r=".8"><stop offset="0" stop-color="#ffbe78"/><stop offset=".55" stop-color="#e07f3a" stop-opacity=".8"/><stop offset="1" stop-color="#e07f3a" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="gPend" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe4b3"/><stop offset=".4" stop-color="#ffd9a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>' +
  '<linearGradient id="gPoolTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6f7d"/><stop offset="1" stop-color="#7cc5cd"/></linearGradient>' +
  '<linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31506b"/><stop offset="1" stop-color="#1a2733"/></linearGradient>' +
  '<radialGradient id="gCloud" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5b3a55" stop-opacity=".5"/><stop offset="1" stop-color="#5b3a55" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="gWarmSoft" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffca8a" stop-opacity=".55"/><stop offset="1" stop-color="#ffca8a" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="gLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe4b3" stop-opacity=".95"/><stop offset=".45" stop-color="#ffd9a0" stop-opacity=".5"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>' +
  '<radialGradient id="gAqua" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#bdf2ff" stop-opacity=".9"/><stop offset="1" stop-color="#8fd8e8" stop-opacity="0"/></radialGradient>' +

  /* ====== twilight exterior ====== */
  '<symbol id="scnExt" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="700" fill="url(#gSky)"/>' +
  '<ellipse cx="1040" cy="655" rx="520" ry="150" fill="url(#gGlow)" opacity=".7"/>' +
  '<g fill="#f7ead0"><g><circle cx="150" cy="90" r="1.6"/><circle cx="520" cy="70" r="1.8"/><circle cx="905" cy="60" r="1.5"/><circle cx="1320" cy="65" r="1.7"/><circle cx="240" cy="230" r="1.1"/><animate attributeName="opacity" values="1;.3;1" dur="3.4s" repeatCount="indefinite"/></g>' +
  '<g opacity=".75"><circle cx="340" cy="150" r="1.3"/><circle cx="705" cy="120" r="1.2"/><circle cx="1130" cy="105" r="1.3"/><circle cx="1480" cy="140" r="1.2"/><circle cx="1240" cy="215" r="1.1"/><animate attributeName="opacity" values=".3;.8;.3" dur="4.2s" repeatCount="indefinite"/></g></g>' +
  '<g><g><ellipse cx="380" cy="205" rx="260" ry="34" fill="url(#gCloud)"/><ellipse cx="560" cy="240" rx="180" ry="26" fill="url(#gCloud)"/><animateTransform attributeName="transform" type="translate" values="0 0;70 0;0 0" dur="46s" repeatCount="indefinite"/></g>' +
  '<g><ellipse cx="1180" cy="165" rx="290" ry="32" fill="url(#gCloud)"/><ellipse cx="1370" cy="205" rx="190" ry="24" fill="url(#gCloud)"/><animateTransform attributeName="transform" type="translate" values="0 0;-80 0;0 0" dur="54s" repeatCount="indefinite"/></g></g>' +
  '<path d="M0,620 C220,585 420,600 640,588 C900,574 1150,596 1360,580 C1470,572 1550,578 1600,572 L1600,700 L0,700 Z" fill="#241710"/>' +
  '<g><rect x="744" y="318" width="362" height="14" fill="#0e0904"/><rect x="744" y="316" width="362" height="3" fill="#e8a35c" opacity=".55"/><rect x="760" y="332" width="330" height="128" fill="#150d07"/>' +
  '<rect x="782" y="352" width="286" height="88" fill="url(#gWin)" opacity=".92"><animate attributeName="opacity" values="0;.92" begin="0.9s" dur="1.1s" fill="freeze"/></rect>' +
  '<g fill="#0e0904"><rect x="852" y="352" width="5" height="88"/><rect x="924" y="352" width="5" height="88"/><rect x="996" y="352" width="5" height="88"/></g>' +
  '<rect x="460" y="456" width="680" height="16" fill="#0e0904"/><rect x="460" y="454" width="680" height="3" fill="#e8a35c" opacity=".55"/><rect x="480" y="472" width="640" height="188" fill="#150d07"/>' +
  '<rect x="508" y="498" width="430" height="162" fill="url(#gWin)"><animate attributeName="opacity" values="0;1" begin="0.4s" dur="1.1s" fill="freeze"/></rect>' +
  '<g fill="#0e0904"><rect x="562" y="498" width="6" height="162"/><rect x="622" y="498" width="6" height="162"/><rect x="682" y="498" width="6" height="162"/><rect x="742" y="498" width="6" height="162"/><rect x="802" y="498" width="6" height="162"/><rect x="862" y="498" width="6" height="162"/></g>' +
  '<g opacity=".4" fill="#8a5426"><rect x="530" y="588" width="70" height="40" rx="8"/><rect x="700" y="596" width="90" height="30" rx="6"/></g>' +
  '<rect x="952" y="512" width="58" height="148" fill="#e8a35c" opacity=".95"><animate attributeName="opacity" values="0;.95" begin="0.65s" dur=".9s" fill="freeze"/></rect>' +
  '<rect x="976" y="512" width="3" height="148" fill="#0e0904"/>' +
  '<rect x="1026" y="472" width="94" height="188" fill="#1e140c"/>' +
  '<g stroke="#2e2013" stroke-width="2" opacity=".7"><line x1="1026" y1="500" x2="1120" y2="500"/><line x1="1026" y1="530" x2="1120" y2="530"/><line x1="1026" y1="560" x2="1120" y2="560"/><line x1="1026" y1="590" x2="1120" y2="590"/><line x1="1026" y1="620" x2="1120" y2="620"/></g>' +
  '<ellipse cx="1046" cy="545" rx="11" ry="11" fill="url(#gLamp)"/><ellipse cx="1098" cy="545" rx="11" ry="11" fill="url(#gLamp)"/></g>' +
  '<g fill="#140d08"><g transform="translate(232,662)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/><path d="M10,-214 C2,-274 8,-310 26,-336 C10,-306 8,-268 16,-212 Z"/></g>' +
  '<g transform="translate(1444,656) scale(.86)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/><path d="M10,-214 C2,-274 8,-310 26,-336 C10,-306 8,-268 16,-212 Z"/></g>' +
  '<g transform="translate(1330,660) scale(.6)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/></g></g>' +
  '<rect x="0" y="660" width="1600" height="42" fill="#1a110a"/>' +
  '<g><ellipse cx="360" cy="678" rx="10" ry="9" fill="url(#gLamp)"/><ellipse cx="640" cy="678" rx="10" ry="9" fill="url(#gLamp)"/><ellipse cx="920" cy="678" rx="10" ry="9" fill="url(#gLamp)"/><ellipse cx="1200" cy="678" rx="10" ry="9" fill="url(#gLamp)"/></g>' +
  '<rect x="0" y="702" width="1600" height="198" fill="url(#gPool)"/><rect x="0" y="700" width="1600" height="3" fill="#f4c98a" opacity=".5"/>' +
  '<ellipse cx="800" cy="762" rx="380" ry="70" fill="url(#gWarmSoft)" opacity=".3"/>' +
  '<g stroke="#ffd9a0" stroke-width="2" fill="none" opacity=".28"><path d="M120,760 Q360,752 620,760 T1120,758 T1560,760"><animate attributeName="opacity" values=".28;.1;.28" dur="5.2s" repeatCount="indefinite"/></path><path d="M60,812 Q330,804 610,812 T1130,810 T1580,812"><animate attributeName="opacity" values=".14;.3;.14" dur="6.4s" repeatCount="indefinite"/></path></g>' +
  '<g opacity=".6"><ellipse cx="420" cy="790" rx="16" ry="14" fill="url(#gAqua)"/><ellipse cx="720" cy="796" rx="16" ry="14" fill="url(#gAqua)"/><ellipse cx="1030" cy="790" rx="16" ry="14" fill="url(#gAqua)"/><ellipse cx="1300" cy="794" rx="16" ry="14" fill="url(#gAqua)"/></g>' +
  '<g fill="#0d0805"><path d="M40,900 L86,806 L108,900 M96,900 L138,760 L172,900 M158,900 L206,798 L236,900 M60,900 L20,820 L2,900 Z"/><path d="M1420,900 L1462,818 L1486,900 M1474,900 L1516,772 L1552,900 M1538,900 L1582,808 L1600,900 Z"/></g>' +
  '</symbol>' +

  /* ====== great room interiors ====== */
  '<symbol id="scnInt" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#17100a"/><rect width="1600" height="660" fill="#1b120a"/>' +
  '<g><rect x="248" y="112" width="1104" height="536" fill="#0d0804"/><rect x="260" y="124" width="1080" height="512" fill="url(#gSky)"/>' +
  '<ellipse cx="1060" cy="620" rx="330" ry="90" fill="url(#gGlow)" opacity=".55"/>' +
  '<path d="M260,560 C450,540 640,552 850,542 C1080,532 1240,548 1340,538 L1340,636 L260,636 Z" fill="#221710"/>' +
  '<g fill="#140d08" transform="translate(430,568) scale(.36)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/></g>' +
  '<g fill="#140d08" transform="translate(1210,572) scale(.42)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/></g>' +
  '<ellipse cx="850" cy="626" rx="260" ry="16" fill="url(#gWarmSoft)" opacity=".8"/>' +
  '<g fill="#0d0804"><rect x="470" y="124" width="8" height="512"/><rect x="686" y="124" width="8" height="512"/><rect x="902" y="124" width="8" height="512"/><rect x="1118" y="124" width="8" height="512"/></g>' +
  '<g fill="#f7ead0" opacity=".9"><circle cx="330" cy="180" r="1.4"><animate attributeName="opacity" values=".9;.25;.9" dur="3.4s" repeatCount="indefinite"/></circle><circle cx="580" cy="150" r="1.6"><animate attributeName="opacity" values=".9;.3;.9" dur="2.8s" repeatCount="indefinite"/></circle><circle cx="840" cy="188" r="1.3"><animate attributeName="opacity" values=".9;.2;.9" dur="4.1s" repeatCount="indefinite"/></circle><circle cx="1120" cy="152" r="1.5"><animate attributeName="opacity" values=".9;.3;.9" dur="3.1s" repeatCount="indefinite"/></circle></g></g>' +
  '<rect x="0" y="648" width="1600" height="252" fill="url(#gFloor)"/>' +
  '<rect x="260" y="652" width="1080" height="170" fill="url(#gSky)" opacity=".1" transform="scale(1,-1) translate(0,-1478)"/>' +
  '<line x1="0" y1="648" x2="1600" y2="648" stroke="#3a2a18" stroke-width="2" opacity=".6"/>' +
  '<ellipse cx="800" cy="790" rx="430" ry="64" fill="#20150d"/>' +
  '<g><rect x="420" y="574" width="500" height="70" rx="16" fill="#0c0704"/><rect x="420" y="560" width="500" height="10" rx="5" fill="#e8a35c" opacity=".18"/><rect x="408" y="620" width="524" height="76" rx="14" fill="#0a0603"/>' +
  '<g fill="#120b06"><rect x="440" y="584" width="110" height="52" rx="10"/><rect x="562" y="584" width="110" height="52" rx="10"/><rect x="684" y="584" width="110" height="52" rx="10"/><rect x="806" y="584" width="96" height="52" rx="10"/></g></g>' +
  '<rect x="620" y="720" width="300" height="18" rx="9" fill="#241608"/><rect x="640" y="738" width="12" height="30" fill="#120b06"/><rect x="888" y="738" width="12" height="30" fill="#120b06"/>' +
  '<ellipse cx="720" cy="716" rx="26" ry="7" fill="#c98a4a" opacity=".7"/>' +
  '<g><rect x="1060" y="600" width="150" height="96" rx="18" fill="#0c0704"/><rect x="1060" y="588" width="150" height="9" rx="4" fill="#e8a35c" opacity=".14"/></g>' +
  '<g><line x1="560" y1="0" x2="560" y2="196" stroke="#0a0603" stroke-width="3"/><circle cx="560" cy="212" r="34" fill="url(#gPend)"/><circle cx="560" cy="210" r="13" fill="#ffdca6"><animate attributeName="opacity" values="1;.86;1" dur="4.4s" repeatCount="indefinite"/></circle>' +
  '<line x1="800" y1="0" x2="800" y2="236" stroke="#0a0603" stroke-width="3"/><circle cx="800" cy="252" r="34" fill="url(#gPend)"/><circle cx="800" cy="250" r="13" fill="#ffdca6"><animate attributeName="opacity" values="1;.9;1" dur="5.1s" repeatCount="indefinite"/></circle>' +
  '<line x1="1040" y1="0" x2="1040" y2="196" stroke="#0a0603" stroke-width="3"/><circle cx="1040" cy="212" r="34" fill="url(#gPend)"/><circle cx="1040" cy="210" r="13" fill="#ffdca6"><animate attributeName="opacity" values="1;.84;1" dur="3.8s" repeatCount="indefinite"/></circle></g>' +
  '<g><rect x="1400" y="400" width="170" height="260" fill="#100a05"/><rect x="1424" y="520" width="122" height="90" rx="6" fill="#070402"/><ellipse cx="1485" cy="592" rx="38" ry="20" fill="url(#gFire)"><animate attributeName="opacity" values="1;.65;.9;.7;1" dur="2.6s" repeatCount="indefinite"/></ellipse><rect x="1400" y="392" width="170" height="8" fill="#e8a35c" opacity=".25"/><ellipse cx="1480" cy="690" rx="160" ry="42" fill="url(#gWarmSoft)" opacity=".22"/></g>' +
  '<g fill="#0d0805"><path d="M120,900 L150,760 L172,900 M160,900 L206,720 L240,900 M226,900 L268,780 L292,900 M130,900 L84,790 L60,900 Z"/><rect x="120" y="866" width="140" height="34" rx="8" fill="#0a0603"/></g>' +
  '</symbol>' +

  /* ====== aerial / drone ====== */
  '<symbol id="scnAir" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#151a10"/>' +
  '<g opacity=".5" fill="#101408"><ellipse cx="300" cy="240" rx="260" ry="140"/><ellipse cx="1380" cy="700" rx="300" ry="160"/><ellipse cx="1200" cy="160" rx="240" ry="110"/></g>' +
  '<rect x="0" y="836" width="1600" height="64" fill="#221d15"/>' +
  '<g stroke="#c9b98f" stroke-width="4" stroke-dasharray="42 34" opacity=".5"><line x1="0" y1="868" x2="1600" y2="868"/></g>' +
  '<path d="M780,836 C770,760 740,700 700,660 L820,660 C800,706 800,770 816,836 Z" fill="#4a3f30" opacity=".75"/>' +
  '<rect x="270" y="90" width="1060" height="700" rx="26" fill="none" stroke="#e8b880" stroke-width="2.5" stroke-dasharray="14 12" opacity=".4"/>' +
  '<g fill="#1c2a14"><circle cx="320" cy="140" r="22"/><circle cx="368" cy="136" r="20"/><circle cx="416" cy="140" r="22"/><circle cx="464" cy="136" r="19"/><circle cx="512" cy="140" r="22"/><circle cx="560" cy="136" r="20"/><circle cx="608" cy="140" r="21"/><circle cx="1284" cy="200" r="22"/><circle cx="1286" cy="252" r="20"/><circle cx="1284" cy="304" r="22"/><circle cx="1286" cy="356" r="19"/><circle cx="1284" cy="408" r="22"/><circle cx="1286" cy="460" r="20"/></g>' +
  '<g><circle cx="360" cy="600" r="58" fill="#182410"/><circle cx="348" cy="588" r="58" fill="#1e2c13" opacity=".7"/><circle cx="1180" cy="640" r="66" fill="#182410"/><circle cx="1166" cy="626" r="66" fill="#1e2c13" opacity=".7"/><circle cx="1240" cy="130" r="44" fill="#182410"/><circle cx="430" cy="330" r="38" fill="#182410"/></g>' +
  '<g><rect x="560" y="230" width="520" height="330" fill="#2b241c"/><rect x="560" y="230" width="520" height="330" fill="none" stroke="#1d1710" stroke-width="3"/><line x1="560" y1="395" x2="1080" y2="395" stroke="#241d16" stroke-width="3"/><rect x="880" y="168" width="270" height="188" fill="#332a20"/><rect x="880" y="168" width="270" height="188" fill="none" stroke="#241d16" stroke-width="3"/><rect x="556" y="230" width="6" height="330" fill="#e8a35c" opacity=".3"/><rect x="876" y="168" width="6" height="188" fill="#e8a35c" opacity=".3"/>' +
  '<rect x="640" y="290" width="66" height="44" rx="8" fill="#ffca8a" opacity=".8"/><ellipse cx="673" cy="312" rx="52" ry="38" fill="url(#gWarmSoft)" opacity=".7"/>' +
  '<rect x="950" y="210" width="56" height="40" rx="8" fill="#ffca8a" opacity=".75"/><ellipse cx="978" cy="230" rx="44" ry="34" fill="url(#gWarmSoft)" opacity=".7"/>' +
  '<rect x="780" y="460" width="80" height="48" rx="8" fill="#ffca8a" opacity=".65"/><ellipse cx="820" cy="484" rx="60" ry="40" fill="url(#gWarmSoft)" opacity=".7"/></g>' +
  '<rect x="380" y="620" width="740" height="190" rx="18" fill="#3a2e21" opacity=".55"/>' +
  '<g><rect x="430" y="646" width="480" height="140" rx="20" fill="url(#gPoolTop)"/><rect x="430" y="646" width="480" height="140" rx="20" fill="none" stroke="#8fd8e8" stroke-width="2" opacity=".5"/>' +
  '<g opacity=".85"><ellipse cx="520" cy="716" rx="12" ry="11" fill="url(#gAqua)"/><ellipse cx="670" cy="716" rx="12" ry="11" fill="url(#gAqua)"/><ellipse cx="820" cy="716" rx="12" ry="11" fill="url(#gAqua)"/></g>' +
  '<ellipse cx="670" cy="716" rx="60" ry="20" fill="none" stroke="#eafcff" stroke-width="1.5" opacity=".4"><animate attributeName="rx" values="20;110" dur="5s" repeatCount="indefinite"/><animate attributeName="ry" values="7;36" dur="5s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;0" dur="5s" repeatCount="indefinite"/></ellipse></g>' +
  '<g fill="#d9c9a8" opacity=".85"><rect x="960" y="656" width="26" height="58" rx="6"/><rect x="998" y="656" width="26" height="58" rx="6"/><rect x="960" y="730" width="26" height="58" rx="6"/><rect x="998" y="730" width="26" height="58" rx="6"/></g>' +
  '<ellipse cx="1050" cy="700" rx="26" ry="26" fill="#c9a06a" opacity=".55"/>' +
  '</symbol>' +

  /* ====== chef's kitchen ====== */
  '<symbol id="scnKit" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#17100a"/><rect width="1600" height="640" fill="#1b120a"/>' +
  '<g><rect x="80" y="110" width="640" height="340" fill="#0d0804"/><rect x="92" y="122" width="616" height="316" fill="url(#gSky)"/>' +
  '<path d="M92,382 C240,370 380,378 520,372 C610,368 660,374 708,370 L708,438 L92,438 Z" fill="#221710"/>' +
  '<g fill="#0d0804"><rect x="292" y="122" width="8" height="316"/><rect x="498" y="122" width="8" height="316"/></g>' +
  '<circle cx="200" cy="180" r="1.5" fill="#f7ead0"><animate attributeName="opacity" values="1;.3;1" dur="3.6s" repeatCount="indefinite"/></circle>' +
  '<circle cx="430" cy="150" r="1.4" fill="#f7ead0"><animate attributeName="opacity" values=".4;.9;.4" dur="4.4s" repeatCount="indefinite"/></circle></g>' +
  '<rect x="770" y="110" width="760" height="190" fill="#120b06"/>' +
  '<g stroke="#241608" stroke-width="3"><line x1="960" y1="110" x2="960" y2="300"/><line x1="1150" y1="110" x2="1150" y2="300"/><line x1="1340" y1="110" x2="1340" y2="300"/></g>' +
  '<rect x="770" y="296" width="760" height="5" fill="#e8a35c" opacity=".3"/>' +
  '<rect x="770" y="301" width="760" height="120" fill="url(#gWin)" opacity=".13"/>' +
  '<rect x="770" y="421" width="760" height="16" fill="#241608"/><rect x="770" y="437" width="760" height="180" fill="#0f0905"/>' +
  '<g stroke="#1d1209" stroke-width="3"><line x1="980" y1="437" x2="980" y2="617"/><line x1="1190" y1="437" x2="1190" y2="617"/><line x1="1400" y1="437" x2="1400" y2="617"/></g>' +
  '<rect x="1035" y="330" width="230" height="91" fill="#0a0603"/><rect x="1050" y="344" width="200" height="64" rx="6" fill="#1d1209"/>' +
  '<rect x="0" y="617" width="1600" height="283" fill="url(#gFloor)"/>' +
  '<line x1="0" y1="617" x2="1600" y2="617" stroke="#3a2a18" stroke-width="2" opacity=".55"/>' +
  '<g><rect x="400" y="620" width="820" height="26" fill="#2a1a0c"/><rect x="400" y="618" width="820" height="3" fill="#e8a35c" opacity=".5"/>' +
  '<rect x="400" y="646" width="820" height="150" fill="#100a05"/><rect x="400" y="646" width="18" height="150" fill="#1c1108"/><rect x="1202" y="646" width="18" height="150" fill="#1c1108"/>' +
  '<rect x="418" y="646" width="784" height="8" fill="url(#gWin)" opacity=".35"/>' +
  '<ellipse cx="810" cy="800" rx="430" ry="26" fill="url(#gWarmSoft)" opacity=".16"/>' +
  '<ellipse cx="640" cy="612" rx="30" ry="7" fill="#c98a4a" opacity=".6"/><ellipse cx="960" cy="612" rx="44" ry="8" fill="#20150d"/></g>' +
  '<g fill="#0c0704"><circle cx="1330" cy="700" r="26"/><rect x="1322" y="700" width="16" height="110"/><circle cx="1440" cy="700" r="26"/><rect x="1432" y="700" width="16" height="110"/></g>' +
  '<g><line x1="560" y1="0" x2="560" y2="150" stroke="#0a0603" stroke-width="3"/><circle cx="560" cy="166" r="30" fill="url(#gPend)"/><circle cx="560" cy="164" r="11" fill="#ffdca6"><animate attributeName="opacity" values="1;.85;1" dur="4.2s" repeatCount="indefinite"/></circle>' +
  '<line x1="810" y1="0" x2="810" y2="150" stroke="#0a0603" stroke-width="3"/><circle cx="810" cy="166" r="30" fill="url(#gPend)"/><circle cx="810" cy="164" r="11" fill="#ffdca6"><animate attributeName="opacity" values="1;.9;1" dur="5s" repeatCount="indefinite"/></circle>' +
  '<line x1="1060" y1="0" x2="1060" y2="150" stroke="#0a0603" stroke-width="3"/><circle cx="1060" cy="166" r="30" fill="url(#gPend)"/><circle cx="1060" cy="164" r="11" fill="#ffdca6"><animate attributeName="opacity" values="1;.87;1" dur="3.6s" repeatCount="indefinite"/></circle></g>' +
  '</symbol>' +

  /* ====== primary suite ====== */
  '<symbol id="scnBed" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#17100a"/><rect width="1600" height="650" fill="#1b120a"/>' +
  '<g><rect x="850" y="90" width="680" height="560" fill="#0d0804"/><rect x="862" y="102" width="656" height="536" fill="url(#gSky)"/>' +
  '<ellipse cx="1280" cy="620" rx="260" ry="80" fill="url(#gGlow)" opacity=".5"/>' +
  '<path d="M862,570 C1000,552 1150,562 1300,554 C1400,549 1470,556 1518,552 L1518,638 L862,638 Z" fill="#221710"/>' +
  '<g fill="#140d08" transform="translate(1030,580) scale(.4)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/></g>' +
  '<g fill="#0d0804"><rect x="1078" y="102" width="8" height="536"/><rect x="1298" y="102" width="8" height="536"/></g>' +
  '<circle cx="960" cy="170" r="1.5" fill="#f7ead0"><animate attributeName="opacity" values="1;.3;1" dur="3.2s" repeatCount="indefinite"/></circle>' +
  '<circle cx="1200" cy="140" r="1.4" fill="#f7ead0"><animate attributeName="opacity" values=".4;.9;.4" dur="4.6s" repeatCount="indefinite"/></circle>' +
  '<circle cx="1420" cy="185" r="1.3" fill="#f7ead0"><animate attributeName="opacity" values=".9;.25;.9" dur="3.9s" repeatCount="indefinite"/></circle></g>' +
  '<rect x="0" y="650" width="1600" height="250" fill="url(#gFloor)"/>' +
  '<line x1="0" y1="650" x2="1600" y2="650" stroke="#3a2a18" stroke-width="2" opacity=".55"/>' +
  '<ellipse cx="500" cy="800" rx="420" ry="56" fill="#20150d"/>' +
  '<g><rect x="150" y="330" width="560" height="200" fill="#120b06"/><rect x="150" y="326" width="560" height="4" fill="#e8a35c" opacity=".4"/>' +
  '<rect x="190" y="470" width="480" height="120" rx="14" fill="#0e0804"/>' +
  '<rect x="190" y="452" width="480" height="34" rx="10" fill="#191007"/>' +
  '<g fill="#241608"><rect x="220" y="430" width="120" height="40" rx="10"/><rect x="360" y="430" width="120" height="40" rx="10"/><rect x="500" y="430" width="120" height="40" rx="10"/></g>' +
  '<rect x="176" y="586" width="508 " height="66" rx="10" fill="#0a0603"/></g>' +
  '<g><rect x="60" y="500" width="80" height="92" fill="#100a05"/><ellipse cx="100" cy="470" rx="26" ry="30" fill="url(#gLamp)"/><rect x="92" y="486" width="16" height="20" fill="#241608"/>' +
  '<rect x="716" y="500" width="80" height="92" fill="#100a05"/><ellipse cx="756" cy="470" rx="26" ry="30" fill="url(#gLamp)"/><rect x="748" y="486" width="16" height="20" fill="#241608"/></g>' +
  '<g><rect x="240" y="130" width="380 " height="150" fill="#0e0904"/><rect x="252" y="142" width="356" height="126" fill="#1d1209"/><path d="M252,268 C330,200 420,240 470,190 C520,150 570,180 608,160 L608,268 Z" fill="#2a1a0c"/></g>' +
  '<ellipse cx="430" cy="690" rx="300" ry="30" fill="url(#gWarmSoft)" opacity=".14"/>' +
  '<g fill="#0d0805"><path d="M1480,900 L1512,770 L1536,900 M1524,900 L1560,740 L1590,900 Z"/><rect x="1488" y="872" width="96" height="28" rx="8" fill="#0a0603"/></g>' +
  '</symbol>' +

  /* ====== spa bath ====== */
  '<symbol id="scnBath" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#1b120a"/>' +
  '<g stroke="#241a10" stroke-width="2" opacity=".8"><line x1="0" y1="180" x2="1600" y2="180"/><line x1="0" y1="360" x2="1600" y2="360"/><line x1="0" y1="540" x2="1600" y2="540"/><line x1="320" y1="0" x2="320" y2="620"/><line x1="640" y1="0" x2="640" y2="620"/><line x1="960" y1="0" x2="960" y2="620"/><line x1="1280" y1="0" x2="1280" y2="620"/></g>' +
  '<g><rect x="1120" y="100" width="400" height="440" fill="#0d0804"/><rect x="1132" y="112" width="376" height="416" fill="url(#gSky)"/>' +
  '<path d="M1132,470 C1230,458 1330,466 1420,460 C1470,457 1495,462 1508,460 L1508,528 L1132,528 Z" fill="#221710"/>' +
  '<rect x="1310" y="112" width="8" height="416" fill="#0d0804"/>' +
  '<circle cx="1230" cy="180" r="1.4" fill="#f7ead0"><animate attributeName="opacity" values="1;.3;1" dur="3.8s" repeatCount="indefinite"/></circle></g>' +
  '<rect x="0" y="620" width="1600" height="280" fill="url(#gFloor)"/>' +
  '<line x1="0" y1="620" x2="1600" y2="620" stroke="#3a2a18" stroke-width="2" opacity=".5"/>' +
  '<g><ellipse cx="620" cy="640" rx="330" ry="88" fill="#d9c9a8"/><ellipse cx="620" cy="628" rx="330" ry="88" fill="#efe3c8"/>' +
  '<ellipse cx="620" cy="622" rx="290" ry="68" fill="#c4b394"/><ellipse cx="620" cy="626" rx="272" ry="60" fill="url(#gWater)" opacity=".55"/>' +
  '<ellipse cx="540" cy="618" rx="60" ry="16" fill="url(#gAqua)" opacity=".5"/>' +
  '<ellipse cx="620" cy="624" rx="120" ry="26" fill="none" stroke="#eafcff" stroke-width="1.5" opacity=".3"><animate attributeName="rx" values="40;190" dur="6s" repeatCount="indefinite"/><animate attributeName="ry" values="9;40" dur="6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".4;0" dur="6s" repeatCount="indefinite"/></ellipse>' +
  '<path d="M290,640 L950,640 L920,760 L320,760 Z" fill="#cbb996"/><path d="M320,760 L920,760 L900,790 L340,790 Z" fill="#a8977a"/></g>' +
  '<g><rect x="300" y="300" width="10" height="250" fill="#241608"/><path d="M310,300 L370,300 L370,312 L310,312 Z" fill="#241608"/><path d="M366,312 L374,312 L370,330 Z" fill="#3a2a18"/>' +
  '<path d="M368,330 C368,330 361,352 361,360 a9,9 0 0 0 18,0 C379,352 372,330 370,330 Z" fill="url(#gAqua)" opacity=".7"><animate attributeName="opacity" values=".7;.3;.7" dur="2.2s" repeatCount="indefinite"/></path></g>' +
  '<g><rect x="40" y="240" width="180" height="360" fill="#120b06"/><rect x="52" y="252" width="156" height="336" fill="#1d1209"/><rect x="52" y="410" width="156" height="6" fill="#2a1a0c"/>' +
  '<ellipse cx="130" cy="330" rx="40" ry="46" fill="url(#gLamp)" opacity=".55"/></g>' +
  '<g><rect x="1000" y="560" width="150" height="14" rx="7" fill="#241608"/>' +
  '<rect x="1030" y="520" width="12" height="40" fill="#efe3c8"/><ellipse cx="1036" cy="512" rx="7" ry="12" fill="url(#gFire)"><animate attributeName="opacity" values="1;.6;.95;.7;1" dur="2.1s" repeatCount="indefinite"/></ellipse>' +
  '<rect x="1070" y="530" width="12" height="30" fill="#efe3c8"/><ellipse cx="1076" cy="522" rx="7" ry="12" fill="url(#gFire)"><animate attributeName="opacity" values=".8;1;.6;1;.8" dur="2.6s" repeatCount="indefinite"/></ellipse>' +
  '<rect x="1110" y="524" width="12" height="36" fill="#efe3c8"/><ellipse cx="1116" cy="516" rx="7" ry="12" fill="url(#gFire)"><animate attributeName="opacity" values="1;.7;1;.55;1" dur="1.8s" repeatCount="indefinite"/></ellipse></g>' +
  '<ellipse cx="620" cy="800" rx="380" ry="30" fill="url(#gWarmSoft)" opacity=".12"/>' +
  '<g fill="#0d0805"><path d="M1520,900 L1548,790 L1568,900 M1558,900 L1588,760 L1600,860 L1600,900 Z"/></g>' +
  '</symbol>' +

  /* ====== cinema ====== */
  '<symbol id="scnCin" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#0a0603"/>' +
  '<rect x="330" y="120" width="940" height="420" fill="#070402"/>' +
  '<rect x="350" y="140" width="900" height="380" fill="url(#gWin)" opacity=".55"><animate attributeName="opacity" values=".55;.4;.6;.45;.55" dur="5.5s" repeatCount="indefinite"/></rect>' +
  '<rect x="350" y="140" width="900" height="380" fill="url(#gSky)" opacity=".5"/>' +
  '<ellipse cx="800" cy="560" rx="560" ry="70" fill="url(#gWarmSoft)" opacity=".2"/>' +
  '<g fill="#f7ead0" opacity=".5"><circle cx="500" cy="220" r="1.6"/><circle cx="900" cy="190" r="1.5"/><circle cx="1130" cy="250" r="1.4"/></g>' +
  '<path d="M350,460 C540,440 760,452 980,442 C1100,437 1190,444 1250,440 L1250,520 L350,520 Z" fill="#241710" opacity=".8"/>' +
  '<g fill="#0e0804"><rect x="240" y="100" width="60" height="480" rx="10"/><rect x="1300" y="100" width="60" height="480" rx="10"/></g>' +
  '<ellipse cx="270" cy="200" rx="9" ry="9" fill="url(#gLamp)" opacity=".6"/><ellipse cx="1330" cy="200" rx="9" ry="9" fill="url(#gLamp)" opacity=".6"/>' +
  '<g><rect x="360" y="620" width="880" height="90" rx="18" fill="#150c06"/>' +
  '<g fill="#1e1108"><rect x="392" y="600" width="150" height="70" rx="14"/><rect x="572" y="600" width="150" height="70" rx="14"/><rect x="752" y="600" width="150" height="70" rx="14"/><rect x="932" y="600" width="150" height="70" rx="14"/><rect x="1085" y="600" width="120" height="70" rx="14"/></g>' +
  '<rect x="360" y="616" width="880" height="4" fill="#e8a35c" opacity=".2"/></g>' +
  '<g><rect x="220" y="760 " width="1160" height="100" rx="20" fill="#100a05"/>' +
  '<g fill="#191007"><rect x="260" y="736" width="180" height="84" rx="16"/><rect x="480" y="736" width="180" height="84" rx="16"/><rect x="700" y="736" width="180" height="84" rx="16"/><rect x="920" y="736" width="180" height="84" rx="16"/><rect x="1140" y="736" width="180" height="84" rx="16"/></g>' +
  '<rect x="220" y="756" width="1160" height="4" fill="#e8a35c" opacity=".25"/></g>' +
  '<g><ellipse cx="330" cy="700" rx="7" ry="6" fill="url(#gLamp)"><animate attributeName="opacity" values="1;.7;1" dur="3.4s" repeatCount="indefinite"/></ellipse><ellipse cx="800" cy="700" rx="7" ry="6" fill="url(#gLamp)"><animate attributeName="opacity" values=".8;1;.8" dur="4.1s" repeatCount="indefinite"/></ellipse><ellipse cx="1270" cy="700" rx="7" ry="6" fill="url(#gLamp)"><animate attributeName="opacity" values="1;.75;1" dur="3.7s" repeatCount="indefinite"/></ellipse></g>' +
  '</symbol>' +

  /* ====== pool terrace ====== */
  '<symbol id="scnPool" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="520" fill="url(#gSky)"/>' +
  '<ellipse cx="800" cy="500" rx="620" ry="130" fill="url(#gGlow)" opacity=".6"/>' +
  '<g fill="#f7ead0"><g><circle cx="220" cy="80" r="1.6"/><circle cx="640" cy="60" r="1.5"/><circle cx="1080" cy="70" r="1.7"/><circle cx="1440" cy="95" r="1.4"/><animate attributeName="opacity" values="1;.3;1" dur="3.6s" repeatCount="indefinite"/></g></g>' +
  '<g><ellipse cx="420" cy="150" rx="240" ry="30" fill="url(#gCloud)"/><ellipse cx="1220" cy="120" rx="270" ry="28" fill="url(#gCloud)"/><animateTransform attributeName="transform" type="translate" values="0 0;60 0;0 0" dur="50s" repeatCount="indefinite"/></g>' +
  '<path d="M0,470 C260,440 520,462 800,448 C1080,434 1340,458 1600,438 L1600,520 L0,520 Z" fill="#241710"/>' +
  '<g fill="#140d08"><g transform="translate(180,505) scale(.7)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C-20,-268 -58,-292 -102,-296 C-60,-282 -28,-258 6,-208 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/></g>' +
  '<g transform="translate(1470,500) scale(.55)"><path d="M-7,0 C-12,-84 -3,-168 7,-216 L15,-213 C9,-152 11,-72 17,0 Z"/><path d="M10,-214 C-42,-252 -96,-258 -138,-236 C-92,-248 -44,-238 8,-204 Z"/><path d="M10,-214 C62,-254 118,-258 158,-234 C114,-248 64,-238 12,-204 Z"/><path d="M10,-214 C40,-270 80,-292 124,-294 C82,-282 48,-256 14,-208 Z"/></g></g>' +
  '<rect x="0" y="520" width="1600" height="60" fill="#1a110a"/>' +
  '<g><ellipse cx="300" cy="548" rx="10" ry="9" fill="url(#gLamp)"/><ellipse cx="800" cy="548" rx="10" ry="9" fill="url(#gLamp)"/><ellipse cx="1300" cy="548" rx="10" ry="9" fill="url(#gLamp)"/></g>' +
  '<rect x="0" y="580" width="1600" height="320" fill="url(#gPoolTop)"/>' +
  '<rect x="0" y="578" width="1600" height="3" fill="#f4c98a" opacity=".5"/>' +
  '<rect x="0" y="580" width="1600" height="320" fill="url(#gPool)" opacity=".35"/>' +
  '<g stroke="#eafcff" stroke-width="2" fill="none" opacity=".3"><path d="M100,660 Q360,650 640,660 T1160,656 T1600,660"><animate attributeName="opacity" values=".3;.12;.3" dur="5s" repeatCount="indefinite"/></path><path d="M40,760 Q320,750 620,760 T1180,756 T1600,760"><animate attributeName="opacity" values=".15;.32;.15" dur="6.2s" repeatCount="indefinite"/></path><path d="M120,840 Q400,832 700,840 T1240,836 T1600,840"><animate attributeName="opacity" values=".26;.1;.26" dur="7s" repeatCount="indefinite"/></path></g>' +
  '<g opacity=".7"><ellipse cx="380" cy="700" rx="18" ry="15" fill="url(#gAqua)"/><ellipse cx="820" cy="720" rx="18" ry="15" fill="url(#gAqua)"/><ellipse cx="1240" cy="700" rx="18" ry="15" fill="url(#gAqua)"/></g>' +
  '<g fill="#d9c9a8" opacity=".9"><rect x="1330" y="600" width="34" height="84" rx="8" transform="rotate(8 1347 642)"/><rect x="1400" y="596" width="34" height="84" rx="8" transform="rotate(8 1417 638)"/></g>' +
  '<g><rect x="1470" y="470" width="8" height="130" fill="#241608"/><path d="M1408,478 L1540,478 L1474,432 Z" fill="#c9a06a" opacity=".8"/></g>' +
  '<ellipse cx="800" cy="640" rx="420" ry="60" fill="url(#gWarmSoft)" opacity=".18"/>' +
  '</symbol>' +

  /* ====== wine cellar ====== */
  '<symbol id="scnCellar" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#100a05"/>' +
  '<path d="M120,900 L120,360 C120,180 380,90 800,90 C1220,90 1480,180 1480,360 L1480,900 Z" fill="#17100a"/>' +
  '<path d="M120,360 C120,180 380,90 800,90 C1220,90 1480,180 1480,360" fill="none" stroke="#2a1a0c" stroke-width="10"/>' +
  '<g fill="#0d0804"><rect x="180" y="300" width="380" height="560"/><rect x="1040" y="300" width="380" height="560"/></g>' +
  '<g stroke="#241608" stroke-width="4"><line x1="180" y1="440" x2="560" y2="440"/><line x1="180" y1="580" x2="560" y2="580"/><line x1="180" y1="720" x2="560" y2="720"/><line x1="1040" y1="440" x2="1420" y2="440"/><line x1="1040" y1="580" x2="1420" y2="580"/><line x1="1040" y1="720" x2="1420" y2="720"/></g>' +
  '<g fill="#3a2415">' +
  '<circle cx="240" cy="380" r="16"/><circle cx="300" cy="380" r="16"/><circle cx="360" cy="380" r="16"/><circle cx="420" cy="380" r="16"/><circle cx="480" cy="380" r="16"/>' +
  '<circle cx="240" cy="520" r="16"/><circle cx="300" cy="520" r="16"/><circle cx="360" cy="520" r="16"/><circle cx="420" cy="520" r="16"/><circle cx="480" cy="520" r="16"/>' +
  '<circle cx="240" cy="660" r="16"/><circle cx="300" cy="660" r="16"/><circle cx="360" cy="660" r="16"/><circle cx="420" cy="660" r="16"/><circle cx="480" cy="660" r="16"/>' +
  '<circle cx="1100" cy="380" r="16"/><circle cx="1160" cy="380" r="16"/><circle cx="1220" cy="380" r="16"/><circle cx="1280" cy="380" r="16"/><circle cx="1340" cy="380" r="16"/>' +
  '<circle cx="1100" cy="520" r="16"/><circle cx="1160" cy="520" r="16"/><circle cx="1220" cy="520" r="16"/><circle cx="1280" cy="520" r="16"/><circle cx="1340" cy="520" r="16"/>' +
  '<circle cx="1100" cy="660" r="16"/><circle cx="1160" cy="660" r="16"/><circle cx="1220" cy="660" r="16"/><circle cx="1280" cy="660" r="16"/><circle cx="1340" cy="660" r="16"/></g>' +
  '<g fill="#57351c" opacity=".85"><circle cx="300" cy="380" r="7"/><circle cx="420" cy="520" r="7"/><circle cx="240" cy="660" r="7"/><circle cx="1160" cy="380" r="7"/><circle cx="1280" cy="660" r="7"/><circle cx="1100" cy="520" r="7"/></g>' +
  '<g><line x1="800" y1="90" x2="800" y2="240" stroke="#0a0603" stroke-width="3"/><circle cx="800" cy="258" r="36" fill="url(#gPend)"/><circle cx="800" cy="256" r="13" fill="#ffdca6"><animate attributeName="opacity" values="1;.82;1" dur="4.6s" repeatCount="indefinite"/></circle></g>' +
  '<g><rect x="640" y="560" width="320" height="22" rx="6" fill="#241608"/><rect x="660" y="582" width="20" height="180" fill="#170e07"/><rect x="920" y="582" width="20" height="180" fill="#170e07"/>' +
  '<path d="M760,500 L774,500 L774,532 L784,560 L750,560 L760,532 Z" fill="#1d1209"/><path d="M762,505 L772,505 L772,528 L762,528 Z" fill="#7c1f24" opacity=".8"/>' +
  '<path d="M820,506 L850,506 L846,522 L840,530 L840,552 L852,560 L818,560 L830,552 L830,530 L824,522 Z" fill="#d9c9a8" opacity=".35"/></g>' +
  '<rect x="0" y="860" width="1600" height="40" fill="#0a0603"/>' +
  '<ellipse cx="800" cy="720" rx="360" ry="60" fill="url(#gWarmSoft)" opacity=".14"/>' +
  '</symbol>' +

  /* ====== floorplan · main level ====== */
  '<symbol id="scnPlan" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#f7ead0"/>' +
  '<g stroke="#2e2418" opacity=".05"><path d="M0,150 H1600 M0,300 H1600 M0,450 H1600 M0,600 H1600 M0,750 H1600 M200,0 V900 M400,0 V900 M600,0 V900 M800,0 V900 M1000,0 V900 M1200,0 V900 M1400,0 V900"/></g>' +
  '<rect x="340" y="150" width="920" height="540" fill="#fcf5e7" stroke="#2e2418" stroke-width="10"/>' +
  '<g stroke="#2e2418" stroke-width="6"><line x1="760" y1="150" x2="760" y2="420"/><line x1="760" y1="500" x2="760" y2="690"/><line x1="340" y1="470" x2="620" y2="470"/><line x1="700" y1="470" x2="760" y2="470"/><line x1="1060" y1="150" x2="1060" y2="300"/><line x1="1060" y1="380" x2="1060" y2="470"/><line x1="760" y1="470" x2="980" y2="470"/><line x1="1060" y1="470" x2="1260" y2="470"/></g>' +
  '<g fill="none" stroke="#7e5a2b" stroke-width="2.5"><path d="M760,420 A80,80 0 0 1 840,500" opacity=".7"/><path d="M660,470 A60,60 0 0 0 700,410" opacity=".7"/><path d="M1060,300 A80,80 0 0 1 980,380" opacity=".7" transform="translate(2040,0) scale(-1,1)"/></g>' +
  '<g fill="none" stroke="#7e5a2b" stroke-width="3"><rect x="420" y="240" width="200" height="60" rx="10"/><rect x="440" y="320" width="160" height="46" rx="8"/><circle cx="560" cy="410" r="4" fill="#7e5a2b"/></g>' +
  '<g fill="none" stroke="#7e5a2b" stroke-width="3"><rect x="830" y="230" width="170" height="52" rx="6"/><rect x="810" y="330" width="200" height="60" rx="30"/><circle cx="840" cy="316" r="9"/><circle cx="890" cy="312" r="9"/><circle cx="940" cy="312" r="9"/><circle cx="984" cy="316" r="9"/><circle cx="840" cy="404" r="9"/><circle cx="890" cy="408" r="9"/><circle cx="940" cy="408" r="9"/><circle cx="984" cy="404" r="9"/></g>' +
  '<g stroke="#7e5a2b" stroke-width="3" fill="none"><rect x="1090" y="520" width="130" height="120" rx="8"/><rect x="1102" y="532" width="46" height="26" rx="6"/><rect x="1162" y="532" width="46" height="26" rx="6"/><line x1="1090" y1="572" x2="1220" y2="572"/></g>' +
  '<g stroke="#7e5a2b" stroke-width="3" fill="none"><ellipse cx="850" cy="580" rx="56" ry="30"/><rect x="940" y="540" width="30" height="70" rx="8"/></g>' +
  '<g><rect x="340" y="700" width="920" height="90" fill="none" stroke="#7e5a2b" stroke-width="3" stroke-dasharray="12 10"/><rect x="420" y="716" width="340" height="58" rx="12" fill="#bfe0e4" stroke="#5d99a4" stroke-width="3" opacity=".85"/><g fill="#7e5a2b" opacity=".7"><rect x="800" y="722" width="14" height="46" rx="4"/><rect x="824" y="722" width="14" height="46" rx="4"/><rect x="848" y="722" width="14" height="46" rx="4"/></g></g>' +
  '<g fill="#6b5a40" font-family="Inter,sans-serif" font-size="17" font-weight="700" letter-spacing="3.5" text-anchor="middle"><text x="540" y="212">GREAT ROOM</text><text x="910" y="205">CHEF\'S KITCHEN</text><text x="1160" y="220" font-size="15">GALLERY</text><text x="540" y="590">CINEMA</text><text x="890" y="520" font-size="15">SPA BATH</text><text x="1155" y="505">PRIMARY SUITE</text><text x="590" y="745" font-size="15" fill="#5d99a4">INFINITY POOL</text><text x="1080" y="745" font-size="15">OCEAN TERRACE</text></g>' +
  '<g stroke="#7e5a2b" stroke-width="2" opacity=".8"><line x1="340" y1="118" x2="1260" y2="118"/><line x1="340" y1="108" x2="340" y2="128"/><line x1="1260" y1="108" x2="1260" y2="128"/></g>' +
  '<text x="800" y="106" fill="#7e5a2b" font-family="Inter,sans-serif" font-size="15" font-weight="700" letter-spacing="2" text-anchor="middle">124\'-6&quot;</text>' +
  '<g font-family="Inter,sans-serif" fill="#6b5a40"><text x="1330" y="806" font-size="15" font-weight="800" letter-spacing="3">1 MARISOL POINT</text><text x="1330" y="830" font-size="12.5" font-weight="600" letter-spacing="2.5">MAIN LEVEL · 7,200 SQFT</text></g>' +
  '<g transform="translate(300,800)"><circle r="26" fill="none" stroke="#7e5a2b" stroke-width="2.5"/><path d="M0,-16 L7,10 L0,4 L-7,10 Z" fill="#7e5a2b"/><text y="-34" text-anchor="middle" fill="#7e5a2b" font-family="Inter,sans-serif" font-size="14" font-weight="800">N</text></g>' +
  '</symbol>' +

  /* ====== floorplan · upper level ====== */
  '<symbol id="scnPlan2" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#f7ead0"/>' +
  '<g stroke="#2e2418" opacity=".05"><path d="M0,150 H1600 M0,300 H1600 M0,450 H1600 M0,600 H1600 M0,750 H1600 M200,0 V900 M400,0 V900 M600,0 V900 M800,0 V900 M1000,0 V900 M1200,0 V900 M1400,0 V900"/></g>' +
  '<rect x="420" y="170" width="760" height="440" fill="#fcf5e7" stroke="#2e2418" stroke-width="10"/>' +
  '<g stroke="#2e2418" stroke-width="6"><line x1="680" y1="170" x2="680" y2="390"/><line x1="680" y1="450" x2="680" y2="610"/><line x1="940" y1="170" x2="940" y2="330"/><line x1="940" y1="400" x2="940" y2="610"/><line x1="420" y1="400" x2="620" y2="400"/><line x1="680" y1="400" x2="880" y2="400"/><line x1="1000" y1="400" x2="1180" y2="400"/></g>' +
  '<g fill="none" stroke="#7e5a2b" stroke-width="2.5" opacity=".7"><path d="M680,390 A60,60 0 0 1 740,450"/><path d="M940,330 A70,70 0 0 1 870,400"/></g>' +
  '<g stroke="#7e5a2b" stroke-width="3" fill="none">' +
  '<rect x="470" y="230" width="100" height="90" rx="8"/><rect x="480" y="238" width="34" height="20" rx="5"/><rect x="524" y="238" width="34" height="20" rx="5"/>' +
  '<rect x="740" y="220" width="110" height="94" rx="8"/><rect x="750" y="228" width="38" height="20" rx="5"/><rect x="798" y="228" width="38" height="20" rx="5"/>' +
  '<rect x="1010" y="220" width="110" height="94" rx="8"/><rect x="1020" y="228" width="38" height="20" rx="5"/><rect x="1068" y="228" width="38" height="20" rx="5"/>' +
  '<rect x="470" y="460" width="150" height="46" rx="8"/><line x1="470" y1="530" x2="620" y2="530"/><line x1="470" y1="552" x2="596" y2="552"/>' +
  '<rect x="740" y="470" width="60" height="110" rx="8"/><rect x="820" y="470" width="90" height="40" rx="20"/>' +
  '<rect x="1010" y="470" width="120" height="100" rx="8"/><rect x="1022" y="480" width="40" height="22" rx="5"/><rect x="1074" y="480" width="40" height="22" rx="5"/></g>' +
  '<g><rect x="420" y="620" width="760" height="80" fill="none" stroke="#7e5a2b" stroke-width="3" stroke-dasharray="12 10"/><g fill="#7e5a2b" opacity=".7"><rect x="500" y="636" width="14" height="44" rx="4"/><rect x="524" y="636" width="14" height="44" rx="4"/><rect x="548" y="636" width="14" height="44" rx="4"/><rect x="572" y="636" width="14" height="44" rx="4"/></g></g>' +
  '<g fill="#6b5a40" font-family="Inter,sans-serif" font-size="15" font-weight="700" letter-spacing="3" text-anchor="middle">' +
  '<text x="545" y="210">GUEST SUITE I</text><text x="805" y="205">GUEST SUITE II</text><text x="1068" y="205">GUEST SUITE III</text>' +
  '<text x="545" y="442">LIBRARY</text><text x="820" y="442">GYM &amp; SPA</text><text x="1080" y="442">MEDIA LOUNGE</text>' +
  '<text x="800" y="668">OCEAN DECK</text></g>' +
  '<g stroke="#7e5a2b" stroke-width="2" opacity=".8"><line x1="420" y1="138" x2="1180" y2="138"/><line x1="420" y1="128" x2="420" y2="148"/><line x1="1180" y1="128" x2="1180" y2="148"/></g>' +
  '<text x="800" y="126" fill="#7e5a2b" font-family="Inter,sans-serif" font-size="15" font-weight="700" letter-spacing="2" text-anchor="middle">98\'-0&quot;</text>' +
  '<g font-family="Inter,sans-serif" fill="#6b5a40"><text x="1330" y="806" font-size="15" font-weight="800" letter-spacing="3">1 MARISOL POINT</text><text x="1330" y="830" font-size="12.5" font-weight="600" letter-spacing="2.5">UPPER LEVEL · 5,200 SQFT</text></g>' +
  '<g transform="translate(300,800)"><circle r="26" fill="none" stroke="#7e5a2b" stroke-width="2.5"/><path d="M0,-16 L7,10 L0,4 L-7,10 Z" fill="#7e5a2b"/><text y="-34" text-anchor="middle" fill="#7e5a2b" font-family="Inter,sans-serif" font-size="14" font-weight="800">N</text></g>' +
  '</symbol>' +

  /* ====== map & walkscore ====== */
  '<symbol id="scnMap" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">' +
  '<rect width="1600" height="900" fill="#191410"/>' +
  '<g opacity=".06" fill="#f7ead0"><rect x="120" y="120" width="180" height="120" rx="8"/><rect x="340" y="90" width="150" height="150" rx="8"/><rect x="540" y="130" width="190" height="110" rx="8"/><rect x="1200" y="120" width="180" height="130" rx="8"/><rect x="160" y="300" width="150" height="130" rx="8"/><rect x="1250" y="320" width="160" height="120" rx="8"/><rect x="380" y="300" width="180" height="120" rx="8"/></g>' +
  '<path d="M0,660 C260,610 520,650 800,626 C1080,602 1340,646 1600,610 L1600,900 L0,900 Z" fill="url(#gWater)"/>' +
  '<g stroke="#7ca6c4" stroke-width="1.6" fill="none" opacity=".3"><path d="M80,730 Q220,720 360,730 T640,728 T920,730 T1200,726 T1520,730"><animate attributeName="opacity" values=".3;.12;.3" dur="6s" repeatCount="indefinite"/></path><path d="M40,800 Q200,790 380,800 T700,798 T1040,800 T1380,796 T1600,800"><animate attributeName="opacity" values=".14;.3;.14" dur="7.4s" repeatCount="indefinite"/></path></g>' +
  '<path d="M0,660 C260,610 520,650 800,626 C1080,602 1340,646 1600,610 L1600,634 C1340,668 1080,626 800,650 C520,674 260,634 0,684 Z" fill="#c9a97a" opacity=".3"/>' +
  '<path d="M0,600 C280,548 560,590 820,562 C1100,534 1340,580 1600,542" fill="none" stroke="#46382a" stroke-width="26"/>' +
  '<path d="M0,600 C280,548 560,590 820,562 C1100,534 1340,580 1600,542" fill="none" stroke="#e8d9b8" stroke-width="2.5" stroke-dasharray="26 22" opacity=".4"/>' +
  '<g stroke="#3a2e22" stroke-width="11" fill="none"><path d="M420,0 C440,180 430,360 452,574"/><path d="M980,0 C960,190 986,380 972,548"/><path d="M1310,0 C1300,200 1320,400 1306,560"/><path d="M452,320 C640,300 800,318 972,300"/></g>' +
  '<path d="M972,430 C1040,436 1090,452 1112,498" fill="none" stroke="#3a2e22" stroke-width="10"/>' +
  '<circle cx="1120" cy="512" r="22" fill="none" stroke="#3a2e22" stroke-width="10"/>' +
  '<g fill="#c7a17a"><circle cx="560" cy="620" r="6" opacity=".9"/><circle cx="330" cy="470" r="6" opacity=".9"/><circle cx="1150" cy="170" r="6" opacity=".9"/></g>' +
  '<g fill="#b39a72" font-family="Inter,sans-serif" font-size="14.5" font-weight="700" letter-spacing="2.5"><text x="584" y="626">BEACH CLUB</text><text x="354" y="476">MARKET &amp; CAFES</text><text x="1174" y="176">SCHOOLS 9/10</text></g>' +
  '<text x="800" y="835" fill="#7ca6c4" font-family="Cormorant Garamond,serif" font-size="30" font-style="italic" letter-spacing="6" text-anchor="middle" opacity=".65">Pacific Ocean</text>' +
  '<text x="250" y="560" fill="#8a765a" font-family="Inter,sans-serif" font-size="14" font-weight="700" letter-spacing="4" transform="rotate(-8 250 560)" opacity=".8">PACIFIC COAST HWY</text>' +
  '<g><circle cx="1120" cy="512" r="16" fill="#e8b880" opacity=".35"><animate attributeName="r" values="16;52" dur="2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".4;0" dur="2.8s" repeatCount="indefinite"/></circle>' +
  '<circle cx="1120" cy="512" r="13" fill="#e8b880" stroke="#241b10" stroke-width="4"/>' +
  '<text x="1152" y="480" fill="#ffe9c4" font-family="Inter,sans-serif" font-size="16" font-weight="800" letter-spacing="3.5">1 MARISOL POINT</text></g>' +
  '<g transform="translate(400,140)"><rect width="240" height="64" rx="14" fill="#241b10" opacity=".88"/><text x="20" y="27" fill="#e8b880" font-family="Inter,sans-serif" font-size="12" font-weight="800" letter-spacing="2.5">WALK SCORE</text><text x="20" y="50" fill="#f7ead0" font-family="Inter,sans-serif" font-size="16" font-weight="800" letter-spacing="1">92 · Beach 0.2 mi</text></g>' +
  '</symbol>' +

  '</defs></svg>';

  /* inject scenes at the top of <body> */
  document.body.insertAdjacentHTML('afterbegin', SCENES);
  if (prefersReduced) document.querySelectorAll('svg').forEach(function (s) { try { s.pauseAnimations(); } catch (e) {} });

  /* ─────────── pause offscreen scenes ───────────
     Every placeholder instantiates a full SMIL scene; with a dozen on a
     page the compositor never rests. Only the scenes in the viewport
     get to animate. */
  if (!prefersReduced) {
    var sceneSvgs = document.querySelectorAll('.ph svg, .lvl svg, .loc-shell svg');
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        try { e.isIntersecting ? e.target.unpauseAnimations() : e.target.pauseAnimations(); } catch (err) {}
      });
    }, { rootMargin: '80px' });
    sceneSvgs.forEach(function (s) {
      try { s.pauseAnimations(); } catch (err) {}
      sio.observe(s);
    });
  }

  /* ─────────── nav ─────────── */
  var nav = document.querySelector('.est-nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    var burger = nav.querySelector('.est-burger');
    var links = nav.querySelector('.est-links');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
      });
    }
  }

  /* ─────────── reveal ─────────── */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ─────────── count-up ─────────── */
  function countUp(el) {
    if (el.dataset.counting === '1') return;
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var fmt = function (v) { return Math.round(v).toLocaleString('en-US'); };
    if (prefersReduced) { el.textContent = fmt(target); return; }
    el.dataset.counting = '1';
    var dur = 1300, t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      if (e.target.dataset.count) countUp(e.target);
      cio.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-countup]').forEach(function (el) { cio.observe(el); });

  /* ─────────── toast ─────────── */
  var toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);
  var toastT = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 4200);
  }
  document.querySelectorAll('[data-demo-note]').forEach(function (el) {
    el.addEventListener('click', function (ev) { ev.preventDefault(); toast(el.dataset.demoNote); });
  });

  /* ─────────── cinematic film ─────────── */
  var filmFrame = document.getElementById('filmFrame');
  var playBtn = document.getElementById('filmPlay');
  if (filmFrame && playBtn) {
    var noteT = null;
    playBtn.addEventListener('click', function () {
      var v = document.createElement('video');
      v.src = 'assets/marisol/film.mp4';
      v.controls = true;
      v.playsInline = true;
      v.setAttribute('aria-label', 'Property film for 1 Marisol Point');
      v.addEventListener('error', function () {
        v.remove();
        filmFrame.classList.add('noted');
        clearTimeout(noteT);
        noteT = setTimeout(function () { filmFrame.classList.remove('noted'); }, 5200);
      });
      v.addEventListener('canplay', function () {
        playBtn.style.display = 'none';
        v.play();
      });
      filmFrame.appendChild(v);
    });
  }

  /* ─────────── lightbox (gallery pages + mosaics) ─────────── */
  var lbItems = Array.prototype.slice.call(document.querySelectorAll('[data-lb] .ph, .ph[data-lb-item]'));
  if (lbItems.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
      '<div class="lb-stage"></div>' +
      '<span class="lb-count"></span>' +
      '<button class="lb-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lb-prev" aria-label="Previous photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="lb-next" aria-label="Next photo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg></button>';
    document.body.appendChild(lb);
    var stage = lb.querySelector('.lb-stage');
    var count = lb.querySelector('.lb-count');
    var cur = 0;

    function visibleItems() {
      return lbItems.filter(function (it) { return it.offsetParent !== null || lb.contains(it); });
    }
    function show(i) {
      var items = visibleItems();
      if (!items.length) return;
      cur = (i + items.length) % items.length;
      var src = items[cur];
      stage.innerHTML = '';
      var clone = src.cloneNode(true);
      clone.classList.remove('hide');
      clone.style.position = 'absolute';
      clone.style.inset = '0';
      clone.removeAttribute('data-lb-item');
      stage.appendChild(clone);
      var capText = src.getAttribute('aria-label') || '';
      var cap = document.createElement('div');
      cap.className = 'lb-cap';
      cap.textContent = capText;
      stage.appendChild(cap);
      count.textContent = (cur + 1) + ' / ' + items.length;
    }
    function open(item) {
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      show(visibleItems().indexOf(item));
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    lbItems.forEach(function (it) {
      it.setAttribute('tabindex', '0');
      it.setAttribute('role', 'button');
      it.addEventListener('click', function () { open(it); });
      it.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); } });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ─────────── gallery filters ─────────── */
  var filters = document.querySelectorAll('.gal-filters button');
  if (filters.length) {
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        var f = b.dataset.f;
        document.querySelectorAll('.gal-grid .ph').forEach(function (t) {
          t.classList.toggle('hide', f !== 'all' && t.dataset.cat !== f);
        });
      });
    });
  }

  /* ─────────── floorplan levels + room pings ─────────── */
  var planShell = document.getElementById('planShell');
  if (planShell) {
    var lvlBtns = planShell.querySelectorAll('.lvl-tabs button');
    var lvls = planShell.querySelectorAll('.lvl');
    var ping = planShell.querySelector('.plan-ping');
    var roomGroups = document.querySelectorAll('.room-list [data-lvl]');
    function setLevel(l) {
      lvlBtns.forEach(function (b) { b.classList.toggle('on', b.dataset.lvl === l); b.setAttribute('aria-pressed', b.dataset.lvl === l); });
      lvls.forEach(function (v) { v.classList.toggle('on', v.dataset.lvl === l); });
      roomGroups.forEach(function (g) { g.style.display = g.dataset.lvl === l ? '' : 'none'; });
      if (ping) ping.classList.remove('show');
      document.querySelectorAll('.room-list button').forEach(function (r) { r.classList.remove('on'); });
    }
    lvlBtns.forEach(function (b) { b.addEventListener('click', function () { setLevel(b.dataset.lvl); }); });
    document.querySelectorAll('.room-list button[data-x]').forEach(function (r) {
      r.addEventListener('click', function () {
        document.querySelectorAll('.room-list button').forEach(function (x) { x.classList.toggle('on', x === r); });
        if (!ping) return;
        ping.style.left = r.dataset.x + '%';
        ping.style.top = r.dataset.y + '%';
        ping.classList.add('show');
        planShell.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest' });
      });
    });
    setLevel('main');
  }

  /* ─────────── demo forms ─────────── */
  document.querySelectorAll('.form-wrap form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      f.closest('.form-wrap').classList.add('sent');
    });
  });

  /* ─────────── brochure gate ─────────── */
  var gate = document.getElementById('brochureGate');
  var brochure = document.getElementById('brochureBody');
  if (gate && brochure) {
    function unlock() {
      gate.style.display = 'none';
      brochure.classList.add('unlocked');
      brochure.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }
    if (sessionStorage.getItem('marisolBrochure') === '1') unlock();
    gate.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      sessionStorage.setItem('marisolBrochure', '1');
      unlock();
      toast('Access granted — on a live listing, this also emails the brochure and notifies the agent.');
    });
  }

  /* ─────────── legacy deep links (old real-estate.html params) ─────────── */
  if (document.body.dataset.page === 'home') {
    var qs = new URLSearchParams(location.search);
    var map = { ext: '#top', int: '#gallery', air: '#film', plan: '#floorplan', map: '#location' };
    var dest = map[qs.get('scene')] || (qs.get('goto') === 'demo' ? '#gallery' : null);
    if (qs.has('reveal')) document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    if (dest && dest !== '#top') window.addEventListener('load', function () {
      setTimeout(function () {
        var el = document.querySelector(dest);
        if (!el) return;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 70);
        document.documentElement.style.scrollBehavior = '';
      }, 250);
    });
  }
})();
