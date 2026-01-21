'use client';

import {
  collection,
  addDoc,
  doc,
  writeBatch,
  Firestore,
  getDocs,
} from 'firebase/firestore';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import type { Domain } from './definitions';

export async function addCategory(firestore: Firestore, name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newCategory = { name, slug };

  const categoriesCollection = collection(firestore, 'domainCategories');
  // This is a non-blocking write
  addDocumentNonBlocking(categoriesCollection, newCategory);
  
  // We can't easily return the ID here because it's non-blocking,
  // but we can return the data we sent. The UI can optimistically update.
  return { ...newCategory, id: 'temp-' + Date.now() };
}

export async function addDomain(firestore: Firestore, domain: Omit<Domain, 'id'>) {
    const domainsCollection = collection(firestore, 'domains');
    // Non-blocking write
    addDocumentNonBlocking(domainsCollection, domain);
    return { ...domain, id: 'temp-' + Date.now() };
}

export async function addBulkDomains(firestore: Firestore, domains: Omit<Domain, 'id'>[]) {
    const batch = writeBatch(firestore);
    const domainsCollection = collection(firestore, 'domains');
    
    domains.forEach(domainData => {
        const newDocRef = doc(domainsCollection);
        batch.set(newDocRef, domainData);
    });

    // Commit the batch
    await batch.commit();

    return { success: true };
}

export function deleteDomain(firestore: Firestore, domainId: string) {
  const domainRef = doc(firestore, 'domains', domainId);
  deleteDocumentNonBlocking(domainRef);
}

export async function deleteAllDomains(firestore: Firestore) {
  const domainsCollection = collection(firestore, 'domains');
  const domainsSnapshot = await getDocs(domainsCollection);
  if (domainsSnapshot.empty) return;

  const batch = writeBatch(firestore);
  domainsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}
