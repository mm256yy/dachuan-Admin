<route lang="yaml">
meta:
  enabled: false
</route>

<script lang="ts" setup>
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
import api from "@/api";

const settingsStore = useSettingsStore();

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
  max_height: 500,
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
const content = ref("");
const props = withDefaults(
  defineProps<{
    form: any;
  }>(),
  {
    form: {},
  }
);
content.value = props.form.goodsDetailsJson;
onMounted(() => {
  tinymce.init({});
});
const add = () => {
  console.log(content.value);

  emit("success", content.value);
};

const emit = defineEmits(["success"]);
function open(url: string) {
  window.open(url, "_blank");
}
</script>

<template>
  <div>
    <TinymceEditor v-model="content" :init="defaultSetting" />
    <button @click="add">信息确认</button>
    <div class="preview" v-html="content" />
  </div>
</template>

<style lang="scss" scoped>
.preview {
  &::before {
    content: "预览：";
    display: block;
  }
}
</style>
