class User {
    constructor(public name: string,
        public email: string,
        public password: string,
        public repeatpassword: string,
        public img: string,
        public gender: String
    ) { }
}
class Staff{
     constructor(
        public job: String,
        public staffTypeId: number,
    ) { }
}

export class NewStaff {
    user: User;
    staff:Staff;
    public updating: boolean;
    constructor(
        updating: boolean,
         public id?: number, 
         name?: string, 
         email?: string, 
         password ?: string,
         repeatpassword ?: string,
         gender ?: string,
         img?: string,
         staffTypeId?: number) {
        this.user = new User(name,email,password,repeatpassword,img,gender);
        this.staff= new Staff("staff",staffTypeId);
        this.updating=updating;
     }
}
