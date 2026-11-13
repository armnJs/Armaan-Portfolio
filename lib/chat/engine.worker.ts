/// <reference lib="webworker" />
import { pipeline, env, type FeatureExtractionPipeline } from "@xenova/transformers";

// Models come from the Hugging Face hub and are cached by the browser after first load.
env.allowLocalModels = false;

const MODEL = "Xenova/all-MiniLM-L6-v2";
let extractor: FeatureExtractionPipeline | null = null;
let docVecs: number[][] = [];
let docOwner: number[] = [];

const embed = async (texts: string[]) => {
  const out = await extractor!(texts, { pooling: "mean", normalize: true });
  return out.tolist() as number[][];
};
const dot = (a: number[], b: number[]) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
};

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data;
  try {
    if (msg.type === "init") {
      extractor = (await pipeline("feature-extraction", MODEL, {
        quantized: true,
        progress_callback: (p: { status: string; file?: string; progress?: number }) => {
          if (p.status === "progress" && p.file?.endsWith(".onnx"))
            self.postMessage({ type: "progress", progress: Math.round(p.progress ?? 0) });
        },
      })) as FeatureExtractionPipeline;
      // docs: [{ owner: factIndex, text }] — several phrasings per fact
      docOwner = msg.docs.map((d: { owner: number }) => d.owner);
      docVecs = await embed(msg.docs.map((d: { text: string }) => d.text));
      self.postMessage({ type: "ready", model: MODEL, vectors: docVecs.length, dims: docVecs[0].length });
    } else if (msg.type === "query") {
      const [q] = await embed([msg.text]);
      const best: Record<number, number> = {};
      docVecs.forEach((v, i) => {
        const s = dot(q, v);
        const o = docOwner[i];
        if (best[o] === undefined || s > best[o]) best[o] = s;
      });
      self.postMessage({ type: "result", id: msg.id, scores: best });
    }
  } catch (err) {
    self.postMessage({ type: "error", id: msg.id, message: String(err) });
  }
};
