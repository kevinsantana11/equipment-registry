"use client"

export default function Printer ({ elId, width, height } : { elId: string, width: number, height: number }) {
    const print = () => {
        const el = document.getElementById(elId);
        const printWindow = window.open('', '', `width=${width},height=${height}`);
        printWindow?.document.write('<html><head><title>Print</title></head><body>');
        printWindow?.document.write(el?.outerHTML !== undefined ? el?.outerHTML : "nothing to print");
        printWindow?.document.write('</body></html>');
        printWindow?.document.close();
        printWindow?.focus();
        printWindow?.print();
        printWindow?.close();
    }

    return (

        <button type="button"
            className="rounded-md p-2 bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-400"
            onClick={print}
        >
            Print
        </button>
    )
}