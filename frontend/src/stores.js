import { writable } from "react-use-svelte-store"; 

export const store = writable([
    { name: "Apple", value: 25.00 },
    { name: "Oranges", value: 20.00 },
    { name: "Grapes", value: 22.00 }
])
