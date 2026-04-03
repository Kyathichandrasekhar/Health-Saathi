import { QRCodeSVG } from 'qrcode.react'

interface QRGeneratorProps {
  data: string
  size?: number
  title?: string
}

export default function QRGenerator({ data, size = 200, title }: QRGeneratorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {title && (
        <h3 className="text-lg font-bold text-white">{title}</h3>
      )}
      <div className="p-6 bg-white rounded-2xl shadow-glass-lg">
        <QRCodeSVG
          value={data}
          size={size}
          bgColor="#ffffff"
          fgColor="#1e1b4b"
          level="H"
          includeMargin={false}
        />
      </div>
      <p className="text-xs text-dark-400 text-center max-w-[200px]">
        Show this QR code at the reception desk for check-in
      </p>
    </div>
  )
}
