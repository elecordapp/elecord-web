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
} from "matrix-js-sdk/src/matrix";

import { Activity } from './BridgeRPC';

// Define the event type
const EVENT_TYPE = "app.elecord.rpc.activity";

export class ParseRoomRPC {
    private activity: Activity | null = null;
    private client: MatrixClient;
    private roomId: string;
    private dmUserID: string;

    constructor(client: MatrixClient, roomId: string, dmUserID: string) {
        this.client = client;
        this.roomId = roomId;
        this.dmUserID = dmUserID;
        this.fetchRPC();
    }

    // send rpc.activity state event to ParseRoomRPC.ts
    // - ⚠️sanitise content
    // - 🕑correctly format timestamps

    /**
     * Fetch the current state event for the given user and room.
     */
    private fetchRPC() {
        const room: Room | null = this.client.getRoom(this.roomId);
        if (!room) return null;

        const event: MatrixEvent | null | undefined = room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EVENT_TYPE, this.dmUserID);
        if (!event) return null;

        logger.info("elecord RPC2: Activity received from room state:", event.getContent());

        this.activity = event.getContent() as Activity;
    }

    public getActivity() {
        return this.activity;
    }


    /**
     * Monitor for new state events and call the provided callback when a new event is received.
     */
    // public monitorStateEvents(callback: (event: RPCEvent) => void): void {
    //     this.client.on("event", (event: MatrixEvent) => {
    //         if (event.getType() === EVENT_TYPE && event.getStateKey() === this.dmUserID && event.getRoomId() === this.roomId) {
    //             callback({ content: event.getContent() });
    //         }
    //     });
    // }
}