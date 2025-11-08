import React, { useState, useEffect, useRef, useCallback } from "react";

const RESERVED_NAMES = ["CIPHER", "ADMIN", "ROOT", "HANDLER"]; // New Reserved List

const Console = ({
  onLogin,
  startTyping,
  playKeypress,
  playEnter,
  playHover,
  playClick,
  playTypingLoop,
  stopTypingLoop,
  agentName,
  updateAgentName,
}) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [inputStage, setInputStage] = useState("TYPING_WELCOME");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [tauntVisible, setTauntVisible] = useState(false);

  const endOfConsoleRef = useRef(null);
  const inputRef = useRef(null);
  const activityTimerRef = useRef(null);

  const TAUNT_DELAY_MS = 30000;

  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    setTauntVisible(false);

    if (inputStage === "AWAITING_COMMAND") {
      activityTimerRef.current = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          `[CIPHER]: Agent [${agentName}], it seems following and reading rules is too complex for you. Use the button given below.`,
        ]);
        setTauntVisible(true);
      }, TAUNT_DELAY_MS);
    }
  }, [inputStage, agentName]);

  useEffect(() => {
    resetActivityTimer();
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, [inputStage, resetActivityTimer]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
    resetActivityTimer();
  };

  useEffect(() => {
    // ... (Existing useEffect for welcome message remains here) ...
    if (!startTyping) return;
    setShouldScroll(true);

    const welcomeShown = localStorage.getItem("welcomeMessageShown") === "true";
    const nameRegistered = localStorage.getItem("agentName") !== null;

    if (welcomeShown && nameRegistered) {
      setLines([`WELCOME BACK, AGENT [${agentName}]. Type HELP for commands.`]);
      setInputStage("AWAITING_COMMAND");
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
      welcomeMessage.push(
        "WELCOME. HOW SHOULD CIPHER REFER TO YOU? (Codename, Max 12 chars):"
      );
      setInputStage("AWAITING_NAME");
    } else {
      welcomeMessage.push(
        `Welcome back, AGENT [${agentName}]. Awaiting input.`
      );
      setInputStage("AWAITING_COMMAND");
    }

    let lineIndex = 0;
    let charIndex = 0;
    const timeouts = [];
    const type = () => {
      if (lineIndex >= welcomeMessage.length) {
        localStorage.setItem("welcomeMessageShown", "true");
        if (stopTypingLoop) stopTypingLoop();
        resetActivityTimer();
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
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [
    startTyping,
    playTypingLoop,
    stopTypingLoop,
    agentName,
    resetActivityTimer,
  ]);

  useEffect(() => {
    if (shouldScroll) {
      endOfConsoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, shouldScroll]);

  const executeCommand = (commandString, isButton = false) => {
    if (playEnter) playEnter();
    setTauntVisible(false);

    if (inputStage === "AWAITING_NAME") {
      const newName = (isButton ? commandString : input)
        .trim()
        .substring(0, 12)
        .toUpperCase();

      if (newName.length < 3) {
        setLines([
          ...lines,
          `C:\\Users\\Agent>${newName}`,
          "  > CODENAME TOO SHORT (MIN 3 CHARS). TRY AGAIN.",
        ]);
        setInput("");
        return;
      }

      // --- RESERVED NAME CHECK ---
      if (RESERVED_NAMES.includes(newName)) {
        setLines([
          ...lines,
          `C:\\Users\\Agent>${newName}`,
          "  > ACCESS DENIED. CODENAME RESERVED FOR CIPHER PROTOCOLS.",
        ]);
        setInput("");
        return;
      }

      updateAgentName(newName);

      setLines([
        ...lines,
        `C:\\Users\\Agent>${newName}`,
        `  > CODENAME [${newName}] SAVED.`,
        `WELCOME, AGENT [${newName}]. Type HELP for commands.`,
      ]);
      setInput("");
      setInputStage("AWAITING_COMMAND");
      resetActivityTimer();
      return;
    }

    const command = (isButton ? commandString : input).toLowerCase().trim();
    const args = command.split(" ");
    const baseCommand = args[0];
    const newLines = [...lines, `C:\\Users\\${agentName}>${commandString}`];

    switch (baseCommand) {
      case "goto":
        if (args[1] === "cases" || args[1] === "about") {
          onLogin(`/${args[1]}`);
        } else {
          newLines.push(`  '${commandString}' is not a valid GOTO command.`);
        }
        break;
      case "help":
        newLines.push(
          "  [AVAILABLE COMMANDS]",
          "  GOTO CASES      - Takes you to the cases section",
          "  GOTO ABOUT      - Takes you to the about section",
          "  WHOAMI          - Displays your Agent details."
        );
        break;
      case "whoami":
        newLines.push(`  > Designation: [${agentName}]. Status: Agent.`);
        break;
      case "cipher":
        newLines.push("  > The Librarian of this archive.");
        break;
      case "clear":
        setLines([""]);
        return;
      default:
        newLines.push(
          `  > COMMAND NOT RECOGNIZED. TYPE [HELP] FOR A LIST OF COMMANDS.`
        );
        break;
    }
    setLines(newLines);
    setInput("");
    resetActivityTimer();
  };

  const handleManualCommand = (e) => {
    e.preventDefault();
    executeCommand(input);
  };

  const handleButtonClick = (command) => {
    if (playClick) playClick();
    executeCommand(command, true);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && playKeypress) {
      playKeypress();
    }
    resetActivityTimer();
  };

  const isCommandReady =
    inputStage === "AWAITING_COMMAND" || inputStage === "AWAITING_NAME";
  const inputPrompt =
    inputStage === "AWAITING_NAME" ? "CODENAME:" : `C:\\Users\\${agentName}>`;

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
            <p
              key={index}
              className={
                tauntVisible && index === lines.length - 1 ? "taunt-line" : ""
              }
            >
              {line}
            </p>
          ))}
          <div ref={endOfConsoleRef} />
        </div>

        {isCommandReady && (
          <form onSubmit={handleManualCommand} className="console-input-line">
            <span>{inputPrompt}</span>
            <input
              id="console-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoFocus={isCommandReady}
            />
          </form>
        )}
      </div>

      {tauntVisible && inputStage === "AWAITING_COMMAND" && (
        <div className="console-action-buttons">
          <button
            className="action-button cursor-target"
            onClick={() => handleButtonClick("GOTO CASES")}
            onMouseEnter={playHover}
          >
            [ GOTO CASES ]
          </button>
          <button
            className="action-button cursor-target"
            onClick={() => handleButtonClick("GOTO ABOUT")}
            onMouseEnter={playHover}
          >
            [ GOTO ABOUT ]
          </button>
          <button
            className="action-button cursor-target"
            onClick={() => handleButtonClick("HELP")}
            onMouseEnter={playHover}
          >
            [ HELP ]
          </button>
        </div>
      )}
    </div>
  );
};

export default Console;
