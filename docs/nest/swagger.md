# NestJS Swagger 集成指南

## 1. 安装依赖

```bash
npm install @nestjs/swagger swagger-ui-express
```

## 2. 配置 main.ts

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API 接口文档 (JSON格式: <a href="/api/docs-json">/api/docs-json</a>)')
    .setVersion('1.0')
    // .addBearerAuth() // 启用 Bearer token 认证
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
bootstrap();
```

完成上述配置后，可以通过访问 `http://localhost:3000/api/docs` 查看 Swagger API 文档界面。

## 3. 常用装饰器

| 装饰器 | 用途 |
|--------|------|
| `@ApiTags()` | 为控制器添加标签分组 |
| `@ApiOperation()` | 描述接口的作用 |
| `@ApiProperty()` | 描述 DTO 中的属性 |
| `@ApiResponse()` | 描述响应结构 |
| `@ApiBody()` | 描述请求参数结构 |
| `@ApiBearerAuth()` | 添加 Bearer token 认证 |

## 4. 使用示例

### DTO 定义

```ts
// hello.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class HelloRequestDto {
  @ApiProperty({ 
    description: '名称', 
    example: 'World',
    required: true 
  })
  name: string;
}

export class HelloResponseDto {
  @ApiProperty({
    description: 'Hello消息',
    example: 'Hello World!'
  })
  message: string;
}
```

### Controller 实现

```ts
// hello.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { HelloService } from './hello.service';
import { HelloRequestDto, HelloResponseDto } from './hello.dto';

@ApiTags('Hello')
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Post()
  @ApiOperation({ summary: '提交问候语' })
  @ApiResponse({
    status: 200,
    description: '提交问候语成功',
    type: HelloResponseDto,
  })
  @ApiBody({
    description: '提交问候语请求体',
    type: HelloRequestDto,
  })
  async postHello(@Body() body: HelloRequestDto): Promise<HelloResponseDto> {
    return await this.helloService.getHello(body.name);
  }
}
```
