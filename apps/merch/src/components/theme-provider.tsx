import { ReactScan } from "./react-scan";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReactScan />
      {children}
    </>
  );
}
