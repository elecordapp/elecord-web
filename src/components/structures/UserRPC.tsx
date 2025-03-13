/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { useEffect, useState } from 'react';

import { BridgeRPC, Activity } from '../../elecord/BridgeRPC';

// elecord rpc user component - gets and displays user activity
// this component starts the full rpc lifecycle

const UserRPC: React.FC = () => {
    const [activity, setActivity] = useState<Activity | null>(null);

    // start rpc bridge
    useEffect(() => {
        const bridgeRPC = new BridgeRPC();

        const interval = setInterval(() => {
            setActivity(bridgeRPC.getActivity());
        }, 5000); // update every 5s

        return () => {
            clearInterval(interval);
        };
    }, []);

    // render user activity
    return (
        <div className="mx_UserRPC">
            <div className="mx_UserRPC_activity">
                {activity?.application_id ? (
                    <img
                        src={`https://dcdn.dstn.to/app-icons/${activity?.application_id}`}
                        alt={activity?.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                    />
                ) : (
                    <p>-</p>
                )}
            </div>
        </div>
    );
};

export default UserRPC;
