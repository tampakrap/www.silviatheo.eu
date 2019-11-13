(function($) {

	"use strict";


    /*------------------------------------------
        = FUNCTIONS
    -------------------------------------------*/
    // Check ie and version
    function isIE () {
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1], 10) : false;
    }


    // Toggle mobile navigation
    function toggleMobileNavigation() {
        var navbar = $(".navigation-holder");
        var openBtn = $(".navbar-header .open-btn");
        var closeBtn = $(".navigation-holder .close-navbar");
        var navLinks = $("#navbar > ul > li > a[href^='#']");

        openBtn.on("click", function() {
            if (!navbar.hasClass("slideInn")) {
                navbar.addClass("slideInn");
            }
            return false;
        })

        closeBtn.on("click", function() {
            if (navbar.hasClass("slideInn")) {
                navbar.removeClass("slideInn");
            }
            return false;
        })

        navLinks.on("click", function() {
            if (navbar.hasClass("slideInn")) {
                navbar.removeClass("slideInn");
            }
            return false;
        })
    }

    toggleMobileNavigation();


    // Function for toggle a class for small menu
    function toggleClassForSmallNav() {
        var windowWidth = window.innerWidth;
        var mainNav = $("#navbar > ul");

        if (windowWidth <= 991) {
            mainNav.addClass("small-nav");
        } else {
            mainNav.removeClass("small-nav");
        }
    }

    toggleClassForSmallNav();


    // Function for small menu
    function smallNavFunctionality() {
        var windowWidth = window.innerWidth;
        var mainNav = $(".navigation-holder");
        var smallNav = $(".navigation-holder > .small-nav");
        var subMenu = smallNav.find(".sub-menu");
        var megamenu = smallNav.find(".mega-menu");
        var menuItemWidthSubMenu = smallNav.find(".menu-item-has-children > a");

        if (windowWidth <= 991) {
            subMenu.hide();
            megamenu.hide();
            menuItemWidthSubMenu.on("click", function(e) {
                var $this = $(this);
                $this.siblings().slideToggle();
                 e.preventDefault();
                e.stopImmediatePropagation();
            })
        } else if (windowWidth > 991) {
            mainNav.find(".sub-menu").show();
            mainNav.find(".mega-menu").show();
        }
    }

    smallNavFunctionality();


    // function for active menuitem
    function activeMenuItem($links) {
        var top = $(window).scrollTop(),
            windowHeight = $(window).height(),
            documentHeight = $(document).height(),
            cur_pos = top + 2,
            sections = $("section"),
            nav = $links,
            nav_height = nav.outerHeight();


        sections.each(function() {
            var top = $(this).offset().top - nav_height,
                bottom = top + $(this).outerHeight();

            if (cur_pos >= top && cur_pos <= bottom) {
                nav.find("> ul > li > a").parent().removeClass("current-menu-item");
                nav.find("a[href='#" + $(this).attr('id') + "']").parent().addClass("current-menu-item");
            } else if (cur_pos === 2) {
                nav.find("> ul > li > a").parent().removeClass("current-menu-item");
            }

        });
    }


    // smooth-scrolling
    function smoothScrolling($scrollLinks, $topOffset) {
        var links = $scrollLinks;
        var topGap = $topOffset;

        links.on("click", function() {
            if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $("[name=" + this.hash.slice(1) +"]");
                if (target.length) {
                    $("html, body").animate({
                    scrollTop: target.offset().top - topGap
                }, 1000, "easeInOutExpo");
                    return false;
                }
            }
            return false;
        });
    }


    // Parallax background
    function bgParallax() {
        if ($(".parallax").length) {
            $(".parallax").each(function() {
                var height = $(this).position().top;
                var resize     = height - $(window).scrollTop();
                var parallaxSpeed = $(this).data("speed");
                var doParallax = -(resize / parallaxSpeed);
                var positionValue   = doParallax + "px";
                var img = $(this).data("bg-image");

                $(this).css({
                    backgroundImage: "url(" + img + ")",
                    backgroundPosition: "50%" + positionValue,
                    backgroundSize: "cover"
                });

                if ( window.innerWidth < 768) {
                    $(this).css({
                        backgroundPosition: "center center"
                    });
                }
            });
        }
    }

    bgParallax();


    // Hero slider background setting
    function sliderBgSetting() {
        if ($(".hero-slider .slide-item").length) {
            $(".hero-slider .slide-item").each(function() {
                var $this = $(this);
                var img = $this.find(".slider-bg").attr("src");

                $this.css({
                    backgroundImage: "url("+ img +")",
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
                })
            });
        }
    }

    //Setting hero slider
    function heroSlider() {
        if ($(".hero-slider").length) {
            $(".hero-slider").slick({
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                nextArrow: '<button type="button" class="slick-next">Next</button>',
                dots: true,
                fade: true,
                autoplay: true,
                autoplaySpeed: 6000,
                cssEase: 'linear'
            });
        }
    }


    // set two coloumn height equial
    function setTwoColEqHeight($col1, $col2) {
        var firstCol = $col1,
            secondCol = $col2,
            firstColHeight = $col1.innerHeight(),
            secondColHeight = $col2.innerHeight();

        if (firstColHeight > secondColHeight) {
            secondCol.css({
                "height": firstColHeight + 1 + "px"
            })
        } else {
            firstCol.css({
                "height": secondColHeight + 1 + "px"
            })
        }
    }

    function popupSaveTheDateCircle() {
        var saveTheDateCircle = $(".save-the-date");
        saveTheDateCircle.addClass("popup-save-the-date");
    }



    /*------------------------------------------
        = HIDE PRELOADER
    -------------------------------------------*/
    function preloader() {
        if($('.preloader').length) {
            $('.preloader').delay(100).fadeOut(500, function() {

                //active wow
                wow.init();

                if($(".save-the-date").length) {
                    popupSaveTheDateCircle();
                }

                //Active heor slider
                heroSlider();

            });
        }
    }


    /*------------------------------------------
        = WOW ANIMATION SETTING
    -------------------------------------------*/
    var wow = new WOW({
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    });


    /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

    // Function for clone an element for sticky menu
    function cloneNavForSticyMenu($ele, $newElmClass) {
        $ele.addClass('original').clone().insertAfter($ele).addClass($newElmClass).removeClass('original');
    }

    // clone home style 1 navigation for sticky menu
    if ($('.header-style-1 .navigation').length) {
        cloneNavForSticyMenu($('.header-style-1 .navigation'), "sticky");
    }

    // clone home style 1 navigation for sticky menu
    if ($('.header-style-2 .navigation').length) {
        cloneNavForSticyMenu($('.header-style-2 .navigation'), "sticky-2");
    }

    // Function for sticky menu
    function stickIt($stickyClass, $toggleClass, $topOffset) {
        if ($(window).scrollTop() >= $topOffset) {
            var orgElement = $(".original");
            var widthOrgElement = orgElement.css("width");

            $stickyClass.addClass($toggleClass);

            $stickyClass.css({
                "width": widthOrgElement
            }).show();

            $(".original").css({
                "visibility": "hidden"
            });

        } else {

            $(".original").css({
                "visibility": "visible"
            });

            $stickyClass.removeClass($toggleClass);
        }
    }


    /*-------------------------------------------------------
        = COUPLE SECTION IMAGE BG SETTING
    -----------------------------------------------------*/
    if ($(".wedding-couple-section .gb").length) {

        var imgHolder = $(".wedding-couple-section .gb .img-holder");

        imgHolder.each(function() {
            var $this = $(this);
            var imgHolderPic = $this.find("img").attr("src");

            $this.css({
                backgroundImage: "url("+ imgHolderPic +")",
                backgroundSize: "cover",
                backgroundPosition: "center center"
            })
        })
    }


    /*------------------------------------------
        = COUNTDOWN CLOCK
    -------------------------------------------*/
    if ($("#clock").length) {
        $('#clock').countdown('2020/07/11 19:00:00', function(event) {
            var $this = $(this).html(event.strftime(''
            + '<div class="box"><div>%D</div> <span>Days</span> </div>'
            + '<div class="box"><div>%H</div> <span>Hours</span> </div>'
            + '<div class="box"><div>%M</div> <span>Mins</span> </div>'
            + '<div class="box"><div>%S</div> <span>Secs</span> </div>'));
        });
    }


    /*------------------------------------------
        = STORY SLIDER
    -------------------------------------------*/
    if ($(".story-slider").length) {
        $('.story-slider').owlCarousel({
            items: 1,
            dots: false,
            autoplay: true,
            autoplayTimeout: 3000,
            smartSpeed: 1000,
            loop: true,
        });
    }


    /*------------------------------------------
        = RSVP FORM SUBMISSION
    -------------------------------------------*/
    if ($("#rsvp-form").length) {
        $("#rsvp-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                email: "required",

                guest: {
                    required: true
                },

                events: {
                    required: true
                }

            },

            messages: {
                name: "Please enter your name",
                email: "Please enter your email",
                guest: "Select your number of guest",
                events: "Select your event list"
            },

            submitHandler: function (form) {
                $("#loader").css("display", "inline-block");
                $.ajax({
                    type: "POST",
                    url: "https://script.google.com/macros/s/AKfycbxl4CJ-NIYyoVtB8OKfX3LqrfWolYTa77DrKHr6Sgh-E7hUUZk/exec",
                    data: $(form).serialize(),
                    success: function () {
                        $( "#loader").hide();
                        $( "#success").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#success").slideUp( "slow" );
                        }, 3000);
                        form.reset();
                    },
                    error: function() {
                        $( "#loader").hide();
                        $( "#error").slideDown( "slow" );
                        setTimeout(function() {
                        $( "#error").slideUp( "slow" );
                        }, 3000);
                    }
                });
                return false; // required to block normal submit since you used ajax
            }

        });
    }


    /*------------------------------------------
        = BACK TO TOP
    -------------------------------------------*/
    if($(".back-to-top-btn").length) {
        $(".back-to-top-btn").on("click", function() {
            $("html,body").animate({
                scrollTop: 0
            }, 2000, "easeInOutExpo");
            return false;
        })
    }

  $(".back-to-top-btn-logo").on("click", function() {
    $("html,body").animate({
      scrollTop: 0
    }, 1000, "easeInOutExpo");
    return false;
  })


     /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
        $(window).on('load', function() {

            preloader();

            sliderBgSetting();

            toggleMobileNavigation();

            smallNavFunctionality();

            //set the couple section groom bride two col equal height
            if($(".wedding-couple-section").length) {
                setTwoColEqHeight($(".wedding-couple-section .gb .img-holder"), $(".wedding-couple-section .gb .details"));
            }

            smoothScrolling($("#navbar > ul > li > a[href^='#']"), $(".header-style-1 .navigation").innerHeight());

        });



    /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
    $(window).on("scroll", function() {

        bgParallax();

        activeMenuItem($(".navigation-holder"));

        if ($(".header-style-1").length) {
            stickIt($(".sticky"), "sticky-on", $(".header-style-1 .navigation").offset().top);
        }

        if ($(".header-style-2").length) {
            stickIt($(".sticky-2"), "sticky-on", 300);
        }
    });


    /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
    $(window).on("resize", function() {
        toggleClassForSmallNav();
        //smallNavFunctionality();

        clearTimeout($.data(this, 'resizeTimer'));
        $.data(this, 'resizeTimer', setTimeout(function() {
            smallNavFunctionality();
        }, 200));
    });



})(window.jQuery);
