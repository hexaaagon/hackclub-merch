export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-[calc(100vh-8rem)]">{children}</div>;
}
