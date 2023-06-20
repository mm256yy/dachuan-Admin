<route lang="yaml">
name: homeRotation
meta:
  title: 运费模板
  icon: ant-design:home-twotone
</route>
<template>
  <div class="container">
    <div class="content">
      <div class="header" style="margin-bottom: 20px">
        <div class="header-left">
          <el-button type="primary" @click="addPlugin">
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:circle-plus" />
              </el-icon>
            </template>
            创建模板
          </el-button>
          <el-popover
            placement="top-start"
            title="Title"
            :width="200"
            trigger="hover"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <el-button class="m-2">运费计算规则</el-button>
            </template>
          </el-popover>
        </div>
      </div>
      <div class="main">
        <div
          v-for="item in tableData"
          style="border: 1px solid #f5f5f5; margin-bottom: 20px"
          v-if="tableData.length !== 0"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div style="display: flex; align-items: center">
              <el-button
                type="warning"
                v-if="item.computeType == 1"
                style="margin: 10px"
              >
                按购买件数
              </el-button>
              <el-button
                type="success"
                v-else-if="item.computeType == 2"
                style="margin: 10px"
              >
                按下单距离
              </el-button>
              <el-button
                type="info"
                v-else-if="item.computeType == 3"
                style="margin: 10px"
              >
                按购买重量
              </el-button>
              <div
                style="display: flex; align-items: center; color: #409eff"
                @click="editClick(item.id)"
              >
                <span style="margin: 0 10px 0 0; font-size: 14px">{{
                  item.templateName
                }}</span
                ><el-icon size="20" color="#409eff">
                  <Edit />
                </el-icon>
              </div>
            </div>
            <div class="title" @click="handleClick(item.id)">删除运费模版</div>
          </div>

          <el-table
            v-loading="loading"
            :data="item.provinceList"
            style="width: 100%"
            row-key="provinceName"
            lazy
            :header-cell-style="{
              background: '#f3f6fd',
              color: '#555',
              textAlign: 'center',
            }"
          >
            <el-table-column prop="title" label="可配送区域" width="300">
              <template #default="scope">
                <div>{{ scope.row.provinceName }}</div>
                <!-- <div>{{ scope.row.id }}</div> -->
                <!-- <el-tree-select
                  v-model="scope.row.id"
                  :data="ProvinceList"
                  multiple
                  :render-after-expand="false"
                />
                <el-divider /> -->
                <!-- <el-select v-model="value" clearable placeholder="Select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> -->
              </template>
            </el-table-column>

            <el-table-column
              prop="title"
              v-if="item.computeType == 1"
              label="首件(个)"
              align="center"
            >
              <template #default="scope">
                <!-- <div>{{ scope.row.expressfeeConfList[0] }}</div> -->
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstNumber"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 2"
              label="X米内"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstNumber"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 3"
              label="首重(kg)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstNumber"
                  placeholder=""
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="title"
              v-if="item.computeType == 1"
              label="运费(元)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstPrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 2"
              label="运费X元"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstPrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 3"
              label="运费(元)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].firstPrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="title"
              v-if="item.computeType == 1"
              label="续件(个)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continueNumber"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 2"
              label="每增加X米"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continueNumber"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 3"
              label="续重(kg)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continueNumber"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>

            <el-table-column
              prop="title"
              v-if="item.computeType == 1"
              label="续费(元)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continuePrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 2"
              label="运费增加X元"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continuePrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              v-if="item.computeType == 3"
              label="运费(元)"
              align="center"
            >
              <template #default="scope">
                <el-input
                  @change="storeChange(scope.row)"
                  v-model="scope.row.expressfeeConfList[0].continuePrice"
                  placeholder="批量修改"
                />
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="120"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="storeClick(scope.row)"
                  >保存</el-button
                >
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleClick1(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div
            class="title"
            @click="addClick(item)"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 10px;
              color: #7dacf6;
            "
          >
            添加可配送区域和运费
          </div>
        </div>
        <div v-else>
          <el-empty description="暂无模板信息 " />
        </div>
      </div>

      <!-- <div class="example-pagination-block">
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
      </div> -->
    </div>
    <div>
      <el-dialog
        v-model="show"
        title="选择地区"
        width="50%"
        :close-on-click-modal="false"
      >
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <!-- <el-tree-select
            v-model="value"
            :data="ProvinceList"
            :render-after-expand="false"
            multiple

            show-checkbox
            @check-change="change"
          /> -->
          <el-tree-select
            v-model="value"
            lazy
            :props="props"
            :load="loadNode"
            show-checkbox
            ref="tree"
            @check-change="handleCheckChange"
            :cache-data="ProvinceList"
            :render-after-expand="false"
            :check-strictly="true"
            multiple
            :check-on-click-node="true"
          />
          <!-- <el-tree
            :props="props"
            :load="loadNode"
            lazy
            show-checkbox
            @check-change="handleCheckChange"
          /> -->
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="show = false">取消</el-button>
            <el-button type="primary" @click="Confirm"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      :plugsId="data.formModeProps.plugsId"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/index/index.vue";
import storage from "@/utils/storage";
import { result } from "lodash-es";
const route = useRoute();
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
});
const show: any = ref(false);
const loading = ref(false);
import { ElLoading } from "element-plus";

