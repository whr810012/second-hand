// 计算两点间距离
export const space = (lat1, lng1, lat2, lng2) => {
	console.log(lat1, lng1, lat2, lng2)
	var radLat1 = lat1 * Math.PI / 180.0;
	var radLat2 = lat2 * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
		Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6371;
	s = Math.round(s * 10000) / 10000;
	return s // 单位千米
}

// 发财车icon
export const CarOfWealth = {
	id: 999999,
	index: 999999,
	latitude: 22.212343,
	longitude: 113.554778,
	nav_lat: 22.212343,
	nav_long: 113.554778,
	iconPath: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/9999_402_186.png',
	width: 134,
	height: 62,
	joinCluster: false,
	alpha: 1,
	position: {
		lat: 22.212343,
		long: 113.554778,
		nav_lat: 22.212343,
		nav_long: 113.554778,
	},
	icon_file: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/9999_402_186.png',
	item: {
		id: 999999,
		index: 999999,
		latitude: 22.212343,
		longitude: 113.554778,
		nav_lat: 22.212343,
		nav_long: 113.554778,
		width: 134,
		height: 62,
		position: {
			lat: 22.212343,
			long: 113.554778,
			nav_lat: 22.212343,
			nav_long: 113.554778,
		},
		name: '发财车',
		icon_file: 'https://tutu-aomen.s3.cn-northwest-1.amazonaws.com.cn/poi_icons/9999_402_186.png',
	},
	customCallout: {
		anchorY: 10,
		anchorX: 0,
		display: 'ALWAYS'
	},

}

// 后端传来日期格式化
export const formatDate = (str) => {
	if (!str) {
		uni.showToast({
			icon: 'exception',
			title: '网络错误，请检查网络'
		})
		return false
	}
	const date = new Date(str);
	
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");
	
	const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	console.log(formattedDate);
	return formattedDate
}

// 比较时间先后
export const currentDate = (str) => {
	if (!str) {
		uni.showToast({
			icon: 'exception',
			title: '网络错误，请检查网络'
		})
		return false
	}
	const givenDate = new Date(str);
	const currentDate = new Date();
	
	if (givenDate < currentDate) {
	  console.log("给定时间在当前时间之前");
	  return 'before'
	} else if (givenDate > currentDate) {
	  console.log("给定时间在当前时间之后");
	  return 'after'
	} else {
	  console.log("给定时间与当前时间相同");
	  return 'after'
	}
}