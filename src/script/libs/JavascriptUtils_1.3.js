console.info("javascriptUtils_1.2.js loaded");

var Util = {
	Color: {}
};

Util.radToDeg = 180/Math.PI;
Util.degToRad = Math.PI/180;
Util.HR = {LEFT:0, RIGHT:1, FRONT:2, BACK:3, FORWARD:4, BACKWARDS:5 }

Util.Color.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
Util.Color.rgbToHex = function(r, g, b) {
    return "#" + Util.Color.componentToHex(r) + Util.Color.componentToHex(g) + Util.Color.componentToHex(b);
}

Util.constrain = function(val, min, max){
	if(min>max){
		console.error("wrong arguments on constrain: min must be lower than max");
		return val;
	}
	else if(val>max) return max;
	else if(val<min) return min;
	return val;
}

Util.sign = function(x) {return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;}
Util.sq = function(val){return val*val;}
Util.gauss = function(val,w,h,offset){ return h/(Math.pow(2,Util.sq((val-offset)/w))); }
Util.getBisector = function(x1,y1,x2,y2,d){
  var l = Math.sqrt(Math.sq(x2-x1)+Math.sq(y2-y1))/d;
  if(l>0){
    return [
    	(x1+x2)/2+((y1-y2)/l), (y1+y2)/2+((x2-x1)/l), (x1+x2)/2-((y1-y2)/l), (y1+y2)/2-((x2-x1)/l), (x1+x2)/2, (y1+y2)/2
    ]; //[0][1]-> point 1, [2][3]-> point 2, [4][5]-> center point
  }
  else return null;
}
Util.fullScreen = function(){ // !! does not seem to work on safari
  if (document.body.requestFullscreen ) document.body.requestFullscreen();
  else if (document.body.mozRequestFullScreen ) document.body.mozRequestFullScreen();
  else if (document.body.webkitRequestFullScreen ) document.body.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
}


Array.prototype.roll = function(forward){
	if(forward == true) this.unshift(this.pop());
	else this.push(this.shift());
}

function MetaAngle(){
	this.linearAngle;
	this.pAngle;
	this.smoothedLinearAngle;
	this.smoothStrength = 10;
}
MetaAngle.prototype.update = function(newAngle){
	if(newAngle!=undefined){
		if(this.linearAngle!=undefined && this.linearAngle!=null){
			d = newAngle-this.pAngle;
			if(Math.abs(d)<300) this.linearAngle += d;
			this.pAngle = newAngle;
		}
		else this.set(newAngle);
	}
	this.smoothedLinearAngle += (this.linearAngle - this.smoothedLinearAngle) / this.smoothStrength;
}

MetaAngle.prototype.set = function(angle){
	this.linearAngle = angle;
	this.pAngle = angle;
	this.smoothedLinearAngle = angle;
}


function UVector(_x,_y){
	if(typeof _x === "undefined" || _x === null) this.x = 0;
	else this.x = _x;
	if(typeof _y === "undefined" || _y === null) this.y = 0;
	else this.y = _y;
	return this;
}

if(typeof HTMLElement =='function' || typeof HTMLElement == 'object'){
	if(typeof(HTMLElement.prototype.addClass)==='undefined'){
		HTMLElement.prototype.addClass = function(val){
			if(this.className.indexOf(val) == -1) this.className += " "+val;
		}
	}

	if(typeof(HTMLElement.prototype.removeClass)==='undefined'){
		HTMLElement.prototype.removeClass = function(val){
			this.className = this.className.replace(" "+val, "");
			this.className = this.className.replace(val+" ", "");
			this.className = this.className.replace(val, "");
		}
	}

	if(typeof(HTMLElement.prototype.hide)==='undefined'){
		HTMLElement.prototype.hide = function(){
			this.className = this.className.replace("show", "hide");
			if(this.className.indexOf("hide") == -1) this.className += " hide";
		}
	}
	if(typeof(HTMLElement.prototype.show)==='undefined'){
		HTMLElement.prototype.show = function(){
			this.className = this.className.replace("hide", "show");
			if(this.className.indexOf("show") == -1) this.className += " show";
		}
	}
	if(typeof(HTMLElement.prototype.enable)==='undefined'){
		HTMLElement.prototype.enable = function(){
			this.className = this.className.replace("disable", "enable");
			if(this.className.indexOf("enable") == -1) this.className += " enable";
		}
	}
	if(typeof(HTMLElement.prototype.disable)==='undefined'){
		HTMLElement.prototype.disable = function(){
			this.className = this.className.replace("enable", "disable");
			if(this.className.indexOf("disable") == -1) this.className += " disable";
		}
	}
	if(typeof(HTMLElement.prototype.is)==='undefined'){
		HTMLElement.prototype.has = function(key){
			return this.className.indexOf(key) != -1;
		}
	}
}