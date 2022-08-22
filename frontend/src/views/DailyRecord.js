import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Button } from "reactstrap"
import InstallmentTable from "../components/InstallmentTable";
import axios from 'axios';
import config from "../config";
import useAuthentication from "../components/useAuthentication";
import "../css/DailyRecord.css";

const DailyRecord = () => {

    const months = [
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

    const years = useRef([])
    const tableRef = useRef(null);

    const [user] = useAuthentication()
    const [customers, setCustomers] = useState([]);
    const [days, setDays] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    const [selectedMonth, setSelectedMonth] = useState('February 2001')
    const [yearToggle, setYearToggle] = useState(false)
    const [selectedYear, setSelectedYear] = useState('-')

    const [installments, setInstallments] = useState(Array(31).fill().map(() => ({})));

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate()

    const scroll = (scrollOffset) => {
        tableRef.current.scrollLeft += scrollOffset;
    };

    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers/type/current`, {
                headers: { 'x-access-token': user, },
            });
            setCustomers(await customerPromise.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const getInstallments = async () => {
        try {
            const monthNum = months.indexOf(selectedMonth) + 1;
            const res = await axios.get(`${config.API_URL}/installments/${selectedYear}/${monthNum}`,{
                headers: { 'x-access-token': user, },
            });

            const data = await res.data;
            setInstallments(() => {
                const state = Array(31).fill().map(() => ({}));
                if (!data?.length) {
                    return state;
                }

                for (let day = 0; day < days.length; day++) {

                    for (const record of data.dailyRecord[day].customerRecord) {
                        state[day][record.customer] = record.amount;
                    }

                    for (const c of customers) {
                        if (!state[day][c._id]) {
                            state[day][c._id] = "";
                        }
                    }
                }

                return state;
            });
        }
        catch (error) {
            console.log(error)
        }
    }

    const setValue = (e, day, c_id) => {
        e.persist();
        setInstallments(prev => {
            const newState = [...prev];
            newState[day][c_id] = e.target.value;
            return newState;
        })
    }

    const saveDaily = async () => {
        try {
            console.log(installments);
            const data = { dailyRecord: [] };
            
            for (let day = 0; day < days.length; day++) {
                data.dailyRecord[day] = {
                    date: (new Date(parseInt(selectedYear), months.indexOf(selectedMonth), day + 1)).toISOString().split('T')[0],
                    customerRecord: [],
                };
                
                for (const customer in installments[day]) {
                    if(installments[day][customer]) {
                        data.dailyRecord[day].customerRecord.push({
                            customer: customer,
                            amount: parseInt(installments[day][customer])
                        });
                    }
                }
            }

            await axios.post(`${config.API_URL}/installments/add`, data, {
                headers: { 'x-access-token': user, },
            })

        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await getCustomers();

            const localDate = new Date();
            setSelectedMonth(months[localDate.getMonth()]);

            for (let year = localDate.getFullYear() - 5; year <= localDate.getFullYear(); year++) {
                years.current.push(year);
            }
            setSelectedYear(localDate.getFullYear());
        }

        loadData();
    }, [])


    useEffect(() => {
        if (selectedYear !== '-' && selectedMonth !== "February 2001") {
            setDays(new Array(daysInMonth(months.indexOf(selectedMonth) + 1, selectedYear)).fill(0))
        }
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        if (selectedYear !== '-' && selectedMonth !== "February 2001") {
            getInstallments();
        }
    }, [days])

    return (
        <Card>
            <CardBody>
                <h2>Installments</h2>

                <div className="daily-row">
                    <Dropdown className="row-btn-left" isOpen={monthToggle} toggle={() => { setMonthToggle(!monthToggle) }}>
                        <DropdownToggle caret>{selectedMonth}</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem className="dropdown" header>
                                Select a month
                            </DropdownItem>
                            {
                                months.map(m => {
                                    return (
                                        <DropdownItem key={m} onClick={() => { setSelectedMonth(m); getInstallments(); }}>{m}</DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown className="row-btn-left" isOpen={yearToggle} toggle={() => { setYearToggle(!yearToggle) }}>
                        <DropdownToggle caret>{selectedYear}</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem className="dropdown" header>
                                Select year
                            </DropdownItem>
                            {
                                years.current.map(y => {
                                    return (
                                        <DropdownItem key={y} onClick={() => { setSelectedYear(y); getInstallments(); }}>{y}</DropdownItem>
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
                <InstallmentTable tableRef={tableRef}>
                    <thead>
                        <tr>
                            <th className="sticky-left sticky-top">Customer</th>
                            {days.map((_, day) => {
                                return (
                                    <th className="sticky-top" key={day}>{day + 1}</th>
                                )
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map(c => {
                            return (
                                <tr key={c._id}>
                                    <th className="sticky-left">
                                        {c.name}
                                    </th>
                                    {days.map((_, day) => {
                                        return (
                                            <td key={`${day + 1}`}>
                                                <Input value={installments[day][c._id] ? installments[day][c._id] : ""} onChange={(e) => setValue(e, day, c._id)} type="number" />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </InstallmentTable>
            </CardBody>
        </Card>
    );

};

export default DailyRecord;