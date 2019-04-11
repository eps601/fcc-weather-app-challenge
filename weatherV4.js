/*Make a wind indicator consisting of a line pointing in the direction the wind is coming from and feathers on the side, for now at 90 degrees. The length of the wind line is 200px and the feather is 75px. 

This js code is a testing code. The basis code is windIndicatorTest.js (without the 2)*/
/*Mt. Washington observatory latitude and longitude lat = 44.270051, long = -71.303142
Torrance, CA latitude and longitude lat=33.84&lon=-118.35 http://api.openweathermap.org/data/2.5/weather?lat=33.84&lon=-118.35&appid=bdfc5a0aa4c47697994a10d86e4e2599&units=imperial

cannot use Google API to get latitude and longitude. Need to use IP locator API.*/

/*Get the location of the user using the user's IP address (really gets the location of the users ISP) since GOOGLE won't allow the getPositionOf call without it coming from an HTTPS certified site. Since I won't pay for a certificate and wouldn't know how to use it anyway, the IP address is the alternative.*/

/* V2-4 uses apixu.com key (6/29/2017) = 3237447510b34996b7a30125173006
   https://api.apixu.com/v1/current.json?key=3237447510b34996b7a30125173006&q=auto:ip (or q=lat,lon [in decimal degrees])
*/

/*Build the url to call the weather API which is the way to incorporate the latitude and longitude into the url.*/

// var hasLoc = false;
/* function zipCode() {
	document.getElementById('weatherBtn').addEventListener("click", function() {
		var locale = document.getElementById('zipcode').value;
			console.log('zipcode',locale);
			if(locale){hasLoc = true;
			} else hasLoc = false;
			getWeather(locale);
	});
	document.getElementById('zipcode').addEventListener("keyup",function(event) {
		if (event.keyCode == 13) {
			var locale = document.getElementById('zipcode').value;
			console.log('zipcode',locale);
			if(locale){hasLoc = true;
			} else hasLoc = false;
			getWeather(locale);
		}
	});
} */
/* document.getElementById('click_here').addEventListener('click',function() {
	var currStatus = document.getElementById('hideshow');
	console.log(currStatus);
	var info = document.getElementById('vaneInfo');
	var inputInfo = document.getElementById('zipMessage');
	console.log(info);
	if(currStatus.innerHTML == 'show') {
		inputInfo.style.display = 'none';
		info.style.display = 'block';
		currStatus.innerHTML = 'hide';
	} else {info.style.display = 'none';
			inputInfo.style.display = 'block';
			currStatus.innerHTML = 'show';
			drawWindIndicator(windSpeed, windDirAng, cloudCover);
	}
},false);

document.getElementById('vaneDemo').addEventListener('change',function() {
	var boxStatus = document.getElementById('vaneDemo').checked;
	var canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 900, 600);
	if(boxStatus) {	drawWindIndicator(127,305,75);}
	if(!boxStatus) {drawWindIndicator(windSpeed, windDirAng, cloudCover);}
	},false); */

	var hasLoc = false;
	
