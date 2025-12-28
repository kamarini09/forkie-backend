import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { clerkClient } from '@clerk/express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private isPlaceholderEmail(email: string | null): boolean {
    return (
      !!email && email.startsWith('unknown+') && email.endsWith('@example.com')
    );
  }

  async findOrCreateByClerkId(clerkUserId: string): Promise<User> {
    let user = await this.usersRepo.findOne({ where: { clerkUserId } });

    // Always fetch from Clerk so we can fill missing fields
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const primaryEmail =
      clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId,
      )?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress ??
      null;

    const firstName = clerkUser.firstName ?? null;
    const lastName = clerkUser.lastName ?? null;

    if (!user) {
      try {
        user = this.usersRepo.create({
          clerkUserId,
          email: primaryEmail,
          firstName,
          lastName,
        });
        return await this.usersRepo.save(user);
      } catch (err: any) {
        // If another request created the user first (unique constraint), refetch.
        const existing = await this.usersRepo.findOne({
          where: { clerkUserId },
        });
        if (existing) return existing;
        throw err;
      }
    }

    // Update missing fields OR replace placeholder email with real email
    const needsUpdate =
      ((user.email == null || this.isPlaceholderEmail(user.email)) &&
        primaryEmail != null) ||
      (user.firstName == null && firstName != null) ||
      (user.lastName == null && lastName != null);

    if (needsUpdate) {
      if (
        primaryEmail &&
        (user.email == null || this.isPlaceholderEmail(user.email))
      ) {
        user.email = primaryEmail;
      }
      user.firstName = user.firstName ?? firstName;
      user.lastName = user.lastName ?? lastName;

      user = await this.usersRepo.save(user);
    }

    return user;
  }
}
