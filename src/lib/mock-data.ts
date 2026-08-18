export type Severity = "Critical" | "High" | "Medium" | "Low" | "Info";
export type FindingStatus =
  | "Active"
  | "Verified"
  | "Mitigated"
  | "False Positive"
  | "Risk Accepted"
  | "Duplicate";

export const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low", "Info"];
export const STATUSES: FindingStatus[] = [
  "Active",
  "Verified",
  "Mitigated",
  "False Positive",
  "Risk Accepted",
  "Duplicate",
];

export type Scanner = "Trivy" | "OWASP ZAP" | "Snyk" | "SonarQube" | "Burp Suite" | "Semgrep";

export interface Product {
  id: string;
  name: string;
  type: string;
  owner: string;
  criticality: "Very High" | "High" | "Medium" | "Low";
  riskScore: number;
  lastScan: string;
  description: string;
}

export interface Engagement {
  id: string;
  productId: string;
  name: string;
  status: "In Progress" | "Completed" | "On Hold";
  start: string;
  end: string;
  lead: string;
}

export interface TestRun {
  id: string;
  engagementId: string;
  name: string;
  scanner: Scanner;
  kind: "SAST" | "DAST" | "SCA" | "Container" | "Pentest";
  date: string;
  findings: number;
}

export interface Finding {
  id: string;
  ref: string;
  title: string;
  severity: Severity;
  cwe: string;
  cve?: string | undefined;
  epss?: number | undefined;
  kev?: boolean | undefined;
  description: string;
  location: string;
  status: FindingStatus;
  scanner: Scanner;
  date: string;
  productId: string;
  engagementId: string;
  testId: string;
  cvss: number;
  duplicateOf?: string | undefined;
  duplicates?: string[] | undefined;
  jira?: string | undefined;
  activity: { at: string; text: string }[];
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Customer Portal",
    type: "Web Application",
    owner: "Ada Okonkwo",
    criticality: "Very High",
    riskScore: 87,
    lastScan: "2026-08-17",
    description: "Public self-service portal for account management and billing.",
  },
  {
    id: "p2",
    name: "Payments API",
    type: "API / Microservice",
    owner: "Marc Delaney",
    criticality: "Very High",
    riskScore: 92,
    lastScan: "2026-08-18",
    description: "PCI-scoped payment orchestration and settlement service.",
  },
  {
    id: "p3",
    name: "Mobile Banking App",
    type: "Mobile Application",
    owner: "Priya Raghavan",
    criticality: "High",
    riskScore: 64,
    lastScan: "2026-08-15",
    description: "iOS and Android retail banking client.",
  },
  {
    id: "p4",
    name: "Internal Admin Console",
    type: "Web Application",
    owner: "Tomás Vidal",
    criticality: "Medium",
    riskScore: 41,
    lastScan: "2026-08-12",
    description: "Back-office operations tooling for support staff.",
  },
];

export const engagements: Engagement[] = [
  { id: "e1", productId: "p1", name: "Sprint 42 CI Scan", status: "In Progress", start: "2026-08-10", end: "2026-08-24", lead: "Ada Okonkwo" },
  { id: "e2", productId: "p1", name: "Q3 External Pentest", status: "Completed", start: "2026-07-01", end: "2026-07-19", lead: "Nils Berger" },
  { id: "e3", productId: "p2", name: "Payments Release 5.4 Scan", status: "In Progress", start: "2026-08-14", end: "2026-08-21", lead: "Marc Delaney" },
  { id: "e4", productId: "p2", name: "PCI-DSS Readiness Review", status: "On Hold", start: "2026-06-05", end: "2026-06-30", lead: "Sofia Marchetti" },
  { id: "e5", productId: "p3", name: "Mobile Nightly Pipeline", status: "In Progress", start: "2026-08-01", end: "2026-08-31", lead: "Priya Raghavan" },
  { id: "e6", productId: "p3", name: "App Store Pre-Release Audit", status: "Completed", start: "2026-07-10", end: "2026-07-22", lead: "Nils Berger" },
  { id: "e7", productId: "p4", name: "Admin Console Baseline", status: "Completed", start: "2026-07-25", end: "2026-08-02", lead: "Tomás Vidal" },
];

