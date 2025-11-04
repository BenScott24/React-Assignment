// Importing all the neccasry functions
import { useEffect, useRef, useState } from "react"; // Import React hooks for state, side effects and refs
import { StrudelMirror } from '@strudel/codemirror'; // Import Strudel code editor
import { evalScope } from '@strudel/core'; // Import evalScope from Strudel core used for module loading
import { drawPianoroll } from '@strudel/draw'; // Import function to draw piano roll visualizations
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio'; // Import WebAudio helpers from Strudel
import { transpiler } from '@strudel/transpiler'; // Import Strudel core transpiler
import { registerSoundfonts } from "@strudel/soundfonts"; // Import function to register soundfonts for Strudel
import console_monkey_patch from '../console-monkey-patch'; // Import a custom console monkey patch
import { stranger_tune } from "../Assets/tunes"; // Import the stranger things tune from assets
import Controls from './Controls';// Import the controls component 
import CanvasRoll from './CanvasRoll'; // Import the canvas roll component
import PreprocessPanel from "./PreprocessPanel"; // Import the preprocess panel component

// Main component for Strudel Editor
export default function StrudelEditor() {
  const hasRun = useRef(false); // Ref to prevent useEffect from running multiple times
  const [editorInstance, setEditorInstance] = useState(null); // State to hold the Strudel editor instance
  const [gainNode, setGainNode] = useState(null); // State to hold the audio gain node for volume control
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is currently playing
  const [instrument, setInstrument] = useState("drums"); // State to track currently selected instrument
  const [speedLevel, setSpeedLevel] = useState(1); // State to track the speed multiplier for the song
  const [text, setText] = useState(stranger_tune); // State to hold the current code/text in the editor
  const [isMuted, setIsMuted] = useState(false); // State to track whether audio is muted
  const [showText, setShowText] = useState(true); // State to toggle visibility of the text area
  const [showEditor, setShowEditor] = useState(true); // State to toggle visibility of the code editor
  const [showCanvas, setShowCanvas] = useState(true); // State to toggle visibility of the canvas roll

  // Effect that runs only once to initialize the editor and audio
  useEffect(() => {

    // Prevent re-running if already intialized
    if (hasRun.current) return;
    hasRun.current = true; // Return true if re-running is already intialized

    console_monkey_patch(); // Apply console monkey patch for custom logging
    initAudioOnFirstClick(); // Initialize WebAudio on first user interaction

    // Grab canvas element for drawing piano roll
    const canvas = document.getElementById('roll'); 

    // Double canvas resolution for sharp rendering
    canvas.width = canvas.width * 2;
    canvas.height = canvas.height * 2;

    // Get 2D drawing context
    const drawContext = canvas.getContext('2d');

    // Create audio context and gain node for volume control
    const audioCtx = getAudioContext();
    const gain = audioCtx.createGain();
    gain.gain.value = 1; // Default volume is 1
    gain.connect(audioCtx.destination); // Connect to speakers
    setGainNode(gain); // Save gain node to state

    // Create Strudel editor instance
    const editor = new StrudelMirror({
      defaultOutput: webaudioOutput, // Default audio output
      getTime: () => audioCtx.currentTime, // Provide current audio time
      transpiler, // Provide code transpiler
      root: document.getElementById('editor'), // Attach editor to DOM
      drawTime: [-2, 2], // Window for piano roll drawing

      // Draw piano roll on canvas
      onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime: [-2, 2], fold: 0 }),
      prebake: async () => {

        // Load Strudel modules before running code
        const loadModules = evalScope(
          import('@strudel/core'),
          import('@strudel/draw'),
          import('@strudel/mini'),
          import('@strudel/tonal'),
          import('@strudel/webaudio'),
        );

        // Wait for all modules, synths, and soundfonts to load
        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
      },
    });

    // Connect WebAudio output to gain node if it exists
    if (webaudioOutput && webaudioOutput.node) {
      webaudioOutput.node.connect(gain); // Connecting to the node
    }

    // Set the initial editor code to the tune
    editor.setCode(text);
    setEditorInstance(editor); // Save editor instance to state

  }, [text]); // Dependency: run only once or when text changes

  // Function to apply current instrument, speed and mute settings
  const applySettings = () => {

    // Exit if editor is not ready
    if (!editorInstance) return; 

    // Start with current code text
    let code = text;

    // Replace code depending on instrument selection
    if (instrument === "default") {
      code = stranger_tune; // Use original tune
    } 
    
    // Replace the drum2 with supersaw 
    else if (instrument === "synth") {
      code = code.replace(/drums:[\s\S]*?drums2:/, "bassline:\nnote(pick(basslines, 0)).sound(\"supersaw\")"); 
    } else if (instrument === "bass") {
      code = code.replace(/bassline:[\s\S]*?main_arp:/, "bassline:\nnote(pick(basslines, 0)).sound(\"tech:15\")");
    }

    const baseCPS = 140 / 60 / 4;
    code = code.replace(/setcps\([^\)]*\)/, `setcps(${baseCPS * speedLevel})`);

    if (isMuted) code += "\nall(x => x.gain(0))";
    editorInstance.setCode(code);
  };

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev);
    applySettings();
  };

  const handleApplySettings = () => {
    applySettings();
    if (isPlaying) {
      editorInstance.stop();
      editorInstance.evaluate();
    }
  };

  const playPause = () => {
    if (!editorInstance || !gainNode) return;
    const audioCtx = getAudioContext();
    audioCtx.resume().then(() => {
      if (isPlaying) {
        editorInstance.stop();
        setIsPlaying(false);
      } else {
        applySettings();
        if (webaudioOutput && webaudioOutput.node)
          webaudioOutput.node.connect(gainNode);
        editorInstance.evaluate();
        setIsPlaying(true);
      }
    });
  };

  const restart = () => {
    if (!editorInstance || !gainNode) return;
    handleApplySettings();
    const audioCtx = getAudioContext();
    audioCtx.resume().then(() => {
      editorInstance.stop();
      editorInstance.evaluate();
      setIsPlaying(true);
    });
  };

  return (
    <main className="editor-container">
      <Controls playPause={playPause} restart={restart} gainNode={gainNode} instrument={instrument} setInstrument={setInstrument} speedLevel={speedLevel} setSpeedLevel={setSpeedLevel} isPlaying={isPlaying} isMuted={isMuted} onMuteToggle={handleMuteToggle} onApply={handleApplySettings} />
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <button className="btn btn-outline-secondary" onClick={() => setShowText(!showText)}>
          {showText ? "Hide Text Area ▲" : "Show Text Area ▼"} </button>
      </div>
      {showText && (
        <PreprocessPanel text={text} setText={setText} editorInstance={editorInstance} />
      )}
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <button className="btn btn-outline-secondary" onClick={() => {
          setShowEditor(!showEditor);
          if (!showEditor && editorInstance) { setTimeout(() => editorInstance.setCode(text), 100); }
        }}>
          {showText ? "Hide Text Area ▲" : "Show Text Area ▼"}
        </button>
      </div>
      <div id="editor" style={{ display: showEditor ? "block" : "none" }} />
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <button className="btn btn-outline-secondary" onClick={() => setShowCanvas(!showCanvas)}>
          {showCanvas ? "Hide Canvas Roll ▲" : "Show Canvas Roll▼"}
        </button>
      </div>
      {showCanvas && <CanvasRoll />}
    </main>
  );
}
