class Parent {
    constructor(public job?: string) { }
}

export class NewParent {
    parent: Parent;

    constructor(
        public updating: boolean,
        public id?: number, 
        public name?: string, 
        public email?: string, 
        public password ?: string,
        job?: string) {
        this.parent = new Parent(job);
     }
}
