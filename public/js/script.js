//jQuery anonymous function'
var socket = io.connect();
$(function(){

	//Client requires a socket connection to the server.
	var $messageForm = $('#messageForm');
	var $message = $('#message');
	var $chat = $('#chat');
	var $menuArea = $('#menuArea');
	var $userFormArea = $('#userFormArea');
	var $userForm = $('#userForm');
	var $mapArea = $('#map');
	var $username = $('#username');
	var $nameError = $('#nameError');
	var $numberOfUsers = $('.numberOfUsers');
    var $usernameList = $('#usernameList');
	var $modal = $('.modal');
	var $chatModal = $('#chatModal');
	var $myLocationButton = $('#myLocationButton');

	function check(data){
		var reg =/<(.|\n)*?>/g; 
		if (reg.test(data) == true) {
    		var ErrorText ='Do not allow HTML TAGS';
    		alert(ErrorText);
    		return false;
    	}
    	return true;
	}

	function modalScrollToBottom(){
		$modal.animate({ scrollTop: $(document).height() }, "slow");
	}
	
	$chatModal.on('shown.bs.modal', function(e){
		modalScrollToBottom();
	});

	$myLocationButton.click(function(){
		updateMyMap();
	});

	$userForm.submit(function(e){
		e.preventDefault();
		var usernameValue = $username.val();
		usernameValue = usernameValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		if(usernameValue!=''&&check(usernameValue)){
			socket.emit('new user', usernameValue, function(data){
				if(data){
					$userFormArea.hide();
					$menuArea.show();
					$mapArea.show();
					updateMyMap();
				}
			});
			$username.val('');
		}else {
			if("undefined" === typeof $nameError.html()){
				var html='<p id="nameError">Please Enter a Proper User Name.</p>';
				$userForm.append(html);		
				$nameError = $('#nameError');				
			}
		}
	});
	
	$messageForm.submit(function(e){
		e.preventDefault();
		var messageValue = $message.val();
		messageValue = messageValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		if(check(messageValue)){
			socket.emit('send message', {msg:messageValue});
			$message.val('');
		}
	});

	socket.on('new message', function(data){
		if(data.msg!=''){
			$chat.append('<div class="clearfix"></div><div class="sentMessage well-sm pull-right">'+data.msg+'</div>');
       		totalMessage = totalMessage+"<br />"+data.msg;
        	addMessage(totalMessage);
			modalScrollToBottom();
		}
	});

	socket.on('new message from others', function(data){
		if(data.msg!=''){
			$chat.append('<div class="clearfix"></div><div class="receivedMessage well-sm pull-left">'+'<strong>'+data.usr+'</strong>: '+data.msg+'</div>');
			modalScrollToBottom();
		}
	});
	
	socket.on('get users', function(data){
		var html ='';
		for(i =0;i<data.length;i++){
			html += '<li class="list-group-item">·'+data[i]+'</li>'
		}
		$usernameList.html(html);
		$numberOfUsers.html(data.length);
	})

});