import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NzModalModule, NzModalRef } from "ng-zorro-antd/modal";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IFlatNode } from "src/shared/common/src/lib/interfaces";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-create-edit-node-modal",
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-edit-node-modal.component.html",
  styleUrls: ["./create-edit-node-modal.component.css"],
})
export class CreateEditNodeModalComponent implements OnInit{
  @Input() node: IFlatNode;
  isLoading: boolean;
  @Input() data;
  form: FormGroup<{
    level: FormControl<string>;
    title: FormControl<string>;
    code: FormControl<string>;
  }> = new FormGroup({
    level: new FormControl(null),
    title: new FormControl(null, [Validators.required]),
    code: new FormControl(null, [Validators.required]),
  });

  constructor(private modal: NzModalRef) {
   
  }
  ngOnInit(): void {



  
    
   this.form.get('level').setValue((this.node.level+1).toString());
   this.form.get('title').setValue(this.node.label);
   this.form.get('code').setValue(this.data.code);
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
