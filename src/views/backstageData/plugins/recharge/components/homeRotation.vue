<template>
	<el-dialog v-model="myVisible" :title="title" width="800px" :close-on-click-modal="false" :show-close="false"
		append-to-body destroy-on-close>
		<div class="content">
			<el-form  ref="formRef" :model="recharge" :rules="formRules" label-width="110px">
				<div>
					<el-form-item  label="充值金额" prop="rechargeMoney">
					  <el-input
					    style="width: 240px"
					    v-model="recharge.rechargeMoney"
					    placeholder="充值面额"
					    type="number"
						min="0"
					    class="input-with-select"
					  >
					    <!-- <template #prepend> ¥ </template> -->
					    <template #append> 元 </template>
					  </el-input>
					</el-form-item>
					<el-form-item  label="赠送金额" prop="giveeMoney">
					  <el-input
					    style="width: 240px"
					    v-model="recharge.giveeMoney"
					    placeholder="赠送金额"
					    type="number"
						min="0"
					    class="input-with-select"
					  >
					    <!-- <template #prepend> ¥ </template> -->
					    <template #append> 元 </template>
					  </el-input>
					</el-form-item>
					<el-form-item label="插件ID" prop="plugsId">
						<el-select v-model="form.plugsId" filterable placeholder="选择插件" disabled>
							<el-option v-for="item in plugsList" :key="item.id" :label="item.title" :value="item.id" />
						</el-select>
					</el-form-item>
					<el-form-item  label="充值备注" prop="remarks">
					  <el-input
					    style="width: 280px"
					    v-model="recharge.remarks"
					    placeholder="充值备注"
					    type="text"
					    class="input-with-select"
					  >
					   
					  </el-input>
					</el-form-item>
					<!-- <el-form-item label="用户服务标识" prop="userServiceToken">
						<el-input v-model="form.userServiceToken" disabled placeholder="请输入" clearable />
					</el-form-item> -->
				</div>
			</el-form>
		</div>
		<template #footer>
			<el-button size="large" @click="onCancel"> 取消 </el-button>
			<el-button type="primary" size="large" @click="onSubmit">
				确定
			</el-button>
		</template>
	</el-dialog>
	<!-- <ChangeGoods
	  v-if="comp.modelValue"
	  v-model="comp.modelValue"
	  @success="update"
	></ChangeGoods> -->
</template>

<script lang="ts" setup>
	import api from "@/api/plugin";
	// import ChangeGoods from "@/components/changeGoods/index.vue";
	import {
		UploadProps,
		ElMessage
	} from "element-plus";
	import storage from "@/utils/storage";
	import useUserStore from "@/store/modules/user";
	import JSONBIG from "json-bigint";
