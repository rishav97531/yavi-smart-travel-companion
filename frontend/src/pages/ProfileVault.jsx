import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  Lock, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileIcon,
  Download
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { storage, db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileVault = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Fetch user documents from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "user_vault"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setFiles(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDFs and Images are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = (file) => {
    if (!user) return;
    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, `vault/${user.uid}/${file.name}_${Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        toast.error('Upload failed: ' + error.message);
        setUploading(false);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save metadata to Firestore
        await addDoc(collection(db, "user_vault"), {
          fileName: file.name,
          fileUrl: downloadURL,
          storagePath: storageRef.fullPath,
          ownerId: user.uid,
          fileSize: file.size,
          fileType: file.type,
          createdAt: serverTimestamp()
        });

        toast.success(`${file.name} secured in vault`);
        setUploading(false);
        setProgress(0);
      }
    );
  };

  const handleDelete = async (fileDoc) => {
    if (!confirm(`Are you sure you want to delete ${fileDoc.fileName}?`)) return;

    try {
      // 1. Delete from Storage
      const storageRef = ref(storage, fileDoc.storagePath);
      await deleteObject(storageRef);

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "user_vault", fileDoc.id));

      toast.success('Document removed from vault');
    } catch (error) {
      toast.error('Delete failed: ' + error.message);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header with Title & Simple Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold font-heading flex items-center gap-3">
             <ShieldCheck className="text-yavi-teal" size={40} />
             Secure <span className="gradient-text">Vault</span>
          </h2>
          <p className="text-gray-400 mt-2">End-to-end encrypted personal document hub</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
           <div className="w-10 h-10 rounded-full bg-yavi-teal/20 flex items-center justify-center">
              <Lock className="text-yavi-teal" size={20} />
           </div>
           <div>
              <p className="text-xs text-gray-400 font-medium">Vault Status</p>
              <p className="text-sm font-bold text-green-400">ENCRYPTED & ACTIVE</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Upload & Management Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card flex flex-col items-center text-center p-8 border-2 border-dashed border-white/10 hover:border-yavi-teal hover:bg-yavi-teal/5 transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Upload className="text-yavi-teal" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Upload</h3>
            <p className="text-sm text-gray-500 mb-6">Drop your travel documents, IDs, or visas here.</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept=".pdf,image/*"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-yavi-blue to-yavi-teal py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yavi-teal/20 transition-all disabled:opacity-50"
            >
              {uploading ? 'Processing...' : 'Select File'}
            </button>

            {uploading && (
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-xs text-gray-400 px-1">
                   <span>Uploading...</span>
                   <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-yavi-teal shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="glass-card bg-red-400/5 border-red-400/20">
             <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertCircle size={20} />
                <h4 className="font-bold">Security Tip</h4>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">
                Always ensure your device is locked when not in use. Your documents are stored with bank-grade encryption in our secure servers.
             </p>
          </div>
        </div>

        {/* My Documents Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-yavi-blue" /> My Documents
             </h3>
             <span className="text-sm text-gray-500">{files.length} Secure Files</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="glass-card group relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${file.fileType.includes('pdf') ? 'bg-red-500/10 text-red-400' : 'bg-yavi-blue/10 text-yavi-blue'}`}>
                      <FileIcon size={24} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => handleDelete(file)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-bold truncate pr-8" title={file.fileName}>{file.fileName}</h4>
                  <p className="text-xs text-gray-500 mb-4">{formatSize(file.fileSize)} • {new Date(file.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                     <CheckCircle2 size={12} /> SECURE
                  </div>
                </motion.div>
              ))}

              {files.length === 0 && !uploading && (
                <div className="col-span-full py-20 flex flex-col items-center text-gray-500">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <p>Your vault is empty.</p>
                  <p className="text-sm">Secure your first document to see it here.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVault;
