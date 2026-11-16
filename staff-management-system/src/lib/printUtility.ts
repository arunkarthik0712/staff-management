export const printHTMLContent = (htmlContent: string) => {
  try {
    // Create a hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    if (!win) {
      console.error("Could not get iframe contentWindow");
      return;
    }

    const doc = win.document;
    // Write the HTML content to the iframe
    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Prevent right-click and certain keyboard shortcuts in the print window
    win.addEventListener("contextmenu", (e) => e.preventDefault());
    win.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C"))
      ) {
        e.preventDefault();
      }
    });

    // Print the content after a delay (onload is unreliable with document.write)
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        console.error("Print failed:", e);
      }
      // Clean up after printing
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  } catch (error) {
    console.error("Error while printing content:", error);
  }
};
