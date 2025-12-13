import React from 'react';

export default function ProfilePage() {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>
            <div className="space-y-8">
               <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-300">Display Name</label>
                           <p className="text-sm text-gray-500 mt-1">
                              Your name as it appears to other users.
                           </p>
                        </div>
                        <div className="w-48">
                           <input
                              type="text"
                              defaultValue="John Doe"
                              className="linear-input w-full"
                           />
                        </div>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-300">Email</label>
                           <p className="text-sm text-gray-500 mt-1">
                              Your email address for notifications.
                           </p>
                        </div>
                        <div className="w-48">
                           <input
                              type="email"
                              defaultValue="john@example.com"
                              className="linear-input w-full"
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
