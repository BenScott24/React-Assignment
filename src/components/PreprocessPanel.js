import { useEffect } from "react";

export default function PreprocessPanel({ text, setText, editorInstance}) {

    useEffect(() => {
        if (!editorInstance) return; 
            editorInstance.setCode(text);
    }, [text, editorInstance]);

    return (
        <div className="preprocess-panel">
            <label htmlFor="proc" className="preprocess-label">Text to preprocess:</label>
            <textarea id="proc" className="preprocess-textarea" rows="20" value={text} onChange={(e) => setText(e.target.value)}></textarea>
        </div>
    );
}