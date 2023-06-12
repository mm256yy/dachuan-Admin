<template>
  <div class="container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick1">
          <el-tab-pane label="分销记录" name="first">
            <el-scrollbar height="64vh">
              <div class="content">
                <div class="header" style="margin-bottom: 20px">

                  <div class="header-left">
                    <!-- <el-button type="primary" @click="addPlugin">
                      <template #icon>
                        <el-icon>
                          <svg-icon name="i-ep:circle-plus" />
                        </el-icon>
                      </template>
                      新增分销
                    </el-button> -->

                    <el-button type="primary" @click="setPlugin">
                      <template #icon>
                        <el-icon>
                          <svg-icon name="i-ep:circle-plus" />
                        </el-icon>
                      </template>
                      分销设置
                    </el-button>

                    <el-button
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
                        style="width: 150px"
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
                      background: '#f3f6fd',
                      color: '#555',
                      textAlign: 'center',
                    }"
                  >
                    <el-table-column type="selection" />

                    <el-table-column prop="id" label="ID" align="center" width="70" />

                    <el-table-column
                      prop="orderId"
                      label="订单id"
                      width="200"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.orderId }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="orderNo"
                      label="订单编号	"
                      width="300"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.orderNo }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="orderUserId" label="订单用户id	" align="center">
                      <template #default="scope">
                        <div>{{ scope.row.orderUserId }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="profitableUserId"
                      label="获利用户id	"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.profitableUserId }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rebaeType" label="返利类型" align="center">
                      <template #default="scope">
                        <div v-if="scope.row.rebaeType == 1">自购返佣</div>
                        <div v-if="scope.row.rebaeType == 2">好友返佣</div>
                        <div v-if="scope.row.rebaeType == 3">分享返佣</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rebateAmount" label="返利金额	" align="center">
                      <template #default="scope">
                        <div>{{ scope.row.rebateAmount }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rebateRatio" label="返利比例" align="center">
                      <template #default="scope">
                        <div>{{ scope.row.rebateRatio * 100 }}%</div>
                      </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="80">
                      <template #default="scope">
                        <el-button type="danger" @click="delPlugsRebate(handleClick(scope.row.id))">删除</el-button>

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
            </el-scrollbar>
          </el-tab-pane>
            <el-tab-pane label="分销统计" name="second">
              <el-scrollbar height="64vh">
                <div class="content">
                  <div class="header" style="margin-bottom: 20px">

                    <div class="header-left">

                      <el-button
                        type="danger"
                        @click="delPlugin1"
                        :disabled="!multipleSelection1.length"
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
                          style="width: 150px"
                          v-model="tableobj2.keyword"
                          placeholder="请输入ID"
                          @keyup.enter.native="get_fenxiao"
                        />
                      </div>
                      <el-button
                        type="primary"
                        style="margin: 0 20px 0 30px"
                        @click="get_fenxiao"
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
                    :data="tableData1"
                    style="width: 100%"
                    @selection-change="handleSelectionChange1"
                    :header-cell-style="{
                        background: '#f3f6fd',
                        color: '#555',
                        textAlign: 'center',
                      }"
                  >
                    <el-table-column type="selection" width="55" />

                    <el-table-column prop="id" label="ID" align="center" width="70" />

                   <el-table-column

                      label="自购返佣	"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.selfPurchaseRebate }}</div>
                      </template>
                    </el-table-column>


                    <el-table-column

                      label="好友返利	"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.friendRebate }}</div>
                      </template>
                    </el-table-column>


                    <el-table-column
                      prop="orderNo"
                      label="分享返利	"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.shareRebate }}</div>
                      </template>
                    </el-table-column>



                  <el-table-column
                      prop="orderNo"
                      label="累计自购返佣"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.totalSelfPurchaseRebate }}</div>
                      </template>

                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="累计自购返佣"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.totalFriendRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="累计好友返利"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.totalFriendRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="累计分享返利"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.totalShareRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="已提现自购返利"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawFriendRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="已提现好友返利"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawFriendRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="已提现分享返利"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawShareRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="状态"

                      align="center"
                    >
                      <template #default="scope">
                        <div>
                          <el-switch
                            v-model="scope.row.show"
                            class="ml-2"
                            inline-prompt
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="正常"
                            inactive-text="冻结"
                          />
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="操作"

                      align="center"
                    >
                      <template #default="scope">
                        <div>
                          <el-button type="danger" @click="delPlugsRebate(scope.row)">删除</el-button>
                        </div>
                      </template>
                    </el-table-column>

                  </el-table>

                </div>

                <div class="example-pagination-block">
                  <div>
                    <el-pagination
                      background
                      @current-change="handleCurrentChange2"
                      @size-change="handleSizeChange2"
                      :current-page="tableobj2.currentPage"
                      :page-size="tableobj2.pageSize"
                      layout="prev,pager,next,total"
                      :total="total2"
                    >
                    </el-pagination>
                  </div>
                </div>

              </div>
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label="返佣提现" name="thirdly">
              <el-scrollbar height="64vh">
                <div class="content">
                  <div class="header" style="margin-bottom: 20px">

                  <div class="header-left">

                    <el-button
                      type="danger"
                      @click="delPlugin1"
                      :disabled="!multipleSelection1.length"
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
                        style="width: 150px"
                        v-model="tableobj1.keyword"
                        placeholder="请输入ID"
                        @keyup.enter.native="get_tixian"
                      />
                    </div>
                    <el-button
                      type="primary"
                      style="margin: 0 20px 0 30px"
                      @click="get_tixian"
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
                    :data="tableData2"
                    style="width: 100%"
                    @selection-change="handleSelectionChange2"
                    :header-cell-style="{
                        background: '#f3f6fd',
                        color: '#555',
                        textAlign: 'center',
                      }"
                  >
                    <el-table-column type="selection" width="55" />

                    <el-table-column prop="id" label="ID" align="center" width="70" />

                   <el-table-column

                      label="真实姓名"

                      width="100"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.realname }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="提现标题"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawTitle }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="提现类型"

                      align="center"
                    >
                      <template #default="scope">
                        <div>
                          <div v-if="scope.row.withdrawType == 0">
                            支付宝
                          </div>
                          <div v-else-if="scope.row.withdrawType == 1">
                            微信
                          </div>
                          <div v-else-if="scope.row.withdrawType == 1">
                            银行卡
                          </div>
                        </div>

                      </template>
                    </el-table-column>


                    <el-table-column
                      prop="orderNo"
                      label="提现信息	"

                      align="center"
                    >
                      <template #default="scope">
                        <div>
                          <div v-if="scope.row.withdrawType == 0">
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['userAlipay']['name']  }}
                            </div>
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['userAlipay']['account']  }}
                            </div>


                          </div>
                          <div v-else-if="scope.row.withdrawType == 1">
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['wei_chat'] }}
                            </div>
                          </div>
                          <div v-else-if="scope.row.withdrawType == 2">
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['bank_car'].bankCardNo }}
                            </div>
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['bank_car'].bankName }}
                            </div>
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['bank_car'].payName }}
                            </div>
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['bank_car'].userName }}
                            </div>
                            <div>
                              {{ JSON.parse(scope.row.withdrawInfo)['bank_car'].phone }}
                            </div>
                          </div>

                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column

                      label="提现金额"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawAmount }}</div>
                      </template>
                    </el-table-column>

                  <el-table-column
                      prop="orderNo"
                      label="提现单号"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawNo }}</div>
                      </template>

                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="已提现自购返利"

                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawSelfPurchaseRebate }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="提现手续费"
                      align="center"
                    >
                      <template #default="scope">
                        <div>{{ scope.row.withdrawServiceCharge }}</div>
                      </template>
                    </el-table-column>


                    <el-table-column
                      prop="orderNo"
                      label="提现状态"

                      align="center"
                    >
                      <template #default="scope">
                        <div>

                          <div v-if="scope.row.withdrawStatus == 1">
                            未打款
                          </div>
                          <div v-else-if="scope.row.withdrawStatus == 2">
                            已打款
                          </div>

                        </div>

                      </template>
                    </el-table-column>

                    <el-table-column
                      prop="orderNo"
                      label="	审核状态"

                      align="center"
                    >
                      <template #default="scope">
                        <div>

                          <div v-if="scope.row.auditStatus == 1">
                            待审核
                          </div>
                          <div v-else-if="scope.row.auditStatus == 2">
                            审核成功
                          </div>
                          <div v-else-if="scope.row.auditStatus == 3">
                            审核失败
                          </div>

                        </div>

                      </template>
                    </el-table-column>


                    <el-table-column

                      label="操作"
                      width="200"
                      align="center"
                    >
                      <template #default="scope">
                        <div style="display: flex;justify-content: center;align-items: center;">
                          <div v-if="scope.row.auditStatus == 1">
                            <el-button type="success" @click="shenhe(scope.row)">
                              <div >
                                审核通过
                              </div>
                            </el-button>
                          </div>
                          <div style="margin-left: 10px;">
                            <el-button type="danger" @click="deleteTixian(scope.row)">删除</el-button>
                          </div>
                        </div>


                      </template>
                    </el-table-column>


                  </el-table>

                  <div class="example-pagination-block">
                    <div>
                      <el-pagination
                        background
                        @current-change="handleCurrentChange1"
                        @size-change="handleSizeChange1"
                        :current-page="tableobj1.currentPage"
                        :page-size="tableobj1.pageSize"
                        layout="prev,pager,next,total"
                        :total="total1"
                      >
                      </el-pagination>
                    </div>
                  </div>

                </div>
              </div>
              </el-scrollbar>
            </el-tab-pane>

        </el-tabs>


    <FormMode
      v-if="data.formModeProps.visible"
      v-model="data.formModeProps.visible"
      :id="data.formModeProps.id"
      :plugsId="data.formModeProps.plugsId"
      @success="update"
    />
    <FormModes
      v-if="data.formModeProps1.visible"
      v-model="data.formModeProps1.visible"
      :id="data.formModeProps1.id"
      :plugsId="data.formModeProps1.plugsId"
      @success="update"
    />
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import http from "@/api/plugin";
import { ElMessage, ElMessageBox } from "element-plus";
import FormMode from "./components/index.vue";
import FormModes from "./components/setIndex.vue";
import storage from "@/utils/storage";
const route = useRoute();

