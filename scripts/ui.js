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
		total: $("#total-pages"),
		controls: $("#page-controls")
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
		  	Achievements.give(Achievements.ui.stats);
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