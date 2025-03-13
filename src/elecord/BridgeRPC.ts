/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

import { logger } from "matrix-js-sdk/src/logger";

import { sendActivity } from "./SendRPC";

// elecord rpc bridge - communicates with the local game presence websocket server

export type Activity = {
    application_id: string;
    name: string;
    timestamps: {
        start: number;
    };
    elapsedTime: string;
};

export type RpcMessage = {
    activity: Activity;
};

export class BridgeRPC {
    private ws: WebSocket | null = null;
    private activity: Activity | null = null;
    private previousID: string = "";
    private delay: number = 15000;
    private reconnecting: boolean = false;
    private reconnectAttempt: number = 0;

    constructor() {
        this.initRPC();
    }

    private initRPC() {

        logger.info("elecord RPC: Initializing RPC web bridge...");

        try {

            // connect to websocket server
            {
                this.ws = new WebSocket("ws://127.0.0.1:1337");
                this.reconnecting = false;

                this.ws.onopen = () => {
                    logger.info("elecord RPC: Websocket connected");
                    this.reconnectAttempt = 0;
                };

                this.ws.onerror = (error) => {
                    logger.error("elecord RPC: Websocket error:", error);
                    this.ws?.close();
                };

                this.ws.onclose = () => {
                    logger.warn("elecord RPC: Websocket closed");
                    sendActivity(this.emptyActivity(), this.previousID);
                    this.previousID = "";
                    return this.reconnectRPC();
                };
            }

            this.ws.onmessage = (x) => {

                // receive new message
                let msg: RpcMessage;
                {
                    try {
                        // parse message
                        msg = JSON.parse(x.data);

                        // handle empty activity
                        if (!msg.activity) {
                            logger.debug("elecord RPC: Received empty activity");
                            sendActivity(this.emptyActivity(), this.previousID);
                            this.previousID = "";
                        } else {

                            // handle updated activity
                            logger.debug("elecord RPC: Received updated activity");
                            this.activity = msg.activity;

                            // calculate elapsed time
                            {
                                const timeInSeconds = (Date.now() - msg.activity.timestamps.start) / 1000;

                                let unit, divisor;
                                if (timeInSeconds < 60) {
                                    unit = "s";
                                    divisor = 1;
                                } else if (timeInSeconds < 3600) {
                                    unit = "m";
                                    divisor = 60;
                                } else {
                                    unit = "h";
                                    divisor = 3600;
                                }

                                const elapsedTime = `${Math.floor(timeInSeconds / divisor)}${unit}`;
                                logger.debug(`elecord RPC: Elapsed time [${elapsedTime}]`);
                                this.activity.elapsedTime = elapsedTime;
                            }

                            // send activity
                            sendActivity(this.activity, this.previousID);
                            this.previousID = msg.activity.application_id;
                        }

                    } catch (e) {
                        logger.error("elecord RPC: Failed to parse RPC message:", e);
                        return;
                    }
                }
            };

        } catch (error) {
            logger.error("elecord RPC: An unexpected error occurred:", error);
            this.ws?.close();
        }

    }

    private reconnectRPC() {
        if (this.reconnecting) return

        this.reconnecting = true
        this.reconnectAttempt++

        setTimeout(() => {
            logger.info("elecord RPC: Reconnecting websocket...")
            this.initRPC()
        }, (this.delay * this.reconnectAttempt));
    }

    private emptyActivity() {
        return this.activity = {
            application_id: "",
            name: "",
            timestamps: {
                start: 0
            },
            elapsedTime: ""
        }
    }

    public getActivity() {
        return this.activity;
    }
}

