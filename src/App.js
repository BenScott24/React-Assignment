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

  