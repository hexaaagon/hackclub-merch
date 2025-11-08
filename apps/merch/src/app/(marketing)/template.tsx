import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
