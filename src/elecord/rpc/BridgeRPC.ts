/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { sendActivity } from "./SendRPC";

// elecord rpc: bridge - communicate with local erpc websocket server

export type Activity = {
    application_id: string;
    name: string;
    status: boolean;
    timestamps: {
        start: number;
        expire: number;
    };
};

export type RpcMessage = {
    activity: Activity;
};

export class BridgeRPC {
    private ws: WebSocket | null = null;
    private activity: Activity | null = null;
    private previousID: string = "";
    private reconnecting: boolean = false;
    private reconnectAttempt: number = 0;
    private readonly tenMinutes: number = 10 * 60 * 1000;
    private readonly fourMinutes: number = 4 * 60 * 1000;

    constructor() {
        this.initRPC();
    }

    private async initRPC() {

        logger.info("UserRPC: ⏳ Initializing websocket...");

        try {

            // connect to websocket server
            {
                this.ws = new WebSocket("ws://127.0.0.1:1337");
                this.reconnecting = false;

                this.ws.addEventListener("open", () => {
                    logger.info("UserRPC: ✅ Websocket connected");
                    this.reconnectAttempt = 0;
                });

                this.ws.addEventListener("error", (error) => {
                    logger.error("UserRPC: ❌ Websocket error:", error);
                    this.ws?.close();
                });

                this.ws.addEventListener("close", () => {
                    logger.warn("UserRPC: ⚠️ Websocket closed");
                    // end activity if active
                    if (this.activity?.status === true) {
                        sendActivity(this.endActivity(), this.previousID);
                        this.previousID = "";
                    }
                    this.reconnectRPC();
                });
            }

            this.ws.addEventListener("message", async (x) => {

                // receive new message
                let msg: RpcMessage;
                {
                    try {
                        // parse message
                        msg = JSON.parse(await x.data);

                        // handle empty activity
                        if (!msg.activity) {
                            logger.info("UserRPC: ✖️ Received end message");
                            sendActivity(this.endActivity(), this.previousID);
                            this.previousID = "";
                        } else {

                            // handle activity message
                            logger.debug("UserRPC: Received message");
                            this.activity = {
                                application_id: msg.activity.application_id,
                                name: msg.activity.name,
                                status: true,
                                timestamps: {
                                    start: msg.activity.timestamps.start,
                                    expire: this.activity?.timestamps?.expire || 0
                                }
                            };

                            // send activity
                            if (this.activity.timestamps.expire === 0) {
                                // new activity
                                logger.info("UserRPC: ✨ Sending new activity:", this.activity);
                                sendActivity(this.activity, this.previousID);
                                this.activity.timestamps.expire = Date.now() + this.tenMinutes;
                            } else if (Date.now() > this.activity.timestamps.expire) {
                                // previously sent activity expired
                                logger.info("UserRPC: ⌛ Previously sent activity expired");
                                sendActivity(this.activity, this.previousID);
                                this.activity.timestamps.expire = Date.now() + this.tenMinutes;
                            }
                            this.previousID = msg.activity.application_id;
                        }

                    } catch (e) {
                        logger.error("UserRPC: 🚫 Failed to parse RPC message:", e);
                        return;
                    }
                }
            });

        } catch (error) {
            logger.error("UserRPC: 💥 An unexpected error occurred:", error);
            this.ws?.close();
        }

    }

    private async reconnectRPC() {
        if (this.reconnecting) return

        this.reconnecting = true
        this.reconnectAttempt++

        setTimeout(async () => {
            logger.info("UserRPC: 🔄 Reconnecting websocket...")
            await this.initRPC()
            // exponential backoff delay, up to 4 minutes
        }, Math.min((15000 * this.reconnectAttempt), this.fourMinutes));
    }

    private endActivity() {
        if (this.activity) {
            // activity ended
            this.activity.status = false;
            return this.activity;
        } else {
            // activity was null
            // interpret as rpc disabled
            return this.activity = {
                application_id: "",
                name: "",
                status: false,
                timestamps: {
                    start: 0,
                    expire: 0,
                }
            };
        }
    }

    public getActivity() {
        return this.activity;
    }
}
