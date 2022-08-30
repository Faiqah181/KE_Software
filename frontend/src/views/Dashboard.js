import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { Card, Row, Col } from "reactstrap"
import useAuthentication from "../components/useAuthentication";
import DashboardCard from "../components/DashboardCard";
import "../css/Dashboard.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {

    const [user, setUser] = useAuthentication()
    const [customerNum, setCustomerNum] = useState()
    const [accountNum, setAccountNum] = useState()

    const getCustomers = async () => {
        try {
            const customerPromise = await axios.get(`${config.API_URL}/customers/type/current`, {
                headers: {
                    'x-access-token': user,
                },
            });
            setCustomerNum(await customerPromise.data.length)
        }

        catch (error) {
            console.log(error);
        }
    }

    const getAccounts = async () => {
        try {
            const accountPromise = await axios.get(`${config.API_URL}/accounts/all`, {
                headers: {
                    'x-access-token': user,
                },
            });
            setAccountNum(await accountPromise.data.length);
        }

        catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getCustomers();
        getAccounts();
    }, [])


    
    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Montly Sales',
        },
        },
    };
    
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
        {
            label: 'Mobile Phones',
            data: labels.map(() => Math.floor(Math.random() * 1000)),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Other Appliances',
            data: labels.map(() => Math.floor(Math.random() * 1000)),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        ],
    };
  
    return (
        <div >
            <h2>Dashboard</h2>
            <Row>
                <Col sm={5}>
                    <Row>
                        <Col>
                            <DashboardCard title="Current Customers" value={customerNum} footerValue="5%" positive />
                        </Col>
                        <Col>
                            <DashboardCard title="Active Accounts" value={accountNum} footerValue="2%" />
                        </Col>
                    </Row>
                    <Row style={{marginTop: "1rem"}}>
                        <Col>
                            <DashboardCard title="Current Customers" value={customerNum} footerValue="5%" positive />
                        </Col>
                        <Col>
                            <DashboardCard title="Current Customers" value={customerNum} footerValue="5%" positive />
                        </Col>
                    </Row>
                </Col>
                <Col sm={7}>
                    <Card body>
                        <Bar options={options} data={data} />
                    </Card>
                </Col>
            </Row>
        </div>
    );

};

export default Dashboard;