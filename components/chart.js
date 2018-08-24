import React, {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, LabelList} from "recharts";
import {getAccesToken, getMonthlyStats, getWeeklyStats} from "./wenuwork";

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
			comparePeriod: "monthly",
			sensors: this.props.sensor,
			currentSensorsData: undefined,
			barColor: this.props.barColor,
			dataKey: this.props.dataKey
		}
	}



	componentWillMount(){
		const aToken = localStorage.getItem("access_token");
		aToken ? null : getAccesToken();
		
	}


	shouldComponentUpdate(nextProps){
		const {currentSensorsData} = this.state;
		return (this.props.sensors != nextProps.sensors) || (currentSensorsData === undefined);
	}

	componentDidMount(){
		let sData;
		const {period} = this.props;
		if(period === "mensual"){
			sData = getMonthlyStats(this.props.sensors);
		}else if (period === "semanal"){
			sData = getWeeklyStats(this.props.sensors);
		}
		this.setState({currentSensorsData: sData});
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
		const {currentSensorsData, barColor, dataKey} = this.state;
		return (
			<div style={this.props.style}>
				<BarChart width={this.props.style.width || 450} height={this.props.style.width || 400} data={currentSensorsData || defaultData}>
         			<XAxis dataKey='name'/>
         			<YAxis/>
         			<Bar dataKey={dataKey} fill={barColor}>
						<LabelList dataKey={dataKey} position="center" content={this.contentVal}/>
					</Bar>
       			</BarChart>
       		</div>
		)
	}
}