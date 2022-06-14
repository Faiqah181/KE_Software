///record of each account
///sort w.r.t to date of sale
///search type:defaulter/current/former , name:, mobile:, account no.;

import React, { useState, useEffect, useRef } from "react";
import { List, Card, CardTitle, CardText, DropdownMenu, Dropdown, DropdownToggle, DropdownItem } from "reactstrap"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css";

const MonthlyRecord = () => {


    const months = useRef(
        [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
    )
    const years = useRef([])

    const [customers, setCustomers] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState('February')
    const [yearToggle, setYearToggle] = useState(false)
    const [selectedYear, setSelectedYear] = useState('2001')
    const [balances, setBalances] = useState([])
    
    const init = () => {
        const localDate = new Date();
        setSelectedMonth(months.current[localDate.getMonth()])

        for (let year = localDate.getFullYear() - 5; year <= localDate.getFullYear(); year++) {
            years.current.push(year)
        }
        setSelectedYear(localDate.getFullYear())
    }


    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers`);
            setCustomers(await customerPromise.data);
        }

        catch (error) {
            console.log(error);
        }
    }

    const loadBalances = async (promises) => {
        setBalances(await Promise.all(promises))
    }

    useEffect(() => {
        getCustomers();
        init()
    }, [])

    
    useEffect(() => {
        const promises = []
        for (const c of customers) {
            promises.push(axios.get(`${config.API_URL}/monthly-records/${selectedYear}/${selectedMonth}/${c._id}`));
        }
        loadBalances(promises)

    }, [selectedMonth, selectedYear, customers])


    return(
        <div>
            <h1>Monthly Record</h1>
            <div className="daily-row">
                <Dropdown className="row-btn-left" isOpen={monthToggle} toggle={() => { setMonthToggle(!monthToggle) }}>
                    <DropdownToggle caret>
                        {selectedMonth}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem className="dropdown" header>
                            Select a month
                        </DropdownItem>
                        {
                            months.current.map(m => {
                                return (
                                    <DropdownItem key={m} onClick={() => { setSelectedMonth(m) }}>{m}</DropdownItem>
                                )
                            })
                        }
                    </DropdownMenu>
                </Dropdown>
                <Dropdown className="row-btn-left" isOpen={yearToggle} toggle={() => { setYearToggle(!yearToggle) }}>
                    <DropdownToggle caret>
                        {selectedYear}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem className="dropdown" header>
                            Select year
                        </DropdownItem>
                        {
                            years.current.map(y => {
                                return (
                                    <DropdownItem key={y} onClick={() => { setSelectedYear(y) }}>{y}</DropdownItem>
                                )
                            })
                        }
                    </DropdownMenu>
                </Dropdown>
            </div>

            <List>
                {balances.map((v, i) => {
                    return(
                        <Card style={{marginBottom: "10px"}} body key={customers[i]._id}>
                            <CardTitle tag="h5">
                                {customers[i].name}
                            </CardTitle>
                            <CardText>
                                {`Monthly Payment: ${v.data}`}
                            </CardText>
                        </Card>             
                    )
                })}
            </List>
        </div>
    );
}; 

export default MonthlyRecord;