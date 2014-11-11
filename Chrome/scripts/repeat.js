var video = document.getElementsByClassName("html5-main-video")[0];

var replayButton = document.createElement("div");
replayButton.id = "replayButton";
replayButton.setAttribute("role", "button");
replayButton.style.float = "right";
replayButton.style.height = "27px";
replayButton.style.cursor = "pointer";
document.getElementsByClassName("html5-player-chrome")[0].appendChild(replayButton);

var replayButtonImage = document.createElement("img");
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

replayButton.addEventListener("mouseover", function() {
	replayButtonTooltip.style.top = (parseInt(video.style.height.replace("px", "")) + 3) + "px";
	replayButtonTooltip.style.left = (parseInt(video.style.width.replace("px", "")) - 136) + "px";
	replayButtonTooltip.style.display = "block";
});
replayButton.addEventListener("mouseleave", function() {
	replayButtonTooltip.style.display = "none";
});

var repeater;
replayButton.addEventListener("mouseup", function() {
	if(replayButton.className == "active") {
		replayButtonImage.src = chrome.extension.getURL("/images/repeat.png");
		replayButton.className = "";
		clearInterval(repeater);
	} else {
		replayButtonImage.src = chrome.extension.getURL("/images/repeat-active.png");
		replayButton.className = "active";
		repeater = setInterval(function() {
			if(video.duration - video.currentTime <= 0.5 || video.ended) {
				video.currentTime = 0;
				video.play();
			}
		}, 500);
	}
});