/* ************************************ */
/* Add Message Listener Event           */
/* ************************************ */
if (window.addEventListener) {
	window.addEventListener("message", _fromStockTicker, false);
} else {
	window.attachEvent("onmessage", _fromStockTicker);
};

/* ************************************ */
/* Message Listener                     */
/* ************************************ */
function _fromStockTicker(e){

	/*  Get Args  */
	var args = e.data.split('&');

	if(e.data.indexOf('stockTicker') > -1){

		/*  Call stockTicker Event  */
		switch(args[1]) {
			case 'ready':
				_tickerReady(e);
				break;
			case 'update':
				_tickerUpdate(e);
				break;
			case 'diagopen':
				_tickerDiagOpen(e);
				break;
			case 'diagclose':
				_tickerDiagClose(e);
				break;
			case 'googAd':
				_tickerGoog(e);
				break;
			default:
				break;
		};
	}else if(e.data.indexOf('chartTicker') > -1){
		switch(args[1]) {
			case 'ready':
				_chartReady(e);
				break;
			default:
				break;
		};
	}else{
		/* Not from Bitbenderz  */
	};

};

/* ************************************ */
/* Create Ticker Elements               */
/* ************************************ */
function _createTickers(){
	var st = document.getElementsByClassName('stockTicker');

	for(var i = 0; i < st.length; i++){
		var ss = st[i].getAttribute('data-src');
		st[i].removeAttribute('data-src');
		st[i].setAttribute('src', ss);
	};
};

/* ************************************ */
/* stockTicker Ready Event              */
/* ************************************ */
function _tickerReady(e){
	/*  Get Args  */
	var args = e.data.split('&');

	var who = document.getElementById(args[2]);

	who.style.zIndex = '999';

	if(typeof theCode != 'undefined'){theCode.ver = args[3];};

	/*  Hide Ajax Loader  */
	who.parentNode.getElementsByClassName('jqst')[0].style.display = 'none';
};

/* ************************************ */
/* stockTicker Update Event             */
/* ************************************ */
function _tickerUpdate(e){
	/*  Get Args  */
	var args = e.data.split('&');

	var who = document.getElementById(args[2]);
};

/* ************************************ */
/* stockTicker Dialog Open Event        */
/* ************************************ */
function _tickerDiagOpen(e){
	/*  Set zIndex of iFrames  */
	var st = document.getElementsByClassName('stockTicker');
	for(var i = 0; i < st.length; i++){st[i].parentNode.style.zIndex = '999';};

	/*  Get Args  */
	var args = e.data.split('&');

	var who = document.getElementById(args[2]);

	who.parentNode.style.zIndex = '16000000';

	who.style.height = '426px';
};

/* ************************************ */
/* stockTicker Dialog Close Event       */
/* ************************************ */
function _tickerDiagClose(e){
	/*  Set zIndex of iFrames  */
	var st = document.getElementsByClassName('stockTicker');
	for(var i = 0; i < st.length; i++){st[i].parentNode.style.zIndex = '999';};

	/*  Get Args  */
	var args = e.data.split('&');

	var who = document.getElementById(args[2]);

	who.style.height = '41px';
};

/* ************************************ */
/* stockTicker Google Adsense           */
/* ************************************ */
function _tickerGoog(e){
	/*  Set zIndex of iFrames  */
	var st = document.getElementsByClassName('stockTicker');
	for(var i = 0; i < st.length; i++){st[i].parentNode.style.zIndex = '999';};

	/*  Get Args  */
	var args = e.data.split('&');

	var who = document.getElementById(args[2]);

	if(args[3] == 'show'){
		who.parentNode.style.zIndex = '1000';
		who.style.minHeight = '96px';
	}else{
		who.style.minHeight = '41px';
	};
};

/* ************************************	*/
/* Chart Ready Event			*/
/* ************************************	*/
function _chartReady(e) {
	/*  Get Args  */
	var args = e.data.split('&');
	var data = JSON.parse(args[2]);

	/*  Hide Ajax Loader  */
	var who = document.getElementById(data.frameid);
	who.parentNode.getElementsByClassName('jqct')[0].style.display = 'none';

};

/* ************************************ */
/* Encode / Decode                      */
/* ************************************ */
var B64={alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",lookup:null,ie:/MSIE /.test(navigator.userAgent),ieo:/MSIE [67]/.test(navigator.userAgent),encode:function(e){var t=B64.toUtf8(e),n=-1,r=t.length,i,s,o,u=[,,,];if(B64.ie){var a=[];while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a.push(B64.alphabet.charAt(u[0]),B64.alphabet.charAt(u[1]),B64.alphabet.charAt(u[2]),B64.alphabet.charAt(u[3]))}return a.join("")}else{var a="";while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a+=B64.alphabet[u[0]]+B64.alphabet[u[1]]+B64.alphabet[u[2]]+B64.alphabet[u[3]]}return a}},decode:function(e){if(e.length%4)throw new Error("InvalidCharacterError: 'B64.decode' failed: The string to be decoded is not correctly encoded.");var t=B64.fromUtf8(e),n=0,r=t.length;if(B64.ieo){var i=[];while(n<r){if(t[n]<128)i.push(String.fromCharCode(t[n++]));else if(t[n]>191&&t[n]<224)i.push(String.fromCharCode((t[n++]&31)<<6|t[n++]&63));else i.push(String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63))}return i.join("")}else{var i="";while(n<r){if(t[n]<128)i+=String.fromCharCode(t[n++]);else if(t[n]>191&&t[n]<224)i+=String.fromCharCode((t[n++]&31)<<6|t[n++]&63);else i+=String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63)}return i}},toUtf8:function(e){var t=-1,n=e.length,r,i=[];if(/^[\x00-\x7f]*$/.test(e))while(++t<n)i.push(e.charCodeAt(t));else while(++t<n){r=e.charCodeAt(t);if(r<128)i.push(r);else if(r<2048)i.push(r>>6|192,r&63|128);else i.push(r>>12|224,r>>6&63|128,r&63|128)}return i},fromUtf8:function(e){var t=-1,n,r=[],i=[,,,];if(!B64.lookup){n=B64.alphabet.length;B64.lookup={};while(++t<n)B64.lookup[B64.alphabet.charAt(t)]=t;t=-1}n=e.length;while(++t<n){i[0]=B64.lookup[e.charAt(t)];i[1]=B64.lookup[e.charAt(++t)];r.push(i[0]<<2|i[1]>>4);i[2]=B64.lookup[e.charAt(++t)];if(i[2]==64)break;r.push((i[1]&15)<<4|i[2]>>2);i[3]=B64.lookup[e.charAt(++t)];if(i[3]==64)break;r.push((i[2]&3)<<6|i[3])}return r}};
