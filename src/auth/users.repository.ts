import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './JwtPayload.interface';
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }
  async registerUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;
    const user = this.create({ username, password });
    user.password = await bcrypt.hash(password, 10);
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(`Username already taken`);
      } else {
        throw new InternalServerErrorException();
      }
    }
    if (!user) {
      throw new Error(`Couldn't create user`);
    }
  }
  async loginUser(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentials;
    const user = await this.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User not registered`);
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw new UnauthorizedException(`Credentials are not correct`);
    }
    const payload: JwtPayloadInterface = { username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }
}
