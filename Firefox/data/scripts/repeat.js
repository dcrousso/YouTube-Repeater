var video, videoControls, imageRepeat, imageRepeatActive, currentVideo;
var videoAvailable = setInterval(function() {
	video = document.getElementsByClassName("html5-main-video")[0];
	videoControls = document.getElementsByClassName("ytp-chrome-controls")[0];
	if(document.location.search.indexOf("?v=") >= 0 && video != undefined && videoControls.children.length > 0) {
		generateRepeatControls();
		clearInterval(videoAvailable);
	}
}, 100);

var repeater, replayControlsInterval, replayControlsOpacity, start, end, loops, startInputValue, endInputValue;
var replayButton, replayButtonImage, replayControls, replayControlsStartInput, replayControlsEndInput, replayControlsNumberInput;

function generateRepeatControls() {
	imageRepeat = self.options.repeatImage;
	imageRepeatActive = self.options.repeatActiveImage;

	replayButton = document.createElement("div");
	replayButton.id = "replayButton";
	replayButton.setAttribute("role", "button");
	replayButton.style.height = "100%";
	replayButton.style.float = "right";
	replayButton.style.cursor = "pointer";
	videoControls.appendChild(replayButton);

	replayButtonImage = document.createElement("img");
	replayButtonImage.style.boxSizing = "border-box";
	replayButtonImage.style.height = "100%";
	replayButtonImage.style.float = "right";
	replayButtonImage.style.padding = "4px 0";
	replayButtonImage.src = imageRepeat;
	replayButton.appendChild(replayButtonImage);

	var replayButtonTooltip = document.createElement("div");
	replayButtonTooltip.id = "replayButtonTooltip";
	replayButtonTooltip.className = "ytp-tooltip";
	replayButtonTooltip.style.display = "none";
	document.getElementsByClassName("html5-video-player")[0].appendChild(replayButtonTooltip);

	var replayButtonTooltipBody = document.createElement("div");
	replayButtonTooltipBody.className = "ytp-tooltip-body";
	replayButtonTooltipBody.style.left = "-22.5px";
	replayButtonTooltipBody.style.padding = "5px 8px";
	replayButtonTooltipBody.style.backgroundColor = "rgba(28,28,28,0.8)";
	replayButtonTooltipBody.style.borderRadius = "2px";
	replayButtonTooltip.appendChild(replayButtonTooltipBody);

	var replayButtonTooltipBodyText = document.createElement("div");
	replayButtonTooltipBodyText.className = "ytp-text-tooltip";
	replayButtonTooltipBodyText.textContent = "Repeat";
	replayButtonTooltipBody.appendChild(replayButtonTooltipBodyText);

	replayControls = document.createElement("div");
	replayControls.id = "replayControls";
	replayControls.style.display = "none";
	replayControls.style.height = "100%";
	replayControls.style.float = "right";
	replayControls.style.alignItems = "center";
	replayControls.style.opacity = "0";
	replayButton.appendChild(replayControls);

	replayControlsStartInput = document.createElement("input");
	replayControlsStartInput.type = "text";
	replayControlsStartInput.id = "replayStart";
	replayControlsStartInput.style.width = "28px";
	replayControlsStartInput.style.height = "13px";
	replayControls.appendChild(replayControlsStartInput);

	var replayControlsTimeSeparator = document.createElement("span");
	replayControlsTimeSeparator.textContent = "\u2014";
	replayControlsTimeSeparator.style.margin = "0 5px";
	replayControlsTimeSeparator.style.paddingTop = "2px";
	replayControlsTimeSeparator.style.fontSize = "12px";
	replayControls.appendChild(replayControlsTimeSeparator);

	replayControlsEndInput = document.createElement("input");
	replayControlsEndInput.type = "text";
	replayControlsEndInput.id = "replayEnd";
	replayControlsEndInput.style.height = "13px";
	replayControls.appendChild(replayControlsEndInput);

	var replayControlsNumberLabel = document.createElement("span");
	replayControlsNumberLabel.textContent = "Loops: ";
	replayControlsNumberLabel.style.margin = "0 3px 0 10px";
	replayControlsNumberLabel.style.paddingTop = "2px";
	replayControlsNumberLabel.style.fontSize = "12px";
	replayControls.appendChild(replayControlsNumberLabel);

	var replayControlsNumberInput = document.createElement("input");
	replayControlsNumberInput.type = "text";
	replayControlsNumberInput.id = "replayLimit";
	replayControlsNumberInput.style.width = "10px";
	replayControlsNumberInput.style.height = "13px";
	replayControlsNumberInput.value = "∞";
	replayControls.appendChild(replayControlsNumberInput);

	start = 0;
	end = video.duration;

	checkURLHash();
	detectNewVideo(document.getElementById("content"), function() {
		replayControlsStartInput.value = "";
		replayControlsEndInput.value = "";
		currentVideo = window.location.search;
	});

	var inputRegExp = new RegExp(/^(\d+:)?(\d{1,2}:)(\d{1,2})$/);
	replayButton.addEventListener("mouseover", function() {
		replayControlsShow();
		if(replayControlsStartInput.value === "" || !inputRegExp.test(replayControlsStartInput.value)) {
			replayControlsStartInput.value = video.duration > 3600 ? "0:00:00" : "0:00";
			replayControlsStartInput.style.width = (replayControlsStartInput.value.length * 6 + 4) + "px";
		}
		if(replayControlsEndInput.value === "" || !inputRegExp.test(replayControlsEndInput.value)) {
			replayControlsEndInput.value = secondsToString(video.duration);
			replayControlsEndInput.style.width = (replayControlsEndInput.value.length * 6 + 4) + "px";
		}
	});
	replayButton.addEventListener("mouseleave", replayControlsHide);

	replayButtonImage.addEventListener("mouseover", function() {
		replayButtonTooltip.style.bottom = (videoControls.parentElement.offsetHeight + (replayButtonTooltip.offsetHeight / 2) + 10) + "px";
		replayButtonTooltip.style.left = (replayButtonImage.offsetLeft + (replayButtonImage.offsetWidth / 2) - (replayButtonTooltip.offsetWidth / 2) - 12) + "px";
		replayButtonTooltip.style.display = "block";
	});
	replayButtonImage.addEventListener("mouseleave", function() {
		replayButtonTooltip.style.display = "none";
	});
	replayButtonImage.addEventListener("click", function() {
		if(replayButton.className === "active") {
			deactivateRepeat();
		} else {
			start = stringToSeconds(replayControlsStartInput.value);
			end = stringToSeconds(replayControlsEndInput.value);
			activateRepeat();
		}
	});

	replayControlsStartInput.addEventListener("keydown", typeNumber);
	replayControlsEndInput.addEventListener("keydown", typeNumber);
	replayControlsNumberInput.addEventListener("keydown", typeNumber);
}

