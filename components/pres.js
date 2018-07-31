
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
  var timer;
  const size = slides.length - 1;
	const sli = slides.map( (slide) => {
		const sProps = slide.props;
		const bgColor = sProps.style ? sProps.style.backgroundColor : "white";
		const bgImage = sProps.style ? sProps.style.backgroundImage : null;
    const transition = sProps.transition ? sProps.transition : ["slide"];
		return slide.children ? (
			
			<Slide  key={slide.id} transition={transition} bgColor={bgColor} bgImage={bgImage} onActive={ (indx) => {clearTimeout(timer); timer = setTimeout(function() {window.location.href = "#/"+ (indx >= size ? 0 : indx + 1) }, (sProps.time > 0 ? sProps.time*1000 : 5000));} } >
				<div className={"home-wrapper"} style={{height: 30, width: 30}}>
          <a className={"home-button"} href="/">Inicio</a>

        </div>
        {
					slide.children.map( (element) =>{
						switch(element.type){
                      		case "Text":
                        		return <Heading {...element.props}> {element.children || element.defaultText[0]} </Heading>
                      		case "Video":
                        		return <iframe {...element.props}/>
                      		case "Image":
                        		return <Image {...element.props} />
                          case "PDF":
                            return <PDFView {...element.props}/>
                          case "WENUWORK":
                            return <ChartView {...element.props} />

                    	}
                	})
                }
			</Slide>
		) : (<Slide />)
	} );
	return (
        <Deck transition={["slide"]} transitionDuration={1000} controls={false} theme={theme} contentHeight={720} contentWidth={1280}>
        	
          {sli}
        </Deck>
    )
}