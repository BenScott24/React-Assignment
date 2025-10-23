import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope, gain } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../console-monkey-patch';
import {stranger_tune} from "../Assets/tunes";
import Controls from './Controls';
import CanvasRoll from './CanvasRoll';

export default function StrudelEditor() {
    const hasRun = useRef(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [gainNode, setGainNode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [instrument, setInstrument] = useState("drums");
    const [speedLevel, setSpeedLevel] = useState(1);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
    
        if (hasRun.current) return;
            hasRun.current = true;

            console_monkey_patch();
            initAudioOnFirstClick();


                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; 

                const audioCtx = getAudioContext();
                const gain = audioCtx.createGain();
                gain.gain.value = volume;
                gain.connect(audioCtx.destination);
                setGainNode(gain);

                const editor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => audioCtx.currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
            
            if (webaudioOutput && webaudioOutput.node) {
                webaudioOutput.node.connect(gain);
            }
            editor.setCode(stranger_tune);
            setEditorInstance(editor);
           
            }, []);

           const applySettings = () => {
            if (!editorInstance) return;
            let code = stranger_tune;

            if (instrument === "drums") {
              code = code.replace(/bassline:[\s\S]*?main_arp:/,"drums:\nstack(\n s(\"tech:5\")\n .postgain(6)\n .pcurve(2)\n .pdec(1)\n .struct(pick(drum_structure, 0)),\n");
            }
            if (instrument === "synth") {
              code = code.replace(/drums:[\s\S]*?drums2:/, "bassline:\nnote(pick(basslines, 0)).sound(\"supersaw\")");
            }
            if (instrument === "bass") {
              code = code.replace(/bassline:[\s\S]*?main_arp:/,"bassline:\nnote(pick(basslines, 0)).sound(\"tech:15\")");
            }

            const speedMap = {1: 1, 2: 1.5, 3: 2, 4: 3, 5: 4};
            code = code.replace(/setcps\([^\)]*\)/,`setcps(${140/60/4 * speedMap[speedLevel]})`);

            editorInstance.setCode(code);
           };

           const play = () => {
            if (!editorInstance || !gainNode) return;
            const audioCtx = getAudioContext();
            audioCtx.resume().then(() => {
              if (webaudioOutput && webaudioOutput.node) {
                webaudioOutput.node.connect(gainNode);
              }
              editorInstance.evaluate();
              setIsPlaying(true);
            });
           };

           

           
    return (
        <main className="editor-container">
            <div id="editor" />
            <CanvasRoll />
            <Controls globalEditor={editorInstance} gainNode={gainNode} updateInstrument={updateInstrument} updateReverbLevel={updateReverbLevel} updateDelay={updateDelay} updateDistortion={updateDistortion} updateSongSpeed={updateSongSpeed} basslines={basslines} setBassLines={setBassLines} procText={procText} procAndPlay={procAndPlay}/>
        </main>
    );
}