import save_icon from '../Assets/save_icon.svg';
import upload_icon from '../Assets/upload_icon.svg';
import volume_on from '../Assets/volume_on.svg';
import volume_off from '../Assets/volume_off.svg';
import volume_down from '../Assets/volume_down.svg';
import { useEffect, useState } from "react";
import { gain } from '@strudel/core';

export default function Controls({ globalEditor, skipSong, gainNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [songSpeed, setSongSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

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

    useEffect(() => {
        if (!gainNode) return;
        gainNode.gain.value = isMuted ? 0 : volume;
    }, [volume, isMuted, gainNode]);

    const saveSettings = () => {
        const settings = {volume, songSpeed, isMuted};
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
        if (settings.isMuted == true) setIsMuted(true);
        else setIsMuted(false);
        alert("Settings loaded!");
    };

    useEffect(() => {
        const handleKey = (input) => {
            if (!globalEditor) return;

            if (input.code == "Space") {
                input.preventDefault();
                if (isPlaying) stop();
                else play ();
            }

            if (input.code == "ArrowLeft") {
                input.preventDefault();
                restart();
            }

            if (input.code == "ArrowRight") {
                input.preventDefault();
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
            <button className="btn" onClick={saveSettings}><img src={save_icon} className="btn-icon" alt="Save"/></button>
            <button className="btn" onClick={loadSettings}><img src={upload_icon} className="btn-icon" alt="Load"/></button>
            <button className="btn" onClick={() => setIsMuted(!isMuted)}>
                <img src={isMuted ? volume_off : volume_on} className="btn-icon" alt="Volume"/>
            </button>
            <label htmlFor="volumeSlider"></label>
            <input id="volumeSlider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(input) => setVolume(parseFloat(input.target.value))}/>
        </nav>
    );
}




   