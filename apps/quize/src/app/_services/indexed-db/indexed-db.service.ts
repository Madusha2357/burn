import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Page, PageData } from '@damen/models';
import { map, mergeMap, Observable, Observer, of, take } from 'rxjs';
import { uuid } from '../../_utils/uuid';
import {
  DATABASE_NAME,
  KEY_PATH,
  QUESTION_OBJECT_STORE_NAME,
  USERS_OBJECT_STORE_NAME,
} from './indexed-db.consts';

// https://github.com/robisim74/angular2indexedDB/blob/master/app/services/indexedDB.service.ts
@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  keys = {
    users: [{ name: '_id', unique: true }],
    questions: [
      { name: '_id', unique: true },
      { name: 'text', unique: false },
      { name: 'createdAt', unique: false },
    ],
  };

  /**
   * The database.
   */
  db?: IDBDatabase;

  constructor() {
    this.openDBAsync().pipe(take(1)).subscribe();
  }

  /**
   * Opens the database.
   *
   * @param dbName The name of the database which identifies it within a specific origin
   * @param version The version of the database
   * @return An observable of readyState
   */
  private openDBAsync(
    dbName: string = DATABASE_NAME,
    version: number = 2
  ): Observable<IDBDatabase> {
    if (this.db) return of(this.db);

    return new Observable((observer: Observer<IDBDatabase>) => {
      const request: IDBOpenDBRequest = indexedDB.open(dbName, version);

      request.onsuccess = () => {
        this.db = request.result;
        observer.next(request.result);
        observer.complete();
      };

      request.onerror = () => {
        console.error('IndexedDB service: ' + request.error?.name);
        observer.error(request.error?.name);
      };

      request.onupgradeneeded = () => {
        this.db = request.result;

        const userStore = this.db.createObjectStore(USERS_OBJECT_STORE_NAME, {
          keyPath: KEY_PATH,
        });

        const questionStore = this.db.createObjectStore(
          QUESTION_OBJECT_STORE_NAME,
          {
            keyPath: KEY_PATH,
          }
        );

        this.keys.users.forEach((key) =>
          userStore.createIndex(key.name, key.name, { unique: key.unique })
        );

        this.keys.questions.forEach((key) =>
          questionStore.createIndex(key.name, key.name, { unique: key.unique })
        );
      };
    });
  }

  /**
   * Gets the object store.
   *
   * @param storeName The name of the object store
   * @param mode Transaction mode
   * @return The object store
   */
  private getObjectStore(storeName: string, mode: IDBTransactionMode) {
    return this.openDBAsync().pipe(
      map((db) => db.transaction(storeName, mode).objectStore(storeName))
    );
  }

  /**
   * findAll records.
   *
   * @param storeName The name of the object store
   * @return An observable of record
   */
  findAll<T>(storeName: string, sortAndPage: [Sort, PageEvent]) {
    return this.getObjectStore(storeName, 'readonly').pipe(
      mergeMap(
        (store) =>
          new Observable((observer: Observer<[IDBObjectStore, number]>) => {
            const countReq = store.count();
            countReq.onsuccess = () => observer.next([store, countReq.result]);
          })
      ),
      mergeMap(([store, length]) => {
        return new Observable((observer: Observer<Page<T>>) => {
          const sort = sortAndPage[0];
          const paging = sortAndPage[1];
          const index = store.index(sort.active);
          const req = index.openCursor(
            null,
            sort.direction == 'asc' ? 'next' : 'prev'
          );

          const data: T[] = [];
          let hasSkipped = false;
          req.onsuccess = () => {
            const cursor = req.result;

            if (!hasSkipped && paging.pageIndex > 0) {
              hasSkipped = true;
              cursor?.advance(paging.pageIndex * paging.pageSize);
              return;
            }
            if (cursor) {
              if (data.length < paging.pageSize) {
                data.push(cursor.value);
              }
              cursor.continue();
            } else {
              const page: PageData = {
                length,
                pageSize: paging.pageSize,
                pageIndex: paging.pageIndex,
              };
              const paged: Page<T> = {
                data,
                page,
              };
              observer.next(paged);
              observer.complete();
            }
          };
          req.onerror = () => observer.error(req.error?.name);
        });
      }),
      take(1)
    );
  }

  /**
   * Adds a record.
   *
   * @param storeName The name of the object store
   * @param record The record to add
   * @return An observable of readyState
   */
  create<T>(storeName: string, record: any) {
    return this.getObjectStore(storeName, 'readwrite').pipe(
      mergeMap((store) => {
        return new Observable((observer: Observer<T>) => {
          const withId = { _id: uuid(4), createdAt: new Date(), ...record };
          const req = store.add(withId);
          req.onsuccess = () => {
            observer.next(withId);
            observer.complete();
          };
          req.onerror = () => observer.error(req.error?.name);
        });
      })
    );
  }
}
