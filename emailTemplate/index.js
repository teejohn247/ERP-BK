export const emailTemp = (data, subject) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
</head>
<body style="background-color: #f6f9fc; margin: 0 !important; padding: 0 !important;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <!-- Header -->
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px; background-color: #4285F4;">
                            <a href="https://silo-inc.com" target="_blank" style="display: inline-block;">
                                <img src="https://silo-inc.com/wp-content/uploads/2025/06/White-logo-no-background-Recovered-1-scaled.png" alt="Silo Logo" border="0" width="120" style="display: block; width: 120px; max-width: 120px; min-width: 120px;">
                            </a>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td align="center" valign="top" style="padding: 36px 24px; background-color: #ffffff;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 24px;">
                                        <img src="https://silo-inc.com/wp-content/uploads/2024/05/bell.png" alt="Notification Bell" width="64" style="display: block; width: 64px; max-width: 64px; min-width: 64px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-family: 'Lato', Helvetica, Arial, sans-serif;">
                                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color: #333333;">${subject}</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 24px 0 0 0; font-family: 'Lato', Helvetica, Arial, sans-serif;">
                                        <div style="margin: 0; font-size: 16px; line-height: 24px; color: #51545E;">${data}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" valign="top" style="padding: 24px; background-color: #f6f9fc; border-top: 1px solid #d4dadf;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666666;">
                                        <p style="margin: 0; margin-bottom: 0.5rem;">6416 Crawford Close, Southwest Edmonoton, Alberta T6W 3Y6 Canada</p>
                                        <p style="margin: 0;"><a href="mailto:hello@silo-inc.com" style="color: #4285F4; text-decoration: none;">hello@silo-inc.com</a> | <a href="tel:+2347018219200" style="color: #4285F4; text-decoration: none;">+234 (0) 701 017 1427</a></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 24px 0 0 0;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" style="padding: 0 8px;">
                                                <a href="https://www.instagram.com/silo-inc" target="_blank" style="display: inline-block;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 448 512">
                                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="#000"/>
                                                    </svg>
                                                </a>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                <a href="https://www.linkedin.com/company/silo-inc.com/" target="_blank" style="display: inline-block;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 448 512">
                                                    <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" fill="#000"/>
                                                    </svg>
                                                </a>
                                                </td>
                                                <td align="center" style="padding: 0 8px;">
                                                <a href="https://x.com/silo-inc" target="_blank" style="display: inline-block;">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 512 512">
                                                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="#000"/>
                                                    </svg>
                                                </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 24px 0 0 0; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                                        <p style="margin: 0;">Powered by <a href="https://silo-inc.com" target="_blank" style="color: #4285F4; text-decoration: none; font-weight: 700;">Silo Solutions</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}

module.exports = {
   emailTemp
}