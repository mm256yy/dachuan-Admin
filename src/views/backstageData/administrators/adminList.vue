<route lang="yaml">
meta: title:员工管理
</route>

<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button
            type="primary"
            @click="addPlugin"
            v-if="usersadd.buttonsName == '新增' && usersadd.id"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            {{ usersadd.buttonsName }}
          </el-button>
          <el-button
            v-if="delet.buttonsName == '删除' && delet.id"
            type="danger"
            @click="delPlugin"
            :disabled="!multipleSelection.length"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="ep:delete" />
              </el-icon>
            </template>
            批量删除
          </el-button>
        </div>
        <div class="header-right">
          <div class="lang">
            <el-input
              style="width: 150px; height: 40px"
              v-model="tableobj.keyword"
              placeholder="输入用户名 手机号"
              @keyup.enter.native="getlist"
            />
          </div>
          <el-button
            type="primary"
            style="height: 40px; margin: 0 20px 0 30px"
            @click="getlist"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:search" />
              </el-icon>
            </template>
            搜索
          </el-button>
        </div>
      </div>

      <div class="main">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="60" />
          <el-table-column prop="headImg" label="用户" align="center">
            <template #default="scope">
              <div style="display: flex">
                <div>
                  <img
                    style="width: 40px; height: 40px"
                    :src="scope.row.headImg"
                    alt=""
                  />
                </div>
                <div style="margin: 10px">{{ scope.row.userName }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="品牌/店铺名称" align="center">
            <template #default="scope">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <div>
                  {{ JSON.parse(scope.row.configJson).smallRoutine || " " }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="mobile" label="手机号" align="center" />

          <!-- <el-table-column
              prop="userServiceToken"
              label="用户服务标识"
              align="center"
            /> -->
          <!-- <el-table-column prop="userEmail" label="邮箱" align="center" /> -->

          <el-table-column label="用户等级" align="center">
            <template #default="scope">
              <div v-if="scope.row.userLevel == 0">普通用户</div>
              <div
                v-if="scope.row.userLevel == 1"
                style="color: red; font-weight: bold; font-style: italic"
              >
                超级管理
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="lastLoginTime"
            label="最后一次登录时间"
            align="center"
          />

          <el-table-column prop="userState" label="用户状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.userState"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="正常"
                inactive-text="锁定"
                size="large"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonList.length"
            fixed="right"
            label="操作"
            width="260"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="bianji.buttonsName == '编辑' && bianji.id"
                link
                type="primary"
                size="small"
                @click="editClick(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                v-if="delet.buttonsName == '删除' && delet.id"
                link
                type="danger"
                size="small"
                @click="handleClick(scope.row.id)"
                >删除</el-button
              >

              <el-button
                v-if="rolefnepei.buttonsName == '角色分配' && rolefnepei.id"
                link
                type="primary"
                size="small"
                @click="fenpeirole(scope.row)"
                >角色分配</el-button
              >

              <el-button
                v-if="autofenpei.buttonsName == '权限分配' && autofenpei.id"
                link
                type="primary"
                size="small"
                @click="menuauth(scope.row)"
                >权限分配</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="example-pagination-block">
        <div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="tableobj.currentPage"
            :page-size="tableobj.pageSize"
            layout="prev,pager,next,total"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 添加插件弹框 -->
    <el-dialog v-model="dialogVisible" title="选择用户" width="30%">
      <div style="display: flex; justify-content: center; align-items: center">
        <el-select v-model="userId" filterable placeholder="请选择用户">
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.userName"
            :value="item.id"
          />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="edituser"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      @success="update"
    />

    <el-dialog
      v-model="centerDialogVisible"
      title="角色分配"
      width="30%"
      center
    >
      <div>
        <el-tree-select
          v-model="valueStrictly"
          :data="data1"
          multiple
          :render-after-expand="false"
          @check-change="select_role"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="shotRole"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限控制 -->
    <el-dialog
      v-model="data.ruleShow"
      title="权限控制"
      width="700px"
      :before-close="handleClose"
    >
      <div
        style="
          padding: 5px 20px;
          height: 500px;
          overflow-y: hidden;
          overflow-y: scroll;
        "
      >
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >

        <div
          v-for="item in cities"
          style="margin-top: 5px; border: 1px solid #eee; padding: 10px"
        >
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox :key="item.id" :label="item.id">
              <div style="font-size: 16px; color: black; font-weight: bold">
                {{ item.menuName }}
              </div>
            </el-checkbox>
          </el-checkbox-group>

          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <div>
              <div v-for="city in item.menusList" style="margin: 10px">
                <el-checkbox :key="city.id" :label="city.id">
                  <div style="color: black">{{ city.menuName }}</div>
                </el-checkbox>

                <div style="margin: 0px 30px">
                  <el-checkbox-group
                    v-model="checkedCities1"
                    @change="handleCheckedCitiesChange1"
                  >
                    <el-checkbox
                      v-for="citys in city.buttonList"
                      :key="citys.id"
                      :label="citys.id"
                    >
                      <div style="color: lightskyblue">
                        {{ citys.buttonsName }}
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </el-checkbox-group>
          <!-- <div style="border: 1px solid #ccc;width: 100%;"></div> -->
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.ruleShow = false">退出</el-button>
          <el-button @click="menuFenpei" type="primary"> 确定分配 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/DetailForm/index.vue";
import storage from "@/utils/storage";
import { ref } from "vue";

const router = useRouter();
const route = useRoute();
// 搜索

const centerDialogVisible = ref(false);
const valueStrictly: any = ref([]);
const data1: any = ref([
  {
    name: "1",
    label: "Level one 1",
  },
]);
// const tableData:any = ref([]);
const checkAll11: any = ref([]);
const checkAll: any = ref(false);
const isIndeterminate: any = ref(true);
const checkedCities: any = ref([]);
const checkedCities1: any = ref([]);

const aa: any = ref([]);
const bb: any = ref([]);
const cities: any = ref([]);
const cities_: any = ref([]);
const citiesAll: any = ref([]);

const checkAll1: any = ref(false);
const isIndeterminate1: any = ref(true);

const cities1: any = ref([]);
const citiesAll1: any = ref([]);

const data: any = ref({
  menuShow: false,
  menuStatus: true,
  ruleShow: false,
  ruleShow1: false,
  fenpei: "",
  menuTitle: "确定",
  menuList: {
    roleBotton: "",
    roleMenu: "",
    roleName: "",
  },
  formModeProps: {
    visible: false,
    id: "",
  },
});
const roleList: any = ref([]);
const select_role = (item: any) => {
  // roleList.value.push(item)
  console.log(item);
};

// 按钮权限

const buttonList: any = ref([]);
const rolefnepei: any = ref("");
const usersadd: any = ref("");
const bianji: any = ref("");
const delet: any = ref("");
const autofenpei: any = ref("");

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
          if (element.menuName == "管理员") {
            let ds: any = {
              menuId: Number(element.id),
            };

            api
              .get("/api/admin/getPowerButtonsByMenuId", {
                params: ds,
              })
              .then((res1: any) => {
                // console.log(res1);

                const buttonlt: any = buttonParse.split(",");
                res1.body.forEach((item: any) => {
                  for (let index = 0; index < buttonlt.length; index++) {
                    if (item.id == Number(buttonlt[index])) {
                      if (buttonList.length) {
                      } else {
                        if (item.buttonsName == "角色分配") {
                          rolefnepei.value = item;
                        } else if (item.buttonsName == "删除") {
                          delet.value = item;
                        } else if (item.buttonsName == "权限分配") {
                          autofenpei.value = item;
                        } else if (item.buttonsName == "新增员工") {
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

// 下拉信息

const userId = ref("");
const dialogVisible = ref(false);
const userList: any = ref([]);
const plugsList: any = ref([]);

onMounted(() => {
  buttonauto();
  // 获取用户列表
  api
    .get("/api/admin/searchAdminUserList", {
      params: {
        page: 1,
        size: 10000,
      },
    })
    .then((res: any) => {
      // console.log(res);

      if (res.code == 200) {
        userList.value = res.body.list;
      }
    });
  api
    .get("/api/plugs/searchPlugsInfoList", {
      params: {
        page: 1,
        size: 10000,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        plugsList.value = res.body.list;
      }
    });
  getlist();
  getRole();
});

// 获取权限
const getRole = () => {
  api.get("/api/admin/searchAdminRoleList").then((res: any) => {
    if (res.code == 200) {
      data1.value = res.body.list;
      for (let index = 0; index < data1.value.length; index++) {
        data1.value[index]["label"] = data1.value[index].roleName;
        data1.value[index]["value"] = data1.value[index].id;
      }
    }
  });
};

// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});

function getlist() {
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    keyword: tableobj.keyword,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api
    .get("/api/admin/searchAdminUserList", { params: data })
    .then((res: any) => {
      tableData.value = res.body.list;
      total.value = res.body.total;
      tableobj.keyword = "";
    });
}

function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  getlist();
}
function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getlist();
}

// 新增插件
function addPlugin() {
  // data.value.formModeProps.visible = true;
  // data.value.formModeProps.id = "";
  router.push({
    name: "addAdminlist",
  });
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    if (item.id == 31) {
      return;
    } else {
      return item.id;
    }
  });
  // console.log();
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/admin/delAdminUser", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });
          getlist();
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
// 删除插件
const handleClick = (e: any) => {
  if (e == 31) {
    ElMessage({
      type: "error",
      message: "该用户是超级管理",
    });
  } else {
    let data = {
      ids: e,
    };
    ElMessageBox.confirm(`确认删除吗？`, "确认信息")
      .then(() => {
        api.post("/api/admin/delAdminUser", data).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success({
              message: res.msg,
              center: true,
            });
            getlist();
          }
        });
      })
      .catch(() => {});
  }
};
// 编辑插件
const editClick = (e: any) => {
  // data.value.formModeProps.visible = true;
  // data.value.formModeProps.id = e;
  router.push({
    name: "editAdminlist",
    params: {
      id: e,
    },
  });
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
const plugJson: any = ref([]);
const adduser = (item: any) => {
  dialogVisible.value = true;
  const plug: any = storage.local.get("plugJson");
  let obj = {
    plugsName: item.title,
    plugsId: item.id,
  };
  let arr = JSON.parse(plug);
  arr.push(obj);
  plugJson.value = arr;
};
const edituser = (item: any) => {
  let data = {
    id: userId.value,
  };
  api
    .get("/api/admin/searchAdminUserById", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        res.body.plugJson = JSON.stringify(plugJson.value);
        storage.local.set("plugJson", res.body.plugJson);
        http.post("/api/admin/updateAdminUser", res.body).then((ree: any) => {
          if (ree.code == 200) {
            ElMessage.success({
              message: res.msg,
              center: true,
            });
            dialogVisible.value = false;
            userId.value = "";
            getlist();
          }
        });
      }
    });
};
// 时间转换
function formatDate(row: any, column: any, cellValue: any, index: any) {
  if (cellValue == null || cellValue == "") return "";
  let date = new Date(parseInt(cellValue)); //时间戳为10位需*1000，如果为13位的话不需乘1000。
  let Y = date.getFullYear() + "-";
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1) + "-"
      : date.getMonth() + 1 + "-";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  let h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  let m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

const usrList = ref();

const fenpeirole = (item: any) => {
  valueStrictly.value = [];
  if (item.powerJson) {
    let role: any = JSON.parse(item.powerJson).roleId.split(",");
    // console.log(role);
    if (role.length) {
      for (let index = 0; index < role.length; index++) {
        // console.log(role[index])
        if (role[index] == "0" || role[index] == 0) {
        } else valueStrictly.value.push(Number(role[index]));
      }
    } else {
      valueStrictly.value = [];
    }
  }

  usrList.value = item;
  centerDialogVisible.value = !centerDialogVisible.value;
};

const menuList_: any = ref([]);

const shotRole = () => {
  // console.log(valueStrictly.value)
  let xx: any = "";
  let yy: any = "";
  let d: any = "";
  let menuList: any = "";
  let buttonList: any = "";
  for (let index = 0; index < valueStrictly.value.length; index++) {
    let da: any = {
      id: valueStrictly.value[index],
    };
    http
      .get("/api/admin/searchAdminRoleById", {
        params: da,
      })
      .then((res: any) => {
        // console.log(res.body.roleMenu);
        menuList = menuList + res.body.roleMenu + ",";
        buttonList = menuList + res.body.roleBotton + ",";
      });

    if (index + 1 == valueStrictly.value.length) {
      d += valueStrictly.value[index];
    } else {
      d += valueStrictly.value[index] + ",";
    }
  }
  setTimeout(() => {
    const map = new Map();
    let meu: any = menuList.split(",");
    let but: any = buttonList.split(",");
    meu.filter((key: any, index: any) => {
      if (!map.has(key) && map.set(key, 1)) {
        if (key == "" || key == "0") {
        } else {
          if (meu.length == index + 2) {
            xx += key;
          } else {
            xx += key + ",";
          }
        }
        //
      }
    });

    let num = 0;
    but.forEach((key: any, index: any) => {
      if (!map.has(key) && map.set(key, 1)) {
        if (index + 2 == but.length) {
          yy += key;
        } else {
          if (key == "0") {
          } else {
            yy += key + ",";
          }
        }
      }
    });

    let powerJson: any = {
      roleId: d,
      deptId: 0,
      buttonId: yy,
      menusId: xx,
    };

    usrList.value.powerJson = JSON.stringify(powerJson);
    http.post("/api/admin/updateAdminUser", usrList.value).then((res: any) => {
      console.log(res);
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "分配成功!",
        });
        centerDialogVisible.value = false;
      } else {
        ElMessage({
          type: "error",
          message: "分配失败!",
        });
      }
    });
  }, 500);
};

// 权限控制
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const handleCheckAllChange = (val: any) => {
  // console.log(val, citiesAll.value);

  if (val) {
    // console.log(aa.value);
    // console.log(bb.value);

    // cities.value = cities_.value;
    checkedCities.value = aa.value;
    checkedCities1.value = bb.value;

    // for (let index = 0; index < cities.value.length; index++) {
    //   console.log(cities.value[index].id);
    //   j.push(cities.value[index].id);
    // }
    // console.log(j);

    // checkedCities.value = j;
    isIndeterminate.value = false;
  } else {
    checkedCities.value = [];
    checkedCities1.value = [];
  }

  // checkedCities.value = val ? cities.value : []
};

const handleCheckedCitiesChange = (value: any[]) => {
  // console.log(value);
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < cities.value.length;
};

const handleCheckedCitiesChange1 = (value: any[]) => {
  console.log(value);
  const checkedCount = value.length;
  checkAll1.value = checkedCount === cities1.value.length;
  isIndeterminate1.value =
    checkedCount > 0 && checkedCount < cities1.value.length;
};

const menuFenpei = () => {
  let roleJson: any = JSON.parse(data.value.fenpei.powerJson);

  //   const buttonList:any = ref([])
  // const rolefnepei:any = ref('')
  // const usersadd:any = ref('')
  // const bianji:any = ref('')
  // const delet:any = ref('')
  // const autofenpei:any = ref('')
  // console.log(autofenpei.value.id  ,autofenpei.buttonsName, autofenpei.menusId != 0);

  if (
    autofenpei.value.id &&
    autofenpei.value.buttonsName &&
    autofenpei.value.menusId != 0
  ) {
    let ll = "";
    let ll1 = "";
    for (let index = 0; index < checkedCities.value.length; index++) {
      if (index + 1 == checkedCities.value.length) {
        ll += checkedCities.value[index];
      } else {
        ll += checkedCities.value[index] + ",";
      }
    }

    for (let index = 0; index < checkedCities1.value.length; index++) {
      if (index + 1 == checkedCities1.value.length) {
        ll1 += checkedCities1.value[index];
      } else {
        ll1 += checkedCities1.value[index] + ",";
      }
    }

    roleJson.buttonId = ll1;
    roleJson.menusId = ll;
    data.value.fenpei.powerJson = JSON.stringify(roleJson);

    http
      .post("/api/admin/updateAdminUser", data.value.fenpei)
      .then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "分配成功!",
          });
          data.value.ruleShow = false;
          // listMenu();
        } else {
          ElMessage({
            type: "error",
            message: "分配失败!",
          });
        }
      });
  } else {
    ElMessage({
      type: "error",
      message: "您没有足够的权限!",
    });
  }
};

