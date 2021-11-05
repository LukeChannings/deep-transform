import { typeOf, Type } from "./type-of";

type Options = { [key in Type]?: (value: any, ctx: Context) => any };
type Context = { keyPath: any[]; type?: Type; isKey: boolean; key?: unknown };

/**
 * Create a deep copy of the input, transforming the values as specified.
 * @param input {any} The input to transform.
 * @param transformMap {Options} The map of types to transform functions.
 * @param ctx {Context} The context of the current transformation. You should not pass this unless you know what you're doing.
 * @returns
 */
export function transform(
  input: unknown,
  transformMap: Options,
  _ctx: Context = { keyPath: [], isKey: false }
): unknown {
  const transformFn = transformMap[typeOf(input)];
  const transformedInput = transformFn
    ? transformFn(input as any, _ctx)
    : input;
  const type = typeOf(transformedInput);

  if (type === "object") {
    let transformedObject: { [key: string]: any } = {};
    let objCtx = { type, keyPath: [..._ctx.keyPath] };
    for (const [key, value] of Object.entries(transformedInput)) {
      const transformedKey = transform(key, transformMap, {
        ...objCtx,
        isKey: true,
      });
      transformedObject[transformedKey as string] = transform(
        value,
        transformMap,
        {
          ...objCtx,
          keyPath: [...objCtx.keyPath, key],
          isKey: false,
          type: typeOf(value),
          key: transformedKey,
        }
      );
    }
    return transformedObject;
  }

  if (transformedInput instanceof Map) {
    let transformedObject = new Map();
    let objCtx = { type, keyPath: [..._ctx.keyPath] };
    for (const [key, value] of transformedInput) {
      const transformedKey = transform(key, transformMap, {
        ...objCtx,
        isKey: true,
      });
      transformedObject.set(
        transformedKey as string,
        transform(value, transformMap, {
          ...objCtx,
          keyPath: [...objCtx.keyPath, key],
          isKey: false,
          key: transformedKey,
        })
      );
    }
    return transformedObject;
  }

  if (type === "array") {
    return transformedInput.map((value: any, index: number) => {
      return transform(value, transformMap, {
        keyPath: [..._ctx.keyPath, index],
        type,
        isKey: false,
      });
    });
  }

  if (transformedInput instanceof Set) {
    let transformedSet = new Set();
    for (const value of transformedInput) {
      transformedSet.add(
        transform(value, transformMap, {
          keyPath: [..._ctx.keyPath],
          type,
          isKey: false,
        })
      );
    }
    return transformedSet;
  }

  return transformedInput;
}
