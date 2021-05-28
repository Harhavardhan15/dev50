
import { Fragment, useEffect } from 'react';
import './App.css';
import Navbar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import Alert from './component/layout/Alert';
import Dashboard from './component/dashboard/Dashboard';
import CreateProfile from './component/profile-forms/CreateProfile';
import PrivateRoute from './component/routing/PrivateRoute';
import EditProfile from './component/profile-forms/EditProfile';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
//redux
import { Provider } from 'react-redux';
import store from './store';
if(localStorage.token){
  setAuthToken(localStorage.token);
  } 

const App=()=> {
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])
  return (
    <Provider store={store}>
      <Router>
        <Fragment >
          <Navbar />
          <Route exact path="/" component={Landing} />
          
          <section className="container">
          <Alert />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App;
