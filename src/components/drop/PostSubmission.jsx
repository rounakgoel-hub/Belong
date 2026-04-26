export default function PostSubmission({ pin, isFirst, onWaitlist, onBack, toast }) {
  const hasArt = !!pin?.album_art_url

  async function handleShare() {
    const title = 'Belong.'
    const text = "I've contributed to Chennai's first crowd-sourced music socials — follow the community and reserve your spot for the show @belong.chennai"
    const url = 'https://www.instagram.com/belong.chennai/'
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    }
  }

  async function handleInvite() {
    const title = 'Belong.'
    const text = "I've contributed to Chennai's first crowd-sourced music socials — I'd love for you to share a song too at the living song map:"
    const url = 'https://belong-seven.vercel.app/'
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    }
  }

  return (
    <div className="px-4 pb-10 pt-4 flex flex-col gap-5">

      {/* ── Postcard ───────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: 18,
          background: 'var(--surface)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Top half — art / gradient with overlay */}
        <div className="relative" style={{ height: 160 }}>
          {hasArt ? (
            <>
              <img
                src={pin.album_art_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'blur(6px) brightness(0.55)', transform: 'scale(1.08)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)' }}
              />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #2A1F0A 0%, #1A1614 100%)' }}
            />
          )}

          {/* Song name + artist over the art */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            <p
              className="font-extrabold leading-tight"
              style={{ fontSize: 22, color: '#FFF9EF', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}
            >
              {pin.song_name}
            </p>
            {pin.artist && (
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,249,239,0.65)' }}>
                {pin.artist}
              </p>
            )}
          </div>
        </div>

        {/* Bottom half — memory + branding */}
        <div className="px-5 pt-4 pb-4" style={{ background: 'var(--surface)' }}>
          {pin.memory && (
            <div
              className="mb-4 pl-4 text-sm italic leading-relaxed"
              style={{
                color: 'var(--muted)',
                borderLeft: '2px solid var(--red)',
              }}
            >
              "{pin.memory}"
            </div>
          )}

          {/* Bottom strip */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--muted)', opacity: 0.55 }}>
              Belong. · Edition 1 · Chennai
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)', opacity: 0.55 }}>
              @belong.chennai
            </span>
          </div>
        </div>
      </div>

      {/* ── Headline ───────────────────────────────────────── */}
      <div className="text-center px-2">
        <p className="font-bold text-sm leading-snug mb-1" style={{ color: 'var(--text)' }}>
          Someone else forgot this song too. You just reminded them.
        </p>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Now let more of the city in.
        </p>
      </div>

      {/* ── CTAs ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ background: 'var(--red)', color: 'var(--text)' }}
        >
          Share the resurrection
        </button>

        <button
          onClick={handleInvite}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
        >
          Invite someone whose taste you trust
        </button>

        <button
          onClick={onWaitlist}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent' }}
        >
          Be in the room when this plays live
        </button>
      </div>

      <button
        onClick={onBack}
        className="text-sm underline underline-offset-4 text-center"
        style={{ color: 'var(--muted)' }}
      >
        ← Back to the map
      </button>
    </div>
  )
}
