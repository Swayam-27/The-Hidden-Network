import React, { useState, useEffect, useRef } from "react";

const Console = ({ onLogin, startTyping, fragmentAlert, onAlertHandled }) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [readyForInput, setReadyForInput] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const endOfConsoleRef = useRef(null);
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!startTyping) return;
    setShouldScroll(true);
    const welcomeShown =
      sessionStorage.getItem("welcomeMessageShown") === "true";
    if (welcomeShown) {
      setLines([""]);
      setReadyForInput(true);
      return;
    }
    const timestamp = new Date();
    const sessionId = Math.random().toString(16).slice(2, 10).toUpperCase();
    const welcomeMessage = [
      `[SESSION ID: ${sessionId}]`,
      `[TIMESTAMP: ${timestamp.toISOString()}]`,
      "",
      "System online. Awaiting input.",
      "Type [HELP] for a list of available commands.",
    ];
    let lineIndex = 0;
    let charIndex = 0;
    const timeouts = [];
    const type = () => {
      if (lineIndex >= welcomeMessage.length) {
        sessionStorage.setItem("welcomeMessageShown", "true");
        setReadyForInput(true);
        return;
      }
      if (charIndex === 0) setLines((prev) => [...prev, ""]);
      const currentLineText = welcomeMessage[lineIndex];
      if (charIndex < currentLineText.length) {
        setLines((prev) => {
          const newLines = [...prev];
          newLines[lineIndex] = currentLineText.substring(0, charIndex + 1);
          return newLines;
        });
        charIndex++;
        timeouts.push(setTimeout(type, 20));
      } else {
        lineIndex++;
        charIndex = 0;
        timeouts.push(setTimeout(type, 50));
      }
    };
    timeouts.push(setTimeout(type, 500));
    return () => timeouts.forEach(clearTimeout);
  }, [startTyping]);

  useEffect(() => {
    if (shouldScroll) {
      endOfConsoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, shouldScroll]);

  const handleCommand = (e) => {
    e.preventDefault();
    const command = input.toLowerCase().trim();
    const args = command.split(" ");
    const baseCommand = args[0];
    const newLines = [...lines, `C:\\Users\\Agent>${input}`];
    switch (baseCommand) {
      case "goto":
        if (args[1] === "cases" || args[1] === "about") {
          onLogin(`/${args[1]}`);
        } else {
          newLines.push(`  '${input}' is not a valid GOTO command.`);
        }
        break;
      case "access":
        if (args[1]) {
          onLogin(`/case/${args[1]}`);
        } else {
          newLines.push("  ACCESS command requires a case-id.");
        }
        break;
      case "help":
        newLines.push(
          "  [AVAILABLE COMMANDS]",
          "    HELP             - Displays this list of commands.",
          "    GOTO CASES       - Takes you to the cases section",
          "    GOTO ABOUT       - Takes you to the about section"
        );
        break;
      case "clear":
        setLines([""]);
        setInput("");
        return;
      case "whoami":
        newLines.push("  > Designation: Unknown. Status: Agent.");
        break;
      case "cipher":
        newLines.push("  > That key belongs elsewhere.");
        break;
      default:
        newLines.push(
          `  > COMMAND NOT RECOGNIZED. TYPE [HELP] FOR A LIST OF COMMANDS.`
        );
        break;
    }
    setLines(newLines);
    setInput("");
  };

  return (
    <div className="console-wrapper">
      <div className="console-container" onClick={handleContainerClick}>
        <div className="console-header">
          <p>C:\\WINDOWS\\system32\\cmd.exe</p>
        </div>
        <div className="console-output">
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <div ref={endOfConsoleRef} />
        </div>
        <form onSubmit={handleCommand} className="console-input-line">
          <span>C:\\Users\\Agent&gt;</span>
          <input
            id="console-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
            autoFocus={readyForInput}
          />
        </form>
      </div>
    </div>
  );
};

export default Console;