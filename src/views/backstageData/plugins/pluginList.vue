<template>
  <div class="container">
    <div class="content" style="border-radius: 10px">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button
            type="primary"
            v-if="pliginadd.buttonsName && pliginadd.id"
            @click="addPlugin"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            新增插件
          </el-button>
          <el-button
            v-if="delet.buttonsName && delet.id"
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
        <div style="display: flex">
          <div class="lang">
            <el-input
              style=""
              v-model="tableobj.keyword"
              placeholder="请输入"
              @keyup.enter.native="getlist"
            />
          </div>
          <el-button
            type="primary"
            style="margin: 0 20px 0 30px"
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
            background: '#f9f9f9',
            color: '#666',
            textAlign: 'center',
            height: '55px',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column prop="id" label="ID" align="center" width="60" />
          <el-table-column prop="icon" label="插件icon" align="center">
            <template #default="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.icon"
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="插件名称" align="center" />
          <el-table-column
            prop="plugsDescribe"
            label="插件描述"
            align="center"
          />
          <el-table-column prop="paths" label="页面路径" align="center" />
          <el-table-column prop="plugsType" label="插件类型" align="center" />
          <el-table-column prop="plugsStatus" label="状态" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.plugsStatus"
                inline-prompt
                :active-value="0"
                :inactive-value="1"
                active-text="启用"
                inactive-text="禁用"
                size="large"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonList.length"
            fixed="right"
            label="操作"
            width="250"
            align="center"
          >
            <template #default="scope">
              <div style="display: flex; flex-direction: column">
                <div>
                  <el-button
                    v-if="delet.buttonsName && delet.id"
                    link
                    type="danger"
                    size="small"
                    @click="handleClick(scope.row.id)"
                    >删除</el-button
                  >
                  <el-button
                    v-if="bianji.buttonsName && bianji.id"
                    link
                    type="primary"
                    size="small"
                    @click="editClick(scope.row.id)"
                    >编辑</el-button
                  >
                  <!-- <el-button
                    v-if="chakan.buttonsName && chakan.id"
                    link
                    type="primary"
                    size="small"
                    @click="viewClick(scope.row.id)"
                    >查看</el-button
                  > -->
                  <el-button
                    v-if="usersadd.buttonsName && usersadd.id"
                    link
                    type="primary"
                    size="small"
                    @click="adduser(scope.row)"
                    >添加用户</el-button
                  >
                  <el-button
                    v-if="usersadd.buttonsName && usersadd.id"
                    link
                    type="primary"
                    size="small"
                    @click="examine(scope.row)"
                    >查看数据</el-button
                  >
                </div>
              </div>
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
    <el-dialog v-model="dialogVisible" title="选择用户添加插件" width="30%">
      <div style="display: flex; justify-content: center; align-items: center">
        <el-select
          v-model="userId"
          filterable
          placeholder="请选择用户"
          @change="change(userId)"
        >
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="edituser"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/DetailForm/index.vue";
import storage from "@/utils/storage";
import router from "@/router";

// 搜索
const selectForm: any = reactive({
  type: "",
  name: "",
  value: "",
});

const data = ref({
  formModeProps: {
    visible: false,
    id: "",
  },
});

const userId = ref("");
const dialogVisible = ref(false);

const userList: any = ref([]);
const plugsList: any = ref([]);

// 按钮权限

const buttonList: any = ref([]);
const chakan: any = ref("");
const usersadd: any = ref("");
const bianji: any = ref("");
const delet: any = ref("");
const pliginadd: any = ref("");

const buttonauto = () => {
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
          if (element.menuName == "插件列表") {
            let ds: any = {
              menuId: Number(element.id),
            };

            api
              .get("/api/admin/getPowerButtonsByMenuId", {
                params: ds,
              })
              .then((res1: any) => {
                const buttonlt: any = buttonParse.split(",");
                res1.body.forEach((item: any) => {
                  for (let index = 0; index < buttonlt.length; index++) {
                    if (item.id == Number(buttonlt[index])) {
                      if (buttonList.length) {
                      } else {
                        if (item.buttonsName == "查看") {
                          chakan.value = item;
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
  // 获取用户列表
  buttonauto();
  api
    .get("/api/admin/searchAdminUserList", {
      params: {
        page: 1,
        size: 10000,
      },
    })
    .then((res: any) => {
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
});
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
    .get("/api/plugs/searchPlugsInfoList", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        tableData.value = res.body.list;
        total.value = res.body.total;
        tableobj.keyword = "";
      } else {
        ElMessage.error({
          message: res.msg,
          center: true,
        });
      }
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
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
}
// 批量删除
const multipleSelection: any = ref([]);
const idlist: any = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
  idlist.value = multipleSelection.value.map((item: any) => {
    return item.id;
  });
};

const delPlugin = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsInfo", data).then((res: any) => {
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

  // ids.push(idlist.value);
};
// 删除插件
const handleClick = (e: any) => {
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      let data = {
        ids: e,
      };
      api.post("/api/plugs/delPlugsInfo", data).then((res: any) => {
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
};
// 编辑插件
const editClick = (e: any) => {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = e;
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
const plugJson: any = ref([]);
const obj: any = ref({
  plugsName: "",
  plugsId: "",
});

const adduser = (item: any) => {
  dialogVisible.value = true;
  obj.value.plugsName = item.title;
  obj.value.plugsId = item.id;
};
const viewClick = (item: any) => {
  router.push({
    name: "contentlist",
    params: {
      id: item,
    },
  });
};

const change = (val: any) => {
  api
    .get("/api/admin/searchAdminUserById", {
      params: {
        id: val,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        let arr: any = [];
        arr = JSON.parse(res.body.plugJson);
        arr.push(obj.value);
        plugJson.value = arr;
      }
    });
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

const examine = (item: any) => {
  router.push({
    name: item.paths,
    params: {
      id: item.id,
      admin: "admin",
    },
  });
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
</style>
