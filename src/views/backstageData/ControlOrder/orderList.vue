<route lang="yaml">
	meta: title:订单管理
</route>

<script setup lang="ts">
	import {
		Delete,
		Edit,
		Search,
		Share,
		Upload
	} from "@element-plus/icons-vue";
	import api from "@/api";
	import http from "@/api/plugin";
	import {
		ref,
		onMounted,
		computed,
		reactive
	} from "vue";
	import storage from "@/utils/storage";
	import {
		exportJsonToExcel
	} from '@/utils/Export2Excel';
	import {
		ElMessage,
		ElMessageBox,
		TabsPaneContext
	} from "element-plus";
	import EditDetails from "./components/editDetails.vue";
	import ViewDetails from "./components/viewDetails.vue";
	import JSONBIG from "json-bigint";
	import table2excel from 'js-table2excel'
	const router = useRouter();
	const tableData = ref([]);
	const tableData2 = ref([]);
	const adminId: any = storage.local.get("adminId");
	const total = ref(0);
	const total2 = ref(0);
	const businessId: any = ref("");
	const businessId2: any = ref("");
	const size = ref("-1");
	const loading = ref(false);
	const loading2 = ref(false);
	const listvalue = ref(true); // 控制列表格式 
	const expandall = ref(false)
	const tableobj = reactive({
		currentPage: 1,
		pageSize: 10,
		keyword: "",
	});
	// 销售汇总
	const salsForm: any = ref({
		current: 1,
		startDateTime: "",
		endDateTime: "",
		keyword: "",
		size: 10,
		businessId: ""
	})
	const salasList: any = ref([]);
	// 日期范围
	const value1 = ref < [Date, Date] > ([
		new Date(2000, 10, 10, 10, 10),
		new Date(2000, 10, 11, 10, 10),
	])
	const value3 = ref < [Date, Date] > ([
		new Date(2000, 10, 10, 10, 10),
		new Date(2000, 10, 11, 10, 10),
	])
	// const list3=ref([])
	const value2 = ref('')
	const starttime: any = ref('')
	const endtime: any = ref('')
	const loadingType: any = ref('-1')
	const exportSals: any = ref('0')

	function changeTime() {
		starttime.value = value1.value[0];
		endtime.value = value1.value[1];
		// getMallSetting()
	}

	function changeTime2() {
		salsForm.value.startDateTime = value3.value[0];
		salsForm.value.endDateTime = value3.value[1];
	}

	function exportOrders() {
		loadingType.value = 1;
		exportStatus.value = 1;
		tableobj.pageSize = 1000;
		getMallSetting();
	}
	function exportOrders2() {
		// loadingType2.value=1
		exportSals.value = 1
		salsForm.size = 1000;
		saleTotalList();
	}
	const shortcuts = [{
			text: 'Last week',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
				return [start, end]
			},
		},
		{
			text: 'Last month',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
				return [start, end]
			},
		},
		{
			text: 'Last 3 months',
			value: () => {
				const end = new Date()
				const start = new Date()
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
				return [start, end]
			},
		},
	]
	// 列表格式
	function changeformat(val: any) {
		if (val) {
			loadingType.value = -1;
			expandall.value = false;
			tableobj.pageSize = 10;
			listvalue.value = true;
			getMallSetting();
		} else {
			loadingType.value = 1;
			tableobj.pageSize = 10;
			expandall.value = true;
			listvalue.value = false;
			getMallSetting();
		}
		console.log(listvalue.value, '列表格式列表格式')
	}
	// 导出表格数据
	const DialogVisible2: any = ref(false);
	const exportStatus: any = ref('0')
	const DialogTitle: any = ref('销售汇总');
	const datas: any = reactive({
		arr: []
	}); //这里用四个对象来模拟接口中得到的object型数据
	const orderItemInfo: any = ref({
		"StoreName": '',
		"orderId": '',
		"orderNo": "",
		"createOrderTime": '', // 下单时间
		"orderType": '',
		"orderStatus": "",
		"expressMoney": "", // 快递费
		"orderMoney": '',
		"payType": '微信支付',
		"logisticsType": '', // 配送方式
		"goodsInfo": "",
		"userId": '',
		"userName": "",
		"consigneeName": '',
		"consigneePhone": '',
		"consigneeAddress": '',
		"orderMark": ''
	})
	const goodsList: any = ref([])
	const excelInfo: any = ref({
		header: ["店铺名称", "订单ID", "订单编号", "下单时间", "订单类型", "订单状态", "快递费", "订单金额", "支付方式",
			"配送方式", "商品", "买家用户ID", "买家昵称", "收货人姓名", "收货人电话/自提电话", "收货地址", "订单备注"
		],
		data: []
	})

	function exportToExcel() {
		loadingType.value = -1;
		let data2 = []
		for (const key in datas.value.arr) {
			let data1 = []
			data1.push(datas.value.arr[key].StoreName, datas.value.arr[key].orderId,
				datas.value.arr[key].orderNo, datas.value.arr[key].createOrderTime, datas.value.arr[key].orderType,
				datas.value.arr[key].orderStatus, datas.value.arr[key].expressMoney, datas.value.arr[key].orderMoney,
				datas.value.arr[key].payType, datas.value.arr[key].logisticsType, datas.value.arr[key].goodsInfo,
				datas.value.arr[key].userId, datas.value.arr[key].userName, datas.value.arr[key].consigneeName,
				datas.value.arr[key].consigneePhone, datas.value.arr[key].consigneeAddress, datas.value.arr[key]
				.orderMark)
			data2.push(data1)
		}
		excelInfo.value.data = data2;
		exportJsonToExcel(excelInfo.value)
		datas.value = {
			arr: []
		}
		goodsList.value = []
		tableobj.pageSize = 10;
		exportStatus.value = 0;
		getMallSetting();
	}
	// 销售汇总导出
	function exportToExcel2() {
		console.log('销售汇总导出销售汇总导出')
		const column = [{
				title: '商品ID',
				key: 'goodsID',
				type: 'text'
			},
			{
				title: '商品图片',
				key: 'goodsImage',
				type: 'image',
				width: 100,
				height: 100
			}, {
				title: '商品名称',
				key: 'goodsName',
				type: 'text'
			}, {
				title: '商品规格',
				key: 'goodsSpe',
				type: 'text'
			}, {
				title: '销售金额(元)',
				key: 'salsMoney',
				type: 'text'
			}, {
				title: '销售数量',
				key: 'salsNum',
				type: 'text'
			}
		]
		const excelName = '月份订单' //文件名称
		exportSals.value = 0;
		console.log(salasList.value, '月份订单月份订单')
		table2excel(column, salasList.value, excelName); //生成Excel表格，自动下载

		salasList.value = []
	}

	const businessList: any = ref([]);
	const businessList2: any = ref([]);

	function getDianpu() {
		api.get("/api/plugs/getBusinessInfo").then((res: any) => {
			if (res.code == 200) {
				res.body.forEach((item: any) => {
					item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
					businessList.value.push(item.jsonViewData);
					businessList2.value.push(item.jsonViewData);
				});
			}
		});
	}
	onBeforeMount(() => {
		getMallSetting();
		getDianpu();
	});
	// 销售汇总
	function saleTotal() {
		DialogVisible2.value = true;
	}

	function handleSizeChange2(val: any) {
		salsForm.value.size = val;
		saleTotalList();
	}

	function handleCurrentChange2(val: any) {
		salsForm.value.current = val;
		saleTotalList();
	}

	function saleTotalList() {
		loading2.value = true;
		api.get('/api/order/getOrderItemStatistics', {
			params: salsForm.value
		}).then((res: any) => {
			if (res.code == 200) {
				loading2.value = false;
				tableData2.value = res.body.list;
				total2.value = res.body.total;
				if (exportSals.value == 1) {
					tableData2.value.forEach((item: any) => {
						const obj = {
							goodsID: '',
							goodsImage: '',
							goodsName: '',
							goodsSpe: '',
							salsMoney: "",
							salsNum: ""
						};
						obj.goodsID = item.goodsId;
						obj.goodsImage = item.previewUrl;
						obj.goodsName = item.goodName;
						obj.goodsSpe = item.goodsSpecificationName;
						obj.salsMoney = item.payTotalAmount;
						obj.salsNum = item.goodsNum;
						salasList.value.push(obj);
					})
					exportToExcel2();
				}
			}
		})
	}
	// 批量发货
	function deliverGoods() {
		let data = {
			ids: idlist.value.join(),
		};
		api.post('/api/order/orderSendGoods', data).then((res: any) => {
			if (res.code == 200) {
				ElMessage.success({
					message: res.msg,
					center: true,
				});
				getMallSetting();
			} else {
				ElMessage.error({
					message: res.msg,
					center: true,
				});
			}
		})
	}

	function getMallSetting() {
		loading.value = true;
		let data: any = {
			page: tableobj.currentPage,
			size: tableobj.pageSize,
			keyword: tableobj.keyword,
			adminId: storage.local.get("adminId"),
			userServiceToken: storage.local.get("userServiceToken"),
			businessId: businessId.value != "" ? businessId.value : -1,
			orderStatus: activeName.value,
			startDateTime: starttime.value,
			endDateTime: endtime.value,
			loadingType: loadingType.value
		};
		api
			.get("/api/order/searchOrderList", {
				params: data,
			})
			.then((res: any) => {
				if (res.code == 200) {
					loading.value = false;
					tableData.value = res.body.list;
					total.value = res.body.total;
					let orderArr = res.body.list;
					orderArr.forEach((item3: any) => {
						item3.bussinessId = item3.bussinessId.toString();
						item3.id = item3.id.toString();
						item3.orderStatus = item3.orderStatus.toString();
					})
					if (tableData.value && loadingType.value == 1 && exportStatus.value == 1) {
						orderArr.forEach((item: any) => {
							const orderItemInfo = {
								"StoreName": '',
								"orderId": '',
								"orderNo": "",
								"createOrderTime": '', // 下单时间
								"orderType": '',
								"orderStatus": "",
								"expressMoney": "", // 快递费
								"orderMoney": '',
								"payType": '微信支付',
								"logisticsType": '', // 配送方式
								"goodsInfo": "",
								"userId": '',
								"userName": "",
								"consigneeName": '',
								"consigneePhone": '',
								"consigneeAddress": '',
								"orderMark": ''
							}
							businessList.value.forEach((item2: any) => {
								if (item.bussinessId == item2.businessId) {
									orderItemInfo.StoreName = item2.businessName;
								}
							})
							if (item.orderType == 0) {
								orderItemInfo.orderType = "普通订单"
							}
							if (item.orderStatus == 0) {
								orderItemInfo.orderStatus = "待付款"
							} else if (item.orderStatus == 2) {
								orderItemInfo.orderStatus = '待发货/自提'
							} else if (item.orderStatus == 3) {
								orderItemInfo.orderStatus = '待收货'
							} else if (item.orderStatus == 4) {
								orderItemInfo.orderStatus = '待使用'
							} else if (item.orderStatus == 5) {
								orderItemInfo.orderStatus = '已完成'
							} else if (item.orderStatus == 7) {
								orderItemInfo.orderStatus = '已失效'
							} else if (item.orderStatus == 8) {
								orderItemInfo.orderStatus = '退款中'
							} else if (item.orderStatus == 9) {
								orderItemInfo.orderStatus = '退款成功'
							} else if (item.orderStatus == 10) {
								orderItemInfo.orderStatus = '退款失败'
							}
							orderItemInfo.orderId = item.id;
							orderItemInfo.orderNo = item.orderNo;
							orderItemInfo.orderMark = item.orderRemark;
							orderItemInfo.createOrderTime = item.createTime;
							orderItemInfo.orderMoney = item.payMoney;
							orderItemInfo.userId = item.userId;
							orderItemInfo.userName = item.userName;
							orderItemInfo.consigneeName = item.orderLogistics.receiverName;
							orderItemInfo.consigneePhone = item.orderLogistics.receiverMobile;
							orderItemInfo.expressMoney = item.orderLogistics.realPayMoney;
							if (item.orderLogistics.receiverAddressJson) {
								let address = JSON.parse(item.orderLogistics.receiverAddressJson);
								orderItemInfo.consigneeAddress = address.province + address.city + address
									.district + address.address;
							}

							if (item.logisticsType = 2) {
								orderItemInfo.logisticsType = '快递配送'
							} else if (item.logisticsType = 3) {
								orderItemInfo.logisticsType = '自提'
							}
							// orderItemInfo.value.logisticsType=item.logisticsType;
							let str = '';
							let list = item.orderItemList;
							for (let i = 0; i < list.length; i++) {
								if (list[i].goodsSpecification !== null) {
									str += list[i].goodName + ' ' + list[i].goodsSpecificationName + ' ' +
										'￥' + list[i].payPrice + ' ' + 'X' + list[i].goodsNum + ' ' + 'SKU:' +
										list[i].goodsSpecification
										.specificationNumber + ';'
								} else {
									str +=  list[i].goodName + ' ' + list[i].goodsSpecificationName +
										' ' + '￥' + list[i].payPrice + ' ' + 'X' + list[i].goodsNum + ' ' +
										'SKU:' + '' + ';'
								}

							}
							orderItemInfo.goodsInfo = str;
							goodsList.value.push(orderItemInfo)
							//  去掉最后一个逗号(如果不需要去掉，就不用写)
							//  if (str.length > 0) {
							//      str = str.substr(0, str.length - 1);
							//  }
						})
						const obj6 = {
							arr: goodsList.value
						}
						datas.value = obj6;
						// console.log("导出表格2222222222222")
						exportToExcel();

					}

					businessId.value = "";
					tableobj.keyword = "";
				}
			});
	}

	function handleSizeChange(val: any) {
		tableobj.pageSize = val;
		getMallSetting();
	}

	function handleCurrentChange(val: any) {
		tableobj.currentPage = val;
		getMallSetting();
	}
	// 时间转换
	function formatDate(row: any, column: any, cellValue: any, index: any) {
		var dateee = new Date(cellValue).toJSON();
		return new Date(+new Date(dateee) + 8 * 3600 * 1000)
			.toISOString()
			.replace(/T/g, " ")
			.replace(/\.[\d]{3}Z/, "");
	}

	const multipleSelection: any = ref([]);
	const idlist: any = ref([]);
	const handleSelectionChange = (val: any) => {
		multipleSelection.value = val;
		idlist.value = multipleSelection.value.map((item: any) => {
			return item.id;
		});
		console.log();
	};
	// 批量删除
	const delPlugin = () => {
		let data = {
			ids: idlist.value.join(),
		};
		// ids.push(idlist.value);
		ElMessageBox.confirm(`确认删除吗？`, "确认信息")
			.then(() => {
				api.post("/api/order/delOrder", data).then((res: any) => {
					if (res.code == 200) {
						ElMessage.success({
							message: res.msg,
							center: true,
						});
						getMallSetting();
					} else {
						ElMessage.error({
							message: res.msg,
							center: true,
						});
					}
				});
			})
			.catch(() => {});
	};
	// 删除
	const handleClick = (e: any) => {
		console.log(e);
		let data = {
			ids: e,
		};

		ElMessageBox.confirm(`确认删除吗？`, "确认信息")
			.then(() => {
				api.post("/api/order/delOrder", data).then((res: any) => {
					if (res.code == 200) {
						ElMessage.success({
							message: res.msg,
							center: true,
						});
						getMallSetting();
					} else {
						ElMessage.error({
							message: res.msg,
							center: true,
						});
					}
				});
			})
			.catch(() => {});
	};
	const formModeProps: any = ref({
		visible: false,
		visible1: false,
		id: "",
		id1: "",
	});
	const editDetails = (item: any) => {
		formModeProps.value.visible = true;
		formModeProps.value.id = item;
	};
	const viewDetails = (item: any) => {
		formModeProps.value.visible1 = true;
		formModeProps.value.id1 = item;
	};
	ViewDetails;
	// 刷新组件
	function update() {
		getMallSetting();
		formModeProps.value.visible = false;
	}

	function update1() {
		getMallSetting();
		formModeProps.value.visible1 = false;
	}
	// 更改状态
	const dialogVisible = ref(false);
	const orderStatus: any = ref(0);
	const content: any = ref({});
	const statusList: any = ref([{
			id: 0,
			name: "待付款"
		},
		{
			id: 1,
			name: "待接单"
		},
		{
			id: 2,
			name: "待发货/待服务/待取货"
		},
		{
			id: 3,
			name: "待收货/待确认"
		},
		{
			id: 4,
			name: "待使用"
		},
		{
			id: 5,
			name: "已完成"
		},
		{
			id: 6,
			name: "已取消"
		},
		{
			id: 7,
			name: "已失效"
		},
		{
			id: 8,
			name: "退款中"
		},
		{
			id: 9,
			name: "退款成功"
		},
		{
			id: 10,
			name: "退款失败"
		},
	]);

	const editClick = (item: any) => {
		orderStatus.value = item.orderStatus;
		dialogVisible.value = true;
		let data = {
			id: item.id.toString(),
		};

		api
			.get("/api/order/getOrderInfoById", {
				params: data,
			})
			.then((res: any) => {
				console.log(res);
				if (res.code == 200) {
					content.value = res.body;
				}
			});
	};
	const change = (done: any) => {
		console.log(done);
		content.value.orderStatus = done;
		console.log(content.value);
	};
	const handleClose = () => {
		http.post("/api/order/updateOrder", content.value).then((res: any) => {
			console.log(res);
			if (res.code == 200) {
				dialogVisible.value = false;
				getMallSetting();
			}
		});
	};
	const activeName: any = ref("-1");
	const changeClick = () => {
		getMallSetting();
	};
