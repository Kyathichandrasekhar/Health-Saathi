import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { Camera, CameraOff } from 'lucide-react'
import { useState } from 'react'

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)

  const toggleScanner = () => {
    setIsScanning(!isScanning)
  }

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const text = detectedCodes[0].rawValue
      if (text) {
        onScan(text)
        setIsScanning(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full rounded-2xl overflow-hidden bg-dark-900/50 border border-white/10 aspect-square sm:aspect-video flex items-center justify-center min-h-[300px]">
        {isScanning ? (
          <Scanner
            onScan={handleScan}
            onError={(error) => {
              console.error('Scanner error:', error)
              onError?.(String(error))
            }}
            scanDelay={500}
            styles={{
              container: {
                width: '100%',
                height: '100%',
              },
              video: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              },
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-dark-500 gap-3">
            <Camera className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">Scanner is ready</p>
          </div>
        )}

        {/* Visual Overlay for User Guidance */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[70%] aspect-square border-2 border-primary-500/50 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
            
            {/* Animated Scan Line */}
            <div className="absolute top-1/4 left-[15%] right-[15%] h-[2px] bg-primary-500/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan-line" />
          </div>
        )}
      </div>

      <button
        onClick={toggleScanner}
        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg ${
          isScanning
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'btn-gradient hover:scale-[1.02] active:scale-95'
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

      <p className="text-xs text-dark-500 text-center px-4">
        {isScanning 
          ? 'Position the QR code within the frame to scan' 
          : 'Allow camera access to begin scanning patient tickets'}
      </p>
    </div>
  )
}
