/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { FC, useEffect, useState } from 'react';

import { logger } from "matrix-js-sdk/src/logger";

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { ParseRoomRPC } from "../../../elecord/rpc/ParseRoomRPC";
import { Activity } from '../../../elecord/rpc/BridgeRPC';

// elecord rpc room tile component - displays user activity on dm rooms

interface Props {
    roomId: string;
    dmUserID: string;
}

const RoomTileRPC: FC<Props> = ({ roomId, dmUserID }) => {
    // State to store the activity.
    const [activity, setActivity] = useState<Activity | null | undefined>(null);
    // State to trigger re-renders to update the time-ago text.
    const [now, setNow] = useState(Date.now());

    // Fetch and subscribe to activity updates.
    useEffect(() => {
        (async () => {
            const client = MatrixClientPeg.safeGet();
            const parseRoomRPC = new ParseRoomRPC(client, roomId, dmUserID);

            // fetch initial activity
            logger.info("RoomRPC: 🚩 Fetching initial activity:", dmUserID, roomId);
            const initialActivity = await parseRoomRPC.getActivity();
            setActivity(initialActivity);
            if (initialActivity === null) {
                logger.debug("RoomRPC: Initial activity is null:", dmUserID, roomId);
                parseRoomRPC.cleanup();
            }

            // monitor for new state events and clean up the listener when the component unmounts
            parseRoomRPC.onActivity(newActivity => {
                logger.debug("RoomRPC: 🔦 Room state changed:", dmUserID);
                setActivity(newActivity);
            });

            // periodically re-fetch activity manually
            const interval = setInterval(async () => {
                logger.debug("RoomRPC: ⚙️ Manually refetching activity:", dmUserID);
                const refetchedActivity = await parseRoomRPC.getActivity();
                setActivity(refetchedActivity);
            }, 360000);

            return () => {
                parseRoomRPC.cleanup();
                clearInterval(interval);
            };
        })();
    }, [roomId, dmUserID]);

    // Self-adjusting timeout: update more frequently when activity is new,
    // and switch to updating every hour once it's older than an hour.
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const tick = async () => {
            setNow(Date.now());

            // Default update frequency is 1 minute.
            let nextDelay = 60000;
            if (activity?.timestamps?.start && !activity.status) {
                const elapsed = Date.now() - activity.timestamps.start;
                // Switch to updating every hour if activity is older than one hour.
                if (elapsed >= 3600000) {
                    nextDelay = 3600000;
                }
            }
            timer = setTimeout(tick, nextDelay);
        };
        // Start the cycle.
        timer = setTimeout(tick, 60000);

        return () => clearTimeout(timer);
    }, [activity]);

    // format elapsed time since activity start
    const formatTimeAgo = (start: number): string => {
        const diffMinutes = Math.floor((now - start) / (1000 * 60));

        // less than 1 minute
        if (diffMinutes < 1) return "1m ago: ";

        // less than 1 hour
        if (diffMinutes < 60) return `${diffMinutes}m ago: `;

        // less than 24 hours
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h ago: `;

        // more than 1 day
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago: `;
    };

    // when activity inactive, prefix elapsed time
    const displayName =
        activity && !activity.status && activity.timestamps?.start
            ? formatTimeAgo(activity.timestamps.start) + activity.name
            : activity?.name;

    // rpc activity (icon and text)
    return (
        <div className="mx_RoomRPC">
            {activity?.application_id && activity.status ? (
                <img
                    src={`https://dcdn.dstn.to/app-icons/${activity.application_id}?size=16`}
                    alt={activity.name}
                    title={activity.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                />
            ) : (
                null
            )}
            <span
                className="mx_RoomTile_subtitle_text"
                title={displayName}
            >
                {displayName}
            </span>
        </div>
    );
};

export default RoomTileRPC;

