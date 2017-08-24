import { Component, OnInit,Input ,Output ,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  constructor() { }
  @Input() page: number;
  @Input() count: number;
  @Input() PerPage: number;
  @Input() PerSlide:number;
  @Output() goPage =new EventEmitter<number>();
  ngOnInit() {
  }
  onPage(n: number): void{
    this.page=n;
    this.goPage.emit(this.page);
  }

 totalPages(): number {
    return Math.ceil(this.count / this.PerPage) || 0;
  }
   lastPage(): boolean {
    return this.PerPage * this.page >= this.count;
  }
  getPages(): number[] {
    const c = Math.ceil(this.count / this.PerPage);
    const p = this.page || 1;
    const pagesToShow = this.PerSlide || 9;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min.apply(null, pages) > 1) {
          pages.push(Math.min.apply(null, pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max.apply(null, pages) < c) {
          pages.push(Math.max.apply(null, pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }
}
