import save_icon from '../Assets/save_icon.svg';
import upload_icon from '../Assets/upload_icon.svg';
import volume_on from '../Assets/volume_on.svg';
import volume_off from '../Assets/volume_off.svg';
import { useEffect, useState, useRef } from "react";

export default function Controls({ playPause, restart, instrument, setInstrument, speedLevel, setSpeedLevel, volume, setVolume, gainNode, isPlaying}) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const fileInputRef = useRef();

  useEffect(() => {
    if (!gainNode) return;
    gainNode.gain.value = isMuted ? 0 : volume;
  }, [isMuted,gainNode, volume]);

  
   useEffect(() => {
        const handleKey = (input) => {
            if (input.code == "Space") { input.preventDefault(); playPause(); }
            if (input.code == "ArrowLeft") { input.preventDefault(); restart(); }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [playPause, restart]);

    const toggleMute = () => setIsMuted(!isMuted);

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
        try {
          const data = JSON.parse(reader.result);
          if (data.instrument) setInstrument(data.instrument);
          if (data.speedLevel) setSpeedLevel(data.speedLevel);
          if (data.volume) setVolume(data.volume);
          alert("Settings Loaded")
        } catch {
          alert("Failed to load settings: Invalid File");
        }
      };
      reader.readAsText(file);
    }; 

    const handleLoadClick = () => fileInputRef.current.click();

    return (
        <nav className="container-fluid">
            <div className="row">
                <div className="col">
                    <button className="btn btn-outline-primary" onClick={playPause}>{isPlaying ? "⏸" : "▶"}</button>
                    <button className="btn btn-outline-primary" onClick={restart}>↻</button>
                    <button className="btn" onClick={saveSettings}><img src={save_icon} className="btn-icon" alt="Save"/></button>
                    <button className="btn" onClick={handleLoadClick}><img src={upload_icon} className="btn-icon" alt="Load"/></button>
                    <input type="file" accept=".json" style={{ display: "none"}} ref={fileInputRef} onChange={loadSettings} />
                    <button className="btn" onClick={toggleMute}>
                      <img src={isMuted ? volume_off : volume_on} className="btn-icon" alt="Volume" /> 
                    </button>
                    <button className="btn btn-outline-primary" type="button" onClick={() => setShowAdvanced(!showAdvanced)} > {showAdvanced ? "Hide Advanced Controls ▲": "Show Advanced Controls ▼"}</button>
                </div>
            </div>
            {showAdvanced && (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h5><strong>Instruments</strong></h5>
                              {["drums","synth","bass"].map((instruments) => (
                                <label className="form-check" key={instruments}>
                                  <input type="radio" name="instrument" value={instruments} checked={instrument === instruments} onChange={() => setInstrument(instruments)} />
                                  {instruments.charAt(0).toUpperCase() + instruments.slice(1)}
                                </label>
                          
                              ))}                              
                        </div>
                        <div className="row">
                        <div className="col">
                            <h5>Song Speed</h5>
                            <input type="range" min="0.25" max="5" step="0.05" value={speedLevel} onChange={(input) => setSpeedLevel(parseFloat(input.target.value))} />
                        </div>
                    </div>
                </div>
                </div>
            )}
        </nav> 
    );
}




   