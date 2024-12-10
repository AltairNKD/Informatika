// Глобальные переменные
let editor;
let shouldStop = false;

// Функции для работы с активной вкладкой
function saveActiveTab(tabId) {
    localStorage.setItem('activeTab', tabId);
}

function getActiveTab() {
    return localStorage.getItem('activeTab') || 'algorithms';
}

// Функция для переключения разделов
function switchTab(tabId) {
    // Скрываем все разделы
    document.querySelectorAll('.topic-content').forEach(topic => {
        topic.classList.add('hidden');
    });
    
    // Показываем нужный раздел
    const selectedTopic = document.getElementById(tabId);
    if (selectedTopic) {
        selectedTopic.classList.remove('hidden');
    }
    
    // Обновляем активный пункт меню
    document.querySelectorAll('.nav-links li').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.topic === tabId) {
            link.classList.add('active');
        }
    });
    
    // Сохраняем выбор
    saveActiveTab(tabId);
}

// Основная инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация навигации
    const navLinks = document.querySelectorAll('.nav-links li');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const topic = link.dataset.topic;
            switchTab(topic);
        });
    });

    // Восстанавливаем последний активный раздел
    const activeTab = getActiveTab();
    switchTab(activeTab);

    // Инициализация всех компонентов
    try {
        // Основные компоненты
        initSortingVisualizer();
        initDataTypeCards();
        initNumberConverter();
        
        // Дополнительные компоненты
        initComputerParts();
        initNetworkSimulator();
        initPasswordChecker();
        initAlgorithmsSection();
        
        // Редактор кода и учебные материалы
        editor = initCodeEditor();
        initLearningMaterials();
        initExercises();
        initProjects();
        initProgrammingSection();
    } catch (error) {
        console.error('Ошибка инициализации:', error);
    }
});

function initCodeEditor() {
    // Проверяем наличие элемента редактора
    const editorElement = document.getElementById('code-editor');
    if (!editorElement) {
        console.error('Элемент редактора н найден');
        return;
    }

    // Начальный код
    const defaultCode = `// Добро пожаловать в редактор кода!
console.log("Hello, World!");`;

    try {
        // Создаем экземпляр CodeMirror
        const editor = CodeMirror(editorElement, {
            value: defaultCode,
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            extraKeys: {
                "Ctrl-Enter": function(cm) {
                    runCode();
                }
            }
        });

        // Функция запуска кода
        window.runCode = function() {
            const code = editor.getValue();
            const output = document.getElementById('console-output');
            
            if (!output) {
                console.error('Элемент вывода не найден');
                return;
            }

            output.innerHTML = ''; // Очищаем предыдущий вывод

            try {
                // Перехватываем console.log
                const oldLog = console.log;
                console.log = function(...args) {
                    output.innerHTML += `<div class="output-success">${args.join(' ')}</div>`;
                    oldLog.apply(console, args);
                };

                // Выполняем код
                eval(code);

                // Восстанавливаем console.log
                console.log = oldLog;
            } catch (error) {
                output.innerHTML += `<div class="output-error">Ошибка: ${error.message}</div>`;
            }
        };

        // Функция очистки консоли
        window.clearConsole = function() {
            const output = document.getElementById('console-output');
            if (output) {
                output.innerHTML = '';
            }
        };

        // Функция очистки редактора
        window.clearEditor = function() {
            editor.setValue('');
        };

        // Функция сохранения кода
        window.saveCode = function() {
            const code = editor.getValue();
            const blob = new Blob([code], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'code.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // Обработчик смены языка
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', function(e) {
                const modes = {
                    javascript: 'javascript',
                    python: 'python',
                    java: 'text/x-java',
                    cpp: 'text/x-c++src'
                };
                editor.setOption('mode', modes[e.target.value]);
            });
        }

        // Обновление позиции курсора
        editor.on('cursorActivity', function() {
            const pos = editor.getCursor();
            const cursorPosition = document.querySelector('.cursor-position');
            if (cursorPosition) {
                cursorPosition.textContent = `Строка: ${pos.line + 1}, Столбец: ${pos.ch + 1}`;
            }
        });

        return editor;
    } catch (error) {
        console.error('Ошибка инициализации редактора:', error);
        return null;
    }
}

