/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import DMRoomMap from "../../utils/DMRoomMap";

// elecord rpc: router - return routes to dm rooms

export async function routeActivity() {
    
    // get dm room ids
    const dmRooms = DMRoomMap.shared().getRoomIds();
    logger.debug("RouteRPC: 🗺️ DM room ids:", dmRooms);

    // don't send if user has more than 8 DM rooms
    if (dmRooms.size > 8) {
        logger.error("RouteRPC: User has more than 8 DM rooms, cannot send activity updates");
        return "";
    } else {
        return dmRooms;
    }
}