const fullscreenLoading = ref(false);
const value: any = ref();
let count = 1;
const props = {
  label: "provinceName",
  children: "children",
};

const handleCheckChange = (
  data: any,
  checked: boolean,
  indeterminate: boolean
) => {
  const res = tree.value.getCheckedNodes();
  console.log(res.length, data);

  // console.log(res[0].value.length);
  if (res.length === 1) {
    if (res[0].value.length == 2) {
      codelist.value = [];
      api
        .get("/api/platform/searchCityList", {
          params: { provinceCode: res[0].value },
        })
        .then((res: any) => {
          if (res.code == 200) {
            // ProvinceList.value = res.body;
            res.body.cityAll.forEach((item: any) => {
              api
                .get("/api/platform/searchAreaList", {
                  params: { code: item.cityCode },
                })
                .then((result: any) => {
                  if (result.code == 200) {
                    result.body.forEach((element: any) => {
                      codelist.value.push(element);
                    });
                  }
                });
            });
          }
        });
    } else if (res[0].value.length == 4) {
      api
        .get("/api/platform/searchAreaList", {
          params: { code: res[0].value },
        })
        .then((result: any) => {
          if (result.code == 200) {
            result.body.forEach((element: any) => {
              codelist.value.push(element);
            });
          }
        });
    } else if (res[0].value.length == 6) {
      codelist.value.push(data);
    }
  } else if (res.length > 1) {
    res.forEach((item: any) => {
      console.log(item);
      if (item.value.length === 2) {
        api
          .get("/api/platform/searchCityList", {
            params: { provinceCode: item.value },
          })
          .then((res: any) => {
            if (res.code == 200) {
              citylist.value = [];
              res.body.cityAll.forEach((item1: any) => {
                citylist.value.push(item1);
              });
              citylist.value.forEach((result: any) => {
                api
                  .get("/api/platform/searchAreaList", {
                    params: { code: result.cityCode },
                  })
                  .then((result: any) => {
                    if (result.code == 200) {
                      result.body.forEach((element: any) => {
                        codelist.value.push(element);
                      });
                    }
                  });
              });
            }
          });
      } else if (item.value.length == 4) {
        api
          .get("/api/platform/searchAreaList", {
            params: { code: item.value },
          })
          .then((result: any) => {
            if (result.code == 200) {
              result.body.forEach((element: any) => {
                codelist.value.push(element);
              });
            }
          });
      } else if (item.value.length == 6) {
        codelist.value.push(item);
      }
    });
  }
};

const change = (e: any, a: any, b: any) => {
  console.log(value.value, 99888);
  const res = tree.value.getCheckedNodes();
  if (res.length == 1) {
    console.log(456456);
    api
      .get("/api/platform/searchCityList", {
        params: { provinceCode: e.value },
      })
      .then((res: any) => {
        if (res.code == 200) {
          // ProvinceList.value = res.body;
          res.body.cityAll.forEach((item: any) => {
            api
              .get("/api/platform/searchAreaList", {
                params: { code: item.cityCode },
              })
              .then((result: any) => {
                if (result.code == 200) {
                  result.body.forEach((element: any) => {
                    codelist.value.push(element);
                  });
                  // list.forEach((element: any) => {
                  //   let data: any = {
                  //     adminId: 0,
                  //     areaCode: element.areaCode,
                  //     businessId: 0,
                  //     cityCode: element.cityCode,
                  //     continueNumber: 0,
                  //     continuePrice: 0,
                  //     firstNumber: 0,
                  //     firstPrice: 0,
                  //     provinceCode: element.provinceCode,
                  //     templateId: templateId.value,
                  //     userServiceToken: "",
                  //   };
                  //   codelist.value.push(data);
                  // });
                }
              });
          });
        }
      });
  } else if (res.length > 1) {
    console.log(456);
    codelist.value = [];

    res.forEach((item: any) => {
      console.log(item);

      api
        .get("/api/platform/searchCityList", {
          params: { provinceCode: item.value },
        })
        .then((res: any) => {
          if (res.code == 200) {
            citylist.value = [];
            res.body.cityAll.forEach((item1: any) => {
              citylist.value.push(item1);
            });
            citylist.value.forEach((result: any) => {
              api
                .get("/api/platform/searchAreaList", {
                  params: { code: result.cityCode },
                })
                .then((result: any) => {
                  if (result.code == 200) {
                    result.body.forEach((element: any) => {
                      codelist.value.push(element);
                    });
                  }
                });
            });
          }
        });
    });
  }
};

