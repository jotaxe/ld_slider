
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
	
	
	xhr.open("POST", "https://api.wenuwork.cl/api/auth/oauth/token", null);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);

	xhr.onreadystatechange = function () {
		if(xhr.status === 401 ){
			console.log("desautorizado");
			return {data: null, status: 401};
		}
	}

	const reqJSON = JSON.parse(xhr.responseText);
	return reqJSON;


}

export function getRefreshToken(rToken){
	var data = JSON.stringify({
	  "grant_type": "refresh_token",
	  "refresh_token": rToken,
	  "client_id": "4cjRwBsGuwRUOjbwhZKq",
	  "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c"
	});
	
	var xhr = new XMLHttpRequest();
	

	xhr.open("POST", "https://api.wenuwork.cl/api/auth/oauth/token", null);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	const reqJSON = JSON.parse(xhr.responseText);
	return reqJSON;
}

export function getMeters( aToken){
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	
	
	xhr.open("GET", "https://api.wenuwork.cl/api/companies/5995a9711bf1469ec8b6612c", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Bearer " + aToken);
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	const reqJSON = JSON.parse(xhr.responseText);
	const status = JSON.parse(xhr.status);
	
	return {reqJSON, status};
}

export function getMeterStats(meter, period, aToken){
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
		}
	}

	xhr.send(data);
	return ret ? ret : {data: JSON.parse(xhr.responseText), status: xhr.status}
}

export function getWeeklyStats(sensors, aToken, rToken){
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
		let stats = aToken ? getMeterStats(sensor, "monthly", aToken) : null;
		if(stats.status === 401){
			const refreshReq = getRefreshToken(rToken);
			localStorage.setItem("access_token", refreshReq.access_token);
			localStorage.setItem("refresh_token", refreshReq.refresh_token);
			stats = getMeterStats(sensor, "monthly", refreshreq.access_token);
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

export function getMonthlyStats(sensors, aToken, rToken){
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
			const refreshReq = getRefreshToken(rToken);
			localStorage.setItem("access_token", refreshReq.access_token);
			localStorage.setItem("refresh_token", refreshReq.refresh_token);
			stats = getMeterStats(sensor, "annual", refreshreq.access_token);
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
