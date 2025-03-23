/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { Activity } from "./BridgeRPC";
import { routeActivity } from "./RouteRPC";
import { MatrixClientPeg } from "../MatrixClientPeg";

// elecord rpc sender - sends activity updates as room state events

export async function sendActivity(this: any, activity: Activity, previousID: string) {

    // check if activity has changed
    {
        if (activity.application_id === previousID) {
            logger.debug("elecord RPC: Activity has not changed:", activity);
            return;
        } else if (activity.application_id !== previousID && activity.application_id === "") {
            logger.info("elecord RPC: 🔎 Activity ended:", activity);
        } else {
            logger.info("elecord RPC: 🔎 Activity changed:", activity);
        }
    }

    // send changed activity update
    {
        // get matrix client
        const client = MatrixClientPeg.safeGet();

        // prepare state event values
        const ROOM_IDS = await routeActivity();
        const EVENT_TYPE: any = "app.elecord.rpc.activity";
        const STATE_KEY = client.getSafeUserId();

        // send state events
        for (const ROOM_ID of ROOM_IDS) {
            try {
                await client.sendStateEvent(ROOM_ID, EVENT_TYPE, activity, STATE_KEY);
                logger.debug("elecord RPC: State event values:", STATE_KEY, EVENT_TYPE, ROOM_ID);
            } catch (error) {
                logger.error("elecord RPC: Failed to send activity update:", error);
            }
        }

        logger.info("elecord RPC: 🚀 Sent activity updates");
    }
}

