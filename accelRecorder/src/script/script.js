var inputText = document.getElementById("inputText");
var tracksList = document.getElementById("tracksList");

var tracks;

// measures
var calibration;
var current = new UVector();

function setup(){
	tracks = WAH.read("tracks", "json");

	for(key in tracks) tracksList.appendChild(createListItem(key));

	// handle the validation (enter key) of the text input
	inputText.addEventListener("keydown", onKey);

	// update the current acceleration vector
	window.addEventListener("devicemotion", accelUpdate);
}

function createListItem(trackName){
	var label = document.createElement("span");
	label.className = "label";

	var deleteBtn = document.createElement('span');
	deleteBtn.className = "trackBtn deleteBtn";
	deleteBtn.innerHTML = "&#10005;";
	deleteBtn.dataset.trackName = trackName;
	deleteBtn.onclick = deleteTrack;
	var recordBtn = document.createElement('span');
	recordBtn.className = "trackBtn recordBtn";
	recordBtn.innerHTML = "&#9679;";
	recordBtn.dataset.trackName = trackName;
	recordBtn.onclick = record;
	var resetBtn = document.createElement('span');
	resetBtn.className = "trackBtn resetBtn";
	resetBtn.innerHTML = "&#9633;";
	resetBtn.dataset.trackName = trackName;
	resetBtn.onclick = reset;

	label.appendChild(deleteBtn);
	label.appendChild(document.createTextNode(trackName));
	label.appendChild(recordBtn);
	label.appendChild(resetBtn);
	
	var listItem = document.createElement('li');
	listItem.appendChild(label);
	listItem.id = "trackName";
	
	var canvas = document.createElement("canvas");
	canvas.width = 2000;
	canvas.height = 200;
	listItem.appendChild(canvas);
	
	tracks[trackName].ctx = canvas.getContext("2d");
	tracks[trackName].curve = new Curve(0, tracks[trackName].ctx, 200);
	tracks[trackName].recording = false;
	
	// draw the existing points
	for (var i = 0; i < tracks[trackName].data.length; i++) {
		tracks[trackName].curve.addPoint(tracks[trackName].data[i]);
	};

	return listItem;
}

function record(e){
	// calibrate on the press of the "record" button
	calibrate();

	
	var t = tracks[e.currentTarget.dataset.trackName];
	t.recording = !t.recording;

	if(t.recording){e.currentTarget.innerHTML = "&#9632;";}
	else{
		e.currentTarget.innerHTML = "&#9679;";
		WAH.write("tracks", tracks, stringifyTracks);
	}
}
function reset(e){
	var trackName = e.currentTarget.dataset.trackName;
	tracks[trackName].data = [];
	tracks[trackName].curve = new Curve(0, tracks[trackName].ctx, 200);
	tracks[trackName].ctx.clearRect (0,0,2000,200);
	WAH.write("tracks", tracks, stringifyTracks);
}

function accelUpdate(e){
	current.set(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z);
	if(calibration!==undefined){
		for(key in tracks){
			if(tracks[key].recording){
				var val = UVector.sub(calibration, current).mag();
				tracks[key].data.push(parseFloat(val.toFixed(6)));
				tracks[key].curve.addPoint(val*3);
			}
		}
	}
}
function calibrate(e){ calibration = current.copy();}

function addTrack(trackName){
	if(tracks[trackName]==undefined){
		tracks[trackName] = {};
		tracks[trackName].data = [];
		tracksList.appendChild(createListItem(trackName));
		WAH.write("tracks", tracks, stringifyTracks);
	}
	else alert("a track with this name already exits");
}
function deleteTrack(e){
	e.preventDefault();
	console.log(e.currentTarget.dataset.trackName);
	delete tracks[e.currentTarget.dataset.trackName];
	tracksList.removeChild(e.currentTarget.parentNode.parentNode);
	WAH.write("tracks", tracks, stringifyTracks);
}
function onKey(e){
	if (e.keyCode==13){
		e.preventDefault();
		addTrack(inputText.value);
		inputText.value = "";
		inputText.blur();
	}
}
function stringifyTracks(){
	result = {};
	for(key in tracks){
		result[key] = {"data":tracks[key].data};
	}
	return JSON.stringify(result);
}
function getData(key){
	if(key!=undefined) return tracks[key].data.join(',');
	returnString = "import numpy as np\n";
	for(loopKey in tracks) returnString+= loopKey + " = np.array(["+tracks[loopKey].data.join(',')+"])\n";
	return returnString;
}

window.addEventListener('load', setup);
