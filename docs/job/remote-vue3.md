# 使用 vue3-sfc-loader 动态渲染远程 Vue 组件

## 前言

在之前的项目中，由于产品和设计团队频繁地向自动化配置的马甲包中添加组件，导致项目变得臃肿，运行速度逐渐变慢。若继续这样下去，项目将面临崩溃的风险。此外，产品和设计团队添加的多为简单的单页面内容，扩展和复用变得困难。因此，我们开始进行调研。

当前项目需要考虑以下几点及其解决方案：

- **动态加载资源**：使用 `vue3-sfc-loader` 插件，能够根据需要动态加载所需的远程组件，而不影响项目的整体运行和调试。
- **快速承接之前的组件**：通过 `loadModule` 方法，可以快速加载之前由产品和设计团队生成的组件，确保在配置项目时的无缝衔接。
- **简化新组件的添加**：继续使用单个代码文件上传的形式，结合 `vue3-sfc-loader` 的动态加载特性，减少产品团队的操作难度。
- **多页面跳转的支持**：结合动态加载的组件，编写一点样式，可以实现类似多页面跳转的动作，增强配置项目的交互性。封装成一个全局组件，产品团队配合 ai 使用起来也比较简单。

基于以上考虑，我们决定采用 Vue 3 + Vite 创建一个新项目，而不再优化之前的 Vue 2 历史项目。后续使用的多为产品和设计团队生成的简单组件，因此不必担心 2/3 的兼容性问题。为了方便本地调试和加载远程资源，我们将使用 `vue3-sfc-loader` 插件来加载远程 Vue 文件。

## vue3-sfc-loader

[vue3-sfc-loader](https://github.com/FranckFreiburger/vue3-sfc-loader) 是一个用于在 Vue 3 项目中动态加载远程单文件组件（SFC）的插件。它允许我们在不重新构建项目的情况下，动态地从远程服务器加载和渲染 Vue 组件，特别适合需要频繁更新组件的项目。

### 安装

首先，我们需要安装 `vue3-sfc-loader`。可以通过 pnpm 或者 CDN 引入进行安装：

```bash
# 使用 pnpm 安装
pnpm install vue3-sfc-loader

# 使用 CDN 引入
<script src="https://cdn.jsdelivr.net/npm/vue3-sfc-loader/dist/vue3-sfc-loader.js"></script>
```

### 使用

```js
// npm 安装方式
import { loadModule } from 'vue3-sfc-loader';

// CDN 引入方式
const { loadModule } = window['vue3-sfc-loader'];
```

以下是一个示例文件，完整代码请查看[示例代码](https://github.com/lijiayuan365/vue-remote-component)：

```html
<template>
  <div class="next-page-wrapper">
    <!-- ... -->
    <component :is="remoteComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import * as Vue from 'vue';

const { loadModule } = window['vue3-sfc-loader'];

defineOptions({
  name: 'NextPage',
});

const remoteComponent = shallowRef();

const getComponent = async (componentUrl: string) => {
  try {
    const component = await loadModule(componentUrl, {
      moduleCache: {
        vue: Vue,
      },
      async getFile(url: string) {
        const res = await fetch(url);
        const code = await res.text();
        return code;
      },
      addStyle(textContent: string) {
        const style = Object.assign(document.createElement('style'), {
          textContent,
        });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
      },
    });
    if (!component) {
      throw new Error('组件加载失败');
    }
    return component;
  } catch (error) {
    console.error('远程组件加载失败:', error);
  }
};

onMounted(async () => {
  remoteComponent.value = await getComponent('https://web.my91app.com/web/remote-components/Image.vue');
});
</script>
```

更多其他配置可以参考[官方文档](https://github.com/FranckFreiburger/vue3-sfc-loader/blob/main/docs/api/README.md)。在我的场景中，使用的功能相对简单，因此只涉及这些内容。

### 注意事项

如果在远程组件中需要导入第三方依赖，可以通过 `moduleCache` 进行配置，示例代码中已有说明。

如果需要在远程组件中使用自己写的其他组件，可以继续使用 `vue3-sfc-loader` 引入远程，或者简单点，将这个组件注册为宿主项目的全局组件，这样在远程 vue 文件里面就可以直接使用。


后续遇到其他坑点再回来记录一下...