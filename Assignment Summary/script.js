document.addEventListener('DOMContentLoaded', function() {
    const pdfFileInput = document.getElementById('pdf-file');
    const processBtn = document.getElementById('process-btn');
    const summarySection = document.getElementById('summary-section');
    const deadlinesList = document.getElementById('deadlines-list');
    const tasksList = document.getElementById('tasks-list');
    const detailsList = document.getElementById('details-list');

    processBtn.addEventListener('click', processPDF);

    async function processPDF() {
        const file = pdfFileInput.files[0];
        if (!file) {
            alert('Please select a PDF file first.');
            return;
        }

        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';

        try {
            const text = await extractTextFromPDF(file);
            const summary = summarizeAssignment(text);

            displaySummary(summary);
            summarySection.style.display = 'block';
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Error processing PDF. Please try again.');
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = 'Process Assignment';
        }
    }

    async function extractTextFromPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => item.str).join(' ') + '\n';
        }

        return text;
    }

    function summarizeAssignment(text) {
        const summary = {
            deadlines: [],
            tasks: [],
            details: []
        };

        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        lines.forEach(line => {
            const lowerLine = line.toLowerCase();

            // Look for deadlines
            if (lowerLine.includes('due') || lowerLine.includes('deadline') || lowerLine.includes('submit')) {
                summary.deadlines.push(line);
            }

            // Look for tasks
            if (lowerLine.includes('task') || lowerLine.includes('complete') || lowerLine.includes('do') ||
                lowerLine.includes('write') || lowerLine.includes('create') || lowerLine.includes('implement')) {
                summary.tasks.push(line);
            }

            // Look for other key details
            if (lowerLine.includes('marks') || lowerLine.includes('grade') || lowerLine.includes('weight') ||
                lowerLine.includes('percentage') || lowerLine.includes('requirements') ||
                lowerLine.includes('format') || lowerLine.includes('length')) {
                summary.details.push(line);
            }
        });

        // If no specific categories found, add some general summary
        if (summary.deadlines.length === 0 && summary.tasks.length === 0 && summary.details.length === 0) {
            summary.details.push('Please review the full assignment document for all requirements.');
        }

        return summary;
    }

    function displaySummary(summary) {
        deadlinesList.innerHTML = '';
        tasksList.innerHTML = '';
        detailsList.innerHTML = '';

        summary.deadlines.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            deadlinesList.appendChild(li);
        });

        summary.tasks.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            tasksList.appendChild(li);
        });

        summary.details.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            detailsList.appendChild(li);
        });

        // Add default messages if lists are empty
        if (summary.deadlines.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No specific deadlines found in the document.';
            deadlinesList.appendChild(li);
        }

        if (summary.tasks.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No specific tasks listed. Please check the full document.';
            tasksList.appendChild(li);
        }

        if (summary.details.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Please review the full assignment document for detailed requirements.';
            detailsList.appendChild(li);
        }
    }
});