// Селекторы
var timerField = document.getElementById('timer');
var pointsField = document.getElementById('points');
var controlButtonsSelector = document.getElementById('controlButtons');
var inputName = document.querySelector('input[name=username]');
var formResultsButton = document.querySelector('button[type="submit"]');
var counterSelector = document.getElementById('counter');
var gameAreaSelector = document.getElementById('game-area');
var tableSelector = document.querySelector('#points-table tbody');
// глобальные переменные
var startTime;
var clockTimer;
var minutes;
var seconds;
var timerPos = true;
var timerForSquareGenerate;
var timerForBonusGenerate;
var scoringCounter = 0;
var pointsValueArray = [];
var rowAmount;
var colAmount;

// создание игрового поля и таблицы результатов при первом запуске
// в зависимости от размеров экрана
function tableBuilder(){
	rowAmount = Math.floor((window.innerHeight-170)/40);
	colAmount = Math.floor(document.querySelector('.col-md-9').offsetWidth/40);
	for (var i = 0; i < rowAmount; i++) {
		var tr = window.document.createElement('tr');
		for (var j = 0; j < colAmount; j++) {
			tr.appendChild(window.document.createElement('td'));	
		}
		gameAreaSelector.appendChild(tr);
	}
	var tableHeight = rowAmount*40+2;
	document.querySelector('.results-table').style.height = tableHeight + "px";
	document.querySelector('.table-scroll').style.height = tableHeight - 110 + "px";
}

// проверка localStorage
function localStorageCheck(){
	if(localStorage.pointsValueArray!=undefined){
		// если в localStorage есть данные, добавить их в массив 
		// для построения таблицы результатов
		pointsValueArray=JSON.parse(localStorage.pointsValueArray);
	}
	else{
		window.onload = function () {
			pointsAbsent();
		}
	}
}

