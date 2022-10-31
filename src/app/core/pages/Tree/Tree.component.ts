import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NzTreeViewModule } from "ng-zorro-antd/tree-view";

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { FlexModule } from "@angular/flex-layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import { CreateAddNodeModalComponent } from "@core/components/create-add-node-modal/create-add-node-modal.component";
import { CreateDeleteNodeModalComponent } from "@core/components/create-delete-node-modal/create-delete-node-modal.component";
import { CreateEditNodeModalComponent } from "@core/components/create-edit-node-modal/create-edit-node-modal.component";
import { ITreeNode } from "src/shared/common/src/lib/interfaces";
import { IFlatNode } from "src/shared/common/src/lib/interfaces/FlatNode";
import { FlatTreeControl, TreeControl } from "@angular/cdk/tree";
import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from "@angular/cdk/collections";
import { TreeService } from "../../services/tree.service";
import {
  BehaviorSubject,
  finalize,
  map,
  merge,
  Observable,
  of,
  tap,
} from "rxjs";
import { NzMessageModule, NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-tree",
  templateUrl: "./Tree.component.html",
  styleUrls: ["./Tree.component.less"],
  standalone: true,
  imports: [
    CommonModule,
    NzTreeViewModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTypographyModule,
    FlexModule,
    NzMenuModule,
    NzModalModule,
    NzDropDownModule,
    RouterModule,
    NzMessageModule,
  ],
})
export class TreeComponent implements OnInit {
  treeData: IFlatNode[] = [];

  Tree: ITreeNode[];

  constructor(
    public httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private treeService: TreeService,
    private nzMessage: NzMessageService,
    private router: Router
  ) {
    this.activatedRoute.data.subscribe(({ tree }) => {
      Array.prototype.forEach.call(tree.folder, (v: any) => {
        let json = {
          path: v.path,
          id: v.uuid,
          label: v.path.split("/")[2],
          level: 0,
          expandable: v.hasChildren,
        };
        this.treeData.push(json);
      });
    });
  }
  ngOnInit(): void {}

  treeControl = new FlatTreeControl<IFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  dataSource = new DynamicDatasource(
    this.treeControl,
    this.treeData,
    this.httpClient
  );

  hasChild = (_: number, node: IFlatNode): boolean => node.expandable;

  createAddNodeModal(node: IFlatNode) {
    this.modalService.create({
      nzTitle: "افزودن درختواره ",
      nzContent: CreateAddNodeModalComponent,
      nzComponentParams: {
        node,
      },
      nzFooter: [
        {
          label: "بستن",
          onClick: (componentInstance) => componentInstance.destroyModal(),
        },
        {
          label: "ثبت",
          type: "primary",
          onClick: (componentInstance) =>
            this.handleAddTreeNode(componentInstance),
          loading: (componentInstance) => componentInstance.isLoading,
        },
      ],
    });
  }

  handleAddTreeNode(componentInstance: any) {
    componentInstance.isLoading = true;

    let json = {
      path:
        componentInstance.form.get("level").value +
        "/" +
        componentInstance.form.get("title").value,
      code: componentInstance.form.value.code,
    };
    
    this.treeService
      .createCategory(json)
      .pipe(finalize(() => (componentInstance.isLoading = false)))
      .subscribe(() => handleRes());

    const handleRes = () => {
      this.nzMessage.success("عملیات با موفقیت انجام شد");
      componentInstance.destroyModal();
      this.refresh();
    };
  }

  createDeleteNodeModal(node: IFlatNode) {
    this.modalService.create({
      nzTitle: "حذف درختواره ",
      nzContent: CreateDeleteNodeModalComponent,
      nzComponentParams: {
        node,
      },
      nzFooter: [
        {
          label: "بستن",
          onClick: (componentInstance) => componentInstance.destroyModal(),
        },
        {
          label: "تایید",
          type: "primary",
          onClick: (componentInstance) =>
            this.handleDeleteTreeNode(componentInstance, node),
          loading: (componentInstance) => componentInstance.isLoading,
        },
      ],
    });
  }

