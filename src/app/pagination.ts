export  class pagination {
    curretPage: number;
    total: number;
    offset: number;
    limit:number;
    constructor(limit,offset){
        this.offset=offset;
        this.limit=limit;
    }
}