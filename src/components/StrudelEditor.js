import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune, birds_of_a_feather, pump_up_the_jam, the_rhythm_of_the_night } from '../Assets/tunes';
import console_monkey_patch from '../console-monkey-patch';
import Controls from './Controls';
import CanvasRoll from './CanvasRoll';

export default function StrudelEditor() {
    const hasRun = useRef(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [currentTuneIndex, setCurrentTuneIndex] = useState(0);

    const tunes = [stranger_tune, birds_of_a_feather, pump_up_the_jam, the_rhythm_of_the_night];

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

                const editor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
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
                
            editor.setCode(stranger_tune);
            setEditorInstance(editor);
           
            }, []);

    return (
        <main className="editor-container">
            <div id="editor" />
            <CanvasRoll />
            <Controls globalEditor={editorInstance} />
        </main>
    );
}