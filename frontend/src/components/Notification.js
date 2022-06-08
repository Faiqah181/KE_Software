import React from 'react'
import {Alert} from 'reactstrap'
import { state } from "../store";
import { useSnapshot } from "valtio";

const Notification = () => {

  const store = useSnapshot(state)
  const alertState = store.alertState

    return (
        <div style={{position: 'fixed', width: '30%', bottom: '5%', right: '3%'}}> 
          <Alert color={alertState.color} isOpen={alertState.active} toggle={state.alertState.active = false}>
            {alertState.message}
          </Alert >
        </div>
    )
}

export default Notification;