function activateRepeat() {
	replayButtonImage.src = imageRepeatActive;
	replayControls.style.display = "flex";
	replayButton.className = "active";
	addURLHash();
	repeater = setInterval(function() {
		if(end - video.currentTime <= 0.1 || video.ended || video.currentTime < start) {
			video.currentTime = start;
			video.play();
			loops--;
		}
		if(loops === 0 || window.location.hash.indexOf("r=true") < 0) {
			deactivateRepeat();
		}
	}, 100);
}

function deactivateRepeat() {
	replayButtonImage.src = imageRepeat;
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
	var startAt = window.location.search.match(/(\d{1,2}(h|m|s))/g);
	if(startAt && startAt.length > 0) {
		startAt.reverse();
		var seconds = parseInt(startAt[0]);
		if(startAt.length > 1) {
			seconds += parseInt(startAt[1]) * 60;
			if(startAt.length > 2) {
				seconds += parseInt(startAt[2]) * 3600;
			}
		}
		replayControlsStartInput.value = secondsToString(seconds);
		replayControlsStartInput.style.width = (replayControlsStartInput.value.length * 6 + 4) + "px";
	}
}

function addURLHash() {
	window.location.hash = window.location.hash.replace(/((&|#)r=true)(&r(s|e)=\d+){0,2}/, "") + "r=true";
	if(start > 0) {
		window.location.hash += "&rs=" + start;
	}
	if(Math.abs(video.duration - end) > 1 && !isNaN(end)) {
		window.location.hash += "&re=" + end;
	}
}

function replayControlsShow() {
	replayControls.style.display = "flex";
	clearInterval(replayControlsInterval);
	replayControlsInterval = setInterval(function() {
		replayControlsOpacity = parseFloat(replayControls.style.opacity);
		replayControls.style.opacity = replayControlsOpacity + 0.1;
		if(replayControlsOpacity.toFixed(2) >= 1) {
			replayControls.style.opacity = 1;
			clearInterval(replayControlsInterval);
		}
	}, 5);
}

function replayControlsHide() {
	clearInterval(replayControlsInterval);
	replayControlsInterval = setInterval(function() {
		replayControlsOpacity = parseFloat(replayControls.style.opacity);
		replayControls.style.opacity = replayControlsOpacity - 0.1;
		if(replayControlsOpacity.toFixed(2) <= 0.1) {
			replayControls.style.opacity = 0;
			replayControls.style.display = "none";
			clearInterval(replayControlsInterval);
		}
	}, 5);
}

function detectNewVideo(element, callback) {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	currentVideo = window.location.search;
	if(MutationObserver) {
		var obs = new MutationObserver(function(mutations, observer) {
			if(mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
				if(window.location.search !== currentVideo) {
					callback();
				}
			}
		});
		obs.observe(element, {childList: true, subtree: true});
	} else {
		element.addEventListener("DOMNodeInserted", callback);
		element.addEventListener("DOMNodeRemoved", callback);
	}
}

function typeNumber(e) {
	var node = (e.target) ? e.target : e.srcElement;
	if(e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 37 || e.keyCode === 39) {
		e.stopPropagation();
		return true;
	} else if((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 13 && e.keyCode !== 186) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	} else {
		if(e.keyCode === 13) {
			start = stringToSeconds(replayControlsStartInput.value);
			end = stringToSeconds(replayControlsEndInput.value);
			loops = parseInt(document.getElementById("replayLimit").value) || -1;
			if(loops < 1) {
				document.getElementById("replayLimit").value = "∞";
				loops = -1;
			}
			if(replayButton.className.indexOf("active") < 0) {
				activateRepeat();
			} else {
				addURLHash();
			}
		} else {
			var selection = node.selectionStart;
			var prefix = node.value.substring(0, selection);
			var suffix = node.value.substring(selection);
			node.value = prefix + (e.keyCode === 186 ? ":" : String.fromCharCode(e.keyCode)) + suffix;
			node.style.width = (node.value.length * 6 + 4) + "px";
			node.selectionStart = node.selectionEnd = selection + 1;
		}
		e.preventDefault();
		e.stopPropagation();
		return true;
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