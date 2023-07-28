<route lang="yaml">
name: homeRotation
meta:
  title: 文件管理组件
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <el-dialog
      v-model="dialogVisibles"
      title="文件管理"
      width="1100"
      height="500"
    >
      <div class="container">
        <div class="content">
          <div class="header">
            <div class="header-left">
              <el-button type="primary" @click="dialogVisible = true">
                <template #icon>
                  <el-icon>
                    <svg-icon name="i-ep:plus" />
                  </el-icon>
                </template>
                新建分组
              </el-button>
            </div>
            <div class="header-right">
              <div>
                <el-icon
                  style="margin-right: 20px"
                  :size="26"
                  :color="checked ? '#409eff' : '#999'"
                  @click="changeChecked"
                  ><CircleCheck
                /></el-icon>
                <el-icon
                  :size="26"
                  color="#999"
                  v-if="dellist.length > 0"
                  @click="del"
                  ><Delete
                /></el-icon>
              </div>
              <div>
                <el-button
                  type="primary"
                  plain
                  class="file"
                  v-loading.fullscreen.lock="fullscreenLoading"
                  element-loading-text="上传中"
                >
                  <template #icon>
                    <el-icon>
                      <svg-icon name="i-ep:upload" />
                    </el-icon>
                  </template>
                  <input type="file" @change="addUpload" />
                  点击上传
                </el-button>
              </div>
            </div>
          </div>
          <div class="content-con">
            <div class="content-con-left">
              <el-scrollbar height="440" style="height: 500px"
                ><div
                  v-for="(item, index) in FileList"
                  class="FileList"
                  :class="num == index ? 'active' : ''"
                >
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <div style="width: 140px" @click="change(item, index)">
                      {{ item.filegroupname }}
                    </div>
                    <div v-if="index !== 0">
                      <el-icon color="red" @click="delFile(item, index)"
                        ><Delete
                      /></el-icon>
                    </div>
                  </div></div
              ></el-scrollbar>
            </div>
            <div class="content-con-right">
              <div class="sort">
                <div class="sort-left">
                  <div class="sort-left-one">
                    <div class="one">
                      <div class="one1">
                        <el-icon color="#999"><CaretTop /></el-icon>
                      </div>
                      <div class="one2">
                        <el-icon color="#999"><CaretBottom /></el-icon>
                      </div>
                    </div>
                    按时间排序
                  </div>
                  <div class="sort-left-one">
                    <div class="one">
                      <div class="one1">
                        <el-icon color="#999"><CaretTop /></el-icon>
                      </div>
                      <div class="one2">
                        <el-icon color="#999"><CaretBottom /></el-icon>
                      </div>
                    </div>
                    按名称排序
                  </div>
                  <!-- <div>按名称排序</div> -->
                </div>
                <div class="sort-right">点击文件名称可复制图片链接</div>
              </div>
              <el-scrollbar height="440" style="height: 500px">
                <div class="imageList">
                  <div v-for="item in dataImageList" class="imageBox">
                    <div class="image" @click="btnchange(item)">
                      <img :src="item.url" alt="" class="img" />
                      <div class="shohow" v-if="item.extJson == 1">
                        <el-icon color="#FFF" size="36"><Check /></el-icon>
                      </div>
                    </div>
                    <div class="imageName" @click="coppy(item.url)">
                      {{ item.fileName }}
                    </div>
                  </div>
                </div>
                <div v-if="dataImageList.length == 0">
                  <el-empty description="暂无图片数据" />
                </div>
              </el-scrollbar>
              <div style="display: flex; justify-content: center">
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
        </div>
        <el-dialog v-model="dialogVisible" :title="title" width="400px">
          <div style="display: flex; align-items: center; padding-left: 20px">
            <div style="width: 100px">分组名称：</div>
            <el-input v-model="input" placeholder="分组名称：" />
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="editTitle"> 确定 </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="changesure"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import useUserStore from "@/store/modules/user";
import { ElMessage, ElMessageBox } from "element-plus";
const userStore = useUserStore();
const menuActive: any = ref("全部");
const num: any = ref(0);
const FileList: any = ref([]);
const dataImageList: any = ref([]);
const dialogVisible = ref(false);
const total = ref(0);
const input = ref("");
const checked = ref(false);
const title = ref("新建分组");
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
});
const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    source: any;
  }>(),
  {
    dialogVisible: false,
    source: 0,
  }
);

