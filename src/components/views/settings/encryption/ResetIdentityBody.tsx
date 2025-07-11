/*
 * Copyright 2024-2025 New Vector Ltd.
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
 * Please see LICENSE files in the repository root for full details.
 */

import { Button, InlineSpinner, VisualList, VisualListItem } from "@vector-im/compound-web";
import CheckIcon from "@vector-im/compound-design-tokens/assets/web/icons/check";
import InfoIcon from "@vector-im/compound-design-tokens/assets/web/icons/info";
import ErrorIcon from "@vector-im/compound-design-tokens/assets/web/icons/error-solid";
import React, { type JSX, useState, type MouseEventHandler } from "react";

import { _t } from "../../../../languageHandler";
import { EncryptionCard } from "./EncryptionCard";
import { uiAuthCallback } from "../../../../CreateCrossSigning";
import { EncryptionCardButtons } from "./EncryptionCardButtons";
import { EncryptionCardEmphasisedContent } from "./EncryptionCardEmphasisedContent";
import { useMatrixClientContext } from "../../../../contexts/MatrixClientContext";

interface ResetIdentityBodyProps {
    /**
     * Called when the identity is reset.
     */
    onFinish: MouseEventHandler<HTMLButtonElement>;
    /**
     * Called when the cancel button is clicked.
     */
    onCancelClick: () => void;

    /**
     * The variant of the panel to show. We show more warnings in the 'compromised' variant (no use in showing a user
     * this warning if they have to reset because they no longer have their key)
     */
    variant: ResetIdentityBodyVariant;
}

/**
 * "compromised" is shown when the user chooses 'reset' explicitly in settings, usually because they believe their
 * identity has been compromised.
 *
 * "sync_failed" is shown when the user tried to recover their identity but the process failed, probably because
 * the required information is missing from recovery.
 *
 * "forgot" is shown when the user has just forgotten their passphrase.
 */
export type ResetIdentityBodyVariant = "compromised" | "forgot" | "sync_failed";

/**
 * User interface component allowing the user to reset their cryptographic identity.
 *
 * Used by {@link ResetIdentityPanel}.
 */
export function ResetIdentityBody({ onCancelClick, onFinish, variant }: ResetIdentityBodyProps): JSX.Element {
    const matrixClient = useMatrixClientContext();

    // After the user clicks "Continue", we disable the button so it can't be
    // clicked again, and warn the user not to close the window.
    const [inProgress, setInProgress] = useState(false);

    return (
        <EncryptionCard Icon={ErrorIcon} destructive={true} title={titleForVariant(variant)}>
            <EncryptionCardEmphasisedContent>
                <VisualList>
                    <VisualListItem Icon={CheckIcon} success={true}>
                        {_t("settings|encryption|advanced|breadcrumb_first_description")}
                    </VisualListItem>
                    <VisualListItem Icon={InfoIcon}>
                        {_t("settings|encryption|advanced|breadcrumb_second_description")}
                    </VisualListItem>
                    <VisualListItem Icon={InfoIcon}>
                        {_t("settings|encryption|advanced|breadcrumb_third_description")}
                    </VisualListItem>
                </VisualList>
                {variant === "compromised" && <span>{_t("settings|encryption|advanced|breadcrumb_warning")}</span>}
            </EncryptionCardEmphasisedContent>
            <EncryptionCardButtons>
                <Button
                    destructive={true}
                    disabled={inProgress}
                    onClick={async (evt) => {
                        setInProgress(true);
                        await matrixClient
                            .getCrypto()
                            ?.resetEncryption((makeRequest) => uiAuthCallback(matrixClient, makeRequest));
                        onFinish(evt);
                    }}
                >
                    {inProgress ? (
                        <>
                            <InlineSpinner /> {_t("settings|encryption|advanced|reset_in_progress")}
                        </>
                    ) : (
                        _t("action|continue")
                    )}
                </Button>
                {inProgress ? (
                    <EncryptionCardEmphasisedContent>
                        <span className="mx_ResetIdentityPanel_warning">
                            {_t("settings|encryption|advanced|do_not_close_warning")}
                        </span>
                    </EncryptionCardEmphasisedContent>
                ) : (
                    <Button kind="tertiary" onClick={onCancelClick}>
                        {_t("action|cancel")}
                    </Button>
                )}
            </EncryptionCardButtons>
        </EncryptionCard>
    );
}

function titleForVariant(variant: ResetIdentityBodyVariant): string {
    switch (variant) {
        case "compromised":
            return _t("settings|encryption|advanced|breadcrumb_title");
        case "sync_failed":
            return _t("settings|encryption|advanced|breadcrumb_title_sync_failed");

        default:
        case "forgot":
            return _t("settings|encryption|advanced|breadcrumb_title_forgot");
    }
}
