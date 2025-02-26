# 运行时解析远程 Vue 组件

## 前言

在开发自动化创作项目管理后台时，需要在运行时动态获取远程 Vue 文件的配置，因此无法使用 vue-docgen-api 等静态分析工具。这里讲一下如何借助 `vue/compiler-sfc` 和 `@babel/parser` 来实现这一需求。

## 工具简介

### [Vue Compiler SFC](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)
Vue.js 官方提供的单文件组件编译器，能够将 `.vue` 文件解析成包含模板、脚本和样式等部分的 JavaScript 对象。在运行时解析场景中，我们主要使用它来解析 SFC 的脚本部分。

### [@babel/parser](https://babeljs.io/docs/babel-parser)
Babel 的 JavaScript 解析器，能够将 JavaScript 代码解析成抽象语法树（AST）。它支持最新的 ECMAScript 特性以及 Flow、TypeScript 等类型注解。在我们的场景中，它主要用于解析从 `vue/compiler-sfc` 提取出的脚本内容，以便遍历 AST 来获取组件的 props 定义。

这两个工具的组合使用，让我们能够在运行时动态分析远程 Vue 组件的结构，而不需要在构建时进行静态分析。这对于需要动态加载和解析远程组件的场景特别有用。

## 实现步骤

### 1. 获取 Vue 文件内容
使用 `fetch` 获取远程 Vue 文件内容：

```js
/**
 * 下载 Vue 文件
 * @param url Vue 文件的远程地址
 * @returns 文件内容
 */
const fetchVueFile = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.text();
};
```

### 2. 解析 Vue 文件
使用 `vue/compiler-sfc` 解析 Vue 文件，并提取脚本内容：

```js
import { parse as vueParse, compileScript } from 'vue/compiler-sfc';

// 解析 Vue 文件
const { descriptor } = vueParse(vueFileContent);

// 提取 script 内容
const { content: scriptContent } = compileScript(descriptor, {
  isProd: false,
  isSSR: false,
  isSetup: true,
  isLegacy: false,
  isModule: true,
});
```

此时，我们得到了一份统一格式的代码文本。

### 3. 解析脚本为 AST
使用 `@babel/parser` 将脚本内容解析为 AST，并提取 props 信息：

```js
import { parse as babelParse } from '@babel/parser';

// 解析 script 为 AST
const ast = babelParse(scriptContent, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
});

const exportDefaultNode = ast.program.body.find(
  (node) =>
    node.type === 'ExportDefaultDeclaration' ||
    node.type === 'ExpressionStatement'
);

if (!exportDefaultNode) {
  throw new Error('No export default found in script');
}

const propsNodes = findProps(exportDefaultNode);
if (!propsNodes) {
  throw new Error('No props found in export default');
}

// 获取所有注释
const comments = ast.comments;

// 提取 props 及其注释
const props = propsNodes.map((propNode) => {
  const name = propNode.key.name;
  const properties = getPropProperties(propNode);
  const comment = getPropComment(propNode, comments);
  return { name, comment, ...properties };
});
```

### 4. 工具方法
以下是用于查找 props、获取注释和属性的工具方法：

```js
/**
 * 查找 props
 * @param node AST 节点
 * @returns props 节点
 */
const findProps = (node) => {
  if (node.type !== 'ExportDefaultDeclaration') return null;

  if (node.declaration.type === 'CallExpression') {
    const argsNode = [];
    node.declaration.arguments.forEach((arg) => {
      if (arg.type === 'ObjectExpression') {
        argsNode.push(...arg.properties);
      }
    });
    const propNode = argsNode.find((arg) => arg?.key?.name === 'props');
    return propNode?.value.properties;
  }

  if (node.declaration.type === 'ObjectExpression') {
    const propsProperty = node.declaration.properties.find(
      (prop) => prop.key.name === 'props'
    );
    if (propsProperty && propsProperty.value.type === 'ObjectExpression') {
      return propsProperty.value.properties;
    }
  }
  return null;
};

/**
 * 获取 prop 的注释
 * @param propNode prop 节点
 * @param comments 所有注释
 * @returns 注释内容
 */
const getPropComment = (propNode, comments) => {
  const propStart = propNode.start;
  const precedingComments = comments.filter(
    (comment) => comment.end < propStart
  );
  if (precedingComments.length > 0) {
    return precedingComments[precedingComments.length - 1].value
      .replace(/\*/g, '')
      .replace(/\n/g, '')
      .trim();
  }
  return null;
};

/**
 * 获取 prop 的属性
 * @param propNode prop 节点
 * @returns prop 属性
 */
const getPropProperties = (propNode) => {
  const result = {};
  const properties = propNode.value.properties;

  properties.forEach((property) => {
    if (property.value.type === 'ArrayExpression') {
      const value = property.value.elements.map((element) => element.value);
      result[property.key.name] = value;
    } else {
      result[property.key.name] = property.value.value || property.value.name;
    }
  });
  return result;
};
```

## 总结

通过 `vue/compiler-sfc` 和 `@babel/parser` 的组合，我们能够在运行时动态解析远程 Vue 组件的 props 配置。这种方法特别适用于需要动态加载和解析远程组件的场景。如果不需要获取注释内容，直接使用 `vue/compiler-sfc` 配合 new Function eval 即可；如果不需要在运行时解析，使用 `vue-docgen-api` 会更加方便。
