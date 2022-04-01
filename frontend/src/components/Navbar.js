import React, { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";

import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";

import { FaList } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiUsers } from "react-icons/fi";
import { BiBarChartAlt, BiBarChart, BiCog } from "react-icons/bi";

import "react-pro-sidebar/dist/css/styles.css";
import '../css/Navbar.css';


const SideNav = ({isNavOpened}) => {

    const [activeBtn, setActive] = useState("Dashboard");

    return (
        <>
            <div>
                <div id="header">
                    <ProSidebar collapsed={!isNavOpened}>
                        <SidebarHeader>
                            
                        </SidebarHeader>

                        <SidebarContent>
                            <Menu iconShape="square">
                                <MenuItem active={activeBtn === "Dashboard"} icon={<FiHome />} onClick={() => setActive("Dashboard")}>
                                    <Link to={"/Dashboard"}></Link>
                                    Dashboard
                                </MenuItem>
                                <MenuItem active={activeBtn === "Accounts"} icon={<FaList />} onClick={() => setActive("Accounts")}>
                                    <Link to={"/Accounts"}></Link>
                                    Accounts
                                </MenuItem>
                                <MenuItem active={activeBtn === "Customers"} icon={<FiUsers />} onClick={() => setActive("Customers")}>
                                    <Link to={"/Customers"}></Link>
                                    Customers
                                </MenuItem>
                                <MenuItem active={activeBtn === "DailyRecord"} icon={<BiBarChartAlt />} onClick={() => setActive("DailyRecord")}>
                                    <Link to={"/DailyRecord"}></Link>
                                    Daily Record
                                </MenuItem>
                                <MenuItem active={activeBtn === "MonthlyRecord"} icon={<BiBarChart />} onClick={() => setActive("MonthlyRecord")}>
                                    <Link to={"/MonthlyRecord"}></Link>
                                    MonthlyRecord
                                </MenuItem>
                                <MenuItem active={activeBtn === "Inventory"} icon={<BiCog />} onClick={() => setActive("Inventory")}>
                                    <Link to={"/Inventory"}></Link>
                                    Inventory
                                </MenuItem>
                            </Menu>
                        </SidebarContent>

                        <SidebarFooter>
                            <Menu iconShape="square">
                                <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
                            </Menu>
                        </SidebarFooter>
                    </ProSidebar>
                </div>
            </div>

        </>
    );
};

export default SideNav;