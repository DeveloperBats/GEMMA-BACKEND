

export const login_query = (user:string, email:string) => {
   return `SELECT user_password FROM users WHERE user_name = "${user}" or user_email = "${email}";`
}

