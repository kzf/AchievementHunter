$(function() {

	var Alerts = {
		alerts: [],
		el: $(".ach-alerts"),
		addAlert: function(ach) {
			var b = $("<div>").addClass("alert").addClass("achieved");
			var achTitle = $("<h3>").text(ach.title).addClass("alert-title");
			var achDesc = $("<span>").text(ach.desc).addClass("alert-desc");
			var achLabel = $("<span>").html(ach.label).addClass("ach-label").addClass("pull-left");
			b.append(achLabel).append(achTitle).append(achDesc);
			if (this.alerts.length === 3) {
				var a = this.alerts.pop();
				a.addClass("alert-hide");
			}
			this.alerts.unshift(b);
			this.el.append(b);
			setTimeout(function() {
				b.remove()
			}, 5000);
		}
	}

  $("#darken").click(function() {
  	$("body, main").addClass("dark");
  	Achievements.give(Achievements.ui.dark);
  });
  $("#lighten").click(function() {
  	$("body, main").removeClass("dark");
  	Achievements.give(Achievements.ui.light);
  });

  $("#grid-view").click(function() {
  	sl.addClass("ach-grid");
  	Achievements.give(Achievements.ui.gridView);
  });
  $("#bars-view").click(function() {
  	sl.removeClass("ach-grid");
  	Achievements.give(Achievements.ui.barView);
  });
  $("#toggle-stats").click(function() {
  	$("#stats").toggleClass("display-none");
  });

  var sl = $("#search_list");

  var Achievements = {
  	list: [],
  	add: function(a) {
  		this.list.push(a);
  		this.total++;
  	},
  	addAll: function(o) {
  		for (var a in o) {
				if (o.hasOwnProperty(a)) {
					Achievements.add(o[a]);
				}
			}
  	},
  	updateStats: function() {
  		this.achievedEl.text(this.achieved);
  		this.totalEl.text(this.total);
  	},
  	total: 0,
  	achieved: 0,
  	achievedEl: $("#num-achieved"),
  	totalEl: $("#total-achieved")
  };
  Achievements.give = function(a) {
		if (a.achieved) return;
		a.achieved = true;
		a.element.addClass("achieved");
		a.labelEl.html(a.label);
		a.titleEl.text(a.title);
		a.descEl.text(a.desc);
		Alerts.addAlert(a);
		var lastAchieve = this.lastAchievementTime;
		this.lastAchievementTime = Date.now();
		if (this.lastAchievementTime - lastAchieve < 200) {
			Achievements.give(Achievements.achBased.consecutive);
		}
		var achieved = ++this.achieved;
		Achievements.achMilestones.forEach(function(n) {
			if (n === achieved) {
				Achievements.give(Achievements.achBased["have" + n]);
			}
		});
		this.updateStats();
	}

	/****
		Achievement-based Achievements
		****/
	Achievements.achBased = {};
	Achievements.achBased.consecutive = {
			title: "Timely",
	    label: "<i class='fa fa-clock-o'></i>",
	    desc: "Get two achievements consecutively.",
	    spoiler: 1
	}

	Achievements.achMilestones = [1,5,10,25,50,75,100,125,150,200,250];
	Achievements.achMilestones.forEach(function(n) {
		Achievements.achBased["have" + n] = {
			title: "Earn " + n + " Achievements",
	    label: "<span class='label-s'><i class='fa fa-trophy'></i>" + n + "</span>",
	    desc: "Well played.",
	    spoiler: 1
		}
	});
	Achievements.achBased["have1"].title = "Earn an achievement";

	Achievements.addAll(Achievements.achBased);

	/****
		Key press Achievements
		****/
	Achievements.keypress = {
		chars: "abcdefghijklmnopqrstuvwxyz",
		map: {},
	};

	Achievements.keypress.chars.split("").forEach(function(c) {
		var a = {
		    title: "Press " + c,
		    label: c,
		    desc: "Press the " + c + " key.",
		    spoiler: 1,
		    presses: 0
		  };
		Achievements.add(a);
		Achievements.keypress.map[c.toUpperCase()] = a;
	});

	Achievements.keypress.gg = {
	    title: "Good Game",
	    label: "GG",
	    desc: "Well played.",
	    spoiler: 1
	}
	Achievements.add(Achievements.keypress.gg);

	Achievements.keypress.map["Y"].title = "Press y";
	Achievements.keypress.map["Y"].desc = "Oops, it must have been stuck.";

	addEventListener("keydown", function(e) {
		var letter = String.fromCharCode(e.keyCode);
		var a = Achievements.keypress.map[letter];
		if (a) {
			a.presses += 1;
			var lastTime = a.lastPressed;
			a.lastPressed = Date.now();
			if (letter === 'G' && lastTime && a.lastPressed - lastTime < 200) {
				Achievements.give(Achievements.keypress.gg);
			} else if (letter === 'Y') {
				if (a.presses === 5) {
					Achievements.give(a);
				}
			} else {
				Achievements.give(a);
			}

		}
	});

	/****
		UI Achievements
		****/
	Achievements.ui = {};
	Achievements.ui.barView = {
		title: "List View",
		label: "<i class='fa fa-align-justify'></i>",
		desc: "View your achievements in a list.",
		spoiler: 2
	}

	Achievements.ui.gridView = {
		title: "Grid View",
		label: "<i class='fa fa-th'></i>",
		desc: "Switch back to viewing your achievements in a grid.",
		spoiler: 2
	}

	Achievements.ui.filter = {
		title: "Filter",
		label: "<i class='fa fa-search'></i>",
		desc: "Used the filter box to filter achievements.",
		spoiler: 1
	}

	Achievements.ui.noresults = {
		title: "Nothing To See Here",
		label: "{}",
		desc: "Failed to find any results.",
		spoiler: 0
	}

	Achievements.ui.help = {
		title: "I Need Somebody",
		label: "<span class='label-xs'>H.E.L.P.</span>",
		desc: "Ask for help.",
		spoiler: 1
	}

	Achievements.ui.light = {
		title: "Let There Be Light",
		label: "<i class='fa fa-lightbulb-o inverse-icon'></i>",
		desc: "Use the light theme.",
		spoiler: 0
	}

	Achievements.ui.dark = {
		title: "LIGHTS OUT!",
		label: "<i class='fa fa-lightbulb-o'></i>",
		desc: "Get ready for bed.",
		spoiler: 0
	}
	Achievements.addAll(Achievements.ui);



	Achievements.list.forEach(function(a) {
		a.achieved = false;
	  a.element = $("<li>").addClass("achievement");
	  a.labelEl = $("<span>").text("?").addClass("ach-label");
	  if (a.spoiler > 0) a.labelEl.html(a.label);
	  a.titleEl = $("<h3>").text("???").addClass("ach-title");
	  if (a.spoiler > 0) a.titleEl.html(a.title);
	  a.descEl = $("<span>").text("???").addClass("ach-desc");
	  if (a.spoiler > 1) a.descEl.html(a.desc);
	  a.tooltipEl = $("<div>").addClass("tooltip").append(a.titleEl).append(a.descEl);
	  a.element.append(a.labelEl).append(a.tooltipEl);
	  sl.append(a.element);
	});


	$('#search_input').fastLiveFilter('#search_list', {
		timeout: 100,
		callback: function(total) {
			if ($('#search_input').val() !== "") {
				Achievements.give(Achievements.ui.filter);
			}
			if ($('#search_input').val().toLowerCase() === "help") {
				Achievements.give(Achievements.ui.help);
			}
			if (total === 0) {
				$("#no_results").removeClass("display-none").show();
				Achievements.give(Achievements.ui.noresults);
			} else {
				$("#no_results").addClass("display-none");
			}
		}
	});

	Achievements.updateStats();


});





