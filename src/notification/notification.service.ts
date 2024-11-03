import { Injectable, Logger, Scope } from '@nestjs/common';
import { Subject } from 'rxjs';

type EventObject = {
    count: number,
    eventSubject: Subject<object>
}

@Injectable({ scope: Scope.DEFAULT })
export class NotificationService {


    private readonly allSucribedUsers: Map<number, EventObject>

    constructor() {
        this.allSucribedUsers = new Map();
    }

    events(id: number) {
        return this.allSucribedUsers.get(id).eventSubject.asObservable();
    }

    sendNotification(id, data: object) {
        if (this.allSucribedUsers.has(id)) {
            this.allSucribedUsers.get(id).eventSubject.next({
                data
            })
        }
    }

    addUser(id: number) {
        if (this.allSucribedUsers.has(id)) {
            const existing = this.allSucribedUsers.get(id);
            this.allSucribedUsers.set(id, {
                ...existing,
                count: existing.count + 1
            })
        } else {
            this.allSucribedUsers.set(id, {
                count: 1,
                eventSubject: new Subject<object>()
            })
        }
    }

    removeUser(id: number) {
        if (this.allSucribedUsers.has(id)) {
            const existing = this.allSucribedUsers.get(id)
            if (existing.count === 1) {
                this.allSucribedUsers.delete(id);
            } else {
                this.allSucribedUsers.set(id, {
                    ...existing,
                    count: existing.count - 1,
                })
            }
        }
    }

}
