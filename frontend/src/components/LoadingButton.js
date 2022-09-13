import React from "react";
import { Button, Spinner } from "reactstrap";
import "../css/LoadingButton.css"

const LoadingButton = (props) => {
    const {isLoading, ...btnProps} = props;
    return (
        <Button {...btnProps}>
            <span>{props.children}</span>
            <span className={`button-spinner ${props.isLoading ? 'loading' : ''}`}>
                <Spinner size='sm' />
            </span>
        </Button>
    );
}

export default LoadingButton;