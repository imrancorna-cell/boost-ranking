export type DomainCategory = {
  name: string;
  slug: string;
};

export type Domain = {
  url: string;
  da: number; // Domain Authority
  tf: number; // Trust Flow
  dr: number; // Domain Rating
  ss: number; // Spam Score
  categorySlug: string;
};
