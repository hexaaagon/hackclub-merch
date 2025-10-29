import ThemeProvider from "@/components/theme-provider";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
