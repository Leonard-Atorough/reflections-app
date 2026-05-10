import { arePropsEqual, isValidReflection, validateReflection } from "./Reflection";
import { generateMockReflections } from "@/__mocks__/mockReflections";

describe("Reflections type", () => {
  it("should validate a valid reflection object", () => {
    const validReflection = {
      id: "1",
      title: "My Reflection",
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      content: "This is a reflection.",
      contentFormat: "plaintext",
    };

    expect(() => validateReflection(validReflection)).not.toThrow();
    const result = validateReflection(validReflection);
    expect(result).toEqual(validReflection);
  });

  it.each([
    [null, "Reflection must be an object"],
    [undefined, "Reflection must be an object"],
    ["not an object", "Reflection must be an object"],
    [{}, "Reflection.id must be a non-empty string"],
    [
      { id: "", title: "Title", dateCreated: 1, dateUpdated: 1, content: "" },
      "Reflection.id must be a non-empty string",
    ],
    [
      { id: "1", title: "", dateCreated: 1, dateUpdated: 1, content: "" },
      "Reflection.title must be a non-empty string",
    ],
    [
      { id: "1", title: "A".repeat(201), dateCreated: 1, dateUpdated: 1, content: "" },
      "Reflection.title must not exceed 200 characters",
    ],
    [
      { id: "1", title: "Title", dateCreated: -1, dateUpdated: 1, content: "" },
      "Reflection.dateCreated must be a positive number (Unix timestamp)",
    ],
    [
      { id: "1", title: "Title", dateCreated: 1, dateUpdated: -1, content: "" },
      "Reflection.dateUpdated must be a positive number (Unix timestamp)",
    ],
    [
      { id: "1", title: "Title", dateCreated: 1, dateUpdated: 1, content: 123 },
      "Reflection.content must be a string",
    ],
    [
      { id: "1", title: "Title", dateCreated: 1, dateUpdated: 1, content: "A".repeat(50001) },
      "Reflection.content must not exceed 50,000 characters",
    ],
  ])("should throw an error for invalid reflection data %#", (input, expectedError) => {
    expect(() => validateReflection(input)).toThrow(expectedError);
  });

  it("should return true from isValidReflection for valid reflection data", () => {
    const validReflection = {
      id: "1",
      title: "My Reflection",
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      content: "This is a reflection.",
    };

    expect(() => isValidReflection(validReflection)).not.toThrow();
    expect(isValidReflection(validReflection)).toBe(true);
  });

  it("should return false from isValidReflection for invalid reflection data", () => {
    const invalidReflection = {
      id: "1",
      title: "", // Invalid title
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      content: "This is a reflection.",
    };

    expect(() => isValidReflection(invalidReflection)).not.toThrow();
    expect(isValidReflection(invalidReflection)).toBe(false);
  });
});

describe("arePropsEqual", () => {
  it("returns true when props are exactly the same", () => {
    const props = { reflection: generateMockReflections(1)[0] };
    expect(arePropsEqual(props, props)).toBe(true);
  });

  it("returns true when all reflection properties are equal", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: {
        ...prevProps.reflection,
        id: prevProps.reflection.id,
        title: prevProps.reflection.title,
        content: prevProps.reflection.content,
        dateUpdated: prevProps.reflection.dateUpdated,
        contentFormat: prevProps.reflection.contentFormat,
      },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(true);
  });

  it("returns false when id is different", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: { ...prevProps.reflection, id: "different-id" },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(false);
  });

  it("returns false when title is different", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: { ...prevProps.reflection, title: "Different Title" },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(false);
  });

  it("returns false when content is different", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: { ...prevProps.reflection, content: "Different content" },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(false);
  });

  it("returns false when dateUpdated is different", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: { ...prevProps.reflection, dateUpdated: Date.now() },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(false);
  });

  it("ignores dateCreated changes", () => {
    const prevProps = { reflection: generateMockReflections(1)[0] };
    const nextProps = {
      reflection: { ...prevProps.reflection, dateCreated: Date.now() },
    };
    expect(arePropsEqual(prevProps, nextProps)).toBe(true);
  });

  it("returns false when comparing completely different reflections", () => {
    const [reflection1, reflection2] = generateMockReflections(2);
    const prevProps = { reflection: reflection1 };
    const nextProps = { reflection: reflection2 };
    expect(arePropsEqual(prevProps, nextProps)).toBe(false);
  });
});