</script>

<template>
	<div>
		<!-- 销售汇总 -->
		<div v-if="DialogVisible2">
			<el-dialog v-model="DialogVisible2" title="销售汇总" width="1000px" v-loading="loading2"
				element-loading-text="加载中..." :close-on-click-modal="false" :show-close="false" append-to-body
				destroy-on-close>
				<div class="header-right" style="display: flex; justify-content: end;align-items: center;">
					<div style="width: 360px !important;height: 40px !important;margin-right: 50px;">
						<el-date-picker size="large" v-model="value3" @change="changeTime2"
							value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange" range-separator="To"
							start-placeholder="开始日期" end-placeholder="结束日期" />
					</div>

					<el-select size="large" v-model="salsForm.businessId" filterable placeholder="选择店铺">
						<el-option v-for="item in businessList2" :key="item.businessId" :label="item.businessName"
							:value="item.businessId" />
					</el-select>
					<div class="lang" style="margin-left: 10px;">
						<el-input style="width: 150px; height: 40px" v-model="salsForm.keyword" placeholder="搜索商品"
							@keyup.enter.native="saleTotalList" />
					</div>
					<el-button type="success" style="height: 40px; margin: 0 0px 0 10px" @click="exportOrders2()">
						<template #icon>
							<el-icon>
								<Position />
							</el-icon>
						</template>
						导出
					</el-button>
					<el-button type="primary" style="height: 40px; margin: 0 10px 0 10px" @click="saleTotalList">
						<template #icon>
							<el-icon>
								<svg-icon name="i-ep:search" />
							</el-icon>
						</template>
						搜索
					</el-button>
				</div>
				<div style="padding: 20px">
					<el-table :data="tableData2" v-loading="loading2" element-loading-text="加载中..."
						style="width: 100%;height: 500px;" :header-cell-style="{
          background: '#f3f6fd',
          color: '#555',
          textAlign: 'center',
        }">
						<el-table-column prop="goodsId" width="100" label="商品ID" align="center" />
						<el-table-column prop="rotationImgsJson" width="120" label="商品图片" align="center">
							<template #default="scope">
								<div style="
                display: flex;
                align-items: center;
                justify-content: center;
              ">
									<img style="width: 40px; height: 40px" :src="scope.row.plugsGoods.previewUrl"
										alt="" />
								</div>
							</template>
						</el-table-column>
						<el-table-column label="商品名称" prop="goodName" width="280" show-overflow-tooltip align="center">
						</el-table-column>
						<el-table-column prop="goodsSpecificationName" label="商品规格" align="center" width="200">
						</el-table-column>
						<el-table-column prop="payTotalAmount" label="销售金额(元)" align="center" width="120">
						</el-table-column>
						<el-table-column prop="goodsNum" label="销售数量" align="center" width="120">
						</el-table-column>
					</el-table>
					<div class="example-pagination-block">
						<div>
							<el-pagination background @current-change="handleCurrentChange"
								@size-change="handleSizeChange" :current-page="salsForm.current"
								:page-size="salsForm.size" layout="prev,pager,next,total" :total="total2">
							</el-pagination>
						</div>
					</div>
				</div>
				<template #footer>
					<el-button size="large" @click="DialogVisible2=false"> 取消 </el-button>
					<el-button type="primary" size="large" @click="DialogVisible2=false">
						确定
					</el-button>
				</template>
			</el-dialog>
		</div>
		<!-- 销售汇总 end -->
		<div>
			<page-main>
				<el-tabs v-model="activeName" class="demo-tabs" @tab-change="changeClick">
					<el-tab-pane label="全部" name="-1"></el-tab-pane>
					<el-tab-pane label="待付款" name="0"></el-tab-pane>
					<el-tab-pane label="待接单" name="1"></el-tab-pane>
					<el-tab-pane label="待发货/待服务/待取货" name="2"></el-tab-pane>
					<el-tab-pane label="待收货/待确认" name="3"></el-tab-pane>
					<el-tab-pane label="待使用" name="4"></el-tab-pane>
					<el-tab-pane label="已完成" name="5"></el-tab-pane>
					<el-tab-pane label="已取消" name="6"></el-tab-pane>
					<el-tab-pane label="已失效" name="7"></el-tab-pane>
					<el-tab-pane label="退款中" name="8"></el-tab-pane>
					<el-tab-pane label="退款成功" name="9"></el-tab-pane>
					<el-tab-pane label="退款失败" name="10"></el-tab-pane>
					<el-tab-pane label="待结算" name="11"></el-tab-pane>
					<el-tab-pane label="已结算" name="12"></el-tab-pane>
					<el-tab-pane label="结算失败" name="13"></el-tab-pane>
				</el-tabs>
				<div style="margin-bottom: 20px">
					<div style="
              margin: 0 0 10px 0;
              display: flex;
              justify-content: space-between;
            ">
						<div style="display: flex;align-items: center;">
							<el-button type="success" :icon="Share" @click="saleTotal">销售汇总</el-button>

							<el-button type="danger" @click="delPlugin" :disabled="!multipleSelection.length">
								<template #icon>
									<el-icon>
										<svg-icon name="ep:delete" />
									</el-icon>
								</template>
								批量删除
							</el-button>
							<el-button type="primary" @click="exportOrders()">
								<template #icon>
									<el-icon>
										<Position />
									</el-icon>
								</template>
								导出
							</el-button>
							<el-button type="primary" v-if="activeName==2" @click="deliverGoods">
								<template #icon>
									<el-icon>
										<Files />
									</el-icon>
								</template>
								批量发货
							</el-button>
							<div
								style="display: flex;height: 32px;align-items: center;border: 1px solid #e4e6e9;border-radius: 6px;width: 160px;justify-content: center;margin-left: 8px;">
								<el-tooltip
        class="box-item"
        effect="dark"
        content="此功能仅对商品订单有效"
        placement="top-start"
      >
								<div style="display: flex;align-items: center;">
									<p style="font-size: 15px;">列表格式:</p>
									<el-switch v-model="listvalue" class="ml-2" @change="changeformat" width="60"
										style="--el-switch-on-color: #409eff; --el-switch-off-color: #fb5531"
										inline-prompt active-text="简洁" inactive-text="详细" />
								</div>
							</el-tooltip>
							</div>
						</div>
						<div style="display: flex">
							<div style="margin-right: 8px;display: flex;align-items: center;">
								<el-date-picker v-model="value1" @change="changeTime" value-format="YYYY-MM-DD HH:mm:ss"
									type="datetimerange" range-separator="To" start-placeholder="开始日期"
									end-placeholder="结束日期" />
							</div>

							<el-select v-model="businessId" filterable placeholder="选择店铺">
								<el-option v-for="item in businessList" :key="item.businessId"
									:label="item.businessName" :value="item.businessId" />
							</el-select>
							<div class="lang">
								<el-input style="width: 150px; margin: 0 15px" v-model="tableobj.keyword"
									placeholder="请输入" @keyup.enter.native="getMallSetting" />
							</div>
							<el-button :icon="Search" @click="getMallSetting()">搜索</el-button>
						</div>
					</div>
					<div>
						<el-table :data="tableData" v-loading="loading" :default-expand-all="expandall"
							element-loading-text="加载中..." style="width: 100%" :header-cell-style="{
                background: '#f3f6fd',
                color: '#555',
                textAlign: 'center',
              }" @selection-change="handleSelectionChange">
							<!-- 展开订单详情 -->
							<el-table-column type="expand" v-if="listvalue==false" width="1">
								<template #default="props">
									<div v-if="props.row.orderType==0" >
										<div
											style="display:flex;align-items: center;justify-content:space-between;padding:0 100px 0 30px;width: 100%;">
											<div  >
											<div v-for="item in props.row.orderItemList" :key="item.id"
											style="display:flex;align-items: center;justify-content:space-between;"
												>
												<div style="display:flex;align-items: center;width:360px;">
													<div>
														<img v-if="item.goodsSpecification!=null"
															style="width: 60px; height: 60px;margin-right:8px;margin-bottom:3px"
															:src="item.previewUrl" alt="" />
														<img v-else
															style="width: 60px; height: 60px;margin-right:8px;margin-bottom:3px"
															:src="item.previewUrl" alt="" />
													</div>
													<div>
														<p>{{ item.goodName}}</p>
														<p>{{ item.goodsSpecificationName}}</p>
													</div>
												</div>
												<div style="width:240px">数量:x{{item.goodsNum}}</div>
												<div style="width:200px">
													<div v-if="item.goodsSpecification">
														单价:￥{{item.goodsSpecification.dealPrice}}</div>
													<div v-else>单价:￥{{item.goodsPrice}}</div>
												</div>
												<div style="width:200px">
													<div v-if="item.orderStatus==0">待付款</div>
													<div v-else-if="item.orderStatus==1">待接单</div>
													<div v-else-if="item.orderStatus==2">待发货/待服务/待取货</div>
													<div v-else-if="item.orderStatus==3">待收货/待确认</div>
													<div v-else-if="item.orderStatus==4">待使用</div>
													<div v-else-if="item.orderStatus==5">已完成</div>
													<div v-else-if="item.orderStatus==6">已取消</div>
													<div v-else-if="item.orderStatus==7">已失效</div>
													<div v-else-if="item.orderStatus==8">退款中</div>
													<div v-else-if="item.orderStatus==9">退款成功</div>
													<div v-else-if="item.orderStatus==10">退款失败</div>
													<div v-else-if="item.orderStatus==11">待结算</div>
													<div v-else-if="item.orderStatus==12">结算中</div>
													<div v-else-if="item.orderStatus==13">已结算</div>
													<div v-else-if="item.orderStatus==14">结算失败</div>
												</div>
											 
											</div>
										   </div>
											<div>
												<p> <span>姓名:</span>{{ props.row.orderLogistics.receiverName}} </p>
												<p> <span>电话:</span>{{ props.row.orderLogistics.receiverMobile}} </p>
												<p>
													<span>地址:</span>
													{{ JSON.parse(props.row.orderLogistics.receiverAddressJson).province + 
                                                     JSON.parse(props.row.orderLogistics.receiverAddressJson).city +
                                                     JSON.parse(props.row.orderLogistics.receiverAddressJson).district +
                                                     JSON.parse(props.row.orderLogistics.receiverAddressJson).address}}
												</p>
											</div>
										</div>
										<div
											style="display:flex;font-size:14px;color:#999;align-items:center;background:#f9f9f9;padding:0 100px 0 30px;width:100%">
											<div style="width:360px">
												<p>订单号:{{ props.row.orderNo}}</p>
												<p>订单备注:{{ props.row.orderRemark}}</p>
											</div>
											<div style="width:240px;">
												<p>下单时间:{{ props.row.createTime}}</p>
												<p>支付时间:{{ props.row.payTime}}</p>
											</div>
											<div style="width:200px">
												<p>订单合计:￥{{ props.row.payMoney}}</p>
												<p>订单优惠:￥{{ props.row.couponPrice}}</p>
											</div>
											<div style="width:200px">
												<p v-if="props.row.logisticsType==1">配送方式:配送</p>
												<p v-else-if="props.row.logisticsType==2">配送方式:快递</p>
												<p v-else-if="props.row.logisticsType==3">配送方式:自提</p>
												<p v-else-if="props.row.logisticsType==4">配送方式:到店消费</p>
												<p v-else-if="props.row.logisticsType==5">配送方式:上门服务</p>
												<p v-else-if="props.row.logisticsType==0">配送方式:快递</p>
												<p>配送费:￥{{ props.row.distributionFee}}</p>
											</div>
										</div>
									</div>
								</template>

							</el-table-column>
							<!-- 展开订单详情end -->
							<el-table-column type="selection" width="40" />
							<!-- <el-table-column
                label="订单ID"
                width="200"
                align="center"
                prop="id"
                show-overflow-tooltip
              >
              </el-table-column> -->
							<el-table-column label="订单编号" prop="orderNo" width="250" show-overflow-tooltip
								align="center">
							</el-table-column>

							<el-table-column label="配送方式" align="center">
								<template #default="scope">
									<div v-if="scope.row.logisticsType == 1">配送</div>
									<div v-else-if="scope.row.logisticsType == 2">快递</div>
									<div v-else-if="scope.row.logisticsType == 3">自提</div>
									<div v-else-if="scope.row.logisticsType == 4">到店消费</div>
									<div v-else-if="scope.row.logisticsType == 5">上门服务</div>
									<div v-else-if="scope.row.logisticsType == 0">快递</div>
								</template>
							</el-table-column>
							<el-table-column label="商品数量" align="center">
								<template #default="scope">
									<div style="
                      display: flex;
                      justify-content: center;
                      align-items: center;
                    ">
										{{ scope.row.goodsTotalNum }}
									</div>
								</template>
							</el-table-column>

							<el-table-column label="实际支付" align="center">
								<template #default="scope">
									<div>
										<span style="color: red">¥{{ scope.row.payMoney }}</span>
									</div>
								</template>
							</el-table-column>

							<!-- <el-table-column label="支付方式" align="center">
                <template #default="scope">
                  <div v-if="scope.row.payType == 1">微信支付</div>
                  <div v-if="scope.row.payType == 2">支付宝支付</div>
                </template>
              </el-table-column> -->

							<el-table-column label="下单时间" prop="updateTime" align="center" :formatter="formatDate">
							</el-table-column>
							<el-table-column label="订单状态" align="center" fixed="right" width="80">
								<template #default="scope">
									<div style="color: #ff4f4f">
										<div v-if="scope.row.orderStatus == 0">待付款</div>
										<div v-else-if="scope.row.orderStatus == 1">待接单</div>
										<div v-else-if="scope.row.orderStatus == 2">
											<div v-if="scope.row.orderType == 3">待服务</div>
											<div v-else="scope.row.orderType != 3">待发货</div>
										</div>
										<div v-else-if="scope.row.orderStatus == 3">
											<div v-if="scope.row.orderType == 3">待确认</div>
											<div v-else="scope.row.orderType != 3">待收货</div>
										</div>
										<div v-else-if="scope.row.orderStatus == 4">待使用</div>
										<div v-else-if="scope.row.orderStatus == 5" style="color: #4cd909">
											已完成
										</div>
										<div v-else-if="scope.row.orderStatus == 6" style="color: #606266">
											已取消
										</div>
										<div v-else-if="scope.row.orderStatus == 7" style="color: #606266">
											已失效
										</div>
										<div v-else-if="scope.row.orderStatus == 8">退款中</div>
										<div v-else-if="scope.row.orderStatus == 9">退款成功</div>
										<div v-else-if="scope.row.orderStatus == 10">退款失败</div>
									</div>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="操作" align="center" width="250">
								<template #default="scope">
									<el-button v-if="adminId != 39" link type="primary" size="small"
										@click="editDetails(scope.row.id)">编辑</el-button>
									<el-button link type="primary" size="small" @click="viewDetails(scope.row.id)">查看
									</el-button>
									<el-button link type="danger" size="small" @click="handleClick(scope.row.id)">删除
									</el-button>
									<el-button link type="primary" size="small" @click="editClick(scope.row)">更改状态
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<!-- 订单详情 -->

					<el-dialog v-model="dialogVisible" title="Tips" width="30%">
						<div style="display: flex; justify-content: center; align-items: center">
							<el-select v-model="orderStatus" filterable placeholder="请选择" @change="change(orderStatus)">
								<el-option v-for="item in statusList" :key="item.id" :label="item.name"
									:value="item.id" />
							</el-select>
						</div>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogVisible = false">取消</el-button>
								<el-button type="primary" @click="handleClose"> 确定 </el-button>
							</span>
						</template>
					</el-dialog>

					<div style="
              display: flex;
              justify-content: center;
              align-items: center;
              position: relative;
              top: 20px;
              right: 60px;
            ">
						<el-pagination background @current-change="handleCurrentChange" @size-change="handleSizeChange"
							:current-page="tableobj.currentPage" :page-size="tableobj.pageSize"
							layout="prev,pager,next,total" :total="total">
						</el-pagination>
					</div>
				</div>
			</page-main>
			<EditDetails v-if="formModeProps.visible" v-model="formModeProps.visible" :id="formModeProps.id"
				@success="update"></EditDetails>
			<ViewDetails v-if="formModeProps.visible1" v-model="formModeProps.visible1" :id="formModeProps.id1"
				@success="update1"></ViewDetails>
		</div>

	</div>
</template>
<style scoped>
	.block {
		padding: 30px 0;
		text-align: center;
		border-right: solid 1px var(--el-border-color);
		flex: 1;
	}

	.block:last-child {
		border-right: none;
	}

	.block .demonstration {
		display: block;
		color: var(--el-text-color-secondary);
		font-size: 14px;
		margin-bottom: 20px;
	}

	/* .el-table__expand-icon {
  visibility:hidden !important;
} */
	:deep(.el-table__expand-icon) {
		display: none;
	}
</style>
