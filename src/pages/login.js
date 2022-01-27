import React, {useEffect, useState, useContext} from 'react' 
import { Redirect } from 'react-router-dom'
import { signInWithGoogle, logOut } from '../database/firebase'
import '../styles/login.css';

function Login({user, setUser}){
    // const user = useContext(UserContext)
    const [redirect, setredirect] = useState(null)
    console.log(user);
    if(user){
        return <Redirect to="/"/>    }
    if (redirect) {
        return <Redirect to={redirect}/>
    }
    return (
        <div className="home-page background fullsize">
            <div className="logobox">
            </div>
            <div className="flex-row">
                <div className="space"> <button onClick={() => {signInWithGoogle(setUser)}} className="loginbtn"><img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"></img> Login with Google</button> </div>
            </div>
        </div>
    );
}

export function Logout({setuser}){
    // const user = useContext(UserContext)
    const [redirect, setredirect] = useState("/")

    useEffect(() => {
        logOut(setuser);
        // console.log(user);
        // // if (user) {
        //     logOut();
        //     // setredirect("/")
        // }else{
        //     // setredirect('/login')
        // }
    }, [])
    if (redirect) {
        return <Redirect to={redirect}/>
    }
    return (
        <div className="home-page">
            <div className="logobox">
            </div>
            <div className="row">
                Logging Out
            </div>
        </div>
    );
}

export default Login;

