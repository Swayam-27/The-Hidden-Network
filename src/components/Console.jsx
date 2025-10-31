import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Console = ({ startTyping }) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [readyForInput, setReadyForInput] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const endOfConsoleRef = useRef(null);
  const inputRef = useRef(null);

  // Get the login function and navigation from our context/router
  const auth = useAuth();
  const navigate = useNavigate();

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!startTyping) return;
    setShouldScroll(true);
    
    // --- PATCH 1: Use localStorage ---
    const welcomeShown =
      localStorage.getItem("welcomeMessageShown") === "true";
      
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
        // --- PATCH 2: Use localStorage ---
        localStorage.setItem("welcomeMessageShown", "true");
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
        timeouts.push(setTimeout(type, 10)); 
      } else {
        lineIndex++;
        charIndex = 0;
        timeouts.push(setTimeout(type, 25)); 
      }
    };
    timeouts.push(setTimeout(type, 250));
    return () => timeouts.forEach(clearTimeout);
  }, [startTyping]);

  useEffect(() => {
    if (shouldScroll) {
      endOfConsoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, shouldScroll]);

  // --- PATCH 3: Simplified handleCommand ---
  // No need for onLogin prop, we get auth and navigate directly.
  const handleCommand = (e) => {
    e.preventDefault();
    const command = input.toLowerCase().trim();
    const args = command.split(" ");
    const baseCommand = args[0];
    const newLines = [...lines, `C:\\Users\\Agent>${input}`];

    const handleLogin = (path = '/cases') => {
      if (auth && auth.login) {
        auth.login(); // This sets isInsider = true
      }
      navigate(path); // This navigates to the new page
    };

    switch (baseCommand) {
      case "goto":
        if (args[1] === "cases" || args[1] === "about") {
          handleLogin(`/${args[1]}`); // Call our new function
        } else {
          newLines.push(`  '${input}' is not a valid GOTO command.`);
        }
        break;
      case "access":
        if (args[1]) {
          handleLogin(`/case/${args[1]}`); // Call our new function
        } else {
          newLines.push("  ACCESS command requires a case-id.");
        }
        break;
      case "help":
        newLines.push(
          "  [AVAILABLE COMMANDS]",
          "TYPE ANY OF THE COMMAND UNDER TO MOVE FORWARD ",
          "    HELP            - Displays this list of commands.",
          "    GOTO CASES      - Takes you to the cases section",
          "    GOTO ABOUT      - Takes you to the about section"
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
        newLines.push("  > The Librarian of this archive.");
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
      {/* --- PATCH 4: Added 'cursor-target' --- */}
      <div className="console-container cursor-target" onClick={handleContainerClick}>
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