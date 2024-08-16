import { faker } from '@faker-js/faker';
export default class Fake {
    static generateUser() {
        return {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            phone: faker.phone.phoneNumber(),
            photo: faker.image.avatar(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    }
}
