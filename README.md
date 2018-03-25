<h2>Тестовое задание - приложение-игра “Убери кубики”</h2>

<b>Основные моменты по технической реализиации:</b>

1. Всё полностью работает только в браузере;

2. Используемый язык: JavaScript. В некоторых местах использовал jquery, напрмиер для закрытия моадльного окна на bootstrap;

3. Bootstrap использовался для элементов интерфейса и как сетка для игрвого поля и таблицы.


<b>Основные моменты по игровому процессу:</b>

1. На игровом поле в ячейках в слуйчаном порядке генерируются цветные квадраты с периодичностью 0,5 секунды и вероятностью от 0 до 2;

2. Кубики убираются с поля наведением курсора на кубик и последующим кликом левой кнопкой мышки. За клик по кубикам начисляется разное количество балов, оранжевый и желтый по одному, зеленый +2, красный -2;

3. HTML-страница игры содержит кнопки “Старт/Пауза”, “Начать заново” (очищает игровое поле, сбрасывает игру в начальные настройки, но не запускает новую игру, запуск по кнопке старт), а также блок с отображением оставшегося времени, кол-во набранных в текущей игре очков;

4. На игровом поле также генерируются бонусы с периодичностью 5 секунд и вероятность от 0 до 2 за одно событие генерации:
   - бомба - уничтожает все кубики такого же цвета, как и бомба, и за каждый уничтоженный кубик по +1 очко;
   - часы - добавляет +5 секунд к общему времени, но общее время не может быть больше минуты;
   - знак вопроса - бонус-сюрприз с случайной генерацией или -2 или -3 очка или +2 и +3 очка;
   
5. По завершении игры выпадает форма результата для ввода имени игрока с проверкойна заполнено ли поле имени;

6. По результату заполнения формы формируется таблица результатов. Все результаты хранятся в localstorage браузера, при перезагрузке идет проверка на хранящиеся там результаты и автоматическое формирование таблицы. Результаты в таблице фильтруются по количеству очков.

<h2>Результаты тестовых заданий</h2>

<b>HTML - Основы</b>

