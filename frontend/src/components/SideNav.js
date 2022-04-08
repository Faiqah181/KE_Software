import React, { useState } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle, FiUsers } from "react-icons/fi";
import { BiBarChartAlt, BiBarChart, BiCog } from "react-icons/bi";
import { state } from "../store";
import { useSnapshot } from "valtio";
import "react-pro-sidebar/dist/css/styles.css";
import '../css/Navbar.css';


const SideNav = () => {

    const globalVar = useSnapshot(state);

    return (
        <div id="header">
            <ProSidebar collapsed={globalVar.isCollapsed}>
                <SidebarHeader>

                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="square">
                        <MenuItem active={globalVar.isSelected === "Dashboard"} icon={<FiHome />} onClick={() => state.isSelected = "Dashboard"}>
                            <Link to={"/Dashboard"}></Link>
                            Dashboard
                        </MenuItem>
                        <MenuItem active={globalVar.isSelected === "Accounts"} icon={<FaList />} onClick={() => state.isSelected = "Accounts"}>
                            <Link to={"/Accounts"}></Link>
                            Accounts
                        </MenuItem>
                        <MenuItem active={globalVar.isSelected === "Customers"} icon={<FiUsers />} onClick={() => state.isSelected = "Customers"}>
                            <Link to={"/Customers"}></Link>
                            Customers
                        </MenuItem>
                        <MenuItem active={globalVar.isSelected === "DailyRecord"} icon={<BiBarChartAlt />} onClick={() => state.isSelected = "DailyRecord"}>
                            <Link to={"/DailyRecord"}></Link>
                            Daily Record
                        </MenuItem>
                        <MenuItem active={globalVar.isSelected === "MonthlyRecord"} icon={<BiBarChart />} onClick={() => state.isSelected = "MonthlyRecord"}>
                            <Link to={"/MonthlyRecord"}></Link>
                            MonthlyRecord
                        </MenuItem>
                        <MenuItem active={globalVar.isSelected === "Inventory"} icon={<BiCog />} onClick={() => state.isSelected = "Inventory"}>
                            <Link to={"/Inventory"}></Link>
                            Inventory
                        </MenuItem>
                    </Menu>
                </SidebarContent>

                <SidebarFooter>
                    <Menu iconShape="square">
                        <MenuItem icon={<FiLogOut />}>Settings</MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default SideNav;