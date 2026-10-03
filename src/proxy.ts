import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();

    // Force invited/reset accounts to change their temp password before
    // using the dashboard. Fail open (allow through) if the flag column
    // or migration is missing, so nobody gets locked out.
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/dashboard") && pathname !== "/dashboard/profile") {
      try {
        if (sessionUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("must_change_password")
            .eq("id", sessionUser.id)
            .maybeSingle();

          if (
            profile &&
            (profile as { must_change_password?: boolean }).must_change_password
          ) {
            return NextResponse.redirect(new URL("/dashboard/profile", request.url));
          }
        }
      } catch {
        // Allow the request through on any enforcement error.
      }
    }
  }

  // Ensure the consent cookie is always set with SameSite=Lax (or Strict) on subsequent requests
  const consent = request.cookies.get('karna_consent');
  if (consent) {
    response.cookies.set('karna_consent', consent.value, { sameSite: 'lax', path: '/' });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
