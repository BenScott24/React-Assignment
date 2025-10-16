import { forwardRef, use, useEffect, useImperativeHandle, useRef } from "react";
import { initStrudel, StrudelMirror, getAudioContext, webaudioOutput, transpiler, evalScope, registerSynthSounds, initAudioOnFirstClick, } from "@strudel/web";
import { registerSoundfonts } from "@strudel/soundfonts";

const Editor = forwardRef(({ code }, ref) => {
    const editorDiv = useRef(null);
    const strudelEditor = useRef(null);

    useImperativeHandle(ref, () => ({
        evaluate: () => strudelEditor.current?.evaluate(),
        stop: () => strudelEditor.current?.stop(),
        setCode: (newCode) => strudelEditor.current?.setCode(newCode),
        getCode: () => strudelEditor.current?.getCode(),
        
        setRuntimeOptions: (opts) => {
            if (strudelEditor.current?.repl?.state) {
                strudelEditor.current.repl.state.runtimeOptions = { ...(strudelEditor.current.repl.runtimeOptions || {}), ...opts };
            }
        },

        repl: strudelEditor.current?.repl,

    }));

    useEffect(() => {
        let alive = true;
        const setup = async () => {
            await initStrudel();
            if (!alive) return;

            const mirror = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: editorDiv.current,
                prebake: async () => {
                    initAudioOnFirstClick();
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio')
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            


}
