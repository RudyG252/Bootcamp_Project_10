import AddPlayer from "@/components/AddPlayer";

import Players from "@/components/players";
import FilterWrapper from "@/components/FilterWrapper";

export default async function Page({ searchParams }: { searchParams: Promise<{ playerId?: string }> }) {
  const { playerId } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Players</h1>
        <p className="mt-1 text-sm text-slate-500">Find a player to view their ratings and match history.</p>
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-label="Player details"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-6 border-b border-slate-100 pb-5">
            <FilterWrapper />
          </div>
          <Players playerId={playerId} />
        </section>
        <aside aria-label="Add a player" className="min-w-0">
          <AddPlayer />
        </aside>
      </div>
    </div>
  );
}
