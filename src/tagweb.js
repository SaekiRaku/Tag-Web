/** HTML5 canvas tag web
 *  @Author ThomasSoloist
 *  @Date 2015/12/28
 *  Released under the MIT license
 */

function TagWeb(divID, data, strokeStyle) {

	this.canvas = undefined;

	var callback;
	var ctx;
	var nowPointer;
	var data = new Array();
	var lineRange = 300;
	var lineStyle = "rgba(255,255,255,0.26)"
	var fontStyle = "#FFFFFF"
	var font = "微软雅黑";

	if (arguments.length != 0) {
		init(divID, data, strokeStyle);
	}

	setInterval(drawing, 10);

	this.init = function(myDiv) {
		init(myDiv, myData, myStrokeStyle);
	}

	this.setLineStyle = function(strokeStyle) {
		if (strokeStyle == undefined || typeof strokeStyle != "string" || typeof strokeStyle != "object") {
			throw new Error("wrong type of strokeStyle");
			return;
		}
		lineStyle = strokeStyle;
	}

	this.setTextStyle = function(strokeStyle) {
		if (strokeStyle == undefined || typeof strokeStyle != "string" || typeof strokeStyle != "object") {
			throw new Error("wrong type of strokeStyle");
			return;
		}
		fontStyle = strokeStyle;
	}

	this.setTextFont = function(fontName) {
		if (fontName == undefined || typeof fontName != "string") {
			throw new Error("wrong type of fontName");
			return;
		}
		font = fontName;
	}
	
	this.setLineRange = function(range){
		lineRange = range;
	}

	this.addTag = function(str, fontSize, x, y) {
		if (str == undefined || typeof str != "string") {
			throw new Error("wrong type of str");
			return;
		} else if (fontSize == undefined) {
			fontSize = 48 * Math.random() + 12;
		}
		if (typeof fontSize != "number") {
			throw new Error("wrong type of fontSize");
			return;
		}

		var stageWidth = canvas.offsetWidth * 0.8;
		var stageHeight = canvas.offsetHeight * 0.8;
		
		ctx.font = obj.fontSize + "px " + font;

		data.push({
			x: stageWidth * 0.1 + Math.random() * (stageWidth-ctx.measureText(str).width) + ctx.measureText(str).width,
			y: stageHeight * 0.1 + Math.random() * (stageHeight-fontSize) + fontSize,
			xmove: Math.random() * 20,
			xrandom: Math.random() * 0.5,
			ymove: Math.random() * 20,
			yrandom: Math.random() * 0.5,
			tag: str,
			fontSize: fontSize
		});
	}
	
	this.gridHypodispersion = function(row,col){
		var now=0;
		var stageWidth = canvas.offsetWidth * 0.8;
		var stageHeight = canvas.offsetHeight * 0.8;
		var gridWidth = stageWidth/col;
		var gridHeight = stageHeight/row;

		for(var m=0;m<row;m++){
			for(var n=0;n<col;n++){
				if(now>=data.length){
					break;
				}else{
					data[now].x = stageWidth*0.1 + gridWidth*m + (gridWidth * Math.random());
					data[now].y = stageHeight*0.1 + gridHeight*n + (gridHeight * Math.random());
					now++;
				}
			}
		}
	}
	
	this.addCallBack = function(func){
		callback = func;
	}

	function init(myDiv) {
		if (myDiv == undefined || trim(myDiv) == "") {
			throw new Error("divID must be given");
			return false;
		}
		var node = document.createElement("canvas");
		canvas = document.getElementById(myDiv).appendChild(node);
		canvas.width = document.getElementById(myDiv).offsetWidth;
		canvas.height = document.getElementById(myDiv).offsetHeight;
		ctx = canvas.getContext('2d');
		ctx.textAlign = "center";

		canvas.addEventListener("mousemove", function(evt) {
			for (var i = 0; i < data.length; i++) {
				
				var obj = data[i];
				
				ctx.font = obj.fontSize + "px " + font;
				
				var a = (evt.offsetX > obj.x + obj.xmove - ctx.measureText(obj.tag).width/2);
				var b = (evt.offsetX < obj.x + obj.xmove + ctx.measureText(obj.tag).width/2);
				var c = (evt.offsetY > obj.y + obj.ymove - obj.fontSize);
				var d = (evt.offsetY < obj.y + obj.ymove);

				if (a && b && c && d) {
					canvas.style.cursor = "pointer";
					nowPointer = obj.tag;
					break;
				} else {
					canvas.style.cursor = "default";
					nowPointer = null;
				}
			}
		});
		
		canvas.addEventListener("click",function(){
			if(nowPointer!=null && callback!=undefined){
				callback(nowPointer);
			}
		});
	}

	function drawing() {
		ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

		var obj;
		for (var i = 0; i < data.length; i++) {
			obj = data[i];


			obj.xmove += Math.sin(Date.now() * obj.xrandom * Math.PI / 180) / 5;
			obj.ymove += Math.cos(Date.now() * obj.yrandom * Math.PI / 180) / 5;

			ctx.fillStyle = fontStyle;
			ctx.font = obj.fontSize + "px " + font;
			ctx.fillText(obj.tag, obj.x + obj.xmove, obj.y + obj.ymove);

			ctx.strokeStyle = lineStyle;
			ctx.beginPath();
			for (var m = 0; m < data.length; m++) {
				var length = Math.sqrt(Math.pow((obj.x + obj.xmove) - (data[m].x + data[m].xmove), 2) + Math.pow((obj.y + obj.ymove) - (data[m].y + data[m].ymove), 2))

				if (length < lineRange) {
					ctx.moveTo(obj.x + obj.xmove, obj.y + obj.ymove);
					ctx.lineTo(data[m].x + data[m].xmove, data[m].y + data[m].ymove);
				}
			}
			ctx.stroke();
		}
	}

	function trim(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");　　
	}
}