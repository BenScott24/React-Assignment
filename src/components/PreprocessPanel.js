import { useEffect, useState } from "react";

export default function PreprocessPanel({ defaultValue, editorInstance}) {
    const [text, setText] = useState(defaultValue || "");

    useEffect(() => {
        if (!editorInstance) return; 
            editorInstance.setCode(text);
        
    }, [text, editorInstance]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8" style={{ maxHeigh:"50vh", overflowY:"auto"}} >
                <label htmlFor="proc" className="form-label">Text to preprocess:</label>
                <textarea id="proc" className="form-control" rows="20" value={text} onChange={(e) => setText(e.target.value)}></textarea>
            </div>
        </div>
    </div>
    );
}