// Only a boolean is shared with the shell; report contents never leave the panel.
let hasUnsavedCbc = false;
export function setCbcUnsaved(value: boolean) {
  hasUnsavedCbc = value;
}
export function confirmCbcNavigation(): boolean {
  if (!hasUnsavedCbc) return true;
  if (
    !window.confirm("Discard unsaved CBC changes and leave this consultation?")
  )
    return false;
  hasUnsavedCbc = false;
  return true;
}
