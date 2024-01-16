import { Role, RoleSchema } from "./schemas/role.schema";
import { User, UserSchema } from "./schemas/user.schema";


export const Schemas = [
    { name: User.name, schema: UserSchema },
    { name: Role.name, schema: RoleSchema }
]