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
				clearTimeout(a.timeout);
				a.remove();
			}
			this.alerts.unshift(b);
			this.el.append(b);
			b.timeout = setTimeout(function() {
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
				setTimeout(
					Achievements.give.bind(
						Achievements, 
						Achievements.achBased["have" + n]
						), 500);
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
	};

	Achievements.achMilestones = [1,5,10,25,50,75,100,125,150,200,250];
	Achievements.achMilestones.forEach(function(n) {
		Achievements.achBased["have" + n] = {
			title: "Earn " + n + " Achievements",
	    label: "<span class='label-s'><i class='fa fa-trophy'></i>" + n + "</span>",
	    desc: "Great start, but there are more to find. Keep going!",
	    spoiler: 0
		}
	});
	Achievements.achBased["have1"].title = "Earn an achievement";
	Achievements.achBased["have1"].spoiler = 1;
	Achievements.achBased["have5"].spoiler = 1;

	Achievements.addAll(Achievements.achBased);

	/****
		Key press Achievements
		****/
	Achievements.keypress = {
		chars: "abcdefghijklmnopqrstuvwxyz",
		digits: "1234567890",
		map: {},
	};

	Achievements.keypress.chars.split("").forEach(function(c) {
		var a = {
		    title: "Press " + c,
		    label: c,
		    desc: "Press the " + c + " key.",
		    spoiler: 0,
		    presses: 0
		  };
		Achievements.add(a);
		Achievements.keypress.map[c.toUpperCase()] = a;
	});
	Achievements.keypress.map["A"].spoiler = 1;
	Achievements.keypress.map["B"].spoiler = 1;
	Achievements.keypress.map["C"].spoiler = 1;
	Achievements.keypress.map["D"].spoiler = 1;

	for (var i = 1; i <= 10; i++) {
		var c = i < 10 ? i : 0;
		var a = {
		    title: "Press " + c,
		    label: c,
		    desc: "Press the " + c + " key " + Math.pow(2, i) + " times.",
		    spoiler: 1,
		    presses: 0
		  };
		Achievements.add(a);
		Achievements.keypress.map[i] = a;
	}

	Achievements.keypress.gg = {
	    title: "Good Game",
	    label: "GG",
	    desc: "Well played.",
	    spoiler: 1
	};
	Achievements.add(Achievements.keypress.gg);

	Achievements.keypress.map["U"].desc = "Oops, it must have been stuck.";

	Achievements.keypress.caps = {
	    title: "LOUD NOISES",
	    label: "<span class='label-m'>ABC</span>",
	    desc: "Turn on caps lock.",
	    spoiler: 1
	};
	Achievements.add(Achievements.keypress.caps);

	Achievements.keypress.ctrl = {}
	Achievements.keypress.ctrl["C"] = {
	    title: "Plagiarism",
	    label: "<i class='fa fa-copy'></i>",
	    desc: "Copy some text from the page.",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["X"] = {
	    title: "Vandalism",
	    label: "<i class='fa fa-scissors'></i>",
	    desc: "Try to cut some text from the page.",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["V"] = {
	    title: "PVA",
	    label: "<i class='fa fa-paste'></i>",
	    desc: "Paste something.",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["P"] = {
	    title: "PC LOAD LETTER",
	    label: "<i class='fa fa-print'></i>",
	    desc: "Print the page (don't actually print the page).",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["S"] = {
	    title: "Why...?",
	    label: "<i class='fa fa-save'></i>",
	    desc: "Try to save the page.",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["Z"] = {
	    title: "Oops",
	    label: "<i class='fa fa-undo'></i>",
	    desc: "Try to undo something.",
	    spoiler: 1
	};
	Achievements.keypress.ctrl["A"] = {
	    title: "I Want It All",
	    label: "<span class='label-m'><span class='selected'>*</span></span>",
	    desc: "Select everything.",
	    spoiler: 1
	};
	Achievements.addAll(Achievements.keypress.ctrl);

	addEventListener("keydown", function(e) {
		console.log(e);
		var letter = String.fromCharCode(e.keyCode);
		console.log(e.keyCode, letter);
		var a = Achievements.keypress.map[letter];
		if (a) {
			a.presses++;
			var lastTime = a.lastPressed;
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
				console.log("A");
				a.lastPressed = Date.now();
				if (letter === 'G' && lastTime && a.lastPressed - lastTime < 200) {
					Achievements.give(Achievements.keypress.gg);
				} else if (letter === 'U') {
					if (a.presses === 8) {
						Achievements.give(a);
					}
				} else {
					Achievements.give(a);
				}
			} else if (e.ctrlKey || e.metaKey) {
				var ach;
				if (ach = Achievements.keypress.ctrl[letter]) {
					Achievements.give(ach);
				}
			}
		}
		if (e.keyCode === 20) {
			Achievements.give(Achievements.keypress.caps);
		}
	});

	/****
		Window-based Achievements
		****/
	Achievements.window = {};
	Achievements.window.growH = {
			title: "Does My Window Look Big In This?",
	    label: "<i class='fa fa-arrows-h'></i>",
	    desc: "Because you know I'm all about that space.",
	    spoiler: 1
	};
	Achievements.window.shrinkV = {
			title: "Honey I Shrunk The Browser",
	    label: "<i class='fa fa-arrows-v'></i>",
	    desc: "Shrink the browser vertically.",
	    spoiler: 1
	};
	Achievements.window.shrinkH = {
			title: "Rapid Weight Loss",
	    label: "<i class='fa fa-arrows-h'></i>",
	    desc: "Make the browser window skinny.",
	    spoiler: 1
	};
	Achievements.window.growV = {
			title: "Growth Spurt",
	    label: "<i class='fa fa-arrows-v'></i>",
	    desc: "Make the browser window tall.",
	    spoiler: 1
	};

	Achievements.window.help = {
			title: "#help",
	    label: "<span class='label-xs'>#help</span>",
	    desc: "Ask for help in the address bar.",
	    spoiler: 1
	};

	Achievements.window.load = {
			title: "In The Beginning",
	    label: "<span class='label-xs'>init()</span>",
	    desc: "Start the game.",
	    spoiler: 2
	};

	Achievements.window.dblclick = {
			title: "Click Click",
	    label: "<i class='fa fa-location-arrow icon-double'></i>",
	    desc: "Double click.",
	    spoiler: 1
	};

	Achievements.window.blur = {
			title: "Gone But Not Forgotten",
	    label: "<i class='fa fa-minus-square-o'></i>",
	    desc: "Leave the page but don't close it.",
	    spoiler: 0
	};
	Achievements.window.focus = {
			title: "Can't Stay Away",
	    label: "<i class='fa fa-plus-square'></i>",
	    desc: "Come back to the page.",
	    spoiler: 0
	};

	Achievements.window.selection = {
			title: "Re-Rewind",
	    label: "<span class='label-m'>A<span class='selected'>chi</span></span>",
	    desc: "Find the greek letter in the title.",
	    spoiler: 1
	};

	Achievements.window.narcissist = {
			title: "Narcissist",
	    label: "<i class='fa fa-" + (Math.random() < 0.5 ? "male" : "female") + "'></i>",
	    desc: "It's all about me, me, me.",
	    spoiler: 1
	};

	Achievements.window.em = {
			title: "Emphasis",
	    label: "<i class='fa fa-italic'></i>",
	    desc: "It's semantic.",
	    spoiler: 2
	};

	Achievements.addAll(Achievements.window);

	Achievements.window.lastW = window.innerWidth;
	Achievements.window.lastH = window.innerHeight;
	addEventListener('resize', function() {
			if (window.innerWidth < Achievements.window.lastW) {
				Achievements.give(Achievements.window.shrinkH);
			}
			if (window.innerWidth > Achievements.window.lastW) {
				Achievements.give(Achievements.window.growH);
			}
			if (window.innerHeight < Achievements.window.lastH) {
				Achievements.give(Achievements.window.shrinkV);
			}
			if (window.innerHeight > Achievements.window.lastH) {
				Achievements.give(Achievements.window.growV);
			}
			Achievements.window.lastW = window.innerWidth;
			Achievements.window.lastH = window.innerHeight;
	});

	addEventListener('hashchange', function(e) {
		var hash = e.newURL.split("#")[1];
		if (hash === "help") {
			Achievements.give(Achievements.window.help);
		}
	});

	addEventListener('load', function() {
		Achievements.give(Achievements.window.load);
	});

	addEventListener('dblclick', function() {
		Achievements.give(Achievements.window.dblclick);
	});

	addEventListener('blur', function(e) {
		Achievements.give(Achievements.window.blur);
		Achievements.left = true;
	});

	addEventListener('focus', function(e) {
		if (Achievements.left)
			Achievements.give(Achievements.window.focus);
	});

	addEventListener('mouseup', function() {
		Achievements.clicks.total++;
		Achievements.clicks.milestones.forEach(function(n) {
			if (Achievements.clicks.total === n) {
				Achievements.give(Achievements.clicks.ach[n]);
			}
		});
		var sel = window.getSelection().toString().toLowerCase();
		if (sel === 'chi') {
			Achievements.give(Achievements.window.selection);
		} else if (sel === 'me' || sel === 'i') {
			Achievements.give(Achievements.window.narcissist);
		} else if (sel === 'em') {
			Achievements.give(Achievements.window.em);
		}
	});

	/****
		Clicking Achievements
		****/
	Achievements.clicks = {
		total: 0,
		milestones: [25, 50, 100, 150, 200, 250, 500],
		ach: {}
	};
	Achievements.clicks.milestones.forEach(function(n) {
		Achievements.clicks.ach[n] = {
			title: "Click " + n + " Times",
	    label: "<span class='label-s'><i class='fa fa-location-arrow'></i>" + n + "</span>",
	    desc: "You clicked " + n + " times. Are you making cookies or something?",
	    spoiler: 0
		}
	});
	Achievements.clicks.ach[25].spoiler = 1;
	Achievements.clicks.ach[200].desc = "There are no more achievements for clicking, I swear.";
	Achievements.clicks.ach[250].desc = "No, really, this is the last one. Please rest your fingers.";
	Achievements.clicks.ach[500].desc = "Seriously. For real this time. What would the next one even be? 1000? That's crazy.";
	Achievements.addAll(Achievements.clicks.ach);

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

	Achievements.ui.clearsearch = {
		title: "Clear",
		label: "<i class='fa fa-search'>*</i>",
		desc: "Discovered that clicking on the search icon clears the search box!",
		spoiler: 0
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

	/*****
		INTERACTABLE
		*****/
	Achievements.inter = {};
	Achievements.inter.click = {
		title: "Touch Me",
		label: "<i class='fa fa-rotate-right'></i>",
		desc: "Click on this achievement.",
		spoiler: 1
	}

	Achievements.inter.ask = {
		title: "You Only Have To Ask",
		label: "<i class='fa fa-support'></i>",
		desc: "Ask and you shall receive.",
		spoiler: 1
	}
	Achievements.addAll(Achievements.inter);




	/*****
		POPULATE ACHIEVEMENT INTO DOM
		*****/
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
			/*****
				SEARCH INPUT Achievements
				******/
			var q = $('#search_input').val().toLowerCase();
			if (q !== "") {
				Achievements.give(Achievements.ui.filter);
			}
			if (q === "help") {
				Achievements.give(Achievements.ui.help);
			} else if (q === "you only have to ask") {
				Achievements.give(Achievements.inter.ask);
			}
			if (total === 0) {
				$("#no_results").removeClass("display-none").show();
				Achievements.give(Achievements.ui.noresults);
			} else {
				$("#no_results").addClass("display-none");
			}
		}
	});

	$("#search-icon").click(function() {
		if ($('#search_input').val()  !== '') {
			Achievements.give(Achievements.ui.clearsearch);
		}
		$('#search_input').val("").change();
	})

	Achievements.updateStats();


	/******
		Interactivity that needs Achievements to be in the DOM
		******/
	Achievements.inter.click.labelEl.click(function() {
		Achievements.give(Achievements.inter.click);
	})


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
