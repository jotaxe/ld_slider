
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
    var req = new XMLHttpRequest();
    req.open('GET', 'http://167.99.202.59:3030/presentations/' + params._id, null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    this.setState({slides: reqJSON.presentation_file.slides})
    console.log(reqJSON)
    
  }



  render() {
    const {slides} = this.state
    return slides.length ? (<Pres slides= {slides}/>): (<span>Loading...</span>)
  }
}