const loadNode = (node: any, resolve: (data: any) => void) => {
  console.log(node, 9999999);

  if (node.level === 0) {
    return resolve(ProvinceList.value);
  } else if (node.level === 1) {
    console.log(node.data.label);
    setTimeout(() => {
      let data: any = [];
      api
        .get("/api/platform/searchCityList", {
          params: { provinceCode: node.data.provinceCode },
        })
        .then((res: any) => {
          if (res.code == 200) {
            console.log(res.body.cityAll);
            res.body.cityAll.forEach((item: any) => {
              item.provinceName = item.cityName;
              item.value = item.cityCode;
              data.push(item);
            });
            console.log(data, 456);
            resolve(data);
          }
        });
    }, 500);
  } else if (node.level === 2) {
    console.log(node.data);
    setTimeout(() => {
      let data: any = [];
      api
        .get("/api/platform/searchAreaList", {
          params: { code: node.data.cityCode },
        })
        .then((res: any) => {
          if (res.code == 200) {
            console.log(res.body.cityAll);
            res.body.forEach((item: any) => {
              item.provinceName = item.areaName;
              item.value = item.areaCode;
              data.push(item);
            });
            console.log(data, 456);
            resolve(data);
          }
        });
    }, 500);
  }
  if (node.level === 3) return resolve([]);
};
onMounted(() => {
  // if (!storage.local.get("ProvinceList")) {
  //   getProvinceList();
  // } else {
  //   console.log();
  //   ProvinceList.value=JSON.parse(storage.local.get("ProvinceList"))
  // }
  getProvinceList();

  getlist();
});
// 获取省市区
const ProvinceList: any = ref([]);
const getProvinceList = () => {
  api.get("/api/platform/searchProvinceList").then((res: any) => {
    if (res.code == 200) {
      ProvinceList.value = res.body;
      ProvinceList.value.forEach((item: any) => {
        item.label = item.provinceName;
        item.value = item.provinceCode;
        item.children = item.cityList;
      });
    }
  });

  // api.get("/api/platform/getALLProvinceList").then((res: any) => {
  //   if (res.code == 200) {
  //     ProvinceList.value = res.body;
  //     ProvinceList.value.forEach((item: any) => {
  //       item.label = item.provinceName;
  //       item.value = item.provinceCode;
  //       item.children = item.cityList;
  //       item.children.forEach((element: any) => {
  //         element.label = element.cityName;
  //         element.value = element.cityCode;
  //         element.children = element.areaList;
  //         element.children.forEach((result: any) => {
  //           result.label = result.areaName;
  //           result.value = result.areaCode;
  //         });
  //       });
  //     });
  //     storage.local.set("ProvinceList", JSON.stringify(ProvinceList.value));
  //   }
  // });
};
// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});
const userServiceToken = ref(storage.local.get("userServiceToken"));

