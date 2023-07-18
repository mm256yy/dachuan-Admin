<route lang="yaml">
meta: title:商品添加
</route>
<route lang="yaml">
meta:
  enabled: false
</route>

<template>
  <div
    class="containter"
    style="
      background-color: #fff;
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
    "
  >
    <el-scrollbar height="68vh" style="padding: 20px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="试题状态" prop="status">
          <el-switch
            v-model="form.status"
            inline-prompt
            :inactive-value="0"
            inactive-text="关闭"
            :active-value="1"
            active-text="开启"
          />
        </el-form-item>
        <el-form-item label="试题备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入试题备注"
            clearable
          />
        </el-form-item>
        <el-form-item label="试题排序" prop="questionOrder">
          <el-input
            v-model="form.questionOrder"
            placeholder="请输入排序数字"
            clearable
          />
        </el-form-item>
        <el-form-item label="试题类型" prop="questionType">
          <el-select
            v-model="form.questionType"
            filterable
            placeholder="请试题类型"
            @change="changeType(form.questionType)"
          >
            <el-option :key="0" label="判断题" :value="0" />
            <el-option :key="1" label="单选题" :value="1" />
            <el-option :key="2" label="多选题" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属科目" prop="subjectId">
          <el-select
            v-model="form.subjectId"
            filterable
            clearable
            placeholder="请选择科目"
            @change="changesub"
          >
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.subjectName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属题库" prop="questionBankId">
          <el-select
            v-model="form.questionBankId"
            filterable
            placeholder="请选择题库"
          >
            <el-option
              v-for="item in questionBankList"
              :key="item.id"
              :label="item.questionBankName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="title"><span>*</span>试题题干</div>
        <div>
          <TinymceEditor
            v-model="form.questionStemExtJson.testQuestionsContent"
            :init="defaultSetting"
          />
        </div>
        <div class="title"><span>*</span>试题选项</div>

        <div class="box" v-if="form.questionType == 0">
          <div class="box-one" v-for="(item, index) in typeOne">
            <div class="name">
              {{ item.optionsName }}
            </div>
            <el-checkbox
              :checked="item.answerStatust == 1 ? true : false"
              :true-label="1"
              :false-label="0"
              v-model="item.answerStatus"
              @change="changeTypeOne(index)"
            >
            </el-checkbox>
          </div>
        </div>

        <div class="box" style="" v-if="form.questionType == 1">
          <div class="box-one" v-for="(item, index) in typeTwo">
            <div class="name">选项 {{ item.optionsName }}</div>
            <el-checkbox
              :checked="item.answerStatust == 1 ? true : false"
              :true-label="1"
              :false-label="0"
              v-model="item.answerStatus"
              @change="changeTypeTwo(index)"
            >
            </el-checkbox>
            <div class="content">
              <el-input
                v-model="item.centent"
                :rows="2"
                type="textarea"
                placeholder="请输入试题选项内容"
              />
            </div>
            <div
              class="icon"
              v-if="index !== 0 && index !== 1"
              @click="changeTypeTwoDel(index)"
            >
              <el-icon color="#fff" size="22"><Close /></el-icon>
            </div>
          </div>
          <div style="margin-left: 300px; margin-top: 20px">
            <el-button type="success" @click="changeTypeTwoAdd">
              添加选项
            </el-button>
          </div>
        </div>
        <div class="box" style="" v-if="form.questionType == 2">
          <div class="box-one" v-for="(item, index) in typeThree">
            <div class="name">选项 {{ item.optionsName }}</div>
            <el-checkbox
              :checked="item.answerStatust == 1 ? true : false"
              :true-label="1"
              :false-label="0"
              v-model="item.answerStatus"
              @change="changeTypeThree(index)"
            >
            </el-checkbox>
            <div class="content">
              <el-input
                v-model="item.centent"
                :rows="2"
                type="textarea"
                placeholder="请输入试题选项内容"
              />
            </div>
            <div
              class="icon"
              v-if="index !== 0 && index !== 1"
              @click="changeTypeThreeDel(index)"
            >
              <el-icon color="#fff" size="22"><Close /></el-icon>
            </div>
          </div>
          <div style="margin-left: 300px; margin-top: 20px">
            <el-button type="success" @click="changeTypeThreeAdd">
              添加选项
            </el-button>
          </div>
        </div>

        <el-form-item label="试题解析" prop="questionAnalysisExtJson">
          <div>
            <TinymceEditor
              v-model="form.questionAnalysisExtJson"
              :init="defaultSetting"
            />
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="footer">
      <el-button size="large" @click="onCancel"> 取消 </el-button>
      <el-button type="primary" size="large" @click="onSubmit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from "@/api/plugin";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";

