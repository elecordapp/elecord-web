/*
Copyright 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React, { useState, useEffect } from "react";
import { _t } from "../../../../../languageHandler";

import PopOutIcon from "@vector-im/compound-design-tokens/assets/web/icons/pop-out";

import SettingsTab from "../SettingsTab";
import { SettingsSection } from "../../shared/SettingsSection";
import Markdown from "../../../../../Markdown";
import AccessibleButton from "../../../elements/AccessibleButton";
import DOMPurify from "dompurify";
import { SettingsSubsectionText } from "../../shared/SettingsSubsection";
import SdkConfig from "../../../../../SdkConfig";

const CHANGELOG_URL = "https://roadmap.elecord.app/";

const ChangelogUserSettingsTab: React.FC = () => {
    const [changelog, setChangelog] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // open external roadmap
    const onOpenChangelog = (): void => {
        window.open(CHANGELOG_URL, "_blank");
    };

    // fetch LATEST.md changelog
    const fetchChangelog = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("LATEST.md");
            if (!response.ok) throw new Error("failed to fetch changelog");

            // parse changelog as markdown
            const text = await response.text();
            const markdown = new Markdown(text);
            // sanitize HTML to prevent xss vulnerabilities
            setChangelog(DOMPurify.sanitize(markdown.toHTML({ externalLinks: true })));
        } catch (err) {
            console.error("failed to fetch changelog:", err);
            setError("failed to load changelog");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChangelog();
    }, []);

    if (isLoading) {
        return <div>{_t("settings|changelog|loading_changelog")}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <SettingsTab>
            <SettingsSection heading={_t("settings|changelog|latest_changes")}>
                <SettingsSubsectionText>
                    {_t("settings|changelog|description", { brand: SdkConfig.get("brand") })}
                </SettingsSubsectionText>
                {/* roadmap button */}
                <AccessibleButton kind="primary_outline" onClick={onOpenChangelog}>
                    {_t("settings|changelog|roadmap")}
                    <PopOutIcon height={20} width={20} />
                </AccessibleButton>
                {/* render changelog */}
                <div dangerouslySetInnerHTML={{ __html: changelog }} />
            </SettingsSection>
        </SettingsTab>
    );
};

export default ChangelogUserSettingsTab;
