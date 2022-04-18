import './App.scss';
import { Route } from "react-router-dom";
import React, { useEffect } from 'react';
import SideNav from './components/SideNav';
import Titlebar from './components/Titlebar';
import Account from './views/Accounts';
import Dashboard from './views/Dashboard';
import Customer from './views/Customers';
import DailyRecord from './views/DailyRecord';
import MonthlyRecord from './views/MonthlyRecord';
import Inventory from './views/Inventory';
import Login from './views/Login';
import { Card, CardBody } from "reactstrap"
import { state } from './store'
import { useSnapshot } from 'valtio';
import useAuthentication from './components/useAuthentication';
import days from "./days"

function App() {
  const store = useSnapshot(state);
  const [user, setUser] = useAuthentication();

  useEffect(() => {
    state.user = user
  }, [])

  if (!store.user) {
    return <Login />
  }

  return (

    <div className="sub-root">
      {store.user && <Titlebar />}
      {store.user && <div id='app'>
        <SideNav />
        <div id='content'>
          <Card>
            <CardBody>
              <div className='home'>
                <Route exact path='/Accounts' component={Account} />
                <Route exact path='/Dashboard' component={Dashboard} />
                <Route exact path='/' component={Dashboard} />
                <Route exact path='/Customers' component={Customer} />
                <Route exact path='/DailyRecord'>
                  <DailyRecord days={days} />
                </Route>
                <Route exact path='/MonthlyRecord' component={MonthlyRecord} />
                <Route exact path='/Inventory' component={Inventory} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>}
      <Route exact path='/Login'>
        <Login />
      </Route>
    </div>

  );
}

export default App;
