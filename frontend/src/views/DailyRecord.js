import React, {Fragment, useState, useEffect} from "react";
import {Table, Input} from "reactstrap"
import Daily from "../components/Daily"
import axios from 'axios';
import config from "../config";
import "../css/DailyRecord.css"

const DailyRecord = (props) => {

    
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
            DailyRecord
            
            <Table bordered>
                <thead>
                    <tr>
                        <th>Customer</th>
                        {props.days.map(day => {
                            return(
                                <th key={day}>{day}</th>
                            )
                        })}
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => {
                        return (
                            <tr>
                                <th>
                                    {user.name}
                                </th>
                                {props.days.map(day => {
                                    return (
                                        <td key={day}>
                                            <div style={{width: "5rem"}}>
                                                <Input type="number" />
                                            </div>
                                            
                                        </td>     
                                    )
                                })}
                            </tr>
                        )
                    })}
                        
                </tbody>
            </Table>            
        </div>
    );

}; 

export default DailyRecord;