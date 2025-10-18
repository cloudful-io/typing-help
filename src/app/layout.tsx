import "./global.css";
import { UserRolesProvider } from "@/contexts/UserRolesContext";
import Providers from "./providers"; // <- client wrapper
import { getUserRolesByName } from "@/lib/userRole"
import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  const user = data.user;
  let roles: string[] = [];

  if (user) {
    roles = await getUserRolesByName(user.id); // returns array of role names
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
      </head>
      <body>
        <UserRolesProvider initialRoles={roles}>
          <Providers>
            {children}
          </Providers>
        </UserRolesProvider>
      </body>
    </html>
  );
}
