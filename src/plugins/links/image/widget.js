import { WidgetType } from "@codemirror/view";

export class ImageWidget extends WidgetType {
    constructor(img, url = null, alt = "[image]") { 
        super();
        this.img = img;
        this.url = url;
        this.alt = alt;
    }

    toDOM() {
        let img = document.createElement("img");
        img.src = this.img;
        img.alt = this.alt;
        // img.style.maxWidth = "20%";
        img.style.minWidth = "100px";

        if (this.url) {
            let link = document.createElement("a");
            link.href = this.url;
            link.target = "_blank";
            link.classList.add("url");
            link.appendChild(img);
            return link;
        } else {
            return img;
        }
    }
    
    eq(other) { return this.img === other.img; }

    ignoreEvent() { return false }
}