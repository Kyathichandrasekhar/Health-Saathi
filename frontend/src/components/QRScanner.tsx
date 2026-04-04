import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Camera, CameraOff } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanLockRef = useRef(false)
  const lastScanRef = useRef<{ value: string; ts: number }>({ value: '', ts: 0 })
  const containerId = 'qr-reader'

  const ensureScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(containerId, {
        verbose: false,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      })
    }
    return scannerRef.current
  }

  const startScanning = async () => {
    if (isBusy || isScanning) {
      return
    }

    try {
      setIsBusy(true)
      const scanner = ensureScanner()

      const cameras = await Html5Qrcode.getCameras()
      const preferred =
        cameras.find((camera) => /back|rear|environment/i.test(camera.label)) || cameras[0]

      if (!preferred) {
        throw new Error('No camera found')
      }

      await scanner.start(
        preferred.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          disableFlip: false,
        },
        (decodedText) => {
          if (scanLockRef.current) {
            return
          }

          const now = Date.now()
          const last = lastScanRef.current
          if (last.value === decodedText && now - last.ts < 2000) {
            return
          }

          scanLockRef.current = true
          lastScanRef.current = { value: decodedText, ts: now }
          console.log('QR scanned:', decodedText)
          onScan(decodedText)
          stopScanning()
        },
        () => {} // ignore error frames
      )
      setIsScanning(true)
    } catch (err) {
      onError?.(`Camera error: ${err}`)
    } finally {
      setIsBusy(false)
    }
  }

  const stopScanning = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop()
      }
      await scannerRef.current?.clear()
    } catch {
      // Ignore stop/clear race conditions.
    }

    setIsScanning(false)
    scanLockRef.current = false
  }

  const handleScanFromImage = async (file: File) => {
    if (!file || isBusy) {
      return
    }

    try {
      setIsBusy(true)
      const scanner = ensureScanner()
      const decodedText = await scanner.scanFile(file, true)
      onScan(decodedText)
    } catch (err) {
      onError?.(`Image scan error: ${err}`)
    } finally {
      setIsBusy(false)
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full rounded-2xl overflow-hidden bg-dark-800 border border-white/10">
        <div
          id={containerId}
          className="w-full h-[300px] md:h-[420px]"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[72%] max-w-[360px] aspect-square border-2 border-white/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      <button
        onClick={isScanning ? stopScanning : startScanning}
        disabled={isBusy}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isScanning
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'btn-gradient'
        } disabled:opacity-60`}
      >
        {isScanning ? (
          <>
            <CameraOff className="w-5 h-5" /> Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" /> Start Scanner
          </>
        )}
      </button>

      <label className="text-xs text-dark-400 cursor-pointer hover:text-dark-300 transition-colors">
        Scan from image
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              handleScanFromImage(file)
            }
            event.currentTarget.value = ''
          }}
        />
      </label>
    </div>
  )
}
