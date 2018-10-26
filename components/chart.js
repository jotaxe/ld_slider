import React, {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, LabelList} from "recharts";
import {getAccessToken, getMonthlyStats, getWeeklyStats} from "./wenuwork-fetch";

import { ClipLoader } from "halogenium";

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


export default class ChartView extends Component{
	constructor(props){
		super(props);
		this.state={
			comparePeriod: this.props.period,
			sensors: this.props.sensors,
			currentSensorsData: this.props.defaultData,
			barColor: this.props.barColor,
			dataKey: this.props.dataKey,
			loadingChart: true,
		}
	}



	componentWillMount(){
		const aToken = localStorage.getItem("access_token");
		aToken ? null : getAccessToken();
		
	}


	componentDidUpdate(prevProps){
		var { defaultData, barColor, dataKey, period } = this.props;
		if(defaultData != prevProps.defaultData){
			this.setState({currentSensorsData: defaultData})
		}
		if(barColor != prevProps.barColor){
			this.setState({barColor: barColor})
		}
		if(dataKey != prevProps.dataKey){
			this.setState({dataKey: dataKey})
		}
		if(period != prevProps.period){
			this.setState({comparePeriod: period})
		}
	}
	componentDidMount(){
		const {period} = this.props;
		
		if(period === "mensual"){
			getMonthlyStats(this.props.sensors).then((sData) => {
				this.setState({
					currentSensorsData: sData,
					loadingChart: false,
				})
			});

		}else if (period === "semanal"){
			getWeeklyStats(this.props.sensors).then((sData) => {
				this.setState({
					currentSensorsData: sData,
					loadingChart: false,
				});
			});
		}
	}

	contentVal = (props) => {
		const {dataKey} = this.state;
		switch(dataKey){
			case "energy":
				return props.value + " KW";
			case "co2":
				return props.value + " Kg";
			case "expent":
				return "$ " + props.value
		}
	}

	render(){
		const {barColor, dataKey, loadingChart } = this.state;
		return loadingChart ? (<div style={this.props.style}><ClipLoader color={'#4DAF7C'}/></div>) : (

				<BarChart style={this.props.style} width={this.props.style.width || 450} height={this.props.style.width || 400} data={this.state.currentSensorsData}>
         			<XAxis dataKey='name'/>
         			<YAxis/>
         			<Bar dataKey={dataKey} fill={barColor}>
						<LabelList dataKey={dataKey} position="center" content={this.contentVal}/>
					</Bar>
       			</BarChart>
       		
		)
	}
}