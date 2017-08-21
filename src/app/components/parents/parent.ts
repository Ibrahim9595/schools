export interface Parent {
    id: number,
    name: string,
    email: string,
    userId: number,
    userTypeId: number,
    job: string,
    children: any[],
    permissionGroup: any[],
    permissions: any[]
}
