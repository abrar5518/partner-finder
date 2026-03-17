import { PagePlaceholder } from "@/components/ui/page-placeholder";

const routeLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/campaigns", label: "Dashboard Campaigns" },
  { href: "/dashboard/campaign/demo-campaign", label: "Dashboard Campaign Detail" },
  { href: "/create-campaign", label: "Create Campaign" },
  { href: "/test/demo-test", label: "Public Test" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/users", label: "Admin Users" },
  { href: "/admin/campaigns", label: "Admin Campaigns" },
];

export default function LandingPage() {
  return (
    <PagePlaceholder
      title="Landing Page"
      description="Crush Test landing page placeholder for the anonymous campaign platform. Use the links below to confirm routing across public, dashboard, and admin sections."
      badge="App Router Ready"
      links={routeLinks}
    />
  );
}
