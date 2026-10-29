// ============================================================
// site.js — index.html Arayüz ve Form Mantığı
// ============================================================

let existingAppointments = [];
let siteContent = createDefaultSiteContent();
const storedLanguage = getLocalPreference('siteLanguage');
let currentLanguage = storedLanguage === 'fr' || storedLanguage === 'en' ? storedLanguage : 'tr';
let selectedBarberId = getLocalPreference('selectedBarberId') || 'barber_1';

function getActiveBarbers(){
  return Array.isArray(siteContent.barbers) && siteContent.barbers.length ? siteContent.barbers : BARBERS;
}

const FR_SERVICES = {
  sac: { name: 'Coupe de cheveux', tag: 'Le plus populaire', desc: 'Coupes modernes et classiques réalisées avec précision à la tondeuse et aux ciseaux.', features: ['Lavage inclus', 'Conseil de style', 'Produit de finition'] },
  sakal: { name: 'Taille de barbe', tag: 'Art classique', desc: 'Rasage au rasoir de sécurité et modelage précis de la barbe.', features: ['Serviette chaude', 'Rasage au rasoir', 'Soin après-rasage'] },
  sac_sakal: { name: 'Cheveux + Barbe', tag: 'Combo', desc: 'Coupe de cheveux et taille de barbe en une seule visite.', features: ['Lavage inclus', 'Rasage et coiffage', 'Gain de temps'] },
  cocuk: { name: 'Coupe enfants', tag: 'Familial', desc: 'Une expérience de coupe patiente et agréable pour les enfants.', features: ['Environnement sûr et confortable', 'Coupe adaptée à leur style'] },
  damat: { name: 'Forfait mariage', tag: 'Journée spéciale', desc: 'Forfait complet de soins et de coiffage pour votre journée spéciale.', features: ['Cheveux + barbe + soin visage', 'Consultation de style détaillée'] },
  cilt: { name: 'Soin visage / peau', tag: 'Rafraîchir', desc: 'Nettoyage en profondeur, vapeur et hydratation pour la peau masculine.', features: ['Nettoyage profond', 'Vapeur', 'Masque hydratant'] },
  fon: { name: 'Séchage & coiffage', tag: 'Rapide', desc: 'Séchage et coiffage professionnels pour chaque jour ou occasion spéciale.', features: ['Application rapide', 'Style durable'] },
  boya: { name: 'Coloration capillaire', tag: 'Rénovation', desc: 'Coloration et toning avec des produits de qualité pour un aspect naturel.', features: ['Produits professionnels', 'Conseil couleur'] }
};

const EN_SERVICES = {
  sac: { name: 'Haircut', tag: 'Most popular', desc: 'Modern and classic cuts tailored precisely with clippers and scissors.', features: ['Wash included', 'Style advice', 'Finishing product'] },
  sakal: { name: 'Beard trim', tag: 'Classic craft', desc: 'Smooth razor shave and precise beard shaping with expert finishing.', features: ['Warm towel', 'Safety razor shave', 'After-shave care'] },
  sac_sakal: { name: 'Hair + Beard', tag: 'Combo', desc: 'Haircut and beard trim in one visit for a complete grooming session.', features: ['Wash included', 'Shave & styling', 'Time-saving'] },
  cocuk: { name: 'Kids cut', tag: 'Family friendly', desc: 'A patient and comfortable cutting experience designed for children.', features: ['Comfortable and safe space', 'Cut tailored to their style'] },
  damat: { name: 'Wedding package', tag: 'Special day', desc: 'Full grooming and styling package prepared for your special day.', features: ['Hair + beard + facial care', 'Detailed style consultation'] },
  cilt: { name: 'Facial / skin care', tag: 'Refresh', desc: 'Deep cleansing, steam treatment and hydration for men’s skin.', features: ['Deep cleansing', 'Steam treatment', 'Hydrating mask'] },
  fon: { name: 'Drying & styling', tag: 'Fast', desc: 'Professional blow-dry and styling for everyday or special occasions.', features: ['Quick application', 'Long-lasting style'] },
  boya: { name: 'Hair coloring', tag: 'Renewal', desc: 'Professional hair coloring and tone work with premium products.', features: ['Professional products', 'Color consultation'] }
};

const REFRESHMENTS = [
  { icon: '🍵', names: { tr: 'Çay', en: 'Tea', fr: 'Thé' } },
  { icon: '🥤', names: { tr: 'Oralet Çeşitleri', en: 'Oralet Varieties', fr: 'Variétés d’oralet' } },
  { icon: '☕', names: { tr: 'Espresso Kahve', en: 'Espresso Coffee', fr: 'Café espresso' } },
  { icon: '🥤', names: { tr: 'Sade Soda', en: 'Plain Mineral Water', fr: 'Eau minérale nature' } },
  { icon: '🍓', names: { tr: 'Meyveli Soda', en: 'Fruit-flavored Mineral Water', fr: 'Eau minérale aromatisée' } },
  { icon: '☕', names: { tr: '3’ü 1 Arada Kahve', en: '3-in-1 Coffee', fr: 'Café 3-en-1' } },
  { icon: '💧', names: { tr: 'Su', en: 'Water', fr: 'Eau' } },
];

