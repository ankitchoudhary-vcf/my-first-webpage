function submitContact() {
    var e = $("form#contact-form");
    e.submit(function(t) {
        t.preventDefault();
        if ($("#alert-wrapper").length) {
            return false
        }
        var n = $(
            '<div id="alert-wrapper"><button type="button" class="close" data-dismiss="alert">X</div>'
        ).appendTo(e);
        $("form#contact-form .alert").remove();
        var r = false,
            i = false;
        e.find(".requiredField").each(function() {
            if ($.trim($(this).val()) == "") {
                var e = $(this).attr("placeholder");
                n.append(
                    '<div class="alert">You forgot to enter your ' +
                    e + ".</div>");
                r = true
            } else if ($(this).hasClass("email")) {
                var t =
                    /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!t.test($.trim($(this).val()))) {
                    var e = $(this).attr("placeholder");
                    n.append(
                        '<div class="alert"> You\'ve entered an invalid ' +
                        e + ".</div>");
                    r = true
                }
            }
        });
        var s = new TimelineLite({
            paused: true
        });
        hideAlert = new TimelineLite({
            paused: true
        });
        s.to(n, .3, {
            opacity: 1,
            top: "30%"
        });
        hideAlert.to(n, .3, {
            opacity: 0,
            top: "60%",
            onComplete: function() {
                n.remove()
            }
        });
        if (r) {
            s.play();
            n.find("button").on("click", function() {
                hideAlert.play()
            })
        } else {
            var o = $(this).serialize();
            $.post($(this).attr("action"), o);
            $.ajax({
                type: "POST",
                url: $(this).attr("action"),
                dataType: "json",
                data: o,
                success: function(e) {
                    if (e.status == "error") {
                        i = true;
                        n.append(
                            '<div class="alert"><strong>Sorry</strong> There was an error sending your message!</div>'
                        )
                    } else if (e.status == "ok") {
                        n.append(
                            '<div class="alert"><strong>Thanks</strong> Your email has been delivered. </div>'
                        )
                    }
                    s.play()
                },
                error: function() {
                    i = true;
                    n.append(
                        '<div class="alert"><strong>Sorry</strong> There was an error sending your message!</div>'
                    );
                    s.play()
                }
            })
        } if (i) {
            s.play();
            n.find("button").on("click", function() {
                hideAlert.play()
            })
        }
        return false
    })
}
$(window).on("resize", function() {
    window.location = window.location.pathname
});
$.ajaxSetup({
    cache: false
});
$('[rel="tooltip"]').tooltip();
$("img.lazy").lazyload({
    threshold: 100,
    effect: "fadeIn",
    container: $("#overflow-wrapper"),
    failure_limit: 30,
    skip_invisible: false
});
$("img.lazy").lazyload({
    threshold: 100,
    effect: "fadeIn",
    container: $("#gal2-images-wrapper"),
    failure_limit: 10,
    skip_invisible: false
});
var cces, cce = {
    settings: {
        clickFlag: 1,
        targetEls: ".fullscreen-enable a, a.upstream-post, a.ajax-portfolio"
    },
    init: function() {
        cces = this.settings;
        this.bindUIActions()
    },
    bindUIActions: function() {
        $body = $("body");
        $body.on("mousedown", cces.targetEls, function(e) {
            cces.clickFlag = 1;
            $body.on("mousemove", cces.targetEls, function(e) {
                cces.clickFlag = 0
            })
        });
        $body.on("click", cces.targetEls, function(e) {
            e.preventDefault()
        });
        $body.on("mouseup", cces.targetEls, function(e) {
            e.preventDefault();
            if (cces.clickFlag === 1) $(this).trigger(
                "custom-click")
        })
    }
};
cce.init();
var prl, preloader = {
    settings: {
        preloader: $("#preloader"),
        textLoad: $("#text-load"),
        totalImages: $("img")
    },
    init: function() {
        prl = this.settings;
        this.listeners();
        this.triggers()
    },
    triggers: function() {
        var e = this,
            t = 0,
            n = prl.totalImages.length,
            r = prl.preloader.find("#load-overlay");
        prl.totalImages.one("load", function() {
            t = t + 1;
            var e = (1 - t / n) * 100 + "%";
            TweenMax.to(r, .1, {
                width: e
            });
            if (t >= n) {
                $("body").trigger("readytogo")
            }
        }).each(function() {
            if (this.complete || $(this).height() > 0) {
                $(this).load()
            }
        });
        $(window).load(function() {
            TweenMax.to(r, .5, {
                width: 0,
                onComplete: function() {
                    $("body").trigger("readytogo")
                }
            })
        })
    },
    listeners: function() {
        var e = this,
            t = $("body");
        t.on("hideloader", function() {
            if ($.cookie("returner")) {
                e.hideLoader()
            } else {
                $.cookie("returner", 1, {
                    expires: 1
                });
                e.showGuids()
            }
        });
        t.one("readytogo", function() {
            t.trigger("hideloader")
        });
        $("a.startbtn").on("click", function() {
            e.hideLoader()
        })
    },
    showGuids: function() {
        (new TimelineLite).to(prl.textLoad, 1, {
            top: "-=60px",
            scaleX: .8,
            scaleY: .8
        }).to($("#userguid"), 1, {
            top: "60%",
            autoAlpha: 1
        }, "-=1")
    },
    hideLoader: function() {
        $(document).ready(function() {
            (new TimelineLite({
                delay: 1
            })).to(prl.preloader, 1.5, {
                height: 0,
                ease: Power4.easeInOut
            }).to($("#text-load,#userguid"), 1.5, {
                opacity: 0,
                ease: Power4.easeInOut,
                onComplete: function() {
                    $("#text-load,#userguid").remove()
                }
            }, "-=1.5").from($("#hello-inner"), 1, {
                left: "120%",
                ease: Power4.easeOut
            }, "-=1").from($("#hello-contents"), 1.5, {
                left: "300px",
                autoAlpha: 0,
                ease: Power4.easeOut
            }, "-=0.5").from($("#taskbar"), 1.5, {
                scaleX: 2,
                bottom: "-100px",
                opacity: 0,
                ease: Power4.easeInOut,
                onComplete: function() {
                    $("#menu-trigger a").trigger(
                        "mouseenter")
                }
            }, "-=1.5")
        })
    }
};
var ls, layoutSwiper = {
    settings: {
        swiperNavThumbs: $(".swiper-nav-thumbs"),
        menuPannel: $("#menu-pannel"),
        menuTrigger: $("#menu-trigger"),
        menuClose: $("#close-menu"),
        swiperNext: $("#pagenav .swip-next"),
        swiperPrev: $("#pagenav .swip-prev"),
        contentSwiper: $("div#swiper-content"),
        guide: $("#enhancer"),
        swiperContetn: $("#swiper-content"),
        swiperNav: $(".swiper-nav")
    },
    init: function() {
        ls = this.settings;
        this.makeNavIndicators();
        this.updateContent();
        this.runSwiper();
        this.bindUIActions()
    },
    runSwiper: function() {
        var e = this;
        e.swiperit = ls.contentSwiper.swiper({
            speed: 400,
            keyboardControl: true,
            noSwiping: true,
            simulateTouch: true,
            hashNav: true,
            onSlideChangeStart: function(t, n) {
                e.updateNavPosition(t.activeIndex)
            },
            onSlideChangeEnd: function(t) {
                var n = $(t.activeSlide());
                n.find(".scrollbar").perfectScrollbar(
                    "destroy").perfectScrollbar({
                    wheelSpeed: 50
                });
                var r = n.find(".ps-scrollbar-y"),
                    i = n.find(".ps-scrollbar-y-rail"),
                    s = n.find(".ps-scrollbar-x"),
                    o = n.find(".ps-scrollbar-x-rail");
                r.each(function() {
                    if ($(this).height() == 0) $(
                        this).parent().addClass(
                        "remove-scroll")
                });
                s.each(function() {
                    if ($(this).width() == 0) $(
                        this).parent().addClass(
                        "remove-scroll")
                });
                e.menuDown()
            }
        })
    },
    bindUIActions: function() {
        var e = this;
        ls.menuTrigger.on("click", "a", function(t) {
            t.preventDefault();
            e.menuIn()
        });
        ls.menuClose.on("click", "a", function(t) {
            t.preventDefault();
            e.menuDown()
        });
        ls.swiperNext.on("click", function(t) {
            t.preventDefault();
            e.swiperit.swipeNext()
        });
        ls.swiperPrev.on("click", function(t) {
            t.preventDefault();
            e.swiperit.swipePrev()
        });
        ls.guide.on("click", function() {
            e.swiperit.swipeTo(1)
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateNavPosition: function(e) {
        ls.swiperNavThumbs.children().removeClass("active-nav").eq(e).addClass(
            "active-nav")
    },
    menuDown: function() {
        TweenMax.to(ls.menuPannel, .5, {
            bottom: "-450px",
            ease: Power4.easeOut
        })
    },
    menuIn: function() {
        TweenMax.to(ls.menuPannel, .5, {
            bottom: "0",
            ease: Power4.easeOut
        })
    },
    makeNavIndicators: function() {
        var e = $(".swiper-wrapper").children(".sub-page").length,
            t = "<div></div>",
            n = "";
        for (var r = e - 1; r >= 0; r--) {
            n = n + t
        }
        ls.swiperNavThumbs.css("width", "100%").html(n).children().first()
            .addClass("active-nav");
        ls.swiperNavThumbs.children("div").css("width", 100 / e + "%")
    },
    updateContent: function() {
        ls.swiperContetn.css({
            height: $(window).height() - ls.swiperNav.height()
        })
    }
};
var ms, menuPannel = {
    settings: {
        menuContainer: $("#menu-pannel"),
        menuImageContainer: $("#menu-pannel-image").find(".hex-3"),
        menuThumbs: $(".menu-pannel-thumb"),
        menuSliderContainer: $("#slider-container"),
        menuPannelNavs: $("#menu-pannel-navigation")
    },
    init: function() {
        ms = this.settings;
        this.prepare();
        this.bindUIActions()
    },
    bindUIActions: function() {
        var e = this;
        ms.menuPannelNavs.on("mouseenter", ".item", function() {
            var e = $(this),
                t = e.index(),
                n = ms.menuSliderContainer,
                r = -(t - 1) * ms.itemwidth - 300,
                i = $("#slider-container .active").index();
            ms.menuPannelImages.addClass("hide").eq(t).removeClass(
                "hide");
            ms.menuThumbs.removeClass("active").eq(t).addClass(
                "active");
            ms.menuPannelNavs.find(".item").removeClass(
                "active").eq(t).addClass("active");
            (new TimelineLite).to(n, 1.5, {
                "margin-left": r,
                ease: Power4.easeOut
            }).from(ms.menuPannelImages.eq(t), 1.5, {
                top: "-80px",
                opacity: .2,
                ease: Power1.easeOut
            }, "-=2")
        });
        ms.menuPannelNavs.on("click", ".item", function() {
            var e = $(this),
                t = e.index();
            layoutSwiper.swiperit.swipeTo(t)
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        ms.menuContainer = $("#menu-pannel");
        ms.itemwidth = ms.menuContainer.outerWidth() / 3 + 200;
        ms.menuThumbs.each(function() {
            $(this).css("width", ms.itemwidth)
        });
        ms.menuSliderContainer.css("margin-left", ms.itemwidth - 300)
    },
    prepare: function() {
        ms.menuImageContainer.html("");
        ms.menuPannelNavs.html("");
        ms.menuThumbs.each(function() {
            var e = $(this).find("img").first();
            ms.menuImageContainer.append(e);
            ms.menuPannelNavs.append('<div class="item"></div>')
                .children().first().addClass("active")
        });
        ms.menuPannelImages = $("#menu-pannel-image img");
        ms.itemwidth = ms.menuContainer.outerWidth() / 3 + 200;
        ms.menuThumbs.each(function() {
            $(this).css("width", ms.itemwidth)
        });
        ms.menuSliderContainer.css("margin-left", ms.itemwidth - 300);
        ms.menuPannelImages.addClass("hide").eq(0).removeClass("hide")
    }
};
var upstreamOut = function() {
    var e = $("#upstream");
    $("#swiper-content").removeClass("not-visible");
    TweenMax.to(e, 1.5, {
        height: 0,
        ease: Power4.easeOut,
        onComplete: function() {
            e.html("").hide()
        }
    })
};
var upstreamIn = function(e, t) {
    $("#swiper-content").addClass("not-visible");
    var n = $("#upstream").show().html(e);
    TweenMax.to(n, 1.5, {
        height: "50%",
        ease: Power4.easeOut,
        onComplete: function() {
            if (typeof t == "function") {
                t()
            }
        }
    })
};
$("body").on("custom-click", ".fullscreen-enable a", function(e) {
    e.preventDefault();
    var t =
        '<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">' +
        '<div class="slides"></div>' + '<h3 class="title"></h3>' +
        '<div class="counter"><span class="counter-current"></span><span class="counter-divider">/</span><span class="counter-total"></span></div>' +
        '<a class="prev"><i class="fa fa-angle-left"></i></a>' +
        '<a class="next"><i class="fa fa-angle-right"></i></a>' +
        '<a class="close"><img src="assets/img/close-cursor.png" title="close" alt="x"></a>' +
        '<a class="play-pause"></a>' +
        '<ol class="indicator"></ol></div>';
    upstreamIn(t);
    var n = this,
        r = $(this).parents(".fullscreen-enable").find("a"),
        i = {
            index: n,
            event: e,
            enableKeyboardNavigation: false,
            closeOnSlideClick: false,
            stretchImages: "cover",
            onclose: function() {
                upstreamOut()
            },
            onopen: function() {},
            onslide: function(e, t) {
                $("#blueimp-gallery .counter-current").html(e);
                $("#blueimp-gallery .counter-total").html(s.getNumber())
            }
        };
    var s = blueimp.Gallery(r, i)
});
var as, audioBackground = {
    settings: {
        autoplay: true,
        audioPlayerContainer: $("#jp_container_1"),
        audioControlsInOut: $("#audioplayback, .jp-controls")
    },
    init: function() {
        as = this.settings;
        this.playlistPrepare();
        if (as.autoplay) {
            as.playlist.select(1);
            as.playlist.play(1)
        }
        this.bindUIActions()
    },
    playlistPrepare: function() {
        as.playlist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [{
            title: "Thin Ice",
            mp3: "assets/music/04.mp3"
        }, {
            title: "Thin Ice",
            mp3: "assets/music/00.mp3"
        }, {
            title: "Thin Ice",
            mp3: "assets/music/01.mp3"
        }, {
            title: "Thin Ice",
            mp3: "assets/music/02.mp3"
        }, {
            title: "Thin Ice",
            mp3: "assets/music/03.mp3"
        }], {
            playlistOptions: {
                enableRemoveControls: true,
                autoPlay: true,
                loopOnPrevious: true
            },
            loop: true,
            swfPath: "../js",
            supplied: "oga, mp3",
            wmode: "window",
            smoothPlayBar: false,
            keyEnabled: false
        })
    },
    bindUIActions: function() {
        var e = this;
        as.audioControlsInOut.on("click", "a", function() {
            var t = as.audioPlayerContainer,
                n = t.data("status");
            if (!n || n == "Off") {
                e.playerIn();
                t.data("status", "On");
                $("#audioplayback").addClass("onside").removeClass(
                    "offside")
            } else {
                e.playerOut();
                t.data("status", "Off");
                $("#audioplayback").addClass("offside").removeClass(
                    "onside")
            }
        })
    },
    playerOut: function() {
        TweenMax.to(as.audioPlayerContainer, 1, {
            right: "-100px",
            ease: Power4.easeOut
        })
    },
    playerIn: function() {
        TweenMax.to(as.audioPlayerContainer, 1, {
            right: "127px",
            ease: Power4.easeOut
        })
    }
};
var kbs, kenburn = {
    settings: {
        canvas: $("#kenburn"),
        screenWrapper: $("#contents")
    },
    init: function() {
        kbs = this.settings;
        this.updateContent();
        this.bindUIActions();
        this.buildKenburn()
    },
    prepare: function() {
        kbs.canvas.attr("width", kbs.screenWrapper.width());
        kbs.canvas.attr("height", kbs.screenWrapper.height())
    },
    buildKenburn: function() {
        var e = kbs.canvas.kenburned({
            images: ["assets/img/home/22.jpg",
                "assets/img/home/26.jpg",
                "assets/img/home/27.jpg",
                "assets/img/home/29.jpg"
            ],
            zoom: 1.2,
            display_time: 1e4,
            background_color: "#000"
        })
    },
    bindUIActions: function() {
        var e = this;
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        kbs.screenWrapper = $("#contents");
        this.prepare();
        this.buildKenburn()
    }
};
var vs, videoBackground = {
    settings: {
        videoName: "goldpai/goldpai"
    },
    init: function() {
        vs = this.settings;
        $("#home").prepend(
            '<div class="video-background"></div><div class="video-background-overlay"></div>'
        );
        $(".video-background").videobackground({
            videoSource: [
                ["assets/video/" + vs.videoName + ".mp4",
                    "video/mp4"
                ],
                ["assets/video/" + vs.videoName + ".webm",
                    "video/webm"
                ],
                ["assets/video/" + vs.videoName + ".ogv",
                    "video/ogg"
                ]
            ],
            loop: true,
            poster: "assets/video/" + vs.videoName + ".jpg",
            loadedCallback: function() {
                $(this).videobackground("mute")
            }
        })
    }
};
var vps, videoPortfolio = {
    settings: {
        targetel: $(".videofolio")
    },
    init: function() {
        vps = this.settings;
        var e = this;
        vps.targetel.each(function() {
            e.buildVideo($(this))
        })
    },
    buildVideo: function(e) {
        var t = e.attr("data-filename") || "no-filename-supplied";
        e.videobackground({
            videoSource: [
                ["assets/video/" + t + ".mp4", "video/mp4"],
                ["assets/video/" + t + ".webm",
                    "video/webm"
                ],
                ["assets/video/" + t + ".ogv", "video/ogg"]
            ],
            loop: true,
            poster: "assets/video/" + t + ".jpg",
            loadedCallback: function() {
                $(this).videobackground("mute")
            }
        })
    }
};
var aboutMeSlider = {
    settings: {
        slidesContainer: $("#about-slides")
    },
    init: function() {
        this.settings.slidesContainer.slidesjs({
            width: 600,
            height: 900,
            navigation: {
                effect: "fade",
                active: false
            },
            pagination: false,
            effect: {
                fade: {
                    speed: 400
                }
            },
            play: {
                active: false,
                auto: true,
                effect: "fade"
            }
        })
    }
};
var gp, gridPortfolio = {
    settings: {
        masonryContainer: $(".masonryGrid"),
        galItems: $(".masonryGrid .da-item")
    },
    init: function() {
        if (false && document.documentMode === 9) {
            this.settings.ieFlag = 1
        }
        gp = this.settings;
        this.buildMasonry();
        var e;
        if (gp.ieFlag) {
            e = {
                top: "-100%"
            }
        } else {
            e = {
                rotationX: 180,
                transformOrigin: "left bottom"
            }
        }
        TweenMax.to(gp.galItems.find(".da-overlay"), .2, e);
        this.bindUIActions()
    },
    bindUIActions: function() {
        var e = this;
        gp.galItems.on("mouseenter", function(t) {
            var n = e._getDirection($(this), {
                x: t.pageX,
                y: t.pageY
            });
            var r = e._getAnimation(n, "in");
            TweenMax.fromTo($(this).find(".da-overlay"), .7, r.from,
                r.to);
            TweenMax.to($(this).find("img"), .6, {
                scaleX: 1.2,
                scaleY: 1.2,
                ease: Power4.easeOut
            })
        });
        gp.galItems.on("mouseleave", function(t) {
            var n = e._getDirection($(this), {
                x: t.pageX,
                y: t.pageY
            });
            var r = e._getAnimation(n, "out");
            TweenMax.fromTo($(this).find(".da-overlay"), .7, r.from,
                r.to);
            TweenMax.to($(this).find("img"), .6, {
                scaleX: 1,
                scaleY: 1,
                ease: Power4.easeOut
            })
        })
    },
    buildMasonry: function() {
        gp.masonryContainer.imagesLoaded(function() {
            var e = gp.masonryContainer.find(".videofolio");
            if (e.length > 0) {
                var t = gp.masonryContainer.find("img").first()
                    .height();
                e.parent(".da-item").height(t)
            }
            gp.masonryContainer.masonry({
                itemSelector: ".da-item",
                columnWidth: ".da-item",
                transitionDuration: 0
            })
        })
    },
    _getDirection: function(e, t) {
        var n = e.width(),
            r = e.height(),
            i = (t.x - e.offset().left - n / 2) * (n > r ? r / n : 1),
            s = (t.y - e.offset().top - r / 2) * (r > n ? n / r : 1),
            o = Math.round((Math.atan2(s, i) * (180 / Math.PI) + 180) /
                90 + 3) % 4;
        return o
    },
    _getAnimation: function(e, t) {
        var n = {};
        if (t === "in") {
            switch (e) {
                case 0:
                    if (gp.ieFlag) {
                        n = {
                            from: {
                                top: "-100%",
                                left: 0
                            },
                            to: {
                                top: 0,
                                left: 0,
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationX: 180,
                                rotationY: 0,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationX: 360,
                                rotationY: 0,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 1:
                    if (gp.ieFlag) {
                        n = {
                            from: {
                                top: 0,
                                left: "100%"
                            },
                            to: {
                                top: 0,
                                left: 0,
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationY: 180,
                                rotationX: 0,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationY: 360,
                                rotationX: 0,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 2:
                    if (gp.ieFlag) {
                        n = {
                            from: {
                                top: "100%",
                                left: 0
                            },
                            to: {
                                top: 0,
                                left: 0,
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationX: 180,
                                rotationY: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationX: 0,
                                rotationY: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 3:
                    if (gp.ieFlag) {
                        n = {
                            from: {
                                top: 0,
                                left: "-100%"
                            },
                            to: {
                                top: 0,
                                left: 0,
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationY: 180,
                                rotationX: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationY: 0,
                                rotationX: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break
            }
        } else {
            switch (e) {
                case 0:
                    if (gp.ieFlag) {
                        n = {
                            from: {},
                            to: {
                                top: "-100%",
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationX: 360,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationX: 180,
                                transformOrigin: "right top",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 1:
                    if (gp.ieFlag) {
                        n = {
                            from: {},
                            to: {
                                left: "100%",
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationY: 360,
                                transformOrigin: "right bottom",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationY: 180,
                                transformOrigin: "right bottom",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 2:
                    if (gp.ieFlag) {
                        n = {
                            from: {},
                            to: {
                                top: "100%",
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationX: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationX: 180,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break;
                case 3:
                    if (gp.ieFlag) {
                        n = {
                            from: {},
                            to: {
                                left: "-100%",
                                ease: Power4.easeOut
                            }
                        }
                    } else {
                        n = {
                            from: {
                                rotationY: 0,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            },
                            to: {
                                rotationY: 180,
                                transformOrigin: "left bottom",
                                ease: Power4.easeOut
                            }
                        }
                    }
                    break
            }
        }
        return n
    }
};
var ups, upstreamPortfolio = {
    settings: {
        portfolioTrigger: $(".ajax-portfolio")
    },
    init: function() {
        ups = this.settings;
        this.bindUIActions()
    },
    bindUIActions: function() {
        var e = this;
        ups.portfolioTrigger.on("custom-click", function(t) {
            t.preventDefault();
            ups.e = t;
            var n = $(this).attr("href");
            var r = $(this).hasClass("video-item");
            e.makeAjax(n, r)
        })
    },
    buildGallery: function() {
        var e =
            '<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">' +
            '<div class="slides"></div>' + '<h3 class="title"></h3>' +
            '<div class="counter"><span class="counter-current"></span><span class="counter-divider">/</span><span class="counter-total"></span></div>' +
            '<a class="prev"><i class="fa fa-angle-left"></i></a>' +
            '<a class="next"><i class="fa fa-angle-right"></i></a>' +
            '<a class="close"><img src="assets/img/close-cursor.png" title="close" alt="x"></a>' +
            '<a class="play-pause"></a>' +
            '<ol class="indicator"></ol></div>';
        var t = $(".portfolio-main"),
            n = $("#portfolio-gallery").find("a");
        t.html(e);
        var r = {
            event: ups.e,
            enableKeyboardNavigation: false,
            closeOnSlideClick: false,
            stretchImages: "cover",
            carousel: true,
            onclose: function() {
                upstreamOut()
            },
            onopen: function() {},
            onslide: function(e, t) {
                $("#blueimp-gallery .counter-current").html(e);
                $("#blueimp-gallery .counter-total").html(i.getNumber())
            }
        };
        var i = blueimp.Gallery(n, r)
    },
    makeAjax: function(e, t) {
        var n = this;
        $.ajax({
            type: "GET",
            url: e,
            datatype: "html",
            success: function(e) {
                n.ajaxSuccess(e, t)
            }
        })
    },
    ajaxSuccess: function(e, t) {
        if (!t) {
            upstreamIn(e, upstreamPortfolio.buildGallery)
        } else {
            $("#jquery_jplayer_1").jPlayer("pause", 0);
            upstreamIn(e, function() {
                var e = $("#upstream");
                e.find("iframe").height(e.height())
            })
        }
    }
};
var vgs, verticalGallery = {
    settings: {
        galThumbs: $("#gal2-thumb-carousel"),
        galThumbWrapper: $("#gal2-thumb-container"),
        galImagesWrapper: $("#gal2-images-wrapper"),
        offset: -70,
        scrollTime: 800
    },
    init: function() {
        vgs = this.settings;
        this.makeCarousel();
        this.bindUIActions()
    },
    makeCarousel: function() {
        vgs.galThumbs.carouFredSel({
            circular: true,
            infinite: true,
            responsive: true,
            direction: "down",
            height: "100%",
            auto: false,
            items: {
                height: 100,
                width: 90,
                visible: {
                    min: 2,
                    max: 8
                }
            },
            scroll: {
                items: "-1"
            },
            prev: "#gal2-prev",
            next: "#gal2-next"
        }, {
            wrapper: {
                element: "div",
                classname: "gal2_caroufredsel_wrapper"
            }
        })
    },
    bindUIActions: function() {
        var e = this;
        vgs.galThumbs.on("click", "img", function(e) {
            $(this).addClass("active-thumb").siblings().removeClass(
                "active-thumb");
            var t = vgs.galImagesWrapper.children().eq($(this).index());
            vgs.galImagesWrapper.scrollTo(t, vgs.scrollTime, {
                offset: vgs.offset
            }).perfectScrollbar("update")
        });
        vgs.galThumbWrapper.on("mousemove", function(e) {
            var t = $("#gal2-thumb-container").height(),
                n = e.pageY / t,
                r = vgs.galThumbs.children().length * vgs.galThumbs
                .children().first().outerHeight(),
                i = t - r,
                s = n * (i - 400) + 150;
            TweenMax.to(vgs.galThumbs, 1.5, {
                top: s,
                ease: Power4.easeOut
            })
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        vgs.galThumbs.trigger("updateSizes")
    }
};
var vgs1, verticalGallery1 = {
    settings: {
        galThumbs: $("#ar-thumb-carousel"),
        galThumbWrapper: $("#ar-thumb-container"),
        galImagesWrapper: $("#ar-images-wrapper"),
        offset: -70,
        scrollTime: 800
    },
    init: function() {
        vgs1 = this.settings;
        this.makeCarousel();
        this.bindUIActions()
    },
    makeCarousel: function() {
        vgs1.galThumbs.carouFredSel({
            circular: true,
            infinite: true,
            responsive: true,
            direction: "down",
            height: "100%",
            auto: false,
            items: {
                height: 100,
                width: 90,
                visible: {
                    min: 2,
                    max: 8
                }
            },
            scroll: {
                items: "-1"
            },
            prev: "#ar-prev",
            next: "#ar-next"
        }, {
            wrapper: {
                element: "div",
                classname: "ar_caroufredsel_wrapper"
            }
        })
    },
    bindUIActions: function() {
        var e = this;
        vgs1.galThumbs.on("click", "img", function(e) {
            $(this).addClass("active-thumb").siblings().removeClass(
                "active-thumb");
            var t = vgs1.galImagesWrapper.children().eq($(this).index());
            vgs1.galImagesWrapper.scrollTo(t, vgs1.scrollTime, {
                offset: vgs1.offset
            }).perfectScrollbar("update")
        });
        vgs1.galThumbWrapper.on("mousemove", function(e) {
            var t = $("#ar-thumb-container").height(),
                n = e.pageY / t,
                r = vgs1.galThumbs.children().length * vgs1.galThumbs
                .children().first().outerHeight(),
                i = t - r,
                s = n * (i - 400) + 150;
            TweenMax.to(vgs1.galThumbs, 1.5, {
                top: s,
                ease: Power4.easeOut
            })
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        vgs1.galThumbs.trigger("updateSizes")
    }
};
var vgs2, verticalGallery2 = {
    settings: {
        galThumbs: $("#na-thumb-carousel"),
        galThumbWrapper: $("#na-thumb-container"),
        galImagesWrapper: $("#na-images-wrapper"),
        offset: -70,
        scrollTime: 800
    },
    init: function() {
        vgs2 = this.settings;
        this.makeCarousel();
        this.bindUIActions()
    },
    makeCarousel: function() {
        vgs2.galThumbs.carouFredSel({
            circular: true,
            infinite: true,
            responsive: true,
            direction: "down",
            height: "100%",
            auto: false,
            items: {
                height: 100,
                width: 90,
                visible: {
                    min: 2,
                    max: 8
                }
            },
            scroll: {
                items: "-1"
            },
            prev: "#na-prev",
            next: "#na-next"
        }, {
            wrapper: {
                element: "div",
                classname: "na_caroufredsel_wrapper"
            }
        })
    },
    bindUIActions: function() {
        var e = this;
        vgs2.galThumbs.on("click", "img", function(e) {
            $(this).addClass("active-thumb").siblings().removeClass(
                "active-thumb");
            var t = vgs2.galImagesWrapper.children().eq($(this).index());
            vgs2.galImagesWrapper.scrollTo(t, vgs2.scrollTime, {
                offset: vgs2.offset
            }).perfectScrollbar("update")
        });
        vgs2.galThumbWrapper.on("mousemove", function(e) {
            var t = $("#na-thumb-container").height(),
                n = e.pageY / t,
                r = vgs2.galThumbs.children().length * vgs2.galThumbs
                .children().first().outerHeight(),
                i = t - r,
                s = n * (i - 400) + 150;
            TweenMax.to(vgs2.galThumbs, 1.5, {
                top: s,
                ease: Power4.easeOut
            })
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        vgs2.galThumbs.trigger("updateSizes")
    }
};
var vgs3, verticalGallery3 = {
    settings: {
        galThumbs: $("#ai-thumb-carousel"),
        galThumbWrapper: $("#ai-thumb-container"),
        galImagesWrapper: $("#ai-images-wrapper"),
        offset: -70,
        scrollTime: 800
    },
    init: function() {
        vgs3 = this.settings;
        this.makeCarousel();
        this.bindUIActions()
    },
    makeCarousel: function() {
        vgs3.galThumbs.carouFredSel({
            circular: true,
            infinite: true,
            responsive: true,
            direction: "down",
            height: "100%",
            auto: false,
            items: {
                height: 100,
                width: 90,
                visible: {
                    min: 2,
                    max: 8
                }
            },
            scroll: {
                items: "-1"
            },
            prev: "#ai-prev",
            next: "#ai-next"
        }, {
            wrapper: {
                element: "div",
                classname: "ai_caroufredsel_wrapper"
            }
        })
    },
    bindUIActions: function() {
        var e = this;
        vgs3.galThumbs.on("click", "img", function(e) {
            $(this).addClass("active-thumb").siblings().removeClass(
                "active-thumb");
            var t = vgs3.galImagesWrapper.children().eq($(this).index());
            vgs3.galImagesWrapper.scrollTo(t, vgs3.scrollTime, {
                offset: vgs3.offset
            }).perfectScrollbar("update")
        });
        vgs3.galThumbWrapper.on("mousemove", function(e) {
            var t = $("#ai-thumb-container").height(),
                n = e.pageY / t,
                r = vgs3.galThumbs.children().length * vgs3.galThumbs
                .children().first().outerHeight(),
                i = t - r,
                s = n * (i - 400) + 150;
            TweenMax.to(vgs3.galThumbs, 1.5, {
                top: s,
                ease: Power4.easeOut
            })
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        vgs3.galThumbs.trigger("updateSizes")
    }
};
var hgs, HorizontalGallery = {
    settings: {
        galThumbs: $("#gal3-thumb-carousel"),
        galThumbWrapper: $("#gal3-thumb-container"),
        galImagesWrapper: $("#gal3-images-wrapper"),
        galImages: $("#gal3-images"),
        scrollTime: 800,
        overflowWrapper: $("#overflow-wrapper")
    },
    init: function() {
        hgs = this.settings;
        hgs.availableWidth = hgs.galImages.width();
        this.prepare();
        this.buildMouseWeel();
        this.makeCarousel();
        this.bindUIActions()
    },
    bindUIActions: function() {
        var e = this;
        hgs.galThumbs.on("click", "img", function(e) {
            $(this).addClass("active-thumb").siblings().removeClass(
                "active-thumb");
            var t = hgs.galImagesWrapper.children().eq($(this).index());
            hgs.overflowWrapper.scrollTo(t, hgs.scrollTime)
        });
        hgs.galThumbWrapper.on("mousemove", function(e) {
            var t = hgs.galThumbWrapper.width(),
                n = $(window).width() - t,
                r = (e.pageX - n) / t,
                i = hgs.galThumbs.children().length * hgs.galThumbs
                .children().first().outerHeight(),
                s = t - i,
                o = r * (s - t * .65);
            TweenMax.to(hgs.galThumbs, 1.5, {
                left: o,
                ease: Power4.easeOut
            })
        });
        $(window).resize(function() {
            e.updateContent()
        })
    },
    updateContent: function() {
        hgs.galThumbs.trigger("updateSizes");
        hgs.availableWidth = $("#gal3-images").width();
        this.prepare()
    },
    makeCarousel: function() {
        hgs.galThumbs.carouFredSel({
            circular: true,
            infinite: true,
            responsive: true,
            auto: false,
            items: {
                width: 100,
                visible: {
                    min: 3,
                    max: 10
                }
            },
            scroll: {
                items: "-1"
            },
            prev: "#gal3-prev",
            next: "#gal3-next",
            onCreate: function() {
                var e = $("#gal3-thumb-carousel");
                e.css("left", "-50%")
            }
        }, {
            wrapper: {
                element: "div",
                classname: "gal3_caroufredsel_wrapper"
            }
        })
    },
    prepare: function() {
        hgs.galThumbs.children().first().addClass("active-thumb");
        hgs.galImagesWrapper.children().css("width", hgs.availableWidth);
        hgs.galImagesWrapper.css({
            width: hgs.galImagesWrapper.children().length * hgs
                .availableWidth + "px"
        })
    },
    buildMouseWeel: function() {
        hgs.overflowWrapper.mousewheel(function(e, t) {
            this.scrollLeft -= t * 150;
            e.preventDefault()
        })
    }
};
var tcs, teamCarousel = {
    settings: {
        imagesContainer: $(".team-image-wrapper"),
        carouslWrapper: $(".team-carousel-wrapper"),
        itemsContainer: $(".team-carousel"),
        nextButton: $(".team-next"),
        prevButton: $(".team-prev"),
        counterTotal: $(".team-counter .counter-total"),
        counterCurrent: $(".team-counter .counter-current")
    },
    init: function() {
        this.settings.items = this.settings.itemsContainer.find(".item");
        tcs = this.settings;
        this.prepare();
        this.handleBgColors();
        this.bindUIActions()
    },
    handleBgColors: function() {
        function r(e, t) {
            return parseInt(Math.random() * (t - e + 1), 10) + e
        }
        var e = tcs.carouslWrapper.css("backgroundColor");
        var t = e.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete t[0];
        var n = this.rgbToHsv(t[1], t[2], t[3]);
        tcs.items.each(function() {
            var e = "hsl(" + n[0] + "," + n[1] + "%," + r(n[2] -
                10, n[2] + 10) + "%)";
            $(this).css("background", e)
        })
    },
    rgbToHsv: function(e, t, n) {
        e /= 255, t /= 255, n /= 255;
        var r = Math.max(e, t, n),
            i = Math.min(e, t, n);
        var s, o, u = (r + i) / 2;
        if (r == i) {
            s = o = 0
        } else {
            var a = r - i;
            o = u > .5 ? a / (2 - r - i) : a / (r + i);
            switch (r) {
                case e:
                    s = (t - n) / a + (t < n ? 6 : 0);
                    break;
                case t:
                    s = (n - e) / a + 2;
                    break;
                case n:
                    s = (e - t) / a + 4;
                    break
            }
            s /= 6
        }
        return [Math.floor(s * 360), Math.floor(o * 100), Math.floor(u *
            100)]
    },
    prepare: function() {
        tcs.imageHeight = tcs.imagesContainer.find("img").first().height();
        tcs.desHeight = tcs.itemsContainer.children(".item").first().outerHeight();
        tcs.itemsContainer.find(".item-wrapper").each(function() {
            var e = $(this).outerHeight() / -2;
            $(this).css("margin-top", e)
        });
        tcs.slideCount = tcs.imagesContainer.find(".item").length;
        tcs.currentSlideIndex = 0;
        tcs.counterTotal.html(tcs.slideCount);
        tcs.imagesContainer.children().each(function(e, t) {
            tcs.imagesContainer.prepend(t)
        });
        tcs.initMargin = tcs.imagesContainer.height() * (tcs.slideCount -
            1);
        tcs.imagesContainer.css("margin-top", "-=" + tcs.initMargin)
    },
    nextSlide: function() {
        tcs.currentSlideIndex++;
        this.updateCounter(tcs.currentSlideIndex);
        if (tcs.currentSlideIndex + 1 == tcs.slideCount) tcs.nextButton
            .fadeOut();
        tcs.prevButton.fadeIn();
        (new TimelineLite).to(tcs.imagesContainer, 1, {
            marginTop: "+=" + tcs.imageHeight,
            ease: Power4.easeOut
        }).to(tcs.itemsContainer, .8, {
            marginTop: "-=" + tcs.desHeight,
            ease: Power4.easeOut
        }, "-=1")
    },
    prevSlide: function() {
        tcs.currentSlideIndex--;
        this.updateCounter(tcs.currentSlideIndex);
        if (tcs.currentSlideIndex == 0) {
            tcs.prevButton.fadeOut()
        }
        tcs.nextButton.fadeIn();
        (new TimelineLite).to(tcs.imagesContainer, 1, {
            marginTop: "-=" + tcs.imageHeight,
            ease: Power4.easeOut
        }).to(tcs.itemsContainer, .8, {
            marginTop: "+=" + tcs.desHeight,
            ease: Power4.easeOut
        }, "-=1")
    },
    updateCounter: function(e) {
        tcs.counterCurrent.html(e + 1)
    },
    bindUIActions: function() {
        self = this;
        tcs.nextButton.on("click", function() {
            self.nextSlide()
        });
        tcs.prevButton.on("click", function() {
            self.prevSlide()
        })
    }
};
submitContact()