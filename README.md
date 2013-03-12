# jQuery Text Counter Plugin

A jQuery plugin for counting and limiting characters/words on text input, or textarea, elements.

## Installation

Include script after the jQuery library:

```html
<script src="/path/to/textcounter.min.js"></script>
```

## Usage

Basic usage:

```javascript
$(input).textcounter();
```

Define maximum words and allow further input:

```javascript
$(input).textcounter({
	type: "word",
	max: 15,
	stopInputAtMaximum: false
});
```

Define minimum characters and set custom `countDownText`:

```javascript
$(input).textcounter({
	min: 20,
	countDownText: "Characters Left: "
});
```

## Elements

By default the plugin creates and appends the following element after the input:

```html
<div class="text-count-wrapper">
	Total Count:
	<span class="text-count">0</span>
</div>
```

If an error is present it is appended within the element. The input gains the `inputErrorClass` and count wrapper gains the `counterErrorClass` as defined in the options:

```html
<input name="sample" class="error" />
<div class="text-count-wrapper error">
	Total Count:
	<span class="text-count">0</span>
	<div class="error-text">Error message text</div>
</div>
```

### Options

```javascript
'type'					: "character",				// "character" or "word"
'min'					: 0,						// minimum number of characters/words
'max'					: 200,						// maximum number of characters/words, -1 for unlimited
'countContainerElement'	: "div",					// HTML element to wrap the text count in
'countContainerClass'	: "text-count-wrapper",		// class applied to the countContainerElement
'inputErrorClass'		: "error",					// error class appended to the input element if error occurs 
'counterErrorClass'		: "error",					// error class appended to the countContainerElement if error occurs 
'counterText'			: "Total Count: ",			// counter text
'errorTextElement'		: "div",					// error text element
'minimumErrorText'		: "Minimum not met",		// error message for minimum not met,
'maximumErrorText'		: "Maximum exceeded",		// error message for maximum range exceeded,
'displayErrorText'		: true,						// display error text messages for minimum/maximum values
'stopInputAtMaximum'	: true,						// stop further text input if maximum reached
'countSpaces'			: false,					// count spaces as character (only for "character" type)
'countDown'             : false,                    // if the counter should deduct from maximum characters/words rather than counting up
'countDownText'         : "Remaining: "             // count down text
```

## Development

- Source hosted at [GitHub](https://github.com/ractoon/jQuery-Text-Counter)
- Report issues, questions, feature requests on [GitHub Issues](https://github.com/ractoon/jQuery-Text-Counter/issues)


## Authors

[ractoon](http://www.ractoon.com)