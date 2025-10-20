import { stranger_tune } from "../tunes";

export function SetupButtons(globalEditor) {
    if (!globalEditor) return;

    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => Proc(globalEditor));
    document.getElementById('process_play').addEventListener('click', () => {
            Proc(globalEditor)
            globalEditor.evaluate()
        });
    }

    export function Proc(globalEditor) {
        if (!globalEditor) return;
        globalEditor.setCode(stranger_tune);
    }