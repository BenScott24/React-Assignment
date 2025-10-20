export const birds_of_a_feather = `setcps(105/60/4)

let m1 =
note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24")).s("gm_kalimba:3").legato(1.5).fast(2)
.attack(.025).release(.2).lp(1000)
.room(".6:2").postgain(1.5).color('#4dbcf4')._pitchwheel({edo:12,hapRadius:3,thickness:3,circle:1})
`