import { useState } from "react";

export default function PreprocessPanel({ onProcess, onProcessandPlay}) {
    const [text, setText] = useState("");

    const handleProcess = () => {
        if (onProcess) onProcess(text);
    };

    const handleProcessandPlay = () => {
        if (onProcessandPlay) onProcessandPlay(text);
    };

    
}