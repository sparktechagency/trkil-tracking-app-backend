import { randomBytes } from "crypto";
export const generateTxid = () => {
    const prefix = "tx_";
    const uniqueId = randomBytes(8).toString("hex");
    return `${prefix}${uniqueId}`;
}