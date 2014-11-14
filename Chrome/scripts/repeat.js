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
replayControlsStartInput.style.width = "40px";
replayControlsStartInput.style.height = "13px";
replayControls.appendChild(replayControlsStartInput);

var replayControlsSeparator = document.createElement("span");
replayControlsSeparator.innerHTML = "‒";
replayControlsSeparator.style.margin = "0 5px";
replayControls.appendChild(replayControlsSeparator);

var replayControlsEndLabel = document.createElement("span");
replayControlsEndLabel.innerHTML = "End:";
replayControlsEndLabel.style.marginRight = "3px";
replayControls.appendChild(replayControlsEndLabel);

var replayControlsEndInput = document.createElement("input");
replayControlsEndInput.type = "text";
replayControlsEndInput.id = "replayEnd";
replayControlsEndInput.style.width = "40px";
replayControlsEndInput.style.height = "13px";
replayControls.appendChild(replayControlsEndInput);

var repeater, currentURL = window.location.href, replayControlsOpacity;
var start = 0, end = video.duration, startInputValue, endInputValue;

replayButton.addEventListener("mouseover", function() {
	replayControlsShow();
	if(replayControlsStartInput.value == "") {
		replayControlsStartInput.value = video.duration > 3600 ? "0:00:00" : "0:00";
	}
	if(replayControlsEndInput.value == "") {
		replayControlsEndInput.value = secondsToString(video.duration);
	}
});
replayButton.addEventListener("mouseleave", function() {
	replayControlsHide();
});

replayButtonImage.addEventListener("mouseover", function() {
	replayButtonTooltip.style.top = (video.parentElement.offsetHeight + 3) + "px";
	replayButtonTooltip.style.left = (replayButton.offsetLeft + replayButton.offsetWidth - 16) + "px";
	replayButtonTooltip.style.display = "block";
});
replayButtonImage.addEventListener("mouseleave", function() {
	replayButtonTooltip.style.display = "none";
	
});

replayButtonImage.addEventListener("mouseup", function() {
	if(replayButton.className == "active") {
		deactivateRepeat();
	} else {
		start = stringToSeconds(replayControlsStartInput.value);
		end = stringToSeconds(replayControlsEndInput.value);
		activateRepeat();
	}
});

replayControlsStartInput.addEventListener("keydown", typeNumber, false);
replayControlsEndInput.addEventListener("keydown", typeNumber, false);

function activateRepeat() {
	replayButtonImage.src = chrome.extension.getURL("/images/repeat-active.png");
	replayControls.style.display = "block";
	replayButton.className = "active";
	repeater = setInterval(function() {
		if(end - video.currentTime <= 0.5 || video.ended) {
			video.currentTime = start;
			video.play();
		}
		if(currentURL != window.location.href) {
			deactivateRepeat();
			currentURL = window.location.href;
		}
	}, 500);
}

function deactivateRepeat() {
	replayButtonImage.src = chrome.extension.getURL("/images/repeat.png");
	replayButton.className = "";
	clearInterval(repeater);
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
	if(node.type=="text") {
		if(e.keyCode >= 48 && e.keyCode <= 57) {
			node.value += String.fromCharCode(e.keyCode);
			e.preventDefault();
			return false;
		} else if(e.keyCode == 13) {
			start = stringToSeconds(replayControlsStartInput.value);
			end = stringToSeconds(replayControlsEndInput.value);
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