const FR_UI = {
  premiumService: 'Services haut de gamme',
  googleRating: 'Note Google',
  reviewCount: 'Avis',
  googleReviews: 'avis Google',
  craftsmanship: 'Un savoir-faire d’exception',
  personalTouch: 'Une attention portée à chaque détail',
  premiumProducts: 'Produits haut de gamme',
  trustedBrands: 'Des marques professionnelles de confiance',
  easyBooking: 'Réservation facile',
  chooseTime: 'Choisissez l’heure qui vous convient',
  whyUs: 'Pourquoi nous choisir ?',
  barberExperience: '{location} : une expérience de coiffure unique',
  personalizedCare: 'Notre équipe expérimentée et nos produits de qualité offrent à chaque client un soin personnalisé.',
  experiencedTeam: 'Une équipe expérimentée',
  expertService: 'Un service soigné assuré par des barbiers qualifiés.',
  hygienicEnvironment: 'Un environnement hygiénique',
  hygieneStandards: 'Du matériel stérilisé et des normes de propreté rigoureuses.',
  qualityProducts: 'Des produits de qualité',
  professionalBrands: 'Nous utilisons uniquement des produits de marques professionnelles fiables.',
  longHours: 'Horaires étendus',
  hoursDescription: 'Nous vous accueillons jusqu’à 23 h en semaine et jusqu’à minuit le week-end.',
  whatWeOffer: 'Nos prestations',
  ourServices: 'Nos services haut de gamme',
  servicesDescription: 'Chaque prestation est réalisée avec soin par nos professionnels, à l’aide de produits de qualité.',
  transparentPricing: 'Des tarifs transparents',
  priceList: 'Liste des tarifs',
  pricingDescription: 'Une expérience de soin haut de gamme, avec des prix clairs et compétitifs, sans compromis sur la qualité.',
  priceNote: 'Les tarifs indiqués sont des prix de départ et peuvent varier selon la prestation. Contactez-nous pour connaître les tarifs actuels.',
  aboutUs: 'À propos',
  createBooking: 'Prendre rendez-vous',
  whatClientsSay: 'Ce que disent nos clients',
  verifiedRating: 'Notre note vérifiée sur Google',
  reviewsOnGoogle: 'avis Google',
  seeGoogleReviews: 'Voir tous les avis sur Google',
  bookingForm: 'Formulaire de réservation',
  enterDetails: 'Saisissez vos informations',
  bookingDescription: 'Réservez en quelques étapes, nous nous occupons du reste.',
  fullName: 'Nom et prénom',
  namePlaceholder: 'Votre nom et prénom',
  phone: 'Téléphone',
  service: 'Prestation',
  barber: 'Barbier',
  date: 'Date',
  time: 'Heure',
  confirmBooking: 'Confirmer le rendez-vous',
  contact: 'Contact',
  getInTouch: 'Contactez-nous',
  contactDescription: 'Appelez-nous pour toute question ou consultez l’itinéraire sur la carte.',
  address: 'Adresse',
  directions: 'Obtenir l’itinéraire →',
  phoneWhatsapp: 'Téléphone / WhatsApp',
  messageWhatsapp: 'Écrivez-nous sur WhatsApp →',
  openingHours: 'Horaires d’ouverture',
  footerDescription: '{location} : votre salon de coiffure pour hommes haut de gamme.',
  haircut: 'Coupe de cheveux',
  beardTrim: 'Taille de barbe',
  hairBeard: 'Cheveux + barbe',
  skinCare: 'Soin de la peau',
  rightsReserved: 'Tous droits réservés.',
  bookNow: 'Prendre rendez-vous',
  bookingNameRequired: 'Veuillez saisir votre nom complet et votre numéro de téléphone.',
  bookingInvalidSelection: 'Veuillez choisir une prestation, une date et une heure valides.',
  bookingInvalidPhone: 'Veuillez saisir un numéro de téléphone valide.',
  saving: 'Enregistrement…',
  bookingSaved: 'Votre rendez-vous est confirmé !',
  bookingSavedSuffix: 'Nous vous attendons avec plaisir.',
  bookingFailed: 'Impossible d’enregistrer le rendez-vous :',
  booked: 'COMPLET',
  past: 'PASSÉ',
  bookingConfirmation: 'Confirmer le rendez-vous',
  languageSelection: 'Choix de la langue',
  themeToggle: 'Changer de thème',
  highlights: 'Nos points forts',
  barberChair: 'Fauteuil de barbier',
  shopExterior: 'Façade de Gentlemen’s Barber',
  map: 'Carte',
  adminLogin: 'Connexion administrateur'
};

