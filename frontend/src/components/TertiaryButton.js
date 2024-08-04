import React from "react";
import "../css/TertiaryButton.css"

const TertiaryButton = (props) => {
    const { customClass, children, ...restProps } = props;
    return <button className={`tertiary-btn ${customClass}`} {...restProps}>{children}</button>
}

export default TertiaryButton;