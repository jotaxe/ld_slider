
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

import createTheme from "spectacle/lib/themes/default";



const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quarternary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default function Pres({slides}){
	const sli = slides.map( (slide) => {
		const sProps = slide.props;
		const bgColor = sProps.style ? sProps.style.backgroundColor : "white"; 
		const bgImage = sProps.backgroundImage ? sProps.backgroundImage : null;
		const transition = sProps.transition ? sProps.transition : ["slide"]; 
		console.log("Slide " + slide.id + ":",sProps)
		return slide.children ? (
			
			<Slide key={slide.id} transition={transition} bgColor={bgColor} bgImage={bgImage}>
				{
					slide.children.map( (element) =>{
						switch(element.type){
                      		case "Text":
                        		return <Heading {...element.props}> {element.children} </Heading> 
                      		case "Video":
                        		return <iframe {...element.props}/>
                      		case "Image":
                        		return <Image {...element.props} />
                    	}
                	})
                }
			</Slide>
		) : (<Slide />)
	} );
	return (
        <Deck transition={["slide"]} transitionDuration={500} controls={false} autoplay={false} autoplayDuration={3000} theme={theme}>
        	{sli}
        </Deck>
    )
}