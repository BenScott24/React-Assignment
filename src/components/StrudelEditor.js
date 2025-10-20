import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from '../Assets/tunes';
import console_monkey_patch from '../console-monkey-patch';
import Controls from './Controls';
import CanvasRoll from './CanvasRoll';
import { SetupButtons, Proc } from "./setupButtons";

let globalEditor = null;

export default function StrudelEditor() {
    const hasRun = useRef(false);

    useEffect(() => {
    
        if (!hasRun.current) {
            console_monkey_patch();
            hasRun.current = true;

                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; 

                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); 
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
                
            globalEditor.setCode(stranger_tune);
            SetupButtons(globalEditor);
            Proc(globalEditor);
            }
}, []);

    return (
        <main className="editor-container">
            <div id="editor" />
            <CanvasRoll />
            <Controls />
        </main>
    );
}