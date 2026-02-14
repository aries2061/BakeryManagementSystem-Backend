import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, User, UserRole } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(googleUser: any): Promise<User> {
        const user = await this.usersService.findByEmail(googleUser.email);
        if (user) {
            return user;
        }
        // Register new user (Defaulting to STAFF for now, should be handled carefully in prod)
        const newUser: User = {
            email: googleUser.email,
            name: `${googleUser.firstName} ${googleUser.lastName}`,
            role: UserRole.STAFF,
            provider: 'google',
        };
        return this.usersService.create(newUser);
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id, role: user.role, branch_id: user.branch_id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
