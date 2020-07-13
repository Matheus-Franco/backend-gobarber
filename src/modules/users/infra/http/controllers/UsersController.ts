import { Response, Request } from 'express'
import { container } from 'tsyringe'
import { hash } from 'bcryptjs';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService)

        const hashedPassword = await hash(password, 8);

        const user = await createUser.execute({
            name,
            email,
            password: hashedPassword,
        });

        delete user.password;

        return response.json(user);
    }
}
