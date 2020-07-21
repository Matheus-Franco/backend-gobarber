import AppError from '@shared/errors/AppError';

import ListProvidersService from './ListProvidersService';
import FakeUsersRepositoy from '@modules/users/repositories/fakes/FakeUsersRepository';

let listProviders: ListProvidersService;
let fakeUsersRepository: FakeUsersRepositoy;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepositoy();
        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'doe@gmail.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'John Two',
            email: 'two@gmail.com',
            password: '123456',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'John Three',
            email: 'three@gmail.com',
            password: '123456',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id
        });

        expect(providers).toEqual([
            user1,
            user2
        ]);
    });
});