function getlist() {
  const loading = ElLoading.service({
    lock: true,
    text: "模板信息正在初始化",
  });
  let data = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    plugsId: route.params.id,
    keyword: tableobj.keyword,
  };
  api
    .get("/api/platform/searchExpressfeeTemplateList", { params: data })
    .then((res: any) => {
      tableData.value = res.body.list;
      if (tableData.value) {
        tableData.value.forEach((element: any) => {
          if (element.provinceList) {
            element.provinceList.forEach((item: any) => {
              item.children = item.cityList;
              item.status = 1;
              item.expressfeeConfList = [
                {
                  firstPrice: "",
                  firstNumber: "",
                  continueNumber: "",
                  continuePrice: "",
                },
              ];
              item.children.forEach((result: any) => {
                result.children = result.areaList;
                result.provinceName = result.cityName;
                result.status = 2;

                result.list = [];
                result.children.forEach((result1: any) => {
                  result1.provinceName = result1.areaName;
                  result1.status = 3;
                  if (result.cityCode == result.cityCode) {
                    result.list.push(result1.expressfeeConfList[0]);
                  }
                });
                result.expressfeeConfList = [
                  {
                    firstPrice: "",
                    firstNumber: "",
                    continueNumber: "",
                    continuePrice: "",
                  },
                ];
              });
            });
          }
        });
      }
      console.log(tableData.value);

      loading.close();
      total.value = res.body.total;
      tableobj.keyword = "";
      codelist.value = [];
    })
    .catch((err: any) => {
      setTimeout(() => {
        loading.close();
      }, 2000);
      ElMessage.error({
        message: "数据加载失败",
        center: true,
      });
    });
}
function findMostFrequentId(arr: any, item: any) {
  const map = new Map();
  let maxCount = 0;
  let mostFrequentId = null;
  for (const elem of arr) {
    const id = elem.item;
    const count = (map.get(id) || 0) + 1;
    map.set(id, count);
    if (count > maxCount) {
      maxCount = count;
      mostFrequentId = id;
    }
  }
  return mostFrequentId;
}

// const mostFrequentId = findMostFrequentId(arr);
// console.log(mostFrequentId, 999); // 输出 3
// 新增插件
function addPlugin() {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
  data.value.formModeProps.plugsId = route.params.id;
}

// 删除插件
const handleClick = (e: any) => {
  let data = {
    ids: e,
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/platform/delExpressfeeTemplate", data).then((res: any) => {
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
  data.value.formModeProps.plugsId = route.params.id;
};

// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
}
const templateId: any = ref();
const businessId: any = ref();
const addClick = (item: any) => {
  show.value = true;
  templateId.value = item.id;
  businessId.value = item.businessId.toString();
};
function group(array: any, subGroupLength: any) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}

const tree: any = ref(null);

const codelist: any = ref([]);
const citylist: any = ref([]);

