function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateSchema(
  value: unknown,
  schema: Record<string, unknown>,
  path = "$",
): string[] {
  const issues: string[] = [];
  const expectedType = typeof schema.type === "string" ? schema.type : null;

  if (expectedType) {
    if (expectedType === "object" && !isRecord(value)) {
      issues.push(`${path} should be an object.`);
      return issues;
    }
    if (expectedType === "array" && !Array.isArray(value)) {
      issues.push(`${path} should be an array.`);
      return issues;
    }
    if (expectedType === "string" && typeof value !== "string") {
      issues.push(`${path} should be a string.`);
      return issues;
    }
    if (expectedType === "number" && typeof value !== "number") {
      issues.push(`${path} should be a number.`);
      return issues;
    }
    if (expectedType === "integer" && (!Number.isInteger(value) || typeof value !== "number")) {
      issues.push(`${path} should be an integer.`);
      return issues;
    }
    if (expectedType === "boolean" && typeof value !== "boolean") {
      issues.push(`${path} should be a boolean.`);
      return issues;
    }
  }

  if (Array.isArray(schema.required) && isRecord(value)) {
    for (const key of schema.required) {
      if (typeof key === "string" && !(key in value)) {
        issues.push(`${path}.${key} is required.`);
      }
    }
  }

  if (isRecord(schema.properties) && isRecord(value)) {
    for (const [key, propertySchema] of Object.entries(schema.properties)) {
      if (!(key in value)) {
        continue;
      }

      if (isRecord(propertySchema)) {
        issues.push(...validateSchema(value[key], propertySchema, `${path}.${key}`));
      }
    }
  }

  if (Array.isArray(value) && isRecord(schema.items)) {
    value.forEach((item, index) => {
      issues.push(...validateSchema(item, schema.items as Record<string, unknown>, `${path}[${index}]`));
    });
  }

  return issues;
}
