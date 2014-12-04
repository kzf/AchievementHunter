$(function() {

	var Alerts = {
		alerts: [],
		el: $(".ach-alerts"),
		addAlert: function(text) {
			console.log(text);
			var b = $("<div>").addClass("alert").text("You pressed it!");
			if (this.alerts.length === 3) {
				var a = this.alerts.pop();
				a.fadeOut();
			}
			this.alerts.unshift(b);
			this.el.append(b);
			setTimeout(function() {
				b.remove()
			}, 3000);
		}
	}

  $("#darken").click(function() {
  	$("body, main").addClass("dark");
  });
  $("#lighten").click(function() {
  	$("body, main").removeClass("dark");
  });

  var sl = $("#search_list");

	var achievements = [
		
	];

	// Key press achievements
	var chars = "abcdefghijklmnopqrstuvwxyz";
	var keypressAchievements = {};
	chars.split("").forEach(function(c) {
		var a = {
		    title: "Press " + c,
		    label: c,
		    desc: "Press the " + c + " key"
		  };
		achievements.push(a);
		keypressAchievements[c.toUpperCase()] = a;
	});

	addEventListener("keyup", function(e) {
		var a = keypressAchievements[String.fromCharCode(e.keyCode)];
		if (a && !a.achieved) {
			a.achieved = true;
			a.element.addClass("achieved");
			a.labelEl.text(a.label);
			a.titleEl.text(a.title);
			a.descEl.text(a.desc);
			Alerts.addAlert("Got it!");
		}
		
	});

	achievements.forEach(function(a) {
		a.achieved = false;
	  a.element = $("<li>").addClass("achievement");
	  a.labelEl = $("<span>").text("?").addClass("ach-label");
	  a.titleEl = $("<h3>").text("???").addClass("ach-title");
	  a.descEl = $("<span>").text("???").addClass("ach-desc");
	  a.tooltipEl = $("<div>").addClass("tooltip").append(a.titleEl).append(a.descEl);
	  a.element.append(a.labelEl).append(a.tooltipEl);
	  sl.append(a.element);
	});

	$('#search_input').fastLiveFilter('#search_list');
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
