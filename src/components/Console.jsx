import React, { useState, useEffect, useRef, useCallback } from "react";

const RESERVED_NAMES = ["CIPHER", "ADMIN", "ROOT", "HANDLER", "AGENT"];

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
  registerAgent,
}) => {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [inputStage, setInputStage] = useState("TYPING_WELCOME");
  const [shouldScroll, setShouldScroll] = useState(false);
  const [tempCodename, setTempCodename] = useState("");
  const [tauntVisible, setTauntVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDelayedButtons, setShowDelayedButtons] = useState(false); 
  
  const endOfConsoleRef = useRef(null);
  const inputRef = useRef(null);
  const activityTimerRef = useRef(null);

  const TAUNT_DELAY_MS = 25000; 
  
  const resetAndClearConsole = useCallback((message, goHome = true) => {
    setLines(prev => [...prev, message]);
    
    setTimeout(() => {
        setLines([]);
        setTempCodename('');
        if (goHome) {
            setRestartConsole(prev => prev + 1); 
        } else {
            setInputStage("AWAITING_COMMAND");
            setShowDelayedButtons(false);
        }
    }, 2000); 
  }, []);

  const handleAuthRequest = async (name, key, action) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/.netlify/functions/agent-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: name, cipherKey: key, action }),
      });
      
      const body = await response.json();
      setIsProcessing(false);

      if (response.status === 200) {
        return { success: true, message: body.message || "LOGIN SUCCESSFUL." };
      } else {
        return { success: false, message: body.message || "Authentication Failed." };
      }
    } catch (error) {
      setIsProcessing(false);
      return { success: false, message: "NETWORK ERROR. Cannot reach server." };
    }
  };

  const resetActivityTimer = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    setTauntVisible(false);

    if (inputStage === "AWAITING_COMMAND") {
      activityTimerRef.current = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          `[CIPHER]: Agent [${agentName || 'Recruit'}], it seems following and reading rules is too complex for you. Use the button given below.`,
        ]);
        setTauntVisible(true);
        setShowDelayedButtons(true);
      }, TAUNT_DELAY_MS);
    } else {
        setShowDelayedButtons(false);
    }
  }, [inputStage, agentName]);

  useEffect(() => {
    resetActivityTimer();
    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    };
  }, [inputStage, resetActivityTimer]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };
  

  const [restartConsole, setRestartConsole] = useState(0); 
  

  useEffect(() => {
    if (!startTyping && restartConsole === 0) return; 

    setInputStage("TYPING_WELCOME"); 
    setShouldScroll(true);

    const storedAgentName = localStorage.getItem("agentName");

    if (storedAgentName && restartConsole === 0) {
      setTempCodename(storedAgentName); 
      setLines([
        `> WELCOME BACK, AGENT [${storedAgentName}]. Please verify your identity.`,
        `> ENTER YOUR 4-CHARACTER CIPHER KEY:`,
      ]);
      setInputStage("LOGIN_KEY"); 
      return;
    }

    if (playTypingLoop) playTypingLoop();
    const welcomeMessage = [
      "> System online.",
      "> Are you a NEW AGENT or an EXISTING AGENT?",
    ];

    let lineIndex = 0;
    let charIndex = 0;
    const timeouts = [];
    const type = () => {
      if (lineIndex >= welcomeMessage.length) {
        if (stopTypingLoop) stopTypingLoop();
        setInputStage("CHOOSE_PATH");
        return;
      }
      if (charIndex === 0) setLines((prev) => [...prev, ""]);
      const currentLineText = welcomeMessage[lineIndex];
      if (charIndex < currentLineText.length) {
        setLines((prev) => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = currentLineText.substring(0, charIndex + 1);
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
  }, [startTyping, playTypingLoop, stopTypingLoop, restartConsole]); 

  useEffect(() => {
    if (shouldScroll) {
      endOfConsoleRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [lines, shouldScroll]);


  const executeCommand = (commandString, isButton = false) => {
    if (playEnter) playEnter();
    setTauntVisible(false);
    setShowDelayedButtons(false);

    const currentInput = commandString;
    const currentInputUpper = currentInput.trim().toUpperCase();
    const currentAgentName = agentName || tempCodename;

    if (inputStage === "AWAITING_COMMAND") {
        const command = currentInput.toLowerCase().trim();
        const args = command.split(" ");
        const baseCommand = args[0];
        const newLines = [...lines, `C:\\Users\\${currentAgentName}>${currentInput}`];

        switch (baseCommand) {
            case "goto":
                if (args[1] === "cases" || args[1] === "about") {
                    onLogin(`/${args[1]}`);
                } else {
                    newLines.push(`> '${currentInput}' is not a valid GOTO command.`);
                }
                break;
            case "help":
                newLines.push(
                    `> [AVAILABLE COMMANDS]`,
                    `>   GOTO CASES      - Takes you to the cases section`,
                    `>   GOTO ABOUT      - Takes you to the about section`,
                    `>   WHOAMI          - Displays your Agent details.`
                );
                break;
            case "whoami":
                newLines.push(`> Designation: [${currentAgentName}]. Status: Agent.`);
                break;
            case "cipher":
                newLines.push("> The Librarian of this archive.");
                break;
            case "clear":
                setLines([""]);
                setInput("");
                return;
            default:
                newLines.push(
                    `> COMMAND NOT RECOGNIZED. TYPE [HELP] FOR A LIST OF COMMANDS.`
                );
                break;
        }
        setLines(newLines);
        setInput("");
        resetActivityTimer();
        return;
    }
    
    switch(inputStage) {
        case "REGISTER_NAME":
            if (currentInputUpper.length < 3 || currentInputUpper.length > 12) {
                setLines(prev => [...prev, `CODENAME:>${currentInput}`, "> CODENAME MUST BE 3-12 CHARACTERS."]);
                setInput("");
                return;
            }
            if (RESERVED_NAMES.includes(currentInputUpper)) {
                setLines(prev => [...prev, `CODENAME:>${currentInput}`, "> ACCESS DENIED. CODENAME IS RESERVED."]);
                setInput("");
                return;
            }
            setTempCodename(currentInputUpper);
            setLines(prev => [...prev, `CODENAME:>${currentInput}`, "> ASSIGN A 4-CHARACTER CIPHER KEY:"]);
            setInputStage("REGISTER_KEY");
            setInput("");
            return;

        case "REGISTER_KEY":
            if (currentInput.length !== 4) {
                setLines(prev => [...prev, `ASSIGN KEY:>${'*'.repeat(currentInput.length)}`, "> CIPHER KEY MUST BE 4 CHARACTERS."]);
                setInput("");
                return;
            }
            handleAuthRequest(tempCodename, currentInput, 'register').then(result => {
                setLines(prev => [...prev, `ASSIGN KEY:>${'*'.repeat(currentInput.length)}`]);
                if(result.success) {
                    registerAgent(tempCodename, currentInput); 
                    
                    setTimeout(() => {
                      setLines([
                          `> AUTH SUCCESS: ${result.message}`,
                          `> WELCOME, AGENT [${tempCodename}]. You have Successfully registered`,
                          `> Type HELP for available commands`,
                          ``
                      ]);
                      setInputStage("AWAITING_COMMAND"); 
                      setShowDelayedButtons(false);
                      resetActivityTimer();
                    }, 500);

                } else {

                    resetAndClearConsole(`> AUTH ERROR: ${result.message}`);
                }
            });
            setInput("");
            return;
            
        case "LOGIN_NAME":
            setTempCodename(currentInputUpper);
            setLines(prev => [...prev, `CODENAME:>${currentInput}`, "> ENTER YOUR 4-CHARACTER CIPHER KEY:"]);
            setInputStage("LOGIN_KEY");
            setInput("");
            return;

        case "LOGIN_KEY":
            if (currentInput.length !== 4) {
                setLines(prev => [...prev, `CIPHER KEY:>${'*'.repeat(currentInput.length)}`, "> CIPHER KEY MUST BE 4 CHARACTERS."]);
                setInput("");
                return;
            }
            handleAuthRequest(tempCodename, currentInput, 'login').then(result => {
                setLines(prev => [...prev, `CIPHER KEY:>${'*'.repeat(currentInput.length)}`]);
                if(result.success) {
                    registerAgent(tempCodename, currentInput); 
                    setLines(prev => [...prev, `> AUTH SUCCESS: ${result.message}`, `> AGENT [${tempCodename}] VERIFIED. BREACHING NETWORK...`]);
                    onLogin('/cases'); 
                } else {
                    resetAndClearConsole(`> AUTH ERROR: ${result.message}`);
                }
            });
            setInput("");
            return;
    }
  };

  const handleManualCommand = (e) => {
    if (e) e.preventDefault(); 
    if (isProcessing) return;
    if (playEnter) playEnter();
    executeCommand(input, false);
  };

  const handleButtonClick = (command, choiceType = null) => {
    if (playClick) playClick();
    if (isProcessing) return;
    
    if (choiceType === 'path') {
        if(command === 'NEW') {
            setLines(prev => [...prev, "> SELECTED: [NEW AGENT]", "> PLEASE REGISTER YOUR AGENT CODENAME (3-12 chars):"]);
            setInputStage("REGISTER_NAME");
        } else {
            setLines(prev => [...prev, "> SELECTED: [EXISTING AGENT]", "> ENTER YOUR AGENT CODENAME:"]);
            setInputStage("LOGIN_NAME");
        }
    } else {
        executeCommand(command, true); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && playKeypress) {
      playKeypress();
    }
    resetActivityTimer();
  };

  const isInputActive = inputStage !== "TYPING_WELCOME" && inputStage !== "CHOOSE_PATH";
  const currentAgentName = agentName || tempCodename;
  const inputPrompt = (inputStage === "REGISTER_NAME" || inputStage === "LOGIN_NAME") ? "CODENAME:" : 
                      (inputStage === "REGISTER_KEY" || inputStage === "LOGIN_KEY") ? "CIPHER KEY:" : 
                      `C:\\Users\\${currentAgentName}>`;
  
  const inputType = (inputStage === "REGISTER_KEY" || inputStage === "LOGIN_KEY") ? "password" : "text";
  const maxLength = (inputStage === "REGISTER_KEY" || inputStage === "LOGIN_KEY") ? 4 : 12;

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
                inputStage === "AWAITING_COMMAND" && tauntVisible && index === lines.length - 1 ? "taunt-line" : ""
              }
            >
              {line}
            </p>
          ))}
          
          {isInputActive && (
            <form onSubmit={handleManualCommand} className="console-input-line">
              <span>{inputPrompt}</span>
              <input
                id="console-input"
                ref={inputRef}
                type={inputType}
                maxLength={maxLength}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoFocus={isInputActive}
                disabled={isProcessing}
              />
            </form>
          )}

          <div ref={endOfConsoleRef} />
        </div>
      </div>

      {inputStage === "CHOOSE_PATH" && (
        <div className="console-action-buttons login-choice">
          <button 
            className="action-button cursor-target new-agent" 
            onClick={() => handleButtonClick('NEW', 'path')}
            onMouseEnter={playHover}
            disabled={isProcessing}
          >
            [ NEW AGENT ]
          </button>
          <button 
            className="action-button cursor-target existing-agent" 
            onClick={() => handleButtonClick('EXISTING', 'path')}
            onMouseEnter={playHover}
            disabled={isProcessing}
          >
            [ EXISTING AGENT ]
          </button>
        </div>
      )}

      {inputStage === "AWAITING_COMMAND" && showDelayedButtons && (
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