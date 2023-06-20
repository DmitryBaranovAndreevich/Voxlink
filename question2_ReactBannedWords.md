# React banned words component

## Дано:
- Есть массив строк введённых пользователем: [ 'example', 'test321', '123test 321examples 123test' ].
- Этот массив строк выводиться в виде списка в некотором react-компоненте.
- Есть "запрещённые" слова: ['123', '321'].

## Задача

Нужно написать автоматическую обработку строк, которая будет находить заданеные слова и оборачивать их в React-компонент `BannedWordComponent`.

Для решения задачи не нужно делать реальное React-приложение, достаточно будет использовать шаблонную строку: `<BannedWordComponent>${bannedWord}</BannedWordComponent>`.

## Проверка

Написать функцию `validateText` в файле `question2_ReactBannedWords`:

```
// file="question2_ReactBannedWords.js"
const bannedWords = [ '123', '321' ];

function validateText() {
	// code here
}

module.exports = {
	validateText,
};

```

Запустить `node ./question2_ReactBannedWords_tests.jsx` для проверки, что все тесты проходят.
