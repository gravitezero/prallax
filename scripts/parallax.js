/*
 *   PROGRESS BAR
 */

function ProgressBar(elm) {
	var $progressBar = $('<div class="progressBar"></div>');
	var $progress = $('<div class="progressBarProgress"></div>');
	$progressBar.append($progress);

	this.setProgress = function(progress) {
		$progress.width($progressBar.width()*progress);
	}

	elm.append($progressBar);

	return this;
}

/*
 *   DISCRETE PROGRESS BAR
 */

function DiscreteProgressBar(elm, currentScroll, stops) {

	var stopsPosition = [];
	var $dProgressBar = $('<ul class="discreteProgressBar"></ul>');
	var dProgressElm = [];

	stops.each(function(index, stop){
		// TODO this should be a callback : let the user define each stop link (as well in progressBar, let the user define what to do with the progression)
		var $dProgress = $('<li class="discreteProgressBarStop"><a href="#'+ $(stop).attr('id') +'">●</a></li>');
		stopsPosition[index] = $(stop).offset().top;
		dProgressElm[index] = $dProgress;
		$dProgressBar.append($dProgress);
	});

	stopsPosition.push(Infinity);

	/* /!\ upperBound and lowerBound represent the current area where the scroll position is
	 * upperBound is actually lower than position and lower is greater than position, to match the screen disposition (not the numeric one)*/
	var upperBound = 0;
	var lowerBound = 1;
	dProgressElm[0].addClass('active');

	this.setProgress = function(position) {
		while(position < stopsPosition[upperBound] || position > stopsPosition[lowerBound]) {
			if (position < stopsPosition[upperBound]) {
				dProgressElm[upperBound].removeClass('active');
				upperBound -= 1;
				lowerBound -= 1;
			};
			if (position > stopsPosition[lowerBound]) {
				dProgressElm[lowerBound].addClass('active');
				upperBound += 1;
				lowerBound += 1;
			}
		}
	}

	elm.append($dProgressBar);

	return this;
}

/*
 *   PARALLAX ELEMENT
 */

function ParallaxElement(elm, currentScroll) {
	var initialPosition = elm.position().top;
	var height = elm.outerHeight();
	var initialOffset = elm.offset().top;

	var depth			 = elm.attr('depth');
	var maxDepth 		 = 100;

	this.parallaxize = function(cameraPosition) {

		/* the cameraPosition is the line of horizon, where things gets perfectly aligned.
		 * For the moment, it's the middle of the screen */
		elm.css({top: initialPosition  - ((cameraPosition - initialOffset - height/2)*depth)/(maxDepth - depth)});
		console.log('>>> position during: ', initialPosition, cameraPosition, initialOffset, height, depth, maxDepth);
	}
	this.parallaxize(currentScroll);
}


/*
 *   PARALLAX
 */


function parallax() {

	var $document = $(document);
	var $window = $(window);

	var screenHeight = $window.height();   // returns heightof browser viewport
	// TODO Handler onresize, to get new screen size;
	var scrollHeight = $document.height(); // returns height of HTML document
	var scrollMax = scrollHeight - screenHeight;
	var currentScroll = $window.scrollTop();

	console.log($window);

	/* Initialize progress bar */
	var progressBar = new ProgressBar($document.find('nav'));

	/* Initialise discrete progress bar */
	var dProgressBar = new DiscreteProgressBar($document.find('nav'), currentScroll + screenHeight/2, $document.find('a:not([href])'));

	/* Initialize parallax elements */
	var elements = [];

	$document.find('.parallax').each(function(index, elm){
		console.log(currentScroll, screenHeight);
		elements.push(new ParallaxElement($(elm), currentScroll + screenHeight/2));
	})


	function parallaxHandler(event) {
		currentScroll = event.currentTarget.defaultView.scrollY;
		progressBar.setProgress(currentScroll / scrollMax);
		dProgressBar.setProgress(currentScroll + screenHeight/2);

		// TODO implement a out of sight, to avoid computing hidden elements
		for (var i = 0; i < elements.length; i++) {
			elements[i].parallaxize(currentScroll + screenHeight/2);
		};

		return false;
	}

	$document.scroll(parallaxHandler);
}

/*
 *   ON READY
 */

$(document).ready(function(){

	parallax();
});