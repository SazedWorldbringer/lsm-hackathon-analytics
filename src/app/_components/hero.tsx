import Link from "next/link"
import { Button } from "~/components/ui/button"

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-black">
          Social Analytics & RAG Chat
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover insights from your social media data and interact with our AI chat.
        </p>
        <div className="space-x-4">
          <Button asChild variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white">
            <Link href="#analytics">View Analytics</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white">
            <Link href="#chat">Try RAG Chat</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
