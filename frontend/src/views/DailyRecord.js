import React, { useState, useEffect, useRef } from "react";
import { Table, Input, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Button } from "reactstrap"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css";
import useAuthentication from "../components/useAuthentication";

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
    const tableRef = useRef(null);
    const inputRefs = useRef({});

    const [user, setUser] = useAuthentication()
    const [customers, setCustomers] = useState([]);
    const [days, setDays] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState('February')
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
            const customerPromise = await axios.get(`${config.API_URL}/customers`, {
                headers: { 'x-access-token': user, },
            });
            setCustomers(await customerPromise.data);
        }

        catch (error) {
            console.log(error);
        }
    }

    const getDaily = async () => {
        try {
            const dailyPromise = await axios.get(`${config.API_URL}/daily-records/${selectedYear}/${selectedMonth}`, {
                headers: { 'x-access-token': user, },
            });
            handleDailyPromise(await dailyPromise.data);
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleDailyPromise = (dailyRecord) => {
        for (const c of customers) {
            for (const [d] of days.entries()) {
                inputRefs.current[`${c._id}/${d + 1}`].value = (dailyRecord[d + 1]?.[c._id]) ? dailyRecord[d + 1][c._id] : ""
                if (!dailyRecord[d + 1]) {
                    dailyRecord[d + 1] = {}
                }
            }
        }
        setRecord(dailyRecord)
    }

    const saveDaily = async () => {
        try {
            const dailyData = { year: selectedYear, month: selectedMonth, data: record }
            const dailyRecordPromise = await axios.post(`${config.API_URL}/daily-records`, {
                headers: { 'x-access-token': user, },
                dailyData,
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCustomers();
        init();
    }, [])


    useEffect(() => {
        setDays(new Array(daysInMonth(months.current.indexOf(selectedMonth) + 1, selectedYear)).fill(0))
    }, [selectedMonth, selectedYear])

    useEffect(() => {

        setRecord(state => {
            state = {}
            for (let i = 1; i <= days.length; i++) {
                state[i] = {}
            }

            return state
        })

        getDaily()

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
                                                        <input style={{ width: "32" }} ref={el => (inputRefs.current[`${c._id}/${day + 1}`] = el)} onChange={e => setRecordValue(day + 1, c._id, e.target.value)} type="number" />
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