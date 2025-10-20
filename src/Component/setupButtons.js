export function SetupButtons(globalEditor) {
    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => Proc(globalEditor));
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc(globalEditor)
            globalEditor.evaluate()
        }
    });
    }

    export function Proc(globalEditor) {
        const procText = document.getElementById('proc').value;
        globalEditor.setCode(procText);
    }