import React, { useState, useEffect, useRef } from "react";

// --- Reusable Puzzle Sub-Components ---

const TextPuzzle = ({ puzzle, onSolve, shouldFocus }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase());
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      <input
        ref={inputRef}
        type="text"
        id="decryption-code-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
        placeholder="ENTER DECRYPTION KEY..."
      />
      <button type="submit" className="decrypt-button">
        DECRYPT
      </button>
    </form>
  );
};

const RedactionPuzzle = ({ puzzle, onSolve, shouldFocus }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSolve(inputValue.trim().toUpperCase() === puzzle.answer.toUpperCase());
    setInputValue("");
  };

  const createMarkup = () => {
    return {
      __html: puzzle.documentText.replace(
        /\[REDACTED\]/g,
        '<span class="redacted-block">██████████████</span>'
      ),
    };
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="decryption-code-input">{puzzle.prompt}</label>
      <div className="redacted-document">
        <p dangerouslySetInnerHTML={createMarkup()} />
      </div>
      <input
        ref={inputRef}
        type="text"
        id="decryption-code-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
        placeholder="DE-REDACT THE DOCUMENT..."
      />
      <button type="submit" className="decrypt-button">
        DECRYPT
      </button>
    </form>
  );
};

const KeywordPuzzle = ({ puzzle, onSolve }) => {
  const [feedback, setFeedback] = useState("");
  // Use a case-insensitive regex to split the string while preserving the matched keyword
  const docParts = puzzle.documentText.split(
    new RegExp(`(${puzzle.answer})`, "i")
  );

  const handleClick = (isCorrect) => {
    if (isCorrect) {
      onSolve(true);
    } else {
      setFeedback("// INCORRECT KEYWORD IDENTIFIED //");
      setTimeout(() => setFeedback(""), 1500);
    }
  };

  return (
    <div className="keyword-puzzle-container">
      <label>{puzzle.prompt}</label>
      <div className="keyword-document">
        <p>
          {docParts.map((part, index) =>
            part.toUpperCase() === puzzle.answer.toUpperCase() ? (
              <span
                key={index}
                className="keyword-answer"
                onClick={() => handleClick(true)}
              >
                {part}
              </span>
            ) : (
              <span key={index} onClick={() => handleClick(false)}>
                {part}
              </span>
            )
          )}
        </p>
      </div>
      {feedback && <p className="decryption-feedback-inline">{feedback}</p>}
    </div>
  );
};

// --- Main Decryption Interface Component ---

const DecryptionInterface = ({ puzzle, onSuccess, shouldFocus }) => {
  const [feedback, setFeedback] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSolve = (isCorrect) => {
    if (isCorrect) {
      setFeedback("// DECRYPTION SUCCESSFUL... ACCESSING NEXT FRAGMENT. //");
      setIsUnlocking(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } else {
      setFeedback("// ACCESS DENIED - INCORRECT KEY //");
      setIsShaking(true);
      setTimeout(() => {
        setFeedback("");
        setIsShaking(false);
      }, 1000);
    }
  };

  if (!puzzle) return null;

  const renderPuzzle = () => {
    // Default to 'text' if type is not specified
    const puzzleType = puzzle.type || "text";

    switch (puzzleType) {
      case "redaction":
        return (
          <RedactionPuzzle
            puzzle={puzzle}
            onSolve={handleSolve}
            shouldFocus={shouldFocus}
          />
        );
      case "keyword":
        return <KeywordPuzzle puzzle={puzzle} onSolve={handleSolve} />;
      case "text":
      default:
        return (
          <TextPuzzle
            puzzle={puzzle}
            onSolve={handleSolve}
            shouldFocus={shouldFocus}
          />
        );
    }
  };

  return (
    <div
      id="decryption-terminal"
      className={`${isShaking ? "shake" : ""} ${
        isUnlocking ? "unlocking" : ""
      }`}
    >
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
