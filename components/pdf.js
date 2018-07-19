import React, {Component} from 'react';
import { Document, Page } from 'react-pdf';

export default class PDFView extends Component {
  constructor(props){
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      time: this.props.time,
      play: true
    };
  }
	

	onDocumentLoadSuccess = ({numPages}) => {
    this.setState({ numPages: numPages });
  

  }

  onPageLoadSuccess = ({pageNumber}) => {

    const {numPages, play, time} = this.state;
    const timeout = time > 6000 ? time : 6000;
    setTimeout( () => {this.setState({pageNumber: ((pageNumber) < numPages) && play  ? pageNumber + 1 : 1 })}, timeout);
  }


  render() {
    
    return (
      <div style={this.props.style}>
        <Document
          file = {this.props.file}
          onLoadSuccess = {this.onDocumentLoadSuccess}
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