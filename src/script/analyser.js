(function(){
window.Analyser = {}

// main 'switch'
running = false;

// analysis settings
var meanLag = 30;
var sensitivity = 0.2;
var triggerLag = 500;

// analysis vars
var recording = false;	
var prevPoints = [null, null];
var introPoints = 0;
var mean = 0;
var nextAllow = 0;

// measure
var calibration = null;
var current = new UVector();
var currentValue = null;

// current player
var attachedPlayer = null;


Analyser.init = function(){
	window.addEventListener("devicemotion", accelUpdate, true);
}

function accelUpdate(e){
	current.set(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z);
	if(running){
		// the 'sensor value' is the magnitude of the difference between current accelerometer vector and the calibration one
		currentValue = UVector.sub(calibration, current).mag();

		// calculate the moving mean (sort of). this will be the basis for selecting peaks
		mean = ((mean*(meanLag-1))+currentValue)/(meanLag);

		// the previous value is higher than its two neighbours
		// the previous value is greater than a certain proprotion of the mean (proportion given by sensitivity)
		// the last recorded bump occured at least `triggerLag` ms ago (filters echo bumps)
		// => then, the !!previous!! value was a bump
		console.log("currentValue: "+currentValue+", mean: "+mean);
		if(prevPoints[1]*sensitivity>mean && Date.now() > nextAllow && prevPoints[1]>prevPoints[0] && prevPoints[1]>currentValue){
			nextAllow = Date.now()+triggerLag;
			if(attachedPlayer!=null) attachedPlayer.addBump(prevPoints[1]);
		}

		// update prevPoints
		prevPoints[0] = prevPoints[1];
		prevPoints[1] = currentValue;
	}
}
Analyser.start = function (){
	nextAllow = triggerLag;
	calibration = current.copy();
	currentValue = UVector.sub(calibration, current).mag();
	prevPoints = [currentValue, currentValue];
	console.log("calibrate. value: " + currentValue);
	running = true;
}
Analyser.stop = function(){ running = false; }
Analyser.attach = function(player){ attachedPlayer = player;}
	
})();