const activeName = ref("first");
const data: any = ref({
  formModeProps: {
    visible: false,
    id: "",
    plugsId: "",
  },
  formModeProps1: {
    visible: false,
    id: "",
    plugsId: "",
  },
  countList:[]
});

onMounted(() => {
  getlist();
});

const shenhe = (item:any) =>{
  ElMessageBox.confirm(`确认审核成功吗？`, "确认").then(()=>{
      item.auditStatus = 2
      http.post('/api/plugs/updatePlugsRebateWithdrawalRecord',item
      ).then((res:any)=>{
        if(res.code == 200){
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }else{
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }
      })
    })
}

const deleteTixian = (item:any)=>{
  ElMessageBox.confirm(`确认删除吗？`, "确认信息").then(()=>{
      var data1:any = {
        ids:item.id
      }

      api.post('/api/plugs/delPlugsRebateWithdrawalRecord',data1).then((res:any)=>{
        if(res.code == 200){
          get_tixian()
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }else{
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }
      })
    })
}

const delPlugsRebate = (item:any)=>{

  var data1:any = {
    ids:item.id
  }

  ElMessageBox.confirm(`确认删除吗？`, "确认信息").then(()=>{
      api.get('/api/plugs/delPlugsRebate',data1).then((res:any)=>{
        if(res.code == 200){
          get_tixian()
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }else{
          ElMessage.success({
            message: res.msg,
            center: true,
          });
        }
      })
    })


}

