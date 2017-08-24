import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ParentsService } from './parents.service';
import { Parent } from './parent';
import { NewParent } from './new-parent';
import { find, remove } from 'lodash';
import { defualt } from '../../baseURL';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css'],
  providers: [ParentsService]
})
export class ParentsComponent implements OnInit {
  defualt=defualt;
  parents: Parent[];
  parent: NewParent;
  childrens: any[];
  groups: any[];
  allgroups: any[];
   ItemPerPage =5;
   PageNum=1;
   count: number;
  currentParent: Parent;
  @Output('select') select = new EventEmitter();
  parentFormOptions = {
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
      required: true,
      match: 'password',
      error: 'password not matched ',
      placeholder: 'Password'
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
    img: {
      type: 'file',
      endPointOptions: {
        url: 'http://10.1.1.28:7070/fileupload',
        key: 'path'
      }
    },
    parent: {
      job: {
        type: 'text',
        required: true,
        placeholder: 'Jop'
      }
    }
  };

  constructor(private service: ParentsService) { }

  ngOnInit() {
   this.getAllParents(5,0);
  }
  getAllParents(limit,offset){
     this.service.init(limit,offset).subscribe(({ data }) => {
      this.parents = data.parents;
      console.log(data);
      this.count=this.parents[0].count || 1;
      console.log( this.count);

    });

  }
  goPage(n: number): void{
      this.PageNum=n;
      this.getAllParents(this.ItemPerPage,(n-1)*this.ItemPerPage);
    }
  openForm(parent?: Parent) {
    if (parent) {
      this.parent = new NewParent(true, parent.id, parent.name, parent.email, '', '', parent.gender, '', parent.job);
      delete this.parent.password
      delete this.parent.repeatpassword;
    } else {
      this.parent = new NewParent(false);
    }
  }

  createParent(parent: NewParent) {
    let user = {
      name: parent.name,
      email: parent.email,
      password: parent.password,
      img: parent.img,
      gender: parent.gender
    }; console.log(parent.parent);
    this.service.createParent(user, parent.parent)
      .subscribe(({ data }: any) => {
          data.createParent={
          ...data.createParent,
           children: [],
           permissionGroups: [],
           permissions: []
        }
        this.parents.push(data.createParent)
      });
  }

  updateParent(parent: NewParent, formModal: HTMLDivElement) {
    let user = {
      name: parent.name,
      email: parent.email,
      img: parent.img,
      gender: parent.gender
    };

    this.service.updateParent(parent.id, user, parent.parent)
      .subscribe(({ data }: any) => {
        let oldparent = find(this.parents, { id: parent.id });
        for (let i in user) {
          oldparent[i] = parent[i];
        }
        for (let i in parent.parent) {
          oldparent[i] = parent.parent[i];
        }
     

      });
  }

  deleteParent(userId) {
    let confirmation = confirm("rly after all of that time");
    if (confirmation) {
      this.service.deleteUser(userId).subscribe(({ data }) => {
        remove(this.parents, { userId: userId });
      });
    }

  }

  getParentchildrens(parent) {
    console.log(parent);
    this.childrens = parent.children;
     console.log(this.childrens);
  }
  getAllGroups(parent) {
    console.log(this.currentParent);
      this.service.getAllPermissionGroups().subscribe(({ data }) => {
      this.allgroups = data.permissionGroups;
      this.currentParent = parent;
    });
    
  }
  
  addusertoPermissionGroup(Gid){
    console.log(Gid);
    console.log(this.currentParent.userId);
    this.service.addUserToPermissionGroup(Gid,this.currentParent.userId).subscribe(({data})=>{
      this.currentParent.permissionGroups.push(find(this.allgroups,{id:parseInt(Gid)}));
    })
  }

  deleteuserFromPermissionGroup(pid){
    let confirmation = confirm("rly after all of that time");
    if (confirmation) {
    this.service.deleteUserFromPermissionGroup(pid,this.currentParent.userId).subscribe(({ data })=>{
          remove(this.currentParent.permissionGroups, { id: pid });
    })
    }
  }

  selected(id){
    
    this.select.emit(id);
  }
}
