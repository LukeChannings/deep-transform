export type Type =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "function"
  | "symbol"
  | "undefined"
  | "bigint"
  | "null"
  | string;

export const typeOf = (value: unknown): Type => {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  if (
    typeof value === "object" &&
    Object.getPrototypeOf(value) === Object.prototype
  )
    return "object";
  if (typeof value === "object") {
    const ctor = Object.getPrototypeOf(value).constructor;
    return ctor ? ctor.name.toLowerCase() : "instance";
  }
  return typeof value;
};
