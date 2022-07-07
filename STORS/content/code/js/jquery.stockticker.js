/* ************************************************************************************** */
/*                                                                                        */
/*   ©Bitbenderz.com ... 2014                                                             */
/*                                                                                        */
/*   @ author  : tom@bitbenderz.com                                                       */
/*   @ version : 4.0.1                                                                    */
/*   @ updated : Aug, 2014                                                                */
/*   @ licnese : Dual licensed under ...                                                  */
/*               MIT (http://www.opensource.org/licenses/mit-license.php)                 */
/*               GPL (http://www.opensource.org/licenses/gpl-license.php)                 */
/*                                                                                        */
/* ************************************************************************************** */

/* ************************************	*/
/* Window Resize                        */
/* ************************************	*/
jQuery(window).resize(function(){
	var $ = jQuery;

	positionMenu();
});

/* ************************************	*/
/* DOM Ready				*/
/* ************************************	*/
jQuery(document).ready(function(){
	var $ = jQuery;

	/*  Get the Ticker Object & Instantiate Ticker  */
	var url = window.location.host.indexOf('bitbenderz') == -1 ? 'assets/jquery.stockticker.cfg' : 'http://bitbenderz.com/stockticker/stockticker/assets/jquery.stockticker.cfg';
	    url += '?cb=' + new Date().getTime();
	var request = $.getScript(url, function(data){});
	request.error(function(xhr, stat, et){});
	request.fail(function(xhr, stat, et){});
	request.always(function(xhr, stat, et){
		if(stat == 'success'){
			myStocks.key = $.trim(myStocks.key).length > 0 ? myStocks.key : '';
			so.active_key = myStocks.key.substr(0,1) != 'Q'? true : false;
			getFramedArgs();
		}else{
			getFramedArgs();
		};
	});
});

/* ************************************	*/
/* Get Iframed Args			*/
/* ************************************	*/
function getFramedArgs() {
	var $ = jQuery;

	/*  If iFramed  */
	if(window.location !== window.parent.location){
		myStocks.isFramed = true;

		try {
			var fss = B64.decode(decodeURIComponent(this.location.search).substr(1));
		}catch(e){
			var fss = decodeURIComponent(this.location.search).substr(1);
		};


		if(fss.length){
			ss = fss.split('&')
			for(var i = 0; i < ss.length; i++){
				var key = $.trim(ss[i].split('=')[0]);
				var val = $.trim(ss[i].split(key+'=').join(''));
				myStocks[key] = val;
			};

			var isFull = myStocks.key.substr(0,1) != 'Q'? true : false;

			if(isFull){
				so.active_key=true;
				if(typeof myStocks.showBrand == 'string'){myStocks.showBrand = myStocks.showBrand == 'true';};
			}else{
				so.active_key=false;
				//myStocks.chartProxy=false;
			};

			if(typeof myStocks.theme != 'undefined'){
				var tt = '<link href="http://code.jquery.com/ui/1.11.0/themes/' + myStocks.theme + '/jquery-ui.min.css" rel="stylesheet"/>';
				$(tt).appendTo('head');

				var url = 'http://code.jquery.com/ui/1.11.0/themes/' + myStocks.theme + '/jquery-ui.min.css';
				var request = $.getScript(url, function(data){});
					request.error(function(xhr, stat, et){});
					request.fail(function(xhr, stat, et){});
					request.always(function(xhr, stat, et){
						instantiateTicker();
					});
			}else{
				instantiateTicker();
			};
		};
	}else{
		instantiateTicker();
	};
};


/* ************************************	*/
/* Instantiate Ticker			*/
/* ************************************	*/
function instantiateTicker()
{
	var $ = jQuery;


	if($('.stockTicker').length == 0){return;};

	myStocks.chartProxy = true;

	/*  Instantiate Stock Ticker  */
	var idx = 0;
	$('div.stockTicker').each(function()
	{
		if(myStocks.isFramed){$(this).width($(this).width()-2);};

		$(this).fadeTo(0,0);

		$(this).addClass('brandme');

		/*  About Info  */
		if($(this).attr('data-about')){var about = $(this).attr('data-about'); myStocks.msgData = myStocks.msgData.split('</msgCenter>').join(about) + '</msgCenter>';};

		/*  Blank Ticker  */
		if($(this).attr('data-blank')){myStocks.blank = $(this).attr('data-blank');};

		/*  No Data Ticker  */
		if($(this).attr('data-none')){myStocks.none = $(this).attr('data-none');};

		/*  Apply Options  */
		var ops = $(this).attr('data-options') ? $(this).attr('data-options').split(';') : false;
		if(ops)
		{
			for(var i = 0; i < ops.length; i++)
			{
				var o = $.trim(ops[i].split(':')[0]);
				var v = $.trim(ops[i].split(':')[1]);

				if(o.toLowerCase() == 'autoscroll'){myStocks.autoScroll = (v.toLowerCase() == 'true') ? true : false;};
				if(o.toLowerCase() == 'defaultsymbols'){myStocks.defaultSymbols = v;};
				if(o.toLowerCase() == 'defaultfields'){myStocks.defaultFields = v;};
				if(o.toLowerCase() == 'throttle'){myStocks.throttle = parseInt(v);};
				if(o.toLowerCase() == 'hoverpause'){myStocks.hoverPause = (v.toLowerCase() == 'true') ? true : false;};
				if(o.toLowerCase() == 'mnubtns'){myStocks.mnuBtns = v;};
				if(o.toLowerCase() == 'pinbtns'){myStocks.pinBtns = (v.toLowerCase() == 'true') ? true : false;};
				if(o.toLowerCase() == 'chartproxy'){myStocks.chartProxy = (v.toLowerCase() == 'true') ? true : false;};

			};
		};

		/*  Create the Stock Ticker Object  */
		$(this).html(myStocks.obj);

		/*  Add Branding Tab  */
		if($(this).hasClass('brandme')){

			$(this).css('position', 'relative').css('overflow', 'visible');

			var _brand, _brandfg, _brandbg;

			if(typeof $(this).attr('data-brand') == 'undefined'){_brand = myStocks.brand;}else{_brand = $(this).attr('data-brand');};
			if(typeof $(this).attr('data-brand-fgcolor') == 'undefined'){_brandfg = myStocks.brandfgcolor;}else{_brandfg = $(this).attr('data-brand-fgcolor');};
			if(typeof $(this).attr('data-brand-bgcolor') == 'undefined'){_brandbg = myStocks.brandbgcolor;}else{_brandbg = $(this).attr('data-brand-bgcolor');};

			if(typeof myStocks.theme != 'undefined'){
				_brandfg = $(this).find('#scrollingMask').css('color');
				_brandbg = $(this).find('#scrollingMask').css('background-color');
			};


			/*  Google Adsense  */
/*
			if(myStocks.key.substr(0,1) == 'Q'){
				var ab = '<div class="ticker-ad ui-corner-bl" style="height:0px; width:324px; position:relative; border-top-width:0px;overflow:hidden;">' +
					 '<scr'+'ipt async src="http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></scr'+'ipt>' +
					 '<div class="googads" style="width:972px; height:58px; position:relative; overflow:hidden;">' +
					 '<ins class="adsbygoogle" style="position:absolute; left:324px; display:inline-block;width:320px;height:50px; margin:0px 2px 0px 2px;" data-ad-client="ca-pub-6798369492392164" data-ad-slot="1198091683"></ins>' +
					 '<scr'+'ipt>(adsbygoogle = window.adsbygoogle || []).push({});</scr'+'ipt>' +
					 '<ins class="adsbygoogle" style="position:absolute; left:324px; display:inline-block;width:320px;height:50px; margin:0px 2px 0px 2px;" data-ad-client="ca-pub-6798369492392164" data-ad-slot="1198091683"></ins>' +
					 '<scr'+'ipt>(adsbygoogle = window.adsbygoogle || []).push({});</scr'+'ipt>' +
					 '<ins class="adsbygoogle" style="position:absolute; left:648px; display:inline-block;width:320px;height:50px; margin:0px 2px 0px 2px;" data-ad-client="ca-pub-6798369492392164" data-ad-slot="1198091683"></ins>' +
					 '<scr'+'ipt>(adsbygoogle = window.adsbygoogle || []).push({});</scr'+'ipt>' +
					 '</div>' +
					 '</div>';

				$(ab).appendTo($(this));
				$(this).find('.ticker-ad').css('left', $(this).width()-324 + 'px');

				var gads = $(this).find('.googads');
				setTimeout(function(){scrollGoogAd($(gads));}, 2400);
			};
*/
			/*  End Google Adsense  */

			$('<div class="ticker-tab ui-corner-br"><span>' + _brand + '</span></div>').appendTo($(this));

			var tw = $(this).find('.ticker-tab span').width() + 28;
			$(this).find('.ticker-tab').width(tw).find('*').css('color', _brandfg);

			/*  Tab Background Color */
			var bc = _brandbg.split('rgb').join('').split('(').join('').split(')').join('').split(',');
 			    bc[0] = parseInt(bc[0]);
			    bc[1] = parseInt(bc[1]);
			    bc[2] = parseInt(bc[2]);

			/*  Stock Ticker Border Color  */
			var tb = $(this).find('#scrollingMask').css('border-top-color');
			var bw = $(this).find('#scrollingMask').css('border-top-width');
			var oc = $(this).find('#scrollingMask').css('border-top-color').split('rgb').join('').split('(').join('').split(')').join('').split(',');
			    oc[0] = parseInt(oc[0]);
			    oc[1] = parseInt(oc[1]);
			    oc[2] = parseInt(oc[2]);

			$('<canvas width="600" height="20" style="display:none;" />').appendTo($(this));

			var isrc = window.location.host.indexOf('bitbenderz') == -1 ? 'css/images/tab.png' : 'http://bitbenderz.com/stockticker/stockticker/css/images/tab.png';

			$(this).find('canvas').drawImage({
				source: isrc,
				fromCenter:false,
				x: 0, 
				y: 0,
				load: 
				function(){
					$(this).setPixels({
						fromCenter:false,
						x: 0, 
						y: 0,
						each: function(px) {
							if(px.r == 0 && px.g == 0 && px.b == 0){
								px.r = oc[0];
								px.g = oc[1];
								px.b = oc[2];
							}else{
								px.r = bc[0];
								px.g = bc[1];
								px.b = bc[2];
							}
						}
					});

					var bg = $(this).parent().find('canvas').getCanvasImage();
					$(this).parent().find('.ticker-tab').css('background-image', 'url(' + bg + ')').css('border-right', bw + ' solid ' + tb);
				}
			});
		};

		/*  Instance ID  */
		$(this).attr('data-idx', idx);idx++;
	});

	if(myStocks.autoScroll){$('.stockTicker #tickerPlay').each(function(){$(this).hide();}); $('.stockTicker #tickerPause').each(function(){$(this).show();});}
	else{$('.stockTicker #tickerPlay').each(function(){$(this).show();}); $('.stockTicker #tickerPause').each(function(){$(this).hide();});}

	/*  Auto Pause on Scroll Over  */
	if(myStocks.hoverPause){
		$('.stockTicker').each(function(){
			$(this).on('mouseenter', function(e){pauseTicker();});

			$(this).on('mouseleave', function(e){
				var wasMickey = $(this).find('.mickey').length;
				$(this).find('.mickey').removeClass('mickey');
				if(!wasMickey){playTicker();};
			});
		});
	};

	$('.stockTicker #tickerRedir').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); reverseTicker();});});
	$('.stockTicker #tickerSpdUp').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); speedTicker();});});
	$('.stockTicker #tickerSpdDn').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); slowTicker();});});
	$('.stockTicker #tickerPlay').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); playTicker();});});
	$('.stockTicker #tickerPause').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); pauseTicker();});});
	$('.stockTicker #tickerOptns').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); showTickerOptions();});});
	$('.stockTicker #tickerAbout').each(function(){$(this).on('click', function(e){e.preventDefault(); e.stopPropagation(); showTickerMsg('aboutMe');});});

	if(myStocks.mnuBtns.toLowerCase().indexOf('direction') == -1)	{$('.stockTicker #tickerRedir').each(function(){$(this).addClass('hide');});};
	if(myStocks.mnuBtns.toLowerCase().indexOf('speed_up') == -1)	{$('.stockTicker #tickerSpdUp').each(function(){$(this).addClass('hide');});};
	if(myStocks.mnuBtns.toLowerCase().indexOf('speed_down') == -1)	{$('.stockTicker #tickerSpdDn').each(function(){$(this).addClass('hide');});};
	if(myStocks.mnuBtns.toLowerCase().indexOf('play') == -1)	{$('.stockTicker #tickerPlay').each(function(){$(this).addClass('hide');});$('.stockTicker #tickerPause').each(function(){$(this).addClass('hide');})};
	if(myStocks.mnuBtns.toLowerCase().indexOf('options') == -1)	{$('.stockTicker #tickerOptns').each(function(){$(this).addClass('hide');});};
	if(myStocks.mnuBtns.toLowerCase().indexOf('about') == -1)	{$('.stockTicker #tickerAbout').each(function(){$(this).addClass('hide');});};

	/*  Instantiate Stock Ticker Options Dialog  */
	if($('.ui-dialog[aria-describedby=stockTickerOptions]').length == 0){
		$(myStocks.opData).appendTo('body');
		$('.stockTickerOptions').dialog({autoOpen:false, position:{my: "center", at: "center", of: window}, width:310, height:357, resizable:false, closeOnEscape:false, close:function(e,ui){framedHideDialog('stockTickerOptions');}});
		var sto = $('.stockTickerOptions').dialog('widget');
		$(sto).css('padding', '0px').find('.ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top').css('border-top', 'none').css('border-left', 'none').css('border-right', 'none');
	};

	/*  Instantiate Stock Chart Dialog Object  */
	if($('.ui-dialog[aria-describedby=areaChart]').length == 0){
		$('<div id="areaChart" class="areaChart" title="Area Chart" />').appendTo('body');
		if(myStocks.chartProxy){
			$('.areaChart').dialog({autoOpen:false, position:{my: "center", at: "center", of: window}, width:330, height:330, resizable:true, closeOnEscape:false, close:function(e,ui){framedHideDialog('areaChart');}});
		}else{
			$('.areaChart').dialog({autoOpen:false, position:{my: "center", at: "center", of: window}, width:310, height:305, resizable:false, closeOnEscape:false, close:function(e,ui){framedHideDialog('areaChart');}});
		};
		var arc = $('.areaChart').dialog('widget');
		$(arc).css('padding', '0px').find('.ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top').css('border-top', 'none').css('border-left', 'none').css('border-right', 'none');
	};

	/*  Instatiate Stock Ticker Message Dialog Object  */
	if($('.ui-dialog[aria-describedby=tickerMsg]').length == 0){
		$('<div id="tickerMsg" class="tickerMsg" title="Message Center" />').appendTo('body');
		$('.tickerMsg').dialog({autoOpen:false, position:{my: "center", at: "center", of: window}, width:310, height:327, resizable:false, closeOnEscape:false, close:function(e,ui){framedHideDialog('tickerMsg');}});
		var msg = $('.tickerMsg').dialog('widget');
		$(msg).css('padding', '0px').find('.ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top').css('border-top', 'none').css('border-left', 'none').css('border-right', 'none');
	};

	$('.ui-dialog').each(function(){
		$(this).removeClass('ui-front').css('z-index', '99999');

		$(this).on('click', function(e){
			$('.ui-dialog').each(function(){$(this).css('z-index', '99999');});
			$(this).css('z-index', '100000');
		});
	});

	/*  Start the Ticker  */
	resetConfig();
	applyConfig();
	initTicker();
};


/* ************************************	*/
/* Show Google Adsense			*/
/* ************************************	*/
function showGoogAd(e, show, who){
	var $ = jQuery;

	if(myStocks.key.substr(0,1) != 'Q'){return;};

	var mc = $(who).find('.ticker-ad');

	var isSameWidth = $(who).width() == $(mc).width();
	
	$(mc).find('iframe').css('top', '2px');

	if(show){
		parent.postMessage('stockTicker&googAd&'+myStocks.frameid+'&show', '*');
		if(isSameWidth){$(who).find('#scrollingMask').removeClass('ui-corner-bl');};
		$(mc).addClass('ui-state-active');
		$(mc).stop().animate({height:54}, 400,function(){});
	}else{
		parent.postMessage('stockTicker&googAd&'+myStocks.frameid+'&hide', '*');
		$(mc).stop().animate({height:0}, 400,function(){$(this).removeClass('ui-state-active'); $(who).find('#scrollingMask').addClass('ui-corner-bl');});
	};

};

/* ************************************	*/
/* Scroll Google Adsense		*/
/* ************************************	*/
function scrollGoogAd(who){
	var $ = jQuery;

	var mc = $(who);

	if($(mc).find('iframe').length >= 3){
		$(mc).stop().animate({'margin-left':'-=324'},400,function(){
			var i = Math.abs(parseInt($(this).css('margin-left')));
			var e = $(this).width();
			$(this).children('ins').each(function(){if($(this).position().left < i){$(this).css('left', e+'px');};});
			$(this).width($(this).width()+324);
			setTimeout(function(){scrollGoogAd($(mc));}, 2400);
		});
	}else{
		setTimeout(function(){scrollGoogAd($(mc));}, 100);
	};

};

/* ************************************	*/
/* Reset Config				*/
/* ************************************	*/
function resetConfig()
{
	var $ = jQuery;

	$('.stockTickerOptions input[type=checkbox]').prop('checked', false);
	$('.stockTickerOptions div#tabs-3 textarea').val('');

	var sym = myStocks.defaultSymbols.split(',');
	for(var i=0; i < sym.length; i++)
	{
		if($('.stockTickerOptions input[name="' + $.trim(sym[i]) + '"]').length){$('.stockTickerOptions input[name="' + $.trim(sym[i]) + '"]').prop('checked', true);}
		else{$('.stockTickerOptions div#tabs-3 textarea').val($('.stockTickerOptions div#tabs-3 textarea').val() + $.trim(sym[i]) + '\n');}
	}

	var fld = myStocks.defaultFields.split(',');
	for(var i=0; i < fld.length; i++){$('.stockTickerOptions input[name="' + $.trim(fld[i]) + '"]').prop('checked', true);}

	$('input#txtQuotes').val('').trigger('blur');

	$('input.curQuotes').attr('placeholder', 'Convert Currency Values ... ' + myStocks.defaultCurrency).val('').trigger('blur');
}


/* ************************************	*/
/* Apply Config				*/
/* ************************************	*/
function applyConfig()
{
	var $ = jQuery;

	myStocks.symbols = '';
	$('.stockTickerOptions div#tabs-1 input:checked').each(function(){myStocks.symbols += $(this).attr('name') + ',';});
	myStocks.symbols += $('.stockTickerOptions div#tabs-3 textarea').val().toUpperCase().split('\n').join(',').split(';').join(',');

	myStocks.fields = '';
	$('.stockTickerOptions div#tabs-4 input:checked').each(function(){myStocks.fields += $(this).attr('name') + ',';});

	/*  Acitves  */
	if($('.stockTickerOptions div#tabs-2 input[name="$MOVE_USC"]:checked').length > 0){getActives(0);};
	if($('.stockTickerOptions div#tabs-2 input[name="$MOVE_IXI"]:checked').length > 0){getActives(1);};
	if($('.stockTickerOptions div#tabs-2 input[name="$MOVE_NYA"]:checked').length > 0){getActives(2);};
	if($('.stockTickerOptions div#tabs-2 input[name="$MOVE_TSX"]:checked').length > 0){getActives(3);};

	/*  Gainers  */
	if($('.stockTickerOptions div#tabs-2 input[name="%GAIN_USC"]:checked').length > 0){getGainers(0);};
	if($('.stockTickerOptions div#tabs-2 input[name="%GAIN_IXI"]:checked').length > 0){getGainers(1);};
	if($('.stockTickerOptions div#tabs-2 input[name="%GAIN_NYA"]:checked').length > 0){getGainers(2);};
	if($('.stockTickerOptions div#tabs-2 input[name="%GAIN_TSX"]:checked').length > 0){getGainers(3);};

	/*  Losers  */
	if($('.stockTickerOptions div#tabs-2 input[name="%LOSE_USC"]:checked').length > 0){getLosers(0);};
	if($('.stockTickerOptions div#tabs-2 input[name="%LOSE_IXI"]:checked').length > 0){getLosers(1);};
	if($('.stockTickerOptions div#tabs-2 input[name="%LOSE_NYA"]:checked').length > 0){getLosers(2);};
	if($('.stockTickerOptions div#tabs-2 input[name="%LOSE_TSX"]:checked').length > 0){getLosers(3);};
	
};

/* ************************************	*/
/* Show Brand Tab                       */
/* ************************************	*/
function showBrand(){
	var $ = jQuery;
	if(!myStocks.showBrand && so.active_key){$('.stockTicker .ticker-tab').hide(); return;};
	$('.stockTicker #scrollingMask').removeClass('ui-corner-all').addClass('ui-corner-top').addClass('ui-corner-bl');
	$('.stockTicker .ticker-tab').animate({bottom:-19}, 400, function() {});
};

/* ************************************	*/
/* Position Menu Bar                    */
/* ************************************	*/
function positionMenu(){
	var $ = jQuery;

	if(!myStocks.init){return;};

	/*  Reposition Menu Bar  */
	$('div.scrollWrapper').each(function(){
		var tl = $(this).closest('div#scrollingMask').width();

		var bw = $(this).closest('div#scrollingMask').find('ul#icons li:visible').length; bw = (bw*20)+1;

/*
		if(  $(this).closest('div#scrollingMask').find('ul#icons li:eq(0)').attr('id') != 'googAds'){
			var bw = $(this).closest('div#scrollingMask').find('ul#icons li:visible').length; bw = (bw*20)+1;
		}else{
			var bw = 469;
		};
*/

		var mc = $(this).closest('div#scrollingMask');
		$(this).closest('div#scrollingMask').find('ul#icons').css('left', tl+1);
		$(this).closest('div#scrollingMask').off('mouseenter').on('mouseenter', function(e){if($(this).find('ul#icons').position().left > tl && !$(this).find('ul#icons').is(':animated')){$('.mnupin').hide();$(this).find('ul#icons').animate({left:'-='+bw}, 400, 'linear',function(){mnuTimer = setTimeout(function(){clearTimeout(mnuTimer); mnuTimer = null; $(mc).addClass('mickey'); $(mc).trigger('mouseleave');}, myStocks.mnuthrottle);});};});
		$(this).closest('div#scrollingMask').off('mouseleave').on('mouseleave', function(e){if($(this).find('ul#icons').position().left < tl && !$(this).find('ul#icons').is(':animated')){$('.mnupin').show();$(this).find('ul#icons').animate({left:'+='+bw}, 400, 'linear',function(){clearTimeout(mnuTimer); mnuTimer = null;});};});
	});
};

/* ************************************	*/
/* Get Active				*/
/* ************************************	*/
function getActives(who)
{
	var $ = jQuery;

	switch(who) {
		case 0 :
			myStocks.actv_usc = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/actives?e=US" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.actv_usc += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';};
				};

				myStocks.symbols += ',' + myStocks.actv_usc;
				initTicker();
			});

			break;

		case 1 :
			myStocks.actv_ixi = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/actives?e=O" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.actv_ixi += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.actv_ixi;
				initTicker();
			});

			break;

		case 2 :
			myStocks.actv_nya = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/actives?e=NQ" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.actv_nya += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.actv_nya;
				initTicker();
			});

			break;

		case 3 :
			myStocks.actv_tsx = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/actives?e=TO" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.actv_tsx += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.actv_tsx;
				initTicker();
			});

			break;

		default :
			break;
	};
};
/* ************************************	*/
/* Get Gainers				*/
/* ************************************	*/
function getGainers(who)
{
	var $ = jQuery;

	switch(who) {
		case 0 :
			myStocks.gain_usc = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/gainers?e=US" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.gain_usc += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';};
				};

				myStocks.symbols += ',' + myStocks.gain_usc;
				initTicker();
			});

			break;

		case 1 :
			myStocks.gain_ixi = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/gainers?e=O" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.gain_ixi += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.gain_ixi;
				initTicker();
			});

			break;

		case 2 :
			myStocks.gain_nya = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/gainers?e=NQ" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.gain_nya += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.gain_nya;
				initTicker();
			});

			break;

		case 3 :
			myStocks.gain_tsx = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/gainers?e=TO" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.gain_tsx += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.gain_tsx;
				initTicker();
			});

			break;

		default :
			break;
	};
};

