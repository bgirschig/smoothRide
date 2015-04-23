var Player = function(name){
	// displayVars
	this.name = name;
	this.domNode = generatePlayer(name);

	// buttons
	this.buttonsNodes = this.domNode.getElementsByClassName("bigButton");
	this.buttonsNodes[0].onclick = this.record.bind(this);
	this.buttonsNodes[1].onclick = this.reset.bind(this);
	this.buttonsNodes[2].onclick = this.deletePlayer.bind(this);

	// record
	this.bumps = [];
	this.smoothness = 0;
	this.strongest = 0;
	this.startTime = 0;
	this.totalTime = 0;

	document.getElementById("players").appendChild(this.domNode);
}

Player.prototype.record = function(e){
	e.preventDefault();
	if(!this.recording){
		console.log("start");
		Analyser.attach(this);
		Analyser.start();
		this.recording = true;
		this.startTime = Date.now();
		
		this.buttonsNodes[0].innerHTML = "stop";
	}
	else{
		this.recording = false;
		Analyser.stop();
		
		this.buttonsNodes[0].innerHTML = "start";
	}
}
Player.prototype.addBump = function(value){
	this.bumps.push(value);
}
Player.prototype.addData = function(value, bump){
	if(bump){
		this.bumps.push(value);
		if(value>this.strongest) this.strongest = value;
	}
	this.smoothness += value/500;
	this.updateDisplay();
}
Player.prototype.updateDisplay = function(){
	this.domNode.querySelector(".bumps .value").innerHTML = this.bumps.length;

	var bumpsMin = Util.round(this.bumps.length/((Date.now()-this.startTime)/60000), 2)
	if(isNaN(bumpsMin)) bumpsMin = 0;
	this.domNode.querySelector(".bumpsMinute .value").innerHTML = bumpsMin.toFixed(1);
	this.domNode.querySelector(".smoothness .value").innerHTML = (100/(bumpsMin+1)).toFixed(1);
	this.domNode.querySelector(".strongest .value").innerHTML = this.strongest.toFixed(2);
}

Player.prototype.reset = function(e){
	e.preventDefault();
	
	this.bumps = [];
	this.smoothness = 0;
	this.strongest = 0;
	this.startTime = Date.now();
	
	this.updateDisplay();
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
}
Player.prototype.deletePlayer = function(e){
	e.preventDefault();
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
}