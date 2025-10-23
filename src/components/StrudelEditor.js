import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
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
    const [basslines, setBassLines] = useState(true);

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
                gain.gain.value = 1;
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

            const procText = () => {
                if (!editorInstance) return;
                let text = stranger_tune;
                const replace = basslines ? "" : "tech:10";
                text = text.replaceAll('<basslines>', replace)
                editorInstance.setCode(text);
                return text;
            };

            const procAndPlay = () => {
                procText();
                editorInstance?.evaluate();
            }

            const updateInstrument = (instrument) => {
                if (!editorInstance) return;
                const code = editorInstance.getCode();
                const newCode = code.replace(/s\("gm_[^"]*"\)/g, `s("gm_${instrument}")`);
                editorInstance.setCode(newCode);
            };

            const updateReverbLevel = (level) => {
                if (!editorInstance) return;
                const code = editorInstance.getCode();
                const newCode = code.replace(/\.room\([^)]*\)/g, `.room(${level})`);
                editorInstance.setCode(newCode);
            };

            const updateDelay = (enabled) => {
                if (!editorInstance) return;
                const code = editorInstance.getCode();
                const newCode = enabled ? code.replace(/\.delay\([^)]*\)/g, `.delay(0.3)`) : code.replace(/\.delay\([^)]*\)/g, "");
                editorInstance.setCode(newCode);
            };

            const updateDistortion = (enabled) => {
                if (!editorInstance) return;
                const code = editorInstance.getCode();
                const newCode = enabled ? code.replace(/\.dfb\([^)]*\)/g, `.dfb(0.6)`) : code.replace(/\.dfb\([^)]*\)/g, "");
                editorInstance.setCode(newCode);
            };

            const updateSongSpeed = (speed) => {
                if (!editorInstance) return;
                const code = editorInstance.getCode();
                const newCode = code.replace(/\.slow\([^)]*\)/g, `.slow(${1 / speed})`);
                editorInstance.setCode(newCode);
            };






    return (
        <main className="editor-container">
            <div id="editor" />
            <CanvasRoll />
            <Controls globalEditor={editorInstance} gainNode={gainNode} updateInstrument={updateInstrument} updateReverbLevel={updateReverbLevel} updateDelay={updateDelay} updateDistortion={updateDistortion} updateSongSpeed={updateSongSpeed} basslines={basslines} setBassLines={setBassLines} procText={procText} procAndPlay={procAndPlay}/>
        </main>
    );
}