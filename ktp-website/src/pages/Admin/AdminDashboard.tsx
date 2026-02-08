import { useContext, useState } from "react";
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const dataContext = useContext(DataBaseDataContext);
  const userData = dataContext?.userData || [];
  
  // State for the file currently being uploaded
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleImageUpload = async (brotherId: string, file: File) => {
    if (!file) return;
    setUploadingId(brotherId);

    const storage = getStorage();
    const db = getFirestore();

    // 1. Create a reference to 'brothers/brotherID.jpg' in storage
    const storageRef = ref(storage, `brothers/${brotherId}-${file.name}`);

    try {
      // 2. Upload the file
      await uploadBytes(storageRef, file);

      // 3. Get the public URL
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Update the Database Document
      const brotherDocRef = doc(db, "users", brotherId); // Assuming collection is 'users'
      await updateDoc(brotherDocRef, {
        WebsitePhotoURL: downloadURL
      });

      alert("Photo updated successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard: Manage Brothers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.map((brother) => (
          <div key={brother.id} className="border p-4 rounded shadow flex items-center space-x-4">
            
            {/* Current Image Preview */}
            <img 
              src={brother.WebsitePhotoURL || "https://via.placeholder.com/150"} 
              alt="Current" 
              className="w-20 h-20 object-cover rounded" 
            />

            <div className="flex-1">
              <h3 className="font-bold">{brother.FirstName} {brother.LastName}</h3>
              <p className="text-sm text-gray-500">{brother.Eboard_Position || "Active Member"}</p>
              
              {/* File Input */}
              <div className="mt-2">
                <input 
                  type="file" 
                  accept="image/*"
                  disabled={uploadingId === brother.id}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(brother.id, e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              
              {uploadingId === brother.id && <p className="text-blue-600 text-sm mt-1">Uploading...</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}