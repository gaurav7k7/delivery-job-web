import { http, HttpResponse, delay } from "msw";
import {
  siteSettings,
  navigation,
  footerConfig,
  socialLinks,
} from "./fixtures.js";
import {
  MOCK_CREDENTIALS,
  mockUser,
  dashboardStats,
  activityLog,
  notifications,
} from "./fixtures.admin.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ok(data, message = "Success", meta) {
  return HttpResponse.json({
    success: true,
    statusCode: 200,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

function fail(statusCode, message, errors) {
  return HttpResponse.json(
    { success: false, statusCode, message, ...(errors ? { errors } : {}) },
    { status: statusCode },
  );
}

// In-memory only — resets on hard reload, which is fine: on reload the app
// optimistically trusts the persisted authStore and revalidates via /auth/me,
// which (in mock mode) always succeeds. See src/store/authStore.js.
let notificationsState = notifications.map((n) => ({ ...n }));
let siteSettingsState = { ...siteSettings };
let heroBannersState = [
  {
    _id: "hero-home-1",
    page: "home",
    title: "Start Earning as a Rider Today",
    subtitle: "Zerivon",
    description:
      "Join thousands of riders across India earning with Uber, Swiggy, Zomato, Blinkit, Zepto and Vahan. We handle everything from documents to activation.",
    image: {
      url: "/hero-home.jpg",
      alt: "Delivery rider",
      publicId: "hero-home",
    },
    order: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const handlers = [
  http.get(`${API_BASE}/health`, () =>
    ok({ db: "connected", uptime: 1 }, "OK"),
  ),
  http.get(`${API_BASE}/settings`, () => ok(siteSettingsState)),
  http.patch(`${API_BASE}/settings`, async ({ request }) => {
    await delay(200);
    const body = await request.json();
    siteSettingsState = { ...siteSettingsState, ...body };
    return ok(siteSettingsState, "Site settings updated");
  }),
  http.get(`${API_BASE}/navigation/:name`, ({ params }) =>
    ok(navigation[params.name] ?? navigation.primary_header),
  ),
  http.get(`${API_BASE}/footer`, () => ok(footerConfig)),
  http.get(`${API_BASE}/social-links`, () => ok(socialLinks)),

  // --- Auth ---
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(400);
    const body = await request.json();
    if (
      body?.email !== MOCK_CREDENTIALS.email ||
      body?.password !== MOCK_CREDENTIALS.password
    ) {
      return fail(401, "Invalid email or password");
    }
    return ok(mockUser, "Logged in");
  }),
  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(200);
    return ok(null, "Logged out");
  }),
  http.get(`${API_BASE}/auth/me`, async () => {
    await delay(150);
    return ok(mockUser);
  }),
  http.get(`${API_BASE}/hero-banners/page/:page`, async ({ params }) => {
    await delay(200);
    const page = params.page;
    const now = new Date();
    const banners = heroBannersState.filter(
      (banner) => banner.page === page && banner.isActive,
    );
    return ok(banners);
  }),
  http.get(`${API_BASE}/hero-banners`, async ({ url }) => {
    await delay(200);
    const query = new URL(url).searchParams;
    const page = query.get("page");
    const search = query.get("search")?.toLowerCase();
    let items = heroBannersState.filter((banner) => !banner.isDeleted);
    if (page) items = items.filter((banner) => banner.page === page);
    if (search)
      items = items.filter(
        (banner) =>
          banner.title.toLowerCase().includes(search) ||
          banner.description?.toLowerCase().includes(search),
      );
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return ok(items, "Hero banners fetched", {
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
    });
  }),
  http.post(`${API_BASE}/hero-banners`, async ({ request }) => {
    await delay(250);
    const body = await request.json();
    const newBanner = {
      ...body,
      _id: crypto.randomUUID(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    heroBannersState.push(newBanner);
    return ok(newBanner, "Hero banner created");
  }),
  http.patch(`${API_BASE}/hero-banners/:id`, async ({ params, request }) => {
    await delay(250);
    const body = await request.json();
    heroBannersState = heroBannersState.map((banner) =>
      banner._id === params.id
        ? { ...banner, ...body, updatedAt: new Date().toISOString() }
        : banner,
    );
    const updated = heroBannersState.find((banner) => banner._id === params.id);
    return ok(updated, "Hero banner updated");
  }),
  http.delete(`${API_BASE}/hero-banners/:id`, async ({ params }) => {
    await delay(250);
    heroBannersState = heroBannersState.filter(
      (banner) => banner._id !== params.id,
    );
    return ok(null, "Hero banner deleted");
  }),
  http.put(`${API_BASE}/auth/profile`, async ({ request }) => {
    await delay(400);
    const body = await request.json();
    return ok({ ...mockUser, ...body }, "Profile updated");
  }),
  http.put(`${API_BASE}/auth/password`, async ({ request }) => {
    await delay(400);
    const body = await request.json();
    if (body?.currentPassword !== MOCK_CREDENTIALS.password) {
      return fail(400, "Current password is incorrect", {
        currentPassword: "Current password is incorrect",
      });
    }
    return ok(null, "Password changed");
  }),

  // --- Admin dashboard ---
  http.get(`${API_BASE}/admin/dashboard/stats`, async () => {
    await delay(300);
    return ok(dashboardStats);
  }),
  http.get(`${API_BASE}/admin/logs`, async () => {
    await delay(250);
    return ok(activityLog, "Activity log fetched", {
      page: 1,
      limit: 20,
      total: activityLog.length,
      totalPages: 1,
    });
  }),

  // --- Notifications ---
  http.get(`${API_BASE}/admin/notifications`, async () => {
    await delay(200);
    return ok(notificationsState);
  }),
  http.patch(`${API_BASE}/admin/notifications/:id/read`, async ({ params }) => {
    await delay(150);
    notificationsState = notificationsState.map((n) =>
      n._id === params.id ? { ...n, isRead: true } : n,
    );
    return ok(null, "Marked as read");
  }),
  http.patch(`${API_BASE}/admin/notifications/read-all`, async () => {
    await delay(200);
    notificationsState = notificationsState.map((n) => ({
      ...n,
      isRead: true,
    }));
    return ok(null, "All marked as read");
  }),

  // Additional resource handlers are added here as each page/module is built.
];
