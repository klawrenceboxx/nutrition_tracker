import type { ReactNode } from "react";

type PageSectionProps = {
  children: ReactNode;
};

export default function PageSection({ children }: PageSectionProps) {
  return (
    <section className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {children}
    </section>
  );
}
