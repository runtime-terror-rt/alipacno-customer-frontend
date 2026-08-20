import React from "react";

interface DeleteAccountSectionProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  deletePassword: string;
  setDeletePassword: (password: string) => void;
  isDeletingAccount: boolean;
  handleDeleteAccount: () => void;
}

export default function DeleteAccountSection({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  deletePassword,
  setDeletePassword,
  isDeletingAccount,
  handleDeleteAccount,
}: DeleteAccountSectionProps) {
  return (
    <>
      {/* Account Management */}
      <div className="mt-8 mb-16">
        <h3 className="text-[17px] font-bold text-white mb-1">Account Management</h3>
        <p className="text-[13px] text-zinc-400 mb-5">You can delete your account and personal data associated with it</p>
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          className="border-[1.5px] border-[#eb4852] text-[#eb4852] hover:bg-[#eb4852]/10 text-[14px] font-bold px-7 py-2.5 rounded-full transition-colors cursor-pointer"
        >
          Delete My Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => !isDeletingAccount && setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1c] border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-[420px] shadow-2xl z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#eb4852]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eb4852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </div>
            </div>
            <h3 className="text-[20px] font-bold text-white text-center mb-2">Delete Account</h3>
            <p className="text-[14px] text-zinc-400 text-center mb-6">
              This action is permanent and cannot be undone. Please enter your password to confirm.
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && deletePassword && !isDeletingAccount) {
                    handleDeleteAccount();
                  }
                }}
                className="w-full bg-[#252527] rounded-xl px-4 py-3.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-[#eb4852]/50 transition-all shadow-inner border border-white/5"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-[14px] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || !deletePassword}
                className="flex-1 bg-[#eb4852] hover:bg-[#ff555e] text-white font-bold py-3 rounded-xl transition-colors text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingAccount ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
