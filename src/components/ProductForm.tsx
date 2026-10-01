"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "../lib/products";
import type { Product, ProductDraft } from "../lib/products";

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? { title: editing.title, price: editing.price, stock: editing.stock, category: editing.category }
            : { title: "", price: undefined, stock: undefined },
    });

    function saveProduct(values: ProductDraft) {
        onSave(values);
        reset();
    }

    return (
        <form onSubmit={handleSubmit(saveProduct)} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ชื่อสินค้า */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">ชื่อสินค้า</label>
                    <input
                        id="title"
                        required
                        {...register("title")}
                        aria-invalid={!!errors.title}
                        aria-describedby="title-error"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        placeholder="ระบุชื่อสินค้า..."
                    />
                    <span id="title-error" role="alert" className="text-xs text-red-500 mt-1 block">{errors.title?.message}</span>
                </div>

                {/* หมวดหมู่ */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
                    <select
                        id="category"
                        required
                        {...register("category")}
                        aria-invalid={!!errors.category}
                        aria-describedby="category-error"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                        <option value="">กรุณาเลือกหมวดหมู่</option>
                        {CATEGORIES.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <span id="category-error" role="alert" className="text-xs text-red-500 mt-1 block">{errors.category?.message}</span>
                </div>

                {/* ราคา */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">ราคา ($)</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        required
                        {...register("price", { valueAsNumber: true })}
                        aria-invalid={!!errors.price}
                        aria-describedby="price-error"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        placeholder="0.00"
                    />
                    <span id="price-error" role="alert" className="text-xs text-red-500 mt-1 block">{errors.price?.message}</span>
                </div>

                {/* จำนวนคงเหลือ */}
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">จำนวนคงเหลือ</label>
                    <input
                        id="stock"
                        type="number"
                        required
                        {...register("stock", { valueAsNumber: true })}
                        aria-invalid={!!errors.stock}
                        aria-describedby="stock-error"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        placeholder="0"
                    />
                    <span id="stock-error" role="alert" className="text-xs text-red-500 mt-1 block">{errors.stock?.message}</span>
                </div>
            </div>

            {/* ปุ่มกดดำเนินการ */}
            <div className="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    disabled={!isDirty || !isValid}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl text-sm shadow-sm transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                >
                    {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors cursor-pointer"
                    >
                        ยกเลิก
                    </button>
                )}
            </div>
        </form>
    );
}