/**
 * index.js
 * - Plugin para svg-pan-zoom que permite mayor control de la minniatura
 */
 window.onload = function() {
	ThumbnailSVGControl({
		mainViewId: 'graphCtView',
		mainSVGId: 'mainSVG',
		thumbContainerId: 'thumbViewContainer',
	});			
}