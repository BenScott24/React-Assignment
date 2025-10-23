import save_icon from '../Assets/save_icon.svg';
import upload_icon from '../Assets/upload_icon.svg';
import { useEffect, useState } from "react";

export default function Controls({ globalEditor, instrument, setInstrument, speedLevel, setSpeedLevel, volume, setVolume, gainNode, isPlaying}) {

  useEffect(() => {
    if (!gainNode) return;
    gainNode.gain.value = volume;
  }, [volume,gainNode]);

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

    const saveSettings = () => {
      const settings = { instrument, speedLevel, volume};
      const blob = new Blob([JSON.stringify(settings)], {type:"application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a")
      a.href = url;
      a.download = "strudel-settings.json";
      a.click();
      alert("Settings Saved")
    };

    const loadSettings = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const data = JSON.parse(reader.result);
        setInstrument(data.instrument);
        setSpeedLevel(data.setSpeedLevel);
        setVolume(data.volume);
        alert("Settings Loaded")
      };
      reader.readAsText(file);
    }; 


    return (
        <nav className="container-fluid">
            <div className="row">
                <div className="col">
                    <button className="btn btn-outline-primary" onClick={play}>▶</button>
                    <button className="btn btn-outline-primary" onClick={stop}>⏸</button>
                    <button className="btn btn-outline-primary" onClick={restart}>↻</button>
                    <button className="btn" onClick={saveSettings}><img src={save_icon} className="btn-icon" alt="Save"/></button>
                    <button className="btn" onClick={loadSettings}><img src={upload_icon} className="btn-icon" alt="Load"/></button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => setShowAdvanced(!showAdvanced)} > {showAdvanced ? "Hide Advanced Controls ▲": "Show Advanced Controls ▼"}</button>
                </div>
            </div>
            {showAdvanced && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h5><strong>Instruments</strong></h5>
                            <div className="form-check">
                              {["drums","synth","bass"].map((instruments) => (
                                <div className="form-check" key={instruments}>
                                <label className="form-check-label text-white" key={instruments}>
                                  <input type="radio" name="instrument" value={instruments} checked={instrument === instruments} onChange={() => setInstrument(instruments)} />
                                  {instruments.charAt(0).toUpperCase() + instruments.slice(1)}
                                </label>
                              </div>
                              ))}                              
                        </div>
                        <div className="row">
                        <div className="col">
                            <h5>Volume</h5>
                            <input id ="volumeSlider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(input) => setVolume(parseFloat(input.target.value))} />
                            <h5>Song Speed</h5>
                            <input id="speedSlider" type="number" min="1" max="5" value={speedLevel} onChange={(input) => setSpeedLevel(Math.min(5, Math.max(1, parseInt(input.target.value))))} />
                        </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </nav> 
    );
}




   