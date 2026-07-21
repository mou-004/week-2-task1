# AI Workflow Comparison

## Approach

I built the same React settings form in two independent branches. The first branch, `feat/settings-form-vague`, used one short prompt: “Add a settings form with validation to this React app.” I accepted the generated approach without giving file references, detailed behavior, accessibility requirements, or a testing plan. The second branch, `feat/settings-form-specified`, started from `main` in a fresh session. The prompt defined the fields, validation rules, accessibility requirements, asynchronous behavior, edge cases, and verification commands.

## Correctness and Edge Cases

The vague version stored the form directly inside `App.jsx`. It checked that the name was not empty and considered an email valid when it contained `@`. It did not include a time-zone field, async saving, duplicate-submit protection, or failure handling.

The specified version moved validation and normalization into `src/settings.js`. Display names are trimmed and must contain 2–50 characters. Email values are trimmed and checked with an email pattern, while the time zone is required. The submit handler uses both `isSubmitting` and a `submittingRef` guard, preventing two rapid submissions before React finishes updating the button state.

## Accessibility

Both versions use visible labels, but the specified version gives invalid fields `aria-invalid`, connects errors through `aria-describedby`, labels the form with its heading, and announces save results through a live status region. The Save button also changes to “Saving…” and becomes disabled while the async request is pending.

## Verification and Review Effort

Round one took **[add minutes]** to generate and **[add minutes]** to review or fix. Round two took **[add minutes]** for planning and implementation and **[add minutes]** for review or fixes. Round two required more setup because Vitest and Testing Library were added, but it produced six focused tests covering initial values, required fields, invalid email, normalized submission, disabled state, and duplicate submissions.

## AI Mistake Caught

The initial test setup did not clean rendered components between tests. Multiple forms accumulated in the DOM, causing five tests to fail because `getByRole` found more than one matching form. I fixed this by adding `afterEach(cleanup)` in `src/test/setup.js`. After the fix, all six tests passed, lint reported no errors, and the production build succeeded.

## Lessons

A detailed specification made correctness measurable. Future AI tasks should include repository context, exact constraints, accessibility expectations, edge cases, and commands the AI must run before claiming completion.
