export interface FormField {
  /**
   * The key of the form field to fill. This key will be part of the response.
   */
  key: string;

  /**
   * An optional description that may give hints to the model to correctly resolve the data.
   */
  description?: string;

  /**
   * The type of the form field.
   */
  type: string;
}
