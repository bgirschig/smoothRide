// settings
var scrollSpeed = 0.5;
var scrollTreshold = 50;

var body;
var playerScreens;
var playerTags;

var players;

function setup(){
	body = document.body;
	playerScreens = document.getElementsByClassName("player");
	nameTags = document.getElementsByClassName("nameTag");

	// console.log(body.scrollLeft);
	console.log("body.scrollLeft:"+body.scrollLeft);
	
	WAH.init({"updateIntervalLength":10000, "silentUpdate":false});
	
	window.addEventListener("touchstart", onStart);
	window.addEventListener("touchmove", onMove);
	window.addEventListener("touchend", snapScroll);
	window.addEventListener("scroll", initCurrent);
	window.addEventListener("scroll", scrollHandler);

	// http://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile#answer-27383551
	// if(!window.navigator.standalone) alert("please install the app");

	players = ["play1", "play2", "play3"];
	for (var i = 0; i < players.length; i++) document.getElementById("players").appendChild(generatePlayer(players[i]));

	
}


function startRecord(e){e.preventDefault();console.log("startRecord");}
function resetRecord(e){e.preventDefault();console.log("resetRecord");}
function deletePlayer(e){e.preventDefault();console.log("deletePlayer");}
function scrollHandler(e){
	for (var i = 0; i < nameTags.length; i++) {
		nameTags[i].style.left = body.scrollLeft+25+"px";
	};
}

window.addEventListener('load', setup);