/* ************************************	*/
/* Get Losers				*/
/* ************************************	*/
function getLosers(who)
{
	var $ = jQuery;

	switch(who) {
		case 0 :
			myStocks.lose_usc = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/losers?e=US" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.lose_usc += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';};
				};

				myStocks.symbols += ',' + myStocks.lose_usc;
				initTicker();
			});

			break;

		case 1 :
			myStocks.lose_ixi = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/losers?e=O" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.lose_ixi += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.lose_ixi;
				initTicker();
			});

			break;

		case 2 :
			myStocks.lose_nya = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/losers?e=NQ" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.lose_nya += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.lose_nya;
				initTicker();
			});

			break;

		case 3 :
			myStocks.lose_tsx = '';
			var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/losers?e=TO" and xpath="//div[@id=\'yfitp\']"');
			var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
			var request = $.getJSON(url, function(data){});
			request.error(function(xhr, stat, et){});
			request.fail(function(xhr, stat, et){});
			request.always(function(xhr, stat, et){
				if(stat == 'success'){
					var res = $(xhr.results[0]).find('tbody:eq(0)');
					for(var i = 0; i < 5; i++){myStocks.lose_tsx += $(res).find('tr:eq('+i+') a:eq(0)').text() + ',';}
				};

				myStocks.symbols += ',' + myStocks.lose_tsx;
				initTicker();
			});

			break;

		default :
			break;
	};
};

/* ************************************	*/
/* Init / Refresh Ticker		*/
/* ************************************	*/
function initTicker()
{
	var $ = jQuery;

	var toCurrency = $.trim($('input.curQuotes').attr('placeholder').split('...')[1]);

	$('div.xdata').remove();

	$('.stockTicker ul#loadcons').animate({left:'1'}, 400, 'linear',function(){});

	/*  Get Current Timeout  */
	var wasTimeout = $.ajaxSettings['timeout'];

	/*  Set New Timeout  */
	$.ajaxSetup({timeout:5000});

	var sa = cleanArray(myStocks.symbols.split(','));
	if(!so.active_key && sa.length > 5){sa = sa.slice(0,5);};
	var ss = encodeURI(sa);
	var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/quotes/' + ss + '/view/dv" and xpath="//div[@id=\'yfi_summary_table_container\']"');
	var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';

	var tdata = new Array()

	var request = $.getJSON(url, function(data){});
	request.error(function(xhr, stat, et){});
	request.fail(function(xhr, stat, et){});
	request.always(function(xhr, stat, et){
		if(stat == 'success'){
			if(xhr.query.count > 0){
				var x = xhr.results[0].split('<img').join('<br');

				var i = 0;
				$(x).find('.yfi_summary_table').each(function(){
					tdata[i] = new Object();
					tdata[i]['mult']  = 1;
					tdata[i]['name']  = $.trim($(this).find('h2:eq(0)').text());
					tdata[i]['symb']  = $.trim($(this).find('a:eq(0)').text());
					tdata[i]['value'] = $.trim($(this).find('tr:eq(0) td:eq(0)').text().split(',').join(''));
					tdata[i]['price'] = $.trim($(this).find('tr:eq(2) td:eq(0) > span:eq(0)').text().split('-').join(''));
					tdata[i]['prcnt'] = $.trim($(this).find('tr:eq(2) td:eq(0) > span:eq(1)').text().split('(').join('').split(')').join('').split('-').join('').split('+').join(''));
					tdata[i]['dir']   = Number($.trim($(this).find('tr:eq(2) td:eq(0) > span:eq(0)').text())) < 0 ? -1 : Number($.trim($(this).find('tr:eq(2) td:eq(0) > span:eq(0)').text())) > 0 ? 1 : 0;
					tdata[i]['crncy'] = $.trim($(this).find('.delayed').text()).split('currency is ')[1].split('.').join('');
					i++;
				});

				if(toCurrency != 'OUIE'){
					/*  Build Query  */
					ss = ''; for(var i = 0; i < tdata.length; i++){ss+= tdata[i].crncy + toCurrency + '=X,';}; ss = encodeURI(ss.slice(0,-1));
					var q = encodeURIComponent('select * from html where url="http://ca.finance.yahoo.com/quotes/' + ss + '/view/dv" and xpath="//div[@id=\'yfi_summary_table_container\']"');
					var url = myStocks.protocol + '//query.yahooapis.com/v1/public/yql?q=' + q + '&format=xml&callback=?';
					var new_request = $.getJSON(url, function(data){});
					new_request.error(function(xhr, stat, et){});
					new_request.fail(function(xhr, stat, et){});
					new_request.always(function(xhr, stat, et){
						if(stat == 'success'){
							if(xhr.query.count > 0){
								var y = xhr.results[0], i = 0;
								$(y).find('.yfi_summary_table').each(function(){
									var fmCurrency = $.trim($(this).find('h2:eq(0)').text()).split('/')[0];
									for(var i = 0; i < tdata.length; i++){
										if(tdata[i].crncy == fmCurrency){
											tdata[i].crncy = toCurrency;
											tdata[i].mult = $.trim($(this).find('tr:eq(0) td:eq(0)').text().split(',').join(''));
										};
									};
								});
								updateTicker(tdata);
							}else{updateTicker(tdata);}
						}else{updateTicker(tdata);};
					});
				}else{updateTicker(tdata);};
			}else{updateTicker(tdata);};
		}else{updateTicker(tdata);};
	});
};

/* ************************************	*/
/* Update Ticker Content		*/
/* ************************************	*/
function updateTicker(tdata) {
	var $ = jQuery;

	var init = myStocks.init ? false : true;

	var outPut = '';
	for(var i = 0; i < tdata.length; i++){
		outPut += '<span class="tickerSymbolPipe"></span>';
		outPut += '<span class="ui-content tickerSymbol" data-name="' + tdata[i].name + '" data-symbol="' + tdata[i].symb + '">';
		outPut += '<span class="tickerName">';
		if(myStocks.fields.indexOf('name') != -1){outPut += tdata[i].name;}
		if(myStocks.fields.indexOf('symbol') != -1 && myStocks.fields.indexOf('name') != -1){outPut += '<span class="paren">' + tdata[i].symb + '</span>';}
		if(myStocks.fields.indexOf('symbol') != -1 && myStocks.fields.indexOf('name') == -1){outPut += '<span>' + tdata[i].symb + '</span>';}
		outPut += '</span>';
		if(myStocks.fields.indexOf('price') != -1){outPut += '<span class="tickerPrice">' + ((Number(tdata[i].value) * Number(tdata[i].mult)).toFixed(2)) + '</span>';};
		if(tdata[i].dir < 0){outPut += '<span class="tickerChange down">';}else if(tdata[i].dir > 0){outPut += '<span class="tickerChange up">';}else{outPut += '<span class="tickerChange unch ui-content">';};
		if(myStocks.fields.indexOf('change') != -1){outPut += (Number(tdata[i].price) * Number(tdata[i].mult)).toFixed(2);};
		if(myStocks.fields.indexOf('volume') != -1 && myStocks.fields.indexOf('change') != -1){outPut += '<span class="paren">' + tdata[i].prcnt + '</span>';};
		if(myStocks.fields.indexOf('volume') != -1 && myStocks.fields.indexOf('change') == -1){outPut += '<span>' + tdata[i].prcnt + '</span>';};
		outPut += '</span>';
		if(myStocks.fields.indexOf('currency') != -1){outPut += '<span class="ui-content">' + tdata[i].crncy + '</span>';};
		outPut += '</span>';
	};

	var asm = myStocks.autoScroll ? 'always' : '';

	if(init){
		var fallback = '';
		$('div.scrollingText').html(outPut);
		$('div.scrollingText').smoothDivScroll({autoScrollingMode: asm, autoScrollingDirection: "endlessLoopRight", autoScrollingStep: 1, autoScrollingInterval: 15, hotSpotScrolling: false});
		
		$('div.scrollingHotSpotLeft').remove();
		$('div.scrollingHotSpotRight').remove();

		$('div.scrollWrapper').each(function(){
			var who = $(this);
			var tl = $(this).closest('div#scrollingMask').width();

			var bw = $(this).closest('div#scrollingMask').find('ul#icons li:visible').length; bw = (bw*20)+1;

/*
			if(myStocks.key.substr(0,1) != 'Q'){
				var bw = $(this).closest('div#scrollingMask').find('ul#icons li:visible').length; bw = (bw*20)+1;
			}else{
				var bw = 469;
			};
*/

			var mc = $(this).closest('div#scrollingMask');
			$(this).closest('div#scrollingMask').find('ul#icons').css('left', tl+1);


			if(myStocks.pinBtns){$('<ul class="ui-widget ui-helper-clearfix ui-state-default ui-corner-all mnupin" style="margin: 0 !important; padding: 0 !important; width:auto; position:absolute !important; right:0px; top:0px; border:none;"><li id="tickerOptns" class="ui-state-default ui-corner-all" style="margin: 1px 1px 1px 1px !important; position: relative !important; padding: 0 0 !important; cursor: pointer !important; float: left !important;  list-style: none !important;"><span class="ui-icon ui-icon-gear" style="position:relative; top:-1px;"></span></li></ul>').appendTo($(this).closest('div#scrollingMask'));};

			$(this).closest('div#scrollingMask').find('ul#icons').on("mouseenter", function(e){clearTimeout(mnuTimer); mnuTimer = null;});
			$(this).closest('div#scrollingMask').on("mouseenter", function(e){if($(this).find('ul#icons').position().left > tl && !$(this).find('ul#icons').is(':animated')){$('.mnupin').hide();$(this).find('ul#icons').animate({left:'-='+bw}, 400, 'linear',function(){mnuTimer = setTimeout(function(){clearTimeout(mnuTimer); mnuTimer = null; $(mc).addClass('mickey'); $(mc).trigger('mouseleave');}, myStocks.mnuthrottle);});};});
			$(this).closest('div#scrollingMask').on("mouseleave", function(e){if($(this).find('ul#icons').position().left < tl && !$(this).find('ul#icons').is(':animated')){$('.mnupin').show();$(this).find('ul#icons').animate({left:'+='+bw}, 400, 'linear',function(){clearTimeout(mnuTimer); mnuTimer = null;});};});
		});
	}else{
		var fallback = $('div.scrollableArea').html();
		$('div.scrollableArea').html(outPut);
		$("div.scrollingText").smoothDivScroll('recalculateScrollableArea');
	}

	/*  What to do if no symbols defined  */
	if(myStocks.symbols.length < 2){
		outPut = myStocks.none;
		$('div.scrollableArea').html(outPut); 
		$("div.scrollingText").smoothDivScroll('recalculateScrollableArea');
	}
	else if(cleanArray(myStocks.symbols.split(',')).length == 0){
		outPut = myStocks.none;
		$('div.scrollableArea').html(outPut); 
		$("div.scrollingText").smoothDivScroll('recalculateScrollableArea');
	}
	else if(!tdata.length && myStocks.blank.length || !outPut.length){
		if(myStocks.blank.toLowerCase()=='fallback'){outPut = fallback;}
		else{outPut = myStocks.blank;} 
		$('div.scrollableArea').html(outPut); 
		$("div.scrollingText").smoothDivScroll('recalculateScrollableArea');
	}
	else if(!tdata.length && !myStocks.blank.length || !outPut.length){
		if(myStocks.blank.toLowerCase()=='fallback'){outPut = fallback;}
		else{outPut = '';} 
		$('div.scrollableArea').html(outPut); 
		$("div.scrollingText").smoothDivScroll('recalculateScrollableArea');
	}

	/*  Add AdSense  */
	if(myStocks.key.substr(0,1) == 'Q'){
//		$('ul#icons').html('<li id="googAds"><span style="position:relative; top:1px;">' + gas + '</span></li>');
	};

	/*  Show the Ticker  */
	$('div#scrollingMask').show();

	/*  Ensure enough data to scroll  */
	if(outPut.length > 1)
	{
		$('div.stockTicker').each(function(){
			var sm = $(this).find('div#scrollingMask');
			var sa = $(this).find('div.scrollableArea');
			var st = $(this).find('div.scrollingText');

			while($(sa).width() < ($(sm).width() * 2))
			{
				$(sa).html($(sa).html() + outPut);
				$(st).smoothDivScroll('recalculateScrollableArea');
			};
		});
	};

	/*  What to do if you click a scrolling symbol  */			
	if(tdata.length){$('span.tickerSymbol').on('click', function(e){e.preventDefault(); e.stopPropagation(); showChart($(this).attr('data-name'), $(this).attr('data-symbol'));});};

	/*  What to do on Hover  */
	if(tdata.length){
		$('span.tickerSymbol').on('mouseenter', function(e){$(this).addClass('ui-state-hover');});
		$('span.tickerSymbol').on('mouseleave', function(e){$(this).removeClass('ui-state-hover');});
	};

	/*  Start Ticker  */
	if(asm){playTicker();};

	/*  Recall based on throttle setting  */
	if(outPut == myStocks.blank || outPut.length == 1 || !outPut.length){clearTimeout(myStocks.timer); myStocks.timer = null; myStocks.timer = setTimeout('initTicker()', 5000);}
	else{clearTimeout(myStocks.timer); myStocks.timer = null; myStocks.timer = setTimeout('initTicker()', myStocks.throttle);}

	$('.stockTicker ul#loadcons').animate({left:'-20'}, 400, 'linear',function(){});

	/*  If iFramed  */
	if(myStocks.isFramed && !myStocks.init){parent.postMessage('stockTicker&ready&'+myStocks.frameid+'&'+myStocks.ver, '*');};
	if(myStocks.isFramed && myStocks.init){parent.postMessage('stockTicker&update&'+myStocks.frameid, '*');};
	if(myStocks.isFramed && myStocks.init){parent.postMessage('stockTicker&apply&'+myStocks.frameid+'&sym='+myStocks.symbols+'&fields='+myStocks.fields, '*');};

	/*  If NOT iFramed  */
	if(!myStocks.isFramed && window.tickerReady && !myStocks.init){tickerReady();};
	if(!myStocks.isFramed && window.tickerUpdated && myStocks.init){tickerUpdated();};

	if(!myStocks.init){
		myStocks.init = true;
		$('div.stockTicker').fadeTo(0,1);
		setTimeout(function(){showBrand();},1000);
	};

};

/* ************************************	*/
/* Show Chart Dialog			*/
/* ************************************	*/
function showChart(sname, who, scale, ctype)
{
	var $ = jQuery;

	if(sname == 'undefined' || sname == 'N/A' || sname.length == 0){return;}

	if(myStocks.chartProxy){

//		var url = B64.encode('symbol=' + who + '&type=line&period=1d&refresh=60&ticker=hide&lookup=hide&isdiag=true&info=http://bitbenderz.com/chartticker/assets/details.html');

		var url = B64.encode('symbol=' + who + '&type=line&period=1d&refresh=300&ticker=hide&lookup=hide&hdline=hide&isdiag=true');

//		var c = '<iframe src="' + myStocks.ssl + 'chartticker/?type=line&period=1d&refresh=60&ticker=hide&lookup=hide&isdiag=true&info=http://bitbenderz.com/chartticker/assets/details.html&symbol=' + who + '" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="width:314px; height:276px; margin:0px 0px 0px 0px; position:absolute; left:8px; overflow:hidden; background:transparent url(css/images/ajaxLoader.gif) 50% 50% no-repeat;" onload=""></iframe>';

		var c = '<iframe src="' + myStocks.ssl + 'chartticker/?' + url + '" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="width:314px; height:276px; margin:0px 0px 0px 0px; position:absolute; left:8px; overflow:hidden; background:transparent url(css/images/ajaxLoader.gif) 50% 50% no-repeat;" onload=""></iframe>';

		$('div.areaChart').html(c);

		var dt = sname + '&nbsp;<img src="css/images/ajaxLoader.gif" />';

		$('div.areaChart').dialog('option', 'title', sname);

		$('div.areaChart').dialog('open');

	}else{

		if(typeof scale == 'undefined'){scale = (typeof $('input[name="cscale"]:checked').val() != 'undefined') ? $('input[name="cscale"]:checked').val() : '1d';}
		if(typeof ctype == 'undefined'){ctype = (typeof $('input[name="ctype"]:checked').val() != 'undefined') ? $('input[name="ctype"]:checked').val() : 'l';}

		var bgi = myStocks.protocol + '//chart.finance.yahoo.com/z?s=' + who + '&t=' + scale + '&q=' + ctype + '&l=off&z=s&a=&p=s';

		var c =	'<div style="text-align:right;">' +
			'<input type="radio" class="l" name="ctype" value="l" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">Line</span>' +
			'<input type="radio" class="b" name="ctype" value="b" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">OHLC</span>' +
			'<input type="radio" class="c" name="ctype" value="c" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 2px 0px 0px;">Candle</span>' +
			'</div>' +
			'<h1 class="hr ui-widget-content"></h1>' +
			'<div style="margin:16px 0px 8px 0px; display:block; height:166px; width:277px; overflow:hidden; background:transparent;">' +
			'	<img src="' + bgi + '" width="277" />' +
			'</div>' +
			'<h1 class="hr ui-widget-content"></h1>' +
			'<div style="text-align:right;">' +
			'<input type="radio" class="1d" name="cscale" value="1d" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">Today</span>' +
			'<input type="radio" class="5d" name="cscale" value="5d" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">5 Dy</span>' +
			'<input type="radio" class="1m" name="cscale" value="1m" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">1 Mo</span>' +
			'<input type="radio" class="3m" name="cscale" value="3m" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 8px 0px 0px;">3 Mo</span>' +
			'<input type="radio" class="1y" name="cscale" value="1y" /><span style="font-size:11px;position:relative;top:-2px;margin:0px 2px 0px 0px;">1 Yr</span>' +
			'</div>';

		$('div.areaChart').html(c);
		$('div.areaChart').dialog('option', 'title', sname);

		$('div.areaChart input.'+ctype).attr('checked', true);
		$('div.areaChart input.'+scale).attr('checked', true);

		$('div.areaChart input[name="ctype"]').on('change', function(e){ctype = $(this).val();showChart(sname, who, scale, ctype);});
		$('div.areaChart input[name="cscale"]').on('change', function(e){scale = $(this).val();showChart(sname, who, scale, ctype);});

		$('div.areaChart').dialog('open');
	};


	/*  Advertisement  */
	if(myStocks.key.substr(0,1) == 'Q'){
		var af = '<iframe class="myadframe" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="position:absolute; height:100%; width:100%; top:0px; left:0px; z-index:1000;" src="http://bitbenderz.com/stockticker/stockticker/popad.html?theme=smoothness"></iframe>';
		$('.ui-dialog[aria-describedby=areaChart]').find('.ui-dialog-content').append($(af));
	};



	/*  If iFramed  */
	if(myStocks.isFramed){
		$('.stockTickerOptions').dialog('close');
		$('.tickerMsg').dialog('close');
		repoDialog('areaChart');
		parent.postMessage('stockTicker&diagopen&'+myStocks.frameid+'&areaChart', '*');
	};



	/*  If Not iFramed  */
	if(!myStocks.isFramed && window.tickerDiagOpen){tickerDiagOpen('areaChart');}

	/*  Make Dialog Top  */
	$('.ui-dialog[aria-describedby=areaChart]').trigger('click');


}

/* ************************************	*/
/* Reverse Ticker Direction		*/
/* ************************************	*/
function reverseTicker()
{
	var $ = jQuery;

	if(!$('div.scrollingText').html().length){return;};

	clearTimeout(mnuTimer); mnuTimer = null; 
	var currDir = $("div.scrollingText").smoothDivScroll('option', 'autoScrollingDirection');var newDir = currDir;
	switch (currDir)
	{
		case 'endlessLoopLeft':
			newDir = 'endlessLoopRight';
			break;
		case 'endlessLoopRight':
			newDir = 'endlessLoopLeft';
			break;
		default:
			break;
	}
	$("div.scrollingText").smoothDivScroll('option', 'autoScrollingDirection', newDir);
}
	
/* ************************************	*/
/* Speed Up Ticker			*/
/* ************************************	*/
function speedTicker()
{
	var $ = jQuery;

	if(!$('div.scrollingText').html().length){return;};
	clearTimeout(mnuTimer); mnuTimer = null; 

	var currInt = $("div.scrollingText").smoothDivScroll('option', 'autoScrollingStep');
	var newInt = currInt;
	if(currInt < 10) newInt += 1;
	$("div.scrollingText").smoothDivScroll('option', 'autoScrollingStep', newInt);
}

/* ************************************	*/
/* Speed Down Ticker			*/
/* ************************************	*/
function slowTicker()
{
	var $ = jQuery;

	if(!$('div.scrollingText').html().length){return;};
	clearTimeout(mnuTimer); mnuTimer = null; 

	var currInt = $("div.scrollingText").smoothDivScroll('option', 'autoScrollingStep');
	var newInt = currInt;
	if(currInt > 1) newInt -= 1;
	$("div.scrollingText").smoothDivScroll('option', 'autoScrollingStep', newInt);
}
	
/* ************************************	*/
/* Pause Ticker				*/
/* ************************************	*/
function pauseTicker(){	var $ = jQuery; if(!$('div.scrollingText').html().length){return;}; clearTimeout(mnuTimer); mnuTimer = null; $("div.scrollingText").smoothDivScroll("stopAutoScrolling"); $('.tickerPlay').show(); $('.tickerPause').hide();}
	
/* ************************************	*/
/* Play Ticker				*/
/* ************************************	*/
function playTicker(){	var $ = jQuery; if(!$('div.scrollingText').html().length){return;}; clearTimeout(mnuTimer); mnuTimer = null; $("div.scrollingText").smoothDivScroll("startAutoScrolling"); $('.tickerPlay').hide(); $('.tickerPause').show();}


/* ************************************	*/
/* Show Ticker Messages			*/
/* ************************************	*/
function showTickerMsg(who, alt)
{
	var $ = jQuery;

	clearTimeout(mnuTimer); mnuTimer = null; 

	var myData = $(myStocks.msgData).find('msgItem[value="'+who+'"]');

	if(!myData.length){myData = $(myStocks.msgData).find('msgItem[value="defaultMsg"]');}

	var c = $(myData).attr('headerText');
	var d; if(!alt){ d = $(myData).html();}else{ d = alt; };

	var mo = $('.tickerMsg').dialog('widget');
	var mc = $(mo).find('.tickerMsg');

	$('.tickerMsg').dialog('option', 'title', c);
	$(mc).html(d).css('overflow', 'hidden');

	$('.tickerMsg').dialog('open');		


	ah = $(mc).height() - $(mc).find('.slimScrollMe').position().top;

	$(mc).find('.slimScrollMe').height(ah);

	initScroller($(mc).find('.slimScrollMe'));

	/*  If iFramed  */
	if(myStocks.isFramed){
		$('.stockTickerOptions').dialog('close');
		$('.areaChart').dialog('close');
		repoDialog('tickerMsg');
		parent.postMessage('stockTicker&diagopen&'+myStocks.frameid+'&tickerMsg', '*');
	};


	/*  Advertisement  */
	if(myStocks.key.substr(0,1) == 'Q'){
		var af = '<iframe class="myadframe" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="position:absolute; height:100%; width:100%; top:0px; left:0px; z-index:1000;" src="http://bitbenderz.com/stockticker/stockticker/popad.html?theme=smoothness"></iframe>';
		$('.ui-dialog[aria-describedby=tickerMsg]').find('.ui-dialog-content').append($(af));
	};


	/*  If Not iFramed  */
	if(!myStocks.isFramed && window.tickerDiagOpen){tickerDiagOpen('tickerMsg');}

	/*  Make Dialog Top  */
	$('.ui-dialog[aria-describedby=tickerMsg]').trigger('click');

};

/* ************************************	*/
/* Init Scroller			*/
/* ************************************	*/
function initScroller(who){
	var $ = jQuery;

	if($(who).hasClass('mt-scroll')){
		killScroller($(who));
	};

	$(who).mtScroll({
		autoSize         : true,
		hideBars         : true,
		easing           : 'easeOutCubic',
		mouseSensitivity : 2,
		animationTime    : 500,
		barClass         : null,
		vBarClass        : 'styled-vBar',
		hBarClass        : null
	});

};

/* ************************************	*/
/* Kill Scroller			*/
/* ************************************	*/
function killScroller(who){
	var $ = jQuery;

	$(who).mtScroll('remove');
};

