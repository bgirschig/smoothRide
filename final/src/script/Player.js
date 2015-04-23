var Player = function(name, colorId){
	// displayVars
	this.name = name;
	if(players.length>0) this.colorId = colorId || (players[players.length-1].colorId+1)%4;
	else this.colorId = colorId || 0;
	this.domNode = generatePlayer(name, this.colorId);

	// buttons
	this.buttonsNodes = this.domNode.getElementsByClassName("bigButton");
	this.buttonsNodes[0].onclick = this.record.bind(this);
	this.buttonsNodes[1].onclick = this.reset.bind(this);
	this.buttonsNodes[2].onclick = this.deletePlayer.bind(this);

	// record
	this.bumps = [];
	this.smoothness = 0;
	this.strongest = 0;
	this.totalTime = 0;
	this.prevTime = 0;

	document.getElementById("players").insertBefore(this.domNode, document.getElementById("newPlayerScreen"));
}

Player.prototype.record = function(e){
	e.preventDefault();
	if(!this.recording){
		Analyser.attach(this);
		Analyser.start();
		this.recording = true;
		this.prevTime = Date.now();
		gotoScreen(1);
		this.buttonsNodes[0].innerHTML = "stop";
	}
	else{
		this.recording = false;
		Analyser.stop();
		
		this.buttonsNodes[0].innerHTML = "start";
	}
}
Player.prototype.addBump = function(value){ this.bumps.push(value); }

Player.prototype.addData = function(value, bump){
	if(bump){
		this.bumps.push(value);
		if(value>this.strongest) this.strongest = value;
	}
	this.smoothness += value/500;
	this.updateDisplay();
}
Player.prototype.updateDisplay = function(){
	this.totalTime += Date.now()-this.prevTime; this.prevTime = Date.now();
	this.domNode.querySelector(".bumps .value").innerHTML = this.bumps.length;
	var bumpsMin = Util.round(this.bumps.length/(this.totalTime/60000), 2)
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
	this.prevTime = Date.now();
	this.totalTime = 0;
	
	this.updateDisplay();
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
}
Player.prototype.deletePlayer = function(e){
	e.preventDefault();
	
	document.getElementById("players").removeChild(this.domNode);
	for(var i=0; i<players.length; i++) if(players[i]==this) players.splice(i,1);
	
	if(this.recording) Analyser.currentlyRecodingPlayer = null;
	delete this;
	
	setFormColor();		//update the background color of the 'new player' page
	save();
}

Player.prototype.stringify = function(){
	return '{"name":"'+this.name+'", "colorId":"'+this.colorId+'"}';
}