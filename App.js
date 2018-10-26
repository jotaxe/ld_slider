import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import WorkingSiteView from "./components/working-sites";
import PresentationView from "./components/presentations";
import Home from "./components/home";
import {Button, List, Icon, Grid, Container} from "semantic-ui-react";



export default class App extends Component {
  render(){
    return (
      
      <div>
        <Switch>
          <Route exact path="/" component={ Home }/>
          <Route exact path="/pres-:_id" component={ PresentationView }/>
          <Route exact path="/ws-:_id" component={ WorkingSiteView }/>  
        </Switch>
      </div>
    )

  }
}