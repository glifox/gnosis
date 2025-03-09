import { syntaxTree } from "@codemirror/language";

export const hasSelection = (view, from, to) => {
    const selections = view.state.selection.ranges;
    
    for (let range of selections) {
        if ((range.from >= from && range.from <= to) ||
            (range.to >= from && range.to <= to) ||
            (range.from <= from && range.to >= to)) {
            return true;
        }
    }
    
    return false;
}

export const visibleNodes = ( view, iterator ) => {
    for (const { from, to } of view.visibleRanges) 
        syntaxTree(view.state).iterate({ ...iterator, from, to });
}


/**
    * Calculate the color of the layer above from the desired color, current background color, and opacity of the layer.
    * 
    * @param {Array<number>} color - Desired Color [R, G, B].
    * @param {Array<number>} background - Background Color [R, G, B].
    * @param {number} opacity - Upper layer opacity (0 a 1).
    * @param {number} minOpacity - Minimum opacity of the upper layer (0 a 1).
    * @returns {Array<number>} - Calculated color [R, G, B, A].
    * @throws Error if the opacity is 0, as the information of the upper layer is lost.
*/
export function unblendColor(color, background, opacity, minOpacity = 1) {
    if (opacity === 0)
        throw new Error("If the opacity is 0, the information of the upper layer is lost.");

    const computeColor = (alpha) => [
        (color[0] - (1 - alpha) * background[0]) / alpha,
        (color[1] - (1 - alpha) * background[1]) / alpha,
        (color[2] - (1 - alpha) * background[2]) / alpha,
    ];

    let alpha = opacity;
    let calcColor = computeColor(alpha);

    const adjustedOpacities = calcColor.map((channelValue, i) => {
        if (channelValue < 0 && background[i] > 0) return 1 - (calcColor[i] / background[i]);
        return opacity;
    });

    const requiredOpacity = Math.max(...adjustedOpacities);

    if (requiredOpacity > alpha) { 
        alpha = Math.min(requiredOpacity, minOpacity);
        color = computeColor(alpha);
    }

    calcColor = calcColor.map((c) => Math.round(c < 0 ? 0 : c));
    calcColor.push(alpha);
    
    return calcColor;
}
