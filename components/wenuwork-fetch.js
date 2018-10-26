
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

export function getAccessToken(){
    return fetch(domain + "auth/oauth/token", {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
           'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
            "username": "ld@wenuwork.com",
            "password": "factory5855",
            "client_id": "4cjRwBsGuwRUOjbwhZKq",
            "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c",
            "grant_type": "client_credentials"
        })
    }).then((res) => {
		res.json().then((res) => {
			localStorage.setItem("access_token", res.access_token);
			localStorage.setItem("refresh_token", res.refresh_token);
		})
    });
}

export function getRefreshToken(){
	const rToken = localStorage.getItem("refresh_token");
	return fetch(domain + "auth/oauth/token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'           
        },
        body: JSON.stringify({
            "grant_type": "refresh_token",
            "refresh_token": rToken,
            "client_id": "4cjRwBsGuwRUOjbwhZKq",
            "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c"
        })
    }).then( (res) => {
        res.json().then((res) => {
			localStorage.setItem("access_token", res.access_token);
			localStorage.setItem("refresh_token", res.refresh_token);
		});
    });
}


export function getMeters(){
	const aToken = localStorage.getItem("access_token");
	return fetch(domain + "companies/5995a9711bf1469ec8b6612c", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + aToken,
            'Cache-Control': 'no-cache'
        }
    }).then((res) => {
		if(res.status == 200){
			return res.json().then((res) => {
				return res;
			});
		}else if(res.status == 401){
			return getAccessToken().then( () => {
				return getMeters();
			})
		}
    });
}


export function getMeterStats(meter, period){
	const aToken = localStorage.getItem("access_token");
	return fetch(domain + "meters/" + meter + "/stats?type=" + period, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + aToken,
        }
    }).then((res) => {
		if(res.status == 401){
			getRefreshToken().then(() => {
				return getMeterStats(meter, period);
			});
		}else if(res.status == 200){
			return res.json().then((res) => {
				localStorage.setItem("last_data_" + meter, res);
				return res;
			});
		} else if(res.status == 429){
			const lastData = localStorage.getItem("last_data_" + meter)
			return {data: JSON.parse(lastData), status: 429}
		}
        
    });
}

export async function getWeeklyStats(sensors){
	var today = new Date();
	var lastWeek = today - 6.048e+8;
	lastWeek = new Date(lastWeek);
	const lastWeekMonth = lastWeek.getMonth() + 1;
	const thisWeekMonth = today.getMonth() + 1;
	const lastWeekDay = lastWeek.getDate();
	const thisWeekDay = today.getDate();
	const lastWeekDate = lastWeekDay + "/" + lastWeekMonth;
	const thisWeekDate = thisWeekDay + "/" + thisWeekMonth;
	var currentEnergy = 0;
	var currentExpent = 0;
	var currentCo2 = 0;
	var prevEnergy = 0;
	var prevExpent = 0;
	var prevCo2 = 0;
	await Promise.all(sensors.map( async (sensor) => {
		
		let stats = await getMeterStats(sensor, "monthly");
		if (lastWeekDay > thisWeekDay) {
						
			prevEnergy +=  stats.prev.readings[lastWeekDay].ep1;
			prevExpent +=  stats.prev.readings[lastWeekDay].expent ;
			prevCo2 += stats.prev.readings[lastWeekDay].co2;
							
			currentEnergy += stats.current.readings[thisWeekDay].ep1;
			currentExpent += stats.current.readings[thisWeekDay].expent;
			currentCo2 += stats.current.readings[thisWeekDay].co2;
	
		} else {
						
			prevEnergy += stats.current.readings[lastWeekDay].ep1, 
			prevExpent += stats.current.readings[lastWeekDay].expent, 
			prevCo2 += stats.current.readings[lastWeekDay].co2
							
			currentEnergy += stats.current.readings[thisWeekDay].ep1,
			currentExpent += stats.current.readings[thisWeekDay].expent,
			currentCo2 += stats.current.readings[thisWeekDay].co2
						
		}
	})
	);
	const sensData = [
		{
			name: lastWeekDate, 
			energy: Math.round((prevEnergy / 1000) * 100) / 100, 
			expent: Math.round(prevExpent * 100) / 100, 
			co2: Math.round(prevCo2 * 100) / 100
		},
		{
			name: thisWeekDate,
			energy: Math.round((currentEnergy / 1000) * 100) / 100,
			expent: Math.round(currentExpent * 100) / 100,
			co2: Math.round(currentCo2 * 100) / 100 
		}
	]

	return sensData;
}

export async function getMonthlyStats(sensors){

	const aToken = localStorage.getItem("access_token");
	
	var today = new Date();
	var month = today.getMonth() + 1;
	var year = today.getFullYear();
	const todayDate = month + "/" + year;
	const lastYearDate = month + "/" + (year - 1);
	
	var currentEnergy = 0;
	var currentExpent = 0;
	var currentCo2 = 0;
	var prevEnergy = 0;
	var prevExpent = 0;
	var prevCo2 = 0;
	var sensData = [];
	await Promise.all(sensors.map( async (sensor) => {
		let stats = await getMeterStats(sensor, "annual", aToken);
		prevEnergy +=  stats.prev.readings[month].ep1;
		prevExpent +=  stats.prev.readings[month].expent ;
		prevCo2 += stats.prev.readings[month].co2;
						
		currentEnergy +=  stats.current.readings[month].ep1;
		currentExpent +=  stats.current.readings[month].expent;
		currentCo2 +=  stats.current.readings[month].co2;
		sensData = [
			{
				name: lastYearDate, 
				energy: Math.round((prevEnergy / 1000) * 100) / 100, 
				expent: Math.round(prevExpent * 100) / 100, 
				co2: Math.round(prevCo2 * 100) / 100
			},
			{
				name: todayDate,
				energy: Math.round((currentEnergy / 1000) * 100) / 100,
				expent: Math.round(currentExpent * 100) / 100,
				co2: Math.round(currentCo2 * 100) / 100 
			}
		]
	})
	).catch((e) => {console.log(e);})
	return  sensData;
	
}