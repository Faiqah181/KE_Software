import { proxy } from 'valtio'

const state = proxy({

    isCollapsed:false,
    isSelected:"Dashboard",
    user: null

})

export {state}