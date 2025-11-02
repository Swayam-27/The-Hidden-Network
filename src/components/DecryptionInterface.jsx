import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TextPuzzle = ({ puzzle, onSolve, shouldFocus, isDisabled }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { if (shouldFocus && !isDisabled && inputRef.current) inputRef.current.focus(); }, [shouldFocus, isDisabled]);
  const handleSubmit = (e) => { e.preventDefault(); if (!isDisabled) onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase()); if(!isDisabled) setInputValue(""); };
  const createVisualMarkup = () => ({__html: puzzle.visualText});

  return (
    <form onSubmit={handleSubmit} onClick={() => {if (!isDisabled) inputRef.current?.focus()}}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      {puzzle.visualText && (
        <div className="visual-puzzle-text" dangerouslySetInnerHTML={createVisualMarkup()} />
      )}
      <input
        ref={inputRef} type="text" id="decryption-code-input" value={inputValue}
        onChange={(e) => setInputValue(e.target.value.toUpperCase())} autoComplete="off"
        placeholder="ENTER DECRYPTION KEY..."
        disabled={isDisabled}
        style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}
      />
      <button type="submit" className="decrypt-button" disabled={isDisabled} style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}>DECRYPT</button>
    </form>
  );
};

const RedactionPuzzle = ({ puzzle, onSolve, shouldFocus, isDisabled }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { if (shouldFocus && !isDisabled && inputRef.current) inputRef.current.focus(); }, [shouldFocus, isDisabled]);
  const handleSubmit = (e) => { e.preventDefault(); if (!isDisabled) onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase()); if(!isDisabled) setInputValue(""); };
  const createMarkup = () => ({__html: puzzle.documentText.replace(/\[REDACTED\]/g, '<span class="redacted-block">██████████████</span>')});
  return (
    <form onSubmit={handleSubmit} onClick={() => {if (!isDisabled) inputRef.current?.focus()}}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      <div className="redacted-document"><p dangerouslySetInnerHTML={createMarkup()} /></div>
      <input
        ref={inputRef} type="text" id="decryption-code-input" value={inputValue}
        onChange={(e) => setInputValue(e.target.value.toUpperCase())} autoComplete="off"
        placeholder="DE-REDACT THE DOCUMENT..."
        disabled={isDisabled}
        style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}
      />
      <button type="submit" className="decrypt-button" disabled={isDisabled} style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}>DECRYPT</button>
    </form>
  );
};

