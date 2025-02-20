/*
Copyright 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { useState, useEffect } from "react";
import classNames from "classnames";

import defaultDispatcher from "../../../dispatcher/dispatcher";
import { Action } from "../../../dispatcher/actions";
import { UserTab } from "../dialogs/UserTab";

const AppVersionButton: React.FC = () => {
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        fetch("version")
            .then(r => r.text())
            .then(v => setVersion(v));
    }, []);

    return (
        <div
            onClick={() => {
                defaultDispatcher.dispatch({
                    action: Action.ViewUserSettings,
                    initialTabId: UserTab.Changelog,
                });
            }}
            className="mx_AppVersionButton"
        >
            <p
                className={classNames("mx_AppVersionButton_title", {
                    "mx_AppVersionButton_dev": version && !version.includes(".")
                })}
            >
                {version && !version.includes(".") ? "DEV" : "BETA"}
            </p>
            <p className="mx_AppVersionButton_number">{version || "..."}</p>
        </div>
    );
};

export default AppVersionButton;
