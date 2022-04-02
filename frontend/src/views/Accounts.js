import React from "react";
import { useWritable } from "react-use-svelte-store";
import { store } from "../stores"

const Account = () => {

    const [$store, setStore, updateStore] = useWritable(store);

    return(
        <div>
            <div>
                Accounts
            </div>
            <div>
                Lallu
            </div>
            
            {$store.map(e =>{
                return(
                    <div key={e.name}>
                        <div>{e.name} = Rs {e.value}</div>
                    </div>
                );
            })}
        </div>
    );

}; 

export default Account;