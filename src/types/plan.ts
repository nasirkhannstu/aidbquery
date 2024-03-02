/**
 * Represents the different types of plans available.
 */
export interface PlanTypes {
  /**
   * The name of the plan (`Free` or `Pro`).
   */
  name: string;
  /**
   * The slug of the plan (`free` or `pro`).
   */
  slug: string;
  /**
   * The amount of Document files that can be uploaded per month (including all file types).
   */
  quota: number;
  /**
   * DOCX support.
   */
  pdf: {
    /**
     * The amount of pages per DOCX file.
     */
    pagesPerPdf: number;
    /**
     * The amount of DOC/DOCX files that can be uploaded per month.
     */
    quota: number;
    /**
     * Indicates whether the feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The file size limit in KB. ** example: `1024` ** 
     */
    fileSize: number;
  };
  docx: {
    /**
     * The amount of pages per DOCX file.
     */
    pagesPerDocx: number;
    /**
     * The amount of DOC/DOCX files that can be uploaded per month.
     */
    quota: number;
    /**
     * Indicates whether the feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The file size limit in KB ** example: `1024` **
     */
    fileSize: number;
  };

  /**
   * Image support.
   */
  image: {
    /**
     * Indicates whether the feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The amount of images that can be uploaded per month.
     */
    quota: number;
    /**
     * The file size limit in KB ** example: `1024` **
     */
    fileSize: number;
  };
  /**
   * TXT support.
   */
  txt: {
    /**
     * Indicates whether the feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The amount of TXT files that can be uploaded per month.
     */
    quota: number;
    /**
     * The file size limit in KB ** example: `1024` **
     */
    fileSize: number;
  };
  /**
   * Link support.
   */
  link: {
    /**
     * Indicates whether the feature is allowed in this plan.
     */
    isAllowed: boolean;
    /**
     * The amount of links that can be uploaded per month.
     */
    quota: number;
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
   * The name of the plan. ** example: `Free` or `Pro` **
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
     * PDF feature.
     */
    pdf: FeatureType;
    /**
     * DOCX feature.
     */
    docx: FeatureType;
    /**
     * TXT feature.
     */
    txt: FeatureType;
    /**
     * Image feature.
     */
    image: FeatureType;
    /**
     * Link feature.
     */
    link: FeatureType;
  };
  featureAll: { text: string; negative: boolean; footnote?: string }[];
}
