import type { DomainCategory, Domain } from './definitions';

const DOMAINS: Domain[] = [
  { id: '1', url: 'example.com', da: 30, tf: 20, dr: 25, ss: 2, categorySlug: 'general-domains' },
  { id: '2', url: 'sample.net', da: 45, tf: 35, dr: 40, ss: 1, categorySlug: 'general-domains' },
  { id: '3', url: 'test.org', da: 22, tf: 15, dr: 18, ss: 5, categorySlug: 'general-domains' },
  { id: '4', url: 'premium.com', da: 60, tf: 55, dr: 65, ss: 0, categorySlug: 'premium-domains' },
  { id: '5', url: 'topvalue.net', da: 75, tf: 70, dr: 72, ss: 1, categorySlug: 'premium-domains' },
  { id: '6', url: 'archive.io', da: 15, tf: 10, dr: 12, ss: 8, categorySlug: 'other-domains' },
  { id: '7', url: 'showcase.info', da: 33, tf: 28, dr: 31, ss: 3, categorySlug: 'general-domains' },
  { id: '8', url: 'elite.biz', da: 58, tf: 62, dr: 59, ss: 0, categorySlug: 'premium-domains' },
  { id: '9', url: 'dev-resource.dev', da: 40, tf: 42, dr: 38, ss: 2, categorySlug: 'general-domains' },
  { id: '10', url: 'data.science', da: 38, tf: 33, dr: 35, ss: 4, categorySlug: 'other-domains' },
  { id: '11', url: 'another-example.com', da: 28, tf: 18, dr: 22, ss: 6, categorySlug: 'general-domains' },
  { id: '12', url: 'domain-pro.co', da: 51, tf: 48, dr: 53, ss: 1, categorySlug: 'premium-domains' },
  { id: '13', url: 'web-tools.app', da: 36, tf: 30, dr: 34, ss: 2, categorySlug: 'other-domains' },
  { id: '14', url: 'marketing-hub.io', da: 49, tf: 50, dr: 47, ss: 1, categorySlug: 'premium-domains' },
  { id: '15', url: 'simple-blog.org', da: 25, tf: 21, dr: 23, ss: 4, categorySlug: 'general-domains' },
  { id: '16', url: 'portfolio.page', da: 19, tf: 14, dr: 17, ss: 7, categorySlug: 'other-domains' },
  { id: '17', url: 'startup.ly', da: 42, tf: 38, dr: 41, ss: 2, categorySlug: 'general-domains' },
  { id: '18', url: 'invest.finance', da: 68, tf: 65, dr: 70, ss: 0, categorySlug: 'premium-domains' },
  { id: '19', url: 'my-project.xyz', da: 12, tf: 8, dr: 10, ss: 9, categorySlug: 'other-domains' },
  { id: '20', url: 'e-commerce.store', da: 55, tf: 52, dr: 58, ss: 1, categorySlug: 'premium-domains' },
];

const CATEGORIES: Omit<DomainCategory, 'domainCount'>[] = [
  { id: '1', name: 'General Domains', slug: 'general-domains' },
  { id: '2', name: 'Premium Domains', slug: 'premium-domains' },
  { id: '3', name: 'Other Domains', slug: 'other-domains' },
];


// Simulate API delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCategories(): Promise<DomainCategory[]> {
  await sleep(50);
  return CATEGORIES.map(category => ({
    ...category,
    domainCount: DOMAINS.filter(d => d.categorySlug === category.slug).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<DomainCategory | undefined> {
  await sleep(50);
  const category = CATEGORIES.find(c => c.slug === slug);
  if (!category) return undefined;
  return {
    ...category,
    domainCount: DOMAINS.filter(d => d.categorySlug === slug).length,
  };
}

export async function getDomains(): Promise<Domain[]> {
  await sleep(100);
  return DOMAINS;
}

export async function getDomainsByCategory(categorySlug: string): Promise<Domain[]> {
  await sleep(100);
  return DOMAINS.filter(domain => domain.categorySlug === categorySlug);
}

// Mock mutation functions for admin panel
export async function addCategory(name: string) {
    await sleep(200);
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newCategory = { id: String(CATEGORIES.length + 1), name, slug };
    console.log('Adding category (mock):', newCategory);
    // In a real app, you would mutate the data source.
    // CATEGORIES.push(newCategory);
    return newCategory;
}

export async function addDomain(domain: Omit<Domain, 'id'>) {
    await sleep(200);
    const newDomain = { ...domain, id: String(DOMAINS.length + 1) };
    console.log('Adding domain (mock):', newDomain);
    // DOMAINS.push(newDomain);
    return newDomain;
}

export async function addBulkDomains(domains: Omit<Domain, 'id'>[]) {
    await sleep(500);
    console.log('Adding bulk domains (mock):', domains);
    // DOMAINS.push(...domains.map((d, i) => ({ ...d, id: String(DOMAINS.length + i + 1) })));
    return domains;
}
