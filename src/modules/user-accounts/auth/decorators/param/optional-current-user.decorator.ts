import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../../application/dto/user-context.dto';

export const OptionalCurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserContextDto | null => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: UserContextDto }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return user;
  },
);
