(function( root, $, undefined ) {
	"use strict";

	$(function () {
		// DOM ready, take it away

		var eea = {

	        fonts: function() {
	            // Google Fonts
	            WebFont.load({
	                google: {
	                    families: ["Oswald:300,400,900"]
	                },
	                timeout: 1000,
	                classes: false,
	                events: false,
	                text: "abcdefghijklmnopqrstuvwxyz!@$%&*()[]{}=-_+,.`/\'\"",
	                active: function() {
	                    // Store in Session
	                    sessionStorage.fonts = true;
	                }
	            });
	            // Check for Font
	            var font = new FontFaceObserver("Oswald", {
	                weight: 300
	            });
	            font.load().then(function() {
	            	eea.slabtext();
	                $("html").addClass("font-active");
	            });
	            // Fallback
	            setTimeout(function() {
	                if (!$("html").hasClass("font-active")) {
	                	eea.slabtext();
	                    $("html").addClass("font-active");
	                }
	            }, 1000);
	        },

            // Responsive Type
            flowtype: function() {
                $("body").flowtype({
                    minimum: 400,
                    maximum: 1200,
                    minFont: 17,
                    maxFont: 19,
                    fontRatio: 40
                });
            },

            slabtext: function() {
	            $(".slab h1").slabText({
	                "viewportBreakpoint": 280,
	                "maxFontSize": 60
	            });
	            $(".slab h2").slabText({
	                "viewportBreakpoint": 280,
	                // "maxFontSize": 60
	            });
            },

            fitvids: function() {
        	    $("section.video, .fitvids").fitVids();
            },

            is_empty: function(string) {
                // Check for empty string
                if (string === "" || string === null) {
                    return false;
                } else {
                    return true;
                }
            },

            email_validation: function(string) {
                // Check for special characters, allow emails, returns true if passes check
                var pattern = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
                return pattern.test(string);
            },

            validation: function(string) {
                // Check for special characters, allow emails, returns false if passes check (nothing matched)
                var pattern = /^[^@]+@[a-zA-Z0-9._-]+\\.+[a-z._-]+$/i;
                return pattern.test(string);
            },

            contact_form: function() {
                $("#contact-form").submit(function(event) {
                    event.preventDefault();

                    var $form = $(this),
                        failure = $("p.form-failure"),
                        button = $("input.membership-form__submit"),
                        purpose = $("select#purpose").children("option").filter(":selected").data("value"),
                        purpose_all_items = $("select#purpose").children("option").filter(":selected").text(),
                        first_name = $form.find("input[name='first-name']").val(),
                        last_name = $form.find("input[name='last-name']").val(),
                        email = $form.find("input[name='email']").val(),
                        company = $form.find("input[name='company']").val(),
                        title = $form.find("input[name='title']").val(),
                        message = $form.find("textarea").val();

                    var all_items = {
                    	"purpose-raw" : purpose,
                    	"Purpose" : purpose_all_items,
                        "First Name": first_name,
                        "Last Name": last_name,
                        "Email": email,
                        "Company": company,
                        "Title": title,
                        "Message": message
                    };

                    var errors = "";

                    // Validate Entries
                    $.each(all_items, function(key, value) {
                        // Check for Empty Fields First
                        if (eea.is_empty(value) === false) {
                            errors += key + " is missing. ";
                        } else {
                            // Check our Email Input Seperately
                            if (key === "Email") {
                                if (!eea.email_validation(value)) {
                                    errors += key + " isn\'t formatted properly. ";
                                }
                            } else {
                                // Check for Special Characters
                                if (eea.validation(value) !== false) {
                                    errors += key + " contains special characters. ";
                                }
                            }
                        }
                    });

                    // Save If Content Passes Validation
                    if (errors !== "") {
                        failure.text(errors + " Please check your answers for errors.").fadeIn();
                    } else {
                        // Save!
                        $.ajax({
                            type: "POST",
                            url: "/wp-content/themes/ethereal-summit-sf/src/ajax/contact.php",
                            data: {
                                purpose: purpose,
                                fullname: first_name + " " + last_name,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                company: company,
                                title: title,
                                message: message
                            }
                        }).done(function() {
                            // Send Email
                            eea.send_email(all_items);
                            // Disable Submit, Prevent Duplicates
                            button.prop("disabled", true);
                            // Success Text
                            $("#contact-form").fadeOut(function() {
                                $(".form-failure").hide();
                                $(".form-success").fadeIn();
                            });
                        }).fail(function() {
                            // Re-enable Submit Button
                            button.prop("disabled", false);
                        });
                    }


                });
            },

            send_email: function(array) {
                $.ajax({
                    type: "POST",
                    url: "/wp-content/themes/ethereal-summit-sf/src/ajax/email.php",
                    data: array
                }).done(function() {
                    // console.log(msg);
                }).fail(function() {
                    // console.log(jqXHR);
                });
            },

            match_heights: function() {
            	var options = {
                    byRow: true,
                    property: "height",
                    target: null,
                    remove: false
                };
                $(".equal").matchHeight(options);
            },

            magnific: function() {
                $(".photos-item .featured-image").magnificPopup({
                    type:"image",
                    mainClass: "mfp-with-zoom",
                    zoom: {
                        enabled: true,
                        duration: 300, // duration of the effect, in milliseconds
                        easing: "ease-in-out", // CSS transition easing function
                        opener: function(openerElement) {
                        	return openerElement.is("img") ? openerElement : openerElement.find("img");
                        }
                    }
                });
            }

		};

		eea.fonts();
		eea.flowtype();
		eea.fitvids();
		eea.contact_form();
		eea.match_heights();
        eea.magnific();

        $(window).on("beforeunload", function() {
            $("body").addClass("hidden");
            // $(window).scrollTop(0);
        });

	    $(window).on("load resize", function() {
			eea.fitvids();
			eea.match_heights();
	        //
	    });

	});

} ( this, jQuery ));