export const tests: TestRun[] = [
  { id: "t1", engagementId: "e1", name: "Trivy Container Scan", scanner: "Trivy", kind: "Container", date: "2026-08-17", findings: 9 },
  { id: "t2", engagementId: "e1", name: "SonarQube Static Analysis", scanner: "SonarQube", kind: "SAST", date: "2026-08-16", findings: 6 },
  { id: "t3", engagementId: "e2", name: "Manual Pentest Report", scanner: "Burp Suite", kind: "Pentest", date: "2026-07-18", findings: 4 },
  { id: "t4", engagementId: "e3", name: "OWASP ZAP Baseline", scanner: "OWASP ZAP", kind: "DAST", date: "2026-08-18", findings: 7 },
  { id: "t5", engagementId: "e3", name: "Snyk Dependency Scan", scanner: "Snyk", kind: "SCA", date: "2026-08-18", findings: 5 },
  { id: "t6", engagementId: "e4", name: "Semgrep Ruleset (PCI)", scanner: "Semgrep", kind: "SAST", date: "2026-06-28", findings: 3 },
  { id: "t7", engagementId: "e5", name: "Snyk Mobile SCA", scanner: "Snyk", kind: "SCA", date: "2026-08-14", findings: 5 },
  { id: "t8", engagementId: "e6", name: "Mobile Pentest", scanner: "Burp Suite", kind: "Pentest", date: "2026-07-21", findings: 3 },
  { id: "t9", engagementId: "e7", name: "Trivy IaC + Image Scan", scanner: "Trivy", kind: "Container", date: "2026-08-01", findings: 4 },
];

interface Seed {
  t: string;
  s: Severity;
  cwe: string;
  cve?: string | undefined;
  loc: string;
  st: FindingStatus;
  test: string;
  cvss: number;
  d: string;
  epss?: number | undefined;
  kev?: boolean | undefined;
}

