import React from "react";
import { useWritable } from "react-use-svelte-store";
import { store } from "../stores"

const Account = () => {

    const [$foo, setFoos, updateFoos] = useWritable(store);

    return(
        <div>
            Accounts
            {$foo}
        </div>
    );

}; 

export default Account;