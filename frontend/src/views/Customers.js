import React, {Fragment, useState, useEffect} from "react";
import { state } from "../store";
import { useSnapshot } from "valtio";
import axios from "axios";
import config from "../config";

const Customer = () => {
    
    const [users, setUsers] = useState([]);
    
    const getCustomers = async () => {
        try{
            const usersPromise = await axios.get(`${config.API_URL}/users`);
            setUsers(await usersPromise.data);
        }
 
        catch(error){
            console.log(error);
        }           
    }

    useEffect(() => {
        getCustomers();
     }, [])

    
    return (
        <div>
            Customers
            {users.map(user => {
                return(
                    <Fragment key={user.username}>
                        <div> <b>Name: {user.name} </b></div>
                        <div> Username: {user.username} </div>
                        <br />
                    </Fragment>
                )
            })}
        </div>
    );

}; 

export default Customer;