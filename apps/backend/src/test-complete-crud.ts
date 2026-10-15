import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

interface CrudResult {
  module: string;
  role: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  endpoint: string;
  status: 'PASS' | 'FAIL';
  details?: string;
}

const crudResults: CrudResult[] = [];

function record(module: string, role: string, operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE', endpoint: string, pass: boolean, details?: string) {
  crudResults.push({
    module,
    role,
    operation,
    endpoint,
    status: pass ? 'PASS' : 'FAIL',
    details
  });
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} [${module}] [${role}] ${operation} -> ${endpoint} ${details ? `(${details})` : ''}`);
}

async function runCompleteCrudTest() {
  console.log('\n========================================================================');
  console.log('TURFZONE COMPREHENSIVE END-TO-END CRUD VERIFICATION ACROSS ALL ROLES');
  console.log('========================================================================\n');

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATE ALL ROLES
  // -------------------------------------------------------------------------
  console.log('--- Phase 1: Authentication & Session Establishment ---');
  let ownerToken = '';
  let staffToken = '';
  let advertiserToken = '';
  let adminToken = '';
  let playerToken = '';

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { identifier: '9443182940', password: 'password123' });
    ownerToken = res.data?.data?.token;
    record('AUTH', 'TURF_OWNER', 'READ', '/api/auth/login', Boolean(ownerToken), `Logged in as ${res.data?.data?.user?.name}`);
  } catch (e: any) { record('AUTH', 'TURF_OWNER', 'READ', '/api/auth/login', false, e.message); }

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { identifier: '9842100001', password: 'password123' });
    staffToken = res.data?.data?.token;
    record('AUTH', 'STAFF', 'READ', '/api/auth/login', Boolean(staffToken), `Logged in as ${res.data?.data?.user?.name}`);
  } catch (e: any) { record('AUTH', 'STAFF', 'READ', '/api/auth/login', false, e.message); }

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { identifier: '9842100003', password: 'password123' });
    advertiserToken = res.data?.data?.token;
    record('AUTH', 'ADVERTISER', 'READ', '/api/auth/login', Boolean(advertiserToken), `Logged in as ${res.data?.data?.user?.name}`);
  } catch (e: any) { record('AUTH', 'ADVERTISER', 'READ', '/api/auth/login', false, e.message); }

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { identifier: '9443100002', password: 'password123' });
    adminToken = res.data?.data?.token;
    record('AUTH', 'ADMIN', 'READ', '/api/auth/login', Boolean(adminToken), `Logged in as ${res.data?.data?.user?.name}`);
  } catch (e: any) { record('AUTH', 'ADMIN', 'READ', '/api/auth/login', false, e.message); }

  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { identifier: '9876543210', password: 'password123' });
    playerToken = res.data?.data?.token;
    record('AUTH', 'PLAYER', 'READ', '/api/auth/login', Boolean(playerToken), `Logged in as ${res.data?.data?.user?.name}`);
  } catch (e: any) { record('AUTH', 'PLAYER', 'READ', '/api/auth/login', false, e.message); }

  // -------------------------------------------------------------------------
  // 2. TURFS MODULE CRUD
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 2: Turfs Module CRUD ---');
  let createdTurfId = '';

  // 2a. CREATE Turf (Owner)
  try {
    const res = await axios.post(`${BASE_URL}/owner/turfs`, {
      name: 'Nellai Champions Turf',
      description: 'Modern 7v7 artificial football turf with high mast lighting',
      locationDetails: 'Palayamkottai Sports Complex',
      city: 'Tirunelveli',
      sports: ['Football', 'Box Cricket'],
      facilities: ['FIFA Grade Turf', 'LED Floodlights', 'Free Parking'],
      pricePerHour: 1200,
      images: ['https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800']
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    createdTurfId = res.data?.data?._id;
    record('TURFS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/turfs', res.status === 201 && Boolean(createdTurfId), `Created Turf ID: ${createdTurfId}`);
  } catch (e: any) { record('TURFS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/turfs', false, e.response?.data?.message || e.message); }

  // 2b. READ Turfs (Owner)
  try {
    const res = await axios.get(`${BASE_URL}/owner/turfs`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    const count = res.data?.data?.length || 0;
    record('TURFS', 'TURF_OWNER', 'READ', 'GET /api/owner/turfs', res.status === 200 && count > 0, `Owner has ${count} turfs`);
  } catch (e: any) { record('TURFS', 'TURF_OWNER', 'READ', 'GET /api/owner/turfs', false, e.response?.data?.message || e.message); }

  // 2c. READ Turfs (Public / Player)
  try {
    const res = await axios.get(`${BASE_URL}/turfs`);
    const count = res.data?.data?.length || 0;
    record('TURFS', 'PUBLIC/PLAYER', 'READ', 'GET /api/turfs', res.status === 200 && count > 0, `Public can view ${count} venues`);
  } catch (e: any) { record('TURFS', 'PUBLIC/PLAYER', 'READ', 'GET /api/turfs', false, e.response?.data?.message || e.message); }

  // 2d. UPDATE Turf (Owner)
  try {
    const res = await axios.put(`${BASE_URL}/owner/turfs/${createdTurfId}`, {
      name: 'Nellai Champions Turf - Upgraded Superdome',
      pricePerHour: 1350
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    record('TURFS', 'TURF_OWNER', 'UPDATE', `PUT /api/owner/turfs/${createdTurfId}`, res.status === 200 && res.data?.data?.pricePerHour === 1350, 'Price updated to 1350');
  } catch (e: any) { record('TURFS', 'TURF_OWNER', 'UPDATE', `PUT /api/owner/turfs/${createdTurfId}`, false, e.response?.data?.message || e.message); }

  // 2e. DELETE Turf (Owner)
  try {
    const res = await axios.delete(`${BASE_URL}/owner/turfs/${createdTurfId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    record('TURFS', 'TURF_OWNER', 'DELETE', `DELETE /api/owner/turfs/${createdTurfId}`, res.status === 200, res.data?.message || 'Turf deleted');
  } catch (e: any) { record('TURFS', 'TURF_OWNER', 'DELETE', `DELETE /api/owner/turfs/${createdTurfId}`, false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 3. SLOTS MODULE CRUD
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 3: Slots Module CRUD ---');
  let firstTurfId = '';
  try {
    const turfsRes = await axios.get(`${BASE_URL}/owner/turfs`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    firstTurfId = turfsRes.data?.data?.[0]?._id;
  } catch (e) {}

  // 3a. CREATE Slots (Owner)
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await axios.post(`${BASE_URL}/owner/slots`, {
      turfId: firstTurfId,
      date: today,
      openingHour: 6,
      closingHour: 22,
      basePrice: 1000,
      peakPrice: 1400
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    record('SLOTS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/slots', (res.status === 200 || res.status === 201) && Array.isArray(res.data?.data), `Generated ${res.data?.data?.length} slots for ${today}`);
  } catch (e: any) { record('SLOTS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/slots', false, e.response?.data?.message || e.message); }

  // 3b. UPDATE / Block Slot (Owner or Staff)
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await axios.post(`${BASE_URL}/owner/slots/block`, {
      turfId: firstTurfId,
      date: today,
      timeSlot: '12:00 PM - 01:00 PM',
      reason: 'Turf Grooming & Routine Maintenance'
    }, { headers: { Authorization: `Bearer ${staffToken}` } });
    record('SLOTS', 'STAFF', 'UPDATE', 'POST /api/owner/slots/block', res.status === 200 || res.status === 201, res.data?.message || 'Slot blocked by ground staff');
  } catch (e: any) { record('SLOTS', 'STAFF', 'UPDATE', 'POST /api/owner/slots/block', false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 4. BOOKINGS MODULE CRUD
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 4: Bookings Module CRUD ---');
  let createdBookingId = '';

  // 4a. CREATE Offline Booking (Staff / Owner)
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await axios.post(`${BASE_URL}/owner/bookings/offline`, {
      turfId: firstTurfId,
      customerName: 'Muthu Kumar (Walk-in)',
      customerPhone: '9842155667',
      sport: 'Football',
      date: today,
      timeSlot: '07:00 PM - 08:00 PM',
      amount: 1200,
      paymentMethod: 'CASH',
      notes: 'Counter Walk-in match with cash advance'
    }, { headers: { Authorization: `Bearer ${staffToken}` } });
    createdBookingId = res.data?.data?.id;
    record('BOOKINGS', 'STAFF', 'CREATE', 'POST /api/owner/bookings/offline', res.status === 201 && Boolean(createdBookingId), `Created Booking Ref: ${res.data?.data?.bookingCode}`);
  } catch (e: any) { record('BOOKINGS', 'STAFF', 'CREATE', 'POST /api/owner/bookings/offline', false, e.response?.data?.message || e.message); }

  // 4b. CREATE Public Online Booking (Player)
  try {
    const futureDay = new Date();
    futureDay.setDate(futureDay.getDate() + 3 + Math.floor(Math.random() * 10));
    const dateStr = futureDay.toISOString().split('T')[0];
    const randHour = 7 + Math.floor(Math.random() * 12);
    const timeSlotStr = `${String(randHour).padStart(2, '0')}:00 - ${String(randHour + 1).padStart(2, '0')}:00`;
    const res = await axios.post(`${BASE_URL}/bookings/public`, {
      turfId: firstTurfId,
      customerName: 'Arun Player',
      customerPhone: '9876543210',
      sport: 'Football',
      date: dateStr,
      timeSlot: timeSlotStr,
      paymentMethod: 'UPI'
    });
    record('BOOKINGS', 'PLAYER', 'CREATE', 'POST /api/bookings/public', res.status === 201, `Confirmed Code: ${res.data?.data?.bookingCode} on ${dateStr} (${timeSlotStr})`);
  } catch (e: any) { record('BOOKINGS', 'PLAYER', 'CREATE', 'POST /api/bookings/public', false, e.response?.data?.message || e.message); }

  // 4c. READ Bookings (Owner / Staff)
  try {
    const res = await axios.get(`${BASE_URL}/owner/bookings`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    const count = res.data?.data?.length || 0;
    record('BOOKINGS', 'TURF_OWNER', 'READ', 'GET /api/owner/bookings', res.status === 200 && count > 0, `Retrieved ${count} bookings`);
  } catch (e: any) { record('BOOKINGS', 'TURF_OWNER', 'READ', 'GET /api/owner/bookings', false, e.response?.data?.message || e.message); }

  // 4d. READ Bookings (Player Self History)
  try {
    const res = await axios.get(`${BASE_URL}/bookings/my-bookings`, { headers: { Authorization: `Bearer ${playerToken}` } });
    const count = res.data?.data?.length || 0;
    record('BOOKINGS', 'PLAYER', 'READ', 'GET /api/bookings/my-bookings', res.status === 200 && count > 0, `Player has ${count} personal match passes`);
  } catch (e: any) { record('BOOKINGS', 'PLAYER', 'READ', 'GET /api/bookings/my-bookings', false, e.response?.data?.message || e.message); }

  // 4e. UPDATE Booking Status (Owner / Staff)
  try {
    const res = await axios.put(`${BASE_URL}/owner/bookings/${createdBookingId}/status`, {
      status: 'COMPLETED'
    }, { headers: { Authorization: `Bearer ${staffToken}` } });
    record('BOOKINGS', 'STAFF', 'UPDATE', `PUT /api/owner/bookings/${createdBookingId}/status`, res.status === 200 && res.data?.data?.status === 'COMPLETED', 'Status updated to COMPLETED');
  } catch (e: any) { record('BOOKINGS', 'STAFF', 'UPDATE', `PUT /api/owner/bookings/${createdBookingId}/status`, false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 5. OFFERS & CAMPAIGNS MODULE CRUD
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 5: Offers & Coupons Module CRUD ---');
  let createdOfferId = '';

  // 5a. CREATE Offer (Owner)
  try {
    const res = await axios.post(`${BASE_URL}/owner/offers`, {
      code: 'WEEKDAY30',
      discount: '30% OFF',
      turf: 'All Turfs',
      validHours: '10 AM - 4 PM',
      validUntil: '31 Oct 2026'
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    createdOfferId = res.data?.data?._id || res.data?.data?.id;
    record('OFFERS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/offers', res.status === 201 && Boolean(createdOfferId), `Created Offer Code: WEEKDAY30 (ID: ${createdOfferId})`);
  } catch (e: any) { record('OFFERS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/offers', false, e.response?.data?.message || e.message); }

  // 5b. READ Offers (Owner)
  try {
    const res = await axios.get(`${BASE_URL}/owner/offers`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    const count = res.data?.data?.length || 0;
    record('OFFERS', 'TURF_OWNER', 'READ', 'GET /api/owner/offers', res.status === 200 && count > 0, `Total live offers: ${count}`);
  } catch (e: any) { record('OFFERS', 'TURF_OWNER', 'READ', 'GET /api/owner/offers', false, e.response?.data?.message || e.message); }

  // 5c. DELETE Offer (Owner)
  try {
    const res = await axios.delete(`${BASE_URL}/owner/offers/${createdOfferId}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    record('OFFERS', 'TURF_OWNER', 'DELETE', `DELETE /api/owner/offers/${createdOfferId}`, res.status === 200, res.data?.message || 'Offer deleted');
  } catch (e: any) { record('OFFERS', 'TURF_OWNER', 'DELETE', `DELETE /api/owner/offers/${createdOfferId}`, false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 6. ADVERTISEMENTS MODULE CRUD (ADVERTISER ROLE)
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 6: Advertisements Module CRUD (Advertiser) ---');
  let createdAdId = '';

  // 6a. CREATE Ad (Advertiser)
  try {
    const res = await axios.post(`${BASE_URL}/ads`, {
      title: 'Puma Velocity Football Boots',
      brandName: 'Puma Sports India',
      description: 'Get flat 25% off on SG and FG football boots across all stores in Tamil Nadu',
      bannerUrl: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800',
      targetUrl: 'https://in.puma.com',
      placement: 'HOME_HERO',
      budget: 8000
    }, { headers: { Authorization: `Bearer ${advertiserToken}` } });
    createdAdId = res.data?.data?._id;
    record('ADS', 'ADVERTISER', 'CREATE', 'POST /api/ads', res.status === 201 && Boolean(createdAdId), `Campaign ID: ${createdAdId}`);
  } catch (e: any) { record('ADS', 'ADVERTISER', 'CREATE', 'POST /api/ads', false, e.response?.data?.message || e.message); }

  // 6b. READ Ads (Advertiser)
  try {
    const res = await axios.get(`${BASE_URL}/ads`, { headers: { Authorization: `Bearer ${advertiserToken}` } });
    const count = res.data?.data?.length || 0;
    record('ADS', 'ADVERTISER', 'READ', 'GET /api/ads', res.status === 200 && count > 0, `Advertiser campaigns: ${count}`);
  } catch (e: any) { record('ADS', 'ADVERTISER', 'READ', 'GET /api/ads', false, e.response?.data?.message || e.message); }

  // 6c. READ Public Active Ads (Guest / Player)
  try {
    const res = await axios.get(`${BASE_URL}/ads/public/active`);
    const count = res.data?.data?.length || 0;
    record('ADS', 'PUBLIC/PLAYER', 'READ', 'GET /api/ads/public/active', res.status === 200 && count > 0, `Active banners shown to players: ${count}`);
  } catch (e: any) { record('ADS', 'PUBLIC/PLAYER', 'READ', 'GET /api/ads/public/active', false, e.response?.data?.message || e.message); }

  // 6d. UPDATE Ad Status (Advertiser)
  try {
    const res = await axios.put(`${BASE_URL}/ads/${createdAdId}`, {
      status: 'PAUSED',
      budget: 9500
    }, { headers: { Authorization: `Bearer ${advertiserToken}` } });
    record('ADS', 'ADVERTISER', 'UPDATE', `PUT /api/ads/${createdAdId}`, res.status === 200 && res.data?.data?.status === 'PAUSED', 'Paused campaign & increased budget to 9500');
  } catch (e: any) { record('ADS', 'ADVERTISER', 'UPDATE', `PUT /api/ads/${createdAdId}`, false, e.response?.data?.message || e.message); }

  // 6e. DELETE Ad (Advertiser)
  try {
    const res = await axios.delete(`${BASE_URL}/ads/${createdAdId}`, {
      headers: { Authorization: `Bearer ${advertiserToken}` }
    });
    record('ADS', 'ADVERTISER', 'DELETE', `DELETE /api/ads/${createdAdId}`, res.status === 200, res.data?.message || 'Campaign deleted');
  } catch (e: any) { record('ADS', 'ADVERTISER', 'DELETE', `DELETE /api/ads/${createdAdId}`, false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 7. TOURNAMENTS MODULE CRUD
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 7: Tournaments Module CRUD ---');
  let tournamentId = '';
  let teamId = '';

  // 7a. CREATE Tournament (Owner)
  try {
    const res = await axios.post(`${BASE_URL}/owner/tournaments`, {
      title: 'Nellai Monsoon Super League 2026',
      sport: 'Football 7v7',
      venue: 'ABC Football Arena, Vannarpettai',
      date: '25 Oct 2026',
      teamsLimit: 8,
      entryFee: 2500,
      prizePool: '₹35,000 + Rolling Trophy'
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    tournamentId = res.data?.data?._id;
    record('TOURNAMENTS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/tournaments', res.status === 201 && Boolean(tournamentId), `Tournament ID: ${tournamentId}`);
  } catch (e: any) { record('TOURNAMENTS', 'TURF_OWNER', 'CREATE', 'POST /api/owner/tournaments', false, e.response?.data?.message || e.message); }

  // 7b. READ Tournaments (Player & Owner)
  try {
    const res = await axios.get(`${BASE_URL}/owner/tournaments`, { headers: { Authorization: `Bearer ${playerToken}` } });
    const count = res.data?.data?.length || 0;
    record('TOURNAMENTS', 'PLAYER', 'READ', 'GET /api/owner/tournaments', res.status === 200 && count > 0, `Player can discover ${count} leagues`);
  } catch (e: any) { record('TOURNAMENTS', 'PLAYER', 'READ', 'GET /api/owner/tournaments', false, e.response?.data?.message || e.message); }

  // 7c. CREATE Team Squad Registration (Player)
  try {
    const res = await axios.post(`${BASE_URL}/owner/tournaments/${tournamentId}/register-team`, {
      teamName: `Nellai Lightning FC ${Date.now()}`,
      captainName: 'Arun Captain',
      captainPhone: '9876543210',
      membersCount: 7
    }, { headers: { Authorization: `Bearer ${playerToken}` } });
    const teams = res.data?.data?.registeredTeams;
    teamId = teams?.[teams.length - 1]?._id;
    record('TOURNAMENTS', 'PLAYER', 'CREATE', `POST /api/owner/tournaments/${tournamentId}/register-team`, res.status === 201 && Boolean(teamId), `Registered Squad ID: ${teamId}`);
  } catch (e: any) { record('TOURNAMENTS', 'PLAYER', 'CREATE', `POST /api/owner/tournaments/${tournamentId}/register-team`, false, e.response?.data?.message || e.message); }

  // 7d. UPDATE Team Approval Status (Owner)
  try {
    const res = await axios.patch(`${BASE_URL}/owner/tournaments/${tournamentId}/teams/${teamId}`, {
      status: 'APPROVED'
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    record('TOURNAMENTS', 'TURF_OWNER', 'UPDATE', `PATCH /api/owner/tournaments/${tournamentId}/teams/${teamId}`, res.status === 200, 'Squad status approved');
  } catch (e: any) { record('TOURNAMENTS', 'TURF_OWNER', 'UPDATE', `PATCH /api/owner/tournaments/${tournamentId}/teams/${teamId}`, false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 8. REVIEWS & CUSTOMERS CRM
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 8: Reviews & CRM Modules ---');

  // 8a. READ Reviews (Owner)
  let firstReviewId = '';
  try {
    const res = await axios.get(`${BASE_URL}/owner/reviews`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    const count = res.data?.data?.length || 0;
    firstReviewId = res.data?.data?.[0]?._id || res.data?.data?.[0]?.id;
    record('REVIEWS', 'TURF_OWNER', 'READ', 'GET /api/owner/reviews', res.status === 200 && count > 0, `Total verified reviews: ${count}`);
  } catch (e: any) { record('REVIEWS', 'TURF_OWNER', 'READ', 'GET /api/owner/reviews', false, e.response?.data?.message || e.message); }

  // 8b. UPDATE / Reply to Review (Owner)
  try {
    const res = await axios.post(`${BASE_URL}/owner/reviews/${firstReviewId}/reply`, {
      reply: 'Thank you for your feedback! The floodlights and turf grooming have been upgraded.'
    }, { headers: { Authorization: `Bearer ${ownerToken}` } });
    record('REVIEWS', 'TURF_OWNER', 'UPDATE', `POST /api/owner/reviews/${firstReviewId}/reply`, res.status === 200, res.data?.message || 'Reply posted');
  } catch (e: any) { record('REVIEWS', 'TURF_OWNER', 'UPDATE', `POST /api/owner/reviews/${firstReviewId}/reply`, false, e.response?.data?.message || e.message); }

  // 8c. READ Customers CRM (Owner & Staff)
  try {
    const res = await axios.get(`${BASE_URL}/owner/customers`, { headers: { Authorization: `Bearer ${staffToken}` } });
    const count = res.data?.data?.length || 0;
    record('CRM', 'STAFF', 'READ', 'GET /api/owner/customers', res.status === 200 && count > 0, `Staff viewed ${count} active customer records`);
  } catch (e: any) { record('CRM', 'STAFF', 'READ', 'GET /api/owner/customers', false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // 9. FINANCIAL REPORTS & STAFF DIRECTORY
  // -------------------------------------------------------------------------
  console.log('\n--- Phase 9: Reports & Staff Directory ---');

  // 9a. READ Reports (Owner & Admin only)
  try {
    const res = await axios.get(`${BASE_URL}/owner/reports`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    record('REPORTS', 'TURF_OWNER', 'READ', 'GET /api/owner/reports', res.status === 200 && typeof res.data?.data?.totalRevenue === 'number', `Total Revenue: ₹${res.data?.data?.totalRevenue}`);
  } catch (e: any) { record('REPORTS', 'TURF_OWNER', 'READ', 'GET /api/owner/reports', false, e.response?.data?.message || e.message); }

  // 9b. READ Staff Directory (Owner & Admin)
  try {
    const res = await axios.get(`${BASE_URL}/owner/staff`, { headers: { Authorization: `Bearer ${ownerToken}` } });
    const count = res.data?.data?.length || 0;
    record('STAFF_DIR', 'TURF_OWNER', 'READ', 'GET /api/owner/staff', res.status === 200 && count > 0, `Staff members: ${count}`);
  } catch (e: any) { record('STAFF_DIR', 'TURF_OWNER', 'READ', 'GET /api/owner/staff', false, e.response?.data?.message || e.message); }

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log('CRUD VERIFICATION SUMMARY MATRIX');
  console.log('========================================================================');
  const total = crudResults.length;
  const passed = crudResults.filter(r => r.status === 'PASS').length;
  const failed = crudResults.filter(r => r.status === 'FAIL').length;
  console.log(`Total Operations Tested: ${total} | Passed: ${passed} | Failed: ${failed}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCompleteCrudTest();
