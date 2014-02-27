/*!
* jQuery Text Counter Plugin v0.2.1
* https://github.com/ractoon/jQuery-Text-Counter
*
* Copyright 2014 ractoon
* Released under the MIT license
*/
;(function($) {
    $.textcounter = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("textcounter", base);

        base.init = function() {
            base.options = $.extend({}, $.textcounter.defaultOptions, options);

            // append the count element
            var counterText = base.options.countDown ? base.options.countDownText : base.options.counterText,
                counterNum = base.options.countDown ? base.options.max : 0;

            base.$el.after('<' + base.options.countContainerElement + ' class="' + base.options.countContainerClass + '">' + counterText + '<span class="text-count">' + counterNum + '</span></' + base.options.countContainerElement + '>');

            // bind input events
            base.$el.bind('keyup.textcounter click.textcounter blur.textcounter focus.textcounter change.textcounter paste.textcounter', base.checkLimits).trigger('click.textcounter');
        };

        base.checkLimits = function(e) {
            var $this = base.$el,
                $countEl = $this.next('.' + base.options.countContainerClass),
                $text = $this.val(),
                textCount = 0,
                textTotalCount = 0,
                eventTriggered =  e.originalEvent === undefined ? false : true;

            if (base.options.type == "word") {  // word count
                textCount = $text.replace(/\s+/g," ").split(' ').length;

                if ($this.val() === '') {
                    textCount = 0;
                }
            }
            else {  // character count
                if (base.options.countSpaces) { // if need to count spaces
                    textCount = $text.replace(/\n/g, "\r\n").length;
                }
                else {
                    textCount = $text.replace(/\s/g, '').length;
                }

                if (base.options.countExtendedCharacters) {
                    var extended = $text.match(/[^\x00-\xff]/gi);

                    if (extended == null) {
                        textCount = $text.length;
                    } else {
                        textCount = $text.length + extended.length;
                    }
                }
            }

            // if max is auto retrieve value
            if (base.options.max == 'auto') {
                var max = base.$el.attr('maxlength');

                if (typeof max !== 'undefined' && max !== false) {
                    base.options.max = max;
                }
                else {
                    base.$el.next('.' + base.options.countContainerClass).text('error: [maxlength] attribute not set');
                }
            }

            // if this is a countdown counter deduct from the max characters/words
            textTotalCount = base.options.countDown ? base.options.max - textCount : textCount;

            // set the current text count
            base.setCount(textTotalCount);

            if (base.options.min > 0 && eventTriggered) {   // if a minimum value has been set
                if (textCount < base.options.min) {
                    base.setErrors('min');
                }
                else if (textCount >= base.options.min) {
                    base.clearErrors('min');
                }
            }

            if (base.options.max !== -1) {  // if a maximum value has been set
                if (textCount > base.options.max && base.options.max != 0) {
                    base.options.onMaxReached(base.el);  // trigger the event
                    if (base.options.stopInputAtMaximum) {  // if the string should be trimmed at the maximum length
                        var trimmedString = '';

                        if (base.options.type == "word") {  // word type
                            var wordArray = $text.split(/[\s\.\?]+/);

                            for (var i = 0; i < base.options.max; i++) {
                                trimmedString += wordArray[i] + ' ';
                            }
                        }
                        else {  // character type
                            if (base.options.countSpaces) {     // if spaces should be counted
                                trimmedString = $text.substring(0, base.options.max);
                            }
                            else {
                                var charArray = $text.split(''),
                                    totalCharacters = charArray.length,
                                    charCount = 0,
                                    i = 0;

                                while (charCount < base.options.max && i < totalCharacters) {
                                    if (charArray[i] !== ' ') charCount++;
                                    trimmedString += charArray[i++];
                                }
                            }
                        }

                        $this.val(trimmedString);

                        textTotalCount = base.options.countDown ? 0 : base.options.max;
                        base.setCount(textTotalCount);
                    } else {
                        base.setErrors('max');
                    }
                }
                else {
                    base.clearErrors('max');    
                }
            }
        };

        base.setCount = function(count) {
            var $this = base.$el,
                $countEl = $this.next('.' + base.options.countContainerClass);

            $countEl.children('.text-count').text(count);
        };

        base.setErrors = function(type) {
            var $this = base.$el,
                $countEl = $this.next('.' + base.options.countContainerClass);

            $this.addClass(base.options.inputErrorClass);
            $countEl.addClass(base.options.counterErrorClass);

            if (base.options.displayErrorText) {
                switch(type) {
                    case 'min':
                        errorText = base.options.minimumErrorText;
                        break;
                    case 'max':
                        errorText = base.options.maximumErrorText;
                        break;
                }

                if (!$countEl.children('.error-text-' + type).length) {
                    $countEl.append('<' + base.options.errorTextElement + ' class="error-text error-text-' + type + '">' + errorText + '</' + base.options.errorTextElement + '>');
                }
            }
        };

        base.clearErrors = function(type) {
            var $this = base.$el,
                $countEl = $this.next('.' + base.options.countContainerClass);

            $countEl.children('.error-text-' + type).remove();

            if ($countEl.children('.error-text').length == 0) {
                $this.removeClass(base.options.inputErrorClass);
                $countEl.removeClass(base.options.counterErrorClass);
            }
        };

        // kick it off
        base.init();
    };

    $.textcounter.defaultOptions = {
        'type'                      : "character",                          // "character" or "word"
        'min'                       : 0,                                    // minimum number of characters/words
        'max'                       : 200,                                  // maximum number of characters/words, -1 for unlimited, 'auto' to use maxlength attribute
        'countContainerElement'     : "div",                                // HTML element to wrap the text count in
        'countContainerClass'       : "text-count-wrapper",                 // class applied to the countContainerElement
        'inputErrorClass'           : "error",                              // error class appended to the input element if error occurs 
        'counterErrorClass'         : "error",                              // error class appended to the countContainerElement if error occurs 
        'counterText'               : "Total Count: ",                      // counter text
        'errorTextElement'          : "div",                                // error text element
        'minimumErrorText'          : "Minimum not met",                    // error message for minimum not met,
        'maximumErrorText'          : "Maximum exceeded",                   // error message for maximum range exceeded,
        'displayErrorText'          : true,                                 // display error text messages for minimum/maximum values
        'stopInputAtMaximum'        : true,                                 // stop further text input if maximum reached
        'countSpaces'               : false,                                // count spaces as character (only for "character" type)
        'countDown'                 : false,                                // if the counter should deduct from maximum characters/words rather than counting up
        'countDownText'             : "Remaining: ",                        // count down text
        'countExtendedCharacters'   : false,                                 // count extended UTF-8 characters as 2 bytes (such as Chinese characters)
        'onMaxReached'              : function(el) {                         // Event to deal when max limit is reached. We cannot use 'this' inside it so just pass the el 
                                        console.log('max readched');
                                    }
    };

    $.fn.textcounter = function(options) {
        return this.each(function() {
            new $.textcounter(this, options);
        });
    };

})(jQuery);