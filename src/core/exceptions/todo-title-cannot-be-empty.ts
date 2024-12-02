export class TodoTitleCannotBeEmpty extends Error {
    constructor() {
        super(`Todo title cannot be empty`);
        this.name = 'TodoTitleCannotBeEmpty';
    }
}