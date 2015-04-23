// settings
var scrollSpeed = 0.5;
var scrollTreshold = 50;

var body;

// players
var playerScreens;
var players = [];

function setup(){
	body = document.body;
	playerScreens = document.getElementsByClassName("player");
	nameTags = document.getElementsByClassName("nameTag");
	
	WAH.init({"updateIntervalLength":0, "silentUpdate":false});
	Analyser.init();

	window.addEventListener("touchstart", onStart);
	window.addEventListener("touchmove", onMove);
	window.addEventListener("touchend", snapScroll);
	window.addEventListener("resize", resizeHandler);
	// window.addEventListener("scroll", initCurrent);
	// window.addEventListener("scroll", scrollHandler);

	// http://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile#answer-27383551
	// if(!window.navigator.standalone) alert("please install the app");

	var pseudoPlayers = ["play1", "play2", "play3"];
	for (var i = 0; i < pseudoPlayers.length; i++) players.push(new Player(pseudoPlayers[i]));
	document.getElementById("players").appendChild(generateNewPlayForm());
}

function startRecord(e){e.preventDefault();console.log(e.currentTarget.parentNode.parentNode.parentNode);}
function resetRecord(e){e.preventDefault();console.log("resetRecord");}
function deletePlayer(e){e.preventDefault();console.log("deletePlayer");}

window.addEventListener('load', setup);