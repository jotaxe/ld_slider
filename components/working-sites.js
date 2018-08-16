import React, { Component } from 'react';

import '../App.css';
import { Link, Route, Switch } from 'react-router-dom';
import PresentationView from "./presentations";
import {Button, List, Icon, Grid, Container, Card, Header} from "semantic-ui-react";
import {domain, port, fetchPresFromWs} from "./api";

function formatDate(str){
  const date = new Date(str)
  return "" + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
}

export default class WorkingSiteView extends Component {
  constructor(props){
    super(props)
    this.state = {
      pres: []
    }
  }

  componentWillMount() {

    const {match: {params} } = this.props;
    const reqJSON = fetchPresFromWs(domain, port, params)
    this.setState({pres: reqJSON.data});
  }


  render(){
    const {pres} = this.state
    const presLinks = pres.map( (presentation) => {
      return (
        <Grid.Column key={presentation._id}>
          
          <Card>
            <Card.Content>
              <Card.Header>{presentation.name}</Card.Header>
              <Card.Meta>Tamaño ({parseInt(JSON.stringify(presentation.presentation_file).length / 1000)} KB)</Card.Meta>
              <Card.Description>Fecha {formatDate(presentation.createdAt)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to = {"/pres-" + presentation._id}>
                  <Button basic color="green">
                    Reproducir
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>

        </Grid.Column>
      )
    });
    return (
      <div>
        <Container text style={{marginTop: '100px'}}>
          <Header as={"h1"}  > Presentaciones </Header>
          <Grid columns={3} >
            {presLinks || null}
          </Grid>
        </Container>
      </div>
    )

  }
}