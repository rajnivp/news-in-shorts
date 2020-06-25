;(function () {

	'use strict';

	var counter = 0;
	var quantity = 12;
	var q = null;

    var about_html = `<div id="gallery-main" class="about-section"><div class="gallery-services gallery-work col-md-9 col-md-offset-2 ">
            <div class="container-fluid"><div class="row"><div class="col-md-9"><span class="heading-meta">What I Do?</span>
            <h2 class="gallery-heading" >About Us</h2>
            </div></div><div class="row"><div class="col-md-9 ">
            <div class="gallery-text"><h3>Help &amp; Support</h3>
            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. </p>
            </div></div></div></div></div><div class="gallery-contact gallery-work col-md-9 col-md-offset-2 ">
            <div class="container-fluid"><div class="row"><div class="col-md-9"><span class="heading-meta">Read</span>
            <h2 class="gallery-heading ">Get In Touch</h2></div></div>
            <div class="row"><div class="col-md-9"><div class="row"><div class="col-md-9 ">
            <form id="message-form"><div class="form-group"><input type="text" class="form-control" id="name" placeholder="Name"></div>
            <div class="form-group"><input type="text" id="email" class="form-control" placeholder="Email"></div>
            <div class="form-group"><input type="text" id="phone" class="form-control" placeholder="Phone"></div>
            <div class="form-group"><textarea name="" id="message" cols="30" rows="7" class="form-control" placeholder="Message"></textarea>
            </div><div class="form-group"><input type="submit" id="send-button" class="btn btn-primary btn-send-message" value="Send Message">
            </div></form></div></div></div></div></div></div></div>`;

    var news_html = `<div id="gallery-main" class="news-section"><div class="gallery-blog gallery-work col-md-9 col-md-offset-1">
				<div class="container-fluid"><div class="row"><div class="col-md-10 col-md-offset-3 col-md-pull-3">
				<form class="pull-right" id="search-form" role="search" style="float:right">
				<input type="text" name="q" id="search-field" class="search-field" placeholder="Search">
				<button id="search-button" type="submit" class="search-button">Search</button></form>
				<span class="heading-meta">Read</span><h2 class="gallery-heading">News across the globe</h2>
				</div></div><div class="row content-holder"></div></div></div></div>`;


    var getPosts = function(){
    const start = counter;
	const end = start+quantity;
	counter = end
    $.ajax({
        type : 'POST',
        url : window.location.pathname,
        data : {'start':start, 'end':end, 'query':q}
    }).done(function(data){
    if (data){
        if (data.length==0){$(".content-holder").append($('<div class="container news-content" style="width:100%;"><h3>No content found</h3></div>'));}
        $.each(data , function(index,value){
        if (typeof value.title !== 'undefined'){
        var el = $('<div class="container news-content" style="width:100%;"><div class="row"><div class="col-sm-6 col-md-4" style="margin-top:10px;"><img src='+value.image+' class="img-responsive" alt=""></div><div class="col-sm-6 col-md-5"><span><small>'+value.time+' </small> | <small> '+value.name+' </small></span><h3>'+value.title+'</h3><p>'+value.summary+'</p><a href='+value.url+' target=blank><small style="float:right;color:grey;opacity:0.8;">Read More at '+value.name+'  </small></a></div></div><br><br></div>');
        $(".content-holder").append(el);}
                })
            }
    else{$(".content-holder").append($('<div class="container news-content" style="width:100%;"><h3>End of content</h3></div>'));}
        })
    };

    $(window).on('load',function(){
        if (window.location.pathname!='/about'){getPosts();}
    });

var addition_constant = 0;
$(document.body).on('touchmove', onScroll); // for mobile
$(window).on('scroll', onScroll);

function onScroll() {
  var addition = ($(window).scrollTop() + window.innerHeight);

  var scrollHeight = (document.body.scrollHeight - 1);
  if (addition > scrollHeight && addition_constant < addition) {

    addition_constant = addition;

    getPosts();
  }
}

    var activeClass = function(){ $(document).ready(function(){
        if(window.location.pathname=='/search'){
        let searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('q') ){let param = searchParams.get('q');document.title=param;}
        };
        $("#gallery-main-menu ul li").each(function(index,value){
            if ($(value).hasClass("gallery-active")){
                $(value).removeClass("gallery-active");
            };
            if (('/'+$(value).children().attr('data-page'))==window.location.pathname){
                $(value).addClass("gallery-active");
                if (window.location.pathname=='/'){document.title="News App Home";}
                else{document.title=$(value).children().attr('data-page');}
            };
        })
    });
    };

    $('.sub-menu li a').click(function(){
        if ($(this).attr('data-page')!= "about"){
        event.preventDefault();
        if (window.location.pathname=='/about'){$("#gallery-main").remove();$("#gallery-page").append($(news_html));}
        var page = $(this).attr('data-page');
        if (!page){
            page= "News App"
            document.title = page;
            history.pushState(null, "/", "/");
        }
        else{
        document.title = page;
        history.pushState(null, page, page);
            }
        $('.news-content').remove();
        $("#gallery-main-menu ul li.gallery-active").removeClass("gallery-active");
        $(this).parent('li').addClass('gallery-active');
        counter = 0;
        getPosts();
    }
    else{
        $("#gallery-main").remove();$("#gallery-page").append($(about_html));
        event.preventDefault();
        document.title = 'about';
        history.pushState(null, 'about', 'about');
        counter = 0;
        $("#gallery-main-menu ul li.gallery-active").removeClass("gallery-active");
        $(this).parent('li').addClass('gallery-active');
        }
    });


    $('body').on('submit','#search-form',function(){
        event.preventDefault();
        var query = $("#search-field").val();
        if (query){
            counter = 0;
            $(".news-content").remove();
            $("#search-field").val("");
            $("#gallery-main-menu ul li.gallery-active").removeClass("gallery-active");
            q = query;
            document.title = q;
            var url = q.replace(/\s{2,}/g, ' ');
            url = url.replace(/ /g, "+");
            history.pushState(null, "/search?q="+url, "/search?q="+url);
            getPosts();
        }
    });

    $('body').on('submit','#message-form',function(){
        event.preventDefault();
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var message = $("#message").val();
        if (name && email && phone && message){
        $.ajax({
            type : 'POST',
            url : "/about",
            data : {'name':name, 'email':email, 'phone':phone,'message':message}
            }).done(function(data){
            if (data){
                alert(data);
                }
            })
            $(document).on({ajaxStop:function(){
        $("#name").val("");
        $("#email").val("");
        $("#phone").val("");
        $("#message").val("");
            }})
        }
    });

    $(window).on('popstate', function() {
        activeClass();
        if(window.location.pathname=='/about'){$("#gallery-main").remove();$("#gallery-page").append($(about_html));}
        else{$("#gallery-main").remove();$("#gallery-page").append($(news_html));getPosts();}
    });

    $(document).on({
        ajaxStart: function() { $("body").addClass("loading");},
        ajaxStop: function() { $("body").removeClass("loading"); }
    });


	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};

	var burgerMenu = function() {

		$('.js-gallery-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');
			}
		});



	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#gallery-aside, .js-gallery-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-gallery-nav-toggle').removeClass('active');

	    	}

	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-gallery-nav-toggle').removeClass('active');

	    	}
		});

	};

	var stickyFunction = function() {

		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}




		});

		$('.sticky-parent').css('height', h);

		$("#sticky_item").stick_in_parent();

	};

	// Document on load.
	$(function(){
	    activeClass();
		fullHeight();
		burgerMenu();
		mobileMenuOutsideClick();
		stickyFunction();
	});


}());