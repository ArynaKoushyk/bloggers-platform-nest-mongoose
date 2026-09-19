import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../../application/dto/user-context.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserContextDto => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: UserContextDto }>();

    const user = request.user;

    if (!user) {
      throw new Error('there is no user in the request object!');
    }

    return user;
  },
);