function getWeather(locale){
	console.log(hasLoc);
	var api = 'https://api.apixu.com/v1/current.json?';
	var apiKey = 'key=3237447510b34996b7a30125173006';
	var loc = '&q=auto:ip';
	if(hasLoc) {var url = api + apiKey + '&q=' + locale;
	} else {
		var url = api + apiKey + loc;
	}
	
$.getJSON(url,function(data){
	console.log(data);
	var conditionIcon = data.current.condition.icon;
	var name = data.location.name;
	var state = data.location.region;
	var country = data.location.country;
	windSpeed = data.current.wind_mph;
	windDirAng = data.current.wind_degree;
	cloudCover = data.current.cloud;
	var condition = data.current.condition.text;
	tempNow = Math.round(data.current.temp_f);
	document.getElementById('zipcode').value = "";
	document.getElementById('whereAmI').innerHTML = name + ', ' + state + ', ' + country;
	document.getElementById('condition').innerHTML = condition;
	console.log('conditionIcon',conditionIcon);
	document.getElementById('weatherIcon').src = 'https:' + conditionIcon;
	drawWindIndicator(windSpeed,windDirAng,cloudCover);
	showTemperature (tempNow);
	}).fail(function() {
		alert('Bad Request. Check spelling or postal code.')
		});

var unitTempStatus = true;

function showTemperature (){
	var celTemp = Math.round((tempNow-32)*5/9);
	console.log(celTemp);
	if(unitTempStatus){
		var temperature = document.getElementById('temperature');
		temperature.innerHTML =  tempNow + '&degF';
		unitTempStatus = false;
	}
	else if(!unitTempStatus) {
		var temperature = document.getElementById('temperature');
		temperature.innerHTML = celTemp + '&degC';
		unitTempStatus = true;
	}
	document.getElementById('temperature').addEventListener('click',showTemperature,false);
	}
}
function drawWindIndicator(windSpeed, windDirAng, cloudCover) {
var xOffSet = 275; //canvas draws from the upper left corner. Need to move lower and to the right. This is also the starting point of the wind indicator.
var yOffSet = 185;

var windFlagLength=135;//this is the line indicating wind direction
var windBarbLength=40; //this is the flag barb indicating wind speed
/*picture a triangle with the center as the start of the wind indicator and the angle as the number of degrees from 0 degrees. c is the hypotenuse of that triangle with side 'a' the wind indicator line and 'b' the wind barb (which show the wind speed) that goes out from the indicator line. */
var c=Math.round(Math.sqrt(windBarbLength*windBarbLength+windFlagLength*windFlagLength));//hypotenuse of the line from origin to the tip of the barb
var barbStep = windFlagLength/15;


var numGT50Flags = Math.floor(windSpeed/50); //number of flags for wind speed greater than 50 knots; one flag for each 50 knots
var numLT50Barbs = windSpeed%50;
var numBarbs = Math.floor(numLT50Barbs/10);//number of barbs with wind speed less than 50 knots in increments of 10 knots
var shortBarb = false;//short barb is for speeds of approximately 5 knots

if(windSpeed%10 <= 12 && windSpeed%10 > 7) {numBarbs = numBarbs + 1};
if(windSpeed%10 <= 7 && windSpeed%10 >= 3) {shortBarb = true};
if(windSpeed < 1) {windFlagLength = 0; windBarbLength = 0};
if (windSpeed%50 >=48) {numGT50Flags++; numBarbs = 0;}

var windDirAngCorrected=(windDirAng-90);//0 deg in canvas start at the compass 90 degrees point so need to put the start at the top of the circle.
var windBarbAng = windDirAngCorrected - (180/Math.PI)*(Math.atan(windBarbLength/windFlagLength)); //arctan returned in radians; convert to degrees

var xWindStixEnd = [];
var yWindStixEnd = [];
var xbarbEnd = [];
var ybarbEnd = [];

var circleRadius = 30;
//drawWindIndicator();

	var canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	context.clearRect(0,0,canvas.width,canvas.height);
	context.lineWidth=2;
	context.beginPath();
	
	xWindStixBegin = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*circleRadius) + xOffSet; //set the angle & x,y coord of the wind stick start
	yWindStixBegin = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*circleRadius) + yOffSet;	
	
	context.moveTo(xWindStixBegin,yWindStixBegin);
	/*draw the three types of indicators. Flags for each 50 knots, long barbs for each 10 knots, short barb for wind around 5 knots*/
	
	for (var j=1; j<=numGT50Flags; j++) {
		
		xWindStixEnd[0] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; //set the angle & x,y coord of the wind stick tip
		yWindStixEnd[0] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
		
		xbarbEnd[0] = Math.round(Math.cos(windBarbAng*(Math.PI/180))*c) + xOffSet; //set the angle & x,y coord for the end of the flag or barb
		ybarbEnd[0] = Math.round(Math.sin(windBarbAng*(Math.PI/180))*c) + yOffSet;
		
		context.lineTo(xWindStixEnd[0],yWindStixEnd[0]);
		context.lineTo(xbarbEnd[0],ybarbEnd[0]);
		windFlagLength = windFlagLength - barbStep; //shorten the wind stick for the beginning of the next flag or barb
		xWindStixEnd[0] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; //x,y coord of the new start of the flag
		yWindStixEnd[0] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
		context.lineTo(xWindStixEnd[0],yWindStixEnd[0]); //create the triangle of the flag and fill it
		context.fill();
		windFlagLength = windFlagLength - barbStep;//step down to create the next flag
		c=Math.round(Math.sqrt(windBarbLength*windBarbLength+windFlagLength*windFlagLength));//new hypotenuseto ensure barb length is constant
		windBarbAng = windDirAngCorrected - (180/Math.PI)*(Math.atan(windBarbLength/windFlagLength)); 
	}
	for(var i=1; i<=numBarbs; i++){
		xWindStixEnd[i] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; 
		yWindStixEnd[i] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
		xbarbEnd[i] = Math.round(Math.cos(windBarbAng*(Math.PI/180))*c) + xOffSet;
		ybarbEnd[i] = Math.round(Math.sin(windBarbAng*(Math.PI/180))*c) + yOffSet;
		context.lineTo(xWindStixEnd[i],yWindStixEnd[i]);
		context.lineTo(xbarbEnd[i],ybarbEnd[i]);
		context.lineTo(xWindStixEnd[i],yWindStixEnd[i]);
		
		windFlagLength = windFlagLength - barbStep;
		c=Math.round(Math.sqrt(windBarbLength*windBarbLength+windFlagLength*windFlagLength));
		windBarbAng = windDirAngCorrected - (180/Math.PI)*(Math.atan(windBarbLength/windFlagLength));

	}//The shortbarb should be offset from the end of the stick to show that it is not a long barb
	if(shortBarb && numGT50Flags==0 && numBarbs==0) {
		windBarbLength = windBarbLength/2;

		windBarbAng = windDirAngCorrected - (180/Math.PI)*(Math.atan(windBarbLength/windFlagLength));
		
		xWindStixEnd[i] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; 
		yWindStixEnd[i] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
		
		windFlagLength = windFlagLength-barbStep;
		c=Math.round(Math.sqrt(windBarbLength*windBarbLength+windFlagLength*windFlagLength));
		
		xWindStixEnd[i+1] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; 
		yWindStixEnd[i+1] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
		xbarbEnd[i] = Math.round(Math.cos(windBarbAng*(Math.PI/180))*c) + xOffSet;
		ybarbEnd[i] = Math.round(Math.sin(windBarbAng*(Math.PI/180))*c) + yOffSet;
		
		context.lineTo(xWindStixEnd[i],yWindStixEnd[i]);
		context.lineTo(xWindStixEnd[i+1],yWindStixEnd[i+1]);
		context.lineTo(xbarbEnd[i],ybarbEnd[i]);
		context.lineTo(xWindStixEnd[i+1],yWindStixEnd[i+1]);
	}
	else 
		if(shortBarb) {
			windBarbLength = windBarbLength/2;
			c=Math.round(Math.sqrt(windBarbLength*windBarbLength+windFlagLength*windFlagLength));
			windBarbAng = windDirAngCorrected - (180/Math.PI)*(Math.atan(windBarbLength/windFlagLength));
			
			xWindStixEnd[i] = Math.round(Math.cos(windDirAngCorrected*(Math.PI/180))*windFlagLength) + xOffSet; 
			yWindStixEnd[i] = Math.round(Math.sin(windDirAngCorrected*(Math.PI/180))*windFlagLength) + yOffSet;
			xbarbEnd[i] = Math.round(Math.cos(windBarbAng*(Math.PI/180))*c) + xOffSet;
			ybarbEnd[i] = Math.round(Math.sin(windBarbAng*(Math.PI/180))*c) + yOffSet;
			
			context.lineTo(xWindStixEnd[i],yWindStixEnd[i]);
			context.lineTo(xbarbEnd[i],ybarbEnd[i]);
			context.lineTo(xWindStixEnd[i],yWindStixEnd[i]);
		}
	
	context.closePath();
	context.stroke();
	drawClouds(xOffSet,yOffSet,circleRadius,cloudCover);
}	

