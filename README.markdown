# Transform Tools

This project provides some tools for transforming data structures.

Here are some examples:

- Replace all instances of `"something"` in a deeply nested object.
- Remove the nth item from a specific array
- Delete a specific key from all objects

"Why would I need a function to do this?", you might ask. Well, most of the time your editor will be more than adequate. But if you have a set of transformations that are more complicated or time consuming, this tool might save you some time.

## Examples

```javascript
import { transform } from "transform-tools";

const someData = {
  lang: "fr"
}

transform(
  someData,
  {
    string: (value, { key }) => key === "lang" && value === "fr" ? "en": value
  }
)
```
