export type DomainCategory = {
  id: string;
  name: string;
  slug: string;
  domainCount: number;
};

export type Domain = {
  id: string;
  url: string;
  da: number; // Domain Authority
  tf: number; // Trust Flow
  dr: number; // Domain Rating
  ss: number; // Spam Score
  categorySlug: string;
};

export type UserSession = {
  username: string;
  isAdmin: boolean;
};
