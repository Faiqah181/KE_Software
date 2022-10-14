import React from 'react'
import { Alert } from 'reactstrap'
import { state } from "../store";
import { useSnapshot } from "valtio";

const Notification = () => {

  const store = useSnapshot(state)

  const closeAlert = () => {
    state.alertState.active = !store.alertState.active
  }

  return (
    <div style={{ position: 'fixed', width: '30%', bottom: '5%', right: '3%' }}>
      <Alert className="custom-notification" color={store.alertState.color} isOpen={store.alertState.active} toggle={closeAlert}>
        {store.alertState.message}
      </ Alert>
    </div>
  )
}

export default Notification;