function initNumberConverter() {
    const decimalInput = document.getElementById('decimal-input');
    
    if (decimalInput) {
        decimalInput.addEventListener('input', () => {
            const decimal = parseInt(decimalInput.value);
            
            if (!isNaN(decimal)) {
                document.getElementById('binary-result').textContent = 
                    `Результат: ${decimal.toString(2)}`;
                document.getElementById('octal-result').textContent = 
                    `Результат: ${decimal.toString(8)}`;
                document.getElementById('hex-result').textContent = 
                    `Результат: ${decimal.toString(16).toUpperCase()}`;
            } else {
                document.getElementById('binary-result').textContent = 'Результат: ';
                document.getElementById('octal-result').textContent = 'Результат: ';
                document.getElementById('hex-result').textContent = 'Результат: ';
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initNumberConverter();
});

function initAlgorithmsSection() {
    const tabButtons = document.querySelectorAll('.types-tabs .tab-btn');
    const typeContents = document.querySelectorAll('.type-content');

    // Функция для показа выбранного типа алгоритма
    function showAlgorithmType(typeId) {
        // Скрываем все содержимое
        typeContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });

        // Убираем активный класс у всех кнопок
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Показываем выбранное содержимое и активируем кнопку
        const selectedContent = document.getElementById(typeId);
        const selectedButton = document.querySelector(`[data-type="${typeId}"]`);
        
        if (selectedContent) {
            selectedContent.classList.add('active');
            selectedContent.style.display = 'block';
        }
        
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }

    // Добавляем обработчики для кнопок
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const typeId = button.dataset.type;
            showAlgorithmType(typeId);
        });
    });

    // Показываем линейный алгоритм по умолчанию
    showAlgorithmType('linear');
}

// Добавляем вызов функции при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initAlgorithmsSection();
    // ... остальные инициализации
});

