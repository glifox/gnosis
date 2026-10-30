export const text = `# Welcome to Gnosis

A **WYSIWYG** markdown extension for *CodeMirror 6* that keeps markdown clean and intuitive.

## Key Features

- [x] **In-place formatting**: Rich preview without losing your markdown syntax
- [x] **Pretext line breaks**: Full control over formatting and wrapping
- [x] **Code blocks**: Syntax-highlighted code with language badges
- [ ] *More features in active development...*

### Quick Example

~~~typescript
import { EditorView } from "codemirror";
import { gnosis } from "@glifox/gnosis";

const view = new EditorView({
  extensions: [gnosis()],
  parent: document.querySelector(".editor")
});
~~~

> *"The advantage of gnosis is getting a rich-text preview while maintaining a seamless code-like editing flow."*

Give it a try — edit this text freely or visit the [Try Page](/pages/try/) for a full scratchpad!
`;
