
export const domain = "https://api.wenuwork.cl/api/";

export function getAccesToken(){
	var data = JSON.stringify({
	  "username": "ld@wenuwork.com",
	  "password": "factory5855",
	  "client_id": "4cjRwBsGuwRUOjbwhZKq",
	  "client_secret": "94947542-6a54-43e9-1efd-73fa77ad099c",
	  "grant_type": "client_credentials"
	});
	
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = false;
	
	xhr.open("POST", "https://api.wenuwork.cl/api/auth/oauth/token", null);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
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
	xhr.withCredentials = false;

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
	xhr.withCredentials = false;
	
	
	xhr.open("GET", "https://api.wenuwork.cl/api/companies/5995a9711bf1469ec8b6612c", null);
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
	xhr.withCredentials = false;
	
	xhr.open("GET", "https://api.wenuwork.cl/api/meters/"+meter+"/stats?type=monthly", null);
	xhr.setRequestHeader("Authorization", "Bearer " + aToken);
	xhr.setRequestHeader("Cache-Control", "no-cache");
	
	xhr.send(data);
	
	return {data: JSON.parse(xhr.responseText), status: xhr.status}
}