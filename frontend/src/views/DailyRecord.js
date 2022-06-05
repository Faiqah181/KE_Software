import React, { useState, useEffect, useRef } from "react";
import { Table, Input, DropdownMenu, Dropdown, DropdownToggle, DropdownItem, Container, Button, Row, Col } from "reactstrap"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css";

const DailyRecord = (props) => {

    const months = useRef(['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'])
    const [users, setUsers] = useState([]);
    const [monthToggle, setMonthToggle] = useState(false)
    const monthrecord = useRef({})

    function initializeRecords(){

        users.map( customer => {
            return (
                monthrecord.current[customer] = Array(31).fill(0)
            )
        })

    }

    const inputData = (event, customer, day) => {

        monthrecord.current[customer][day] = event.target.value
    }

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    }

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
            <Row>
                <Col>
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
                </Col>
                <Col>
                    <Button>
                        Save
                    </Button>
                </Col>
            </Row>

            <div className="container">
                <Table bordered>
                    <thead>
                        <tr>
                            <th>Customer</th>
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
                                    <th>
                                        {user.name}
                                    </th>
                                    {props.days.map(day => {
                                        return (
                                            <td key={day}>
                                                <div style={{ width: "5rem" }}>
                                                    <Input type="number" id="record"/>
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
    );

};

export default DailyRecord;