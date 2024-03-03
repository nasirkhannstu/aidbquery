/**
 * Represents the different types of plans available.
 */
export interface PlanTypes {
  /**
   * The name of the plan (`Free` or `premium`).
   */
  name: string;
  /**
   * The slug of the plan (`free` or `premium`).
   */
  slug: string;
  /**
   * The amount of Document files that can be uploaded per month (including all file types).
   */
  quota: number;
  /**
   * CSV file upload feature.
   */
  csv: {
    /**
     * Indicates whether the CSV file upload feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The quota for the CSV file upload feature.
     */
    quota: number;
    /**
     * The maximum file size for the CSV file upload feature in KB.
     */
    fileSize: number;
    /**
     * The maximum number of rows/records for the CSV file upload feature.
     */
    rows: number;
  };
  /**
   * JSON file upload feature.
   */
  json: {
    /**
     * Indicates whether the JSON file upload feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The quota for the JSON file upload feature.
     */
    quota: number;
    /**
     * The maximum file size for the JSON file upload feature in KB.
     */
    fileSize: number;
  };
  /**
   * The price of the plan.
   */
  price: {
    /**
     * The amount of the price for the plan.
     */
    amount?: number;
    /**
     * The price IDs for the plan related to the environment of Stripe.
     */
    priceIds: {
      /**
       * The price ID for the test environment (test mode). Take the production price ID from the Stripe dashboard.
       */
      test?: string;
      /**
       * The price ID for the production environment (live mode). Take the production price ID from the Stripe dashboard.
       */
      production: string;
    };
  };
}

/**
 * Represents a feature in a plan.
 */
export type FeatureType = {
  /**
   * Indicates whether the feature is allowed in this plan.
   */
  isAllowed?: boolean;
  /**
   * The text description of the feature.
   */
  text: string;
  /**
   * An optional footnote for the feature.
   */
  footnote?: string;
};

/**
 * Represents a pricing item.
 */
export interface PricingItemTypes {
  /**
   * The name of the plan. ** example: `Free` or `Premium` **
   */
  plan: string;
  /**
   * The tagline for the plan.
   */
  tagline: string;
  /**
   * The quota for the plan.
   */
  quota: number;
  /**
   * The features included in the plan.
   */

  /**
   * The finance information for the plan.
   */
  finance: {
    /**
     * The price of the plan. ** example: `9.99$` **
     */
    price: number;
  };

  features: {
    /**
     * CSV feature.
     */
    csv: FeatureType;
    /**
     * JSON feature.
     */
    json: FeatureType;
  };
  featureAll: { text: string; negative: boolean; footnote?: string }[];
}