const EN_UI = {
  premiumService: 'Premium Service',
  googleRating: 'Google Rating',
  reviewCount: 'Reviews',
  googleReviews: 'Google reviews',
  craftsmanship: 'Crafted with expertise',
  personalTouch: 'A personal touch in every detail',
  premiumProducts: 'Premium products',
  trustedBrands: 'Trusted professional brands',
  easyBooking: 'Easy booking',
  chooseTime: 'Choose a time that suits you',
  whyUs: 'Why Choose Us?',
  barberExperience: '{location}: A Distinctive Barbering Experience',
  personalizedCare: 'With our experienced team and quality products, we provide a personalized care experience for every client.',
  experiencedTeam: 'Experienced Team',
  expertService: 'Careful and precise service from skilled barbers.',
  hygienicEnvironment: 'Hygienic Environment',
  hygieneStandards: 'Sterilized equipment and rigorous cleanliness standards.',
  qualityProducts: 'Quality Products',
  professionalBrands: 'We use only reliable professional brand products.',
  longHours: 'Extended Hours',
  hoursDescription: 'We serve you until 11:00 PM on weekdays and until midnight on weekends.',
  whatWeOffer: 'What We Offer',
  ourServices: 'Our Premium Services',
  servicesDescription: 'Every service is delivered carefully by our experienced professionals using quality products.',
  transparentPricing: 'Transparent Pricing',
  priceList: 'Price List',
  pricingDescription: 'A premium care experience with clear, competitive prices without compromising quality.',
  priceNote: 'Prices are starting prices and may vary depending on the service. Call us for current prices.',
  aboutUs: 'About Us',
  createBooking: 'Create Booking',
  whatClientsSay: 'What Our Clients Say',
  verifiedRating: 'Our Verified Google Rating',
  reviewsOnGoogle: 'based on Google reviews',
  seeGoogleReviews: 'See All Reviews on Google',
  bookingForm: 'Booking Form',
  enterDetails: 'Enter Your Details',
  bookingDescription: 'Create your appointment in a few steps and leave the rest to us.',
  fullName: 'Full Name',
  namePlaceholder: 'Your full name',
  phone: 'Phone',
  service: 'Service',
  barber: 'Barber',
  date: 'Date',
  time: 'Time',
  confirmBooking: 'Confirm Booking',
  contact: 'Contact',
  getInTouch: 'Get in Touch',
  contactDescription: 'Call us with any questions or get directions from the map.',
  address: 'Address',
  directions: 'Get Directions →',
  phoneWhatsapp: 'Phone / WhatsApp',
  messageWhatsapp: 'Message us on WhatsApp →',
  openingHours: 'Opening Hours',
  footerDescription: '{location}: your premium men’s barber shop.',
  haircut: 'Haircut',
  beardTrim: 'Beard Trim',
  hairBeard: 'Hair + Beard',
  skinCare: 'Skin Care',
  rightsReserved: 'All rights reserved.',
  bookNow: 'Book Now',
  bookingNameRequired: 'Please enter your full name and phone number.',
  bookingInvalidSelection: 'Please choose a valid service, date and time.',
  bookingInvalidPhone: 'Please enter a valid phone number.',
  saving: 'Saving…',
  bookingSaved: 'Your appointment has been confirmed!',
  bookingSavedSuffix: 'We look forward to seeing you.',
  bookingFailed: 'The appointment could not be saved:',
  booked: 'BOOKED',
  past: 'PASSED',
  bookingConfirmation: 'Confirm Booking',
  languageSelection: 'Language selection',
  themeToggle: 'Change theme',
  highlights: 'Highlights',
  barberChair: 'Barber chair',
  shopExterior: 'Gentlemen’s Barber exterior',
  map: 'Map',
  adminLogin: 'Admin Login'
};

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const FR_CMS_TEXT = {
  'Personel saç+sakal': 'Coupe + barbe personnalisées',
  'Personel saç kesimi': 'Coupe personnalisée',
  'Saç sakal+kaş+maske': 'Cheveux, barbe, sourcils et masque',
  'Personel kesimi': 'Coupe personnalisée',
  'Personel damat traşı': 'Coiffure personnalisée pour le marié',
  Personel: 'Personnalisé',
  Perma: 'Permanente',
  Yenilenme: 'Rénovation',
  'Saçlarınıza doğal kıvırcıklık': 'Des boucles naturelles pour vos cheveux',
  'fön ve şekillendirme': 'Séchage et coiffage',
  'Saç + sakal+ kaş tasarımı': 'Cheveux + barbe + design des sourcils',
  'Saç+sakal tasarımı': 'Coiffure et barbe personnalisées'
};

const FR_BOOKING_SERVICE_NAMES = {
  'kas-tasarimi': 'Design des sourcils',
  'kas-alimi': 'Épilation des sourcils',
  'buharli-cilt-bakimi': 'Soin du visage à la vapeur',
  'klasik-maske': 'Masque classique',
  keratin: 'Soin à la kératine',
  'saç-sakal-kas': 'Cheveux + barbe + design des sourcils',
  'sac-sakal-tasarim': 'Coiffure et barbe personnalisées'
};

function shopDisplayText(value){
  if(typeof value !== 'string') return value;
  return value
    .replace(/erkek kuaf\u00f6r\u00fc/gi, 'Erkek Kuaförü')
    .replace(/kuaf\u00f6r/gi, 'kuaför');
}

function localizeCmsText(value){
  if(typeof value !== 'string') return value;
  if(/Marsilya.*modern erkek saç tasarımını/i.test(value)){
    return 'Fort de mon expérience professionnelle entre Marseille, en France, et la Turquie, j’apporte à Istanbul la coiffure masculine moderne et le style européen. Grâce à mon expérience internationale, à mon sens esthétique et à mon approche personnalisée, je propose à chaque client un service professionnel de qualité.';
  }
  return FR_CMS_TEXT[value] || value;
}

const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
];

function localizedUiText(key, turkishText){
  if(currentLanguage === 'fr') return FR_UI[key] || turkishText;
  if(currentLanguage === 'en') return EN_UI[key] || turkishText;
  return turkishText;
}

function localizedService(service){
  if(currentLanguage === 'fr' && FR_SERVICES[service.id]){
    const localized = { ...service, ...FR_SERVICES[service.id] };
    return { ...localized, name: shopDisplayText(localized.name), tag: shopDisplayText(localized.tag), desc: shopDisplayText(localized.desc) };
  }
  if(currentLanguage === 'en' && EN_SERVICES[service.id]){
    const localized = { ...service, ...EN_SERVICES[service.id] };
    return { ...localized, name: shopDisplayText(localized.name), tag: shopDisplayText(localized.tag), desc: shopDisplayText(localized.desc) };
  }
  if(currentLanguage === 'fr'){
    return {
      ...service,
      name: shopDisplayText(service.nameFr || localizeCmsText(service.name)),
      tag: shopDisplayText(service.tagFr || localizeCmsText(service.tag)),
      desc: shopDisplayText(service.descFr || localizeCmsText(service.desc))
    };
  }
  return {
    ...service,
    name: shopDisplayText(service.name),
    tag: shopDisplayText(service.tag),
    desc: shopDisplayText(service.desc)
  };
}

