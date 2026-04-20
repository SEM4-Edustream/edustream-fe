import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function TeachingPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* --- BILLBOARD HERO SECTION (Udemy Style) --- */}
      <section className="relative w-full overflow-hidden bg-[#f7f9fa]">
        <div className="relative min-h-[450px] md:min-h-[600px] w-full flex items-center">
          {/* Background Image Billboard */}
          <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
            <img 
              src="/images/teaching-hero.png" 
              alt="Instructor Billboard" 
              className="absolute right-0 bottom-0 top-0 h-full w-full object-contain md:object-cover md:object-right-bottom scale-100 md:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7f9fa] via-[#f7f9fa]/80 to-transparent md:w-1/2" />
          </div>

          {/* Text Container over Billboard */}
          <div className="container mx-auto max-w-[1340px] px-4 md:px-6 relative z-10">
            <div className="max-w-[480px] py-12 md:py-20 flex flex-col items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
               <h1 className="text-[36px] md:text-[52px] font-bold leading-[1.2] text-[#1c1d1f] font-serif tracking-tight">
                 Come teach with us
               </h1>
               <p className="text-[18px] md:text-[22px] text-[#1c1d1f] leading-snug md:leading-relaxed max-w-[380px]">
                 Become an instructor and change lives — including your own
               </p>
               <div className="mt-4 w-full sm:w-auto">
                 <Link href="/login?redirect=/tutor/onboarding">
                    <Button className="h-12 px-10 text-base font-bold bg-[#1c1d1f] hover:bg-slate-800 text-white w-full sm:w-auto transition-transform hover:scale-[1.02]">
                      Get started
                    </Button>
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- REASONS SECTION --- */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-[1340px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[40px] font-bold text-[#1c1d1f] tracking-tight font-serif">
              So many reasons to start
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
             <BenefitCard 
               image="/images/value-prop-teach-v3.png"
               title="Teach your way"
               description="Publish the course you want, in the way you want, and always have control of your own content."
             />
             <BenefitCard 
               image="/images/value-prop-inspire-v3.png"
               title="Inspire learners"
               description="Teach what you know and help learners explore their interests, gain new skills, and advance their careers."
             />
             <BenefitCard 
               image="/images/value-prop-get-rewarded-v3.png"
               title="Get rewarded"
               description="Expand your professional network, build your expertise, and earn money on each paid enrollment."
             />
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-[#1c1d1f] py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[1340px]">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1 font-serif">62M</div>
                <div className="text-xs font-medium opacity-90 uppercase tracking-widest">Students</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1 font-serif">75+</div>
                <div className="text-xs font-medium opacity-90 uppercase tracking-widest">Languages</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1 font-serif">830M</div>
                <div className="text-xs font-medium opacity-90 uppercase tracking-widest">Enrollments</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1 font-serif">180K</div>
                <div className="text-xs font-medium opacity-90 uppercase tracking-widest">Instructors</div>
              </div>
           </div>
        </div>
      </section>

      {/* --- HOW TO BEGIN (TABS SECTION) --- */}
      <section className="py-24 bg-white">
         <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-[40px] font-bold text-[#1c1d1f] text-center mb-12 font-serif">
               How to begin
            </h2>

            <Tabs defaultValue="plan" className="w-full">
               <div className="flex justify-center mb-16">
                  <TabsList variant="line" className="h-auto">
                    <TabsTrigger value="plan" className="px-8 py-3 text-lg font-bold data-active:after:bg-[#1c1d1f]">Plan your curriculum</TabsTrigger>
                    <TabsTrigger value="record" className="px-8 py-3 text-lg font-bold data-active:after:bg-[#1c1d1f]">Record your video</TabsTrigger>
                    <TabsTrigger value="launch" className="px-8 py-3 text-lg font-bold data-active:after:bg-[#1c1d1f]">Launch your course</TabsTrigger>
                  </TabsList>
               </div>

               <TabsContent value="plan" className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                       <p className="text-lg text-slate-700 leading-relaxed">
                          You start with your passion and knowledge. Then choose a promising topic with the help of our Marketplace Insights tool.
                       </p>
                       <p className="text-lg text-slate-700 leading-relaxed">
                          The way that you teach — what you bring to it — is up to you.
                       </p>
                       <div className="pt-4">
                          <h4 className="font-bold text-[#1c1d1f] mb-2 text-xl">How we help you</h4>
                          <p className="text-slate-600">
                             We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.
                          </p>
                       </div>
                    </div>
                    <div>
                       <img src="/images/plan-your-curriculum-v3.png" alt="Plan curriculum" className="w-full h-auto" />
                    </div>
                  </div>
               </TabsContent>

               <TabsContent value="record" className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                       <p className="text-lg text-slate-700 leading-relaxed">
                          Use basic tools like a smartphone or a DSLR camera. Add a good microphone and you’re ready to start.
                       </p>
                       <p className="text-lg text-slate-700 leading-relaxed">
                          Don’t be afraid to be yourself! Our team of experts will help you create high-quality videos.
                       </p>
                       <div className="pt-4">
                          <h4 className="font-bold text-[#1c1d1f] mb-2 text-xl">How we help you</h4>
                          <p className="text-slate-600">
                             Our support team is available to help you throughout the video production process, providing tips on lighting and sound.
                          </p>
                       </div>
                    </div>
                    <div>
                       <img src="/images/record-your-video-v3.png" alt="Record video" className="w-full h-auto" />
                    </div>
                  </div>
               </TabsContent>

               <TabsContent value="launch" className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                       <p className="text-lg text-slate-700 leading-relaxed">
                          Gather your first ratings and reviews by promoting your course through social media and your professional networks.
                       </p>
                       <p className="text-lg text-slate-700 leading-relaxed">
                          Your course will be discoverable in our marketplace where you earn revenue from each paid enrollment.
                       </p>
                       <div className="pt-4">
                          <h4 className="font-bold text-[#1c1d1f] mb-2 text-xl">How we help you</h4>
                          <p className="text-slate-600">
                             Our custom coupons and marketing tools allow you to promote your course effectively to your target audience.
                          </p>
                       </div>
                    </div>
                    <div>
                       <img src="/images/launch-your-course-v3.png" alt="Launch course" className="w-full h-auto" />
                    </div>
                  </div>
               </TabsContent>
            </Tabs>
         </div>
      </section>

      {/* --- SUPPORT SECTION (You won't have to do it alone) --- */}
      <section className="py-24 bg-[#f7f9fa] overflow-hidden">
         <div className="container mx-auto px-4 max-w-[1340px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
               {/* Left Illustration */}
               <div className="hidden lg:block w-1/4 animate-in fade-in slide-in-from-left-8 duration-1000">
                  <img src="/images/support-1-v3.png" alt="Support 1" className="w-full h-auto drop-shadow-xl" />
               </div>

               {/* Center Content */}
               <div className="flex-1 text-center max-w-2xl px-4">
                  <h2 className="text-3xl md:text-[40px] font-bold text-[#1c1d1f] mb-6 font-serif">
                     You won't have to do it alone
                  </h2>
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8">
                     Our Instructor Support Team is here to answer your questions and review your test video, while our Teaching Center gives you plenty of resources to help you through the process. Plus, get the support of experienced instructors in our online community.
                  </p>
                  <Link href="/help" className="text-[#5624d0] font-bold text-lg hover:underline underline-offset-4">
                     Need more details before you start? Learn more.
                  </Link>
               </div>

               {/* Right Illustration */}
               <div className="hidden lg:block w-1/4 animate-in fade-in slide-in-from-right-8 duration-1000">
                  <img src="/images/support-2-v3.png" alt="Support 2" className="w-full h-auto drop-shadow-xl" />
               </div>
            </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-white border-t border-slate-100 text-center">
         <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl md:text-[40px] font-bold text-[#1c1d1f] mb-8 leading-tight font-serif">
              Become an instructor today
            </h2>
            <p className="text-lg text-[#1c1d1f] mb-10 opacity-80">
               Join one of the world’s largest online learning marketplaces.
            </p>
            <Link href="/login?redirect=/tutor/onboarding">
               <Button className="h-12 px-12 text-base font-bold bg-[#1c1d1f] hover:bg-slate-800 text-white">
                  Get started
               </Button>
            </Link>
         </div>
      </section>

    </div>
  );
}

function BenefitCard({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div className="text-center flex flex-col items-center group">
      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
         <img src={image} alt={title} className="w-24 h-24 object-contain" />
      </div>
      <h3 className="text-2xl font-bold text-[#1c1d1f] mb-3">{title}</h3>
      <p className="text-base text-[#1c1d1f] leading-relaxed opacity-80 max-w-[320px]">
         {description}
      </p>
    </div>
  );
}
