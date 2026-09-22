import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashAdapter {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
  }

  verifyPassword(args: { password: string; hash: string }): Promise<boolean> {
    return bcrypt.compare(args.password, args.hash);
  }
}
