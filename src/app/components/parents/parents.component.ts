import { Component, OnInit } from '@angular/core';
import { ParentsService } from './parents.service';
import { Parent } from './parent';
import { NewParent } from './new-parent';
import { find, remove } from 'lodash';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css'],
  providers: [ParentsService]
})
export class ParentsComponent implements OnInit {

  parents: Parent[];
  parent: NewParent;

  constructor(private service: ParentsService) { }

  ngOnInit() {
    this.service.init().subscribe(({ data }) => {
      this.parents = data.parents;
    });
  }

  openForm(parent?: Parent) {
    if (parent) {
      this.parent = new NewParent(true, parent.id, parent.name, parent.email, '', parent.job);
    } else {
      this.parent = new NewParent(false);
    }
  }

  createParent(parent: NewParent) {
    let user = {
      name: parent.name,
      email: parent.email,
      password: parent.password
    };
    this.service.createParent(user, parent.parent)
      .subscribe(({ data }: any) => {
        this.parents.push(data.createParent)
      });
  }

  updateParent(parent: NewParent) {
    let user = {
      name: parent.name,
      email: parent.email
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
    this.service.deleteUser(userId).subscribe(({data})=>{
      remove(this.parents, {userId: userId});
    });
  }

  getParentDetails(id) {
    this.service.getParentDetails(id).subscribe(({data}: any)=>{
      console.log(data.parent);
    })
  }
}
