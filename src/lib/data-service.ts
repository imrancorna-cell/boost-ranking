'use client';

import {
  collection,
  addDoc,
  doc,
  writeBatch,
  Firestore,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import type { Domain } from './definitions';

export async function addCategory(firestore: Firestore, name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newCategory = { name, slug };

  const categoriesCollection = collection(firestore, 'domancategorie');
  return addDoc(categoriesCollection, newCategory);
}

export async function addDomain(firestore: Firestore, domain: Domain) {
  const domainsCollection = collection(firestore, 'domains');
  return addDoc(domainsCollection, domain);
}

export async function addBulkDomains(firestore: Firestore, domains: Domain[]) {
  const batch = writeBatch(firestore);
  const domainsCollection = collection(firestore, 'domains');

  domains.forEach((domainData) => {
    const newDocRef = doc(domainsCollection);
    batch.set(newDocRef, domainData);
  });

  return batch.commit();
}

export async function deleteDomain(firestore: Firestore, domainId: string) {
  const domainRef = doc(firestore, 'domains', domainId);
  return deleteDoc(domainRef);
}

export async function deleteAllDomains(firestore: Firestore) {
  const domainsCollection = collection(firestore, 'domains');
  const domainsSnapshot = await getDocs(query(domainsCollection));
  if (domainsSnapshot.empty) return;

  const batch = writeBatch(firestore);
  domainsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  return batch.commit();
}

export async function deleteCategory(
  firestore: Firestore,
  categoryId: string,
  categorySlug: string
) {
  const batch = writeBatch(firestore);

  // 1. Find and delete all domains in this category
  const domainsQuery = query(
    collection(firestore, 'domains'),
    where('categorySlug', '==', categorySlug)
  );
  const domainsSnapshot = await getDocs(domainsQuery);
  if (!domainsSnapshot.empty) {
    domainsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
  }

  // 2. Delete the category itself
  const categoryRef = doc(firestore, 'domancategorie', categoryId);
  batch.delete(categoryRef);

  // 3. Commit the batch
  return batch.commit();
}
