import React from "react";
import { Label } from "reactstrap";

const LabelledText = (props) => {
    return (
        <Label>
            <span style={{fontWeight: 500}}>{props.name}: </span>
            {props.children}
        </Label>
    )
}

export default LabelledText;