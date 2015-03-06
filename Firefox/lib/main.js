var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
pageMod.PageMod({
	include: "*.youtube.com",
	contentScriptFile: self.data.url("scripts/repeat.js"),
	contentScriptOptions: {
		"repeatImage": self.data.url("images/repeat.png"),
		"repeatActiveImage": self.data.url("images/repeat-active.png")
	}
});