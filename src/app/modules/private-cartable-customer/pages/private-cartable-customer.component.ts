import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexModule } from "@angular/flex-layout";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { AddDocumentModalComponent } from "@core/components/add-document-modal/add-document-modal.component";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { ActivatedRoute } from "@angular/router";
import { CartableDraftListComponent, CartableNotifiedListComponent } from "../components";

@Component({
  selector: "app-private-cartable",
  templateUrl: "./private-cartable-customer.component.html",
  styleUrls: ["./private-cartable-customer.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzTabsModule,
    CartableNotifiedListComponent,
    CartableDraftListComponent,
    NzCardModule
  ],
})
export class PrivateCartablecustomerComponent implements OnInit {
  constructor() {
}

  ngOnInit(): void {}

  
}
