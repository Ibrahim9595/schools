export class NewAssignmentFormOptions {

    public assignmentTypeId: any; 
    public description: any;
    public finalScore: any; 
    public dueDate: any; 
    public notes: any;

    constructor(options) { 
        this.assignmentTypeId = {
            type: 'select',
            options: options
        };

        this.description = {
            type: 'textarea',
            required: true,
            minLength: 10,
            placeholder: 'Description'
        };
        
        this.notes = {
            type: 'textarea',
            required: true,
            minLength: 10,
            placeholder: 'Notes'
        };

        this.finalScore = {
            type: 'number',
            required: true,
            placeholder: 'Final score'
        };

        this.dueDate = {
            type: 'datetime',
            required: true
        };
    }
}
