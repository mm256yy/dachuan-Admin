<route lang="yaml">
title: 个人设置
</route>
<template>
  <div>
    <page-main>
      <div class="setting-list">
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="欢迎使用" name="0"></el-tab-pane>
          <el-tab-pane label="页面设置" name="1"></el-tab-pane>
        </el-tabs>
        <div v-if="activeName == 0">
          <div class="useExplain">
            <h5>1、首页轮播广告位说明:</h5>
            <ul style="padding: 0; padding-left: 16px">
              <li>
                <p>
                  轮播广告图尺寸建议
                  750*350像素（在插件中心—轮播海报里面进行设置，海报类型填
                  homeAd ）；
                </p>
              </li>
              <li>
                <p>
                  该广告位只支持跳转商品，不支持跳转其他路径（建海报的是否跳转类型选“跳转商品”，跳转参数填对应商品的ID）；
                </p>
              </li>
            </ul>
          </div>
          <div class="useExplain">
            <h5>2、首页公告通知说明:</h5>
            <ul style="padding: 0; padding-left: 16px">
              <li>
                <p>
                  通知可以建立无数个，会轮播切换展示（在插件中心—公告通知里面进行设置，公告类型填
                  homeNt ）；
                </p>
              </li>
              <li>
                <p>
                  公告通知如果不选择门店则对应所有门店，如果选择门店该通知只会在对应的门店显示；
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="activeName == 1" class="pagesetting">
          <el-tabs
            :tab-position="tabPosition"
            v-model="activeName2"
            @tab-click="handleClick2"
            class="demo-tabs"
          >
            <el-tab-pane label="颜色规范" name="0"></el-tab-pane>
            <el-tab-pane label="全局设置" name="1"></el-tab-pane>
            <el-tab-pane label="tabBar设置" name="2"></el-tab-pane>
          </el-tabs>
          <div>
            <!-- 颜色规范-->
            <div v-if="activeName2 == 0">
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>主题颜色</p>
                  <el-alert
                    title="常用于tabbar选中、价格、按钮等一些频繁出现的颜色"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-color-picker v-model="color1" />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>标题颜色</p>
                  <el-alert
                    title="常用于各种标题的颜色"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-color-picker v-model="color2" />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>文本颜色</p>
                  <el-alert
                    title="常用于各种说明性文字的颜色"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-color-picker v-model="color3" />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>中性颜色</p>
                  <el-alert
                    title="常用于各种ICON图标、次要按钮等颜色"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-color-picker v-model="color4" />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>辅助颜色</p>
                  <el-alert
                    title="常用于tabbar非选中、图标背景、文本背景等颜色"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-color-picker v-model="color5" />
              </div>
              <div class="submitBtn" style="margin-bottom: 100px">
                <el-button type="primary">保存颜色规范</el-button>
                <el-button>恢复默认设置</el-button>
              </div>
            </div>
            <!-- 全局设置 -->
            <div class="GlobalSettings" v-if="activeName2 == 1">
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">加载中图标</p>
                  <el-alert
                    title="在数据加载中时显示的图标，尺寸200*200像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">腾讯地图Key</p>
                  <el-alert
                    title="用于计算用户位置和店铺之间的距离"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input v-model="input" placeholder="腾讯地图Key" />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>起送金额</p>
                  <el-alert
                    title="配送时需要满足该金额才能进行下单"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  style="width: 260px"
                  v-model="input2"
                  placeholder="起送金额"
                >
                  <template #append>元</template>
                </el-input>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color" style="margin-right: 16px">
                    <span>*</span>默认配送类型
                  </p>
                  <el-alert
                    title="用户下单时默认的配送类型，用户可以手动更改(仅某种类型时不支持修改)"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-radio-group v-model="radio1" size="small" class="ml-4">
                  <el-radio label="1" border>配送</el-radio>
                  <el-radio label="2" border>快递</el-radio>
                  <el-radio label="3" border>自提</el-radio>
                </el-radio-group>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>配送范围</p>
                  <el-alert
                    title="当用户选择配送类型为“外卖”时，配送距离不能超过该距离"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  style="width: 260px"
                  v-model="input3"
                  placeholder="配送范围"
                >
                  <template #append>米</template>
                </el-input>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">弹窗优惠券</p>
                  <el-alert
                    title="设置弹窗优惠券后，如果用户可以领取则会在首页弹出"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-select
                  style="width: 260px"
                  v-model="value"
                  class="m-2"
                  placeholder="弹窗优惠券"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">门店自提简称</p>
                  <el-alert
                    title="该简称会在点单页右上角显示，建议不超过2个字符"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="门店自提简称"
                  show-word-limit
                  maxlength="2"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">送货上门简称</p>
                  <el-alert
                    title="该简称会在点单页右上角显示，建议不超过2个字符"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="送货上门简称"
                  show-word-limit
                  maxlength="2"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">门店自提名称</p>
                  <el-alert
                    title="自定义门店自提配送方式名称，建议不超过6个字符"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="门店自提名称"
                  show-word-limit
                  maxlength="6"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">送货上门名称</p>
                  <el-alert
                    title="自定义送货上门配送方式名称，建议不超过6个字符"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="送货上门名称"
                  show-word-limit
                  maxlength="6"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">门店自提图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸100*100像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">送货上门图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸100*100像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="submitBtn">
                <el-button type="primary">保存全局设置</el-button>
                <el-button>恢复默认设置</el-button>
              </div>
            </div>
            <!-- tabBar设置666 -->
            <div class="tabBarsetting" v-if="activeName2 == 2">
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>首页标题</p>
                  <el-alert
                    title="标题不能超过4个字"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="首页标题"
                  show-word-limit
                  maxlength="4"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">首页选中图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color" style="margin-right: 20px">首页非选中图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>点单页标题</p>
                  <el-alert
                    title="标题不能超过4个字"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="点单页标题"
                  show-word-limit
                  maxlength="4"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">点单页选中图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color" style="margin-right: 20px">
                    点单页非选中图标
                  </p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>取餐页标题</p>
                  <el-alert
                    title="标题不能超过4个字"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="取餐页标题"
                  show-word-limit
                  maxlength="4"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">取餐页选中图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color" style="margin-right: 20px">
                    取餐页非选中图标
                  </p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color"><span>*</span>个人中心页标题</p>
                  <el-alert
                    title="标题不能超过4个字"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-input
                  v-model="input4"
                  style="width: 260px"
                  placeholder="个人中心页标题"
                  show-word-limit
                  maxlength="4"
                />
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color">个人中心页选中图标</p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="colorItem">
                <div class="colorItemTitle">
                  <p class="color" style="margin-right: 20px">
                    个人中心页非选中图标
                  </p>
                  <el-alert
                    title="如果自定义图标则不支持自定义颜色，尺寸80*80像素"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>
                <el-button size="small" type="primary">选择图标</el-button>
              </div>
              <div class="submitBtn">
                <el-button type="primary">保存tabBar设置</el-button>
                <el-button>恢复默认设置</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-main>
  </div>
