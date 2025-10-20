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
n(`<[[0,2,4,6] ~!3] ~ ~ ~
[[-1,0,2,4] ~!3] ~ ~ ~ 
[[1,3,5,7] ~!3]  ~ ~ ~
[[-2,0,1,3] ~!3]  ~ [[-2,-1,1,3] ~!3] ~ 
>`).scale("D:major").s("gm_epiano1:6")  
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
n(`<[0,2,4,6]
[-1,0,2,4]
[1,3,5,7]
[-2,0,1,3]
>/2`).scale("D2:major").s("gm_church_organ:4")
.legato(1).delay(".45:.1:.3").room(".6:2")
.postgain(.6)._pianoroll({labels:1,fill:0,strikeActive:1})

`