/* ************************************	*/
/* Show Ticker Options			*/
/* ************************************	*/
function showTickerOptions() {
	var $ = jQuery;

	$('.stockTickerOptions').dialog('open');

	var mc = $('.ui-dialog[aria-describedby=stockTickerOptions]');

	/*  Create Tabs  */
	$(mc).find('.stockTickerOptions').tabs();
	$(mc).find('.stockTickerOptions .ui-tabs-nav li:eq(4)').hide();
	$(mc).find('.stockTickerOptions .ui-tabs-nav li:eq(5)').hide();
	$(mc).find('.stockTickerOptions .ui-tabs-nav li:eq(6)').hide();
	$(mc).find('.stockTickerOptions .ui-tabs-nav li:eq(7)').hide();
	$(mc).find('.ui-tabs-panel').removeClass('ui-corner-bottom').addClass('ui-corner-all');
	$(mc).find('.stockTickerOptions button.reset').button().on('click', function(e){resetConfig();});
	$(mc).find('.stockTickerOptions button.apply').button().on('click', function(e){applyConfig(); initTicker();});
	$(mc).find('.stockTickerOptions button.cancel').button().on('click', function(e){});
	$(mc).find('.stockTickerOptions button.next').button().on('click', function(e){showMoreOptions();}).hide();
	$(mc).find('.stockTickerOptions button.back').button().on('click', function(e){showLessOptions();}).hide();

	/*  Config Scrollers  */
	$(mc).find('.stockTickerOptions .slimScrollMe').each(function(){
		var ah = $(this).attr('data-height');
		var aw = $(this).attr('data-width');
		$(this).width(aw).height(ah);
		if(!$(this).hasClass('mt-scroll')){initScroller($(this));};
	});

	/*  Currency Converter  Combobox*/
	var wrapper = $(mc).find('div#tabs-4');
	$(wrapper).find('.resCurrency').menu();
	$('.curQuotes').autocomplete({
		delay    : 10,
		source   : myStocks.cncy,
		response : function(e,ui){
			var data = ui.content;
			var who = $(this).closest('.currencyConvertCombo');
			$(who).find('.curContainer').show();
			var out = '';
			if(!data.length){
			    out += '<li><a href="#" onclick="changeCurrency(this); return false;">';
			    out += '<div nowrap="nowrap" class="symbol">OUIE</div>';
			    out += '<div nowrap="nowrap" class="name">Do Not Convert Curreny Values</div>';
			    out += '</a></li>';
			};

			var maxl = data.length > 8 ? 8 : data.length;
			for(var i = 0; i < maxl; i++){

				var iso = $.trim(data[i].value.split('~')[0]);
				var isn = $.trim(data[i].value.split('~')[1]);

				out += '<li><a href="#" onclick="changeCurrency(this); return false;">';
				out += '<div nowrap="nowrap" class="symbol">' + iso + '</div>';
				out += '<div nowrap="nowrap" class="name">' + isn + '</div>';
				out += '</a></li>';
			};
			$(who).find('ul.resCurrency').html(out);
			$(who).find('ul.resCurrency').menu('refresh');

		},
	});

	/*  Watch Keystrokes for Currency  */
	$(wrapper).find('input.curQuotes').off('keyup').on('keyup', function(e){
		var who = $(this).closest('.currencyConvertCombo');
		if(e.keyCode == 27){$(this).val('');$(who).find('div.curContainer').hide(); return;};
		if($(this).val().length == 0){$(who).find('div.curContainer').hide(); $(this).attr('placeholder', 'Convert Currency Values ... OUIE'); return;};
	});


	/*  Instantiate Quote Symbol Lookup */
	var qwrapper = $(mc).find('div#tabs-3');
	$(qwrapper).find('.resQuotes').menu();
	$(qwrapper).find('div.search span.icon').off('click').on('click', function(e){doLookUp($(qwrapper));});

	/*  Watch Keystrokes for Lookup  */
	$(qwrapper).find('input.txtQuotes').off('keyup').on('keyup', function(e){
		if(e.keyCode == 13){doLookUp($(qwrapper)); return;};
		if(e.keyCode == 27){$(this).val(''); $(qwrapper).find('div.quoteContainer').hide(); return;};
		if($(this).val().length >= 1){doLookUp($(qwrapper)); return;};
		if($(this).val().length == 0){$(qwrapper).find('div.quoteContainer').hide(); return;};
	});

	var wrapper = $(mc).find('div#tabs-5');
	/*  Watch Keystrokes for Throttle  */
	$(wrapper).find('input.throttle').off('mouseup').on('mouseup', function(e){$(this).select(); e.preventDefault();});			
	$(wrapper).find('input.throttle').off('focus').on('focus', function(e){$(this).select();});			
	$(wrapper).find('input.throttle').off('keydown').on('keydown', function(e){			
		if (		
			/*  Allow special chars + arrows */	
			   e.keyCode == 46 	
			|| e.keyCode == 8 	
			|| e.keyCode == 9 	
			|| e.keyCode == 13 	
			|| (e.keyCode == 65 && e.ctrlKey === true) 	
			|| (e.keyCode >= 35 && e.keyCode <= 39)	
			|| (e.keyCode == 110 && $(this).val().indexOf('.') == -1)	
			|| (e.keyCode == 190 && $(this).val().indexOf('.') == -1)	
		){return;}		
		else if(e.keyCode == 27) {$(this).val(''); $(this).trigger('blur'); return;}		
		else{		
			/*  If not Number ... Prevent Keypress  */	
			if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) {	
				e.preventDefault(); 
			};	
		};		
	});			
	$(wrapper).find('input.throttle').off('blur').on('blur', function(e){			
		var minVal = 1;		
		if($(this).val() < minVal){$(this).val(minVal);};		
	});			



	/*  Blank Data Editor  */
/*
if(typeof $.fn.jqte != 'undefined'){

	var bdwrapper = $(mc).find('div#tabs-6');
	$(bdwrapper).find('.blank-data').jqte({
		format:	false,
		br:	false,
		center:	false,
		fsize:	false,
		indent:	false,
		left:	false,
		ol:	false,
		outdent:false,
		p:	false,
		right:	false,
		rule:	false,
		sub:	false,
		strike:	false,
		sup:	false,
		ul:	false,
	});
};
*/

	/*  Advertisement  */
	if(myStocks.key.substr(0,1) == 'Q'){
		var af = '<iframe class="myadframe" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="position:absolute; height:100%; width:100%; top:0px; left:0px; z-index:1000;" src="http://bitbenderz.com/stockticker/stockticker/popad.html?theme=smoothness"></iframe>';
		$('.ui-dialog[aria-describedby=stockTickerOptions]').find('.ui-dialog-content').append($(af));
	};


	/*  If iFramed  */
	if(myStocks.isFramed){
		$('.tickerMsg').dialog('close');
		$('.areaChart').dialog('close');
		repoDialog('stockTickerOptions');
		parent.postMessage('stockTicker&diagopen&'+myStocks.frameid+'&stockTickerOptions', '*');
	};

	/*  If Not iFramed  */
	if(!myStocks.isFramed && window.tickerDiagOpen){tickerDiagOpen('stockTickerOptions');}

	/*  Make Dialog Top  */
	$('.ui-dialog[aria-describedby=stockTickerOptions]').trigger('click');

};

/* ************************************	*/
/* Reposition Dialog			*/
/* ************************************	*/
function repoDialog(who) {
	var $ = jQuery;

	/*  Stock Ticker  */
	var mc = $('div.stockTicker');

	/*  Which Dialog Opened  */
	var wd = $('.ui-dialog[aria-describedby='+who+']');

	/*  Get Stock Ticker Location  */
	var st = $(mc).offset().top;
	var sl = $(mc).offset().left;

	/*  Get Stock Ticker Dimensions  */
	var ho = $(mc).find('.ticker-ad').height() > 0 ? 54 : 0;
	var sh = $(mc).height() - ho;
	var sw = $(mc).width();

	/*  Get Dialog Dimensions  */
	var th = $(wd).height();
	var tw = $(wd).width();

	/*  Move Dialog */
	$(wd).css('top', (st+sh+28)+'px').css('left', (sl+(sw-tw)/2) + 'px');
};

/* ************************************	*/
/* Show More Options Tab		*/
/* ************************************	*/
function showMoreOptions() {
	var $ = jQuery;

	var mc = $('.ui-dialog[aria-describedby=stockTickerOptions] .stockTickerOptions');

	$(mc).find('.ui-tabs-nav li:eq(0)').hide();
	$(mc).find('.ui-tabs-nav li:eq(1)').hide();
	$(mc).find('.ui-tabs-nav li:eq(2)').hide();
	$(mc).find('.ui-tabs-nav li:eq(3)').hide();
	$(mc).find('.ui-tabs-nav li:eq(4)').show();
	$(mc).find('.ui-tabs-nav li:eq(5)').show();
	$(mc).find('.ui-tabs-nav li:eq(6)').show();
	$(mc).find('.ui-tabs-nav li:eq(7)').show();

	$(mc).tabs('refresh');
	$(mc).tabs('option', 'active', 4);

	$(mc).find('button.cancel').hide();
	$(mc).find('button.next').hide();
	$(mc).find('button.back').show();

};

/* ************************************	*/
/* Show Less Options Tab		*/
/* ************************************	*/
function showLessOptions() {
	var $ = jQuery;

	var mc = $('.ui-dialog[aria-describedby=stockTickerOptions] .stockTickerOptions');

	$(mc).dialog('option', 'draggable', false);
	$(mc).find('.ui-tabs-nav li:eq(0)').show();
	$(mc).find('.ui-tabs-nav li:eq(1)').show();
	$(mc).find('.ui-tabs-nav li:eq(2)').show();
	$(mc).find('.ui-tabs-nav li:eq(3)').show();
	$(mc).find('.ui-tabs-nav li:eq(4)').hide();
	$(mc).find('.ui-tabs-nav li:eq(5)').hide();
	$(mc).find('.ui-tabs-nav li:eq(6)').hide();
	$(mc).find('.ui-tabs-nav li:eq(7)').hide();

	$(mc).tabs('refresh');
	$(mc).tabs('option', 'active', 0);

	$(mc).find('button.cancel').hide();
	$(mc).find('button.next').show();
	$(mc).find('button.back').hide();

};

/* ************************************	*/
/* Change Chart Symbol	 		*/
/* ************************************	*/
function changeChart(who) {
	var $ = jQuery;

	var wrapper = $(who).closest('.stockTickerOptionsContent');

	var q = $.trim($(who).find('div.symbol').html());
	$(wrapper).find('textarea.symbols').val($('textarea.symbols').val() + q + ',\r\n');
	$(wrapper).find('.quoteContainer').hide();
	$(wrapper).find('.txtQuotes').val('');
};


/* ************************************	*/
/* Symbol Lookup	 		*/
/* ************************************	*/
function doLookUp(who) {
	var id = $(who).attr('id');

	var qry = $(who).find('input.txtQuotes').val();
	$(who).find('input.txtQuotes').attr('value', qry);
	var url = 'http://d.yimg.com/aq/autoc?query=' + qry + '&callback=YAHOO.util.ScriptNodeDataSource.callbacks&ref='+id;
	var request = $.getScript(url, function(data){st_lookup = this.url.split('&ref=')[1].split('&')[0];});
};

/* ************************************	*/
/* Show Lookup		 		*/
/* ************************************	*/
function showLookUp(data){
	var who = $('#'+st_lookup);
	if(data.ResultSet.Result.length){$(who).find('.quoteContainer').show();};
	var out = '';
	for(var i = 0; i < data.ResultSet.Result.length; i++){
		out += '<li><a href="#" onclick="changeChart(this); return false;">';
		out += '<div nowrap="nowrap" class="symbol">' + data.ResultSet.Result[i].symbol + '</div>';
		out += '<div nowrap="nowrap" class="name">' + data.ResultSet.Result[i].name + '</div>';
		out += '</a></li>';
	};
	$(who).find('ul.resQuotes').html(out);
	$(who).find('ul.resQuotes').menu('refresh');
};

/* ************************************	*/
/* Symbol Lookup Callback 		*/
/* ************************************	*/
if(typeof(YAHOO)=="undefined"){YAHOO={}};
if(typeof(YAHOO.util)=="undefined"){YAHOO.util={}};
if(typeof(YAHOO.util.ScriptNodeDataSource)=="undefined"){YAHOO.util.ScriptNodeDataSource={}};

if(typeof(YAHOO.util.ScriptNodeDataSource.callbacks) == "undefined") {
	YAHOO.util.ScriptNodeDataSource.callbacks=function(i){
		var h={containerId:"#quoteContainer",listId:"#resQuotes",quoteLogicId:"#get_quote_logic_opt",inputId:"#txtQuotes"};
		if(typeof showLookUp != 'undefined'){setTimeout(function(){showLookUp(i)}, 1);};
	};
};

/* ************************************	*/
/* Change Currency		 	*/
/* ************************************	*/
function changeCurrency(who){
	var $ = jQuery;
	var iso = $(who).find('.symbol').html();
	var who = $(who).closest('.currencyConvertCombo');
	$(who).find('div.curContainer').hide();
	$(who).find('input.curQuotes').attr('placeholder', 'Convert Currency Values ... '+iso).val('').trigger('blur');	
};

/* ************************************	*/
/* Notify Parent Dialog Closed	 	*/
/* ************************************	*/
function framedHideDialog(who){
	/*  If iFramed  */
	if(myStocks.isFramed){parent.postMessage('stockTicker&diagclose&'+myStocks.frameid+'&'+who, '*');};

	/*  If Not iFramed  */
	if(!myStocks.isFramed && window.tickerDiagClose){tickerDiagClose(who);};
};

/* ************************************	*/
/* Remove Blanks & Dupes From Array 	*/
/* ************************************	*/
function cleanArray(orgArray){
	var a = new Array();
	for(var i = 0; i < orgArray.length; i++){if (orgArray[i]){a.push(orgArray[i]);};};
	if(a.length > 0){var b=a.length, c;while(c=--b)while(c--)a[b]!==a[c]||a.splice(c,1);};
	return a;
};

/* ************************************	*/
/* Google Ad Frame		 	*/
/* ************************************	*/
var removeAdFrame = function(){
	var $ = jQuery;
	$('iframe.myadframe').remove();
}

/* ************************************ */
/* Encode / Decode                      */
/* ************************************ */
var B64={alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",lookup:null,ie:/MSIE /.test(navigator.userAgent),ieo:/MSIE [67]/.test(navigator.userAgent),encode:function(e){var t=B64.toUtf8(e),n=-1,r=t.length,i,s,o,u=[,,,];if(B64.ie){var a=[];while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a.push(B64.alphabet.charAt(u[0]),B64.alphabet.charAt(u[1]),B64.alphabet.charAt(u[2]),B64.alphabet.charAt(u[3]))}return a.join("")}else{var a="";while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a+=B64.alphabet[u[0]]+B64.alphabet[u[1]]+B64.alphabet[u[2]]+B64.alphabet[u[3]]}return a}},decode:function(e){if(e.length%4)throw new Error("InvalidCharacterError: 'B64.decode' failed: The string to be decoded is not correctly encoded.");var t=B64.fromUtf8(e),n=0,r=t.length;if(B64.ieo){var i=[];while(n<r){if(t[n]<128)i.push(String.fromCharCode(t[n++]));else if(t[n]>191&&t[n]<224)i.push(String.fromCharCode((t[n++]&31)<<6|t[n++]&63));else i.push(String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63))}return i.join("")}else{var i="";while(n<r){if(t[n]<128)i+=String.fromCharCode(t[n++]);else if(t[n]>191&&t[n]<224)i+=String.fromCharCode((t[n++]&31)<<6|t[n++]&63);else i+=String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63)}return i}},toUtf8:function(e){var t=-1,n=e.length,r,i=[];if(/^[\x00-\x7f]*$/.test(e))while(++t<n)i.push(e.charCodeAt(t));else while(++t<n){r=e.charCodeAt(t);if(r<128)i.push(r);else if(r<2048)i.push(r>>6|192,r&63|128);else i.push(r>>12|224,r>>6&63|128,r&63|128)}return i},fromUtf8:function(e){var t=-1,n,r=[],i=[,,,];if(!B64.lookup){n=B64.alphabet.length;B64.lookup={};while(++t<n)B64.lookup[B64.alphabet.charAt(t)]=t;t=-1}n=e.length;while(++t<n){i[0]=B64.lookup[e.charAt(t)];i[1]=B64.lookup[e.charAt(++t)];r.push(i[0]<<2|i[1]>>4);i[2]=B64.lookup[e.charAt(++t)];if(i[2]==64)break;r.push((i[1]&15)<<4|i[2]>>2);i[3]=B64.lookup[e.charAt(++t)];if(i[3]==64)break;r.push((i[2]&3)<<6|i[3])}return r}};

/* ************************************	*/
/* jQuery mtScroll Minified		*/
/* ************************************	*/
(function(e){var t={init:function(t){this.each(function(){function M(){f.css({height:"auto",width:"auto"});if(f.height()!=c||f.width()!=l||u.width()!=r||u.height()!=i){r=u.width();i=u.height();a.width(r).height(i);l=f.width();f.css("width",l);c=f.height();h=i/c;p=r/l;w=Math.floor(i*h);if(h<1){y.height(w-parseInt(y.css("margin-bottom")));if(!n["hideBars"])y.stop(true,true).fadeIn(n["animationTime"]/2)}else{y.stop(true,true).fadeOut(n["animationTime"]/2)}x=Math.floor(r*p);if(p<1){E.width(x-T);if(!n["hideBars"])E.stop(true,true).fadeIn(n["animationTime"]/2)}else{E.stop(true,true).fadeOut(n["animationTime"]/2)}N=(i-c)/(i-w);C=(r-l)/(r-x);var e=parseInt(f.css("left"));if(e<r-l)e=r-l;if(e>0)e=0;var t=parseInt(f.css("top"));if(t<i-c)t=i-c;if(t>0)t=0;f.stop(true,false).animate({left:e,top:t},{duration:n["animationTime"]/2,queue:true});y.css("top",t/N);E.css("left",e/C);if(g){k=a.offset().top;L=a.offset().left;A=i-c;if(A>0)A=0;O=r-l;if(O>0)O=0;f.draggable({containment:[O+L,A+k,L,k]})}}}function _(e){if(e){if(window.addEventListener){window.addEventListener("DOMMouseScroll",D,false)}window.onmousewheel=document.onmousewheel=D}else{if(window.removeEventListener){window.removeEventListener("DOMMouseScroll",D)}window.onmousewheel=document.onmousewheel=null}}function D(e){var t=0;if(!e){e=window.event}if(e.wheelDelta){t=e.wheelDelta/120}else if(e.detail){t=-e.detail/3}if(t==0){return}if(h>=1){return}var r=parseInt(f.css("top"))+Math.floor(t*i/n["mouseSensitivity"]);if(r>0){r=0}if(r<i-c){r=i-c}f.stop(true,false).animate({top:r},{duration:n["animationTime"],queue:true,easing:n["easing"]});y.stop(true,false).animate({top:r/N},{duration:n["animationTime"],queue:true,easing:n["easing"]});if(e.preventDefault){e.preventDefault()}e.returnValue=false}function P(){var e=/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());try{document.createEvent("TouchEvent");return true&&e}catch(t){return false&&e}}function H(e,t){if(e.style.getPropertyValue){return e.style.getPropertyValue(t)}else{return e.style.getAttribute(t)}}if(e(this).hasClass("mt-scroll"))return;e(this).addClass("mt-scroll");var n=e.extend({animationTime:500,barClass:"",vBarClass:"",hBarClass:"",mouseSensitivity:2,autoSize:true,hideBars:true,easing:"easeOutCubic"},t);var r=e(this).width();var i=e(this).height();var s=e(this).css("overflow");var o=e(this).css("float");var u=e(this).scrollTop(0).scrollLeft(0).css({overflow:"hidden"}).data({"prev-overflow":s,"prev-float":o});u.wrapInner('<div class="mt-scroll-holder" style="position: relative;"><div class="mt-scroll-content" style="position: absolute; top: 0; left: 0"></div></div>');var a=e(".mt-scroll-holder",u);var f=e(".mt-scroll-content",u);a.width(r).height(i);var l=f.width();f.css("width",l);var c=f.height();var h=i/c;var p=r/l;var d;var v;var m;var g=P();a.append('<div class="mt-scroll-vertical-bar '+n["barClass"]+" "+n["vBarClass"]+'"><ins></ins></div>');var y=e(".mt-scroll-vertical-bar",a);if(document.all&&document.documentMode<=8&&n["barClass"]==""&&n["vBarClass"]=="")y.css({background:"gray",marginBottom:"4px"});y.css({display:"block",position:"absolute",top:0,right:0});if(y.css("background-color")=="rgba(0, 0, 0, 0)"&&y.css("background-image")=="none")y.css("background-color","rgba(0, 0, 0, 0.3)");if(y.css("background-color")=="transparent"&&y.css("background-image")=="none")y.css("background-color","rgba(0, 0, 0, 0.3)");if(parseInt(y.css("width"))==0||y.css("width")=="auto")y.css({width:7,"border-radius":3,cursor:"default"});var b=y.width();var w=Math.floor(i*h);y.height(w-parseInt(y.css("margin-bottom")));if(h<1){if(n["hideBars"])y.delay(2*n["animationTime"]).fadeOut(n["animationTime"]/2)}else{y.hide()}a.append('<div class="mt-scroll-horizontal-bar '+n["barClass"]+" "+n["hBarClass"]+'"><ins></ins></div>');var E=e(".mt-scroll-horizontal-bar",a);E.css({display:"block",position:"absolute",bottom:0,left:0});if(E.css("background-color")=="rgba(0, 0, 0, 0)"&&E.css("background-image")=="none")E.css("background-color","rgba(0, 0, 0, 0.3)");if(E.css("background-color")=="transparent"&&E.css("background-image")=="none")E.css("background-color","rgba(0, 0, 0, 0.3)");if(parseInt(E.css("height"))==0||E.css("height")=="auto")E.css({height:7,"border-radius":3,cursor:"default"});var S=E.height();var x=Math.floor(r*p);var T=0;if(y){T=parseInt(E.css("margin-right"))+Math.ceil(b*1.2);E.css({"margin-right":T})}E.width(x-T);if(p<1){if(n["hideBars"])E.delay(2*n["animationTime"]).fadeOut(n["animationTime"]/2)}else{E.hide()}var N=(i-c)/(i-w);var C=(r-l)/(r-x);if(g){var k=a.offset().top;var L=a.offset().left;var A=i-c;if(A>0)A=0;var O=r-l;if(O>0)O=0;f.draggable({scrollSensitivity:40,containment:[O+L,A+k,L,k]}).bind("drag",function(){y.stop(true,true).css("top",parseInt(e(this).css("top"))/N);E.stop(true,true).css("left",parseInt(e(this).css("left"))/C)}).mousedown(function(){e(this).stop(true,false);var t=new Date;m=t.getTime();d=parseInt(e(this).css("top"));v=parseInt(e(this).css("left"));if(n["hideBars"]){if(h<1)y.stop(true,true).fadeIn(n["animationTime"]/2);if(p<1)E.stop(true,true).fadeIn(n["animationTime"]/2)}}).mouseup(function(){var t=new Date;var s=parseInt(e(this).css("top"));var o=parseInt(e(this).css("left"));var u=s+(s-d)*50/(t.getTime()-m);if(u<i-c)u=i-c;if(u>0)u=0;var a=o+(o-v)*50/(t.getTime()-m);if(a<r-l)a=r-l;if(a>0)a=0;e(this).stop(true,false).animate({top:u,left:a},n["animationTime"]);y.stop(true,true).animate({top:u/N},n["animationTime"]);E.stop(true,true).animate({left:a/C},n["animationTime"]);if(n["hideBars"]){y.fadeOut(n["animationTime"]);E.fadeOut(n["animationTime"])}})}else{y.draggable({containment:u,axis:"y"}).bind("drag",function(){f.css("top",parseInt(e(this).css("top"))*N)});E.draggable({containment:u,axis:"x"}).bind("drag",function(){f.css("left",parseInt(e(this).css("left"))*C)});u.hover(function(){if(n["hideBars"]){if(h<1){y.stop(true,true).css("opacity","").fadeIn(n["animationTime"]/4)}if(p<1){E.stop(true,true).css("opacity","").fadeIn(n["animationTime"]/4)}}_(true)},function(){if(n["hideBars"]){if(h<1){y.stop(true,true).fadeOut(n["animationTime"]/2)}if(p<1){E.stop(true,true).fadeOut(n["animationTime"]/2)}}_(false)})}if(n["autoSize"]){setInterval(function(){M()},240)}})},remove:function(){this.each(function(){var t=e(this);if(!t.hasClass("mt-scroll"))return;e(".mt-scroll-vertical-bar",t).remove();e(".mt-scroll-horizontal-bar",t).remove();var h = e(".mt-scroll-content",t).html();t.html(h).css({overflow:t.data("prev-overflow"),"float":t.data("prev-float")}).removeClass("mt-scroll")})}};e.fn.mtScroll=function(n){if(document.all&&typeof XDomainRequest=="undefined")return;if(t[n]){return t[n].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof n==="object"||!n){return t.init.apply(this,arguments)}else{e.error("Method "+n+" does not exist on jQuery.mtScroll")}}})(jQuery)

