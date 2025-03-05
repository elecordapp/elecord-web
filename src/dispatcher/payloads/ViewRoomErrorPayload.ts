/*
Copyright 2024 New Vector Ltd.
Copyright 2022 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import { type MatrixError, type Room } from "matrix-js-sdk/src/matrix";

import { type ActionPayload } from "../payloads";
import { type Action } from "../actions";

export interface ViewRoomErrorPayload extends Pick<ActionPayload, "action"> {
    action: Action.ViewRoomError;
    // eslint-disable-next-line camelcase
    room_id: Room["roomId"] | null;
    // eslint-disable-next-line camelcase
    room_alias?: string;
    err?: MatrixError;
}
