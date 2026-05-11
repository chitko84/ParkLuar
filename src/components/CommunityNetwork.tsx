import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  AlertTriangle, 
  MapPin, 
  Zap, 
  Plus, 
  ShieldCheck, 
  Star, 
  Bookmark,
  TrendingUp,
  Award,
  Filter,
  Search,
  CheckCircle2,
  X,
  Camera,
  Heart,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from './ui';
import { IncidentType, CommunityPost, CommunityReport } from '../types';

export const CommunityNetwork = () => {
  const { 
    communityPosts, 
    communityReports, 
    communityUsers, 
    userReputation, 
    userRank,
    likePost,
    savePost,
    helpfulReport,
    addCommunityPost,
    addCommunityReport
  } = useData();

  const [activeTab, setActiveTab] = useState<'feed' | 'reports' | 'ranking'>('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<IncidentType | null>(null);

  const stats = [
    { label: 'Trust Points', value: userReputation.toLocaleString(), icon: Zap, color: 'text-amber-500' },
    { label: 'Network Rank', value: userRank, icon: Award, color: 'text-primary' },
    { label: 'Helpful Acts', value: '42', icon: Heart, color: 'text-rose-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Dynamic Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-slate-100">
         <div className="flex justify-between items-start mb-8">
            <div>
               <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Social Intelligence</p>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Network</h1>
            </div>
            <div className="flex -space-x-3">
               {communityUsers.slice(0, 4).map(u => (
                  <div key={u.id} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                     <img src={u.image} className="w-full h-full object-cover" />
                  </div>
               ))}
               <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-slate-400">
                  +2.4k
               </div>
            </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => (
               <Card key={i} className="p-3 bg-slate-50 border-none shadow-sm rounded-2xl text-center">
                  <stat.icon size={16} className={`${stat.color} mx-auto mb-1`} />
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                  <p className="text-sm font-black text-slate-900 italic leading-none">{stat.value}</p>
               </Card>
            ))}
         </div>

         {/* Navigation Tabs */}
         <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
            {[
               { id: 'feed', label: 'Feed', icon: MessageSquare },
               { id: 'reports', label: 'Live Map', icon: AlertTriangle },
               { id: 'ranking', label: 'Rankings', icon: TrendingUp }
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <tab.icon size={14} />
                  {tab.label}
               </button>
            ))}
         </div>
      </div>

      <main className="px-6 py-8">
         <AnimatePresence mode="wait">
            {activeTab === 'feed' && (
               <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <SectionHeader title="Community Pulse" subtitle="Live updates from local drivers" icon={MessageSquare} />
                     <Button 
                        size="sm" 
                        onClick={() => setShowPostModal(true)}
                        className="bg-primary text-white h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                     >
                        <Plus size={16} />
                        Update
                     </Button>
                  </div>

                  {communityPosts.map(post => (
                    <div key={post.id}>
                      <PostCard 
                         post={post} 
                         onLike={() => likePost(post.id)} 
                         onSave={() => savePost(post.id)} 
                      />
                    </div>
                  ))}
               </motion.div>
            )}

            {activeTab === 'reports' && (
               <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <div className="flex items-center justify-between">
                     <SectionHeader title="Network Hazards" subtitle="Verified live incident reporting" icon={AlertTriangle} />
                     <Button 
                        size="sm" 
                        onClick={() => setShowReportModal(true)}
                        className="bg-rose-500 text-white h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                     >
                        <AlertTriangle size={16} />
                        Report
                     </Button>
                  </div>

                  {communityReports.map(report => (
                    <div key={report.id}>
                      <ReportCard 
                         report={report} 
                         onHelpful={() => helpfulReport(report.id)} 
                      />
                    </div>
                  ))}
               </motion.div>
            )}

            {activeTab === 'ranking' && (
               <motion.div
                  key="ranking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <SectionHeader title="Top Scouts" subtitle="Most helpful urban contributors" icon={Award} />
                  <div className="space-y-4">
                     {communityUsers.sort((a, b) => b.reputation - a.reputation).map((user, i) => (
                        <Card key={user.id} className="p-4 border-slate-200 shadow-sm rounded-3xl flex items-center gap-4 group">
                           <div className="w-10 h-10 flex items-center justify-center font-black text-primary text-xl italic italic">
                              #{i + 1}
                           </div>
                           <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 p-0.5">
                              <img src={user.image} className="w-full h-full object-cover rounded-xl" />
                           </div>
                           <div className="flex-1">
                              <h4 className="text-sm font-black text-slate-900 tracking-tight italic">{user.name}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.rank} • {user.reputation.toLocaleString()} XP</p>
                           </div>
                           <div className="text-right">
                              <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black px-2 py-0.5 uppercase">
                                 {user.helpfulReports} Acts
                              </Badge>
                           </div>
                        </Card>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Modals */}
      <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)} title="Share Intelligence">
         <CreatePostForm onSubmit={(content, type) => {
            addCommunityPost({ content, type });
            setShowPostModal(false);
         }} />
      </Modal>

      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Submit Alert">
         <CreateReportForm onSubmit={(type, description) => {
            addCommunityReport({ type, description, lat: 3.1488, lng: 101.7135 });
            setShowReportModal(false);
         }} />
      </Modal>
    </div>
  );
};

