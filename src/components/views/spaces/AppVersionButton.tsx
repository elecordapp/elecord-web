/*
Copyright 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { useState, useEffect } from "react";
import classNames from "classnames";

const AppVersionButton: React.FC = () => {
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        fetch("version")
            .then(r => r.text())
            .then(v => setVersion(v));
    }, []);

    return (
        <a
            href="https://github.com/elecordapp/elecord-web/releases"
            target="_blank"
            rel="noreferrer noopener"
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
        </a>
    );
};

export default AppVersionButton;

