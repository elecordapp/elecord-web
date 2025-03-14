/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import DMRoomMap from "../utils/DMRoomMap";

// elecord rpc route - returns routes to dm rooms for activity updates

export async function routeActivity() {
    
    // get dm room ids
    const dmRooms = DMRoomMap.shared().getRoomIds();
    logger.debug("elecord RPC: DM room ids:", dmRooms);

    // don't send if user has more than 8 DM rooms
    if (dmRooms.size > 8) {
        logger.error("elecord RPC: User has more than 8 DM rooms, cannot send activity updates");
        return "";
    } else {
        return dmRooms;
    }
}