const dialogVisibles: any = ref(props.dialogVisible);
const source: any = ref(props.source);

onMounted(() => {
  get_group();
});
const get_group = () => {
  api.get("/api/file/getFileByGroupTitle").then((res: any) => {
    if (res.code == 200) {
      FileList.value = res.body || [];
      // menuActive.value = res.body[0].filegroupname;
      getImageList();
    }
  });
};

const getImageList = () => {
  const data1: any = {
    groupName: menuActive.value,
    page: tableobj.currentPage,
    size: tableobj.pageSize,
  };
  api
    .get("/api/file/searchPlugsByGroup", {
      params: data1,
    })
    .then((res: any) => {
      if (res.code == 200) {
        dataImageList.value = res.body.list;
        dataImageList.value.forEach((item: any) => {
          item.extJson = 0;
        });
        total.value = res.body.total;
      }
    });
};
const fullscreenLoading = ref(false);
const addUpload = (e: any) => {
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("fileGroupName", menuActive.value);
  fullscreenLoading.value = true;
  api.post("/api/file/uploadFile", formData).then((res: any) => {
    if (res.code == 200) {
      getImageList();
    }
    fullscreenLoading.value = false;
  });
};
const change = (item: any, index: any) => {
  num.value = index;
  menuActive.value = item.filegroupname;
  getImageList();
};

const dellist: any = ref([]);
const emutlist: any = ref([]);
const btnchange = (item: any) => {
  if (source.value == 0) {
    if (item.extJson == 0) {
      item.extJson = 1;
      dellist.value.push(item.id);
    } else {
      item.extJson = 0;
      dellist.value.splice(dellist.value.indexOf(item.id), 1);
    }
  } else if (source.value == 1) {
    if (item.extJson == 0) {
      if (dellist.value.length == 0) {
        item.extJson = 1;
        dellist.value.push(item.id);
        emutlist.value.push(item.url);
      } else {
        ElMessage.success({
          message: "最多可选择一张",
          center: true,
        });
      }
    } else if (item.extJson == 1) {
      dataImageList.value.forEach((items: any) => {
        items.extJson = 0;
      });
      dellist.value = [];
      emutlist.value = [];
      checked.value = false;
    }
  } else if (source.value == 2) {
    if (item.extJson == 0) {
      item.extJson = 1;
      dellist.value.push(item.id);
      emutlist.value.push(item.url);
    } else {
      item.extJson = 0;
      dellist.value.splice(dellist.value.indexOf(item.id), 1);
      emutlist.value.splice(dellist.value.indexOf(item.url), 1);
    }
  }
};
const changeChecked = () => {
  dellist.value = [];
  emutlist.value = [];
  checked.value = !checked.value;
  if (source.value == 0) {
    if (checked.value) {
      if (dataImageList.value.length >= 10) {
        for (let i = 0; i < 10; i++) {
          dataImageList.value[i].extJson = 1;
          dellist.value.push(dataImageList.value[i].id);
        }
      } else {
        dataImageList.value.forEach((item: any) => {
          item.extJson = 1;
          dellist.value.push(item.id);
        });
      }
    } else {
      dataImageList.value.forEach((item: any) => {
        item.extJson = 0;
      });
      dellist.value = [];
    }
  } else if (source.value == 1) {
    if (checked.value) {
      dataImageList.value.forEach((item: any) => {
        item.extJson = 0;
      });
      dataImageList.value[0].extJson = 1;
      dellist.value.push(dataImageList.value[0].id);
      emutlist.value.push(dataImageList.value[0].url);
    } else {
      dataImageList.value.forEach((item: any) => {
        item.extJson = 0;
      });
      dellist.value = [];
      emutlist.value = [];
    }
  } else if (source.value == 2) {
    if (checked.value) {
      if (dataImageList.value.length >= 10) {
        for (let i = 0; i < 10; i++) {
          dataImageList.value[i].extJson = 1;
          dellist.value.push(dataImageList.value[i].id);
          emutlist.value.push(dataImageList.value[i].url);
        }
      } else {
        dataImageList.value.forEach((item: any) => {
          item.extJson = 1;
          dellist.value.push(item.id);
          emutlist.value.push(item.url);
        });
      }
    } else {
      dataImageList.value.forEach((item: any) => {
        item.extJson = 0;
      });
      dellist.value = [];
      emutlist.value = [];
    }
  }
};
const del = () => {
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api
        .post("/api/file/delPlugsFile", {
          ids: dellist.value.join(),
        })
        .then((res: any) => {
          if (res.code == 200) {
            ElMessage.success({
              message: res.msg,
              center: true,
            });
            dellist.value = [];
            checked.value = false;
            get_group();
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
const coppy = (url: any) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      ElMessage.success("复制成功");
    })
    .catch(() => {
      ElMessage.error("复制失败");
    });
};
function handleSizeChange(val: any) {
  tableobj.pageSize = val;
  getImageList();
}
function handleCurrentChange(val: any) {
  tableobj.currentPage = val;
  getImageList();
}
const emit = defineEmits(["success"]);

const changesure = () => {
  dialogVisibles.value = false;
  emit("success", emutlist.value);
  dellist.value = [];
  emutlist.value = [];
};
// 回调
function onCancel(item: any) {
  dialogVisibles.value = false;
  emit("success", emutlist.value);
  dellist.value = [];
  emutlist.value = [];
}
const editTitle = () => {
  let data = {
    groupName: input.value,
  };
  api
    .get("/api/file/createFileGroup", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        dialogVisible.value = false;
        input.value = "";
        get_group();
      }
    });
};
const delFile = (item: any, index: any) => {
  ElMessageBox.confirm(
    "如果分组下有附件数据则不能删除该分组，是否继续删除？",
    "删除提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      let data1: any = {
        groupName: item.filegroupname,
        page: tableobj.currentPage,
        size: tableobj.pageSize,
      };
      api
        .get("/api/file/searchPlugsByGroup", {
          params: data1,
        })
        .then((res: any) => {
          if (res.code == 200) {
            if (res.body.list.length == 0) {
              let data = {
                groupName: item.filegroupname,
              };
              api
                .get("/api/file/deleteFileGroup", {
                  params: data,
                })
                .then((res1: any) => {
                  if (res1.code == 200) {
                    get_group();
                  } else {
                    ElMessage.error({
                      message: res1.msg,
                      type: "error",
                    });
                  }
                });
            }
          }
        });
    })
    .catch(() => {});
};
</script>
<style scoped lang="scss">
.container {
  padding: 10px;
}

