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

      
}