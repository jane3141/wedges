// WEDGES by JANE DAVIS <3 
// March 2020.


// global variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var numinput = document.getElementById("numinput");
var tickinput = document.getElementById("tickinput");
var fraccolorsinput = document.getElementById("fraccolorsinput");
var angleinput = document.getElementById("angleinput");
var orientationselect = document.getElementById("orientationselect");


var num;
var pi = Math.PI;
var x = 250;
var y = 250;
var radius = 170;

// random integer [0, n)
function randi(n) {
	return Math.round(n * Math.random());
}


// draw the outer circle
function draw_circle(centerx, centery, R) {
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.arc(centerx, centery, R, 0, 2 * pi);
	ctx.stroke();
}


// draw tick marks
function draw_tick(centerx, centery, R, theta) {	
	ctx.strokeStyle = "black";
	ctx.fillStyle = "black";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(centerx, centery);
	ctx.lineTo(centerx + R * Math.cos(theta), centery + R * Math.sin(theta));
	ctx.closePath();
	ctx.fill();
	ctx.stroke();	
}


// draw wedges
function draw_wedge(centerx, centery, R, theta0, theta1, color, a, b) {
	
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = 3;

	ctx.beginPath();
	ctx.moveTo(centerx, centery);
	ctx.lineTo(centerx + R * Math.cos(theta0), centery + R * Math.sin(theta0));
	ctx.arc(centerx, centery, R, theta0, theta1);
	ctx.lineTo(centerx, centery);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();	
}


// draw labels
function draw_label(centerx, centery, R, theta0, theta1, a, b) {
	ctx.fillStyle = "black";
	ctx.font = "40px Arial";
	ctx.textAlign = "center";
	theta = 0.5 * (theta0 + theta1);
	ctx.fillText(a + "\u2044" + b, centerx + (1.25 * R) * Math.cos(theta), centery + (1.25 * R) * Math.sin(theta));
	ctx.moveTo(centerx, centery);
}


// clear canvas
function clear() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);	
	ctx.beginPath();	
}


// main display logic, which calls axiliary functions and chooses coolors
function wheel(arr, tick, colorlist, startangle, orientation, centerx, centery, R) {

	startangle *= -1;

	clear();

	var ncolors = colorlist.length;

	var theta = startangle;
	for(k = 0; k < arr.length; k++) {
		if(k >= ncolors) {
			color = "rgb(" + randi(255) + "," + randi(255) + "," + randi(255) + ")";
		} else {
			color = colorlist[k];
		}

		if(orientation == 1) {
			draw_wedge(centerx, centery, R, theta, theta + 2 * pi * arr[k][2], color, arr[k][0], arr[k][1]);
		} else {
			draw_wedge(centerx, centery, R, theta - 2 * pi * arr[k][2], theta, color, arr[k][0], arr[k][1]);
		}
			theta += orientation * 2 * pi * arr[k][2];
	}

	theta = startangle;
	for(k = 0; k < arr.length; k++) {
		if(orientation == 1) {
			draw_label(centerx, centery, R, theta, theta + 2 * pi * arr[k][2], arr[k][0], arr[k][1]);
		} else {
			draw_label(centerx, centery, R, theta - 2 * pi * arr[k][2], theta, arr[k][0], arr[k][1]);
		}
		theta += orientation * 2 * pi * arr[k][2];
	}
	
	theta = startangle;
	if(tick > 0) {
		for(k = 0; k < tick; k++) {
			draw_tick(centerx, centery, R, theta);
			theta += 2 * pi / tick;
		}
	}

	draw_circle(centerx, centery, R);

}


// obtains user input, for which fractions to model
function get_fraclist() {
	arr = [];
	str = numinput.value;
	fraclist = str.match(/\b\d*\/\d*\b/g);
	for(i = 0; i < fraclist.length; i++) {
		ab = fraclist[i].match(/\b\d+\b/g);
		if(ab.length == 2) {
			arr.push([Number(ab[0]), Number(ab[1]), Number(ab[0]) / Number(ab[1])]);
		}
	}
	return arr;
}


// obtains user input, for which ticks to mark
function get_ticknum() {
	var num = Number(tickinput.value);
	if(num != NaN) {
		return num;
	} else {
		return 0;
	}
}


// obtains user input, for how to color the fractions
function get_fraccolors() {
	str = fraccolorsinput.value;
	colorlist = str.match(/\b[\w[.!?''\\-]+\b/g);
	return colorlist;
}


// obtains user input for the start angle
function get_startangle() {
	return pi / 180 * Number(angleinput.value);
}


// obtains user input for the orientation
function get_orientation() {
	if(orientationselect.value == "CW") {
		return 1;
	} else {
		return -1;
	}
}


// main display function
function disp(centerx, centery, R) {
	clear();
	wheel(get_fraclist(), get_ticknum(), get_fraccolors(), get_startangle(), get_orientation(), centerx, centery, R);
}


disp(x, y, radius);
orientationselect.onchange = angleinput.oninput = fraccolorsinput.oninput = tickinput.oninput = numinput.oninput = function() { disp(x, y, radius); };



