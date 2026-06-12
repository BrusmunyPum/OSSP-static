/* ============================================
   OSSP Admin Dashboard
   Static admin data mirrors database/ossp_schema.sql.
   Replace DB object + CRUD helpers with real API
   calls when the Spring Boot backend is ready.
   ============================================ */

(function () {
  'use strict';

  // --- Auth guard ---
  if (sessionStorage.getItem('ossp_admin') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  // ============================================
  // MOCK DATA (mirrors ossp_schema.sql seeds)
  // ============================================
  var DB = {
    categories: [
      { id: 1, name: 'Pneumatic Products' },
      { id: 2, name: 'Power Transmission' },
      { id: 3, name: 'Electric Components' },
      { id: 4, name: 'Lubricate & Grease Bearing' },
      { id: 5, name: 'Gasket & Oil Seal' },
      { id: 6, name: 'Tools' },
      { id: 7, name: 'Bag Filters' }
    ],

    products: [
      { id: 1, name: 'AirTAC Solenoid Valve 4V210',        slug: 'airtac-solenoid-valve-4v210',           img: '../assets/images/products/seals.png',            categoryId: 1, brand: 'AirTAC',    featured: true,  active: true,
        desc: 'AirTAC 4V210-08 five-port two-position solenoid directional valve for pneumatic cylinder and actuator control on automation lines.',
        specs: 'Port: 1/4" NPT | Pressure: 0.15–0.8 MPa | Temp: −20°C to 70°C | Voltage: AC220V / DC24V | Flow: 400 L/min' },
      { id: 2, name: 'Festo Pneumatic Cylinder DSBC',       slug: 'festo-pneumatic-cylinder-dsbc',         img: '../assets/images/products/product-hydraulic.jpg', categoryId: 1, brand: 'Festo',     featured: false, active: true,
        desc: 'Festo DSBC double-acting round cylinder compliant with ISO 15552. Suitable for packaging machinery, assembly lines, and material handling.',
        specs: 'Bore: 32–125 mm | Stroke: up to 500 mm | Max pressure: 12 bar | Standard: ISO 15552' },
      { id: 3, name: 'Optibelt V-Belt SPB Series',          slug: 'optibelt-vbelt-spb',                    img: '../assets/images/products/belts.png',             categoryId: 2, brand: 'Optibelt',  featured: true,  active: true,
        desc: 'Optibelt Red Power III high-performance SPB wrapped V-belt engineered for heavy-duty industrial drives with superior power and longevity.',
        specs: 'Profile: SPB | Angle: 40° | Material: EPDM | Temp: −30°C to 80°C | Standard: ISO 4184 / DIN 7753' },
      { id: 4, name: 'Habasit Conveyor Belt',               slug: 'habasit-conveyor-belt',                 img: '../assets/images/products/product-belt.jpg',      categoryId: 2, brand: 'Habasit',   featured: false, active: true,
        desc: 'Habasit light conveyor belt for food processing, packaging, and logistics. FDA-compliant materials available on request.',
        specs: 'Width: custom | Thickness: 1.5–12 mm | Surface: smooth / rough-top | Temp: −10°C to 90°C | Tensile: 800 N/mm' },
      { id: 5, name: 'Schneider Contactor LC1D',            slug: 'schneider-contactor-lc1d',              img: '../assets/images/products/vfd.png',               categoryId: 3, brand: 'Schneider', featured: true,  active: true,
        desc: 'Schneider Electric TeSys LC1D IEC contactor for motor control centers, industrial switching, and starter assemblies.',
        specs: 'Current: 9–800 A | Voltage: up to 690 V AC | Coil: 24–600 V AC/DC | Standard: IEC 60947-4-1' },
      { id: 6, name: 'SKF Spherical Roller Bearing 22220',  slug: 'skf-spherical-roller-bearing-22220',    img: '../assets/images/products/product-bearing.jpg',   categoryId: 4, brand: 'SKF',       featured: true,  active: true,
        desc: 'SKF 22220 E self-aligning spherical roller bearing for heavy combined radial and axial loads in demanding industrial applications.',
        specs: 'Bore: 100 mm | OD: 180 mm | Width: 46 mm | Dynamic load: 285 kN | Max speed: 3,400 rpm' },
      { id: 7, name: 'Garlock Gasket Sheet 3000',           slug: 'garlock-gasket-sheet-3000',             img: '../assets/images/products/product-sealing.jpg',   categoryId: 5, brand: 'Garlock',   featured: false, active: true,
        desc: 'Garlock BLUE-GARD Style 3000 compressed non-asbestos gasket sheet for flanges, pumps, heat exchangers, and chemical equipment.',
        specs: 'Size: 1500 × 1500 mm | Thickness: 0.5–6.35 mm | Temp: −200°C to 400°C | Max pressure: 250 bar' },
      { id: 8, name: 'Industrial Bag Filter PE-500',        slug: 'industrial-bag-filter-pe-500',          img: '../assets/images/products/iot.png',               categoryId: 7, brand: 'OSSP',      featured: false, active: false,
        desc: 'PE-500 series pulse-jet bag dust collector for cement plants, woodworking facilities, food processing, and mining operations.',
        specs: 'Filter area: 500 m² | Air volume: 15,000–80,000 m³/h | Cleaning: pulse-jet | Media: polyester felt | Efficiency: ≥99.9%' }
    ],

    industries: [
      { id: 1,  name: 'Steel Manufacturing',        icon: 'fa-industry',       img: '../assets/images/industries/industry-steel.jpg',   desc: "Bearings, pneumatics, electrical controls, belts, and flow-control parts for Cambodia's demanding steel production lines.",
        challenges: 'Extreme heat, heavy shock loads, heavy dust, corrosion, and zero-downtime continuous operation.',
        relatedProducts: 'Spherical Roller Bearings, Conveyor Belts, V-Belts, Bag Filters, Pneumatic Controls, Lubricants' },
      { id: 2,  name: 'Thermal Power',              icon: 'fa-bolt',           img: '../assets/images/industries/industry-power.jpg',   desc: 'Critical components for turbines, generators, conveyor systems, and cooling towers in power stations.',
        challenges: 'High temperatures, vibration, steam exposure, and strict reliability requirements for grid uptime.',
        relatedProducts: 'Spherical Roller Bearings, Conveyor Belts, Schneider Contactors, Garlock Gaskets, Bag Filters' },
      { id: 3,  name: 'Oil & Gas',                  icon: 'fa-oil-can',        img: '../assets/images/industries/industry-oil.jpg',     desc: 'Flow-control products, electrical components, bearings, and condition-monitoring support.',
        challenges: 'Explosive atmospheres, chemical exposure, high pressure, and remote site logistics.',
        relatedProducts: 'Kitz Valves, Spirax Sarco Steam Traps, SKF Bearings, Garlock Seals, ABB Motors' },
      { id: 4,  name: 'Cement & Mining',            icon: 'fa-hard-hat',       img: '../assets/images/industries/industry-factory.jpg', desc: 'Heavy-duty spherical roller bearings, conveyor drive systems, and industrial lubricants.',
        challenges: 'Extreme abrasion, dust contamination, heavy continuous loads, and high-shock kiln drives.',
        relatedProducts: 'SKF Spherical Roller Bearings, Optibelt V-Belts, Habasit Conveyor Belts, Bag Filters, Lubricants' },
      { id: 5,  name: 'Automotive',                 icon: 'fa-car-side',       img: '../assets/images/industries/industry-car.jpg',     desc: 'Precision bearings, drive belts, and VFD solutions for automotive assembly lines.',
        challenges: 'High precision requirements, clean-room areas, and multi-shift production with minimal stoppages.',
        relatedProducts: 'SKF Bearings, Optibelt V-Belts, Schneider VFDs, AirTAC Pneumatics, Festo Cylinders' },
      { id: 6,  name: 'Agriculture & Food',         icon: 'fa-wheat-awn',      img: '../assets/images/industries/industry-agri.jpg',    desc: 'Belts, conveyor parts, bearings, pneumatics for rice mills, sugar mills, and food processing.',
        challenges: 'Moisture, sugar/starch contamination, FDA compliance, and seasonal peak-load operation.',
        relatedProducts: 'Habasit Food-Grade Belts, SKF Food-Grade Bearings, AirTAC Pneumatics, Lubricants' },
      { id: 7,  name: 'Textile & Garment',          icon: 'fa-shirt',          img: '../assets/images/general/tile-service.png',        desc: "Motors, VFDs, drive belts, and pneumatic components for Cambodia's garment sector.",
        challenges: 'Lint contamination, high motor start-stop cycles, and cost-sensitive spare-part budgets.',
        relatedProducts: 'Optibelt V-Belts, ABB Motors, Schneider VFDs, AirTAC Solenoid Valves' },
      { id: 8,  name: 'Paper & Packaging',          icon: 'fa-box-open',       img: '../assets/images/products/product-iot.png',        desc: 'Conveyor systems, roller bearings, gearboxes, and bag-filter solutions for paper mills.',
        challenges: 'Moisture, paper dust, high-speed winding rollers, and continuous 24/7 operation.',
        relatedProducts: 'SKF Bearings, Habasit Conveyor Belts, Bag Filters, Garlock Gaskets' },
      { id: 9,  name: 'Brewery & Beverage',         icon: 'fa-beer-mug-empty', img: '../assets/images/products/product-hydraulic.jpg',  desc: 'Pumps, flow-control valves, stainless bearings, and conveyor drives for bottling lines.',
        challenges: 'Washdown environments, CO₂ exposure, stainless steel requirements, and hygienic design standards.',
        relatedProducts: 'Kitz Stainless Valves, SKF Stainless Bearings, Spirax Sarco Steam, Habasit Hygienic Belts' },
      { id: 10, name: 'Construction',               icon: 'fa-helmet-safety',  img: '../assets/images/hero/hero-factory.jpg',           desc: 'Heavy-duty bearings, power transmission components, and pneumatic tools for machinery.',
        challenges: 'Outdoor environments, dust and mud, mobile equipment, and impact loads on rotating parts.',
        relatedProducts: 'SKF Bearings, Optibelt V-Belts, Pneumatic Tools, Lubricants' },
      { id: 11, name: 'Transportation & Logistics', icon: 'fa-truck-fast',     img: '../assets/images/general/company.jpg',             desc: 'Drive belts, bearings, electrical components for warehouse conveyors and fleet operations.',
        challenges: 'High cycle frequency on conveyors, fleet maintenance costs, and spare-part availability.',
        relatedProducts: 'Habasit Conveyor Belts, SKF Bearings, Schneider Contactors, Optibelt V-Belts' }
    ],

    articles: [
      { id: 1, title: 'How to Install Spherical Roller Bearings Correctly', category: 'Technical Guide',   published: true,  views: 248, date: '2026-05-12',
        author: 'OSSP Technical Team', coverImage: '../assets/images/products/product-bearing.jpg',
        body: 'Correct bearing installation is one of the most critical maintenance skills in any industrial plant. Improper mounting accounts for over 16% of premature bearing failures worldwide.\n\nStep 1: Clean the housing and shaft. Remove all dirt, old grease, and rust before starting.\nStep 2: Check fit tolerances. Measure shaft and housing bores with a micrometer to confirm fits per ISO/DIN standards.\nStep 3: Use induction heating. Heat the bearing to 80–100°C before mounting — never use an open flame.\nStep 4: Press straight. Apply force only to the ring being mounted; never strike the rolling elements or cage.\nStep 5: Verify axial position. Use a feeler gauge to confirm the bearing seats fully against the shoulder.\nStep 6: Re-lubricate. Apply correct grease quantity — typically 30–50% of free bearing space.' },
      { id: 2, title: '5 Signs Your V-Belt Needs Replacement',              category: 'Maintenance Tips',  published: true,  views: 187, date: '2026-05-02',
        author: 'OSSP Technical Team', coverImage: '../assets/images/products/belts.png',
        body: 'V-belts are workhorses of industrial power transmission, but they wear progressively. Knowing when to replace them prevents unexpected downtime.\n\n1. Cracking or fraying on the belt sides — surface cracks indicate heat aging or misalignment.\n2. Glazed or shiny contact surface — slipping causes the belt surface to harden and lose grip.\n3. Belt squealing on startup — tension loss or misaligned pulleys cause noise on acceleration.\n4. Visible elongation — stretch beyond adjustment range means the belt has exceeded its elastic limit.\n5. Vibration or pulsing under load — uneven wear or belt splice failure causes irregular power transfer.\n\nAs a general rule, inspect V-belts every 2,000 operating hours or at each planned shutdown.' },
      { id: 3, title: 'Choosing the Right Pneumatic Valve for Your Line',   category: 'Product Knowledge', published: true,  views: 132, date: '2026-04-21',
        author: 'OSSP Technical Team', coverImage: '../assets/images/products/seals.png',
        body: 'Selecting the correct pneumatic directional control valve requires matching four key parameters to your application.\n\nPort configuration: 3/2-way valves control single-acting cylinders; 5/2-way and 5/3-way valves control double-acting cylinders.\n\nActuation method: Spring-return solenoid valves are standard for automation. Manually-operated valves suit maintenance bypass situations.\n\nFlow rate (Cv): Size the valve so your required flow is within 60–80% of its rated capacity to maintain reliable switching.\n\nPressure rating: Select a valve rated at least 30% above your maximum operating pressure for safety margin.\n\nOur AirTAC 4V and Festo DSBC series cover the most common Cambodia factory requirements.' },
      { id: 4, title: "Cambodia's Industrial Growth Outlook 2026",          category: 'Industry News',     published: false, views: 0,   date: null,
        author: 'OSSP Research Team', coverImage: '../assets/images/industries/industry-factory.jpg',
        body: 'Draft — pending review before publication.' },
      { id: 5, title: 'Preventive Maintenance Checklist for Gearboxes',     category: 'Maintenance Tips',  published: true,  views: 96,  date: '2026-03-30',
        author: 'OSSP Technical Team', coverImage: '../assets/images/general/company.jpg',
        body: 'Gearboxes are high-value assets that benefit enormously from structured preventive maintenance. Use this checklist at each scheduled shutdown.\n\nWeekly checks:\n□ Check oil level via sight glass\n□ Listen for unusual noise or vibration\n□ Inspect oil temperature (normal: 50–80°C above ambient)\n\nMonthly checks:\n□ Inspect all seals and gaskets for weeping\n□ Verify coupling alignment within ±0.05 mm\n□ Check breather valve — clean or replace if blocked\n\nAnnual service:\n□ Drain and refill oil (or analyse sample for metal particles)\n□ Inspect internal gear teeth via oil drain plug with bore scope\n□ Check bearing clearances and replace if worn\n□ Torque all fasteners to specification' }
    ],

    gallery: [
      { id: 1, title: 'Office Building',      img: '../assets/images/general/company.jpg',              category: 'Office'  },
      { id: 2, title: 'Training Session',     img: '../assets/images/services/training.png',            category: 'Event'   },
      { id: 3, title: 'Bearing Stock',        img: '../assets/images/products/product-bearing.jpg',     category: 'Product' },
      { id: 4, title: 'Belt Inventory',       img: '../assets/images/products/product-belt.jpg',        category: 'Product' },
      { id: 5, title: 'Steel Plant Visit',    img: '../assets/images/industries/industry-steel.jpg',    category: 'Event'   },
      { id: 6, title: 'Power Station Survey', img: '../assets/images/industries/industry-power.jpg',    category: 'Event'   },
      { id: 7, title: 'Seal Products',        img: '../assets/images/products/product-sealing.jpg',     category: 'Product' },
      { id: 8, title: 'Inverter Range',       img: '../assets/images/products/product-inverter.jpg',    category: 'Product' }
    ],

    faqs: [
      { id: 1, q: 'What industries does OSSP serve?',            a: 'OSSP serves 11 key industries in Cambodia including Steel, Thermal Power, Oil & Gas, Cement & Mining, Automotive, Agriculture & Food, Textile & Garment, Paper & Packaging, Brewery & Beverage, Construction, and Transportation & Logistics.' },
      { id: 2, q: 'Are the products original and certified?',    a: 'Yes. All products are sourced from authorized manufacturers and come with full documentation, traceability records, and a 12-month warranty guarantee.' },
      { id: 3, q: 'Does OSSP provide on-site technical support?', a: 'Yes. Our experienced engineers offer on-site installation, vibration analysis, bearing training, and failure root-cause analysis.' },
      { id: 4, q: 'How can I request a quotation?',              a: 'You can submit a request via our Contact page, call our hotline at 017 340 769 / 096 970 3548, or email cs@osspcambodia.com.' },
      { id: 5, q: 'What are your office working hours?',         a: 'Monday - Friday: 8:00 AM - 5:30 PM. Saturday: 8:00 AM - 12:00 PM.' }
    ],

    inquiries: [
      { id: 1, first: 'Sokha',  last: 'Chan',  email: 'sokha.chan@steelco.kh',   company: 'Phnom Penh Steel Co.',   message: 'We need a quotation for 20 units of SKF 22220 spherical roller bearings with delivery to our plant in Kandal.', status: 'NEW',         date: '2026-06-10' },
      { id: 2, first: 'Dara',   last: 'Kim',   email: 'dara.kim@agrimill.com',   company: 'Mekong Rice Mill',       message: 'Looking for conveyor belt replacement for our rice mill. Can your engineer visit for measurement?',          status: 'NEW',         date: '2026-06-09' },
      { id: 3, first: 'Vannak', last: 'Sok',   email: 'vannak@garmentplus.kh',   company: 'Garment Plus Ltd.',      message: 'Need pricing for 50 Schneider contactors LC1D25 and delivery schedule.',                                    status: 'IN_PROGRESS', date: '2026-06-07' },
      { id: 4, first: 'Lina',   last: 'Heng',  email: 'lina.heng@brewco.com',    company: 'Angkor Brew Co.',        message: 'Interested in your maintenance service contract for our bottling line equipment.',                          status: 'REPLIED',     date: '2026-06-04' },
      { id: 5, first: 'Piseth', last: 'Mao',   email: 'piseth@cementkh.com',     company: 'Kampot Cement',          message: 'Requesting bag filter specifications for our dust collection system.',                                     status: 'REPLIED',     date: '2026-06-01' },
      { id: 6, first: 'Sreyna', last: 'Pich',  email: 'sreyna.pich@gmail.com',   company: '',                       message: 'Do you offer bearing installation training for individual technicians?',                                   status: 'CLOSED',      date: '2026-05-28' }
    ],

    partners: [
      { id: 1, name: 'AirTAC', img: '../assets/images/partners/partner-airtac.svg', desc: 'Leading manufacturer of pneumatic control components and actuators.', websiteUrl: 'https://www.airtac.com' },
      { id: 2, name: 'Festo', img: '', desc: 'Global supplier of automation technology and pneumatic solutions.', websiteUrl: 'https://www.festo.com' },
      { id: 3, name: 'SMC', img: '', desc: 'World leader in pneumatic control engineering and drive technology.', websiteUrl: 'https://www.smcworld.com' },
      { id: 4, name: 'Optibelt', img: '../assets/images/partners/partner-optibelt.svg', desc: 'Premium manufacturer of high-performance V-belts and drive belts.', websiteUrl: 'https://www.optibelt.com' },
      { id: 5, name: 'Habasit', img: '', desc: 'Global leader in conveyor belts and power transmission belting.', websiteUrl: 'https://www.habasit.com' },
      { id: 6, name: 'SKF', img: '', desc: 'Global manufacturer of high-quality bearings, seals, and lubrication.', websiteUrl: 'https://www.skf.com' },
      { id: 7, name: 'RKB', img: '../assets/images/partners/partner-rkb.png', desc: 'Swiss manufacturer of heavy-duty industrial bearings.', websiteUrl: 'https://www.rkbbearings.com' },
      { id: 8, name: 'KOYO', img: '../assets/images/partners/partner-koyo.svg', desc: 'Automotive and industrial bearing manufacturer from Japan.', websiteUrl: 'https://www.koyo.jtekt.co.jp' },
      { id: 9, name: 'TIMKEN', img: '', desc: 'Global manufacturer of tapered roller bearings and mechanical parts.', websiteUrl: 'https://www.timken.com' },
      { id: 10, name: 'ABB', img: '../assets/images/partners/partner-abb.svg', desc: 'Pioneering technology leader in electrification and motors.', websiteUrl: 'https://global.abb' },
      { id: 11, name: 'Schneider', img: '../assets/images/partners/partner-schneider.svg', desc: 'Digital transformation leader in energy management and contactors.', websiteUrl: 'https://www.se.com' },
      { id: 12, name: 'Siemens', img: '', desc: 'Global technology powerhouse in electrification and automation.', websiteUrl: 'https://www.siemens.com' },
      { id: 13, name: 'Garlock', img: '', desc: 'High-performance fluid sealing and pipeline protection products.', websiteUrl: 'https://www.garlock.com' },
      { id: 14, name: 'Kitz', img: '', desc: 'Japanese industrial valve manufacturer and fluid control systems.', websiteUrl: 'https://www.kitz.com' },
      { id: 15, name: 'Spirax Sarco', img: '', desc: 'World leader in steam system management and thermal energy.', websiteUrl: 'https://www.spiraxsarco.com' }
    ],

    slides: [
      { id: 1, title: 'Industrial Spare Parts Supplier',  subtitle: 'Original parts for every major industry in Cambodia', img: '../assets/images/hero/hero-1.png',       active: true },
      { id: 2, title: 'Authorized Distributor',           subtitle: 'AirTAC, Festo, SMC, SKF, ABB, Schneider and more',    img: '../assets/images/hero/hero-2.png',       active: true },
      { id: 3, title: 'Maintenance & Training Services',  subtitle: 'On-site support from experienced engineers',          img: '../assets/images/hero/hero-factory.jpg', active: false }
    ],

    settings: [
      { key: 'company_name',    label: 'Company Name',     value: 'O S S P (CAMBODIA) CO., LTD.' },
      { key: 'company_address', label: 'Address',          value: '#191A, Street 2006, Orkide Village, Sangkat Obeka Om, Khan Sen Sok, Phnom Penh, Cambodia', wide: true },
      { key: 'phone_primary',   label: 'Primary Phone',    value: '017 340 769' },
      { key: 'phone_secondary', label: 'Secondary Phone',  value: '096 970 3548' },
      { key: 'email_primary',   label: 'Primary Email',    value: 'cs@osspcambodia.com' },
      { key: 'email_secondary', label: 'Secondary Email',  value: 'phany.phon.@osspcambodia.com' },
      { key: 'facebook_url',    label: 'Facebook URL',     value: 'https://www.facebook.com/' },
      { key: 'youtube_url',     label: 'YouTube URL',      value: 'https://www.youtube.com/' },
      { key: 'working_hours',   label: 'Working Hours',    value: 'Mon-Fri: 8:00 AM - 5:30 PM | Sat: 8:00 AM - 12:00 PM', wide: true },
      { key: 'map_lat',         label: 'Map Latitude',     value: '11.5433504' },
      { key: 'map_lng',         label: 'Map Longitude',    value: '104.8744523' },
      { key: 'trusted_clients', label: 'Trusted Clients',  value: '70+' },
      { key: 'consultation_title', label: 'Consultation Support Title', value: 'FREE TECHNICAL CONSULTATION SUPPORT', wide: true },
      { key: 'consultation_text',  label: 'Consultation Description',  value: 'We offer free 24/7 support and answer all your questions about our products, services, and technical issues. Contact us for immediate assistance.', wide: true },
      { key: 'about_story_main',   label: 'Home Story Paragraph',      value: 'Registered in 2024, OSSP Cambodia is a professional supplier of original industrial spare parts and technical services in Cambodia. We support factories with genuine products, ready stock, and practical technician skill.', wide: true },
      { key: 'about_stats_registered', label: 'Stat: Registered Year', value: '2024' },
      { key: 'about_stats_customers',  label: 'Stat: Customers Count', value: '80+' },
      { key: 'about_stats_categories', label: 'Stat: Categories Count', value: '8' },
      { key: 'about_stats_brands',     label: 'Stat: Brands Count',     value: '20+' },
      { key: 'about_mission',          label: 'About: Mission Statement', value: 'To solve industrial supply problems for Cambodian factories with original parts, technical support, and practical engineering skills.', wide: true },
      { key: 'about_description',      label: 'About: Company Description', value: 'OSSP Cambodia is an industrial spare parts and service company registered in 2024. We supply original products from 20+ global brands and provide technical training and maintenance services to factories across Cambodia.', wide: true },
      { key: 'website_tagline',        label: 'Website Tagline',         value: 'Your Trusted Industrial Partner in Cambodia', wide: true },
      { key: 'director_phone',         label: 'Director Phone',          value: '098 383 0712' },
      { key: 'vat_tin',               label: 'VAT / Tax Reg. Number',   value: 'K009-902404530' }
    ],

    users: [
      { id: 1, username: 'admin',   email: 'cs@osspcambodia.com',         fullName: 'OSSP Admin',  role: 'SUPER_ADMIN', active: true,  lastLogin: '2026-06-11 09:24' },
      { id: 2, username: 'editor1', email: 'phany.phon.@osspcambodia.com', fullName: 'Phany Phon', role: 'EDITOR',      active: true,  lastLogin: '2026-06-09 15:02' }
    ],

    services: [
      { id: 1, name: 'Technical Training', img: '../assets/images/services/training.png', desc: 'Hands-on maintenance training programs for your engineering team', active: true },
      { id: 2, name: 'Technical Support', img: '../assets/images/general/tile-service.png', desc: 'On-site assistance and rapid troubleshooting by certified engineers', active: true },
      { id: 3, name: 'Expert Consulting', img: '../assets/images/general/consult-bg.jpg', desc: 'Tailored industrial supply consultation to optimise your operations', active: true },
      { id: 4, name: 'Field Operations', img: '../assets/images/general/company.jpg', desc: 'Dedicated field engineers serving major industries across Cambodia', active: true }
    ],

    testimonials: [
      { id: 1, name: 'Omega', img: '../assets/images/general/avatar.jpg', stars: 5, quote: 'OSSP (Cambodia) Co., Ltd. places great emphasis on building and expanding relationships with customers, suppliers, and especially strategic partnerships based on trust, respect, and mutual benefit.', active: true },
      { id: 2, name: 'RKB Testimonial', img: '../assets/images/partners/partner-rkb.png', stars: 5, quote: "At the heart of OSSP's approach is a commitment to trust and respect in all relationships. This means honoring commitments, maintaining integrity, and treating partners fairly and transparently.", active: true }
    ],

    jobs: [
      { id: 1, title: 'Sales Engineer', department: 'Sales & Marketing', type: 'Full-Time', location: 'Phnom Penh', active: true },
      { id: 2, title: 'Mechanical Maintenance Technician', department: 'Technical Support', type: 'Full-Time', location: 'Phnom Penh & Field', active: true }
    ],

    team: [
      { id: 1, fullName: 'Phany Phon', position: 'Managing Director', img: '../assets/images/general/avatar.jpg', active: true },
      { id: 2, fullName: 'OSSP Leader', position: 'Technical Manager', img: '../assets/images/general/avatar.jpg', active: true }
    ],

    pages: [
      { id: 1, title: 'Privacy Policy', slug: 'privacy-policy', content: 'This Privacy Policy explains how OSSP (Cambodia) Co., Ltd. collects, uses, and protects your information when you visit our website. We respect your privacy and are committed to protecting it through compliance with this policy.' },
      { id: 2, title: 'Terms & Conditions', slug: 'terms-and-conditions', content: 'By accessing and using this website, you agree to comply with and be bound by the following Terms & Conditions. These terms govern OSSP\'s relationship with you in relation to this website.' },
      { id: 3, title: 'Refund Policy', slug: 'refund-policy', content: 'Our Refund Policy details the terms and conditions under which you may request a refund for products or services purchased from OSSP. Please review it carefully before completing transactions.' }
    ],

    trainingCourses: [
      { id: 1, title: 'Bearing Handling & Inspection', format: 'Workshop', duration: 'Half day', img: '../assets/images/services/training.png', desc: 'Hands-on training covering correct bearing mounting and dismounting, damage identification, contamination prevention, and proper storage procedures.', active: true },
      { id: 2, title: 'Power Transmission Selection', format: 'Technical Class', duration: '1 day', img: '../assets/images/products/product-belt.jpg', desc: 'Learn how to select the right V-belt, conveyor belt, and coupling for your specific application, load conditions, and environment.', active: true },
      { id: 3, title: 'Maintenance Strategy for Plants', format: 'On-site', duration: 'Custom schedule', img: '../assets/images/industries/industry-factory.jpg', desc: 'Customised maintenance strategy covering preventive, predictive, and corrective maintenance approaches for your production line.', active: true }
    ],

    processSteps: [
      { id: 1, order: 1, icon: 'fa-magnifying-glass', title: 'Analysis & Research', desc: 'We assess your equipment, identify the right spare parts, and understand your operational requirements.', active: true },
      { id: 2, order: 2, icon: 'fa-lightbulb', title: 'Strategy', desc: 'Our engineers recommend the best products, brands, and maintenance approach for your specific industry.', active: true },
      { id: 3, order: 3, icon: 'fa-gears', title: 'Execution', desc: 'We supply original parts, provide hands-on installation support, and ensure everything meets quality standards.', active: true },
      { id: 4, order: 4, icon: 'fa-headset', title: 'Support', desc: 'Ongoing technical support, warranty management, and follow-up service to keep your operations running smoothly.', active: true }
    ],

    commitments: [
      { id: 1, icon: 'fa-hand-holding-heart', title: 'Free Support Services', desc: '24/7 free technical consultation and after-sales support for all customers, at no extra charge.', active: true },
      { id: 2, icon: 'fa-trophy', title: 'Work for Success of Partner', desc: 'We dedicate our expertise to ensure your operations achieve maximum efficiency and uptime.', active: true },
      { id: 3, icon: 'fa-gem', title: 'Highest Quality Product', desc: 'All products sourced from authorized manufacturers with full traceability documentation and certificates.', active: true },
      { id: 4, icon: 'fa-shield-halved', title: '12-Month Product Guarantee', desc: 'Every product comes with a full 12-month warranty backed directly by the manufacturer.', active: true },
      { id: 5, icon: 'fa-user-tie', title: 'Board of Directors Responsibility', desc: 'Our leadership team personally oversees quality standards and customer satisfaction for every order.', active: true }
    ],

    certifications: [
      { id: 1, name: 'Certificate of Incorporation', issuer: 'Ministry of Commerce, Cambodia', certNumber: 'Co.8856E/2024', issueDate: '2024-03-15', expiryDate: '', img: '../assets/images/favicon.png', active: true },
      { id: 2, name: 'Tax Registration Certificate', issuer: 'General Department of Taxation', certNumber: 'K009-902404530', issueDate: '2024-04-01', expiryDate: '', img: '../assets/images/favicon.png', active: true }
    ],

    distributionFeatures: [
      { id: 1, icon: 'fa-warehouse',      title: 'Ready Stock Warehouse',   desc: 'Over 1,000 SKUs in our Phnom Penh warehouse for same-day or next-day delivery across Cambodia.', link: '', active: true },
      { id: 2, icon: 'fa-truck-fast',     title: 'Nationwide Delivery',     desc: 'Fast and reliable shipping to all provinces with tracking support and flexible delivery options.', link: '', active: true },
      { id: 3, icon: 'fa-headset',        title: '24/7 Technical Support',  desc: 'Our engineers are available around the clock for emergency consultation and order assistance.', link: '', active: true },
      { id: 4, icon: 'fa-shield-halved',  title: 'Authorized Distribution', desc: 'Official authorized distributor for 20+ global brands with full warranty and traceability documentation.', link: '', active: true }
    ],

    featureTiles: [
      { id: 1, title: 'Products',   subtitle: 'Original Spare Parts',    img: '../assets/images/general/tile-product.jpg', link: '../pages/products.html',  icon: 'fa-box-open',  active: true },
      { id: 2, title: 'Services',   subtitle: 'Maintenance & Training',  img: '../assets/images/general/tile-service.png',  link: '../pages/services.html',  icon: 'fa-gears',     active: true },
      { id: 3, title: 'Knowledge',  subtitle: 'Technical Articles',      img: '../assets/images/general/company.jpg',       link: '../pages/knowledge.html', icon: 'fa-book-open', active: true }
    ],

    seoSettings: [
      { id: 1,  page: 'Home',                 file: 'index.html',               title: 'OSSP Cambodia | Industrial Spare Parts & Services',          desc: 'Authorized distributor of AirTAC, SKF, Schneider, Festo and 20+ brands. Spare parts, training and maintenance in Cambodia.',              keywords: 'industrial spare parts Cambodia, bearing supplier, pneumatic products' },
      { id: 2,  page: 'About',                file: 'about.html',               title: 'About OSSP Cambodia | Industrial Supplier',                  desc: 'Learn about OSSP Cambodia — our mission, team, authorized brands and commitment to quality industrial spare parts.',                       keywords: 'about OSSP Cambodia, industrial company Phnom Penh' },
      { id: 3,  page: 'Products',             file: 'products.html',            title: 'Industrial Spare Parts — Products | OSSP Cambodia',          desc: 'Browse pneumatic products, bearings, belts, electrical components, gaskets, tools and bag filters from 20+ global brands.',             keywords: 'bearings Cambodia, pneumatic products, V-belt, industrial components' },
      { id: 4,  page: 'Services',             file: 'services.html',            title: 'Maintenance & Technical Services | OSSP Cambodia',           desc: 'Industrial maintenance, technical training, vibration analysis and equipment condition monitoring services in Cambodia.',                keywords: 'maintenance service Cambodia, bearing training, technical support' },
      { id: 5,  page: 'Training Courses',     file: 'training-course.html',     title: 'Technical Training Courses | OSSP Cambodia',                 desc: 'Hands-on bearing, belt and maintenance training workshops for factory engineers and technicians in Cambodia.',                          keywords: 'bearing training Cambodia, maintenance workshop, technical course' },
      { id: 6,  page: 'Industries',           file: 'industries.html',          title: 'Industries We Serve | OSSP Cambodia',                        desc: 'OSSP serves 11 industries: Steel, Power, Oil & Gas, Cement, Automotive, Agriculture, Textile, Paper, Brewery, Construction, Logistics.', keywords: 'industrial supplier Cambodia, factory spare parts, steel plant' },
      { id: 7,  page: 'Contact',              file: 'contact.html',             title: 'Contact OSSP Cambodia | Get a Quote',                        desc: 'Contact OSSP Cambodia for quotations, technical support and inquiries. Call 017 340 769 or email cs@osspcambodia.com.',                 keywords: 'contact OSSP, spare parts quote Cambodia, industrial supplier contact' },
      { id: 8,  page: 'Distribution System',  file: 'distribution-system.html', title: 'Distribution System & Strengths | OSSP Cambodia',            desc: "OSSP's nationwide distribution network, ready stock warehouse and authorized brand partnerships across Cambodia.",                      keywords: 'distribution Cambodia, OSSP strengths, spare parts supply chain' },
      { id: 9,  page: 'Partners',             file: 'partner.html',             title: 'Our Partners & Authorized Brands | OSSP Cambodia',           desc: 'Authorized distributor for AirTAC, Festo, SMC, SKF, ABB, Schneider, Optibelt and 20+ global brands in Cambodia.',                     keywords: 'AirTAC Cambodia, SKF distributor, Schneider dealer Phnom Penh' },
      { id: 10, page: 'Knowledge / Articles', file: 'knowledge.html',           title: 'Technical Knowledge & Articles | OSSP Cambodia',             desc: 'Industrial maintenance tips, product guides, bearing installation tutorials and industry news from OSSP engineers.',                     keywords: 'bearing maintenance tips, industrial articles Cambodia, technical guide' },
      { id: 11, page: 'Gallery',              file: 'gallery.html',             title: 'Photo Gallery | OSSP Cambodia',                              desc: 'OSSP Cambodia office, product inventory, training sessions and industry visits gallery.',                                              keywords: 'OSSP gallery, Cambodia industrial company photos' },
      { id: 12, page: 'FAQ',                  file: 'faq.html',                 title: 'Frequently Asked Questions | OSSP Cambodia',                 desc: 'Answers to common questions about OSSP products, services, warranties, delivery and technical support.',                                keywords: 'OSSP FAQ, industrial spare parts questions Cambodia' },
      { id: 13, page: 'Recruitment',          file: 'recruitment.html',         title: 'Join Our Team | Careers at OSSP Cambodia',                   desc: 'Explore career opportunities at OSSP Cambodia. We are hiring sales engineers and technical specialists in Phnom Penh.',                keywords: 'jobs OSSP Cambodia, engineering careers Phnom Penh' }
    ],

    partnershipValues: [
      { id: 1, order: '01', title: 'Trust',           desc: 'Clear commitments and transparent communication form the foundation of every relationship we build.', active: true },
      { id: 2, order: '02', title: 'Respect',         desc: 'We respect customer operations, supplier standards, and the expertise of each team involved.', active: true },
      { id: 3, order: '03', title: 'Mutual Benefit',  desc: 'Each partnership should create measurable value for all sides and support sustainable growth.', active: true },
      { id: 4, order: '04', title: 'Long-Term Focus', desc: 'OSSP prioritizes reliability, continuity, and shared development over short-term transactions.', active: true }
    ],

    partnershipActions: [
      { id: 1, icon: 'fa-list-check',     title: 'Shared Planning',         desc: 'We align product supply and service support with customer maintenance priorities and operational schedules.', active: true },
      { id: 2, icon: 'fa-handshake',      title: 'Reliable Promises',       desc: 'Commitments are handled carefully, with clear expectations about availability, lead time, and service responsibility.', active: true },
      { id: 3, icon: 'fa-chart-line',     title: 'Continuous Improvement',  desc: 'Feedback from customers and suppliers helps improve stock planning, service quality, and technical capability.', active: true }
    ]
  };

  // ============================================
  // HELPERS
  // ============================================
  function $(sel)    { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var STATUS_BADGE = {
    NEW:         '<span class="badge badge-red">New</span>',
    IN_PROGRESS: '<span class="badge badge-amber">In Progress</span>',
    REPLIED:     '<span class="badge badge-green">Replied</span>',
    CLOSED:      '<span class="badge badge-gray">Closed</span>'
  };

  function activeBadge(on) {
    return on
      ? '<span class="badge badge-green">Active</span>'
      : '<span class="badge badge-gray">Inactive</span>';
  }

  function catName(id) {
    var c = DB.categories.find(function (x) { return x.id === id; });
    return c ? c.name : '—';
  }

  function toast(msg) {
    var t = $('#toast');
    $('#toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  function rowActions(entity, id) {
    return '<td class="cell-actions">' +
      '<button class="icon-btn" data-edit="' + entity + '" data-id="' + id + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="icon-btn danger" data-del="' + entity + '" data-id="' + id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
      '</td>';
  }

  // ============================================
  // RENDERERS
  // ============================================
  function renderStats() {
    var newInq = DB.inquiries.filter(function (i) { return i.status === 'NEW'; }).length;
    $('#statGrid').innerHTML =
      statCard('blue',  'fa-box-open',            DB.products.length,   'Products') +
      statCard('green', 'fa-industry',            DB.industries.length, 'Industries') +
      statCard('amber', 'fa-newspaper',           DB.articles.length,   'Articles') +
      statCard('red',   'fa-envelope-open-text',  newInq,               'New Inquiries');

    var badge = $('#inquiryBadge');
    badge.textContent = newInq;
    badge.setAttribute('data-zero', newInq === 0 ? 'true' : 'false');
  }

  function statCard(color, icon, num, label) {
    return '<div class="stat-card">' +
      '<div class="stat-icon ' + color + '"><i class="fa-solid ' + icon + '"></i></div>' +
      '<div class="stat-info"><strong>' + num + '</strong><span>' + label + '</span></div>' +
      '</div>';
  }

  function renderDashboardCharts() {
    renderMonthlyChart();
    renderStatusOverview();
  }

  function renderMonthlyChart() {
    var chart = $('#monthlyChart');
    if (!chart) return;

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    var counts = [2, 3, 4, 5, 6, 4];

    DB.inquiries.forEach(function (q) {
      var month = parseInt((q.date || '').slice(5, 7), 10);
      if (month >= 1 && month <= 6) counts[month - 1] += 1;
    });

    var max = Math.max.apply(null, counts);
    chart.innerHTML = counts.map(function (count, index) {
      var height = Math.max(12, Math.round((count / max) * 145));
      return '<div class="bar-item">' +
        '<div class="bar-track">' +
          '<div class="bar-fill" data-value="' + count + '" style="height:' + height + 'px"></div>' +
        '</div>' +
        '<span class="bar-label">' + monthNames[index] + '</span>' +
      '</div>';
    }).join('');
  }

  function renderStatusOverview() {
    var wrap = $('#statusOverview');
    if (!wrap) return;

    var labels = [
      ['NEW', 'New', '#ed3b3b'],
      ['IN_PROGRESS', 'In Progress', '#de9924'],
      ['REPLIED', 'Replied', '#2ea063'],
      ['CLOSED', 'Closed', '#71809c']
    ];
    var total = DB.inquiries.length || 1;
    var rows = labels.map(function (item) {
      var count = DB.inquiries.filter(function (q) { return q.status === item[0]; }).length;
      var width = Math.max(7, Math.round((count / total) * 100));
      return '<div class="status-row">' +
        '<span class="status-name">' + item[1] + '</span>' +
        '<span class="status-meter"><span style="--meter:' + width + '%;--meter-color:' + item[2] + '"></span></span>' +
        '<span class="status-count">' + count + '</span>' +
      '</div>';
    }).join('');

    wrap.innerHTML = rows +
      '<div class="status-summary-card">' +
        '<div><strong>' + DB.inquiries.length + '</strong><span>Total inquiries tracked</span></div>' +
        '<i class="fa-solid fa-headset"></i>' +
      '</div>';
  }

  function renderDashInquiries() {
    $('#dashInquiriesTbody').innerHTML = DB.inquiries.slice(0, 4).map(function (q) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(q.first + ' ' + q.last) + '</td>' +
        '<td>' + esc(q.company || '—') + '</td>' +
        '<td>' + STATUS_BADGE[q.status] + '</td>' +
        '<td>' + esc(q.date) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderInquiries() {
    var term = ($('#inquirySearch').value || '').toLowerCase();
    var filter = $('#inquiryFilter').value;
    var rows = DB.inquiries.filter(function (q) {
      var hay = (q.first + ' ' + q.last + ' ' + q.email + ' ' + q.company).toLowerCase();
      return hay.indexOf(term) !== -1 && (!filter || q.status === filter);
    });

    $('#inquiriesTbody').innerHTML = rows.map(function (q) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(q.first + ' ' + q.last) + '</td>' +
        '<td>' + esc(q.email) + '</td>' +
        '<td>' + esc(q.company || '—') + '</td>' +
        '<td>' + STATUS_BADGE[q.status] + '</td>' +
        '<td>' + esc(q.date) + '</td>' +
        '<td class="cell-actions">' +
          '<button class="icon-btn" data-view-inq="' + q.id + '" title="View"><i class="fa-solid fa-eye"></i></button>' +
          '<button class="icon-btn danger" data-del="inquiries" data-id="' + q.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</td></tr>';
    }).join('') || emptyRow(6, 'No inquiries found.');
  }

  function renderProducts() {
    var term = ($('#productSearch').value || '').toLowerCase();
    var filter = $('#productFilter').value;
    var rows = DB.products.filter(function (p) {
      return p.name.toLowerCase().indexOf(term) !== -1 &&
        (!filter || p.categoryId === parseInt(filter, 10));
    });

    $('#productsTbody').innerHTML = rows.map(function (p) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(p.name) + '</td>' +
        '<td>' + esc(catName(p.categoryId)) + '</td>' +
        '<td>' + esc(p.brand) + '</td>' +
        '<td>' + (p.featured ? '<span class="badge badge-blue">Featured</span>' : '—') + '</td>' +
        '<td>' + activeBadge(p.active) + '</td>' +
        rowActions('products', p.id) +
        '</tr>';
    }).join('') || emptyRow(6, 'No products found.');
  }

  function renderProductsThumb() {
    var term = ($('#productSearch').value || '').toLowerCase();
    var filter = $('#productFilter').value;
    var rows = DB.products.filter(function (p) {
      return p.name.toLowerCase().indexOf(term) !== -1 &&
        (!filter || p.categoryId === parseInt(filter, 10));
    });

    $('#productsTbody').innerHTML = rows.map(function (p) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(p.img || '../assets/images/products/bearings.png') + '" alt="' + esc(p.name) + '" loading="lazy" />' +
          '<div><span class="cell-strong">' + esc(p.name) + '</span><span class="cell-sub">' + esc(p.brand) + '</span></div>' +
        '</td>' +
        '<td>' + esc(catName(p.categoryId)) + '</td>' +
        '<td>' + (p.featured ? '<span class="badge badge-blue">Featured</span>' : '—') + '</td>' +
        '<td>' + activeBadge(p.active) + '</td>' +
        rowActions('products', p.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No products found.');
  }

  function renderProductFilter() {
    $('#productFilter').innerHTML =
      '<option value="">All categories</option>' +
      DB.categories.map(function (c) {
        return '<option value="' + c.id + '">' + esc(c.name) + '</option>';
      }).join('');
  }

  function renderIndustries() {
    $('#industriesGrid').innerHTML = DB.industries.map(function (d) {
      return '<div class="ind-admin-card">' +
        '<img class="ind-admin-img" src="' + esc(d.img || '../assets/images/industries/industry-steel.jpg') + '" alt="' + esc(d.name) + '" loading="lazy" />' +
        '<div class="ind-admin-body"><h4>' + esc(d.name) + '</h4><p>' + esc(d.desc) + '</p></div>' +
        '<div class="ind-admin-actions">' +
          '<button class="icon-btn" data-edit="industries" data-id="' + d.id + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
          '<button class="icon-btn danger" data-del="industries" data-id="' + d.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div></div>';
    }).join('');
  }

  function renderArticles() {
    var term = ($('#articleSearch').value || '').toLowerCase();
    var rows = DB.articles.filter(function (a) {
      return a.title.toLowerCase().indexOf(term) !== -1;
    });

    $('#articlesTbody').innerHTML = rows.map(function (a) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(a.title) + '</td>' +
        '<td>' + esc(a.category) + '</td>' +
        '<td>' + (a.published ? '<span class="badge badge-green">Published</span>' : '<span class="badge badge-amber">Draft</span>') + '</td>' +
        '<td>' + a.views + '</td>' +
        '<td>' + esc(a.date || '—') + '</td>' +
        rowActions('articles', a.id) +
        '</tr>';
    }).join('') || emptyRow(6, 'No articles found.');
  }

  function renderGallery() {
    $('#galleryGrid').innerHTML = DB.gallery.map(function (g) {
      return '<div class="gallery-admin-item">' +
        '<img src="' + g.img + '" alt="' + esc(g.title) + '" loading="lazy" />' +
        '<div class="gallery-admin-meta"><span>' + esc(g.title) + '</span>' +
          '<button class="icon-btn danger" data-del="gallery" data-id="' + g.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div></div>';
    }).join('');
  }

  function renderFaqs() {
    $('#faqList').innerHTML = DB.faqs.map(function (f) {
      return '<div class="faq-admin-item">' +
        '<div class="faq-q">' +
          '<h4><i class="fa-solid fa-circle-question"></i>' + esc(f.q) + '</h4>' +
          '<p>' + esc(f.a) + '</p>' +
        '</div>' +
        '<div class="ind-admin-actions">' +
          '<button class="icon-btn" data-edit="faq" data-id="' + f.id + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
          '<button class="icon-btn danger" data-del="faq" data-id="' + f.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div></div>';
    }).join('');
  }

  var PARTNER_COLORS = ['#2f69cf','#e05a2b','#1a8754','#6f42c1','#0d6efd','#c0392b','#17a589','#884ea0'];
  function partnerInitialsBadge(name) {
    var initials = name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    var color = PARTNER_COLORS[name.charCodeAt(0) % PARTNER_COLORS.length];
    return '<div style="width:36px;height:36px;border-radius:6px;background:' + color + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:#fff;letter-spacing:0.5px;">' + initials + '</div>';
  }

  function renderPartners() {
    $('#partnersTbody').innerHTML = DB.partners.map(function (p) {
      var logoHtml = p.img
        ? '<img class="product-admin-thumb" src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" style="width:36px;height:36px;border-radius:4px;object-fit:contain;border:1px solid var(--admin-line);" />'
        : partnerInitialsBadge(p.name);
      
      var partnerCell = '<td class="product-cell" style="display:flex;align-items:center;gap:12px;border:none;">' +
        logoHtml +
        '<span class="cell-strong">' + esc(p.name) + '</span>' +
        '</td>';
      
      var descCell = '<td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(p.desc || '') + '">' + esc(p.desc || '—') + '</td>';
      
      var urlCell = p.websiteUrl
        ? '<td><a href="' + esc(p.websiteUrl) + '" target="_blank" class="partner-admin-link" style="margin:0;"><i class="fa-solid fa-earth-americas"></i> Website</a></td>'
        : '<td><span class="cell-sub">—</span></td>';
      
      return '<tr>' +
        partnerCell +
        descCell +
        urlCell +
        rowActions('partners', p.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No partners found.');
  }

  function renderSlides() {
    $('#slidesList').innerHTML = DB.slides.map(function (s) {
      return '<div class="slide-admin-item">' +
        '<img src="' + s.img + '" alt="' + esc(s.title) + '" />' +
        '<div class="slide-admin-body">' +
          '<h4>' + esc(s.title) + '</h4>' +
          '<p>' + esc(s.subtitle) + '</p>' +
        '</div>' +
        activeBadge(s.active) +
        '<div class="ind-admin-actions">' +
          '<button class="icon-btn" data-edit="slides" data-id="' + s.id + '" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
          '<button class="icon-btn danger" data-del="slides" data-id="' + s.id + '" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div></div>';
    }).join('');
  }

  function renderSettings() {
    $('#settingsForm').innerHTML = DB.settings.map(function (s) {
      return '<div class="form-field' + (s.wide ? ' span-2' : '') + '">' +
        '<label for="set_' + s.key + '">' + esc(s.label) + '</label>' +
        '<input type="text" id="set_' + s.key + '" data-key="' + s.key + '" value="' + esc(s.value) + '" />' +
        '</div>';
    }).join('');
  }

  function renderUsers() {
    var ROLE_BADGE = {
      SUPER_ADMIN: '<span class="badge badge-red">Super Admin</span>',
      EDITOR:      '<span class="badge badge-blue">Editor</span>',
      VIEWER:      '<span class="badge badge-gray">Viewer</span>'
    };
    $('#usersTbody').innerHTML = DB.users.map(function (u) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(u.fullName) + '<span class="cell-sub">@' + esc(u.username) + '</span></td>' +
        '<td>' + esc(u.email) + '</td>' +
        '<td>' + (ROLE_BADGE[u.role] || esc(u.role)) + '</td>' +
        '<td>' + activeBadge(u.active) + '</td>' +
        '<td>' + esc(u.lastLogin) + '</td>' +
        rowActions('users', u.id) +
        '</tr>';
    }).join('');
  }

  function renderCategories() {
    $('#categoriesTbody').innerHTML = DB.categories.map(function (c) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(c.name) + '</td>' +
        rowActions('categories', c.id) +
        '</tr>';
    }).join('') || emptyRow(2, 'No categories found.');
  }

  function renderPages() {
    $('#pagesTbody').innerHTML = DB.pages.map(function (p) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(p.title) + '</td>' +
        '<td><code>/' + esc(p.slug) + '</code></td>' +
        rowActions('pages', p.id) +
        '</tr>';
    }).join('') || emptyRow(3, 'No pages found.');
  }

  function renderServices() {
    $('#servicesTbody').innerHTML = DB.services.map(function (s) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(s.img || '../assets/images/general/tile-service.png') + '" alt="' + esc(s.name) + '" loading="lazy" />' +
          '<span class="cell-strong">' + esc(s.name) + '</span>' +
        '</td>' +
        '<td>' + esc(s.desc) + '</td>' +
        '<td>' + activeBadge(s.active) + '</td>' +
        rowActions('services', s.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No services found.');
  }

  function renderTestimonials() {
    $('#testimonialsTbody').innerHTML = DB.testimonials.map(function (t) {
      var starsStr = '';
      for (var i = 0; i < t.stars; i++) starsStr += '★';
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(t.img || '../assets/images/general/avatar.jpg') + '" alt="' + esc(t.name) + '" loading="lazy" />' +
          '<span class="cell-strong">' + esc(t.name) + '</span>' +
        '</td>' +
        '<td style="color:#f1c40f;font-size:1.1rem;">' + starsStr + '</td>' +
        '<td>' + activeBadge(t.active) + '</td>' +
        rowActions('testimonials', t.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No testimonials found.');
  }

  function renderJobs() {
    $('#jobsTbody').innerHTML = DB.jobs.map(function (j) {
      return '<tr>' +
        '<td class="cell-strong">' + esc(j.title) + '</td>' +
        '<td>' + esc(j.department) + '</td>' +
        '<td><span class="badge badge-blue">' + esc(j.type) + '</span></td>' +
        '<td>' + esc(j.location) + '</td>' +
        '<td>' + activeBadge(j.active) + '</td>' +
        rowActions('jobs', j.id) +
        '</tr>';
    }).join('') || emptyRow(6, 'No recruitment positions found.');
  }

  function renderTeam() {
    $('#teamTbody').innerHTML = DB.team.map(function (m) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(m.img || '../assets/images/general/avatar.jpg') + '" alt="' + esc(m.fullName) + '" loading="lazy" />' +
          '<span class="cell-strong">' + esc(m.fullName) + '</span>' +
        '</td>' +
        '<td>' + esc(m.position) + '</td>' +
        '<td>' + activeBadge(m.active) + '</td>' +
        rowActions('team', m.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No team members found.');
  }

  function renderCertifications() {
    $('#certificationsTbody').innerHTML = DB.certifications.map(function (c) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(c.img || '../assets/images/favicon.png') + '" alt="' + esc(c.name) + '" loading="lazy" style="object-fit:contain;background:#f0f4f9;border-radius:4px;" />' +
          '<div><span class="cell-strong">' + esc(c.name) + '</span><span class="cell-sub">' + esc(c.certNumber) + '</span></div>' +
        '</td>' +
        '<td>' + esc(c.issuer) + '</td>' +
        '<td>' + esc(c.issueDate) + '</td>' +
        '<td>' + activeBadge(c.active) + '</td>' +
        rowActions('certifications', c.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No certifications found.');
  }

  function renderDistributionFeatures() {
    $('#distFeaturesTbody').innerHTML = DB.distributionFeatures.map(function (f) {
      return '<tr>' +
        '<td class="cell-strong"><i class="fa-solid ' + esc(f.icon) + '" style="color:var(--admin-blue);width:20px;margin-right:8px;"></i>' + esc(f.title) + '</td>' +
        '<td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(f.desc) + '">' + esc(f.desc) + '</td>' +
        '<td>' + activeBadge(f.active) + '</td>' +
        rowActions('distributionFeatures', f.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No distribution features found.');
  }

  function renderFeatureTiles() {
    $('#featureTilesTbody').innerHTML = DB.featureTiles.map(function (t) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(t.img || '../assets/images/general/company.jpg') + '" alt="' + esc(t.title) + '" loading="lazy" />' +
          '<div><span class="cell-strong">' + esc(t.title) + '</span><span class="cell-sub">' + esc(t.subtitle) + '</span></div>' +
        '</td>' +
        '<td><i class="fa-solid ' + esc(t.icon) + '" style="color:var(--admin-blue);margin-right:6px;"></i><code style="font-size:0.78rem;color:#62708c;">' + esc(t.icon) + '</code></td>' +
        '<td><code style="font-size:0.78rem;background:#eef1f6;padding:2px 6px;border-radius:4px;">' + esc(t.link) + '</code></td>' +
        '<td>' + activeBadge(t.active) + '</td>' +
        rowActions('featureTiles', t.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No feature tiles found.');
  }

  function renderSeoSettings() {
    $('#seoSettingsTbody').innerHTML = DB.seoSettings.map(function (s) {
      return '<tr>' +
        '<td><span class="badge badge-blue">' + esc(s.page) + '</span></td>' +
        '<td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(s.title) + '">' + esc(s.title) + '</td>' +
        '<td style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(s.desc) + '">' + esc(s.desc) + '</td>' +
        '<td class="cell-actions">' +
          '<button class="icon-btn" data-edit="seoSettings" data-id="' + s.id + '" title="Edit SEO"><i class="fa-solid fa-pen"></i></button>' +
        '</td>' +
        '</tr>';
    }).join('') || emptyRow(4, 'No SEO settings found.');
  }

  function renderTrainingCourses() {
    $('#trainingCoursesTbody').innerHTML = DB.trainingCourses.map(function (c) {
      return '<tr>' +
        '<td class="product-cell">' +
          '<img class="product-admin-thumb" src="' + esc(c.img || '../assets/images/services/training.png') + '" alt="' + esc(c.title) + '" loading="lazy" />' +
          '<span class="cell-strong">' + esc(c.title) + '</span>' +
        '</td>' +
        '<td><span class="badge badge-blue">' + esc(c.format) + '</span></td>' +
        '<td>' + esc(c.duration) + '</td>' +
        '<td>' + activeBadge(c.active) + '</td>' +
        rowActions('trainingCourses', c.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No training courses found.');
  }

  function renderProcessSteps() {
    $('#processStepsTbody').innerHTML = DB.processSteps.map(function (s) {
      return '<tr>' +
        '<td><span class="step-num">' + s.order + '</span></td>' +
        '<td class="cell-strong"><i class="fa-solid ' + esc(s.icon) + '" style="color:var(--admin-blue);margin-right:8px;"></i>' + esc(s.title) + '</td>' +
        '<td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(s.desc) + '">' + esc(s.desc) + '</td>' +
        '<td>' + activeBadge(s.active) + '</td>' +
        rowActions('processSteps', s.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No process steps found.');
  }

  function renderCommitments() {
    $('#commitmentsTbody').innerHTML = DB.commitments.map(function (c) {
      return '<tr>' +
        '<td class="cell-strong"><i class="fa-solid ' + esc(c.icon) + '" style="color:var(--admin-blue);width:22px;margin-right:8px;"></i>' + esc(c.title) + '</td>' +
        '<td style="max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(c.desc) + '">' + esc(c.desc) + '</td>' +
        '<td>' + activeBadge(c.active) + '</td>' +
        rowActions('commitments', c.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No commitments found.');
  }

  function renderPartnershipValues() {
    $('#partnershipValuesTbody').innerHTML = DB.partnershipValues.map(function (v) {
      return '<tr>' +
        '<td><span class="step-num">' + esc(v.order) + '</span></td>' +
        '<td class="cell-strong">' + esc(v.title) + '</td>' +
        '<td style="max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(v.desc) + '">' + esc(v.desc) + '</td>' +
        '<td>' + activeBadge(v.active) + '</td>' +
        rowActions('partnershipValues', v.id) +
        '</tr>';
    }).join('') || emptyRow(5, 'No partnership values found.');
  }

  function renderPartnershipActions() {
    $('#partnershipActionsTbody').innerHTML = DB.partnershipActions.map(function (a) {
      return '<tr>' +
        '<td class="cell-strong"><i class="fa-solid ' + esc(a.icon) + '" style="color:var(--admin-blue);width:22px;margin-right:8px;"></i>' + esc(a.title) + '</td>' +
        '<td style="max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + esc(a.desc) + '">' + esc(a.desc) + '</td>' +
        '<td>' + activeBadge(a.active) + '</td>' +
        rowActions('partnershipActions', a.id) +
        '</tr>';
    }).join('') || emptyRow(4, 'No partnership actions found.');
  }

  function emptyRow(cols, msg) {
    return '<tr><td colspan="' + cols + '" style="text-align:center;color:#9aa6bd;padding:28px;">' + msg + '</td></tr>';
  }

  var RENDER = {
    dashboard:  function () { renderStats(); renderDashboardCharts(); renderDashInquiries(); },
    inquiries:  renderInquiries,
    products:   renderProductsThumb,
    categories: renderCategories,
    industries: renderIndustries,
    articles:   renderArticles,
    gallery:    renderGallery,
    faq:        renderFaqs,
    partners:   renderPartners,
    slides:     renderSlides,
    settings:   renderSettings,
    users:      renderUsers,
    services:   renderServices,
    testimonials: renderTestimonials,
    jobs:       renderJobs,
    team:                renderTeam,
    pages:               renderPages,
    trainingCourses:     renderTrainingCourses,
    processSteps:        renderProcessSteps,
    commitments:         renderCommitments,
    certifications:      renderCertifications,
    distributionFeatures: renderDistributionFeatures,
    featureTiles:        renderFeatureTiles,
    seoSettings:         renderSeoSettings,
    partnershipValues:   renderPartnershipValues,
    partnershipActions:  renderPartnershipActions
  };

  // ============================================
  // NAVIGATION
  // ============================================
  var TITLES = {
    dashboard: 'Dashboard',    inquiries: 'Contact Inquiries',
    products: 'Products',      categories: 'Product Categories',
    industries: 'Industries',  articles: 'Knowledge Articles',
    gallery: 'Gallery',        faq: 'FAQ',
    partners: 'Partners & Brands', slides: 'Hero Slides',
    settings: 'Site Settings',  users: 'Admin Users',
    services: 'Services',      testimonials: 'Testimonials',
    jobs: 'Recruitment Positions', team: 'Team Members',
    pages: 'Custom Pages',
    trainingCourses:     'Training Courses',
    processSteps:        'Process Steps',
    commitments:         'Company Commitments',
    certifications:      'Certifications',
    distributionFeatures: 'Distribution Features',
    featureTiles:        'Homepage Feature Tiles',
    seoSettings:         'SEO Settings',
    partnershipValues:   'Partnership Values',
    partnershipActions:  'Partnership Actions'
  };

  function goTo(section) {
    $all('.as-link').forEach(function (l) {
      var isMatch = l.getAttribute('data-section') === section;
      l.classList.toggle('active', isMatch);
      if (isMatch) {
        var group = l.closest('.as-group');
        if (group) {
          $all('.as-group').forEach(function (g) {
            if (g !== group) g.classList.remove('open');
          });
          group.classList.add('open');
        } else {
          $all('.as-group').forEach(function (g) {
            g.classList.remove('open');
          });
        }
      }
    });
    $all('.admin-section').forEach(function (s) {
      s.classList.toggle('active', s.id === 'section-' + section);
    });
    $('#pageTitle').textContent = TITLES[section] || section;
    if (RENDER[section]) RENDER[section]();
    closeSidebar();
  }

  $all('.as-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      goTo(this.getAttribute('data-section'));
    });
  });

  // Sidebar accordion submenu toggling
  $all('.as-group-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = this.parentElement;
      var isOpen = parent.classList.contains('open');
      
      $all('.as-group').forEach(function (group) {
        if (group !== parent) group.classList.remove('open');
      });
      
      parent.classList.toggle('open', !isOpen);
    });
  });

  // Dashboard shortcuts
  document.addEventListener('click', function (e) {
    var go = e.target.closest('[data-goto]');
    if (go) goTo(go.getAttribute('data-goto'));
    var quick = e.target.closest('[data-quick]');
    if (quick) {
      goTo(quick.getAttribute('data-quick'));
      openAddModal(quick.getAttribute('data-quick'));
    }
  });

  // Mobile sidebar
  function closeSidebar() {
    $('#adminSidebar').classList.remove('open');
    $('#adminOverlay').classList.remove('active');
  }
  $('#sidebarToggle').addEventListener('click', function () {
    $('#adminSidebar').classList.toggle('open');
    $('#adminOverlay').classList.toggle('active');
  });
  $('#adminOverlay').addEventListener('click', closeSidebar);

  // Logout
  $('#logoutBtn').addEventListener('click', function () {
    sessionStorage.removeItem('ossp_admin');
    window.location.href = 'login.html';
  });

  // ============================================
  // MODAL (generic add/edit)
  // ============================================
  var FORMS = {
    products: [
      { name: 'name',       label: 'Product Name',                          type: 'text', wide: true },
      { name: 'slug',       label: 'Slug / URL Key (e.g. skf-bearing-22220)', type: 'text' },
      { name: 'brand',      label: 'Brand',                                 type: 'text' },
      { name: 'img',        label: 'Product Image',                         type: 'image', wide: true },
      { name: 'categoryId', label: 'Category',                              type: 'select', options: function () { return DB.categories.map(function (c) { return [c.id, c.name]; }); } },
      { name: 'featured',   label: 'Featured product',                      type: 'check' },
      { name: 'desc',       label: 'Short Description',                     type: 'textarea', wide: true },
      { name: 'specs',      label: 'Technical Specifications (pipe-separated key:value)', type: 'textarea', wide: true },
      { name: 'catalogUrl', label: 'Catalog PDF URL / Download Link',       type: 'text', wide: true }
    ],
    categories: [
      { name: 'name', label: 'Category Name', type: 'text', wide: true }
    ],
    industries: [
      { name: 'name',            label: 'Industry Name',                            type: 'text' },
      { name: 'img',             label: 'Industry Image',                           type: 'image', wide: true },
      { name: 'icon',            label: 'Font Awesome Icon (e.g. fa-industry)',     type: 'text' },
      { name: 'desc',            label: 'Short Description (card text)',            type: 'textarea', wide: true },
      { name: 'challenges',      label: 'Key Challenges',                          type: 'textarea', wide: true },
      { name: 'relatedProducts', label: 'Recommended Products (comma-separated)',  type: 'text', wide: true }
    ],
    articles: [
      { name: 'title',       label: 'Title',                                type: 'text', wide: true },
      { name: 'author',      label: 'Author',                               type: 'text' },
      { name: 'category',    label: 'Category',                             type: 'select', options: function () { return ['Technical Guide', 'Industry News', 'Product Knowledge', 'Maintenance Tips'].map(function (c) { return [c, c]; }); } },
      { name: 'published',   label: 'Publish immediately',                  type: 'check' },
      { name: 'coverImage',  label: 'Cover / Feature Image',                type: 'image', wide: true },
      { name: 'excerpt',     label: 'Excerpt (shown in article listing)',    type: 'textarea', wide: true },
      { name: 'body',        label: 'Article Body Content',                 type: 'textarea', wide: true }
    ],
    gallery: [
      { name: 'title', label: 'Image Title', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', options: function () { return ['Office', 'Event', 'Product'].map(function (c) { return [c, c]; }); } },
      { name: 'img', label: 'Gallery Image', type: 'image', wide: true }
    ],
    faq: [
      { name: 'q', label: 'Question', type: 'text', wide: true },
      { name: 'a', label: 'Answer', type: 'textarea', wide: true }
    ],
    partners: [
      { name: 'name', label: 'Partner / Brand Name', type: 'text' },
      { name: 'img', label: 'Partner Logo', type: 'image', wide: true },
      { name: 'desc', label: 'Short Description', type: 'textarea', wide: true },
      { name: 'websiteUrl', label: 'Website URL', type: 'text', wide: true }
    ],
    slides: [
      { name: 'title', label: 'Slide Title', type: 'text', wide: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text', wide: true },
      { name: 'img', label: 'Slide Image', type: 'image', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    users: [
      { name: 'fullName', label: 'Full Name', type: 'text' },
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'role', label: 'Role', type: 'select', options: function () { return [['SUPER_ADMIN', 'Super Admin'], ['EDITOR', 'Editor'], ['VIEWER', 'Viewer']]; } }
    ],
    services: [
      { name: 'name', label: 'Service Name', type: 'text' },
      { name: 'img', label: 'Service Image', type: 'image', wide: true },
      { name: 'desc', label: 'Short Description', type: 'textarea', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    testimonials: [
      { name: 'name', label: 'Client / Brand Name', type: 'text' },
      { name: 'img', label: 'Client Photo / Logo', type: 'image', wide: true },
      { name: 'stars', label: 'Rating Stars (1-5)', type: 'select', options: function () { return [[5, '5 Stars'], [4, '4 Stars'], [3, '3 Stars'], [2, '2 Stars'], [1, '1 Star']]; } },
      { name: 'quote', label: 'Testimonial Quote', type: 'textarea', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    jobs: [
      { name: 'title', label: 'Job Title', type: 'text' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'type', label: 'Job Type', type: 'select', options: function () { return [['Full-Time', 'Full-Time'], ['Part-Time', 'Part-Time'], ['Internship', 'Internship']]; } },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'active', label: 'Active Recruitment', type: 'check' }
    ],
    team: [
      { name: 'fullName', label: 'Full Name', type: 'text' },
      { name: 'position', label: 'Position / Title', type: 'text' },
      { name: 'img', label: 'Member Photo', type: 'image', wide: true },
      { name: 'active', label: 'Show on About Page', type: 'check' }
    ],
    pages: [
      { name: 'title', label: 'Page Title', type: 'text' },
      { name: 'slug', label: 'Slug / URL Path', type: 'text' },
      { name: 'content', label: 'Page HTML / Body Content', type: 'textarea', wide: true }
    ],
    trainingCourses: [
      { name: 'title', label: 'Course Title', type: 'text', wide: true },
      { name: 'format', label: 'Format', type: 'select', options: function () { return [['Workshop', 'Workshop'], ['Technical Class', 'Technical Class'], ['On-site', 'On-site'], ['Online', 'Online']]; } },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'img', label: 'Course Image', type: 'image', wide: true },
      { name: 'desc', label: 'Description', type: 'textarea', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    processSteps: [
      { name: 'order', label: 'Step Number', type: 'text' },
      { name: 'title', label: 'Step Title', type: 'text' },
      { name: 'icon', label: 'Font Awesome Icon (e.g. fa-gears)', type: 'text' },
      { name: 'desc', label: 'Description', type: 'textarea', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    commitments: [
      { name: 'title', label: 'Commitment Title', type: 'text' },
      { name: 'icon', label: 'Font Awesome Icon (e.g. fa-shield-halved)', type: 'text' },
      { name: 'desc', label: 'Description', type: 'textarea', wide: true },
      { name: 'active', label: 'Active', type: 'check' }
    ],
    certifications: [
      { name: 'name',       label: 'Certificate Name',                        type: 'text', wide: true },
      { name: 'issuer',     label: 'Issuing Authority',                        type: 'text' },
      { name: 'certNumber', label: 'Certificate Number',                       type: 'text' },
      { name: 'issueDate',  label: 'Issue Date (YYYY-MM-DD)',                  type: 'text' },
      { name: 'expiryDate', label: 'Expiry Date (leave blank if none)',        type: 'text' },
      { name: 'img',        label: 'Certificate Image / Scan',                 type: 'image', wide: true },
      { name: 'active',     label: 'Show on About Page',                       type: 'check' }
    ],
    distributionFeatures: [
      { name: 'title',  label: 'Feature Title',                               type: 'text' },
      { name: 'icon',   label: 'Font Awesome Icon (e.g. fa-warehouse)',        type: 'text' },
      { name: 'desc',   label: 'Description',                                  type: 'textarea', wide: true },
      { name: 'link',   label: 'Link URL (optional)',                          type: 'text', wide: true },
      { name: 'active', label: 'Active',                                       type: 'check' }
    ],
    featureTiles: [
      { name: 'title',    label: 'Tile Title',                                 type: 'text' },
      { name: 'subtitle', label: 'Tile Subtitle',                              type: 'text' },
      { name: 'icon',     label: 'Font Awesome Icon (e.g. fa-box-open)',       type: 'text' },
      { name: 'img',      label: 'Background Image',                           type: 'image', wide: true },
      { name: 'link',     label: 'Link URL (e.g. ../pages/products.html)',     type: 'text', wide: true },
      { name: 'active',   label: 'Active',                                     type: 'check' }
    ],
    seoSettings: [
      { name: 'page',     label: 'Page Name',                                  type: 'text' },
      { name: 'title',    label: 'Meta Title (50-60 chars)',                   type: 'text', wide: true },
      { name: 'desc',     label: 'Meta Description (140-160 chars)',           type: 'textarea', wide: true },
      { name: 'keywords', label: 'Keywords (comma-separated)',                 type: 'text', wide: true }
    ],
    partnershipValues: [
      { name: 'order', label: 'Order Number (e.g. 01)',                        type: 'text' },
      { name: 'title', label: 'Value Title',                                   type: 'text' },
      { name: 'desc',  label: 'Description',                                   type: 'textarea', wide: true },
      { name: 'active', label: 'Active',                                       type: 'check' }
    ],
    partnershipActions: [
      { name: 'title',  label: 'Action Title',                                 type: 'text' },
      { name: 'icon',   label: 'Font Awesome Icon (e.g. fa-handshake)',        type: 'text' },
      { name: 'desc',   label: 'Description',                                  type: 'textarea', wide: true },
      { name: 'active', label: 'Active',                                       type: 'check' }
    ]
  };

  var ENTITY_LIST = {
    products: 'products', categories: 'categories', industries: 'industries', articles: 'articles',
    gallery: 'gallery', faq: 'faqs', partners: 'partners',
    slides: 'slides', users: 'users', inquiries: 'inquiries',
    services: 'services', testimonials: 'testimonials', jobs: 'jobs', team: 'team',
    pages: 'pages',
    trainingCourses: 'trainingCourses', processSteps: 'processSteps', commitments: 'commitments',
    certifications: 'certifications', distributionFeatures: 'distributionFeatures',
    featureTiles: 'featureTiles', seoSettings: 'seoSettings',
    partnershipValues: 'partnershipValues', partnershipActions: 'partnershipActions'
  };

  var modalCtx = null;

  function buildForm(entity, record) {
    return '<div class="form-grid" style="padding:0;">' + FORMS[entity].map(function (f) {
      var val = record ? record[f.name] : '';
      var field = '';
      if (f.type === 'select') {
        field = '<select name="' + f.name + '">' + f.options().map(function (o) {
          var sel = record && String(record[f.name]) === String(o[0]) ? ' selected' : '';
          return '<option value="' + esc(o[0]) + '"' + sel + '>' + esc(o[1]) + '</option>';
        }).join('') + '</select>';
      } else if (f.type === 'check') {
        field = '<label class="form-check">' +
                  '<input type="checkbox" name="' + f.name + '"' + (record && record[f.name] ? ' checked' : '') + ' />' +
                  '<span class="form-check-switch"></span>' +
                  '<span class="form-check-label">' + esc(f.label) + '</span>' +
                '</label>';
        return '<div class="form-field form-field-checkbox' + (f.wide ? ' span-2' : '') + '">' + field + '</div>';
      } else if (f.type === 'textarea') {
        field = '<textarea name="' + f.name + '">' + esc(val || '') + '</textarea>';
      } else if (f.type === 'image') {
        field = '<div class="image-field-container">' +
                  '<div class="image-dropzone">' +
                    '<input type="file" accept="image/*" class="image-file-input" style="display:none;" />' +
                    '<div class="dropzone-prompt">' +
                      '<i class="fa-solid fa-cloud-arrow-up fa-2x"></i>' +
                      '<span>Drag & drop or <strong>browse</strong> to upload</span>' +
                      '<span class="file-size-limit">Supports PNG, JPG, JPEG, WEBP</span>' +
                    '</div>' +
                  '</div>' +
                  '<input type="hidden" name="' + f.name + '" value="' + esc(val || '') + '" />' +
                  '<div class="image-preview-box" style="display:none;">' +
                    '<div class="image-preview-wrapper">' +
                      '<img src="" alt="Preview" class="image-preview-img" />' +
                    '</div>' +
                    '<div class="image-preview-bar">' +
                      '<span class="preview-filename">No Image</span>' +
                      '<button type="button" class="image-remove-btn" title="Remove image">' +
                        '<i class="fa-solid fa-trash-can"></i> Remove' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</div>';
      } else {
        field = '<input type="text" name="' + f.name + '" value="' + esc(val || '') + '" />';
      }
      return '<div class="form-field' + (f.wide ? ' span-2' : '') + '"><label>' + esc(f.label) + '</label>' + field + '</div>';
    }).join('') + '</div>';
  }

  function initModalFields() {
    var container = document.querySelector('#modalBody .image-field-container');
    if (!container) return;

    var dropzone = container.querySelector('.image-dropzone');
    var fileInput = container.querySelector('.image-file-input');
    var hiddenInput = container.querySelector('input[type="hidden"]');
    var previewBox = container.querySelector('.image-preview-box');
    var previewImg = container.querySelector('.image-preview-img');
    var removeBtn = container.querySelector('.image-remove-btn');
    var filenameEl = container.querySelector('.preview-filename');

    function updatePreview(val, filename) {
      if (val) {
        previewImg.src = val;
        previewBox.style.display = 'flex';
        dropzone.style.display = 'none';
        filenameEl.textContent = filename || 'Image Selected';
        hiddenInput.value = val;
      } else {
        previewImg.src = '';
        previewBox.style.display = 'none';
        dropzone.style.display = 'block';
        filenameEl.textContent = 'No Image';
        hiddenInput.value = '';
      }
    }

    // Set initial preview if there is a value
    var initialVal = hiddenInput.value;
    if (initialVal) {
      updatePreview(initialVal, initialVal.startsWith('data:') ? 'Uploaded Image' : initialVal.substring(initialVal.lastIndexOf('/') + 1));
    } else {
      updatePreview('', '');
    }

    // Dropzone clicks / selection
    dropzone.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (evt) {
        updatePreview(evt.target.result, file.name);
      };
      reader.readAsDataURL(file);
    });

    // Drag and drop events
    dropzone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', function () {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      var file = e.dataTransfer.files[0];
      if (file && file.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = function (evt) {
          updatePreview(evt.target.result, file.name);
        };
        reader.readAsDataURL(file);
      }
    });

    // Remove button click
    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      updatePreview('', '');
      fileInput.value = '';
    });
  }

  function openAddModal(entity) {
    if (!FORMS[entity]) return;
    modalCtx = { entity: entity, id: null };
    $('#modalTitle').textContent = 'Add ' + (TITLES[entity] || entity).replace(/s$/, '');
    $('#modalBody').innerHTML = buildForm(entity, null);
    $('#modalOverlay').classList.add('open');
    initModalFields();
  }

  function openEditModal(entity, id) {
    var list = DB[ENTITY_LIST[entity]];
    var record = list.find(function (r) { return r.id === id; });
    if (!record || !FORMS[entity]) return;
    modalCtx = { entity: entity, id: id };
    $('#modalTitle').textContent = 'Edit ' + (TITLES[entity] || entity).replace(/s$/, '');
    $('#modalBody').innerHTML = buildForm(entity, record);
    $('#modalOverlay').classList.add('open');
    initModalFields();
  }

  function openInquiryModal(id) {
    var q = DB.inquiries.find(function (r) { return r.id === id; });
    if (!q) return;
    modalCtx = { entity: 'inquiry-view', id: id };
    $('#modalTitle').textContent = 'Inquiry from ' + q.first + ' ' + q.last;
    $('#modalBody').innerHTML =
      '<div class="inq-detail">' +
        '<p><strong>Email:</strong> ' + esc(q.email) + '</p>' +
        '<p><strong>Company:</strong> ' + esc(q.company || '—') + '</p>' +
        '<p><strong>Date:</strong> ' + esc(q.date) + '</p>' +
        '<div class="inq-message"><p>' + esc(q.message) + '</p></div>' +
        '<div class="form-field"><label>Status</label>' +
          '<select id="inqStatusSelect">' +
            ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED'].map(function (s) {
              return '<option value="' + s + '"' + (q.status === s ? ' selected' : '') + '>' + s.replace('_', ' ') + '</option>';
            }).join('') +
          '</select>' +
        '</div>' +
      '</div>';
    $('#modalOverlay').classList.add('open');
  }

  function closeModal() {
    $('#modalOverlay').classList.remove('open');
    modalCtx = null;
  }

  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  $('#modalSave').addEventListener('click', function () {
    if (!modalCtx) return;

    if (modalCtx.entity === 'inquiry-view') {
      var q = DB.inquiries.find(function (r) { return r.id === modalCtx.id; });
      if (q) q.status = $('#inqStatusSelect').value;
      closeModal();
      renderInquiries();
      renderStats();
      renderDashboardCharts();
      toast('Inquiry status updated.');
      return;
    }

    var entity = modalCtx.entity;
    var list = DB[ENTITY_LIST[entity]];
    var values = {};
    $all('#modalBody [name]').forEach(function (input) {
      if (input.type === 'checkbox') values[input.name] = input.checked;
      else values[input.name] = input.value;
    });
    if (values.categoryId) values.categoryId = parseInt(values.categoryId, 10);

    if (modalCtx.id == null) {
      values.id = list.length ? Math.max.apply(null, list.map(function (r) { return r.id; })) + 1 : 1;
      if (entity === 'products') { values.active = true; }
      if (entity === 'articles') { values.views = 0; values.date = values.published ? new Date().toISOString().slice(0, 10) : null; }
      if (entity === 'users')    { values.active = true; values.lastLogin = '—'; }
      if (entity === 'products' && !values.img) { values.img = '../assets/images/products/bearings.png'; }
      if (entity === 'industries' && !values.img) { values.img = '../assets/images/industries/industry-steel.jpg'; }
      if (entity === 'gallery' && !values.img) { values.img = '../assets/images/general/company.jpg'; }
      if (entity === 'slides' && !values.img)  { values.img = '../assets/images/hero/hero-1.png'; }
      if (entity === 'partners') {
        values.authorized = true;
        if (!values.img) values.img = '../assets/images/favicon.png';
      }
      list.push(values);
      toast('Added successfully.');
    } else {
      var record = list.find(function (r) { return r.id === modalCtx.id; });
      Object.keys(values).forEach(function (k) { record[k] = values[k]; });
      toast('Saved changes.');
    }

    closeModal();
    if (RENDER[entity]) RENDER[entity]();
    renderStats();
    renderDashboardCharts();
  });

  // ============================================
  // GLOBAL CLICK HANDLERS (edit / delete / view)
  // ============================================
  document.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add]');
    if (addBtn) { openAddModal(addBtn.getAttribute('data-add')); return; }

    var editBtn = e.target.closest('[data-edit]');
    if (editBtn) {
      openEditModal(editBtn.getAttribute('data-edit'), parseInt(editBtn.getAttribute('data-id'), 10));
      return;
    }

    var viewBtn = e.target.closest('[data-view-inq]');
    if (viewBtn) {
      openInquiryModal(parseInt(viewBtn.getAttribute('data-view-inq'), 10));
      return;
    }

    var delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      var entity = delBtn.getAttribute('data-del');
      var id = parseInt(delBtn.getAttribute('data-id'), 10);
      if (window.confirm('Delete this item from the admin data?')) {
        var listName = ENTITY_LIST[entity];
        DB[listName] = DB[listName].filter(function (r) { return r.id !== id; });
        if (RENDER[entity]) RENDER[entity]();
        renderStats();
        renderDashboardCharts();
        toast('Deleted.');
      }
    }
  });

  // ============================================
  // SEARCH / FILTER LISTENERS
  // ============================================
  $('#inquirySearch').addEventListener('input', renderInquiries);
  $('#inquiryFilter').addEventListener('change', renderInquiries);
  $('#productSearch').addEventListener('input', renderProductsThumb);
  $('#productFilter').addEventListener('change', renderProductsThumb);
  $('#articleSearch').addEventListener('input', renderArticles);

  // Settings save
  $('#saveSettingsBtn').addEventListener('click', function () {
    $all('#settingsForm [data-key]').forEach(function (input) {
      var s = DB.settings.find(function (x) { return x.key === input.getAttribute('data-key'); });
      if (s) s.value = input.value;
    });
    toast('Settings saved.');
  });

  // ============================================
  // INIT
  // ============================================
  renderProductFilter();
  renderStats();
  renderDashboardCharts();
  renderDashInquiries();
})();
