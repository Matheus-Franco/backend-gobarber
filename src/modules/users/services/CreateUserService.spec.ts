import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
    });

    it('shoud be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('shoud not to be able to create a new user with same e-mail from another', async () => {
        await createUser.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        });

        await expect(createUser.execute({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError)
    });
});