/* ************************************	*/
/* jQuery TouchPunch v0.2.3		*/
/* ************************************	*/
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

/* ************************************	*/
/* jQuery SmoothDivScroll v1.3	 	*/
/* ************************************	*/
(function($){$.widget("thomaskahn.smoothDivScroll",{options:{scrollingHotSpotLeftClass:"scrollingHotSpotLeft",scrollingHotSpotRightClass:"scrollingHotSpotRight",scrollableAreaClass:"scrollableArea",scrollWrapperClass:"scrollWrapper",hiddenOnStart:false,getContentOnLoad:{},countOnlyClass:"",startAtElementId:"",hotSpotScrolling:true,hotSpotScrollingStep:15,hotSpotScrollingInterval:10,hotSpotMouseDownSpeedBooster:3,visibleHotSpotBackgrounds:"hover",hotSpotsVisibleTime:5000,easingAfterHotSpotScrolling:true,easingAfterHotSpotScrollingDistance:10,easingAfterHotSpotScrollingDuration:300,easingAfterHotSpotScrollingFunction:"easeOutQuart",mousewheelScrolling:"",mousewheelScrollingStep:70,easingAfterMouseWheelScrolling:true,easingAfterMouseWheelScrollingDuration:300,easingAfterMouseWheelScrollingFunction:"easeOutQuart",manualContinuousScrolling:false,autoScrollingMode:"",autoScrollingDirection:"endlessLoopRight",autoScrollingStep:1,autoScrollingInterval:10,touchScrolling:false,scrollToAnimationDuration:1000,scrollToEasingFunction:"easeOutQuart"},_create:function(){var self=this,o=this.options,el=this.element;el.data("scrollWrapper",el.find("."+o.scrollWrapperClass));el.data("scrollingHotSpotRight",el.find("."+o.scrollingHotSpotRightClass));el.data("scrollingHotSpotLeft",el.find("."+o.scrollingHotSpotLeftClass));el.data("scrollableArea",el.find("."+o.scrollableAreaClass));if(el.data("scrollingHotSpotRight").length>0){el.data("scrollingHotSpotRight").detach()}if(el.data("scrollingHotSpotLeft").length>0){el.data("scrollingHotSpotLeft").detach()}if(el.data("scrollableArea").length===0&&el.data("scrollWrapper").length===0){el.wrapInner("<div class='"+o.scrollableAreaClass+"'>").wrapInner("<div class='"+o.scrollWrapperClass+"'>");el.data("scrollWrapper",el.find("."+o.scrollWrapperClass));el.data("scrollableArea",el.find("."+o.scrollableAreaClass))}else if(el.data("scrollWrapper").length===0){el.wrapInner("<div class='"+o.scrollWrapperClass+"'>");el.data("scrollWrapper",el.find("."+o.scrollWrapperClass))}else if(el.data("scrollableArea").length===0){el.data("scrollWrapper").wrapInner("<div class='"+o.scrollableAreaClass+"'>");el.data("scrollableArea",el.find("."+o.scrollableAreaClass))}if(el.data("scrollingHotSpotRight").length===0){el.prepend("<div class='"+o.scrollingHotSpotRightClass+"'></div>");el.data("scrollingHotSpotRight",el.find("."+o.scrollingHotSpotRightClass))}else{el.prepend(el.data("scrollingHotSpotRight"))}if(el.data("scrollingHotSpotLeft").length===0){el.prepend("<div class='"+o.scrollingHotSpotLeftClass+"'></div>");el.data("scrollingHotSpotLeft",el.find("."+o.scrollingHotSpotLeftClass))}else{el.prepend(el.data("scrollingHotSpotLeft"))}el.data("speedBooster",1);el.data("scrollXPos",0);el.data("hotSpotWidth",el.data("scrollingHotSpotLeft").innerWidth());el.data("scrollableAreaWidth",0);el.data("startingPosition",0);el.data("rightScrollingInterval",null);el.data("leftScrollingInterval",null);el.data("autoScrollingInterval",null);el.data("hideHotSpotBackgroundsInterval",null);el.data("previousScrollLeft",0);el.data("pingPongDirection","right");el.data("getNextElementWidth",true);el.data("swapAt",null);el.data("startAtElementHasNotPassed",true);el.data("swappedElement",null);el.data("originalElements",el.data("scrollableArea").children(o.countOnlyClass));el.data("visible",true);el.data("enabled",true);el.data("scrollableAreaHeight",el.data("scrollableArea").height());el.data("scrollerOffset",el.offset());if(o.touchScrolling&&el.data("enabled")){el.data("scrollWrapper").kinetic({y:false,moved:function(settings){if(o.manualContinuousScrolling){if(el.data("scrollWrapper").scrollLeft()<=0){self._checkContinuousSwapLeft()}else{self._checkContinuousSwapRight()}}},stopped:function(settings){el.data("scrollWrapper").stop(true,false);self.stopAutoScrolling()}})}el.data("scrollingHotSpotRight").bind("mousemove",function(e){if(o.hotSpotScrolling){var x=e.pageX-(this.offsetLeft+el.data("scrollerOffset").left);el.data("scrollXPos",Math.round((x/el.data("hotSpotWidth"))*o.hotSpotScrollingStep));if(el.data("scrollXPos")===Infinity||el.data("scrollXPos")<1){el.data("scrollXPos",1)}}});el.data("scrollingHotSpotRight").bind("mouseover",function(){if(o.hotSpotScrolling){el.data("scrollWrapper").stop(true,false);self.stopAutoScrolling();el.data("rightScrollingInterval",setInterval(function(){if(el.data("scrollXPos")>0&&el.data("enabled")){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+(el.data("scrollXPos")*el.data("speedBooster")));if(o.manualContinuousScrolling){self._checkContinuousSwapRight()}self._showHideHotSpots()}},o.hotSpotScrollingInterval));self._trigger("mouseOverRightHotSpot")}});el.data("scrollingHotSpotRight").bind("mouseout",function(){if(o.hotSpotScrolling){clearInterval(el.data("rightScrollingInterval"));el.data("scrollXPos",0);if(o.easingAfterHotSpotScrolling&&el.data("enabled")){el.data("scrollWrapper").animate({scrollLeft:el.data("scrollWrapper").scrollLeft()+o.easingAfterHotSpotScrollingDistance},{duration:o.easingAfterHotSpotScrollingDuration,easing:o.easingAfterHotSpotScrollingFunction})}}});el.data("scrollingHotSpotRight").bind("mousedown",function(){el.data("speedBooster",o.hotSpotMouseDownSpeedBooster)});$("body").bind("mouseup",function(){el.data("speedBooster",1)});el.data("scrollingHotSpotLeft").bind("mousemove",function(e){if(o.hotSpotScrolling){var x=((this.offsetLeft+el.data("scrollerOffset").left+el.data("hotSpotWidth"))-e.pageX);el.data("scrollXPos",Math.round((x/el.data("hotSpotWidth"))*o.hotSpotScrollingStep));if(el.data("scrollXPos")===Infinity||el.data("scrollXPos")<1){el.data("scrollXPos",1)}}});el.data("scrollingHotSpotLeft").bind("mouseover",function(){if(o.hotSpotScrolling){el.data("scrollWrapper").stop(true,false);self.stopAutoScrolling();el.data("leftScrollingInterval",setInterval(function(){if(el.data("scrollXPos")>0&&el.data("enabled")){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-(el.data("scrollXPos")*el.data("speedBooster")));if(o.manualContinuousScrolling){self._checkContinuousSwapLeft()}self._showHideHotSpots()}},o.hotSpotScrollingInterval));self._trigger("mouseOverLeftHotSpot")}});el.data("scrollingHotSpotLeft").bind("mouseout",function(){if(o.hotSpotScrolling){clearInterval(el.data("leftScrollingInterval"));el.data("scrollXPos",0);if(o.easingAfterHotSpotScrolling&&el.data("enabled")){el.data("scrollWrapper").animate({scrollLeft:el.data("scrollWrapper").scrollLeft()-o.easingAfterHotSpotScrollingDistance},{duration:o.easingAfterHotSpotScrollingDuration,easing:o.easingAfterHotSpotScrollingFunction})}}});el.data("scrollingHotSpotLeft").bind("mousedown",function(){el.data("speedBooster",o.hotSpotMouseDownSpeedBooster)});el.data("scrollableArea").mousewheel(function(event,delta,deltaX,deltaY){if(el.data("enabled")&&o.mousewheelScrolling.length>0){var pixels;if(o.mousewheelScrolling==="vertical"&&deltaY!==0){self.stopAutoScrolling();event.preventDefault();pixels=Math.round((o.mousewheelScrollingStep*deltaY)*-1);self.move(pixels)}else if(o.mousewheelScrolling==="horizontal"&&deltaX!==0){self.stopAutoScrolling();event.preventDefault();pixels=Math.round((o.mousewheelScrollingStep*deltaX)*-1);self.move(pixels)}else if(o.mousewheelScrolling==="allDirections"){self.stopAutoScrolling();event.preventDefault();pixels=Math.round((o.mousewheelScrollingStep*delta)*-1);self.move(pixels)}}});if(o.mousewheelScrolling){el.data("scrollingHotSpotLeft").add(el.data("scrollingHotSpotRight")).mousewheel(function(event){event.preventDefault()})}$(window).bind("resize",function(){self._showHideHotSpots();self._trigger("windowResized")});if(!(jQuery.isEmptyObject(o.getContentOnLoad))){self[o.getContentOnLoad.method](o.getContentOnLoad.content,o.getContentOnLoad.manipulationMethod,o.getContentOnLoad.addWhere,o.getContentOnLoad.filterTag)}if(o.hiddenOnStart){self.hide()}$(window).load(function(){if(!(o.hiddenOnStart)){self.recalculateScrollableArea()}if((o.autoScrollingMode.length>0)&&!(o.hiddenOnStart)){self.startAutoScrolling()}if(o.autoScrollingMode!=="always"){switch(o.visibleHotSpotBackgrounds){case"always":self.showHotSpotBackgrounds();break;case"onStart":self.showHotSpotBackgrounds();el.data("hideHotSpotBackgroundsInterval",setTimeout(function(){self.hideHotSpotBackgrounds(250)},o.hotSpotsVisibleTime));break;case"hover":el.mouseenter(function(event){if(o.hotSpotScrolling){event.stopPropagation();self.showHotSpotBackgrounds(250)}}).mouseleave(function(event){if(o.hotSpotScrolling){event.stopPropagation();self.hideHotSpotBackgrounds(250)}});break;default:break}}self._showHideHotSpots();self._trigger("setupComplete")})},_setOption:function(key,value){var self=this,o=this.options,el=this.element;o[key]=value;if(key==="hotSpotScrolling"){if(value===true){self._showHideHotSpots()}else{el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}}else if(key==="autoScrollingStep"||key==="easingAfterHotSpotScrollingDistance"||key==="easingAfterHotSpotScrollingDuration"||key==="easingAfterMouseWheelScrollingDuration"){o[key]=parseInt(value,10)}else if(key==="autoScrollingInterval"){o[key]=parseInt(value,10);self.startAutoScrolling()}},showHotSpotBackgrounds:function(fadeSpeed){var self=this,el=this.element,o=this.option;if(fadeSpeed!==undefined){el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotLeft").add(el.data("scrollingHotSpotRight")).fadeTo(fadeSpeed,0.35)}else{el.data("scrollingHotSpotLeft").addClass("scrollingHotSpotLeftVisible");el.data("scrollingHotSpotLeft").removeAttr("style");el.data("scrollingHotSpotRight").addClass("scrollingHotSpotRightVisible");el.data("scrollingHotSpotRight").removeAttr("style")}self._showHideHotSpots()},hideHotSpotBackgrounds:function(fadeSpeed){var el=this.element,o=this.option;if(fadeSpeed!==undefined){el.data("scrollingHotSpotLeft").fadeTo(fadeSpeed,0.0,function(){el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible")});el.data("scrollingHotSpotRight").fadeTo(fadeSpeed,0.0,function(){el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible")})}else{el.data("scrollingHotSpotLeft").removeClass("scrollingHotSpotLeftVisible").removeAttr("style");el.data("scrollingHotSpotRight").removeClass("scrollingHotSpotRightVisible").removeAttr("style")}},_showHideHotSpots:function(){var self=this,el=this.element,o=this.options;if(!(o.hotSpotScrolling)){el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}else{if(o.manualContinuousScrolling&&o.hotSpotScrolling&&o.autoScrollingMode!=="always"){el.data("scrollingHotSpotLeft").show();el.data("scrollingHotSpotRight").show()}else if(o.autoScrollingMode!=="always"&&o.hotSpotScrolling){if(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth())){el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}else if(el.data("scrollWrapper").scrollLeft()===0){el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").show();self._trigger("scrollerLeftLimitReached");clearInterval(el.data("leftScrollingInterval"));el.data("leftScrollingInterval",null)}else if(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth()+el.data("scrollWrapper").scrollLeft())){el.data("scrollingHotSpotLeft").show();el.data("scrollingHotSpotRight").hide();self._trigger("scrollerRightLimitReached");clearInterval(el.data("rightScrollingInterval"));el.data("rightScrollingInterval",null)}else{el.data("scrollingHotSpotLeft").show();el.data("scrollingHotSpotRight").show()}}else{el.data("scrollingHotSpotLeft").hide();el.data("scrollingHotSpotRight").hide()}}},_setElementScrollPosition:function(method,element){var el=this.element,o=this.options,tempScrollPosition=0;switch(method){case"first":el.data("scrollXPos",0);return true;case"start":if(o.startAtElementId!==""){if(el.data("scrollableArea").has("#"+o.startAtElementId)){tempScrollPosition=$("#"+o.startAtElementId).position().left;el.data("scrollXPos",tempScrollPosition);return true}}return false;case"last":el.data("scrollXPos",(el.data("scrollableAreaWidth")-el.data("scrollWrapper").innerWidth()));return true;case"number":if(!(isNaN(element))){tempScrollPosition=el.data("scrollableArea").children(o.countOnlyClass).eq(element-1).position().left;el.data("scrollXPos",tempScrollPosition);return true}return false;case"id":if(element.length>0){if(el.data("scrollableArea").has("#"+element)){tempScrollPosition=$("#"+element).position().left;el.data("scrollXPos",tempScrollPosition);return true}}return false;default:return false}},jumpToElement:function(jumpTo,element){var self=this,el=this.element;if(el.data("enabled")){if(self._setElementScrollPosition(jumpTo,element)){el.data("scrollWrapper").scrollLeft(el.data("scrollXPos"));self._showHideHotSpots();switch(jumpTo){case"first":self._trigger("jumpedToFirstElement");break;case"start":self._trigger("jumpedToStartElement");break;case"last":self._trigger("jumpedToLastElement");break;case"number":self._trigger("jumpedToElementNumber",null,{"elementNumber":element});break;case"id":self._trigger("jumpedToElementId",null,{"elementId":element});break;default:break}}}},scrollToElement:function(scrollTo,element){var self=this,el=this.element,o=this.options,autoscrollingWasRunning=false;if(el.data("enabled")){if(self._setElementScrollPosition(scrollTo,element)){if(el.data("autoScrollingInterval")!==null){self.stopAutoScrolling();autoscrollingWasRunning=true}el.data("scrollWrapper").stop(true,false);el.data("scrollWrapper").animate({scrollLeft:el.data("scrollXPos")},{duration:o.scrollToAnimationDuration,easing:o.scrollToEasingFunction,complete:function(){if(autoscrollingWasRunning){self.startAutoScrolling()}self._showHideHotSpots();switch(scrollTo){case"first":self._trigger("scrolledToFirstElement");break;case"start":self._trigger("scrolledToStartElement");break;case"last":self._trigger("scrolledToLastElement");break;case"number":self._trigger("scrolledToElementNumber",null,{"elementNumber":element});break;case"id":self._trigger("scrolledToElementId",null,{"elementId":element});break;default:break}}})}}},move:function(pixels){var self=this,el=this.element,o=this.options;el.data("scrollWrapper").stop(true,true);if((pixels<0&&el.data("scrollWrapper").scrollLeft()>0)||(pixels>0&&el.data("scrollableAreaWidth")>(el.data("scrollWrapper").innerWidth()+el.data("scrollWrapper").scrollLeft()))){if(o.easingAfterMouseWheelScrolling){el.data("scrollWrapper").animate({scrollLeft:el.data("scrollWrapper").scrollLeft()+pixels},{duration:o.easingAfterMouseWheelScrollingDuration,easing:o.easingAfterMouseWheelFunction,complete:function(){self._showHideHotSpots();if(o.manualContinuousScrolling){if(pixels>0){self._checkContinuousSwapRight()}else{self._checkContinuousSwapLeft()}}}})}else{el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+pixels);self._showHideHotSpots();if(o.manualContinuousScrolling){if(pixels>0){self._checkContinuousSwapRight()}else{self._checkContinuousSwapLeft()}}}}},getFlickrContent:function(content,manipulationMethod){var self=this,el=this.element;$.getJSON(content,function(data){var flickrImageSizes=[{size:"small square",pixels:75,letter:"_s"},{size:"thumbnail",pixels:100,letter:"_t"},{size:"small",pixels:240,letter:"_m"},{size:"medium",pixels:500,letter:""},{size:"medium 640",pixels:640,letter:"_z"},{size:"large",pixels:1024,letter:"_b"}];var loadedFlickrImages=[];var imageIdStringBuffer=[];var startingIndex;var numberOfFlickrItems=data.items.length;var loadedFlickrImagesCounter=0;if(el.data("scrollableAreaHeight")<=75){startingIndex=0}else if(el.data("scrollableAreaHeight")<=100){startingIndex=1}else if(el.data("scrollableAreaHeight")<=240){startingIndex=2}else if(el.data("scrollableAreaHeight")<=500){startingIndex=3}else if(el.data("scrollableAreaHeight")<=640){startingIndex=4}else{startingIndex=5}$.each(data.items,function(index,item){loadFlickrImage(item,startingIndex)});function loadFlickrImage(item,sizeIndex){var path=item.media.m;var imgSrc=path.replace("_m",flickrImageSizes[sizeIndex].letter);var tempImg=$("<img />").attr("src",imgSrc);tempImg.load(function(){if(this.height<el.data("scrollableAreaHeight")){if((sizeIndex+1)<flickrImageSizes.length){loadFlickrImage(item,sizeIndex+1)}else{addImageToLoadedImages(this)}}else{addImageToLoadedImages(this)}if(loadedFlickrImagesCounter===numberOfFlickrItems){switch(manipulationMethod){case"addFirst":el.data("scrollableArea").children(":first").before(loadedFlickrImages);break;case"addLast":el.data("scrollableArea").children(":last").after(loadedFlickrImages);break;default:el.data("scrollableArea").html(loadedFlickrImages);break}self.recalculateScrollableArea();self._showHideHotSpots();self._trigger("addedFlickrContent",null,{"addedElementIds":imageIdStringBuffer})}})}function addImageToLoadedImages(imageObj){var widthScalingFactor=el.data("scrollableAreaHeight")/imageObj.height;var tempWidth=Math.round(imageObj.width*widthScalingFactor);var tempIdArr=$(imageObj).attr("src").split("/");var lastElemIndex=(tempIdArr.length-1);tempIdArr=tempIdArr[lastElemIndex].split(".");$(imageObj).attr("id",tempIdArr[0]);$(imageObj).css({"height":el.data("scrollableAreaHeight"),"width":tempWidth});imageIdStringBuffer.push(tempIdArr[0]);loadedFlickrImages.push(imageObj);loadedFlickrImagesCounter++}})},getAjaxContent:function(content,manipulationMethod,filterTag){var self=this,el=this.element;$.ajaxSetup({cache:false});$.get(content,function(data){var filteredContent;if(filterTag!==undefined){if(filterTag.length>0){filteredContent=$("<div>").html(data).find(filterTag)}else{filteredContent=content}}else{filteredContent=data}switch(manipulationMethod){case"addFirst":el.data("scrollableArea").children(":first").before(filteredContent);break;case"addLast":el.data("scrollableArea").children(":last").after(filteredContent);break;default:el.data("scrollableArea").html(filteredContent);break}self.recalculateScrollableArea();self._showHideHotSpots();self._trigger("addedAjaxContent")})},getHtmlContent:function(content,manipulationMethod,filterTag){var self=this,el=this.element;var filteredContent;if(filterTag!==undefined){if(filterTag.length>0){filteredContent=$("<div>").html(content).find(filterTag)}else{filteredContent=content}}else{filteredContent=content}switch(manipulationMethod){case"addFirst":el.data("scrollableArea").children(":first").before(filteredContent);break;case"addLast":el.data("scrollableArea").children(":last").after(filteredContent);break;default:el.data("scrollableArea").html(filteredContent);break}self.recalculateScrollableArea();self._showHideHotSpots();self._trigger("addedHtmlContent")},recalculateScrollableArea:function(){var tempScrollableAreaWidth=0,foundStartAtElement=false,o=this.options,el=this.element;el.data("scrollableArea").children(o.countOnlyClass).each(function(){if((o.startAtElementId.length>0)&&(($(this).attr("id"))===o.startAtElementId)){el.data("startingPosition",tempScrollableAreaWidth);foundStartAtElement=true}tempScrollableAreaWidth=tempScrollableAreaWidth+$(this).outerWidth(true)});if(!(foundStartAtElement)){el.data("startAtElementId","")}el.data("scrollableAreaWidth",tempScrollableAreaWidth);el.data("scrollableArea").width(el.data("scrollableAreaWidth"));el.data("scrollWrapper").scrollLeft(el.data("startingPosition"));el.data("scrollXPos",el.data("startingPosition"))},getScrollerOffset:function(){var el=this.element;return el.data("scrollWrapper").scrollLeft()},stopAutoScrolling:function(){var self=this,el=this.element;if(el.data("autoScrollingInterval")!==null){clearInterval(el.data("autoScrollingInterval"));el.data("autoScrollingInterval",null);self._showHideHotSpots();self._trigger("autoScrollingStopped")}},startAutoScrolling:function(){var self=this,el=this.element,o=this.options;if(el.data("enabled")){self._showHideHotSpots();clearInterval(el.data("autoScrollingInterval"));el.data("autoScrollingInterval",null);self._trigger("autoScrollingStarted");el.data("autoScrollingInterval",setInterval(function(){if(!(el.data("visible"))||(el.data("scrollableAreaWidth")<=(el.data("scrollWrapper").innerWidth()))){clearInterval(el.data("autoScrollingInterval"));el.data("autoScrollingInterval",null)}else{el.data("previousScrollLeft",el.data("scrollWrapper").scrollLeft());switch(o.autoScrollingDirection){case"right":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+o.autoScrollingStep);if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){self._trigger("autoScrollingRightLimitReached");clearInterval(el.data("autoScrollingInterval"));el.data("autoScrollingInterval",null);self._trigger("autoScrollingIntervalStopped")}break;case"left":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-o.autoScrollingStep);if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){self._trigger("autoScrollingLeftLimitReached");clearInterval(el.data("autoScrollingInterval"));el.data("autoScrollingInterval",null);self._trigger("autoScrollingIntervalStopped")}break;case"backAndForth":if(el.data("pingPongDirection")==="right"){el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+(o.autoScrollingStep))}else{el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-(o.autoScrollingStep))}if(el.data("previousScrollLeft")===el.data("scrollWrapper").scrollLeft()){if(el.data("pingPongDirection")==="right"){el.data("pingPongDirection","left");self._trigger("autoScrollingRightLimitReached")}else{el.data("pingPongDirection","right");self._trigger("autoScrollingLeftLimitReached")}}break;case"endlessLoopRight":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+o.autoScrollingStep);self._checkContinuousSwapRight();break;case"endlessLoopLeft":el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()-o.autoScrollingStep);self._checkContinuousSwapLeft();break;default:break}}},o.autoScrollingInterval))}},_checkContinuousSwapRight:function(){var el=this.element,o=this.options;if(el.data("getNextElementWidth")){if((o.startAtElementId.length>0)&&(el.data("startAtElementHasNotPassed"))){el.data("swapAt",$("#"+o.startAtElementId).outerWidth(true));el.data("startAtElementHasNotPassed",false)}else{el.data("swapAt",el.data("scrollableArea").children(":first").outerWidth(true))}el.data("getNextElementWidth",false)}if(el.data("swapAt")<=el.data("scrollWrapper").scrollLeft()){el.data("swappedElement",el.data("scrollableArea").children(":first").detach());el.data("scrollableArea").append(el.data("swappedElement"));var wrapperLeft=el.data("scrollWrapper").scrollLeft();el.data("scrollWrapper").scrollLeft(wrapperLeft-el.data("swappedElement").outerWidth(true));el.data("getNextElementWidth",true)}},_checkContinuousSwapLeft:function(){var el=this.element,o=this.options;if(el.data("getNextElementWidth")){if((o.startAtElementId.length>0)&&(el.data("startAtElementHasNotPassed"))){el.data("swapAt",$("#"+o.startAtElementId).outerWidth(true));el.data("startAtElementHasNotPassed",false)}else{el.data("swapAt",el.data("scrollableArea").children(":first").outerWidth(true))}el.data("getNextElementWidth",false)}if(el.data("scrollWrapper").scrollLeft()===0){el.data("swappedElement",el.data("scrollableArea").children(":last").detach());el.data("scrollableArea").prepend(el.data("swappedElement"));el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft()+el.data("swappedElement").outerWidth(true));el.data("getNextElementWidth",true)}},restoreOriginalElements:function(){var self=this,el=this.element;el.data("scrollableArea").html(el.data("originalElements"));self.recalculateScrollableArea();self.jumpToElement("first")},show:function(){var el=this.element;el.data("visible",true);el.show()},hide:function(){var el=this.element;el.data("visible",false);el.hide()},enable:function(){var el=this.element;if(this.options.touchScrolling){el.data("scrollWrapper").kinetic('attach')}el.data("enabled",true)},disable:function(){var self=this,el=this.element;self.stopAutoScrolling();clearInterval(el.data("rightScrollingInterval"));clearInterval(el.data("leftScrollingInterval"));clearInterval(el.data("hideHotSpotBackgroundsInterval"));if(this.options.touchScrolling){el.data("scrollWrapper").kinetic('detach')}el.data("enabled",false)},destroy:function(){var self=this,el=this.element;self.stopAutoScrolling();clearInterval(el.data("rightScrollingInterval"));clearInterval(el.data("leftScrollingInterval"));clearInterval(el.data("hideHotSpotBackgroundsInterval"));el.data("scrollingHotSpotRight").unbind("mouseover");el.data("scrollingHotSpotRight").unbind("mouseout");el.data("scrollingHotSpotRight").unbind("mousedown");el.data("scrollingHotSpotLeft").unbind("mouseover");el.data("scrollingHotSpotLeft").unbind("mouseout");el.data("scrollingHotSpotLeft").unbind("mousedown");el.unbind("mousenter");el.unbind("mouseleave");el.data("scrollingHotSpotRight").remove();el.data("scrollingHotSpotLeft").remove();el.data("scrollableArea").remove();el.data("scrollWrapper").remove();el.html(el.data("originalElements"));$.Widget.prototype.destroy.apply(this,arguments)}})})(jQuery);


