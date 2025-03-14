/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

// elecord rpc elapsed time formatter - formats elapsed time into a human-readable string

// calculate elapsed time
let elapsedTime: string;
{
    const timeInSeconds = (Date.now() - msg.activity.timestamps.start) / 1000;

    let unit, divisor;
    if (timeInSeconds < 60) {
        unit = "s";
        divisor = 1;
    } else if (timeInSeconds < 3600) {
        unit = "m";
        divisor = 60;
    } else {
        unit = "h";
        divisor = 3600;
    }

    elapsedTime = `${Math.floor(timeInSeconds / divisor)}${unit}`;
    logger.debug(`elecord RPC: Elapsed time [${elapsedTime}]`);
}

