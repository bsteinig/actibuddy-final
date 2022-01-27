import React, {useState} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import SignInPage, {Logout} from './pages/login';
import Home from './pages/Home';
import Comp from './pages/Comp';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ProfileView from './pages/ProfileView';
import NotFoundPage from './pages/404';
import Explore from './pages/Explore';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'
import './styles/styles.css'

function App() {

  const [user, setUser] = useState(null);
  let userTmp = localStorage.getItem("user");
  if(userTmp){
    userTmp = JSON.parse(userTmp)
  }

  return (
    <Router>
      <Navbar user={userTmp} setUser={setUser}></Navbar>
      <Switch>
        <Route exact path="/" component={() => <Home user={userTmp}/>} />
        <Route exact path="/login" component={() => <SignInPage user={user} setUser={setUser}/>} />
        <Route exact path="/logout" component={() => <Logout setuser={setUser}/>} />
        <PrivateRoute exact path="/feed" user={userTmp} component={() => <Feed user={userTmp} />} />
        <PrivateRoute exact path="/profile" user={userTmp} component={() => <Profile user={userTmp} />} />
        <PrivateRoute exact path="/profile/:profileId" user={userTmp} component={() => <ProfileView user={userTmp} />} />
        <PrivateRoute exact path="/comp" user={userTmp} component={() => <Comp user={userTmp} />} /> 
        <PrivateRoute exact path="/explore" user={userTmp} component={() => <Explore user={userTmp} />} />
        <PrivateRoute exact path="/competitions" user={userTmp} component={() => <Comp user={userTmp} />} />
        <Route exact path="/404" component={NotFoundPage} />
        <Redirect to="/404" /> 
      </Switch>
    </Router>
  );
}

export default App;