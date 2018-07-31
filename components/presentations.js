
// Import React
import React from "react";

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Image,
  Text
} from "spectacle";
import {Button, Icon, Grid, Container} from "semantic-ui-react";
import {domain, port, fetchPres} from "./api";





import Pres from "./pres";

// Require CSS
require("normalize.css");
require("./index.css");



export default class Presentation extends React.Component {

    constructor(props) {
      super(props)
      this.state ={
        slides:  Array(4).fill(<Slide key="loading" />),
        
    }
  }

  componentWillMount(){
    const {match: {params} } = this.props;
    const reqJSON = fetchPres(domain, port, params)
    this.setState({slides: reqJSON.presentation_file.slides})
    
  }



  render() {
    const {slides} = this.state
    return slides.length ? (<Pres slides= {slides}/>): (<span>Loading...</span>)
  }
}