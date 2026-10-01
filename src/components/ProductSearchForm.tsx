"use client";

import { useForm } from "react-hook-form";
import type { SearchQuery } from "../lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => void;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
    const { register, handleSubmit } = useForm<SearchQuery>({
        defaultValues: {
            q: "",
            limit: 10,
            sortBy: "title",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* คำค้นหา */}
                <div>
                    <label htmlFor="q" className="block text-sm font-medium text-slate-700 mb-1">คำค้นหา</label>
                    <input
                        id="q"
                        type="text"
                        {...register("q")}
                        placeholder="พิมพ์ชื่อสินค้า..."
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
                    />
                </div>

                {/* จำนวนรายการ */}
                <div>
                    <label htmlFor="limit" className="block text-sm font-medium text-slate-700 mb-1">จำนวนรายการ</label>
                    <input
                        id="limit"
                        type="number"
                        {...register("limit", { valueAsNumber: true })}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
                    />
                </div>

                {/* เรียงตาม */}
                <div>
                    <label htmlFor="sortBy" className="block text-sm font-medium text-slate-700 mb-1">เรียงตาม</label>
                    <select
                        id="sortBy"
                        {...register("sortBy")}
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
                    >
                        <option value="title">ชื่อสินค้า (Title)</option>
                        <option value="price">ราคา (Price)</option>
                        <option value="stock">จำนวนคงเหลือ (Stock)</option>
                    </select>
                </div>
            </div>

            {/* ปุ่มค้นหา */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-medium rounded-xl text-sm shadow-sm transition-all cursor-pointer"
                >
                    ค้นหาข้อมูล
                </button>
            </div>
        </form>
    );
}