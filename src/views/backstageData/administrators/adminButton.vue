<route lang="yaml">
meta: title:添加按钮
</route>

<template>
  <div class="container">
    <div style="padding: 20px; margin: 20px; background: white">
      <div style="display: flex; flex-direction: column">
        <div
          style="display: flex; flex-direction: column; padding: 10px 0"
          v-for="(item, index) in menuData"
        >
          <div style="font-weight: bolder; font-size: 20px">
            {{ item.menuName }}
          </div>

          <div v-for="(item1, index1) in item.menusList" style="margin: 10px">
            <div style="color: #bfc2c8">
              {{ item1.menuName }}
            </div>

            <div style="display: flex; margin: 10px 10px">
              <div
                style="display: flex"
                v-for="(tag, tagIndex) in item1.buttonList"
              >
                <div v-if="buttondelet.id">
                  <el-tag
                    style="margin: 5px"
                    :key="tag.id"
                    class="mx-1"
                    closable
                    :disable-transitions="false"
                    @close="handleClose1(tag, index, index1, tagIndex)"
                  >
                    {{ tag.buttonsName }}
                  </el-tag>
                </div>
                <div v-else>
                  <el-tag
                    style="margin: 5px"
                    :key="tag.id"
                    class="mx-1"
                    :disable-transitions="false"
                    @close="handleClose1(tag, index, index1, tagIndex)"
                  >
                    {{ tag.buttonsName }}
                  </el-tag>
                </div>
              </div>

              <div
                v-if="
                  buttonadd.buttonsName &&
                  buttonadd.id &&
                  buttonadd.menusId != 0
                "
              >
                <!-- {{ item1.input }} -->
                <el-input
                  style="width: 120px; margin: 3px"
                  v-if="item1.show"
                  v-model="item1.input"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="handleInputConfirm(item1)"
                  @blur="handleInputConfirm(item1)"
                />
                <el-button
                  style="margin: 5px"
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput(item1, index1)"
                >
                  + 新增按钮
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox, UploadProps } from "element-plus";
import { ElInput } from "element-plus";
import FormMode from "./components/DetailForm/index.vue";
import storage from "@/utils/storage";
import { loadingHide, loadingShow } from "@/components/SpinkitLoading/index";
import { ref, nextTick } from "vue";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const parentBorder = ref(false);
const childBorder = ref(false);
const data: any = ref({
  menuShow: false,
  menuStatus: true,
  menuTitle: "确定",
  menuList: {
    buttonsName: "",
    menusId: "",
    permissionIdentification: "",
  },
});
const keyword = ref();

// 标签
const inputValue = ref("");
const dynamicTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const SavaData: any = ref({});
const tableData: any = ref([]);
const menuData: any = ref([]);

// 函数区域

const buttonList: any = ref([]);

const buttondelet: any = ref("");
const buttonadd: any = ref("");

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
          if (element.menuName == "菜单按钮") {
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
                        if (item.buttonsName == "删除") {
                          buttondelet.value = item;
                        } else if (item.buttonsName == "新增") {
                          buttonadd.value = item;
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
  openFullScreen2("1");
  buttonauto();
  menuButton();
});

const type = ref("plane");
const size = ref(50);
const color = ref("#ffffff");
const openFullScreen2 = (item: any) => {
  if (item == "0") {
    loadingHide();
  } else {
    loadingShow({
      type: type.value,
      size: size.value,
      color: color.value,
    });
  }
};

const menuButton = () => {
  let data1: any = {
    page: 1,
    size: 1000,
  };
  api
    .get("/api/admin/searchPowerMenusList", { params: data1 })
    .then((res: any) => {
      if (res.code == 200) {
        let list: any = res.body.list;
        for (let index = 0; index < list.length; index++) {
          for (
            let index1 = 0;
            index1 < list[index].menusList.length;
            index1++
          ) {
            let d: any = {
              menuId: list[index].menusList[index1].id,
            };
            api
              .get("/api/admin/getPowerButtonsByMenuId", {
                params: d,
              })
              .then((res1: any) => {
                if (res1.code == 200) {
                  list[index].menusList[index1]["buttonList"] = res1.body;
                  list[index].menusList[index1]["input"] = "";
                  list[index].menusList[index1]["show"] = false;
                }
              });
          }
        }

        setTimeout(() => {
          openFullScreen2("0");
          menuData.value = list;
        }, 1000);
      }
    });
};

const addMenu = (item: any) => {
  data.value.menuList = {
    buttonsName: "",
    menusId: "",
    permissionIdentification: "",
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

// 标签
const handleClose1 = (tag: any, index: any, index1: any, tagIndex: any) => {
  menuData.value[index].menusList[index1].buttonList.splice(
    menuData.value[index].menusList[index1].buttonList.indexOf(tag),
    1
  );

  let ids: any = {
    ids: tag.id,
  };

  if (
    buttondelet.value.id &&
    buttondelet.value.buttonsName &&
    buttondelet.value.menusId
  ) {
    api.post("/api/admin/delPowerButtons", ids).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "删除成功！",
        });
        menuButton();
      } else {
        ElMessage({
          type: "error",
          message: "删除失败！",
        });
      }
    });
  } else {
    ElMessage({
      type: "error",
      message: "您的权限不够!",
    });
  }
};

const showInput = (item: any, index: any) => {
  SavaData.value = item;
  inputVisible.value = true;
  item.show = true;

  // nextTick(() => {
  //   InputRef.value!.input!.focus()
  // })
};

const handleInputConfirm = (item: any) => {
  if (item.input) {
    let shotData: any = {
      buttonsName: item.input,
      menusId: SavaData.value.id,
      permissionIdentification: "",
    };

    http.post("/api/admin/insertPowerButtons", shotData).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "添加成功!",
        });
        menuButton();
      } else {
        ElMessage({
          type: "error",
          message: "添加失败!",
        });
      }
    });

    // dynamicTags.value.push(inputValue.value)
  }
  item.show = false;
  item.input = "";
  inputVisible.value = false;
  inputValue.value = "";
};

const shot = (item: any) => {
  data.value.menuShow = false;

  if (data.value.menuTitle == "确定") {
    http
      .post("/api/admin/insertPowerButtons", data.value.menuList)
      .then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "添加成功!",
          });
          menuButton();
        } else {
          ElMessage({
            type: "error",
            message: "添加失败!",
          });
        }
      });
  } else if (data.value.menuTitle == "修改") {
    let i: any = {
      buttonsName: data.value.menuList.buttonsName,
      id: data.value.menuList.id,
      menusId: data.value.menuList.menusId,
      permissionIdentification: data.value.menuList.permissionIdentification,
    };

    http.post("/api/admin/updatePowerButtons", i).then((res: any) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "修改成功!",
        });
        menuButton();
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
  data.value.menuTitle = "修改";
  data.value.menuShow = !data.value.menuShow;
  data.value.menuList = item;
};

const deletes = (item: any) => {};
</script>

<style scoped lang="scss">
body {
  font-family: Lato, "PingFang SC", "Microsoft YaHei", sans-serif;
}
</style>
