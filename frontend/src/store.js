import { proxy } from 'valtio'

const state = proxy({

    isCollapsed: false,
    isSelected: "Dashboard",
    user: null,
    alertState: {
        active: false,
        message: "",
        color: "#000000",
    }
})

export { state }