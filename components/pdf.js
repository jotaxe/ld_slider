import React, {Component} from 'react';
import { Document, Page } from 'react-pdf';

import {ClipLoader} from "halogenium";

import revista from "../assets/pdf/placeholder.pdf"


export default class PDFView extends Component {
  constructor(props){
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      time: this.props.time,
      play: true,
      fetchedFile: revista,
      prevFile: this.props.file,
      loadingFile: true,
      timeouts: []
    };
  }

  


    
	

	onDocumentLoadSuccess = ({numPages}) => {
    this.setState({ numPages: numPages });
  

  }

  onPageLoadSuccess = ({pageNumber}) => {

    const {numPages, play, time, timeouts} = this.state;
    const timeout = time > 6 ? time : 6;
    timeouts.push(setTimeout( () => {this.setState({pageNumber: ((pageNumber) < numPages) && play  ? pageNumber + 1 : 1 })}, timeout*1000));
  }

  componentDidUpdate(prevProps) {
    if(!(this.props.file === prevProps.file)){
      fetch("http://167.99.202.59:3030/pdf/" + this.props.file)
      .then((response) => response.json()
      .then((data) => {this.setState({
        fetchedFile: data.uri,
        loadingFile: false,
      })}));
    }
  }

  componentDidMount(){
    fetch("http://167.99.202.59:3030/pdf/" + this.props.file)
      .then((response) => response.json()
      .then((data) => {this.setState({
        fetchedFile: data.uri,
        loadingFile: false
      })}));
  }

  componentWillUnmount(){
    const {timeouts} = this.state;
    clearTimeout(timeouts[0]);
  }

  render() {
    const {loadingFile} = this.state;
    const loadingScreen = (<div style={this.props.style}><ClipLoader color={'#4DAF7C'}/></div>)
    return loadingFile ? loadingScreen : (
      <div style={this.props.style}>
        <Document
          file = {this.state.fetchedFile}
          onLoadSuccess = {this.onDocumentLoadSuccess}
          loading = {loadingScreen}
        >
          <Page
            pageNumber = {this.state.pageNumber}
            onLoadSuccess = {this.onPageLoadSuccess}
            heigth = {this.props.style.heigth}
            width = {this.props.style.width}
          />
        </Document>
      </div>
    )
  }
}