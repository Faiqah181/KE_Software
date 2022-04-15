import { proxy } from 'valtio'

const state = proxy({

    isCollapsed:false,
    isSelected:"Dashboard"

})

export {state}