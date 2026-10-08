import { MapPin, Plus } from "lucide-react";
import LocationForm from "@/components/dashboard/LocationForm";
import { createLocation } from "@/app/dashboard/actions";
import { canEditData, getDashboardUser } from "@/lib/auth";
import { listLocations } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const [locations, user] = await Promise.all([listLocations(), getDashboardUser()]);
  const canEdit = user ? canEditData(user.role) : false;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Network</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Locations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Keep the location list organized so employee records can be filtered accurately.
        </p>
      </section>

      {canEdit && <LocationForm action={createLocation} />}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11151d]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold">Your locations</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{locations.length} locations available for employee assignment</p>
            </div>
          </div>
        </div>
        {locations.length ? (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
            {locations.map((location) => (
              <div key={location.id} className="rounded-xl border border-slate-100 p-4 transition hover:border-primary/30 hover:shadow-sm dark:border-white/10 dark:hover:border-primary/30">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{location.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{location.city}, {location.state}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-extrabold">Add your first location</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Locations make employee filtering useful and consistent.</p>
          </div>
        )}
      </section>
    </div>
  );
}
