import { state } from "../store";

const useAuthentication = () => {
    
    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        return JSON.parse(userString);
        //return user;
        //return userToken?.token
    };

    //const [user, setUser] = useState(getUser());
    //const store = useSnapshot(state);

    const setUser = (user) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        //setUser(loggedInUser);
        state.user = user;
    };

    return [
        getUser(),
        setUser
    ]
}

export default useAuthentication;