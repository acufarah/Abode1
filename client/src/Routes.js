import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';



const Routes = ()=>{
  return(
  
      <Switch>
          <Route path="/register" exact component={Register}/>
          <Route path="/login" exact component={Login}/>
      </Switch>



  )
}


export default Routes;