const PostCard = ({ post, onLike, onSave }: { post: CommunityPost, onLike: () => void, onSave: () => void }) => {
   return (
      <Card className="p-6 border-slate-200 shadow-sm rounded-[2.5rem] relative group hover:shadow-md transition-all">
         <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-primary/10">
                  <img src={post.userImage} className="w-full h-full object-cover" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-slate-900 italic tracking-tight leading-none mb-1">{post.userName}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {post.locationName}</p>
               </div>
            </div>
            <button className="text-slate-300 hover:text-slate-500">
               <MoreHorizontal size={18} />
            </button>
         </div>

         <p className="text-sm font-bold text-slate-700 italic leading-relaxed mb-6">
            "{post.content}"
         </p>

         <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map(tag => (
               <Badge key={tag} className="bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase px-2">
                  #{tag}
               </Badge>
            ))}
            <Badge className={`border-none text-[8px] font-black px-2 uppercase ${post.type === 'WARNING' ? 'bg-rose-50 text-rose-500' : 'bg-primary/10 text-primary'}`}>
               {post.type}
            </Badge>
         </div>

         <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-6">
               <button 
                  onClick={onLike}
                  className={`flex items-center gap-2 group transition-colors ${post.isLiked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
               >
                  <Heart size={18} className={post.isLiked ? 'fill-primary' : ''} />
                  <span className="text-[11px] font-black">{post.likes}</span>
               </button>
               <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600">
                  <MessageSquare size={18} />
                  <span className="text-[11px] font-black">{post.comments}</span>
               </button>
            </div>
            <button 
               onClick={onSave}
               className={`transition-colors ${post.isSaved ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'}`}
            >
               <Bookmark size={18} className={post.isSaved ? 'fill-amber-500' : ''} />
            </button>
         </div>
      </Card>
   );
};

const ReportCard = ({ report, onHelpful }: { report: CommunityReport, onHelpful: () => void }) => {
   const config: Record<IncidentType, { icon: any, color: string, label: string }> = {
      'FULL': { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', label: 'Parking Full' },
      'ILLEGAL_PARKING': { icon: AlertTriangle, color: 'text-rose-500 bg-rose-50', label: 'Illegal Parking' },
      'SECURITY': { icon: ShieldCheck, color: 'text-rose-600 bg-rose-100', label: 'Security Concern' },
      'CONGESTION': { icon: TrendingUp, color: 'text-amber-600 bg-amber-50', label: 'Congestion' },
      'FLOOD': { icon: AlertTriangle, color: 'text-blue-600 bg-blue-50', label: 'Water Pooling' },
      'CHARGER_BROKEN': { icon: Zap, color: 'text-rose-500 bg-rose-50', label: 'Charger Out' },
      'UNSAFE': { icon: AlertTriangle, color: 'text-rose-700 bg-rose-100', label: 'Unsafe Area' }
   };

   const c = config[report.type];

   return (
      <Card className="p-6 border-slate-200 shadow-sm rounded-[2.5rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <c.icon size={160} className={c.color.split(' ')[0]} />
         </div>

         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className={`w-12 h-12 ${c.color} rounded-2xl flex items-center justify-center`}>
                  <c.icon size={24} />
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 italic tracking-tight uppercase leading-none mb-1">{c.label}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Reported {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
               {report.isVerified && (
                  <Badge className="ml-auto bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 py-1 flex items-center gap-1">
                     <CheckCircle2 size={10} />
                     Verified
                  </Badge>
               )}
            </div>

            <p className="text-xs font-bold text-slate-600 mb-6 italic leading-relaxed">
               "{report.description}"
            </p>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-100">
                     <img src={report.userImage} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 italic">By {report.userName}</span>
               </div>
               <Button 
                  size="sm" 
                  onClick={onHelpful}
                  variant="ghost"
                  className="bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500 h-9 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest gap-2"
               >
                  <ThumbsUp size={14} />
                  Helpful ({report.helpfulCount})
               </Button>
            </div>
         </div>
      </Card>
   );
};

const CreatePostForm = ({ onSubmit }: { onSubmit: (content: string, type: any) => void }) => {
   const [content, setContent] = useState('');
   const [type, setType] = useState<'TIP' | 'REVIEW' | 'WARNING' | 'UPDATE'>('TIP');

   return (
      <div className="space-y-6 pt-4">
         <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
            {['TIP', 'REVIEW', 'WARNING', 'UPDATE'].map(t => (
               <button
                  key={t}
                  onClick={() => setType(t as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${type === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500'}`}
               >
                  {t}
               </button>
            ))}
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Update</label>
            <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full h-32 bg-slate-50 border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-primary transition-all resize-none" 
               placeholder="What's happening on the ground?" 
            />
         </div>
         <div className="flex gap-3">
            <button className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all shadow-sm">
               <Camera size={24} />
            </button>
            <button className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all shadow-sm">
               <MapPin size={24} />
            </button>
            <Button 
               onClick={() => onSubmit(content, type)}
               className="flex-1 bg-primary text-white font-black italic text-lg uppercase tracking-tight rounded-2xl shadow-xl shadow-primary/20"
            >
               Post Update
            </Button>
         </div>
      </div>
   );
};

const CreateReportForm = ({ onSubmit }: { onSubmit: (type: IncidentType, description: string) => void }) => {
   const [type, setType] = useState<IncidentType>('FULL');
   const [description, setDescription] = useState('');

   const types: IncidentType[] = ['FULL', 'CONGESTION', 'ILLEGAL_PARKING', 'SECURITY', 'FLOOD', 'CHARGER_BROKEN', 'UNSAFE'];

   return (
      <div className="space-y-6 pt-4">
         <div className="grid grid-cols-2 gap-3">
            {types.map(t => (
               <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-3 rounded-2xl text-left transition-all border-2 ${type === t ? 'bg-primary/5 border-primary shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
               >
                  <p className={`text-[9px] font-black uppercase tracking-widest ${type === t ? 'text-primary' : 'text-slate-500'}`}>{t.replace('_', ' ')}</p>
               </button>
            ))}
         </div>
         <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Details</label>
            <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full h-24 bg-slate-50 border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-primary transition-all resize-none" 
               placeholder="Briefly describe the situation..." 
            />
         </div>
         <Button 
            onClick={() => onSubmit(type, description)}
            className="w-full h-16 bg-rose-500 text-white font-black italic text-lg uppercase tracking-tight rounded-2xl shadow-xl shadow-rose-500/20"
         >
            Submit Incident Report
         </Button>
      </div>
   );
};

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Icon size={20} />
       </div>
       <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none mb-1 italic">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 italic">{subtitle}</p>
       </div>
    </div>
  </div>
);
