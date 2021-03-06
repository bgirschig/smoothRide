function generatePlayer(name, colorId){
	var globalNode = document.createElement("div");
	globalNode.className = "player color"+colorId;
	globalNode.appendChild(generate("div", name, {"class":"nameTag"}));

	var playerScreen1 = generate("div", "", {"class":"playerScreen screen1"});
	globalNode.appendChild(playerScreen1);

	var btnBox = generate("div", "", {"class":"buttonBox"});
	playerScreen1.appendChild(btnBox);
	
	btnBox.appendChild(generate("a", "start", {"class":"bigButton record", "href":"#"}));
	btnBox.appendChild(generate("a", "reset", {"class":"bigButton reset", "href":"#"}));
	btnBox.appendChild(generate("a", "x", {"class":"bigButton delete", "href":"#"}));

	var playerScreen2 = generate("div", "", {"class":"playerScreen screen2"});
	globalNode.appendChild(playerScreen2);
	var bumps = generate("div", "", {"class":"bumps lineWrap"});
	bumps.appendChild(generate("div", "0", {"class":"value"}));
	bumps.appendChild(generate("div", "bumps", {"class":"legend"}));
	var bumpsMinute = generate("div", "", {"class":"bumpsMinute lineWrap"});
	bumpsMinute.appendChild(generate("div", "0", {"class":"value"}));
	bumpsMinute.appendChild(generate("div", "bumps/minute", {"class":"legend"}));
	var wrapper = generate("div", "", {"class":"wrapper"})
	wrapper.appendChild(bumps);
	wrapper.appendChild(bumpsMinute);
	playerScreen2.appendChild(wrapper);

	var playerScreen3 = generate("div", "", {"class":"playerScreen screen3 smoothness"});
	playerScreen3.appendChild(generate("div", "Smoothness", {"class":"legend"}));
	playerScreen3.appendChild(generate("div", "0", {"class":"value"}));
	globalNode.appendChild(playerScreen3);

	var playerScreen4 = generate("div", "", {"class":"playerScreen screen4 strongest"});
	playerScreen4.appendChild(generate("div", "Strongest bump", {"class":"legend"}));
	playerScreen4.appendChild(generate("div", "0", {"class":"value"}));
	globalNode.appendChild(playerScreen4);

	return globalNode;
}
function generateNewPlayForm(){
	var newPlayer = generate("div", "", {"class":"player color0", "id":"newPlayerScreen"});
	var formScreen = generate("div", "", {"class":"playerScreen"});
	var form = generate("form", "", {"class":"newPlayerForm"});
	
	formScreen.appendChild(form);
	var newPlayerInput = generate("input", "", {"type":"textinput","value":"Add player"});
	form.appendChild(newPlayerInput);
	newPlayerInput.onfocus = function(e){
		e.preventDefault();
		form.addClass("top");
		newPlayerInput.value = "";
		setTimeout(function(){gotoPlayer(players.length);}, 300); //FIXME: bug without this large delay (scrolls to wrong screen)
	}
	form.onsubmit = function(e){
		e.preventDefault();
		players.push(new Player(newPlayerInput.value));
		newPlayerInput.blur();
		setTimeout(function(){gotoPlayer(players.length-1);gotoScreen(0)}, 300); //FIXME
		setFormColor();
		save();
	}
	newPlayerInput.onblur = function(e){
		newPlayerInput.value = "Add player";
		form.removeClass("top");
		console.log(form.className);
	}
	newPlayer.appendChild(formScreen);
	return newPlayer;
}
function setFormColor(){
	var newPlayer = document.getElementById("newPlayerScreen");
	newPlayer.className = newPlayer.className.replace(/color\d+/, "color"+((players.length>0)?(players[players.length-1].colorId+1)%4:0));
}
function generate(type, content, attributes){
	var el = document.createElement(type);
	el.appendChild(document.createTextNode(content));
	for (var key in attributes) el.setAttribute(key, attributes[key]);
	return el;
}