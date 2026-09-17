import logo from '../assets/logitranslogo.png';
import firma from '../assets/firma_vanesa.png';
import { uploadCertificatePdf } from './completions';

// Convierte una imagen importada a base64 para poder incrustarla con html2canvas
function getBase64Image(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imagePath;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
  });
}

// Mismo diseño de certificado usado en el proyecto "web_formaciones" original,
// adaptado para incluir el Cargo del participante.
function createCertificateHTML(data) {
  return `
    <div style="width:1122px;height:794px;background-color:white;position:relative;font-family:Arial, sans-serif;">
      <div style="position:absolute;top:30px;left:30px;opacity:0.05;pointer-events:none;">
        <img src="${data.logoUrl}" style="width:384px;height:384px;object-fit:contain;filter:grayscale(100%);" alt="Watermark" />
      </div>
      <div style="position:absolute;bottom:30px;right:30px;opacity:0.05;pointer-events:none;">
        <img src="${data.logoUrl}" style="width:384px;height:384px;object-fit:contain;filter:grayscale(100%);" alt="Watermark" />
      </div>
      <div style="position:absolute;top:0;left:0;width:375px;height:100%;background-color:#071D49;opacity:0.03;"></div>

      <div style="position:relative;height:100%;display:flex;padding:80px;">
        <div style="width:33.333%;display:flex;flex-direction:column;justify-content:space-between;padding-right:48px;border-right:2px solid #e5e7eb;">
          <div>
            <img src="${data.logoUrl}" style="width:80px;height:96px;border-radius:8px;margin-bottom:16px;padding:8px;" />
            <h1 style="font-size:20px;font-weight:bold;color:#111827;margin:0 0 8px 0;">LOGÍSTICA DE</h1>
            <h1 style="font-size:20px;font-weight:bold;color:#111827;margin:0 0 16px 0;">TRANSPORTE S.A</h1>
            <div style="width:48px;height:4px;background-color:#C4D600;"></div>
          </div>

          <div>
            <div style="margin-bottom:32px;">
              <p style="font-size:11px;color:#787e89;text-transform:uppercase;margin-bottom:8px;">Fecha de emisión</p>
              <p style="font-size:14px;font-weight:bold;color:#071D49;margin:0;">${data.completionDate}</p>
            </div>
            <div style="height:70px;margin-bottom:8px;">
              <img src="${data.firma}" style="width:100%;height:100%;object-fit:contain;" />
            </div>
            <div style="width:100%;height:2px;background-color:#071D49;margin-bottom:8px;"></div>
            <p style="font-size:11px;font-weight:bold;color:#111827;margin:0 0 4px 0;">${data.instructorName}</p>
            <p style="font-size:11px;color:#6b7280;margin:0;">${data.instructorTitle}</p>
          </div>
        </div>

        <div style="flex:1;padding-left:48px;display:flex;flex-direction:column;justify-content:center;">
          <div>
            <div style="margin-bottom:32px;">
              <p style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#9ca3af;margin-bottom:16px;">CERTIFICADO OFICIAL</p>
              <p style="font-size:16px;color:#4b5563;margin-bottom:16px;">Se certifica que</p>
              <h2 style="font-size:52px;font-weight:300;color:#111827;margin:0 0 10px 0;line-height:1.1;">${data.studentName}</h2>
              <p style="font-size:14px;color:#6b7280;margin:0 0 4px 0;">C.C ${data.studentDocument}</p>
              <p style="font-size:14px;color:#6b7280;margin:0;">${data.studentPosition}</p>
            </div>

            <div style="position:relative;margin-bottom:32px;">
              <div style="position:absolute;left:-16px;top:0;bottom:0;width:4px;background-color:#C4D600;"></div>
              <div style="padding-left:24px;">
                <p style="font-size:14px;color:#4b5563;margin-bottom:8px;">Ha completado satisfactoriamente el</p>
                <p style="font-size:18px;color:#374151;margin-bottom:8px;font-weight:600;">CURSO DE</p>
                <h3 style="font-size:44px;font-weight:bold;color:#071D49;margin:0 0 12px 0;">${data.courseName}</h3>
                <p style="font-size:14px;color:#6b7280;margin:0 0 16px 0;">${data.duration}</p>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:12px;padding-top:24px;border-top:1px solid #e5e7eb;">
              <div style="width:32px;height:32px;border-radius:50%;background-color:#C4D600;display:flex;align-items:center;justify-content:center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
                  <path d="M13.485 1.929a.75.75 0 0 1 0 1.06L6.03 10.445l-3.515-3.51a.75.75 0 0 1 1.06-1.06l2.455 2.454 6.394-6.394a.75.75 0 0 1 1.06 0z"/>
                </svg>
              </div>
              <div>
                <p style="font-size:11px;color:#6b7280;margin:0 0 2px 0;">${data.verificationUrl}</p>
                <p style="font-size:10px;color:#9ca3af;margin:0;">${data.verificationCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Genera y descarga el PDF del certificado con los datos del participante
 * (nombre, cédula y cargo) diligenciados antes de iniciar el curso.
 */
export async function downloadCertificate({ userData, courseId, score }) {
  const html2canvas = (await import('html2canvas')).default;
  const jsPDF = (await import('jspdf')).default;

  const [logoBase64, firmaBase64] = await Promise.all([getBase64Image(logo), getBase64Image(firma)]);

  const now = new Date();
  const certificateData = {
    studentName: userData.nombre.toUpperCase(),
    studentDocument: userData.cedula,
    studentPosition: userData.cargo,
    courseName: 'CAPACITACIÓN SARLAFT 2026',
    completionDate: now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    duration: '7 diapositivas + quiz · 15 minutos',
    instructorName: 'Yulieth Vanesa Cely Lopez',
    instructorTitle: 'PROFESIONAL DE CUMPLIMIENTO',
    firma: firmaBase64,
    logoUrl: logoBase64,
    verificationUrl: 'https://logitrans-desarrollos.github.io/formaciones-2027/',
    verificationCode: `Código: ${courseId}-${now.getTime()} · Puntaje: ${score}`,
  };

  const html = createCertificateHTML(certificateData);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  Object.assign(tempDiv.style, {
    position: 'fixed', top: '0', left: '0', width: '1122px', height: '794px', opacity: '0', zIndex: '-1',
  });
  document.body.appendChild(tempDiv);

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const element = tempDiv.firstElementChild;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`certificado-sarlaft-2026-${userData.cedula}.pdf`);

    // Además de descargarlo en el navegador del participante, se sube una
    // copia al repositorio (en segundo plano) para que quede un archivo
    // centralizado con todos los certificados emitidos. Si falla (sin
    // internet, token no configurado, etc.) no afecta la descarga de arriba.
    try {
      const base64Pdf = pdf.output('datauristring').split(',')[1];
      uploadCertificatePdf({ nombre: userData.nombre, base64Pdf });
    } catch (err) {
      console.error('[certificate] No se pudo preparar la copia para subir:', err);
    }
  } finally {
    document.body.removeChild(tempDiv);
  }
}
