/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { Activity } from "./BridgeRPC";
import { MatrixClientPeg } from "../MatrixClientPeg";
// import { type StateEvents } from "matrix-js-sdk/src/@types/event";

// elecord rpc sender - sends activity updates as room state events

export async function sendActivity(this: any, activity: Activity, previousID: string) {
    // get matrix client
    const client = MatrixClientPeg.safeGet();
    
    // prepare state event values
    const ROOM_ID = "!jxrUDhkPqMgWuxSZom:matrix.org";
    const EVENT_TYPE = "app.elecord.rpc.activity";
    const STATE_KEY = client.getSafeUserId();

    // check if activity has changed
    if (activity.application_id === previousID) {
        logger.debug("elecord RPC: Activity has not changed:", activity);
        return;
    } else if (activity === null && previousID === "") {
        logger.debug("elecord RPC: Activity has not changed (empty):", activity);
        return;
    } else {
        logger.info("elecord RPC: Activity has changed:", activity);
    }

    // send room state event
    try {
        await client.sendStateEvent(ROOM_ID, EVENT_TYPE, activity, STATE_KEY);
        logger.debug("elecord RPC: State event values:", STATE_KEY, EVENT_TYPE, ROOM_ID);
        logger.info("elecord RPC: Sent activity update");
    } catch (error) {
        logger.error("elecord RPC: Failed to send activity update:", error);
    }
}
