import { Permission } from './permission'

export interface PermissionGroup {
    id: number
    groupName: string
    description: string
    permissions: Permission[]
    belongsTo: boolean
}