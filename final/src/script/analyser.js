(function(){
window.Analyser = {}

// main 'switch'
running = false;

// analysis settings
var sampleSize = 100;
var treshold = 1;
var triggerLag = 500;
var sensitivity = 0.1;

// analysis vars
var previousValues = [];
var average = 0;
var nextAllow = 0;
var variance = null;

// measure
var calibration = null;
var current = new UVector();
var currentValue = null;

// current player
var attachedPlayer = null;

window.exportObj = {
	input: [],
	average: [],
	variance: [],
	signal: []
};

Analyser.init = function(){
	window.addEventListener("devicemotion", accelUpdate, true);
}

function accelUpdate(e){
	current.set(e.accelerationIncludingGravity.x, e.accelerationIncludingGravity.y, e.accelerationIncludingGravity.z);

	if(running){
		// the 'sensor value' is the magnitude of the difference between current accelerometer vector and the calibration one
		currentValue = UVector.sub(calibration, current).mag();

		// fill up the 'previous values' before analysing.
		if(previousValues.length<sampleSize) previousValues.push(currentValue);
		else{
			// average of the previous values
			average = Util.avg(previousValues);

			// calculate the (moving) standard deviation of the previous values
			variance = Util.variance(previousValues, average);

			// export data
			exportObj.input.push(currentValue);
			exportObj.variance.push(variance);

			// detection itself
			if(
				previousValues[sampleSize-1] < previousValues[sampleSize-2]
				&& previousValues[sampleSize-3] < previousValues[sampleSize-2]
				&& Date.now() >= triggerLag
				&& previousValues[sampleSize-1] * sensitivity > treshold 
				){
				nextAllow = Date.now() + triggerLag;
				attachedPlayer.addData(previousValues[sampleSize-1], true);
			}
			attachedPlayer.addData(previousValues[sampleSize-1], false);

			// update prevPoints
			previousValues.push(currentValue);previousValues.shift();
			prevPoints[0] = prevPoints[1];
			prevPoints[1] = currentValue;
		}		
	}
}
Analyser.start = function (){
	nextAllow = triggerLag;
	calibration = current.copy();
	currentValue = UVector.sub(calibration, current).mag();
	prevPoints = [currentValue, currentValue];
	running = true;
}
Analyser.stop = function(){ running = false; }
Analyser.attach = function(player){ attachedPlayer = player;}
})();