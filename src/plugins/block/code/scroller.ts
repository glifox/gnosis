import { EditorSelection } from "@codemirror/state";
import { EditorView } from "codemirror";
import { scroller_class } from "./decorator";
import { getLineFont } from "../../breaks";

const padding = 12;
/**
 * Temporal implementation: 30.07.2026
 * The transaction dispatch is necesary to avoid the cursor from desapearing.
 * 
 * > This also bugs out because it just give you the head range.
 */
export const scrollHandler = EditorView.scrollHandler.of((view, range, options) => {
  
  const head = range.head;
  const domPos = view.domAtPos(head);
  const node = domPos.node.nodeType === 1 
    ? domPos.node as Element 
    : domPos.node.parentElement;

  // const font = 
  const wrapper = node?.closest(`.${scroller_class}`) as HTMLElement;
  
  if (wrapper) {
    const left_offset = parseInt(wrapper.dataset.offset ?? '0') * view.defaultCharacterWidth;
    const wrapperRect = wrapper.getBoundingClientRect();
    
    const lb = view.lineBlockAt(head);
    // console.log(lb)
    const count = head - lb.from;
    
    const length = (count * view.defaultCharacterWidth) + options.xMargin + padding;
    
    let moved = false
    if (length > wrapperRect.right + wrapper.scrollLeft) {
      const scrollLeft = length - wrapperRect.right + options.xMargin;
      wrapper.scrollLeft = scrollLeft;
      moved = true
    }
    else
    
    if (length < (wrapper.scrollLeft + padding + left_offset)) {
      const scrollLeft = length - options.xMargin - padding - left_offset;
      wrapper.scrollLeft = scrollLeft;
      moved = true
    }
    
    if (moved) requestAnimationFrame(() => {
      view.dispatch({
        selection: EditorSelection.create(view.state.selection.ranges)
      })
    })
    
    return moved;
  }
  
  return false;
});
