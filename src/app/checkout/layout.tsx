import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen pt-16">
        {children}
      </div>
      <Footer />
    </>
  );
}
