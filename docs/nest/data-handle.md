# NestJS 全局数据返回拦截与异常处理

在开发 NestJS 应用时，我们通常需要统一接口的返回格式和异常处理机制。这边是用
NestJS 的拦截器（Interceptor）和异常过滤器（Exception Filter）来实现这一目标。

## 1. 统一响应格式

首先，我们需要定义一个统一的响应格式。通常包含以下字段：

- code：状态码（成功为 0）
- data：返回的数据
- message：响应信息

### 响应拦截器的实现

```typescript
// response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const SUCCESS_CODE = 0;

export interface Response<T> {
  code: number;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: SUCCESS_CODE,
        data,
        message: '成功',
      }))
    );
  }
}
```

这个拦截器会将所有成功的响应转换为统一的格式，包含状态码、数据和消息。

### 在 controller 的使用

```typescript
@Get()
@Post()
async getHello() {
  // 直接返回数据，拦截器会自动包装为统一格式
  return await this.helloWorldService.getHello();
  // 如果需要抛出异常，可以使用：
  // throw new HttpException('自定义错误消息', HttpStatus.BAD_REQUEST);
}
```

## 2. 统一异常处理

为了处理应用中可能出现的异常，我们需要实现一个全局异常过滤器：

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.message : '服务器内部错误';

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : '未知错误'
    );

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      data: null,
    });
  }
}
```

这个异常过滤器可以：

1. 捕获所有异常（通过 `@Catch()`）
2. 区分 HTTP 异常和其他异常
3. 记录错误日志
4. 返回统一的错误响应格式

## 3. 全局注册

最后，我们需要在应用启动时全局注册这些处理器：

```typescript
// main.ts
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 全局注册异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
}
```

## 效果展示

### 成功响应

当接口正常返回数据时，响应格式如下：

```json
{
  "code": 0,
  "data": { ... },
  "message": "成功"
}
```

### 错误响应

当发生异常时，响应格式如下：

```json
{
  "code": 500,
  "timestamp": "2024-03-21T12:00:00.000Z",
  "path": "/api/example",
  "message": "服务器内部错误",
  "data": null
}
```

## 总结

通过实现响应拦截器和异常过滤器，我们可以：

1. 统一所有接口的返回格式
2. 集中处理异常
3. 规范错误日志记录
4. 提供更好的接口使用体验

这种统一的数据处理方式不仅可以提高代码的可维护性，还能为前端提供一致的接口规范。
