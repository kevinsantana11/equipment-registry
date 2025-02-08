import QRCodeScanner from "@/components/QRCodeScanner";

export default async function Page() {
    return (
        <div className="grow">
            <QRCodeScanner />
        </div>
    )
}