function applyLanguage(){
  const french = currentLanguage === 'fr';
  const english = currentLanguage === 'en';
  document.querySelectorAll('#language-select [data-language]').forEach(button => {
    button.classList.toggle('active', button.dataset.language === currentLanguage);
  });
  document.documentElement.lang = currentLanguage;
  renderShopInfo();

  const heroTitle = document.querySelector('.js-hero-title');
  if(heroTitle){
    if(!heroTitle.dataset.originalHtml) heroTitle.dataset.originalHtml = heroTitle.innerHTML;
    heroTitle.innerHTML = currentLanguage === 'fr'
      ? `<span class="js-shop-name">${escapeHtml(shopDisplayText(siteContent.shopName))}</span> pour affirmer <span id="hero-highlight">votre style</span>`
      : currentLanguage === 'en'
        ? `<span class="js-shop-name">${escapeHtml(shopDisplayText(siteContent.shopName))}</span> to elevate <span id="hero-highlight">your style</span>`
        : heroTitle.dataset.originalHtml;
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    if(!el.dataset.i18nTr) el.dataset.i18nTr = el.innerHTML;
    const key = el.dataset.i18n;
    const text = currentLanguage === 'fr' ? (FR_UI[key] || el.dataset.i18nTr)
      : currentLanguage === 'en' ? (EN_UI[key] || el.dataset.i18nTr)
      : el.dataset.i18nTr;
    el.innerHTML = text.replaceAll('{location}', `<span class="js-location">${escapeHtml(siteContent.locationName)}</span>`);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if(!el.dataset.i18nPlaceholderTr) el.dataset.i18nPlaceholderTr = el.placeholder;
    el.placeholder = currentLanguage === 'fr' ? (FR_UI[key] || el.dataset.i18nPlaceholderTr)
      : currentLanguage === 'en' ? (EN_UI[key] || el.dataset.i18nPlaceholderTr)
      : el.dataset.i18nPlaceholderTr;
  });
  ['alt', 'title', 'aria-label'].forEach(attribute => {
    const dataKey = `i18n${attribute.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`;
    document.querySelectorAll(`[data-${dataKey.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}]`).forEach(el => {
      const key = el.dataset[dataKey];
      const originalKey = `i18n${attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Tr`;
      if(!el.dataset[originalKey]) el.dataset[originalKey] = el.getAttribute(attribute) || '';
      el.setAttribute(attribute, currentLanguage === 'fr' ? (FR_UI[key] || el.dataset[originalKey])
        : currentLanguage === 'en' ? (EN_UI[key] || el.dataset[originalKey])
        : el.dataset[originalKey]);
    });
  });
  document.querySelectorAll('.js-service-stat').forEach(el => {
    el.textContent = currentLanguage === 'fr' ? FR_UI.premiumService : currentLanguage === 'en' ? EN_UI.premiumService : 'Premium Hizmet';
  });
  
  const nav1 = document.querySelector('.nav-links li:nth-child(1) a'); if(nav1) nav1.textContent = french ? 'Services' : english ? 'Services' : 'Hizmetler';
  const nav2 = document.querySelector('.nav-links li:nth-child(2) a'); if(nav2) nav2.textContent = french ? 'Tarifs' : english ? 'Prices' : 'Fiyatlar';
  const nav3 = document.querySelector('.nav-links li:nth-child(3) a'); if(nav3) nav3.textContent = french ? 'À propos' : english ? 'About' : 'Hakkımızda';
  const nav4 = document.querySelector('.nav-links li:nth-child(4) a'); if(nav4) nav4.textContent = french ? 'Réservation' : english ? 'Booking' : 'Randevu';
  const nav5 = document.querySelector('.nav-links li:nth-child(5) a'); if(nav5) nav5.textContent = french ? 'Contact' : english ? 'Contact' : 'İletişim';
  
  document.querySelectorAll('.js-booking-link').forEach(el => el.textContent = french ? 'Réserver' : english ? 'Book Now' : 'Randevu Al');
  const priceLink = document.querySelector('.js-prices-link'); if(priceLink) priceLink.textContent = french ? 'Liste des prix' : english ? 'Price List' : 'Fiyat Listesi';

  const refreshmentsEyebrow = document.getElementById('refreshments-eyebrow');
  if(refreshmentsEyebrow) refreshmentsEyebrow.textContent = french ? 'Une petite attention' : english ? 'On the house' : 'Size İkramımız';
  const refreshmentsTitle = document.getElementById('refreshments-title');
  if(refreshmentsTitle) refreshmentsTitle.textContent = french ? 'Nos rafraîchissements' : english ? 'Complimentary Refreshments' : 'İkramlarımız';
  const refreshmentsDescription = document.getElementById('refreshments-description');
  if(refreshmentsDescription) refreshmentsDescription.textContent = french ? 'Choisissez une boisson offerte pendant votre visite.' : english ? 'Choose a complimentary drink during your visit.' : 'Keyifli ziyaretiniz sırasında ikramlarımızdan dilediğinizi seçebilirsiniz.';
  
  renderWorkingHours();
  renderServiceCards();
  renderRefreshments();
  renderPriceList();
  populateFormSelects();
  populateDays();
  applySiteContent();
}

