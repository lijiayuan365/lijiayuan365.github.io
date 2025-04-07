# 项目创建
其实来来去去都是几条命令的事情，这边做记录备忘一下

1. 全局安装 NestJS

为什么不使用 npx，要全局安装到本地呢？因为我们不止创建项目，还要用到他里面的其他命令去添加新模块
```bash
npm install -g @nestjs/cli 
``` 

2. 创建新项目
```bash
nest new your-porject-name
```

3. 添加新模块

一般一个新模板包含以下几个东西，
- controller： 负责处理传入的请求并将响应发送回客户端 
- providers： Nest 中的核心概念。许多基本的 Nest 类，例如服务、存储库、工厂和助手，都可以被视为提供者。提供程序背后的关键思想是它可以作为依赖注入，从而允许对象彼此形成各种关系。"接线" 这些对象的职责主要由 Nest 运行时系统处理。我们简单使用的话一般就只用个 service 就行
- module： 一个用 @Module() 装饰器注释的类。此装饰器提供 Nest 用于有效组织和管理应用结构的元数据。

对于这些东西我们初始化的时候直接用命令创建即可。
```bash
nest g controller module-name
nest g service module-name
nest g module module-name
```