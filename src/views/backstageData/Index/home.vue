<route lang="yaml">
meta: title:报表统计
</route>

<script setup lang="ts">
import api from "@/api/plugin";

import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
// import { ref } from 'vue'
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
const router = useRouter();

const size = ref<"default" | "jt" | "jt">("jt");

onMounted(() => {
  showorders();
  showorders1();
  showorders2();
  showorders3();
});

function showorders() {
  // 基于准备好的dom，初始化echarts实例
  var chartDom: any = document.getElementById("showorders");
  var myChart = echarts.init(chartDom);
  // 指定图表的配置项和数据
  var option;

  option = {
    xAxis: {
      type: "category",
      data: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    },
    title: {
      text: "交易订单",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    legend: {
      // Try 'horizontal'
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
    },
    series: [
      {
        name: "交易金额",
        data: [1, 12, 24, 4, 6, 8, 9],
        type: "line",
        smooth: true,
      },
    ],
  };
  option && myChart.setOption(option);
}

function showorders1() {
  // 基于准备好的dom，初始化echarts实例
  var chartDom: any = document.getElementById("showorders1");
  var myChart = echarts.init(chartDom);
  // 指定图表的配置项和数据
  var option;

  option = {
    xAxis: {
      type: "category",
      data: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    },
    title: {
      text: "订单数量",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    legend: {
      // Try 'horizontal'
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
    },
    series: [
      {
        name: "订单数量",
        data: [1, 3, 224, 218, 135, 147, 260],
        type: "line",
        smooth: true,
      },
    ],
  };
  option && myChart.setOption(option);
}

function showorders2() {
  // 基于准备好的dom，初始化echarts实例
  var chartDom: any = document.getElementById("showorders2");
  var myChart = echarts.init(chartDom);
  // 指定图表的配置项和数据
  var option;

  option = {
    xAxis: {
      type: "category",
      data: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    },
    title: {
      text: "待付款订单",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    legend: {
      // Try 'horizontal'
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
    },
    series: [
      {
        name: "待付款订单",
        data: [4, 4, 2, 4, 7, 9, 87],
        type: "bar",
      },
    ],
  };
  option && myChart.setOption(option);
}

function showorders3() {
  // 基于准备好的dom，初始化echarts实例
  var chartDom: any = document.getElementById("showorders3");
  var myChart = echarts.init(chartDom);
  // 指定图表的配置项和数据
  var option;

  option = {
    xAxis: {
      type: "category",
      data: [
        "8:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
        "00:00",
        "02:00",
        "04:00",
        "06:00",
      ],
    },
    title: {
      text: "访问量",
    },
    tooltip: {
      trigger: "axis",
    },
    yAxis: {
      type: "value",
    },
    legend: {
      // Try 'horizontal'
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
    },
    series: [
      {
        name: "访问人数",
        data: [
          1000, 2000, 3000, 4000, 5000, 2000, 1531, 4000, 5000, 2000, 1531,
        ],
        type: "scatter",
      },
    ],
  };
  option && myChart.setOption(option);
}
</script>

<template>
  <div>
    <page-main>
      <div style="margin: 10px 0">
        <div style="margin-top: 10px; display: flex; flex-direction: column">
          <el-radio-group v-model="size" label="size control" size="small">
            <el-radio-button label="jt">今天</el-radio-button>
            <el-radio-button label="zt">昨天</el-radio-button>
            <el-radio-button label="7t">最近7天</el-radio-button>
            <el-radio-button label="30t">最近30天</el-radio-button>
          </el-radio-group>
          <page-main>
            <el-row :gutter="20">
              <el-col :md="6">
                <ColorfulCard
                  header="交易金额"
                  :num="0"
                  tip="昨天全天0"
                  icon="ant-design:money-collect-filled"
                />
              </el-col>
              <el-col :md="6">
                <ColorfulCard
                  color-from="#fbaaa2"
                  color-to="#fc5286"
                  header="订单数量(个)"
                  :num="0"
                  tip="昨天全天0"
                  icon="ri:pages-line"
                />
              </el-col>
              <el-col :md="6">
                <ColorfulCard
                  color-from="#ff763b"
                  color-to="#ffc480"
                  header="待付款订单(个)"
                  :num="0"
                  tip="昨天全天0"
                  icon="ant-design:clock-circle-outlined"
                />
              </el-col>
              <el-col :md="6">
                <ColorfulCard
                  color-from="#6a8eff"
                  color-to="#0e4cfd"
                  header="访问人数(个)"
                  :num="0"
                  tip="昨天全天0"
                  icon="ep:link"
                />
              </el-col>
              <!-- <el-col :md="5">
                  <ColorfulCard color-from="#6a8eff" color-to="#0e4cfd" header="访问人数(个)" :num="0" tip="昨天全天0" icon="ep:link" />
                </el-col> -->
            </el-row>
          </page-main>
          <!-- <div style="display: flex">
              <div
                class="content"
                style="
                  width: 25%;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              >
                <div style="color: #666; font-size: 12px">交易金额(元)</div>
                <div style="color: #1c1d23; font-size: 28px">0</div>
                <div v-if="size == 'jt'" style="font-size: 12px; color: #999">
                  昨天全天0
                </div>
              </div>
              <div
                class="content"
                style="
                  width: 25%;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              >
                <div style="color: #666; font-size: 12px">订单数量(个)</div>
                <div style="color: #1c1d23; font-size: 28px">0</div>
                <div v-if="size == 'jt'" style="font-size: 12px; color: #999">
                  昨天全天0
                </div>
              </div>
              <div
                class="content"
                style="
                  width: 25%;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              >
                <div style="color: #666; font-size: 12px">待付款订单(个)</div>
                <div style="color: #1c1d23; font-size: 28px">0</div>
                <div v-if="size == 'jt'" style="font-size: 12px; color: #999">
                  昨天全天0
                </div>
              </div>
              <div
                class="content"
                style="
                  width: 25%;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              >
                <div style="color: #666; font-size: 12px">访问人数(个)</div>
                <div style="color: #1c1d23; font-size: 28px">0</div>
                <div v-if="size == 'jt'" style="font-size: 12px; color: #999">
                  昨天全天0
                </div>
              </div>
              <div
                class="content"
                style="
                  width: 25%;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              >
                <div style="color: #666; font-size: 12px">访问付款转化率</div>
                <div style="color: #1c1d23; font-size: 28px">0</div>
                <div v-if="size == 'jt'" style="font-size: 12px; color: #999">
                  昨天全天0
                </div>
              </div>
            </div> -->
        </div>
        <div style="width: 100%; display: flex; flex-direction: column">
          <div style="display: flex; width: 100%">
            <div id="showorders" style="width: 50%; height: 500px"></div>
            <div id="showorders1" style="width: 50%; height: 500px"></div>
          </div>
          <div style="display: flex; width: 100%">
            <div id="showorders2" style="width: 50%; height: 500px"></div>
            <div id="showorders3" style="width: 50%; height: 500px"></div>
          </div>
        </div>
      </div>
    </page-main>
  </div>
</template>

<style lang="scss" scoped>
.content {
  color: #464646;
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  width: 10%;
  padding: 10px 20px;
  margin: 20px;
}
</style>
