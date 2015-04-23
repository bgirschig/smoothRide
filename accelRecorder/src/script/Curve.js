function Curve(color, ctx, posY){
	this.color = color;
	this.index = 0;
	this.ctx = ctx;
	this.y = posY;
	this.pY = this.y;
}
Curve.prototype.setTag = function(name){
	if(this.tag==undefined){
		this.tag = document.createElement("div");
		this.tag.className = "curveTag"
		this.name = name;
		this.tag.style.borderColor = this.color;
		document.body.appendChild(this.tag);
	}
}
Curve.prototype.addPoint = function(val){
	this.index++;

	var pixelPos = this.y-val;

	this.ctx.beginPath();
	if(this.pY != undefined && this.pY != null) this.ctx.moveTo(this.index-1, this.pY);
	this.ctx.strokeStyle = this.color;
	this.ctx.lineWidth = 1;
	this.ctx.lineTo(this.index, pixelPos);
	this.ctx.stroke();
	this.ctx.closePath();

	if(this.tag!=undefined){
		this.tag.style.left = Math.constrain(this.index, 0, this.ctx.canvas.width-this.tag.offsetWidth) + "px";
		this.tag.style.top = Math.constrain(pixelPos, 0, this.ctx.canvas.height-this.tag.offsetHeight) + "px"; 
		this.tag.innerHTML = this.name + " :" + val;
	}

	this.pY = pixelPos;
}