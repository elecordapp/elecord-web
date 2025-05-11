/*
Copyright 2019-2024 New Vector Ltd.
Copyright 2019 The Matrix.org Foundation C.I.C.
Copyright 2015, 2016 OpenMarket Ltd

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type JSX, type ReactElement, useEffect, useState } from "react";

import SdkConfig from "../../../SdkConfig";
import { _t } from "../../../languageHandler";

const fetchVersion = async (): Promise<string> => {
    try {
        const res = await fetch("version", {
            method: "GET",
            cache: "no-cache",
        });
        if (res.ok) {
            const text = await res.text();
            return text.trim().replace(/^v/, ""); // Normalize version if it starts with 'v'
        }
        console.error("Failed to fetch version: ", res.status);
        return "unknown";
    } catch (error) {
        console.error("Error fetching version: ", error);
        return "unknown";
    }
};

const AuthFooter = (): ReactElement => {
    const [version, setVersion] = useState<string>("");

    useEffect(() => {
        const loadVersion = async () => {
            const fetchedVersion = await fetchVersion();
            setVersion(fetchedVersion);
        };
        loadVersion();
    }, []);

    const brandingConfig = SdkConfig.getObject("branding");
    const links = brandingConfig?.get("auth_footer_links") ?? [
        { text: "About", url: "https://elecord.app" },
        { text: version ? `${version}` : "Loading...", url: "https://github.com/elecordapp/elecord-web/releases" },
        { text: "Privacy", url: "https://github.com/elecordapp/elecord-web/blob/master/PRIVACY.md" },
        { text: "GitHub", url: "https://github.com/elecordapp/elecord-web" },
    ];

    const authFooterLinks: JSX.Element[] = [];
    for (const linkEntry of links) {
        authFooterLinks.push(
            <a href={linkEntry.url} key={linkEntry.text} target="_blank" rel="noreferrer noopener">
                {linkEntry.text}
            </a>,
        );
    }

    return (
        <footer className="mx_AuthFooter" role="contentinfo">
            {authFooterLinks}
            <a href="https://matrix.org" target="_blank" rel="noreferrer noopener">
                {_t("powered_by_matrix")}
            </a>
        </footer>
    );
};

export default AuthFooter;
