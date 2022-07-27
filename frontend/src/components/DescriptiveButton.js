import React from "react";
import { Button, Col, Row } from "reactstrap";
import {BsCheckLg} from "react-icons/bs"
import "../css/DescriptiveButton.css"

const DescriptiveButton = (props) => {
    return (
        <Button className="descriptive-btn" {...props}>
            <Row><Col sm={1}>
                {props.checked && <BsCheckLg />}
            </Col>
            <Col sm={11}>
                <div className="descriptive-btn-title">{props.title}</div>
                <p className="descriptive-btn-text">{props.description}</p>
            </Col>
            </Row>
        </Button>
    )
}

export default DescriptiveButton;