"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CourseFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Read initial states from URL
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (keyword.trim()) {
            params.set('keyword', keyword.trim());
        } else {
            params.delete('keyword');
        }
        params.delete('page'); // Reset pagination on new search
        router.push(`/courses?${params.toString()}`);
    };

    const handleClear = () => {
        setKeyword('');
        router.push('/courses');
    };

    return (
        <aside className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                <div className="flex items-center gap-2 font-semibold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-4">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    Bộ lọc
                </div>

                <form onSubmit={handleSearch} className="mb-6">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Tìm kiếm</label>
                    <div className="relative flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Tên khóa học..."
                                className="w-full pl-9 bg-slate-50 border-slate-200"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Hiding submit button visually but keeping it for form submit on Enter */}
                    <button type="submit" className="hidden">Search</button>
                </form>

                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClear}
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </aside>
    );
}
