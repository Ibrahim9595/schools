import { Component, OnInit } from '@angular/core';
import { find, findIndex, remove } from 'lodash';

import { GroupsPermissionsService } from './groups-permissions.service';
import { PermissionGroup } from './permission-group';
import { Permission } from './permission';
import { NewPermissionGroup } from './new-permission-group';


@Component({
  selector: 'app-groups-permissions',
  templateUrl: './groups-permissions.component.html',
  styleUrls: ['./groups-permissions.component.css'],
  providers: [GroupsPermissionsService]
})
export class GroupsPermissionsComponent implements OnInit {
  permissionGroups: PermissionGroup[];
  permissions: any = null;
  currentGroup: PermissionGroup = null;
  permissionGroup: NewPermissionGroup = null;
  users: any = null;
  ItemPerPage =5;
  PageNum=1;
  count: number;
  permissionLevels = [
    {
      level: 1,
      description: "Read Only"
    },
    {
      level: 2,
      description: "All Permissions"
    },
  ];

  currentPermission: Permission = {
    id: null,
    name: "",
    permissionLevel: null,
    route: ""
  };

  permissionGroupFormOptions = {
    groupName: {
      type: 'text',
      required: true,
      minLength: 5,
      placeholder: 'Group Name'
    },
    description: {
      type: 'textarea',
      required: true,
      minLength: 10,
      placeholder: 'Description'
    }
  };

  constructor(private service: GroupsPermissionsService) { }

  
  ngOnInit() {
   this.getAllpermissions(2,0);
  }
   getAllpermissions(limit,offset){
      this.service.init(limit,offset).subscribe(({ data }) => {
      this.permissionGroups = data.permissionGroups;
      this.count= data.permissionGroups[0].count || 1;
    });
   }
  clear() {
    this.currentPermission = {
      ...this.currentPermission,
      id: null,
      permissionLevel: null
    };
  }
 goPage(n: number): void{
    this.PageNum=n;
    this.getAllpermissions(this.ItemPerPage,(n-1)*this.ItemPerPage);
  }
  openForm(permissionGroup?: PermissionGroup) {
    if (permissionGroup) {
      this.permissionGroup =
        new NewPermissionGroup(
          true,
          permissionGroup.groupName,
          permissionGroup.description,
          permissionGroup.id);
    } else {
      this.permissionGroup = new NewPermissionGroup(false);
    }
    console.log(this.permissionGroup);
  }

  createPermissionGroup() {
    this.service
      .createPermissionGroup(
      this.permissionGroup.groupName,
      this.permissionGroup.description)
      .subscribe(({ data }: any) => {
        this.permissionGroups.push(data.createPermissionGroup);
        alert('created');
      });
  }

  updatePermissionGroup() {
    this.service
      .updatePermissionGroup(
      this.permissionGroup.id,
      this.permissionGroup.groupName,
      this.permissionGroup.description)
      .subscribe(({ data }: any) => {
        let group = find(this.permissionGroups, { id: this.permissionGroup.id });
        group.groupName = this.permissionGroup.groupName;
        group.description = this.permissionGroup.description;
        alert('updated');
      });
  }

  deletePermissionGroup(id: number) {
    let confirmation = confirm('Are you sure you want to delete this Group?');
    if (confirmation) {
      this.service.deletePermissionGroup(id).subscribe(({ data }: any) => {
        remove(this.permissionGroups, { id: id });
      });
    }

  }

  getAllPermissions(permissionGroup: PermissionGroup) {
    this.service.getAllPermissions().subscribe(({ data }) => {
      this.currentGroup = permissionGroup;
      this.permissions = data.permissions;
    });


  }

  getAllUsers(permissionGroup: PermissionGroup) {
    this.service.getAllUsers().subscribe(({ data }) => {
      this.currentGroup = permissionGroup;
      this.users = data.users;
    });
  }

  appendPermissionToGroup() {
    if (this.currentPermission.id != null && this.currentPermission.permissionLevel != null) {
      let permission = find(this.permissions, { id: parseInt(this.currentPermission.id + '') });
      this.service
        .appendPermissionToGroup(
        this.currentGroup.id,
        this.currentPermission.id,
        this.currentPermission.permissionLevel
        ).subscribe(({ data }: any) => {

          this.currentGroup.permissions.push({
            ...permission,
            permissionLevel : this.currentPermission.permissionLevel
          });
          this.clear();
        });
    }
  }

  updatePermissionOfGroup(newPermissionLevel, permission) {
    this.service
      .UpdatePermissionToGroup(
      this.currentGroup.id,
      permission.id,
      permission.permissionLevel
      )
      .subscribe(({ data }: any) => {
        console.log(data);
        console.log(this.permissionGroups)
      });
  }

  addUserToPermissionGroup(userId) {
    if (userId == null || userId == '')
      return;
    let user = find(this.users, { id: parseInt(userId) });
    this.service.addUserToPermissionGroup(this.currentGroup.id, userId)
      .subscribe(({ data }) => {
        this.currentGroup.users.push(user);
      });
  }

  deleteUserFromPermissionGroup(userId) {
    let confirmation = confirm("Are you sure you want to delete this permission?");
    if (confirmation) {
      this.service.deleteUserFromPermissionGroup(this.currentGroup.id, userId)
        .subscribe(({ data }) => {
          remove(this.currentGroup.users, { id: parseInt(userId) });
        });
    }

  }

  deletePermissionOfGroup(permission) {
    let confirmation = confirm("Are you sure you want to delete this permission?");
    if (confirmation) {
      this.service.deletePermissionOfGroup(this.currentGroup.id, permission.id)
        .subscribe(({ data }: any) => {
          remove(this.currentGroup.permissions, { id: permission.id });
        });
    }
  }
}
