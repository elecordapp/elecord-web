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

    constructor() {
        this.initRpcScript();
    }

    private initRpcScript() {
        let previousID = "";

        logger.info("elecord RPC: Initializing RPC web bridge");

        try {
            // connect to websocket server
            {
                this.ws = new WebSocket("ws://127.0.0.1:1337");

                this.ws.onopen = () => {
                    logger.info("elecord RPC: Websocket connected");
                };

                this.ws.onclose = () => {
                    logger.warn("elecord RPC: Websocket closed");
                    sendActivity(this.emptyActivity(), previousID);
                    previousID = "";
                };

                this.ws.onerror = (error) => {
                    logger.error("elecord RPC: Websocket error:", error);
                    sendActivity(this.emptyActivity(), previousID);
                    previousID = "";
                };
            }

            this.ws.onmessage = (x) => {

                // receive new message
                let msg: RpcMessage;
                {
                    try {
                        msg = JSON.parse(x.data);
                    } catch (e) {
                        logger.error("elecord RPC: Failed to parse RPC message:", e);
                        return;
                    }

                    // handle empty activity
                    if (!msg.activity) {
                        logger.debug("elecord RPC: Received empty activity");
                        sendActivity(this.emptyActivity(), previousID);
                        previousID = "";
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
                        sendActivity(this.activity, previousID);
                        previousID = msg.activity.application_id;
                    }
                }
            };

        } catch (error) {
            logger.error("elecord RPC: Failed to initialize websocket bridge:", error);
        }

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

