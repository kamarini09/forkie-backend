import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findOrCreateByClerkId(params: {
    clerkUserId: string;
    email?: string | null;
    username?: string | null;
  }) {
    const { clerkUserId, email = null, username = null } = params;

    let user = await this.usersRepo.findOne({ where: { clerkUserId } });
    if (user) return user;

    user = this.usersRepo.create({
      clerkUserId,
      email: email ?? `unknown+${clerkUserId}@example.com`,
      username: username ?? clerkUserId, // temporary fallback
      passwordHash: null,
    });

    return this.usersRepo.save(user);
  }
}
