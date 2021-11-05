import { typeOf } from "../src/type-of";

describe("typeOf", () => {
  it("should return the type of the value", () => {
    expect(typeOf(1)).toBe("number");
    expect(typeOf(1n)).toBe("bigint");
    expect(typeOf(true)).toBe("boolean");
    expect(typeOf("a")).toBe("string");
    expect(typeOf(() => {})).toBe("function");
    expect(typeOf(null)).toBe("null");
    expect(typeOf(undefined)).toBe("undefined");
    expect(typeOf(new Date())).toBe("date");
    expect(typeOf(new RegExp(""))).toBe("regexp");
    expect(typeOf(new Error())).toBe("error");
    expect(typeOf(new ArrayBuffer(0))).toBe("arraybuffer");
    expect(typeOf(new Int8Array(0))).toBe("int8array");
    expect(typeOf(new Uint8Array(0))).toBe("uint8array");
    expect(typeOf(new Uint8ClampedArray(0))).toBe("uint8clampedarray");
    expect(typeOf(new Int16Array(0))).toBe("int16array");
    expect(typeOf(new Uint16Array(0))).toBe("uint16array");
    expect(typeOf(new Int32Array(0))).toBe("int32array");
    expect(typeOf(new Uint32Array(0))).toBe("uint32array");
    expect(typeOf(new Float32Array(0))).toBe("float32array");
    expect(typeOf(new Float64Array(0))).toBe("float64array");
    expect(typeOf(new Map())).toBe("map");
    expect(typeOf(new Set())).toBe("set");
    expect(typeOf(new WeakMap())).toBe("weakmap");
    expect(typeOf(new WeakSet())).toBe("weakset");
    expect(typeOf(new Promise(() => {}))).toBe("promise");
    expect(typeOf(new DataView(new ArrayBuffer(0)))).toBe("dataview");
    expect(typeOf({foo: "bar"})).toBe("object");
  });
})