import tinymce from "tinymce/tinymce";
import TinymceEditor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";
import "tinymce/models/dom";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/code";
import "tinymce/plugins/searchreplace";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();

const route = useRoute();
const router = useRouter();
const tabbar = useTabbar();
const defaultSetting = ref({
  language_url: "tinymce/langs/zh-Hans.js",
  language: "zh-Hans",
  skin_url:
    settingsStore.settings.app.colorScheme === "light"
      ? "tinymce/skins/ui/oxide"
      : "tinymce/skins/ui/oxide-dark",
  content_css:
    settingsStore.settings.app.colorScheme === "light"
      ? "tinymce/skins/content/default/content.min.css"
      : "tinymce/skins/content/dark/content.min.css",
  min_height: 250,
  max_height: 650,
  selector: "textarea",
  plugins:
    "autolink autoresize fullscreen image insertdatetime link lists media preview table wordcount code searchreplace",
  toolbar:
    "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat | link image media table insertdatetime searchreplace | preview code fullscreen",
  branding: false,
  menubar: false,
  toolbar_mode: "sliding",
  insertdatetime_formats: [
    "%Y年%m月%d日",
    "%H点%M分%S秒",
    "%Y-%m-%d",
    "%H:%M:%S",
  ],

  // https://www.tiny.cloud/docs/tinymce/6/file-image-upload/#images_upload_handler
  images_upload_handler: (blobInfo: any, success: any) =>
    new Promise((resolve) => {
      let formData = new FormData();
      formData.append("file", blobInfo.blob());
      formData.append("type", "1");
      api.post("/api/file/uploadImages", formData).then((res: any) => {
        console.log(res);
        const img = res.body;
        resolve(img);
      });
    }),
});
const form: any = ref({
  adminId: Number(storage.local.get("adminId")),
  userServiceToken: storage.local.get("userServiceToken"),
  id: route.params.id,
  questionAnalysisExtJson: "",
  questionBankId: "",
  questionOption: "",
  questionOrder: "",
  questionStemExtJson: {
    testQuestionsContent: "",
    testQuestionOptions: [
      {
        answerStatus: 1,
        optionsName: "正确",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "错误",
        centent: "",
      },
    ],
  },
  questionType: 0,
  remark: "",
  status: 0,
  subjectId: "",
});
const typeOne: any = ref([
  {
    answerStatus: 1,
    optionsName: "正确",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "错误",
    centent: "",
  },
]);
const typeTwo: any = ref([
  {
    answerStatus: 1,
    optionsName: "A",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "B",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "C",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "D",
    centent: "",
  },
]);
const typeThree: any = ref([
  {
    answerStatus: 1,
    optionsName: "A",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "B",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "C",
    centent: "",
  },
  {
    answerStatus: 0,
    optionsName: "D",
    centent: "",
  },
]);

const changeType = (index: any) => {
  if (index == 0) {
    typeOne.value = [
      {
        answerStatus: 1,
        optionsName: "正确",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "错误",
        centent: "",
      },
    ];
  } else if (index == 1) {
    typeTwo.value = [
      {
        answerStatus: 1,
        optionsName: "A",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "B",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "C",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "D",
        centent: "",
      },
    ];
  } else if (index == 2) {
    typeThree.value = [
      {
        answerStatus: 1,
        optionsName: "A",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "B",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "C",
        centent: "",
      },
      {
        answerStatus: 0,
        optionsName: "D",
        centent: "",
      },
    ];
  }
  console.log(form.value.questionStemExtJson.testQuestionOptions);
};

const changeTypeOne = (index: any) => {
  typeOne.value.forEach((item: any) => {
    item.answerStatus = 0;
  });
  typeOne.value[index].answerStatus = 1;
  console.log(typeOne.value);
};

const changeTypeTwo = (index: any) => {
  typeTwo.value.forEach((item: any) => {
    item.answerStatus = 0;
  });
  typeTwo.value[index].answerStatus = 1;
  console.log(typeTwo.value);
};
const randomAbc: any = ref([]);
const setDesc = () => {
  const letterArr = [];
  // 字母A的code值是65，但因为已经到字母D了，所以直接从69E开始循环
  for (let i = 65; i < 91; i++) {
    letterArr[i] = String.fromCharCode(i);
  }
  console.log(letterArr);

  randomAbc.value = letterArr.splice(65);
};
setDesc();
const changeTypeTwoAdd = () => {
  let obj = {
    answerStatus: 0,
    optionsName: randomAbc.value[typeTwo.value.length],
    centent: "",
  };
  typeTwo.value.push(obj);
};
const changeTypeTwoDel = (index: any) => {
  typeTwo.value.splice(index, 1);
  typeTwo.value.forEach((item: any, ind: any) => {
    item.optionsName = randomAbc.value[ind];
  });
};

