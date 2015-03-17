function generatePlayer(name){
	var globalNode = document.createElement("div");
	globalNode.className = "player";
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


	var playerScreen3 = generate("div", "", {"class":"playerScreen screen3"});
	playerScreen3.appendChild(generate("div", "Smoothness", {"class":"legend"}));
	playerScreen3.appendChild(generate("div", "0", {"class":"value"}));
	globalNode.appendChild(playerScreen3);

	var playerScreen4 = generate("div", "", {"class":"playerScreen screen4"});
	playerScreen4.appendChild(generate("div", "Strongest bump", {"class":"legend"}));
	playerScreen4.appendChild(generate("div", "0", {"class":"value"}));
	globalNode.appendChild(playerScreen4);

	return globalNode;
}
function generate(type, content, attributes){
	var el = document.createElement(type);
	el.appendChild(document.createTextNode(content));
	for (var key in attributes) el.setAttribute(key, attributes[key]);
	return el;
}