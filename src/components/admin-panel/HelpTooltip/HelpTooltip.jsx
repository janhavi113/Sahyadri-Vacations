// components/HelpTooltip.jsx
import React from "react";
import "./HelpTooltip.css"; // Or use styled-components/tailwind/etc.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
const HelpTooltip = ({ text }) => {
  return (
    <span className="tooltip-icon">
    <FontAwesomeIcon icon={faCircleQuestion} size="xs" />
    <span
        className="tooltip-text"
        dangerouslySetInnerHTML={{ __html: text }}
      />
  </span>
  );
};

export default HelpTooltip;
