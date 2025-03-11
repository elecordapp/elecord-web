/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { useEffect, useState } from 'react';
import { BridgeRPC, Activity } from '../../elecord/BridgeRPC';

const UserRPC: React.FC = () => {
    const [activity, setActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const bridgeRPC = new BridgeRPC();

        const interval = setInterval(() => {
            setActivity(bridgeRPC.getActivity());
        }, 1000); // Update every second

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="mx_UserRPC">
            <div className="mx_UserRPC_activity">
                {activity ? (
                    <img src={`https://dcdn.dstn.to/app-icons/${activity.application_id}`} alt={activity.name} referrerPolicy="no-referrer" loading="lazy"/>
                ) : (
                    <p>X</p>
                )}
            </div>
        </div>
    );
};

export default UserRPC;