</template>
<script lang="ts" setup name="PersonalSetting">
import api from "@/api/plugin";
import type { UploadProps } from "element-plus";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const tabPosition: any = ref("left");
const activeName: any = ref("0");
const activeName2: any = ref("0");
const color1 = ref("#409EFF");
const color2 = ref("#293539");
const color3 = ref("#6a7275");
const color4 = ref("#c7b690");
const color5 = ref("#c2c5c6");
const input = ref("");
const input2 = ref("");
const input3 = ref(5000);
const input4 = ref("");
const radio1 = ref("1");
const info: any = ref("0");
const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
onMounted(() => {});
function handleClick() {
  // console.log(activeName.value,'切换')
}
function handleClick2() {
  // console.log(activeName2.value,'切换2')
}
</script>

<style lang="scss" scoped>
.pagesetting {
  margin-left: -20px;
  display: flex;
  .submitBtn {
    display: flex;
    align-items: center;
    // margin-top:30px;
    // margin-left: 8px;
    margin: 30px 8px;
  }
  .colorItem {
    margin-left: 8px;
    margin-bottom: 6px;
    line-height: 1;
    .el-alert__title {
      vertical-align: middle !important;
    }
    .el-alert {
      padding: 0 !important;
    }
    .colorItemTitle {
      display: flex;
      align-items: center;
      .color {
        // width: 160px;
        white-space: nowrap;
        margin-right: 20px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #515a6e;
        span {
          display: inline-block;
          color: #ee5a39;
          margin-right: 4px;
        }
      }
    }
  }
  .el-tabs__item {
    padding: 0 !important;
    text-align: left;
  }

  .el-alert--info.is-light {
    background-color: #fff !important;
    display: flex;
    align-items: center;
    .el-alert__title {
      vertical-align: middle !important;
    }
  }
}

.useExplain {
  text-align: justify;
  line-height: 1;
  p {
    font-size: 14px;
  }
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.security {
  .setting-list {
    max-height: 740px;
    overflow-x: hidden;
    padding: 0 !important;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);
      transition: var(--el-transition-border);

      .content {
        .title {
          margin-bottom: 5px;
          color: var(--el-text-color-primary);
          transition: var(--el-transition-color);
        }

        .desc {
          font-size: 14px;
          color: var(--el-text-color-secondary);
          transition: var(--el-transition-color);
        }
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>
