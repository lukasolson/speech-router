# Speech Router

Speech Router is a wrapper around Chrome's speech recognition APIs. It enables you to declare "routes" (similar to [Backbone routes](http://backbonejs.org/#Router-routes)) which map speech to functionality within your application.

## Usage
```html
<html>
	<head>
		<script type="text/javascript" src="speech-router.js"></script>
		<script type="text/javascript">
			var router = new SpeechRouter({
				routes: {
					"go to youtube": "youtube",
					"say hello to :name": "sayHello",
					"search :engine for *query": "search"
				},
				
				youtube: function () {
					window.location.href = "http://google.com";
				},
				
				sayHello: function (name) {
					alert("Hi, " + (name || "there") + "!");
				},
				
				search: function (engine, query) {
					window.open("http://" + engine + ".com/search?q=" + query);
				}
			});
			
			router.start();
		</script>
	</head>
	<body></body>
</html>
```

## API

#### `new SpeechRouter(properties)`
Constructor. All `properties` will be copied onto the object. `properties` should contain a `routes` hash that maps formats to functions:
```javascript
new SpeechRouter({
	routes: {
		"search google for *query": function (query) {
			window.open("https://google.com/search?q=" + query);
		}
	}
});
```
The function can either be a string that maps to a function, or a declared function. The format can contain parameters:
- `:param` Matches any text not containing whitespace
- `*param` Matches any text (with/without spaces)
- `(optional)` Makes the selection optional (i.e., the route will fire the associated function regardless of whether or not the given text is found)

#### `route(transcript, callback)`
Associate the given callback function with the given format. This can be used to add routes on the fly. If the first argument is an object instead of a string, it is assumed that it is a hash of routes, similar what is expected in the constructor.
```javascript
router.route("say hello to :name", function (name) {
	alert("Hi, " + name + "!");
});
```

#### `trigger(transcript)`
Manually invoke the function associated with a transcript. This function is also used internally to invoke functions associated with a speech recognition transcript.
```javascript
router.trigger("say hello to Lukas");
```

#### `start()`
Starts speech recognition. This will bring up the default Chrome dialog to allow permission to access the user microphone. To prevent this dialog from occurring each time, use https instead of http.
```javascript
router.start();
```

#### `stop()`
Stops speech recognition.
```javascript
router.stop();
```