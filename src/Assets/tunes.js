export const stranger_tune = `setcps(140/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const gain_patterns = [
  "2",
  "{0.75 2.5}*4",
    "{0.75 2.5!9 0.75 2.5!5 0.75 2.5 0.75 2.5!7 0.75 2.5!3 <2.5 0.75> 2.5}%16",
]

const drum_structure = [
"~",
"x*4",
"{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16",
]

const basslines = [
  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8",
  "[[eb1, eb2]!16 [bb2, bb1]!16 [g2, g1]!16 [f2, f1]!4 [bb1, bb2]!4 [eb1, eb2]!4 [f1, f2]!4]/8"
]

const arpeggiator1 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
]

const arpeggiator2 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{d5 bb4 g4 d4 bb3 g3 d4 bb3 eb3 d3 bb2 eb2}%16",
]


const pattern = 0
const bass = 0

bassline:
note(pick(basslines, bass))
.sound("supersaw")
.postgain(2)
.room(0.6)
.lpf(700)
.room(0.4)
.postgain(pick(gain_patterns, pattern))


main_arp: 
note(pick(arpeggiator1, "<0 1 2 3>/2"))
.sound("supersaw")
.lpf(300)
.adsr("0:0:.5:.1")
.room(0.6)
.lpenv(3.3)
.postgain(pick(gain_patterns, pattern))


drums:
stack(
  s("tech:5")
  .postgain(6)
  .pcurve(2)
  .pdec(1)
  .struct(pick(drum_structure, pattern)),

  s("sh").struct("[x!3 ~!2 x!10 ~]")
  .postgain(0.5).lpf(7000)
  .bank("RolandTR808")
  .speed(0.8).jux(rev).room(sine.range(0.1,0.4)).gain(0.6),

  s("{~ ~ rim ~ cp ~ rim cp ~!2 rim ~ cp ~ < rim ~ >!2}%8 *2")
  .bank("[KorgDDM110, OberheimDmx]").speed(1.2)
  .postgain(.25),
)

drums2: 
stack(
  s("[~ hh]*4").bank("RolandTR808").room(0.3).speed(0.75).gain(1.2),
  s("hh").struct("x*16").bank("RolandTR808")
  .gain(0.6)
  .jux(rev)
  .room(sine.range(0.1,0.4))
  .postgain(0.5),
  
  s("[psr:[2|5|6|7|8|9|12|24|25]*16]?0.1")
  .gain(0.1)
  .postgain(pick(gain_patterns, pattern))
  .hpf(1000)
  .speed(0.5)
  .rarely(jux(rev)),
)
//Remixed and reproduced from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY
// all(x => x.gain(mouseX.range(0,1)))
// all(x => x.log())

// @version 1.2`;