import { JSONStringify } from "lib/tool";
	const route = useRoute();
	const userStore = useUserStore();
	const props = withDefaults(
		defineProps < {
			modelValue: boolean;
			id ? : string | number;
			plugsId: any;
		} > (), {
			modelValue: false,
			id: "",
			plugsId: "",
		}
	);
	const myVisible = ref(props.modelValue);
	// console.log(props, 999);
	const comp = ref({
	  modelValue: false,
	});
	const title = computed(() => (props.id === "" ? "新增充值赠送规则" : "修改充值赠送规则"));

	const form:any = ref({
		"id": '',
		"adminId": storage.local.get("adminId"),
		"configType": "",
		"userServiceToken": storage.local.get("userServiceToken"),
		"plugsId": Number(props.plugsId),
		"jsonViewData": {},
		"plugsConfigJson":"",
	});
	// 新增充值余额
	const recharge=ref({
		"rechargeMoney":'', 
		"giveeMoney":'',
		"remarks":''
	})
	// 充值规则列表
	const rechargeList:any=ref([]);
	const formRef = ref();
	const formRules = ref({
		rechargeMoney: [{
			required: true,
			message: "请输入"
		}],
		giveeMoney: [{
			required: true,
			message: "请输入"
		}]
	});
	const plugsList: any = ref([]);
	const businessList: any = ref([]);
	onMounted(() => {
		
			getlist()
		
		let data = {
			adminId: storage.local.get("adminId"),
			userServiceToken: storage.local.get("userServiceToken"),
			size: 1000,
		};
		api
			.get("/api/plugs/searchPlugsInfoList", {
				params: data
			})
			.then((res: any) => {
				if (res.code == 200) {
					plugsList.value = res.body.list;
				}
			});
		// 获取店铺
		api.get("/api/plugs/getBusinessInfo", {
			params: data
		}).then((res: any) => {
			if (res.code == 200) {
				res.body.forEach((item: any) => {
					item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
					businessList.value.push(item.jsonViewData);
				});
			}
		});
		
			
			api
				.get("/api/plugs/searchPlugsConfigListByPlugsId", {
					params: {
						page:1,
						keyword:'',
						plugsId: form.value.plugsId,
					},
				})
				.then((res: any) => {
					// form.value = res.body;
					
					// console.log(res,'pppppppppppppppppppppp')
					// console.log(radio1.value,'pradio1.valuepppppppppppppp')
					// console.log(radio2.value,'radio2.valupppppppppppp')
					// emit("success");
					// onCancel();
				});
		
	});
	// 获取详情
	function getlist() {
	  let data = {
	    // adminId: storage.local.get("adminId"),
	    // userServiceToken: storage.local.get("userServiceToken"),
	    id:route.params.id
	    // keyword: tableobj.keyword,
	  };
	  api
	    .get("/api/plugs/getPlugsConfigInfo", { params: data })
	    .then((res: any) => {
			if(res.body){
				form.value=res.body;
				  rechargeList.value = JSON.parse(res.body.plugsConfigJson);   
				if(props.id!==''){
							 recharge.value=rechargeList.value[props.id]
				}
							
			}
	    });
	}
	// 格式化日期
	function formatDate(value: any) {
	  let date = new Date(value);
	  let y = date.getFullYear();
	  let MM = (date.getMonth() + 1) as number;
	  MM = MM < 10 ? (("0" + MM) as unknown as number) : MM;
	  let d = date.getDate();
	  d = d < 10 ? (("0" + d) as unknown as number) : d;
	  let h = date.getHours();
	  h = h < 10 ? (("0" + h) as unknown as number) : h;
	  let m = date.getMinutes();
	  m = m < 10 ? (("0" + m) as unknown as number) : m;
	  let s = date.getSeconds();
	  s = s < 10 ? (("0" + s) as unknown as number) : s;
	  return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
	}
	
	function onSubmit() {
		if (form.value.id=='') {
			rechargeList.value.push(recharge.value);
			form.value.plugsConfigJson=JSON.stringify(rechargeList.value);
			console.log(form.value,'体检参数')
			formRef.value &&
				formRef.value.validate((valid: any) => {
					if (valid) {
						api
							.post("/api/plugs/insertPlugsConfig", form.value)
							.then((res: any) => {
								ElMessage.success({
									message: "新增成功",
									center: true,
								});
								console.log(res, 787);
								// emit("success");
								onCancel();
							});
					}
				});
		} else {
			if(props.id){
				rechargeList.value.splice(props.id,1,recharge.value)
			}else{
				rechargeList.value.push(recharge.value);
			}
		
			form.value.plugsConfigJson=JSON.stringify(rechargeList.value);
			
			formRef.value &&
				formRef.value.validate((valid: any) => {
					if (valid) {
						api
							.post("/api/plugs/updatePlugsConfig", form.value)
							.then((res: any) => {
								if (res.code == 200) {
									ElMessage.success({
										message: "修改成功",
										center: true,
									});
									// emit("success");
									onCancel();
								}
							});
					}
				});
		}
	}
	const emit = defineEmits(["success"]);

	function onCancel() {
		myVisible.value = false;
		emit("success");
	}

	// 图片上传

	const imageUrl = ref("");
	const header: any = reactive({
		BGDEBUG: 0,
		testToken: "2gq72h2qrbhx256y0167uf5wd64ls55u",
		Authorization: userStore.token,
	});
	// const baseURL: any = "http://192.168.31.47:7001/api/file/uploadImages";

	const baseURL: any = "https://api.daccf.com/api/file/uploadImages";
	const handleAvatarSuccess: UploadProps["onSuccess"] = (
		response,
		uploadFile
	) => {
		console.log(response, uploadFile);
		imageUrl.value = URL.createObjectURL(uploadFile.raw!);
		form.value.couponIocn = response.body;
	};

	const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
		// if (rawFile.type !== "image/jpeg") {
		//   ElMessage.error("Avatar picture must be JPG format!");
		//   return false;
		// } else if (rawFile.size / 1024 / 1024 > 2) {
		//   ElMessage.error("Avatar picture size can not exceed 2MB!");
		//   return false;
		// }
		// return true;
	};
	const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
		console.log(uploadFile, uploadFiles);
	};

	const fullscreenLoading = ref(false);
	const change = (e: any) => {
		console.log(e.target.files[0]);
		// 手写的input需要一个对象将本地图片转换为对应的格式来上传
		let formData = new FormData();
		// e.target.files就是选中的文件的一个数组
		formData.append("file", e.target.files[0]);
		formData.append("type", "1");
		fullscreenLoading.value = true;
		api.post("/api/file/uploadImages", formData).then((res: any) => {
			console.log(res);
			form.value.detailsImgAndPageUrl = res.body;
			fullscreenLoading.value = false;
		});
	};
</script>

<style scoped>
	.avatar-uploader .avatar {
		width: 60px;
		height: 60px;
		display: block;
	}
</style>

<style>

	.avatar-uploader .el-upload {
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
	}

	.avatar-uploader .el-upload:hover {
		border-color: var(--el-color-primary);
	}

	.el-icon.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 60px;
		height: 60px;
		text-align: center;
	}

	.file {
		position: relative;
		width: 100px;
		background-color: #ccc;
		text-align: center;
	}

	.file input {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
	}

	.file:hover {
		background: #aadffd;
		border-color: #78c3f3;
		color: #004974;
		text-decoration: none;
	}
</style>
