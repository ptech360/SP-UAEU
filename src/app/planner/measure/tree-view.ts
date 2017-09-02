import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component ({
  selector: 'tree-view',
  template: `
  <ul style="list-style:none;">
    <li *ngFor="let node of treeData;let i=index;">
      <div class="checkbox">
        <label><input type="checkbox" (change)="department($event)" [value]="node.departmentId">{{node.department}}</label>
      </div>      
      <tree-view [treeData]="node.reporteeDepartments" (onSelected)="department($event)"></tree-view>
    </li>
</ul>
  `
})
export class TreeView {
  @Input() treeData: any[];
  @Output() onSelected : EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(){
    
  }

  department(event: any) {
    this.onSelected.emit(event);
  }
  
}