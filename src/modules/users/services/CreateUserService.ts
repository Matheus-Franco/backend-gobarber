import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe'

import User from '../infra/typeorm/entities/User';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) { }

    public async execute({ name, email, password }: IRequest): Promise<User> {

        const checkIfUserExists = await this.usersRepository.findByEmail(email);

        if (checkIfUserExists) {
            throw new AppError('Email address already used.');
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password,
        });

        return user;
    }
}

export default CreateUserService;
