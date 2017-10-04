var mongo = require('mongodb').MongoClient,
	client = require('socket.io').listen(8080).sockets;
console.log("Trying to connect to monogdb.....");
mongo.connect("mongodb://mayankchat:mayankchat@127.0.0.1/chat",function(err,db){
	if (err) throw err;
	console.log("Connected to mongodb!");
	var col = db.collection('messages');
	client.on('connection',function(socket){
		console.log('Someone has conneted');
		
		col.find().limit(100).sort({_id:1}).toArray(function(err,res){
			if (err) throw err;
			socket.emit('output',res);
		});

		socket.on('input',function(data){
			
			var name = data.name;
			var message = data.message;
			var send_status = function(s){
				socket.emit('status',s);
			};	
			var whitespacePattern = /^\s*$/;

			if (whitespacePattern.test(name) || whitespacePattern.test(message)){
				send_status("Name and message are required");
			}
			else {
				col.insert({name:name,message:message},function(err){
					if(err) throw err;
					console.log('Data inserted...');

					client.emit('output',[data]);
					send_status("Message sent !");
				});
			}
			
		});

	});

});