// Основные функции управления игрой
// события запуска, паузы, начала новой игры
controlButtonsSelector.addEventListener("click", function(event){
	if(event.target.tagName==="BUTTON"){
    	if(event.target.id==="start"){
    		if(timerPos){
				startTimer();
				timerPos=false;
				event.target.innerHTML = 'Pause';
				timerForSquareGenerate = setInterval(function() {
		  			squareGenerator();
				}, 500);
				timerForBonusGenerate = setInterval(function() {
		  			bonusGenerator();
				}, 5000);
			}else{
				clearInterval(timerForSquareGenerate);
				clearInterval(timerForBonusGenerate);
				clearTimeout(clockTimer);
				timerPos=true;
				event.target.innerHTML = 'Start';
			}
    	}
    	if(event.target.id==="new"){
    		clearGameSetting();
    	}  
    }	
});
// Запуск таймера
timerField.innerHTML= '01:00';
function startTimer(){
    var presentTime = timerField.innerHTML;
  	var timeArray = presentTime.split(/[:]+/);
  	minutes = timeArray[0];
  	seconds = checkSecond((timeArray[1] - 1));
  	if(seconds==59){
  		minutes=minutes-1;
    	squareGenerator();
  	}
  	timerField.innerHTML =
		minutes + ":" + seconds; 
  	if(seconds>0){
  		clockTimer = setTimeout("startTimer()",1000);
  	}
  	else{
  		endGame();
  	}
}
function checkSecond(sec) {
  	if (sec < 10 && sec >= 0) {sec = "0" + sec}; 
  	if (sec < 0) {sec = "59"};
  	return sec;
}
// событие окончания игры
function endGame(){
	var points = counterSelector.innerHTML;
	pointsField.innerHTML = points;
	$("#resultsModal").modal();
	clearGameSetting();
}
// обновление игрового поля, таймера и счетчика
function clearGameSetting(){
    clearInterval(timerForSquareGenerate);
    clearInterval(timerForBonusGenerate);
	clearTimeout(clockTimer);
	timerField.innerHTML='01:00';
	timerPos=true;
	document.getElementById('start').innerHTML = "Start";
	scoringCounter = 0;
	counterSelector.innerHTML = "0";
	var activeCells = $('#game-area td.active');
	activeCells.find("i").remove();
	activeCells.css("background-color", "white");
	activeCells.removeClass();
}
// создание случайных квадаратов
function squareGenerator(){
	// создание от 0 до 2-х квадартов за одно событие
    var squareAmount = randomInteger(0, 2);
    // создание фигур с случайным цветом и поизицией в сетке
	for (var i = 0; i < squareAmount; i++) {
		var color= getRandomColor();
		var posX = randomInteger(0, colAmount-1);
		var posY = randomInteger(0, rowAmount-1);
		new square(color,posX,posY);
	}
}
// генерация случайной фигуры
function square(color, posX, posY) {
	this.color = color;
	this.posX=posX;
	this.posY=posY;
	var squarePosition = gameAreaSelector.rows[this.posY].cells[this.posX];
	// проверка на заполненные ячейки, если в данной ячейке уже сгенерирован квадрат или бонус,
	// запустить событие генерации еще раз
	if (squarePosition.classList.value!="active") {
		squarePosition.style.backgroundColor = this.color;
		squarePosition.classList.add("active");
	}
	else{
		squareGenerator();
	}
}
// создание случайных бонусов
function bonusGenerator(){
	// создание рандомного количества бонусных событий
	var bonusesAmount = randomInteger(0, 2);
	// создание бонусов с случайной позицией в сетке
	for (var i = 0; i < bonusesAmount; i++) {
		var bonus= getRandomBonus();
		var colorForBomb= getRandomColor();
		var posX = randomInteger(0, colAmount-1);
		var posY = randomInteger(0, rowAmount-1);
		new bonusItem(bonus,colorForBomb,posX,posY);
	}
}
// генерация бонуса
function bonusItem(bonus, colorForBomb, posX, posY){
	this.bonus = bonus;
	this.colorForBomb = colorForBomb;
	this.posX=posX;
	this.posY=posY;
	var bonusPosition = gameAreaSelector.rows[this.posY].cells[this.posX];
	if (bonusPosition.classList.value!="active") {
		var i = document.createElement('i');
		i.classList.add('fa');
		i.classList.add(bonus);
		bonusPosition.appendChild(i);
		bonusPosition.classList.add("active");
	}
	if(bonus=="fa-bomb"){
		bonusPosition.style.color = this.colorForBomb;
	}
}
// генератор случайных чисел
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
// генератор случайного цвета
function getRandomColor() {
	var colors = ['red', 'orange', 'yellow', 'green'];
	var color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}
// генератор случайных бонусов
function getRandomBonus(min, max) {
    var bonuses = ['fa-bomb', 'fa-hourglass-start', 'fa-question-circle-o'];
	var bonus = bonuses[Math.floor(Math.random() * bonuses.length)];
    return bonus;
}

