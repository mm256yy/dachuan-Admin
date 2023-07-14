<route lang="yaml">
meta: title:商品添加
</route>
<route lang="yaml">
meta:
  enabled: false
</route>

<template>
  <div
    class="containter"
    style="
      background-color: #fff;
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-scrollbar height="" style="padding: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="数据类型" prop="dataType">
          <el-input v-model="form.dataType" placeholder="dataType" clearable />
        </el-form-item>
        <el-form-item label="数据说明" prop="describes">
          <el-input v-model="form.describes" placeholder="插件数据" clearable />
        </el-form-item>
        <el-form-item label="所属插件" prop="plugsId">
          <el-select
            v-model="form.plugsId"
            filterable
            placeholder="选择插件"
            disabled
          >
            <el-option
              v-for="item in plugsList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属店铺" prop="businessId">
          <el-select
            v-if="!route.params.id"
            style="width: 680px;"
               v-model="sleStoreList"
                filterable
                placeholder="选择店铺(一个或多个)"
                multiple
               @change="selectBusiness"
                collapse-tags
                collapse-tags-tooltip
               :max-collapse-tags="4"
            >
              <el-option key="selectAll" label="全部" value="selectAll"/>
              <!-- <el-option key="0" label="全部" value="0" /> -->
              <el-option
                v-for="item in businessList"
                :key="item.businessId"
                :label="item.businessName"
                :value="item.businessId"
              />
            </el-select>
          <el-select
            v-else
            v-model="form.businessId"
            filterable
            placeholder="选择店铺"
          >
            <!-- <el-option key="0" label="全部" value="0" /> -->
            <el-option
              v-for="item in businessList"
              :key="item.businessId"
              :label="item.businessName"
              :value="item.businessId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="插件数据" prop="jsonData">
          <el-input v-model="form.jsonData.data" placeholder="" clearable />
        </el-form-item>

        <el-form-item label="data_type" prop="data_type">
          <el-input
            v-if="sql.buttonsName && sql.id && sql.menusId != 0"
            v-model="form.jsonData.data_type"
            placeholder=""
            clearable
          />
          <el-input
            v-else
            v-model="form.jsonData.data_type"
            placeholder=""
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="type" prop="type">
          <el-input v-model="form.jsonData.type" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="sql" prop="sql">
          <el-input
            v-if="sql.buttonsName && sql.id && sql.menusId != 0"
            v-model="form.jsonData.sql"
            placeholder=""
            clearable
          />
          <el-input
            v-else
            v-model="form.jsonData.sql"
            placeholder=""
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item label="parms" prop="type">
          <el-input
            v-model="form.jsonData.parms"
            placeholder="逗号隔开"
            clearable
            @click="changeGoods"
          />
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button size="large" @click="onCancel"> 取消 </el-button>
        <el-button type="primary" size="large" @click="onSubmit">
          确定
        </el-button>
      </div>
    </el-scrollbar>
    <ChangeGoods
      v-if="comp.modelValue"
      v-model="comp.modelValue"
      @success="update"
    ></ChangeGoods>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import ChangeGoods from "@/components/changeGoods/index.vue";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";

const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();

const form: any = ref({
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  id: route.params.id ?? "",
  jsonData: {
    data_type: "sql",
    type: "ax002",
    sql: "SELECT * FROM cf_plugs_goods WHERE id in(?);",
  },
  describes: "这个数据是用来构建购物车下方猜你喜欢的商品数据的",
  plugsId: Number(route.params.plugsId) ?? "",
  jsonViewData: {},
  businessId: "0",
  businessList: [],
  dataType: "shop_car_data",
});
const jsonData = ref({});
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
});
const plugsList: any = ref([]);
const businessList: any = ref([]);

// 按钮权限

