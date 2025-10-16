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

  const loadPresetFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const preset = JSON.parse(e.target.result);
        setCode(loaded.code ?? '');
        setP1State(loaded.p1State ?? 'ON');
        setVolume(loaded.volume ?? 0.8);
        setBpm(loaded.bpm ?? 120);
        setReverb(loaded.reverb ?? false);
        setInstrument(loaded.instrument ?? 'piano');
        setAlert({ type: 'success', text: 'Preset loaded successfully' });
      } catch (err) {
        console.error(err);
        setAlert({ type: 'error', text: 'Failed to load preset: Invalid JSON' });
      }
    };
    reader.readAsText(file);
  };

  const handlePreprocess = () => {
    const newCode = processText(code);
    setCode(newCode);
    setEditorCode(newCode);
    setAlert({ type: 'info', text: 'Code processed successfully' });
  };

  const handleProcessAndPlay = () => {
    const processed = processText(code);
    setCode(processed);
    setEditorCode(processed);

    if (editorRef.current?.setRuntimeOptions) {
      editorRef.current.setRuntimeOptions({ volume, bpm, reverb, instrument });
    }
    processAndPlay(processed);
    setAlert({ type: 'success', text: 'Playing processed code' });
  };

  return (
    <div className="container-fluid-p-3">
      <h2>Strudel Music Editor</h2>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.text}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <label htmlFor="proc" className="form-label"><strong>Code Editor</strong></label>
          <textarea id="proc" className="form-control mb-2" rows="10" value={code} onChange={(e) => setCode(e.target.value)}/>
      </div>

        <div className="col-md-4">
          <Controls
            onPreprocess={handlePreprocess}
            onProcessAndPlay={handleProcessAndPlay}
            onPlay={() =>  play()}
            onStop={() => stop()}
            onSavePreset={savePreset}
            onLoadPreset={loadPresetFile}
            volume={volume}
            setVolume={setVolume}
            bpm={bpm}
            setBpm={setBpm}
            reverb={reverb}
            setReverb={setReverb}
            instrument={instrument}
            setInstrument={setInstrument}
          />
        </div>
      </div>
      


}