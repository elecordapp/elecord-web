/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { Activity } from "./BridgeRPC";
import { routeActivity } from "./RouteRPC";
import { MatrixClientPeg } from "../../MatrixClientPeg";

// elecord rpc sender - sends activity updates as room state events

export async function sendActivity(this: any, activity: Activity, previousID: string) {

    // // check if activity has changed
    // {
    //     if (activity.application_id === previousID) {
    //         logger.debug("SendRPC: Activity not changed:", activity);
    //         // return;
    //     } else if (activity.application_id !== previousID && activity.application_id === "") {
    //         logger.info("SendRPC: 🔎 Activity ended:", activity);
    //     } else {
    //         logger.info("SendRPC: 🔎 Activity changed:", activity);
    //     }
    // }

    // send changed activity update
    {
        // get matrix client
        const client = await MatrixClientPeg.safeGet();

        // prepare state event values
        const ROOM_IDS = await routeActivity();
        const EVENT_TYPE: any = "app.elecord.rpc.activity";
        const STATE_KEY = client.getSafeUserId();

        // send state events
        if (ROOM_IDS && ROOM_IDS instanceof Set) {
            await Promise.all(
                Array.from(ROOM_IDS).map(async (ROOM_ID: string) => {
                    try {
                        await client.sendStateEvent(ROOM_ID, EVENT_TYPE, activity, STATE_KEY);
                        logger.debug("SendRPC: State event values:", STATE_KEY, EVENT_TYPE, ROOM_ID);
                    } catch (error) {
                        logger.error("SendRPC: 💥 Failed to send activity update:", error);
                    }
                })
            );
        }

        logger.info("SendRPC: 🚀 Sent activity updates");
    }
}

