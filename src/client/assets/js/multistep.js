;(function($, window, document, undefined) {
    "use strict";

    // Default settings
    var defaults = {
        theme: 'default',
        selected: 0, // 0 = first
        keyController: true, // Enable/Disable keyboard controller
        navigation: {
            next: 'Next', // Next button text
            prev: 'Previous', // Previous button text
            submit: 'Submit', // Submit button text
            btnNext: true, // Next button show/hide
            btnPrev: true, // Previous button show/hide
            btnSubmit: true, // Submit button show/hide
            onSend: function() {
                // Form on send function
            }
        },
        message: {
            required: 'This field is required.', // Default validation message
            email: 'Please enter a valid email address.', // Email validation message
            phone: 'Please enter a valid phone number.', // Phone validation message
            alphaWithSpace: 'Only alphabets are allowed.' // Alphabets only validation message
        },
        progress: true // Progress Bar show/hide
    };

    // Constructor
    function Multistep(element, settings) {
        // Overwrite default settings
        this.settings = $.extend(true, {}, defaults, settings);

        // Targeted element
        this.target = $(element);

        // Navigation
        this.nav = this.target.children('.ms-navigation');

        // Step
        this.steps = $("li > a", this.nav);

        // Container
        this.container = this.target.children('.ms-container');

        // Progress bar
        this.progress = this.target.children('.ms-progress');

        // Content
        this.content = this.container.children('.ms-content');

        // Control
        this.control = $('.ms-control', this.target);

        // Data
        this.data = [];

        // Current step index
        this.index = null;

        // Initiate
        this.init();
    }

    $.extend(Multistep.prototype, {
        init: function() {
            this.content.hide();

            // Set theme
            this._theme();

            // Set navigation
            this._navigations();

            // Set progress bar
            this._progress();

            // Set events
            this._events();

            // Set data
            this._data();

            // Show initial content
            this._show(this.settings.selected);
        },
        _theme: function() {
            if (this.settings.theme !== 'default') {
                this.target.addClass('ms-theme-' + this.settings.theme);
            }
        },
        _navigations: function() {
            // Create navigation buttons
            var btnNext = this.settings.navigation.btnNext !== false ? $('<button></button>').html(this.settings.navigation.next).addClass('ms-btn ms-btn-next') : null,
                btnPrev = this.settings.navigation.btnPrev !== false ? $('<button></button>').html(this.settings.navigation.prev).addClass('ms-btn ms-btn-prev') : null,
                btnSubmit = this.settings.navigation.btnSubmit !== false ? $('<button></button>').html(this.settings.navigation.submit).addClass('ms-btn ms-btn-submit') : null;

            this.control.append(btnPrev, btnNext, btnSubmit);
        },
        _progress: function() {
            if (this.settings.progress) {
                // Calculate progress percentage
                var percent = 100 / (this.steps.length);

                // Build progress bar
                var progression = $('<div></div>').addClass('ms-progress-bar').css("width", percent + "%");

                this.progress.html(progression);
            } else {
                this.progress.remove();
            }
        },
        _data: function() {
            var _ = this;

            _.data.navigation = [],
            _.data.content = [];

            if (this.steps.length > 0) {
                for (var i = 0; i < this.steps.length; i++) {
                    _.data.navigation.push({
                        target : '#section-' + (i + 1),
                        field : [],
                        completed : false
                    })
                }
            }

            $.each(_.data.navigation, function(res, key) {
                $(key.target).find('[data-ms]').each(function() {
                    _.data.navigation[res].field.push ({
                        type : $(this).attr('type'),
                        regex : $(this).attr('regex') ? $(this).attr('regex') : null,
                        required : $(this).attr('required') ? true : false,
                        status : false
                    })
                })
            })
        },
        _next: function() {
            var index = this.index + 1;

            if (this.steps.length <= index) {
                index = 0;
            }

            if (this._validation(index)) {
                this._show(index);
            }
        },
        _prev: function() {
            var index = this.index - 1;

            if (index <= 0) {
                index = 0;
            }
            this._validation(this.index);
            this._show(index);
        },
        _key: function(e) {
            e.preventDefault();

            var _ = this;

            // Keyboard controller
            switch (e.which) {
                // Key arrow left
                case 37:
                    _._prev();
                    break;
                // Key arrow right
                case 39: 
                    _._next();
                    break;
                // Handler exit
                default:
                    return;
            }
        },
        _show: function(selected) {
            this._loadContent(selected);
        },
        _loadContent: function(selected) {
            var _ = this;

            // Get current index
            var index = this.steps.eq(this.index),
                current = index.length > 0 ? $(index.attr("href"), this.target) : null;

            // Get selected content
            var sel = this.steps.eq(selected),
                page = sel.length > 0 ? $(sel.attr("href"), this.target) : null;

            // Get direction of navigation
            var direction = '',
                el = this.steps.eq(selected);

            if (this.index !== null && this.index !== selected) {
                direction = this.index < selected ? "forward" : "backward";
            }

            if (current && current.length > 0) {
                current.hide();
            }
            page.fadeIn(350);

            // Update status
            _._status(selected);

            // Update current index
            this.index = selected;

            // Update controller
            this._disabled();
        },
        _events: function() {
            var _ = this;

            // Navigation event
            $(this.steps).on('click', function(e) {
                e.preventDefault();

                var selected = _.steps.index(this);

                _._validation(_.index);

                if (selected < _.index) {
                    _._show(selected);
                } else {
                    if (_._validation(selected)) {
                        _._show(selected);
                    }
                }
            })

            // Next button event
            $('.ms-btn-next', this.target).on('click', function(e) {
                e.preventDefault();
                _._next();
            })

            // Prev button event
            $('.ms-btn-prev', this.target).on('click', function(e) {
                e.preventDefault();
                _._prev();
            })

            // Submit button event
            $('.ms-btn-submit', this.target).on('click', function(e) {
                e.preventDefault();

                var index = _.index + 1;

                if (_._validation(index)) {
                    _.settings.navigation.onSend();
                }
            })

            // Keyboard control event
            if (_.settings.keyController) {
                $(document).keyup(function(e) {
                    _._key(e);
                });
            }

            return true;
        },
        _status: function(selected) {
            // Update navigation status
            this.steps.eq(this.index)
                .parent('li')
                .removeClass("current");

            if (this.index !== null) {
                this.steps.eq(this.index)
                    .parent('li')
                    .addClass("completed");
            }

            this.steps.eq(selected)
                .parent('li')
                .removeClass("completed")
                .addClass("current");

            // Update progress bar status
            if (this.settings.progress) {
                var calc = 100 / this.steps.length,
                    percent;

                this.steps.length == selected + 1 ? percent = 100 : percent = calc * (selected + 1);

                var progression = $('<div></div>').addClass('ms-progress-bar').css("width", percent + "%");

                this.progress.html(progression);
            }
        },
        _disabled: function() {
            var btnNext = $('.ms-btn-next', this.target),
                btnPrev = $('.ms-btn-prev', this.target),
                btnSubmit = $('.ms-btn-submit', this.target);

            if (this.index <= 0) {
                btnPrev.addClass('ms-disabled');
            } else {
                btnPrev.removeClass('ms-disabled');
            }

            if (this.index == (this.steps.length - 1)) {
                btnNext.addClass('ms-disabled');
            } else {
                btnNext.removeClass('ms-disabled');
            }

            if (this.index < (this.steps.length - 1)) {
                btnSubmit.addClass('ms-disabled');
            } else {
                btnSubmit.removeClass('ms-disabled');
            }
        },
        _validation: function(selected) {
            var _ = this,
                data = _.data.navigation[_.index],
                isCompleted = false;

            // Regular expression
            var regex = {
                email: /^\w*([-+.']\w*)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // Match email address
                numeric: /^[0-9]+$/, // Number only
                alphaWithSpace: /^[A-Za-z]+$/ // Alphabets only with space
            }

            // Get current index
            var index = this.steps.eq(this.index),
                current = index.length > 0 ? $(index.attr("href"), this.target) : null;

            // Get input settings
            var field = current.find('[data-ms]');

            field.each(function(res, key) {
                var array = data.field[res],
                    value = $(key).val(),
                    errorContainer = $('<div></div>').addClass('ms-error');

                if (array.required) {
                    if (value) {
                        if (array.regex !== null) {
                            switch (array.regex) {
                                case 'email':
                                    if (!regex.email.test(value)) {
                                        array.status = false;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                        $(key).before(errorContainer.append(_.settings.message.email));
                                    } else {
                                        array.status = true;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                    }
                                    break;
                                case 'phone':
                                    if (!regex.numeric.test(value)) {
                                        array.status = false;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                        $(key).before(errorContainer.append(_.settings.message.phone));
                                    } else {
                                        array.status = true;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                    }
                                    break;
                                case 'alphaWithSpace':
                                    if (!regex.alphaWithSpace.test(value)) {
                                        array.status = false;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                        $(key).before(errorContainer.append(_.settings.message.alphaWithSpace));
                                    } else {
                                        array.status = true;
                                        $(key).parent('.ms-field').find('.ms-error').remove();
                                    }
                                    break;
                            }
                        } else {
                            array.status = true;
                            $(key).parent('.ms-field').find('.ms-error').remove();
                        }
                    } else {
                        array.status = false;
                        $(key).parent('.ms-field').find('.ms-error').remove();
                        $(key).before(errorContainer.append(_.settings.message.required));
                    }
                }
            })

            // Check current step completion status
            var required = data.field.filter(function(res) {
                return res.required;
            })

            if (required.length > 0) {
                $.each(required, function(res, key) {
                    if (key.status) {
                        data.completed = true;
                    } else {
                        data.completed = false;

                        return false;
                    }
                })
            } else {
                data.completed = true;
            }

            // Check previous step completion status
            var notSelected = _.data.navigation.filter(function(res, key) {
                return key < selected;
            })

            $.each(notSelected, function(res, key) {
                if (key.completed) {
                    isCompleted = true;
                } else {
                    isCompleted = false;
                    return false;
                }
            })

            return isCompleted;
        }
    });

    $.fn.multistep = function(options) {
        var args = arguments,
            instance;

        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, "multistep")) {
                    $.data(this, "multistep", new Multistep(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            instance = $.data(this[0], 'multistep');

            if (options === 'destroy') {
                $.data(this, 'multistep', null);
            }

            if (instance instanceof Multistep && typeof instance[options] === 'function') {
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                return this;
            }
        }
    };

})(jQuery, window, document);