// Игровое поле
// обработчик игрового поля
gameAreaSelector.addEventListener("click",function(event){
	if(event.target.tagName==="TD"&&timerPos==false){
		// если в ячейке есть квадрат (class active), убрать его и добавить соответсвующее 
		// цвету количество очков к счетчику
		if(event.target.classList.value=="active"){
			if(event.target.style.backgroundColor=="red"){
				counter(-2);
			}
			else if(event.target.style.backgroundColor=="green"){
				counter(2);
			}
			else{
				counter(1);
			}
	        event.target.classList.remove("active");
	        event.target.style.backgroundColor = "white";
    	}
    }
    // события кликов по бонусам
    if(event.target.tagName==="I"&&timerPos==false){
    	// бонус вопроса - случайным образом добавляет от 2 до 3 баллов или отнимает
    	if(event.target.classList.value=="fa fa-question-circle-o"){
    		var questionEvent = randomInteger(0, 1);
    		if (questionEvent==0) {
    			var bonusPlus = randomInteger(2, 3);
    			counter(bonusPlus);
    		}
    		else{
    			var bonusMinus = randomInteger(-2, -3);
    			counter(bonusMinus);
    		}   		
    	}
    	// бонус времени - добавляет +5 секунд
    	if(event.target.classList.value=="fa fa-hourglass-start"){
    	    seconds=parseInt(seconds);
    	    if(seconds>54){
    	        seconds=59;
    	    }else{
    	    seconds+=5;
    		}
    	    timerField.innerHTML = minutes + ":" + seconds;
    	}
    	// бонус бомбы - унчитожает квадраты цвета бомбы 
    	// и добавляет по одному очку за каждый квадрат
    	if(event.target.classList.value=="fa fa-bomb"){
    		var targetColor = event.target.parentNode.style.color;
    		var bombCounter = 0;
    		var activeCellsSelector = document.querySelectorAll("#game-area td.active");
    		for (var i = 0; i < activeCellsSelector.length; i++) {
    			if(activeCellsSelector[i].style.backgroundColor==targetColor){
    				activeCellsSelector[i].style.backgroundColor = "white";
    				activeCellsSelector[i].classList.remove("active");
    				bombCounter+=1;
    			}
    		}
    		counter(bombCounter);
    	}
    	event.target.style.display="none";
    	bombCounter = 0;
    }
});
// счетчик результатов при клике по квадратам
function counter(n){
	scoringCounter+=n;
	counterSelector.innerHTML = scoringCounter;
}

// Форма результата
// обработчик события нажатия кнопки подтверждения в форме
formResultsButton.addEventListener('click', function(event){
	event.preventDefault();
	//проверка на введенное в поле инпута количество симоволов
	if(inputName.value.length > 0){
		//создание localStorage для записи результатов, если его не существует
		if(localStorage.pointsValueArray===undefined){
			localStorage.pointsValueArray = JSON.stringify(pointsValueArray); 
		}
		//обновление localStorage
		var pointsObj={};
		pointsObj.name = inputName.value;
		pointsObj.points = pointsField.innerHTML;
		pointsValueArray.push(pointsObj);
		localStorage.pointsValueArray = JSON.stringify(pointsValueArray); 
		//очистка окна ввода
		inputName.value = "";	
		// создание таблицы с обновленными данными
		pointsTableCreation();
		// закрытие формы
		$('#resultsModal').modal('hide');
	}else{
		inputName.classList.add("error");
	}
	// обработка инпута
	inputSelect(inputName);
});
//обработчики фокуса после ошибки в поле инпут
function inputSelect(element){
	element.addEventListener("focus", function() {
		element.classList.remove("error");
	});
}

// Таблица результатов
// создание таблицы
function pointsTableCreation(){
	if (document.querySelector('#points-table tbody td')) {
		$('#points-table tbody > tr').remove();
	}
	// сотритровка по очкам
	pointsValueArray.sort(function(a, b) {return b.points - a.points});
	for(var i=0; i<pointsValueArray.length; i++) {
		tableSelector.appendChild(pointsTableItemCreation(pointsValueArray[i]));
	}
}
// создание строки таблицы
function pointsTableItemCreation(element){		
	var tr = window.document.createElement('tr');
	// создание ячейки и загрузка значения имени из формы
	var td1 = window.document.createElement('td');	    
	td1.innerHTML = element.name;
    // создание ячейки и загрузка результата из формы
	var td2 = window.document.createElement('td');
	td2.innerHTML = element.points;

	tr.appendChild(td1);
	tr.appendChild(td2);

	return tr;
}
// генерация поля отсутсвия результатов в таблице
function pointsAbsent(){
	var tr = window.document.createElement('tr');
	var td = window.document.createElement('td');
	td.innerHTML = "No results";
	tr.appendChild(td);
	tableSelector.appendChild(tr);
}
// очистка результатов
document.getElementById("reset-results").addEventListener('click', function(e){
	localStorage.removeItem('pointsValueArray');
	pointsValueArray = [];
	pointsTableCreation();
	pointsAbsent();
});

// инциализация функций при первом запуске (проверка local storage и 
// генерация таблицы результатов по результатам проверки)
tableBuilder();
localStorageCheck();
pointsTableCreation();