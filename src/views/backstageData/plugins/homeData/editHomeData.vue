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
        <!-- <el-form-item label="插件数据" prop="jsonData">
            <el-input v-model="form.jsonData" placeholder="插件数据" clearable />
          </el-form-item> -->
        <el-table
          :data="jsonDatas"
          style="width: 100%"
          :header-cell-style="{
            background: '#f3f6fd',
            color: '#555',
            textAlign: 'center',
          }"
        >
          <el-table-column type="selection" />

          <el-table-column
            prop="data"
            label="data"
            show-overflow-tooltip
            align="center"
          >
            <template #default="scope">
              <div>{{ scope.row.data }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="data_type" label="data_type" align="center" />
          <el-table-column
            prop="description"
            label="说明"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="key_description"
            label="key_description"
            show-overflow-tooltip
            align="center"
          >
            <template #default="scope">
              <div>{{ scope.row.key_description }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="parms" label="parms" align="center" />
          <el-table-column
            prop="sql"
            show-overflow-tooltip
            label="sql"
            align="center"
          />

          <el-table-column prop="type" label="type" align="center" />
          <el-table-column
            fixed="right"
            label="操作"
            width="150"
            align="center"
          >
            <template #default="scope">
              <!-- <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleClick(scope.row.id)"
                  >删除</el-button
                > -->
              <el-button
                link
                type="primary"
                size="small"
                @click="editClick(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-model="dialogVisible"
          title="修改"
          width="50%"
          style="padding: 20px"
        >
          <div v-if="show == 0">
            <div
              style="
                display: flex;
                flex-direction: row-reverse;
                margin-bottom: 5px;
              "
            >
              <el-button type="primary" @click="add">添加</el-button>
            </div>
            <el-scrollbar height="400px">
              <div v-for="(item, index) in list" style="margin-bottom: 20px">
                <!-- {{ item }} -->
                <!-- <button @click="del(index)">删除</button> -->
                <div v-for="(children, ind) in item">
                  <div>
                    <div
                      style="
                        font-size: 18px;
                        margin-right: 20px;
                        display: flex;
                        align-items: center;
                        margin-bottom: 5px;
                      "
                    >
                      <div style="width: 180px; text-align: center">
                        {{ obj1[ind] }}:
                      </div>
                      <el-input
                        v-model="item[ind]"
                        placeholder="Please input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  style="
                    display: flex;
                    flex-direction: row-reverse;
                    margin-bottom: 5px;
                  "
                >
                  <el-button round type="danger" @click="del(index)"
                    >删除</el-button
                  >
                </div>
              </div>
            </el-scrollbar>
          </div>

          <div v-if="show == 1">
            <el-scrollbar height="400px">
              <div v-for="(children, ind) in obj2">
                <div>
                  <div
                    style="
                      font-size: 18px;
                      margin-right: 20px;
                      display: flex;
                      align-items: center;
                      margin-bottom: 5px;
                    "
                  >
                    <div style="width: 180px; text-align: center">
                      {{ ind }}:
                    </div>
                    <el-input
                      v-model="obj2[ind]"
                      placeholder="Please input"
                      @click="changeGoods(children, ind, obj2)"
                    />
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <ChangeGoods
            v-if="comp.modelValue"
            v-model="comp.modelValue"
            :id="businessId"
            @success="update"
          ></ChangeGoods>
          <!-- 铭德服饰 -->
          <div v-if="show == 3">
            <el-scrollbar height="400px">
              <div v-for="(children, ind) in obj4">
                <div
                  style="
                    font-size: 18px;
                    margin-right: 20px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                  "
                >
                  <div style="width: 180px; text-align: center">{{ ind }}:</div>
                  <el-input
                    v-model="obj4[ind]"
                    @click="changeGoods(children, ind, obj2)"
                    placeholder="Please input"
                  />
                </div>
              </div>
            </el-scrollbar>
          </div>

          <div v-if="show == 4">
            <el-scrollbar height="400px">
              <div v-for="(children, ind) in obj5">
                <div
                  style="
                    font-size: 18px;
                    margin-right: 20px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                  "
                >
                  <div style="width: 180px; text-align: center">{{ ind }}:</div>
                  <el-input v-model="obj5[ind]" placeholder="Please input" />
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div v-if="show == 2">
            <el-scrollbar height="400px">
              <h2 style="text-align: center">陪诊服务</h2>
              <el-button @click="addServer" type="primary" plain
                >添加服务</el-button
              >
              <div v-for="(item, index) in obj3.classificationList" class="box">
                <div class="box-con">
                  <div style="font-weight: 600; margin-right: 10px">
                    服务{{ index + 1 }}
                  </div>
                  <el-button
                    @click="delServer(index)"
                    type="danger"
                    size="small"
                    plain
                    >删除此服务</el-button
                  >
                </div>
                <div class="box-con">
                  <span>服务名称：</span>

                  <el-input
                    v-model="item.classificationName"
                    placeholder="请输入"
                    clearable
                  />
                </div>
                <div class="box-con">
                  <span>服务价格</span>
                  <el-input
                    v-model="item.money"
                    placeholder="请输入"
                    clearable
                    type="number"
                  />
                </div>
                <div class="box-con">
                  <span>服务图标</span>
                  <img
                    @dblclick="delServiceImage(index, 'classificationIcon')"
                    v-if="item.classificationIcon"
                    :src="item.classificationIcon"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index, 'classificationIcon')"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>服务详情图</span>
                  <img
                    @dblclick="delServiceImage(index, 'classificationImages')"
                    v-if="item.classificationImages"
                    :src="item.classificationImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index, 'classificationImages')"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>基本信息图</span>
                  <img
                    @dblclick="delServiceImage(index, 'basicInformationImages')"
                    v-if="item.basicInformationImages"
                    :src="item.basicInformationImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index, 'basicInformationImages')"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>价格说明图</span>
                  <img
                    @dblclick="delServiceImage(index, 'priceDescriptionImages')"
                    v-if="item.priceDescriptionImages"
                    :src="item.priceDescriptionImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index, 'priceDescriptionImages')"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>预定须知图</span>
                  <img
                    @dblclick="
                      delServiceImage(index, 'reservationNoticeImages')
                    "
                    v-if="item.reservationNoticeImages"
                    :src="item.reservationNoticeImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload(index, 'reservationNoticeImages')"
                  >
                    <input type="file" @change="change" />
                    点击上传
                  </el-button>
                </div>
              </div>

              <h2 style="text-align: center">特色服务</h2>
              <el-button @click="addServer1" type="primary" plain
                >添加服务</el-button
              >
              <div v-for="(item, index) in obj3.featuredServices" class="box">
                <div class="box-con">
                  <div style="font-weight: 600; margin-right: 10px">
                    服务{{ index + 1 }}
                  </div>
                  <el-button
                    @click="delServer1(index)"
                    type="danger"
                    size="small"
                    plain
                    >删除此服务</el-button
                  >
                </div>
                <div class="box-con">
                  <span>服务名称：</span>

                  <el-input
                    v-model="item.classificationName"
                    placeholder="请输入"
                    clearable
                  />
                </div>
                <div class="box-con">
                  <span>服务价格</span>
                  <el-input
                    v-model="item.money"
                    placeholder="请输入"
                    clearable
                    type="number"
                  />
                </div>
                <div class="box-con">
                  <span>服务图标</span>
                  <img
                    @dblclick="delServiceImage1(index, 'classificationIcon')"
                    v-if="item.classificationIcon"
                    :src="item.classificationIcon"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload1(index, 'classificationIcon')"
                  >
                    <input type="file" @change="change1" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>服务详情图</span>
                  <img
                    @dblclick="delServiceImage1(index, 'classificationImages')"
                    v-if="item.classificationImages"
                    :src="item.classificationImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload1(index, 'classificationImages')"
                  >
                    <input type="file" @change="change1" />
                    点击上传
                  </el-button>
                </div>

                <div class="box-con">
                  <span>基本信息图</span>
                  <img
                    @dblclick="
                      delServiceImage1(index, 'basicInformationImages')
                    "
                    v-if="item.basicInformationImages"
                    :src="item.basicInformationImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload1(index, 'basicInformationImages')"
                  >
                    <input type="file" @change="change1" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>价格说明图</span>
                  <img
                    @dblclick="
                      delServiceImage1(index, 'priceDescriptionImages')
                    "
                    v-if="item.priceDescriptionImages"
                    :src="item.priceDescriptionImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload1(index, 'priceDescriptionImages')"
                  >
                    <input type="file" @change="change1" />
                    点击上传
                  </el-button>
                </div>
                <div class="box-con">
                  <span>预定须知图</span>
                  <img
                    @dblclick="
                      delServiceImage1(index, 'reservationNoticeImages')
                    "
                    v-if="item.reservationNoticeImages"
                    :src="item.reservationNoticeImages"
                    class="avatar"
                  />
                  <el-button
                    v-else
                    class="file"
                    @click="upload1(index, 'reservationNoticeImages')"
                  >
                    <input type="file" @change="change1" />
                    点击上传
                  </el-button>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="Confirmchange">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-form>
      <!-- <div class="footer">
          <el-button size="large" @click="onCancel"> 取消 </el-button>
          <el-button type="primary" size="large" @click="onSubmit">
            确定
          </el-button>
        </div> -->
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import ChangeGoods from "@/components/changeGoods/index.vue";

const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();

const form: any = ref({
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  id: route.params.id ?? "",
  jsonData: "",
  plugsId: Number(route.params.plugsId) ?? "",
  jsonViewData: {},
});
const jsonDatas = ref([]);
const formRef = ref();
const formRules = ref({
  title: [{ required: true, message: "请输入插件名称" }],
});
const plugsList: any = ref([]);
const businessId: any = ref();
onMounted(() => {
  // 获取插件列表
  api.get("/api/plugs/searchPlugsInfoList").then((res: any) => {
    if (res.code == 200) {
      plugsList.value = res.body.list;
    }
  });

  if (form.value.id !== "") {
    api
      .get("/api/plugs/searchPlugsHomeDataById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        if (res.code == 200) {
          form.value = res.body;
          businessId.value = JSON.parse(JSON.stringify(res.body.businessId));
          jsonDatas.value = JSON.parse(res.body.jsonData);

          form.value.id = res.body.id;
        } else {
          ElMessage.error({
            message: res.msg,
            center: true,
          });
        }
      });
  }
});
const comp = ref({
  modelValue: false,
});
const changeGoods = (item: any, index: any, obj: any) => {
  if (index == "parms") {
    comp.value.modelValue = true;
  }
};
const update = (item: any) => {
  if (item) {
    obj2.value.parms = item.join();
  }
  comp.value.modelValue = false;
};

