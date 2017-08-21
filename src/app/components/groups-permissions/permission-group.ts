import { Permission } from './permission';
import { User } from './user';

export interface PermissionGroup {
    id: number
    groupName: string
    description: string
    permissions: Permission[]
    users: User[]
    belongsTo: boolean
}