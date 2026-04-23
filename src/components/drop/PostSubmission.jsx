import { useNavigate } from 'react-router-dom'
import ShareCard from '../ui/ShareCard'

export default function PostSubmission({ pin, isFirst, onWaitlist, onBack }) {
  const navigate = useNavigate()

  async function handleShare() {
    const text = `"${pin.song_name}" — Chennai is bringing dead songs back.\n\nAdd yours → belong.in`
    if (navigator.share) {
      await navigator.share({ title: 'Belong. Dead Song Resurrection', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  function handleInvite() {
    const text = `The map needs their forgotten songs too — belong.in`
    if (navigator.share) navigator.share({ title: 'Belong.', text })
    else navigator.clipboard.writeText(text)
  }

  return (
    <div className="px-5 pb-10 pt-4 flex flex-col items-center gap-5">
      {/* Beat 2 — share card */}
      <div className="w-full">
        <ShareCard pin={pin} />
      </div>

      {isFirst && (
        <p className="text-sm text-center font-medium" style={{ color: '#C9A84C' }}>
          You started something. Chennai will catch up.
        </p>
      )}

      {/* Beat 3 — CTAs */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl font-bold text-cream text-sm"
          style={{ background: '#B52900' }}
        >
          <div className="font-bold">Share the resurrection</div>
          <div className="text-xs font-normal opacity-75 mt-0.5">Chennai is bringing dead songs back — add yours</div>
        </button>

        <button
          onClick={handleInvite}
          className="w-full py-4 rounded-2xl font-bold text-cream text-sm"
          style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.1)' }}
        >
          <div className="font-bold">Invite someone whose taste you trust</div>
          <div className="text-xs font-normal opacity-75 mt-0.5">The map needs their forgotten songs too</div>
        </button>

        <button
          onClick={onWaitlist}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ background: '#2E2825', border: '1px solid #C9A84C', color: '#C9A84C' }}
        >
          <div className="font-bold">Be in the room when this plays live</div>
          <div className="text-xs font-normal opacity-75 mt-0.5">Save your spot — no ticket yet, just say you want to be there</div>
        </button>
      </div>

      <button
        onClick={onBack}
        className="text-muted text-sm underline underline-offset-4 mt-1"
      >
        ← Back to the map
      </button>
    </div>
  )
}
