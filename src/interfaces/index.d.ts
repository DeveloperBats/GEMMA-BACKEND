export interface IUser {
/*     id: number */
    user_name: string
    user_lastname: string
    user_nickname: string
    user_password: string
    user_email: string
    user_profile_image: string | null
    user_confirm_password: string
    profiles_id: int
}
export interface IRegisterUser extends Pick<IUser, "user_nickname" | "user_password"> {}

//Constructor

//Logger
interface ConsoleContructor {
    #moduleName: string
}
