<template>
  <el-dialog
    v-model="myVisible"
    title="查看订单"
    width="900px"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="110px"
      style="padding: 0 20px"
    >
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        v-if="form.orderType != '3'"
      >
        <el-tab-pane label="订单信息" name="first">
          <el-scrollbar>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                交易单号
              </div>
              <div style="width: 250px">{{ form.orderNo }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                交易订单号
              </div>
              <div style="width: 250px">{{ form.bussinessId }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单状态
              </div>
              <div style="width: 250px">
                <div v-if="form.orderStatus == 0">待付款</div>
                <div v-else-if="form.orderStatus == 1">待接单</div>
                <div v-else-if="form.orderStatus == 2">待发货</div>
                <div v-else-if="form.orderStatus == 3">待收货</div>
                <div v-else-if="form.orderStatus == 4">待使用</div>
                <div v-else-if="form.orderStatus == 5" style="color: #4cd909">
                  已完成
                </div>
                <div v-else-if="form.orderStatus == 6" style="color: #606266">
                  已取消
                </div>
                <div v-else-if="form.orderStatus == 7" style="color: #606266">
                  已失效
                </div>
                <div v-else-if="form.orderStatus == 8">退款中</div>
                <div v-else-if="form.orderStatus == 9">退款成功</div>
                <div v-else-if="form.orderStatus == 10">退款失败</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                配送方式
              </div>
              <div style="width: 250px">
                <div v-if="form.logisticsType == 1">配送</div>
                <div v-else-if="form.logisticsType == 2">快递</div>
                <div v-else-if="form.logisticsType == 3">自提</div>
                <div v-else-if="form.logisticsType == 4">到店消费</div>
                <div v-else-if="form.logisticsType == 5">上门服务</div>
                <div v-else-if="form.logisticsType == 0">快递</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                支付类型
              </div>
              <div style="" v-if="form.orderLogistics.payType == 1">
                微信支付
              </div>
              <div style="" v-else-if="form.orderLogistics.payType == 0">
                微信支付
              </div>
              <div style="" v-else-if="form.orderLogistics.payType == 2">
                支付宝支付
              </div>
              <div style="" v-else-if="form.orderLogistics.payType == 3">
                积分支付
              </div>
              <div style="" v-else-if="form.orderLogistics.payType == 4">
                余额支付
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单类型
              </div>
              <div style="width: 250px">
                <div v-if="form.orderType == 0">商城订单</div>
                <div v-else-if="form.orderType == 1">宠物服务订单</div>
                <div v-else-if="form.orderType == 2">家庭寄养订单</div>
                <div v-else-if="form.orderType == 3">陪诊订单</div>
                <div v-else-if="form.orderType == 4">租赁订单</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 4"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                商品押金
              </div>
              <div style="width: 250px">
                {{ extJsonDetail.depositInfo.money }}元
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 2"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                寄养时间
              </div>
              <div style="width: 280px; display: flex; align-items: center">
                <div style="margin-right: 10px">
                  {{ extJsonDetail.startTime }}~{{ extJsonDetail.endTime }}
                </div>
                <div style="margin-right: 10px">
                  共{{ extJsonDetail.dayCount }}天
                </div>
                <div>{{ form.payMoney }}元</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 2 || form.orderType == 1"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                宠物信息
              </div>
              <div style="width: 400px; display: flex; align-items: center">
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petRarchives.name }}
                </div>
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petRarchives.breed }}
                </div>
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petRarchives.weightExtJson }}kg
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.sex == 0"
                >
                  雌性
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.sex == 1"
                >
                  雄性
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.vaccineStatus == 1"
                >
                  未打疫苗
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.vaccineStatus == 0"
                >
                  已打疫苗
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.neuterStatus == 0"
                >
                  已绝育
                </div>
                <div
                  style="margin-right: 10px"
                  v-if="extJsonDetail.petRarchives.neuterStatus == 1"
                >
                  未绝育
                </div>
                <!-- <div>生日:{{formatDate(extJsonDetail.petRarchives.birthDay)}}</div> -->
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 2"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                寄养家庭
              </div>
              <div style="width: 250px; display: flex; align-items: center">
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petFosterHome.homeName }}
                </div>
                <div>{{ extJsonDetail.petFosterHome.addressJson }}天</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 1"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                喂养时间
              </div>
              <div style="width: 250px; display: flex; align-items: center">
                <div>{{ form.orderLogistics.expectTime }}</div>
              </div>
            </div>
            <div style="display: flex; margin: 20px" v-if="form.orderType == 2">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                寄养员信息
              </div>
              <div style="display: flex; align-items: center">
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petFosterHome.fosterCareName }}
                </div>
                <div style="margin-right: 10px">
                  {{ extJsonDetail.petFosterHome.fosterCareJob }}
                </div>
                <div>{{ extJsonDetail.petFosterHome.fosterPhone }}</div>
              </div>
            </div>
            <div style="display: flex; margin: 20px" v-if="form.orderType == 2">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                上门服务
              </div>
              <div style="display: flex; align-items: center">
                <div v-if="form.logisticsType == 5">需要</div>
                <div v-else>不需要</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 1"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                喂养套餐
              </div>
              <div style="width: 250px; display: flex; align-items: center">
                <div style="margin-right: 20px">
                  {{ JSON.parse(extJsonDetail.setMealInfo).setMealName }}
                </div>
                <div>{{ JSON.parse(extJsonDetail.setMealInfo).money }}元</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.orderType == 1"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                升级服务
              </div>
              <div
                style="
                  width: 280px;
                  display: flex;
                  align-items: center;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                <div
                  style="margin-right: 10px; display: flex"
                  v-for="(item, index) in extJsonDetail.serviceList"
                  :key="index"
                >
                  {{ item.serviceName }}
                </div>
                <div>{{ extJsonDetail.serviceTotalMoney }}元</div>
              </div>
            </div>
            <div style="display: flex; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                联系人姓名
              </div>
              <div style="">
                <!-- {{ form.orderLogistics.receiverAddressJson.province }}
                {{ form.orderLogistics.receiverAddressJson.city }}
                {{ form.orderLogistics.receiverAddressJson.district }}
                {{ form.orderLogistics.receiverAddressJson.address }} -->
                {{ form.orderLogistics.receiverAddressJson.name }}
                <!-- {{ form.orderLogistics.receiverAddressJson.mobile }} -->
              </div>
            </div>
            <div style="display: flex; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                联系人电话
              </div>
              <div style="">
                {{ form.orderLogistics.receiverAddressJson.mobile }}
              </div>
            </div>
            <div
              style="
                display: flex;
                width: 500px;
                margin: 20px;
                justify-content: space-between;
              "
            >
              <div v-if="form.logisticsType == 3" style="display: flex">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  自提地址
                </div>
                <div style="width: 400px">
                  {{ form.orderLogistics.receiverAddressJson.address }}
                </div>
              </div>
              <div v-else style="display: flex">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  收货地址
                </div>
                <div style="width: 400px">
                  {{ form.orderLogistics.receiverAddressJson.province }}
                  {{ form.orderLogistics.receiverAddressJson.city }}
                  {{ form.orderLogistics.receiverAddressJson.district }}
                  {{ form.orderLogistics.receiverAddressJson.address }}
                </div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                买家留言
              </div>
              <div style="">
                {{ form.orderRemark }}
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                创建时间
              </div>
              <div style="">
                {{ form.createTime }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="购物清单" name="second">
          <el-scrollbar>
            <el-table
              :data="form.orderItemList"
              :header-cell-style="{
                background: '#f3f6fd',
                color: '#555',
                textAlign: 'center',
              }"
              stripe
              style="width: 120%"
            >
              <el-table-column label="商品图片" align="center">
                <template #default="scope">
                  <div>
                    <div v-if="form.orderType == 0 || form.orderType == 4">
                      <img
                        v-if="scope.row.goodsSpecification !== null"
                        style="width: 60px; height: 60px"
                        :src="scope.row.goodsSpecification.specificationImages"
                        alt=""
                      />
                      <img
                        v-else
                        style="width: 60px; height: 60px"
                        :src="scope.row.previewUrl"
                        alt=""
                      />
                    </div>
                    <div v-else-if="form.orderType == 1">
                      <img
                        style="width: 60px; height: 60px"
                        :src="scope.row.extJson.petStewardInfo.headImgUrl"
                        alt=""
                      />
                    </div>
                    <div v-else-if="form.orderType == 2">
                      <img
                        style="width: 60px; height: 60px"
                        :src="scope.row.extJson.petFosterHome.headImgUrl"
                        alt=""
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品信息" align="center">
                <template #default="scope">
                  <div v-if="form.orderType == 0">{{ scope.row.goodName }}</div>
                  <div v-else-if="form.orderType == 1">宠物上门服务订单</div>
                  <div v-else-if="form.orderType == 2">宠物寄养订单</div>
                  <div v-else-if="form.orderType == 4">
                    {{ scope.row.goodName }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品价格" align="center">
                <template #default="scope">
                  <div v-if="scope.row.goodsSpecification == null">
                    {{ scope.row.goodsPrice }}
                  </div>
                  <div v-else>{{ scope.row.goodsSpecification.dealPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="优惠金额" align="center">
                <template #default="scope">
                  <div>{{ scope.row.concessionalPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="实际支付" align="center">
                <template #default="scope">
                  <div>{{ scope.row.payPrice }}</div>
                </template>
              </el-table-column>
              <el-table-column label="购买数量" align="center">
                <template #default="scope">
                  <div>{{ scope.row.goodsNum }}</div>
                </template>
              </el-table-column>
              <el-table-column label="规格" align="center">
                <template #default="scope">
                  <div v-if="scope.row.goodsSpecificationName !== ''">
                    <div
                      style="text-align: left"
                      v-for="(item, key) in JSON.parse(
                        scope.row.goodsSpecificationName
                      )"
                    >
                      {{ key }}: {{ item }}
                    </div>
                    <!-- <div>
                      {{scope.row.goodsSpecificationName}}
                   </div> -->
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">
                优惠金额：￥：{{ form.couponPrice }}
              </div>
              <div>打包费：￥：{{ form.packingFee }}</div>
            </div>

            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">会员折扣：￥0</div>
              <div>运费：￥：{{ form.distributionFee }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px 100px">
              <div style="width: 250px">支付金额：￥：{{ form.payMoney }}</div>
              <div>订单总额：￥：{{ form.totalMoney }}</div>
            </div>

            <!-- <el-form-item
              label="修改订单总金额为:"
              prop="pid"
              label-width="130"
            >
              <el-input
                rows="5"
                type="text"
                style="width: 200px"
                v-model="form.payMoney"
                placeholder="请输入"
                clearable
              />
            </el-form-item> -->
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="售后信息" name="third">
          <el-scrollbar>
            <div v-if="form.orderType == 4">
              <span style="margin-right: 10px">押金:</span>
              <el-input
                style="width: 200px; margin-right: 20px"
                :disabled="true"
                v-model="extJsonDetail.depositInfo.money"
                placeholder="配送费"
                type="number"
                class="input-with-select"
              >
              </el-input>
              <!-- extJsonDetail.depositInfo.money -->
              <el-button
                v-if="form.orderRefundRecord == null"
                type="danger"
                @click="returndeposit()"
                >退押金</el-button
              >
              <el-button
                disabled
                v-if="form.orderRefundRecord !== null"
                type="info"
                >已退款</el-button
              >
            </div>
            <div v-if="form.orderRefundRecord" style="padding: 0 20px">
              <div style="margin: 10px">
                <span style="font-weight: 700">退款类型：</span>
                <span v-if="form.orderRefundRecord.refundType == 1"
                  >仅退款
                </span>
                <span v-if="form.orderRefundRecord.refundType == 2"
                  >退货退款
                </span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">申请理由：</span>
                <span>{{ form.orderRefundRecord.applyRemark }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">申请时间：</span>
                <span>{{ form.orderRefundRecord.createTime }}</span>
              </div>

              <div style="margin: 10px">
                <span style="font-weight: 700">退款金额：</span>
                <span>{{ form.orderRefundRecord.refundMoney }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">退单编号：</span>
                <span>{{ form.orderRefundRecord.refundNo }}</span>
              </div>

              <div style="margin: 10px">
                <span style="font-weight: 700">退款方式：</span>
                <span v-if="form.orderRefundRecord.refundPayWay == 1"
                  >微信</span
                >
                <span v-if="form.orderRefundRecord.refundPayWay == 2"
                  >支付宝</span
                >
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">微信支付宝订单号：</span>
                <span>{{ form.orderRefundRecord.tradeNo }}</span>
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundType == 1"
              >
                <span style="font-weight: 700">退款状态：</span>
                <span v-if="form.orderRefundRecord.refundStatus == 0"
                  >待退款</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 5"
                  >退款中</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 10"
                  >退款成功</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 15"
                  >退款失败</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 20"
                  >待审核</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 25"
                  >拒绝退款</span
                >
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundType == 2"
              >
                <span style="font-weight: 700">退款状态：</span>
                <span v-if="form.orderRefundRecord.refundStatus == 0"
                  >待退货审核</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 5"
                  >待填写回寄单号</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 10"
                  >待质检</span
                >

                <span v-else-if="form.orderRefundRecord.refundStatus == 20"
                  >待退款</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 25"
                  >退款成功</span
                >
                <span v-else-if="form.orderRefundRecord.refundStatus == 30"
                  >拒绝退货</span
                >
              </div>
              <div
                style="margin: 10px"
                v-if="form.orderRefundRecord.refundStatus == 25"
              >
                <span style="font-weight: 700">退款时间：</span>
                <span>{{ formatDate(form.orderRefundRecord.refundTime) }}</span>
              </div>
              <div style="margin: 10px">
                <span style="font-weight: 700">退款说明：</span>
                <span>{{ form.orderRefundRecord.refuseApplyRemark }}</span>
              </div>
              <div
                v-if="form.refundStatus == 8"
                style="
                  font-size: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <!-- <el-button @click="open" type="danger">退款</el-button> -->
                <!-- <el-button @click="openNo" type="">拒绝退款</el-button> -->
              </div>
            </div>

            <div v-else>
              <el-empty description="暂无售后信息" />
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <!-- 物流信息 -->
        <el-tab-pane label="物流信息" name="fourth">
          <el-scrollbar>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                配送方式
              </div>
              <div style="width: 250px">
                <div v-if="form.logisticsType == 1">配送</div>
                <div v-else-if="form.logisticsType == 2">快递</div>
                <div v-else-if="form.logisticsType == 3">自提</div>
                <div v-else-if="form.logisticsType == 4">到店消费</div>
                <div v-else-if="form.logisticsType == 5">上门服务</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.logisticsType == 3"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                预计自提时间
              </div>
              <div style="width: 250px">{{ logisticsInfo.expectPickTime }}</div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.logisticsType == 2"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                快递公司
              </div>
              <div style="width: 250px">{{ logisticsInfo.expressName }}</div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.logisticsType == 2"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                快递单号
              </div>
              <div style="width: 250px">{{ logisticsInfo.expressName }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                配送状态
              </div>
              <div style="width: 250px">
                <div v-if="logisticsInfo.expressStatus == 0">创建订单</div>
                <div v-else-if="logisticsInfo.expressStatus == 5">
                  配送订单已创建
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 10">
                  订单已改派
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 15">
                  配送员已接单
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 20">
                  配送员已到店
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 25">
                  配送员配送中
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 30">
                  配送员点击订单完成
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 50">
                  店家取消订单
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 55">
                  顺丰原因取消订单
                </div>
                <div v-else-if="logisticsInfo.expressStatus == 66">
                  订单异常
                </div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.logisticsType == 1 || form.logisticsType == 2"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                运费/配送费
              </div>
              <div style="width: 250px">{{ logisticsInfo.realPayMoney }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div>
                <div
                  v-if="form.logisticsType == 1 || form.logisticsType == 2"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  收货人姓名
                </div>
                <div
                  v-else-if="form.logisticsType == 3"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  自提人姓名
                </div>
                <div
                  v-else-if="form.logisticsType == 4 || form.logisticsType == 5"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  姓名
                </div>
              </div>

              <div style="width: 250px">{{ logisticsInfo.receiverName }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div>
                <div
                  v-if="form.logisticsType == 1 || form.logisticsType == 2"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  收货人电话
                </div>
                <div
                  v-else-if="form.logisticsType == 3"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  自提电话
                </div>
              </div>

              <div style="width: 250px">{{ logisticsInfo.receiverMobile }}</div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div>
                <div
                  v-if="form.logisticsType == 1 || form.logisticsType == 2"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  收件人地址
                </div>
                <div
                  v-if="form.logisticsType == 3"
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  店铺地址
                </div>
              </div>
              <div>
                <div
                  style="width: 250px"
                  v-if="form.logisticsType == 1 || form.logisticsType == 2"
                >
                  {{
                    logisticsInfo.receiverProvince +
                    logisticsInfo.receiverCity +
                    logisticsInfo.receiverDistrict +
                    logisticsInfo.receiverAddressJson.address
                  }}
                </div>
                <div v-if="form.logisticsType == 3">
                  {{ logisticsInfo.receiverAddressJson.address }}
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>

      <!-- ------------------------------------------------------------------------------- -->
      <!-- 陪诊订单   form.orderType == '3'" -->
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        v-if="form.orderType == '3'"
      >
        <el-tab-pane label="订单信息" name="first">
          <el-scrollbar>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                服务类型
              </div>
              <div style="width: 250px">
                {{ extJsonDetail.service.serviceName }}
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单编号
              </div>
              <div style="width: 250px">{{ form.orderNo }}</div>
            </div>

            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单状态
              </div>
              <div style="width: 250px">
                <div v-if="form.orderStatus == 0">待付款</div>
                <div v-else-if="form.orderStatus == 1">待接单</div>
                <div v-else-if="form.orderStatus == 2">服务中</div>
                <div v-else-if="form.orderStatus == 3">待确认</div>
                <div v-else-if="form.orderStatus == 4">待使用</div>
                <div v-else-if="form.orderStatus == 5" style="color: #4cd909">
                  已完成
                </div>
                <div v-else-if="form.orderStatus == 6" style="color: #606266">
                  已取消
                </div>
                <div v-else-if="form.orderStatus == 7" style="color: #606266">
                  已失效
                </div>
                <div v-else-if="form.orderStatus == 8">退款中</div>
                <div v-else-if="form.orderStatus == 9">退款成功</div>
                <div v-else-if="form.orderStatus == 10">退款失败</div>
                <div v-else-if="form.orderStatus == 11">待结算</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.serviceNotesJson"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                陪诊员上传描述
              </div>
              <div style="width: 250px">
                <div>{{ form.serviceNotesJson.description }}</div>
              </div>
            </div>
            <div
              style="display: flex; width: 500px; margin: 20px"
              v-if="form.serviceNotesJson"
            >
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                陪诊员上传图片
              </div>
              <div style="display: flex">
                <div style="" v-for="item in form.serviceNotesJson.imagesURL">
                  <img
                    style="width: 60px; height: 60px; margin-right: 10px"
                    :src="item"
                  />
                </div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单类型
              </div>
              <div style="width: 250px">
                <div>陪诊订单</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                订单金额
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.service.money }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                医院名称
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.hospitalInfo.hospitalName }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                科室
              </div>
              <div style="width: 250px">
                <div>
                  {{ extJsonDetail.departmen.departmentName }}--{{
                    extJsonDetail.departmen.child[0].departmentName
                  }}
                </div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                期望就诊时间
              </div>
              <div style="width: 250px">
                <div>{{ form.orderLogistics.expectTime }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                下单人电话
              </div>
              <div style="width: 250px">
                <div>{{ form.orderLogistics.receiverMobile }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                对陪诊员性别的要求
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.sexReq }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                备注
              </div>
              <div style="">
                {{ form.orderRemark }}
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                创建时间
              </div>
              <div style="">
                {{ form.createTime }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="就诊人信息" name="second">
          <el-scrollbar>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                就诊人姓名
              </div>
              <div style="width: 250px">
                {{ extJsonDetail.patientInfo.name }}
              </div>
            </div>

            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                就诊人性别
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.patientInfo.sex }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                就诊人手机号
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.patientInfo.phone }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                就诊人身份证号
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.patientInfo.idCar }}</div>
              </div>
            </div>
            <div style="display: flex; width: 500px; margin: 20px">
              <div
                style="
                  width: 100px;
                  font-weight: 700;
                  text-align: right;
                  margin-right: 30px;
                "
              >
                就诊人关系
              </div>
              <div style="width: 250px">
                <div>{{ extJsonDetail.patientInfo.relationship }}</div>
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="陪诊员信息" name="third">
          <el-scrollbar>
            <div
              v-if="JSON.stringify(accompanyingPatientFiles.jsonData) != '{}'"
            >
              <div style="display: flex; width: 500px; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员姓名
                </div>
                <div style="width: 250px">
                  {{ accompanyingPatientFiles.jsonData.name }}
                </div>
              </div>
              <div style="display: flex; width: 500px; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员电话
                </div>
                <div style="width: 250px">
                  {{ accompanyingPatientFiles.jsonData.phone }}
                </div>
              </div>
              <div style="display: flex; width: 500px; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员性别
                </div>
                <div style="width: 250px">
                  {{ accompanyingPatientFiles.jsonData.sex }}
                </div>
              </div>
              <div style="display: flex; width: 500px; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员身份证号
                </div>
                <div style="width: 250px">
                  {{ accompanyingPatientFiles.jsonData.idCard }}
                </div>
              </div>

              <div style="display: flex; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员地址信息
                </div>
                <div style="">
                  {{ accompanyingPatientFiles.jsonData.address.province }}
                  {{ accompanyingPatientFiles.jsonData.address.city }}
                  {{ accompanyingPatientFiles.jsonData.address.district }}
                  {{ accompanyingPatientFiles.jsonData.address.address }}
                </div>
              </div>
              <div style="display: flex; margin: 20px">
                <div
                  style="
                    width: 100px;
                    font-weight: 700;
                    text-align: right;
                    margin-right: 30px;
                  "
                >
                  陪诊员服务医院
                </div>
                <div style="">
                  <div
                    v-for="item in accompanyingPatientFiles.jsonData
                      .serviceHospital"
                  >
                    {{ item.serviceHospitalName }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <el-empty description="陪诊员暂未接单" />
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import http from "@/api/index";
import api from "@/api/plugin";
import { UploadProps, ElMessage, ElMessageBox } from "element-plus";
import storage from "@/utils/storage";
import useUserStore from "@/store/modules/user";
import JSONBIG from "json-bigint";
const userStore = useUserStore();
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    id: any;
  }>(),
  {
    modelValue: false,
    id: "",
  }
);
const activeName = ref("first");

const myVisible = ref(props.modelValue);
const form: any = ref({
  orderLogistics: {
    receiverAddressJson: {},
  },
  orderItemList: [],
});
const formRef = ref();
const formRules = ref({});
const pcasName: any = ref([]);
const accompanyingPatientFiles: any = ref({
  jsonData: {},
});
const extJsonDetail: any = ref({
  departmen: {},
  hospitalInfo: {},
  patientInfo: {},
  service: {},
  sexReq: "",
});
const openId: any = ref();
const goodsId = ref();
onMounted(() => {
  getdetalis();
});
const userId: any = ref();
const logisticsInfo: any = ref({
  businessArriveTime: "",
  businessId: 0,
  completeCode: "",
  couponsTotalFee: 0,
  deliveryDistanceMeter: 0,
  expectExpectTimepickupTime: "",
  expectPickTime: "",
  expectTime: "",
  expressName: "",
  expressNo: "",
  expressStatus: 0,
  expressStatusDesc: "",
  extJson: "",
  id: 0,
  isAppoint: 0,
  orderId: 0,
  orderNo: "",
  payType: 0,
  pickupCode: "",
  realPayMoney: 0,
  receiverAddressJson: "",
  receiverCity: "",
  receiverDistrict: "",
  receiverLat: 0,
  receiverLng: 0,
  receiverMobile: "",
  receiverName: "",
  receiverProvince: "",
  riderName: "",
  riderPhone: "",
  serviceTime: "",
  startTime: "",
  totalPayMoney: 0,
  userId: 0,
});
function getdetalis() {
  let data = {
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
    id: props.id,
  };
  api
    .get("/api/order/getOrderInfoById", {
      params: data,
    })
    .then((res: any) => {
      if (res.code == 200) {
        form.value = res.body;
        logisticsInfo.value = res.body.orderLogistics;
        // logisticsInfo.value.receiverAddressJson= JSON.parse(logisticsInfo.value.receiverAddressJson);
        form.value.orderLogistics.receiverAddressJson = JSON.parse(
          form.value.orderLogistics.receiverAddressJson
        );
        form.value.orderItemList[0].extJson = JSON.parse(
          form.value.orderItemList[0].extJson
        );
        extJsonDetail.value = form.value.orderItemList[0].extJson;

        if (form.value.orderItemList[0].extJson) {
          accompanyingPatientFiles.value.jsonData = JSON.parse(
            form.value.orderItemList[0].extJson.accompanyingPatientFiles
              .jsonData
          );
        }
        if (form.value.serviceNotesJson) {
          form.value.serviceNotesJson = JSON.parse(form.value.serviceNotesJson);
        }
        userId.value = form.value.orderLogistics.userId;
        goodsId.value = form.value.orderItemList[0].goodsId;
        searchUserInfo();
      }
    });
}

function onSubmit() {
  onCancel();
}
const emit = defineEmits(["success"]);

function onCancel() {
  myVisible.value = false;
  emit("success");
}
// 查找用户信息
function searchUserInfo() {
  let postdata = {
    userId: userId.value,
  };
  api
    .get("/api/user/searchUserInfoById", {
      params: postdata,
    })
    .then((res: any) => {
      if (res.code == 200) {
        let data = res.body;
        openId.value = JSON.parse(data.associatedAccounJson).wechat_open_id;
      }
    });
}
// 退押金
function returndeposit() {
  let postdata = {
    // openId: openId.value,
    orderNo: form.value.orderNo,
    type: 1,
    goodsId: goodsId.value,
  };
  ElMessageBox.confirm(`确认退押金吗？`, "确认信息").then(() => {
    api
      .get("/api/order/weChatPayment", {
        params: postdata,
      })
      .then((res: any) => {
        if (res.code == 200) {
          let data = res.body;
        }
      });
  });
}
// 退款
const open = () => {
  ElMessageBox.prompt("您确定要退款吗?", "提示", {
    confirmButtonText: "同意",
    cancelButtonText: "拒绝",
    type: "warning",
    inputPlaceholder: "请输入理由",
  })
    .then(({ value }) => {
      let data: any = {
        orderNo: form.value.orderNo,
        pass: 0,
        applyRemark: value,
      };
      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "退款成功",
          });
          activeName.value = "forid";
          getdetalis();
        } else {
          ElMessage({
            type: "info",
            message: res.msg,
          });
          getdetalis();
        }
      });
    })
    .catch(({ value }) => {
      let data: any = {
        orderNo: form.value.orderNo,
        pass: 1,
        applyRemark: value,
      };

      http.post("/api/order/shopApplyOrderRefund", data).then((res: any) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "拒绝成功",
          });
          activeName.value = "forid";
          getdetalis();
        } else {
          ElMessage({
            type: "info",
            message: "拒绝失败",
          });
          getdetalis();
        }
      });
    });
};
// 时间转换
function formatDate(cellValue: any) {
  if (cellValue == null || cellValue == "") return "";
  let date = new Date(parseInt(cellValue)); //时间戳为10位需*1000，如果为13位的话不需乘1000。
  let Y = date.getFullYear() + "-";
  let M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1) + "-"
      : date.getMonth() + 1 + "-";
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  let h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  let m =
    date.getMinutes() < 10
      ? "0" + date.getMinutes() + ":"
      : date.getMinutes() + ":";
  let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
