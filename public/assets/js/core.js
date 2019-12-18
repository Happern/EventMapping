var core = {
	rangeSlider: function() {
		
		if($("#slider-range-1").length > 0) {
			$( "#slider-range-1" ).slider({
				range: true,
		      min: 0,
		      max: 1000,
		      values: [ 0, 1000 ],
				create: function( event, ui ) {
					$("#slider-range-1 .ui-slider-handle").append('<div class="range-tooltip">50</div>');
					$("#slider-range-1 .ui-slider-handle:last-child").append('<div class="range-tooltip">200</div>');
		      	},
				slide: function( event, ui ) {
					$("#slider-range-1 .ui-slider-handle .range-tooltip").html(ui.values[0])
					$("#slider-range-1 .ui-slider-handle:last-child .range-tooltip").html(ui.values[1]);
				},
				change:function(event, ui){
					_GLOBAL.event.applyFilter();
					}
			});
		}

		if($("#slider-range-2").length > 0) {
			$( "#slider-range-2" ).slider({
				range: true,
				min: 1,
				max: 3,
				values: [ 1, 3 ],
				create: function( event, ui ) {
					$("#slider-range-2 .ui-slider-handle").append('<div class="range-tooltip">low</div>');
					$("#slider-range-2 .ui-slider-handle:last-child").append('<div class="range-tooltip">mid</div>');
		      	},
				slide: function( event, ui ) {
					if(ui.values[0] == 1) {
						$("#slider-range-2 .ui-slider-handle").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[0] == 2) {
						$("#slider-range-2 .ui-slider-handle").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[0] == 3) {
						$("#slider-range-2 .ui-slider-handle").eq(0).find(".range-tooltip").html("high");
					}

					if(ui.values[1] == 1) {
						$("#slider-range-2 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[1] == 2) {
						$("#slider-range-2 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[1] == 3) {
						$("#slider-range-2 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("high");
					}
				},
				change:function(event, ui){
					_GLOBAL.event.applyFilter();
					}
			});
		}

		if($("#slider-range-3").length > 0) {
			$( "#slider-range-3" ).slider({
				range: true,
				min: 1,
				max: 3,
				values: [ 1, 3 ],
				create: function( event, ui ) {
					$("#slider-range-3 .ui-slider-handle").append('<div class="range-tooltip">low</div>');
					$("#slider-range-3 .ui-slider-handle:last-child").append('<div class="range-tooltip">mid</div>');
		      	},
				slide: function( event, ui ) {
					if(ui.values[0] == 1) {
						$("#slider-range-3 .ui-slider-handle").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[0] == 2) {
						$("#slider-range-3 .ui-slider-handle").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[0] == 3) {
						$("#slider-range-3 .ui-slider-handle").eq(0).find(".range-tooltip").html("high");
					}

					if(ui.values[1] == 1) {
						$("#slider-range-3 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[1] == 2) {
						$("#slider-range-3 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[1] == 3) {
						$("#slider-range-3 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("high");
					}
				},
				change:function(event, ui){
					_GLOBAL.event.applyFilter();
					}
			});
		}

		if($("#slider-range-4").length > 0) {
			$( "#slider-range-4" ).slider({
				range: true,
				min: 1,
				max: 3,
				values: [ 1,3],
				create: function( event, ui ) {
					$("#slider-range-4 .ui-slider-handle").append('<div class="range-tooltip">low</div>');
					$("#slider-range-4 .ui-slider-handle:last-child").append('<div class="range-tooltip">mid</div>');
		      	},
				slide: function( event, ui ) {
					if(ui.values[0] == 1) {
						$("#slider-range-4 .ui-slider-handle").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[0] == 2) {
						$("#slider-range-4 .ui-slider-handle").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[0] == 3) {
						$("#slider-range-4 .ui-slider-handle").eq(0).find(".range-tooltip").html("high");
					}

					if(ui.values[1] == 1) {
						$("#slider-range-4 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[1] == 2) {
						$("#slider-range-4 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[1] == 3) {
						$("#slider-range-4 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("high");
					}
				},
				change:function(event, ui){
					_GLOBAL.event.applyFilter();
					}
			});
		}

		if($("#slider-range-5").length > 0) {
			$( "#slider-range-5" ).slider({
				range: true,
				min: 1,
				max: 3,
				values: [ 1, 3 ],
				create: function( event, ui ) {
					$("#slider-range-5 .ui-slider-handle").append('<div class="range-tooltip">low</div>');
					$("#slider-range-5 .ui-slider-handle:last-child").append('<div class="range-tooltip">mid</div>');
		      	},
				slide: function( event, ui ) {
					if(ui.values[0] == 1) {
						$("#slider-range-5 .ui-slider-handle").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[0] == 2) {
						$("#slider-range-5 .ui-slider-handle").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[0] == 3) {
						$("#slider-range-5 .ui-slider-handle").eq(0).find(".range-tooltip").html("high");
					}

					if(ui.values[1] == 1) {
						$("#slider-range-5 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("low");
					}else if(ui.values[1] == 2) {
						$("#slider-range-5 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("mid");
					}else if(ui.values[1] == 3) {
						$("#slider-range-5 .ui-slider-handle:last-child").eq(0).find(".range-tooltip").html("high");
					}
				},
				change:function(event, ui){
					_GLOBAL.event.applyFilter();
					}
			});
		}


	},
	toggleButton: function() {
		$(".toggle-trigger").click(function(){
			$(this).toggleClass("active");
			if(_GLOBAL.funcMap[$(this).attr("name")]!=undefined)
			_GLOBAL.funcMap[$(this).attr("name")]($(this).hasClass("active"));

		});
	},
	sidebarScroll: function() {
		if( $("#sidebar").length > 0 && $("html").hasClass("no-touch") ) {
			$("#sidebar").niceScroll();
		}
	},
	datepicker: function() {
		if($("#datepicker-1").length > 0) {
			$("#datepicker-1").datepicker();
		}
		if($("#datepicker-2").length > 0) {
			$("#datepicker-2").datepicker();
		}
		$(".hasDatepicker").change(function() {
			if($(this).val().length > 0) {
				$(this).parents(".form-group").addClass("has-dirty");
			}else{
				$(this).parents(".form-group").removeClass("has-dirty");
			}
		});
		var d0=moment().format("MM/DD/YYYY"); 
		var d1=moment().add(7, 'days').format("MM/DD/YYYY"); 
		$("#datepicker-1").val(d0);
		$("#datepicker-2").val(d1);
		
		
	},
	autocomplete: function(){
		if($("#autocomplete").length > 0) {
			var availableTags = [
		      "ActionScript",
		      "AppleScript",
		      "Asp",
		      "BASIC",
		      "C",
		      "C++",
		      "Clojure",
		      "COBOL",
		      "ColdFusion",
		      "Erlang",
		      "Fortran",
		      "Groovy",
		      "Haskell",
		      "Java",
		      "JavaScript",
		      "Lisp",
		      "Perl",
		      "PHP",
		      "Python",
		      "Ruby",
		      "Scala",
		      "Scheme"
		    ];
		    $( "#autocomplete" ).autocomplete({
		      source: availableTags
		    });
		}
	},
	checkedGroupDropdown: function() {
		$("#sidebar .actions-wrapper ul > li .checked-group .item .top").not(".action").click(function() {
			$(this).parents(".item").toggleClass("has-selected");
			$(this).parents(".item").find(".bottom").stop().slideToggle(function(){
				$("#sidebar").getNiceScroll().resize();
			});
		});
	},
	subDropdown: function() {
		$("#sidebar .actions-wrapper ul > li.has-dropdown .dropdown-content .content-wrapper.has-arrow .highlighter").click(function() {
			$(this).parents(".content-wrapper").toggleClass("has-selected");
			$(this).parents(".content-wrapper").find(".range-wrapper, .language-wrapper").stop().slideToggle(function(){
				$("#sidebar").getNiceScroll().resize();
			});
		});
	},
	mainDropdown: function() {
		$("#sidebar .actions-wrapper ul > li.has-dropdown > * > a").click(function() {
			$(this).parents(".has-dropdown").toggleClass("has-selected");
			$(this).parents(".has-dropdown").find(".dropdown-content").stop().slideToggle(function(){
				$("#sidebar").getNiceScroll().resize();
			});
		});
	},
	sidebarVisibility: function() {
		$(".trigger-sidebar").click(function() {
			$("body").toggleClass("hidden-sidebar");
			if ($("body").hasClass("hidden-sidebar")) {
				$("#sidebar").animate({
					"left" : -300
				},function() {
					$("#sidebar-darken").animate({
						"left" : 0
					});
				});
			}else {
				$("#sidebar-darken").animate({
					"left" : -64
				},function() {
					$("#sidebar").animate({
						"left" : 0
					});
				});
			}
		});
	},
	languageRadio: function() {
		$("#sidebar .actions-wrapper ul > li.has-dropdown .dropdown-content .language-wrapper .item").click(function() {
			$(this).parents(".language-wrapper").find(".item.selected").removeClass("selected");
			$(this).addClass("selected");
			//$("input", this).trigger("click");
			_GLOBAL.event.applyFilter();
		});
	},
	recentlyDate: function() {
		

		$("#sidebar .date-selector .recently-list li a").click(function() {
			$(this).parents(".recently-list").find("li").each(function(){
				if($(".active", this).length > 0) {
					$(".active", this).removeClass("active");
				}
			});
			$(this).addClass("active");
			
			var d0;
			var d1;
			switch($(this).attr("data-type"))
			{
				case "today":
					d0=moment().format("MM/DD/YYYY"); 
					d1=moment().add(1, 'days').format("MM/DD/YYYY"); 
				break;
				case "tomorrow":
					d0=moment().add(1, 'days').format("MM/DD/YYYY"); 
					d1=moment().add(2, 'days').format("MM/DD/YYYY"); 
				break;
				case "weekend":
					d0=moment().endOf('week').format("MM/DD/YYYY"); 
					d1=moment().endOf('week').add(1, 'days').format("MM/DD/YYYY");
				break;
			}
			$("#datepicker-1").val(d0);
			$("#datepicker-2").val(d1);
			_GLOBAL.event.timeChanged();
		});
	},
	triggertoggleButton: function() {
		$("#sidebar .actions-wrapper ul > li > * > a").click(function(event) {
			if(event.target.nodeName != "I") {
				if($(this).parents("li").hasClass("has-dropdown")) {
				
					if($(this).parents("li").hasClass("has-selected")) {
						$(this).parents(".main-item").find(".toggle-trigger").addClass("active");
						$(this).parents(".main-item").find("input[type=checkbox]").attr("checked", true);
					}else {
						$(this).parents(".main-item").find(".toggle-trigger").removeClass("active");
						$(this).parents(".main-item").find("input[type=checkbox]").attr("checked", false);
					}
				}else {
					$(this).parents(".main-item").find(".toggle-trigger").toggleClass("active");
					if($(this).parents(".main-item").find(".toggle-trigger").hasClass("active"))
						$(this).parents(".main-item").find("input[type=checkbox]").attr("checked", true);
					else
						$(this).parents(".main-item").find("input[type=checkbox]").attr("checked", false);
						
				}
			}
		});
	},
	triggerSubChecked: function() {
		$("#sidebar .actions-wrapper ul > li .checked-group .item .top .action span").click(function(event) {
			event.stopPropagation();
			
			var children=$(this).parents(".checked-group").children();
			var selected=$(this).parents(".checked-group").find(".item.has-selected");
			if($(this).hasClass("selected") && selected.length==1) // select all
			{
				children.each(function(i, item){
					$(item).addClass("has-selected");
					$(item).find(".top .action span").addClass("selected");
					$(item).find(".bottom").stop().slideUp();
					$(item).find(".sub-item").each(function() {
						$(".action span", this).addClass("selected");
						$(this).addClass("selected");
					});
					});
			}
			else // select just this one
			{
				children.each(function(i, item){
					$(item).removeClass("has-selected");
					$(item).find(".top .action span").removeClass("selected");
					$(item).find(".bottom").stop().slideUp();
					$(item).find(".sub-item").each(function() {
						$(".action span", this).removeClass("selected");
						$(this).removeClass("selected");
					});
					});
					
				$(this).addClass("selected");
				$(this).parents(".item").addClass("has-selected");
				$(this).parents(".item").find(".bottom").stop().slideDown();
				$(this).parents(".item").find(".sub-item").each(function() {
					$(".action span", this).addClass("selected");
					$(this).addClass("selected");
				});				
			}
			
			/*
			
			
			$(this).toggleClass("selected");
			if($(this).parents(".item").find(".sub-item").length > 0) {
				if($(this).hasClass("selected")) {
					$(this).parents(".item").addClass("has-selected");
					$(this).parents(".item").find(".bottom").stop().slideDown();
					$(this).parents(".item").find(".sub-item").each(function() {
						$(".action span", this).addClass("selected");
						$(this).addClass("selected");
					});
				}else{
					$(this).parents(".item").find(".sub-item").each(function() {
						$(".action span", this).removeClass("selected");
						$(this).removeClass("selected");
					});
				}
				
			}*/
			_GLOBAL.event.applyFilter();
		});
	},
	subItemChecked: function() {
		
		$("#sidebar .actions-wrapper ul > li .checked-group .item .bottom .wrap li .sub-item").click(function() {
			
			var children=$(this).parent().parent().children();
			var selected=$(this).parent().parent().find("li .sub-item.selected");
			if($(this).hasClass("selected") && selected.length==1)
			{
				children.each(function(i, item){
					$(item).find(".sub-item").addClass("selected")
					$(item).find(".sub-item .action span").addClass("selected")
					});
			}
			else
			{
				children.each(function(i, item){
					$(item).find(".sub-item").removeClass("selected")
					$(item).find(".sub-item .action span").removeClass("selected")
					});
				$(this).toggleClass("selected");
				$(".action span", this).toggleClass("selected");
			}

			_GLOBAL.event.applyFilter();
		});
	},
	tooltip: function() {
		$(".tooltip-icon").click(function() {
			var _id = $(this).attr("data-tooltip");
			var _offset = parseInt($(this).offset().top);
			$(".tooltip-content.has-visible").removeClass("has-visible");
			$(".tooltip-content[data-selector='" + _id + "']").addClass("has-visible").css({"top" : _offset});
		});

		// close action
		$(".tooltip-content .close").click(function() {
			$(this).parents(".tooltip-content").removeClass("has-visible");
		});
	}
}

$(function(){
	$("*").on({
		click: function () {
			return true;
		}
	});

	core.rangeSlider();
	core.toggleButton();
	core.sidebarScroll();
	core.datepicker();
	core.autocomplete();
	core.checkedGroupDropdown();
	core.subDropdown();
	core.mainDropdown();
	core.sidebarVisibility();
	core.languageRadio();
	core.recentlyDate();
	core.triggertoggleButton();
	core.triggerSubChecked();
	core.subItemChecked();
	core.tooltip();
	

	
});

$(window).resize(function(){

});