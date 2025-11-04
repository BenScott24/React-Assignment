// Import icons for buttons (SVG images)
import save_icon from '../Assets/save_icon.svg'; // Icon for Save Settings button
import upload_icon from '../Assets/upload_icon.svg'; // Icon for Load Settings button
import volume_on from '../Assets/volume_on.svg'; // Icon for unmute button
import volume_off from '../Assets/volume_off.svg'; // Icon for mute button

// Import React hooks to manage state, refs, and side-effects
import { useEffect, useState, useRef } from "react"; 

// Define the main Controls component
export default function Controls({ 
    playPause, // Function to play or pause the music
    restart,  // Function to restart the music from beginning
    instrument, // Current instrument selected
    setInstrument, // Function to update the instrument state
    speedLevel, // Current song speed
    setSpeedLevel, // Function to update the speed level
    volume, // Current audio volume
    setVolume, // Function to update volume
    gainNode, // Web Audio GainNode to control audio volume
    isPlaying, // Boolean indicating if audio is playing
    onMuteToggle, // Callback function when mute is toggled
    onApply // Callback function when the Apply button is clicked
  }) {

    // State to toggle visibility of advanced controls panel
    const [showAdvanced, setShowAdvanced] = useState(false);

    // State to track if audio is muted
    const [isMuted, setIsMuted] = useState(false);
    
    // Ref for the hidden file input to load settings from JSON
    const fileInputRef = useRef();
  
  // Effect to update the gainNode whenever volume or mute state changes
  useEffect(() => {

    // If gainNode is not initialized yet, do nothing
    if (!gainNode) return;

    // Set gain to 0 if muted else use current volume
    gainNode.gain.value = isMuted ? 0 : volume;
  }, [isMuted,gainNode, volume]); // Only run effect when mute state, gainNode, or volume changes

    // Effect to attach global keyboard shortcuts
    useEffect(() => {

        // Function to handle keydown events
        const handleKey = (input) => {

            // Space bar toggles play/pause
            if (input.code == "Space") { 
              input.preventDefault(); // Prevent scrolling or other default behaviour
              playPause(); // Call playPause function
            }

            // Left arrow key triggers restart
            if (input.code == "ArrowLeft") { 
              input.preventDefault(); // Prevent default browser action
              restart();  // Call restart function
            }

            // m key toggles mute/unmute
            if (input.code === "m") {
              input.preventDefault(); // Prevent default browser action
              onMuteToggle(); // Call onMuteToggle function
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [playPause, restart]);

    const toggleMute = () => {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      if (onMuteToggle) onMuteToggle(newMuted);
    };

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
        <nav className="controls-wrapper">
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
                              {["drums","synth","bass", "default"].map((instruments) => (
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
                        <div style={{ marginTop: "10px"}}>
                          <button className="btn btn-outline-primary" onClick={() => onApply && onApply()}>Apply</button>
                        </div>
                    </div>
                </div>
                </div>
            )}
        </nav> 
    );
}




   