<template>
  <div class="content" style="padding: 20px; background-color: #fff">
    <el-button @click="add">添加规格</el-button>
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
    <el-table
      :data="tableData"
      style="width: 100%"
      v-if="tableData.length !== 0"
    >
      <el-table-column v-for="(item, i) in guige" :label="item.name">
        <template #default="scope" v-if="guige.length >= 2">
          {{ scope.row[i] }}</template
        >
        <template #default="scope" v-if="guige.length == 1">
          {{ scope.row }}</template
        >
      </el-table-column>
      <el-table-column label="价格" prop="name">
        <template #default="scope">
          <el-input
            v-model="scope.row.scribePrice"
            class="ml-1 w-20"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column label="成交价" prop="name">
        <template #default="scope">
          <el-input
            v-model="scope.row.dealPrice"
            class="ml-1 w-20"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="name">
        <template #default="scope">
          <el-input
            v-model="scope.row.stockNum"
            class="ml-1 w-20"
            size="small"
          />
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
        margin-top: 100px;
      "
    >
      <el-button type="primary">提交信息</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { ElInput } from "element-plus";

const tableData: any = ref([]); //表格的数据
const changetableData: any = ref([]); //传递的数据
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
const arr: any = ref([]); //排列组合的数据
const list: any = ref([]);
const multiplyData: any = (newArrData: any) => {
  let len = newArrData.length;
  // 当数组长度大于等于2时
  if (len >= 2) {
    // 第一个数组的长度
    let len1 = newArrData[0].length;
    // 第二个数组的长度
    let len2 = newArrData[1].length;
    //  申明一个新数组,做数据暂存
    let items = new Array();
    // 申明新数组的索引
    let index = 0;
    // 2层嵌套循环,将组合放到新数组中
    for (var i = 0; i < len1; i++) {
      for (var j = 0; j < len2; j++) {
        if (items.length < index + 1) {
          items.push([]);
        }
        if (newArrData[0][i] instanceof Array) {
          items[index] = items[index].concat(
            newArrData[0][i].concat(newArrData[1][j])
          );
        } else {
          items[index] = items[index].concat([
            newArrData[0][i],
            newArrData[1][j],
          ]);
        }
        index++;
      }
    }
    // 将新组合的数组并到原数组中
    let newArr = new Array(len - 1);
    for (let i = 2; i < newArrData.length; i++) {
      newArr[i - 1] = newArrData[i];
    }
    newArr[0] = items;
    // 执行回调
    return multiplyData(newArr);
  } else {
    return newArrData[0];
  }
};

onMounted(() => {});

const handleClose = (tag: string, index: any) => {
  console.log(guige.value[index].value.indexOf(tag), tag, 456);
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
  console.log(index);

  list.value = [];
  changetableData.value = [];
  if (guige.value[index].title) {
    guige.value[index].value.push(guige.value[index].title);
  }
  guige.value[index].show = false;
  guige.value[index].title = "";

  console.log(guige.value);

  arr.value = [];
  for (let sum = 0; sum < guige.value.length; sum++) {
    arr.value.push(guige.value[sum].value);
  }
  console.log(arr.value);

  tableData.value = multiplyData(arr.value);
  console.log(tableData.value, 9999);

  // for (let aa: any = 0; aa < guige.value.length; aa++) {
  //   list.value.push(guige.value[aa].name);
  // }

  // tableData.value.forEach((element: any) => {
  //   // element.specificationName = element.join();
  //   changetableData.value.push(getnewarr(list.value, element));
  //   element.specificationImages = "";
  //   element.scribePrice = 499;
  //   element.dealPrice = 279;
  //   element.stockNum = 20;
  // });
  // console.log(tableData.value, 888);
  // console.log(changetableData.value, 999);

  // let tableData1 = deepCopy(tableData.value);

  // for (let aa: any = 0; aa < guige.value.length; aa++) {
  //   tableData1.forEach((item: any) => {
  //     for (let index = 0; index < item.length; index++) {
  //       if (aa === index) {
  //         item.splice(index, 2);
  //         item.specificationName = item.specificationName.split(",");

  //         // getnewarr(a, b);
  //         console.log(getnewarr(list.value, item.specificationName), 9999);
  //         changetableData.value.push(
  //           getnewarr(list.value, item.specificationName)
  //         );
  //       }
  //     }
  //   });
  // }
  // console.log("data", tableData.value, 666);

  // console.log("data", changetableData.value, 777);
};
function getnewarr(keyArr: any, valueArr: any) {
  const arr1: any = [];
  keyArr.map((v: any, i: any) => {
    const obj1: any = {};
    obj1[keyArr[i]] = valueArr[i];
    arr1.push(obj1);
  });
  return arr1;
}

const deepCopy = (obj: any) => {
  if (typeof obj !== "object") return;
  var newObj: any = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
};

const adddd = () => {
  for (let index = 0; index < tableData.value.length; index++) {
    changetableData.value.forEach((element: any, inx: any) => {
      // console.log(inx);
      if (index == inx) {
        element.specificationName = JSON.stringify(element);
        element.specificationImages =
          tableData.value[index].specificationImages;
        element.scribePrice = tableData.value[index].scribePrice;
        element.dealPrice = tableData.value[index].dealPrice;
        element.stockNum = tableData.value[index].stockNum;
      }
    });
  }
  console.log("data", tableData.value, 777);
  console.log("data", changetableData.value, 99965);
};
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
};
</script>
<style scoped lang="scss">
.title {
  margin-bottom: 30px;
  font-size: 12px;
  color: #666;
  padding: 10px;
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
</style>
