import { StringReplacer } from "../src/string-replacer"

describe("StringReplacer", () => {
  const replacer = StringReplacer({ "Hello world": "Goodbye world" })

  it('replaces strings', () => {
    expect(replacer("Hello world")).toBe("Goodbye world")
  })

  it("leaves non-matching strings alone", () => {
    expect(replacer("Hello")).toBe("Hello")
  })
})
