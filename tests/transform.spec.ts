import { transform } from "../src/transform";

describe("deepTransform", () => {
  it("can replace strings", () => {
    expect(transform("foo", { string: () => "bar" })).toBe("bar");
  });

  it("can replace numbers", () => {
    expect(transform(10, { number: () => 15 })).toBe(15);
  });

  it("can replace instances", () => {
    expect(
      transform([/foo/, new Date()], {
        regexp: () => /bar/,
      })
    ).toEqual([/bar/, new Date()]);
  });

  it("can replace booleans", () => {
    expect(transform(true, { boolean: () => false })).toBe(false);
  });
  it("can replace objects", () => {
    expect(
      transform({ foo: "bar" }, { object: () => ({ bar: "baz" }) })
    ).toEqual({ bar: "baz" });
  });
  it("can replace arrays", () => {
    expect(
      transform(["a", "b", "c"], { array: () => ["d", "e", "f"] })
    ).toEqual(["d", "e", "f"]);
  });

  it("can replace functions", () => {
    const fa = () => {};
    const fb = () => {};
    expect(transform(fa, { function: () => fb })).toBe(fb);
  });
  it("can replace symbols", () => {
    const symbolA = Symbol("a");
    const symbolB = Symbol("b");
    expect(transform(symbolA, { symbol: () => symbolB })).toBe(symbolB);
  });
  it("can replace undefined", () => {
    expect(transform(undefined, { undefined: () => null })).toBe(null);
  });
  it("can replace nulls", () => {
    expect(transform(null, { null: () => undefined })).toBe(undefined);
  });
  it("can replace bigints", () => {
    expect(transform(1234n, { bigint: () => 1234 })).toBe(1234);
  });

  it("can replace within objects", () => {
    expect(
      transform(
        {
          foo: "bar",
          baz: {
            qux: "quux",
          },
        },
        {
          string: (val, { isKey }) => (isKey ? val : "baz"),
        }
      )
    ).toEqual({
      foo: "baz",
      baz: {
        qux: "baz",
      },
    });
  });

  it("can replace object keys", () => {
    expect(
      transform(
        {
          foo: "bar",
          baz: {
            qux: "quux",
          },
        },
        {
          string: (input, ctx) => {
            if (ctx.isKey) return input + "baz";
            return "baz";
          },
        }
      )
    ).toEqual({
      foobaz: "baz",
      bazbaz: {
        quxbaz: "baz",
      },
    });
  });

  it("can replace within Maps", () => {
    expect(
      transform(
        new Map<string, any>([
          ["foo", "bar"],
          ["baz", new Map([["qux", "quux"]])],
        ]),
        {
          string: (val, { isKey }) => (isKey ? val : "baz"),
        }
      )
    ).toEqual(
      new Map<string, any>([
        ["foo", "baz"],
        ["baz", new Map([["qux", "baz"]])],
      ])
    );
  });

  it("can replace within arrays", () => {
    expect(transform(["foo", "bar", "baz"], { string: () => "baz" })).toEqual([
      "baz",
      "baz",
      "baz",
    ]);
  });

  it("can replace within Sets", () => {
    expect(
      transform(new Set(["foo", "bar", "baz"]), { string: () => "baz" })
    ).toEqual(new Set(["baz"]));
  });

  it("calls the transform function with the full key path", () => {
    const spy = jest.fn();
    transform(
      {
        a: {
          b: {
            c: "efg",
          },
        },
      },
      {
        string: spy,
      }
    );
    expect(spy).toHaveBeenNthCalledWith(1, "a", {
      isKey: true,
      keyPath: [],
      type: "object",
    });
    expect(spy).toHaveBeenNthCalledWith(2, "b", {
      isKey: true,
      keyPath: ["a"],
      type: "object",
    });
    expect(spy).toHaveBeenNthCalledWith(3, "c", {
      isKey: true,
      keyPath: ["a", "b"],
      type: "object",
    });
    expect(spy).toHaveBeenNthCalledWith(4, "efg", {
      isKey: false,
      keyPath: ["a", "b", "c"],
      type: "string",
    });
  });

  it("Calls transform with the key in context", () => {
    expect(
      transform(
        {
          lang: "fr",
        },
        {
          string: (value, { key }) =>
            key === "lang" && value === "fr" ? "en" : value,
        }
      )
    ).toEqual({
      lang: "en",
    });

    expect(
      transform(new Map([["lang", "fr"]]), {
        string: (value, { key }) =>
          key === "lang" && value === "fr" ? "en" : value,
      })
    ).toEqual(new Map([["lang", "en"]]));
  });
});