/* ************************************	*/
/* jQuery Mousewheel v3.0.6	 	*/
/* ************************************	*/

(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery)


/* ************************************	*/
/* jQuery Kinetic v2.0.1	 	*/
/* ************************************	*/

!function(a){"use strict";var b="kinetic-active";window.requestAnimationFrame||(window.requestAnimationFrame=function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}()),a.support=a.support||{},a.extend(a.support,{touch:"ontouchend"in document});var c=function(){return!1},d=function(b,c){return this.settings=c,this.el=b,this.$el=a(b),this._initElements(),this};d.DATA_KEY="kinetic",d.DEFAULTS={cursor:"move",decelerate:!0,triggerHardware:!1,y:!0,x:!0,slowdown:.9,maxvelocity:40,throttleFPS:60,movingClass:{up:"kinetic-moving-up",down:"kinetic-moving-down",left:"kinetic-moving-left",right:"kinetic-moving-right"},deceleratingClass:{up:"kinetic-decelerating-up",down:"kinetic-decelerating-down",left:"kinetic-decelerating-left",right:"kinetic-decelerating-right"}},d.prototype.start=function(b){this.settings=a.extend(this.settings,b),this.velocity=b.velocity||this.velocity,this.velocityY=b.velocityY||this.velocityY,this.settings.decelerate=!1,this._move()},d.prototype.end=function(){this.settings.decelerate=!0},d.prototype.stop=function(){this.velocity=0,this.velocityY=0,this.settings.decelerate=!0,a.isFunction(this.settings.stopped)&&this.settings.stopped.call(this)},d.prototype.detach=function(){this._detachListeners(),this.$el.removeClass(b).css("cursor","")},d.prototype.attach=function(){this.$el.hasClass(b)||(this._attachListeners(this.$el),this.$el.addClass(b).css("cursor",this.settings.cursor))},d.prototype._initElements=function(){this.$el.addClass(b),a.extend(this,{xpos:null,prevXPos:!1,ypos:null,prevYPos:!1,mouseDown:!1,throttleTimeout:1e3/this.settings.throttleFPS,lastMove:null,elementFocused:null}),this.velocity=0,this.velocityY=0,a(document).mouseup(a.proxy(this._resetMouse,this)).click(a.proxy(this._resetMouse,this)),this._initEvents(),this.$el.css("cursor",this.settings.cursor),this.settings.triggerHardware&&this.$el.css({"-webkit-transform":"translate3d(0,0,0)","-webkit-perspective":"1000","-webkit-backface-visibility":"hidden"})},d.prototype._initEvents=function(){var b=this;this.settings.events={touchStart:function(a){var c;b._useTarget(a.target)&&(c=a.originalEvent.touches[0],b._start(c.clientX,c.clientY),a.stopPropagation())},touchMove:function(a){var c;b.mouseDown&&(c=a.originalEvent.touches[0],b._inputmove(c.clientX,c.clientY),a.preventDefault&&a.preventDefault())},inputDown:function(a){b._useTarget(a.target)&&(b._start(a.clientX,a.clientY),b.elementFocused=a.target,"IMG"===a.target.nodeName&&a.preventDefault(),a.stopPropagation())},inputEnd:function(a){b._useTarget(a.target)&&(b._end(),b.elementFocused=null,a.preventDefault&&a.preventDefault())},inputMove:function(a){b.mouseDown&&(b._inputmove(a.clientX,a.clientY),a.preventDefault&&a.preventDefault())},scroll:function(c){a.isFunction(b.settings.moved)&&b.settings.moved.call(b,b.settings),c.preventDefault&&c.preventDefault()},inputClick:function(a){return Math.abs(b.velocity)>0?(a.preventDefault(),!1):void 0},dragStart:function(){return b.elementFocused?!1:void 0}},this._attachListeners(this.$el,this.settings)},d.prototype._inputmove=function(b,c){{var d=this.$el;this.el}if((!this.lastMove||new Date>new Date(this.lastMove.getTime()+this.throttleTimeout))&&(this.lastMove=new Date,this.mouseDown&&(this.xpos||this.ypos))){this.elementFocused&&(a(this.elementFocused).blur(),this.elementFocused=null,d.focus()),this.settings.decelerate=!1,this.velocity=this.velocityY=0;var e=this.scrollLeft(),f=this.scrollTop(),g=b-this.xpos,h=c-this.ypos;this.scrollLeft(this.settings.x?e-g:e),this.scrollTop(this.settings.y?f-h:f),this.prevXPos=this.xpos,this.prevYPos=this.ypos,this.xpos=b,this.ypos=c,this._calculateVelocities(),this._setMoveClasses(this.settings.movingClass),a.isFunction(this.settings.moved)&&this.settings.moved.call(d,this.settings)}},d.prototype._calculateVelocities=function(){this.velocity=this._capVelocity(this.prevXPos-this.xpos,this.settings.maxvelocity),this.velocityY=this._capVelocity(this.prevYPos-this.ypos,this.settings.maxvelocity)},d.prototype._end=function(){this.xpos&&this.prevXPos&&this.settings.decelerate===!1&&(this.settings.decelerate=!0,this._calculateVelocities(),this.xpos=this.prevXPos=this.mouseDown=!1,this._move())},d.prototype._useTarget=function(b){return a.isFunction(this.settings.filterTarget)?this.settings.filterTarget.call(this,b)!==!1:!0},d.prototype._start=function(a,b){this.mouseDown=!0,this.velocity=this.prevXPos=0,this.velocityY=this.prevYPos=0,this.xpos=a,this.ypos=b},d.prototype._resetMouse=function(){this.xpos=!1,this.ypos=!1,this.mouseDown=!1},d.prototype._decelerateVelocity=function(a,b){return 0===Math.floor(Math.abs(a))?0:a*b},d.prototype._capVelocity=function(a,b){var c=a;return a>0?a>b&&(c=b):0-b>a&&(c=0-b),c},d.prototype._setMoveClasses=function(a){var b=this.settings,c=this.$el;c.removeClass(b.movingClass.up).removeClass(b.movingClass.down).removeClass(b.movingClass.left).removeClass(b.movingClass.right).removeClass(b.deceleratingClass.up).removeClass(b.deceleratingClass.down).removeClass(b.deceleratingClass.left).removeClass(b.deceleratingClass.right),this.velocity>0&&c.addClass(a.right),this.velocity<0&&c.addClass(a.left),this.velocityY>0&&c.addClass(a.down),this.velocityY<0&&c.addClass(a.up)},d.prototype._move=function(){var b=(this.$el,this.el),c=this,d=c.settings;d.x&&b.scrollWidth>0?(this.scrollLeft(this.scrollLeft()+this.velocity),Math.abs(this.velocity)>0&&(this.velocity=d.decelerate?c._decelerateVelocity(this.velocity,d.slowdown):this.velocity)):this.velocity=0,d.y&&b.scrollHeight>0?(this.scrollTop(this.scrollTop()+this.velocityY),Math.abs(this.velocityY)>0&&(this.velocityY=d.decelerate?c._decelerateVelocity(this.velocityY,d.slowdown):this.velocityY)):this.velocityY=0,c._setMoveClasses(d.deceleratingClass),a.isFunction(d.moved)&&d.moved.call(this,d),Math.abs(this.velocity)>0||Math.abs(this.velocityY)>0?this.moving||(this.moving=!0,window.requestAnimationFrame(function(){c.moving=!1,c._move()})):c.stop()},d.prototype._getScroller=function(){var b=this.$el;return(this.$el.is("body")||this.$el.is("html"))&&(b=a(window)),b},d.prototype.scrollLeft=function(a){var b=this._getScroller();return"number"!=typeof a?b.scrollLeft():(b.scrollLeft(a),void(this.settings.scrollLeft=a))},d.prototype.scrollTop=function(a){var b=this._getScroller();return"number"!=typeof a?b.scrollTop():(b.scrollTop(a),void(this.settings.scrollTop=a))},d.prototype._attachListeners=function(){var b=this.$el,d=this.settings;a.support.touch?b.bind("touchstart",d.events.touchStart).bind("touchend",d.events.inputEnd).bind("touchmove",d.events.touchMove):b.mousedown(d.events.inputDown).mouseup(d.events.inputEnd).mousemove(d.events.inputMove),b.click(d.events.inputClick).scroll(d.events.scroll).bind("selectstart",c).bind("dragstart",d.events.dragStart)},d.prototype._detachListeners=function(){var b=this.$el,d=this.settings;a.support.touch?b.unbind("touchstart",d.events.touchStart).unbind("touchend",d.events.inputEnd).unbind("touchmove",d.events.touchMove):b.unbind("mousedown",d.events.inputDown).unbind("mouseup",d.events.inputEnd).unbind("mousemove",d.events.inputMove).unbind("scroll",d.events.scroll),b.unbind("click",d.events.inputClick).unbind("selectstart",c).unbind("dragstart",d.events.dragStart)},a.Kinetic=d,a.fn.kinetic=function(b,c){return this.each(function(){var e=a(this),f=e.data(d.DATA_KEY),g=a.extend({},d.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data(d.DATA_KEY,f=new d(this,g)),"string"==typeof b&&f[b](c)})}}(window.jQuery||window.Zepto);

/* ************************************	*/
/* jQuery jcanvas v14.08.16	 	*/
/* ************************************	*/

