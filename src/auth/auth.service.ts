import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  @Inject(UserService)
  private userService: UserService;

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return { userId: user.userId, username: user.username };
  }
}
