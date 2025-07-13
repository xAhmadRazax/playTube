export interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: unknown[];
}

export interface TipTapDocument {
  type: "doc";
  content: TipTapNode[];
}
