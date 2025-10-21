import { useEffect, useState } from "react";

export default function Controls({ globalEditor, skipSong }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [songSpeed, setSongSpeed] = useState(1);

    const play = () => {
        if (!globalEditor) return;
        try {
            globalEditor.evaluate();
            setIsPlaying(true);
        } catch (error) {
            console.error("Could not play the song: ", error);
        }
    };

    const stop = () => {
        if (!globalEditor) return;
        try {
            globalEditor.stop();
            setIsPlaying(false);
        } catch (error) {
            console.error("Could not stop the song: ", error);
        }
    };

    const restart = () => {
        if (!globalEditor) return;
        try {
            globalEditor.stop();
            globalEditor.evaluate();
            setIsPlaying(true);
        } catch (error) {
            console.error("Could not restart the song: ", error);
        }
    };

    const saveSettings = () => {
        const settings = {
            volume, songSpeed
        };
        localStorage.setItem('strudelSettings', JSON.stringify(settings));
        alert("Settings saved!");
    };

    const loadSettings = () => {
        const saved = localStorage.getItem('strudelSettings');
        if (!saved) {
            alert("No saved settings found!");
            return;
        }
        const settings = JSON.parse(saved);
        setVolume(settings.volume);
        setSongSpeed(settings.songSpeed);

        if (globalEditor) {
            globalEditor.setCode(globalEditor.getCode());
        }
        alert("Settings loaded!");
    };

    useEffect(() => {
        const handleKey = (keyEvent) => {
            if (!globalEditor) return;

            if (keyEvent.code == "Space") {
                keyEvent.preventDefault();
                if (isPlaying) stop();
                else play ();
            }

            if (keyEvent.code == "ArrowLeft") {
                keyEvent.preventDefault();
                restart();
            }

            if (keyEvent.code == "ArrowRight") {
                keyEvent.preventDefault();
                skipSong();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [globalEditor, isPlaying, skipSong]);

    return (
        <nav>
            <button className="btn btn-outline-primary" onClick={play}>▶</button>
            <button className="btn btn-outline-primary" onClick={stop}>⏸</button>
            <button className="btn btn-outline-primary" onClick={restart}>↻</button>
            <button className="btn btn-outline-primary" onClick={skipSong}>⏭</button>

            <hr />
            <button className="btn btn-outline-success" onClick={saveSettings}></button>

            <p className="hotkey-text"><strong>Hotkeys:</strong></p>
            <p className="hotkey-text"><strong>Space = ▶/⏸</strong></p>
            <p className="hotkey-text"><strong>← = ↻</strong></p>
            <p className="hotkey-text"><strong>→ = ⏭</strong></p>

        </nav>
    );
}




   