import React, { Component } from 'react';
import '../App.css';
import { Link, Route, Switch } from 'react-router-dom';
import WorkingSiteView from "./working-sites";
import PresentationView from "./presentations";
import {Button, Grid, Container, Card, Header} from "semantic-ui-react";
import {domain, port, fetchAllWs} from "./api";
import {getAccesToken} from "../components/wenuwork"

export default class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      ws: []
    }
  }

  componentWillMount() {
    getAccesToken();
    const reqJSON = fetchAllWs(domain, port);
    this.setState({ws: reqJSON.data});
  }

  render(){
    const {ws} = this.state
    const wsLinks = ws ? ws.map( (workingSite) => {
      return (
        <Grid.Column key={workingSite._id}>
          <Card>
            <Card.Content>
              <Card.Header>{workingSite.name}</Card.Header>
              <Card.Meta>Archivos ({workingSite.presentations.length})</Card.Meta>
              <Card.Description>Obra.</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div>
                <Link to = {"/ws-" + workingSite._id}>
                  <Button basic color="green">
                    Abrir
                  </Button>
                </Link>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      )
    }) : (<h1>Holi</h1>);
    return (
      <div>
          <Container text style={{marginTop: '100px'}}>
            <Header as={"h1"} > Obras </Header>
            <Grid columns={3} > 
              {wsLinks || null}
            </Grid>
          </Container>
      
      </div>
    )

  }
}