import { InferenceOptions } from '../inference-options';

export abstract class ModelBackend<TParams> {
  abstract generate(params: TParams, options?: InferenceOptions): Promise<string | null | undefined>;
}
