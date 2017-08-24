import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';
import { student } from './student';
import { NewStudent } from './new-student';
import { defualt } from '../../baseURL';
import { pagination } from '../../pagination';
import { find, remove } from 'lodash';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [StudentService]
})
export class StudentComponent implements OnInit {
  students: student[];
  ItemPerPage = 5;
  newStudent: NewStudent;
  count: number;
  PageNum = 1;
  default = defualt;
  allLevels: any[];
  currentStudent: student;
  allgroups: any[];
  allParent:any[];

  StudentFormOptions = {
    user: {
      name: {
        type: 'text',
        required: true,
        minLength: 5,
        placeholder: ' Full Name'
      },
      email: {
        type: 'email',
        required: true,
        expresssion: "[a-zA-Z0-9\-_\.]+@[a-zA-Z0-9\-_\.]+\.com",
        unique: true,
        error: 'Email Is Not Valid',
        placeholder: 'E-mail'
      },
      password: {
        type: 'password',
        required: true,
        minLength: 6,
        error: 'password must be 6 charachters or more ',
        placeholder: 'Password'
      },
      repeatpassword: {
        type: 'password',
        required: false,
        match: 'user.password',
        error: 'password not matched ',
        placeholder: 'Repeat Password'
      },
      img: {
        type: 'file',
        endPointOptions: {
          url: 'http://10.1.1.28:7070/fileupload',
          key: 'path'
        }
      },
      gender: {
        type: 'select',
        required: true,

        options: [
          {
            key: 'male',
            value: 'male',
          },
          {
            key: 'female',
            value: 'female',
          }
        ]
      },
    },
    student: {
      levelId: {
        type: 'select',
        required: true,
        options: [
        ]
      },
    }
  };
  constructor(private service: StudentService) {

  }
  setCurrentStudent(student){
    this.currentStudent=student;
  }

  ngOnInit() {
    this.getAllstudents(this.ItemPerPage, 0);
  }

  openform(student: student): void {
    this.service.getAllLevels().subscribe(({ data }) => {
      this.allLevels = data.levels;
      this.StudentFormOptions.student.levelId.options = [];
      for (let op of data.levels) {
        this.StudentFormOptions.student.levelId.options.push({ key: op.name, value: op.id });
      }
      if (student) {
        console.log(student);
        this.newStudent = new NewStudent(true, student.id, student.name, student.email, '', '', student.gender, student.img, student.parent.id, student.level.id);
        delete this.newStudent.user.password
        delete this.newStudent.user.repeatpassword;
      } else {
        this.newStudent = new NewStudent(false);
      }
    });

  }


  getAllstudents(limit?, offset?): void {
    this.service.init(limit, offset).subscribe(({ data }) => {
      this.students = data.students;
      this.count = data.students[0].count || 0;

    });
  }
  goPage(n: number): void {
    this.PageNum = n;
    this.getAllstudents(this.ItemPerPage, (n - 1) * this.ItemPerPage);
  }
  createStudent(student: NewStudent): void {
    console.log(student);
    delete student.user.repeatpassword;
    student.student.parentId=null;
    this.service.createStudent(student.user, student.student).subscribe(({ data }: any) => {
      data.createStudent = {
        ...data.createStudent,
        permissionGroups: [],
        parent: {},

      }

      this.students.push(data.createStudent);
      data.createStudent.parent.id=1;
      console.log(data.createStudent.parent.id);
    });
  }
  updateStudent(student: NewStudent) {
    this.service.updateStudent(student.id, student.user, student.student).subscribe(({ data }) => {
      let oldStudent = find(this.students, { id: student.id });
      let temp = find(this.allLevels, { id: student.student.levelId });
      oldStudent.level = temp;
      console.log(temp);

      for (let i in student.user) {
        oldStudent[i] = student.user[i];
      }
      for (let i in student.student) {
        oldStudent[i] = student.student[i];
      }

    });

  }
  deleteStudent(userid: number){
    let confirmation=confirm("delete This student ?");
    if(confirmation){
    this.service.deleteUser(userid).subscribe(({data})=>{
      remove(this.students, { userId: userid });
    });
    }
  }
  getAllGroups(student){
     this.service.getAllPermissionGroups().subscribe(({ data }) => {
      this.allgroups = data.permissionGroups;
      this.currentStudent = student;
    });

  }
   addusertoPermissionGroup(Gid){
 
    console.log(this.currentStudent.userId);
    this.service.addUserToPermissionGroup(Gid,this.currentStudent.userId).subscribe(({data})=>{
      this.currentStudent.permissionGroups.push(find(this.allgroups,{id:parseInt(Gid)}));
    })
  }

  deleteuserFromPermissionGroup(pid){
    let confirmation = confirm("rly after all of that time");
    if (confirmation) {
    this.service.deleteUserFromPermissionGroup(pid,this.currentStudent.userId).subscribe(({ data })=>{
          remove(this.currentStudent.permissionGroups, { id: pid });
    })
    }
  }
 studentParent(){
    
    this.service.getAllParents().subscribe(({data})=>{
          this.allParent=data.parents;
    });

 }
  changeParent(parent){
    console.log(parent.id);
    console.log(this.currentStudent.parent.id);
   let st= new NewStudent(true, this.currentStudent.id, this.currentStudent.name, this.currentStudent.email, '', '', this.currentStudent.gender, this.currentStudent.img, parent.id, this.currentStudent.level.id);
    delete st.user.password
    delete st.user.repeatpassword;
    this.service.updateStudent(st.id, st.user,st.student).subscribe(({ data }) => {
        this.currentStudent.parent=parent;
    });
  }
}
