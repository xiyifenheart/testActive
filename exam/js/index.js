$(function () {
	var itemArr = [];//传给后台的数组
	var urlObj = GetRequest();
	sessionStorage.setItem('instId', urlObj.instId);
	//解析URL
	function GetRequest() { 
		var url = location.search; //获取url中"?"符后的字串 
		var theRequest = new Object(); 
		if (url.indexOf("?") != -1) { 
			var str = url.substr(1); 
			strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) { 
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
			} 
		} 
		return theRequest; 
	} 
	//获取所有题目
	$.ajax({
         type: "get",
         async: true,
         url: "http://weixin.hzdlsoft.com/slh/api.do?apiKey=exam-paper-get-by-instid&instId=" + urlObj.instId,
         dataType: "jsonp",
         jsonp: "jsonpCallback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
         jsonpCallback:"flightHandler",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
         success: function(res){
         	console.log(res);
         	if (res.code == 0) {
         		window.name = res.data.paperId;	//保存paperId给获取答案页面
				$('title').html(res.data.paperName);
				sessionStorage.setItem('title', res.data.paperName);
				setRes(res.data.itemList);
			}else{
				console.log(res.msg);
			}
         },
         error: function(){
             console.log('数据加载失败！');
         }
     });

	//根据数据创建dom树
	function setRes (itemList) {
		$('.header .num').html('1/' + itemList.length).attr('data-num', itemList.length);
		for (var i = itemList.length - 1; i >= 0 ; i--) {
			var answerDiv = $("<div class='answer' data-itemId='" + itemList[i].itemId + "'></div>");
			
			if(i == 0){
				answerDiv.css('display', 'block');
			}else{
				answerDiv.css('display', 'none');
			}
			
			var titleP = $("<p class='que'>" + (i + 1) + '、' + itemList[i].itemTitle + "</p>");
			var ul = $("<ul></ul>");
			answerDiv.append(titleP);
			answerDiv.append(ul);
			
			for (var j = 0; j < itemList[i].itemContent.length; j++) {
				var li = $("<li><p class='answer-item'>" + itemList[i].itemContent[j].op + "</p></li>");
				ul.append(li);
			}
			$('.answer-box').append(answerDiv);
		}
		
		
	}
	
	//选项的点击事件
	var answerDivBox = $('.answer-box');
	answerDivBox.on('click', '.answer-item', function () {
		var thisAnswer = $(this).parents('.answer');
		thisAnswer.find('.answer-item').removeClass('active-item');
		$(this).addClass('active-item');
		
		var obj = {
			"itemId": $(thisAnswer).attr('data-itemId'),
            "answer": $(this).html()
		}
		itemArr.push(obj);
		
		//当选择完最后一个选项时
		if (thisAnswer.index() <= 0) {
//			window.location.href = 'score.html';
				$.ajax({
					type:"get",
					url:"http://weixin.hzdlsoft.com/slh/api.do?apiKey=exam-submit-result",
					data: {
						jsonParam : JSON.stringify(
						{
						    "instId": urlObj.instId,
						    "itemList": itemArr
						})
					},
					dataType: "jsonp",
         			jsonp: "jsonpCallback",
					async:true,
					success: function (res) {
						console.log(res);
						if (res.code == 0) {
							sessionStorage.setItem('score', res.data.score);
							sessionStorage.setItem('comment', res.data.comment);
							window.location.href = 'score.html';
						}
						
					},
					error: function (err) {
						console.log(err);
					}
				});
			return;
		}
		
		//每次点击给200ms延时，为了显示选项被点击的变化
		setTimeout(function () {
			$('.num').html($('.header .num').attr('data-num') - thisAnswer.index() + 1  + '/' + $('.header .num').attr('data-num'));	
			thisAnswer.css('display', 'none');
			thisAnswer.prev().css('display','block');
		},200)
		
	});
});