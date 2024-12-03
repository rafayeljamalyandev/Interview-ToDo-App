export class UserIdIsRequiredException extends Error {
    constructor() {
        super(`Userid is Required`);
        this.name = 'UserIdIsRequiredException';
    }
}