import React, { useState, useEffect, useRef } from 'react';

const welcomeMessage = [
    '[CONNECTION ESTABLISHED]',
    // ... (rest of welcomeMessage array) ...
    `[SESSION ID: ${Math.random().toString(16).slice(2, 10).toUpperCase()}]`,
    '',
    'Welcome, agent.',
    'The Hidden Network is now accessible.',
    '',
    'Type [HELP] for a list of available commands.',
];

const Console = ({ onLogin, startTyping }) => { 
    const [lines, setLines] = useState([]);
    const [input, setInput] = useState('');
    const [readyForInput, setReadyForInput] = useState(false); 
    const [shouldScroll, setShouldScroll] = useState(false); // NEW STATE to control scrolling
    const endOfConsoleRef = useRef(null);

    // Effect for the auto-typing welcome message
    useEffect(() => {
        if (!startTyping) { 
            return;
        }
        
        // CRITICAL FIX: Start allowing scroll once typing is initiated
        setShouldScroll(true); 

        const welcomeShown = sessionStorage.getItem('welcomeMessageShown') === 'true';
        if (welcomeShown) {
            setLines(['']);
            setReadyForInput(true); 
            return;
        }

        let lineIndex = 0;
        let charIndex = 0;
        const timeouts = [];

        const type = () => {
            if (lineIndex >= welcomeMessage.length) {
                sessionStorage.setItem('welcomeMessageShown', 'true');
                setReadyForInput(true); 
                return;
            }
            if (charIndex === 0) setLines(prev => [...prev, '']);

            const currentLineText = welcomeMessage[lineIndex];
            if (charIndex < currentLineText.length) {
                setLines(prev => {
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

    // CRITICAL FIX: Only scroll if shouldScroll is true
    useEffect(() => {
        if (shouldScroll) {
            endOfConsoleRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [lines, shouldScroll]); // Added shouldScroll dependency

    const handleCommand = (e) => {
        e.preventDefault();
        const command = input.toLowerCase().trim();
        const args = command.split(' ');
        const baseCommand = args[0];
        const newLines = [...lines, `C:\\Users\\Agent>${input}`];

        switch (baseCommand) {
            case 'goto':
                if (args[1] === 'cases' || args[1] === 'about') {
                    onLogin(`/${args[1]}`);
                } else {
                    newLines.push(`  '${input}' is not a valid GOTO command.`);
                }
                break;
            case 'access':
                if (args[1]) {
                    onLogin(`/case/${args[1]}`);
                } else {
                    newLines.push('  ACCESS command requires a case-id.');
                }
                break;
            case 'help':
                newLines.push(
                    '  [AVAILABLE COMMANDS]',
                    '    HELP             - Displays this list of commands.',
                    '    GOTO [page]      - Navigates to a page (e.g., \'GOTO CASES\').',
                    '    ACCESS [case-id] - Accesses a specific case file (e.g., \'ACCESS project-raven\').',
                    '    CLEAR            - Clears the terminal screen.'
                );
                break;
            case 'clear':
                setLines(['']);
                setInput('');
                return;
            case 'whoami':
                newLines.push('  > Designation: Unknown. Status: Agent.');
                break;
            case 'cipher':
                newLines.push('  > That key belongs elsewhere.');
                break;
            case 'matrix':
                newLines.push('  > System integrity check... [OK].');
                break;
            default:
                newLines.push(`  > COMMAND NOT RECOGNIZED. TYPE [HELP] FOR A LIST OF COMMANDS.`);
                break;
        }
        setLines(newLines);
        setInput('');
    };

    return (
        <div className="console-wrapper">
            <div className="console-container">
                <div className="console-header">
                    <p>C:\\WINDOWS\\system32\\cmd.exe</p>
                </div>
                <div className="console-output" onClick={() => document.getElementById('console-input')?.focus()}>
                    {lines.map((line, index) => <p key={index}>{line}</p>)}
                    <div ref={endOfConsoleRef} />
                </div>
                <form onSubmit={handleCommand} className="console-input-line">
                    <span>C:\\Users\\Agent&gt;</span>
                    <input
                        id="console-input"
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