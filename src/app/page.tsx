import { HydrateClient } from "~/trpc/server";

import Header from "./_components/header";
import Hero from "./_components/hero";
import Footer from "./_components/footer";
import Chat from "./_components/chat";
import AnalyticsDashboard from "./_components/analytics";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white text-black">
        <Header />
        <Hero />
        <AnalyticsDashboard />
        <Chat />
        <Footer />
      </main>
    </HydrateClient>
  );
}
