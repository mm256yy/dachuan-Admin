<template>
  <json-viewer
    class="my-awesome-json-theme"
    :value="jsonData"
    copyable
    boxed
    sort
  />
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    jsondata: any;
  }>(),
  {
    jsondata: "",
  }
);

const jsonData = reactive(props.jsondata);

onMounted(() => {});
</script>
<style scoped lang="scss">
.my-awesome-json-theme {
  overflow-x: hidden;
  background: #0c2b52;
  white-space: nowrap;
  color: #01fef4;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
  padding: 20px 50px;
  :deep(.jv-button) {
    font-size: 28px !important;
  }
  .jv-ellipsis {
    color: rgb(237, 13, 13);
    background-color: rgb(241, 11, 11);
    display: inline-block;
    line-height: 0.9;
    font-size: 0.9em;
    padding: 0px 4px 2px 4px;
    border-radius: 3px;
    vertical-align: 2px;
    cursor: pointer;
    user-select: none;
  }
  .jv-button {
    color: #49b3ff;
  }
  :deep(.jv-key) {
    color: #01fef4 !important;
  }
  :deep(.jv-push) {
    color: #fff;
  }
  .jv-item {
    &.jv-array {
      color: #111111;
    }
    &.jv-boolean {
      color: #fc1e70;
    }
    &.jv-function {
      color: #067bca;
    }
    &.jv-number {
      color: #fc1e70;
    }
    &.jv-number-float {
      color: #fc1e70;
    }
    &.jv-number-integer {
      color: #fc1e70;
    }
    &.jv-object {
      color: #111111;
    }
    &.jv-undefined {
      color: #e08331;
    }
    &.jv-string {
      color: #42b983;
      word-break: break-word;
      white-space: normal;
    }
  }
  .jv-code {
    ::v-deep .jv-toggle {
      color: #067bca !important;
      &:before {
        padding: 0px 2px;
        border-radius: 2px;
      }
      &:hover {
        &:before {
          background: rgb(242, 5, 5);
        }
      }
    }
  }
}
</style>
