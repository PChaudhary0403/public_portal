// Receipt Generator Utility - Generates HTML receipt and triggers download as PDF

interface ComplaintReceiptData {
    ticketNumber: string
    title: string
    description: string
    department: string
    priority: string
    location: string
    address: string
    pincode?: string
    submittedAt: Date
    citizenName?: string
    citizenEmail?: string
}

export function generateReceiptHTML(data: ComplaintReceiptData): string {
    const submittedDate = new Date(data.submittedAt)
    const formattedDate = submittedDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
    const formattedTime = submittedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Complaint Receipt - ${data.ticketNumber}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: #f8fafc;
            padding: 20px;
        }
        .receipt {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 28px;
        }
        .ticket-box {
            background: #eef2ff;
            margin: 20px;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 2px dashed #6366f1;
        }
        .ticket-label {
            font-size: 12px;
            color: #6366f1;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .ticket-number {
            font-size: 28px;
            font-weight: 700;
            color: #4f46e5;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }
        .content {
            padding: 20px 30px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 1px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .section-value {
            font-size: 15px;
            color: #1e293b;
        }
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .status-badge {
            display: inline-block;
            background: #dbeafe;
            color: #1d4ed8;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .priority-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .priority-LOW { background: #f1f5f9; color: #64748b; }
        .priority-MEDIUM { background: #dbeafe; color: #1d4ed8; }
        .priority-HIGH { background: #fef3c7; color: #b45309; }
        .priority-CRITICAL { background: #fee2e2; color: #dc2626; }
        .footer {
            background: #f8fafc;
            padding: 20px 30px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
        }
        .footer p {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 5px;
        }
        .footer .track-url {
            color: #4f46e5;
            font-weight: 600;
        }
        .qr-section {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .qr-placeholder {
            width: 100px;
            height: 100px;
            background: #f1f5f9;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-size: 40px;
        }
        .timestamp {
            text-align: center;
            padding: 15px;
            background: #f1f5f9;
            font-size: 12px;
            color: #64748b;
        }
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 20px 0;
        }
        @media print {
            body { background: white; padding: 0; }
            .receipt { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo">🛡️</div>
            <h1>JanSeva Portal</h1>
            <p>Public Grievance Redressal System</p>
        </div>
        
        <div class="ticket-box">
            <div class="ticket-label">Your Ticket Number</div>
            <div class="ticket-number">${data.ticketNumber}</div>
        </div>
        
        <div class="timestamp">
            Submitted on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">Complaint Title</div>
                <div class="section-value">${data.title}</div>
            </div>
            
            <div class="section">
                <div class="section-title">Description</div>
                <div class="section-value">${data.description}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="grid">
                <div class="section">
                    <div class="section-title">Department</div>
                    <div class="section-value">${data.department}</div>
                </div>
                <div class="section">
                    <div class="section-title">Priority</div>
                    <div class="section-value">
                        <span class="priority-badge priority-${data.priority}">${data.priority}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-title">Location</div>
                <div class="section-value">${data.location}</div>
            </div>
            
            ${data.address ? `
            <div class="section">
                <div class="section-title">Address</div>
                <div class="section-value">${data.address}${data.pincode ? ` - ${data.pincode}` : ''}</div>
            </div>
            ` : ''}
            
            <div class="divider"></div>
            
            <div class="section">
                <div class="section-title">Current Status</div>
                <div class="section-value">
                    <span class="status-badge">SUBMITTED</span>
                </div>
            </div>
            
            ${data.citizenName ? `
            <div class="grid">
                <div class="section">
                    <div class="section-title">Filed By</div>
                    <div class="section-value">${data.citizenName}</div>
                </div>
                ${data.citizenEmail ? `
                <div class="section">
                    <div class="section-title">Email</div>
                    <div class="section-value">${data.citizenEmail}</div>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        
        <div class="qr-section">
            <div class="qr-placeholder">📱</div>
            <p style="margin-top: 10px; font-size: 12px; color: #64748b;">
                Scan to track your complaint
            </p>
        </div>
        
        <div class="footer">
            <p>Track your complaint at:</p>
            <p class="track-url">${typeof window !== 'undefined' ? window.location.origin : ''}/track?ticket=${data.ticketNumber}</p>
            <p style="margin-top: 15px;">
                Keep this receipt safe for future reference.
            </p>
        </div>
    </div>
</body>
</html>
`
}

export function downloadReceipt(data: ComplaintReceiptData): void {
    const html = generateReceiptHTML(data)

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
        alert('Please allow pop-ups to download the receipt')
        return
    }

    printWindow.document.write(html)
    printWindow.document.close()

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.print()
        }, 250)
    }
}

export function downloadReceiptAsHTML(data: ComplaintReceiptData): void {
    const html = generateReceiptHTML(data)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `complaint-receipt-${data.ticketNumber}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}
