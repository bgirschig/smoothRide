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

	document.getElementById("players").appendChild(this.domNode);
}

Player.prototype.record = function(e){
	e.preventDefault();
	if(!this.recording){
		console.log("start");
		Analyser.attach(this);
		Analyser.start();
		this.recording = true;
		
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
	console.log("bump");
}

Player.prototype.reset = function(e){
	e.preventDefault();
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
}
Player.prototype.deletePlayer = function(e){
	e.preventDefault();
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
}