const seeds: Seed[] = [
  { t: "SQL injection in invoice lookup endpoint", s: "Critical", cwe: "CWE-89", cve: "CVE-2026-1183", loc: "/api/v2/invoices?id=", st: "Active", test: "t2", cvss: 9.8, d: "2026-08-16", epss: 0.71, kev: true },
  { t: "Hardcoded AWS access key in build image", s: "Critical", cwe: "CWE-798", loc: "docker/Dockerfile.prod:14", st: "Verified", test: "t1", cvss: 9.1, d: "2026-08-17", epss: 0.34 },
  { t: "Outdated OpenSSL with remote code execution", s: "Critical", cwe: "CWE-787", cve: "CVE-2025-9091", loc: "base-image: alpine:3.18", st: "Active", test: "t1", cvss: 9.4, d: "2026-08-17", epss: 0.88, kev: true },
  { t: "Broken authentication on settlement callback", s: "Critical", cwe: "CWE-287", loc: "/api/payments/settle/callback", st: "Verified", test: "t4", cvss: 9.6, d: "2026-08-18", epss: 0.44 },
  { t: "Reflected XSS in support search", s: "High", cwe: "CWE-79", loc: "/support/search?q=", st: "Active", test: "t4", cvss: 7.4, d: "2026-08-18", epss: 0.21 },
  { t: "Insecure deserialization in session cache", s: "High", cwe: "CWE-502", cve: "CVE-2026-0442", loc: "src/session/cache.py:88", st: "Active", test: "t2", cvss: 8.1, d: "2026-08-16", epss: 0.39 },
  { t: "Missing rate limiting on OTP verification", s: "High", cwe: "CWE-307", loc: "/api/auth/otp/verify", st: "Verified", test: "t4", cvss: 7.9, d: "2026-08-18" },
  { t: "Vulnerable lodash version (prototype pollution)", s: "High", cwe: "CWE-1321", cve: "CVE-2025-8842", loc: "package-lock.json", st: "Mitigated", test: "t5", cvss: 7.3, d: "2026-08-18", epss: 0.18 },
  { t: "Sensitive data written to application logs", s: "High", cwe: "CWE-532", loc: "src/logging/audit.ts:41", st: "Active", test: "t2", cvss: 7.1, d: "2026-08-16" },
  { t: "Android backup allows extraction of tokens", s: "High", cwe: "CWE-922", loc: "AndroidManifest.xml", st: "Active", test: "t8", cvss: 7.6, d: "2026-07-21" },
  { t: "JWT accepts 'none' algorithm in legacy path", s: "High", cwe: "CWE-347", loc: "src/auth/jwt-legacy.ts:29", st: "Risk Accepted", test: "t6", cvss: 8.0, d: "2026-06-28" },
  { t: "Server-side request forgery in avatar import", s: "High", cwe: "CWE-918", loc: "/api/profile/avatar/import", st: "Active", test: "t4", cvss: 8.2, d: "2026-08-18", epss: 0.26 },
  { t: "Missing Content-Security-Policy header", s: "Medium", cwe: "CWE-693", loc: "nginx/site.conf", st: "Active", test: "t4", cvss: 5.3, d: "2026-08-18" },
  { t: "Session cookie missing SameSite attribute", s: "Medium", cwe: "CWE-1275", loc: "src/server/cookies.ts:12", st: "Active", test: "t2", cvss: 5.4, d: "2026-08-16" },
  { t: "Verbose error messages leak stack traces", s: "Medium", cwe: "CWE-209", loc: "/api/v2/*", st: "Verified", test: "t4", cvss: 5.0, d: "2026-08-18" },
  { t: "Outdated axios with SSRF redirect issue", s: "Medium", cwe: "CWE-918", cve: "CVE-2025-7712", loc: "package.json", st: "Active", test: "t5", cvss: 6.1, d: "2026-08-18", epss: 0.12 },
  { t: "Weak password policy on admin accounts", s: "Medium", cwe: "CWE-521", loc: "src/admin/policy.ts:8", st: "Active", test: "t9", cvss: 5.9, d: "2026-08-01" },
  { t: "Container runs as root user", s: "Medium", cwe: "CWE-250", loc: "docker/Dockerfile:1", st: "Mitigated", test: "t1", cvss: 6.0, d: "2026-08-17" },
  { t: "Unencrypted local cache on device", s: "Medium", cwe: "CWE-311", loc: "ios/CacheStore.swift:57", st: "Active", test: "t7", cvss: 5.7, d: "2026-08-14" },
  { t: "TLS 1.0 still enabled on legacy endpoint", s: "Medium", cwe: "CWE-327", loc: "legacy.payments.internal:443", st: "Risk Accepted", test: "t6", cvss: 5.8, d: "2026-06-28" },
  { t: "Directory listing enabled on static assets", s: "Medium", cwe: "CWE-548", loc: "/static/", st: "Active", test: "t4", cvss: 4.9, d: "2026-08-18" },
  { t: "Insufficient logging for privileged actions", s: "Medium", cwe: "CWE-778", loc: "src/admin/actions.ts", st: "Active", test: "t9", cvss: 5.1, d: "2026-08-01" },
  { t: "Vulnerable transitive dependency: tar-fs", s: "Medium", cwe: "CWE-22", cve: "CVE-2025-6610", loc: "node_modules/tar-fs", st: "Active", test: "t7", cvss: 6.3, d: "2026-08-14", epss: 0.09 },
  { t: "Deprecated crypto API usage (MD5)", s: "Medium", cwe: "CWE-328", loc: "src/utils/hash.ts:19", st: "False Positive", test: "t2", cvss: 4.7, d: "2026-08-16" },
  { t: "CORS policy allows wildcard origin", s: "Medium", cwe: "CWE-942", loc: "src/server/cors.ts:6", st: "Verified", test: "t4", cvss: 6.5, d: "2026-08-18" },
  { t: "Missing X-Content-Type-Options header", s: "Low", cwe: "CWE-693", loc: "nginx/site.conf", st: "Active", test: "t4", cvss: 3.1, d: "2026-08-18" },
  { t: "Autocomplete enabled on password field", s: "Low", cwe: "CWE-200", loc: "src/pages/Login.tsx:44", st: "Active", test: "t2", cvss: 2.6, d: "2026-08-16" },
  { t: "Server banner discloses version", s: "Low", cwe: "CWE-200", loc: "HTTP response headers", st: "Mitigated", test: "t3", cvss: 3.0, d: "2026-07-18" },
  { t: "Cacheable HTTPS response for account page", s: "Low", cwe: "CWE-525", loc: "/account", st: "Active", test: "t3", cvss: 3.4, d: "2026-07-18" },
  { t: "Clickjacking possible on marketing pages", s: "Low", cwe: "CWE-1021", loc: "/promo/*", st: "Risk Accepted", test: "t3", cvss: 3.7, d: "2026-07-18" },
  { t: "Screenshot allowed on sensitive screens", s: "Low", cwe: "CWE-200", loc: "android/PinActivity.kt:33", st: "Active", test: "t8", cvss: 3.3, d: "2026-07-21" },
  { t: "Debug symbols shipped in release build", s: "Low", cwe: "CWE-489", loc: "build.gradle:71", st: "Mitigated", test: "t7", cvss: 3.2, d: "2026-08-14" },
  { t: "Cookie missing Secure flag on staging", s: "Low", cwe: "CWE-614", loc: "staging config", st: "False Positive", test: "t9", cvss: 2.9, d: "2026-08-01" },
  { t: "Weak referrer policy", s: "Low", cwe: "CWE-200", loc: "nginx/site.conf", st: "Active", test: "t1", cvss: 2.4, d: "2026-08-17" },
  { t: "Outdated base image tag in use", s: "Info", cwe: "CWE-1104", loc: "docker/Dockerfile:1", st: "Active", test: "t1", cvss: 1.8, d: "2026-08-17" },
  { t: "TODO comment references disabled auth check", s: "Info", cwe: "CWE-546", loc: "src/auth/guard.ts:120", st: "Active", test: "t2", cvss: 1.2, d: "2026-08-16" },
  { t: "Robots.txt exposes admin path", s: "Info", cwe: "CWE-200", loc: "/robots.txt", st: "Active", test: "t9", cvss: 1.5, d: "2026-08-01" },
  { t: "Duplicate dependency versions detected", s: "Info", cwe: "CWE-1188", loc: "package-lock.json", st: "Duplicate", test: "t5", cvss: 1.0, d: "2026-08-18" },
  { t: "Legacy analytics SDK still bundled", s: "Info", cwe: "CWE-1104", loc: "src/analytics/legacy.ts", st: "Active", test: "t7", cvss: 1.6, d: "2026-08-14" },
];