document.addEventListener('DOMContentLoaded', function(){
  const revealSite = () => {
    document.body.classList.remove('site-loading');
    document.body.classList.add('site-ready');
  };
  renderShopInfo();
  const languageSelect = document.getElementById('language-select');
  if(languageSelect){
    languageSelect.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => {
        currentLanguage = button.dataset.language;
        setLocalPreference('siteLanguage', currentLanguage);
        applyLanguage();
      });
    });
  }
  
  renderWorkingHours();
  renderServiceCards();
  renderRefreshments();
  renderPriceList();
  populateFormSelects();
  populateDays();
  fetchAppointmentsForSlots();
  setupScrollReveal();
  applyLanguage();
  fetchSiteContent().then(content => {
    if(content){
      siteContent = { ...createDefaultSiteContent(), ...content };
      renderShopInfo();
      renderServiceCards();
      renderPriceList();
      populateBarberSelect();
      populateBookingServices();
      updateTimeSlots();
      applySiteContent();
    }
  }).catch(err => {
    console.warn('Site içerikleri Supabase üzerinden yüklenemedi:', err);
  }).finally(revealSite);

  const fDay = document.getElementById('f-day');
  if(fDay) fDay.addEventListener('change', () => { updateTimeSlots(); fetchAppointmentsForSlots(); });
  
  const fMonth = document.getElementById('f-month');
  if(fMonth) fMonth.addEventListener('change', () => { populateDays(); fetchAppointmentsForSlots(); });
  
  const fYear = document.getElementById('f-year');
  if(fYear) fYear.addEventListener('change', () => { populateDays(); fetchAppointmentsForSlots(); });
  
  const fBarber = document.getElementById('f-barber');
  if(fBarber) fBarber.addEventListener('change', () => {
    selectedBarberId = fBarber.value || 'barber_1';
    setLocalPreference('selectedBarberId', selectedBarberId);
    populateBookingServices();
    updateTimeSlots();
    fetchAppointmentsForSlots();
  });

  const bookingForm = document.getElementById('booking-form');
  if(bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
});

function renderShopInfo(){
  const content = siteContent || createDefaultSiteContent();
  document.title = currentLanguage === 'fr'
    ? `${shopDisplayText(content.shopName)} — Salon de coiffure pour hommes à ${content.locationName}`
    : currentLanguage === 'en'
      ? `${shopDisplayText(content.shopName)} — Men’s Barber Shop in ${content.locationName}`
      : `${shopDisplayText(content.shopName)} — ${content.locationName}`;
  const description = document.querySelector('meta[name="description"]');
  if(description){
    description.content = currentLanguage === 'fr'
      ? `Salon de coiffure pour hommes à ${content.locationName} : coupes, barbe et soins. Prenez rendez-vous en ligne.`
      : currentLanguage === 'en'
        ? `Gentlemen's Barber shop — Haircuts, beard trims and skin care in ${content.locationName}. Book online.`
        : `Gentlemen's Barber shop — ${content.locationName}'de saç, sakal ve cilt bakımı. Online randevu alın.`;
  }
  document.querySelectorAll('.js-shop-name').forEach(el => el.textContent = shopDisplayText(content.shopName));
  document.querySelectorAll('.js-shop-short').forEach(el => el.textContent = shopDisplayText(content.shopShort));
  document.querySelectorAll('.js-location').forEach(el => el.textContent = content.locationName);
  document.querySelectorAll('.js-address').forEach(el => el.textContent = content.address);
  document.querySelectorAll('.js-phone').forEach(el => el.textContent = content.phone);
  document.querySelectorAll('.js-rating').forEach(el => el.textContent = GOOGLE_RATING);
  document.querySelectorAll('.js-rating-count').forEach(el => el.textContent = GOOGLE_RATING_COUNT);
  document.querySelectorAll('.js-service-count').forEach(el => el.textContent = Array.isArray(content.services) ? content.services.length : SERVICES.length);

  document.querySelectorAll('.js-logo-icon').forEach(el => { if(typeof logoMarkSVG === 'function') el.innerHTML = logoMarkSVG(); });

  const mapFrame = document.getElementById('map-frame');
  if(mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(content.address)}&z=16&output=embed`;

  const whatsappText = currentLanguage === 'fr'
    ? 'Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous.'
    : currentLanguage === 'en'
      ? 'Hello%2C%20I%20would%20like%20to%20book%20an%20appointment.'
      : 'Merhaba%2C%20randevu%20almak%20istiyorum.';
  document.querySelectorAll('.js-whatsapp-link').forEach(el => { el.href = `https://wa.me/${content.whatsappNumber}?text=${whatsappText}`; });
  document.querySelectorAll('.js-instagram-link').forEach(el => { el.href = content.instagramUrl; });
  document.querySelectorAll('.js-maps-link').forEach(el => { el.href = content.mapsLink; });
  document.querySelectorAll('.js-phone-link').forEach(el => { el.href = `tel:+${content.whatsappNumber}`; });
  document.querySelectorAll('.hero-photo').forEach(el => { el.src = content.heroImage; });
  document.querySelectorAll('.about-photo').forEach(el => { el.src = content.aboutImage; });
}

