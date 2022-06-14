import React from "react";
import { Link } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter, SidebarContent } from "react-pro-sidebar";
import { FaList } from "react-icons/fa";
import { FiHome, FiUsers } from "react-icons/fi";
import { BiBarChartAlt, BiBarChart, BiCog } from "react-icons/bi";
import { state } from "../store";
import { useSnapshot } from "valtio";
import "react-pro-sidebar/dist/css/styles.css";
import '../css/Navbar.css';


const SideNav = () => {

    const store = useSnapshot(state);

    return (
        <div id="header">
            <ProSidebar collapsed={store.isCollapsed}>
                <SidebarHeader>

                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="square">
                        
                        <MenuItem active={store.isSelected === "Accounts"} icon={<FaList />} onClick={() => state.isSelected = "Accounts"}>
                            <Link to={"/Accounts"}></Link>
                            Accounts
                        </MenuItem>
                        <MenuItem active={store.isSelected === "Customers"} icon={<FiUsers />} onClick={() => state.isSelected = "Customers"}>
                            <Link to={"/Customers"}></Link>
                            Customers
                        </MenuItem>
                        <MenuItem active={store.isSelected === "DailyRecord"} icon={<BiBarChartAlt />} onClick={() => state.isSelected = "DailyRecord"}>
                            <Link to={"/DailyRecord"}></Link>
                            Daily Record
                        </MenuItem>
                        <MenuItem active={store.isSelected === "MonthlyRecord"} icon={<BiBarChart />} onClick={() => state.isSelected = "MonthlyRecord"}>
                            <Link to={"/MonthlyRecord"}></Link>
                            MonthlyRecord
                        </MenuItem>
                       
                    </Menu>
                </SidebarContent>

                <SidebarFooter>
                    <Menu iconShape="square">
                        <MenuItem icon={<BiCog />}>
                            <Link to={"/Setting"}/>
                            Settings
                        </MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </div>
    );
};

export default SideNav;