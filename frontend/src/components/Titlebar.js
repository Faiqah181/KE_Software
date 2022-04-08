import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Collapse, DropdownItem, NavbarText, DropdownMenu, UncontrolledDropdown, DropdownToggle } from "reactstrap";
import { state } from "../store";
import '../css/Titlebar.css';


const Titlebar = () => {

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

                    <UncontrolledDropdown
                        inNavbar
                        nav
                    >
                        <DropdownToggle
                            caret
                            nav
                        >
                            Shuaib Ghazi
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem>
                                Profile
                            </DropdownItem>
                            <DropdownItem>
                                Logout
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>

                </Nav>

                <NavbarText>
                    Simple Text
                </NavbarText>
            </Collapse>
        </Navbar>
    );
}

export default Titlebar;