export const birds_of_a_feather = `setcps(105/60/4)

let m1 =
note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24")).s("gm_kalimba:3").legato(1.5).fast(2)
.attack(.025).release(.2).lp(1000)
.room(".6:2").postgain(1.5).color('#4dbcf4')._pitchwheel({edo:12,hapRadius:3,thickness:3,circle:1})

let m2 = 
note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24"))
.layer(
x=>x.s("gm_kalimba:3").legato(1.5).attack(.025).release(.2).lp(1000).room(".6:2").postgain(2),
x=>x.s("gm_acoustic_guitar_steel:6").clip(1.5).release(.2).room(".6:2").postgain(1)
).fast(2)

let dr =
stack( s("[bd:<1 0>(<3 1>,8,<0 2>:1.3)] , [~ sd:<15>:2.5]").note("B1").bank("LinnDrum")
.decay(.3).room(".3:2").fast(2),

s("[LinnDrum_hh(<3 2>,8)]").hp("1000").lp("9000").decay(.3).velocity([".8 .6"]).room(".3:2").fast(2),
s("sh*8").note("B1").bank("RolandTR808").room(".6:2").velocity("[.8 .5]!4").postgain(1.5).fast(2))._pianoroll({vertical:0,flipTime:1,fill:0,labels:1})

let chord =
n(\`<[[0,2,4,6] ~!3] ~ ~ ~
[[-1,0,2,4] ~!3] ~ ~ ~ 
[[1,3,5,7] ~!3]  ~ ~ ~
[[-2,0,1,3] ~!3]  ~ [[-2,-1,1,3] ~!3] ~ 
>\`).scale("D:major").s("gm_epiano1:6")  
.decay(1.5).release(.25).lp(2500).delay(".45:.1:.3").room(".6:2")
.postgain(1.5).fast(2)

let bass1note =
n("<0 -1 1 -2>/2").scale("D1:major").s("gm_lead_8_bass_lead:1")
.lp(800).clip(.1).attack(.2).release(.12)
.delay(".45:.1:.3").room(".6:2")
.postgain(1.3)._pianoroll({labels:1})

let bassline =
note("<[D2!28 Cs2!4] B1*32 [E2!28 D2!4] A1*32>/2").s("gm_electric_bass_pick")
.decay(.5).velocity(rand.range(.7,1).fast(4))
.lp(1000).compressor("-20:20:10:.002:.02").room(".6:2")
.postgain(1.5).color('white')._scope({thickness:2})

let chordOrg =
n(\`<[0,2,4,6]
[-1,0,2,4]
[1,3,5,7]
[-2,0,1,3]
>/2\`).scale("D2:major").s("gm_church_organ:4")
.legato(1).delay(".45:.1:.3").room(".6:2")
.postgain(.6)._pianoroll({labels:1,fill:0,strikeActive:1})

let chordArp =
n(\`<[0 2 4 6]*8
[-1 0 2 4]*8
[1 3 5 7]*8
[-2 0 1 3]*8
>/2\`).scale("D4:major").s("gm_electric_guitar_jazz:<2 3>")
.legato(.08).delay(".45:.1:.3").room(".6:2").velocity(saw.range(.8,1).fast(4))
.juxBy(1,rev())
.postgain(1.8)

$:arrange(
  [2,stack(m1,dr)],
  [8,s_polymeter(m1,dr,chord,bass1note)],
  [8,s_polymeter(m1,dr,chord,bass1note,bassline)],
  [8,s_polymeter(m2,dr,chord,bass1note,bassline,chordArp)],
  [8,s_polymeter(m2,dr,chord,bass1note,bassline,chordOrg,chordArp)],
  [4,s_polymeter(m2,dr,chord,bass1note,bassline,chordOrg,chordArp)],
  [4,s_polymeter(m2,arrange([2,dr],[2,silence]).fast(4),bass1note,bassline,chordOrg)]
  )

.color("<pink cyan green orange>").punchcard({labels:1,vertical:1,flipTime:1,fill:0,strokeActive:1,filpValue:1,fontFamily:'teletext'})

`;

export const pump_up_the_jam = `
// "Pump Up The Jam" - Work In Progress
// song @by Technotronic
// script @by eefano
const pickRestart = register('pickRestart', (arr, pat) => pat.pick(arr.map((x)=>x.restart(pat.collect().fmap(v=>v+1)))))
const as = register('as', (mapping, pat) => { mapping = Array.isArray(mapping) ? mapping : [mapping];
  return pat.fmap((v) => { v = Array.isArray(v) ? v : [v, 0];
    return Object.fromEntries(mapping.map((prop, i) => [prop, v[i]])); }); });
stack("~"
,"<~@8 0@4 1@4 ~@8>".pickRestart(
  ["[u [u e] a [u i] [u ~] [a u] [i a] [o@3 i] ~ [a e] [a i] [o@3 i] [~ u@2 a] [e e] [o i] [o@3 i]]/4"
  ,"~ [u i] [u ~ ~ a] [i i@2 o]"
]).vowel().s("z_sawtooth").clip(0.8).gain(1.4)
             
,"<~@16 0@8>".pickRestart(
  ["[ ~@2 4 [5:1 ~] ~ [~ 0] [3:-1@5 3:1@2 2]@2 ~ [4@3:1 3 3@3 2 2@3 3 4:1@3 0 0@2 2:2@2]@5 [~ ~ 0@2 ~ 0@2 -2:-3]@2 ]/4"
]).as("n:penv").scale("c4:minor").clip(0.90).patt("0.15").s("square").delay(0.3).dfb(0.3).dt(60/128).gain(0.7)
            
,"<0@32>".pickRestart(
  ["[~@13 [[~@3 [0,-2,-4]@2 ~]@3 [0,-2,-4] [1,-1,-3]!2]@3 ]/4"
]).scale("c4:minor").note().clip(0.7).s("z_sawtooth").color("red").adsr("0.07:.1:0.6:0.1").gain(0.5)

,"<0@12 0 1 ~@2 3@8>".pickRestart(
  ["[0 ~@23]/2"
  ,"~@2 [~ [e2 ~]] [[0 2] ~]"
  ,"[0 ~ ~ 0 ~ ~ 0 ~] <[[~ [0 1]] [2 ~]] ~>"
]).scale("c2:minor").note().clip(0.9)
      .layer(x=>x.s("z_sawtooth").delay(0.6).dfb(0.5).dt(60/125*3/4).pan(0.55).gain(0.8)
            ,x=>x.s("z_square").lpf(300).lpe(2).lpa(-1.5).lpd(0.1).lpr(0.05).pan(0.45).gain(1)).color("green")

,"<0@4 [0,1]@12 [0,1,2]@4 [0,1,2,3]@4>".pickRestart(
 [stack(s("oh*16").pan(0.45).gain("[0.08 0.16]*4").release(0),s("hh*4").pan(0.7).gain(0.20))
 ,s("bd*4").lpf(150).gain(1)
 ,s("[~ cp]*2").gain(0.5).pan(0.25)
 ,s("[~ rd]*4").gain(0.15).release(0).hpf(1500).pan(0.75)
 ,s("[~ sd!3]!4 [sd*4]!4").slow(2).gain(run(32).slow(2).mul(1/31).add(0.1).mul(0.4))
 ,s("cr").gain(0.2)
 ,s("bd").gain(0.8)
 ]).bank("RolandTR909").color("yellow").velocity(0.7)
 
).cpm(124.5/4).room(0.3)

`

