import { Permission } from './permission';
import { User } from './user';

export interface PermissionGroup {
    id: number
    groupName: string
    description: string
    count: number
    permissions: Permission[]
    users: User[]
    belongsTo: boolean
}