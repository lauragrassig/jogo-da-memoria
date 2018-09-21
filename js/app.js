// VARIAVEIS
	let card = document.getElementsByClassName("card");
	let cards = [...card];
	let openedCards = [];
	let matchedCard = document.getElementsByClassName("match");
	let moves = 0;

// GANHANDO
	const popup = document.getElementById("parabens");


	let refreshHTML = function(target, value) 
	{
		return target.innerHTML = value;
	};

	let CounterSet = function(moves) 
	{
		this.target = document.querySelector(".counter");
		refreshHTML(this.target, moves);
	};

	//COUNTERSET POR CAUSA DO CONTADOR
	CounterSet.prototype.add = function() 
	{
		moves++; 
		refreshHTML(this.target, moves); //ADIÇÃO DE MOVIMENTOS
	};

	CounterSet.prototype.restart = function() 
	{
		moves = 0;
		refreshHTML(this.target, moves); //ATUALIZAR
	};

	let counter = new CounterSet(moves); //QUANTIDADE DE MOVIMENTOS

// QUANDO GANHA
	function parabens() {
		if(matchedCard.length == 16) 
		{
			clearInterval(interval);
			popup.classList.add("show");
			document.getElementById("total-moves").innerHTML = moves; //MOVIMENTOS
			document.getElementById("total-time").innerHTML = timer.innerHTML;
			document.getElementById("scoreEstrela").innerHTML = document.querySelector(".stars").innerHTML;
			closePopup();
		};
	}

// ESTRELAS

	let scoreEstrela = function() 
	{
		this.estrelas = document.querySelectorAll(".fa-star");
	};

	scoreEstrela.prototype.rate = function() 
	{
		if(moves > 15 && moves < 23) 
		{
			this.estrelas[2].classList.remove("brilho"); //3 ESTRELAS ATÉ 15, 2 ESTRELAS ATÉ 23, 1 ESTRELA QUANDO MAIS
		} else if(moves > 23) 
		{
			this.estrelas[1].classList.remove("brilho"); // CHAMAR NO CSS O BRILHO
		}
	};

	scoreEstrela.prototype.restart = function() 
	{
		for(var i=0; i<this.estrelas.length; i++) 
		{
			this.estrelas[i].classList.add("brilho");
		}
	};

	let estrelas = new scoreEstrela();


// TIMER - BASE COM AJUDA DO VIDEO 
	const timer = document.querySelector(".timer"); //TIMER CONVERTENDO ENTRE MINUTOS E SEGUNDOS 

	let second = 
	{
		value: 0,
		label: " segs"
	};

	let minute = 
	{
		value: 0,
		label: " mins "
	};


	let interval;

	window.onload = comecaJogo();

// SEGUNDOS: 60s  MINUTOS:60 
	function comecaTimer() 
	{
		if(moves == 1) { //COMEÇAR O TIMER A PARTIR DO PRIMEIRO MOVIMENTO
			interval = setInterval(function() 
			{
				second.value++; //CONTAGEM DO SEGUNDOS// 
				if(second.value == 60) 
				{
					minute.value++;
					second.value = 0;
				}
				refreshTimer();
			}, 1000);
		}
	}


	for(var i = 0; i < cards.length; i++) 
	{  // A CADA CARD PRECISA FAZER A CONTAGEM PRA SOMAR OS MOVIMENTOS DPS
		cards[i].addEventListener("click", displayCard);
		cards[i].addEventListener("click", cardAberto);
		cards[i].addEventListener("click", parabens);
	}

//RESETAR O TIMER  
	function resetaTimer() 
	{ 
		second.value = 0;
		minute.value = 0;
		refreshTimer();
	}

// RESETAR
	document.querySelector(".restart").addEventListener("click", comecaJogo);

// SHUFFLE (ANOTADO PÁGINA 50)
	function shuffle(array) 
	{
		var currentIndex = array.length, temporaryValue, randomIndex;
			while (currentIndex !== 0) 
				{
					randomIndex = Math.floor(Math.random() * currentIndex); //PARA FAZER O RANDOM 
					currentIndex -= 1;
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}
		return array;
	}

	function comecaJogo() 
	{
		cards = shuffle(cards);
		for(var i=0; i<cards.length; i++) 
		{
			document.querySelector(".deck").innerHTML = "";
			[].forEach.call(cards, function(item) 
			{ //CHAMAR A FUNÇÃO
				document.querySelector(".deck").appendChild(item);
			});
			cards[i].classList.remove("show", "open", "match", "disabled");
		}
		counter.restart();
		estrelas.restart();
		resetaTimer();
	}


	function displayCard() 
	{
		this.classList.toggle("open");
		this.classList.toggle("show");
		this.classList.toggle("disabled");
	}

//CASO ACERTO 
	function matched() 
	{
		for(var i=0; i<openedCards.length; i++) 
		{
			openedCards[i].classList.add("match", "disabled"); 
			openedCards[i].classList.remove("show", "open", "no-event");
		}
		openedCards = [];
	}

//CASO CARD ERRADO
// COM BASE NO VIDEO DE EXPLICAÇÃO UNMATCHED
	function unmatched() {
		for(var i=0; i<openedCards.length; i++) 
		{
			openedCards[i].classList.add("unmatched");
		}
		disable();
		setTimeout(function() 
		{
			for(var i=0; i<openedCards.length; i++) 
			{
				openedCards[i].classList.remove("show", "open", "no-event", "unmatched");
			}
			enable();
			openedCards = [];
		}, 1100);
	}

	function cardAberto() 
	{
		openedCards.push(this);
		if(openedCards.length === 2) 
		{
			counter.add();
			estrelas.rate();
			comecaTimer();
			if(openedCards[0].type === openedCards[1].type) 
			{
				matched(); //CASO CERTO
			} else {
				unmatched(); //CASO ERRADO
			}
		}
	}



	function disable() 
	{
		for(var i = 0; i < cards.length; i++) 
		{
			cards[i].classList.add("disabled");
		}
	}


	function enable() {
		for(var i = 0; i < cards.length; i++) 
		{
			if(!cards[i].classList.contains("match")) 
			{
				cards[i].classList.remove("disabled");
			};
		}
	}

	function refreshTimer() {
		timer.innerHTML = minute.value + minute.label + second.value + second.label; //RESETAR O TIMER
	}



//POPUP 
	function closePopup() 
	{ //HTML
		document.getElementById("bt-jogar-dnv").addEventListener("click", function() 
		{
			popup.classList.remove("show"); 
			comecaJogo();
		});
	}