function initSortingVisualizer() {
    const container = document.querySelector('.bars-container');
    const sortingType = document.getElementById('sorting-type');
    const stepsCount = document.getElementById('steps-count');
    let array = [];
    let steps = 0;
    let isSorting = false;

    // Добавляем кнопку остановки
    const controlButtons = document.querySelector('.control-buttons');
    const stopButton = document.createElement('button');
    stopButton.className = 'action-btn danger';
    stopButton.innerHTML = '<i class="fas fa-stop"></i> Остановить';
    stopButton.onclick = () => {
        stopSorting();
    };
    controlButtons.appendChild(stopButton);
    stopButton.style.display = 'none';

    function resetBarsColor() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.style.backgroundColor = '#3498db');
    }

    function generateArray() {
        array = Array.from({length: 30}, () => Math.random() * 180 + 20);
        updateBars();
        steps = 0;
        stepsCount.textContent = '0';
    }

    function updateBars() {
        container.innerHTML = '';
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}px`;
            bar.style.backgroundColor = '#3498db';
            container.appendChild(bar);
        });
    }

    async function sleep(ms) {
        if (shouldStop) throw new Error('Sorting stopped');
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    async function swap(i, j, bars) {
        if (shouldStop) return false;

        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        const tempHeight = bars[i].style.height;
        bars[i].style.height = bars[j].style.height;
        bars[j].style.height = tempHeight;

        bars[i].style.backgroundColor = '#e74c3c';
        bars[j].style.backgroundColor = '#e74c3c';
        await sleep(50);
        if (!shouldStop) {
            bars[i].style.backgroundColor = '#3498db';
            bars[j].style.backgroundColor = '#3498db';
        }

        steps++;
        stepsCount.textContent = steps;
        return !shouldStop;
    }

    const sortingAlgorithms = {
        bubble: async () => {
            const bars = document.querySelectorAll('.bar');
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array.length - i - 1; j++) {
                    await swap(j, j + 1, bars);
                }
                bars[array.length - i - 1].style.backgroundColor = '#00b894';
            }
        },
        selection: async () => {
            const bars = document.querySelectorAll('.bar');
            for (let i = 0; i < array.length; i++) {
                let minIdx = i;
                bars[i].style.backgroundColor = '#f1c40f';

                for (let j = i + 1; j < array.length; j++) {
                    bars[j].style.backgroundColor = '#e74c3c';
                    await sleep(50);
                    
                    if (array[j] < array[minIdx]) {
                        if (minIdx !== i) {
                            bars[minIdx].style.backgroundColor = '#3498db';
                        }
                        minIdx = j;
                        bars[minIdx].style.backgroundColor = '#f1c40f';
                    } else {
                        bars[j].style.backgroundColor = '#3498db';
                    }
                }

                if (minIdx !== i) {
                    await swap(i, minIdx, bars);
                }
                bars[i].style.backgroundColor = '#00b894';
            }
        },
        insertion: async () => {
            const bars = document.querySelectorAll('.bar');
            for (let i = 1; i < array.length; i++) {
                let key = array[i];
                let j = i - 1;
                bars[i].style.backgroundColor = '#f1c40f';
                await sleep(50);

                while (j >= 0 && array[j] > key) {
                    bars[j].style.backgroundColor = '#e74c3c';
                    await swap(j + 1, j, bars);
                    j--;
                }

                for (let k = 0; k <= i; k++) {
                    bars[k].style.backgroundColor = '#00b894';
                }
            }
        }
    };

    window.startSorting = async () => {
        if (isSorting) return;
        
        isSorting = true;
        shouldStop = false;
        steps = 0;
        stepsCount.textContent = '0';
        document.getElementById('stopButton').style.display = 'inline-block';
        
        try {
            await sortingAlgorithms[sortingType.value]();
            if (!shouldStop) {
                const bars = document.querySelectorAll('.bar');
                bars.forEach(bar => bar.style.backgroundColor = '#00b894');
            }
        } catch (error) {
            console.error('Error during sorting:', error);
        } finally {
            isSorting = false;
            shouldStop = false;
            document.getElementById('stopButton').style.display = 'none';
        }
    };

    window.generateNewArray = () => {
        if (!isSorting) {
            generateArray();
        }
    };

    generateArray();
}

function stopSorting() {
    shouldStop = true;
    isSorting = false;
    document.getElementById('stopButton').style.display = 'none';
    resetBarsColor();
    generateArray();
}

function initDataTypeCards() {
    // Добавляем интерактивность для карточек типов данных
    const dataTypeCards = document.querySelectorAll('.data-type-block');
    
    dataTypeCards.forEach(card => {
        // Добавляем анимацию при наведении
        card.addEventListener('mouseenter', () => {
            const codeBlock = card.querySelector('.code-block');
            if (codeBlock) {
                codeBlock.style.background = '#1e1e1e';
                codeBlock.style.color = '#d4d4d4';
            }
        });

        card.addEventListener('mouseleave', () => {
            const codeBlock = card.querySelector('.code-block');
            if (codeBlock) {
                codeBlock.style.background = 'var(--background-color)';
                codeBlock.style.color = 'var(--text-color)';
            }
        });

        // Добавляем интерактивные примеры
        const examples = card.querySelectorAll('.type-examples .code-block code');
        examples.forEach(example => {
            example.addEventListener('click', () => {
                // Копируем код в буфер обмена
                navigator.clipboard.writeText(example.textContent)
                    .then(() => {
                        // Показываем уведомление о копировании
                        const notification = document.createElement('div');
                        notification.className = 'copy-notification';
                        notification.textContent = 'Код скопирован!';
                        example.appendChild(notification);
                        
                        // Удаляем уведомление через 2 секунды
                        setTimeout(() => {
                            notification.remove();
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Ошибка при копировании:', err);
                    });
            });
        });

        // Добавляем подсветку синтаксиса для примеров кода
        const codeBlocks = card.querySelectorAll('.code-block code');
        codeBlocks.forEach(block => {
            block.innerHTML = block.innerHTML.replace(
                /(\/\/.*)|(".*")|('.*')|(boolean|int|long|float|double|String|class|new)/g,
                match => {
                    if (match.startsWith('//')) return `<span class="comment">${match}</span>`;
                    if (match.startsWith('"') || match.startsWith("'")) return `<span class="string">${match}</span>`;
                    return `<span class="keyword">${match}</span>`;
                }
            );
        });
    });
}

function initDataTypesSection() {
    const typeCards = document.querySelectorAll('.type-card');
    
    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Получаем тип данных из заголовка карточки
            const typeName = card.querySelector('h2').textContent;
            
            // Показываем модальное окно с подробной информацией
            showTypeDetails(typeName);
        });
    });
}

function showTypeDetails(typeName) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'type-modal';
    
    // Определяем содержимое в зависимости от типа
    const content = getTypeContent(typeName);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${typeName}</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="try-it-section">
                <h3>Попробуйте сами:</h3>
                <div class="code-playground">
                    <textarea class="code-input" placeholder="Введите код здесь..."></textarea>
                    <button class="run-btn">Запустить</button>
                    <div class="code-output"></div>
                </div>
            </div>
        </div>
    `;

    // Добавляем модальное окно на страницу
    document.body.appendChild(modal);

    // Обработчик закрытия
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = () => {
        modal.remove();
    };

    // Закрытие по клику вне модального окна
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };

    // Инициализация playground
    initCodePlayground(modal, typeName);
}

