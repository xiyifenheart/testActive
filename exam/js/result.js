$(function () {
	$('title').html(sessionStorage.getItem('title'));
	$.ajax({
		type:"get",
		url:"http://weixin.hzdlsoft.com/slh/api.do?apiKey=exam-paper-get",
		data: {paperId: window.name},
		async:true,
		dataType: 'jsonp',
		jsonp: 'jsonpCallback',
		success: function (res) {
			console.log(res);
			if (res.code == 0) {
				setLi(res.data.itemList);
			}
		},
		error: function (err) {
			console.log(err);
		}	
	});
	
	function setLi (arr) {
		for (var i = 0; i < arr.length; i++) {
			var oLi = $("<li></li>");
			var oP = $("<p>" + (i + 1) + '、' + arr[i].itemTitle + "</p>")
			oLi.append(oP);
			for (var j = 0; j< arr[i].itemContent.length; j++) {
				var str = '';
				switch (j){
					case 0:str = 'A、'
						break;
					case 1:str = 'B、'
						break;
					case 2:str = 'C、'
						break;
					case 3:str = 'D、'
						break;
					default:
						break;
				}
				var oSpan = $("<span>" + str + arr[i].itemContent[j].op + "&nbsp;</span>");
				if (arr[i].itemContent[j].op.length > 5) {
					oSpan.addClass('span-block');
				}
				
				if (arr[i].itemContent[j].op == arr[i].itemAnswer) {
					oSpan.addClass('red-span');
				}
				oLi.append(oSpan);
			}
			$('.container ul').append(oLi);
		}
	}
});