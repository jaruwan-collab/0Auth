"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "../lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "../lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

// 1. นำ "idle" ออกจาก LoadState เพราะหน้าจอจะโหลดเองตั้งแต่เปิด
type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    // 2. กำหนดค่าเริ่มต้น status เป็น "loading"
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");
    
    // State สำหรับเก็บข้อมูลสินค้าที่กำลังถูกแก้ไข (ถ้าเป็น null แสดงว่าอยู่ในโหมดเพิ่มใหม่)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // 3. โหลดข้อมูลอัตโนมัติเมื่อเปิดหน้าเว็บครั้งแรก
    useEffect(() => {
        fetchProducts(defaultQuery)
            .then(showResult)
            .catch(showError);
    }, []);

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    // 4. ฟังก์ชันบันทึก (รองรับทั้งเพิ่มใหม่ และ บันทึกการแก้ไข)
    function saveProduct(draft: ProductDraft) {
        if (editingProduct) {
            // กรณีแก้ไข: อัปเดตข้อมูลเฉพาะตัวที่เลือก โดยสร้าง Array ใหม่
            setProducts(
                products.map((p) => (p.id === editingProduct.id ? { ...draft, id: p.id } : p))
            );
            setEditingProduct(null); // กลับสู่โหมดเพิ่มใหม่
        } else {
            // กรณีเพิ่มใหม่: ต่อท้าย Array เดิม
            setProducts([...products, { ...draft, id: Date.now() }]);
        }
        setStatus("ready");
    }

    // 5. ฟังก์ชันลบสินค้า
    function removeProduct(id: number) {
        setProducts(products.filter((p) => p.id !== id));
        
        // หากกำลังแก้ไขรายการที่ถูกลบอยู่ ให้รีเซ็ตฟอร์มกลับสู่โหมดเพิ่มใหม่ด้วย
        if (editingProduct?.id === id) {
            setEditingProduct(null);
        }
    }

    return (
        <main className="max-w-5xl mx-auto p-6 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">รายการสินค้า</h1>

            {/* ฟอร์มเพิ่ม/แก้ไขสินค้า */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                </h2>
                <ProductForm
                    key={editingProduct ? editingProduct.id : "new"} // บังคับให้รีเซ็ตฟอร์มเมื่อเปลี่ยนโหมดหรือเปลี่ยนตัวแก้ไข
                    editing={editingProduct}
                    onSave={saveProduct}
                    onCancel={() => setEditingProduct(null)}
                />
            </div>

            <ProductSearchForm onSearch={loadProducts} />

            <button
                type="button"
                onClick={() => loadProducts(defaultQuery)}
                disabled={status === "loading"}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 transition-colors cursor-pointer my-6"
            >
                {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลเริ่มต้น (รีเฟรช)"}
            </button>

            {/* ส่วนแสดงผลตาราง */}
            <section aria-live="polite" className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                {status === "loading" && <p className="text-blue-600 font-medium">กำลังโหลดข้อมูล...</p>}

                {status === "error" && <p role="alert" className="text-red-500 font-medium">{errorMessage}</p>}

                {status === "ready" && products.length === 0 && (
                    <p className="text-gray-500">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {status === "ready" && products.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                                    <th className="py-3 px-4 font-semibold">รูปภาพ</th>
                                    <th className="py-3 px-4 font-semibold">ชื่อสินค้า</th>
                                    <th className="py-3 px-4 font-semibold text-right">ราคา</th>
                                    <th className="py-3 px-4 font-semibold text-center">คงเหลือ</th>
                                    <th className="py-3 px-4 font-semibold">หมวดหมู่</th>
                                    <th className="py-3 px-4 font-semibold text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <img 
                                                src={item.thumbnail || "https://placehold.co/100"} 
                                                alt={item.title} 
                                                className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-gray-800 font-medium">{item.title}</td>
                                        <td className="py-3 px-4 text-gray-600 text-right">${item.price.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-gray-600 text-center">{item.stock}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingProduct(item)}
                                                className="px-3 py-1 bg-amber-500 text-white rounded text-sm hover:bg-amber-600 transition-colors"
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeProduct(item.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                                            >
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}