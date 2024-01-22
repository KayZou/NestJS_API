import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  createUser(authCredentials: AuthCredentialsDto) {
    return this.usersRepository.registerUser(authCredentials);
  }
  loginUser(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersRepository.loginUser(authCredentials);
  }
}
