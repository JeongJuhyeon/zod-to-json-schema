import { ZodLiteralDef } from "zod";
import { Refs } from "../Refs.js";
import { JsonSchema7NullType, parseNullDef } from "./null.js";

export type JsonSchema7LiteralType =
  | {
      type: "string" | "number" | "integer" | "boolean";
      const: string | number | boolean;
    }
  | {
      type: "object" | "array";
    }
  | JsonSchema7NullType;

export function parseLiteralDef(
  def: ZodLiteralDef,
  refs: Refs,
): JsonSchema7LiteralType {
  const parsedType = typeof def.value;

  if (def.value === null) {
    return parseNullDef(refs);
  }

  if (
    parsedType !== "bigint" &&
    parsedType !== "number" &&
    parsedType !== "boolean" &&
    parsedType !== "string"
  ) {
    return {
      type: Array.isArray(def.value) ? "array" : "object",
    };
  }

  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value],
    } as any;
  }

  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value,
  };
}
