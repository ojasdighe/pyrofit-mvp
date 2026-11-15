# Fix pass: dead modal mounts, Hero prop contract, hasCalculated intent

This commit resolves the three blocking findings from the prior `CHANGES_REQUESTED` review. The three modals that were previously imported and state-wired but never rendered (`SamplePlansModal`, `EventCatalogueModal`, `ComparePlansModal`) are now mounted in `App.tsx`'s modal block alongside the existing modals. The `onOpenPyrofit` prop on `Hero.tsx` is now required (non-optional), and the conditional render guard on the "OPEN PYROFIT" button is removed. The `hasCalculated` persistence behaviour is unchanged but now carries an explicit code comment recording the design decision. The build passes with 0 TypeScript errors per the commit message.

Watch for: nothing blocking — all three prior findings are addressed. The `hasCalculated` flag still never resets, but this is now a documented decision (no profile-deletion UI exists) rather than an unexamined gap.

**Verdict**: APPROVED

---

## High-level view

The three dead modal mounts are the substance of this commit. `SamplePlansModal`, `EventCatalogueModal`, and `ComparePlansModal` are now rendered in JSX using the same `isOpen` / `onClose` pattern as `FuelSchemesModal`. `ComparePlansModal` additionally receives `initialTab` to route to the correct tab from different callsites — `compareInitialTab` was already being set by the three handler functions in the prior commit, so tab routing works correctly now that the modal is mounted.

The `onOpenPyrofit` change is a one-line prop tightening: `?` removed from the interface, the conditional `{onOpenPyrofit ? <button> : null}` replaced with an unconditional `<button>`. Since `App.tsx` is the only callsite and already passes the prop, there is no runtime behaviour change — the fix is TypeScript enforcing the contract at compile time for any future callsite.

The `hasCalculated` comment clarifies a gate that looked like it might be a bug: the flag unlocks advanced features after the first calculation, is stored in `localStorage`, and intentionally stays set even if a profile is updated, because there is no profile-deletion flow in the current UI.

---

<details>
<summary>Issues (0)</summary>

No open issues. All findings from the prior review pass have been resolved.

</details>

<details>
<summary>Details</summary>

### Three modal mounts complete the wire-up

This commit adds the three JSX mount points that were missing in the prior pass:

```tsx
<SamplePlansModal
  isOpen={samplePlansOpen}
  onClose={() => setSamplePlansOpen(false)}
  onOpenGenerator={handleOpenGenerator}
/>

<EventCatalogueModal
  isOpen={eventCatalogueOpen}
  onClose={() => setEventCatalogueOpen(false)}
/>

<ComparePlansModal
  isOpen={comparePlansOpen}
  onClose={() => setComparePlansOpen(false)}
  initialTab={compareInitialTab}
/>
```

`compareInitialTab` is set by `handleOpenCompareMethods`, `handleOpenShoeComparisons`, and `handleOpenWatchComparisons`, which were already routing correctly — the tab state just had nowhere to go until now.

</details>

---

<details>
<summary>Files changed</summary>

| File | What changed |
|------|-------------|
| `src/App.tsx` | Mounts `SamplePlansModal`, `EventCatalogueModal`, `ComparePlansModal` in the JSX modal block |
| `src/components/Hero.tsx` | `onOpenPyrofit` changed from optional to required; conditional render guard removed |
| `src/components/pyrofit/PyrofitHub.tsx` | Code comment added documenting the `hasCalculated` persistence decision |

Full diff: `git -C <repo> diff HEAD~1..HEAD`

</details>
