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
			Achievements.give(Achievements.ui.storage);
			// TODO: Storage2, storage4
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