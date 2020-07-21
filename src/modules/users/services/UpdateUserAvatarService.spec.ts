import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    it('shoud be able to create a new user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.example.png',
        });

        expect(user.avatar).toBe('avatar.example.png');
    });

    it('shoud not be able to update avatar from non existing user', async () => {
        await expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.example.png',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('shoud delete old avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.example.png',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar-2.example.png',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.example.png')
        expect(user.avatar).toBe('avatar-2.example.png');
    });

});
