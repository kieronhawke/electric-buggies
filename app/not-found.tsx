import { Container } from "@/components/container";
import { Button, Arrow } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-24">
      <Container size="narrow" className="text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 text-5xl text-ink md:text-7xl">This page has driven off.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-soft">
          The page you&rsquo;re looking for can&rsquo;t be found. Let&rsquo;s get you back to the range.
        </p>
        <div className="mt-9 flex justify-center gap-4">
          <Button href="/" size="lg">Return home <Arrow /></Button>
          <Button href="/range" variant="outline" size="lg">Explore the Range</Button>
        </div>
      </Container>
    </section>
  );
}
