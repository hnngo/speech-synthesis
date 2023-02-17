import React from "react";
import "./App.css";

function App() {
  const [input, setInput] = React.useState("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<number>(0);

  React.useEffect(() => {
    // Loading time for website to load the voices
    let id = setInterval(() => {
      if (window.speechSynthesis.getVoices().length !== 0) {
        clearInterval(id);
        setVoices(window.speechSynthesis.getVoices());
      }
    }, 100);
  }, []);

  const onClick = () => {
    const utter = new SpeechSynthesisUtterance(input);
    utter.voice = voices[selectedVoice];
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="App">
      <header className="App-header">
        <textarea
          className="textarea"
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <div>
          <select
            className="voiceOptions"
            onChange={(e) => setSelectedVoice(e.target.selectedIndex)}
          >
            {voices.map((v, idx) => (
              <option key={idx} value={idx}>
                {v.name}
              </option>
            ))}
          </select>
          <button className="button" onClick={onClick}>
            Speak
          </button>
        </div>
        <div className="output"></div>
      </header>
    </div>
  );
}

export default App;
