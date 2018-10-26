import React, { Component } from 'react'

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
  
import "./deck.css"
  
import createTheme from "spectacle/lib/themes/default";
  
import PDFView from "./pdf";
import ChartView from "./chart";
  

const theme = createTheme({
    primary: "white",
    secondary: "#1F2022",
    tertiary: "#03A9FC",
    quarternary: "#CECECE"
});


export default class Slides extends Component {

    constructor(props){
        super(props);
        this.state = {
            slides: this.props.slides,
            timeouts: []
        }
    }

    componentWillUnmount() {
        const {timeouts} = this.state;
        clearTimeout(timeouts[0]);
    }

    render() {
        const {slides, timeouts} = this.state;

        const size = slides.length - 1;
        const sli = slides.map( (slide) => {
            const sProps = slide.props;
            const bgColor = sProps.style ? sProps.style.backgroundColor : "white";
            const bgImage = sProps.style ? sProps.style.backgroundImage : null;
            const transition = sProps.transition ? sProps.transition : ["slide"];
        
            return slide.children ? (
                
                <Slide 
                key={slide.id}
                transition={transition} 
                bgColor={bgColor} 
                bgImage={bgImage} 
                onActive={ (indx) => { 
                    timeouts.push(
                    setTimeout(
                        function() {
                            window.location.hash = "/"+ (indx >= size ? 0 : indx + 1);
                        }, (sProps.time > 0 ? sProps.time*1000 : 5000)
                    )
                    ); 
                } } 
                >
                <div className={"home-wrapper"} style={{height: 30, width: 30, top: 0, left: 0}}>
                    <a className={"home-button"} href="/">Inicio</a>
                </div>
                {
                    slide.children.map( (element, index) =>{
                        switch(element.type){
                            case "Text":
                                return <Heading key={index} textFont = {element.props.style.fontFamily} {...element.props}> {element.children || element.defaultText[0]} </Heading>
                            case "Video":
                                return <iframe key={index} {...element.props}/>
                            case "Image":
                                return <Image key={index} {...element.props} />
                            case "PDF":
                                return <PDFView key={index} {...element.props}/>
                            case "WENUWORK":
                                return <ChartView key={index} {...element.props} />
                        }
                    })
                }
            
                </Slide>
            ) : (<Slide />)
        });
        return (
            <Deck transition={["slide"]} transitionDuration={2000} controls={false} theme={theme} contentHeight={720} contentWidth={1280}>
              {sli}
            </Deck>
        )
    }
}
