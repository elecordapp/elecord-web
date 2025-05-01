/*
Copyright 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import { _t } from "../../../../../languageHandler";

import PopOutIcon from "@vector-im/compound-design-tokens/assets/web/icons/pop-out";

import SettingsTab from "../SettingsTab";
import { SettingsSection } from "../../shared/SettingsSection";
import AccessibleButton from "../../../elements/AccessibleButton";
import { SettingsSubsectionText } from "../../shared/SettingsSubsection";

const ERPC_URL = "https://packages.elecord.app/rpc/install/win32/x64/elecord-rpc-win.exe";

const RichPresenceUserSettingsTab: React.FC = () => {

    // download external erpc app
    const onDownloadClick = (): void => {
        window.open(ERPC_URL, "_blank");
    };

    return (
        <SettingsTab>
            <SettingsSection heading={_t("settings|rich_presence|setup_heading")}>

                {/* description */}
                <SettingsSubsectionText>
                    {_t("settings|rich_presence|description")}
                </SettingsSubsectionText>

                {/* usage */}
                <SettingsSubsectionText>
                    {_t("settings|rich_presence|usage")}
                </SettingsSubsectionText>

                {/* setup steps */}
                <SettingsSubsectionText>
                    {_t("settings|rich_presence|setup_steps")}
                </SettingsSubsectionText>

                {/* sending notice */}
                <div className="mx_SettingsFlag_microcopy">
                    {_t("settings|rich_presence|sending_notice")}
                </div>

                {/* download button */}
                <AccessibleButton kind="primary_outline" onClick={onDownloadClick}>
                    {_t("settings|rich_presence|download_button")}
                    <PopOutIcon height={20} width={20} />
                </AccessibleButton>

                {/* detection notice */}
                <div className="mx_SettingsFlag_microcopy">
                    {_t("settings|rich_presence|detection_notice")}
                </div>

            </SettingsSection>
        </SettingsTab>
    );
};

export default RichPresenceUserSettingsTab;
