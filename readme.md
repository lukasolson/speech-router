# Speech Router

Speech Router is a wrapper around Chrome's speech recognition APIs. It enables you to declare "routes" (similar to [Backbone routes](http://backbonejs.org/#Router-routes)) which map speech to functionality within your application.

## Usage
```html
<html>
	<head>
		<script type="text/javascript" src="speech-router.js"></script>
		<script type="text/javascript">
			var router = new SpeechRouter({
				"go to google": function () {
					window.location.href = "http://google.com";
				},
				
				"say hello( to :name)": function (name) {
					alert("Hi, " + (name || "there") + "!");
				},
				
				"search :engine for *query": "arbitrarySearch",
				
				arbitrarySearch: function (engine, query) {
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

#### `new SpeechRouter(routes)`
Constructor. Pass in all routes as desired. A route maps a potential transcript to a function in your router or to a direct function definition (see example above). The transcripts can contain parameters:
- `:param` Matches any text not containing whitespace
- `*param` Matches any text (with/without spaces)
- `(something)` Makes the selection optional (i.e., the route will fire the associated function regardless of whether or not the given text is found)

#### `start()`
Starts speech recognition. This will bring up the default Chrome dialog to allow permission to access the user microphone.

#### `stop()`
Stops speech recognition.

#### `route(transcript)`
Invoke the function associated with any arbitrary transcript (not just those from speech recognition). This is used internally to route a speech recognition transcript to a function.