const total1:any = ref('')
const total2:any = ref('')
const get_fenxiao = ()=>{

  const data1:any = {
    page: tableobj2.currentPage,
    size: tableobj2.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id,
    keyword: tableobj2.keyword,
  }

    http.get('/api/plugs/searchPlugsRebateList',{
      params:data1
    }).then((res:any)=>{
      if(res.code == 200){

        res.body.list.forEach((item:any) => {
          if(item.state == 1){
            item['show'] = true
          }else{
            item['show'] = false
          }
        });

        total2.value = res.body.total;
        tableData1.value = res.body.list
      }
    })
  // }


}

const get_tixian = () =>{
  const data1:any = {
    page: tableobj1.currentPage,
    size: tableobj1.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id,
    keyword: tableobj1.keyword,
  }

  http.get("/api/plugs/searchPlugsRebateWithdrawalRecordList",{
    params:data1
  }).then((res:any)=>{
    console.log(res.body.list);

    if(res.code == 200){
      total1.value = res.body.total
      tableData2.value = res.body.list
    }
  })
}

const handleClick1 = (tab: any, event: Event) => {
  // console.log(tab.props.label);
  if(tab.props.label == '分销统计'){
    get_fenxiao()

  }else if(tab.props.label == '返佣提现'){
    get_tixian()
  }

};



