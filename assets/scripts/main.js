// seeds = {
// p:null, //Period
// m:0, //m
// c:null, //c
// a:null,//a
// xi:null //Seed
// }

//Default Values
seeds = {
p:null, //Period
m:67108864, //m
c:13, //c
a:17,//a
xi:777 //Seed
}

$(function(){
	$("#generator").click(function(ev){
		ev.preventDefault();
		if (getValues()) { //Pasa validaciones
			// $(".results #msg").html("Numeros validados satisfactoriamente");
			
			//Obtiene los aleatorios
			fillRandom();
		}
	});
	animations();
});

getValues = function(){
	//Obtiene valores
	seeds.p = parseInt($("#period").val());
	seeds.c = parseInt($("#c").val());
	seeds.a = parseInt($("#a").val());
	seeds.xi = $("#seed").val().length != 0? $("#seed").val() : parseInt(Math.random()*100);

	//VALIDACIONES
	//Valida si los valores son numeros
	if (isNaN(seeds.p) || isNaN(seeds.c) || isNaN(seeds.a)) {$(".results #msg").html("Llene los campos con valores numericos");return false;}

	//Valida si "a" es de la forma 4k + 1
	if (seeds.a % 4 != 1) {$(".results #msg").html("El valor de a debe ser de la forma:  1 + 4k"); return false;}

	//Valida si "c" es PESI con "a"
	if (!arePESI(seeds.a, seeds.c)) {{$(".results #msg").html("Los valores de a y c deben ser PESI"); return false;}};

	//Asigna "m"
	seeds.m = calcM();

	//Valida si "c" es PESI con "m"
	if (!arePESI(seeds.m, seeds.c)) {{$(".results #msg").html("Los valores de a y c deben ser PESI"); return false;}};

	return true;
}

arePESI = function(a, b){
	//Declaracion de variables
	arr_a = [];
	arr_b = [];
	c = 0;

	//Obtiene divisores en a
	for (var i = 1 ; i <= a; i++) if (a/i == parseInt(a/i)) arr_a.push(i);
	//Obtiene divisores en b
	for (var i = 1 ; i <= b; i++) if (b/i == parseInt(b/i)) arr_b.push(i);

	for (var i = arr_a.length - 1; i >= 0; i--)
		if (arr_b.indexOf(arr_a[i])!= -1 ) c++;

	for (var i = arr_b.length - 1; i >= 0; i--)
		if (arr_a.indexOf(arr_b[i])!= -1 ) c++;

	return (c/2==1 && a!= 1 && b!= 1)? true:false;
}

//Obtiene el numero superior mas cercano a "p" en base 2
calcM = function(){
	return Math.pow(2,Math.ceil(Math.log(seeds.p)/Math.log(2)));
}

fillRandom = function(){
	st = "";
	for (var i = 0; seeds.m > i; i++) st += i+1 + " - " + getRandom()+ "<br>";
	$(".results #msg").html(st);
}

//Animaciones y logica UI
animations = function(){
	$(".panel-heading").click(function(){
		if($(this).next(".panel-body").is(":visible"))
			$(this).next(".panel-body:visible").slideUp("fast");
			else{
				$(".panel-body:visible").slideUp("fast");
				$(this).next(".panel-body").slideToggle("fast");
			}
	});
}

//Distribuciones para las GNA
calcExponential = function(x){ return -x*Math.log(1-getRandom());}

calcUniforme = function(a,b){ return a+getRandom()*(b-a);}

calcNormal = function(x,s){
	c = 0;
	for (var i = 0; i < 12; i++) c+= getRandom();
	return x +s*(c-6);
}

//DEFINIR
/*
	- Cantidad de arribos
	- Definir el numero de evento en que acabara o el minuto
	- Distribucion de arribos y servicio
	- Adaptar el algoritmo a 2 servidores y 1 cola
*/