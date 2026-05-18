export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body:has(.docs-layout)::before {
          display: none !important;
        }
      `}</style>
      <div className="docs-layout">{children}</div>
    </>
  );
}
