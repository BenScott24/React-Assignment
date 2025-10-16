import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { initStrudel, StrudelMirror, getAudioContext, webaudioOutput, transpiler, evalScope, registerSynthSounds, initAudioOnFirstClick, } from "@strudel/web";
import { registerSoundfonts } from "@strudel/soundfonts";