  handleDeleteTreeNode(componentInstance: any, node: IFlatNode) {
    componentInstance.isLoading = true;
    this.treeService
      .deleteCategory(node.id)
      .pipe(finalize(() => (componentInstance.isLoading = false)))
      .subscribe(() => handleRes());

    const handleRes = () => {
      this.nzMessage.success("عملیات با موفقیت انجام شد");
      componentInstance.destroyModal();
      this.refresh();
    };
  }

  createEditNodeModal(node: IFlatNode) {
    console.log(node);

    this.modalService.create({
      nzTitle: "ویرایش درختواره ",
      nzContent: CreateEditNodeModalComponent,
      nzComponentParams: {
        node,
      },
      nzFooter: [
        {
          label: "بستن",
          onClick: (componentInstance) => componentInstance.destroyModal(),
        },
        {
          label: "ثبت",
          type: "primary",
          onClick: (componentInstance) =>
            this.handleRenameTreeNode(componentInstance),
          loading: (componentInstance) => componentInstance.isLoading,
        },
      ],
    });
  }

  handleRenameTreeNode(componentInstance: any) {
    componentInstance.isLoading = true;

    let name =
      componentInstance.form.get("level").value +
      "/" +
      componentInstance.form.get("title").value;
    let code = componentInstance.form.value.code;

    this.treeService
      .renameCategory(code, name)
      .pipe(finalize(() => (componentInstance.isLoading = false)))
      .subscribe(() => handleRes());

    const handleRes = () => {
      this.nzMessage.success("عملیات با موفقیت انجام شد");
      componentInstance.destroyModal();
      this.refresh();
    };
  }

  refresh() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        refresh: new Date().getTime(),
      },
    });
  }
}

class DynamicDatasource implements DataSource<IFlatNode> {
  private flattenedData: BehaviorSubject<IFlatNode[]>;
  private childrenLoadedSet = new Set<IFlatNode>();

  constructor(
    private treeControl: TreeControl<IFlatNode>,
    initData: IFlatNode[],
    private httpClient: HttpClient
  ) {
    this.flattenedData = new BehaviorSubject<IFlatNode[]>(initData);
    treeControl.dataNodes = initData;
  }

  connect(collectionViewer: CollectionViewer): Observable<IFlatNode[]> {
    const changes = [
      collectionViewer.viewChange,
      this.treeControl.expansionModel.changed.pipe(
        tap((change) => this.handleExpansionChange(change))
      ),
      this.flattenedData,
    ];
    return merge(...(changes as any)).pipe(
      map(() => this.expandFlattenedNodes(this.flattenedData.getValue()))
    );
  }

  expandFlattenedNodes(nodes: IFlatNode[]): IFlatNode[] {
    const treeControl = this.treeControl;
    const results: IFlatNode[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach((node) => {
      let expand = true;
      for (let i = 0; i <= treeControl.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (treeControl.isExpandable(node)) {
        currentExpand[treeControl.getLevel(node) + 1] =
          treeControl.isExpanded(node);
      }
    });
    return results;
  }

  handleExpansionChange(change: SelectionChange<IFlatNode>): void {
    if (change.added) {
      change.added.forEach((node) => this.loadChildren(node));
    }
  }

  loadChildren(node: IFlatNode): void {
    if (this.childrenLoadedSet.has(node)) {
      return;
    }
    node.loading = true;

    let treeData: IFlatNode[] = [];
    this.httpClient
      .get<ITreeNode>("/api/folder/getChildren", {
        headers: new HttpHeaders({
          accept: "application/json",
          Authorization: "Basic b2ttQWRtaW46YWRtaW4=",
        }),
        params: { fldId: `${node.id}` },
      })
      .subscribe((children) => {
        children.folder.forEach((v: any) => {
          let json = {
            path: v.path,
            id: v.uuid,
            label: v.path.split("/")[node.level + 3],
            level: node.level + 1,
            expandable: v.hasChildren,
          };
          treeData.push(json);
        });
        node.loading = false;
        const flattenedData = this.flattenedData.getValue();
        const index = flattenedData.indexOf(node);
        if (index !== -1) {
          flattenedData.splice(index + 1, 0, ...treeData);
          this.childrenLoadedSet.add(node);
        }

        this.flattenedData.next(flattenedData);
      });
  }

  disconnect(): void {
    this.flattenedData.complete();
  }
}
