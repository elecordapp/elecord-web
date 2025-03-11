/*
Copyright (c) 2025 hazzuk.

SPDX-License-Identifier: AGPL-3.0-only
Please see LICENSE files in the repository root for full details.
*/

// elecord rpc bridge - communicates with the local game presence websocket server

import { logger } from "matrix-js-sdk/src/logger";

export type Activity = {
    application_id: string;
    name: string;
    timestamps: {
        start: number;
    };
    elapsedTime?: string;
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
        logger.info("elecord RPC: Initializing RPC web bridge");

        try {
            // connect to rpc server websocket
            this.ws = new WebSocket("ws://127.0.0.1:1337");

            this.ws.onopen = () => {
                logger.info("elecord RPC: Websocket connection established");
            };

            this.ws.onclose = () => {
                logger.warn("elecord RPC: Websocket connection closed");
            };

            this.ws.onerror = (error) => {
                logger.error("elecord RPC: Websocket error:", error);
            };

            this.ws.onmessage = (x) => {
                let msg: RpcMessage;
                try {
                    msg = JSON.parse(x.data);
                } catch (e) {
                    logger.error("elecord RPC: Failed to parse RPC message:", e);
                    return;
                }

                if (!msg.activity) {
                    logger.debug("elecord RPC: Received RPC message without activity", msg);
                    return;
                }

                // log activity
                this.activity = msg.activity;
                logger.info(`elecord RPC: Activity ["${msg.activity.name}"] (start: ${msg.activity.timestamps.start})`);

                // log time elapsed
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
                logger.info(`elecord RPC: Elapsed time [${elapsedTime}]`);

                this.activity.elapsedTime = elapsedTime;
            };
        } catch (error) {
            logger.error("elecord RPC: Failed to initialize websocket bridge:", error);
        }
    }

    public getActivity() {
        return this.activity;
    }
}

