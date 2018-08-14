export const domain = "167.99.202.59";//"167.99.202.59:3030";
export const port = "3030";

export function fetchAllWs(domain, port){
	var req = new XMLHttpRequest();
    req.open('GET', 'http://'+domain+':'+port+'/working-sites/', null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    return reqJSON;
}

export function fetchPresFromWs(domain, port, params){
	var req = new XMLHttpRequest();
    req.open('GET', 'http://'+domain+':'+port+'/presentations/?belongs_to=' + params._id, null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    return reqJSON;
}

export function fetchPres(domain, port, params){
	var req = new XMLHttpRequest();
    req.open('GET', 'http://'+domain+':'+port+'/presentations/' + params._id, null);
    req.send(null);
    const reqJSON = JSON.parse(req.responseText);
    return reqJSON;
}
