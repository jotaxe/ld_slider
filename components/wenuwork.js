
export const domain = "https://api.wenuwork.cl/api/";

const dayMap = [
	"Domingo", 
	"Lunes", 
	"Martes", 
	"Miercoles", 
	"Jueves", 
	"Viernes", 
	"Sabado"
];

const monthMap = [
	"Enero", 
	"Febrero", 
	"Marzo", 
	"Abril", 
	"Mayo", 
	"Junio", 
	"Julio", 
	"Agosto", 
	"Septiembre", 
	"Octubre", 
	"Noviembre", 
	"Diciembre"
]

export function getAccesToken(){
	var data = JSON.stringify({
	  "username": "ld@wenuwork.com",
	  "password": "factory5855",
	  "client_id": "4cjRwBsGuwRUOjbwhZKq",
	  "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c",
	  "grant_type": "client_credentials"
	});
	
	var xhr = new XMLHttpRequest();

	
	xhr.open("POST", "https://api.wenuwork.cl/api/auth/oauth/token", false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	const reqJSON = JSON.parse(xhr.responseText);
	localStorage.setItem("access_token", reqJSON.access_token);
	localStorage.setItem("refresh_token", reqJSON.refresh_token);


}

export function getRefreshToken(){
	const rToken = localStorage.getItem("refresh_token");
	var data = JSON.stringify({
	  "grant_type": "refresh_token",
	  "refresh_token": rToken,
	  "client_id": "4cjRwBsGuwRUOjbwhZKq",
	  "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c"
	});
	
	var xhr = new XMLHttpRequest();


	xhr.open("POST", "https://api.wenuwork.cl/api/auth/oauth/token", false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	const reqJSON = JSON.parse(xhr.responseText);
	localStorage.setItem("access_token", reqJSON.access_token);
	localStorage.setItem("refresh_token", reqJSON.refresh_token);
}

export function getMeters(){
	const aToken = localStorage.getItem("access_token");
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	
	
	xhr.open("GET", "https://api.wenuwork.cl/api/companies/5995a9711bf1469ec8b6612c", false);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Bearer " + aToken);
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	const reqJSON = JSON.parse(xhr.responseText);
	const status = JSON.parse(xhr.status);
	
	return {reqJSON, status};
}

export function getMeterStats(meter, period){
	const aToken = localStorage.getItem("access_token");
	var data = null;

	var xhr = new XMLHttpRequest();
	
	var ret = null;
	
	xhr.open("GET", "https://api.wenuwork.cl/api/meters/"+meter+"/stats?type=" + period, null);
	xhr.setRequestHeader("Authorization", "Bearer " + aToken);
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.onreadystatechange = function () {
		if(xhr.readyState == 4){
			if(xhr.status == 401){
				ret = {data: null, status: 401}
			}
			if(xhr.status == 200){
				localStorage.setItem("last_data_" + meter, xhr.responseText)
			}
			if(xhr.status == 429){
				const lastData = localStorage.getItem("last_data_" + meter)
				ret = {data: JSON.parse(lastData), status: 429}
				console.log("Too many request")
			}
		}
	}

	xhr.send(data);
	return ret ? ret : {data: JSON.parse(xhr.responseText), status: xhr.status}
}

export function getWeeklyStats(sensors){
	const aToken = localStorage.getItem("access_token");
	var today = new Date();
	var lastWeek = today - 6.048e+8;
	lastWeek = new Date(lastWeek);
	const lastWeekDay = lastWeek.getDate();
	const thisWeekDay = today.getDate();
	const weekDay = dayMap[today.getDay()]
	var currentEnergy = 0;
	var currentExpent = 0;
	var currentCo2 = 0;
	var prevEnergy = 0;
	var prevExpent = 0;
	var prevCo2 = 0;
	sensors ? sensors.forEach( (sensor) => {
		let stats = aToken ? getMeterStats(sensor, "monthly") : null;
		if(stats.status === 401){
			getRefreshToken();
			stats = getMeterStats(sensor, "monthly");
		}


		if (lastWeekDay > thisWeekDay) {
						
			prevEnergy +=  stats.data.prev.readings[lastWeekDay].ep1;
			prevExpent +=  stats.data.prev.readings[lastWeekDay].expent ;
			prevCo2 += stats.data.prev.readings[lastWeekDay].co2;
						
			currentEnergy += stats.data.current.readings[thisWeekDay].ep1;
			currentExpent += stats.data.current.readings[thisWeekDay].expent;
			currentCo2 += stats.data.current.readings[thisWeekDay].co2;

		} else {
					
			prevEnergy += stats.data.current.readings[lastWeekDay].ep1, 
			prevExpent += stats.data.current.readings[lastWeekDay].expent, 
			prevCo2 += stats.data.current.readings[lastWeekDay].co2
						
			currentEnergy += stats.data.current.readings[thisWeekDay].ep1,
			currentExpent += stats.data.current.readings[thisWeekDay].expent,
			currentCo2 += stats.data.current.readings[thisWeekDay].co2
					
		}

	}) : null;
	const sensData = [
		{
			name: weekDay + " Pasado", 
			energy: Math.round((prevEnergy / 1000) * 100) / 100, 
			expent: Math.round(prevExpent * 100) / 100, 
			co2: Math.round(prevCo2 * 100) / 100
		},
		{
			name: weekDay + " Actual",
			energy: Math.round((currentEnergy / 1000) * 100) / 100,
			expent: Math.round(currentExpent * 100) / 100,
			co2: Math.round(currentCo2 * 100) / 100 
		}
	]

	return sensData;
}

export function getMonthlyStats(sensors){

	const aToken = localStorage.getItem("access_token");
	
	var today = new Date();
	var monthDay = today.getMonth() + 1;
	const dayString = monthMap[monthDay - 1];
	var currentEnergy = 0;
	var currentExpent = 0;
	var currentCo2 = 0;
	var prevEnergy = 0;
	var prevExpent = 0;
	var prevCo2 = 0;
	sensors.forEach( (sensor) => {
		let stats = aToken ? getMeterStats(sensor, "annual", aToken) : null;
		if(stats.status === 401){
			getRefreshToken();
			stats = getMeterStats(sensor, "annual");
		}

						
		prevEnergy +=  stats.data.prev.readings[monthDay].ep1;
		prevExpent +=  stats.data.prev.readings[monthDay].expent ;
		prevCo2 += stats.data.prev.readings[monthDay].co2;
					
		currentEnergy += stats.data.current.readings[monthDay].ep1;
		currentExpent += stats.data.current.readings[monthDay].expent;
		currentCo2 += stats.data.current.readings[monthDay].co2;

	});
	const sensData = [
		{
			name: dayString + " Previo", 
			energy: Math.round((prevEnergy / 1000) * 100) / 100, 
			expent: Math.round(prevExpent * 100) / 100, 
			co2: Math.round(prevCo2 * 100) / 100
		},
		{
			name: dayString + " Actual",
			energy: Math.round((currentEnergy / 1000) * 100) / 100,
			expent: Math.round(currentExpent * 100) / 100,
			co2: Math.round(currentCo2 * 100) / 100 
		}
	]

	return sensData;
}