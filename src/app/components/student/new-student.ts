class User {
    constructor(public name: string,
        public email: string,
        public password: string,
        public repeatpassword: string,
        public img: string,
        public gender: String
    ) { }
}
class Student{
    constructor(
       public parentId: number,
       public levelId: number
    ){}
}

export class NewStudent {
    user: User;
    student:Student;
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
         parentId?: number,
         levelId?: number) {
        this.user = new User(name,email,password,repeatpassword,img,gender);
        this.student= new Student(parentId,levelId);
        this.updating=updating;
     }
}