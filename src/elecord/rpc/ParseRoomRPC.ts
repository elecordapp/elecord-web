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
    public cleanup: () => void = () => { };

    constructor(client: MatrixClient, roomId: string, dmUserID: string) {
        this.client = client;
        this.roomId = roomId;
        this.dmUserID = dmUserID;
    }

    /**
     * Fetch the current state event for the given user and room.
     */
    public getActivity() {
        logger.debug("elecord RPC2: Fetching initial activity for user:", this.dmUserID);

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

        // provide activity
        return this.processEvent(event);
    }

    /**
     * Callback when a new state event is received.
     */
    public onActivity(callback: (activity: Activity) => void): void {
        logger.info("elecord RPC2: Monitoring activity for user:", this.dmUserID);

        // get room
        const room = this.getRoom();
        if (!room) return;

        // get event
        const handleEvent = (state: RoomState) => {
            const event = state.getStateEvents(EVENT_TYPE, this.dmUserID);
            const activity = this.processEvent(event);

            // provide activity
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

    /**
     * Get the room by roomId.
     * @returns The Room object or undefined if the room is not found.
     */
    private getRoom(): Room | undefined {
        const room: Room | null = this.client.getRoom(this.roomId);
        if (!room) {
            logger.error("elecord RPC2: Room not found:", this.roomId);
            return;
        }
        return room;
    }

    /**
     * Process the event and extract the activity.
     * @param event The MatrixEvent to process.
     * @returns The extracted Activity or null if the event is invalid.
     */
    private processEvent(event: MatrixEvent | null | undefined): Activity | null {
        if (
            event &&
            event.getType() === EVENT_TYPE &&           // check event type
            event.getStateKey() === this.dmUserID &&    // verify sender
            event.getRoomId() === this.roomId           // check room
        ) {
            logger.info("elecord RPC2: Activity found from room state:", event.getContent());

            // set activity
            this.activity = event.getContent() as Activity;
            // sanitize user content
            this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
            this.activity.name = DOMPurify.sanitize(this.activity.name);

            // check activity status is valid
            if (this.activity.status === true) {
                logger.info("elecord RPC2: Activity status:", this.activity.status);

                // check the event was sent within the last 10.5 minutes
                // if not, set status to false (as it's too old to be valid)
                const now = new Date().getTime();
                const sent = event.getTs();
                const diff = now - sent;
                if (diff > 630000) {
                    logger.info("elecord RPC2: Activity status too old:", diff/1000);
                    // correct the invalid status
                    this.activity.status = false;
                    this.activity.timestamps.start = sent;
                }
            } else if (this.activity.status === false) {
                logger.info("elecord RPC2: Activity status:", this.activity.status);
                this.activity.timestamps.start = event.getTs();
            }

            // return activity after sanitization and status validation
            return this.activity;

        } else {
            logger.error("elecord RPC2: State event not found:", EVENT_TYPE, this.dmUserID, this.roomId);
            return null;
        }
    }
}


