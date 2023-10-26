import { minimatch } from "minimatch";

export class StatusPattern {
  raw: string;
  optional: boolean;

  constructor(raw: string) {
    if (raw.endsWith("?")) {
      this.optional = true;
      this.raw = raw.slice(0, -1).trim();
    } else {
      this.optional = false;
      this.raw = raw;
    }
  }

  match(x: string): boolean {
    return minimatch(x, this.raw);
  }

  matchAny(xs: string[]): boolean {
    for (const x of xs) {
      if (this.match(x)) {
        return true;
      }
    }

    return false;
  }
}
