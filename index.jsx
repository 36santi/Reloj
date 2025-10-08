const BEEP_URL = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function App() {
  const [breakLen, setBreakLen] = React.useState(5);
  const [sessionLen, setSessionLen] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [mode, setMode] = React.useState("Session");
  const intervalRef = React.useRef(null);
  const beepRef = React.useRef(null);

  React.useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const decBreak = () => {
    setBreakLen(prev => {
      const v = Math.max(1, prev - 1);
      return v;
    });
  };
  const incBreak = () => {
    setBreakLen(prev => {
      const v = Math.min(60, prev + 1);
      return v;
    });
  };
  const decSession = () => {
    setSessionLen(prev => {
      const v = Math.max(1, prev - 1);
      if (!running) setTimeLeft(v * 60);
      return v;
    });
  };
  const incSession = () => {
    setSessionLen(prev => {
      const v = Math.min(60, prev + 1);
      if (!running) setTimeLeft(v * 60);
      return v;
    });
  };

  React.useEffect(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          beepRef.current.currentTime = 0;
          beepRef.current.play();
          if (mode === "Session") {
            setMode("Break");
            return breakLen * 60;
          } else {
            setMode("Session");
            return sessionLen * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, breakLen, sessionLen, mode]);

  const handleStartStop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setBreakLen(5);
    setSessionLen(25);
    setMode("Session");
    setTimeLeft(25 * 60);
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  React.useEffect(() => {
    if (!running) {
      setTimeLeft(sessionLen * 60);
      setMode("Session");
    }
  }, [sessionLen]);

  return (
    <div className="page">
      <div className="clock">
        <h1>25 + 5 Clock</h1>

        <div className="lengths">
          <div className="length">
            <div id="break-label">Break Length</div>
            <div className="controls">
              <button id="break-decrement" onClick={decBreak}>-</button>
              <div id="break-length">{breakLen}</div>
              <button id="break-increment" onClick={incBreak}>+</button>
            </div>
          </div>

          <div className="length">
            <div id="session-label">Session Length</div>
            <div className="controls">
              <button id="session-decrement" onClick={decSession}>-</button>
              <div id="session-length">{sessionLen}</div>
              <button id="session-increment" onClick={incSession}>+</button>
            </div>
          </div>
        </div>

        <div className="timer">
          <div id="timer-label">{mode}</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>

        <div className="actions">
          <button id="start_stop" onClick={handleStartStop}>{running ? "Pause" : "Start"}</button>
          <button id="reset" onClick={handleReset}>Reset</button>
        </div>

        <audio id="beep" ref={beepRef} src={BEEP_URL} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