function drawClouds (xOffSet,yOffSet,circleRadius,cloudCover) {
	var xoffsetCorrected = xOffSet + circleRadius;
	var yoffsetCorrected = yOffSet - circleRadius;
	var cloudShade;
	
	if(cloudCover >= 15 && cloudCover <= 35) {cloudShade = 90;}
	else if(cloudCover > 35 && cloudCover <= 65) {cloudShade = 180;}
	else if(cloudCover > 65 && cloudCover <= 85) {cloudShade = 270;}
	else if(cloudCover > 85) {cloudShade = 359.9;}
	
	 
	context = document.getElementById('canvas').getContext('2d');
	context.beginPath();
	
	context.arc(xOffSet, yOffSet, circleRadius, 0, Math.PI+Math.PI, false);

	if(cloudCover >= 15) {
		context.moveTo(xOffSet,yOffSet);
		context.lineTo(xOffSet,yoffsetCorrected);
		context.arc(xOffSet, yOffSet, circleRadius, -90*Math.PI/180, (-90*Math.PI/180+cloudShade*Math.PI/180), true);
		context.closePath();
		context.fill();} 
	
	context.stroke();
}
	
document.getElementById('weatherBtn').addEventListener("click", function() {
	var locale = document.getElementById('zipcode').value;
		console.log('zipcode',locale);
		if(locale){hasLoc = true;
		} else hasLoc = false;
		getWeather(locale);
},false);

document.getElementById('zipcode').addEventListener("keyup",function(event) {
	if (event.keyCode == 13) {
		var locale = document.getElementById('zipcode').value;
		console.log('zipcode',locale);
		if(locale){hasLoc = true;
		} else hasLoc = false;
		getWeather(locale);
	}
},false);
//}
document.getElementById('click_here').addEventListener('click',function() {
	var currStatus = document.getElementById('hideshow');
	console.log(currStatus);
	var info = document.getElementById('vaneInfo');
	var inputInfo = document.getElementById('zipMessage');
	console.log(info);
	if(currStatus.innerHTML == 'show') {
		inputInfo.style.display = 'none';
		info.style.display = 'block';
		currStatus.innerHTML = 'hide';
	} else {info.style.display = 'none';
			inputInfo.style.display = 'block';
			currStatus.innerHTML = 'show';
			drawWindIndicator(windSpeed, windDirAng, cloudCover);
	}
},false);

document.getElementById('vaneDemo').addEventListener('change',function() {
	var boxStatus = document.getElementById('vaneDemo').checked;
	var canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 900, 600);
	if(boxStatus) {	drawWindIndicator(127,305,75);}
	if(!boxStatus) {drawWindIndicator(windSpeed, windDirAng, cloudCover);}
	},false);
	
window.addEventListener('load',function() {
	document.getElementById('vaneInfo').style.display = 'none';
	getWeather();
	},false)



