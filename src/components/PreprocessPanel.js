import { useState } from "react";

export default function PreprocessPanel({ onProcess, onProcessandPlay}) {
    const [text, setText] = useState("");

    const handleProcess = () => {
        if (onProcess) onProcess(text);
    };

    const handleProcessandPlay = () => {
        if (onProcessandPlay) onProcessandPlay(text);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8" style={{ maxHeigh:"50vh", overflowY:"auto"}} >
                <label htmlFor="proc" className="form-label">Text to preprocess:</label>
                <textarea className="form-control" rows="15" id="proc" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            </div>
            <div className="col-md-4">
                <nav>
                    <button className="btn btn-outline-primary" onClick={handleProcess}>Preprocess</button>
                    <button className="btn btn-outline-primary" onClick={handleProcessandPlay}>Proc and Play</button>
                </nav>
            </div>
        </div>
    </div>
    );
}