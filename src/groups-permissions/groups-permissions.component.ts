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
    
  constructor(private service: GroupsPermissionsService) { }

  ngOnInit() {
    this.service.init().subscribe(({ data }) => {
      this.permissionGroups = data.permissionGroups;
    })
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

  }
  func(){
     
  }
  createPermissionGroup() {
    this.service
      .createPermissionGroup(
      this.permissionGroup.groupName,
      this.permissionGroup.description)
      .subscribe(({ data }: any) => {
        this.permissionGroups.push(data.createPermissionGroup);
      });
  }

  updatePermissionGroup() {
    this.service
      .updatePermissionGroup(
      this.permissionGroup.id,
      this.permissionGroup.groupName,
      this.permissionGroup.description)
      .subscribe(({ data }: any) => {
        let group = find(this.permissionGroups, {id: this.permissionGroup.id});
        group.groupName = this.permissionGroup.groupName;
        group.description = this.permissionGroup.description;
        console.log(group);
      });
  }

  deletePermissionGroup(id: number) {
    this.service.deletePermissionGroup(id).subscribe(({ data }: any) => { 
      remove(this.permissionGroups, { id: id });
    });
  }

  getAllPermissions(permissionGroup: PermissionGroup) {
    this.permissions = this.service.getAllPermissions(permissionGroup).subscribe((data: any[]) => {     
      this.currentGroup = {
        ...permissionGroup,
        permissions: data
      };
    });


  }

  appendPermissionToGroup(permissionGroupId, permission, permissionLevel) {
    if (permission.belongsTo) {
      this.service
      .UpdatePermissionToGroup(permissionGroupId, permission.id, permissionLevel).subscribe(({ data }: any) => {
          permission.belongsTo = true;
          let group = find(this.permissionGroups, { id: this.currentGroup.id });
          let oldpermission = find(group.permissions, { id: permission.id });
          oldpermission.permissionLevel = permission.permissionLevel;
        })

    } else {
      this.service
      .appendPermissionToGroup(permissionGroupId, permission.id, permissionLevel).subscribe(({ data }: any) => {
          permission.belongsTo = true;
          let group = find(this.permissionGroups, { id: this.currentGroup.id });
          group.permissions.push(permission);
        })
        
    }

  }

  deletePermissionOfGroup(permissionGroupId, permission) {
    this.service.deletePermissionOfGroup(permissionGroupId, permission.id)
      .subscribe(({ data }: any) => {
        
        permission.permissionLevel = null;
        permission.belongsTo = false;
        let group = find(this.permissionGroups, { id: this.currentGroup.id });
        remove(group.permissions, {id: permission.id});
      })
    }
}
