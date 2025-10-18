import { useRef } from "react";

export default function Controls({
    onPreprocess,
    onProcessAndPlay,
    onPlay,
    onStop,
    onSavePreset,
    onLoadPreset,
    volume,
    setVolume,
    bpm,
    setBpm,
    reverb,
    setReverb,
    instrument,
    setInstrument,
}) {
    const fileInputRef = useRef(null);
    
    return (
        <div className="accordion" id="controlsAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingButtons">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseButtons" aria-expanded="true" aria-controls="collapseButtons">Playback & Processing</button>
                </h2>
                <div id="collapseButtons" className="accordion-collapse collapse show" aria-labelledby="headingButtons" data-bs-parent="#controlsAccordion">
                    <div className="accordion-body">
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" onClick={onPreprocess}>Preprocess</button>
                            <button className="btn btn-success" onClick={onProcessAndPlay}>Process & Play</button>
                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary flex-fill" onClick={onPlay}>Play</button>
                                <button className="btn btn-outline-danger flex-fill" onClick={onStop}>Stop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="accordion-item mt-2">
                <h2 className="accordion-header" id="headingControls">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseControls" aria-expanded="false" aria-controls="collapseControls">Audio Controls</button>
                </h2>
                <div id="collapseControls" className="accordion-collapse collapse" aria-labelledby="headingControls" data-bs-parent="#controlsAccordion">
                    <div className="accordion-body">
                        <label className="form-label">Volume: {Math.round(volume * 100)}%</label>
                        <input type="range" className="form-range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
                        <label className="form-label mt-3">BPM: {bpm}</label>
                        <input type="number" min="20" max="300" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="form-control mb-2" />
                        <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" id="reverbCheck" checked={reverb} onChange={(e) => setReverb(e.target.checked)} />
                            <label className="form-check-label" htmlFor="reverbCheck">Enable Reverb</label>
                        </div>
                        <label className="form-label">Instrument:</label>
                        <select className="form-select" value={instrument} onChange={(e) => setInstrument(e.target.value)}>
                            <option value="piano">Piano</option>
                            <option value="sine">Sine Wave</option>
                            <option value="synth">Synth</option>
                            <option value="organ">Organ</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="accordion-item mt-2">
                <h2 className="accordion-header" id="headingJSON">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseJSON" aria-expanded="false" aria-controls="collapseJSON">Preset Management</button>
                </h2>
                <div id="collapseJSON" className="accordion-collapse collapse" aria-labelledby="headingJSON" data-bs-parent="#controlsAccordion">
                    <div className="accordion-body">
                        <div className="d-grid gap-2">
                            <button className="btn btn-warning" onClick={onSavePreset}>Save Preset</button>
                            <div>
                                <input type="file" accept="application/json" ref={fileInputRef} onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) onLoadPreset(file);
                                    fileInputRef.current.value = null;
                                }}
                            />
                        </div>
                    </div>
                    <small className="text-muted">Load a preset JSON file to restore settings.</small>
                </div>
            </div>
        </div>
    </div>
    );      
}