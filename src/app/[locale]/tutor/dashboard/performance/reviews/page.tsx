"use client";

import React, { useEffect, useState } from 'react';
import { 
  Star, 
  Search, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Calendar,
  MoreVertical,
  Flag,
  Reply
} from 'lucide-react';
import { analyticsService, TutorReview } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await analyticsService.getTutorReviews({ page: pageNumber, size: 10 });
      setReviews(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const filteredReviews = reviews.filter(review => {
    const matchesRating = selectedRating === 'all' || Math.floor(review.rating) === selectedRating;
    const matchesSearch = review.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          review.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={cn(
              "w-3.5 h-3.5",
              star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"
            )} 
          />
        ))}
      </div>
    );
  };

  if (loading && page === 0 && reviews.length === 0) {
    return (
      <div className="p-10 space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-slate-100 rounded-lg" />
        <div className="space-y-4">
           {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student Reviews</h1>
        <p className="text-sm text-slate-500 font-medium">Manage and respond to feedback across all your courses</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reviews..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="bg-slate-50 border-none rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
           <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{totalElements} Total Reviews</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Left Side: Student Info */}
              <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4">
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-100 transition-colors">
                  {review.studentAvatar ? (
                    <Image src={review.studentAvatar} alt={review.studentName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl">
                      {review.studentName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{review.studentName}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>

              {/* Middle: Review Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-xs font-black text-slate-900">{review.rating.toFixed(1)}</span>
                   </div>
                   <button className="p-1 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                   </button>
                </div>

                <div className="space-y-2">
                   <p className="text-slate-600 text-sm leading-relaxed italic">
                     &quot;{review.comment}&quot;
                   </p>
                   <div className="flex items-center gap-2 py-1 px-3 bg-slate-50 rounded-lg w-fit">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[11px] font-bold text-slate-500">Course: {review.courseTitle}</span>
                   </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                   <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                      <Reply className="w-3.5 h-3.5" />
                      Respond
                   </button>
                   <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                      <Flag className="w-3.5 h-3.5" />
                      Report
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && !loading && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-slate-400 font-medium">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-10">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="rounded-lg"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                  page === i ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="rounded-lg"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

    </div>
  );
}
