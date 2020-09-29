export class Book{
    constructor(
        public id: string, 
        public title: string, 
        public author: string,
        public resime: string, 
        public imgUrl: string,
        public featured: boolean,
        public rating: number,
        public review: string,
        public year: number,
        public userId: string
    ){}
}