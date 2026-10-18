import { Component, type ReactNode } from "react";
export class CbcBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className="rounded border p-4 text-sm">
        CBC panel unavailable. Your other consultation tools remain available.
        Reload to retry.
      </div>
    ) : (
      this.props.children
    );
  }
}