function applySiteContent(){
  const content = siteContent || createDefaultSiteContent();
  const fillPlaceholders = text => text
    .replaceAll('{{shopName}}', shopDisplayText(content.shopName))
    .replaceAll('{{locationName}}', content.locationName);
  const eyebrow = document.querySelector('.js-hero-eyebrow');
  if(eyebrow) eyebrow.textContent = currentLanguage === 'fr'
    ? shopDisplayText(content.heroEyebrowFr || localizeCmsText(
      content.heroEyebrow === createDefaultSiteContent().heroEyebrow
        ? 'Le salon de coiffure pour hommes incontournable de Sultanbeyli'
        : content.heroEyebrow
    ))
    : currentLanguage === 'en' && (
      content.heroEyebrow === createDefaultSiteContent().heroEyebrow ||
      content.heroEyebrow === "Sultanbeyli'nin Tercih Edilen Erkek shop'u"
    )
      ? 'Sultanbeyli’s Preferred Men’s Barber Shop'
    : shopDisplayText(content.heroEyebrow);
  const highlight = document.getElementById('hero-highlight');
  if(highlight) highlight.textContent = currentLanguage === 'fr' && content.heroHighlight === 'tarzınızı'
    ? 'votre style'
    : currentLanguage === 'en' && content.heroHighlight === 'tarzınızı'
      ? 'your style'
      : content.heroHighlight;
  const lead = document.querySelector('.js-hero-lead');
  if(lead) lead.textContent = currentLanguage === 'fr'
    ? shopDisplayText(content.heroLeadFr || (content.heroLead === createDefaultSiteContent().heroLead
      ? `Le lieu où style, soin et confiance se rencontrent à ${content.locationName}. Profitez d’une expérience de coiffure haut de gamme et prenez rendez-vous dès maintenant.`
      : localizeCmsText(fillPlaceholders(content.heroLead))))
    : currentLanguage === 'en' && content.heroLead === createDefaultSiteContent().heroLead
      ? `The place where style, care and confidence come together in ${content.locationName}. Book your premium barbering experience with expert hands today.`
      : shopDisplayText(fillPlaceholders(content.heroLead));
  const quote = document.getElementById('about-quote');
  if(quote) quote.textContent = currentLanguage === 'fr' && content.aboutQuote === '"Bir tıraş, sadece görünüşü değil, günü de değiştirir."'
    ? '« Une coupe ne change pas seulement votre apparence, elle illumine aussi votre journée. »'
    : currentLanguage === 'en' && content.aboutQuote === '"Bir tıraş, sadece görünüşü değil, günü de değiştirir."'
      ? '"A haircut changes more than your appearance; it can change your whole day."'
    : shopDisplayText(content.aboutQuote);
  const aboutParagraph1 = document.getElementById('about-paragraph-1');
  if(aboutParagraph1) aboutParagraph1.textContent = currentLanguage === 'fr'
    ? shopDisplayText(content.aboutParagraphsFr?.[0] || (content.aboutParagraphs[0] === createDefaultSiteContent().aboutParagraphs[0]
      ? `${content.shopName}, à ${content.locationName}, propose des services de coiffure haut de gamme pour hommes. Nous souhaitons offrir à chacun un lieu où il se sent valorisé et peut profiter d’un moment de détente.`
      : localizeCmsText(fillPlaceholders(content.aboutParagraphs[0]))))
    : currentLanguage === 'en' && content.aboutParagraphs[0] === createDefaultSiteContent().aboutParagraphs[0]
      ? `${content.shopName} offers premium barbering services for men in ${content.locationName}. Our aim is not only to cut hair and beards, but to provide every client with a place where they feel valued and can enjoy a peaceful moment.`
      : shopDisplayText(fillPlaceholders(content.aboutParagraphs[0]));
  const aboutParagraph2 = document.getElementById('about-paragraph-2');
  if(aboutParagraph2) aboutParagraph2.textContent = currentLanguage === 'fr'
    ? shopDisplayText(content.aboutParagraphsFr?.[1] || (content.aboutParagraphs[1] === createDefaultSiteContent().aboutParagraphs[1]
      ? 'Nous associons le savoir-faire traditionnel aux techniques modernes et accordons de l’attention à chaque détail. Notre équipe expérimentée sera ravie de vous accueillir.'
      : localizeCmsText(fillPlaceholders(content.aboutParagraphs[1]))))
    : currentLanguage === 'en' && (
      content.aboutParagraphs[1] === createDefaultSiteContent().aboutParagraphs[1] ||
      content.aboutParagraphs[1] === 'Geleneksel berberlik ustalığını modern tekniklerle birleştiriyor, her detaya özen gösteriyoruz. Deneyimli ekibimiz, güler yüzümüz ve titizliğimizle sizi ağırlamaktan mutluluk duyarız.'
    )
      ? 'With professional experience stretching from Marseille, France, to Turkey, I bring modern men’s hair design and European style to Istanbul. With international experience, an aesthetic perspective and a personalized approach, I provide every client with high-quality, professional service.'
      : shopDisplayText(fillPlaceholders(content.aboutParagraphs[1]));
}

function renderWorkingHours(){
  const table = document.getElementById('hours-table');
  if(!table) return;
  const rows = currentLanguage === 'fr'
    ? [
        { day: 'Lundi – vendredi', hours: '09 h – 22 h' },
        { day: 'Samedi', hours: '09 h – minuit' },
        { day: 'Dimanche', hours: 'Fermé' }
      ]
    : currentLanguage === 'en'
      ? [
          { day: 'Monday – Friday', hours: '09:00 – 22:00' },
          { day: 'Saturday', hours: '09:00 – midnight' },
          { day: 'Sunday', hours: 'Closed' }
        ]
    : WORKING_HOURS;
  table.innerHTML = rows.map(row => `<tr><td>${row.day}</td><td>${row.hours}</td></tr>`).join('');
}

function renderServiceCards(){
  const grid = document.getElementById('services-grid');
  if(!grid) return;
  const services = Array.isArray(siteContent.services) ? siteContent.services : SERVICES;
  grid.innerHTML = services.map((rawService) => { 
    const s = localizedService(rawService); 
    return `
      <div class="service-card">
        <img class="service-photo" src="${escapeHtml(s.img)}" alt="${escapeHtml(s.name)}" loading="lazy">
        <div class="service-card-body">
          <div class="tag">${escapeHtml(s.tag)}</div>
          <h3>${escapeHtml(s.name)}</h3>
          <div class="price">${escapeHtml(s.price)}</div>
          <p>${escapeHtml(s.desc)}</p>
        </div>
      </div>
    `; 
  }).join('');
}

