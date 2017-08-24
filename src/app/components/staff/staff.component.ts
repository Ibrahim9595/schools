import { Component, OnInit } from '@angular/core';
import {Staff} from './staff';
import {NewStaff} from './new-staff';
import {StaffService}from './staff.service';
import { defualt } from '../../baseURL';
import {pagination} from '../../pagination';
import { find, remove } from 'lodash';
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
  providers:[StaffService]
})

export class StaffComponent implements OnInit {
   staffs: Staff[];
   newStaff:NewStaff;
   defualt=defualt;
   ItemPerPage =5;
   PageNum=1;
   count: number;
   currentStaff: Staff;
   allgroups: any[];

  constructor(private service: StaffService) { }

  ngOnInit() {
    this.getAllStaff(this.ItemPerPage,0);
  }
  
  StaffFormOptions = { 
    user:{
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
    staff:{
        staffTypeId: {
        type: 'select',
        required: true,
        options: [
        
        ]
      },
    }
  };
  deletestaff(userID : number){
    let confirmation = confirm("delete this user ?");
    if(confirmation){
    this.service.deleteUser(userID).subscribe(({data})=>{
      remove(this.staffs, { userId: userID });
    });
    }
  }
  openform(staff?: Staff){
    
    this.service.getStafftypes().subscribe(({data})=>{
       this.StaffFormOptions.staff.staffTypeId.options=[];
      for(let op of data.staffTypes){
        this.StaffFormOptions.staff.staffTypeId.options.push({key:op.type, value:op.id});
      }
      if (staff) {
        this.newStaff =new NewStaff(true,staff.id,staff.name,staff.email,'','',staff.gender,staff.img,staff.staff_type.id);
        delete this.newStaff.user.password
        delete this.newStaff.user.repeatpassword;
       
      } else {
        this.newStaff=new NewStaff(false);
      }
    });
     
    
  }
  createStaff(staff: NewStaff) {
    this.service.createStaff(staff.user, staff.staff)
      .subscribe(({ data }: any) => {
        data.createStaff={
          ...data.createStaff,
           permissionGroups: [],
           timeTable: [],
           isupdating: false,
        }
        this.staffs.push(data.createStaff)
      });
  }
  goPage(n: number): void{
    this.PageNum=n;
    this.getAllStaff(this.ItemPerPage,(n-1)*this.ItemPerPage);
  }
  getAllStaff(limit,offset){
    
      this.service.init(limit,offset).subscribe(({data})=>{
        this.staffs=data.staffs;
        this.count=this.staffs[0].count ||1;
    });
  } 
  getAllGroups(staff) {
  
      this.service.getAllPermissionGroups().subscribe(({ data }) => {
      this.allgroups = data.permissionGroups;
      this.currentStaff = staff;
    });
    
  }
    updateStaff(staff: NewStaff, formModal: HTMLDivElement) {
    this.service.updateStaff(staff.id, staff.user, staff.staff)
      .subscribe(({ data }: any) => {
        let oldparent = find(this.staffs, { id: staff.id });
           for (let i in staff.user) {
          oldparent[i] = staff.user[i];
        }
        for (let i in staff.staff) {
          oldparent[i] = staff.staff[i];
        }
          console.log(staff);
          console.log(oldparent);
      });
  }
  addusertoPermissionGroup(Gid){
 
    console.log(this.currentStaff.userId);
    this.service.addUserToPermissionGroup(Gid,this.currentStaff.userId).subscribe(({data})=>{
      this.currentStaff.permissionGroups.push(find(this.allgroups,{id:parseInt(Gid)}));
    })
  }

  deleteuserFromPermissionGroup(pid){
    let confirmation = confirm("rly after all of that time");
    if (confirmation) {
    this.service.deleteUserFromPermissionGroup(pid,this.currentStaff.userId).subscribe(({ data })=>{
          remove(this.currentStaff.permissionGroups, { id: pid });
    })
    }
  }
}
