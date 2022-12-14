import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { IUser } from "src/shared/common/src/lib/interfaces";
import { PrefixRoute } from "src/shared/common/src/lib/types";

export interface AppState {
  signedIn: boolean;
  me: IUser;
  prefixRoute: PrefixRoute | undefined;
}

export const initialState: AppState = {
  signedIn: false,
  me: undefined,
  prefixRoute: undefined,
};

@Injectable({
  providedIn: "root",
})
export class StateService {
  private state: AppState = initialState;
  private readonly stateSubject = new BehaviorSubject<AppState>(initialState);

  constructor() {
    if (typeof window !== "undefined") {
      Object.defineProperty(window, "appState", {
        get: () => this.stateSubject.value,
      });
    }
  }

  setState<T extends keyof AppState>(key: T, value: AppState[T]) {
    this.state[key] = value;
    this.stateSubject.next(this.state);
  }

  select<R>(selector: (state: AppState) => R): Observable<R> {
    return this.stateSubject.pipe(map(selector), distinctUntilChanged());
  }
}