function onSubmit() {
  form.value.jsonData = JSON.stringify(form.value.jsonData);
  if (form.value.id === "") {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/insertPlugsHomeData", form.value)
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
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
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          api
            .post("/api/plugs/updatePlugsHomeData", form.value)
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
function onCancel() {
  tabbar.close({ name: "editHomeData" });
  router.push({
    name: "homeData",
    params: {
      id: route.params.plugsId,
      admin: "user",
    },
  });
}
const dialogVisible = ref(false);
const list: any = ref([]);
const obj1: any = ref({});
const obj2: any = ref({});
const obj3: any = ref({});
const obj4: any = ref({});
const obj5: any = ref({});
const show = ref(0);
// 修改里面的数据
const editClick = (item: any) => {
  if (item.data_type == "static" && item.type == "ax001") {
    show.value = 0;
    obj1.value = item.key_description;
    list.value = item.data;
    dialogVisible.value = true;
  } else if (item.data_type == "sql" && item.type == "ax002") {
    show.value = 1;
    obj2.value = item;
    dialogVisible.value = true;
  } else if (item.data_type == "static" && item.type == "ax002") {
    show.value = 2;
    obj3.value = item.data;
    dialogVisible.value = true;
  } else if (item.data_type == "sql" && item.type == "ax001") {
    show.value = 3;
    obj4.value = item;
    dialogVisible.value = true;
  } else if (item.data_type == "sql" && item.type == "ax002") {
    show.value = 4;
    obj5.value = item;
    dialogVisible.value = true;
  }
  dialogVisible.value = true;
};

const Confirmchange = () => {
  if (show.value == 0) {
    dialogVisible.value = false;
  } else if (show.value == 1) {
    dialogVisible.value = false;
  }

  form.value.jsonData = JSON.stringify(jsonDatas.value);

  api.post("/api/plugs/updatePlugsHomeData", form.value).then((res: any) => {
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
};
const add = () => {
  let arr = Object.keys(obj1.value);
  let obj: any = {};
  for (let index = 0; index < arr.length; index++) {
    obj[arr[index]] = "";
  }
  list.value.push(obj);
};
const del = (index: any) => {
  list.value.splice(index, 1);
};

// 陪诊服务
const addServer = () => {
  let obj = {
    classificationIcon: "",
    classificationImages: "",
    money: 50,
    classificationName: "",
    basicInformationImages: "",
    shortIntroduction: "",
    reservationNoticeImages: "",
    priceDescriptionImages: "",
  };
  obj3.value.classificationList.push(obj);
};

const delServer = (index: any) => {
  obj3.value.classificationList.splice(index, 1);
};

// 添加服务图片
const inx: any = ref(0);
const names: any = ref("");
const upload = (index: any, name: any) => {
  inx.value = index;
  names.value = name;
  // form.value.serverListJson.splice(index, 1);
};

const change = (e: any) => {
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("type", "1");
  api.post("/api/file/uploadImages", formData).then((res: any) => {
    if (names.value == "classificationIcon") {
      obj3.value.classificationList[inx.value].classificationIcon = res.body;
    } else if (names.value == "classificationImages") {
      obj3.value.classificationList[inx.value].classificationImages = res.body;
    } else if (names.value == "basicInformationImages") {
      obj3.value.classificationList[inx.value].basicInformationImages =
        res.body;
    } else if (names.value == "priceDescriptionImages") {
      obj3.value.classificationList[inx.value].priceDescriptionImages =
        res.body;
    } else if (names.value == "reservationNoticeImages") {
      obj3.value.classificationList[inx.value].reservationNoticeImages =
        res.body;
    }
  });
};
const delServiceImage = (index: any, name: any) => {
  if (name == "classificationIcon") {
    obj3.value.classificationList[index].classificationIcon = "";
  } else if (name == "classificationImages") {
    obj3.value.classificationList[index].classificationImages = "";
  } else if (name == "basicInformationImages") {
    obj3.value.classificationList[index].basicInformationImages = "";
  } else if (name == "priceDescriptionImages") {
    obj3.value.classificationList[index].priceDescriptionImages = "";
  } else if (name == "reservationNoticeImages") {
    obj3.value.classificationList[index].reservationNoticeImages = "";
  }
};
// serverListJson.value[index].serviceImage = "";
// 特色服务
const addServer1 = () => {
  let obj = {
    classificationIcon: "",
    classificationImages: "",
    money: 50,
    basicInformationImages: "",
    shortIntroduction: "",
    reservationNoticeImages: "",
    priceDescriptionImages: "",
    classificationName: "(半天服务)",
  };
  obj3.value.featuredServices.push(obj);
};

const delServer1 = (index: any) => {
  obj3.value.featuredServices.splice(index, 1);
};

// 添加服务图片
const inx1: any = ref(0);
const names1: any = ref("");
const upload1 = (index: any, name: any) => {
  inx1.value = index;
  names1.value = name;
  // form.value.serverListJson.splice(index, 1);
};

const change1 = (e: any) => {
  // 手写的input需要一个对象将本地图片转换为对应的格式来上传
  let formData = new FormData();
  // e.target.files就是选中的文件的一个数组
  formData.append("file", e.target.files[0]);
  formData.append("type", "1");
  api.post("/api/file/uploadImages", formData).then((res: any) => {
    if (names1.value == "classificationIcon") {
      obj3.value.featuredServices[inx1.value].classificationIcon = res.body;
    } else if (names1.value == "classificationImages") {
      obj3.value.featuredServices[inx1.value].classificationImages = res.body;
    } else if (names1.value == "basicInformationImages") {
      obj3.value.featuredServices[inx1.value].basicInformationImages = res.body;
    } else if (names1.value == "priceDescriptionImages") {
      obj3.value.featuredServices[inx1.value].priceDescriptionImages = res.body;
    } else if (names1.value == "reservationNoticeImages") {
      obj3.value.featuredServices[inx1.value].reservationNoticeImages =
        res.body;
    }
  });
};
const delServiceImage1 = (index: any, name: any) => {
  if (name == "classificationIcon") {
    obj3.value.featuredServices[index].classificationIcon = "";
  } else if (name == "classificationImages") {
    obj3.value.featuredServices[index].classificationImages = "";
  } else if (name == "basicInformationImages") {
    obj3.value.featuredServices[index].basicInformationImages = "";
  } else if (name == "priceDescriptionImages") {
    obj3.value.featuredServices[index].priceDescriptionImages = "";
  } else if (name == "reservationNoticeImages") {
    obj3.value.featuredServices[index].reservationNoticeImages = "";
  }
};
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  margin: 10px 0;
  .box-con {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      text-align: center;
      border: 1px dashed var(--el-border-color);
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
    img {
      width: 60px;
      height: 60px;
    }
    span {
      width: 100px;
    }
  }
}
</style>

<style></style>
