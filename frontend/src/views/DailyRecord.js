import React, { useState, useEffect, useRef } from "react";
import { Table, Input, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Container, Button, Row, Col } from "reactstrap"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css";

const DailyRecord = () => {

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

    const monthRecord = useRef({})
    const tableRef = useRef(null);
    const inputRefs = useRef([]);


    const [customers, setCustomers] = useState([]);
    const [days, setDays] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState('Month')
    const [yearToggle, setYearToggle] = useState(false)
    const [selectedYear, setSelectedYear] = useState('2001')

    const [record, setRecord] = useState(null)

    const init = () => {
        const localDate = new Date();
        setSelectedMonth(months.current[localDate.getMonth()])

        for (let year = localDate.getFullYear() - 5; year <= localDate.getFullYear(); year++) {
            years.current.push(year)
        }
        setSelectedYear(localDate.getFullYear())
    }


    const initializeRecords = () => {
        customers.map(customer => {
            return monthRecord.current[customer] = Array(31).fill(0)
        })
    }

    const scroll = (scrollOffset) => {
        tableRef.current.scrollLeft += scrollOffset;
    };

    const setRecordValue = (day, customerId, value) => {
        setRecord(prev => {
            prev[day][customerId] = value
            return prev
        })
    }

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate()

    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers`);
            setCustomers(await customerPromise.data);
        }

        catch (error) {
            console.log(error);
        }
    }

    const saveDaily = async () => {

        try {
            const dailyData = {year: selectedYear, month: selectedMonth, data: record}
            const dailyRecordPromise = await axios.post(`${config.API_URL}/daily-records`, dailyData)
        }
        catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getCustomers();
        init();
        //initializeRecords();
    }, [])


    useEffect(() => {
        setDays(new Array(daysInMonth(months.current.indexOf(selectedMonth) + 1, selectedYear)).fill(0))
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        setRecord(state => {
            state = {}
            for (let i = 1; i < days.length; i++) {
                state[i] = {}
            }

            return state
        })
    }, [customers, days])


    return (
        <div>
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
                <Button className="row-btn-right" onClick={saveDaily}>Save</Button>
            </div>

            <div className="daily-row">
                <Button className="row-btn-left" color="primary" onClick={() => scroll(-500)}>Left</Button>
                <Button className="row-btn-right" color="primary" onClick={() => scroll(500)}>Right</Button>
            </div>

            <div className="daily-table-outer">
                <div className="daily-table-inner" ref={tableRef}>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th className="daily-table-fix">Customer</th>
                                {days.map((_, day) => {
                                    return (
                                        <th key={day + 1}>{day + 1}</th>
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map(c => {
                                return (
                                    <tr key={c._id}>
                                        <th className="daily-table-fix">
                                            {c.name}
                                        </th>
                                        {days.map((_, day) => {
                                            return (
                                                <td key={`${day + 1}`}>
                                                    <div style={{ width: "5rem" }}>
                                                        <Input onChange={e => setRecordValue(day + 1, c._id, e.target.value)} type="number" id="record" />
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );

};

export default DailyRecord;