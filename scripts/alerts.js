/****
	ALERTS
	Control messages to be shown when achievements are earnt
	*****/
var Alerts = {
	alerts: [],
	el: $(".ach-alerts"),
	addAlert: function(ach) {
		var b = UI.build.alert(ach.title, ach.desc, ach.label);
		if (this.alerts.length === 3) { // max of 3 alerts displayed at once
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
