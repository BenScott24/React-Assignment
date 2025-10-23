import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../console-monkey-patch';
import { the_rhythm_of_the_night } from "../Assets/tunes";
import Controls from './Controls';
import CanvasRoll from './CanvasRoll';

export default function StrudelEditor() {
    const hasRun = useRef(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [gainNode, setGainNode] = useState(null);

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
            editor.setCode(the_rhythm_of_the_night);
            setEditorInstance(editor);
           
            }, []);

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
            



    return (
        <main className="editor-container">
            <div id="editor" />
            <CanvasRoll />
            <Controls globalEditor={editorInstance} gainNode={gainNode}/>
        </main>
    );
}