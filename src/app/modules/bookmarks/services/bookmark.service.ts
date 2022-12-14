import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IBookmark } from "src/shared/common/src/lib/interfaces";

@Injectable({
  providedIn: "root",
})
export class BookmarkService {
  constructor(private httpClient: HttpClient) {}
  getAll() {
    return this.httpClient.get<IBookmark>("/api/bookmark/getAll", {
      headers: new HttpHeaders({
        accept: "application/json",
        Authorization: "Basic b2ttQWRtaW46YWRtaW4=",
      }),
    });
  }
  getOne(id: string) {
    return this.httpClient.get<IBookmark>("/api/bookmark/get", {
      headers: new HttpHeaders({
        accept: "application/json",
        Authorization: "Basic b2ttQWRtaW46YWRtaW4=",
      }),
      params: {
        bookmarkId: id,
      },
    });
  }
  deleteOne(id: number) {
    return this.httpClient.delete<IBookmark>("/api/bookmark/delete", {
      headers: new HttpHeaders({
        accept: "application/json",
        Authorization: "Basic b2ttQWRtaW46YWRtaW4=",
      }),
      params: { bookmarkId: id },
    });
  }

  renameBookmark(body: string, id: number) {
    return this.httpClient.put("/api/bookmark/rename", body, {
      headers: new HttpHeaders({
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic b2ttQWRtaW46YWRtaW4=",
      }),
      params: { bookmarkId: id },
    });
  }
}
