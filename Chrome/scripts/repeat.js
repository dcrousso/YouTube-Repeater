var video = document.getElementsByClassName("html5-main-video")[0];
var videoControls = document.getElementsByClassName("html5-player-chrome")[0];

var replayButton = document.createElement("div");
replayButton.id = "replayButton";
replayButton.setAttribute("role", "button");
replayButton.style.float = "right";
replayButton.style.height = "27px";
replayButton.style.cursor = "pointer";
videoControls.appendChild(replayButton);

var replayButtonImage = document.createElement("img");
replayButtonImage.style.float = "right";
replayButtonImage.src = chrome.extension.getURL("/images/repeat.png");
replayButton.appendChild(replayButtonImage);

var replayButtonTooltip = document.createElement("div");
replayButtonTooltip.id = "replayButtonTooltip";
replayButtonTooltip.className = "ytp-tooltip";
document.getElementsByClassName("html5-video-player")[0].appendChild(replayButtonTooltip);

var replayButtonTooltipBody = document.createElement("div");
replayButtonTooltipBody.className = "ytp-tooltip-body";
replayButtonTooltipBody.style.left = "-22.5px";
replayButtonTooltip.appendChild(replayButtonTooltipBody);

var replayButtonTooltipBodyText = document.createElement("div");
replayButtonTooltipBodyText.className = "ytp-text-tooltip";
replayButtonTooltipBodyText.innerHTML = "Repeat";
replayButtonTooltipBody.appendChild(replayButtonTooltipBodyText);

var replayButtonTooltipArrow = document.createElement("div");
replayButtonTooltipArrow.className = "ytp-tooltip-arrow";
replayButtonTooltip.appendChild(replayButtonTooltipArrow);

var replayControls = document.createElement("div");
replayControls.id = "replayControls";
replayControls.style.display = "none";
replayControls.style.float = "right";
replayControls.style.lineHeight = "27px";
replayControls.style.opacity = "0";
replayButton.appendChild(replayControls);

var replayControlsStartLabel = document.createElement("span");
replayControlsStartLabel.innerHTML = "Start:";
replayControlsStartLabel.style.marginRight = "3px";
replayControls.appendChild(replayControlsStartLabel);

var replayControlsStartInput = document.createElement("input");
replayControlsStartInput.type = "text";
replayControlsStartInput.id = "replayStart";
replayControlsStartInput.style.height = "13px";
replayControls.appendChild(replayControlsStartInput);

var replayControlsTimeSeparator = document.createElement("span");
replayControlsTimeSeparator.innerHTML = "‒";
replayControlsTimeSeparator.style.margin = "0 5px";
replayControls.appendChild(replayControlsTimeSeparator);

var replayControlsEndLabel = document.createElement("span");
replayControlsEndLabel.innerHTML = "End:";
replayControlsEndLabel.style.marginRight = "3px";
replayControls.appendChild(replayControlsEndLabel);

var replayControlsEndInput = document.createElement("input");
replayControlsEndInput.type = "text";
replayControlsEndInput.id = "replayEnd";
replayControlsEndInput.style.height = "13px";
replayControls.appendChild(replayControlsEndInput);

var replayControlsNumberLabel = document.createElement("span");
replayControlsNumberLabel.innerHTML = "Loops: ";
replayControlsNumberLabel.style.margin = "0 3px 0 15px";
replayControls.appendChild(replayControlsNumberLabel);

var replayControlsNumberInput = document.createElement("input");
replayControlsNumberInput.type = "text";
replayControlsNumberInput.id = "replayLimit";
replayControlsNumberInput.style.width = "10px";
replayControlsNumberInput.style.height = "13px";
replayControlsNumberInput.value = "∞";
replayControls.appendChild(replayControlsNumberInput);

var repeater, replayControlsOpacity;
var start = 0, end = video.duration, loops, startInputValue, endInputValue;

document.getElementsByTagName("body")[0].addEventListener("load", checkURLHash());

replayButton.addEventListener("mouseover", function() {
	replayControlsShow();
	if(replayControlsStartInput.value === "") {
		replayControlsStartInput.value = video.duration > 3600 ? "0:00:00" : "0:00";
		replayControlsStartInput.style.width = (replayControlsStartInput.value.length * 6 + 4) + "px";
	}
	if(replayControlsEndInput.value === "") {
		replayControlsEndInput.value = secondsToString(video.duration);
		replayControlsEndInput.style.width = (replayControlsEndInput.value.length * 6 + 4) + "px";
	}
});
replayButton.addEventListener("mouseleave", replayControlsHide);

replayButtonImage.addEventListener("mouseover", function() {
	replayButtonTooltip.style.top = (video.parentElement.offsetHeight + 3) + "px";
	replayButtonTooltip.style.left = (replayButton.offsetLeft + replayButton.offsetWidth - 15) + "px";
	replayButtonTooltip.style.display = "block";
});
replayButtonImage.addEventListener("mouseleave", function() {
	replayButtonTooltip.style.display = "none";
});
replayButtonImage.addEventListener("mouseup", function() {
	if(replayButton.className === "active") {
		deactivateRepeat();
	} else {
		start = stringToSeconds(replayControlsStartInput.value);
		end = stringToSeconds(replayControlsEndInput.value);
		activateRepeat();
	}
});

