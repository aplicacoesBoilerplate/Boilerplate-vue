import type { IUser } from "@/classes/models/ModelUser";

export class ClassUsers {
  private user: IUser

  constructor(user?: IUser) {
    this.user = user || {} as IUser;
  }

  get getUser(): IUser {
    return this.user
  }

}
