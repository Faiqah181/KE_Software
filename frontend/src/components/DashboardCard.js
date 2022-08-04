import React from "react";
import { Card } from "reactstrap";
import "../css/DashboardCard.css"

const DashboardCard = (props) => {
    return (
        <Card body>
            <div style={{ display: "flow-root" }}>
                <span className="dashboard-card-title" style={{ float: "left"}}>{props.title}</span>
            </div>
            <div className="dashboard-card-value">{props.value}</div>
            <div className="dashboard-card-footer">
                <span className={props.positive ? "dashboard-card-footer-positive" : "dashboard-card-footer-negative"}>
                    {props.footerValue}
                </span>
                <span>  since last month</span>
            </div>
        </Card>
    )
}

export default DashboardCard;