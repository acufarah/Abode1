import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import NewListing from './components/new_listing';



const Routes = ()=>{
  return(
  
      <Switch>
          <Route path="/register" exact component={Register}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/new_listing" exact component={NewListing}/>
      </Switch>



  )
}


export default Routes;

