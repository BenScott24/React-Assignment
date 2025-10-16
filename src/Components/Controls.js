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

    ) 
    
      
}