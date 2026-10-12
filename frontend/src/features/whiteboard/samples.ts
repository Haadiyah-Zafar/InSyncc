import type { BoardObject } from "./model";

// Explicit UI fixtures; never presented as generated or retrieved course material.
export const SAMPLE_CODE = `total = 0
for number in range(1, 4):
    total += number
print(total)

# Predict the output. Explain each step.`;
export const SAMPLE_ACTIVITY =
  "Let’s trace a Python loop. Predict the output, then add a note with your reasoning. You can circle the code with the Ask tool to try a sample explanation.";
export function sampleExplanation(objects: BoardObject[]): string {
  if (
    objects.length === 1 &&
    objects[0].kind === "code" &&
    objects[0].content === SAMPLE_CODE
  ) {
    return "range(1, 4) produces 1, 2, and 3: the stop value 4 is excluded. Each iteration adds number to total, giving 1, then 3, then 6. The final print displays 6. Try changing the stop value and trace the loop again.";
  }
  return `You selected ${objects.length} structured object${objects.length === 1 ? "" : "s"}. This sample confirms the selection reached the tutor panel; it does not interpret your content. Live, course-grounded explanations will be connected in the Tutor/RAG integration.`;
}
