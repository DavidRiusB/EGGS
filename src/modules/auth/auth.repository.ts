import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private readonly userService: UserService,
  ) {}

  async creatCredential(email: string, password: string): Promise<Credential> {
    try {
      //const hashedPassword = await hashPassword(password)
      const newCredential = new Credential();
      newCredential.email = email;
      newCredential.password = password; // for now since we dont have bycrip instaled
      this.credentialRepository.create(newCredential);
      return newCredential;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async singIn() {}
  async updatePassword() {}
}
