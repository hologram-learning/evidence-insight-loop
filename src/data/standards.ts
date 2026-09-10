import type { PrerequisiteRelation, Standard } from "@/types/domain";

export const STANDARDS: Standard[] = [
  {
    id: "std-6eea3",
    code: "6.EE.A.3",
    label: "Apply the properties of operations to generate equivalent expressions.",
    cluster: "Expressions and Equations",
  },
  {
    id: "std-6eea2",
    code: "6.EE.A.2",
    label: "Write, read, and evaluate expressions in which letters stand for numbers.",
    cluster: "Expressions and Equations",
  },
  {
    id: "std-5oa1",
    code: "5.OA.A.1",
    label: "Use parentheses and brackets in numerical expressions and evaluate them.",
    cluster: "Operations and Algebraic Thinking",
  },
  {
    id: "std-4nbt5",
    code: "4.NBT.B.5",
    label: "Multiply a whole number by a multi-digit number using place value strategies.",
    cluster: "Number and Operations in Base Ten",
  },
  {
    id: "std-6eeb7",
    code: "6.EE.B.7",
    label: "Solve real-world problems by writing and solving equations of the form x + p = q and px = q.",
    cluster: "Expressions and Equations",
  },
];

export const PREREQUISITES: PrerequisiteRelation[] = [
  {
    fromCode: "5.OA.A.1",
    toCode: "6.EE.A.3",
    description: "Grouping symbols must be interpreted before properties can be applied.",
  },
  {
    fromCode: "4.NBT.B.5",
    toCode: "5.OA.A.1",
    description: "Multiplicative reasoning underpins evaluating grouped expressions.",
  },
  {
    fromCode: "6.EE.A.2",
    toCode: "6.EE.A.3",
    description: "Reading expressions with variables precedes rewriting them equivalently.",
  },
  {
    fromCode: "6.EE.A.3",
    toCode: "6.EE.B.7",
    description: "Equivalent expressions are required before solving one-step equations reliably.",
  },
];

export function standardByCode(code: string): Standard | undefined {
  return STANDARDS.find((standard) => standard.code === code);
}
