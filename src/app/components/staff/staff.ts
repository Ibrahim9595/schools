export interface Staff{
    id: number,
    name: string,
    email: string,
    userId: number,
    userTypeId: number,
    img: string,
    gender: string,
    job: string,
    password:string,
    repeatpassword:string,
    staff_type:any,
    count: number,
    permissionGroups: any[],
    timeTable: any[]
    isupdating: boolean;


}