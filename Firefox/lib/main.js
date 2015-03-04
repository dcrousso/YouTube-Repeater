var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
pageMod.PageMod({
	include: "*.youtube.com",
	contentScriptFile: self.data.url("scripts/repeat.js"),
	onAttach: function(worker) {
		worker.port.emit("repeat", self.data.url("images/repeat.png"));
		worker.port.emit("repeat-active", self.data.url("images/repeat-active.png"));
	}
});