const Confirm = () => {
  if (codelist.value.length == 0) {
    ElMessage.error({
      message: "请选择添加数据",
      center: true,
    });
    return;
  }
  console.log(codelist.value);
  const loading = ElLoading.service({
    lock: true,
    text: "模板信息正在初始化",
  });
  show.value = false;
  let list1: any = [];
  let list2: any = [];
  codelist.value.forEach((element: any) => {
    let data: any = {
      areaCode: element.areaCode,
      businessId: businessId.value,
      cityCode: element.cityCode,
      continueNumber: 0,
      continuePrice: 0,
      firstNumber: 0,
      firstPrice: 0,
      provinceCode: element.provinceCode,
      templateId: templateId.value,
      adminId: storage.local.get("adminId"),
      userServiceToken: storage.local.get("userServiceToken"),
    };
    list1.push(data);
  });
  // group(list1, 200);
  list2 = group(list1, 500);
  list2.forEach((elements: any, index: any) => {
    console.log(index);
    http
      .post("/api/platform/insertExpressfeeConf", elements)
      .then((res: any) => {
        if (res.code == 200) {
          ElMessage.success({
            message: res.msg,
            center: true,
          });

          loading.close();
          if (index == list2.length - 1) {
            getlist();
          }
          value.value = "";
        }
      })
      .catch((err: any) => {
        setTimeout(() => {
          loading.close();
        }, 2000);
        ElMessage.error({
          message: "数据加载失败",
          center: true,
        });
      });
  });

  // return;
  // let list: any = [];
  // codelist.value = [];
  // api
  //   .get("/api/platform/searchCityList", {
  //     params: { provinceCode: value.value },
  //   })
  //   .then((res: any) => {
  //     if (res.code == 200) {
  //       // ProvinceList.value = res.body;
  //       res.body.cityAll.forEach((item: any) => {
  //         api
  //           .get("/api/platform/searchAreaList", {
  //             params: { code: item.cityCode },
  //           })
  //           .then((result: any) => {
  //             if (result.code == 200) {
  //               result.body.forEach((element: any) => {
  //                 list.push(element);
  //               });
  //               // list.forEach((element: any) => {
  //               //   let data: any = {
  //               //     adminId: 0,
  //               //     areaCode: element.areaCode,
  //               //     businessId: 0,
  //               //     cityCode: element.cityCode,
  //               //     continueNumber: 0,
  //               //     continuePrice: 0,
  //               //     firstNumber: 0,
  //               //     firstPrice: 0,
  //               //     provinceCode: element.provinceCode,
  //               //     templateId: templateId.value,
  //               //     userServiceToken: "",
  //               //   };
  //               //   codelist.value.push(data);
  //               // });
  //             }
  //           });
  //         // .then(() => {
  //         //   list.forEach((element: any) => {
  //         //     let data = {
  //         //       adminId: 0,
  //         //       areaCode: element.areaCode,
  //         //       businessId: 0,
  //         //       cityCode: element.cityCode,
  //         //       continueNumber: 0,
  //         //       continuePrice: 0,
  //         //       firstNumber: 0,
  //         //       firstPrice: 0,
  //         //       provinceCode: element.provinceCode,
  //         //       templateId: templateId.value,
  //         //       userServiceToken: "",
  //         //     };
  //         //     codelist.push(data);
  //         //   });
  //         // });
  //       });
  //       // http
  //       //   .post("/api/platform/insertExpressfeeConf", codelist.value)
  //       //   .then((res: any) => {
  //       //     if (res.code == 200) {
  //       //       ElMessage.success({
  //       //         message: res.msg,
  //       //         center: true,
  //       //       });
  //       //       getlist();
  //       //     }
  //       //   });
  //     }
  //   })
  //   .then(() => {
  //   });

  // let data = [
  //   {
  //     adminId: 0,
  //     areaCode: "330113",
  //     businessId: 0,
  //     cityCode: "3303",
  //     continueNumber: 0,
  //     continuePrice: 0,
  //     firstNumber: 0,
  //     firstPrice: 0,
  //     provinceCode: "33",
  //     templateId: id,
  //     userServiceToken: "",
  //   },
  // ];
  // http.post("/api/platform/insertExpressfeeConf", data).then((res: any) => {
  //   if (res.code == 200) {
  //     ElMessage.success({
  //       message: res.msg,
  //       center: true,
  //     });
  //     getlist();
  //   }
  // });
};
const storeChange = (item: any) => {
  let data: any = [];
  if (item.status == 1) {
    let list: any = [];
    item.children.forEach((result: any) => {
      result.children.forEach((result1: any) => {
        list.push(result1);
      });
    });

    list.forEach((ress: any) => {
      ress.expressfeeConfList[0].continueNumber =
        item.expressfeeConfList[0].continueNumber;
      ress.expressfeeConfList[0].continuePrice =
        item.expressfeeConfList[0].continuePrice;
      ress.expressfeeConfList[0].firstNumber =
        item.expressfeeConfList[0].firstNumber;
      ress.expressfeeConfList[0].firstPrice =
        item.expressfeeConfList[0].firstPrice;
    });
  } else if (item.status == 2) {
    item.children.forEach((element: any) => {
      element.expressfeeConfList[0].continueNumber =
        item.expressfeeConfList[0].continueNumber;
      element.expressfeeConfList[0].continuePrice =
        item.expressfeeConfList[0].continuePrice;
      element.expressfeeConfList[0].firstNumber =
        item.expressfeeConfList[0].firstNumber;
      element.expressfeeConfList[0].firstPrice =
        item.expressfeeConfList[0].firstPrice;
    });
  } else if (item.status == 3) {
  }
};

