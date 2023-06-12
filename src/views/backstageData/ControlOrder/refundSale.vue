<route lang="yaml">
  meta:
    title:订单管理
  </route>

<script setup lang="ts">
  import api from '@/api/plugin';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'
  import { ref } from 'vue'
  const router = useRouter();
  const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

const size = ref<'default' | 'sqtk' | 'sqtk'>('sqtk')
const keyword = ref('')

function select(row:any){
  // console.log(row.id)
  router.push('orderList/detail?id='+1);

}
watch(size, (newValue, oldValue) => {
    console.log('watch 已触发', newValue,oldValue)

})

const value = ref('1')
const options = [
  {
    value: '1',
    label: '全部',
  },
  {
    value: '2',
    label: '待处理',
    // disabled: true,
  },
  {
    value: '3',
    label: '处理成功',
  },
  {
    value: '4',
    label: '处理失败',
  },
  {
    value: '5',
    label: '取消申请',
  },
]

function select_status(){
  console.log(value)
}


</script>

  <template>
    <div>
      <page-main>

        <div style="margin:10px 0">
          <div style="margin-top:10px;display: flex;justify-content: space-between;">
            <el-radio-group v-model="size" label="size control" size="small">
              <el-radio-button label="sqtk">申请退款</el-radio-button>
              <el-radio-button label="sqsh">申请售后</el-radio-button>

            </el-radio-group>
            <div style="display:flex;">
              <el-select v-model="value" placeholder="状态" style="margin: 5px;">
                <el-option
                :change="select_status"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"

                />
                     <!-- :disabled="item.disabled" -->
              </el-select>
              <el-input v-model="keyword" placeholder="订单号、用户昵称、申请原因" style="width: 240px;margin:5px 0;" />
              <el-button :icon="Search" style="margin-top: 5px;">搜索</el-button>
            </div>
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%" @cell-dblclick="select">
              <el-table-column label="订单号" width="200" >
                <template #default="scope">
                  <div style="display: flex;justify-content: center;align-items: center;">B230106150608337531</div>
                </template>
              </el-table-column>
              <el-table-column label="商品" >
                <template #default="scope">
                  <div v-for="item in 3" style="margin-top:5px;">
                    <div style="display: flex;">
                      <img src="" style="width: 48px;height: 48px;">
                      <div style="margin-left:10px;">
                        <!--  display: -webkit-box;-webkit-line-clamp: 1;控制显示几条 -->
                        <div style=" overflow: hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;width: 200px;">零零亲去骨凤爪香辣柠檬味68g解</div>
                        <div style="color:green ;">申请数量：1</div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="申请">
                <template #default="scope">
                  <div >韵达物流</div>
                </template>
              </el-table-column>
              <el-table-column label="附加图片">
                <template #default="scope">
                  <div >无</div>
                </template>
              </el-table-column>
              <el-table-column label="状态">
                <template #default="scope" >
                  <div >
                    <!-- <el-button type="success" plain></el-button> -->
                    <el-tag class="ml-2" type="danger">处理成功</el-tag>
                  </div>

                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope" >
                  <div >
                    <el-button type="success" plain @click="select">订单详情</el-button>
                  </div>

                </template>
              </el-table-column>

            </el-table>
          </div>
          <div style="display: flex;justify-content: center;align-items: center;position: relative;top: 20px;right: 60px;">
            <el-pagination background layout="prev, pager, next" :total="tableData.length" />
          </div>
        </div>

      </page-main>
    </div>
  </template>


