const fs = require('fs');
const path = require('path');

// Функция для извлечения JavaScript-кода из HTML-файла
function extractJSFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Находим все блоки <script>...</script>
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let jsCode = '';
    
    let match;
    while ((match = scriptRegex.exec(content)) !== null) {
        // Проверяем, что это не тег закрытия
        if (match[1]) {
            jsCode += '\n/* START SCRIPT BLOCK */\n' + match[1] + '\n/* END SCRIPT BLOCK */\n';
        }
    }
    
    return jsCode;
}

// Проверяем синтаксис JavaScript с помощью eval (в безопасном режиме)
function checkJSSyntax(jsCode) {
    try {
        // Создаем Function с кодом для проверки синтаксиса без его выполнения
        new Function(jsCode);
        return { valid: true, error: null };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// Основная функция проверки
function checkFiles() {
    const files = [
        'Калькулятор отбора пациентов_v2.2.html',
        'ESC Калькулятор Риска ИБС 2024_vDS2.7.6.html', 
        'eCRF-creator v2.3.html',
        'рандомизатор_pilot_v2.6.html'
    ];
    
    console.log('=== Проверка синтаксиса JavaScript в HTML-файлах ===\n');
    
    files.forEach(fileName => {
        console.log(`Проверка файла: ${fileName}`);
        
        try {
            const jsCode = extractJSFromFile(path.join('/workspace', fileName));
            
            if (!jsCode || jsCode.trim() === '') {
                console.log('  ❌ Не найден JavaScript-код в файле');
                console.log('');
                return;
            }
            
            const result = checkJSSyntax(jsCode);
            
            if (result.valid) {
                console.log('  ✅ Синтаксис JavaScript корректен');
            } else {
                console.log('  ❌ Ошибка синтаксиса JavaScript:');
                console.log(`     ${result.error}`);
            }
        } catch (error) {
            console.log(`  ❌ Ошибка при обработке файла: ${error.message}`);
        }
        
        console.log('');
    });
}

checkFiles();