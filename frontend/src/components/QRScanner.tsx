import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff } from 'lucide-react'

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerId = 'qr-reader'

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode(containerId)
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText)
          stopScanning()
        },
        () => {} // ignore error frames
      )
      setIsScanning(true)
    } catch (err) {
      onError?.(`Camera error: ${err}`)
    }
  }

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop()
      scannerRef.current.clear()
    }
    setIsScanning(false)
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        id={containerId}
        className="w-full max-w-sm h-64 rounded-2xl overflow-hidden bg-dark-800 border border-white/10"
      />

      <button
        onClick={isScanning ? stopScanning : startScanning}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isScanning
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'btn-gradient'
        }`}
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
    </div>
  )
}
