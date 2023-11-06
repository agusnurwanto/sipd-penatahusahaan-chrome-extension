console.log('Salam semangat!');

if(config.websql){
	window.db = openDatabase('SIPD', '1.0', 'sipd database', 50 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS sipd (key, data)', [], function(tx, success){
			// console.log('success', success);
		}, function(tx, error){
			console.log('error', error);
		});
	});
}


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('request', request);
	var type = request.message.type;
	if(type == 'actions'){
		if(config.websql){
			var actions = request.message.content.key;
			var proses = [];
			setDB({
				key: actions,
				data: {
					status: 'active',
					proses: proses
				}
			})
			.then(function(){
				// getDB({
				// 	key: actions,
				// 	debug: true
				// });
			});
		}
	}else if(type == 'get-actions'){
		if(config.websql){
			getDB({
				// debug: true
			})
			.then(function(ret){
				console.log(type, ret);
				var options = {
					type: 'response-actions',
					data: ret
				};
				sendMessageTabActive(options);
			});
		}
	}else if(type == 'run-actions'){
		if(config.websql){
			var actions = request.message.content.key;
			var data = request.message.content.data;
			var options = {
				key: actions,
				data: data
			};
			console.log('run-actions', options)
			setDB(options)
			.then(function(){
				// getDB({
				// 	key: actions,
				// 	debug: true
				// });
			});
		}
	}else if(type == 'get-url'){
		relayAjax({
		    url: request.message.content.url,
		    type: request.message.content.type,
		    data: request.message.content.data,
		    dataType: 'json',
		    success:function(ret){
		    	if(request.message.content.return){
			     	var options = {
			     		type: 'response-fecth-url',
			     		data: ret,
				     	tab: sender.tab
			     	}
		    		if(request.message.content.data.action){
		    			options.action = request.message.content.data.action;
		    		}
			     	if(request.message.content.resolve){
			     		options.resolve = request.message.content.resolve;
			     	}
			     	sendMessageTabActive(options);
			    }
		        // console.log(ret, request.message.content);
		        console.log(ret);
		    },
		    error:function(){
		        alert("Error");
		    }      
		});
	}
	return sendResponse("THANKS from background!");
});