import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";

import { Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Collapse, DropdownItem, NavbarText, DropdownMenu, UncontrolledDropdown, DropdownToggle } from "reactstrap";
import '../css/Titlebar.css';

const Titlebar = ({ isNavOpened, setNavOpened }) => {
    return (
        <Navbar color="light" expand="md" light >
            <NavbarBrand>
                <div className="toggle-icon" onClick={() => { setNavOpened(!isNavOpened) }}>
                    <FiMenu />
                </div>
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
                        <DropdownMenu right>
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