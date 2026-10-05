import { auth } from "@/lib/auth";
import ProductExplorer from "../components/ProductExplorer";
import { AuthButtons } from "@/components/auth-buttons";

export default async function Home() {
  const session = await auth();

  return (
    <main className="p-4">
      {/* เพิ่มส่วนแสดงปุ่มล็อกอินตรงนี้ */}
      <div className="flex justify-end mb-4">
        <AuthButtons 
          isLoggedIn={!!session?.user} 
          userName={session?.user?.name} 
        />
      </div>
      <ProductExplorer />
    </main>
  );
}