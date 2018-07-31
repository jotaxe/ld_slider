import React, {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import {getAccesToken, getRefreshToken, getMeters, getMeterStats} from "./wenuwork";

const defaultData = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

export default class ChartView extends Component{
	constructor(props){
		super(props);
		this.state={
			comparePeriod: "daily",
			sensors: this.props.sensor,
			currentSensorsData: undefined,
			barColor: this.props.barColor,
			accessToken: undefined,
			refreshToken: undefined
		}
	}



	componentWillMount(){
		const accesReq = getAccesToken();
		const acTk = accesReq.access_token; 
		const rfsTk = accesReq.refresh_token;
		this.setState({accessToken: acTk, refreshToken: rfsTk});
	}


	shouldComponentUpdate(nextProps){
		const {currentSensorsData, shouldRefresh} = this.state;
		return (this.props.sensors != nextProps.sensors) || (currentSensorsData === undefined);
	}

	componentDidMount(){
		const {accessToken, comparePeriod, refreshToken} = this.state;
		var today = new Date();
		var lastWeek = today - 6.048e+8;
		lastWeek = new Date(lastWeek);
		const lastWeekDay = lastWeek.getDate();
		const thisWeekDay = today.getDate();
		const stats = getMeterStats(this.props.sensor, comparePeriod, accessToken);
		if (stats.status === 401) {
			const accesReq = getRefreshToken();
			const acTk = accesReq.access_token; 
			const rfsTk = accesReq.refresh_token;
			var currentEnergy = 0;
			var currentExpent = 0;
			var currentCo2 = 0;
			var prevEnergy = 0;
			var prevExpent = 0;
			var prevCo2 = 0;
			this.setState({accessToken: acTk, refreshToken: rfsTk});
			this.props.sensors.forEach( (sensor) => {
				
				const newStats = getMeterStats("66801", comparePeriod, acTk);
	
				if (lastWeekDay > thisWeekDay) {
						
					prevEnergy +=  newStats.data.prev.readings[lastWeekDay].ep1;
					prevExpent +=  newStats.data.prev.readings[lastWeekDay].expent ;
					prevCo2 += newStats.data.prev.readings[lastWeekDay].co2;
							
					currentEnergy += newStats.data.current.readings[thisWeekDay].ep1;
					currentExpent += newStats.data.current.readings[thisWeekDay].expent;
					currentCo2 += newStats.data.current.readings[thisWeekDay].co2;
	
				} else {
					
					prevEnergy = newStats.data.current.readings[lastWeekDay].ep1, 
					prevExpent = newStats.data.current.readings[lastWeekDay].expent, 
					prevCo2 = newStats.data.current.readings[lastWeekDay].co2
						
					currentEnergy = newStats.data.current.readings[thisWeekDay].ep1,
					currentExpent = newStats.data.current.readings[thisWeekDay].expent,
					currentCo2 = newStats.data.current.readings[thisWeekDay].co2
					
				}
	
				const sensData = [
						{
							name: "Previa", 
							energy: prevEnergy / 1000, 
							expent: prevExpent, 
							co2: prevCo2
						},
						{
							name: "Actual",
							energy: currentEnergy / 1000,
							expent: currentExpent,
							co2: currentCo2
						}
					]
				
				this.setState({currentSensorsData: sensData});
			});

		} else {
			
			var currentEnergy = 0;
			var currentExpent = 0;
			var currentCo2 = 0;
			var prevEnergy = 0;
			var prevExpent = 0;
			var prevCo2 = 0;
			console.log(this.props.sensors);
			this.props.sensors.forEach( (sensor) => {

				const newStats = getMeterStats(sensor, comparePeriod, accessToken);
					
				if (lastWeekDay > thisWeekDay) {
						
					prevEnergy +=  newStats.data.prev.readings[lastWeekDay].ep1;
					prevExpent +=  newStats.data.prev.readings[lastWeekDay].expent ;
					prevCo2 += newStats.data.prev.readings[lastWeekDay].co2;
							
					currentEnergy += newStats.data.current.readings[thisWeekDay].ep1;
					currentExpent += newStats.data.current.readings[thisWeekDay].expent;
					currentCo2 += newStats.data.current.readings[thisWeekDay].co2;
	
				} else {
					
					prevEnergy = newStats.data.current.readings[lastWeekDay].ep1, 
					prevExpent = newStats.data.current.readings[lastWeekDay].expent, 
					prevCo2 = newStats.data.current.readings[lastWeekDay].co2
						
					currentEnergy = newStats.data.current.readings[thisWeekDay].ep1,
					currentExpent = newStats.data.current.readings[thisWeekDay].expent,
					currentCo2 = newStats.data.current.readings[thisWeekDay].co2
					
				}
	
				const sensData = [
						{
							name: "Previa", 
							energy: prevEnergy / 1000, 
							expent: prevExpent, 
							co2: prevCo2
						},
						{
							name: "Actual",
							energy: currentEnergy / 1000,
							expent: currentExpent,
							co2: currentCo2
						}
					]
				
				this.setState({currentSensorsData: sensData});
			});
		}
	}

	render(){
		const {currentSensorsData, barColor} = this.state;
		return (
			<div style={this.props.style}>
				<BarChart width={this.props.style.width || 450} height={this.props.style.width || 400} data={currentSensorsData || defaultData}>
         			<XAxis dataKey='name'/>
         			<YAxis/>
         			<Bar dataKey='energy' fill='#8884d8'/>
       			</BarChart>
       		</div>
		)
	}
}