const buttonList: any = ref([]);
const sql: any = ref("");
const usersadd: any = ref("");
const bianji: any = ref("");
const delet: any = ref("");
const pliginadd: any = ref("");
const sleStoreList:any=ref([])
const selectAll:any=ref(false);
const busList:any=ref([])
function selectBusiness(val:any){
   if(selectAll.value){
    selectAll.value = false;
    if(val.indexOf('selectAll') > -1){
      sleStoreList.value=val.filter((item:any)=>{
        return item!='selectAll'
      })
    }else{
      sleStoreList.value=[];
    }
   }else{
    if(val.indexOf('selectAll') > -1){
      const optionsValue:any = [];
      businessList.value.forEach((item:any)=>{
        optionsValue.push(item.businessId)
      })
      sleStoreList.value=['selectAll',...optionsValue]
      selectAll.value = true;
    }else{
      if(val.length=== businessList.value.length){
        const optionsValue:any = [];
        businessList.value.forEach((item:any)=>{
        optionsValue.push(item.businessId)
      })
      sleStoreList.value=['selectAll', ...optionsValue]
      selectAll.value = true;
      }else{
        sleStoreList.value=val
      }
    }
   }
  const realSelect= sleStoreList.value.filter((item:any)=>{
    return item!='selectAll'
  })
  // form.value.businessId=realSelect.toString();
}
const buttonauto = () => {
  // console.log("123",localStorage.getItem('fa_menuList'));
  const btnList = JSON.parse(localStorage.getItem("fa_menuList") || "");
  const adminId = Number(localStorage.getItem("fa_adminId"));

  let admins = {
    id: adminId,
  };
  api
    .get("/api/admin/searchAdminUserById", {
      params: admins,
    })
    .then((res: any) => {
      if (res.code == 200) {
        const buttonParse = JSON.parse(res.body.powerJson)["buttonId"];
        btnList.forEach((element: any, index: any) => {
          if (element.menuName == "新增Mock") {
            let ds: any = {
              menuId: Number(element.id),
            };

            api
              .get("/api/admin/getPowerButtonsByMenuId", {
                params: ds,
              })
              .then((res1: any) => {
                console.log(res1);

                const buttonlt: any = buttonParse.split(",");
                res1.body.forEach((item: any) => {
                  for (let index = 0; index < buttonlt.length; index++) {
                    if (item.id == Number(buttonlt[index])) {
                      if (buttonList.length) {
                      } else {
                        if (item.buttonsName == "sql") {
                          sql.value = item;
                        } else if (item.buttonsName == "删除") {
                          delet.value = item;
                        } else if (item.buttonsName == "新增插件") {
                          pliginadd.value = item;
                        } else if (item.buttonsName == "添加用户") {
                          usersadd.value = item;
                        } else if (item.buttonsName == "编辑") {
                          bianji.value = item;
                        }
                        buttonList.value.push(item);
                      }
                    }
                  }
                });
              });
          }
        });
      }
    });
};

onMounted(() => {
  buttonauto();
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    size: 1000,
  };
  // 获取插件列表
  api
    .get("/api/plugs/searchPlugsInfoList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
      }
    });
  api.get("/api/plugs/getBusinessInfo", { params: data }).then((res: any) => {
    if (res.code == 200) {
      res.body.forEach((item: any) => {
        item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
        console.log(item.jsonViewData.businessId, 99999);

        businessList.value.push(item.jsonViewData);
      });
    }
  });
  console.log(form.value.id, 999);
  if (form.value.id !== "") {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsMockDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        if (res.code == 200) {
          form.value = res.body;
          console.log(form.value);
          form.value.jsonData = JSON.parse(res.body.jsonData);

          // form.value.jsonData.forEach((item)=>{
          //   item.key_description=
          // })
          form.value.id = res.body.id;
          form.value.businessId = form.value.businessId.toString();
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
  }
});

function onSubmit() {
  console.log(form.value);
  form.value.jsonData = JSON.stringify(form.value.jsonData);
  if (form.value.id === "") {
    form.value.businessId='0'
    businessList.value.forEach((item2:any)=>{
        sleStoreList.value.forEach((item:any)=>{
          if(item==item2.businessId){
              let str=item2.businessId+'_'+item2.businessName;
              busList.value.push(str)
          }
      }) 
   })
   form.value.businessList=busList.value;
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsMockData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
                console.log(res, 787);
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
              }
            });
        }
      });
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsMockData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
              }
            });
        }
      });
  }
}
const comp = ref({
  modelValue: false,
});
const changeGoods = () => {
  comp.value.modelValue = true;
};
const update = (item: any) => {
  console.log(item, 456);
  if (item) {
    form.value.jsonData.parms = item.join();
  }
  comp.value.modelValue = false;
};
function onCancel() {
  tabbar.close({ name: "addMockData" });
  router.push({
    name: "mockData",
    params: {
      id: route.params.plugsId,
      admin:'user'
    },
  });
}
</script>

<style scoped></style>

<style></style>
