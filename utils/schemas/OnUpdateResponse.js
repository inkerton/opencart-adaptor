import { signRequest } from "../auth/cryptoUtils.js";

export const buildOnUpdatePayload = (context, orderMeta, message) => {
    const enrichedContext = {
        ...context,
        action: "on_update",
        bpp_id: process.env.BPP_ID,
        bpp_uri: process.env.BPP_URI,
        timestamp: new Date().toISOString()
    };

    const payload = {
        context: enrichedContext,
        message: {
            order: {
                id: orderMeta.id,
                state: orderMeta.state,
                provider: orderMeta.provider,
                fulfillments: message.order.fulfillments || [],
                payments: message.order.payments || [],
                items: orderMeta.items,
                billing: orderMeta.billing,
                quote: message.order.quote || {}
            }
        }
    };

    const { signature, digest, authHeader } = signRequest(payload);
    return { payload, signature, digest, authHeader };
};