export const the_rhythm_of_the_night = `
// "The Rhythm Of The Night" - Work In Progress
// song @by Corona
// script @by eeefano
setDefaultVoicings('legacy')
const as = register('as', (mapping, pat) => { mapping = Array.isArray(mapping) ? mapping : [mapping];
  return pat.fmap((v) => { v = Array.isArray(v) ? v : [v, 0];
    return Object.fromEntries(mapping.map((prop, i) => [prop, v[i]])); }); });

const crdpart = "<~ 0@10 1@24 0@19>".pickRestart(
["Ab Cm Bb F@2".slow(5)
,"Bb@3 Ab@3 Cm@2".slow(8)
]);
stack 
("<0 1@4 0 1@4 ~@8 2 3@7 2 3@7 0 1@4 0 1@4 0 1@4 0 1@4>".pickRestart(
  ["~ [4@3 ~]!3 7:5 6 4 3"
  ,"2:-1 0:-2 ~@4 6:1 4:-1 6 4:2 ~@4 [4:2 3]@3 ~@6 4 7:5 6 [4@2 ~] [3:-1 2@3]@2 0 ~@2".slow(4)
  ,"~@6 [6 ~]!2"
  ,"6 5@0.5 [5 ~] [4 ~]!2 [3 ~] 3:2@1.5 ~@7 6@2 6:2 [5 ~ ]!2 4 3@2 4 2 0:-2 ~@7 [0 2]@3 3@2 4 6:4 4:-4 ~ 0 2 0 4 ~ 0 0:2@2 ~@7".slow(7)
]).as("n:penv").scale("c4:minor").patt("0.07").s("gm_lead_1_square").room(0.4).delay(0.3).dfb(0.35).dt(60/128).gain(0.85)

,crdpart.chord().anchor("F4").voicing().s("gm_synth_strings_1").color("blue").gain(0.4)

,"<~@11 1@23 ~ 0@19>".pickRestart(
  ["2 ~@2 2 ~@2 2 ~@3 2 ~@3 2 ~"
  ,"[2 ~@2 2 ~@2 2 ~]!2"
]).n().chord(crdpart).anchor(crdpart.rootNotes(2)).voicing().s("gm_synth_bass_1").lpf(1500).room(0.5).color("green").gain(0.9)

,"<~@11 1@8 ~@16 0@19>".pickRestart(
  ["<5 7 6 3!2> ~ 9 ~ 10 ~ ~ 12 ~ 11 ~ 10 ~ 11 9 ~"
  ,"<6!3 5!3 7!2> ~ 9 ~ 10 ~ ~ 12 ~ 11 ~ 10 ~ 11 9 ~"
]).scale("c3:minor").note().s("gm_lead_2_sawtooth").room(0.3).delay(0.3).dfb(0.5).dt(60/128*2).color("red").gain(0.6)

,"<[2,3] ~@10 0@6 [0,1]@2 [0,2] 0@5 [0,1]@2 [0,2] 0@6 [2,3] 0@8 [0,1]@2 [0,2] 0@8>".pickRestart(
 [stack(s("bd*4").gain(0.8),s("[~ oh]*4").gain(0.14),s("hh*16").gain(0.09),s("[~ cp]*2").gain(0.4))
 ,s("[~ sd!3]!4 [sd*4]!4").slow(2).gain(run(32).slow(2).mul(1/31).add(0.1).mul(0.4))
 ,s("cr").gain(0.2)
 ,s("bd").gain(0.8)
 ]).bank("RolandTR909").room(0.2).color("yellow").velocity(1)
 
).cpm(128/4)`