function renderRefreshments(){
  const grid = document.getElementById('refreshments-grid');
  if(!grid) return;

  grid.innerHTML = REFRESHMENTS.map(item => `
    <div class="refreshment-card">
      <span class="refreshment-icon" aria-hidden="true">${item.icon}</span>
      <h3>${item.names[currentLanguage] || item.names.tr}</h3>
    </div>
  `).join('');
}

function renderPriceList(){
  const list = document.getElementById('price-list');
  if(!list) return;
  const services = Array.isArray(siteContent.services) ? siteContent.services : SERVICES;
  list.innerHTML = services.map(rawService => { 
    const s = localizedService(rawService); 
    return `
      <div class="price-item">
        <div class="price-item-top">
          <div>
            <div class="tag">${escapeHtml(s.tag)}</div>
            <h3>${escapeHtml(s.name)}</h3>
          </div>
          <div class="price">${escapeHtml(s.price)}</div>
        </div>
        <p>${escapeHtml(s.desc)}</p>
      </div>
    `; 
  }).join('');
}

function populateFormSelects(){
  populateBarberSelect();
  populateBookingServices();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const fMonth = document.getElementById('f-month');
  if(fMonth){
    const months = currentLanguage === 'fr' ? FR_MONTHS : currentLanguage === 'en' ? EN_MONTHS : MONTHS;
    fMonth.innerHTML = months.map((m,i) => `<option value="${i+1}"${i + 1 === currentMonth ? ' selected' : ''}>${m}</option>`).join('');
  }

  const fYear = document.getElementById('f-year');
  if(fYear){
    fYear.innerHTML = [currentYear, currentYear + 1].map(y => `<option value="${y}"${y === currentYear ? ' selected' : ''}>${y}</option>`).join('');
  }

  const fTime = document.getElementById('f-time');
  if(fTime){
    fTime.replaceChildren();
  }
}

function populateBarberSelect(){
  const barberSelect = document.getElementById('f-barber');
  const barbers = getActiveBarbers();
  if(barberSelect){
    barberSelect.innerHTML = barbers.map(barber => `<option value="${escapeHtml(barber.id)}">${escapeHtml(shopDisplayText(barber.names?.tr || barber.name))}</option>`).join('');
    barberSelect.value = selectedBarberId && barbers.some(b => b.id === selectedBarberId) ? selectedBarberId : barbers[0].id;
    selectedBarberId = barberSelect.value;
  }
}

function populateBookingServices(){
  const serviceSelect = document.getElementById('f-service');
  if(!serviceSelect) return;

  const services = siteContent.bookingServices?.[selectedBarberId] || BARBER_SERVICES[selectedBarberId] || [];
  serviceSelect.replaceChildren(...services.map(service => {
    const selectedName = service.names[currentLanguage] || (currentLanguage === 'fr' && FR_BOOKING_SERVICE_NAMES[service.id]) || service.names.tr;
    const name = currentLanguage === 'fr' ? localizeCmsText(selectedName) : selectedName;
    return new Option(`${name} — ${service.price}₺`, service.id);
  }));
}

function populateDays(){
  const monthSel = document.getElementById('f-month');
  const yearSel = document.getElementById('f-year');
  const daySel = document.getElementById('f-day');
  if(!monthSel || !yearSel || !daySel) return;

  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();

  const month = parseInt(monthSel.value || String(todayMonth), 10);
  const year = parseInt(yearSel.value || String(todayYear), 10);
  const count = daysInMonth(month, year);
  const oldValue = parseInt(daySel.value || '0', 10);

  const days = [];
  for(let d = 1; d <= count; d++){
    const isPastDay = year < todayYear || (year === todayYear && month < todayMonth) || (year === todayYear && month === todayMonth && d < todayDay);
    if(!isPastDay) days.push(`<option value="${d}">${d}</option>`);
  }
  daySel.innerHTML = days.join('');

  if(oldValue && Array.from(daySel.options).some(o => Number(o.value) === oldValue)){
    daySel.value = String(oldValue);
  }else if(daySel.options.length){
    daySel.selectedIndex = 0;
  }
  updateTimeSlots();
}

async function fetchAppointmentsForSlots(){
  existingAppointments = await fetchAllAppointments();
  updateTimeSlots();
}

function updateTimeSlots(){
  const daySel = document.getElementById('f-day');
  const monthSel = document.getElementById('f-month');
  const yearSel = document.getElementById('f-year');
  const timeSel = document.getElementById('f-time');
  const barberSel = document.getElementById('f-barber');
  if(!daySel || !daySel.value || !timeSel) return;

  const day = String(daySel.value).padStart(2,'0');
  const month = String(monthSel.value).padStart(2,'0');
  const year = String(yearSel.value);
  const selectedDateStr = `${year}-${month}-${day}`;
  const selectedBarber = String((barberSel ? barberSel.value : selectedBarberId) || '').trim();
  const timeSlots = getTimeSlotsForDate(Number(year), Number(month), Number(day));

  if(!timeSlots.length){
    const closedLabel = currentLanguage === 'fr' ? 'Fermé' : currentLanguage === 'en' ? 'Closed' : 'Kapalı';
    timeSel.innerHTML = `<option value="" disabled selected>${closedLabel}</option>`;
    return;
  }

  const bookedTimes = existingAppointments
    .filter(a => {
      const appointmentBarber = String(a.barberId || a.barber_id || a.barber || '').trim();
      return Boolean(selectedBarber) &&
        normalizeDate(a.date || a.appointment_date) === selectedDateStr &&
        appointmentBarber === selectedBarber;
    })
    .map(a => normalizeTime(a.time))
    .filter(Boolean);

  const html = timeSlots.map(slot => {
    const slotTime = normalizeTime(slot);
    const [hour, minute] = slotTime.split(':').map(Number);
    const slotDate = new Date(Number(year), Number(month)-1, Number(day), hour, minute, 0, 0);
    const isPast = slotDate.getTime() < Date.now();
    const isBooked = bookedTimes.includes(slotTime);

    if(isBooked) return `<option value="${slot}" disabled style="color:#d15965;">${slot} (${localizedUiText('booked', 'DOLU')})</option>`;
    if(isPast)   return `<option value="${slot}" disabled style="color:#888;">${slot} (${localizedUiText('past', 'GEÇTİ')})</option>`;
    return `<option value="${slot}">${slot}</option>`;
  }).join('');

  timeSel.innerHTML = html;
  const firstAvailable = Array.from(timeSel.options).find(o => !o.disabled);
  if(firstAvailable) timeSel.value = firstAvailable.value;
}

