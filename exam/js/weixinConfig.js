$(function () {
	var myurl = window.location.href;//获取当前网页地址
	$.ajax({
	     type: "get",
	     async: true,
	     url: "http://weixin.hzdlsoft.com/slh/api.do?apiKey=exam-share-weixin-sign",
	     dataType: "jsonp",
	     jsonp: "jsonpCallback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
	     jsonpCallback:"weixin",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
	     data:{
	     	appId: 'wx48a1beaa23748eeb',
	     	url: myurl
	     },
	     success: function(res){
	     	console.log(res);
	     	if (res.code == 0) {
	     		configWX(res.data);
	     	}
	     },
	     error: function(){
	         console.log('加载失败！');
	     }
	});
	
	function configWX(obj){
		
		wx.config({
//		    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		    appId: obj.appId, // 必填，公众号的唯一标识
		    timestamp: obj.timeStamp, // 必填，生成签名的时间戳
		    nonceStr: obj.nonceStr, // 必填，生成签名的随机串
		    signature: obj.signature,// 必填，签名，见附录1
		    jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		
		wx.ready(function(){
			var score = sessionStorage.getItem('score');
			var str = score? '得了'+score+'分，' : '';
			var shareMSg = {
				title: '我参加了服装圈最难答题，'+str+'你也来挑战一下吧！', // 分享标题
			    link: 'http://weixin.hzdlsoft.com/web/exam/index.html?instId=' + sessionStorage.getItem('instId'), // 分享链接
			    imgUrl: 'http://weixin.hzdlsoft.com/web/exam/img/slh.png', // 分享图标
			    success: function () { 
			        $.ajax({
					     type: "get",
					     async: true,
					     url: "http://weixin.hzdlsoft.com/slh/api.do?apiKey=exam-share",
					     dataType: "jsonp",
					     jsonp: "jsonpCallback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
					     jsonpCallback:"weixin",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
					     data:{
					     	jsonParam: JSON.stringify({instId: sessionStorage.getItem('instId')})
					     },
					     success: function(res){
					     	console.log(res);
					     	if (res.code == 0) {
					     		console.log(res.msg);
					     	}
					     },
					     error: function(err){
					         console.log(err);
					     }
					});
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			}
		    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		    wx.onMenuShareTimeline(shareMSg);
			wx.onMenuShareAppMessage(shareMSg)
		
		});
	}
})
