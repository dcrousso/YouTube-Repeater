# ![YouTube Repeater](https://github.com/dcrousso/YouTube-Repeater/raw/master/Icons/icon-48.png) YouTube Repeater 

### Releases

Browser | Link | Version | Source Code
------- | ---- | ------- | -----------
Chrome | [Web Store](//chrome.google.com/webstore/detail/youtube-repeater/ihlfngkojddkjkdlmgkbdpkfkafclhnj) | 2.0.0 | [github folder](//github.com/dcrousso/YouTube-Repeater/tree/master/Chrome)
Firefox | [Add-Ons](//addons.mozilla.org/en-US/firefox/addon/youtube-repeater/) | 2.0.0 | [github folder](//github.com/dcrousso/YouTube-Repeater/tree/master/Firefox)
Safari| [download](//devinrousso.com/projects/YouTube-Repeater/YouTube-Repeater.safariextz) | 2.0.0 | [github folder](//github.com/dcrousso/YouTube-Repeater/tree/master/Safari)

### Changelog

###### Version 2.0:
 - Repeat start/end timer now automatically resets on new video
 - If the value of the start/end input box is not a number, simply hovering over the repeat icon will reset its value to default

###### Version 1.5:
 - You can now send repeats to friends with this plugin installed by adding #r=true to the video's URL
  - For more control, add &rs=### and &re=### for the start and end times of the repeat
  - This will automatically be added to the URL when enabling repeat via the button under the video
 - When the start/end/loops input is selected, pressing enter will activate repeat with the current values
 - Changing the start/end times when repeat is active now updates the URL

###### Version 1.4:
 - Fixed Tooltip positioning (response to YouTube update)
 - Added option to set number of loops when repeating
  - Set to any value less than 1 to infinitely repeat or don't change the default value

###### Version 1.3:
 - Start/End times are now updated when the enter key is pressed

###### Version 1.2:
 - Added ability to choose repeat start and end times
  - Defaults to start and end of video
 - Actually fixed Tooltip placement (for real this time)

###### Version 1.1:
 - Fixed Tooltip Placement

###### Version 1.0:
 - Created Extension
 - Includes mouseover tooltip