const fs = require('fs');
const path = '/tmp/cc-agent/61893798/project/lib/cms/defaultData.ts';

let content = fs.readFileSync(path, 'utf8');

// Add Arabic fields to the existing FAQ entries (find and replace each)
const faqReplacements = [
  {
    find: `question_en: 'What is your pricing structure?',
    question_fr: 'Quelle est votre structure de prix ?',
    answer_en:`,
    replace: `question_en: 'What is your pricing structure?',
    question_fr: 'Quelle est votre structure de prix ?',
    question_ar: 'ما هو هيكل التسعير الخاص بكم؟',
    answer_en:`
  },
  {
    find: `answer_fr: 'Nous offrons des prix flexibles basés sur la portée et les exigences du projet. Nous supportons plusieurs devises (DZD, EUR, USD) et fournissons des devis détaillés après avoir compris vos besoins. Contactez-nous pour une consultation gratuite.',
    category: 'pricing',`,
    replace: `answer_fr: 'Nous offrons des prix flexibles basés sur la portée et les exigences du projet. Nous supportons plusieurs devises (DZD, EUR, USD) et fournissons des devis détaillés après avoir compris vos besoins. Contactez-nous pour une consultation gratuite.',
    answer_ar: 'نقدم أسعارًا مرنة بناءً على نطاق المشروع ومتطلباته. ندعم عملات متعددة (DZD، EUR، USD) ونقدم عروض أسعار مفصلة بعد فهم احتياجاتك. اتصل بنا للحصول على استشارة مجانية.',
    category: 'pricing',`
  },
  {
    find: `question_en: 'Do you provide ongoing support and maintenance?',
    question_fr: 'Fournissez-vous un support et une maintenance continus ?',
    answer_en:`,
    replace: `question_en: 'Do you provide ongoing support and maintenance?',
    question_fr: 'Fournissez-vous un support et une maintenance continus ?',
    question_ar: 'هل تقدمون الدعم والصيانة المستمرة؟',
    answer_en:`
  },
  {
    find: `answer_fr: 'Oui ! Nous offrons des forfaits de maintenance complets incluant les mises à jour de sécurité, la surveillance des performances, les corrections de bugs et les améliorations de fonctionnalités. Les plans de support peuvent être personnalisés selon vos besoins.',
    category: 'support',`,
    replace: `answer_fr: 'Oui ! Nous offrons des forfaits de maintenance complets incluant les mises à jour de sécurité, la surveillance des performances, les corrections de bugs et les améliorations de fonctionnalités. Les plans de support peuvent être personnalisés selon vos besoins.',
    answer_ar: 'نعم! نقدم حزم صيانة شاملة تشمل تحديثات الأمان ومراقبة الأداء وإصلاح الأخطاء وتحسينات الميزات. يمكن تخصيص خطط الدعم وفقًا لاحتياجاتك.',
    category: 'support',`
  },
  {
    find: `question_en: 'What technologies do you use?',
    question_fr: 'Quelles technologies utilisez-vous ?',
    answer_en:`,
    replace: `question_en: 'What technologies do you use?',
    question_fr: 'Quelles technologies utilisez-vous ?',
    question_ar: 'ما هي التقنيات التي تستخدمونها؟',
    answer_en:`
  },
  {
    find: `answer_fr: 'Nous travaillons avec des technologies modernes et standard de l\\'industrie incluant React, Next.js, Node.js, Firebase, et plus encore. Nous choisissons la meilleure pile technologique pour chaque projet en fonction de vos besoins spécifiques.',
    category: 'technical',`,
    replace: `answer_fr: 'Nous travaillons avec des technologies modernes et standard de l\\'industrie incluant React, Next.js, Node.js, Firebase, et plus encore. Nous choisissons la meilleure pile technologique pour chaque projet en fonction de vos besoins spécifiques.',
    answer_ar: 'نعمل بتقنيات حديثة ومعتمدة في الصناعة بما في ذلك React وNext.js وNode.js وFirebase والمزيد. نختار أفضل مجموعة تقنية لكل مشروع بناءً على متطلباتك المحددة.',
    category: 'technical',`
  },
  {
    find: `question_en: 'Can you work with clients internationally?',
    question_fr: 'Pouvez-vous travailler avec des clients internationaux ?',
    answer_en:`,
    replace: `question_en: 'Can you work with clients internationally?',
    question_fr: 'Pouvez-vous travailler avec des clients internationaux ?',
    question_ar: 'هل يمكنكم العمل مع عملاء دوليين؟',
    answer_en:`
  },
  {
    find: `answer_fr: 'Absolument ! Nous travaillons avec des clients du monde entier. Nous supportons plusieurs devises et langues, et utilisons des outils de collaboration modernes pour assurer une communication fluide quelle que soit votre localisation.',
    category: 'general',`,
    replace: `answer_fr: 'Absolument ! Nous travaillons avec des clients du monde entier. Nous supportons plusieurs devises et langues, et utilisons des outils de collaboration modernes pour assurer une communication fluide quelle que soit votre localisation.',
    answer_ar: 'بالتأكيد! نعمل مع عملاء من جميع أنحاء العالم. ندعم عملات ولغات متعددة، ونستخدم أدوات تعاون حديثة لضمان التواصل السلس بغض النظر عن الموقع.',
    category: 'general',`
  },
  {
    find: `question_en: 'Do you offer custom solutions or just templates?',
    question_fr: 'Proposez-vous des solutions personnalisées ou seulement des modèles ?',
    answer_en:`,
    replace: `question_en: 'Do you offer custom solutions or just templates?',
    question_fr: 'Proposez-vous des solutions personnalisées ou seulement des modèles ?',
    question_ar: 'هل تقدمون حلولاً مخصصة أم قوالب فقط؟',
    answer_en:`
  },
  {
    find: `answer_fr: 'Nous nous spécialisons dans les solutions personnalisées adaptées à vos besoins commerciaux uniques. Bien que nous utilisions des frameworks éprouvés et des meilleures pratiques, chaque projet est construit spécifiquement pour vous, pas à partir de modèles génériques.',
    category: 'services',`,
    replace: `answer_fr: 'Nous nous spécialisons dans les solutions personnalisées adaptées à vos besoins commerciaux uniques. Bien que nous utilisions des frameworks éprouvés et des meilleures pratiques, chaque projet est construit spécifiquement pour vous, pas à partir de modèles génériques.',
    answer_ar: 'نتخصص في الحلول المخصصة المصممة خصيصًا لاحتياجات عملك الفريدة. بينما نستخدم أطر عمل مثبتة وأفضل الممارسات، يتم بناء كل مشروع خصيصًا لك، وليس من قوالب عامة.',
    category: 'services',`
  },
];

