import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- PUZZLE SUB-COMPONENTS (For all puzzle types) ---

const TextPuzzle = ({ puzzle, onSolve, shouldFocus }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { if (shouldFocus && inputRef.current) inputRef.current.focus(); }, [shouldFocus]);
  const handleSubmit = (e) => { e.preventDefault(); onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase()); setInputValue(""); };
  return (
    <form onSubmit={handleSubmit} onClick={() => inputRef.current?.focus()}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      <input ref={inputRef} type="text" id="decryption-code-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoComplete="off" placeholder="ENTER DECRYPTION KEY..." />
      <button type="submit" className="decrypt-button">DECRYPT</button>
    </form>
  );
};

const RedactionPuzzle = ({ puzzle, onSolve, shouldFocus }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { if (shouldFocus && inputRef.current) inputRef.current.focus(); }, [shouldFocus]);
  const handleSubmit = (e) => { e.preventDefault(); onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase()); setInputValue(""); };
  const createMarkup = () => ({__html: puzzle.documentText.replace(/\[REDACTED\]/g, '<span class="redacted-block">██████████████</span>')});
  return (
    <form onSubmit={handleSubmit} onClick={() => inputRef.current?.focus()}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      <div className="redacted-document"><p dangerouslySetInnerHTML={createMarkup()} /></div>
      <input ref={inputRef} type="text" id="decryption-code-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoComplete="off" placeholder="DE-REDACT THE DOCUMENT..." />
      <button type="submit" className="decrypt-button">DECRYPT</button>
    </form>
  );
};

const KeywordPuzzle = ({ puzzle, onSolve }) => {
  const [feedback, setFeedback] = useState('');
  const docParts = puzzle.documentText.split(new RegExp(`(${puzzle.answer})`, 'i'));
  const handleClick = (isCorrect) => {
    if (isCorrect) { onSolve(true); } 
    else { setFeedback('// INCORRECT KEYWORD IDENTIFIED //'); setTimeout(() => setFeedback(''), 1500); }
  };
  return (
    <div className="keyword-puzzle-container">
      <label>{puzzle.prompt}</label>
      <div className="keyword-document">
        <p>
          {docParts.map((part, index) => 
            part.toUpperCase() === puzzle.answer.toUpperCase() ? (
              <span key={index} className="keyword-answer" onClick={() => handleClick(true)}>{part}</span>
            ) : (
              <span key={index} onClick={() => handleClick(false)}>{part}</span>
            )
          )}
        </p>
      </div>
      {feedback && <p className="decryption-feedback-inline">{feedback}</p>}
    </div>
  );
};

const SocialGraphPuzzle = ({ puzzle, onSolve }) => {
    const [feedback, setFeedback] = useState('');
    const handleClick = (nodeName) => {
        if (nodeName === puzzle.answer) { onSolve(true); } 
        else { setFeedback('// INCORRECT NODE IDENTIFIED //'); setTimeout(() => setFeedback(''), 1500); }
    };
    return (
        <div className="social-graph-puzzle">
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
            {feedback && <p className="decryption-feedback-inline">{feedback}</p>}
        </div>
    );
};

const PersonalityProfilePuzzle = ({ puzzle, onSolve }) => {
    const [feedback, setFeedback] = useState('');
    const handleClick = (option) => {
        if (option === puzzle.answer) { onSolve(true); } 
        else { setFeedback('// INCORRECT TRAIT IDENTIFIED //'); setTimeout(() => setFeedback(''), 1500); }
    };
    return (
        <div className="personality-puzzle">
            <label>{puzzle.prompt}</label>
            <div className="target-profile">
                <h3>TARGET PROFILE</h3>
                <p><strong>LIKES:</strong> {puzzle.profile.likes.join(', ')}</p>
            </div>
            <div className="ocean-options">
                {puzzle.options.map(option => (
                    <button key={option} type="button" className="ocean-option cursor-target" onClick={() => handleClick(option)}>
                        {option.toUpperCase()}
                    </button>
                ))}
            </div>
            {feedback && <p className="decryption-feedback-inline">{feedback}</p>}
        </div>
    );
};

const SortableItem = ({ id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="timeline-card cursor-target">{id}</div>;
};
const TimelinePuzzle = ({ puzzle, onSolve }) => {
    const [items, setItems] = useState(() => [...puzzle.events].sort(() => Math.random() - 0.5));
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };
    const handleVerify = () => {
        const isCorrect = JSON.stringify(items) === JSON.stringify(puzzle.events);
        onSolve(isCorrect);
    };
    return (
        <div className="timeline-puzzle">
            <label>{puzzle.prompt}</label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="timeline-cards-container">
                        {items.map(id => <SortableItem key={id} id={id} />)}
                    </div>
                </SortableContext>
            </DndContext>
            <button type="button" className="decrypt-button cursor-target" onClick={handleVerify}>VERIFY SEQUENCE</button>
        </div>
    );
};

// --- Main Decryption Interface (Controller) ---
const DecryptionInterface = ({ puzzle, onSuccess, shouldFocus }) => {
    const [feedback, setFeedback] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const handleSolve = (isCorrect) => {
        if (isCorrect) {
            setFeedback("// DECRYPTION SUCCESSFUL... ACCESSING NEXT FRAGMENT. //");
            setIsUnlocking(true);
            setTimeout(() => { onSuccess(); }, 2500);
        } else {
            setFeedback("// ACCESS DENIED - INCORRECT KEY //");
            setIsShaking(true);
            setTimeout(() => { setFeedback(""); setIsShaking(false); }, 1000);
        }
    };

    if (!puzzle) return null;

    const renderPuzzle = () => {
        const puzzleType = puzzle.type || 'text';
        switch (puzzleType) {
            case 'redaction': return <RedactionPuzzle puzzle={puzzle} onSolve={handleSolve} shouldFocus={shouldFocus} />;
            case 'keyword': return <KeywordPuzzle puzzle={puzzle} onSolve={handleSolve} />;
            case 'social-graph': return <SocialGraphPuzzle puzzle={puzzle} onSolve={handleSolve} />;
            case 'personality-profile': return <PersonalityProfilePuzzle puzzle={puzzle} onSolve={handleSolve} />;
            case 'timeline-anomaly': return <TimelinePuzzle puzzle={puzzle} onSolve={handleSolve} />;
            case 'text':
            default: return <TextPuzzle puzzle={puzzle} onSolve={handleSolve} shouldFocus={shouldFocus} />;
        }
    };

    return (
        <div id="decryption-terminal" className={`cursor-target ${isShaking ? "shake" : ""} ${isUnlocking ? "unlocking" : ""}`}>
            <div className="terminal-header">[ DECRYPTION CHALLENGE INITIATED ]</div>
            <div className="puzzle-content-area">
                {!isUnlocking ? renderPuzzle() : null}
            </div>
            <p id="decryption-feedback" className={isUnlocking ? "success" : ""}>
                {feedback}
            </p>
        </div>
    );
};

export default DecryptionInterface;

