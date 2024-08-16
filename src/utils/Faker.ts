import { faker } from "@faker-js/faker";


export default class Fake {

    static generateUser() {
        return {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            phone: faker.phone.number(),
            photo: faker.image.avatar(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            password: faker.internet.password(),
        };
    }
    static generatePost() {
        return {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            photo: faker.image.avatar(),
            description: faker.lorem.sentence(),
            category: faker.lorem.word(),
            date: faker.date.past(),
            size: faker.helpers.arrayElement(['S', 'M', 'L'])
        };
    }

}