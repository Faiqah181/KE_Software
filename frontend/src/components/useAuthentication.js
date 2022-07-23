import { state } from "../store";

const useAuthentication = () => {

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        return JSON.parse(userString);
    };

    const setUser = (user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        state.user = user;
    };

    return [
        getUser(),
        setUser
    ]
}

export default useAuthentication;