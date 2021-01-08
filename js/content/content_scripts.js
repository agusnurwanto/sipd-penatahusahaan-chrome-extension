// console.log('run content_script.js');

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    // th.appendChild(s);
    th.insertBefore(s, th.firstChild);
}
injectScript( chrome.extension.getURL('/config.js'), 'html');


var data = {
    message:{
        type: "get-actions"
    }
};
chrome.runtime.sendMessage(data, function(response) {
    console.log('responeMessage', response);
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('sender, request', sender, request);
	if(request.type == 'response-fecth-url'){
		jQuery('#wrap-loading').hide();
		jQuery('#persen-loading').html('');
		jQuery('#persen-loading').attr('persen', '');
		jQuery('#persen-loading').attr('total', '');
		var res = request.data;
		console.log(request.data);
		if(res.action && res.action=='get_unit'){
			var input = ''
				+'<div class="col-md-6 m-b-md">'
					+'<div class="app-input-text">'
						+'<label class="app-input-text__label">SKPD dari Extension</label>'
		        		+'<input type="text" class="app-input-text__input" disabled value="'+res.data[0].nama_skpd+'"/>'
	        		+'</div>'
	        	+'</div>';
			jQuery('app-input-text[ng-model="formTambah.skpd.namaSkpd"]').parent().after(input);
			window.allUnitSCE = res.data[0];
			get_unit(allUnitSCE);
		}else{
			alert(res.message);
		}
	}else if(request.type == 'response-actions'){
		
	}
	return sendResponse("THANKS from content_script!");
});

// injectScript( chrome.extension.getURL('/js/content/app.js'), 'html');