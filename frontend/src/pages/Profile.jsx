import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Phone, MapPin, Tag, Save, Camera, 
    MessageSquare, Briefcase, Globe, Wallet, Coffee, 
    Compass, Heart, History, Settings, Bell, LogOut, 
    ChevronRight, Sparkles, TrendingUp
} from 'lucide-react';
import { fetchWithAuth } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab ] = useState('preferences');
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        phoneNumber: '',
        preferences: [],
        destinationsType: '',
        budgetType: '',
        travelStyle: '',
        foodPreference: '',
        favoriteDestinations: [],
        travelHistory: [],
        profilePicture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetchWithAuth('/api/users/profile');
            const data = await response.json();
            if (response.ok) {
                setProfile(data);
            } else {
                toast.error('Failed to load profile');
            }
        } catch (error) {
            console.error('Fetch Profile Error:', error);
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const response = await fetchWithAuth('/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

        if (response.ok) {
            toast.success('Settings synchronized! ✨');
        } else {
            const errorData = await response.json().catch(() => ({}));
            toast.error(errorData.message || 'Failed to sync profile. Please try again.');
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        toast.error('Sync failed: Network error.');
    } finally {
        setSaving(false);
    }
};

    const generateSmartSummary = () => {
        const { budgetType, travelStyle, foodPreference, destinationsType } = profile;
        if (!budgetType && !travelStyle) return "Complete your profile to unlock smart travel insights!";
        
        let summary = `You are a ${budgetType?.toLowerCase() || 'moderate'}-budget ${travelStyle?.toLowerCase() || 'curious'} explorer`;
        if (destinationsType) summary += ` with a focus on ${destinationsType} destinations.`;
        if (foodPreference) summary += ` You prefer ${foodPreference} meals while traveling.`;
        
        return summary;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="w-12 h-12 border-4 border-yavi-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                    
                    {/* Left Column: Brief Profile & Navigation */}
                    <div className="flex flex-col gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-8 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yavi-blue/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                            
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl mx-auto">
                                    {profile.profilePicture ? (
                                        <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-yavi-blue/20 to-yavi-purple/20 flex items-center justify-center text-3xl text-yavi-teal font-black">
                                            {profile.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-1 right-1 p-2.5 bg-yavi-blue rounded-full text-white shadow-lg shadow-yavi-blue/20 hover:scale-110 active:scale-95 transition-all outline-none">
                                    <Camera size={16} />
                                </button>
                            </div>
                            
                            <h2 className="text-2xl font-heading font-black text-white mb-1">{profile.name}</h2>
                            <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/5">{profile.email}</p>
                            
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'preferences', label: 'Preferences', icon: <Tag size={18} /> },
                                    { id: 'saved', label: 'Saved Travels', icon: <Heart size={18} /> },
                                    { id: 'history', label: 'Trip History', icon: <History size={18} /> },
                                    { id: 'settings', label: 'Account Settings', icon: <Settings size={18} /> },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold ${
                                            activeTab === tab.id 
                                            ? 'bg-yavi-blue text-white shadow-xl shadow-yavi-blue/20' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {tab.icon}
                                            <span className="text-sm">{tab.label}</span>
                                        </div>
                                        <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-20'} />
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={logout}
                                className="mt-6 w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm"
                            >
                                <LogOut size={18} /> Logout Session
                            </button>
                        </motion.div>

                        {/* Smart Summary Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 border-yavi-teal/20 shadow-lg shadow-yavi-teal/5"
                        >
                            <div className="flex items-center gap-3 text-yavi-teal font-black text-xs uppercase tracking-widest mb-4">
                                <Sparkles size={16} /> 
                                Smart Insight
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed font-medium italic">
                                "{generateSmartSummary()}"
                            </p>
                            <div className="mt-6 flex items-center justify-between py-3 border-t border-white/5">
                                <span className="text-xs text-gray-500 font-bold uppercase">Loyalty Status</span>
                                <span className="text-xs text-yavi-blue font-bold">SILVER EXPLORER</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Dynamic Content Area */}
                    <div className="flex flex-col gap-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'preferences' && (
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Personal Info Card */}
                                    <div className="glass-card p-10">
                                        <h3 className="text-xl font-heading font-black text-white mb-8 flex items-center gap-3">
                                            <User className="text-yavi-blue" />
                                            Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <input 
                                                        type="text" 
                                                        value={profile.name}
                                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-blue transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <input 
                                                        type="tel" 
                                                        value={profile.phoneNumber}
                                                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-purple transition-all"
                                                        placeholder="+1 234 567 890"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Travel Intelligence Card */}
                                    <div className="glass-card p-10">
                                        <h3 className="text-xl font-heading font-black text-white mb-8 flex items-center gap-3">
                                            <TrendingUp className="text-yavi-teal" />
                                            Travel Intelligence
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Best Regions</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <select 
                                                        value={profile.destinationsType}
                                                        onChange={(e) => setProfile({ ...profile, destinationsType: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-teal transition-all appearance-none"
                                                    >
                                                        <option value="" className="bg-gray-900">Select Region...</option>
                                                        <option value="India" className="bg-gray-900">Explore India 🇮🇳</option>
                                                        <option value="International" className="bg-gray-900">International Trips 🌍</option>
                                                        <option value="Both" className="bg-gray-900">Both Everywhere 🌐</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Budget Logic</label>
                                                <div className="relative">
                                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <select 
                                                        value={profile.budgetType}
                                                        onChange={(e) => setProfile({ ...profile, budgetType: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-teal transition-all appearance-none"
                                                    >
                                                        <option value="" className="bg-gray-900">Select Budget...</option>
                                                        <option value="Low" className="bg-gray-900">Low - Budget Friendly 🏷️</option>
                                                        <option value="Medium" className="bg-gray-900">Medium - Balanced ⚖️</option>
                                                        <option value="Luxury" className="bg-gray-900">Luxury - Premium 💎</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Primary Style</label>
                                                <div className="relative">
                                                    <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <select 
                                                        value={profile.travelStyle}
                                                        onChange={(e) => setProfile({ ...profile, travelStyle: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-teal transition-all appearance-none"
                                                    >
                                                        <option value="" className="bg-gray-900">Select Style...</option>
                                                        <option value="Adventure" className="bg-gray-900">Adventure 🧗</option>
                                                        <option value="Relaxation" className="bg-gray-900">Relaxation 🌴</option>
                                                        <option value="Cultural" className="bg-gray-900">Cultural 🏛️</option>
                                                        <option value="Family" className="bg-gray-900">Family 👨‍👩‍👧</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Food Preference</label>
                                                <div className="relative">
                                                    <Coffee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                                    <select 
                                                        value={profile.foodPreference}
                                                        onChange={(e) => setProfile({ ...profile, foodPreference: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yavi-teal transition-all appearance-none"
                                                    >
                                                        <option value="" className="bg-gray-900">Select Food...</option>
                                                        <option value="Veg" className="bg-gray-900">Pure Veg 🥗</option>
                                                        <option value="Non-Veg" className="bg-gray-900">Non-Veg 🍗</option>
                                                        <option value="Both" className="bg-gray-900">Everything 🍱</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-12 flex justify-end">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleUpdate}
                                                disabled={saving}
                                                className="bg-gradient-to-r from-yavi-blue to-yavi-purple px-10 py-5 rounded-3xl text-white font-black text-sm shadow-xl shadow-yavi-blue/20 flex items-center gap-3 disabled:opacity-50"
                                            >
                                                {saving ? 'Syncing...' : 'Update Explorer Settings'} <Save size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'saved' && (
                                <motion.div
                                    key="saved"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="glass-card p-6 flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-yavi-blue">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold">Dream Destination #{i}</h4>
                                                <p className="text-gray-500 text-xs mb-3 uppercase font-bold tracking-widest">Saved Itinerary</p>
                                                <button className="text-yavi-teal text-xs font-bold hover:underline flex items-center gap-1">
                                                    View Details <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-10 divide-y divide-white/5"
                                >
                                    <div className="py-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Smart Notifications</h4>
                                            <p className="text-gray-500 text-sm">Real-time alerts for price drops and safety.</p>
                                        </div>
                                        <div className="w-14 h-8 rounded-full bg-yavi-blue/20 p-1 flex items-center justify-end">
                                            <div className="w-6 h-6 rounded-full bg-yavi-blue shadow-lg"></div>
                                        </div>
                                    </div>
                                    <div className="py-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Account Security</h4>
                                            <p className="text-gray-500 text-sm">Update your credentials and auth methods.</p>
                                        </div>
                                        <button className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-all">
                                            Manage
                                        </button>
                                    </div>
                                    <div className="py-6 flex items-center justify-between group cursor-pointer">
                                        <div>
                                            <h4 className="text-white font-bold mb-1 group-hover:text-red-400 transition-colors">Deactivate Explorer</h4>
                                            <p className="text-gray-500 text-sm">Permanently remove your data from the grid.</p>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-700 group-hover:text-red-400 transition-colors" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
