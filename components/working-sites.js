import React, { Component } from 'react';

import '../App.css';
import { Link, Route, Switch } from 'react-router-dom';
import PresentationView from "./presentations";
import {Button, List, Icon, Grid, Container} from "semantic-ui-react";

export default class WorkingSiteView extends Component {
  constructor(props){
    super(props)
    this.state = {
      pres: []
    }
  }

  componentWillMount() {

    const {match: {params} } = this.props;
    var req = new XMLHttpRequest();
    req.open('GET', 'http://167.99.202.59:3030/presentations/?belongs_to=' + params._id, null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    this.setState({pres: reqJSON.data});
  }


  render(){
    const {pres} = this.state
    const presLinks = pres.map( (presentation) => {
      return (
        <Grid.Column>
        <List.Item key = {presentation._id}>
          <Link to = {"/pres-" + presentation._id}>
            <Button size="massive" color="blue" circular icon='file powerpoint'>
            </Button>
          </Link>
          <List.Header>{presentation.name}</List.Header>
        </List.Item>
        </Grid.Column>
      )
    });
    return (
      <div>
        <Container text style={{marginTop: '100px'}}>
          <Grid columns={3} textAling={"centered"} verticalAling={"middle"}>
            {presLinks || null}
          </Grid>
        </Container>
      </div>
    )

  }
}