const multipleSelection1:any = ref([])
const handleSelectionChange1 = (val:any) => {
  multipleSelection1.value = val
}
const tableData1:any = ref([])


const tableData2:any = ref([])
const handleSelectionChange2 = (val:any) => {
  multipleSelection1.value = val
}

// 获取表格信息
let tableData: any = ref([]);
const total = ref(0);
const tableobj = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});

const tableobj1 = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});

const tableobj2 = reactive({
  currentPage: 1,
  pageSize: 10,
  keyword: "",
});


const userServiceToken = ref(storage.local.get("userServiceToken"));

function getlist() {
  let data:any = {
    page: tableobj.currentPage,
    size: tableobj.pageSize,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: route.params.id,
    keyword: tableobj.keyword,
  };
  if(route.params.admin == 'admin'){
    data.userServiceToken = -1
  }
  api
    .get("/api/plugs/searchPlugsRebateRecordList", { params: data })
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

function handleSizeChange1(val: any) {
  tableobj1.pageSize = val;
  get_tixian();
}
function handleCurrentChange1(val: any) {
  console.log(val);

  tableobj1.currentPage = val;
  get_tixian();
}

function handleSizeChange2(val: any) {
  tableobj2.pageSize = val;

  get_fenxiao();
}

function handleCurrentChange2(val: any) {
  tableobj2.currentPage = val;
  get_fenxiao();
}


// 新增插件
function addPlugin() {
  data.value.formModeProps.visible = true;
  data.value.formModeProps.id = "";
  data.value.formModeProps.plugsId = route.params.id;
}
function setPlugin() {
  data.value.formModeProps1.visible = true;
  data.value.formModeProps1.id = "";
  data.value.formModeProps1.plugsId = route.params.id;
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
      api.post("/api/plugs/delPlugsRebateRecord", data).then((res: any) => {
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

const delPlugin1 = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/searchPlugsRebateById", data).then((res: any) => {
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

const delPlugin2 = () => {
  let data = {
    ids: idlist.value.join(),
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/searchPlugsRebateById", data).then((res: any) => {
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
  console.log(e);
  let data = {
    ids: e,
  };
  ElMessageBox.confirm(`确认删除吗？`, "确认信息")
    .then(() => {
      api.post("/api/plugs/delPlugsRebateRecord", data).then((res: any) => {
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


// 刷新组件
function update() {
  getlist();
  data.value.formModeProps.visible = false;
  data.value.formModeProps1.visible = false;
}
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
