const path = require('path')
const fs = require('fs')

function getFolder(path) {
  const components = [path]
  const files = fs.readdirSync(path)
  files.forEach((item) => {
    const stat = fs.lstatSync(`${path}/${item}`)
    if (stat.isDirectory() === true && item !== 'components') {
      components.push(...getFolder(`${path}/${item}`))
    }
  })
  return components
}

module.exports = {
  description: '创建标准模块（包含列表页&详情页）',
  prompts: [
    {
      type: 'list',
      name: 'path',
      message: '请选择模块创建目录',
      choices: getFolder('src/views'),
    },
    {
      type: 'input',
      name: 'name',
      message: '请输入模块名',
      validate: (v) => {
        if (!v || v.trim === '') {
          return '模块名不能为空'
        }
        else {
          return true
        }
      },
    },
    {
      type: 'input',
      name: 'cname',
      message: '请输入模块中文名称',
      default: '默认模块',
    },
    {
      type: 'confirm',
      name: 'isMock',
      message: '是否生成 Mock',
    },
    {
      type: 'confirm',
      name: 'isFilesystem',
      message: '是否为基于文件系统的路由页面',
      default: false,
    },
  ],
  actions: (data) => {
    const relativePath = path.relative('src/views', data.path)
    const actions = [
      {
        type: 'add',
        path: `${data.path}/{{snakeCase name}}/list.vue`,
        templateFile: 'plop-templates/module/list.hbs',
        data: {
          relativePath,
          componentName: `${relativePath} ${data.name} list`,
          moduleName: data.name,
        },
      },
      {
        type: 'add',
        path: `${data.path}/{{snakeCase name}}/detail.vue`,
        templateFile: 'plop-templates/module/detail.hbs',
        data: {
          componentName: `${relativePath} ${data.name} detail`,
        },
      },
      {
        type: 'add',
        path: `${data.path}/{{snakeCase name}}/components/DetailForm/index.vue`,
        templateFile: 'plop-templates/module/form.hbs',
        data: {
          relativePath,
          moduleName: data.name,
        },
      },
      {
        type: 'add',
        path: `${data.path}/{{snakeCase name}}/components/FormMode/index.vue`,
        templateFile: 'plop-templates/module/mode.hbs',
      },
    ]
    if (data.isMock) {
      const pathArr = path.relative('src/views', data.path).split('\\')
      actions.push({
        type: 'add',
        path: pathArr.join('/') === '' ? 'src/mock/{{snakeCase name}}.ts' : `src/mock/${pathArr.join('.')}.{{snakeCase name}}.ts`,
        templateFile: 'plop-templates/module/mock.hbs',
        data: {
          relativePath,
          moduleName: data.name,
        },
      })
    }
    return actions
  },
}