for (const {find, replace} of faqReplacements) {
  content = content.replace(find, replace);
}

// Fix SiteSettings
content = content.replace(
  `export const defaultSiteSettings: Omit<SiteSettings, 'id' | 'updated_at'> = {
  site_name: 'DZenix',
  tagline_en: 'Transform Your Digital Vision',
  tagline_fr: 'Transformez Votre Vision Digitale',
  description_en: 'Professional digital agency specializing in web development, mobile apps, and digital solutions',
  description_fr: 'Agence digitale professionnelle spécialisée dans le développement web, les applications mobiles et les solutions digitales',
  contact_email: 'contact@dzenix.com',
  contact_phone: '+213 XXX XX XX XX',
  address_en: 'Algiers, Algeria',
  address_fr: 'Alger, Algérie',`,
  `export const defaultSiteSettings: Omit<SiteSettings, 'id' | 'updated_at'> = {
  site_name: 'DZenix',
  tagline_en: 'Transform Your Digital Vision',
  tagline_fr: 'Transformez Votre Vision Digitale',
  tagline_ar: 'حوّل رؤيتك الرقمية',
  description_en: 'Professional digital agency specializing in web development, mobile apps, and digital solutions',
  description_fr: 'Agence digitale professionnelle spécialisée dans le développement web, les applications mobiles et les solutions digitales',
  description_ar: 'وكالة رقمية محترفة متخصصة في تطوير الويب وتطبيقات الجوال والحلول الرقمية',
  contact_email: 'contact@dzenix.com',
  contact_phone: '+213 XXX XX XX XX',
  address_en: 'Algiers, Algeria',
  address_fr: 'Alger, Algérie',
  address_ar: 'الجزائر، الجزائر',
  whatsapp_number_1: '+43 660 8439375',
  whatsapp_number_2: '+43 660 2313221',
  whatsapp_message_en: 'Hello! I would like to inquire about your services.',
  whatsapp_message_fr: 'Bonjour! Je voudrais me renseigner sur vos services.',
  whatsapp_message_ar: 'مرحباً! أود الاستفسار عن خدماتكم.',`
);

// Fix Pages
content = content.replace(
  `slug: 'home',
    title_en: 'Home',
    title_fr: 'Accueil',
    meta_title_en:`,
  `slug: 'home',
    title_en: 'Home',
    title_fr: 'Accueil',
    title_ar: 'الرئيسية',
    meta_title_en:`
);

content = content.replace(
  `slug: 'services',
    title_en: 'Services',
    title_fr: 'Services',
    meta_title_en:`,
  `slug: 'services',
    title_en: 'Services',
    title_fr: 'Services',
    title_ar: 'الخدمات',
    meta_title_en:`
);

content = content.replace(
  `slug: 'contact',
    title_en: 'Contact',
    title_fr: 'Contact',
    meta_title_en:`,
  `slug: 'contact',
    title_en: 'Contact',
    title_fr: 'Contact',
    title_ar: 'اتصل بنا',
    meta_title_en:`
);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated defaultData.ts');
