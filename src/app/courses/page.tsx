"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, User, Tag, Loader2, Search, Filter, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Category {
    id: string;
    name: string;
}

interface Instructor {
    id: string;
    fullName: string;
    username: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    category: Category | null;
    instructor: Instructor;
    thumbnailUrl: string | null;
    createdAt?: string;
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter & Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");
    const [priceRange, setPriceRange] = useState<string>("all"); // "all", "free", "paid"

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get("/api/courses");
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Extract unique categories from loaded courses
    const categories = Array.from(new Set(courses.filter(c => c.category).map(c => c.category?.name))).filter(Boolean) as string[];

    // Apply local filters
    let filteredCourses = courses.filter((course) => {
        // Search condition
        const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category condition
        const matchCategory = selectedCategory === "all" || course.category?.name === selectedCategory;

        // Price condition
        let matchPrice = true;
        if (priceRange === "free") matchPrice = course.price === 0;
        if (priceRange === "paid") matchPrice = course.price > 0;

        return matchSearch && matchCategory && matchPrice;
    });

    // Apply sorting
    filteredCourses.sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        // Default to newest (assuming courses have IDs or dates, here we just keep original order or mock date)
        return 0; 
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                
                {/* Lệnh Sidebar Filters */}
                <aside className="w-full md:w-64 shrink-0 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 font-semibold text-lg text-slate-900 border-b border-slate-100 pb-4 mb-4">
                            <Filter className="w-5 h-5 text-indigo-600" />
                            Bộ lọc
                        </div>

                        {/* Search in sidebar */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Tìm kiếm</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Tên khóa học..."
                                    className="w-full pl-9 bg-slate-50 border-slate-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Category filter */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Danh mục</label>
                            <select 
                                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price filter */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Giá cả</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="price" value="all" checked={priceRange === "all"} onChange={() => setPriceRange("all")} className="text-indigo-600 focus:ring-indigo-600" />
                                    <span className="text-sm text-slate-600">Tất cả giá</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="price" value="free" checked={priceRange === "free"} onChange={() => setPriceRange("free")} className="text-indigo-600 focus:ring-indigo-600" />
                                    <span className="text-sm text-slate-600">Miễn phí</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="price" value="paid" checked={priceRange === "paid"} onChange={() => setPriceRange("paid")} className="text-indigo-600 focus:ring-indigo-600" />
                                    <span className="text-sm text-slate-600">Trả phí</span>
                                </label>
                            </div>
                        </div>
                        
                        <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("all");
                                setPriceRange("all");
                                setSortBy("newest");
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Danh sách Khóa học</h1>
                            <p className="text-sm text-slate-500 mt-1">Hiển thị {filteredCourses.length} kết quả</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                            <select 
                                className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-700"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá: Thấp đến cao</option>
                                <option value="price_desc">Giá: Cao đến thấp</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                            <p className="text-slate-500">Đang tải danh sách khóa học...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <BookOpen className="w-16 h-16 text-slate-300 mx-auto border-2 border-slate-100 rounded-full p-4 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900">Không tìm thấy khóa học</h3>
                            <p className="text-slate-500 mt-2">Thử điều chỉnh lại bộ lọc của bạn.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => (
                                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200/60 bg-white flex flex-col group">
                                    <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                                        {course.thumbnailUrl ? (
                                            <img
                                                src={course.thumbnailUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2670&auto=format&fit=crop"; 
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:scale-105 transition-transform duration-700">
                                                <BookOpen className="w-12 h-12 text-indigo-200" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-indigo-700 shadow-sm flex items-center gap-1.5">
                                                <Tag className="w-3 h-3" />
                                                {course.category?.name || "Khác"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <CardHeader className="p-4 pb-0 flex-1">
                                        <h3 className="font-bold text-base text-slate-900 line-clamp-2 leading-snug mb-2 hover:text-indigo-600 transition-colors">
                                            <Link href={`/courses/${course.id}`}>{course.title}</Link>
                                        </h3>
                                        <div className="flex items-center gap-2 mt-auto text-xs text-slate-500 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                <User className="w-3 h-3 text-slate-500" />
                                            </div>
                                            <span className="truncate">{course.instructor?.fullName || "Giảng viên"}</span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 pt-3 pb-3 mt-auto">
                                        <div className="flex items-end justify-between">
                                            <span className="text-xl font-bold tracking-tight text-indigo-700">
                                                {course.price && course.price > 0 
                                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price) 
                                                    : "Miễn phí"
                                                }
                                            </span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0">
                                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium" asChild>
                                            <Link href={`/courses/${course.id}`}>Chi tiết khóa học</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