const get_menu = (item: any) => {
  let menuListsplit: any = JSON.parse(item.powerJson).menusId.split(",");
  let buttonListsplit: any = JSON.parse(item.powerJson).buttonId.split(",");
  menuListsplit.filter((val: any) => {
    let dd: any = Number(val);
    checkedCities.value.push(dd);
  });
  buttonListsplit.filter((val: any) => {
    let dd: any = Number(val);
    checkedCities1.value.push(dd);
  });
};

const menuauth = (item: any) => {
  aa.value = [];
  bb.value = [];
  checkedCities.value = [];
  checkedCities1.value = [];
  // console.log(item);

  data.value.fenpei = item;
  data.value.ruleShow = !data.value.ruleShow;

  get_menu(item);

  let menuData: any = "";
  api.get("/api/admin/searchPowerMenusList").then((res: any) => {
    if (res.code == 200) {
      menuData = res.body.list;
      // console.log("12321",menuData);
      // cities.value = menuData

      for (let index = 0; index < menuData.length; index++) {
        // console.log(menuData[index]);

        for (
          let index1 = 0;
          index1 < menuData[index].menusList.length;
          index1++
        ) {
          // console.log(menuData[index].menusList[index1].id);

          aa.value.push(menuData[index].menusList[index1].id);
          let d: any = {
            menuId: menuData[index].menusList[index1].id,
          };
          api
            .get("/api/admin/getPowerButtonsByMenuId", {
              params: d,
            })
            .then((res1: any) => {
              menuData[index].menusList[index1]["buttonList"] = res1.body;
              for (let index2 = 0; index2 < res1.body.length; index2++) {
                bb.value.push(res1.body[index2].id);
              }
            });
        }
      }

      setTimeout(() => {
        cities.value = menuData;
        cities_.value = menuData;
        // console.log("312321", cities.value);
      }, 500);
    }
  });

  // data.value.fenpei = item;
  // let menuListsplit: any = item.roleMenu.split(",");
  // checkedCities.value = [];
  // menuListsplit.filter((val: any) => {
  //   let dd: any = Number(val);
  //   checkedCities.value.push(dd);
  // });

  // api.get("/api/admin/searchPowerMenusList").then((res: any) => {
  //   console.log(res);
  //   if (res.code == 200) {
  //     cities.value = res.body.list;
  //     citiesAll.value = res.body.list;
  //   }
  // });
  // data.value.ruleShow = !data.value.ruleShow;
};
</script>

<style scoped lang="scss">
.container {
  padding: 10px;
}

.content {
  padding: 10px;
  background-color: #fff;

  .header {
    display: flex;
    justify-content: space-between;

    // .header-left {
    // }

    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .lang {
        width: 120px;
        margin-right: 20px;
        height: 40px;
      }
    }
  }

  .example-pagination-block {
    margin-bottom: 16px;
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
