'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { seedFirestoreIfEmpty } from '../firebase/seed';
import { FAQ, Service, Section, Page, SiteSettings } from './types';
import { defaultServices, defaultFAQs, defaultSections, defaultPages, defaultSiteSettings } from './defaultData';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        const q = query(collection(db, 'pages'));
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedPages: Page[] = [];
            querySnapshot.forEach((doc) => {
              fetchedPages.push({ id: doc.id, ...doc.data() } as Page);
            });
            setPages(fetchedPages.length > 0 ? fetchedPages : defaultPages.map((p, i) => ({ id: `default-${i}`, ...p })));
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to pages:', error);
            setPages(defaultPages.map((p, i) => ({ id: `default-${i}`, ...p })));
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up pages listener:', error);
        setPages(defaultPages.map((p, i) => ({ id: `default-${i}`, ...p })));
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { pages, loading };
}

export function usePage(slug: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        const q = query(collection(db, 'pages'), where('slug', '==', slug));
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              setPage({ id: doc.id, ...doc.data() } as Page);
            } else {
              const fallbackPage = defaultPages.find(p => p.slug === slug);
              if (fallbackPage) {
                setPage({ id: 'default', ...fallbackPage });
              }
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to page:', error);
            const fallbackPage = defaultPages.find(p => p.slug === slug);
            if (fallbackPage) {
              setPage({ id: 'default', ...fallbackPage });
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up page listener:', error);
        const fallbackPage = defaultPages.find(p => p.slug === slug);
        if (fallbackPage) {
          setPage({ id: 'default', ...fallbackPage });
        }
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [slug]);

  return { page, loading };
}

export function useSections(pageSlug: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        const q = query(
          collection(db, 'sections'),
          where('page_slug', '==', pageSlug),
          orderBy('display_order', 'asc')
        );

        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedSections: Section[] = [];
            querySnapshot.forEach((doc) => {
              fetchedSections.push({ id: doc.id, ...doc.data() } as Section);
            });

            if (fetchedSections.length === 0) {
              const fallbackSections = defaultSections
                .filter(s => s.page_slug === pageSlug)
                .map((s, i) => ({ id: `default-${i}`, ...s }));
              setSections(fallbackSections);
            } else {
              setSections(fetchedSections);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to sections:', error);
            const fallbackSections = defaultSections
              .filter(s => s.page_slug === pageSlug)
              .map((s, i) => ({ id: `default-${i}`, ...s }));
            setSections(fallbackSections);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up sections listener:', error);
        const fallbackSections = defaultSections
          .filter(s => s.page_slug === pageSlug)
          .map((s, i) => ({ id: `default-${i}`, ...s }));
        setSections(fallbackSections);
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [pageSlug]);

  return { sections, loading };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        const q = query(collection(db, 'services'), orderBy('display_order', 'asc'));
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedServices: Service[] = [];
            querySnapshot.forEach((doc) => {
              fetchedServices.push({ id: doc.id, ...doc.data() } as Service);
            });
            setServices(fetchedServices.length > 0 ? fetchedServices : defaultServices.map((s, i) => ({ id: `default-${i}`, ...s })));
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to services:', error);
            setServices(defaultServices.map((s, i) => ({ id: `default-${i}`, ...s })));
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up services listener:', error);
        setServices(defaultServices.map((s, i) => ({ id: `default-${i}`, ...s })));
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { services, loading };
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        const q = query(collection(db, 'faqs'), orderBy('display_order', 'asc'));
        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const fetchedFAQs: FAQ[] = [];
            querySnapshot.forEach((doc) => {
              fetchedFAQs.push({ id: doc.id, ...doc.data() } as FAQ);
            });
            setFaqs(fetchedFAQs.length > 0 ? fetchedFAQs : defaultFAQs.map((f, i) => ({ id: `default-${i}`, ...f })));
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to FAQs:', error);
            setFaqs(defaultFAQs.map((f, i) => ({ id: `default-${i}`, ...f })));
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up FAQs listener:', error);
        setFaqs(defaultFAQs.map((f, i) => ({ id: `default-${i}`, ...f })));
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { faqs, loading };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupListener() {
      try {
        await seedFirestoreIfEmpty();

        unsubscribe = onSnapshot(
          collection(db, 'site_settings'),
          (querySnapshot) => {
            if (!querySnapshot.empty) {
              const doc = querySnapshot.docs[0];
              setSettings({ id: doc.id, ...doc.data() } as SiteSettings);
            } else {
              setSettings({ id: 'default', ...defaultSiteSettings });
            }
            setLoading(false);
          },
          (error) => {
            console.error('Error listening to site settings:', error);
            setSettings({ id: 'default', ...defaultSiteSettings });
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error setting up site settings listener:', error);
        setSettings({ id: 'default', ...defaultSiteSettings });
        setLoading(false);
      }
    }

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { settings, loading };
}