const KeywordPuzzle = ({ puzzle, onSolve, isDisabled }) => {
  const docParts = puzzle.documentText.split(new RegExp(`(${puzzle.answer.replace(/[-\/^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));

  const handleClick = (isCorrectGuess) => {
    if (isDisabled) return;
    onSolve(isCorrectGuess);
  };
  return (
    <div className="keyword-puzzle-container" style={isDisabled ? { pointerEvents: 'none', filter: 'brightness(0.7)' } : {}}>
      <label>{puzzle.prompt}</label>
      <div className="keyword-document">
        <p>
          {docParts.map((part, index) =>
            part.toUpperCase() === puzzle.answer.toUpperCase() ? (
              <span key={index} className="keyword-answer cursor-target" onClick={() => handleClick(true)}>{part}</span>
            ) : (
              <span key={index} className="cursor-target" onClick={() => handleClick(false)}>{part}</span>
            )
          )}
        </p>
      </div>
    </div>
  );
};

const SocialGraphPuzzle = ({ puzzle, onSolve, isDisabled }) => {
    const handleClick = (nodeName) => {
        if (isDisabled) return;
        onSolve(nodeName === puzzle.answer);
    };
    return (
        <div className="social-graph-puzzle" style={isDisabled ? { pointerEvents: 'none', filter: 'brightness(0.7)' } : {}}>
            <label>{puzzle.prompt}</label>
            <svg viewBox="0 0 650 400" className="social-graph-svg">
                <defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                {puzzle.nodes.map(node => (
                    <g key={node.id} className="graph-node cursor-target" onClick={() => handleClick(node.name)}>
                        <circle cx={node.x} cy={node.y} r="12" />
                        <text x={node.x} y={node.y + 25}>{node.name}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const PersonalityProfilePuzzle = ({ puzzle, onSolve, isDisabled }) => {
    const handleClick = (option) => {
        if (isDisabled) return;
        onSolve(option === puzzle.answer);
    };
    return (
        <div className="personality-puzzle">
            <label>{puzzle.prompt}</label>
            {puzzle.profile && (
              <div className="target-profile">
                  <h3>TARGET PROFILE</h3>
                  {puzzle.profile.likes && <p><strong>LIKES:</strong> {puzzle.profile.likes.join(', ')}</p>}
              </div>
            )}
            <div className="ocean-options">
                {puzzle.options.map(option => (
                    <button key={option} type="button" className="ocean-option cursor-target"
                            onClick={() => handleClick(option)}
                            disabled={isDisabled}
                            style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}
                    >
                        {option.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SortableItem = ({ id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none'
    };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="timeline-card cursor-target">
            {id}
        </div>
    );
};

const TimelinePuzzle = ({ puzzle, onSolve, isDisabled }) => {
    const initialItems = Array.isArray(puzzle.events) ? [...puzzle.events].sort(() => Math.random() - 0.5) : [];
    const [items, setItems] = useState(initialItems);
    useEffect(() => {
        setItems(Array.isArray(puzzle.events) ? [...puzzle.events].sort(() => Math.random() - 0.5) : []);
    }, [puzzle.events]);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        if (isDisabled) return;
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setItems((currentItems) => {
                const oldIndex = currentItems.indexOf(active.id);
                const newIndex = currentItems.indexOf(over.id);
                if (oldIndex !== -1 && newIndex !== -1) {
                    return arrayMove(currentItems, oldIndex, newIndex);
                }
                return currentItems;
            });
        }
    };
    const handleVerify = () => {
        if (isDisabled) return;
        const isCorrectGuess = Array.isArray(puzzle.events) && JSON.stringify(items) === JSON.stringify(puzzle.events);
        onSolve(isCorrectGuess);
    };
    return (
        <div className="timeline-puzzle" style={isDisabled ? { pointerEvents: 'none', filter: 'brightness(0.7)' } : {}}>
            <label>{puzzle.prompt}</label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="timeline-cards-container">
                        {items.map(id => <SortableItem key={id} id={id} />)}
                    </div>
                </SortableContext>
            </DndContext>
            <button type="button" className="decrypt-button cursor-target" onClick={handleVerify} disabled={isDisabled} style={isDisabled ? { cursor: 'not-allowed', filter: 'brightness(0.7)' } : {}}>VERIFY SEQUENCE</button>
        </div>
    );
};

const DecryptionInterface = ({ puzzle, onSuccess, shouldFocus, onWrongAttempt }) => {
    const [feedback, setFeedback] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isLockedOut, setIsLockedOut] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const lockoutTimerRef = useRef(null);
    const feedbackTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (lockoutTimerRef.current) clearTimeout(lockoutTimerRef.current);
            if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        };
    }, []);

     useEffect(() => {
        setFeedback("");
        setIsUnlocking(false);
        setIsShaking(false);
        setIsLockedOut(false);
        setWrongAttempts(0);
        if (lockoutTimerRef.current) {
             clearTimeout(lockoutTimerRef.current);
             lockoutTimerRef.current = null;
        }
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
        }
    }, [puzzle]);

    const handleSolve = (isCorrectGuess) => {
        if (isUnlocking || isLockedOut) return;

        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
        }

        if (isCorrectGuess) {
            if (lockoutTimerRef.current) {
                clearTimeout(lockoutTimerRef.current);
                lockoutTimerRef.current = null;
            }
            setWrongAttempts(0);
            setFeedback("// DECRYPTION SUCCESSFUL... ACCESSING NEXT FRAGMENT. //");
            setIsUnlocking(true);
            setTimeout(() => { onSuccess(); }, 2500);
        } else {
            if (onWrongAttempt) {
                onWrongAttempt();
            }

            const newAttemptCount = wrongAttempts + 1;
            setWrongAttempts(newAttemptCount);
            setIsShaking(true);

            if (newAttemptCount >= 3) {
                setFeedback("// SYSTEM LOCKOUT (10 SECONDS) // Sloppy work, Agent. Analyze the intel carefully.");
                setIsLockedOut(true);

                if (lockoutTimerRef.current) { clearTimeout(lockoutTimerRef.current); }

                lockoutTimerRef.current = setTimeout(() => {
                    setFeedback("");
                    setIsShaking(false);
                    setIsLockedOut(false);
                    setWrongAttempts(0);
                    lockoutTimerRef.current = null;
                }, 10000);
            } else {
                setFeedback(`// ACCESS DENIED - INCORRECT KEY (${newAttemptCount}/3 attempts) //`);
                feedbackTimeoutRef.current = setTimeout(() => {
                    setFeedback("");
                    feedbackTimeoutRef.current = null;
                }, 1500);
                 setTimeout(() => {
                     setIsShaking(false);
                 }, 500);
            }
        }
    };

    if (!puzzle) return null;

    const renderPuzzle = () => {
        const puzzleType = puzzle.type || 'text';
        switch (puzzleType) {
            case 'redaction': return <RedactionPuzzle puzzle={puzzle} onSolve={handleSolve} shouldFocus={shouldFocus} isDisabled={isLockedOut} />;
            case 'keyword': return <KeywordPuzzle puzzle={puzzle} onSolve={handleSolve} isDisabled={isLockedOut} />;
            case 'social-graph': return <SocialGraphPuzzle puzzle={puzzle} onSolve={handleSolve} isDisabled={isLockedOut} />;
            case 'personality-profile': return <PersonalityProfilePuzzle puzzle={puzzle} onSolve={handleSolve} isDisabled={isLockedOut} />;
            case 'timeline-anomaly': return <TimelinePuzzle puzzle={puzzle} onSolve={handleSolve} isDisabled={isLockedOut} />;
            case 'text':
            default: return <TextPuzzle puzzle={puzzle} onSolve={handleSolve} shouldFocus={shouldFocus} isDisabled={isLockedOut} />;
        }
    };

    const hasError = isLockedOut || wrongAttempts > 0;

    return (
        <div id="decryption-terminal" className={`cursor-target ${isShaking ? "shake" : ""} ${isUnlocking ? "unlocking" : ""} ${isLockedOut ? "locked-out" : ""}`}>
            <div className="terminal-header">[ DECRYPTION CHALLENGE INITIATED ]</div>
            <div className="puzzle-content-area">
                {!isUnlocking ? renderPuzzle() : null}
            </div>
            <p id="decryption-feedback" className={`${isUnlocking ? "success" : ""} ${hasError ? "error" : ""}`}>
                 {feedback}
            </p>
        </div>
    );
};

export default React.memo(DecryptionInterface);