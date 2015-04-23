##todo
[X] save data
[-] fix bug on focus input (tepoary fix with delay)
[x] auto scroll to first screen on start
[x] remove player
[x] color bugs
[X] analysis bug on pause

#Web app, with WAH
Tutorial on appcache [here](http://www.html5rocks.com/en/tutorials/appcache/beginner/)

The purpose of this snippet is to have a basic structure for building a webapp with offline functionnality.
It handles the creation and update of the manifest, livereload, and uses WAH.js (homemade library).

##Build
```bash
npm install
gulp
```
First time, you need to exit gulp (Ctrl-c) then relaunch it for the auto-reload to work
```bash
gulp
```

##Minimal Web App
The microApp itself features a text field allowing you to type in the name of a new 'player', which will be added to the local storage (saved for later use)

##Basics of web app caching
- Create a cache.manifest file:

```bash
CACHE MANIFEST

CACHE:
index.html
style.css
assets/img.jpg
assets/img2.jpg
#etc

# This is basic, see linked tuto for more details
# a comment (hash) can be used to update the file even if no new ressource is added:

# hash: ef0b33109167e833c80fdc5f9972785781b74db575391c7357506f54e134635f
```
- Link the manifest file in your html page:

```html
	<html manifest="cache.manifest">
	<head>
		<title>
			...
```
- **CAUTION**: once the cache has been loaded, there are 2 common things that could prevent the page from displaying your updates:
	- The manifest file was sent (the previous time) with a expiration date that is not over yet. prevent this with a .htaccess file:

	```bash
	ExpiresActive On
	ExpiresDefault "access"
	```
	- The manifest file was not modified and saved: **Updating a file listed in the manifest is not enough for the browser to re-cache**

##Web App Handler (WAH)
The **Web App Handler** (WAH) is used for handling the cache / reload(update) process and the saving / reading / parsing of the data.

###Ho to use:
- Add the WAH.js script to your html

```html
	<script type="text/javascript" src="WAH.js"></script>
```
- Make shure you have completed the steps above (Basics of web app caching)
- good to go!

###Features:
- auto update the app(silent or with suggestion banner)
- creates an info banner for notifying updates (in non-silent mode)
- read / write data to local storage.
	- automatic parsing of: null, undefined, booleans, ints, strings (plus function, array and json when saving)
	- preset parsers:
		- function
		- json
		- array
	- default parsers can be overriden with custom functions (stringify function in object or via a parameter on read() and write() functions)
- reset function, to clear the whole localStorage

###settings (WAH.settings.?)
- updateIntervalLength	(0 means no update)
- silentUpdate			(do(not) ask the user if he wants to update)
- updateBannerText		(text for the update banner)
- verbose				(do(not) display debug logs)
- autoStart				(do(not) init the WAH automatically)

### examples

writing / parsing data. (parsing is needed because data is actually saved as strings)
```javascript
	WAH.write("playerName", "Jo") //saves value 'jo' to slot playerName.
	WAH.write("playerName", Jo) //saves either the return value of jo.stringify(), or a json representation of that object
	WAH.write("playerName", Jo, myParser) //saves the return value of myParser(Jo)
	WAH.write("favoriteNumbers", [2,3,4], "array") //saves the given array using the preset parser "array"
```
reading / parsing data.
```javascript
	WAH.read("myValue") // returns the raw (text) data saved as 'myValue' (or true, false, null, undefined if the data was "true", "false", "null" or "undefined")
	WAH.read("myValue", "array") // returns my value as an array ("coucou, -1, 3.2, je" becomes ["coucou",-1,3.2,"je"]), or an empty array if 'myValue' is empty or undefined.
	WAH.read("myValue", myParser) // returns the return value of myParser(value_of_myValue)
```
erasing all saved data
```javascript
WAH.reset()
```