.content {
  padding: 20px;
  background-color: #fff;
}
.header {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #f5f5f5;
  .header-left {
    width: 200px;
    text-align: center;
    border-right: 1px solid #f5f5f5;
    margin-right: 20px;
  }
  .header-right {
    display: flex;
    align-items: center;
    width: 800px;
    justify-content: space-between;
  }
}
.content-con {
  display: flex;
  height: 600px;
  // justify-content: space-between;
  padding: 0 0 20px 0;
  .content-con-left {
    padding-top: 20px;
    width: 200px;
    border-right: 1px solid #f5f5f5;
    .FileList {
      padding: 10px;
    }
    .active {
      border-left: 2px solid #409eff;
      color: #409eff;
    }
  }
  .content-con-right {
    width: 850px;

    .sort {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #333;
      padding: 20px;
      .sort-left {
        display: flex;
        align-items: center;
        .sort-left-one {
          display: flex;
          align-items: center;
          margin-right: 20px;
          .one {
            width: 20px;

            .one1 {
              height: 10px;
            }
            .one2 {
            }
          }
        }
      }
      .sort-right {
      }
    }
    .imageList {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20px;
      .imageBox {
        width: 110px;
        margin-bottom: 10px;
        margin-right: 20px;
        border: 1px solid #efefef;

        .image {
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #efefef;
          position: relative;
          /*background: #f2f2f2;*/

          .img {
            max-width: 110px;
            max-height: 110px;
            padding: 5px;
          }
          .shohow {
            width: 110px;
            height: 110px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.3);
            position: absolute;
            left: 0;
            top: 0;
          }
        }
        .imageName {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          font-size: 14px;
          color: #333;
          padding: 10px 5px;
        }
      }
    }
  }
}
.file {
  position: relative;
  width: 100px;
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
  text-decoration: none;
}
</style>
