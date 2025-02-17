/**
 * Author: marijnh
 * Modified By: feraxhp 2025
 * Adapted from: https://codemirror.net/examples/decoration/#boolean-toggle-widgets
 */
export const mousedown = (e, view) => {
    let target = e.target /* as HTMLElement */

    if (
        target.nodeName === "INPUT" &&
        target.parentElement?.classList.contains("TaskMark")
    ) return toggleCheckbox(view, view.posAtDOM(target))

}

const toggleCheckbox = (view, pos) => {
    const from = pos - 2;
    const to = pos - 1;

    let before = view.state.doc.sliceString(Math.max(0, from), to)
    let change

    if (before === "x") change = { from, to, insert: " " }

    else
    if (before === " ") change = { from, to, insert: "x" }

    else return false

    view.dispatch({ changes: change })
    return true
}