const changeTypeThree = (index: any) => {
  console.log(index, typeThree.value);
};

const changeTypeThreeAdd = () => {
  let obj = {
    answerStatus: 0,
    optionsName: randomAbc.value[typeThree.value.length],
    centent: "",
  };
  typeThree.value.push(obj);
};
const changeTypeThreeDel = (index: any) => {
  typeThree.value.splice(index, 1);
  typeThree.value.forEach((item: any, ind: any) => {
    item.optionsName = randomAbc.value[ind];
  });
};

const formRef = ref();
const formRules = ref({
  questionType: [{ required: true, message: "请输入" }],
  questionBankId: [{ required: true, message: "请输入", trigger: "change" }],
});

const subjectList: any = ref([]);
const questionBankList: any = ref([]);
onMounted(() => {
  tinymce.init({});
  let data: any = {
    page: 1,
    size: 50,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  // 获取科目
  api
    .get("/api/plugs/searchPlugsPracticeSubjectList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        subjectList.value = res.body.list;
      }
    });
  // 获取题库
  getquestionBankList();
  if (form.value.id != 0) {
    console.log("我用了你");
    api
      .get("/api/plugs/searchPlugsPracticeTestQuestionsManageById", {
        params: {
          id: form.value.id,
        },
      })
      .then((res: any) => {
        form.value = res.body;
        form.value.questionStemExtJson = JSON.parse(
          form.value.questionStemExtJson
        );
        typeOne.value = form.value.questionStemExtJson.testQuestionOptions;
        typeTwo.value = form.value.questionStemExtJson.testQuestionOptions;
        typeThree.value = form.value.questionStemExtJson.testQuestionOptions;
      });
  }
});
const dataId = ref("");
const getquestionBankList = () => {
  let data: any = {
    page: 1,
    size: 50,
    dataId: dataId.value,
    adminId: storage.local.get("adminId"),
    userServiceToken: storage.local.get("userServiceToken"),
  };
  api
    .get("/api/plugs/searchPlugsPracticeQuestionBankList", { params: data })
    .then((res: any) => {
      if (res.code == 200) {
        questionBankList.value = res.body.list;
      }
    });
};

function onSubmit() {
  if (form.value.questionType == 0) {
    form.value.questionStemExtJson.testQuestionOptions = typeOne.value;
  } else if (form.value.questionType == 1) {
    form.value.questionStemExtJson.testQuestionOptions = typeTwo.value;
  } else if (form.value.questionType == 2) {
    form.value.questionStemExtJson.testQuestionOptions = typeThree.value;
  }
  console.log(form.value.questionStemExtJson);

  if (form.value.id == 0) {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          form.value.questionStemExtJson = JSON.stringify(
            form.value.questionStemExtJson
          );
          api
            .post(
              "/api/plugs/insertPlugsPracticeTestQuestionsManage",
              form.value
            )
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "新增成功",
                  center: true,
                });
                console.log(res, 787);
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
                onCancel();
              }
            });
        }
      });
  } else {
    formRef.value &&
      formRef.value.validate((valid: any) => {
        if (valid) {
          form.value.questionStemExtJson = JSON.stringify(
            form.value.questionStemExtJson
          );
          api
            .post(
              "/api/plugs/updatePlugsPracticeTestQuestionsManage",
              form.value
            )
            .then((res: any) => {
              if (res.code == 200) {
                ElMessage.success({
                  message: "修改成功",
                  center: true,
                });
                onCancel();
              } else {
                ElMessage.error({
                  message: res.msg,
                  center: true,
                });
              }
            });
        }
      });
  }
}
const comp = ref({
  modelValue: false,
});

function onCancel() {
  tabbar.close({ name: "addTestquestions" });
  router.push({
    name: "testquestions",
  });
}
function changesub(value: any) {
  console.log(value);
  dataId.value = value;
  getquestionBankList();
}
</script>

<style scoped></style>

<style lang="scss">
.el-textarea {
  width: 500px;
}
.title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
  span {
    color: #f56c6c;
    margin-right: 5px;
  }
}
.box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .box-one {
    display: flex;
    align-items: center;
    border-bottom: 1px dashed #f5f5f5;
    padding: 10px 0;
    .name {
      margin-right: 20px;
      color: #333;
    }
    .content {
      margin: 0 30px;
    }
    .icon {
      width: 26px;
      height: 26px;
      background-color: #f56c6c;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
