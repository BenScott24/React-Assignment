import { useEffect, useState } from "react";

export default function Controls({ globalEditor }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const play = () => {
        if (!globalEditor) return;
        try {
            globalEditor.evaluate();
            setIsPlaying(true);
        } catch (e) {
            console.error("Could not play the song:", e);
        }
    };


    return (
        <nav>
            <button id="process" className="btn btn-outline-primary">Preprocess</button>
            <button id="process_play" className="btn btn-outline-primary">Proc & Play</button>
            <br />
            <button id="play" className="btn btn-outline-primary">Play</button>
            <button id="stop" className="btn btn-outline-primary">Stop</button>
        </nav>
    );



}




   