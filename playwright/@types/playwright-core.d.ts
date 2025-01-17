/*
Copyright 2024 New Vector Ltd.
Copyright 2024 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

declare module "playwright-core/lib/utils" {
    // This type is not public in playwright-core utils
    export function sanitizeForFilePath(filePath: string): string;
}
