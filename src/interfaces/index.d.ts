export interface IUser {
    id: number
    name: string
    lastname: string
    nickname: string
    password: string
    email: string
    profileImage: string
    confirmPassword: string
}
export interface IRegisterUser extends Pick<IUser, "user" | "pass"> {}

//Constructor

//Logger
interface ConsoleContructor {
    #moduleName: string
}