// Supabase Randevu Gönderme İşlemi
async function handleBookingSubmit(e){
  e.preventDefault();
  const msgBox = document.getElementById('form-msg');
  msgBox.innerHTML = '';

  const name = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const serviceId = document.getElementById('f-service').value;
  const barberId = document.getElementById('f-barber')?.value || selectedBarberId || 'barber_1';
  const day = parseInt(document.getElementById('f-day').value, 10);
  const month = parseInt(document.getElementById('f-month').value, 10);
  const year = parseInt(document.getElementById('f-year').value, 10);
  const time = document.getElementById('f-time').value;

  if(!name || !phone){
    msgBox.innerHTML = `<div class="msg err">${localizedUiText('bookingNameRequired', 'Lütfen ad soyad ve telefon bilgisi girin.')}</div>`;
    return;
  }

  const normalizedPhone = phone.replace(/\D/g, '');
  const bookingServices = siteContent.bookingServices?.[barberId] || BARBER_SERVICES[barberId] || [];
  const service = bookingServices.find(item => item.id === serviceId);
  const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const startTime = normalizeTime(time);
  const availableTimeSlots = getTimeSlotsForDate(year, month, day);
  const slotOption = document.getElementById('f-time').selectedOptions[0];
  const selectedDate = new Date(year, month - 1, day);
  const selectedSlotDate = new Date(year, month - 1, day, Number(startTime.slice(0,2)), Number(startTime.slice(3,5)));
  if(!service || !availableTimeSlots.includes(time) || !slotOption || slotOption.disabled ||
     selectedDate.getFullYear() !== year || selectedDate.getMonth() !== month - 1 || selectedDate.getDate() !== day ||
     selectedSlotDate.getTime() <= Date.now()){
    msgBox.innerHTML = `<div class="msg err">${localizedUiText('bookingInvalidSelection', 'Lütfen geçerli bir hizmet, tarih ve uygun saat seçin.')}</div>`;
    return;
  }
  if(normalizedPhone.length < 10 || normalizedPhone.length > 15){
    msgBox.innerHTML = `<div class="msg err">${localizedUiText('bookingInvalidPhone', 'Lütfen geçerli bir telefon numarası girin.')}</div>`;
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = localizedUiText('saving', 'Kaydediliyor...');

  const appointment = {
    id: 'appt_' + Date.now() + '_' + Math.random().toString(36).slice(2,8),
    name, phone: normalizedPhone,
    serviceId, serviceName: service ? (service.names[currentLanguage] || service.names.tr) : serviceId,
    barberId,
    barberName: getActiveBarbers().find(item => item.id === barberId)?.names?.tr || getActiveBarbers().find(item => item.id === barberId)?.name || 'Berber',
    date: dateStr,
    time: startTime,
    createdAt: new Date().toISOString()
  };

  try{
    if(isSupabaseConfigured()){
      await addAppointmentToSupabase(appointment);
    } else {
      throw new Error('Supabase ayarları konfigüre edilmemiş.');
    }

    const barberName = getActiveBarbers().find(item => item.id === barberId)?.names?.tr || getActiveBarbers().find(item => item.id === barberId)?.name || 'Berber';
    const monthName = currentLanguage === 'fr'
      ? FR_MONTHS[month - 1]
      : currentLanguage === 'en'
        ? EN_MONTHS[month - 1]
        : MONTHS[month - 1];
    msgBox.innerHTML = currentLanguage === 'fr'
      ? `<div class="msg ok">${FR_UI.bookingSaved} ${day} ${monthName} ${year} à ${startTime} — ${barberName}. ${FR_UI.bookingSavedSuffix}</div>`
      : currentLanguage === 'en'
        ? `<div class="msg ok">${EN_UI.bookingSaved} ${monthName} ${day}, ${year} at ${startTime} — ${barberName}. ${EN_UI.bookingSavedSuffix}</div>`
        : `<div class="msg ok">Randevunuz alındı! ${day} ${monthName} ${year}, saat ${startTime} — ${barberName} ile sizi bekliyoruz.</div>`;
    
    e.target.reset();
    populateFormSelects();
    populateDays();
    fetchAppointmentsForSlots();
  }catch(err){
    console.error('Booking error:', err);
    msgBox.innerHTML = `<div class="msg err">${localizedUiText('bookingFailed', 'Randevu kaydedilemedi:')} ${escapeHtml(err.message)}</div>`;
  }finally{
    submitBtn.disabled = false;
    submitBtn.textContent = localizedUiText('bookingConfirmation', 'Randevuyu Onayla');
  }
}

function setupScrollReveal(){
  const items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
}