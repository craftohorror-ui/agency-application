export default function PublicProposalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      <h2 className="mt-6 text-lg font-medium text-slate-700">Loading Proposal...</h2>
    </div>
  )
}
