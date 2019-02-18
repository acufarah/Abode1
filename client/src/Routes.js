import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import Register from './components/register';



const Routes = ()=>{
  return(
  
      <Switch>
          <Route path="/register" exact component={Register}/>
      </Switch>



  )
}


export default Routes;

