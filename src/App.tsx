import React from "react";
import "./App.css";

function App() {
  const [input, setInput] = React.useState<string>("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<number>(0);
  const [isSpeaking, setIsSpeaking] = React.useState<boolean>(false);
  const [thisUtter, setThisUtter] =
    React.useState<SpeechSynthesisUtterance | null>(null);
  const [highlightedWordIndex, setHighlightedWordIndex] =
    React.useState<number>(-1);

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
    if (!isSpeaking) {
      play();
    } else {
      pause();
    }
  };

  const play = () => {
    if (thisUtter) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      return;
    }

    setIsSpeaking(true);
    const utter = new SpeechSynthesisUtterance(input);
    utter.voice = voices[selectedVoice];
    utter.rate = 0.8;
    setThisUtter(utter);

    let idx = 0;
    setHighlightedWordIndex(idx);
    utter.addEventListener("boundary", () => {
      idx += 1;
      setHighlightedWordIndex(idx);
    });

    utter.addEventListener("end", () => {
      setTimeout(() => {
        setIsSpeaking(false);
        setThisUtter(null);
      }, 500);
    });

    window.speechSynthesis.speak(utter);
  };

  const pause = () => {
    if (thisUtter) {
      setIsSpeaking(false);
      window.speechSynthesis.pause();
    }
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
            {isSpeaking ? "Pause" : "Play"}
          </button>
        </div>
        <div className="output">
          {(isSpeaking || thisUtter) &&
            input.split(" ").map((word, idx) => (
              <React.Fragment key={idx}>
                <span
                  className={
                    "hl-word" +
                    idx +
                    (highlightedWordIndex === idx ? " highlightme" : "")
                  }
                >
                  {word}
                </span>
                &nbsp;
              </React.Fragment>
            ))}
        </div>
      </header>
    </div>
  );
}

export default App;
