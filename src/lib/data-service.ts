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

export async function addCategory(firestore: Firestore, name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const newCategory = { name, slug };

  const categoriesCollection = collection(firestore, 'domainCategories');
  await addDoc(categoriesCollection, newCategory);
}

export async function addDomain(firestore: Firestore, domain: Domain) {
    const domainsCollection = collection(firestore, 'domains');
    await addDoc(domainsCollection, domain);
}

export async function addBulkDomains(firestore: Firestore, domains: Domain[]) {
    const batch = writeBatch(firestore);
    const domainsCollection = collection(firestore, 'domains');
    
    domains.forEach(domainData => {
        const newDocRef = doc(domainsCollection);
        batch.set(newDocRef, domainData);
    });

    await batch.commit();
    return { success: true };
}

export async function deleteDomain(firestore: Firestore, domainId: string) {
  const domainRef = doc(firestore, 'domains', domainId);
  await deleteDoc(domainRef);
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