(function(g,va,wa,Sa,ca,$,p,w,h,r){function G(d){for(var c in d)d.hasOwnProperty(c)&&(this[c]=d[c]);return this}function ma(){Y(this,ma.baseDefaults)}function ia(d){return"string"===Z(d)}function K(d){return d&&d.getContext?d.getContext("2d"):h}function ja(d){var c,a,b;for(c in d)d.hasOwnProperty(c)&&(b=d[c],a=Z(b),"string"!==a||""===b||isNaN(b)||(d[c]=$(b)));d.text=String(d.text)}function ka(d){d=Y({},d);d.masks=d.masks.slice(0);return d}function ea(d,c){var a;d.save();a=ka(c.transforms);c.savedTransforms.push(a)}
function xa(d,c,a,b){a[b]&&(da(a[b])?c[b]=a[b].call(d,a):c[b]=a[b])}function R(d,c,a){xa(d,c,a,"fillStyle");xa(d,c,a,"strokeStyle");c.lineWidth=a.strokeWidth;a.rounded?c.lineCap=c.lineJoin="round":(c.lineCap=a.strokeCap,c.lineJoin=a.strokeJoin,c.miterLimit=a.miterLimit);a.strokeDash||(a.strokeDash=[]);c.setLineDash&&c.setLineDash(a.strokeDash);c.webkitLineDash=c.mozDash=a.strokeDash;c.lineDashOffset=c.webkitLineDashOffset=c.mozDashOffset=a.strokeDashOffset;c.shadowOffsetX=a.shadowX;c.shadowOffsetY=
a.shadowY;c.shadowBlur=a.shadowBlur;c.shadowColor=a.shadowColor;c.globalAlpha=a.opacity;c.globalCompositeOperation=a.compositing;a.imageSmoothing&&(c.webkitImageSmoothingEnabled=c.mozImageSmoothingEnabled=a.imageSmoothing)}function ya(d,c,a){a.mask&&(a.autosave&&ea(d,c),d.clip(),c.transforms.masks.push(a._args))}function U(d,c,a){a.closed&&c.closePath();a.shadowStroke&&0!==a.strokeWidth?(c.stroke(),c.fill(),c.shadowColor="transparent",c.shadowBlur=0,c.stroke()):(c.fill(),"transparent"!==a.fillStyle&&
(c.shadowColor="transparent"),0!==a.strokeWidth&&c.stroke());a.closed||c.closePath();a._transformed&&c.restore();a.mask&&(d=E(d),ya(c,d,a))}function Q(d,c,a,b,f){a._toRad=a.inDegrees?D/180:1;a._transformed=p;c.save();a.fromCenter||a._centered||b===r||(f===r&&(f=b),a.x+=b/2,a.y+=f/2,a._centered=p);a.rotate&&za(c,a,h);1===a.scale&&1===a.scaleX&&1===a.scaleY||Aa(c,a,h);(a.translate||a.translateX||a.translateY)&&Ba(c,a,h)}function E(d){var c=aa.dataCache,a;c._canvas===d&&c._data?a=c._data:(a=g.data(d,
"jCanvas"),a||(a={canvas:d,layers:[],layer:{names:{},groups:{}},eventHooks:{},intersecting:[],lastIntersected:h,cursor:g(d).css("cursor"),drag:{layer:h,dragging:w},event:{type:h,x:h,y:h},events:{},transforms:ka(na),savedTransforms:[],animating:w,animated:h,pixelRatio:1,scaled:w},g.data(d,"jCanvas",a)),c._canvas=d,c._data=a);return a}function Ca(d,c,a){for(var b in W.events)W.events.hasOwnProperty(b)&&(a[b]||a.cursors&&a.cursors[b])&&Da(d,c,a,b)}function Da(d,c,a,b){W.events[b](d,c);a._event=p}function Ea(d,
c,a){var b,f,e;if(a.draggable||a.cursors){b=["mousedown","mousemove","mouseup"];for(e=0;e<b.length;e+=1)f=b[e],Da(d,c,a,f);c.events.mouseoutdrag||(d.bind("mouseout.jCanvas",function(){var a=c.drag.layer;a&&(c.drag={},O(d,c,a,"dragcancel"),d.drawLayers())}),c.events.mouseoutdrag=p);a._event=p}}function oa(d,c,a,b){d=c.layer.names;b?b.name!==r&&ia(a.name)&&a.name!==b.name&&delete d[a.name]:b=a;ia(b.name)&&(d[b.name]=a)}function pa(d,c,a,b){d=c.layer.groups;var f,e,k,g;if(!b)b=a;else if(b.groups!==r&&
a.groups!==h)for(e=0;e<a.groups.length;e+=1)if(f=a.groups[e],c=d[f]){for(g=0;g<c.length;g+=1)if(c[g]===a){k=g;c.splice(g,1);break}0===c.length&&delete d[f]}if(b.groups!==r&&b.groups!==h)for(e=0;e<b.groups.length;e+=1)f=b.groups[e],c=d[f],c||(c=d[f]=[],c.name=f),k===r&&(k=c.length),c.splice(k,0,a)}function qa(d,c,a,b,f){b[a]&&c._running&&!c._running[a]&&(c._running[a]=p,b[a].call(d[0],c,f),c._running[a]=w)}function O(d,c,a,b,f){if(!(a.disableEvents||a.intangible&&-1!==g.inArray(b,Ua))){if("mouseout"!==
b){var e;a.cursors&&(e=a.cursors[b]);-1!==g.inArray(e,T.cursors)&&(e=T.prefix+e);e&&d.css({cursor:e})}qa(d,a,b,a,f);qa(d,a,b,c.eventHooks,f);qa(d,a,b,W.eventHooks,f)}}function N(d,c,a,b){var f,e=c._layer?a:c;c._args=a;if(c.draggable||c.dragGroups)c.layer=p,c.draggable=p;c._method=b?b:c.method?g.fn[c.method]:c.type?g.fn[V.drawings[c.type]]:function(){};if(c.layer&&!c._layer){if(a=g(d),b=E(d),f=b.layers,e.name===h||ia(e.name)&&b.layer.names[e.name]===r)ja(c),e=new G(c),e.canvas=d,e.layer=p,e._layer=
p,e._running={},e.data=e.data!==h?Y({},e.data):{},e.groups=e.groups!==h?e.groups.slice(0):[],oa(a,b,e),pa(a,b,e),Ca(a,b,e),Ea(a,b,e),c._event=e._event,e._method===g.fn.drawText&&a.measureText(e),e.index===h&&(e.index=f.length),f.splice(e.index,0,e),c._args=e,O(a,b,e,"add")}else c.layer||ja(c);return e}function Fa(d,c){var a,b;for(b=0;b<T.props.length;b+=1)a=T.props[b],d[a]!==r&&(d["_"+a]=d[a],T.propsObj[a]=p,c&&delete d[a])}function Va(d,c,a){var b,f,e,k;for(b in a)if(a.hasOwnProperty(b)&&(f=a[b],
da(f)&&(a[b]=f.call(d,c,b)),"object"===Z(f)&&Ga(f))){for(e in f)f.hasOwnProperty(e)&&(k=f[e],c[b]!==r&&(c[b+"."+e]=c[b][e],a[b+"."+e]=k));delete a[b]}return a}function Ha(d){var c,a,b=[],f=1;d.match(/^([a-z]+|#[0-9a-f]+)$/gi)&&("transparent"===d&&(d="rgba(0, 0, 0, 0)"),a=va.head,c=a.style.color,a.style.color=d,d=g.css(a,"color"),a.style.color=c);d.match(/^rgb/gi)&&(b=d.match(/(\d+(\.\d+)?)/gi),d.match(/%/gi)&&(f=2.55),b[0]*=f,b[1]*=f,b[2]*=f,b[3]=b[3]!==r?$(b[3]):1);return b}function Wa(d){var c=
3,a;"array"!==Z(d.start)&&(d.start=Ha(d.start),d.end=Ha(d.end));d.now=[];if(1!==d.start[3]||1!==d.end[3])c=4;for(a=0;a<c;a+=1)d.now[a]=d.start[a]+(d.end[a]-d.start[a])*d.pos,3>a&&(d.now[a]=Xa(d.now[a]));1!==d.start[3]||1!==d.end[3]?d.now="rgba( "+d.now.join(",")+" )":(d.now.slice(0,3),d.now="rgb( "+d.now.join(",")+" )");d.elem.nodeName?d.elem.style[d.prop]=d.now:d.elem[d.prop]=d.now}function Ya(d){V.touchEvents[d]&&(d=V.touchEvents[d]);return d}function Za(d){W.events[d]=function(c,a){function b(a){k.x=
a.offsetX;k.y=a.offsetY;k.type=f;k.event=a;c.drawLayers({resetFire:p});a.preventDefault()}var f,e,k;k=a.event;f="mouseover"===d||"mouseout"===d?"mousemove":d;e=Ya(f);a.events[f]||(e!==f?c.bind(f+".jCanvas "+e+".jCanvas",b):c.bind(f+".jCanvas",b),a.events[f]=p)}}function S(d,c,a){var b,f,e,k;if(a=a._args)d=E(d),b=d.event,b.x!==h&&b.y!==h&&(e=b.x*d.pixelRatio,k=b.y*d.pixelRatio,f=c.isPointInPath(e,k)||c.isPointInStroke&&c.isPointInStroke(e,k)),c=d.transforms,a.eventX=b.x,a.eventY=b.y,a.event=b.event,
b=d.transforms.rotate,e=a.eventX,k=a.eventY,0!==b?(a._eventX=e*L(-b)-k*P(-b),a._eventY=k*L(-b)+e*P(-b)):(a._eventX=e,a._eventY=k),a._eventX/=c.scaleX,a._eventY/=c.scaleY,f&&d.intersecting.push(a),a.intersects=!!f}function za(d,c,a){c._toRad=c.inDegrees?D/180:1;d.translate(c.x,c.y);d.rotate(c.rotate*c._toRad);d.translate(-c.x,-c.y);a&&(a.rotate+=c.rotate*c._toRad)}function Aa(d,c,a){1!==c.scale&&(c.scaleX=c.scaleY=c.scale);d.translate(c.x,c.y);d.scale(c.scaleX,c.scaleY);d.translate(-c.x,-c.y);a&&(a.scaleX*=
c.scaleX,a.scaleY*=c.scaleY)}function Ba(d,c,a){c.translate&&(c.translateX=c.translateY=c.translate);d.translate(c.translateX,c.translateY);a&&(a.translateX+=c.translateX,a.translateY+=c.translateY)}function Ia(d){for(;0>d;)d+=2*D;return d}function Ja(d,c,a,b){var f,e,k,g,v,B,z;a===b?z=B=0:(B=a.x,z=a.y);b.inDegrees||360!==b.end||(b.end=2*D);b.start*=a._toRad;b.end*=a._toRad;b.start-=D/2;b.end-=D/2;v=D/180;b.ccw&&(v*=-1);f=b.x+b.radius*L(b.start+v);e=b.y+b.radius*P(b.start+v);k=b.x+b.radius*L(b.start);
g=b.y+b.radius*P(b.start);fa(d,c,a,b,f,e,k,g);c.arc(b.x+B,b.y+z,b.radius,b.start,b.end,b.ccw);f=b.x+b.radius*L(b.end+v);v=b.y+b.radius*P(b.end+v);e=b.x+b.radius*L(b.end);k=b.y+b.radius*P(b.end);ga(d,c,a,b,e,k,f,v)}function Ka(d,c,a,b,f,e,k,g){var v,B;b.arrowRadius&&!a.closed&&(B=$a(g-e,k-f),B-=D,d=a.strokeWidth*L(B),v=a.strokeWidth*P(B),a=k+b.arrowRadius*L(B+b.arrowAngle/2),f=g+b.arrowRadius*P(B+b.arrowAngle/2),e=k+b.arrowRadius*L(B-b.arrowAngle/2),b=g+b.arrowRadius*P(B-b.arrowAngle/2),c.moveTo(a-
d,f-v),c.lineTo(k-d,g-v),c.lineTo(e-d,b-v),c.moveTo(k-d,g-v),c.lineTo(k+d,g+v),c.moveTo(k,g))}function fa(d,c,a,b,f,e,k,g){b._arrowAngleConverted||(b.arrowAngle*=a._toRad,b._arrowAngleConverted=p);b.startArrow&&Ka(d,c,a,b,f,e,k,g)}function ga(d,c,a,b,f,e,k,g){b._arrowAngleConverted||(b.arrowAngle*=a._toRad,b._arrowAngleConverted=p);b.endArrow&&Ka(d,c,a,b,f,e,k,g)}function La(d,c,a,b){var f,e,k;f=2;fa(d,c,a,b,b.x2+a.x,b.y2+a.y,b.x1+a.x,b.y1+a.y);for(b.x1!==r&&b.y1!==r&&c.moveTo(b.x1+a.x,b.y1+a.y);p;)if(e=
b["x"+f],k=b["y"+f],e!==r&&k!==r)c.lineTo(e+a.x,k+a.y),f+=1;else break;f-=1;ga(d,c,a,b,b["x"+(f-1)]+a.x,b["y"+(f-1)]+a.y,b["x"+f]+a.x,b["y"+f]+a.y)}function Ma(d,c,a,b){var f,e,k,g,v;f=2;fa(d,c,a,b,b.cx1+a.x,b.cy1+a.y,b.x1+a.x,b.y1+a.y);for(b.x1!==r&&b.y1!==r&&c.moveTo(b.x1+a.x,b.y1+a.y);p;)if(e=b["x"+f],k=b["y"+f],g=b["cx"+(f-1)],v=b["cy"+(f-1)],e!==r&&k!==r&&g!==r&&v!==r)c.quadraticCurveTo(g+a.x,v+a.y,e+a.x,k+a.y),f+=1;else break;f-=1;ga(d,c,a,b,b["cx"+(f-1)]+a.x,b["cy"+(f-1)]+a.y,b["x"+f]+a.x,
b["y"+f]+a.y)}function Na(d,c,a,b){var f,e,k,g,v,B,z,h;f=2;e=1;fa(d,c,a,b,b.cx1+a.x,b.cy1+a.y,b.x1+a.x,b.y1+a.y);for(b.x1!==r&&b.y1!==r&&c.moveTo(b.x1+a.x,b.y1+a.y);p;)if(k=b["x"+f],g=b["y"+f],v=b["cx"+e],B=b["cy"+e],z=b["cx"+(e+1)],h=b["cy"+(e+1)],k!==r&&g!==r&&v!==r&&B!==r&&z!==r&&h!==r)c.bezierCurveTo(v+a.x,B+a.y,z+a.x,h+a.y,k+a.x,g+a.y),f+=1,e+=2;else break;f-=1;e-=2;ga(d,c,a,b,b["cx"+(e+1)]+a.x,b["cy"+(e+1)]+a.y,b["x"+f]+a.x,b["y"+f]+a.y)}function Oa(d,c,a){c*=d._toRad;c-=D/2;return a*L(c)}function Pa(d,
c,a){c*=d._toRad;c-=D/2;return a*P(c)}function Qa(d,c,a,b){var f,e,k,g,v,h,z;a===b?v=g=0:(g=a.x,v=a.y);f=1;e=g=h=b.x+g;k=v=z=b.y+v;fa(d,c,a,b,e+Oa(a,b.a1,b.l1),k+Pa(a,b.a1,b.l1),e,k);for(b.x!==r&&b.y!==r&&c.moveTo(e,k);p;)if(e=b["a"+f],k=b["l"+f],e!==r&&k!==r)g=h,v=z,h+=Oa(a,e,k),z+=Pa(a,e,k),c.lineTo(h,z),f+=1;else break;ga(d,c,a,b,g,v,h,z)}function ra(d,c,a){isNaN(Number(a.fontSize))||(a.fontSize+="px");c.font=a.fontStyle+" "+a.fontSize+" "+a.fontFamily}function sa(d,c,a,b){var f,e;f=aa.propCache;
if(f.text===a.text&&f.fontStyle===a.fontStyle&&f.fontSize===a.fontSize&&f.fontFamily===a.fontFamily&&f.maxWidth===a.maxWidth&&f.lineHeight===a.lineHeight)a.width=f.width,a.height=f.height;else{a.width=c.measureText(b[0]).width;for(e=1;e<b.length;e+=1)f=c.measureText(b[e]).width,f>a.width&&(a.width=f);c=d.style.fontSize;d.style.fontSize=a.fontSize;a.height=$(g.css(d,"fontSize"))*b.length*a.lineHeight;d.style.fontSize=c}}function Ra(d,c){var a=c.maxWidth,b=c.text.split("\n"),f=[],e,k,g,v,h;for(g=0;g<
b.length;g+=1){v=b[g];h=v.split(" ");e=[];k="";if(1===h.length||d.measureText(v).width<a)e=[v];else{for(v=0;v<h.length;v+=1)d.measureText(k+h[v]).width>a&&(""!==k&&e.push(k),k=""),k+=h[v],v!==h.length-1&&(k+=" ");e.push(k)}f=f.concat(e.join("\n").replace(/( (\n))|( $)/gi,"$2").split("\n"))}return f}var la,Y=g.extend,ha=g.inArray,Z=g.type,da=g.isFunction,Ga=g.isPlainObject,D=ca.PI,Xa=ca.round,ab=ca.abs,P=ca.sin,L=ca.cos,$a=ca.atan2,ta=Sa.prototype.slice,bb=g.event.fix,V={},aa={dataCache:{},propCache:{},
imageCache:{}},na={rotate:0,scaleX:1,scaleY:1,translateX:0,translateY:0,masks:[]},T={},Ua="mousedown mousemove mouseup mouseover mouseout touchstart touchmove touchend".split(" "),W={events:{},eventHooks:{},future:{}};ma.baseDefaults={align:"center",arrowAngle:90,arrowRadius:0,autosave:p,baseline:"middle",bringToFront:w,ccw:w,closed:w,compositing:"source-over",concavity:0,cornerRadius:0,count:1,cropFromCenter:p,crossOrigin:"",cursors:h,disableEvents:w,draggable:w,dragGroups:h,groups:h,data:h,dx:h,
dy:h,end:360,eventX:h,eventY:h,fillStyle:"transparent",fontStyle:"normal",fontSize:"12pt",fontFamily:"sans-serif",fromCenter:p,height:h,imageSmoothing:p,inDegrees:p,intangible:w,index:h,letterSpacing:h,lineHeight:1,layer:w,mask:w,maxWidth:h,miterLimit:10,name:h,opacity:1,r1:h,r2:h,radius:0,repeat:"repeat",respectAlign:w,rotate:0,rounded:w,scale:1,scaleX:1,scaleY:1,shadowBlur:0,shadowColor:"transparent",shadowStroke:w,shadowX:0,shadowY:0,sHeight:h,sides:0,source:"",spread:0,start:0,strokeCap:"butt",
strokeDash:h,strokeDashOffset:0,strokeJoin:"miter",strokeStyle:"transparent",strokeWidth:1,sWidth:h,sx:h,sy:h,text:"",translate:0,translateX:0,translateY:0,type:h,visible:p,width:h,x:0,y:0};la=new ma;G.prototype=la;W.extend=function(d){d.name&&(d.props&&Y(la,d.props),g.fn[d.name]=function a(b){var f,e,k,g;for(e=0;e<this.length;e+=1)if(f=this[e],k=K(f))g=new G(b),N(f,g,b,a),R(f,k,g),d.fn.call(f,k,g);return this},d.type&&(V.drawings[d.type]=d.name));return g.fn[d.name]};g.fn.getEventHooks=function(){var d;
d={};0!==this.length&&(d=this[0],d=E(d),d=d.eventHooks);return d};g.fn.setEventHooks=function(d){var c,a;for(c=0;c<this.length;c+=1)g(this[c]),a=E(this[c]),Y(a.eventHooks,d);return this};g.fn.getLayers=function(d){var c,a,b,f,e=[];if(0!==this.length)if(c=this[0],a=E(c),a=a.layers,da(d))for(f=0;f<a.length;f+=1)b=a[f],d.call(c,b)&&e.push(b);else e=a;return e};g.fn.getLayer=function(d){var c,a,b,f;if(0!==this.length)if(c=this[0],a=E(c),c=a.layers,f=Z(d),d&&d.layer)b=d;else if("number"===f)0>d&&(d=c.length+
d),b=c[d];else if("regexp"===f)for(a=0;a<c.length;a+=1){if(ia(c[a].name)&&c[a].name.match(d)){b=c[a];break}}else b=a.layer.names[d];return b};g.fn.getLayerGroup=function(d){var c,a,b,f=Z(d);if(0!==this.length)if(c=this[0],"array"===f)b=d;else if("regexp"===f)for(a in c=E(c),c=c.layer.groups,c){if(a.match(d)){b=c[a];break}}else c=E(c),b=c.layer.groups[d];return b};g.fn.getLayerIndex=function(d){var c=this.getLayers();d=this.getLayer(d);return ha(d,c)};g.fn.setLayer=function(d,c){var a,b,f,e,k,h,v;
for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=E(this[b]),e=g(this[b]).getLayer(d)){oa(a,f,e,c);pa(a,f,e,c);ja(c);for(k in c)c.hasOwnProperty(k)&&(h=c[k],v=Z(h),"object"===v&&Ga(h)?(e[k]=Y({},h),ja(e[k])):"array"===v?e[k]=h.slice(0):"string"===v?0===h.indexOf("+=")?e[k]+=$(h.substr(2)):0===h.indexOf("-=")?e[k]-=$(h.substr(2)):isNaN(h)?e[k]=h:e[k]=$(h):e[k]=h);Ca(a,f,e);Ea(a,f,e);g.isEmptyObject(c)===w&&O(a,f,e,"change",c)}return this};g.fn.setLayers=function(d,c){var a,b,f,e;for(b=0;b<this.length;b+=
1)for(a=g(this[b]),f=a.getLayers(c),e=0;e<f.length;e+=1)a.setLayer(f[e],d);return this};g.fn.setLayerGroup=function(d,c){var a,b,f,e;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=a.getLayerGroup(d))for(e=0;e<f.length;e+=1)a.setLayer(f[e],c);return this};g.fn.moveLayer=function(d,c){var a,b,f,e,k;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=E(this[b]),e=f.layers,k=a.getLayer(d))k.index=ha(k,e),e.splice(k.index,1),e.splice(c,0,k),0>c&&(c=e.length+c),k.index=c,O(a,f,k,"move");return this};g.fn.removeLayer=
function(d){var c,a,b,f,e;for(a=0;a<this.length;a+=1)if(c=g(this[a]),b=E(this[a]),f=c.getLayers(),e=c.getLayer(d))e.index=ha(e,f),f.splice(e.index,1),oa(c,b,e,{name:h}),pa(c,b,e,{groups:h}),O(c,b,e,"remove");return this};g.fn.removeLayers=function(d){var c,a,b,f,e,k;for(a=0;a<this.length;a+=1){c=g(this[a]);b=E(this[a]);f=c.getLayers(d);for(k=0;k<f.length;k+=1)e=f[k],c.removeLayer(e),k-=1;b.layer.names={};b.layer.groups={}}return this};g.fn.removeLayerGroup=function(d){var c,a,b,f;if(d!==r)for(a=0;a<
this.length;a+=1)if(c=g(this[a]),E(this[a]),c.getLayers(),b=c.getLayerGroup(d))for(b=b.slice(0),f=0;f<b.length;f+=1)c.removeLayer(b[f]);return this};g.fn.addLayerToGroup=function(d,c){var a,b,f,e=[c];for(b=0;b<this.length;b+=1)a=g(this[b]),f=a.getLayer(d),f.groups&&(e=f.groups.slice(0),-1===ha(c,f.groups)&&e.push(c)),a.setLayer(f,{groups:e});return this};g.fn.removeLayerFromGroup=function(d,c){var a,b,f,e=[],k;for(b=0;b<this.length;b+=1)a=g(this[b]),f=a.getLayer(d),f.groups&&(k=ha(c,f.groups),-1!==
k&&(e=f.groups.slice(0),e.splice(k,1),a.setLayer(f,{groups:e})));return this};T.cursors=["grab","grabbing","zoom-in","zoom-out"];T.prefix=function(){var d=getComputedStyle(va.documentElement,"");return"-"+(ta.call(d).join("").match(/-(moz|webkit|ms)-/)||""===d.OLink&&["","o"])[1]+"-"}();g.fn.triggerLayerEvent=function(d,c){var a,b,f;for(b=0;b<this.length;b+=1)a=g(this[b]),f=E(this[b]),(d=a.getLayer(d))&&O(a,f,d,c);return this};g.fn.drawLayer=function(d){var c,a,b;for(c=0;c<this.length;c+=1)b=g(this[c]),
(a=K(this[c]))&&(a=b.getLayer(d))&&a.visible&&a._method&&(a._next=h,a._method.call(b,a));return this};g.fn.drawLayers=function(d){var c,a,b=d||{},f,e,k,r,v,B,z,J;(r=b.index)||(r=0);for(c=0;c<this.length;c+=1)if(d=g(this[c]),a=K(this[c])){v=E(this[c]);b.clear!==w&&d.clearCanvas();a=v.layers;for(k=r;k<a.length;k+=1)if(f=a[k],f.index=k,b.resetFire&&(f._fired=w),B=d,z=f,e=k+1,z&&z.visible&&z._method&&(z._next=e?e:h,z._method.call(B,z)),f._masks=v.transforms.masks.slice(0),f._method===g.fn.drawImage&&
f.visible){J=!0;break}if(J)break;f=v;var y=e=z=B=void 0;B=h;for(z=f.intersecting.length-1;0<=z;z-=1)if(B=f.intersecting[z],B._masks){for(y=B._masks.length-1;0<=y;y-=1)if(e=B._masks[y],!e.intersects){B.intersects=w;break}if(B.intersects&&!B.intangible)break}B&&B.intangible&&(B=h);f=B;B=v.event;z=B.type;if(v.drag.layer){e=d;var y=v,H=z,u=void 0,q=void 0,m=void 0,A=m=void 0,F=void 0,m=u=u=m=void 0,m=y.drag,A=(q=m.layer)&&q.dragGroups||[],u=y.layers;if("mousemove"===H||"touchmove"===H){if(m.dragging||
(m.dragging=p,q.dragging=p,q.bringToFront&&(u.splice(q.index,1),q.index=u.push(q)),q._startX=q.x,q._startY=q.y,q._endX=q._eventX,q._endY=q._eventY,O(e,y,q,"dragstart")),m.dragging)for(u=q._eventX-(q._endX-q._startX),m=q._eventY-(q._endY-q._startY),q.dx=u-q.x,q.dy=m-q.y,q.x=u,q.y=m,O(e,y,q,"drag"),u=0;u<A.length;u+=1)if(m=A[u],F=y.layer.groups[m],q.groups&&F)for(m=0;m<F.length;m+=1)F[m]!==q&&(F[m].x+=q.dx,F[m].y+=q.dy)}else if("mouseup"===H||"touchend"===H)m.dragging&&(q.dragging=w,m.dragging=w,O(e,
y,q,"dragstop")),y.drag={}}e=v.lastIntersected;e===h||f===e||!e._hovered||e._fired||v.drag.dragging||(v.lastIntersected=h,e._fired=p,e._hovered=w,O(d,v,e,"mouseout"),d.css({cursor:v.cursor}));f&&(f[z]||V.mouseEvents[z]&&(z=V.mouseEvents[z]),f._event&&f.intersects&&(v.lastIntersected=f,!(f.mouseover||f.mouseout||f.cursors)||v.drag.dragging||f._hovered||f._fired||(f._fired=p,f._hovered=p,O(d,v,f,"mouseover")),f._fired||(f._fired=p,B.type=h,O(d,v,f,z)),!f.draggable||f.disableEvents||"mousedown"!==z&&
"touchstart"!==z||(v.drag.layer=f)));f!==h||v.drag.dragging||d.css({cursor:v.cursor});k===a.length&&(v.intersecting.length=0,v.transforms=ka(na),v.savedTransforms.length=0)}return this};g.fn.addLayer=function(d){var c,a;for(c=0;c<this.length;c+=1)if(a=K(this[c]))a=new G(d),a.layer=p,N(this[c],a,d);return this};T.props=["width","height","opacity","lineHeight"];T.propsObj={};g.fn.animateLayer=function(){function d(a,b,c){return function(){var d,f;for(f=0;f<T.props.length;f+=1)d=T.props[f],c[d]=c["_"+
d];for(var k in c)c.hasOwnProperty(k)&&-1!==k.indexOf(".")&&delete c[k];b.animating&&b.animated!==c||a.drawLayers();c._animating=w;b.animating=w;b.animated=h;e[4]&&e[4].call(a[0],c);O(a,b,c,"animateend")}}function c(a,b,c){return function(d,f){var k,g,h=!1;"_"===f.prop[0]&&(h=!0,f.prop=f.prop.replace("_",""),c[f.prop]=c["_"+f.prop]);-1!==f.prop.indexOf(".")&&(k=f.prop.split("."),g=k[0],k=k[1],c[g]&&(c[g][k]=f.now));c._pos!==f.pos&&(c._pos=f.pos,c._animating||b.animating||(c._animating=p,b.animating=
p,b.animated=c),b.animating&&b.animated!==c||a.drawLayers());e[5]&&e[5].call(a[0],d,f,c);O(a,b,c,"animate",f);h&&(f.prop="_"+f.prop)}}var a,b,f,e=ta.call(arguments,0),k,G;"object"===Z(e[2])?(e.splice(2,0,e[2].duration||h),e.splice(3,0,e[3].easing||h),e.splice(4,0,e[4].complete||h),e.splice(5,0,e[5].step||h)):(e[2]===r?(e.splice(2,0,h),e.splice(3,0,h),e.splice(4,0,h)):da(e[2])&&(e.splice(2,0,h),e.splice(3,0,h)),e[3]===r?(e[3]=h,e.splice(4,0,h)):da(e[3])&&e.splice(3,0,h));for(b=0;b<this.length;b+=1)if(a=
g(this[b]),f=K(this[b]))f=E(this[b]),(k=a.getLayer(e[0]))&&k._method!==g.fn.draw&&(G=Y({},e[1]),G=Va(this[b],k,G),Fa(G,p),Fa(k),k.style=T.propsObj,g(k).animate(G,{duration:e[2],easing:g.easing[e[3]]?e[3]:h,complete:d(a,f,k),step:c(a,f,k)}),O(a,f,k,"animatestart"));return this};g.fn.animateLayerGroup=function(d){var c,a,b=ta.call(arguments,0),f,e;for(a=0;a<this.length;a+=1)if(c=g(this[a]),f=c.getLayerGroup(d))for(e=0;e<f.length;e+=1)b[0]=f[e],c.animateLayer.apply(c,b);return this};g.fn.delayLayer=
function(d,c){var a,b,f,e;c=c||0;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=E(this[b]),e=a.getLayer(d))g(e).delay(c),O(a,f,e,"delay");return this};g.fn.delayLayerGroup=function(d,c){var a,b,f,e,k;c=c||0;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=a.getLayerGroup(d))for(k=0;k<f.length;k+=1)e=f[k],a.delayLayer(e,c);return this};g.fn.stopLayer=function(d,c){var a,b,f,e;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=E(this[b]),e=a.getLayer(d))g(e).stop(c),O(a,f,e,"stop");return this};g.fn.stopLayerGroup=
function(d,c){var a,b,f,e,k;for(b=0;b<this.length;b+=1)if(a=g(this[b]),f=a.getLayerGroup(d))for(k=0;k<f.length;k+=1)e=f[k],a.stopLayer(e,c);return this};(function(d){var c;for(c=0;c<d.length;c+=1)g.fx.step[d[c]]=Wa})("color backgroundColor borderColor borderTopColor borderRightColor borderBottomColor borderLeftColor fillStyle outlineColor strokeStyle shadowColor".split(" "));V.touchEvents={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};V.mouseEvents={touchstart:"mousedown",touchend:"mouseup",
touchmove:"mousemove"};(function(d){var c;for(c=0;c<d.length;c+=1)Za(d[c])})("click dblclick mousedown mouseup mousemove mouseover mouseout touchstart touchmove touchend".split(" "));g.event.fix=function(d){var c,a;d=bb.call(g.event,d);if(c=d.originalEvent)if(a=c.changedTouches,d.pageX!==r&&d.offsetX===r){if(c=g(d.currentTarget).offset())d.offsetX=d.pageX-c.left,d.offsetY=d.pageY-c.top}else a&&(c=g(d.currentTarget).offset())&&(d.offsetX=a[0].pageX-c.left,d.offsetY=a[0].pageY-c.top);return d};V.drawings=
{arc:"drawArc",bezier:"drawBezier",ellipse:"drawEllipse","function":"draw",image:"drawImage",line:"drawLine",path:"drawPath",polygon:"drawPolygon",slice:"drawSlice",quadratic:"drawQuadratic",rectangle:"drawRect",text:"drawText",vector:"drawVector",save:"saveCanvas",restore:"restoreCanvas",rotate:"rotateCanvas",scale:"scaleCanvas",translate:"translateCanvas"};g.fn.draw=function c(a){var b,f,e=new G(a);if(V.drawings[e.type]&&"function"!==e.type)this[V.drawings[e.type]](a);else for(b=0;b<this.length;b+=
1)if(g(this[b]),f=K(this[b]))e=new G(a),N(this[b],e,a,c),e.visible&&e.fn&&e.fn.call(this[b],f,e);return this};g.fn.clearCanvas=function a(b){var f,e,k=new G(b);for(f=0;f<this.length;f+=1)if(e=K(this[f]))k.width===h||k.height===h?(e.save(),e.setTransform(1,0,0,1,0,0),e.clearRect(0,0,this[f].width,this[f].height),e.restore()):(N(this[f],k,b,a),Q(this[f],e,k,k.width,k.height),e.clearRect(k.x-k.width/2,k.y-k.height/2,k.width,k.height),k._transformed&&e.restore());return this};g.fn.saveCanvas=function b(f){var e,
k,g,h,B;for(e=0;e<this.length;e+=1)if(k=K(this[e]))for(h=E(this[e]),g=new G(f),N(this[e],g,f,b),B=0;B<g.count;B+=1)ea(k,h);return this};g.fn.restoreCanvas=function f(e){var k,g,h,B,z;for(k=0;k<this.length;k+=1)if(g=K(this[k]))for(B=E(this[k]),h=new G(e),N(this[k],h,e,f),z=0;z<h.count;z+=1){var J=g,y=B;0===y.savedTransforms.length?y.transforms=ka(na):(J.restore(),y.transforms=y.savedTransforms.pop())}return this};g.fn.rotateCanvas=function e(k){var g,h,B,z;for(g=0;g<this.length;g+=1)if(h=K(this[g]))z=
E(this[g]),B=new G(k),N(this[g],B,k,e),B.autosave&&ea(h,z),za(h,B,z.transforms);return this};g.fn.scaleCanvas=function k(g){var h,B,z,J;for(h=0;h<this.length;h+=1)if(B=K(this[h]))J=E(this[h]),z=new G(g),N(this[h],z,g,k),z.autosave&&ea(B,J),Aa(B,z,J.transforms);return this};g.fn.translateCanvas=function Ta(g){var h,z,J,y;for(h=0;h<this.length;h+=1)if(z=K(this[h]))y=E(this[h]),J=new G(g),N(this[h],J,g,Ta),J.autosave&&ea(z,y),Ba(z,J,y.transforms);return this};g.fn.drawRect=function v(g){var h,J,y,H,
u,q,m,A,F;for(h=0;h<this.length;h+=1)if(J=K(this[h]))y=new G(g),N(this[h],y,g,v),y.visible&&(R(this[h],J,y),Q(this[h],J,y,y.width,y.height),J.beginPath(),y.width&&y.height&&(H=y.x-y.width/2,u=y.y-y.height/2,(A=ab(y.cornerRadius))?(q=y.x+y.width/2,m=y.y+y.height/2,0>y.width&&(F=H,H=q,q=F),0>y.height&&(F=u,u=m,m=F),0>q-H-2*A&&(A=(q-H)/2),0>m-u-2*A&&(A=(m-u)/2),J.moveTo(H+A,u),J.lineTo(q-A,u),J.arc(q-A,u+A,A,3*D/2,2*D,w),J.lineTo(q,m-A),J.arc(q-A,m-A,A,0,D/2,w),J.lineTo(H+A,m),J.arc(H+A,m-A,A,D/2,D,
w),J.lineTo(H,u+A),J.arc(H+A,u+A,A,D,3*D/2,w),y.closed=p):J.rect(H,u,y.width,y.height)),S(this[h],J,y),U(this[h],J,y));return this};g.fn.drawArc=function B(g){var h,y,H;for(h=0;h<this.length;h+=1)if(y=K(this[h]))H=new G(g),N(this[h],H,g,B),H.visible&&(R(this[h],y,H),Q(this[h],y,H,2*H.radius),y.beginPath(),Ja(this[h],y,H,H),S(this[h],y,H),U(this[h],y,H));return this};g.fn.drawEllipse=function z(g){var h,H,u,q,m;for(h=0;h<this.length;h+=1)if(H=K(this[h]))u=new G(g),N(this[h],u,g,z),u.visible&&(R(this[h],
H,u),Q(this[h],H,u,u.width,u.height),q=4/3*u.width,m=u.height,H.beginPath(),H.moveTo(u.x,u.y-m/2),H.bezierCurveTo(u.x-q/2,u.y-m/2,u.x-q/2,u.y+m/2,u.x,u.y+m/2),H.bezierCurveTo(u.x+q/2,u.y+m/2,u.x+q/2,u.y-m/2,u.x,u.y-m/2),S(this[h],H,u),u.closed=p,U(this[h],H,u));return this};g.fn.drawPolygon=function J(g){var h,u,q,m,A,F,M,x,n,l;for(h=0;h<this.length;h+=1)if(u=K(this[h]))if(q=new G(g),N(this[h],q,g,J),q.visible){R(this[h],u,q);Q(this[h],u,q,2*q.radius);A=2*D/q.sides;F=A/2;m=F+D/2;M=q.radius*L(F);u.beginPath();
for(l=0;l<q.sides;l+=1)x=q.x+q.radius*L(m),n=q.y+q.radius*P(m),u.lineTo(x,n),q.concavity&&(x=q.x+(M+-M*q.concavity)*L(m+F),n=q.y+(M+-M*q.concavity)*P(m+F),u.lineTo(x,n)),m+=A;S(this[h],u,q);q.closed=p;U(this[h],u,q)}return this};g.fn.drawSlice=function y(h){var u,q,m,A,F;for(u=0;u<this.length;u+=1)if(g(this[u]),q=K(this[u]))m=new G(h),N(this[u],m,h,y),m.visible&&(R(this[u],q,m),Q(this[u],q,m,2*m.radius),m.start*=m._toRad,m.end*=m._toRad,m.start-=D/2,m.end-=D/2,m.start=Ia(m.start),m.end=Ia(m.end),
m.end<m.start&&(m.end+=2*D),A=(m.start+m.end)/2,F=m.radius*m.spread*L(A),A=m.radius*m.spread*P(A),m.x+=F,m.y+=A,q.beginPath(),q.arc(m.x,m.y,m.radius,m.start,m.end,m.ccw),q.lineTo(m.x,m.y),S(this[u],q,m),m.closed=p,U(this[u],q,m));return this};g.fn.drawLine=function H(h){var g,m,A;for(g=0;g<this.length;g+=1)if(m=K(this[g]))A=new G(h),N(this[g],A,h,H),A.visible&&(R(this[g],m,A),Q(this[g],m,A),m.beginPath(),La(this[g],m,A,A),S(this[g],m,A),U(this[g],m,A));return this};g.fn.drawQuadratic=function u(g){var h,
A,F;for(h=0;h<this.length;h+=1)if(A=K(this[h]))F=new G(g),N(this[h],F,g,u),F.visible&&(R(this[h],A,F),Q(this[h],A,F),A.beginPath(),Ma(this[h],A,F,F),S(this[h],A,F),U(this[h],A,F));return this};g.fn.drawBezier=function q(h){var g,F,M;for(g=0;g<this.length;g+=1)if(F=K(this[g]))M=new G(h),N(this[g],M,h,q),M.visible&&(R(this[g],F,M),Q(this[g],F,M),F.beginPath(),Na(this[g],F,M,M),S(this[g],F,M),U(this[g],F,M));return this};g.fn.drawVector=function m(g){var h,M,x;for(h=0;h<this.length;h+=1)if(M=K(this[h]))x=
new G(g),N(this[h],x,g,m),x.visible&&(R(this[h],M,x),Q(this[h],M,x),M.beginPath(),Qa(this[h],M,x,x),S(this[h],M,x),U(this[h],M,x));return this};g.fn.drawPath=function A(h){var g,x,n,l,C;for(g=0;g<this.length;g+=1)if(x=K(this[g]))if(n=new G(h),N(this[g],n,h,A),n.visible){R(this[g],x,n);Q(this[g],x,n);x.beginPath();for(l=1;p;)if(C=n["p"+l],C!==r)C=new G(C),"line"===C.type?La(this[g],x,n,C):"quadratic"===C.type?Ma(this[g],x,n,C):"bezier"===C.type?Na(this[g],x,n,C):"vector"===C.type?Qa(this[g],x,n,C):
"arc"===C.type&&Ja(this[g],x,n,C),l+=1;else break;S(this[g],x,n);U(this[g],x,n)}return this};g.fn.drawText=function F(M){var x,n,l,C,X,t,r,p,I,w;for(x=0;x<this.length;x+=1)if(g(this[x]),n=K(this[x]))if(l=new G(M),C=N(this[x],l,M,F),l.visible){R(this[x],n,l);n.textBaseline=l.baseline;n.textAlign=l.align;ra(this[x],n,l);X=l.maxWidth!==h?Ra(n,l):l.text.toString().split("\n");sa(this[x],n,l,X);C&&(C.width=l.width,C.height=l.height);Q(this[x],n,l,l.width,l.height);r=l.x;"left"===l.align?l.respectAlign?
l.x+=l.width/2:r-=l.width/2:"right"===l.align&&(l.respectAlign?l.x-=l.width/2:r+=l.width/2);if(l.radius)for(r=$(l.fontSize),l.letterSpacing===h&&(l.letterSpacing=r/500),t=0;t<X.length;t+=1){n.save();n.translate(l.x,l.y);C=X[t];p=C.length;n.rotate(-(D*l.letterSpacing*(p-1))/2);for(w=0;w<p;w+=1)I=C[w],0!==w&&n.rotate(D*l.letterSpacing),n.save(),n.translate(0,-l.radius),n.fillText(I,0,0),n.restore();l.radius-=r;l.letterSpacing+=r/(1E3*D);n.restore()}else for(t=0;t<X.length;t+=1)C=X[t],p=l.y+t*l.height/
X.length-(X.length-1)*l.height/X.length/2,n.shadowColor=l.shadowColor,n.fillText(C,r,p),"transparent"!==l.fillStyle&&(n.shadowColor="transparent"),0!==l.strokeWidth&&n.strokeText(C,r,p);p=0;"top"===l.baseline?p+=l.height/2:"bottom"===l.baseline&&(p-=l.height/2);l._event&&(n.beginPath(),n.rect(l.x-l.width/2,l.y-l.height/2+p,l.width,l.height),S(this[x],n,l),n.closePath());l._transformed&&n.restore()}aa.propCache=l;return this};g.fn.measureText=function(g){var h,x;h=this.getLayer(g);if(!h||h&&!h._layer)h=
new G(g);if(g=K(this[0]))ra(this[0],g,h),x=Ra(g,h),sa(this[0],g,h,x);return h};g.fn.drawImage=function M(x){function n(l,n,t,s,x){return function(){var C=g(l);R(l,n,s);s.width===h&&s.sWidth===h&&(s.width=s.sWidth=I.width);s.height===h&&s.sHeight===h&&(s.height=s.sHeight=I.height);x&&(x.width=s.width,x.height=s.height);s.sWidth!==h&&s.sHeight!==h&&s.sx!==h&&s.sy!==h?(s.width===h&&(s.width=s.sWidth),s.height===h&&(s.height=s.sHeight),s.cropFromCenter&&(s.sx+=s.sWidth/2,s.sy+=s.sHeight/2),0>s.sy-s.sHeight/
2&&(s.sy=s.sHeight/2),s.sy+s.sHeight/2>I.height&&(s.sy=I.height-s.sHeight/2),0>s.sx-s.sWidth/2&&(s.sx=s.sWidth/2),s.sx+s.sWidth/2>I.width&&(s.sx=I.width-s.sWidth/2),Q(l,n,s,s.width,s.height),n.drawImage(I,s.sx-s.sWidth/2,s.sy-s.sHeight/2,s.sWidth,s.sHeight,s.x-s.width/2,s.y-s.height/2,s.width,s.height)):(Q(l,n,s,s.width,s.height),n.drawImage(I,s.x-s.width/2,s.y-s.height/2,s.width,s.height));n.beginPath();n.rect(s.x-s.width/2,s.y-s.height/2,s.width,s.height);S(l,n,s);n.closePath();s._transformed&&
n.restore();ya(n,t,s);s.layer?O(C,t,x,"load"):s.load&&s.load.call(C[0],x);s.layer&&(x._masks=t.transforms.masks.slice(0),s._next&&C.drawLayers({clear:w,resetFire:p,index:s._next}))}}var l,C,r,t,ba,D,I,ua,L,P=aa.imageCache;for(C=0;C<this.length;C+=1)if(l=this[C],r=K(this[C]))t=E(this[C]),ba=new G(x),D=N(this[C],ba,x,M),ba.visible&&(L=ba.source,ua=L.getContext,L.src||ua?I=L:L&&(P[L]&&P[L].complete?I=P[L]:(I=new wa,L.match(/^data:/i)||(I.crossOrigin=ba.crossOrigin),I.src=L,P[L]=I)),I&&(I.complete||ua?
n(l,r,t,ba,D)():(I.onload=n(l,r,t,ba,D),I.src=I.src)));return this};g.fn.createPattern=function(r){function x(){t=l.createPattern(p,C.repeat);C.load&&C.load.call(n[0],t)}var n=this,l,C,p,t,w;(l=K(n[0]))?(C=new G(r),w=C.source,da(w)?(p=g("<canvas />")[0],p.width=C.width,p.height=C.height,r=K(p),w.call(p,r),x()):(r=w.getContext,w.src||r?p=w:(p=new wa,p.crossOrigin=C.crossOrigin,p.src=w),p.complete||r?x():(p.onload=x(),p.src=p.src))):t=h;return t};g.fn.createGradient=function(g){var x,n=[],l,p,w,t,D,
E,I;g=new G(g);if(x=K(this[0])){g.x1=g.x1||0;g.y1=g.y1||0;g.x2=g.x2||0;g.y2=g.y2||0;x=g.r1!==h&&g.r2!==h?x.createRadialGradient(g.x1,g.y1,g.r1,g.x2,g.y2,g.r2):x.createLinearGradient(g.x1,g.y1,g.x2,g.y2);for(t=1;g["c"+t]!==r;t+=1)g["s"+t]!==r?n.push(g["s"+t]):n.push(h);l=n.length;n[0]===h&&(n[0]=0);n[l-1]===h&&(n[l-1]=1);for(t=0;t<l;t+=1){if(n[t]!==h){E=1;I=0;p=n[t];for(D=t+1;D<l;D+=1)if(n[D]!==h){w=n[D];break}else E+=1;p>w&&(n[D]=n[t])}else n[t]===h&&(I+=1,n[t]=p+(w-p)/E*I);x.addColorStop(n[t],g["c"+
(t+1)])}}else x=h;return x};g.fn.setPixels=function x(g){var l,p,r,t,w,D,I,E,L;for(p=0;p<this.length;p+=1)if(l=this[p],r=K(l)){t=new G(g);N(l,t,g,x);Q(this[p],r,t,t.width,t.height);if(t.width===h||t.height===h)t.width=l.width,t.height=l.height,t.x=t.width/2,t.y=t.height/2;if(0!==t.width&&0!==t.height){D=r.getImageData(t.x-t.width/2,t.y-t.height/2,t.width,t.height);I=D.data;L=I.length;if(t.each)for(E=0;E<L;E+=4)w={r:I[E],g:I[E+1],b:I[E+2],a:I[E+3]},t.each.call(l,w,t),I[E]=w.r,I[E+1]=w.g,I[E+2]=w.b,
I[E+3]=w.a;r.putImageData(D,t.x-t.width/2,t.y-t.height/2);r.restore()}}return this};g.fn.getCanvasImage=function(g,n){var l,p=h;0!==this.length&&(l=this[0],l.toDataURL&&(n===r&&(n=1),p=l.toDataURL("image/"+g,n)));return p};g.fn.detectPixelRatio=function(h){var n,l,r,w,t,D,G;for(l=0;l<this.length;l+=1)n=this[l],g(this[l]),r=K(n),G=E(this[l]),G.scaled||(w=window.devicePixelRatio||1,t=r.webkitBackingStorePixelRatio||r.mozBackingStorePixelRatio||r.msBackingStorePixelRatio||r.oBackingStorePixelRatio||
r.backingStorePixelRatio||1,w/=t,1!==w&&(t=n.width,D=n.height,n.width=t*w,n.height=D*w,n.style.width=t+"px",n.style.height=D+"px",r.scale(w,w)),G.pixelRatio=w,G.scaled=p,h&&h.call(n,w));return this};W.clearCache=function(){for(var g in aa)aa.hasOwnProperty(g)&&(aa[g]={})};g.support.canvas=g("<canvas />")[0].getContext!==r;Y(W,{defaults:la,setGlobalProps:R,transformShape:Q,detectEvents:S,closePath:U,setCanvasFont:ra,measureText:sa});g.jCanvas=W;g.jCanvasObject=G})(jQuery,document,Image,Array,Math,
parseFloat,!0,!1,null);

