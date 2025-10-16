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
                <h2 classNmae="accordion-header" id="headingControls">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseControls" aria-expanded="false" aria-controls="collapseControls">Audio Controls</button>
                </h2>
                <div id="collapseControls" className="accordion-collapse collapse" aria-labelledby="headingControls" data-bs-parent="#controlsAccordion">
                    <div className="accordion-body">
                        <div className="mb-3">
                            <label htmlFor="volumeRange" className="form-label">Volume: {volume}</label>
                            <input type="range" className="form-range" id="volumeRange" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="bpmRange" className="form-label">BPM: {bpm}</label>
                            <input type="range" className="form-range" id="bpmRange" min="60" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))
    ) 
    
      
}