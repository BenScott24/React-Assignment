// PreprocessPanel component for editing the code/text before running in Strudel
import { useEffect } from "react";

export default function PreprocessPanel({ text, setText, editorInstance }) {

    // Update the Strudel editor whenever the text state changes 
    useEffect(() => {
        if (!editorInstance) return; // Exit if editor is not initialized
        editorInstance.setCode(text); // Set the current editor code
    }, [text, editorInstance]); // Depend on text and editor instance

    return (
        // Container panel for preprocessing text
        <div className="preprocess-panel">
            {/* Label for textarea */}
            <label htmlFor="proc" className="preprocess-label">Text to preprocess:</label>
            
            {/* Textarea for user to edit code */}
            <textarea id="proc" className="preprocess-textarea" rows="20" value={text} onChange={(e) => setText(e.target.value)}></textarea>
        </div>
    );
}