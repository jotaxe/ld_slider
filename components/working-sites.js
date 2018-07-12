import React, { Component } from 'react';

import '../App.css';
import { Link, Route, Switch } from 'react-router-dom';
import PresentationView from "./presentations";
import {Button, List, Icon, Grid, Container} from "semantic-ui-react";

export default class WorkingSiteView extends Component {
  constructor(props){
    super(props)
    this.state = {
      pres: [],
      visible: true,
      path: undefined
    }
  }

  componentWillMount() {

    const {match: {params, path} } = this.props;
    console.log(this.props.match)
    const vis = path !== "pres-:_id";
   
    var req = new XMLHttpRequest();
    req.open('GET', 'http://192.168.0.4:3030/presentations/?belongs_to=' + params._id, null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    this.setState({pres: reqJSON.data, visible: vis});
  }

  componentWillUnmount(){
    this.setState({visible: false})
  }
  changeVisible = () => {
    this.setState({visible: false})    
  }
  render(){
    const {pres, visible} = this.state
    const presLinks = pres.map( (presentation) => {
      return (
        <Grid.Column>
        <List.Item key = {presentation._id}>
          <Link to = {"/pres-" + presentation._id}>
            <Button size="massive" color="blue" circular icon='file powerpoint' onClick={this.changeVisible}>
            </Button>
          </Link>
          <List.Header>{presentation.name}</List.Header>
        </List.Item>
        </Grid.Column>
      )
    });
    return (
      <div>
        <Switch>
          <Route exact path="/pres/:_id" component={ PresentationView }/>
        </Switch>
        <Container text style={{marginTop: '100px'}}>
        <Grid columns={3} textAling={"centered"} verticalAling={"middle"}>
          {visible ? presLinks: null}
        </Grid>
        </Container>
      </div>
    )

  }
}