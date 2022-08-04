import React from "react";
import "../css/TertiaryButton.css"

const TertiaryButton = (props) => <button className={`tertiary-btn ${props.customClass}`} {...props}>{props.children}</button>

export default TertiaryButton;