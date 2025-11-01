import ThemeProvider from "@/components/theme-provider";
import Footer from "@/components/footer";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
      <Footer />
    </ThemeProvider>
  );
}
