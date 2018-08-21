import React, {Component} from 'react';
import { Document, Page } from 'react-pdf';

export default class PDFView extends Component {
  constructor(props){
    super(props)
    this.state = {
      numPages: null,
      pageNumber: 1,
      time: this.props.time,
      play: true,
      timeouts: []
    };
  }
	

	onDocumentLoadSuccess = ({numPages}) => {
    this.setState({ numPages: numPages });
  

  }

  onPageLoadSuccess = ({pageNumber}) => {

    const {numPages, play, time, timeouts} = this.state;
    const timeout = time > 0 ? time : 6;
    timeouts.push(setTimeout( () => {this.setState({pageNumber: ((pageNumber) < numPages) && play  ? pageNumber + 1 : 1 })}, timeout*1000));
  }

  componentWillUnmount() {
    const {timeouts} = this.state;
    clearTimeout(timeouts[0]);
  }

  render() {
    
    return (
      <div style={this.props.style}>
        <Document
          file =  {this.props.file}
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