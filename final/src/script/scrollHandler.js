var startTouch = {};
var startScroll = {};
var currentPlayer = 0;
var currentScreen = 0;

function onStart(e){
	startTouch.x = e.changedTouches[0].clientX;
	startTouch.y = e.changedTouches[0].clientY;
	startScroll.x = body.scrollLeft;
	startScroll.y = body.scrollTop;
}
function onMove(e){
	var deltaY = startTouch.y - e.changedTouches[0].clientY;
	var deltaX = startTouch.x - e.changedTouches[0].clientX;

	if(Math.abs(deltaY)>Math.abs(deltaX)) body.scrollTop = startScroll.y+startTouch.y-e.changedTouches[0].clientY;
	else body.scrollLeft = startScroll.x+startTouch.x-e.changedTouches[0].clientX;
}

function snapScroll(e){
	var deltaY = startTouch.y - e.changedTouches[0].clientY;
	var deltaX = startTouch.x - e.changedTouches[0].clientX;

	if(Math.abs(deltaY)>Math.abs(deltaX)){
		if(deltaY>scrollTreshold) gotoPlayer(currentPlayer+=1);
		else if(deltaY<-scrollTreshold) gotoPlayer(currentPlayer-=1);
		else gotoPlayer();
		gotoScreen();
	}
	else{
		if(deltaX>scrollTreshold) gotoScreen(currentScreen+=1);
		else if(deltaX<-scrollTreshold) gotoScreen(currentScreen-=1);
		else gotoScreen();
		gotoPlayer();
	}
}
function gotoPlayer(id){
	if(typeof id == "number") currentPlayer = Util.constrain(id, 0, playerScreens.length-1);
	TweenLite.to(body, scrollSpeed, {scrollTo:{y:currentPlayer*body.offsetHeight}, ease:Power2.easeOut});
}
function gotoScreen(id){
	if(typeof id == "number") currentScreen = Util.constrain(id, 0, playerScreens[0].childNodes.length-2);
	TweenLite.to(body, scrollSpeed, {scrollTo:{x:currentScreen*body.offsetWidth}, ease:Power2.easeOut});
}
function scrollHandler(e){
	for (var i = 0; i < nameTags.length; i++) {
		nameTags[i].style.left = body.scrollLeft+25+"px";
	};
}
function resizeHandler(e){
	console.log(e);
}