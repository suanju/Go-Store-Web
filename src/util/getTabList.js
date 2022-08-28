import { QSRequest } from '@/util/request/QS-request.js';
function getTabList(data = {})
{
	console.log(QSRequest({
		urlField: 'testUrlList.testUrl',
		sendData: {
			data,
			method: 'GET'
		},
		field: 'page',
		filterFn: filterTabList
	}))
	return QSRequest({
		urlField: 'testUrlList.testUrl',
		sendData: {
			data,
			method: 'GET'
		},
		field: 'page',
		filterFn: filterTabList
	});
}

function filterTabList(page) {	//过滤数据
	// console.log(page)
	// const list = page.list;
	// for(let i = 0; i < list.length; i++) {
	// 	let item = list[i];
	//
	// 	item.text += (' 过滤');
	//
	// 	list[i] = item;
	// }
	// page.list = list;
	console.log(page)
	return page;
}

module.exports = {
	getTabList
}
