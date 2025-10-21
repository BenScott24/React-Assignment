import { useEffect, useState } from "react";

export default function Controls({ globalEditor }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const play = () => {
        if (!globalEditor) return;
        try {
            globalEditor.evaluate();
            setIsPlaying(true);
        } catch (error) {
            console.error("Could not play the song: ", e);
        }
    };

    const stop = () => {
        if (!globalEditor) return;
        try {
            globalEditor.stop();
            setIsPlaying(false);
        } catch (error) {
            console.error("Could not stop the song: ", e);
        }
    };

    useEffect(() => {
        const handleKey = (ev) => {
            if (!globalEditor) return;

            if (keyEvent.code == "Space") {
                keyEvent.preventDefault();
                if (isPlaying) stop();
                else play ();
            }

            
        }
    })




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




   