import { getBtcPrice } from "@/services/publicdata/tokenInfo";
import { useState } from "react";

export default () => {
    const [btcPrice, setBtcPrice] = useState<number>(0);

    const getBtcUsdtPrice = async () => {
        const price = await getBtcPrice();
        if (price) {
            setBtcPrice(price);
        }
    }

    return {
        btcPrice,
        getBtcUsdtPrice,
    }

}