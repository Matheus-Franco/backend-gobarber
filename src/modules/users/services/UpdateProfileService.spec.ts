import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('shoud be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "John Doe Updated",
            email: "doeupdated@gmail.com",
        });

        expect(updatedUser.name).toBe('John Doe Updated');
        expect(updatedUser.email).toBe('doeupdated@gmail.com');
    });

    it('shoud not be able to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })
        const user = await fakeUsersRepository.create({
            name: 'Test Doe',
            email: 'test@gmail.com',
            password: '123456',
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Doe Updated",
            email: "doe@gmail.com",
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shoud be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "John Doe Updated",
            email: "doeupdated@gmail.com",
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('shoud not be able to update the password withoud old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Doe Updated",
            email: "doeupdated@gmail.com",
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        await expect(updateProfile.execute({
            user_id: user.id,
            name: "John Doe Updated",
            email: "doeupdated@gmail.com",
            old_password: "wrond-old-password",
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});
