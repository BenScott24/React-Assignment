import save_icon from '../Assets/save_icon.svg';
import upload_icon from '../Assets/upload_icon.svg';
import volume_on from '../Assets/volume_on.svg';
import volume_off from '../Assets/volume_off.svg';
import { useEffect, useState } from "react";

export default function Controls({ globalEditor, gainNode, updateInstrument, updateReverbLevel, updateDelay, updateDistortion, updateSongSpeed }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [songSpeed, setSongSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [instrument, setInstrument] = useState('piano');
    const [effects, setEffects] = useState({reverb: false, delay: false, distortion: false});
    const [reverbLevel, setReverbLevel] = useState(0.3);
    const [showAdvanced, setShowAdvanced] = useState(false);

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

    useEffect(() => {
        if (updateInstrument) updateInstrument(instrument);
    }, [instrument]);

    useEffect(() => {
        if (updateReverbLevel) updateReverbLevel(reverbLevel);
    }, [reverbLevel]);

    useEffect(() => {
        if (updateDelay) updateDelay(effects.delay);
        if (updateDistortion) updateDistortion(effects.distortion);
    }, [effects]);

    useEffect(() => {
        if (updateSongSpeed) updateSongSpeed(songSpeed);
    }, [songSpeed]);

    const saveSettings = () => {
        const settings = {volume, songSpeed, isMuted, instrument, effects, reverbLevel};
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
        setInstrument(settings.instrument);
        setEffects(settings.effects);
        setReverbLevel(settings.reverbLevel);
        setIsMuted(settings.isMuted);
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
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [globalEditor, isPlaying]);

    
    return (
        <nav className="container-fluid">
            <div className="row">
                <div className="col">
                    <button className="btn btn-outline-primary" onClick={play}>▶</button>
                    <button className="btn btn-outline-primary" onClick={stop}>⏸</button>
                    <button className="btn btn-outline-primary" onClick={restart}>↻</button>
                    <button className="btn" onClick={saveSettings}><img src={save_icon} className="btn-icon" alt="Save"/></button>
                    <button className="btn" onClick={loadSettings}><img src={upload_icon} className="btn-icon" alt="Load"/></button>
                    <button className="btn" onClick={() => setIsMuted(!isMuted)}>
                        <img src={isMuted ? volume_off : volume_on} className="btn-icon" alt="Volume"/>
                    </button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => setShowAdvanced(!showAdvanced)} > {showAdvanced ? "Hide Advanced Controls ▲": "Show Advanced Controls ▼"}</button>
                </div>
            </div>
            {showAdvanced && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h5><strong>Instruments</strong></h5>
                            {["piano", "guitar", "drums"].map((instruments => (
                                <div className="form-check" key={instruments}>
                                    <input className="form-check-input" type="radio" name="instrument" value={instruments} checked ={instrument === instruments} onChange={(input) => setInstrument(input.target.value)} />
                                    <label className="form-check-label text-white">
                                        {instruments.charAt(0).toUpperCase() + instruments.slice(1)}
                                    </label>
                                </div>
                            )))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h5><strong>Effects</strong></h5>
                            {Object.keys(effects).map((soundEffects) => (
                                <div className="form-check" key={soundEffects}>
                                    <input className="form-check-input" type="checkbox" checked={effects[soundEffects]} onChange={(input) => setEffects({ ...effects, [soundEffects]: input.target.checked})} />
                                    <label className="form-check-label text-white"> 
                                        {soundEffects.charAt().toUpperCase() + soundEffects.slice(1)}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <h5>Volume</h5>
                            <input id ="volumeSlider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(input) => setVolume(parseFloat(input.target.value))} />
                            <h5>Reverb Level</h5>
                            <input id="reverbSlider" type="range" min="0" max="1" step="0.01" value={reverbLevel} onChange={(input) => setReverbLevel(parseFloat(input.target.value))} />
                            <h5>Song Speed</h5>
                            <input id="speeedSlider" type="range" min="0" max="1" step="0.01" value={songSpeed} onChange={(input) => setSongSpeed(parseFloat(input.target.value))} />
                        </div>
                    </div>
                </div>
            )}
        </nav> 
    );
}




   