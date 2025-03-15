/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { FC, useEffect, useState } from 'react';

import { MatrixClientPeg } from "../../../MatrixClientPeg";
import { ParseRoomRPC, } from "../../../elecord/ParseRoomRPC";
import { Activity } from '../../../elecord/BridgeRPC';

// elecord rpc room tile component - displays user activity on dm rooms

interface Props {
    roomId: string
    dmUserID: string
}

const RoomTileRPC: FC<Props> = ({ roomId, dmUserID }) => {
    const [activity, setActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const client = MatrixClientPeg.safeGet();
        const parseRoomRPC = new ParseRoomRPC(client, roomId, dmUserID);

        setActivity(parseRoomRPC.getActivity());

        // Fetch the current state event
        // parseRoomRPC.fetchCurrentState().then(event || null => {
        //     if (event) {
        //         setRpcEvent(event);
        //     }
        // });

        // // Monitor for new state events
        // parseRoomRPC.monitorStateEvents(event => {
        //     setRpcEvent(event);
        // });
    }, [roomId, dmUserID]);

    // return html of rpc activity icon and text
    // e.g. ICON | "2d ago: Monster Hunter: World"
    return (
        <div className="mx_RoomRPC">
            {activity?.application_id ? (
                <img
                    src={`https://dcdn.dstn.to/app-icons/${activity?.application_id}?size=16`}
                    alt={activity?.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                />
            ) : (<div />)}
            <span className="mx_RoomTile_subtitle_text">{activity?.name}</span>
        </div>
    );
};

export default RoomTileRPC;

