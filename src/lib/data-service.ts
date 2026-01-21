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
} from 'firebase/firestore';
import type { Domain } from './definitions';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';

export function addCategory(firestore: Firestore, name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newCategory = { name, slug };

  const categoriesCollection = collection(firestore, 'domainCategories');
  // No await, returns a promise but we don't block on it.
  return addDocumentNonBlocking(categoriesCollection, newCategory);
}

export function addDomain(firestore: Firestore, domain: Domain) {
    const domainsCollection = collection(firestore, 'domains');
    // No await
    return addDocumentNonBlocking(domainsCollection, domain);
}

export async function addBulkDomains(firestore: Firestore, domains: Domain[]) {
    const batch = writeBatch(firestore);
    const domainsCollection = collection(firestore, 'domains');
    
    domains.forEach(domainData => {
        const newDocRef = doc(domainsCollection);
        batch.set(newDocRef, domainData);
    });

    // Batch writes are atomic and should be awaited.
    // The error handling for batch writes is more complex and currently
    // will be handled by the component's try/catch.
    await batch.commit();

    return { success: true };
}

export function deleteDomain(firestore: Firestore, domainId: string) {
  const domainRef = doc(firestore, 'domains', domainId);
  // No await
  deleteDocumentNonBlocking(domainRef);
}

export async function deleteAllDomains(firestore: Firestore) {
  const domainsCollection = collection(firestore, 'domains');
  const domainsSnapshot = await getDocs(query(domainsCollection));
  if (domainsSnapshot.empty) return;

  const batch = writeBatch(firestore);
  domainsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}
