import React, { useState, useEffect, useRef } from "react";
import { Table, Input, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Container, Button, Row, Col } from "reactstrap"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css";

const DailyRecord = (props) => {

    const months = useRef(['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'])
    const [users, setUsers] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    
    const monthRecord = useRef({})
    const tableRef = useRef(null);


    const initializeRecords = () => {
        users.map(customer => {
            return monthRecord.current[customer] = Array(31).fill(0)
        })
    }

    const scroll = (scrollOffset) => {
        tableRef.current.scrollLeft += scrollOffset;
    };

    const inputData = (event, customer, day) => {
        monthRecord.current[customer][day] = event.target.value
    }

    const daysInMonth = (month, year) => new Date(year, month, 0).getDate()

    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers`);
            setUsers(await customerPromise.data);
        }

        catch (error) {
            console.log(error);
        }
    }

    const saveDaily = async () => {

        try {
            const dailyrecordPromise = await axios.post(`${config.API_URL}/daily-record`,)
        }
        catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getCustomers();
        //initializeRecords();
    }, [])


    return (
        <div>
            <div className="daily-row">
                <Dropdown isOpen={monthToggle} toggle={() => { setMonthToggle(!monthToggle) }}>
                    <DropdownToggle caret>
                        Month
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem className="dropdown" header>
                            Select a month
                        </DropdownItem>
                        {
                            months.current.map(m => {
                                return (
                                    <DropdownItem key={m}>{m}</DropdownItem>
                                )
                            })
                        }
                    </DropdownMenu>
                </Dropdown>
                <Button>Save</Button>
            </div>

            <div className="daily-row">
                <Button color="primary" onClick={() => scroll(-200)}>Left</Button>
                <Button color="primary" onClick={() => scroll(200)}>Right</Button>
            </div>

            <div className="daily-table-outer">
                <div className="daily-table-inner" ref={tableRef}>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th className="daily-table-fix">Customer</th>
                                {props.days.map(day => {
                                    return (
                                        <th key={day}>{day}</th>
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => {
                                return (
                                    <tr>
                                        <th className="daily-table-fix">
                                            {user.name}
                                        </th>
                                        {props.days.map(day => {
                                            return (
                                                <td key={day}>
                                                    <div style={{ width: "5rem" }}>
                                                        <Input type="number" id="record" />
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