const testById = new Map(tests.map((t) => [t.id, t]));
const engById = new Map(engagements.map((e) => [e.id, e]));

export const findings: Finding[] = seeds.map((s, i) => {
  const test = testById.get(s.test)!;
  const eng = engById.get(test.engagementId)!;
  const ref = `#${1200 + i * 7}`;
  return {
    id: `f${i + 1}`,
    ref,
    title: s.t,
    severity: s.s,
    cwe: s.cwe,
    cve: s.cve,
    epss: s.epss,
    kev: s.kev,
    description: `${s.t}. Detected by ${test.scanner} during "${test.name}". An attacker able to reach ${s.loc} could leverage this weakness (${s.cwe}) to compromise confidentiality or integrity of the affected component. Remediation guidance has been attached from the scanner rule pack and mapped to the internal secure-coding baseline.`,
    location: s.loc,
    status: s.st,
    scanner: test.scanner,
    date: s.d,
    productId: eng.productId,
    engagementId: eng.id,
    testId: test.id,
    cvss: s.cvss,
    duplicateOf: s.st === "Duplicate" ? "#1214" : undefined,
    duplicates: i % 9 === 0 ? ["#1109 — same CWE + file path", "#1042 — same rule, prior scan", "#0987 — merged from Semgrep"] : undefined,
    activity: [{ at: s.d, text: `Imported from ${test.scanner} scan` }],
  };
});

export const trend = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 6, 20));
  day.setUTCDate(day.getUTCDate() + i);
  const wave = Math.sin(i / 4) * 6;
  return {
    date: day.toISOString().slice(5, 10),
    open: Math.round(52 + i * 0.9 + wave),
    closed: Math.round(18 + i * 0.7 + Math.cos(i / 3) * 4),
  };
});

export const reports = [
  { id: "r1", title: "Customer Portal — Sprint 42 Security Summary", product: "Customer Portal", range: "10 Aug – 17 Aug 2026", generated: "2026-08-17", findings: 15, critical: 3 },
  { id: "r2", title: "Payments API — Release 5.4 Risk Report", product: "Payments API", range: "14 Aug – 18 Aug 2026", generated: "2026-08-18", findings: 12, critical: 1 },
  { id: "r3", title: "Mobile Banking App — Pre-Release Audit", product: "Mobile Banking App", range: "10 Jul – 22 Jul 2026", generated: "2026-07-22", findings: 8, critical: 0 },
  { id: "r4", title: "Quarterly Executive Vulnerability Posture", product: "All Products", range: "Q3 2026", generated: "2026-08-01", findings: 39, critical: 4 },
];

export const integrations = [
  { id: "slack", name: "Slack", desc: "Route Critical and High findings to #sec-alerts.", connected: true },
  { id: "jira", name: "JIRA", desc: "Create and sync remediation tickets automatically.", connected: true },
  { id: "github", name: "GitHub", desc: "Ingest Dependabot and code scanning alerts.", connected: false },
  { id: "gitlab", name: "GitLab", desc: "Pull CI pipeline scan artifacts on merge.", connected: false },
  { id: "azure", name: "Azure DevOps", desc: "Sync work items with engagement backlogs.", connected: false },
];

export const team = [
  { id: "u1", name: "Ada Okonkwo", email: "ada@acme.io", role: "Admin" },
  { id: "u2", name: "Marc Delaney", email: "marc@acme.io", role: "Writer" },
  { id: "u3", name: "Priya Raghavan", email: "priya@acme.io", role: "Writer" },
  { id: "u4", name: "Nils Berger", email: "nils@acme.io", role: "Reader" },
  { id: "u5", name: "Sofia Marchetti", email: "sofia@acme.io", role: "Admin" },
  { id: "u6", name: "Tomás Vidal", email: "tomas@acme.io", role: "Reader" },
];

export const initialActivity = [
  { at: "2 min ago", text: "New Critical finding in Payments API — Broken authentication on settlement callback" },
  { at: "18 min ago", text: "OWASP ZAP baseline scan imported into Payments Release 5.4 Scan" },
  { at: "1 hr ago", text: "Finding #1249 marked as Mitigated by Marc Delaney" },
  { at: "3 hrs ago", text: "Risk acceptance approved for TLS 1.0 legacy endpoint (expires 30 Sep 2026)" },
  { at: "Yesterday", text: "Trivy container scan imported into Sprint 42 CI Scan — 5 duplicates suppressed" },
];