const storeClick = (item: any) => {
  fullscreenLoading.value = true;
  let data: any = [];
  if (item.status == 1) {
    if (
      item.expressfeeConfList[0].continueNumber &&
      item.expressfeeConfList[0].continuePrice &&
      item.expressfeeConfList[0].continuePrice &&
      item.expressfeeConfList[0].firstNumber
    ) {
      let list: any = [];
      item.children.forEach((result: any) => {
        result.children.forEach((result1: any) => {
          list.push(result1);
        });
      });
      list.forEach((ress: any) => {
        let obj = {
          areaCode: ress.expressfeeConfList[0].areaCode,
          businessId: ress.expressfeeConfList[0].businessId,
          cityCode: ress.expressfeeConfList[0].cityCode,
          continueNumber: item.expressfeeConfList[0].continueNumber,
          continuePrice: item.expressfeeConfList[0].continuePrice,
          firstNumber: item.expressfeeConfList[0].firstNumber,
          firstPrice: item.expressfeeConfList[0].firstPrice,
          provinceCode: ress.expressfeeConfList[0].provinceCode,
          templateId: ress.expressfeeConfList[0].templateId,
          adminId: ress.expressfeeConfList[0].adminId,
          id: ress.expressfeeConfList[0].id,
          userServiceToken: ress.expressfeeConfList[0].userServiceToken,
        };
        data.push(obj);
      });
    } else {
      ElMessage.error({
        message: "省市区数据填写不完全，请检查",
        center: true,
      });
    }
  } else if (item.status == 2) {
    if (
      item.expressfeeConfList[0].continueNumber &&
      item.expressfeeConfList[0].continuePrice &&
      item.expressfeeConfList[0].continuePrice &&
      item.expressfeeConfList[0].firstNumber
    ) {
      item.children.forEach((element: any) => {
        element.expressfeeConfList[0].continueNumber =
          item.expressfeeConfList[0].continueNumber;
        element.expressfeeConfList[0].continuePrice =
          item.expressfeeConfList[0].continuePrice;
        element.expressfeeConfList[0].firstNumber =
          item.expressfeeConfList[0].firstNumber;
        element.expressfeeConfList[0].firstPrice =
          item.expressfeeConfList[0].firstPrice;
        let obj = {
          areaCode: element.expressfeeConfList[0].areaCode,
          businessId: element.expressfeeConfList[0].businessId,
          cityCode: element.expressfeeConfList[0].cityCode,
          continueNumber: item.expressfeeConfList[0].continueNumber,
          continuePrice: item.expressfeeConfList[0].continuePrice,
          firstNumber: item.expressfeeConfList[0].firstNumber,
          firstPrice: item.expressfeeConfList[0].firstPrice,
          provinceCode: element.expressfeeConfList[0].provinceCode,
          templateId: element.expressfeeConfList[0].templateId,
          adminId: element.expressfeeConfList[0].adminId,
          id: element.expressfeeConfList[0].id,
          userServiceToken: element.expressfeeConfList[0].userServiceToken,
        };
        data.push(obj);
      });
    } else {
      ElMessage.error({
        message: "市区数据填写不完全，请检查",
        center: true,
      });
    }
  } else if (item.status == 3) {
    // data = item.expressfeeConfList;
    data = [
      {
        areaCode: item.expressfeeConfList[0].areaCode,
        businessId: item.expressfeeConfList[0].businessId,
        cityCode: item.expressfeeConfList[0].cityCode,
        continueNumber: item.expressfeeConfList[0].continueNumber,
        continuePrice: item.expressfeeConfList[0].continuePrice,
        firstNumber: item.expressfeeConfList[0].firstNumber,
        firstPrice: item.expressfeeConfList[0].firstPrice,
        provinceCode: item.expressfeeConfList[0].provinceCode,
        templateId: item.expressfeeConfList[0].templateId,
        adminId: item.expressfeeConfList[0].adminId,
        id: item.expressfeeConfList[0].id,
        userServiceToken: item.expressfeeConfList[0].userServiceToken,
      },
    ];
  }

  http.post("/api/platform/updateExpressfeeConf", data).then((res: any) => {
    if (res.code == 200) {
      fullscreenLoading.value = false;
      ElMessage.success({
        message: res.msg,
        center: true,
      });
      getlist();
    }
  });
};
const handleClick1 = (item: any) => {
  let data: any = [];
  let num: any = [];
  if (item.status == 1) {
    let list: any = [];
    item.children.forEach((result: any) => {
      result.children.forEach((result1: any) => {
        list.push(result1);
      });
    });
    list.forEach((ress: any) => {
      data.push(ress.expressfeeConfList[0].id);
    });
    num = {
      ids: data.join(),
    };
  } else if (item.status == 2) {
    item.children.forEach((element: any) => {
      data.push(element.expressfeeConfList[0].id);
    });
    num = {
      ids: data.join(),
    };
  } else if (item.status == 3) {
    // data = item.expressfeeConfList;
    data = item.expressfeeConfList[0].id;
    num = {
      ids: data,
    };
  }

  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/platform/delExpressfeeConf", num).then((res: any) => {
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
  .main {
    .title {
      margin: 0 20px;
      color: #999;
      font-size: 14px;
    }
    .title:hover {
      color: #7dacf6;
    }
    :deep(.cell) {
      display: flex;
      align-items: center;
    }
  }
}
:deep(.el-select) {
  width: 400px;
}
</style>