/* ************************************	*/
/* Config                               */
/* ************************************	*/

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('8Z(8Y 3a==\'8X\'){3a=2n 2K()};3a.8W=1W;m=2n 2K();m.2R=\'4.0.1\';m.5l=2n 90().91();m.2u=3h.4d.2u==\'94:\'?\'1b:\':3h.4d.2u;m.4Z=m.2u==\'2w:\'?\'2w://1s.93.92/\':\'1b://1s.E/\';m.8V=\'\';m.8U=\'^3Z, ^3S, ^3R, ^3Q, ^3O\';m.8O=\'h, 3d, 2g\';m.8N=\'2Q\';m.8M=\'2T, 2X, 2Z, 2j, 2y\';m.37=1W;m.8L=8P;m.2F=2S;m.2I=2S;m.3f=8Q;m.2E=1W;m.8T=2S;m.8S=\'<a L="1b://1s.E/#2G=8R" 1q="1r">95 by 17.E</a>\';m.96=\'4W(0,0,0)\';m.9m=\'4W(2W,2W,2W)\';m.X=\'<b c="9l"><b c="9k">19 2Y 9j</b></b>\';m.2B=\'9n\';m.9o=\'<3G>\'+\'<3H 1T="9r" 9q="33 10 1h 13">\'+\'<2J 34="\'+m.4Z+\'1Q/5g.5i" 11="54" l="54" d="p:n; 1p:i A i i;" />\'+\'<b d="B-V:4a; W-H:9p; p:1g; 1p-1g:A;">\'+\'10 1h 13 (v\'+m.2R+\')<br/>\'+\'<b d="B-V:0.52;"><4L>&23;</4L></b>\'+\'17.E \'+m.5l+\'<br/>\'+\'9i : <a L="53:2U@1s.E?9h=10 9b 13" d="y-1o:X; 9a:#98;">2U@1s.E</a>\'+\'</b>\'+\'<t c="T"></t>\'+\'<9 c="1z" d="l:1O%; 11:97; W:i 9c i i; B-V:9d;">\'+\'<9 d="y-1f:5k; W:i A i A;">\'+\'<9 d="B-1j:1k; 1p:i i A i;">9g :</9>\'+\'<9 d="W:i A i A;">\'+\'3U 10 1h 13 9f 9e 8K 8J 1a D 8h 3M 8g 8f, 21 8e 3l, 8i 3l, 2j, 8j, 8m, 8l, u 8k 1n a 8d 8c 85 d 84.<br/><br/>\'+\'83 82 1S 3I 3c 86 4X 87 G 8b 1P 1m 2m 3b 8a 89 u 88 G K 1S 8n 2x 1a 8o! 8D\\\'s 1g 3X 8C 8B, 3X 8A 8E, 8F ... 8I 8H 8G 81 8y 1T, 8s, u 8r 1N 1m 1w 2G.<br/>\'+\'</9>\'+\'<t c="T"></t>\'+\'<9 d="B-1j:1k; 1p:i i A i;">8q :</9>\'+\'<9 d="W:i A i A;">\'+\'5z 5w 5x 5y M 5t, 17.E 5u 5p u 5q D G 5o 2e 1M 1a G 1F 1D 1B (21 1R 29 G y, 2a 5v, 55, 4v, 1Q, 4t, 2t 18, 4s 18 u 2t-4Y 18) u 1n G 4x 4q 4i. 4g 2e 1M 4k, 1R 29, 4m u 4B 1M 1n G 2M 4C u 2H 4O 4V 1G 4G 1V a 4F 4I by 17.E.<br/><br/>\'+\'17.E 4J 1N 24 a 4w 25-4D 4E-2x 4M 4U 1N 4o 18 1D 1B 2A a 2a M 4h 4r 4y a 1w 2b; 23 u 4A G 18 1D 1B 1n 1H 1w 2b 5A 5m; u 56 59 1V 3c 1P 1H 5a 5d u 25-5j 1Z.<br/>\'+\'</9>\'+\'<t c="T"></t>\'+\'<9 d="B-1j:1k; 1p:i i A i;">8p :</9>\'+\'<9 d="W:i A i A;">\'+\'3U 10 1h 13 1w 2G 1e by 17.E 3r 1Z 1a G 8t 2m 3b 44 :\'+\'<12 d="W-n:3m;">\'+\'<o><a L="1b://5e.8u.E/" 1q="1r" d="y-1o:X;">10 8x 1U 8w.3</a></o>\'+\'<o><a L="1b://8v.9s.E/" 1q="1r" d="y-1o:X;">10 9t ar aq 1U ap.2.3</a></o>\'+\'<o><a L="2w://ao.E/au/43-av" 1q="1r" d="y-1o:X;">10 ay 1U ax.0.6</a></o>\'+\'<o><a L="1b://aw.3n/43.an/" 1q="1r" d="y-1o:X;">10 am 1U ag.0.1</a></o>\'+\'<o><a L="1b://af.3n/ae/ad/" 1q="1r" d="y-1o:X;">10 ah 1U ai.al.16</a></o>\'+\'</12>\'+\'30 44 ak aj 1G az by aA aP aO u/M aN u 1G aM aQ aR M aU 1a G aT, aS, u aL-aK aE.\'+\'</9>\'+\'<t c="T"></t>\'+\'<9 d="B-1j:1k; 1p:i i A i;">3j & 2Y :</9>\'+\'<9 d="W:i A i A;">\'+\'30 4T &31; 4S K 1G 4P 2r 4Q <a L="1b://4n.4p.E/" 1q="1r" d="y-1o:X;">2m 4j</a> 1w 4z u 2O be 4u as 5n as 20 5r.<br/><br/>\'+\'</9>\'+\'<t c="T"></t>\'+\'<9 d="B-1j:1k; 1p:i i A i;">aD aC :</9>\'+\'<9 d="W:i A i A;">\'+\'2Y 1S aB 1P 1H aF, u 1Z 1a 3y K u 1m 3u aG 1m aJ, 21 1m aI aH by 24 ac 1a 3y 1Z M 3u, 1S at 1H ab 9J u 9I. 9H 17.E 9G 2M 9K, 9L, 9O, 9N M 9M 1S 9F M 9E 1P, M 3r 1m 3s M 9x as 1N 1m 3s, 9w, 9v, 9u M 9y 3I 2O be 9z by M 2r 1m 3b (21 9D) 9C at, 2A, 2r M 1V G K; G 9B, 9A, 9P, 9Q, a5, a4 a3 M a2 1a G K.<br/>\'+\'</9>\'+\'</9>\'+\'</9>\'+\'</3H>\'+\'</3G>\';m.a6=\'\';m.a7=\'\';m.aa=\'\';m.a9=\'\';m.a8=\'\';m.a1=\'\';m.a0=\'\';m.9U=\'\';m.9T=\'\';m.9S=\'\';m.9R=\'\';m.9V=\'\';m.9W=1W;9Z=9Y;m.9X=1W;m.aV=2n 68();m.67=\'<!--  6a 1h 13 2K  -->\'+\'<9 x="6b" c="f-Y-1d f-F-D">\'+\'    <9 c="6e"></9>\'+\'    <12 x="6d" c="f-1e f-3L-2N f-Y-32 f-F-D">\'+\'        <o x="6c" c="f-Y-32 f-F-D" 1l="1A 3J"><b c="f-N f-N-66" d="O:Q; H:-1v;"><2J 34="5Y/1Q/5X.60" d="11:15; l:15; H:Z; n:Z; O:61;"/></b></o>\'+\'    </12>\'+\'    <12 x="64" c="f-1e f-3L-2N f-Y-32 f-F-D">\'+\'        <o x="62" c="f-Y-1d f-F-D" 1l="1A 3J"><b c="f-N f-N-6g-e-w" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="6t" c="f-Y-1d f-F-D" 1l="3i 2o"><b c="f-N f-N-6s" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="6r" c="f-Y-1d f-F-D" 1l="3e 2o"><b c="f-N f-N-5V" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="3A"  c="3A f-Y-1d f-F-D" 1l="3g"><b c="f-N f-N-2h" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="3z" c="3z f-Y-1d f-F-D" 1l="2V"><b c="f-N f-N-6v" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="6y" c="f-Y-1d f-F-D" 1l="1h 13 2P"><b c="f-N f-N-6x" d="O:Q; H:-1v;"></b></o>\'+\'        <o x="6j" c="f-Y-1d f-F-D" 1l="33 10 1h 13"><b c="f-N f-N-6i" d="O:Q; H:-1v;"></b></o>\'+\'    </12>\'+\'</9>\';m.2D=\'<9 c="2H f-F-D" d="1J: 2p; "><j c="f-F-n 6h" 2l="36 2L 6k" k="y" 3t="3x" 1T=""><9></9><b c="N"></b></9>\'+\'<9 c="6l" d="1J:X; y-1f:n;"><12 c="6o f-28 f-1e f-1e-1F f-F-D" x="f-x-1" 3v="28" 3N="0"></12></9>\';m.2v=\'<9 c="38 f-F-D" d="1J:2p;"><j c="f-F-n 6n" 2l="46 2i 45 ... 2Q" k="y" 3t="3x" 1T=""><9></9><b c="N"></b></9>\'+\'<9 c="5Q" d="1J:X; y-1f:n;"><12 c="5I f-28 f-1e f-1e-1F f-F-D" x="f-x-1" 3v="28" 3N="0"></12></9>\';m.5O=[\'2Q ~ 5G 5N 46 2i 45\',\'5U ~ 5E C\',\'5D ~ 6u 80\',\'7y ~ 7x 1C\',\'7w ~ 7v 1X\',\'7z ~ 7A 1x\',\'7D ~ 7C 7B\',\'7u ~ 7t 1t\',\'7n ~ 7m C\',\'7l ~ 7k 1C\',\'7o ~ 6A 7s\',\'7r ~ 7q C\',\'7U ~ 7T 7S\',\'7R ~ 7V C\',\'7W ~ 7Z C\',\'7Y ~ 7X 7Q\',\'7P ~ 7J 7I\',\'7H ~ 7G 7K\',\'7L ~ 7O 7N\',\'7M ~ 7j C\',\'7i ~ 6Q 6P\',\'6O ~ 6N 1y\',\'6R ~ 6S C\',\'6V ~ 6U 6T\',\'6M ~ 6L 6E\',\'6D ~ 6C 6B 6F\',\'6G ~ 6K 35 C\',\'6J ~ 6I 1y\',\'6H ~ 6W 1x\',\'6X ~ 7c 1x\',\'7b ~ 7a 1y\',\'79 ~ 7d 7h\',\'6Y ~ 73 7p 5s\',\'6Z ~ 70 71\',\'77 ~ 78 1x\',\'7f ~ 7g 3C\',\'5T ~ 5S\',\'5F ~ 5L 3w\',\'5M ~ 5J 1y\',\'5K ~ 5P 1x\',\'5R ~ 5C 5H C\',\'6z ~ 6m 6p\',\'6q ~ 6w 1t\',\'6f ~ 63 5W 5s\',\'5Z ~ 65 69\',\'7e ~ 74 75\',\'76 ~ 72 7F\',\'7E ~ 5B 35 1t\',\'8z ~ bJ C\',\'eN ~ eM eL C\',\'eK ~ eO eP\',\'eS ~ eR 1L\',\'eQ ~ eJ eI\',\'eC ~ eB eA\',\'ez ~ eD 1t\',\'eE ~ eH 1X\',\'eG ~ eF eT\',\'eU ~ 3o 1y\',\'f9 ~ f8 C\',\'f7 ~ f6 fa\',\'fb ~ fe fd\',\'fc ~ f5 f4\',\'eY ~ eX 3q\',\'eW ~ eV 2z\',\'eZ ~ f0 1C\',\'f3 ~ f2 f1\',\'ey ~ ex e5\',\'e4 ~ e3 C\',\'e2 ~ e6 1C\',\'e7 ~ ea e9\',\'e8 ~ e1 2f\',\'e0 ~ dT 1C\',\'dS ~ dR dQ\',\'dU ~ dV dZ\',\'dY ~ dX 1t\',\'dW ~ eb ec\',\'er ~ eq C\',\'ep ~ eo 1C\',\'es ~ et ew\',\'ev ~ fg en\',\'em ~ eg ef\',\'ee ~ ed 49\',\'eh ~ ei el\',\'ek ~ ej ff\',\'fA ~ gj 3p\',\'gi ~ gh gf\',\'gg ~ gk 1L\',\'gl ~ gp 1x\',\'go ~ gn 3B\',\'gm ~ ge gd\',\'g6 ~ g5 47\',\'g4 ~ g2 g3\',\'g7 ~ g8 C\',\'gc ~ gr 1L\',\'gb ~ ga g9 gq\',\'gt ~ 2c gB C\',\'gv ~ gu gC\',\'gs ~ gw gx\',\'gA ~ 3M 3E 3F\',\'gz ~ gy 3w\',\'g0 ~ fw 2z\',\'fv ~ fu 1y\',\'aW ~ ft 1L\',\'fx ~ fy 1X\',\'fC ~ fB g1\',\'fz ~ fs 2c 3o fr\',\'fk ~ fj fi\',\'fh ~ fl fm fq\',\'fp ~ fo 1x\',\'fn ~ fD 1X\',\'fE ~ fU fT\',\'fS ~ fR 2z\',\'fV ~ fW 2c 3B\',\'fZ ~ fY fX\',\'fQ ~ fP 1y\',\'fI ~ fH 1y\',\'fG ~ 3K 3E 3F\',\'fF ~ fJ fK\',\'fO ~ fN fM fL\',\'eu ~ dO bW 48\',\'bV ~ bU 1L\',\'bT ~ bX 3D 3D\',\'bY ~ c1 1X\',\'c0 ~ bZ C\',\'bS ~ bR 3C\',\'bL ~ bK dP\',\'bI ~ bM 35 C\',\'bN ~ bQ 2f\',\'bP ~ 3K bO c2\',\'c3 ~ ci ch 1L\',\'cg ~ cf cj 1t\',\'ck ~ cn 1t\',\'cm ~ cl ce\',\'cd ~ c7 3q\',\'c6 ~ c5 1t\',\'c4 ~ c8 c9 C\',\'cc ~ cb ca\',\'bH ~ bG 3p\',\'bb ~ ba C\',\'b9 ~ b8 2f\',\'bc ~ bd bh\\\'bg\',\'bf ~ b7 &31; b6 C\',\'b0 ~ aZ 1C\',\'aY ~ aX 47\',\'b1 ~ b2 2f\',\'b5 ~ b4 b3\',\'bi ~ bj 2c 1x\',\'bA ~ bz bx\',\'bw ~ bB bC bF\',\'bE ~ bD bv\',\'bu ~ bn 48\',\'bm ~ bl 49\',\'bk ~ bo bp\',];m.bt=\'<9 x="4c" c="4c" 1l="13 2P">\'+\'<9 x="4b" c="4b" d="l:bs; p:n; O:Q; 1J:4e-2p;">\'+\'<12 d="W:i i i 4a;">\'+\'<o><a L="#R-1" d="B-V:15">bq</a></o>\'+\'<o><a L="#R-2" d="B-V:15">co</a></o>\'+\'<o><a L="#R-3" d="B-V:15">cp</a></o>\'+\'<o><a L="#R-4" d="B-V:15">&r;dm&r;</a></o>\'+\'<o><a L="#R-5" d="B-V:15">&r;dl.&r;</a></o>\'+\'<o><a L="#R-6" d="B-V:15">&r;dk&r;</a></o>\'+\'<o><a L="#R-7" d="B-V:15">&r;dj&r;</a></o>\'+\'<o><a L="#R-8" d="B-V:15">&r;dn&r;</a></o>\'+\'</12>\'+\'<9 x="R-1" d="O:Q;z-1u:1O;">\'+\'<9 c="1z" K-11="2k" K-l="1I">\'+\'<9><j k="q" h="^3Z"><b c="g">do dr dq dp</b></9>\'+\'<9><j k="q" h="^3S"><b c="g">26 1K</b></9>\'+\'<9><j k="q" h="^3R"><b c="g">22 1K 3P</b></9>\'+\'<9><j k="q" h="^3Q"><b c="g">S&P di</b></9>\'+\'<9><j k="q" h="^3O"><b c="g">S&P/2d 1K 3P</b></9>\'+\'<9><j k="q" h="^3T"><b c="g">3T 1O</b></9>\'+\'<9><j k="q" h="^dh"><b c="g">db</b></9>\'+\'<9><j k="q" h="^da"><b c="g">d9 40</b></9>\'+\'<9><j k="q" h="^d8"><b c="g">dc dd</b></9>\'+\'<9><j k="q" h="^dg"><b c="g">df de 3Y</b></9>\'+\'<9><j k="q" h="^ds"><b c="g">dt dI 3Y</b></9>\'+\'</9>\'+\'</9>\'+\'<9 x="R-2" d="O:Q;z-1u:1O;">\'+\'<9 c="1z" K-11="2k" K-l="1I">\'+\'<9 d="y-1f:1Y; B-1j:1k;">2C 5 39 dH</9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="p:n; l:50%;"><j k="q" h="$dG"><b c="g">U.S. 1K</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="$dF"><b c="g">26</b></9>\'+\'<9 d="p:n; l:50%;"><j k="q" h="$dJ"><b c="g">22</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="$dK"><b c="g">2d</b></9>\'+\'<9 d="3W:3V;"></9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="y-1f:1Y; B-1j:1k;">2C 5 27 % dN</9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="p:n; l:50%;"><j k="q" h="%dM"><b c="g">U.S. 1K</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="%dL"><b c="g">26</b></9>\'+\'<9 d="p:n; l:50%;"><j k="q" h="%dE"><b c="g">22</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="%dD"><b c="g">2d</b></9>\'+\'<9 d="3W:3V;"></9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="y-1f:1Y; B-1j:1k;">2C 5 27 % dx</9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="p:n; l:50%;"><j k="q" h="%dw"><b c="g">U.S. 1K</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="%dv"><b c="g">26</b></9>\'+\'<9 d="p:n; l:50%;"><j k="q" h="%du"><b c="g">22</b></9>\'+\'<9 d="p:1g; l:50%;"><j k="q" h="%dy"><b c="g">2d</b></9>\'+\'</9>\'+\'</9>\'+\'<9 x="R-3" d="O:Q;z-1u:99;">\'+\'<9>\'+m.2D+\'</9>\'+\'<9><2s 2l="51 5b 5h." c="2q f-F-D" h="2q"></2s></9>\'+\'</9>\'+\'<9 x="R-4" d="O:Q;z-1u:99;">\'+\'<9 c="5c">\'+m.2v+\'</9>\'+\'<9 c="1z" K-11="5f" K-l="1I">\'+\'<9><j k="q" h="38"><b c="g">14 4l 2i 4R</b></9>\'+\'<9><j k="q" h="h"><b c="g">14 4N 4H</b></9>\'+\'<9><j k="q" h="4K"><b c="g">14 1h 2L</b></9>\'+\'<9><j k="q" h="3d"><b c="g">14 36 27</b></9>\'+\'<9><j k="q" h="2g"><b c="g">14 C 1A</b></9>\'+\'<9><j k="q" h="57"><b c="g">14 39 1A</b></9>\'+\'</9>\'+\'</9>\'+\'<9 x="R-5" d="O:Q;z-1u:1O;">\'+\'<9 c="1z" K-11="2k" K-l="1I">\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">dz dC :</b></9><9 d="l:42%; p:n;"><b c="f-Y-1d f-F-D" d="l:dB; 11:3k; 1J:4e-2p;"><j c="3f f-F-D" k="y" h="dA" 1T="5" d="l:3m; 11:3k; d7:X; W:i; y-1f:1Y;" /></b><b c="d6">&r;cE</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">cD cC :</b></9><9 d="l:42%; p:n;"><j k="I" J="J" h="2F"><b c="g">1c</b>&r;&r;<j k="I" h="2F"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">cB 2V :</b></9><9 d="l:42%; p:n;"><j k="I" J="J" h="2I"><b c="g">1c</b>&r;&r;<j k="I" h="2I"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">cF 3j :</b></9><9 d="l:41%; p:n;"><j k="I" J="J" h="2E"><b c="g">1c</b>&r;&r;<j k="I" h="2E"><b c="g">19</b></9>\'+\'<9 c="2N"></9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="y-1f:1Y; B-1j:1k;">4f cG</9>\'+\'<t c="T" d="l:1E;"></t>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">cJ 4f :</b></9><9 d="l:41%; p:n;"><j k="I" h="37"><b c="g">1c</b>&r;&r;<j k="I" h="37" J="J" ><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">cI 1A :</b></9><9 d="l:41%; p:n;"><j k="I" h="2T" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2T"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">3i 2o :</b></9><9 d="l:41%; p:n;"><j k="I" h="2X" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2X"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">3e 2o :</b></9><9 d="l:41%; p:n;"><j k="I" h="2Z" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2Z"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">3g/2V :</b></9><9 d="l:41%; p:n;"><j k="I" h="2h" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2h"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">13 2P :</b></9><9 d="l:41%; p:n;"><j k="I" h="2j" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2j"><b c="g">19</b></9>\'+\'<9 d="l:58%; p:n;"><b c="g" d="n:i; H:Z;">33 13 :</b></9><9 d="l:41%; p:n;"><j k="I" h="2y" J="J"><b c="g">1c</b>&r;&r;<j k="I" h="2y"><b c="g">19</b></9>\'+\'</9>\'+\'</9>\'+\'<9 x="R-6" d="O:Q;z-1u:1O;">\'+\'<9 c="1z" K-11="2k" K-l="1I">\'+\'<b c="2B-K f-F-D f-Y-1d" h="2B-K">\'+\'   <9 d="W:i i i i;">\'+\'<2J 34="1b://5e.1s.E/1Q/5g.5i" 11="54" l="54" d="p:n; 1p:i A i i;" />\'+\'<b d="B-V:15;">\'+\'    10 1h 13 (2R: 4.0.1)<br/>\'+\'    <b d="B-V:0.52;">&23;</b> 17.E cH - cA<br/>\'+\'    cz : <a L="53:2U@1s.E" d="y-1o:X;">ct@1s.E</a>\'+\'</b><t c="T f-1e-1F"></t>\'+\'<9 c="1z" d="W:i A i i;">\'+\'   <9 d="B-V:15; y-1f:5k; W:i A i A;">\'+\'       5z 5w 5x 5y M 5t, 17.E 5u 5p u 5q D G 5o 2e 1M 1a G 1F 1D 1B (21 1R 29 G y, 2a 5v, 55, 4v, 1Q, 4t, 2t 18, 4s 18 u 2t-4Y 18) u 1n G 4x 4q 4i. 4g 2e 1M 4k, 1R 29, 4m u 4B 1M 1n G 2M 4C u 2H 4O 4V 1G 4G 1V a 4F 4I by 17.E.<br/><br/>\'+\'       17.E 4J 1N 24 a 4w 25-4D 4E-2x 4M 4U 1N 4o 18 1D 1B 2A a 2a M 4h 4r 4y a 1w 2b; 23 u 4A G 18 1D 1B 1n 1H 1w 2b 5A 5m; u 56 59 1V 3c 1P 1H 5a 5d u 25-5j 1Z.<br/><br/>\'+\'       cs G cr 1a cq, 24 cu 4X cv, cy, 2g, cx, cw, cK, cL, d0, cZ, cY M cX M 2h 1n d1 G 18 1D 1B (1n 1m d2 M d5) 1R d4 d3 cW.<br/><t c="T f-1e-1F"></t>\'+\'       30 4T &31; 4S 1G 4P 2r 4Q <a L="1b://4n.4p.E/" 1q="1r" d="y-1o:X;">2m 4j</a> 1w 4z u 2O be 4u as 5n as 20 5r.<br/><br/>\'+\'   </9>\'+\'</9>\'+\'   </9>\'+\'</b>\'+\'</9>\'+\'</9>\'+\'<9 x="R-7" d="O:Q;z-1u:99;">\'+\'<9>\'+m.2D+\'</9>\'+\'<9><2s 2l="51 5b 5h." c="2q f-F-D" h="2q"></2s></9>\'+\'</9>\'+\'<9 x="R-8" d="O:Q;z-1u:99;">\'+\'<9 c="5c">\'+m.2v+\'</9>\'+\'<9 c="1z" K-11="5f" K-l="1I">\'+\'<9><j k="q" h="38"><b c="g">14 4l 2i 4R</b></9>\'+\'<9><j k="q" h="h"><b c="g">14 4N 4H</b></9>\'+\'<9><j k="q" h="4K"><b c="g">14 1h 2L</b></9>\'+\'<9><j k="q" h="3d"><b c="g">14 36 27</b></9>\'+\'<9><j k="q" h="2g"><b c="g">14 C 1A</b></9>\'+\'<9><j k="q" h="57"><b c="g">14 39 1A</b></9>\'+\'</9>\'+\'</9>\'+\'<t c="T f-1e-1F"></t>\'+\'<9 d="y-1f:1g;">\'+\'<1i c="cV">cP</1i>\'+\'<1i c="cO">cN</1i>\'+\'<1i c="cM">cQ</1i>\'+\'<1i c="cR">cU ►</1i>\'+\'<1i c="cT">◄ cS</1i>\'+\'</9>\'+\'</9>\'+\'</9>\';',62,1031,'|||||||||div||span|class|style||ui|chkLbl|name|0px|input|type|width|myStocks|left|li|float|checkbox|nbsp||h1|and|||id|text||8px|font|Dollar|all|com|corner|the|top|radio|checked|data|href|or|icon|position||relative|tabs||hr||size|padding|none|state|2px|jQuery|height|ul|Ticker|Show|13px||Bitbenderz|material|No|of|http|Yes|active|widget|align|right|Stock|button|weight|bold|title|any|in|decoration|margin|target|_blank|bitbenderz|Pound|index|1px|web|Peso|Franc|slimScrollMe|Change|herein|Dinar|contained|250px|content|are|your|260px|display|Composite|Rupee|rights|to|100|for|images|without|is|value|Plugin|from|false|Ounces|center|use||including|NYSE|copy|you|non|NASDAQ|Price|menu|limitation|computer|browser|New|TSX|property|Shilling|change|play|Currency|options|212px|placeholder|3rd|new|Speed|block|symbols|through|textarea|audio|protocol|curData|https|free|about|Rial|on|blank|Top|yqsData|chartProxy|autoScroll|page|search|hoverPause|img|Object|Symbol|information|clearfix|may|Options|OUIE|ver|true|direction|tom|Pause|230|speed_up|Data|speed_down|All|amp|default|About|src|Islands|Quote|pinBtns|currency|Volume|so|party|it|price|Decrease|throttle|Play|this|Increase|Charts|18px|stock|28px|me|Guinea|Lira|Krona|makes|representations|autocomplete|reliance|role|Krone|off|such|tickerPause|tickerPlay|Leu|Koruna|Leone|Korean|Won|msgCenter|msgItem|that|Directions|South|helper|North|tabindex|GSPTSE|Index|GSPC|NYA|IXIC|FTSE|The|both|clear|no|INDEX|DJI||||jquery|libraries|Values|Convert|Dirham|Riyal|Kwacha|12px|stockTickerOptionsContent|stockTickerOptions|location|inline|Menu|Intellectual|mobile|therein|Party|include|ISO|copyrights|finance|view|yahoo|used|device|video|music|delayed|photographs|worldwide|software|via|services|store|database|displayed|exclusive|royalty|compilation|extracted|Name|owned|grants|symbol|sup|revocable|Company|results|obtained|various|Code|charts|quotes|license|which|rgb|not|visual|ssl||Comma|90em|mailto||artwork|print|volume||pages|own|separated|currencyConvertCombo|personal|www|172px|avatar|list|png|commercial|justify|year|memory|much|intellectual|legally|beneficially|minutes|Colon|implied|owns|code|where|otherwise|noted|Except|cache|Falkland|East|ALL|Australian|DKK|Do|Caribbean|resCurrency|Dijibouti|DOP|Danish|DJF|Not|cncy|Dominican|curContainer|XCD|Euro|EUR|AUD|minus|Salvador|ajaxLoader|css|ERN|gif|absolute|tickerRedir|El|icons|Eritrea|loading|obj|Array|Nakfa|Begin|scrollingMask|tickerLoading|loadcons|scrollingText|SVC|transferthick|txtQuotes|comment|tickerAbout|Lookup|quoteContainer|Ecuador|curQuotes|resQuotes|Sucre|EGP|tickerSpdDn|plus|tickerSpdUp|Albanian|pause|Egyptian|gear|tickerOptns|ECS|Bangladesh|Verde|Cape|CVE|Riel|Escudo|KYD|CLP|CFA|XOF|Cayman|Cambodia|KHR|Burundi|BIF|Lev|Bulgarian|CAD|Canadian|Yuan|Chinese|CNY|Chilean|COP|CRC|HRK|Croatian|Kuna|Ethiopian|Costa|Estonian|Kroon|ETB|CUP|Cuban|XCP|Comoros|KMF|Colombian|Copper|EEK|CZK|Czech|Pounds|BGN|Brunei|Bahraini|BHD|Bahamian|BSD|BDT|Rica|Barbados|BBD|Taka|British|GBP|Aluminium|XAL|Algerian|DZD|ARS|Argentine|Florin|Aruba|AWG|FKP|Birr|Botswana|BWP|Boliviano|Bolivian|Pula|BRL|BND|Real|Brazilian|BOB|Ngultrum|BZD|Ruble|Belarus|BYR|Belize|BMD|Bhutan|BTN|Bermuda|Lek|add|notable|Most|element|ticker|does|require|thereby|keys|API|need|scrolling|horizontal|common|Exchanges|American|major|preferred|futures|indices|currencies|commodities|delivered|charge|Credits|Usage|versatility|quality|following|smoothdivscroll|touchpunch|v1|smoothDivScroll|intrinsic|FJD|membership|fees|monthly|That|dues|nothing|features|inherent|its|coverage|complete|mnuthrottle|mnuBtns|defaultCurrency|defaultFields|2000|300000|stockticker|brand|showBrand|defaultSymbols|key|active_key|undefined|typeof|if|Date|getFullYear|net|websitesource|file|Powered|brandfgcolor|205px|0000EE||color|Chart|10px|11px|nearly|provides|Description|subject|Author|Requested|tickerName|tickerSymbol|brandbgcolor|fallback|msgData|4px|headerText|defaultMsg|furf|UI|recommendations|promises|guarantees|warranties|inducements|made|accuracy|timeliness|found|vendors|liable|responsible|nor|Neither|risk|discretion|providers|licensors|agents|distributors|employees|reliability|completeness|lose_nya|lose_ixi|lose_usc|gain_tsx|lose_tsx|init|ccvt|null|mnuTimer|gain_nya|gain_ixi|decency|compliance|copyright|legality|actv_usc|actv_ixi|gain_usc|actv_tsx|actv_nya|sole|because|jcanvas|projects|calebevans|v2|jCanvas|v14|above|listed|08|Kinetic|kinetic|github|v0|Punch|Touch|||brandonaaron|mousewheel|davetayls|v3|MouseWheel|copyrighted|their|provided|Legalis|Nota|licenses|convenience|upon|taken|action|materials|Commercial|Non|released|foundations|authors|individual|under|one|GPL|MIT|more|cmlt|PKR|UAE|AED|Tunisian|TND|UGX|Ugandan|Hryvnia|Ukraine|UAH|Tobago|Trinidad|Tanzanian|TZS|Taiwan|TWD|TOP|Tonga||TTD|ang|Pa|UYU|Uruguayan|ZWD|Zambian|ZMK|Yemen|Zimbabwe|dollar|Indices||278px|opData|YER|Dong|VEF|Vatu||Vanuatu|VUV|Venezuelan|Bolivar|Vietnam|VND|Fuerte|Turkish|TRY|SBD|Fiji|Slovenian|SIT|Solomon|SOS|African|ZAR|Somali|Slovak|SKK|SLL|Seychelles|SCR|Arabian|Sierra|XAG|Singapore|SGD|Silver|Rand|LKR|USD|Syrian|SYP|Swedish|United|States|Baht|Thai|THB|SEK|Lilageni|St|SHP|Lanka|Sri|Helena|SDG|Swaziland|SZL|Sudanese|Movers|Symbols|doubt|avoidance|For|info|must|adapt|publish|transform|edit|Contact|2014|Hover|Scroll|Auto|mins|Interactive|Buttons|2007|Direction|Pin|republish|distribute|cancel|Apply|apply|Reset|Cancel|next|Back|back|Next|reset|permission|show|rebroadcast|broadcast|redistribute|public|form|written|prior|media|chklbl|border|N225|CAC|FCHI|DAX|NIKKEI|225|SENG|HANG|HSI|GDAXI|500|None|Blank|Misc|Fields|Brand|Dow|Average|Industrial|Jones|STI|STRAITS|LOSE_NYA|LOSE_IXI|LOSE_USC|Losers|LOSE_TSX|Refresh|rr|32px|Rate|GAIN_TSX|GAIN_NYA|MOVE_IXI|MOVE_USC|Leaders|TIMES|MOVE_NYA|MOVE_TSX|GAIN_IXI|GAIN_USC|Gainers|Saudi|Tolar|Kip|Lao|LAK|Kuwaiti|LVL|Latvian|LSL|Lebanese|LBP|Lat|KWD|Kenyan|JOD|Jamaican|JMD|Yen|Jordanian|KZT|KES|Tenge|Kazakhstan|Lesotho|Loti|Malawi|MWK|Denar|Macedonian|MYR|Malaysian|Maldives|MVR|Ringgit|MKD|Pataca|Libyan|LYD|Liberian|LRD|LTL|Lithuanian|SAR|MOP|Lita|Japanese|JPY|GIP|Cedi|Ghanian|GHC|Gibraltar|XAU|Guatemala|GTQ|Gold|Dalasi|Gambian|IDR|Kong|Hong|HKD|Indonesian|Rupiah|GMD|Indian|INR|Quetzal|GNF|Iran|IRR|Iceland|ISK|IQD|Iraqi|Shekel|Israeli|ILS|Forint|Hungarian|Haiti|HTG|Guyana|GYD|Gourde|HNL|HUF|Lempira|Honduras|Rufiyaa|Macau|PEN|Guarani|Paraguayan|PYG|Peruvian|Nuevo|XPT|Philippine|PHP|Sol|Kina|Papua|Pakistani|Pacific|XPF|Omani|XPD|Palladium|PGK|MTL|Panama|PAB|Platinum|PLN|WST|KRW|Swiss|CHF|Samoa|Tala|Dobra|Tome|Sao|STD|Rwanda|RWF|Qatar|QAR|Zloty|Polish|RON|Romanian|Rouble|Russian|RUB|OMR|Balboa|Myanmar|Kyat|MMK|Moroccan|MAD|NAD|Namibian|Antilles|Neth|ANG|NPR|Tugrik|Mongolian|Ougulya|MUR|Mauritania|MRO|Maltese|Mauritius|MXN|MNT|Moldovan|MDL|Mexican|Guilder|Nepalese|NGN|NZD|Nicaragua|NIO|Nigerian|Naira|Norwegian|NOK|KPW|Zealand|Cordoba'.split('|'),0,{}))