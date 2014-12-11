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
		if (typeof n === 'undefined') {
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
  			UI.achievements.css("max-height", "");
  			this.grid = false;
  			this.cols = null;
  			this.totalPages = 1;
  		}



		}

		if (Paging.totalPages <= 1) {
			UI.paging.controls.hide();
		} else {
			UI.paging.controls.show();
		}
	},
	showPage: function(i, noanimate) {
		this.currentPage = i;
		UI.paging.current.text(i + 1);
		//UI.achievements.scrollTop(58 * this.maxGridRows * i);
		UI.achievements.animate({ scrollTop: 58 * this.maxGridRows * i + "px" }, noanimate ? 0 : 200);
	},
	nextPage: function() {
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
