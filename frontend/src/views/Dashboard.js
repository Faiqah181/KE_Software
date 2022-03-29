import React from "react";
import { Card, CardTitle, CardText, CardGroup } from "reactstrap"

const Dashboard = () => {

    return (
        <div>
            <h1>Dashboard</h1>
            <CardGroup>
            <Card body>
                <CardTitle className="h5"> Monthly Income</CardTitle>
                <CardText>123452345</CardText>
            </Card>
            <Card body>
                <CardTitle className="h5"> Monthly Income</CardTitle>
                <CardText>123452345</CardText>
            </Card>
            <Card body>
                <CardTitle className="h5"> Monthly Income</CardTitle>
                <CardText>123452345</CardText>
            </Card>
            </CardGroup>
            

        </div>
    );

};

export default Dashboard;