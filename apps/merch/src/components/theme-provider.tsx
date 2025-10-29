import Navbar from "./navbar";
import { ReactScan } from "./react-scan";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReactScan />
      <Navbar />
      {children}
    </>
  );
}
