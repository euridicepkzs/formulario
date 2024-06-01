document.addEventListener('DOMContentLoaded', function() {
    displayLibrary();
    displayProgress();
    displayStatistics();

    const statusSelect = document.getElementById('status');
    const datesGroup = document.getElementById('datesGroup');
    statusSelect.addEventListener('change', function() {
        if (statusSelect.value === 'leído') {
            datesGroup.style.display = 'block';
        } else {
            datesGroup.style.display = 'none';
        }
    });

    // Manejar el envío del formulario de biblioteca
    document.getElementById('libraryForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });

    // Manejar el envío del formulario de progreso de lectura
    document.getElementById('readingForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateProgress();
    });
});

function addBook() {
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const pagesTotal = document.getElementById('pagesTotal').value.trim();
    const status = document.getElementById('status').value;

    const newBook = {
        title,
        author,
        pagesTotal,
        status,
        progress: []
    };

    if (status === 'leído') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        newBook.startDate = startDate;
        newBook.endDate = endDate;
    }

    const library = JSON.parse(localStorage.getItem('library')) || [];
    library.push(newBook);
    localStorage.setItem('library', JSON.stringify(library));

    displayLibrary();
    document.getElementById('libraryForm').reset();
}

function updateProgress() {
    const bookSelect = document.getElementById('bookSelect').value;
    const pagesRead = document.getElementById('pagesRead').value.trim();
    const quote = document.getElementById('quote').value.trim();
    const quotePage = document.getElementById('quotePage').value.trim();

    const library = JSON.parse(localStorage.getItem('library')) || [];
    const book = library.find(book => book.title === bookSelect);

    if (book) {
        book.progress.push({
            pagesRead,
            quote,
            quotePage,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('library', JSON.stringify(library));

        displayProgress();
        displayStatistics();
        document.getElementById('readingForm').reset();
    }
}

function displayLibrary() {
    const library = JSON.parse(localStorage.getItem('library')) || [];
    const libraryList = document.getElementById('libraryList');
    const bookSelect = document.getElementById('bookSelect');

    libraryList.innerHTML = '';
    bookSelect.innerHTML = '<option value="">Seleccione un libro</option>';

    library.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <p><strong>Título:</strong> ${book.title}</p>
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Total de Páginas:</strong> ${book.pagesTotal}</p>
            <p><strong>Estado de Lectura:</strong> ${book.status}</p>
        `;

        libraryList.appendChild(bookDiv);
        const option = document.createElement('option');
        option.value = book.title;
        option.textContent = book.title;
        bookSelect.appendChild(option);
    });
}

function displayProgress() {
    const library = JSON.parse(localStorage.getItem('library')) || [];
    const progressList = document.getElementById('progressList');

    progressList.innerHTML = '';

    library.forEach(book => {
        if (book.progress.length > 0) {
            const bookProgressDiv = document.createElement('div');
            bookProgressDiv.classList.add('book-progress');
            bookProgressDiv.innerHTML = `<h3>${book.title}</h3>`;

            book.progress.forEach(entry => {
                const progressDiv = document.createElement('div');
                progressDiv.classList.add('progress-entry');
                progressDiv.innerHTML = `
                    <p><strong>Fecha:</strong> ${entry.date}</p>
                    <p><strong>Páginas Leídas:</strong> ${entry.pagesRead}</p>
                    <p><strong>Frase o Cita:</strong> ${entry.quote}</p>
                    <p><strong>Página de la Cita:</strong> ${entry.quotePage}</p>
                `;
                bookProgressDiv.appendChild(progressDiv);
            });

            progressList.appendChild(bookProgressDiv);
        }
    });
}

function displayStatistics() {
    const library = JSON.parse(localStorage.getItem('library')) || [];
    const statisticsDiv = document.getElementById('statistics');

    let totalBooks = library.length;
    let booksRead = library.filter(book => book.status === 'leído').length;

    statisticsDiv.innerHTML = `
        <p><strong>Total de Libros:</strong> ${totalBooks}</p>
        <p><strong>Libros Leídos:</strong> ${booksRead}</p>
    `;
}