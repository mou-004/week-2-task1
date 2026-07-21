# CLAUDE.md

## Project Rules

### React forms

* Forms must use controlled React inputs. Keep field values in one form-state object rather than creating unrelated state variables for every input.
* Reusable validation and normalization logic must live outside the component. For settings forms, update `src/settings.js` instead of adding validation rules directly inside JSX.
* User-entered names and email addresses must be trimmed before validation and before they are passed to the save function.

### Accessibility

* Every form control must have a visible `<label>` connected through matching `htmlFor` and `id` values.
* Invalid fields must set `aria-invalid="true"` and connect their error message through `aria-describedby`.
* Async success or failure messages must be exposed through an `aria-live` status region.
* Keyboard focus styles must remain visible. Do not remove browser focus indicators without providing a clear replacement.

### Submission behavior

* Async submit buttons must be disabled while a request is pending.
* Forms must use an immediate submission guard, such as a ref, when two submissions could occur before React updates state.
* A failed validation attempt must preserve all user-entered values.
* Do not reload the page during form submission.

### Testing and verification

* Every new form must test initial values, required validation, malformed input, successful submission, pending state, and duplicate-submit prevention.
* Tests must query controls by accessible roles or labels, using methods such as `getByRole` and `getByLabelText`.
* React Testing Library renders must be cleaned after every test through the shared test setup.
* Before completing a change, run `npm test`, `npm run lint`, and `npm run build`. Do not claim verification succeeded unless all three commands were actually run.
