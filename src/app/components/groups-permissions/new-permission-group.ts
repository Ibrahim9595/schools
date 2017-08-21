export class NewPermissionGroup {
    groupName: string;
    description: string;
    updating: boolean;
    id: number;

    constructor(updating: boolean, groupName="", description="", id?: number){
        this.groupName = groupName;
        this.description = description;
        this.updating = updating;
        this.id = id;
    }
}
