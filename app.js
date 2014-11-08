(function($,window,document,undefined){
  // CADRE settings
  CADRE.TPL_FRAME = {
    'frame-main': {loaded: false, $o: null}
  };
  // define the scope globals
  var $body = $('body')
    , $viewport = $('#app-viewport')
    , _t = CADRE.TPL_FRAME;
  
  var frame_main = function(act){
    var frm_id = 'frame-main'
      , $output = null
      , $park_form = null
      , $parking_spot = null
      , $select_group = null
      , $select_floor = null
      , clickable_targets = {}
      , triggerSubmit = null;
    
    processTplRequest(frm_id, function(){
      
      $output = $('#output');
      $park_form = $('#park-form');
      $parking_spot = $('#type-parking-spot');
      $select_group = $('#select-floor-group');
      $select_floor = $('.select-floor');
        
      $park_form.submit(function(e){
        e.preventDefault();
        var floor = parseInt($('input[name=floor]:checked', $park_form).val());
        $output.html('<strong>'+floor+'</strong>').fadeIn('fast');
        clearTimeout(triggerSubmit);
        triggerSubmit = null;
        return false;
      }); // $park_form.submit(function(e){
      
      $select_floor.each(function(i){
        var $this = $(this)
          , $div = $this.find('div')
          , $input = $this.find('input');
      
        $this.click(function(){
          if(triggerSubmit != null){
            clearTimeout(triggerSubmit);
            triggerSubmit = null;
          }
          var $this = $(this)
            , $selected = $('.select-floor.selected');
          $selected.removeClass('selected');
          $this.addClass('selected');
          $input.prop('checked',true);
          triggerSubmit = setTimeout(function(){
            $park_form.trigger('submit');
          }, 1000);
        });
        
        clickable_targets[$div.offset().top] = $div.parent();
      }); // $select_floor.each(function(i){
      
      function process_touch(y){
        var last = null;
        for( i in clickable_targets ){            
          if( y < i ){
            if( last === null ){
              last = i;
            }
            break;
          }
          last = i;
        }
        if( last != null ){
          clickable_targets[last].trigger('click');
        }
        return true;
      } // function process_touch(y){
      
      /* * /
      function handleParkingSpot(e){
        $parking_spot.css({'backgroundColor': '#D2B48C'}).focus();
        return false;
      }
      $parking_spot[0].addEventListener( 'touchstart', handleParkingSpot, false );
      /* */
      
      function handleFloorStart(e){
        e.preventDefault();
        process_touch(e.touches[0].clientY);
        return false;
      }
      function handleFloorMove(e){
        e.preventDefault();
        if(triggerSubmit != null){
          clearTimeout(triggerSubmit);
          triggerSubmit = null;
        }
        process_touch(e.touches[0].clientY);
        return false;
      }
      $select_group[0].addEventListener( 'touchstart', handleFloorStart, false );
      $select_group[0].addEventListener( 'touchmove', handleFloorMove, false );
      
      
      
      // hide the loading frame
      CADRE.loading_frame('hide');
      
    }); // processTplRequest(frm_id, function(){

  };
  frame_main('show');
  
  
  

// ------------------------------------------ //
  
  function processTplRequest(id, cb){
    var cb_func = cb || function(){ return true; };
    if( _t[id].loaded == false ){
      var $tpl = $('#'+'tpl-'+id)
        , tpl_html = $tpl.html();
      $viewport.prepend(tpl_html);
      _t[id].$o = $('#'+id);
    }
    cb_func();
  }
  
  
  function handleWindow(e){
    e.preventDefault();
    return false;
  }
  //window.addEventListener( 'touchstart', handleWindow, false );
  window.addEventListener( 'touchmove', handleWindow, false );
  //window.addEventListener( 'touchend', handleWindow, false );
  //window.addEventListener( 'touchcancel', handleWindow, false);
  //window.addEventListener( 'touchleave', handleWindow, false);
  
  $(window).bind('orientationchange', function(){
    var $body = $(document.body);
    if (Math.abs(window.orientation) === 90 || Math.abs(window.orientation) === -90) {
      $body.addClass('touch-landscape');
    } else {
      $body.removeClass('touch-landscape');
    }
  });//.trigger('orientationchange');
  
})(jQuery,this,this.document)