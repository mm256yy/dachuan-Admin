<template>
      <!-- 销售汇总 -->
      <el-dialog
        v-model="DialogVisible3"
        title="销售汇总"
        width="1000px"
        v-loading="loading2"
        element-loading-text="加载中..."
        :close-on-click-modal="false"
        :show-close="false"
        append-to-body
        destroy-on-close
      >
        <div
          class="header-right"
          style="display: flex; justify-content: end; align-items: center"
        >
          <div
            style="
              width: 360px !important;
              height: 40px !important;
              margin-right: 20px;
            "
          >
            <el-date-picker
              size="large"
              style="width: 360px;"
              v-model="value3"
              @change="changeTime2"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
              range-separator="To"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </div>

          <el-select
            size="large"
            v-model="salsForm.businessId"
            filterable
            placeholder="选择店铺"
          >
            <el-option key="-1" label="全部" value="-1" />
            <el-option
              v-for="item in businessList"
              :key="item.businessId"
              :label="item.businessName"
              :value="item.businessId"
            />
          </el-select>
          <div class="lang" style="margin-left: 10px">
            <el-input
              style="width: 150px; height: 40px"
              v-model="salsForm.keyword"
              placeholder="搜索商品"
              @keyup.enter.native="saleTotalList"
            />
          </div>
          <el-button
            type="success"
            style="height: 40px; margin: 0 0px 0 10px"
            @click="exportOrders2()"
          >
            <template #icon>
              <el-icon>
                <Position />
              </el-icon>
            </template>
            导出
          </el-button>
          <el-button
            type="primary"
            style="height: 40px; margin: 0 10px 0 10px"
            @click="saleTotalList"
          >
            <template #icon>
              <el-icon>
                <svg-icon name="i-ep:search" />
              </el-icon>
            </template>
            搜索
          </el-button>
        </div>
        <div style="padding: 20px">
          <el-table
            :data="tableData2"
            v-loading="loading2"
            element-loading-text="加载中..."
            style="width: 100%; height: 500px"
            :header-cell-style="{
              background: '#f3f6fd',
              color: '#555',
              textAlign: 'center',
            }"
          >
            <el-table-column
              prop="goodsId"
              width="100"
              label="商品ID"
              align="center"
            />
            <el-table-column
              prop="rotationImgsJson"
              width="120"
              label="商品图片"
              align="center"
            >
              <template #default="scope">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <img
                    style="width: 40px; height: 40px"
                    :src="scope.row.plugsGoods.previewUrl"
                    alt=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="商品名称"
              prop="goodName"
              width="280"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="goodsSpecificationName"
              label="商品规格"
              align="center"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="payTotalAmount"
              label="销售金额(元)"
              align="center"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="goodsNum"
              label="销售数量"
              align="center"
              width="120"
            >
            </el-table-column>
          </el-table>
          <div class="example-pagination-block">
            <div>
              <el-pagination
                background
                @current-change="handleCurrentChange2"
                @size-change="handleSizeChange2"
                :current-page="salsForm.current"
                :page-size="salsForm.size"
                layout="prev,pager,next,total"
                :total="total2"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button size="large" @click="cancel()">
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click="DialogVisible3= cancel()"
          >
            确定
          </el-button>
        </template>
      </el-dialog>
    
</template>
<script lang="ts" setup>
    import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
    import api from "@/api";
    import Axios from "axios";
    import { ref, onMounted, computed, reactive } from "vue";
    import { ElMessage, ElMessageBox, TabsPaneContext } from "element-plus";
    import JSONBIG from "json-bigint";
    import table2excel from "js-table2excel";
    const props = withDefaults(
    defineProps<{
      modelValue: boolean;
    }>(),
    {
      modelValue: false,
    }
  );
  const DialogVisible3:any = ref(props.modelValue);
  console.log(DialogVisible3.value,'销售弹框66');
  
    onMounted(() => {
        getDianpu();
    });
    const businessList: any = ref([]);
    function getDianpu() {
    api.get("/api/plugs/getBusinessInfo").then((res: any) => {
        if (res.code == 200) {
        res.body.forEach((item: any) => {
            item.jsonViewData.businessId = item.jsonViewData.businessId.toString();
            businessList.value.push(item.jsonViewData);
        });
        }
        });
    }
    // 销售汇总
    const salsForm: any = ref({
    current: 1,
    startDateTime: "",
    endDateTime: "",
    keyword: "",
    size: 10,
    businessId: "-1",
    });
    const salasList: any = ref([]);
    // 导出表格数据
    
    const loading2 = ref(false);
    const tableData2:any=ref([])
    const exportStatus: any = ref("0");
    const total2 = ref(0);
    const exportSals: any = ref("0");
    function exportOrders2() {
        exportSals.value = 1;
        salsForm.value.size = 1000;
        saleTotalList();
    }
    const emit=defineEmits(['salessummary'])
    function cancel(){
       DialogVisible3.value= false;
       emit("salessummary",DialogVisible3.value);
    }
    function saleTotalList() {
        loading2.value = true;
        api
            .get("/api/order/getOrderItemStatistics", {
            params: salsForm.value,
            })
            .then((res: any) => {
            if (res.code == 200) {
                loading2.value = false;
                tableData2.value = res.body.list;
                total2.value = res.body.total;
                if (exportSals.value == 1) {
                tableData2.value.forEach((item: any) => {
                    const obj = {
                    goodsID: "",
                    goodsImage: "",
                    goodsName: "",
                    goodsSpe: "",
                    salsMoney: "",
                    salsNum: "",
                    };
                    obj.goodsID = item.goodsId;
                    obj.goodsImage = item.previewUrl;
                    obj.goodsName = item.goodName;
                    obj.goodsSpe = item.goodsSpecificationName;
                    obj.salsMoney = item.payTotalAmount;
                    obj.salsNum = item.goodsNum;
                    salasList.value.push(obj);
                });
                exportToExcel2();
                }
            }
            });
    }
    // 销售汇总导出
function exportToExcel2() {
  const column = [
    {
      title: "商品ID",
      key: "goodsID",
      type: "text",
    },
    {
      title: "商品图片",
      key: "goodsImage",
      type: "image",
      width: 100,
      height: 100,
    },
    {
      title: "商品名称",
      key: "goodsName",
      type: "text",
    },
    {
      title: "商品规格",
      key: "goodsSpe",
      type: "text",
    },
    {
      title: "销售金额(元)",
      key: "salsMoney",
      type: "text",
    },
    {
      title: "销售数量",
      key: "salsNum",
      type: "text",
    },
  ];
  const excelName = "月份订单"; //文件名称
  exportSals.value = 0;
  table2excel(column, salasList.value, excelName); //生成Excel表格，自动下载
  salasList.value = [];
  setTimeout(()=>{
    salsForm.value.size = 10;
    saleTotalList();
  },1000)
  
}
    function handleSizeChange2(val: any) {
        salsForm.value.size = val;
        saleTotalList();
    }

    function handleCurrentChange2(val: any) {
        salsForm.value.current = val;
        saleTotalList();
    }
    const value3:any = ref<[Date, Date]>([
    new Date(2000, 10, 10, 10, 10),
    new Date(2000, 10, 11, 10, 10),
    ]);
    function changeTime2(val:any) {
        if(!val){
            value3.value=new Date();
            salsForm.value.startDateTime= '';
            salsForm.value.endDateTime='';
        }else{
            salsForm.value.startDateTime = value3.value[0];
            salsForm.value.endDateTime = value3.value[1];
        }
    }
</script>
<style scoped>
</style>