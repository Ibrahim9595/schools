export class NewAssignment {
    constructor(
        public staffId: number,
        public classId: number, 
        public subjectId: number, 
        public assignmentTypeId: number, 
        public description: string,
        public finalScore: number, 
        public dueDate: string, 
        public notes: string
    ) { }
}