function getTypeContent(typeName) {
    const contents = {
        'Числа': `
            <div class="type-details">
                <h3>Целые числа (Integer)</h3>
                <div class="code-example">
                    <code>int number = 42;
int negative = -17;
int big = 1000000;</code>
                </div>
                <p>Используются для: счетчиков, индексов, количества элементов</p>
                
                <h3>Дробные числа (Float/Double)</h3>
                <div class="code-example">
                    <code>double pi = 3.14159;
float price = 19.99f;
double scientific = 2.5e-10;</code>
                </div>
                <p>Используются для: научных расчетов, финансовых операций</p>
                
                <div class="warning-note">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>При работе с деньгами используйте специальные типы (например, BigDecimal)</p>
                </div>
            </div>
        `,
        'Текст': `
            <div class="type-details">
                <h3>Строки (String)</h3>
                <div class="code-example">
                    <code>String name = "John";
String message = "Hello, " + name + "!";
String multiline = """
                   Многострочный
                   текст
                   """;</code>
                </div>
                
                <h3>Основные методы</h3>
                <ul class="methods-list">
                    <li><code>length()</code> - длина строки</li>
                    <li><code>toUpperCase()</code> - перевод в верхний регистр</li>
                    <li><code>toLowerCase()</code> - перевод в нижний регистр</li>
                    <li><code>substring(start, end)</code> - получение подстроки</li>
                </ul>
            </div>
        `,
        'Логический тип': `
            <div class="type-details">
                <h3>Boolean</h3>
                <div class="code-example">
                    <code>boolean isActive = true;
boolean isValid = false;
boolean isGreater = 5 > 3;  // true
boolean isEqual = 5 == 5;   // true</code>
                </div>
                
                <h3>Логические операции</h3>
                <table class="truth-table">
                    <tr>
                        <th>A</th><th>B</th><th>A && B</th><th>A || B</th><th>!A</th>
                    </tr>
                    <tr>
                        <td>true</td><td>true</td><td>true</td><td>true</td><td>false</td>
                    </tr>
                    <tr>
                        <td>true</td><td>false</td><td>false</td><td>true</td><td>false</td>
                    </tr>
                    <tr>
                        <td>false</td><td>false</td><td>false</td><td>false</td><td>true</td>
                    </tr>
                </table>
            </div>
        `,
        'Специальные типы': `
            <div class="type-details">
                <h3>Массивы (Arrays)</h3>
                <div class="code-example">
                    <code>int[] numbers = {1, 2, 3, 4, 5};
String[] names = {"John", "Jane", "Bob"};
int[] empty = new int[5];  // [0, 0, 0, 0, 0]</code>
                </div>
                
                <h3>Объекты (Objects)</h3>
                <div class="code-example">
                    <code>class Person {
    String name;
    int age;
    boolean isStudent;
}

Person person = new Person();
person.name = "John";
person.age = 25;</code>
                </div>
            </div>
        `
    };
    
    return contents[typeName] || '<p>Информация не найдена</p>';
}

// Добавляем в основную инициализацию
document.addEventListener('DOMContentLoaded', () => {
    initDataTypesSection();
    // ... остальные инициализации
});

// Остальной код остается без изменений... 