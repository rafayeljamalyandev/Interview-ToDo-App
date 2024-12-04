export class User {
  // Using string type for Id will make us able to change event Database
  // without making any changes on service layer
  constructor(
    public id: string,
    public email: string,
    public password: string,
  ) {}
}
