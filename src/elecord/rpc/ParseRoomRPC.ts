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

// elecord rpc: parser - fetch and format rpc activity state events

const EVENT_TYPE: any = "app.elecord.rpc.activity";

export class ParseRoomRPC {
    private activity: Activity | null = null;
    private client: MatrixClient;
    private roomId: string;
    private dmUserID: string;
    public cleanup: () => void = () => { };

    constructor(client: MatrixClient, roomId: string, dmUserID: string) {
        this.client = client;
        this.roomId = roomId;
        this.dmUserID = dmUserID;
    }

    // fetch current state event for given user, and room
    public async getActivity() {
        logger.debug("ViewRPC: getActivity() called:", this.dmUserID);

        // get room
        const room = this.getRoom();
        if (!room) return null;

        // get event
        const timeline = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
        const event: MatrixEvent | null | undefined = timeline?.getStateEvents(EVENT_TYPE, this.dmUserID);

        // [FEAT] 
        // here we will first check if the user actually has rpc enabled,
        // an empty (content: {}) activity means rpc is disabled
        // if not, then we will return null

        // return rpc activity
        return this.processEvent(event);
    }

    // callback when new state event received
    public onActivity(callback: (activity: Activity) => void): void {
        logger.debug("ViewRPC: 🏳️ onActivity() started:", this.dmUserID);

        // get room
        const room = this.getRoom();
        if (!room) return;

        // get event
        const handleEvent = async (state: RoomState) => {
            const event = state.getStateEvents(EVENT_TYPE, this.dmUserID);
            const activity = this.processEvent(event);

            // return rpc activity
            if (activity) {
                callback({ ...activity });
            }
        };

        // register listener
        room.on(RoomStateEvent.Update, handleEvent);

        // cleanup listener
        this.cleanup = () => {
            room.off(RoomStateEvent.Update, handleEvent);
        };
    }

    // get room by roomId
    private getRoom(): Room | undefined {
        const room: Room | null = this.client.getRoom(this.roomId);
        if (!room) {
            logger.error("ViewRPC: 🏚️ Room not found:", this.roomId);
            return;
        }
        return room;
    }

    // process state event, and extract activity
    private processEvent(event: MatrixEvent | null | undefined): Activity | null {
        if (
            event &&
            event.getType() === EVENT_TYPE &&           // check event type
            event.getStateKey() === this.dmUserID &&    // verify sender
            event.getRoomId() === this.roomId           // check room
        ) {
            logger.debug("ViewRPC: Activity found:", event.getContent());

            // set activity
            this.activity = event.getContent() as Activity;
            // sanitize user content
            this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
            this.activity.name = DOMPurify.sanitize(this.activity.name);

            // check activity status is valid
            if (this.activity.status === true) {
                logger.debug("ViewRPC: Activity status:", this.activity.status, this.dmUserID);
                // check event sent within last 10.5 minutes
                const now = new Date().getTime();
                const sent = event.getTs();
                const diff = now - sent;
                if (diff > 630000) {
                    logger.warn("ViewRPC: ⌛ Activity status too old:", Math.round(diff/60000) + "m", this.dmUserID);
                    // correct invalid status (too old to be valid)
                    this.activity.status = false;
                    this.activity.timestamps.start = sent;
                }

            } else if (this.activity.status === false) {
                logger.debug("ViewRPC: Activity status:", this.activity.status, this.dmUserID);
                this.activity.timestamps.start = event.getTs();
            }

            // return activity after sanitization and status validation
            return this.activity;

        } else {
            logger.warn("ViewRPC: ❔ State event not found:", this.dmUserID, EVENT_TYPE, this.roomId);
            return null;
        }
    }
}