/**
 * fastLiveFilter jQuery plugin 1.0.3
 * 
 * Copyright (c) 2011, Anthony Bush
 * License: <http://www.opensource.org/licenses/bsd-license.php>
 * Project Website: http://anthonybush.com/projects/jquery_fast_live_filter/
 **/

jQuery.fn.fastLiveFilter = function(list, options) {
	// Options: input, list, timeout, callback
	options = options || {};
	list = jQuery(list);
	var input = this;
	var lastFilter = '';
	var timeout = options.timeout || 0;
	var callback = options.callback || function() {};
	
	var keyTimeout;
	
	// NOTE: because we cache lis & len here, users would need to re-init the plugin
	// if they modify the list in the DOM later.  This doesn't give us that much speed
	// boost, so perhaps it's not worth putting it here.
	var lis = list.children();
	var len = lis.length;
	var oldDisplay = len > 0 ? lis[0].style.display : "block";
	callback(len); // do a one-time callback on initialization to make sure everything's in sync
	
	input.change(function() {
		// var startTime = new Date().getTime();
		var filter = input.val().toLowerCase();
		var li, innerText;
		var numShown = 0;
		for (var i = 0; i < len; i++) {
			li = lis[i];
			innerText = !options.selector ? 
				(li.textContent || li.innerText || "") : 
				$(li).find(options.selector).text();
			
			if (innerText.toLowerCase().indexOf(filter) >= 0) {
				if (li.style.display == "none") {
					li.style.display = oldDisplay;
				}
				numShown++;
			} else {
				if (li.style.display != "none") {
					li.style.display = "none";
				}
			}
		}
		callback(numShown);
		// var endTime = new Date().getTime();
		// console.log('Search for ' + filter + ' took: ' + (endTime - startTime) + ' (' + numShown + ' results)');
		return false;
	}).keydown(function() {
		clearTimeout(keyTimeout);
		keyTimeout = setTimeout(function() {
			if( input.val() === lastFilter ) return;
			lastFilter = input.val();
			input.change();
		}, timeout);
	});
	return this; // maintain jQuery chainability
}
