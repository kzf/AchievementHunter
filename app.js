$(function() {

	/****
		STORAGE
		*****/
	var Storage = {
		load: function() {
			this.local = JSON.parse(localStorage["achievements"]);
			for (var _id in this.local) {
				if (this.local.hasOwnProperty(_id) && Achievements.by_id[_id]) {
					Achievements.give(Achievements.by_id[_id], true);
				}
			}
		},
		reset: function() {
			localStorage["achievements"] = JSON.stringify({});
			location.reload();
		},
		save: function() {
			var self = this;
			Achievements.list.forEach(function(a) {
				if (a.achieved) {
					self.local[a.title] = true;
				}
			});
			localStorage["achievements"] = JSON.stringify(this.local);
		},
		local: {}
	};

	/****
		ALERTS
		*****/
	var Alerts = {
		alerts: [],
		el: $(".ach-alerts"),
		addAlert: function(ach) {
			var b = UI.build.alert(ach.title, ach.desc, ach.label);
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
	};

	/****
		UI
		*****/
	var UI = {
		/****
			STATS
			*****/
		achView: {
			grid: true
		},
		/****
			STATS
			*****/
		stats: {
			container: $("#stats"),
			achieved: $("#num-achieved"),
  		total: $("#total-achieved")
  	},
  	/****
			PAGING
			*****/
		paging: {
			current: $("#current-page"),
			total: $("#total-pages")
  	},
  	/****
  		Save references to UI elements
  		*****/
		achievements: $("#achievements"),
		themeGroup: $("body, main"),
		filter: $('#filter'),
		noResults: $("#no_results"),
		searchIcon: $("#search-icon"),
		achList: $(".ach-list"),
		/****
			BUTTONS
			*****/
		buttons: {
			darken: $("#darken").click(function() {
			  	UI.themeGroup.addClass("dark");
			  	Achievements.give(Achievements.ui.dark);
			  }),
			lighten: $("#lighten").click(function() {
			  	UI.themeGroup.removeClass("dark");
			  	Achievements.give(Achievements.ui.light);
			  }),
			gridView: $("#grid-view").click(function() {
			  	UI.achievements.addClass("ach-grid");
			  	UI.achView.grid = true;
			  	Paging.update();
			  	Achievements.give(Achievements.ui.gridView);
			  }),
			listView: $("#bars-view").click(function() {
			  	UI.achievements.removeClass("ach-grid");
			  	UI.achView.grid = false;
			  	Paging.update();
			  	Achievements.give(Achievements.ui.barView);
			  }),
			stats: $("#toggle-stats").click(function() {
			  	UI.stats.container.toggleClass("display-none");
			  }),
			reset: $("#reset-game").click(function() {
			  	Storage.reset();
			  }),
			prevPage: $("#prev-page").click(function(e) {
				e.preventDefault();
				Paging.prevPage();
			}),
			nextPage: $("#next-page").click(function(e) {
				e.preventDefault();
				Paging.nextPage();
			})
		},
		/****
			Functions that build UI elements
			*****/
		build: {
			alert: function(title, desc, label) {
				var b = $("<div>").addClass("alert").addClass("achieved");
				var achTitle = $("<h3>").text(title).addClass("alert-title");
				var achDesc = $("<span>").text(desc).addClass("alert-desc");
				var achLabel = $("<span>").html(label).addClass("ach-label").addClass("pull-left");
				b.append(achLabel).append(achTitle).append(achDesc);
				return b;
			},
			achievement: function(a) {
				a.element = $("<li>").addClass("achievement");
			  a.labelEl = $("<span>").text("?").addClass("ach-label");
			  if (a.spoiler > 0) a.labelEl.html(a.label);
			  a.titleEl = $("<h3>").text("???").addClass("ach-title");
			  if (a.spoiler > 0) a.titleEl.html(a.title);
			  a.descEl = $("<span>").text("???").addClass("ach-desc");
			  if (a.spoiler > 1) a.descEl.html(a.desc);
			  a.tooltipEl = $("<div>").addClass("tooltip").append(a.titleEl).append(a.descEl);
			  //var tooltipWrapper = $("<div>").addClass("tooltip-wrapper").append(a.tooltipEl);
			  a.element.append(a.labelEl).append(a.tooltipEl);
			}
		}
	};

  /********
  	PAGING
  	*********/
  var Paging = {
  	grid: false,
  	total: null,
  	maxGridRows: 5,
  	maxListRows: 6,
  	cols: null,
  	perPage: 20,
  	currentPage: null,
  	totalPages: null,
  	width: null,
  	update: function(n) {
  		//console.log(n);
  		var filtered = false;
  		if (!n) {
  			if (!this.total) {
  				var n = Achievements.total;
  			} else {
  				var n = this.total;
  			}
  		} else {
  			filtered = true;
  		}
  		this.total = n;
  		if (UI.achView.grid) {
  			if (!this.grid) {
	  			UI.achievements.css("max-height", 58 * this.maxGridRows + "px");
	  			this.grid = true;
	  		}
  			var width = window.innerWidth;
  			if (width > 600) {
  				width = 600;
  			}
  			var cols = Math.floor((width-28)/58);

  			if (this.cols !== cols || filtered) {
  				this.width = cols*58 + 18;
  				UI.achList.css("width", this.width + "px");
  				this.cols = cols;
  				this.totalPages = Math.ceil(this.total/(this.maxGridRows*cols));
  				UI.paging.total.text(this.totalPages);
  				this.showPage(0, true);
  			}

  		} else {
  			if (this.grid) {
  				UI.achList.css("width", "");
	  			UI.achievements.css("height", "");

	  			this.grid = false;
	  		}
  		}
  	},
  	showPage: function(i, noanimate) {
  		this.currentPage = i;
  		UI.paging.current.text(i + 1);
  		//UI.achievements.scrollTop(58 * this.maxGridRows * i);
  		UI.achievements.animate({ scrollTop: 58 * this.maxGridRows * i + "px" }, noanimate ? 0 : 200);
  	},
  	nextPage: function() {
  		console.log(this.currentPage, this.totalPages);
  		if (this.currentPage < this.totalPages - 1) {
  			this.showPage(++this.currentPage);
  		}
  	},
  	prevPage: function() {
			if (this.currentPage > 0) {
  			this.showPage(--this.currentPage);
  		}
  	}
  };
  


	/********
  	ACHIEVEMENTS
  	*********/
  var Achievements = {
  	list: [],
  	by_id: {},
  	add: function(a, _id) {
  		a._id = _id;
  		this.by_id[a.title] = a;
  		this.list.push(a);
  		this.total++;
  	},
  	addAll: function(o, id_prefix) {
  		for (var a in o) {
				if (o.hasOwnProperty(a)) {
					Achievements.add(o[a]);
				}
			}
  	},
  	updateStats: function() {
  		UI.stats.achieved.text(this.achieved);
  		UI.stats.total.text(this.total);
  	},
  	total: 0,
  	achieved: 0
  };

  Achievements.give = function(a, silent) {
		if (a.achieved) return;
		a.achieved = true;
		a.element.addClass("achieved");
		a.labelEl.html(a.label);
		a.titleEl.text(a.title);
		a.descEl.text(a.desc);
		if (!silent) {
			Alerts.addAlert(a);
			/******
			ACHIEVEMENT-BASED ACHIEVEMENTS
			*******/
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
		}
		this.updateStats();
		Storage.save();
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
		milestones: [10, 50, 100, 200, 500, 1000, 2000],
		total: 0,
		map: {}
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

	Achievements.keypress.digits = {
		ach: {}
	};
	for (var i = 1; i <= 10; i++) {
		var c = i < 10 ? i : 0;
		var target = i < 7 ? Math.pow(2, i) : 107 - i;
		var a = {
		    title: "Press " + c,
		    label: c,
		    target: target,
		    desc: "Press the " + c + " key " + target + " times.",
		    spoiler: 1,
		    presses: 0
		  };
		Achievements.add(a);
		Achievements.keypress.digits.ach[c] = a;
	}
	Achievements.keypress.digits.ach[5].desc += " Spotted the pattern?";
	Achievements.keypress.digits.ach[6].desc += " Getting bored yet?";
	Achievements.keypress.digits.ach[7].desc += " Thought I'd make it a bit easier on you.";
	Achievements.keypress.digits.ach[8].desc += " Even easier! Lucky you!";

	Achievements.keypress.totals = {};
	Achievements.keypress.milestones.forEach(function(c) {
		var a = {
		    title: "Press " + c + " keys",
		    label: "<span class='label-s'><i class='fa fa-keyboard-o'></i><br>" + c + "</span>",
		    desc: "Press " + c + " keys.",
		    spoiler: 2,
		    presses: 0
		  };
		Achievements.keypress.totals[c] = a;
	})
	Achievements.addAll(Achievements.keypress.totals);

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
	    spoiler: 0
	};
	Achievements.keypress.ctrl["X"] = {
	    title: "Vandalism",
	    label: "<i class='fa fa-scissors'></i>",
	    desc: "Try to cut some text from the page.",
	    spoiler: 0
	};
	Achievements.keypress.ctrl["V"] = {
	    title: "PVA",
	    label: "<i class='fa fa-paste'></i>",
	    desc: "Paste something.",
	    spoiler: 0
	};
	Achievements.keypress.ctrl["P"] = {
	    title: "PC LOAD LETTER",
	    label: "<i class='fa fa-print'></i>",
	    desc: "Print the page (don't actually print the page).",
	    spoiler: 0
	};
	Achievements.keypress.ctrl["S"] = {
	    title: "Why...?",
	    label: "<i class='fa fa-save'></i>",
	    desc: "Try to save the page.",
	    spoiler: 0
	};
	Achievements.keypress.ctrl["Z"] = {
	    title: "Oops",
	    label: "<i class='fa fa-undo'></i>",
	    desc: "Try to undo something.",
	    spoiler: 0
	};
	Achievements.keypress.ctrl["A"] = {
	    title: "I Want It All",
	    label: "<span class='label-m'><span class='selected'>*</span></span>",
	    desc: "Select everything.",
	    spoiler: 0
	};
	Achievements.addAll(Achievements.keypress.ctrl);

	addEventListener("keydown", function(e) {
		//console.log(e);
		var letter = String.fromCharCode(e.keyCode);
		//console.log(e.keyCode, letter);
		var a;
		Achievements.keypress.total++;
		/*** TOTAL PRESSES ***/
		a = Achievements.keypress.totals[Achievements.keypress.total];
		if (a) {
			Achievements.give(a);
		}
		/*** LETTERS ****/
		a = Achievements.keypress.map[letter];
		if (a) {
			a.presses++;
			var lastTime = a.lastPressed;
			if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
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
		/**** DIGITS *****/
		a = Achievements.keypress.digits.ach[letter];
		if (a) {
			a.presses++;
			if (a.presses === a.target) {
				Achievements.give(a);
			}
		}
		/**** NON-ALPHANUMERIC CHARACTERS ****/
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
		Paging.update();
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
		label: "<i class='fa fa-filter'></i>",
		desc: "Used the filter box to filter achievements.",
		spoiler: 1
	}

	Achievements.ui.clearsearch = {
		title: "Clear",
		label: "<i class='fa fa-search'></i>",
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
		UI.build.achievement(a);
	  UI.achievements.append(a.element);
	});

	// Tooltips
	$(".achievement").hover(function() {
		var self = $(this);
		var tooltip = self.find(".tooltip");
		if (UI.achView.grid) {
			tooltip.css("top", self.position().top + 50 + "px");
			var w = tooltip.width();
			var x = self.position().left - w/2 + 25;
			if (x > Paging.width - w - 50) {
				x = Paging.width - w - 50
			} else if (x < 10) {
				x = 10;
			}
			tooltip.css("left", x + "px");
		}
		tooltip.addClass("show-tooltip");
	}, function() {
		$(this).find(".tooltip").removeClass("show-tooltip")
	});


	UI.filter.fastLiveFilter('#achievements', {
		timeout: 100,
		callback: function(total) {
			Paging.update(total);
			/*****
				SEARCH INPUT Achievements
				******/
			var q = UI.achievements.val().toLowerCase();
			if (q !== "") {
				Achievements.give(Achievements.ui.filter);
			}
			if (q === "help") {
				Achievements.give(Achievements.ui.help);
			} else if (q === "you only have to ask") {
				Achievements.give(Achievements.inter.ask);
			}
			if (total === 0) {
				UI.noResults.removeClass("display-none").show();
				Achievements.give(Achievements.ui.noresults);
			} else {
				UI.noResults.addClass("display-none");
			}
		}
	});

	UI.searchIcon.click(function() {
		if (UI.filter.val()  !== '') {
			Achievements.give(Achievements.ui.clearsearch);
		}
		UI.filter.val("").change();
	})

	Storage.load();

	Paging.update();

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
