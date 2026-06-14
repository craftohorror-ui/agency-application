export function getPreviewLoadingHTML(fileName: string, folder: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Opening ${fileName}...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a, #111827, #1e293b);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      animation: fadeIn 0.4s ease-out;
      overflow: hidden;
      transition: opacity 0.4s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .spinner-container {
      position: relative;
      width: 64px;
      height: 64px;
      margin-bottom: 32px;
    }
    .spinner {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      position: relative;
      z-index: 2;
    }
    .pulse {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      background: rgba(59, 130, 246, 0.4);
      border-radius: 50%;
      filter: blur(8px);
      animation: pulse 2s ease-in-out infinite;
      z-index: 1;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
    }
    p {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0 0 32px 0;
    }
    .metadata {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 16px 24px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      text-align: center;
      max-width: 400px;
      width: 80%;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .metadata-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 0.875rem;
    }
    .metadata-row:last-child {
      margin-bottom: 0;
    }
    .metadata-label {
      color: #94a3b8;
      font-weight: 500;
    }
    .metadata-value {
      font-weight: 500;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-left: 24px;
      max-width: 200px;
    }
  </style>
</head>
<body>
  <div class="spinner-container">
    <div class="pulse"></div>
    <div class="spinner"></div>
  </div>
  <h1>Preparing document preview...</h1>
  <p>Securely loading your file</p>
  <div class="metadata">
    <div class="metadata-row">
      <span class="metadata-label">File Name</span>
      <span class="metadata-value" title="${fileName}">${fileName}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Folder</span>
      <span class="metadata-value" style="text-transform: capitalize;">${folder}</span>
    </div>
  </div>
  <script>
    window.redirectTo = function(url) {
      document.body.style.opacity = '0';
      setTimeout(() => {
        window.location.replace(url);
      }, 400); 
    };
  </script>
</body>
</html>`
}
