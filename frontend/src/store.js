import { proxy } from 'valtio'

const state = proxy({

    isCollapsed:true,
    isSelected:"Dashboard"

})

export {state}