replayControlsStartInput.addEventListener("keydown", typeNumber, false);
replayControlsEndInput.addEventListener("keydown", typeNumber, false);
replayControlsNumberInput.addEventListener("keydown", typeNumber, false);

function activateRepeat() {
	replayButtonImage.src = chrome.extension.getURL("/images/repeat-active.png");
	replayControls.style.display = "block";
	replayButton.className = "active";
	window.location.hash = window.location.hash.replace(/((&|#)r=true)(&r(s|e)=\d+){0,2}/, "") + "r=true";
	if(start > 0) {
		window.location.hash += "&rs=" + start;
	}
	if(end < video.duration || !isNaN(end)) {
		window.location.hash += "&re=" + end;
	}
	var count = loops;
	repeater = setInterval(function() {
		if(end - video.currentTime <= 0.1 || video.ended || video.currentTime < start) {
			video.currentTime = start;
			video.play();
		}
		if(count === 0 || window.location.hash.indexOf("r=true") === -1) {
			deactivateRepeat();
		}
		count--;
	}, 100);
}

function deactivateRepeat() {
	replayButtonImage.src = chrome.extension.getURL("/images/repeat.png");
	replayButton.className = "";
	if(window.location.hash.indexOf("r=true") === -1) {
		replayControlsStartInput.value = "";
		replayControlsEndInput.value = "";
	} else {
		window.location.hash = window.location.hash.replace(/((&|#)r=true)(&r(s|e)=\d+){0,2}/, "");
	}
	clearInterval(repeater);
}

function checkURLHash() {
	var hash = window.location.hash;
	if(hash.indexOf("r=true") > -1) {
		var repeatStart = hash.indexOf("rs=");
		if(repeatStart > -1) {
			if(hash.indexOf("&", repeatStart) > -1) {
				start = hash.substring(repeatStart + 3, hash.indexOf("&", repeatStart));
			} else {
				start = hash.substring(repeatStart + 3);
			}
			replayControlsStartInput.value = secondsToString(start);
			replayControlsStartInput.style.width = (replayControlsStartInput.value.length * 6 + 4) + "px";
		} else {
			start = 0;
			replayControlsStartInput.value = "";
		}
		var repeatEnd = hash.indexOf("re=");
		if(repeatEnd > -1) {
			if(hash.indexOf("&", repeatEnd) > -1) {
				end = hash.substring(repeatEnd + 3, hash.indexOf("&", repeatEnd));
			} else {
				end = hash.substring(repeatEnd + 3);
			}
			replayControlsEndInput.value = secondsToString(end);
			replayControlsEndInput.style.width = (replayControlsEndInput.value.length * 6 + 4) + "px";
		} else {
			end = video.duration;
			replayControlsEndInput.value = "";
		}
		activateRepeat();
	} else {
		deactivateRepeat();
	}
}

function replayControlsShow() {
	replayControls.style.display = "block";
	var interval = setInterval(function() {
		replayControlsOpacity = parseFloat(replayControls.style.opacity);
		replayControls.style.opacity = replayControlsOpacity + 0.1;
		if(replayControlsOpacity >= 1) {
			replayControls.style.opacity = 1;
			clearInterval(interval);
		}
	}, 5);
}

function replayControlsHide() {
	var interval = setInterval(function() {
		replayControlsOpacity = parseFloat(replayControls.style.opacity);
		replayControls.style.opacity = replayControlsOpacity - 0.1;
		if(replayControlsOpacity <= 0) {
			replayControls.style.opacity = 0;
			replayControls.style.display = "none";
			clearInterval(interval);
		}
	}, 5);
}

function typeNumber(e) {
	var e = (e) ? e : ((event) ? event : null); 
	var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null); 
	if(node.type==="text") {
		if(e.keyCode >= 48 && e.keyCode <= 57) {
			node.value += String.fromCharCode(e.keyCode);
			e.preventDefault();
			node.style.width = (node.value.length * 6 + 4) + "px";
			return false;
		} else if(e.keyCode === 13) {
			start = stringToSeconds(replayControlsStartInput.value);
			end = stringToSeconds(replayControlsEndInput.value);
			if(loops < 1 || replayControlsNumberInput.value === "∞") {
				replayControlsNumberInput.value = "∞"
				loops = -1;
			} else {
				loops = parseInt(replayControlsNumberInput.value);
			}
		}
	}
}

function stringToSeconds(time) {
	var smh = time.split(":"), seconds = 0;
	for(var i = 0; i < smh.length; i++) {
		seconds += smh[i] * Math.pow(60, smh.length - 1 - i);
	}
	return seconds;
}

function secondsToString(time) {
	var string = "";
	if(time >= 60) {
		var smh = [];
		while(parseInt(time) > 0) {
			smh.push(parseInt(time % 60));
			time /= 60;
		}
		for(var i = smh.length - 1; i >= 0; i--) {
			var t = smh[i];
			string += (i != smh.length - 1 && t < 10) ? "0" + t : t;
			if(i > 0) {
				string += ":"; 
			}
		}
	} else {
		string = "0:" + parseInt(time);
	}
	return string;
}