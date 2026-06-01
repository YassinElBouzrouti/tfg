export const OFFICIAL_PLAN_NAMES = ['B\u00e1sica', 'Completa', 'Premium'];

const PLAN_NAME_BY_ALIAS = new Map([
  ['basica', OFFICIAL_PLAN_NAMES[0]],
  ['baasica', OFFICIAL_PLAN_NAMES[0]],
  ['completa', OFFICIAL_PLAN_NAMES[1]],
  ['premium', OFFICIAL_PLAN_NAMES[2]],
]);

function buildPlanKey(name) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

export function normalizePlanName(name) {
  if (typeof name !== 'string') {
    return null;
  }

  const key = buildPlanKey(name);
  if (!key) {
    return null;
  }

  return PLAN_NAME_BY_ALIAS.get(key) || null;
}

export function isOfficialPlanName(name) {
  return normalizePlanName(name) !== null;
}

export function normalizeOfficialPlan(plan) {
  const normalizedName = normalizePlanName(plan?.name);
  if (!normalizedName) {
    return null;
  }

  return {
    ...plan,
    name: normalizedName,
  };
}

export function selectPublicPlans(plans) {
  const uniquePlans = new Map();

  for (const plan of plans) {
    const normalizedPlan = normalizeOfficialPlan(plan);
    if (!normalizedPlan || uniquePlans.has(normalizedPlan.name)) {
      continue;
    }
    uniquePlans.set(normalizedPlan.name, normalizedPlan);
  }

  return OFFICIAL_PLAN_NAMES.map((name) => uniquePlans.get(name)).filter(Boolean);
}
