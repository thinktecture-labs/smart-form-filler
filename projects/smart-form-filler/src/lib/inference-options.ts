export interface InferenceOptions {
  /**
   * The model to use. If not specified, the model backend will use its default model.
   */
  model?: string;

  /**
   * The temperature to use, exact values depend on the model used.
   */
  temperature?: number;

  /**
   * The base URL for the OpenAI SDK.
   */
  baseURL?: string;
}
