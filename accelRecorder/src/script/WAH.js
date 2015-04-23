/* Web App Handler
 * Makes the job of handling a webapp much easier.
 * Author:
 	Bastien Girschig
 	bastien.girschig@gmail.com
 	bastiengirschig.fr
 * see readme for how to use/buil etc...
 */
var WAH = {
	toString:{},
	toData:{},
	settings:{
		updateIntervalLength:10000,
		silentUpdate:false,
		updateBannerText: "New version available! Click here to update",
		verbose: false,
		autoStart:true
	},
	banner:undefined,
	hasStorage:undefined,
}
WAH.init = function(){
	// events
	window.applicationCache.addEventListener('updateready', WAH.refreshFromCache);
	window.addEventListener('offline', WAH.onlineCheck);
	window.addEventListener('online', WAH.onlineCheck);

	// banner
	WAH.banner = document.createElement('div');
	WAH.banner.onclick = function(e){e.preventDefault();window.location.reload()};
	WAH.banner.id = "WAHbanner";
	WAH.banner.className = "disable";
	WAH.banner.appendChild(document.createTextNode(WAH.settings.updateBannerText));
	document.body.appendChild(WAH.banner);

	// close banner button
	var closeBanner = document.createElement('a');
	closeBanner.id = "WAHbannerClose";
	closeBanner.appendChild(document.createTextNode("x"));
	closeBanner.onclick = function(e){e.preventDefault();e.stopPropagation();WAH.hideBanner();clearInterval(WAH.updateInterval);return false;}
	WAH.banner.appendChild(closeBanner);

	// stuff
	WAH.hasStorage = WAH.checkHasStorage();
	if(WAH.settings.updateIntervalLength>0) WAH.updateInterval = setInterval(WAH.checkUpdates, WAH.settings.updateIntervalLength);

	console.log("Web App Handler has loaded");
}
WAH.reset = function(){ if(WAH.hasStorage) localStorage.clear(); else console.error("This browser does not seem to allow local storage");}

// read / write / parse data
WAH.write = function(key, data, parser){
	if(WAH.hasStorage){
		if(data==undefined){console.error("invalid arguments for WAH.write():\n\tkey(required) = "+key+"\n\tdata(required) = "+data);}
		else if(parser!=null){
			if(typeof parser=="function") localStorage.setItem(key, parser(data));
			else if(typeof parser=="string"){
				if(WAH.toString[parser]!=undefined) localStorage.setItem(key, WAH.toString[parser](data));
				else console.error("parser '"+parser+"' does not exist. no data saved");
			}
		}
		else if(data.constructor === Array) localStorage.setItem(key, data);
		else if(typeof data == "object"){
			if(data.stringify != undefined) localStorage.setItem(key, data.stringify());
			else localStorage.setItem(key, JSON.stringify(data));
		}
		else if(typeof data == "function") localStorage.setItem(key, data.toString());
		else localStorage.setItem(key, data);
	}
	else console.error("this browser does not seem to allow local storage. You can't write data there.");
}
WAH.read = function(key, parser){
	if(WAH.hasStorage){
		var data = localStorage.getItem(key);
		if(parser!=undefined){
			if(typeof parser=="function") return parser(data);
			else if(typeof parser=="string"){
				if(WAH.toData[parser]!=undefined) return WAH.toData[parser](data);
				else console.error("parser '"+parser+"' does not exist. raw data was returned");
			}
			else console.error("the provided parser is not a function nor a string. raw data was returned");
		}
		else{
			if(data==null || data=="null") return null
			else if(data==undefined || data=="undefined") return undefined
			else if(data=="false") return false
			else if(data=="true") return true
		}
		return data;
	}
	else console.error("this browser does not seem to allow local storage. There is no data to read");
}

// Handling cache, auto update (interval and on connection)
WAH.onlineCheck = function(e){
	if(navigator.onLine) WAH.checkUpdates();
	else WAH.log("offline mode");
}
WAH.checkUpdates = function(e){
	WAH.log("check updates");
	if(applicationCache.status>0) window.applicationCache.update();
}
WAH.refreshFromCache = function(){
	if (window.applicationCache.status == window.applicationCache.UPDATEREADY){
		if(WAH.settings.silentUpdate) window.location.reload();
		else WAH.showBanner();
	}
	else WAH.hideBanner();
}

// banner
WAH.showBanner = function(){ WAH.banner.className = WAH.banner.className.replace("disable", "enable"); }
WAH.hideBanner = function(){ WAH.banner.className = WAH.banner.className.replace("enable", "disable"); }

// utils
WAH.checkHasStorage = function() {
  try { return 'localStorage' in window && window['localStorage'] !== null;}
  catch (e) { return false;}
}
WAH.log = function(msg){ if(WAH.verbose) console.log(); }

filterFloat = function (value) {

}

// parsers
WAH.toData.array = function(data, separator){
	if(data!=null){
		data = data.split((separator!=undefined)?separator:',');
		for (var i = 0; i < data.length; i++) {
			if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(data[i])) data[i] = Number(data[i]);
		};
		return data;
	}
	else return [];
}
WAH.toString.array = function(data, separator){return (data!=null)?data.join(separator) : null;}

WAH.toData.json = function(data){
	if(data!=null)
		try {return JSON.parse(data);}
		catch(e) {return {};}
	return {};
}
WAH.toString.json = function(data){ return (data!=null)? JSON.stringify(data) : null;}

WAH.toData.function = function(data){
	if (data!=null) return eval('('+(data)+')');
	else return function(){console.log("empty function retrieved by WAH");}
}
WAH.toString.function = function(data){ return (data!=null)? data.toString() : null;}

if(WAH.settings.autoStart) WAH.init();
