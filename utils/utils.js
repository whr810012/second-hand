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

export const fileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		///专门用来读文件的工具类
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}
