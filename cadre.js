;window.CADRE || (CADRE = {})
CADRE.ns('ui');
CADRE.ui = CADRE.ui || {
  IS_TOUCH_DEVICE: !!( 'ontouchstart' in window )
  , requestAnimFrame: function(){
	  return window.requestAnimationFrame   ||
  		window.webkitRequestAnimationFrame  ||
  		window.mozRequestAnimationFrame     ||
  		window.oRequestAnimationFrame       ||
  		window.msRequestAnimationFrame      ||
  		function( callback ){ window.setTimeout(callback, 1000 / 60); };
	}
}