import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import WorkingSiteView from "./components/working-sites";
import PresentationView from "./components/presentations";
import {Button, List, Icon, Grid, Container} from "semantic-ui-react";

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      ws: [],
      visible: true
    }
  }

  componentWillMount() {
   
    var req = new XMLHttpRequest();
    req.open('GET', 'http://192.168.0.4:3030/working-sites/', null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    this.setState({ws: reqJSON.data});
  }

  componentWillUnmount(){
    this.setState({visible: false})
  }
  changeVisible = () => {
    this.setState({visible: false})    
  }
  render(){
    const {ws, visible} = this.state
    console.log(ws)
    const wsLinks = ws ? ws.map( (workingSite) => {
      return (
        <Grid.Column>
        <List.Item key = {workingSite._id}>
          <Link to = {"/ws-" + workingSite._id}>
            <Button size="massive" color="blue" circular icon='file powerpoint' onClick={this.changeVisible}>
            </Button>
          </Link>
          <List.Header>{workingSite.name}</List.Header>
        </List.Item>
        </Grid.Column>
      )
    }) : (<h1>Holi</h1>);
    return (
      <div>
        <Switch>
          <Route exact path="/ws-:_id" component={ WorkingSiteView }/>
          <Route exact path="/pres-:_id" component={ PresentationView }/>
        </Switch>
        <Container text style={{marginTop: '100px'}}>
        <Grid columns={3} textAling={"centered"} verticalAling={"middle"}>
          {visible ? wsLinks: null}
        </Grid>
        </Container>
      </div>
    )

  }
}