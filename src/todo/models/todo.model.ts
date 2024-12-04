export class Todo {
  // Using string type for Id will make us able to change event Database
  // without making any changes on service layer
  constructor(
    public id: string,
    public title: string,
    public completed: boolean,
    public userId: string,
  ) {}
}
