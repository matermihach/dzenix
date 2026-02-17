import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import {
  defaultServices,
  defaultFAQs,
  defaultPages,
  defaultSections,
  defaultSiteSettings,
} from '../cms/defaultData';

let isSeeding = false;
let hasSeeded = false;

export async function seedFirestoreIfEmpty() {
  if (isSeeding || hasSeeded) {
    return;
  }

  isSeeding = true;

  try {
    const servicesSnapshot = await getDocs(collection(db, 'services'));

    if (servicesSnapshot.empty) {
      console.log('Seeding Firestore with default DZenix content...');

      for (const service of defaultServices) {
        await addDoc(collection(db, 'services'), {
          ...service,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      for (const faq of defaultFAQs) {
        await addDoc(collection(db, 'faqs'), {
          ...faq,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      for (const page of defaultPages) {
        await addDoc(collection(db, 'pages'), {
          ...page,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      for (const section of defaultSections) {
        await addDoc(collection(db, 'sections'), {
          ...section,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }

      await addDoc(collection(db, 'site_settings'), {
        ...defaultSiteSettings,
        updated_at: serverTimestamp(),
      });

      console.log('Firestore seeding completed successfully!');
      hasSeeded = true;
    }
  } catch (error) {
    console.log('Firestore seeding skipped (Firebase not configured or network issue)');
  } finally {
    isSeeding = false;
  }
}
