import './App.scss';
import { Route } from "react-router-dom";
import React, { useEffect } from 'react';
import SideNav from './components/SideNav';
import Titlebar from './components/Titlebar';
import Accounts from './views/Accounts';
import AccountDetails from './views/AccountDetails';
import Dashboard from './views/Dashboard';
import Customer from './views/Customers';
import DailyRecord from './views/DailyRecord';
import MonthlyRecord from './views/MonthlyRecord';
import Inventory from './views/Inventory';
import Setting from './views/Settings';
import Login from './views/Login';
import { Card, CardBody } from "reactstrap"
import { state } from './store'
import { useSnapshot } from 'valtio';
import useAuthentication from './components/useAuthentication';
import days from "./days"
import Notification from './components/Notification';
import jwt from "jsonwebtoken";

import NotFound from './views/404';

function App() {
	const store = useSnapshot(state);
	const [user, setUser] = useAuthentication();

	useEffect(() => {
		const token = user;
		if (token) {
			try {
				jwt.decode(token)
				state.user = token;
			}
			catch (error) {
				console.log(error)
				setUser(null)
			}
		}

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
					<Route exact path='/' component={Dashboard} />
					<Route exact path='/Dashboard' component={Dashboard} />

					<Route exact path='/Accounts' component={Accounts} />
					<Route path='/Accounts/:id' component={AccountDetails} />
					<Route exact path='/Customers' component={Customer} />
					<Route exact path='/DailyRecord' component={DailyRecord} />
					<Route exact path='/MonthlyRecord' component={MonthlyRecord} />
					<Route exact path='/Inventory' component={Inventory} />
					<Route exact path='/Setting' component={Setting} />

					<Route path='/404' component={NotFound} />
				</div>
			</div>}

			<Route exact path='/Login'>
				<Login />
				<Notification />
			</Route>
		</div>

	);
}

export default App;
