import { EditorView } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { flavors } from "@catppuccin/palette";
import { unblendColor } from "../plugins/common/usefull";

console.log(flavors);
export const themeVariant = new Compartment();

export const catppuccin = (flavor = "latte") => {
    const colors = flavors[flavor].colors;
    console.log(colors);
    
    const base = colors.base;
    const text = (flavor === "latte")  ? "#484b64" : colors.text.hex;
    const codebg = calcBackground(colors.crust.rgb, base.rgb, .1);
    
    return EditorView.theme({
        /* Editor */ 
        "&": { 
            backgroundColor: base.hex,
            color: text
        },
        "&.cm-focused .cm-cursor": { borderLeftColor: colors.rosewater.hex },
        "& .cm-selectionBackground": { background: `${rgba(colors.overlay2.rgb, .3)} !important` },
        
        /* Code */
        "& .cb-content, & .ic": { backgroundColor: codebg },
        
        /* List */
        "& .lm.bl::before": { backgroundColor: text },
    }, { dark: (flavor !== "latte") })
}

const calcBackground = (rgb, rgbb, opacity) => {
    const desired = [rgb.r, rgb.g, rgb.b];
    const background = [rgbb.r, rgbb.g, rgbb.b];
    
    const final = unblendColor(desired, background, opacity, .3);
    
    return `rgba(${final.join(", ")})`;
}

const rgba = (rgb, a) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
