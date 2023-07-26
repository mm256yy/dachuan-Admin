<template>
  <div class="content">
    
    <div class="contentBox" >
      <el-alert  title="如对插件有使用问题或需要定制插件功能请联系您的业务经理" type="success" />
      <div class="bigbox">
      <div
        class="box"
        v-for="item in pluginList"
        :key="item.id"
        style="
          position: relative;
        "
        @click="gopath1(item)"
      >
        <div class="box-left">
          <img style="border-radius: 5px" :src="item.icon" alt="" />
        </div>
        <div class="box-right">
          <div class="box-title">{{ item.title }}</div>
          <div class="box-content">{{ item.plugsDescribe }}</div>
        </div>
        <!-- <el-icon><Tools /></el-icon> -->
        <!-- <div style="position: absolute; right: 5px; top: 5px">
          <el-button :icon="Tools" />
        </div> -->
      </div>
    </div>
    </div>
    
  </div>
</template>

<script lang="ts" setup>
import api from "@/api";
import storage from "@/utils/storage";
const router = useRouter();
const pluginList: any = ref([]);

const gopath1 = (item: any) => {

  router.push({
    name: item.paths,
    params: {
      id: item.id,
      admin:'user'
    },
  });
};
onMounted(() => {
  const adminId: any = storage.local.get("adminId");
  api
    .get("/api/admin/searchAdminUserById", {
      params: {
        id: adminId,
      },
    })
    .then((res: any) => {
      if (res.code == 200) {
        let arr: any = [];
        if (res.body.plugJson) {
          JSON.parse(res.body.plugJson).forEach((i: any) => {
            arr.push(i.plugsId);
          });
          let data = {
            ids: arr.join(),
          };
          api
            .get("/api/plugs/getPlugsInfoById", { params: data })
            .then((ress: any) => {
              if (ress.code == 200) {
                pluginList.value = ress.body;
              }
            });
        }
      }
    });
});
</script>
<style scoped lang="scss">
.content {
  padding: 20px;
  // background-color: #fff;
}
.contentBox{
  background-color: #fff;
  padding: 16px;
  border-radius: 6px;
}
.el-alert {
  margin-bottom: 16px;
  color: #515a6e;
  border: 1px solid #8ce6b0;
}
.bigbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  // justify-content: space-between;
  
  // padding: 16px;
  .box:hover {
    /* 盒子向上移动 */
    box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
    transform: translateY(-8px);
    transition: all .2s;
  }
  .box {
    width: 252px;
    padding: 10px;
    margin: 10px 9px;
    // background-color: rgb(45 140 240 / 6%);
    background-color: rgb(45 140 240 / 6%);
    overflow: hidden;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 10px;
    display: flex;
    max-width: 280px;

    // align-items: center;

    .box-left {
      margin-right: 5px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    .box-right {
      .box-title {
        color: #1c1d23;
        font-weight: 700;
        font-size: 14px;
      }

      .box-content {
        color: #999;
        padding-top: 2px;
        font-size: 13px;
      }
    }
  }
}
</style>
