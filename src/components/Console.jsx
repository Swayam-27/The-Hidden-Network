import React, { useState, useEffect, useRef } from "react";

const Console = ({
  onLogin,
  startTyping,
  playKeypress,
  playEnter,
  playTypingLoop,
  stopTypingLoop,
  agentName,
  updateAgentName,
}) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [consoleState, setConsoleState] = useState("TYPING_WELCOME");
  const [shouldScroll, setShouldScroll] = useState(false);
  const endOfConsoleRef = useRef(null);
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!startTyping) return;
    setShouldScroll(true);

    const welcomeShown = localStorage.getItem("welcomeMessageShown") === "true";
    const nameRegistered = localStorage.getItem("agentName") !== null;

    if (welcomeShown && nameRegistered) {
      setLines([""]);
      setConsoleState("AWAITING_COMMAND");
      return;
    }

    if (playTypingLoop) playTypingLoop();
    const timestamp = new Date();
    const sessionId = Math.random().toString(16).slice(2, 10).toUpperCase();
    const welcomeMessage = [
      `[SESSION ID: ${sessionId}]`,
      `[TIMESTAMP: ${timestamp.toISOString()}]`,
      "",
      "System online.",
    ];

    if (!nameRegistered) {
      welcomeMessage.push("PLEASE REGISTER YOUR AGENT CODENAME:");
    } else {
      welcomeMessage.push("Awaiting input. Type HELP for commands.");
    }

    let lineIndex = 0;
    let charIndex = 0;
    const timeouts = [];
    const type = () => {
      if (lineIndex >= welcomeMessage.length) {
        localStorage.setItem("welcomeMessageShown", "true");
        if (nameRegistered) {
          setConsoleState("AWAITING_COMMAND");
        } else {
          setConsoleState("AWAITING_NAME");
        }
        if (stopTypingLoop) stopTypingLoop();
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
    return () => {
      timeouts.forEach(clearTimeout);
      if (stopTypingLoop) stopTypingLoop();
    };
  }, [startTyping, playTypingLoop, stopTypingLoop]);

  useEffect(() => {
    if (shouldScroll) {
      endOfConsoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, shouldScroll]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (playEnter) playEnter();

    if (consoleState === "AWAITING_NAME") {
      const newName = input.trim() || "AGENT";
      updateAgentName(newName);
      setLines([
        ...lines,
        `> CODENAME [${newName.toUpperCase()}] REGISTERED.`,
        "> Awaiting input. Type HELP for commands.",
      ]);
      setInput("");
      setConsoleState("AWAITING_COMMAND");
      return;
    }

    const command = input.toLowerCase().trim();
    const args = command.split(" ");
    const baseCommand = args[0];
    const newLines = [...lines, `C:\\Users\\${agentName}>${input}`];

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
        newLines.push(`  > Designation: [${agentName}]. Status: Agent.`);
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

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && playKeypress) {
      playKeypress();
    }
  };

  const getPrompt = () => {
    if (consoleState === "AWAITING_NAME") {
      return <span>REGISTER CODENAME:&gt;</span>;
    }
    if (consoleState === "AWAITING_COMMAND") {
      return <span>C:\\Users\\{agentName}&gt;</span>;
    }
    return null;
  };

  const autoFocusInput =
    consoleState === "AWAITING_NAME" || consoleState === "AWAITING_COMMAND";

  return (
    <div className="console-wrapper">
      <div
        className="console-container cursor-target"
        onClick={handleContainerClick}
      >
        <div className="console-header">
          <p>C:\\WINDOWS\\system32\\cmd.exe</p>
        </div>
        <div className="console-output">
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          <div ref={endOfConsoleRef} />
        </div>
        {(consoleState === "AWAITING_NAME" ||
          consoleState === "AWAITING_COMMAND") && (
          <form onSubmit={handleCommand} className="console-input-line">
            {getPrompt()}
            <input
              id="console-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus={autoFocusInput}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Console;
