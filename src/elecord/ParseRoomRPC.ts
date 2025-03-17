/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { MatrixClient } from "matrix-js-sdk/src/client";
import { Room } from "matrix-js-sdk/src/models/room";

import {
    type MatrixEvent,
    EventTimeline,
    RoomStateEvent,
    type RoomState,
} from "matrix-js-sdk/src/matrix";

import { Activity } from './BridgeRPC';
import DOMPurify from "dompurify";

const EVENT_TYPE: any = "app.elecord.rpc.activity";

export class ParseRoomRPC {
    private activity: Activity | null = null;
    private client: MatrixClient;
    private roomId: string;
    private dmUserID: string;
    public cleanup: () => void = () => {};

    constructor(client: MatrixClient, roomId: string, dmUserID: string) {
        this.client = client;
        this.roomId = roomId;
        this.dmUserID = dmUserID;
    }

    // TODO
    // - 🕑correctly format timestamps
    // "2d ago: Monster Hunter: World"

    /**
     * Fetch the current state event for the given user and room.
     */
    public getActivity() {
        const room: Room | null = this.client.getRoom(this.roomId);
        if (!room) return null;

        const event: MatrixEvent | null | undefined = room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EVENT_TYPE, this.dmUserID);
        if (!event) return null;

        logger.info("elecord RPC2: Activity received from room state:", event.getContent());

        this.activity = event.getContent() as Activity;

        // sanitize content
        this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
        this.activity.name = DOMPurify.sanitize(this.activity.name);

        return this.activity;
    }

    /**
     * Monitor for new state events and call the provided callback when a new event is received.
     */
    public onActivity(callback: (activity: Activity) => void): void {
        const room = this.client.getRoom(this.roomId);
        if (!room) return;

        const handleEvent = (state: RoomState) => {
            const event = state.getStateEvents(EVENT_TYPE, this.dmUserID);
            if (event && event.getType() === EVENT_TYPE && event.getStateKey() === this.dmUserID && event.getRoomId() === this.roomId) {
                this.activity = event.getContent() as Activity;

                // sanitize content
                this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
                this.activity.name = DOMPurify.sanitize(this.activity.name);

                callback({ ...this.activity });
            }
        };

        room.on(RoomStateEvent.Update, handleEvent);

        // Clean up the event listener when it's no longer needed
        this.cleanup = () => {
            room.off(RoomStateEvent.Update, handleEvent);
        };
    }
}