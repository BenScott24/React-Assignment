import './App.css';
import { userState, useRef, useEffect, useCallback } from 'react';
import Editor from './Components/Editor';
import Controls from './Components/Controls';
import Options from './Components/Options';
import D3Waveform from './Components/D3Waveform';
import useProcessor from './Components/useProcessor';
import { stranger_tune } from './Tunes/stranger_tune';

export default function App() {
  const [code, setCode] = userState(stranger_tune);
  const [p1State, setP1State] = userState('ON');
  const [volume, setVolume] = userState(0.8);
  const [bpm, setBpm] = userState(120);
  const [reverb, setReverb] = userState(false);
  const [instrument, setInstrument] = userState('piano');
  const [alert, setAlert] = userState(null);
  const editorRef = useRef(null);
  const { processText, processAndPlay, play, stop, setEditorCode } = useProcessor(editorRef, p1State, setAlert);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (editorRef.current && editorRef.current.repl?.state?.started) {
          stop();
        } else {
          play();
        }
      }
      if (e.key === "p") {
        const newCode = processText(code);
        setCode(newCode);
        setEditorCode(newCode);
        setAlert({ type: 'info', text: 'Code processed successfully' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [code, play, stop, processText, setEditorCode]);

  useEffect(() => {
    if (editorRef.current) editorRef.current.setCode(code);
  }, [code]);

  const savePreset = useCallback(() => {
    const preset = { code, p1State, volume, bpm, reverb, instrument };
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strudel_preset.json';
    a.click();
    URL.revokeObjectURL(url);
    setAlert({ type: 'success', text: 'Preset saved successfully' });
  }, [code, p1State, volume, bpm, reverb, instrument]);

  

}