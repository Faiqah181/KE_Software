import './App.css';
import { Router, Route, Routes } from "react-router-dom";
import React from 'react';
import SideNav from './components/Navbar';
import Account from './views/Accounts';
import Dashboard from './views/Dashboard';
import Customer from './views/Customers';
import DailyRecord from './views/DailyRecord';
import MonthlyRecord from './views/MonthlyRecord';
import Inventory from './views/Inventory';

function App() {

  return (

    <div class="app">
      <SideNav />
      <div className="home">
      <Route exact path='/Accounts' component={Account} />
      <Route exact path='/Dashboard' component={Dashboard} />
      <Route exact path='/' component={Dashboard} />
      <Route exact path='/Customers' component={Customer} />
      <Route exact path='/DailyRecord' component={DailyRecord} />
      <Route exact path='/MonthlyRecord' component={MonthlyRecord} />
      <Route exact path='/Inventory' component={Inventory} />
      </div>
      

      {/** 
      <Router>
        <SideNav/>
        <Routes>
          <Route path='/Accounts' element={<Account/>}/>
          <Route path='/Dashboard' element={<Dashboard/>}/>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/Customer' element={<Customer/>}/>
          <Route path='/DailyRecord' element={<DailyRecord/>}/>
          <Route path='/MonthlyRecord' element={<MonthlyRecord/>}/>
          <Route path='/Inventory'  element={<Inventory/>}/>
        </Routes>
      </Router>*/}
    </div>

  );
}

export default App;
