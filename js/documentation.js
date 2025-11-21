// 2025 © Harun Jaganjac

document.getElementById("downloadPdf").onclick = async () => {
    const { jsPDF } = window.jspdf;

    const element = document.querySelector(".container");

    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
        scale: 1.7,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save("Student-Fun-Zone-Dokumentacija.pdf");
};
