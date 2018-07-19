import React, { Component } from 'react';
import '../App.css';
import { Link, Route, Switch } from 'react-router-dom';
import WorkingSiteView from "./working-sites";
import PresentationView from "./presentations";
import {Button, List, Icon, Grid, Container} from "semantic-ui-react";

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      ws: [],
      visible: true
    }
  }

  componentWillMount() {
   
    var req = new XMLHttpRequest();
    req.open('GET', 'http://167.99.202.59:3030/working-sites/', null);
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
          <Container text style={{marginTop: '100px'}}>
            <Grid>  
              {visible ? wsLinks: null}
            </Grid>
          </Container>
      
      </div>
    )

  }
}