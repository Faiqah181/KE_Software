import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { Navbar, NavbarBrand, Nav, Collapse, DropdownItem, DropdownMenu, UncontrolledDropdown, DropdownToggle } from "reactstrap";
import { state } from '../store';
import { useHistory } from "react-router-dom";
import useAuthentication from './useAuthentication';
import '../css/Titlebar.css';


const Titlebar = () => {

    const history = useHistory();
    const [user, setUser] = useAuthentication();


    const logout = () => {
        history.push("/Login");
        setUser(null);
    }

    return (
        <Navbar color="primary" expand="md" dark >
            <NavbarBrand>
                <div className="toggle-icon" onClick={() => { state.isCollapsed = (!state.isCollapsed) }}>
                    <FiMenu />
                </div>

                <img className="title-logo" src="logo-dark.png" alt=""></img>

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