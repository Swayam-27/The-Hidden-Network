import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaseFolder = ({
  id,
  title,
  description,
  imgSrc,
  isVisible,
  isCompleted,
  playHover,
  playClick,
  difficulty,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const handleClick = (e) => {
    if (playClick) playClick();
    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)"
    ).matches;
    if (isTouchDevice && !isPreview) {
      e.preventDefault();
      setIsPreview(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPreview(false);
  };

  const folderClassName = `case-folder cursor-target ${
    isPreview ? "preview" : ""
  } ${!isVisible ? "hidden" : ""} ${isCompleted ? "is-completed" : ""}`;

  return (
    <Link
      to={`/case/${id}`}
      className={folderClassName.trim()}
      onClick={handleClick}
      onMouseEnter={playHover}
      onMouseLeave={handleMouseLeave}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <div className="folder-front">
        <h2>TOP SECRET</h2>
      </div>
      <div className="folder-paper">
        <div className="paper-content">
          <img src={imgSrc} alt={`${title} icon`} />
          <div className="paper-details">
            <h2>{title}</h2>
            <p>{description}</p>
            {difficulty && (
              <p
                className={`paper-difficulty difficulty-${difficulty
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                DIFFICULTY: {difficulty}
              </p>
            )}
          </div>
        </div>
        {isCompleted && (
          <div className="paper-completed-tag">[ COMPLETED ]</div>
        )}
      </div>
    </Link>
  );
};

export default CaseFolder;
