import React, { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { Navbar, NavbarBrand, Nav, Collapse, DropdownItem, DropdownMenu, UncontrolledDropdown, DropdownToggle } from "reactstrap";
import { state } from '../store';
import { useHistory } from "react-router-dom";
import '../css/Titlebar.css';


const Titlebar = () => {

    let history = useHistory();

    const logout = () => {
        history.push("/Login");
    }

    return (
        <Navbar color="primary" expand="md" dark >
            <NavbarBrand>
                <div className="toggle-icon" onClick={() => { state.isCollapsed= (!state.isCollapsed) }}>
                    <FiMenu />
                </div>

                <img className="title-logo" src="logo-dark.png" alt="Khan Electronics"></img>

                Khan Electronics
            </NavbarBrand>
            <Collapse navbar>
                <Nav className="me-auto" navbar >

                </Nav>

                <UncontrolledDropdown inNavbar>
                    <DropdownToggle caret color='primary'>
                        Shuaib Ghazi
                    </DropdownToggle>
                    <DropdownMenu end>
                    <DropdownItem>
                            Profile
                        </DropdownItem>
                        <DropdownItem onClick={logout}>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Collapse>
        </Navbar>
    );
}

export default Titlebar;