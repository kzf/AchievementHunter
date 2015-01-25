/********
	ACHIEVEMENTS
	*********/
var Achievements = {
	list: [],
	by_id: {}, // stores achievements by their title
	add: function(a) {
		this.by_id[a.title] = a;
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
	this.achieved++;
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
		var achieved = this.achieved;
		Achievements.achMilestones.forEach(function(n) {
			if (n === achieved) {
				setTimeout(
					Achievements.give.bind(
						Achievements, 
						Achievements.achBased["have" + n]
						), 500);
			}
		});
		if (achieved === this.total - 1) {
			// Give the "all achievements" achievement after a short delay
			setTimeout(Achievements.give.bind(
						Achievements, 
						Achievements.achBased["all"]
			), 15000);
		}
	}
	this.updateStats();
	Storage.save();
}