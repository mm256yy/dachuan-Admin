<template>
  <div class="content" style="background-color: #fff">
    <el-button style="margin-bottom: 10px" @click="add">添加规格</el-button>
    <div class="title" style="" v-if="guige.length !== 0">
      <div v-for="(item, index) in guige" class="title-box">
        <div class="title-name">
          规格名：
          <input type="text" v-model="item.name" style="" />
          <div class="icon">
            <el-icon size="20" @click="del(index)"><CircleClose /></el-icon>
          </div>
        </div>
        <div style="margin: 10px 10px">
          规格值：
          <el-tag
            v-for="(tag, inde) in item.value"
            :key="inde"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleClose(tag, index)"
            style="margin-right: 20px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            style="width: 200px; height: 30px"
            v-if="item.show"
            ref="InputRef"
            v-model="item.title"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleInputConfirm(index)"
            @blur="handleInputConfirm(index)"
          />
          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showInput(index)"
          >
            添加规格属性
          </el-button>
        </div>
      </div>
    </div>
    <div
      v-if="tableData.length > 1"
      style="
        margin-bottom: 10px;
        display: flex;

        align-items: center;
      "
    >
      <el-input
        v-model="value1"
        placeholder="批量设置成交价"
        class="ml-1 w-20"
        size="small"
        type="number"
        style="width: 200px; height: 40px"
      />
      <el-input
        v-model="value2"
        placeholder="批量设置划线价"
        class="ml-1 w-20"
        size="small"
        type="number"
        style="width: 200px; height: 40px; margin: 0 30px"
      />
      <el-input
        v-model="value3"
        placeholder="批量设置库存"
        class="ml-1 w-20"
        size="small"
        type="number"
        style="width: 200px; height: 40px"
      />
      <el-button style="margin-left: 20px" type="primary" @click="moreSet()"
        >批量设置</el-button
      >
    </div>

    <el-table
      :data="tableData"
      style="width: 100%"
      border
      v-if="tableData.length !== 0"
    >
      <!-- replace(/\"/g, "") -->

      <el-table-column label="规格名称" align="center">
        <template #default="scope">
          {{
            scope.row.specificationName
              .replace(/\"/g, "")
              .replace(/\{|}/g, "")
              .replace(/\,/g, "+")
          }}</template
        >
      </el-table-column>

      <el-table-column label="成交价" prop="name" align="center">
        <template #default="scope">
          <el-input
            v-model="scope.row.dealPrice"
            class="ml-1 w-20"
            size="small"
            type="number"
            style="width: 200px; height: 40px"
          >
            <template #prepend> ￥ </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="划线价" prop="name" align="center">
        <template #default="scope">
          <el-input
            v-model="scope.row.scribePrice"
            class="ml-1 w-20"
            type="number"
            size="small"
            style="width: 200px; height: 40px"
          >
            <template #prepend> ￥ </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="name" align="center">
        <template #default="scope">
          <el-input
            v-model="scope.row.stockNum"
            class="ml-1 w-20"
            type="number"
            size="small"
            style="width: 200px; height: 40px"
          >
            <template #prepend> ￥ </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="SKU编号" prop="name" align="center">
        <template #default="scope">
          <el-input
            v-model="scope.row.specificationNumber"
            class="ml-1 w-20"
            size="small"
            style="width: 200px; height: 40px"
          >
            <template #prepend> 编号 </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存位置" prop="name" align="center">
        <template #default="scope">
          <el-input
            v-model="scope.row.position"
            class="ml-1 w-20"
            size="small"
            style="width: 200px; height: 40px"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="规格图片" prop="name" align="center">
        <template #default="scope">
          <img
            style="width: 50px; height: 50px"
            v-if="scope.row.specificationImages"
            :src="scope.row.specificationImages"
            class="avatar"
            @click="upload_file(scope.$index)"
          />

          <el-button v-else class="file" @click="upload_file(scope.$index)">
            点击上传
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Name" prop="name">
        <template #default="scope">
          <el-input v-model="scope.row.name2" class="ml-1 w-20" size="small" />
        </template>
      </el-table-column> -->
    </el-table>
    <div
      style="
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      "
    >
      <!-- <el-button type="primary" @click="submit()">保存规格</el-button> -->
    </div>
    <dialogWindows
      v-if="dialogPluginList.dialogVisible"
      v-model="dialogPluginList.dialogVisible"
      :dialogVisible="dialogPluginList.dialogVisible"
      :source="dialogPluginList.source"
      @success="Return"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElInput } from "element-plus";
import api from "@/api";
const props = withDefaults(
  defineProps<{
    goodId: any;
  }>(),
  {
    goodId: "",
  }
);
const goodId: any = ref(0);
const value1: any = ref("");
const value2: any = ref("");
const value3: any = ref("");
if (props.goodId) {
  goodId.value = props.goodId;
}
const tableData: any = ref([]); //表格的数据
const tableData1: any = ref([]); //表格的数据
const guige: any = ref([
  // {
  //   name: "颜色",
  //   value: ["绿色", "黄色"],
  //   title: "",
  //   show: false,
  // },
  // {
  //   name: "大小",
  //   value: ["大", "中"],
  //   title: "",
  //   show: false,
  // },
]);
const InputRef = ref<InstanceType<typeof ElInput>>();
const indexNum: any = ref(0);

const changeindex = (index: any) => {
  indexNum.value = index;
};
const changedel = (index: any) => {
  indexNum.value = index;
  tableData.value[indexNum.value].specificationImages = "";
};

const fullscreenLoading = ref(false);

onMounted(() => {
  if (goodId.value !== 0) {
    let data = {
      goodsId: goodId.value,
    };
    api
      .get("/api/plugs/searchPlugsGoodsSpecificationByGoodsId", {
        params: data,
      })
      .then((res: any) => {
        if (res.code == 200) {
          if (res.body.specificationInfo.length !== 0) {
            let arr = [];
            // this.specificationInfo = res.body.specificationInfo;
            for (let item of res.body.specificationInfo) {
              let obj1: any = {
                name: Object.keys(item)[0],
                value: [],
                title: "",
                show: false,
                children: Object.values(item)[0],
              };
              arr.push(obj1);
            }
            arr.forEach((item) => {
              item.children.forEach((ress: any) => {
                item.value.push(ress.attributeValue);
              });
            });
            guige.value = arr;
            let arr1: any = [];
            res.body.plugsGoodsSpecificationList.forEach((item: any) => {
              let obj2 = {
                specificationName: item.specificationName,
                scribePrice: item.scribePrice,
                dealPrice: item.dealPrice,
                stockNum: item.stockNum,
                specificationNumber: item.specificationNumber,
                specificationImages: item.specificationImages,
                position: item.position,
              };
              arr1.push(obj2);
            });

            tableData.value = arr1;
            tableData1.value = arr1;

            emit("success", guige.value, tableData.value);
          }
        }
      });
  }
});
// watch(监听的数据，副作用函数，配置对象)
watch(
  () => [...tableData.value],
  (newData: any, oldData: any) => {
    if (oldData != "[]" && oldData) {
      oldData.forEach((item: any) => {
        tableData.value.forEach((element: any) => {
          if (item.specificationName === element.specificationName) {
            element.specificationName = item.specificationName;
            element.scribePrice = item.scribePrice;
            element.dealPrice = item.dealPrice;
            element.stockNum = item.stockNum;
            element.specificationNumber = item.specificationNumber;
            element.specificationImages = item.specificationImages;
            element.position = item.position;
          }
        });
        emit("success", guige.value, tableData.value);
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const add = () => {
  let obj = {
    name: "",
    value: [],
    title: "",
    show: false,
  };
  guige.value.push(obj);
};
const del = (index: any) => {
  guige.value.splice(index, 1);

  if (guige.value.length == 0) {
    tableData.value = [];
    // emit("success", guige.value, tableData.value);
  } else {
    getTbable();
    // emit("success", guige.value, tableData.value);
  }
};
const handleClose = (tag: string, index: any) => {
  guige.value[index].value.splice(guige.value[index].value.indexOf(tag), 1);
  handleInputConfirm(index);
};

const showInput = (index: any) => {
  guige.value[index].show = true;
  // nextTick(() => {
  //   InputRef.value!.input!.focus();
  // });
};

const handleInputConfirm = (index: any) => {
  if (guige.value[index].title) {
    guige.value[index].value.push(guige.value[index].title);
  }
  guige.value[index].show = false;
  guige.value[index].title = "";

  getTbable();
  // emit("success", guige.value, tableData.value);
};
const permutation = (source: any) => {
  const result: any = [];
  const _result: any = {};
  const convert = (arr: any, index: any) => {
    for (let i = 0; i < source[arr[index]].length; i++) {
      if (source[arr[index]][i]) {
        _result[arr[index]] = source[arr[index]][i];
        if (index === arr.length - 1) {
          result.push(JSON.parse(JSON.stringify(_result)));
        } else {
          convert(arr, index + 1);
        }
      }
    }
  };
  convert(Object.keys(source), 0);

  return result;
};
const getTbable = () => {
  let obj: any = {};
  for (let sum = 0; sum < guige.value.length; sum++) {
    obj[guige.value[sum].name] = guige.value[sum].value;
  }
  tableData.value = permutation(obj);

  let arr: any = [];
  tableData.value.forEach((item: any, index: any) => {
    let name = {
      specificationName: "",
    };
    name.specificationName = JSON.stringify(item);
    arr.push(name);
  });

  arr.forEach((item: any, index: any) => {
    item.scribePrice = "";
    item.dealPrice = "";
    item.stockNum = "";
    item.specificationNumber = "";
    item.specificationImages = "";
    item.position = "";
    // item.goodsId = this.goodsId;
  });
  tableData.value = arr;
};

const moreSet = () => {
  tableData.value.forEach((item: any) => {
    item.dealPrice = value1.value;
    item.scribePrice = value2.value;
    item.stockNum = value3.value;
  });
};

const submit = () => {
  emit("success", guige.value, tableData.value);
};
const emit = defineEmits(["success"]);

const types: any = ref("");
// 使用文件管理组件
import dialogWindows from "@/components/FileManagement/dialogWindows.vue";
const dialogPluginList: any = ref({
  dialogVisible: false,
  source: 1,
});

const upload_file = (item: any) => {
  dialogPluginList.value.dialogVisible = true;
  dialogPluginList.value.source = 1;
  types.value = item;
};

const Return = (data: any) => {
  dialogPluginList.value.dialogVisible = false;
  tableData.value[types.value].specificationImages = data[0];
};
</script>
<style scoped lang="scss">
.title {
  margin-bottom: 10px;
  font-size: 12px;
  color: #666;
  border: 1px solid #e5e5e5;
  .title-box {
    .title-name {
      position: relative;
      padding: 7px 10px;
      background-color: #f8f8f8;
      line-height: 16px;
      font-weight: 400;
      input {
        width: 200px;
        border: none;
        height: 32px;
        line-height: 32px;
        padding-right: 20px;
        outline-color: rgb(153, 153, 255); //设置点击后边框为蓝色
        text-indent: 1em;
      }
      input:focus::-webkit-input-placeholder {
        //设置点击后placeholder的样式变化
        font-size: 14px;
        color: red;
      }
      .icon {
        position: absolute;
        right: 10px;
        top: 10px;
        // opacity: 0;
        display: none;
      }
    }
  }
  .title-box:hover .title-name .icon {
    // opacity: 1;
    display: block;
  }
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
