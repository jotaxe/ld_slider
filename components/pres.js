
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

var time = 5000;

export default function Pres({slides}){
  const size = slides.length - 1;
	const sli = slides.map( (slide) => {
		const sProps = slide.props;
		const bgColor = sProps.style ? sProps.style.backgroundColor : "white";
		const bgImage = sProps.style ? sProps.style.backgroundImage : null;
    const transition = sProps.transition ? sProps.transition : ["slide"];
    var timer =[];
		return slide.children ? (
			
			<Slide  key={slide.id} transition={transition} bgColor={bgColor} bgImage={bgImage} onActive={ 
        (indx) => { 
          timer.push(
            setTimeout(
              function() {
                clearTimeout(timer);
                window.location.hash = "/"+ (indx >= size ? 0 : indx + 1);
              }, (sProps.time > 0 ? sProps.time*1000 : 5000)
            )
          ); 
        } 
        } 
      >
				<div className={"home-wrapper"} style={{height: 30, width: 30}}>
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
	} );
	return (
        <Deck transition={["slide"]} transitionDuration={2000} controls={false} theme={theme} contentHeight={720} contentWidth={1280}>
          {sli}
        </Deck>
    )
}
