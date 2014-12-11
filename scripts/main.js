$(function() {

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
			var q = UI.filter.val().toLowerCase();
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
	});

	Storage.load();

	Paging.update();

	Achievements.updateStats();


	/******
		Interactivity that needs Achievements to be in the DOM
		******/
	Achievements.inter.click.labelEl.click(function() {
		Achievements.give(Achievements.inter.click);
	});
	Achievements.inter.needy.labelEl.click(function() {
		Achievements.inter.needy.clicked++;
		if (Achievements.inter.needy.clicked === 15) {
			Achievements.give(Achievements.inter.needy);
		} else if (Achievements.inter.needy.clicked === 30) {
			Achievements.give(Achievements.inter.repeat);
		}
	});


});