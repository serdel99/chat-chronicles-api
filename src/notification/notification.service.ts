import { Injectable, Logger, Scope } from '@nestjs/common';
import { Subject } from 'rxjs';

type EventObject = {
    count: number,
    eventSubject: Subject<object>
}

@Injectable({ scope: Scope.DEFAULT })
export class NotificationService {


    private readonly allSucribedStories: Map<number, EventObject>

    constructor() {
        this.allSucribedStories = new Map();
    }

    events(id: number) {
        return this.allSucribedStories.get(id).eventSubject.asObservable();
    }

    sendNotification(id, data: object) {
        console.log(this)
        if (this.allSucribedStories.has(id)) {
            this.allSucribedStories.get(id).eventSubject.next({
                data
            })
        }
    }

    addStory(id: number) {
        if (this.allSucribedStories.has(id)) {
            const existing = this.allSucribedStories.get(id);
            this.allSucribedStories.set(id, {
                ...existing,
                count: existing.count + 1
            })
        } else {
            this.allSucribedStories.set(id, {
                count: 1,
                eventSubject: new Subject<object>()
            })
        }
    }

    removeStory(id: number) {
        if (this.allSucribedStories.has(id)) {
            const existing = this.allSucribedStories.get(id)
            if (existing.count === 1) {
                this.allSucribedStories.delete(id);
            } else {
                this.allSucribedStories.set(id, {
                    ...existing,
                    count: existing.count - 1,
                })
            }
        }
    }

}
