/* ************************************ */
/* Encode / Decode                      */
/* ************************************ */
var B64={alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",lookup:null,ie:/MSIE /.test(navigator.userAgent),ieo:/MSIE [67]/.test(navigator.userAgent),encode:function(e){var t=B64.toUtf8(e),n=-1,r=t.length,i,s,o,u=[,,,];if(B64.ie){var a=[];while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a.push(B64.alphabet.charAt(u[0]),B64.alphabet.charAt(u[1]),B64.alphabet.charAt(u[2]),B64.alphabet.charAt(u[3]))}return a.join("")}else{var a="";while(++n<r){i=t[n];s=t[++n];u[0]=i>>2;u[1]=(i&3)<<4|s>>4;if(isNaN(s))u[2]=u[3]=64;else{o=t[++n];u[2]=(s&15)<<2|o>>6;u[3]=isNaN(o)?64:o&63}a+=B64.alphabet[u[0]]+B64.alphabet[u[1]]+B64.alphabet[u[2]]+B64.alphabet[u[3]]}return a}},decode:function(e){if(e.length%4)throw new Error("InvalidCharacterError: 'B64.decode' failed: The string to be decoded is not correctly encoded.");var t=B64.fromUtf8(e),n=0,r=t.length;if(B64.ieo){var i=[];while(n<r){if(t[n]<128)i.push(String.fromCharCode(t[n++]));else if(t[n]>191&&t[n]<224)i.push(String.fromCharCode((t[n++]&31)<<6|t[n++]&63));else i.push(String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63))}return i.join("")}else{var i="";while(n<r){if(t[n]<128)i+=String.fromCharCode(t[n++]);else if(t[n]>191&&t[n]<224)i+=String.fromCharCode((t[n++]&31)<<6|t[n++]&63);else i+=String.fromCharCode((t[n++]&15)<<12|(t[n++]&63)<<6|t[n++]&63)}return i}},toUtf8:function(e){var t=-1,n=e.length,r,i=[];if(/^[\x00-\x7f]*$/.test(e))while(++t<n)i.push(e.charCodeAt(t));else while(++t<n){r=e.charCodeAt(t);if(r<128)i.push(r);else if(r<2048)i.push(r>>6|192,r&63|128);else i.push(r>>12|224,r>>6&63|128,r&63|128)}return i},fromUtf8:function(e){var t=-1,n,r=[],i=[,,,];if(!B64.lookup){n=B64.alphabet.length;B64.lookup={};while(++t<n)B64.lookup[B64.alphabet.charAt(t)]=t;t=-1}n=e.length;while(++t<n){i[0]=B64.lookup[e.charAt(t)];i[1]=B64.lookup[e.charAt(++t)];r.push(i[0]<<2|i[1]>>4);i[2]=B64.lookup[e.charAt(++t)];if(i[2]==64)break;r.push((i[1]&15)<<4|i[2]>>2);i[3]=B64.lookup[e.charAt(++t)];if(i[3]==64)break;r.push((i[2]&3)<<6|i[3])}return r}};

/* ************************************ */
/* Return My Element                    */
/* ************************************ */
var scriptElement = (function(scripts) {
	var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length - 1];
	if (script.getAttribute.length !== undefined){return script};
	return script;
}());

/* ************************************ */
/* Return My URL                        */
/* ************************************ */
var scriptSource = (function(scripts) {
	var scripts = document.getElementsByTagName('script'), script = scripts[scripts.length - 1];
	if (script.getAttribute.length !== undefined){return script.src};
	return script.getAttribute('src', -1);
}());

/* ************************************ */
/* Add Stock Ticker Object              */
/* ************************************ */
var se = scriptElement;
var sc = se.getAttribute('class');

se.style.position = 'absolute';
se.style.height = '16px';
se.style.width = '100%';
se.style.display = 'block';
se.style.background = 'transparent url(css/images/ajaxLoader.gif) 50% 50% no-repeat';
se.style.backgroundSize = '16px 16px';

if(sc == 'jqst'){
	var ns = document.getElementsByClassName('stockTicker').length;
	var ss = scriptSource.split('?')[1];
	    ss = ss != undefined ? 'frameid=bb_jqst_'+ns+'&'+ss.split('q=').join('defaultSymbols=').split('f=').join('defaultFields=') : 'frameid=bb_jqst_'+ns;
	    ss += '&cb=' + new Date().getTime();
	    ss = B64.encode(unescape(ss));

	se.parentNode.style.display = 'block';
	se.parentNode.style.position = 'relative';
	se.parentNode.style.minHeight = '41px';

	var sf = '<iframe id="bb_jqst_'+ns+'" class="stockTicker" data-src="http://bitbenderz.com/stockticker/stockticker/jqst.html?'+ss+'" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="position:absolute; height:41px; width:100%;"></iframe>';
	document.write(sf);
}else if(sc == 'jqct'){
	var ns = document.getElementsByClassName('chartTicker').length;
	var ss = scriptSource.split('?')[1];
	    ss = ss != undefined ? 'frameid=bb_jqct_'+ns+'&'+ss.split('q=').join('symbol=').split('t=').join('type=').split('u=').join('refresh=').split('w=').join('range=').split('x=').join('ticker=').split('z=').join('hdline=').split('a=').join('lookup=') : 'frameid=bb_jqct_'+ns;

	var fh = '302px';
	var sa = ss.split('&');
	for(var i = 0; i < sa.length; i++){if(sa[i] == 'ticker=hide'){fh='276px';};};

	se.parentNode.style.minHeight = fh;
	se.parentNode.style.minWidth  = '314px';

	ss += '&cb=' + new Date().getTime();
	ss = B64.encode(ss);

	var sf = '<iframe id="bb_jqct_'+ns+'" class="chartTicker" src="http://bitbenderz.com/chartticker/?'+ss+'" hspace="0" vspace="0" frameborder="no" scrolling="no" allowtransparency="true" style="display:block; height:' + fh + '; width:150px; margin:auto auto;"></iframe>';
	document.write(sf);
};



/* ************************************ */
/* Window Load Event                    */
/* ************************************ */
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
};

/* ************************************ */
/* Add stockTicker Events               */
/* ************************************ */
addLoadEvent(function() {
	var me = document.getElementById('stevt');
	if(!me){
		var se = document.createElement('script');
		    se.setAttribute('type', 'text/javascript');
		    se.setAttribute('id', 'stevt');
		    se.setAttribute('onload', '_createTickers();');
		    se.setAttribute('src', 'js/jqst.event.js?cb=' + new Date().getTime());

		document.getElementsByTagName('head')[0].appendChild(se);
	};
});

