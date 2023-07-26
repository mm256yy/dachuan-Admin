<route lang="yaml">
meta: title:菜单列表
</route>

<template>
  <div class="container">
    <div
      style="
        background: white;
        padding: 10px;
        display: flex;
        justify-content: space-between;
      "
    >
      <div></div>
      <div style="display: flex">
        <el-button
          type="primary"
          v-if="roleadd.buttonsName && roleadd.id"
          style="margin-right: 20px"
          @click="addMenu"
          >添加角色</el-button
        >

        <div style="display: flex; height: 30px">
          <el-input v-model="keyword" placeholder="查询菜单" />
          <el-button style="height: 30px">搜索</el-button>
        </div>
      </div>
    </div>

    <div>
      <el-table :data="tableData" :border="parentBorder" style="width: 100%">
        <el-table-column label="ID" width="60">
          <template #default="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>

        <el-table-column label="角色名称" width="110">
          <template #default="scope">
            <div>{{ scope.row.roleName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="菜单权限" width="110">
          <template #default="scope">
            <div style="display: flex">
              {{ scope.row.roleMenu.split(",").length }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="按钮权限">
          <template #default="scope">
            <div>{{ scope.row.roleBotton.split(",").length }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" v-if="buttonList.length">
          <template #default="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <!-- <el-button  type="danger" style="height: 30px;">删除</el-button> -->
              <el-button
                v-if="bianji.buttonsName && bianji.id"
                @click="edit(scope.row)"
                type="primary"
                style="height: 30px"
                >编辑</el-button
              >
              <el-button
                v-if="auto.buttonsName && auto.id"
                @click="menuauth(scope.row)"
                type="success"
                style="height: 30px"
                >权限控制</el-button
              >
              <el-button
                v-if="delet.buttonsName && delet.id"
                @click="deletes(scope.row)"
                type="danger"
                style="height: 30px"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="data.menuShow" title="添加角色" width="550px">
      <div style="padding: 20px">
        <div style="display: flex; align-items: center; margin: 10px">
          <div style="width: 100px">
            <span style="color: black">*</span> 角色名称:
          </div>
          <el-input
            style="width: 260px"
            v-model="data.menuList.roleName"
            placeholder="角色名称"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="data.menuShow = false">退出</el-button>
          <el-button type="primary" @click="shot">
            {{ data.menuTitle }}
          </el-button>
        </span>
      </template>
    </el-dialog>

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
import { ElMessage, ElMessageBox, UploadProps } from "element-plus";

import FormMode from "./components/DetailForm/index.vue";
import storage from "@/utils/storage";
import { ref } from "vue";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const parentBorder = ref(false);
const childBorder = ref(false);
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
});
const keyword: any = ref();

const tableData: any = ref([]);
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

const handleCheckAllChange = (val: any) => {
  console.log(val, citiesAll.value);

  if (val) {
    console.log(aa.value);
    console.log(bb.value);

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
  console.log(value);
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

const buttonList: any = ref([]);

const roleadd: any = ref("");
const bianji: any = ref("");
const delet: any = ref("");
const auto: any = ref("");

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
          if (element.menuName == "角色列表") {
            let ds: any = {
              menuId: Number(element.id),
            };

            api
              .get("/api/admin/getPowerButtonsByMenuId", {
                params: ds,
              })
              .then((res1: any) => {
                console.log("213213", res1);

                const buttonlt: any = buttonParse.split(",");
                console.log("12000", buttonlt);

                res1.body.forEach((item: any) => {
                  for (let index = 0; index < buttonlt.length; index++) {
                    if (item.id == Number(buttonlt[index])) {
                      if (buttonList.length) {
                      } else {
                        if (item.buttonsName == "删除") {
                          delet.value = item;
                        } else if (item.buttonsName == "添加角色") {
                          roleadd.value = item;
                        } else if (item.buttonsName == "编辑") {
                          bianji.value = item;
                        } else if (item.buttonsName == "权限控制") {
                          auto.value = item;
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

// 函数区域

onMounted(() => {
  buttonauto();
  listMenu();
});

const listMenu = () => {
  api.get("/api/admin/searchAdminRoleList").then((res: any) => {
    console.log(res);
    if (res.code == 200) {
      tableData.value = res.body.list;
    }
  });
};

const addMenu = (item: any) => {
  data.value.menuList = {
    roleBotton: "",
    roleMenu: "",
    roleName: "",
  };
  data.value.menuTitle = "确定";

  data.value.menuShow = !data.value.menuShow;
  // dialogVisible.value = true
};

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const shot = (item: any) => {
  data.value.menuShow = false;
  if (data.value.menuTitle == "确定") {
    http
      .post("/api/admin/insertAdminRole", data.value.menuList)
      .then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "添加成功!",
          });
          listMenu();
        } else {
          ElMessage({
            type: "error",
            message: "添加失败!",
          });
        }
      });
  } else if (data.value.menuTitle == "修改") {
    let ll = {
      id: data.value.menuList.id,
      roleBotton: data.value.menuList.roleBotton,
      roleMenu: data.value.menuList.roleMenu,
      roleName: data.value.menuList.roleName,
    };
    // console.log(ll);
    http.post("/api/admin/updateAdminRole", ll).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "修改成功!",
        });
        listMenu();
      } else {
        ElMessage({
          type: "error",
          message: "修改失败!",
        });
      }
    });
  }
};

const edit = (item: any) => {
  console.log(item.menuStatus);
  if (item.menuStatus == 0) {
    data.value.menuStatus = true;
  } else {
    data.value.menuStatus = false;
  }

  data.value.menuTitle = "修改";
  data.value.menuShow = !data.value.menuShow;
  data.value.menuList = item;
};

const get_menu = (item: any) => {
  let menuListsplit: any = item.roleMenu.split(",");
  let buttonListsplit: any = item.roleBotton.split(",");
  menuListsplit.filter((val: any) => {
    // console.log(val);
    if (val == 0 || val == null) {
    } else {
      let dd: any = Number(val);
      console.log(dd);
      checkedCities.value.push(dd);
    }
  });

  buttonListsplit.filter((val: any) => {
    if (val == 0 || val == null) {
    } else {
      console.log(val);

      let dd: any = Number(val);
      checkedCities1.value.push(dd);
    }
  });
};

const menuauth = (item: any) => {
  aa.value = [];
  bb.value = [];
  checkedCities.value = [];
  checkedCities1.value = [];
  data.value.fenpei = item;
  data.value.ruleShow = !data.value.ruleShow;

  get_menu(item);

  let menuData: any = "";
  api.get("/api/admin/searchPowerMenusList").then((res: any) => {
    if (res.code == 200) {
      menuData = res.body.list;

      for (let index = 0; index < menuData.length; index++) {
        for (
          let index1 = 0;
          index1 < menuData[index].menusList.length;
          index1++
        ) {
          console.log("213", menuData[index].menusList[index1].id);

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
        console.log(aa.value);
      }, 500);
    }
  });
};

const menuFenpei = () => {
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

  // console.log(ll);
  let data1: any = {
    roleName: data.value.fenpei.roleName,
    id: data.value.fenpei.id,
    roleBotton: ll1,
    roleMenu: ll,
  };
  console.log("1232", auto);

  if (auto.value.buttonsName && auto.value.id && auto.value.menusId != 0) {
    http.post("/api/admin/updateAdminRole", data1).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "分配成功!",
        });
        data.value.ruleShow = false;
        listMenu();
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
      message: "您的权限不足！",
    });
  }
};

const deletes = (item: any) => {
  let data: any = {
    ids: item.id,
  };

  api.post("/api/admin/delAdminRole", data).then((res: any) => {
    if (res.code == 200) {
      listMenu();
      ElMessage({
        type: "success",
        message: "删除成功！",
      });
    } else {
      ElMessage({
        type: "error",
        message: "删除失败！",
      });
    }
  });
};
</script>

<style scoped lang="scss"></style>
