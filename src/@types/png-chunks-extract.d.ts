/*
Copyright 2024 New Vector Ltd.
Copyright 2021 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

declare module "png-chunks-extract" {
    interface IChunk {
        name: string;
        data: Uint8Array;
    }

    function extractPngChunks(data: Uint8Array): IChunk[];

    export default extractPngChunks;
}
