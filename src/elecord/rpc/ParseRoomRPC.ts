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
        // get room
        const room: Room | null = this.client.getRoom(this.roomId);
        // room not found
        if (!room) {
            logger.error("elecord RPC2: Room not found:", this.roomId);
            return null;
        }

        // get state event
        const timeline = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
        const event: MatrixEvent | null | undefined =
            timeline?.getStateEvents(EVENT_TYPE, this.dmUserID);
        if (
            event &&
            event.getType() === EVENT_TYPE &&           // check event type
            event.getStateKey() === this.dmUserID &&    // verify sender
            event.getRoomId() === this.roomId           // check room
        ) {

            // use new activity
            {
                logger.info("elecord RPC2: Activity found from room state:", event.getContent());

                // set activity
                this.activity = event.getContent() as Activity;
                // sanitize content
                this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
                this.activity.name = DOMPurify.sanitize(this.activity.name);
            }

            // end
            return this.activity;

        } else {
            logger.error("elecord RPC2: State event not found:",
                EVENT_TYPE, this.dmUserID, this.roomId);
        }
    }

    /**
     * Monitor for new state events and call the provided callback when a new event is received.
     */
    public onActivity(callback: (activity: Activity) => void): void {
        // get room
        const room: Room | null = this.client.getRoom(this.roomId);
        // room not found
        if (!room) {
            logger.error("elecord RPC2: Room not found:", this.roomId);
            return;
        }

        const handleEvent = (state: RoomState) => {
            // get state event
            const event = state.getStateEvents(EVENT_TYPE, this.dmUserID);
            if (
                event &&
                event.getType() === EVENT_TYPE &&           // check event type
                event.getStateKey() === this.dmUserID &&    // verify sender
                event.getRoomId() === this.roomId           // check room
            ) {
                // use new activity
                {
                    logger.info("elecord RPC2: New activity received:", event.getContent());

                    // set activity
                    this.activity = event.getContent() as Activity;
                    // sanitize content
                    this.activity.application_id = DOMPurify.sanitize(this.activity.application_id);
                    this.activity.name = DOMPurify.sanitize(this.activity.name);
                }

                // end
                callback({ ...this.activity });

            } else {
                logger.error("elecord RPC2: State event not found:",
                    EVENT_TYPE, this.dmUserID, this.roomId);
            }
        };

        room.on(RoomStateEvent.Update, handleEvent);

        // clean up the event listener when it's no longer needed
        this.cleanup = () => {
            room.off(RoomStateEvent.Update, handleEvent);
        };
    }
}


